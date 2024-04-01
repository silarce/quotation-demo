// 工作表

// 按下計算按鈕會呼叫targetSheet.calcProd()

// 為了使用useControl_pdf，在useGetContract_id的populate中
// 設置了
// 'worksheet.latestRecord.contractProductItems.components'
// 'worksheet.latestRecord.contractProductItems.accessories'
// 未來可能會有效能的問題，之後要找時間處理

// TODO component的過濾與取得bom資料還沒做
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!
// !!! component的過濾與取得bom資料還沒做 !!!

import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';

// import WorkSheetProdCard, {
//   Tcontrol_prodCard,
// } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProdCard';

import ProductCard, {
  Tcontrol_productCard,
  TworksheetIntro,
} from 'components/page/worksDepartment/worksheet/productCard';
import RecordList, { Tcontrol_recordList, Trecord } from 'components/page/worksDepartment/worksheet/recordList';

import {
  Form_product_basic,
  Form_product_ABCD,
  Form_product_motor,
  Form_product_headBox,
  Form_product_roller,
  Form_product_slat,
  Form_product_guideRail,
  Form_product_bottomBar,
  Form_product_sidePlate,
  Form_product_accessories,
  //
  WorksheetTable,
} from 'components/page/worksDepartment/worksheet/productForm/productForm';

import WorkSheetProductOutline, {
  Tcontrol_productOutline,
  ToldProductOutline,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductOutline';
import WorkSheetProductDetail01, {
  Tcontrol_detail,
  Tcontrol_ABCD,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail01';
import WorkSheetOptional, {
  Tcontrol_optional,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetOptional';
import WorkSheetProductDetail02, {
  Tcontrol_detail02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail02';
import WorkSheetPDF, {
  Tcontrol_workSheetPDF_01,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';
import WorkSheetPDF_02, {
  Tcontrol_workSheetPDF_02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal, { TinputModalProps } from 'components/global/gear/modal/simpleModal/inputModal_v2';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';
import {
  // TupdateWorkSheetItem,
  TcreateWorksheetDto,
  // TupdateWorkSheet,
  // useGetEngineeringContact,
  // useGetWorkSheet,
  // apiPatchWorkSheetProducts,
  // apiDeleteWorkSheetItem,
  apiPostWorkSheet,
  apiDeleteWorksheet,
  useGetWorksheet_id,
  apiPatchWorkSheetProducts,
  useApiGetWorksheetRecord_id,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// hook
// import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
// import { TworkSheetDto, workSheetReducer } from 'js/utils/worksheet/reducer';
import { calcFullHeight, calcAngleIronSize } from 'js/utils/product/calc';
import { lookup_motorPhase } from 'config/product/lookup';

// css
import scss from './workSheet.module.scss';

// type
import type {
  TengineeringContactDto,
  TquotationProductItemDto,
  TerpFeatureDto,
  TworksheetDto_legacy,
  TquotationProductAccessoryDto,
  TworksheetRecordDto,
  TquotationProductComponentDto,
  TworksheetDto,
} from 'js/api/dtoTypes';

// zustand // hook
import { useWorksheet } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';
import { useShallow } from 'zustand/react/shallow';

// ====================================================================

type Tquery = {
  contractId: string | undefined;
};

// ====================================================================

export default function Worksheet({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  // ----------------------------------------------------------------
  let havePermissionToEdit = false;
  isAdmin && (havePermissionToEdit = true);
  userErpFeature?.some((item) => {
    return item.name === '工務部-工作表編輯';
  }) && (havePermissionToEdit = true);

  // ----------------------------------------------------------------
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [activeWorksheetId, setActiveWorksheetId] = useState<string | undefined>(undefined);
  const [inputModalProps, setInputModalProps] = useState<Pick<TinputModalProps, 'onConfirm' | 'title'>>();

  const [activeWorksheetOriginalAccessories, setActiveWorksheetOriginalAccessories] = useState<
    TquotationProductAccessoryDto[]
  >([]);

  const [isShowPdf, setIsShowPdf] = useState(false);
  const [isShowPdf02, setIsShowPdf02] = useState(false);

  // -------------------------------------------------------------------------

  // const [activeRecord, setActiveRecord] = useState<TworksheetDto['records'][number] | undefined>(undefined);
  const [activeRecordId, setActiveRecordId] = useState<string | undefined>(undefined);
  const [isLastestRecord, setIsLastestRecord] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'content.customer',
      'engineeringContact',
      // 'worksheet.records',
      'worksheet.latestRecord.reviewSalesEmployee',
      'worksheet.latestRecord.reviewManagerEmployee',
      'worksheet.latestRecord.contractProductItems.components',
      'worksheet.latestRecord.contractProductItems.accessories',
      // 'worksheet.records.reviewSalesEmployee',
      // 'worksheet.records.reviewManagerEmployee',
      // 'worksheet.records.contractProductItems.components',
      // 'worksheet.records.contractProductItems.accessories',
    ],
  });
  const { data: finalProduct = [], update: update_finalProduce } = useGetContract_id_finalProductItem(contractId);
  const { res: doorModelArr, update: update_doorModelArr, doorModelList } = useApiGetProdDoorModels();
  const { engineeringContact, worksheet: worksheetArr = [] } = contract ?? {};

  // ________________________________________________________________________
  // ________________________________________________________________________

  const { data: worksheetData, update: update_worksheetData } = useGetWorksheet_id(activeWorksheetId);

  // -------------------------------------------------------------------------

  const {
    data: activeRecordData,
    update: update_activeRecord,
    isLoading: isLoading_activeRecord,
    clear: clear_activeRecord,
  } = useApiGetWorksheetRecord_id(activeRecordId);

  // -------------------------------------------------------------------------

  const init = useWorksheet((state) => state.init);

  const worksheetExport = useWorksheet(
    useShallow((state) => ({
      worksheetId: state.worksheetId,
      getUpdateWorkSheetItemArr: state.getUpdateWorkSheetItemArr,
    }))
  );

  const { calcData_2, shouldCalcData, shouldCalcData2 } = useWorksheet(
    useShallow((state) => ({
      shouldCalcData: state.shouldCalcData,
      shouldCalcData2: state.shouldCalcData2,
      calcData_2: state.calcData_2,
    }))
  );

  // useEffect(() => {
  //   if (disabled) {
  //     const contractProductItems = worksheetData?.latestRecord.contractProductItems;

  //     init({
  //       worksheetId: activeWorksheetId!,
  //       itemIdArr: contractProductItems?.map((item) => item.id) ?? [],
  //       contractProductItem: contractProductItems?.[0],
  //       contractProductItemArr: contractProductItems ?? [],
  //       qty: contractProductItems?.length ?? 0,
  //       originalAccessories: activeWorksheetOriginalAccessories,
  //     });
  //   }
  // }, [worksheetData, disabled]);

  // -------------------------------------------------------------------------

  const refreshData = async () => {
    return Promise.all([update_contract(), update_finalProduce()]);
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

    try {
      setIsLoading(true);
      await apiDeleteWorksheet(worksheetId);
      await refreshData();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const reqPatchWorkSheet = async () => {
    const contractProductItems = worksheetExport.getUpdateWorkSheetItemArr();

    if (contractProductItems) {
      const body = {
        contractProductItems,
      };

      try {
        setIsLoading(true);
        await apiPatchWorkSheetProducts(worksheetExport.worksheetId, body);
        await update_worksheetData();
        setDisabled(true);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Promise.all([
        //
        update_contract(),
        update_finalProduce(),
        update_doorModelArr(),
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

  // zustand 狀態
  useEffect(() => {
    if (disabled && activeRecordData) {
      const contractProductItems = activeRecordData.contractProductItems;

      init({
        worksheetId: activeWorksheetId!,
        itemIdArr: contractProductItems?.map((item) => item.id) ?? [],
        contractProductItem: contractProductItems?.[0],
        contractProductItemArr: contractProductItems ?? [],
        qty: contractProductItems?.length ?? 0,
        originalAccessories: activeWorksheetOriginalAccessories,
      });
    }
  }, [activeRecordData, disabled]);

  // -------------------------------------------------------------------------
  const control_profile = useControl_profile(engineeringContact);

  // -------------------------------------------------------------------------
  const { control_productCardArr, latestRecordArr } = useMemo(() => {
    const control_productCardArr: (Tcontrol_productCard & { id: string })[] = [];
    const latestRecordArr: TworksheetRecordDto[] = [];

    const worksheetList: { [id: string]: TworksheetDto } = {};

    worksheetArr.forEach((worksheet) => {
      if (worksheet.isAbandoned) {
        return;
      }

      worksheetList[worksheet.id] = worksheet;
    });

    finalProduct.forEach((prod) => {
      const prodQty = String(prod.items?.length ?? 0);
      const prodWidth = new Decimal(prod.fullWidth).div(1000).toString();
      const pridHeight = new Decimal(prod.height).div(1000).toString();

      const prodWorkSheetList: { [key: string]: TworksheetDto } = {};
      const itemsNoWorksheet: TquotationProductItemDto[] = [];

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

          reviewSalesEmployee,
          toReviewSales,
          salesReviewAt,

          reviewManagerEmployee,
          // toReviewManager,
          managerReviewAt,
        } = latestRecord;

        const contractProductItem = contractProductItems?.[0];

        const width_m = new Decimal(contractProductItem?.fullWidth ?? 0).div(1000).toString();
        const height_m = new Decimal(contractProductItem?.height ?? 0).div(1000).toString();

        let reviewStatus: TworksheetIntro['reviewStatus'] = {
          label: `業務 ${reviewSalesEmployee?.chName ?? ''}`, // 後端沒給reviewSalesEmployee，先應急處理
          dotColor: salesReviewAt ? 'green' : toReviewSales ? 'red' : 'gray',
        };

        if (managerReviewAt) {
          reviewStatus = {
            label: `總經理 ${reviewManagerEmployee?.chName}`,
            dotColor: 'green',
          };
        }

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
            setActiveWorksheetId(worksheet.id);
            setActiveWorksheetOriginalAccessories(prod.items?.[0].accessories ?? []);
            setActiveRecordId(undefined);
            setDisabled(true);
          },
          onDeleteClick: () => {
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

      // ----------------------

      control_productCardArr.push({
        id: prod.id,
        itemName: prod.itemName,
        doorModelName: prod.doorModelName,
        qty: prodQty,
        width: prodWidth,
        height: pridHeight,
        onSeparateClick: () => {
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
      });
    });

    return { control_productCardArr, latestRecordArr };
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    finalProduct,
    // activeWorksheetId
    worksheetData,
  ]);

  // ___________________________________________________________________________
  // ___________________________________________________________________________

  const control_recordList: Tcontrol_recordList = useMemo(() => {
    const records = _.sortBy(worksheetData?.records, 'version').reverse();

    const recordArr: Trecord[] = records.map((record, index) => {
      const {
        contractProductItems,
        reviewSalesEmployee,
        toReviewSales,
        salesReviewAt,
        reviewManagerEmployee,
        toReviewManager,
        managerReviewAt,
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

      let reviewSalesStatus: Trecord['reviewSalesStatus'] = 'gray';

      if (salesReviewAt) {
        reviewSalesStatus = 'green';
      } else if (toReviewSales) {
        reviewSalesStatus = 'red';
      }

      let reveiwManagerStatus: Trecord['reveiwManagerStatus'] = 'gray';

      if (managerReviewAt) {
        reveiwManagerStatus = 'green';
      } else if (toReviewManager) {
        reveiwManagerStatus = 'red';
      }

      const control_record: Trecord = {
        itemName,
        doorModel: doorModelName ?? '',
        fullWidth: fullWidth_m,
        height: height_m,
        qty: String(qty),
        material: materialName,
        isAntiTyphoon: isAntiTyphoon,

        reviewSalesName: reviewSalesEmployee?.chName ?? '',
        reviewSalesStatus,
        reviewManagerName: reviewManagerEmployee?.chName ?? '',
        reveiwManagerStatus,

        onDetailClick: () => {
          setActiveRecordId(record.id);

          if (index === 0) {
            setIsLastestRecord(true);
          }
        },
      };

      return control_record;
    });

    return { recordArr };
  }, [worksheetData]);

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useControl_pdf({
    contractNumber: contract?.contractNumber ?? '',
    customerName: contract?.content.customer?.name ?? '',
    contactPerson: engineeringContact?.contactInfo?.[0]?.contactPerson ?? '',
    control_profile,
    latestRecordArr,
  });

  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------

  let panelList_notAllow: TpanelList = [
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
    {
      type: 'myButton',
      label: havePermissionToEdit ? '編輯工作表' : '沒有編輯權限',
      onClick: () => {
        if (havePermissionToEdit) {
          setDisabled(false);
        }
      },
    },
    {
      type: 'myButton',
      label: '關閉工作表',
      onClick: () => {
        setActiveRecordId(undefined);
        setIsLastestRecord(false);
      },
    },
  ];

  if (!isLastestRecord) {
    panelList_notAllow.splice(3, 1);
  }

  if (!activeRecordData) {
    panelList_notAllow = [];
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
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------------

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div>
        <WorkSheetProfile control={control_profile} disabled={true} />
        <div className={scss.subTitle}>工程項目</div>
        <div className={scss.main}>
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
            {activeRecordData && (
              <WorksheetForm
                shouldCalcData={shouldCalcData}
                shouldCalcData2={shouldCalcData2}
                calcData_2={calcData_2}
                reqPatchWorkSheet={reqPatchWorkSheet}
                disabled={disabled}
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

// ===========================================================================
// ===========================================================================
// ===========================================================================

const WorksheetForm = ({
  //
  shouldCalcData,
  shouldCalcData2,
  calcData_2,
  reqPatchWorkSheet,
  disabled,
}: {
  shouldCalcData: boolean;
  shouldCalcData2: boolean;
  calcData_2: () => void;
  reqPatchWorkSheet: () => void;
  disabled?: boolean;
}) => {
  return (
    <form className={scss.productForm}>
      <div>
        <p className={'mb-8 text-main text-xl font-bold'}>設定產品基本規格：</p>
        <Form_product_basic disabled={disabled} />
      </div>
      <div className={scss.mainFormWrapper}>
        <p className={'mb-8 text-main text-xl font-bold'}>設定產品細部規格：</p>
        <div className={scss.formGrid}>
          <Form_product_ABCD disabled={disabled} />
          <Form_product_motor disabled={disabled} />
          <Form_product_headBox disabled={disabled} />
          <Form_product_roller disabled={disabled} />
          <Form_product_slat disabled={disabled} />
          <Form_product_guideRail disabled={disabled} />
          <Form_product_bottomBar disabled={disabled} />
          <Form_product_sidePlate disabled={disabled} />
        </div>
        {shouldCalcData && <div className={scss.cover}></div>}
      </div>
      <div>
        <Form_product_accessories disabled={disabled} />
      </div>
      <div className={classNames(disabled && 'hidden')}>
        <MyButton_v2 px="px32" className="block m-auto " onClick={calcData_2}>
          取得剩餘資料
        </MyButton_v2>
      </div>
      <div className="relative">
        <WorksheetTable />
        {shouldCalcData2 && <div className={scss.cover}></div>}
      </div>
      <div className={classNames('relative', disabled && 'hidden')}>
        <MyButton_v2 px="px32" className="block m-auto " onClick={reqPatchWorkSheet}>
          確認上傳
        </MyButton_v2>
        {shouldCalcData2 && <div className={scss.cover}></div>}
      </div>
    </form>
  );
};

// ===========================================================================
// ===========================================================================

// ============================================================================

/**
 *
 * 一體式捲箱 true === 方形捲箱
 * false ==="捲箱 + 機箱"
 *
 * 方向 數量加方向 2右 6左 8左   這樣
 * 捲箱的角鐵尺寸為 WG + gapA + gapC - 10
 *
 * 門軌的防颱先全部放-50
 * 捲箱角鐵數量由使用者輸入
 *
 *
 * 電動機與支版的方向是一樣的
 * 所以記錄在product就好了
 *
 *
 *
根據PDF缺的欄位而需要新增的property
方向 角鐵數量 彎直
另外要新增的欄位

開單日 date string
出貨日 date string

捲箱
正面 string
有無凸 string
角鐵數量 number

支版
鍊條 string 應該是不可編輯的欄位
方向 string

電動機
鍊條型式 string
方向 string

門軌
型式 string





另外開單日期與出貨日期還不知道要帶入什麼值
 
馬達荷重怎麼算
 
 */

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

// ===========================================================================
// 角鐵尺吋
// String(Number(this.WG_mm) + Number(this._prod.gapA) + Number(this._prod.gapC) - 10);

// 門片厚度 _prod.thickness
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

type TcomponentList = {
  [key: string]: TquotationProductComponentDto;
};

const useControl_pdf = ({
  //
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
          diameter: `${item.diameter}"` ?? '', // 要有 " 符號，代表吋
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
          surface: '',
        },
        doorPiece: {
          material: componentList.slat.material,
          surface: componentList.slat.materialSurface ?? '',
          thickness: item.thickness ?? '',
          slatLength: String(item.slatLength ?? '0'),
          slatCount: String(item.slatCount ?? '0'),
          antyTyphoonHook: item.isAntiTyphoon ? '有' : '無',
        },
        motor: {
          vendor: item.motorVendor,
          /**相數加電壓 */
          phaseVoltage: phaseVoltage,
          horsepower: item.horsepower,
          direction: '', // 未知 // 在廠務部工作表 電動機方向
        },
        guideRail: {
          form: item.isAntiTyphoon ? '防颱' : '一般',
          material: componentList.guideRail.material,
          guideRailLength: String(item.guideRailLength ?? ''),
          guideRailName: item.guideRail,
          icon: item?.guideRail
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${item?.guideRail}`
            : undefined,
          antiTyphoonHook: '-50', // 未知 // 在廠務部工作表
          bendStraight: item.guideRailType ?? '',
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
          material: componentList.bottomBar.material,
          guideRailsOpening: String(item.guideRailsOpening ?? ''),
          surface: '', // 未知 在廠務部工作表
        },
        sidePlate: {
          direction: '', // 未知 在廠務部工作表
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
