import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
// import _ from 'lodash';
import { useRouter } from 'next/router';

// component
import WorkSheetPDF, {
  Tcontrol_workSheetPDF_01,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';

import WorkSheetPDF_02, {
  Tcontrol_workSheetPDF_02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TupdateWorkSheetItem,
  useGetEngineeringContact,
  useGetWorkSheet,
  apiPatchWorkSheet,
  apiPostEngineeringDeliveryList,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';

// hook
import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';

import type { TquotationProductItemDto } from 'js/api/dtoTypes';

// =====================================================================
type Tprofile = {
  projectName: string;
  projectContent: string;
  projectNumber: string;
  projectFaxNumber: string;
  projectPerson: string;
  projectPersonNumber: string;
  allAddress: string;
  engineeringNumber: string;
  contractor: string;
  principal: string;
  contactNumber: string;
  faxNumber: string;
};

// =====================================================================
export default function ExportWorksheet() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [isShowPdf, setIsShowPdf] = useState(false);
  const [isShowPdf02, setIsShowPdf02] = useState(false);
  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  // const engineeringContactId = contract?.engineeringContactId;
  const { engineeringContactId, worksheetId } = contract ?? {};
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);
  const { workSheet, update_workSheet } = useGetWorkSheet(worksheetId);
  const { res: doorModelArr, update: update_doorModelArr, doorModelList } = useApiGetProdDoorModels();

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

      update_doorModelArr();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res01 = update_engineeringContact();
        const res02 = update_workSheet();
        await Promise.all([res01, res02]);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  // --------------------------------------------------------
  const { itemTokenList, itemIdArrList } = useMemo(() => {
    if (!workSheet?.contractProductItems) {
      return {};
    }

    const contractProductItems = workSheet.contractProductItems;

    type TitemTokenList = {
      [key: string]: {
        originalItem: TquotationProductItemDto;
        [key: string]: TquotationProductItemDto;
      };
    };

    type TitemIdArrList = { [key: string]: { [key: string]: string[] } };

    const itemTokenList: TitemTokenList = {};
    const itemIdArrList: TitemIdArrList = {};

    contractProductItems.forEach((item) => {
      const { productId, adjustedItem, adjustedItemId } = item;

      let theItem: typeof item;
      let theId: string;

      if (adjustedItem && adjustedItemId) {
        theItem = adjustedItem;
        theId = adjustedItemId;
      } else {
        theItem = item;
        theId = productId;
      }

      if (!itemTokenList[productId]) {
        itemTokenList[productId] = {
          originalItem: item,
          [productId]: item, //itemTokenList[productId][productId] 為原始資料
        };
      }

      itemTokenList[productId][theId] = theItem;

      //
      if (!itemIdArrList[productId]) {
        itemIdArrList[productId] = {
          [productId]: [], //itemIdArrList[productId][productId] 為原始資料代表的itemId陣列
        };
      }

      if (!itemIdArrList[productId][theId]) {
        itemIdArrList[productId][theId] = [];
      }

      itemIdArrList[productId][theId].push(item.id);

      //
    }); //  forEach close

    return {
      itemTokenList,
      itemIdArrList,
    };
  }, [workSheet]);

  // console.log(itemTokenList);
  // console.log(itemIdArrList);

  // --------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>(creEmptyProfile());

  // --------------------------------------------------------

  const { sheetList, changedSheetList, reset } = useWorkSheet({
    itemTokenList: itemTokenList ?? {},
    itemIdArrList: itemIdArrList ?? {},
  });

  // --------------------------------------------------------

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    const {
      //
      projectName,
      projectContent,
      projectNumber,
      projectPrincipal,
      constructionSitePrincipalContactNumber,
      constructionSiteFaxNumber,
      constructionSiteContactNumber,
      contractor,
      contractorPrincipal,
      contractorContactNumber,
      contractorFaxNumber,

      //
      county,
      district,
      address,
    } = engineeringContact;

    setProfile({
      projectName: projectName,
      projectContent,
      projectNumber: constructionSiteContactNumber,
      projectFaxNumber: constructionSiteFaxNumber,
      projectPerson: projectPrincipal,
      projectPersonNumber: constructionSitePrincipalContactNumber,
      allAddress: `${county}${district}${address}`,
      engineeringNumber: projectNumber,
      contractor: contractor,
      principal: contractorPrincipal,
      contactNumber: contractorContactNumber,
      faxNumber: contractorFaxNumber,
    });

    //
  }, [engineeringContact]);

  //
  useEffect(() => {
    reset();
  }, [itemTokenList]);

  // --------------------------------------------------------

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
    const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];

    Object.values(sheetList).forEach((subList) => {
      Object.values(subList).forEach((sheet) => {
        const control_item: Tcontrol_workSheetPDF_01['itemArr'][number] = {
          itemName: sheet.itemName,
          size: {
            qty: sheet.quantity,
            doorModelName: sheet.doorModelName,
            fullWidth: sheet.fullWidth_mm,
            height: sheet.height_mm,
            WG: sheet.WG_mm,
            gapA: numToStr(sheet.prodSpec?.gapA),
            gapC: numToStr(sheet.prodSpec?.gapC),
            /**支版尺寸 boxB*boxD */
            BD: sheet.BD,
            /**捲門全高 */
            fullHeight: '???',
          },
          roller: {
            diameter: sheet.diameter,
            bearingInnerDiameter: sheet.bearingInnerDiameter,
            bearingName: sheet.prodSpec?.bearingName ?? '',
            bearingHousingTotalLength: sheet.bearingHousingTotalLength,
            bearingHousingSize: numToStr(sheet.prodSpec?.bearingHousingSize),
          },
          headBox: {
            angleIronQty: '???',
            angleIronSize: '???',
            info: '???',
          },
          doorPiece: {
            material: sheet.com_slat_material,
            thickness: sheet.thickness,
            slatLength: numToStr(sheet.prodSpec?.slatLength),
            slatCount: sheet.slatCount,
            antyTyphoonHook: '???',
          },
          motor: {
            vendor: sheet.motorVendor,
            /**相數加電壓 */
            phaseVoltage: sheet.motorPhase + sheet.motorVoltage,
            horsepower: sheet.horsepower,
          },
          guideRail: {
            彎直: '???',
            material: sheet.com_guideRail_material,
            guideRailLength: numToStr(sheet.prodSpec?.guideRailLength),
            guideRailName: sheet.guideRailName,
            icon: sheet?.guideRail
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${sheet?.guideRail}`
              : undefined,
          },
          chainCog: {
            sprocketWheelModel: sheet.sprocketWheelModel,
            sprocketWheelTeethNumber: sheet.sprocketWheelTeethNumber,
            bearingInnerDiameter: sheet.bearingInnerDiameter,
          },
          base: {
            material: sheet.com_bottomBar_material,
            guideRailsOpening: sheet.guideRailsOpening,
          },
          memo: sheet.acceNameArr.length > 0 ? sheet.acceNameArr.join('、') : '',
        };
        workSheetPDF_01_itemArr.push(control_item);
      });
    });

    const control_workSheetPDF_01: Tcontrol_workSheetPDF_01 = {
      info: {
        contractNumber: profile.projectNumber,
        projectName: profile.projectName,
        projectAddress: profile.allAddress,
        customerName: contract?.content.customer.name ?? '',
        // contactPerson: contract?.content.customer.contacts?.[0]?.name ?? '',
        contactPerson: '???',
        // 開單日
        billingDate: '???-??-??',
        // 出貨日
        shippingDate: '???-??-??',
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
        projectName: profile.projectName,
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
  }, [sheetList]);

  console.log(control_workSheetPDF_01);

  // --------------------------------------------------------
  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
// ===========================================================================

const numToStr = (num: number | undefined) => {
  if (num === undefined) {
    return '';
  }

  return String(num);
};

// ============================================================================

const creEmptyProfile = (): Tprofile => ({
  projectName: '',
  projectContent: '',
  projectNumber: '',
  projectFaxNumber: '',
  projectPerson: '',
  projectPersonNumber: '',
  allAddress: '',
  engineeringNumber: '',
  contractor: '',
  principal: '',
  contactNumber: '',
  faxNumber: '',
});
