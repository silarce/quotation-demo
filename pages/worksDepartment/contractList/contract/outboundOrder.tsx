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
  TpostDeliveryStatusParams,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/orderTable';
import Modal_newDeliveryStatu, {
  TpreCreateEngineeringDeliveryStatusDto,
} from 'components/page/worksDepartment/contracList/contract/outboundOrder/modal_newDeliveryStatu';

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
  TdeliveryStatusInstallationItem,
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

type TonConfirmClick = (
  productItemId: string,
  params: {
    deliveryStatusId: string;
  } & TpostDeliveryStatusParams
) => Promise<void>;

type TonCopyClick = (productItemId: string, params: TpostDeliveryStatusParams) => Promise<void>;

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
  const [seletedWorksheetItem, setSeletedWorksheetItem] = useState<{ [id: string]: TquotationProductItemDto }>({});

  const [showBatchAddModal, setShowBatchAddModal] = useState(false);

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
    {
      //
      employeeIdArr,
      outsourcingId,
    }: {
      //
      employeeIdArr?: string[];
      outsourcingId?: string;
    }
  ) => {
    if (!engineeringDeliveryListId || isReqing) {
      return undefined;
    }

    const isEmployeeIdArrValid = employeeIdArr && employeeIdArr.length > 0;

    if (!isEmployeeIdArrValid && !outsourcingId) {
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
          installerEmployees: employeeIdArr ? employeeIdArr : null,

          installationDate: null,
          append: null,
          completeAppend: null,
          productItemId,
          installationItem: null,
        },
      });

      update_finalProduce();
      // return res
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增失敗', content: err.message });

      return undefined;
    }
  };

  const reqPost_copy = async (body: TupdateEngineeringDeliveryStatusDto) => {
    if (!engineeringDeliveryListId || isReqing) {
      return undefined;
    }

    body.installationDate = body.installationDate || null;
    body.shippingDate = body.shippingDate || null;

    try {
      const res = await apiPostDeliveryStatus({
        id: engineeringDeliveryListId,
        body,
      });

      update_finalProduce();
      // return res
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增失敗', content: err.message });

      return undefined;
    }
  };

  const reqPost_2 = async (body: TcreateEngineeringDeliveryStatusDto) => {
    if (!engineeringDeliveryListId || isReqing) {
      return;
    }

    try {
      const res = await apiPostDeliveryStatus({
        id: engineeringDeliveryListId,
        body,
      });

      update_finalProduce();

      // return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增失敗', content: err.message });
    }
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

    body = {
      ...body,
      shippingDate: body.shippingDate || null,
      installationDate: body.installationDate || null,
    };

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

      return Promise.reject(err);
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

  // region FUNCTION

  const switchSeletedWorksheetItem = (worksheetItem: TquotationProductItemDto) => {
    setSeletedWorksheetItem((list) => {
      const copy = { ...list };

      if (copy[worksheetItem.id]) {
        delete copy[worksheetItem.id];
      } else {
        copy[worksheetItem.id] = worksheetItem;
      }

      return copy;
    });
  };

  const batchPost = async (preBody: TpreCreateEngineeringDeliveryStatusDto) => {
    for (const item of Object.values(seletedWorksheetItem)) {
      const worksheetItemId = item.id;

      const body: TcreateEngineeringDeliveryStatusDto = {
        ...preBody,
        productItemId: worksheetItemId,
      };

      await reqPost_2(body);
      setSeletedWorksheetItem({});
      setShowBatchAddModal(false);
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
    // 做法是把每一筆worksheetArr.worksheetItemArr裡的item
    // 依序分析成rowProps然後放進rowPropsArr
    // 畫面上看起來HTML的元素有父子的關係，但其實每一個row其實都是獨立的，是兄弟關係

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

      const onConfirm: TonConfirmClick = async (
        productItemId,
        {
          deliveryStatusId,
          employeeIdArr,
          outsourcingId,
          installationDate,
          shippingDate,
          itemName,
          notes,
          installationItem,
        }
      ) => {
        const theEmployeeIdArr = !employeeIdArr ? null : employeeIdArr.length === 0 ? null : employeeIdArr;

        const reqBody: TcreateEngineeringDeliveryStatusDto = {
          notes: notes,
          itemName: itemName,
          shippingDate: shippingDate,
          installerOutsourcingId: outsourcingId ?? null,
          // installerEmployees: employeeIdArr ? [employeeIdArr] : null,
          installerEmployees: theEmployeeIdArr,
          installationDate: installationDate,
          append: null,
          completeAppend: null,
          productItemId,
          installationItem,
        };

        return await reqPatch({
          statusId: deliveryStatusId,
          body: reqBody,
        });
      };

      const onCopy: TonCopyClick = async (
        productItemId,
        { employeeIdArr, outsourcingId, installationDate, shippingDate, itemName, notes, installationItem }
      ) => {
        const theEmployeeIdArr = !employeeIdArr ? null : employeeIdArr.length === 0 ? null : employeeIdArr;

        const reqBody: TcreateEngineeringDeliveryStatusDto = {
          notes: notes,
          itemName: itemName,
          shippingDate: shippingDate,
          installerOutsourcingId: outsourcingId ?? null,
          installerEmployees: theEmployeeIdArr,
          installationDate: installationDate,
          append: null,
          completeAppend: null,
          productItemId,
          installationItem,
        };

        await reqPost_copy(reqBody);
      };

      // 處理第一個worksheetArr的第一筆worksheet
      worksheetArr?.[0]?.worksheetItemArr.forEach((item) => {
        const itemRow = createRowProps_itemRow({
          contractProductItem: product.items[0],
          worksheetItem: item,
          worksheetCreatedAt: worksheetArr?.[0].worksheetCreatedAt,
          onAddClick: () => {
            setTargetWorksheetItemId(item.id);
          },
          onDeleteClick: (deleverStatusId) => {
            reqDelete(deleverStatusId);
          },
          onConfirmClick: async (params) => {
            await onConfirm(item.id, params);
          },
          onCopyClick: async (params) => {
            await onCopy(item.id, params);
          },
          //
          onCenterCheck: () => {
            switchSeletedWorksheetItem(item);
          },
          isCenterCheck: !!seletedWorksheetItem[item.id],
        });

        rowPropsArr.push(itemRow);
      });

      // ____________________________________________________________________
      // 處理第一個worksheetArr的第一筆之外的worksheet

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
            contractProductItem: product.items[0],
            worksheetItem: item,
            worksheetCreatedAt,
            onAddClick: () => {
              setTargetWorksheetItemId(item.id);
            },
            onDeleteClick: (deleverStatusId) => {
              reqDelete(deleverStatusId);
            },
            onConfirmClick: async (params) => {
              await onConfirm(item.id, params);
            },
            onCopyClick: async (params) => {
              await onCopy(item.id, params);
            },
            //
            onCenterCheck: () => {
              switchSeletedWorksheetItem(item);
            },
            isCenterCheck: !!seletedWorksheetItem[item.id],
          });

          rowPropsArr.push(itemRow);
        });
      });
    }); // productWorksheetList

    return rowPropsArr;
  }, [
    productWorksheetList,
    seletedWorksheetItem,
    //  finalProduct
  ]);

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

          <OrderTable
            //
            rowPropsArr={rowPropsArr}
            batchWorksheetItem={{
              onBatchAddChange: () => setSeletedWorksheetItem({}),
              onBatchAddClick: () => setShowBatchAddModal(true),
            }}
          />

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
          // const employee = employeeArr[0] as (typeof employeeArr)[0] | undefined;

          const outsourcingArr = arr[1];
          const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

          if (targetWorksheetItemId) {
            reqPost(targetWorksheetItemId, {
              employeeIdArr: employeeArr.map((emp) => emp.id),
              outsourcingId: outsourcing?.id,
            });
          }
        }}
        onCancel={() => {
          setTargetWorksheetItemId(undefined);
        }}
      />
      <Modal_newDeliveryStatu
        visible={showBatchAddModal}
        onConfirm={batchPost}
        onCancel={() => setShowBatchAddModal(false)}
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
      // limit: 1,
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

// 產品資料的row，這個row會包含item的資料，這個row不會包含panel
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
    // horsepower: worksheetItem.horsepower,
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

// item資料的row，這個row不會包含panel
const createRowProps_headRow = ({
  worksheetItem,
  worksheetItemQty,
  worksheetCreatedAt,
}: // onCenterCheck,
// isCenterCheck,
{
  worksheetItem: TquotationProductItemDto;
  worksheetItemQty: number;
  worksheetCreatedAt: string | null;
  // onCenterCheck: null | undefined | (() => void);
  // isCenterCheck: boolean;
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
  contractProductItem,
  worksheetItem,
  onAddClick,
  onConfirmClick,
  onCopyClick,
  onDeleteClick,
  worksheetCreatedAt,
  //
  onCenterCheck,
  isCenterCheck,
}: {
  contractProductItem: TquotationProductItemDto;
  worksheetItem: TquotationProductItemDto;
  onAddClick: () => void;
  onConfirmClick: (parameters: {
    deliveryStatusId: string;
    employeeId?: string | undefined;
    outsourcingId?: string | undefined;
    installationDate: string;
    shippingDate: string;
    itemName: string;
    notes: string;
    installationItem: TdeliveryStatusInstallationItem | null;
  }) => Promise<void>;
  onCopyClick: (parameters: {
    employeeId?: string | undefined;
    outsourcingId?: string | undefined;
    installationDate: string;
    shippingDate: string;
    itemName: string;
    notes: string;
    installationItem: TdeliveryStatusInstallationItem | null;
  }) => Promise<void>;
  onDeleteClick: (deleverStatuId: string) => void;
  worksheetCreatedAt: string | null;
  //
  onCenterCheck: null | undefined | (() => void);
  isCenterCheck: boolean;
}): TrowProps => {
  const accessories_contract = contractProductItem.accessories;
  const { deliveryStatus, accessories } = worksheetItem;

  // ________________________________________________________
  // issue#485 選配要列出 工作表與合約有差異的項目
  // https://github.com/San-Jeou/sanjeou-erp-fe/issues/485
  // 工作表的選配是合約選配的子集合，所以有差異的項目其實就是合約有而工作表沒有的項目
  // 在工作表把項目去掉的意思應該是沒有要做吧，為什麼要列出沒有要做的項目?怪怪的
  const diff = _.differenceBy(accessories_contract, accessories, 'codeName');
  const accessoriesStr = diff?.map((a) => a.name).join('\n');

  // 原本的 // const accessoriesStr = accessories?.map((a) => a.name).join('\n');
  // ________________________________________________________

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
      installationItem,
    } = ds;

    const panelProps: Tpanel = {
      key: id,
      accessorie: accessoriesStr,
      installationDate: installationDate ?? '',
      shippingDate: shippingDate ?? '',
      installer_employeeArr: installerEmployees ?? [],
      installer_outsourcing: installerOutsourcing,
      itemName: itemName ?? '',
      notes: notes ?? '',
      installationItem: installationItem ?? '',
      onAddClick,
      onDeleteClick: () => {
        onDeleteClick(id);
      },
      onConfirmClick: async (parameters) => {
        await onConfirmClick({
          deliveryStatusId: id,
          ...parameters,
        });
      },
      onCopyClick: async (parameters) => {
        await onCopyClick({
          ...parameters,
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
      installer_employeeArr: undefined,
      installer_outsourcing: undefined,
      itemName: '',
      notes: '',
      installationItem: '',
      onAddClick,
      onDeleteClick: () => {},
      onConfirmClick: async () => {},
      onCopyClick: undefined,
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
      onCheckClick: onCenterCheck,
      isChecked: isCenterCheck,
    },
    rightPanelArr: rightPanelArr,
    // rightPanelArr: foo,
  };
};
