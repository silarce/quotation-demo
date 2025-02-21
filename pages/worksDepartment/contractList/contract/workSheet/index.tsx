import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import moment from 'moment';

import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';

// layer
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';

import ProductCard, {
  Tcontrol_productCard,
  TworksheetIntro,
} from 'components/page/worksDepartment/worksheet/productCard';
import RecordList, { Tcontrol_recordList, Trecord } from 'components/page/worksDepartment/worksheet/recordList';

import WorkSheetPDF, {
  Tcontrol_workSheetPDF_01,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';
import WorkSheetPDF_02, {
  Tcontrol_workSheetPDF_02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal, { TinputModalProps } from 'components/global/gear/modal/simpleModal/inputModal_v2';

// api
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';
import {
  TcreateWorksheetDto,
  TworksheetRecordDto_addition,
  apiPostWorkSheet,
  apiDeleteWorksheet,
  apiPatchWorkSheetProducts,
  useGetWorksheet_id,
  useApiGetWorksheetRecord_id,
} from 'js/api/api_engineering';

import { useApiGetProdDoorModels, useGetAssetDict, apiGetAsset } from 'js/api/api_product';

// hook
import { TquotationProductItemDto_old } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { calcFullHeight, calcAngleIronSize } from 'js/utils/product/calc';
import { lookup_motorPhase, getProductHeadBoxImgUrl } from 'config/product/lookup';

// css
import scss from './workSheet.module.scss';

// type
import type {
  TengineeringContactDto,
  TquotationProductItemDto,
  TerpFeatureDto,
  TquotationProductAccessoryDto,
  TworksheetRecordDto,
  TquotationProductComponentDto,
  TworksheetDto,
  TuserDto,
} from 'js/api/dtoTypes';
import type { TworksheetDto_addition } from 'js/api/api_engineering';

// zustand // hook
import { useWorksheet } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';
import { useShallow } from 'zustand/react/shallow';
import WorksheetForm from './WorksheetForm';

import { useGlobal_review } from 'hooks/globalState/useGlobal_review';
import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

import {
  useSpecialDoor,
  Tstate_specialDoor,
} from 'components/page/worksDepartment/worksheet/productForm/useSpecialDoor';

import WorksheetForm_specialDoor from 'components/page/worksDepartment/worksheet/productForm/worksheetForm_specialDoor';

// ====================================================================

type Tquery = {
  contractId?: string | undefined;

  activeWorksheetId?: string | undefined;
  activedProdId?: string | undefined;
  activeRecordId?: string | undefined;
};

type TcomponentList = {
  [key: string]: TquotationProductComponentDto | undefined;
};

// ====================================================================

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

  const [isLastestRecord, setIsLastestRecord] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      'content.customer',
      'engineeringContact',
      'worksheet.latestRecord.reviewSalesEmployee',
      'worksheet.latestRecord.reviewManagerEmployee',
      // 為了使用useControl_pdf，在useGetContract_id的populate中
      // 設置了
      // 'worksheet.latestRecord.contractProductItems.components'
      // 'worksheet.latestRecord.contractProductItems.accessories'
      // 未來可能會有效能的問題
      'worksheet.latestRecord.contractProductItems.components',
      'worksheet.latestRecord.contractProductItems.accessories',
    ],
    addintion_latestRecordReview: true,
  });

  const { data: worksheetData, update: update_worksheetData } = useGetWorksheet_id(activeWorksheetId, {
    recordsWithReview: true,
  });

  const { data: finalProduct = [], update: update_finalProduce } = useGetContract_id_finalProductItem(contractId);

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

  const worksheetExport = useWorksheet(
    useShallow((state) => ({
      worksheetId: state.worksheetId,
      getUpdateWorkSheetItemArr: state.getUpdateWorkSheetItemArr,
      getFloorLocations: state.getFloorLocations,
    }))
  );

  const isSpecialDoor = (() => {
    const doorModelName = activeRecordData?.contractProductItems?.[0].doorModelName;

    return doorModelName ? checkIsSpecialDoor(doorModelName) : true;
  })();

  // -------------------------------------------------------------------------

  const { state_specialDoor, setState_specialDoor, createBody, customLabel } = useSpecialDoor({
    activeRecordData,
    disabled,
  });

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

  const reqPatchWorkSheet = async () => {
    const document_status = activeRecordData!.addition?.reviewArr?.[0].document_status;
    const worksheetId = worksheetData?.id;

    if (!worksheetId) {
      myAlert.err({ title: '工作表ID不存在' });

      return;
    }

    console.log(isSpecialDoor);

    const body = (() => {
      if (isSpecialDoor) {
        return createBody();
      } else {
        const contractProductItems = worksheetExport.getUpdateWorkSheetItemArr();
        const floorLocations = worksheetExport.getFloorLocations();

        if (!contractProductItems || !floorLocations) {
          console.error(contractProductItems);
          console.error(floorLocations);

          return null;
        }

        return {
          contractProductItems,
          floorLocations,
        };
      }
    })();

    if (!body) {
      myAlert.err({ title: '工作表資料有誤' });

      return;
    }

    try {
      setIsLoading(true);
      // await apiPatchWorkSheetProducts(worksheetExport.worksheetId, body);
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
      document_id: '',
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
  // ________________________________________________________________________
  // ________________________________________________________________________

  const { control_productCardArr, latestRecordArr } = useMemo(() => {
    const control_productCardArr: (Tcontrol_productCard & { id: string })[] = [];
    const latestRecordArr: TworksheetRecordDto[] = [];

    if (!doorModelDict) {
      return {
        control_productCardArr,
        latestRecordArr,
      };
    }

    const worksheetList: { [id: string]: TworksheetDto } = {};

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

        latestRecordArr.push(latestRecord);

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

            const reviewAt_timeStamp = moment(currentStage.review_time).unix();
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
  // ________________________________________________________________________
  // ________________________________________________________________________
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
  // ________________________________________________________________________
  // ________________________________________________________________________

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
    <SubLayer isLoading_all={isLoading}>
      {!isReadonly && (
        <PageHeader
          returnBtn={disabled}
          panelList={panelList}
          contractNumber={engineeringContact?.contractNumber ?? ''}
        />
      )}

      {isReadonly && <PageHeader02 tag={engineeringContact?.contractNumber ?? ''} panelList={panelList} />}

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
                reqPatchWorkSheet={reqPatchWorkSheet}
                disabled={disabled}
                state_specialDoor={state_specialDoor}
                setState_specialDoor={setState_specialDoor}
                customLabel={customLabel}
              />
            )}
          </div>
          {/* right */}
        </div>
        {/* main */}
      </div>
      <InputModal
        visible={!!inputModalProps}
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

// MARK:TheWorksheetForm
const TheWorksheetForm = ({
  activeRecordData,
  reqPatchWorkSheet,
  disabled,
  activeWorksheetId,
  activeWorksheetOriginalAccessories,
  //
  state_specialDoor,
  setState_specialDoor,
  customLabel,
}: {
  activeRecordData: TworksheetRecordDto_addition | undefined;
  reqPatchWorkSheet: () => void;
  disabled: boolean;
  activeWorksheetId: string | undefined;
  activeWorksheetOriginalAccessories: TquotationProductAccessoryDto[];
  //
  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
  customLabel: {
    surface?: string;
  };
}) => {
  const { isReady, doorModelDict, checkIsSpecialDoor } = useGlobal_doorModel();

  const doorModelName = activeRecordData?.contractProductItems?.[0].doorModelName;
  const isSpecialDoor = !!doorModelName && checkIsSpecialDoor(doorModelName);

  const init = useWorksheet((state) => state.init);

  // zustand 狀態
  useEffect(() => {
    if (isSpecialDoor) {
      return;
    }

    if (disabled && activeRecordData) {
      const contractProductItems = activeRecordData.contractProductItems;

      init({
        worksheetId: activeWorksheetId!,
        itemIdArr: contractProductItems?.map((item) => item.id) ?? [],
        contractProductItem: contractProductItems?.[0] as TquotationProductItemDto_old,
        contractProductItemArr: (contractProductItems ?? []) as TquotationProductItemDto_old[],
        qty: contractProductItems?.length ?? 0,
        originalAccessories: activeWorksheetOriginalAccessories,
      });
    }
  }, [activeRecordData, disabled, isSpecialDoor]);

  // -------------------------------------------------------------------------

  if (!doorModelDict) {
    return null;
  }

  if (isSpecialDoor) {
    return (
      <WorksheetForm_specialDoor
        disabled={disabled}
        state_specialDoor={state_specialDoor}
        setState_specialDoor={setState_specialDoor}
        onConfirm={reqPatchWorkSheet}
        customLabel={customLabel}
      />
    );
  }

  return <WorksheetForm reqPatchWorkSheet={reqPatchWorkSheet} disabled={disabled} />;
};

// ====================================================================

// MARK:useControl_profile

const useControl_profile = (engineeringContact: TengineeringContactDto | undefined | null): Tcontrol_profile => {
  const control_profile = useMemo(() => {
    const {
      //
      projectName = '',
      projectContent = '',
      projectNumber = '',
      projectPrincipal = '',
      constructionSitePrincipalContactNumber = '',
      constructionSiteFaxNumber = '',
      constructionSiteContactNumber = '',
      contractor = '',
      contractorPrincipal = '',
      contractorContactNumber = '',
      contractorFaxNumber = '',
      county = '',
      district = '',
      address = '',
    } = engineeringContact ?? {};

    const control_profile: Tcontrol_profile = {
      projectName: {
        value: projectName,
      },
      projectContent: {
        value: projectContent,
      },
      // 有空時把key改成projectPhoneNumber
      projectNumber: {
        // value: profile.projectNumber,
        value: constructionSiteContactNumber,
      },
      projectFaxNumber: {
        value: constructionSiteFaxNumber,
      },
      projectPerson: {
        value: projectPrincipal,
      },
      projectPersonNumber: {
        value: constructionSitePrincipalContactNumber,
      },
      allAddress: {
        value: `${county}${district}${address}`,
      },
      engineeringNumber: {
        value: projectNumber,
      },
      contractor: {
        value: contractor,
      },
      principal: {
        value: contractorPrincipal,
      },
      contactNumber: {
        value: contractorContactNumber,
      },
      faxNumber: {
        value: contractorFaxNumber,
      },
    };

    return control_profile;
  }, [engineeringContact]);

  return control_profile;
};

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

// MARK:useControl_pdf
const useControl_pdf = ({
  contractNumber,
  customerName,
  contactPerson,
  control_profile,
  latestRecordArr,
}: {
  contractNumber: string;
  customerName: string;
  contactPerson: string;
  control_profile: Tcontrol_profile;
  latestRecordArr: TworksheetRecordDto[];
}) => {
  const { assetDict, updatePath } = useGetAssetDict<string>();

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
    const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];

    latestRecordArr.forEach((record) => {
      if (!record.contractProductItems) {
        return;
      }

      const item = record.contractProductItems[0];

      const { motorVoltage, motorPhase, components, accessories } = item;

      const componentList = (() => {
        const list: TcomponentList = {};
        components.forEach((component) => {
          list[component.type] = component;
        });

        return list;
      })();

      const acceNameArr = accessories.map((acce) => acce.name);

      const phaseVoltage = `${lookup_motorPhase[String(motorPhase) as '1' | '3'] ?? ''} ${motorVoltage}V`;

      const material = (() => {
        if (item.doorModelName !== 'SJ-305D') {
          return componentList.slat?.material ?? '';
        } else if (
          componentList.slat?.material === 'SST管1.0T' ||
          componentList.slat?.material === '內SST管外SST管1.0T'
        ) {
          return 'SST';
        } else {
          return componentList.slat?.material ?? '';
        }
      })();

      const {
        headBox1: url_headBox1,
        headBox2: url_headBox2,
        headBoxTopCover: url_headBoxTopCover,
        headBoxCover: url_headBoxCover,
      } = getProductHeadBoxImgUrl({
        isIntegratedHeadBox: !!item.isIntegratedHeadBox,
        hasWheel: !!item.hasWheel,
        headBoxTopCover: !!item.headBoxTopCover,
        headBoxCover: item.headBoxCover,
      });

      const control_item: Tcontrol_workSheetPDF_01['itemArr'][number] = {
        itemName: item.itemName,
        size: {
          qty: String(record.contractProductItems.length ?? 0),
          doorModelName: item.doorModelName,
          fullWidth: String(item.fullWidth),
          height: String(item.height),
          WG: String(item.WG),
          gapA: item.gapA ?? '0',
          gapC: item.gapC ?? '0',
          /**支版尺寸 boxB*boxD */
          BD: `${item.boxB}*${item.boxD}`,
          /**捲門全高 */
          fullHeight: String(calcFullHeight({ height: Number(item.height), boxB: item.boxB })),
          weightConversion: '', // 未知 // 重量換算 沒有在任一表單顯示
        },
        roller: {
          diameter: item.diameter ? `${item.diameter}"` : '', // 要有 " 符號，代表吋
          bearingInnerDiameter: item.bearingInnerDiameter ?? '',
          bearingName: item.bearingName ?? '',
          bearingHousingTotalLength: item.bearingHousingTotalLength ?? '',
          bearingHousingSize: String(item.bearingHousingSize ?? ''),
        },
        headBox: {
          angleIronQty: String(item.headBoxAngleIronQuantity ?? ''),
          angleIronSize: String(
            calcAngleIronSize({
              WG: Number(item.WG),
              gapA: Number(item.gapA),
              gapC: Number(item.gapC),
            })
          ),
          // form: sheet.headBoxForm_str,
          form: item.isIntegratedHeadBox ? '一體式捲箱' : '捲箱 + 機箱',
          surface: componentList.headBox?.materialSurface ?? '',

          headBoxCover: item.headBoxCover === 'full' ? '全遮' : item.headBoxCover === 'half' ? '半遮' : '無',
          headBoxTopCover: item.headBoxTopCover ? '有' : '無',
          hasWheel: item.hasWheel ? '有' : '無',
          headBoxSizeB: item.boxB,
          headBoxSizeD: item.boxD,
          headBoxSizeX: item.headBoxSizeX,
          headBoxSizeY: item.headBoxSizeY,
          headBoxSizeM: item.headBoxSizeM,
          headBoxSizeN: item.headBoxSizeN,
          headBoxSizeO: item.headBoxSizeO,
          headBoxSizeP: item.headBoxSizeP,
          headBoxSizeQ: item.headBoxSizeQ,
          // imgUrl1: url_headBox1.url,
          // imgUrl2: url_headBox2.url,
          // imgUrl3: url_headBoxTopCover.url,
          // imgUrl4: url_headBoxCover.url,

          svgString1: assetDict[url_headBox1.name || 'null'] || null,
          svgString2: assetDict[url_headBox2.name || 'null'] || null,
          svgString3: assetDict[url_headBoxTopCover.name || 'null'] || null,
          svgString4: assetDict[url_headBoxCover.name || 'null'] || null,
        },
        doorPiece: {
          material: material,
          surface: componentList.slat?.materialSurface ?? '',
          thickness: item.thickness ?? '',
          slatLength: String(item.slatLength ?? '0'),
          slatCount: String(item.slatCount ?? '0'),
          antyTyphoonHook: item.isAntiTyphoon ? '有' : '無',
        },
        motor: {
          vendor: item.motorVendor ?? '',
          /**相數加電壓 */
          phaseVoltage: phaseVoltage,
          horsepower: item.horsepower,
          direction: '', // 未知 // 在廠務部工作表 電動機方向
        },
        guideRail: {
          form: item.isAntiTyphoon ? '防颱' : '一般',
          material: componentList.guideRail?.material ?? '',
          guideRailLength: String(item.guideRailLength ?? ''),
          guideRailName: item.guideRail ?? '',
          icon: item?.guideRail
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${item?.guideRail}`
            : undefined,
          antiTyphoonHook: '-50', // 未知 // 在廠務部工作表
          bendStraight: item.guideRailType ?? '',
          surface: componentList.guideRail?.materialSurface ?? '',
          dangerSvg: assetDict[item?.guideRail || 'null'] || undefined,
        },
        chainCog: {
          sprocketWheelModel: item.sprocketWheelModel ?? '',
          sprocketWheelTeethNumber: item.sprocketWheelTeethNumber ?? '',
          bearingInnerDiameter: item.bearingInnerDiameter ?? '',
          teethQuantity: '', // 未知 // 在廠務部工作表 齒數
          centerDistance: '', // 未知 // 在廠務部工作表 中心距
          eyesQuantity: '', // 未知 // 在廠務部工作表 目數
        },
        base: {
          material: componentList.bottomBar?.material ?? '',
          guideRailsOpening: String(item.guideRailsOpening ?? ''),
          surface: componentList.bottomBar?.materialSurface ?? '', // 未知 在廠務部工作表
        },
        sidePlate: {
          direction: item.sidePlateDirection ?? '',
          bigSidePlate: `${item.boxB}*${item.boxD}`,
          smallSidePlate: `${item.boxB}*${item.boxB}`,
        },
        memo: acceNameArr.length > 0 ? acceNameArr.join('、') : '',
      };
      workSheetPDF_01_itemArr.push(control_item);
    });

    const control_workSheetPDF_01: Tcontrol_workSheetPDF_01 = {
      info: {
        contractNumber: contractNumber,
        projectName: control_profile.projectName.value,
        projectAddress: control_profile.allAddress.value,
        customerName: customerName,
        contactPerson: contactPerson,
        // 開單日
        billingDate: getTaiwanDateStr(new Date().toISOString()) ?? '', // 未知
        // 出貨日
        shippingDate: '', // 未知
      },
      itemArr: workSheetPDF_01_itemArr,
    };

    let totalQty_PDF_02 = 0;
    workSheetPDF_01_itemArr.forEach((item) => {
      totalQty_PDF_02 = totalQty_PDF_02 + Number(item.size.qty);
    });
    const control_workSheetPDF_02: Tcontrol_workSheetPDF_02 = {
      info: {
        projectName: control_profile.projectName.value,
        totalQty: String(totalQty_PDF_02),
      },
      itemArr: workSheetPDF_01_itemArr,
    };

    return {
      control_workSheetPDF_01,
      control_workSheetPDF_02,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    //
    contractNumber,
    customerName,
    contactPerson,
    control_profile,
    latestRecordArr,
    assetDict,
  ]);

  useEffect(() => {
    latestRecordArr.forEach((record) => {
      if (!record.contractProductItems) {
        return;
      }

      const item = record.contractProductItems[0];

      const { headBox1, headBox2, headBoxTopCover, headBoxCover } = getProductHeadBoxImgUrl({
        isIntegratedHeadBox: !!item.isIntegratedHeadBox,
        hasWheel: !!item.hasWheel,
        headBoxTopCover: !!item.headBoxTopCover,
        headBoxCover: item.headBoxCover,
      });

      const parameter: Parameters<typeof updatePath>[0] = {};
      headBox1.url && headBox1.name && (parameter[headBox1.name] = headBox1.url);
      headBox2.url && headBox2.name && (parameter[headBox2.name] = headBox2.url);
      headBoxTopCover.url && headBoxTopCover.name && (parameter[headBoxTopCover.name] = headBoxTopCover.url);
      headBoxCover.url && headBoxCover.name && (parameter[headBoxCover.name] = headBoxCover.url);

      item.guideRail && (parameter[item.guideRail] = `door-track/${item.guideRail}`);

      updatePath(parameter);
    });
  }, [latestRecordArr]);

  return {
    control_workSheetPDF_01,
    control_workSheetPDF_02,
  };
};

// ===========================================================================
