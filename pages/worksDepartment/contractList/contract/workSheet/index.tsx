import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import dayjs from 'dayjs';

import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';

// layer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';

import ProductCard, {
  Tcontrol_productCard,
  TworksheetIntro,
} from 'components/page/worksDepartment/contracList/contract/workSheet/productCard';
import RecordList, {
  Tcontrol_recordList,
  Trecord,
} from 'components/page/worksDepartment/contracList/contract/workSheet/recordList';

import WorkSheetPDF from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';
import WorkSheetPDF_02 from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal, { TinputModalProps } from 'components/global/gear/modal/simpleModal/inputModal_v2';

// api
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';
import {
  TupdateWorkSheet,
  TcreateWorksheetDto,
  TworksheetRecordDto_addition,
  apiPostWorkSheet,
  apiDeleteWorksheet,
  apiPatchWorkSheetProducts,
  useGetWorksheet_id,
  useApiGetWorksheetRecord_id,
} from 'js/api/api_engineering';

// hook
import { TquotationProductItemDto_old } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useWorksheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';

// css
import scss from './workSheet.module.scss';

// type
import type {
  TquotationProductItemDto,
  TerpFeatureDto,
  TquotationProductAccessoryDto,
  TworksheetRecordDto,
  TworksheetDto,
  TuserDto,
  TquotationProductDto,
} from 'js/api/dtoTypes';
import type { TworksheetDto_addition } from 'js/api/api_engineering';

// zustand // hook
import { useWorksheet } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useWorksheet';
import { useShallow } from 'zustand/react/shallow';
import WorksheetForm from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/form/productForm';

import { useGlobal_review } from 'hooks/globalState/useGlobal_review';
import { useGlobal_doorModel, TdoorModelDict } from 'hooks/globalState/useGlobal_doorModel';

import { useSpecialDoor } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useSpecialDoor';

import WorksheetForm_specialDoor from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/form/specialProdForm';
import WorksheetForm_w13456 from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/form/w13456Form';

import { useControl_pdf } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useControl_pdf';
import { useControl_profile } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useControl_profile';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ====================================================================

type Tquery = {
  contractId?: string | undefined;

  activeWorksheetId?: string | undefined;
  activedProdId?: string | undefined;
  activeRecordId?: string | undefined;
};

// MARK: START
// ====================================================================

export default function Worksheet({
  isAdmin,
  userErpFeature,
  userInfo,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
  userInfo: TuserDto;
}) {
  const { req_reviewBack, req_backThanAdd } = useGlobal_review();

  const { isReady, doorModelDict, checkIsSpecialDoor } = useGlobal_doorModel();

  // ----------------------------------------------------------------
  const ref_main = useRef<HTMLDivElement>(null!);
  // ----------------------------------------------------------------
  let havePermissionToEdit = false;
  isAdmin && (havePermissionToEdit = true);
  userErpFeature?.some((item) => {
    return item.name === '工務部-工作表編輯';
  }) && (havePermissionToEdit = true);

  const userId = userInfo?.employee?.id;

  // ----------------------------------------------------------------
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    contractId,
    //
    activeWorksheetId,
    activedProdId,
    activeRecordId,
  } = query;

  const isReadonly = router.route !== '/worksDepartment/contractList/contract/workSheet';

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [inputModalProps, setInputModalProps] = useState<Pick<TinputModalProps, 'onConfirm' | 'title'>>();

  const [isShowPdf, setIsShowPdf] = useState(false);
  const [isShowPdf02, setIsShowPdf02] = useState(false);

  // 資料裡面沒有property可供推斷該資料是否為最後的record，所以只能在這裡設狀態處裡
  // 這導致直接以網址到指定工作表時isLastestRecord一定是false而無法編輯
  const [isLastestRecord, setIsLastestRecord] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  const {
    data: contract,
    update: update_contract,
    isFetching: isFetching_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      'content.customer',
      'engineeringContact',
      'worksheet.latestRecord.reviewSalesEmployee',
      'worksheet.latestRecord.reviewManagerEmployee',

      'worksheet.latestRecord.contractProductItems.components',
      'worksheet.latestRecord.contractProductItems.accessories',
    ],
    addintion_latestRecordReview: true,
  });

  const {
    data: worksheetData,
    update: update_worksheetData,
    isLoading: isFetching_worksheetData,
  } = useGetWorksheet_id(activeWorksheetId, {
    recordsWithReview: true,
  });

  const {
    data: finalProduct = [],
    update: update_finalProduce,
    isLoading: isFetching_finalProduct,
  } = useGetContract_id_finalProductItem(contractId);

  const {
    data: activeRecordData,
    update: update_activeRecord,
    isLoading: isLoading_activeRecord,
    clear: clear_activeRecord,
  } = useApiGetWorksheetRecord_id(activeRecordId, { addition_reviewArr: true });

  const { engineeringContact, worksheet: worksheetArr = [] } = contract ?? {};

  const activedProd = useMemo(() => {
    return finalProduct.find((prod) => prod.id === activedProdId);
  }, [activedProdId, finalProduct]);

  const activeWorksheetOriginalAccessories: TquotationProductAccessoryDto[] = activedProd?.items?.[0].accessories ?? [];

  // -------------------------------------------------------------------------

  // region REQ

  const refreshData = async () => {
    return Promise.all([
      //
      update_contract(),
      update_finalProduce(),
      update_worksheetData(),
      update_activeRecord(),
    ]);
  };

  // apiPostWorkSheet
  const reqPostWorkSheet = async (body: TcreateWorksheetDto) => {
    if (isLoading || !body.contractProductItems || body.contractProductItems.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      await apiPostWorkSheet(body);
      await refreshData();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const reqAbandonWorkSheet = async (worksheetId: string) => {
    if (!contractId) {
      return;
    }

    const theWorksheet = worksheetArr.find((worksheet) => worksheet.id === worksheetId);

    if (!theWorksheet) {
      myAlert.err({ title: '工作表不存在於worksheetArr' });

      return;
    }

    const latestRecord = theWorksheet.latestRecord;

    try {
      setIsLoading(true);
      await apiDeleteWorksheet(worksheetId);

      await req_reviewBack(latestRecord.id, {
        showSuccess: false,
      });

      const isActive = activeWorksheetId === worksheetId;
      const newQuery = { ...query };

      if (isActive) {
        delete newQuery.activeWorksheetId;
        delete newQuery.activedProdId;
        delete newQuery.activeRecordId;
      }

      router.replace({
        query: newQuery,
      });

      await refreshData();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const reqPatchWorkSheet = async (body: TupdateWorkSheet | undefined | null) => {
    const document_status = activeRecordData!.addition?.reviewArr?.[0].document_status;
    const worksheetId = worksheetData?.id;

    if (!worksheetId) {
      myAlert.err({ title: '工作表ID不存在' });

      return;
    }

    if (!body) {
      myAlert.err({ title: '工作表資料有誤' });

      return;
    }

    try {
      setIsLoading(true);
      await apiPatchWorkSheetProducts(worksheetId, body);

      if (document_status === '審核中' || document_status === '駁回') {
        await req_reviewBack(activeRecordData!.id, { showSuccess: false });
      }

      await refreshData();
      setDisabled(true);
      ref_main.current.scrollIntoView();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 送審
  const rewSubmitWorksheet = async ({ review_id, document_title }: { review_id: string; document_title: string }) => {
    //

    if (!activeRecordId || !userId) {
      return;
    }

    const body: Parameters<typeof req_backThanAdd>[0] = {
      review_id: review_id,
      document_uuid: activeRecordId,
      document_type: '工作表',
      user_id: userId,
      document_title,
      query,
    };

    try {
      await req_backThanAdd(body);
    } catch (error) {}

    await refreshData();
  };

  // -------------------------------------------------------------------------
  // region control
  const control_profile = useControl_profile(engineeringContact);

  const { control_productCardArr, latestRecordArr } = useProductCard({
    doorModelDict,
    finalProduct,
    worksheetArr,
    activeWorksheetId,
    setDisabled,
    setIsLastestRecord,
    isReadonly,
    reqAbandonWorkSheet,
    setInputModalProps,
    contractId,
    reqPostWorkSheet,
    checkIsSpecialDoor,
  });

  const control_recordList: Tcontrol_recordList = useRecordList({
    worksheetData,
    setIsLastestRecord,
  });

  // ________________________________________________________________________
  // ________________________________________________________________________

  // MARK: control_workSheetPDF

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useControl_pdf({
    contractNumber: contract?.contractNumber ?? '',
    customerName: contract?.content.customer?.name ?? '',
    contactPerson: engineeringContact?.contactInfo?.[0]?.contactPerson ?? '',
    control_profile,
    latestRecordArr,
  });

  // -------------------------------------------------------------------------

  // region panelList

  let panelList_notAllow: TpanelList = [
    {
      type: 'myButton',
      label: '關閉工作表',
      onClick: () => {
        router.replace({
          query: {
            ...query,
            activeRecordId: undefined,
          },
        });

        setIsLastestRecord(false);
      },
    },
  ];

  if (isLastestRecord) {
    panelList_notAllow.splice(-1, 0, {
      type: 'redButton',
      label: '送審',
      onClick: () => {
        const { destroy } = ReviewFlowSelector.open2({
          userId,
          onConfirm: ({ reviewFlowId, purpose }) => {
            reviewFlowId &&
              rewSubmitWorksheet({
                review_id: reviewFlowId,
                document_title: purpose,
              });
            destroy();
          },
        });
      },
    });
  }

  if (isLastestRecord) {
    panelList_notAllow.splice(-1, 0, {
      type: 'myButton',
      label: havePermissionToEdit ? '編輯工作表' : '沒有編輯權限',
      onClick: () => {
        if (havePermissionToEdit) {
          setDisabled(false);
        }
      },
    });
  }

  if (!activeRecordData) {
    panelList_notAllow = [
      {
        type: 'myButton',
        label: '匯出EXCEL',
        onClick: () => downloadExcel(control_workSheetPDF_01, `工作表_${control_profile.projectName.value}`),
      },
      {
        type: 'myButton',
        label: '匯出廠務部工作表',
        onClick: () => setIsShowPdf02(true),
      },
      {
        type: 'myButton',
        label: '匯出工作表',
        onClick: () => setIsShowPdf(true),
      },
    ];
  }

  const panelList_allow: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  panelList_notAllow.push(...usePanel_returnWorksDepartmentContractList());

  const panelList = disabled ? panelList_notAllow : panelList_allow;

  // -----------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([
        //
        update_contract(),
        update_finalProduce(),
        // update_doorModel(),
      ]);
      setIsLoading(false);
    })();
  }, [contractId]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await update_worksheetData();
      setIsLoading(false);
    })();
  }, [activeWorksheetId]);

  useEffect(() => {
    if (activeRecordId) {
      update_activeRecord();
    } else {
      clear_activeRecord();
    }
  }, [activeRecordId]);

  // -----------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer
      isLoading_all={
        isLoading ||
        isFetching_contract ||
        isLoading_activeRecord ||
        isFetching_worksheetData ||
        isFetching_finalProduct
      }
    >
      <div>
        <PageHeader02 tag={`報價編號 ${engineeringContact?.contractNumber ?? ''}`} panelList={panelList} />
        {!isReadonly && <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />}
      </div>

      <div>
        <WorkSheetProfile control={control_profile} disabled={true} />
        <div className={scss.subTitle}>工程項目</div>
        <div ref={ref_main} className={scss.main}>
          {/* left */}
          <div className={scss.left}>
            {control_productCardArr.map((control_productCard, index) => {
              return (
                <div key={control_productCard.id}>
                  <ProductCard control={control_productCard} />
                </div>
              );
            })}
          </div>

          {/* right */}
          {/* targetSheet */}
          <div className={classNames(scss.right)}>
            {activeWorksheetId && !activeRecordData && <RecordList control={control_recordList} />}
            {/* {activeRecordData && <WorksheetForm reqPatchWorkSheet={reqPatchWorkSheet} disabled={disabled} />} */}
            {activeRecordData && (
              <TheWorksheetForm
                activeRecordData={activeRecordData}
                activeWorksheetId={activeWorksheetId}
                activeWorksheetOriginalAccessories={activeWorksheetOriginalAccessories}
                disabled={disabled}
                onConfirm={reqPatchWorkSheet}
                // state_specialDoor={state_specialDoor}
                // setState_specialDoor={setState_specialDoor}
                // customLabel={customLabel}
              />
            )}
          </div>
          {/* right */}
        </div>
        {/* main */}
      </div>
      <InputModal
        open={!!inputModalProps}
        title={inputModalProps?.title ?? ''}
        onConfirm={inputModalProps?.onConfirm}
        placeholder="請輸入分配數量"
        onCancel={() => setInputModalProps(undefined)}
        inputAttr={{
          type: 'number',
        }}
      />
      <WorkSheetPDF isShow={isShowPdf} onCancel={() => setIsShowPdf(false)} control={control_workSheetPDF_01} />
      <WorkSheetPDF_02 isShow={isShowPdf02} onCancel={() => setIsShowPdf02(false)} control={control_workSheetPDF_02} />
    </SubLayer>
  );
}

// MARK:END
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

const polyfillContractProductItems = (pre_contractProductItems: TquotationProductItemDto[]) => {
  const contractProductItems = pre_contractProductItems.map((item) => {
    return {
      ...item,
      gapA: item.gapA ?? '0',
      gapC: item.gapC ?? '0',
      boxD: item.boxD ?? 0,
      thickness: item.thickness ?? '0',
    };
  });

  return contractProductItems;
};
// ==========================================================================

// MARK:TheWorksheetForm
const TheWorksheetForm = ({
  activeRecordData,
  disabled,
  activeWorksheetId,
  activeWorksheetOriginalAccessories,
  onConfirm,
}: {
  activeRecordData: TworksheetRecordDto_addition | undefined;
  disabled: boolean;
  activeWorksheetId: string | undefined | null;
  activeWorksheetOriginalAccessories: TquotationProductAccessoryDto[];
  onConfirm: (body: TupdateWorkSheet | undefined | null) => void;
}) => {
  const { parseDoorModelSort } = useGlobal_doorModel();

  const doorModelSort = parseDoorModelSort(activeRecordData?.contractProductItems?.[0].doorModelName ?? 'undefined');

  // -------------------------------------------------------------------------------------

  const {
    state_specialDoor,
    setState_specialDoor,
    createBody,
    invalidKeyArr,
    readonlyKeyArr,
    isValid: isValid_specialProd,
  } = useSpecialDoor({
    activeRecordData,
    disabled,
  });

  const worksheetExport = useWorksheet(
    useShallow((state) => ({
      worksheetId: state.worksheetId,
      getUpdateWorkSheetItemArr: state.getUpdateWorkSheetItemArr,
      getFloorLocations: state.getFloorLocations,
      init: state.init,
    }))
  );

  // -------------------------------------------------------------------------------------

  const theOnConfirm = () => {
    const body = (() => {
      if (doorModelSort === 'normal') {
        const contractProductItems = worksheetExport.getUpdateWorkSheetItemArr();
        const floorLocations = worksheetExport.getFloorLocations();

        if (!contractProductItems || !floorLocations) {
          console.error('contractProductItems', contractProductItems);
          console.error('floorLocations', floorLocations);

          return null;
        }

        return {
          contractProductItems,
          floorLocations,
        };
      } else {
        if (isValid_specialProd === false) {
          return null;
        }

        return createBody();
      }
    })();

    onConfirm(body);
  };

  useEffect(() => {
    if (doorModelSort === 'normal' && disabled && activeRecordData) {
      const contractProductItems = activeRecordData.contractProductItems;

      worksheetExport.init({
        worksheetId: activeWorksheetId!,
        itemIdArr: contractProductItems?.map((item) => item.id) ?? [],
        contractProductItem: contractProductItems?.[0] as TquotationProductItemDto_old,
        contractProductItemArr: (contractProductItems ?? []) as TquotationProductItemDto_old[],
        qty: contractProductItems?.length ?? 0,
        originalAccessories: activeWorksheetOriginalAccessories,
      });
    }
  }, [activeRecordData, disabled, doorModelSort]);

  // -------------------------------------------------------------------------

  if (doorModelSort === undefined) {
    return null;
  }

  if (doorModelSort === 'w13456') {
    return (
      <WorksheetForm_w13456
        disabled={disabled}
        state_specialDoor={state_specialDoor}
        setState_specialDoor={setState_specialDoor}
        onConfirm={theOnConfirm}
        invalidKeyArr={invalidKeyArr}
        readonlyKeyArr={readonlyKeyArr}
      />
    );
  }

  if (doorModelSort === 'special') {
    return (
      <WorksheetForm_specialDoor
        disabled={disabled}
        state_specialDoor={state_specialDoor}
        setState_specialDoor={setState_specialDoor}
        onConfirm={theOnConfirm}
      />
    );
  }

  return <WorksheetForm reqPatchWorkSheet={theOnConfirm} disabled={disabled} />;
};

// MARK:useProductCard
const useProductCard = ({
  doorModelDict,
  finalProduct,
  worksheetArr,
  activeWorksheetId,
  setDisabled,
  setIsLastestRecord,
  isReadonly,
  reqAbandonWorkSheet,
  setInputModalProps,
  contractId,
  reqPostWorkSheet,
  checkIsSpecialDoor,
}: {
  doorModelDict: TdoorModelDict | null | undefined;
  finalProduct: TquotationProductDto[];
  worksheetArr: TworksheetDto[];
  activeWorksheetId: string | undefined;
  setDisabled: (value: React.SetStateAction<boolean>) => void;
  setIsLastestRecord: (value: React.SetStateAction<boolean>) => void;
  isReadonly: boolean;
  reqAbandonWorkSheet: (worksheetId: string) => Promise<void>;
  setInputModalProps: (value: React.SetStateAction<Pick<TinputModalProps, 'title' | 'onConfirm'> | undefined>) => void;
  contractId: string | undefined;
  reqPostWorkSheet: (body: TcreateWorksheetDto) => Promise<void>;
  checkIsSpecialDoor: (doorModelName: string) => boolean;
}) => {
  const router = useRouter();
  const query = router.query;

  const { control_productCardArr, latestRecordArr } = useMemo(() => {
    //
    const control_productCardArr: (Tcontrol_productCard & { id: string })[] = [];
    // const latestRecordArr: TworksheetRecordDto[] = [];
    const latestRecordArr: (TworksheetRecordDto & { parentId: string; parentItemName: string })[] = [];
    const worksheetList: { [id: string]: TworksheetDto } = {};

    if (!doorModelDict) {
      return {
        control_productCardArr,
        latestRecordArr,
      };
    }

    const sortedFinelProd = _.sortBy(finalProduct, 'order');

    worksheetArr.forEach((worksheet) => {
      if (worksheet.isAbandoned) {
        return;
      }

      worksheetList[worksheet.id] = worksheet;
    });

    sortedFinelProd.forEach((prod) => {
      const prodQty = String(prod.quantity ?? 0);
      const prodWidth = new Decimal(prod.fullWidth).div(1000).toString();
      const pridHeight = new Decimal(prod.height).div(1000).toString();

      const prodWorkSheetList: { [key: string]: TworksheetDto_addition } = {};
      const itemsNoWorksheet: TquotationProductItemDto[] = [];

      if (prodQty === '0') {
        return;
      }

      // ----------------------------------------------
      prod.items?.forEach((item) => {
        const worksheetId = item.worksheetId;

        if (worksheetId && worksheetList[worksheetId]) {
          prodWorkSheetList[worksheetId] = worksheetList[worksheetId];
        } else {
          itemsNoWorksheet.push(item);
        }
      });

      const worksheetIntroArr: TworksheetIntro[] = Object.values(prodWorkSheetList).map((worksheet) => {
        const { latestRecord } = worksheet;

        latestRecordArr.push({
          ...latestRecord,
          parentId: prod.id,
          parentItemName: prod.itemName,
        });

        const {
          contractProductItems,

          addition: { reviewArr } = {},
        } = latestRecord;

        const contractProductItem = contractProductItems?.[0];

        const width_m = new Decimal(contractProductItem?.fullWidth ?? 0).div(1000).toString();
        const height_m = new Decimal(contractProductItem?.height ?? 0).div(1000).toString();

        const reviewStatus = (() => {
          const reviewStatus: TworksheetIntro['reviewStatus'] = {
            label: '未送審',
            dotColor: 'gray',
          };

          const review = reviewArr?.[0];

          if (review) {
            let currentStageIndex = Number(review.current_stage);
            review.document_status === '核准' && (currentStageIndex = review.stages.length - 1);
            const currentStage = review.stages[currentStageIndex];

            const reviewAt_timeStamp = dayjs(currentStage.review_time).unix();
            const isReviewed = reviewAt_timeStamp > 0;

            reviewStatus.label = currentStage.review_person;
            reviewStatus.dotColor = !isReviewed ? 'red' : 'green';
          }

          return reviewStatus;
        })();

        const intro: TworksheetIntro = {
          worksheetId: worksheet.id,
          itemName: contractProductItem?.itemName,
          doorModelName: contractProductItem?.doorModelName,
          width: width_m,
          height: height_m,
          qty: String(contractProductItems?.length),
          isActive: activeWorksheetId === worksheet.id,
          reviewStatus,
          onClick: () => {
            router.replace({
              query: {
                ...query,
                activeWorksheetId: worksheet.id,
                activedProdId: prod.id,
                activeRecordId: undefined,
              },
            });

            setDisabled(true);
            setIsLastestRecord(false);
          },
          onDeleteClick: isReadonly
            ? undefined
            : () => {
                myAlert.confirm({
                  title: '確定刪除工作表?',

                  props: {
                    onOk: async () => {
                      await reqAbandonWorkSheet(worksheet.id);
                    },
                  },
                });
              },
        };

        return intro;
      });

      control_productCardArr.push({
        id: prod.id,
        itemName: prod.itemName,
        doorModelName: prod.doorModelName,
        qty: prodQty,
        width: prodWidth,
        height: pridHeight,
        onSeparateClick: isReadonly
          ? undefined
          : () => {
              setInputModalProps({
                title: `可分配數量${itemsNoWorksheet.length}`,
                onConfirm: async (str) => {
                  const qty = Number(str);

                  if (qty > itemsNoWorksheet.length) {
                    return myAlert.info({ title: '分配數量超過可分配數量' });
                  }

                  const pre_contractProductItems = itemsNoWorksheet.slice(0, qty);

                  const contractProductItems = polyfillContractProductItems(pre_contractProductItems);

                  const body: TcreateWorksheetDto = {
                    contractId,
                    contractProductItems,
                  };

                  await reqPostWorkSheet(body);
                  setInputModalProps(undefined);
                },
              });
            },
        worksheetIntroArr,
        isSpecialDoor: checkIsSpecialDoor(prod.doorModelName),
      });
    });

    return { control_productCardArr, latestRecordArr, doorModelDict };
    //
  }, [activeWorksheetId, finalProduct, worksheetArr]);

  return {
    control_productCardArr,
    latestRecordArr,
  };
};

// MARK:useRecordList
const useRecordList = ({
  worksheetData,
  setIsLastestRecord,
}: {
  worksheetData: TworksheetDto_addition | undefined;
  setIsLastestRecord: (value: React.SetStateAction<boolean>) => void;
}) => {
  const router = useRouter();
  const query = router.query;

  const control_recordList: Tcontrol_recordList = useMemo(() => {
    const records = _.sortBy(worksheetData?.records, 'version').reverse();

    const recordArr: Trecord[] = records.map((record, index) => {
      const {
        contractProductItems,
        agentEmployee, // 開立
        addition: { reviewArr } = {},
      } = record;

      const contractProductItem = contractProductItems?.[0];
      const {
        //
        itemName = '',
        doorModelName = '',
        fullWidth = '0',
        height = '0',
        materialName = '',
        isAntiTyphoon = false,
      } = contractProductItem ?? {};

      const qty = contractProductItems?.length ?? 0;

      const fullWidth_m = new Decimal(fullWidth).div(1000).toString();
      const height_m = new Decimal(height).div(1000).toString();

      const control_record: Trecord = {
        itemName,
        doorModel: doorModelName ?? '',
        fullWidth: fullWidth_m,
        height: height_m,
        qty: String(qty),
        material: materialName,
        isAntiTyphoon: isAntiTyphoon ?? false,
        agent: agentEmployee?.chName ?? '',
        reviewFlowData: reviewArr,

        onDetailClick: () => {
          router.replace({
            query: {
              ...query,
              activeRecordId: record.id,
            },
          });

          if (index === 0) {
            setIsLastestRecord(true);
          }
        },
      };

      return control_record;
    });

    return { recordArr };
  }, [worksheetData]);

  return control_recordList;
};
