// 出庫單
// 出庫單
// 出庫單

// setMyDeleveryList

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import OrderTable, {
  Tcontrol_orderTable,
  Tgroup,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import style from './contract.module.scss';

// api
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  // TupdateEngineeringDeliveryList,
  // TupdateDeliveryStatus,
  TupdateEngineeringDeliveryStatusDto,
  useGetEngineeringContact,
  useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
  TcreateEngineeringDeliveryStatusDto,
  apiPostDeliveryStatus,
  apiPatchDeliveryStatus,
  apiDeleteDeliveryStatus,
} from 'js/api/api_engineering';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// type
// import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TerpFeatureDto, TquotationProductItemDto, TdeliveryStatusDto, TemployeeDto } from 'js/api/dtoTypes';

// =====================================================================

type Tdelevery = {
  originalItem: TquotationProductItemDto;
  itemName: string;
  itemArr: TquotationProductItemDto[];
};

type TmyDeleveryList = {
  [key: string]: Tdelevery;
};

type TdeliveryStatusInEdit = {
  [key: string /*prodKey */]: {
    [key: string /*itemId */]: {
      [key: string /*statusId */]: TcreateEngineeringDeliveryStatusDto & {
        id?: string;
        installerEmployee?: TemployeeDto | null;
      };
    };
  };
};

// =====================================================================
export default function OutboundOrder({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  const havePermissionToEdit = useMemo(() => {
    if (isAdmin) {
      return true;
    }

    const isHave = userErpFeature?.some((item) => {
      return item.name === '工務部-工作表編輯';
    });

    return !!isHave;
  }, [userErpFeature]);

  // --------------------------------------------------------------------------

  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  // const [disabled, setDisabled] = useState(true);
  const [isReqing, setIsReqing] = useState(false);

  // --------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  // const engineeringContactId = contract?.engineeringContactId;
  const { engineeringContactId, engineeringDeliveryListId } = contract ?? {};
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { deliveryList, update_deliveryList } = useGetEngineeringDeliveryList(engineeringDeliveryListId);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_engineeringContact();
        await update_deliveryList();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const contractProdList = useMemo(() => {
    if (!contract) {
      return undefined;
    }

    let subContracts = contract.subContracts;

    subContracts = _.sortBy(subContracts, 'version');

    const list: { [key: string]: TquotationProductDto } = {};

    subContracts.forEach((contract) => {
      const prodArr = contract.content.products;
      prodArr.forEach((prod) => {
        list[prod.rootProductId] = prod;
      });
    });

    Object.keys(list).forEach((key) => {
      const item = list[key];

      if (key !== item.id) {
        list[item.id] = item;
        delete list[key];
      }
    });

    return list;
  }, [contract]);

  // console.log(contractProdList);

  // --------------------------------------------------------------------------

  const [notes, setNotes] = useState<string>();
  const [notesDiasbled, setNotesDiasbled] = useState(true);

  useEffect(() => {
    setNotes(deliveryList?.notes);
  }, [deliveryList, notesDiasbled]);

  // --------------------------------------------------------------------------

  const [deleveryStatusInEdit, setDeleveryStatusInEdit] = useState<TdeliveryStatusInEdit>();

  // --------------------------------------------------------------------------

  const worksheet = deliveryList?.contract.worksheet;

  const [myDeleveryList, setMyDeleveryList] = useState<TmyDeleveryList>();

  useEffect(() => {
    if (!deliveryList?.contract.worksheet?.contractProductItems) {
      return;
    }

    const contractProductItems = deliveryList.contract.worksheet.contractProductItems;

    const myDeleveryList: TmyDeleveryList = {};

    contractProductItems.forEach((item) => {
      const { productId, adjustedItem, adjustedItemId } = item;

      let theItem: typeof item;
      // 現在只以productId分類，theId用不到了
      // let theId: string;

      if (adjustedItem && adjustedItemId) {
        theItem = adjustedItem;
        // theId = adjustedItemId;
      } else {
        theItem = item;
        // theId = productId;
      }

      theItem.deliveryStatus = item.deliveryStatus;

      if (!myDeleveryList?.[productId]) {
        myDeleveryList[productId] = {
          originalItem: item,
          itemName: theItem.itemName,
          itemArr: [],
        };
      }

      myDeleveryList[productId].itemArr.push(theItem);
    });

    setMyDeleveryList(myDeleveryList);
  }, [deliveryList]);

  // console.log(myDeleveryList);

  // --------------------------------------------------------------------------

  const reqPost = async (productItemId: string) => {
    if (!engineeringDeliveryListId || isReqing) {
      return undefined;
    }

    try {
      const res = await apiPostDeliveryStatus({
        id: engineeringDeliveryListId,
        body: {
          notes: null,
          itemName: null,
          shippingDate: null,
          installerEmployeeId: null,
          installationDate: null,
          append: null,
          completeAppend: null,
          productItemId,
        },
      });

      if (res) {
        return res;
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增失敗', content: err.message });

      return undefined;
    }

    //
  };

  const reqPatch = async ({ statusId, body }: { statusId: string; body: TupdateEngineeringDeliveryStatusDto }) => {
    if (!engineeringDeliveryListId || isReqing) {
      return;
    }

    try {
      const res = await apiPatchDeliveryStatus({
        id: engineeringDeliveryListId,
        statusId,
        body,
      });

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新失敗', content: err.message });
    }
  };

  const reqDelete = async (statusId: string) => {
    if (!engineeringDeliveryListId || isReqing) {
      return;
    }

    try {
      const res = await apiDeleteDeliveryStatus({
        id: engineeringDeliveryListId,
        statusId,
      });

      return true;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '刪除失敗', content: err.message });
    }
  };

  // --------------------------------------------------------------------------

  const control_orderTable: Tcontrol_orderTable =
    Object.keys(myDeleveryList ?? {}).map((prodKey, index, arr) => {
      const arrLength = arr.length;

      const prod = myDeleveryList![prodKey];

      const theOriginalContractContent = contractProdList![prodKey];

      // 取哪一個item都無所謂，如果程式沒有寫錯，每個item都是一樣的
      const firstItem = prod.itemArr[0];

      const firstRow: Tgroup['rowArr'][0] = {
        contractData: {
          project: prod.itemName,
          L: new Decimal(theOriginalContractContent.fullWidth).div(1000).toString(),
          W: new Decimal(theOriginalContractContent.WG).div(1000).toString(),
          B: new Decimal(theOriginalContractContent.boxB).div(1000).toString(),
          qty: String(prod.itemArr.length),
          implementQty: '',
          cai: theOriginalContractContent.volume ?? '',
          totalCai: new Decimal(theOriginalContractContent.volume).mul(arrLength).toString(),
          doorType: theOriginalContractContent.doorModelName,
          material: theOriginalContractContent.materialName,
          horsepower: theOriginalContractContent.horsepower,
          surface: theOriginalContractContent.materialSurface ?? '',
        },
        staticData: {
          project: prod.itemName,
          L: new Decimal(firstItem.fullWidth).div(1000).toString(),
          W: new Decimal(firstItem.WG).div(1000).toString(),
          B: new Decimal(firstItem.boxB).div(1000).toString(),
          qty: String(prod.itemArr.length),
          implementQty: '',
          // cai: firstItem.volume,
          cai: '',
          totalCai: '0',
          doorType: firstItem.doorModelName,
          material: firstItem.materialName,
          horsepower: firstItem.horsepower,
          surface: firstItem.materialSurface ?? '',
        },
        staticData2: {
          remark01: {
            value: '',
            hidden: true,
          },
          orderCreatedDate: {
            value: '',
            hidden: true,
          },
        },
        deliveryStatus: {
          groupList: {
            btnPanelArr: [],
            installDateArr: [],
            installerArr: [],
            itemNameArr: [],
            notesArr: [],
          },
        },
      };

      let totalCai_total = new Decimal(0);

      const rowArr: Tgroup['rowArr'] = prod.itemArr.map((item, itemIndex) => {
        const itemId = item.id;

        totalCai_total = totalCai_total.add(item.volume || '0');

        const accessories = item.accessories;
        const acceNameArr =
          accessories?.map((acce) => {
            return acce.name;
          }) ?? [];

        const btnPanelArr: Tgroup['rowArr'][number]['deliveryStatus']['groupList']['btnPanelArr'] = [];
        const installDateArr: Tgroup['rowArr'][number]['deliveryStatus']['groupList']['installDateArr'] = [];
        const installerArr: Tgroup['rowArr'][number]['deliveryStatus']['groupList']['installerArr'] = [];
        const itemNameArr: Tgroup['rowArr'][number]['deliveryStatus']['groupList']['itemNameArr'] = [];
        const notesArr: Tgroup['rowArr'][number]['deliveryStatus']['groupList']['notesArr'] = [];

        const deliveryStatusArr = item.deliveryStatus;

        deliveryStatusArr?.forEach((status, statusIndex) => {
          const statusId = status.id;
          const deleveryStatus = deleveryStatusInEdit?.[prodKey]?.[itemId]?.[statusId];
          const disabled = !deleveryStatus;

          const edit = ({
            //
            key,
            value,
            employee,
          }: {
            key: keyof TdeliveryStatusInEdit[string][string][string];
            value?: string;
            employee?: TemployeeDto | null;
          }) => {
            if (!deleveryStatus || !havePermissionToEdit) {
              return;
            }

            setDeleveryStatusInEdit((state) => {
              if (!state) {
                return state;
              }

              const copy = { ...state };

              if (key === 'installerEmployee') {
                copy[prodKey][itemId][statusId]['installerEmployee'] = employee;
              } else {
                copy[prodKey][itemId][statusId][key] = value ?? '';
              }

              return copy;
              //
            });
          };

          //
          btnPanelArr.push({
            disabled,
            forbidden: !havePermissionToEdit,
            onEditClick: () => {
              if (!havePermissionToEdit) {
                return;
              }

              setDeleveryStatusInEdit({
                [prodKey]: {
                  [itemId]: {
                    [statusId]: _.cloneDeep(status),
                  },
                },
              });
            },
            onCancelClick: () => {
              if (!havePermissionToEdit) {
                return;
              }

              setDeleveryStatusInEdit(undefined);
            },
            onDeleteClick: async () => {
              if (!havePermissionToEdit) {
                return;
              }

              const res = await reqDelete(statusId);

              if (res) {
                setMyDeleveryList((state) => {
                  const copy = { ...state };
                  const theIndex = copy[prodKey].itemArr[itemIndex].deliveryStatus?.findIndex((item) => {
                    return item.id === statusId;
                  });

                  if (theIndex !== undefined && theIndex > -1) {
                    copy[prodKey].itemArr[itemIndex].deliveryStatus?.splice(theIndex, 1);
                  }

                  return copy;
                });
              }
            },
            onAddClick: async () => {
              if (!havePermissionToEdit) {
                return;
              }

              const res = await reqPost(itemId);

              if (res) {
                setMyDeleveryList((state) => {
                  const copy = { ...state };
                  copy[prodKey].itemArr[itemIndex].deliveryStatus?.push(res);

                  return copy;
                });
              }
            },
            onConfirmClick: async () => {
              if (!deleveryStatus || !havePermissionToEdit) {
                return;
              }

              const body = {
                ...deleveryStatus,
                installerEmployeeId: deleveryStatus.installerEmployee?.id ?? null,
              };

              const res = await reqPatch({
                statusId,
                body,
              });

              if (res) {
                setDeleveryStatusInEdit(undefined);

                setMyDeleveryList((state) => {
                  const copy = { ...state };

                  const theIndex = copy[prodKey].itemArr[itemIndex].deliveryStatus?.findIndex((item) => {
                    return item.id === statusId;
                  });

                  if (theIndex !== undefined && theIndex > -1) {
                    if (copy[prodKey].itemArr[itemIndex].deliveryStatus) {
                      copy[prodKey].itemArr[itemIndex].deliveryStatus![theIndex] = res;
                    }
                  }

                  return copy;
                });
              }
            },
          });

          installDateArr.push({
            disabled,
            value: deleveryStatus?.installationDate ?? status.installationDate ?? '',
            onChange_date: (v) => {
              if (!deleveryStatus || !havePermissionToEdit) {
                return;
              }

              edit({
                key: 'installationDate',
                value: v ?? '',
              });
            },
          });

          installerArr.push({
            disabled,
            empolyee: deleveryStatus?.installerEmployee ?? (status.installerEmployee || null),
            onChange_employee: (employee) => {
              if (!deleveryStatus || !havePermissionToEdit) {
                return;
              }

              edit({
                key: 'installerEmployee',
                employee,
              });
            },
          });

          itemNameArr.push({
            disabled,
            value: deleveryStatus?.itemName ?? status.itemName ?? '',
            onChange: (v) => {
              if (!deleveryStatus || !havePermissionToEdit) {
                return;
              }

              edit({
                key: 'itemName',
                value: v ?? '',
              });
            },
          });

          notesArr.push({
            disabled,
            value: deleveryStatus?.notes ?? status.notes ?? '',
            onChange: (v) => {
              if (!deleveryStatus || !havePermissionToEdit) {
                return;
              }

              edit({
                key: 'notes',
                value: v ?? '',
              });
            },
          });
          //
        });

        if (btnPanelArr.length === 0) {
          btnPanelArr.push({
            disabled: true,
            forbidden: !havePermissionToEdit,
            onConfirmClick: () => {},
            onCancelClick: () => {},
            onAddClick: async () => {
              if (!havePermissionToEdit) {
                return;
              }

              const res = await reqPost(itemId);

              if (res) {
                setMyDeleveryList((state) => {
                  const copy = { ...state };
                  copy[prodKey].itemArr[itemIndex].deliveryStatus?.push(res);

                  return copy;
                });
              }
            },
          });
        }

        return {
          contractData: {
            // 這裡的東西不需要顯示，所以空字串就好了
            project: '',
            // project: prod.itemName,
            L: '',
            W: '',
            B: '',
            qty: '',
            implementQty: '',
            cai: '',
            totalCai: '',
            doorType: '',
            material: '',
            horsepower: '',
            surface: '',
          },
          staticData: {
            // 現在orderTable的orderKeyArr_static沒有project，所以不會顯示這個欄位
            // 但應該是顯示了會比較清楚
            project: item.itemName,
            L: new Decimal(item.fullWidth).div(1000).toString(),
            W: new Decimal(item.WG).div(1000).toString(),
            B: new Decimal(item.boxB).div(1000).toString(),
            qty: '1',
            implementQty: '???',
            cai: item.volume,
            totalCai: '',
            doorType: item.doorModelName,
            material: item.materialName,
            horsepower: item.horsepower,
            surface: item.materialSurface ?? '',
          },
          staticData2: {
            remark01: {
              value: acceNameArr.join('\n'),
              forbidden: true,
            },
            orderCreatedDate: {
              value: worksheet ? moment(convertDate_reduce1911(worksheet.createdAt)).format('yy-MM-DD') : '',
              forbidden: true,
            },
          },
          deliveryStatus: {
            groupList: {
              btnPanelArr,
              installDateArr,
              installerArr,
              itemNameArr,
              notesArr,
            },
          },
        };
      });

      firstRow.staticData.totalCai = totalCai_total.toString();
      rowArr.unshift(firstRow);

      return {
        itemName: prod.itemName,
        rowArr,
      };
    }) ?? [];

  // --------------------------------------------------------------------------

  const reqPatchNotes = async () => {
    if (!engineeringDeliveryListId || !havePermissionToEdit) {
      return;
    }

    try {
      setIsLoading(true);
      await apiPatchEngineeringDeliveryList(engineeringDeliveryListId, { notes: notes ?? '' });
      await update_deliveryList();
      setNotesDiasbled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新備註失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------

  // const panelList01: TpanelList = [
  //   {
  //     type: 'myButton',
  //     label: '編輯',
  //     onClick: () => {
  //       setDisabled(false);
  //     },
  //   },
  // ];
  // const panelList02: TpanelList = [
  //   {
  //     type: 'redButton',
  //     label: '更新',
  //     onClick: reqUpdate,
  //   },
  //   {
  //     type: 'myButton',
  //     label: '取消',
  //     onClick: () => {
  //       setDisabled(true);
  //     },
  //   },
  // ];

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader
        // panelList={disabled ? panelList01 : panelList02}
        contractNumber={engineeringContact?.contractNumber ?? ''}
      />

      <div>
        <div className={style.outboundOrder}>
          <div className={style.title}>
            <div>
              <span>工程編號</span>
              <span>{engineeringContact?.projectNumber}</span>
            </div>
            <div>
              <span>工程名稱</span>
              <span>{engineeringContact?.projectName}</span>
            </div>
          </div>

          <OrderTable control={control_orderTable} />

          <div className={style.remark}>
            <div className={style.title}>
              <div>
                <span>備註</span>
                <div className={classNames(style.btnBar, !havePermissionToEdit && style.hidden)}>
                  {notesDiasbled && (
                    <div>
                      <MyButton_v2 label="編輯" onClick={() => setNotesDiasbled(false)} />
                    </div>
                  )}
                  {!notesDiasbled && (
                    <>
                      <div>
                        <MyButton_v2 label="確認" onClick={reqPatchNotes} />
                      </div>
                      <div>
                        <MyButton_v2 label="取消" onClick={() => setNotesDiasbled(true)} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={style.textarea}>
              <textarea
                value={notes || ''}
                onChange={(e) => {
                  if (!notesDiasbled) {
                    setNotes(e.target.value);
                  }
                }}
                placeholder="請輸入備註"
                disabled={notesDiasbled}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}
