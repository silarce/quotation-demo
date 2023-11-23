// 出庫單
// 出庫單
// 出庫單
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import moment from 'moment';
import _ from 'lodash';

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

// css
import style from './contract.module.scss';

// api
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TupdateEngineeringDeliveryList,
  TupdateDeliveryStatus,
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
import { convertDate_reduce1911, convertDate_add1911 } from 'js/utils/helpers/date/convertDate';

// type
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TquotationProductItemDto, TdeliveryStatusDto, TemployeeDto } from 'js/api/dtoTypes';

// =====================================================================

type Tdelevery = {
  originalItem: TquotationProductItemDto;
  itemName: string;
  itemArr: TquotationProductItemDto[];
};

type TmyDeleveryList = {
  [key: string]: Tdelevery;
};

// type TdeliveryStatusWillUpdate = {
//   [key in string]: {
//     id: string;
//     notes: string;
//     // installerEmployeeId: string | null;
//     installerEmployee?: TemployeeDto | null;
//     installationDate: string | null;
//     append: string | null;
//     completeAppend: string | null;
//   };
// };

// type TdeliveryStatusInEdit = {
//   [key: string /*prodKey */]: {
//     [key: string /*statusId */]: TcreateEngineeringDeliveryStatusDto & {
//       id?: string;
//       installerEmployee?: TemployeeDto | null;
//     };
//   };
// };
type TdeliveryStatusInEdit = {
  [key: string /*prodKey */]: {
    [key: string /*itemId */]: {
      [key: string /*statusId */]: TcreateEngineeringDeliveryStatusDto & {
        id?: string;
        installerEmployee?: TemployeeDto | null;
      };
      // new: TcreateEngineeringDeliveryStatusDto & {
      //   id?: '';
      //   installerEmployee?: TemployeeDto | null;
      // };
    };
  };
};

// =====================================================================
export default function OutboundOrder() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  // const [disabled, setDisabled] = useState(true);

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

  // --------------------------------------------------------------------------

  const [notes, setNotes] = useState<string>();

  // --------------------------------------------------------------------------

  // const [deleveryStatusInEdit, setDeleveryStatusInEdit] = useState<TcreateEngineeringDeliveryStatusDto>();
  const [deleveryStatusInEdit, setDeleveryStatusInEdit] = useState<TdeliveryStatusInEdit>();

  console.log(deleveryStatusInEdit);

  const [deleveryStatus, setDeleveryStatus] = useState<TdeliveryStatusDto>();

  // --------------------------------------------------------------------------

  // const [deliveryStatusWillUpdate, setDeliveryStatusWillUpdate] = useState<TdeliveryStatusWillUpdate>({});

  // const change_deliveryStatusWillUpdate = (
  //   statusOri: TdeliveryStatusDto | undefined | null,
  //   key: Exclude<keyof TdeliveryStatusWillUpdate[string], 'installerEmployee'>,
  //   v: string
  // ) => {
  //   if (!statusOri) {
  //     return;
  //   }

  //   const deliveryStatusId = statusOri.id;
  //   let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
  //   statusCopy = { ...statusCopy };
  //   statusCopy[key] = v;

  //   setDeliveryStatusWillUpdate((state) => {
  //     return {
  //       ...state,
  //       [deliveryStatusId]: statusCopy,
  //     };
  //   });
  // };

  // const change_deliveryStatusWillUpdate_employee = (
  //   statusOri: TdeliveryStatusDto | undefined | null,
  //   key: 'installerEmployee',
  //   v: TemployeeDto | null
  // ) => {
  //   if (!statusOri) {
  //     return;
  //   }

  //   const deliveryStatusId = statusOri.id;
  //   let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
  //   statusCopy = { ...statusCopy };
  //   statusCopy[key] = v;
  //   setDeliveryStatusWillUpdate((state) => {
  //     return {
  //       ...state,
  //       [deliveryStatusId]: statusCopy,
  //     };
  //   });
  // };

  // const change_deliveryStatusWillUpdate_date = (
  //   statusOri: TdeliveryStatusDto | undefined | null,
  //   key: 'installationDate',
  //   v: string | null
  // ) => {
  //   if (!statusOri) {
  //     return;
  //   }

  //   const deliveryStatusId = statusOri.id;
  //   let statusCopy = deliveryStatusWillUpdate[deliveryStatusId] ?? createDeliveryStatusWillUpdate(statusOri);
  //   statusCopy = { ...statusCopy };
  //   statusCopy[key] = v;
  //   setDeliveryStatusWillUpdate((state) => {
  //     return {
  //       ...state,
  //       [deliveryStatusId]: statusCopy,
  //     };
  //   });
  // };

  // --------------------------------------------------------------------------

  // const { myDeleveryList, worksheet } = useMemo(() => {
  //   if (!deliveryList?.contract.worksheet?.contractProductItems) {
  //     return {};
  //   }

  //   const worksheet = deliveryList.contract.worksheet;

  //   const contractProductItems = deliveryList.contract.worksheet.contractProductItems;

  //   const myDeleveryList: myDeleveryList = {};

  //   contractProductItems.forEach((item) => {
  //     const { productId, adjustedItem, adjustedItemId } = item;

  //     let theItem: typeof item;
  //     // 現在只以productId分類，theId用不到了
  //     // let theId: string;

  //     if (adjustedItem && adjustedItemId) {
  //       theItem = adjustedItem;
  //       // theId = adjustedItemId;
  //     } else {
  //       theItem = item;
  //       // theId = productId;
  //     }

  //     theItem.deliveryStatus = item.deliveryStatus;

  //     if (!myDeleveryList?.[productId]) {
  //       myDeleveryList[productId] = {
  //         originalItem: item,
  //         itemName: theItem.itemName,
  //         itemArr: [],
  //       };
  //     }

  //     myDeleveryList[productId].itemArr.push(theItem);
  //   });

  //   return {
  //     myDeleveryList,
  //     worksheet,
  //   };
  // }, [deliveryList]);

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

  useEffect(() => {
    setNotes(deliveryList?.notes);

    // const deleveryStatusList =
  }, [deliveryList]);

  // useEffect(() => {
  //   setDeliveryStatusWillUpdate({});
  // }, [disabled]);

  // --------------------------------------------------------------------------

  const reqPost = async (productItemId: string) => {
    if (!engineeringDeliveryListId) {
      return;
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
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增失敗', content: err.message });
    }

    //
  };

  const reqPatch = async ({ statusId, body }: { statusId: string; body: TupdateEngineeringDeliveryStatusDto }) => {
    if (!engineeringDeliveryListId) {
      return;
    }

    try {
      const res = await apiPatchDeliveryStatus({
        id: engineeringDeliveryListId,
        statusId,
        body,
      });

      // return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新失敗', content: err.message });
    }
  };

  const reqDelete = async (statusId: string) => {
    if (!engineeringDeliveryListId) {
      return;
    }

    try {
      const res = await apiDeleteDeliveryStatus({
        id: engineeringDeliveryListId,
        statusId,
      });
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
          L: String(theOriginalContractContent.fullWidth),
          W: String(theOriginalContractContent.WG),
          B: String(theOriginalContractContent.boxB),
          qty: String(prod.itemArr.length),
          implementQty: '???',
          cai: theOriginalContractContent.volume ?? '',
          totalCai: new Decimal(theOriginalContractContent.volume).mul(arrLength).toString(),
          doorType: theOriginalContractContent.doorModelName,
          material: theOriginalContractContent.materialName,
          horsepower: theOriginalContractContent.horsepower,
          surface: theOriginalContractContent.materialSurface ?? '',
        },
        staticData: {
          project: prod.itemName,
          L: String(firstItem.fullWidth),
          W: String(firstItem.WG),
          B: String(firstItem.boxB),
          qty: String(prod.itemArr.length),
          implementQty: '???',
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

      const rowArr: Tgroup['rowArr'] = prod.itemArr.map((item) => {
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

        deliveryStatusArr?.forEach((status, index) => {
          const statusId = status.id;
          const deleveryStatus = deleveryStatusInEdit?.[prodKey]?.[itemId][statusId];
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
            if (!deleveryStatus) {
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
            onEditClick: () => {
              setDeleveryStatusInEdit({
                [prodKey]: {
                  [itemId]: {
                    [statusId]: _.cloneDeep(status),
                  },
                },
              });
            },
            onDeleteClick: () => {
              reqDelete(statusId);
            },
            onAddClick: () => {
              reqPost(itemId);

              // setDeleveryStatusInEdit({
              //   [prodKey]: {
              //     [itemId]: {
              //       ['add']: emptyDeliveryStatus(itemId),
              //     },
              //   },
              // });
            },
            onConfirmClick: () => {
              if (!deleveryStatus) {
                return;
              }

              reqPatch({
                statusId,
                body: deleveryStatus,
              });
            },
          });

          installDateArr.push({
            disabled,
            value: deleveryStatus?.installationDate ?? status.installationDate ?? '',
            onChange_date: (v) => {
              if (!deleveryStatus) {
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
              if (!deleveryStatus) {
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
              if (!deleveryStatus) {
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
              if (!deleveryStatus) {
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

        return {
          contractData: {
            // 這裡的東西不需要顯示，所以空字串就好了
            project: '',
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
            project: prod.itemName,
            L: String(item.fullWidth),
            W: String(item.WG),
            B: String(item.boxB),
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

  // const reqUpdate = async () => {
  //   if (!engineeringDeliveryListId || !deliveryList || notes === undefined) {
  //     return myAlert.warning({ title: '還未取得工作表' });
  //   }

  //   const productsItemStatus: TupdateDeliveryStatus[] = Object.values(deliveryStatusWillUpdate).map((status) => {
  //     // const theDate = status.installationDate ? convertDate_add1911(status.installationDate) : null;
  //     const theDate = status.installationDate ? status.installationDate : null;

  //     return {
  //       id: status.id,
  //       notes: status.notes,
  //       installerEmployeeId: status.installerEmployee?.id ?? null,
  //       installationDate: theDate,
  //       append: status.append,
  //       completeAppend: status.completeAppend,
  //     };
  //   });

  //   const body: TupdateEngineeringDeliveryList = {
  //     notes: notes,
  //     productsItemStatus,
  //   };

  //   try {
  //     setIsLoading(true);
  //     const res = await apiPatchEngineeringDeliveryList(engineeringDeliveryListId, body);

  //     if (res) {
  //       myAlert.success({ title: '更新工作表成功' });
  //       setDisabled(true);
  //       await update_deliveryList();
  //     }
  //   } catch (error) {
  //     const err = error as Error;
  //     myAlert.err({ title: '更新工作表失敗', content: err.message });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
              </div>
            </div>

            <div className={style.textarea}>
              <textarea
                value={notes || ''}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                placeholder="請輸入備註"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// =====================================================================

const emptyDeliveryStatus = (
  productItemId: string
): TcreateEngineeringDeliveryStatusDto & {
  id?: string;
  installerEmployee?: TemployeeDto | null;
} => ({
  id: 'new',
  productItemId,

  notes: null,
  itemName: null,
  shippingDate: null,
  installerEmployeeId: null,
  installationDate: null,
  append: null,
  completeAppend: null,

  installerEmployee: null,
});
