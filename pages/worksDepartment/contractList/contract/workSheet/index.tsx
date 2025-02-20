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

// hook
import { TquotationProductItemDto_old } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { calcFullHeight, calcAngleIronSize } from 'js/utils/product/calc';
import { lookup_motorPhase } from 'config/product/lookup';

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
  Form_specialProd_basic,
  Form_specialProd_location,
  Form_specialProduct_ABCD,
  Form_specialProduct_motor,
} from 'components/page/worksDepartment/worksheet/productForm/productForm';
import * as FormLayout from 'components/page/worksDepartment/worksheet/productForm/productFormLayout';

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

  // -------------------------------------------------------------------------

  const { state_specialDoor, setState_specialDoor } = useSpecialDoor({
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

    const contractProductItems = worksheetExport.getUpdateWorkSheetItemArr();
    const floorLocations = worksheetExport.getFloorLocations();

    if (contractProductItems && floorLocations) {
      const body = {
        contractProductItems,
        floorLocations,
      };

      try {
        setIsLoading(true);
        await apiPatchWorkSheetProducts(worksheetExport.worksheetId, body);

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
      // const prodQty = String(prod.items?.length ?? 0);
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
  //
  activeRecordData,
  reqPatchWorkSheet,
  disabled,
  activeWorksheetId,
  activeWorksheetOriginalAccessories,

  state_specialDoor,
  setState_specialDoor,
}: {
  activeRecordData: TworksheetRecordDto_addition | undefined;
  reqPatchWorkSheet: () => void;
  disabled: boolean;
  activeWorksheetId: string | undefined;
  activeWorksheetOriginalAccessories: TquotationProductAccessoryDto[];

  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
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
  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
    const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];

    latestRecordArr.forEach((record) => {
      if (!record.contractProductItems) {
        return;
      }

      const item = record.contractProductItems[0];

      const { motorVoltage, motorPhase, components, accessories } = item;

      const componentList = (() => {
        // if (!components) {
        //   return undefined;
        // }

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
        // billingDate: workSheet?.createdAt ? getTaiwanDateStr(workSheet.createdAt) ?? '' : '', // 未知
        billingDate: getTaiwanDateStr(new Date().toISOString()) ?? '', // 未知
        // 出貨日
        shippingDate: '', // 未知
      },
      itemArr: workSheetPDF_01_itemArr,
      // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
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
      // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
    };

    return {
      control_workSheetPDF_01,
      control_workSheetPDF_02,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractNumber, customerName, contactPerson, control_profile, latestRecordArr]);

  return {
    control_workSheetPDF_01,
    control_workSheetPDF_02,
  };
};

// ===========================================================================

type Tstate_specialDoor = {
  // 項目名
  readonly itemName: string;
  // 報價別
  readonly quoteType: string;
  // 門型
  readonly doorModelName: string;

  readonly qty: number;

  // L(mm)全寬
  fullWidth: `${number}` | '';
  WG: `${number}` | '';
  // h(mm)
  height: `${number}` | '';
  // B(mm)
  boxB: `${number}` | '';
  // D(mm)
  boxD: `${number}` | '';
  // 面積
  area: `${number}` | '';
  // 才數
  volume: `${number}` | '';
  // 材料
  materialName: string;
  // 表面
  materialSurface: string;
  // 門軌
  guideRail: string;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string;

  // 電壓
  motorVoltage: 110 | 380 | null;
  // 相數
  motorPhase: 1 | 3 | null;

  // 馬達支撐架
  hasMotorSupportStand: boolean;
  // 底座類型
  bottomBar: string;
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  guideRailThickness: `${number}` | '';
  // 門軌消音條
  hasSilencingStrip: boolean;
  // 一體式捲箱
  isIntegratedHeadBox: boolean;
  // 捲箱厚度
  headBoxThickness: `${number}` | '';
  // 防颱
  isAntiTyphoon: boolean;
  // 彈射門
  bounceDoor: boolean;
  // 彈射門寬度
  bounceDoorWidth: `${number}` | '';
  // 彈射門高度
  bounceDoorHeight: `${number}` | '';
  // 彈射門長度
  bounceDoorLength: `${number}` | '';
  // 關閉方式
  closingType: string;

  // 底座角鐵
  bottomBarAngleIron: string;
  // 底座板
  bottomBarPlate: string;

  // 門片厚度
  thickness: `${number}` | '';

  // 門片 - 捲片支數
  slatCount: `${number}` | '';

  // 鏈齒輪 - 鏈齒輪番號
  // sprocketWheelModel: string;
  // 鏈齒輪 - 大鏈輪
  // sprocketWheelTeethNumber: string;
  // 可能為鍊條數量
  // sprocketWheelChains: `${number}` | '';
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  // bearingInnerDiameter: string;

  // 捲軸 - 尺寸
  diameter: `${number}` | '';
  // 捲軸 - 總長
  bearingHousingTotalLength: `${number}` | '';
  // 底座 - 開口
  guideRailsOpening: string;
  // 門片長度
  slatLength: `${number}` | '';
  // 門軌長度
  guideRailLength: `${number}` | '';
  // 捲箱長度
  headBoxLength: `${number}` | '';
  // 軸承座寸法
  bearingHousingSize: `${number}` | '';
  // 軸承
  bearingName: string;

  gapA: `${number}` | '';
  gapC: `${number}` | '';
  gearNumber: string;
  weight: `${number}` | '';
  // 捲箱 - 正面
  headBoxFront: string;

  // 捲箱 - 有無凸 // 棄用
  // headBoxProtruding: string | null; // 棄用

  // 捲箱 - 角鐵數量
  headBoxAngleIronQuantity: `${number}` | '';
  // 支板 - 鏈條
  sidePlateChain: string;
  // 支板 - 方向
  sidePlateDirection: string;
  // 電動機 - 鍊條形式
  electricMotorChainType: string;
  // 電動機 - 方向
  electricMotorDirection: string;
  // 門軌 - 型式
  guideRailType: string;
  // 底座 - 表面
  bottomBarSurface: string;
  // 門軌 - 表面
  guideRailSurface: string;
  guideRailG: `${number}` | '';
  isULGuideRail: boolean;

  // 門編號
  serialNumberArr: string[];
  // 樓層
  floor: string;
  // 區域位置
  locationArea: string;
};

// MARK:useSpecialDoor
const useSpecialDoor = ({
  activeRecordData,
  disabled,
}: {
  activeRecordData: TworksheetRecordDto_addition | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDefaultState_specialDoor({
    // quotationProductItem: activeRecordData?.contractProductItems?.[0],
    contractProductItems: activeRecordData?.contractProductItems,
    qty: activeRecordData?.contractProductItems?.length ?? 0,
  });

  const [state_specialDoor, setState_specialDoor] = useState<Tstate_specialDoor>(defaultState);

  useEffect(() => {
    setState_specialDoor(defaultState);
  }, [defaultState, disabled]);

  return { state_specialDoor, setState_specialDoor };
};

const useDefaultState_specialDoor = ({
  contractProductItems,
  qty,
}: {
  // quotationProductItem: TquotationProductItemDto | undefined;
  contractProductItems: TquotationProductItemDto[] | undefined;
  qty: number;
}) => {
  const defaultState: Tstate_specialDoor = useMemo(() => {
    if (!contractProductItems || contractProductItems.length === 0) {
      return emptyState_specialDoor();
    }

    const quotationProductItem = contractProductItems[0];

    const defaultState: Tstate_specialDoor = {
      itemName: quotationProductItem.itemName,
      quoteType: quotationProductItem.quoteType,
      doorModelName: quotationProductItem.doorModelName,
      qty: qty,

      fullWidth: `${quotationProductItem.fullWidth}`,
      WG: `${quotationProductItem.WG}`,
      height: `${quotationProductItem.height}`,
      boxB: `${quotationProductItem.boxB}`,
      boxD: `${quotationProductItem.boxD ?? ''}`,
      area: `${quotationProductItem.area ?? ''}` as `${number}` | '',
      volume: `${quotationProductItem.volume ?? ''}` as `${number}` | '',
      materialName: quotationProductItem.materialName,
      materialSurface: quotationProductItem.materialSurface ?? '',
      guideRail: quotationProductItem.guideRail ?? '',
      horsepower: quotationProductItem.horsepower,
      motorVendor: quotationProductItem.motorVendor ?? '',
      motorVoltage: quotationProductItem.motorVoltage as 110 | 380 | null,
      motorPhase: quotationProductItem.motorPhase as 1 | 3 | null,
      hasMotorSupportStand: !!quotationProductItem.hasMotorSupportStand,
      bottomBar: quotationProductItem.bottomBar ?? '',
      motorLockBox: quotationProductItem.motorLockBox ?? '',
      guideRailThickness: `${quotationProductItem.guideRailThickness ?? ''}` as `${number}` | '',
      hasSilencingStrip: !!quotationProductItem.hasSilencingStrip,
      isIntegratedHeadBox: !!quotationProductItem.isIntegratedHeadBox,
      headBoxThickness: `${quotationProductItem.headBoxThickness ?? ''}` as `${number}` | '',
      isAntiTyphoon: !!quotationProductItem.isAntiTyphoon,
      bounceDoor: !!quotationProductItem.bounceDoor,
      bounceDoorWidth: `${quotationProductItem.bounceDoorWidth ?? ''}` as `${number}` | '',
      bounceDoorHeight: `${quotationProductItem.bounceDoorHeight ?? ''}` as `${number}` | '',
      bounceDoorLength: `${quotationProductItem.bounceDoorLength ?? ''}` as `${number}` | '',
      closingType: quotationProductItem.closingType ?? '',
      bottomBarAngleIron: quotationProductItem.bottomBarAngleIron ?? '',
      bottomBarPlate: quotationProductItem.bottomBarPlate ?? '',
      thickness: `${quotationProductItem.thickness ?? ''}` as `${number}` | '',
      slatCount: `${quotationProductItem.slatCount ?? ''}` as `${number}` | '',
      diameter: `${quotationProductItem.diameter ?? ''}` as `${number}` | '',
      bearingHousingTotalLength: `${quotationProductItem.bearingHousingTotalLength ?? ''}` as `${number}` | '',
      guideRailsOpening: quotationProductItem.guideRailsOpening ?? '',
      slatLength: `${quotationProductItem.slatLength ?? ''}` as `${number}` | '',
      guideRailLength: `${quotationProductItem.guideRailLength ?? ''}` as `${number}` | '',
      headBoxLength: `${quotationProductItem.headBoxLength ?? ''}` as `${number}` | '',
      bearingHousingSize: `${quotationProductItem.bearingHousingSize ?? ''}` as `${number}` | '',
      bearingName: quotationProductItem.bearingName ?? '',
      gapA: `${quotationProductItem.gapA ?? ''}` as `${number}` | '',
      gapC: `${quotationProductItem.gapC ?? ''}` as `${number}` | '',
      gearNumber: quotationProductItem.gearNumber ?? '',
      weight: `${quotationProductItem.weight ?? ''}` as `${number}` | '',
      headBoxFront: quotationProductItem.headBoxFront ?? '',
      headBoxAngleIronQuantity: `${quotationProductItem.headBoxAngleIronQuantity ?? ''}` as `${number}` | '',
      sidePlateChain: quotationProductItem.sidePlateChain ?? '',
      sidePlateDirection: quotationProductItem.sidePlateDirection ?? '',
      electricMotorChainType: quotationProductItem.electricMotorChainType ?? '',
      electricMotorDirection: quotationProductItem.electricMotorDirection ?? '',
      guideRailType: quotationProductItem.guideRailType ?? '',
      bottomBarSurface: quotationProductItem.bottomBarSurface ?? '',
      guideRailSurface: quotationProductItem.guideRailSurface ?? '',
      guideRailG: `${quotationProductItem.guideRailG ?? ''}` as `${number}` | '',
      isULGuideRail: !!quotationProductItem.isULGuideRail,
      serialNumberArr: contractProductItems.map((item) => item.serialNumber ?? ''),
      floor: quotationProductItem.floor ?? '',
      locationArea: quotationProductItem.locationArea ?? '',
    };

    return defaultState;
  }, [contractProductItems]);

  return defaultState;
};

const emptyState_specialDoor = (): Tstate_specialDoor => {
  const state: Tstate_specialDoor = {
    itemName: '',
    quoteType: '',
    doorModelName: '',
    qty: 0,

    fullWidth: '',
    WG: '',
    height: '',
    boxB: '',
    boxD: '',
    area: '',
    volume: '',
    materialName: '',
    materialSurface: '',
    guideRail: '',
    horsepower: '',
    motorVendor: '',
    motorVoltage: null,
    motorPhase: null,
    hasMotorSupportStand: false,
    bottomBar: '',
    motorLockBox: '',
    guideRailThickness: '',
    hasSilencingStrip: false,
    isIntegratedHeadBox: false,
    headBoxThickness: '',
    isAntiTyphoon: false,
    bounceDoor: false,
    bounceDoorWidth: '',
    bounceDoorHeight: '',
    bounceDoorLength: '',
    closingType: '',
    bottomBarAngleIron: '',
    bottomBarPlate: '',
    thickness: '',
    slatCount: '',
    diameter: '',
    bearingHousingTotalLength: '',
    guideRailsOpening: '',
    slatLength: '',
    guideRailLength: '',
    headBoxLength: '',
    bearingHousingSize: '',
    bearingName: '',
    gapA: '',
    gapC: '',
    gearNumber: '',
    weight: '',
    headBoxFront: '',
    headBoxAngleIronQuantity: '',
    sidePlateChain: '',
    sidePlateDirection: '',
    electricMotorChainType: '',
    electricMotorDirection: '',
    guideRailType: '',
    bottomBarSurface: '',
    guideRailSurface: '',
    guideRailG: '',
    isULGuideRail: false,
    serialNumberArr: [],
    floor: '',
    locationArea: '',
  };

  return state;
};

const WorksheetForm_specialDoor = ({
  //
  disabled,
  state_specialDoor,
  setState_specialDoor,
}: {
  disabled: boolean;
  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
}) => {
  const { Container, Section, MainFormWrapper, FormGrid } = FormLayout;

  type TsetStateAction = Partial<Tstate_specialDoor> | ((prev: Tstate_specialDoor) => Partial<Tstate_specialDoor>);

  const setState = (action: TsetStateAction) => {
    setState_specialDoor((prev) => ({
      ...prev,
      ...(typeof action === 'function' ? action(prev) : action),
    }));
  };

  const props = {
    state: state_specialDoor,
    setState,
    disabled,
  };

  return (
    <Container>
      <div>
        <Section>位置與編號：</Section>
        <Form_specialProd_location {...props} />
      </div>
      <div>
        <Section>設定產品基本規格：</Section>
        <Form_specialProd_basic {...props} />
      </div>
      <div>
        <Section>設定產品細部規格：</Section>
        <FormGrid>
          <Form_specialProduct_ABCD {...props} />
          <Form_specialProduct_motor {...props} />
        </FormGrid>
      </div>
    </Container>
  );
};
