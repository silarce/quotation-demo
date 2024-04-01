// !!!!!!!!!!
// !!!!!!!!!!
// !!!!!!!!!!
// !!!!!!!!!!
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// 工程管理單
// 工程管理單
// 工程管理單

// setMyDeleveryList

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import OrderTable, {
  Tcontrol_orderTable,
  Tgroup,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// css
import style from './contract.module.scss';

// api
import { TquotationProductDto, useGetContract_id } from 'js/api/api_quotation';
import {
  // TupdateEngineeringDeliveryList,
  // TupdateDeliveryStatus,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  useGetEngineeringContact,
  useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
  apiPostDeliveryStatus,
  apiPatchDeliveryStatus,
  apiDeleteDeliveryStatus,
} from 'js/api/api_engineering';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// type
// import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { ToutsourcingDto, TerpFeatureDto, TquotationProductItemDto, TemployeeDto } from 'js/api/dtoTypes';

// =====================================================================

type Tdelevery = {
  originalItem: TquotationProductItemDto;
  itemName: string;
  itemArr: TquotationProductItemDto[];
};

type TmyDeleveryList = {
  [key: string]: Tdelevery;
};

// 爛程式，應該在根目錄把目標物件與路徑分離出來才對
type TdeliveryStatusInEdit = {
  [prodKey: string]: {
    [itemId: string]: {
      [statusId: string]: Omit<TcreateEngineeringDeliveryStatusDto, 'installerEmployees' | 'productItemId'> & {
        id?: string;
        installerOutsourcing?: ToutsourcingDto | null;
        installerEmployees?: TemployeeDto[];
        productItemId: string | null;
      };
    };
  };
};

type TselectorConfirm = (props: { outsourcingId?: string; employeeId?: string }) => void;

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

  // 外包廠商選擇器的onConfirm
  const [selectorConfirm, setSelectorConfirm] = useState<TselectorConfirm>();

  // --------------------------------------------------------------------------

  const [deleveryStatusInEdit, setDeleveryStatusInEdit] = useState<TdeliveryStatusInEdit>();

  // console.log(deleveryStatusInEdit);

  const [notes, setNotes] = useState<string>();
  const [notesDiasbled, setNotesDiasbled] = useState(true);

  const [myDeleveryList, setMyDeleveryList] = useState<TmyDeleveryList>();

  // --------------------------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: ['subContracts.content.products.rootProdductId'],
  });
  const { engineeringContactId, engineeringDeliveryListId } = contract ?? {};
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { deliveryList, update_deliveryList } = useGetEngineeringDeliveryList(engineeringDeliveryListId);

  const worksheetArr = deliveryList?.contract.worksheet;

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

  // const contractProdList = useMemo(() => {
  //   if (!contract) {
  //     return undefined;
  //   }

  //   let subContracts = contract.subContracts;

  //   subContracts = _.sortBy(subContracts, 'version');

  //   const list: { [key: string]: TquotationProductDto } = {};

  //   subContracts.forEach((contract) => {
  //     const prodArr = contract.content.products;
  //     prodArr.forEach((prod) => {
  //       list[prod.rootProductId] = prod;
  //     });
  //   });

  //   Object.keys(list).forEach((key) => {
  //     const item = list[key];

  //     if (key !== item.id) {
  //       list[item.id] = item;
  //       delete list[key];
  //     }
  //   });

  //   return list;
  // }, [contract]);

  const contractProdList = useMemo(() => {
    if (!worksheetArr) {
      return undefined;
    }

    const list: { [key: string]: TquotationProductDto } = {};

    worksheetArr.forEach((worksheet) => {
      const { latestRecord } = worksheet;
      const contractProductItems = latestRecord.contractProductItems ?? [];

      contractProductItems.forEach((item) => {
        const {
          // productId,
          rootWorksheetItemId,
          rootWorksheetItem,
          latestWorksheetItem: adjustedItem,
          latestWorksheetItemId: adjustedItemId,
        } = item;

        if (rootWorksheetItemId) {
          list[rootWorksheetItemId] = rootWorksheetItem;
        }
      });
    });

    // subContracts.forEach((contract) => {
    //   const prodArr = contract.content.products;
    //   prodArr.forEach((prod) => {
    //     list[prod.rootProductId] = prod;
    //   });
    // });

    // Object.keys(list).forEach((key) => {
    //   const item = list[key];

    //   if (key !== item.id) {
    //     list[item.id] = item;
    //     delete list[key];
    //   }
    // });

    return list;
  }, [deliveryList]);

  // --------------------------------------------------------------------------

  useEffect(() => {
    setNotes(deliveryList?.notes);
  }, [deliveryList, notesDiasbled]);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // const worksheet = deliveryList?.contract.worksheet;
  // const worksheetArr = deliveryList?.contract.worksheet;

  // console.log(worksheetArr);

  // !因為worksheet資料結構改變，這段程式碼不能用了，先註解
  useEffect(() => {
    if (!deliveryList?.contract.worksheet) {
      return;
    }

    // const contractProductItems = deliveryList.contract.worksheet.latestRecord.contractProductItems;

    const myDeleveryList: TmyDeleveryList = {};

    worksheetArr?.forEach((worksheet) => {
      const { latestRecord } = worksheet;
      const contractProductItems = latestRecord.contractProductItems ?? [];

      contractProductItems.forEach((item) => {
        const {
          // productId,
          rootWorksheetItemId,
          rootWorksheetItem,
          latestWorksheetItem: adjustedItem,
          latestWorksheetItemId: adjustedItemId,
        } = item;

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
        // issue#198 // 改送item.id
        theItem.id = item.id;

        if (rootWorksheetItemId && !myDeleveryList?.[rootWorksheetItemId]) {
          myDeleveryList[rootWorksheetItemId] = {
            originalItem: item,
            itemName: theItem.itemName,
            itemArr: [],
          };
        }

        if (rootWorksheetItemId) {
          myDeleveryList[rootWorksheetItemId].itemArr.push(theItem);
        }
      });
    });

    // worksheetArr.forEach((item) => {
    //   const { productId, adjustedItem, adjustedItemId } = item;

    //   let theItem: typeof item;
    //   // 現在只以productId分類，theId用不到了
    //   // let theId: string;

    //   if (adjustedItem && adjustedItemId) {
    //     theItem = adjustedItem;
    //     // theId = adjustedItemId;
    //   } else {
    //     theItem = item;
    //     // theId = productId;
    //   }

    //   theItem.deliveryStatus = item.deliveryStatus;
    //   // issue#198 // 改送item.id
    //   theItem.id = item.id;

    //   if (!myDeleveryList?.[productId]) {
    //     myDeleveryList[productId] = {
    //       originalItem: item,
    //       itemName: theItem.itemName,
    //       itemArr: [],
    //     };
    //   }

    //   myDeleveryList[productId].itemArr.push(theItem);
    // });

    setMyDeleveryList(myDeleveryList);

    // ---------------------
  }, [deliveryList]);

  // console.log(myDeleveryList, myDeleveryList);

  // // !因為worksheet資料結構改變，這段程式碼不能用了，先註解
  // useEffect(() => {
  //   if (!deliveryList?.contract.worksheet?.latestRecord.contractProductItems) {
  //     return;
  //   }

  //   const contractProductItems = deliveryList.contract.worksheet.latestRecord.contractProductItems;

  //   const myDeleveryList: TmyDeleveryList = {};

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
  //     // issue#198 // 改送item.id
  //     theItem.id = item.id;

  //     if (!myDeleveryList?.[productId]) {
  //       myDeleveryList[productId] = {
  //         originalItem: item,
  //         itemName: theItem.itemName,
  //         itemArr: [],
  //       };
  //     }

  //     myDeleveryList[productId].itemArr.push(theItem);
  //   });

  //   setMyDeleveryList(myDeleveryList);

  //   // ---------------------
  // }, [deliveryList]);

  // --------------------------------------------------------------------------

  const reqPost = async (
    productItemId: string,

    { employeeId, outsourcingId }: { employeeId?: string; outsourcingId?: string }
  ) => {
    if (!engineeringDeliveryListId || isReqing) {
      return undefined;
    }

    if (!employeeId && !outsourcingId) {
      myAlert.err({ title: '新增失敗', content: '請選擇員工或外包廠商' });

      return undefined;
    }

    try {
      const res = await apiPostDeliveryStatus({
        id: engineeringDeliveryListId,
        body: {
          notes: null,
          itemName: null,
          shippingDate: null,
          // installerEmployeeId: outsouctingId,

          installerOutsourcingId: outsourcingId ?? null,
          installerEmployees: employeeId ? [employeeId] : null,

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

    if (body.installerEmployees?.length === 0) {
      body.installerEmployees = null;
    }

    if (!body.installerOutsourcingId) {
      {
        body.installerOutsourcingId = null;
      }
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

      const theOriginalContractContent: TquotationProductDto | undefined = contractProdList![prodKey] as
        | TquotationProductDto
        | undefined;

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
          totalCai: new Decimal(theOriginalContractContent.volume || 0).mul(arrLength).toString(),
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
          const deleveryStatus_singleState = deleveryStatusInEdit?.[prodKey]?.[itemId]?.[statusId];
          const disabled = !deleveryStatus_singleState;

          const edit = ({
            //
            key,
            value,
          }: {
            key: Exclude<
              keyof TdeliveryStatusInEdit[string][string][string],
              'installerOutsourcing' | 'installerEmployees_obj' | 'installerEmployees'
            >;
            value?: string;
          }) => {
            if (!deleveryStatus_singleState || !havePermissionToEdit) {
              return;
            }

            setDeleveryStatusInEdit((state) => {
              if (!state) {
                return state;
              }

              const copy = { ...state };

              copy[prodKey][itemId][statusId][key] = value ?? '';

              return copy;
              //
            });
          };

          const editInstaller = ({
            employee,
            outsourcing,
          }: {
            employee?: TemployeeDto | null;
            outsourcing?: ToutsourcingDto | null;
          }) => {
            setDeleveryStatusInEdit((state) => {
              if (!state) {
                return state;
              }

              const copy = { ...state };

              copy[prodKey][itemId][statusId].installerOutsourcing = outsourcing || null;

              if (!copy[prodKey][itemId][statusId].installerOutsourcing) {
                copy[prodKey][itemId][statusId].installerOutsourcingId = null;
              }

              copy[prodKey][itemId][statusId].installerEmployees = employee ? [employee] : [];

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

              const copy = _.cloneDeep(status);

              setDeleveryStatusInEdit({
                [prodKey]: {
                  [itemId]: {
                    [statusId]: copy,
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

              const onSelectorConfirm: TselectorConfirm = async ({ employeeId, outsourcingId }) => {
                const res = await reqPost(itemId, { employeeId, outsourcingId });

                if (res) {
                  setMyDeleveryList((state) => {
                    const copy = { ...state };
                    copy[prodKey].itemArr[itemIndex].deliveryStatus?.push(res);

                    return copy;
                  });
                }
              };

              setSelectorConfirm(() => {
                return onSelectorConfirm;
              });
            },
            onConfirmClick: async () => {
              if (!deleveryStatus_singleState || !havePermissionToEdit) {
                return;
              }

              const body = {
                ...deleveryStatus_singleState,
                installerEmployeeId: deleveryStatus_singleState.installerOutsourcing?.id ?? null,
              };

              if (!body.productItemId) {
                myAlert.err({ title: '更新失敗', content: 'productItemId不存在' });
                console.log(body);

                return;
              }

              const installerEmployees = (body.installerEmployees ?? []).map((item) => item.id);

              const reqBody: TcreateEngineeringDeliveryStatusDto = {
                notes: body.notes,
                itemName: body.itemName,
                shippingDate: body.shippingDate,
                // installerOutsourcingId: body.installerOutsourcingId,
                installerOutsourcingId: body.installerOutsourcing?.id ?? null,
                installerEmployees,
                installationDate: body.installationDate,
                append: body.append,
                completeAppend: body.completeAppend,
                productItemId: body.productItemId,
              };

              const res = await reqPatch({
                statusId,
                body: reqBody,
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
            value: deleveryStatus_singleState?.installationDate ?? status.installationDate ?? '',
            onChange_date: (v) => {
              if (!deleveryStatus_singleState || !havePermissionToEdit) {
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
            installer:
              deleveryStatus_singleState?.installerOutsourcing ??
              deleveryStatus_singleState?.installerEmployees?.[0] ??
              (status.installerOutsourcing || null) ??
              (status.installerEmployees?.[0] || null),
            onChange_installer: (installer) => {
              if (!deleveryStatus_singleState || !havePermissionToEdit) {
                return;
              }

              const { employee, outsourcing } = installer;
              editInstaller({
                employee,
                outsourcing,
              });
            },
          });

          itemNameArr.push({
            disabled,
            value: deleveryStatus_singleState?.itemName ?? status.itemName ?? '',
            onChange: (v) => {
              if (!deleveryStatus_singleState || !havePermissionToEdit) {
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
            value: deleveryStatus_singleState?.notes ?? status.notes ?? '',
            onChange: (v) => {
              if (!deleveryStatus_singleState || !havePermissionToEdit) {
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

              const onSelectorConfirm: TselectorConfirm = async ({ outsourcingId, employeeId }) => {
                const res = await reqPost(itemId, { employeeId, outsourcingId });

                if (res) {
                  setMyDeleveryList((state) => {
                    const copy = { ...state };
                    copy[prodKey].itemArr[itemIndex].deliveryStatus?.push(res);

                    return copy;
                  });
                }
              };

              setSelectorConfirm(() => {
                return onSelectorConfirm;
              });
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
              // !因為worksheet資料結構改變，這段程式碼不能用了，先註解
              // value: worksheet ? moment(convertDate_reduce1911(worksheet.createdAt)).format('yy-MM-DD') : '',
              value: '',
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

  const defaultSelectorSelected = useMemo(() => {
    if (!deleveryStatusInEdit) {
      return undefined;
    }

    const a = Object.values(deleveryStatusInEdit)[0];
    const b = Object.values(a)[0];
    const deleveryStatus = Object.values(b)[0];

    const { installerOutsourcing, installerEmployees } = deleveryStatus;

    const outsourcingArr = installerOutsourcing ? [installerOutsourcing] : [];
    const employeeArr = installerEmployees ?? [];

    return [employeeArr, outsourcingArr] as [typeof employeeArr, typeof outsourcingArr];
  }, [deleveryStatusInEdit]);

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

  const panelList_noPromission: TpanelList = [
    {
      type: 'myButton',
      label: '沒有權限編輯',
      onClick: () => {},
    },
  ];

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader
        panelList={!havePermissionToEdit ? panelList_noPromission : undefined}
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

      <SelectorGroup
        showModal={!!selectorConfirm}
        caption="選擇員工或外包廠商"
        tip="員工或外包擇一"
        defaultSeletedDataArrArr={defaultSelectorSelected}
        onConfirm={(arr) => {
          const employeeArr = arr[0];
          const employee = employeeArr[0] as (typeof employeeArr)[0] | undefined;

          const outsourcingArr = arr[1];
          const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

          selectorConfirm &&
            selectorConfirm({
              employeeId: employee?.id,
              outsourcingId: outsourcing?.id,
            });
        }}
        onCancel={() => {
          setSelectorConfirm(undefined);
        }}
      />
    </SubLayer>
  );
}

// ============================================================================
const SelectorGroup = selectModalCreator_multi<['employee', 'outsourcing']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '員工',
      tip: '單選',
      limit: 1,
      clearOther: [1],
    },
    {
      key: 'outsourcing',
      caption: '外包廠商',
      tip: '單選',
      limit: 1,
      clearOther: [0],
    },
  ],
});

// ======================================================================
