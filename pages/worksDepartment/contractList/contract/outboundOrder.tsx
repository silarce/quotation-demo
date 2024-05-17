// 工程管理單
// 工程管理單
// 工程管理單

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
// import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import OrderTable, {
  // Tcontrol_orderTable,
  TrowProps,
  Tpanel,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// css
import style from './contract.module.scss';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import {
  // TupdateEngineeringDeliveryList,
  // TupdateDeliveryStatus,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  // useGetEngineeringContact,
  // useGetEngineeringDeliveryList,
  apiPatchEngineeringDeliveryList,
  apiPostDeliveryStatus,
  apiPatchDeliveryStatus,
  apiDeleteDeliveryStatus,
} from 'js/api/api_engineering';

import { useGetContract_id_finalProductItem } from 'js/api/api_quotation';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import {
  //
  TerpFeatureDto,
  TquotationProductItemDto,
  TquotationProductDto,
} from 'js/api/dtoTypes';

// =====================================================================

type TproductWorksheetList = {
  [finalProductId: string]: {
    product: TquotationProductDto; // 最左邊的資料
    worksheetList: {
      // 中間的資料
      // 以worksheetRecordId分類
      [worksheetRecordId: string]: {
        // worksheetRecordId: string;
        // latestRecord: TworksheetRecordDto;
        // itemName: string;
        worksheetCreatedAt: string | null; // 工作表開立日期，是工作表，不是工作表的record
        totalQty: number; // 總數
        totalVolume: number; // 總才數
        worksheetItem: TquotationProductItemDto; // 預期每一個worksheetItem都是一樣的，從worksheetItemArr裡隨便取一個
        // worksheetItemArr 裡放的是finalProduct的items.latestWorksheetItem
        // 呼叫 apiPostDeliveryStatus或 apiPatchDeliveryStatus時
        // body中的productItemId要放worksheetItemArr[number].id
        worksheetItemArr: TquotationProductItemDto[]; // 裡面的deliveryStatus是右邊的資料
      };
    };
  };
};

// =====================================================================

// region START

export default function OutboundOrder({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  // ___________________________________________________________________________
  let havePermissionToEdit = isAdmin;

  if (!isAdmin) {
    havePermissionToEdit = !!userErpFeature?.some((item) => {
      return item.name === '工務部-工作表編輯';
    });
  }

  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  // --------------------------------------------------------------------------

  const [notes, setNotes] = useState<string>();
  const [notesDiasbled, setNotesDiasbled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isReqing, setIsReqing] = useState(false);

  const [targetWorksheetItemId, setTargetWorksheetItemId] = useState<string>();

  // --------------------------------------------------------------------------

  // 合約
  const {
    //
    data: contract,
    update: update_contract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'subContracts.content.products.rootProdductId',
      'engineeringDeliveryList',
      'worksheet',
      // 'worksheet.latestRecord.contractProductItems.deliveryStatus.installerEmployees',
      // 'worksheet.latestRecord.contractProductItems.deliveryStatus.installerOutsourcing',
      // 'worksheet.latestRecord.contractProductItems.adjustedItem.accessories',
      // 'worksheet.latestRecord.contractProductItems.accessories',
      // 'worksheet.latestRecord.contractProductItems.rootproductId',
      // 'worksheet.latestRecord.contractProductItems.rootWorksheetItem',
      // 'worksheet.latestRecord.contractProductItems.latestWorksheetItem',
      'engineeringContact',
    ],
  });

  const {
    //
    engineeringDeliveryListId,
    engineeringDeliveryList: deliveryList,
    engineeringContact,
    worksheet: worksheetArr,
  } = contract ?? {};

  const { data: finalProduct = [], update: update_finalProduce } = useGetContract_id_finalProductItem(contractId);

  // --------------------------------------------------------------------------

  // region REQUEST

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

          installerOutsourcingId: outsourcingId ?? null,
          installerEmployees: employeeId ? [employeeId] : null,

          installationDate: null,
          append: null,
          completeAppend: null,
          productItemId,
        },
      });

      update_finalProduce();
      // return res
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

    console.log(body);

    try {
      const res = await apiPatchDeliveryStatus({
        id: engineeringDeliveryListId,
        statusId,
        body,
      });

      update_finalProduce();

      // return res;
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

      update_finalProduce();

      // return true;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '刪除失敗', content: err.message });
    }
  };

  const reqPatchNotes = async () => {
    if (!engineeringDeliveryListId || !havePermissionToEdit) {
      return;
    }

    try {
      setIsLoading(true);
      await apiPatchEngineeringDeliveryList(engineeringDeliveryListId, { notes: notes ?? '' });
      // await update_deliveryList();
      await update_contract();
      setNotesDiasbled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新備註失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------

  // region COMPONENT PROPS

  const productWorksheetList = useMemo(() => {
    const productWorksheetList: TproductWorksheetList = {};

    const finalProduct_sorted = _.sortBy(finalProduct, 'createdAt');

    finalProduct_sorted.forEach((fp) => {
      const { id, items } = fp;

      productWorksheetList[id] = {
        product: fp,
        worksheetList: {},
      };

      const { worksheetList } = productWorksheetList[id];

      items.forEach((item) => {
        const { latestWorksheetItem, worksheetId } = item;

        const worksheetCreatedAt = worksheetArr?.find((ws) => ws.id === worksheetId)?.createdAt ?? null;

        if (latestWorksheetItem) {
          const { worksheetRecordId, volume } = latestWorksheetItem;

          if (worksheetRecordId) {
            if (!worksheetList[worksheetRecordId]) {
              worksheetList[worksheetRecordId] = {
                worksheetCreatedAt,
                totalQty: 1,
                totalVolume: Number(volume ?? 0),
                worksheetItem: latestWorksheetItem,
                worksheetItemArr: [latestWorksheetItem],
              };
            } else {
              worksheetList[worksheetRecordId].totalQty += 1;
              worksheetList[worksheetRecordId].totalVolume += Number(volume ?? 0);
              worksheetList[worksheetRecordId].worksheetItemArr.push(latestWorksheetItem);
            }
          }
        }
      });
    });

    return productWorksheetList;

    //
  }, [finalProduct]);

  // ------------------------------------------------------------------------

  const rowPropsArr: TrowProps[] = useMemo(() => {
    const rowPropsArr: TrowProps[] = [];

    Object.values(productWorksheetList).forEach((productWorksheet, index) => {
      const { product, worksheetList } = productWorksheet;
      const worksheetArr = Object.values(worksheetList) as
        | TproductWorksheetList[string]['worksheetList'][string][]
        | undefined;

      // ____________________________________________________________________
      const prodRow = createRowProps_prodRow({
        prod: product,
        serialNumber: index + 1,
        worksheetItem: worksheetArr?.[0]?.worksheetItem,
        worksheetItemQty: worksheetArr?.[0]?.worksheetItemArr.length,
        worksheetCreatedAt: worksheetArr?.[0]?.worksheetCreatedAt || null,
      });

      rowPropsArr.push(prodRow);
      // ____________________________________________________________________
      worksheetArr?.[0]?.worksheetItemArr.forEach((item) => {
        const itemRow = createRowProps_itemRow({
          worksheetItem: item,
          worksheetCreatedAt: worksheetArr?.[0].worksheetCreatedAt,
          onAddClick: () => {
            setTargetWorksheetItemId(item.id);
          },
          onDeleteClick: (deleverStatusId) => {
            reqDelete(deleverStatusId);
          },
          onConfirmClick: async ({
            deliveryStatusId,
            employeeId,
            outsourcingId,
            installationDate,
            shippingDate,
            itemName,
            notes,
          }) => {
            const reqBody: TcreateEngineeringDeliveryStatusDto = {
              notes: notes,
              itemName: itemName,
              shippingDate: shippingDate,
              installerOutsourcingId: outsourcingId ?? null,
              installerEmployees: employeeId ? [employeeId] : null,
              installationDate: installationDate,
              append: null,
              completeAppend: null,
              productItemId: item.id,
            };

            await reqPatch({
              statusId: deliveryStatusId,
              body: reqBody,
            });
          },
        });

        rowPropsArr.push(itemRow);
      });

      // ____________________________________________________________________

      worksheetArr?.forEach((worksheet, index) => {
        if (index === 0) {
          return;
        }

        const { worksheetItem, worksheetItemArr, worksheetCreatedAt } = worksheet;

        const headRow = createRowProps_headRow({
          worksheetItem: worksheetItem,
          worksheetItemQty: worksheetItemArr.length,
          worksheetCreatedAt,
        });

        rowPropsArr.push(headRow);

        worksheetItemArr.forEach((item) => {
          const itemRow = createRowProps_itemRow({
            worksheetItem: item,
            worksheetCreatedAt,
            onAddClick: () => {
              setTargetWorksheetItemId(item.id);
            },
            onDeleteClick: (deleverStatusId) => {
              reqDelete(deleverStatusId);
            },
            onConfirmClick: async ({
              deliveryStatusId,
              employeeId,
              outsourcingId,
              installationDate,
              shippingDate,
              itemName,
              notes,
            }) => {
              const reqBody: TcreateEngineeringDeliveryStatusDto = {
                notes: notes,
                itemName: itemName,
                shippingDate: shippingDate,
                installerOutsourcingId: outsourcingId ?? null,
                installerEmployees: employeeId ? [employeeId] : null,
                installationDate: installationDate,
                append: null,
                completeAppend: null,
                productItemId: item.id,
              };

              await reqPatch({
                statusId: deliveryStatusId,
                body: reqBody,
              });
            },
          });

          rowPropsArr.push(itemRow);
        });
      });
    }); // productWorksheetList

    return rowPropsArr;
  }, [productWorksheetList]);

  // --------------------------------------------------------------------------
  // region  USE EFFECT

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
        await update_finalProduce();
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
        await update_contract();
        // await update_engineeringContact();
        // await update_deliveryList();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNotes(deliveryList?.notes);
  }, [deliveryList, notesDiasbled]);

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // region RENDER

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader contractNumber={engineeringContact?.contractNumber ?? ''} />

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

          <OrderTable control={{ rowPropsArr: rowPropsArr }} />

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

      {/* 呼叫apiPostDeliveryStatus 新增 deliveryStatus */}
      <SelectorGroup
        showModal={!!targetWorksheetItemId}
        caption="選擇員工或外包廠商"
        tip="員工或外包擇一"
        // defaultSeletedDataArrArr={defaultSelectorSelected}
        onConfirm={(arr) => {
          const employeeArr = arr[0];
          const employee = employeeArr[0] as (typeof employeeArr)[0] | undefined;

          const outsourcingArr = arr[1];
          const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

          if (targetWorksheetItemId) {
            reqPost(targetWorksheetItemId, {
              employeeId: employee?.id,
              outsourcingId: outsourcing?.id,
            });
          }
        }}
        onCancel={() => {
          setTargetWorksheetItemId(undefined);
        }}
      />
    </SubLayer>
  );
}

// region END

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region component

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

// region function

const createRowProps_prodRow = ({
  prod,
  serialNumber,
  worksheetItem,
  worksheetItemQty,
  worksheetCreatedAt,
}: {
  prod: TquotationProductDto;
  serialNumber: React.ReactNode;
  worksheetItem: TquotationProductItemDto | undefined;
  worksheetItemQty: number | undefined;
  worksheetCreatedAt: string | null;
}): TrowProps => {
  const total_volume_prod = new Decimal(prod.quantity).mul(prod.volume || 0).toNumber();

  const total_volume_worksheet =
    worksheetItemQty && worksheetItem ? new Decimal(worksheetItemQty).mul(worksheetItem.volume || 0).toNumber() : '';

  const center: TrowProps['center'] = worksheetItem && {
    projectName: worksheetItem.itemName,
    L: new Decimal(worksheetItem.fullWidth).div(1000).toNumber(),
    WG: new Decimal(worksheetItem.WG).div(1000).toNumber(),
    B: worksheetItem.boxB,
    qty: worksheetItemQty,
    volume: worksheetItem.volume,
    total_volume: total_volume_worksheet,
    doorModelName: worksheetItem.doorModelName,
    material: worksheetItem.materialName,
    horsepower: worksheetItem.horsepower,
    surface: worksheetItem.materialSurface,
    establishmentDate: getTaiwanDateStr(worksheetCreatedAt),
  };

  return {
    // key: prod.id,
    isHeadRow: true,
    isProdRow: true,
    side: {
      serialNumber,
      projectName: prod.itemName,
    },
    left: {
      L: new Decimal(prod.fullWidth).div(1000).toNumber(),
      WG: new Decimal(prod.WG).div(1000).toNumber(),
      B: prod.boxB,
      qty: prod.quantity,
      volume: prod.volume,
      total_volume: total_volume_prod,
      doorModelName: prod.doorModelName,
      material: prod.materialName,
      horsepower: prod.horsepower,
      surface: prod.materialSurface,
    },
    center: center,
  };
};

// ===========================================================================

const createRowProps_headRow = ({
  worksheetItem,
  worksheetItemQty,
  worksheetCreatedAt,
}: {
  worksheetItem: TquotationProductItemDto;
  worksheetItemQty: number;
  worksheetCreatedAt: string | null;
}): TrowProps => {
  const total_volume_worksheet =
    worksheetItemQty && worksheetItem ? new Decimal(worksheetItemQty).mul(worksheetItem.volume || 0).toNumber() : '';

  const center = worksheetItem && {
    projectName: worksheetItem.itemName,
    L: new Decimal(worksheetItem.fullWidth).div(1000).toNumber(),
    WG: new Decimal(worksheetItem.WG).div(1000).toNumber(),
    B: worksheetItem.boxB,
    qty: worksheetItemQty,
    volume: worksheetItem.volume,
    total_volume: total_volume_worksheet,
    doorModelName: worksheetItem.doorModelName,
    material: worksheetItem.materialName,
    horsepower: worksheetItem.horsepower,
    surface: worksheetItem.materialSurface,
    establishmentDate: getTaiwanDateStr(worksheetCreatedAt),
  };

  return {
    // key: `headRow-${worksheetItem.id}`,
    isHeadRow: true,
    center,
  };
};

// ==========================================================================

const createRowProps_itemRow = ({
  //
  worksheetItem,
  onAddClick,
  onConfirmClick,
  onDeleteClick,
  worksheetCreatedAt,
}: {
  worksheetItem: TquotationProductItemDto;
  onAddClick: () => void;
  onConfirmClick: (parameters: {
    deliveryStatusId: string;
    employeeId: string | undefined;
    outsourcingId: string | undefined;
    installationDate: string;
    shippingDate: string;
    itemName: string;
    notes: string;
  }) => Promise<void>;
  onDeleteClick: (deleverStatuId: string) => void;
  worksheetCreatedAt: string | null;
}): TrowProps => {
  const { deliveryStatus, accessories } = worksheetItem;

  const accessoriesStr = accessories?.map((a) => a.name).join('\n');

  const deliveryStatus_sorted = _.sortBy(deliveryStatus, 'createdAt');

  const rightPanelArr: Tpanel[] = (deliveryStatus_sorted ?? []).map((ds) => {
    const {
      id,
      // 所屬產品Id
      productItemId,
      // 備註
      notes,
      // 出貨日
      // 項目名稱
      itemName,
      // 安裝人員(外包)ID
      installerOutsourcingId,
      // 安裝人員(外包)
      installerOutsourcing,
      // 安裝人員(員工)
      installerEmployees, // 這是陣列
      // 安裝日期
      installationDate,
      shippingDate, // 出貨日
    } = ds;

    const panelProps: Tpanel = {
      key: id,
      accessorie: accessoriesStr,
      installationDate: installationDate ?? '',
      shippingDate: shippingDate ?? '',
      installer_employee: installerEmployees[0],
      installer_outsourcing: installerOutsourcing,
      itemName: itemName ?? '',
      notes: notes ?? '',
      onAddClick,
      onDeleteClick: () => {
        onDeleteClick(id);
      },
      onConfirmClick: async (parameters) => {
        const { employeeId, outsourcingId, installationDate, shippingDate, itemName, notes } = parameters;

        await onConfirmClick({
          deliveryStatusId: id,
          employeeId,
          outsourcingId,
          installationDate,
          shippingDate,
          itemName,
          notes,
        });
      },
    };

    return panelProps;
  });

  if (!rightPanelArr[0]) {
    rightPanelArr.push({
      key: 'undefined',
      isUndefined: true,
      accessorie: '',
      installationDate: '',
      shippingDate: '',
      installer_employee: undefined,
      installer_outsourcing: undefined,
      itemName: '',
      notes: '',
      onAddClick,
      onDeleteClick: () => {},
      onConfirmClick: async () => {},
    });
  }

  return {
    // key: worksheetItem.id,
    center: {
      projectName: worksheetItem.itemName,
      L: new Decimal(worksheetItem.fullWidth).div(1000).toNumber(),
      WG: new Decimal(worksheetItem.WG).div(1000).toNumber(),
      B: worksheetItem.boxB,
      // qty: worksheetItemQty,
      volume: worksheetItem.volume,
      // total_volume: total_volume_worksheet,
      doorModelName: worksheetItem.doorModelName,
      material: worksheetItem.materialName,
      horsepower: worksheetItem.horsepower,
      surface: worksheetItem.materialSurface,
      establishmentDate: getTaiwanDateStr(worksheetCreatedAt),
    },
    rightPanelArr: rightPanelArr,
    // rightPanelArr: foo,
  };
};
