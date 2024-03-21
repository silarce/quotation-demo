// 工作表

// 按下計算按鈕會呼叫targetSheet.calcProd()

/*


捲軸
捲箱
底座
支版
門片
電動機
門軌
這七個區塊的內容"大多"是對應的component
沒有馬達配件區塊


呼叫get /products/door/available-components
是為了取得材料配件資料，並顯出來
顯示出來的欄位有代號、說明、材料、表面、烤漆、單位、數量、牌價、牌價複價、單價、複價
這些欄位中，只有材料與表面會在工作表顯示出來
而材料與表面的選項目前是固定的，
所以應該是不需要呼叫 get /products/door/available-components
況且component換掉就是整個主產品換掉，這應該不是工作表這邊要做的事
component不變的話
get /products/door/generate-door-product-bom 也不需要呼叫了

在工作表甚至工務部這邊，不需要 componentId
所以即使componentId對應的規格與使用者編輯後的規格不搭配也沒關係
工作表就是讓使用者依現場的情況編輯規格，然後交給相關部門(例如業務部)參考用的

_________________________________________________________________


get /products/door/calc-general-spec // 用來取得經過計算才能知道的規格(不可以隨意編輯)
get /products/door/calc-detail-spec // 用來取得門片數量
這兩個api的呼叫已經放進Class_workSheet.calcProd了

get /products/door/calc-side-plate-size-d // 用來取得boxD
這個不需要在init呼叫，按下計算按鈕時呼叫就好了

Class_workSheet.getInitData
會呼叫 getAccessoriesArr與getProdAvailableComponents


如果工作表的是到現場實作後，修改主產品規格的紀錄
那麼是不是厚度、馬力數的選項就不應該是從後端取得的資料
而是應該包含所有可能的選項?
在主產品
options_horsepower
options_motor
options_phase
options_voltage
options_rollUpBoxThick
options_doorTrackThick
都是從_availableComponents拿的
先用主產品的作法吧，只是取得availableComponents後不把component換掉
只取得options


-----------------------------------------------------------------

選擇門型的時候就會更新可選門軌與可選材質(上面的，非選配)
並更新門軌，重置防颱

-----------------------------------------------------------------
目前計算按鈕的功能

1. 呼叫 getProdSpec
getProdSpec會呼叫api取得規格並帶入新的規格
被改變的東西包括
_prodSpec.bearingHousingSize
_prodSpec.bearingHousingTotalLength
_prodSpec.bearingInnerDiameter
_prodSpec.bearingName
_prodSpec.defaultMotorIndex
_prodSpec.density
_prodSpec.diameter
_prodSpec.gapA
_prodSpec.gapC
_prodSpec.motors
_prodSpec.gearNumber
_prodSpec.sprocketWheelModel
_prodSpec.sprocketWheelTeethNumber
_prodSpec.sprocketWheelChains
_prodSpec.weight
_prodSpec.slatLength
_prodSpec.guideRailLength
_prodSpec.headBoxLength
_prodSpec.thickness
另外還有
_prod.sprocketWheelModel
_prod.sprocketWheelTeethNumber
_prod.bearingInnerDiameter
_prod.diameter
_prod.bearingHousingTotalLength
以及
boxD

2.
再用getProdSpec的回應
計算WG
取得預設馬達、預設馬力、預設boxB
更新this._prod.thickness   this._prod.thickness = prodSpec.thickness

3.
產生boxB下拉選單選項options_boxB this.findBoxBoptions()

4.
變更所有材料配件的材質 this.changeComMaterial()

5.
呼叫getProdDetailSepc()取得捲門片數量 _prod.slatCount 

6.
呼叫getProdAvailableComponents()
然後呼叫retrieveOptions()

6.1
retrieveOptions會更新以下下拉式選單的選項
options_horsepower
options_motor
options_phase
options_voltage
options_rollUpBoxThick
options_doorTrackThick

7.
如果
if(this._doorModelName_state !== this._prod.doorModelName){
  更新this._doorModelName_state
  清空已選的選配
  呼叫並更新可選選配列表
}

-----------------------------------------------------------------



-----------------------------

工作表更新後
被更新的item會產生adjustedItem這個property
型別同item，內容是更新後的item
*/

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

// import WorkSheetProductOutline, {
//   Tcontrol_productOutline,
//   ToldProductOutline,
// } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductOutline';
// import WorkSheetProductDetail01, {
//   Tcontrol_detail,
//   Tcontrol_ABCD,
// } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail01';
// import WorkSheetOptional, {
//   Tcontrol_optional,
// } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetOptional';
// import WorkSheetProductDetail02, {
//   Tcontrol_detail02,
// } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail02';
import WorkSheetPDF, {
  Tcontrol_workSheetPDF_01,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';
import WorkSheetPDF_02, {
  Tcontrol_workSheetPDF_02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';
import RecordList, { Trecord } from 'components/page/worksDepartment/worksheet/recordList';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// api
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';
import {
  TupdateWorkSheetItem,
  useGetEngineeringContact,
  useGetWorkSheet,
  apiPatchWorkSheet,
  apiDeleteWorkSheetItem,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// hook
import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { TworkSheetDto, workSheetReducer } from 'js/utils/worksheet/reducer';

// css
import scss from './workSheet.module.scss';

// options
import {
  Toption,
  optionsCreator_bottomBar,
  optionsCreator_motorLockBox,
  optionsCreator_rollerSpec,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
  optionsCreator_surface,
  optionsCreator_componentMaterial_01,
} from 'js/utils/options/productOptions';

// type
import type {
  TengineeringContactDto,
  TquotationProductItemDto,
  TerpFeatureDto,
  TworksheetDto_legacy,
} from 'js/api/dtoTypes';

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

  // const [isShowPdf, setIsShowPdf] = useState(false);
  // const [isShowPdf02, setIsShowPdf02] = useState(false);

  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'content.customer',
      'engineeringContact',
      'worksheet.records',
      'worksheet.latestRecord.reviewSalesEmployee',
      'worksheet.latestRecord.reviewManagerEmployee',
    ],
  });
  const { data: finalProduct = [], update: update_finalProduce } = useGetContract_id_finalProductItem(contractId);

  const { res: doorModelArr, update: update_doorModelArr, doorModelList } = useApiGetProdDoorModels();

  const { engineeringContact, worksheet: worksheetArr = [] } = contract ?? {};

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

  // -------------------------------------------------------------------------

  console.log(finalProduct);
  console.log(worksheetArr);
  // -------------------------------------------------------------------------
  const control_profile = useControl_profile(engineeringContact);

  // -------------------------------------------------------------------------
  const { control_productCardArr } = useMemo(() => {
    const control_productCardArr: (Tcontrol_productCard & { id: string })[] = [];

    const worksheetList: { [id: string]: TworkSheetDto } = {};

    worksheetArr.forEach((worksheet) => {
      worksheetList[worksheet.id] = worksheet;
    });

    finalProduct.forEach((prod) => {
      // const { id, itemName, doorModelName, items } = prod;

      const prodQty = String(prod.items?.length ?? 0);
      const prodWidth = new Decimal(prod.fullWidth).div(1000).toString();
      const pridHeight = new Decimal(prod.height).div(1000).toString();

      const prodWorkSheetList: { [key: string]: TworkSheetDto } = {};

      // ----------------------------------------------
      prod.items?.forEach((item) => {
        const worksheetId = item.worksheetId;

        if (worksheetId) {
          prodWorkSheetList[worksheetId] = worksheetList[worksheetId];
        }
      });

      const worksheetIntroArr: TworksheetIntro[] = Object.values(prodWorkSheetList).map((worksheet) => {
        const { records, latestRecord } = worksheet;
        const {
          contractProductItems,

          // reviewSalesEmployeeId,
          reviewSalesEmployee,
          toReviewSales,
          salesReviewAt,

          // reviewManagerEmployeeId,
          reviewManagerEmployee,
          toReviewManager,
          managerReviewAt,
        } = latestRecord;

        const contractProductItem = contractProductItems[0];

        const width_m = new Decimal(contractProductItem.fullWidth).div(1000).toString();
        const height_m = new Decimal(contractProductItem.height).div(1000).toString();

        let reviewStatus: TworksheetIntro['reviewStatus'] = {
          label: reviewSalesEmployee.chName,
          dotColor: salesReviewAt ? 'green' : toReviewSales ? 'red' : 'gray',
        };

        if (managerReviewAt) {
          reviewStatus = {
            label: reviewManagerEmployee.chName,
            dotColor: 'green',
          };
        }

        const intro: TworksheetIntro = {
          worksheetId: worksheet.id,
          itemName: contractProductItem.itemName,
          doorModelName: contractProductItem.doorModelName,
          width: width_m,
          height: height_m,
          qty: String(contractProductItems.length),
          isActive: false,
          reviewStatus,
          onClick: () => {},
          onDeleteClick: () => {},
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
        onSeparateClick: () => {},
        worksheetIntroArr: worksheetIntroArr,
      });
    });

    return { control_productCardArr };
    //
  }, [finalProduct]);

  // -------------------------------------------------------------------------

  // const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
  //   const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];

  //   Object.values(sheetList).forEach((subList) => {
  //     Object.values(subList).forEach((sheet) => {
  //       const control_item: Tcontrol_workSheetPDF_01['itemArr'][number] = {
  //         itemName: sheet.itemName,
  //         size: {
  //           qty: sheet.quantity,
  //           doorModelName: sheet.doorModelName,
  //           fullWidth: sheet.fullWidth_mm,
  //           height: sheet.height_mm,
  //           WG: sheet.WG_mm,
  //           gapA: numToStr(sheet.prodSpec?.gapA),
  //           gapC: numToStr(sheet.prodSpec?.gapC),
  //           /**支版尺寸 boxB*boxD */
  //           BD: `${sheet.boxB_mm}*${sheet.boxD_mm}`,
  //           /**捲門全高 */
  //           fullHeight: sheet.fullHeight,
  //           weightConversion: '', // 未知 // 重量換算 沒有在任一表單顯示
  //         },
  //         roller: {
  //           diameter: `${sheet.diameter}"` ?? '', // 要有 " 符號，代表吋
  //           bearingInnerDiameter: sheet.bearingInnerDiameter ?? '',
  //           bearingName: sheet.prodSpec?.bearingName ?? '',
  //           bearingHousingTotalLength: sheet.bearingHousingTotalLength ?? '',
  //           bearingHousingSize: numToStr(sheet.prodSpec?.bearingHousingSize),
  //         },
  //         headBox: {
  //           angleIronQty: sheet.headBoxAngleIronQuantity,
  //           angleIronSize: sheet.angleIronSize,
  //           form: sheet.headBoxForm_str,
  //           surface: '',
  //         },
  //         doorPiece: {
  //           material: sheet.com_slat_material,
  //           surface: sheet.com_slat_surface ?? '',
  //           thickness: sheet.thickness,
  //           slatLength: numToStr(sheet.prodSpec?.slatLength),
  //           slatCount: sheet.slatCount,
  //           antyTyphoonHook: sheet.isAntiTyphoon ? '有' : '無',
  //         },
  //         motor: {
  //           vendor: sheet.motorVendor,
  //           /**相數加電壓 */
  //           phaseVoltage: sheet.motorPhaseVoltage,
  //           horsepower: sheet.horsepower,
  //           direction: '', // 未知 // 在廠務部工作表 電動機方向
  //         },
  //         guideRail: {
  //           form: sheet.isAntiTyphoon ? '防颱' : '一般',
  //           material: sheet.com_guideRail_material,
  //           guideRailLength: numToStr(sheet.prodSpec?.guideRailLength),
  //           guideRailName: sheet.guideRailName,
  //           icon: sheet?.guideRailName
  //             ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${sheet?.guideRailName}`
  //             : undefined,
  //           antiTyphoonHook: '-50', // 未知 // 在廠務部工作表
  //           bendStraight: sheet.guideRailType ?? '',
  //         },
  //         chainCog: {
  //           sprocketWheelModel: sheet.sprocketWheelModel ?? '',
  //           sprocketWheelTeethNumber: sheet.sprocketWheelTeethNumber ?? '',
  //           bearingInnerDiameter: sheet.bearingInnerDiameter ?? '',
  //           teethQuantity: '', // 未知 // 在廠務部工作表 齒數
  //           centerDistance: '', // 未知 // 在廠務部工作表 中心距
  //           eyesQuantity: '', // 未知 // 在廠務部工作表 目數
  //         },
  //         base: {
  //           material: sheet.com_bottomBar_material,
  //           guideRailsOpening: sheet.guideRailsOpening,
  //           surface: '', // 未知 在廠務部工作表
  //         },
  //         sidePlate: {
  //           direction: '', // 未知 在廠務部工作表
  //           bigSidePlate: `${sheet.boxB_mm}*${sheet.boxD_mm}`,
  //           smallSidePlate: `${sheet.boxB_mm}*${sheet.boxB_mm}`,
  //         },
  //         memo: sheet.acceNameArr.length > 0 ? sheet.acceNameArr.join('、') : '',
  //       };
  //       workSheetPDF_01_itemArr.push(control_item);
  //     });
  //   });

  //   const control_workSheetPDF_01: Tcontrol_workSheetPDF_01 = {
  //     info: {
  //       contractNumber: profile.projectNumber,
  //       projectName: profile.projectName,
  //       projectAddress: profile.allAddress,
  //       customerName: contract?.content.customer.name ?? '',
  //       contactPerson: engineeringContact?.contactInfo?.[0]?.contactPerson ?? '',
  //       // 開單日
  //       billingDate: workSheet?.createdAt ? getTaiwanDateStr(workSheet.createdAt) ?? '' : '', // 未知
  //       // 出貨日
  //       shippingDate: '', // 未知
  //     },
  //     itemArr: workSheetPDF_01_itemArr,
  //     // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
  //   };

  //   let totalQty_PDF_02 = 0;
  //   workSheetPDF_01_itemArr.forEach((item) => {
  //     totalQty_PDF_02 = totalQty_PDF_02 + Number(item.size.qty);
  //   });
  //   const control_workSheetPDF_02: Tcontrol_workSheetPDF_02 = {
  //     info: {
  //       projectName: profile.projectName,
  //       totalQty: String(totalQty_PDF_02),
  //     },
  //     itemArr: workSheetPDF_01_itemArr,
  //     // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
  //   };

  //   return {
  //     control_workSheetPDF_01,
  //     control_workSheetPDF_02,
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sheetList]);

  // -------------------------------------------------------------------------

  const panelList_allow: TpanelList = [
    // {
    //   type: 'myButton',
    //   label: '匯出EXCEL',
    //   onClick: () => downloadExcel(control_workSheetPDF_01, `工作表_${profile.projectName}`),
    // },
    // {
    //   type: 'myButton',
    //   label: '匯出廠務部工作表',
    //   onClick: () => setIsShowPdf02(true),
    // },
    // {
    //   type: 'myButton',
    //   label: '匯出工作表',
    //   onClick: () => setIsShowPdf(true),
    // },
    {
      type: 'myButton',
      label: havePermissionToEdit ? '編輯' : '沒有編輯權限',
      onClick: () => {
        if (havePermissionToEdit) {
          setDisabled(false);
        }
      },
    },
  ];

  const panelList_notAllow: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_allow : panelList_notAllow;
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------------

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
            <RecordList control={{ recordArr: fakeRecordArr }} />
          </div>
          {/* right */}
        </div>
        {/* main */}
      </div>
      {/* <InputModal
        visible={!!targetDivideItem}
        title="分堆"
        placeholder="請輸入數量"
        onConfirm={(str) => {
          targetDivideItem?.(Number(str));
        }}
        onCancel={() => setTargetDivideItem(undefined)}
        inputAttr={{
          type: 'number',
        }}
      /> */}
      {/* <WorkSheetPDF isShow={isShowPdf} onCancel={() => setIsShowPdf(false)} control={control_workSheetPDF_01} />
      <WorkSheetPDF_02 isShow={isShowPdf02} onCancel={() => setIsShowPdf02(false)} control={control_workSheetPDF_02} /> */}
    </SubLayer>
  );
}

// ===========================================================================

const numToStr = (num: number | undefined) => {
  if (num === undefined) {
    return '';
  }

  return String(num);
};

const creCheckBarOptionArr = ({ optionArr }: { optionArr: Toption[] }) => {
  const arr = optionArr.map((item) => {
    return { key: item.value, label: item.label };
  });

  return arr;
};

// ============================================================================

// ============================================================================

const fakeRecordArr: Trecord[] = [
  {
    itemName: 'NNAAMMEE',
    doorModel: 'aaa',
    fullWidth: '2',
    height: '2',
    qty: '5',
    material: 'aaa',
    isAntyTyphoon: true,

    reviewSalesName: 'AAAA',
    reviewSalesStatus: 'green',

    reviewManagerName: 'BBBB',
    reveiwManagerStatus: 'red',
  },
  {
    itemName: 'NNAAMMEE',
    doorModel: 'aaa',
    fullWidth: '2',
    height: '2',
    qty: '5',
    material: 'aaa',
    isAntyTyphoon: false,

    reviewSalesName: 'AAAA',
    reviewSalesStatus: 'green',

    reviewManagerName: 'BBBB',
    reveiwManagerStatus: 'red',
  },
];

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
