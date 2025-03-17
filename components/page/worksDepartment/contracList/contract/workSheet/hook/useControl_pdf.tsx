import { useEffect, useMemo } from 'react';

// component
import { Tcontrol_profile } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';
import { Tcontrol_workSheetPDF_01 } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';
import { Tcontrol_workSheetPDF_02 } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

import { useGetAssetDict } from 'js/api/api_product';

// type
import type { TquotationProductItemDto, TworksheetRecordDto, TquotationProductComponentDto } from 'js/api/dtoTypes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { calcFullHeight, calcAngleIronSize } from 'js/utils/product/calc';
import { lookup_motorPhase } from 'config/product/lookup';
import { getProductHeadBoxImgUrl } from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/form/shared';

import { doorModelDict } from 'js/utils/options/productOptions';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';
// ==============================================================================

type TcomponentList = {
  [key: string]: TquotationProductComponentDto | undefined;
};

// ==============================================================================
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
  latestRecordArr: (TworksheetRecordDto & {
    parentId: string;
    parentItemName: string;
  })[];
}) => {
  const { isReady, parseDoorModelSort } = useGlobal_doorModel();

  const { assetDict, updatePath } = useGetAssetDict<string>();

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
    const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];
    const specialItemArr: Tcontrol_workSheetPDF_01['specialItemArr'] = [];
    const w1w3ItemArr: Tcontrol_workSheetPDF_01['w1w3ItemArr'] = [];

    latestRecordArr.forEach((record) => {
      if (!record.contractProductItems) {
        return;
      }

      const item = record.contractProductItems[0];

      const doorModelSort = parseDoorModelSort(item.doorModelName);

      if (doorModelSort === 'normal') {
        const control_item = createPdfItem({
          contractProductItems: record.contractProductItems,
          assetDict,
          parentId: record.parentItemName,
          parentItemName: record.parentItemName,
        });

        workSheetPDF_01_itemArr.push(control_item);
      } else if (doorModelSort === 'special') {
        const control_item = createPdfSpecialItem({
          contractProductItems: record.contractProductItems,
          assetDict,
          parentId: record.parentItemName,
          parentItemName: record.parentItemName,
        });
        specialItemArr.push(control_item);
      } else if (doorModelSort === 'w13456') {
        const control_item = createPdfSpecialItem({
          contractProductItems: record.contractProductItems,
          assetDict,
          parentId: record.parentItemName,
          parentItemName: record.parentItemName,
        });
        w1w3ItemArr.push(control_item);
      }
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
      specialItemArr,
      w1w3ItemArr,
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
    isReady,
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
        headBoxCover: item.headBoxCover || 'none',
        sizeB: item.boxB,
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

// MARK:createPdfItem
const createPdfItem = ({
  contractProductItems,
  assetDict,
  parentId,
  parentItemName,
}: {
  contractProductItems: TquotationProductItemDto[];
  assetDict: Record<string, string>;
  parentId: string;
  parentItemName: string;
}) => {
  const item = contractProductItems[0];
  const qty = contractProductItems.length;

  const {
    motorVoltage,
    motorPhase,
    components,
    accessories,

    isIntegratedHeadBox,
    hasWheel,
    headBoxTopCover,
    headBoxCover,
    boxB,
  } = item;

  const phaseVoltage = `${lookup_motorPhase[String(motorPhase) as '1' | '3'] ?? ''} ${motorVoltage}V`;

  const {
    headBox1: url_headBox1,
    headBox2: url_headBox2,
    headBoxTopCover: url_headBoxTopCover,
    headBoxCover: url_headBoxCover,
  } = getProductHeadBoxImgUrl({
    isIntegratedHeadBox: !!isIntegratedHeadBox,
    hasWheel: !!hasWheel,
    headBoxTopCover: !!headBoxTopCover,
    headBoxCover: headBoxCover ?? 'none',
    sizeB: boxB,
  });

  const componentList = (() => {
    const list: TcomponentList = {};
    components.forEach((component) => {
      list[component.type] = component;
    });

    return list;
  })();

  const acceNameArr = accessories.map((acce) => acce.name);

  const material = (() => {
    if (item.doorModelName !== 'SJ-305D') {
      return componentList.slat?.material ?? '';
    } else if (componentList.slat?.material === 'SST管1.0T' || componentList.slat?.material === '內SST管外SST管1.0T') {
      return 'SST';
    } else {
      return componentList.slat?.material ?? '';
    }
  })();

  const control_item: Tcontrol_workSheetPDF_01['itemArr'][number] = {
    id: item.id,
    parentId: parentId,
    parentItemName: parentItemName,

    itemName: item.itemName,
    size: {
      qty: `${qty}`,
      doorModelName: item.doorModelName,
      // doorModelName: doorModelDict[item.doorModelName]?.label ?? '', // 格子不夠大
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
      // upperMask: item.upperMask ? '有' : '無',
      headBoxSizeB: item.boxB,
      headBoxSizeD: item.boxD,
      headBoxSizeX: item.headBoxSizeX,
      headBoxSizeY: item.headBoxSizeY,
      headBoxSizeO: item.headBoxSizeO,
      headBoxSizeP: item.headBoxSizeP,
      headBoxSizeQ: item.headBoxSizeQ,
      headBoxSizeM:
        (item.headBoxCover === 'none' || !item.headBoxCover) && !Number(item.headBoxSizeM) ? '無' : item.headBoxSizeM,
      headBoxSizeN: !item.headBoxTopCover && !Number(item.headBoxSizeN) ? '無' : item.headBoxSizeN,

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

  return control_item;
};

// MARK:createPdfSpecialItem
const createPdfSpecialItem = ({
  contractProductItems,
  assetDict,
  parentId,
  parentItemName,
}: {
  contractProductItems: TquotationProductItemDto[];
  assetDict: Record<string, string>;
  parentId: string;
  parentItemName: string;
}) => {
  const item = contractProductItems[0];
  const qty = contractProductItems.length;

  const {
    doorModelName,
    itemName,

    materialName,
    materialSurface,
    closingType,
    isAntiTyphoon,
    skeleton,
    fullWidth,
    height,
    WG,
    gapA,
    gapC,

    isIntegratedHeadBox,
    // upperMask,
    hasWheel,
    headBoxCover,
    headBoxTopCover,
    headBoxSizeO,
    headBoxSizeP,
    headBoxSizeQ,
    headBoxSizeX,
    headBoxSizeY,
    headBoxSizeM,
    headBoxSizeN,
    boxB,
    boxD,

    //
    motorVendor,
    horsepower,
    guideRailType,
    diameter,
    sprocketWheelModel,
    motorPhase,
    motorVoltage,
  } = item;

  const phase = motorPhase ? lookup_motorPhase[String(motorPhase) as '1' | '3'] : '';
  const voltage = motorVoltage ? `${motorVoltage}V` : '';
  const electricSupply = `${phase} ${voltage}`;

  const {
    headBox1: url_headBox1,
    headBox2: url_headBox2,
    headBoxTopCover: url_headBoxTopCover,
    headBoxCover: url_headBoxCover,
  } = getProductHeadBoxImgUrl({
    isIntegratedHeadBox: !!isIntegratedHeadBox,
    hasWheel: !!hasWheel,
    headBoxTopCover: !!headBoxTopCover,
    headBoxCover: headBoxCover ?? 'none',
    sizeB: boxB,
  });

  const headBoxSvgString1 = assetDict[url_headBox1.name || 'null'] || null;
  const headBoxSvgString2 = assetDict[url_headBox2.name || 'null'] || null;
  const headBoxSvgString3 = assetDict[url_headBoxTopCover.name || 'null'] || null;
  const headBoxSvgString4 = assetDict[url_headBoxCover.name || 'null'] || null;

  const specialItem: Tcontrol_workSheetPDF_01['specialItemArr'][number] = {
    id: item.id,
    parentId,
    parentItemName,

    doorModelName: doorModelDict[doorModelName]?.label ?? doorModelName,
    itemName,
    qty,
    materialName,
    materialSurface,
    closingType,
    isAntiTyphoon: isAntiTyphoon ? '有' : '無',
    skeleton,
    fullWidth: fullWidth + ' mm',
    height: height + ' mm',
    WG: WG + ' mm',
    gapA: gapA !== null ? gapA + ' mm' : null,
    gapC: gapC !== null ? gapC + ' mm' : null,
    BD: `${boxB}*${boxD ?? 0}`,
    fullHeight: String(calcFullHeight({ height: Number(height), boxB: boxB })) + ' mm',
    isIntegratedHeadBox: isIntegratedHeadBox ? '一體式捲箱' : '捲箱 + 機箱',
    // upperMask: upperMask ? '有' : '無',
    hasWheel: hasWheel ? '有' : '無',
    headBoxCover: headBoxCover === 'full' ? '全遮' : item.headBoxCover === 'half' ? '半遮' : '無',
    headBoxTopCover: headBoxTopCover ? '有' : '無',
    headBoxSizeO: headBoxSizeO !== null ? headBoxSizeO + ' mm' : null,
    headBoxSizeP: headBoxSizeP !== null ? headBoxSizeP + ' mm' : null,
    headBoxSizeQ: headBoxSizeQ !== null ? headBoxSizeQ + ' mm' : null,
    headBoxSizeX: headBoxSizeX !== null ? headBoxSizeX + ' mm' : null,
    headBoxSizeY: headBoxSizeY !== null ? headBoxSizeY + ' mm' : null,
    headBoxSizeM: headBoxSizeM !== null ? headBoxSizeM + ' mm' : null,
    headBoxSizeN: headBoxSizeN !== null ? headBoxSizeN + ' mm' : null,
    boxB: boxB !== null ? boxB + ' mm' : null,
    boxD: boxD !== null ? boxD + ' mm' : null,
    //
    motorVendor: motorVendor ?? '',
    electricSupply,
    horsepower,
    guideRailType,
    diameter: diameter !== null ? diameter + '"' : null,
    sprocketWheelModel,
    headBoxImg1: headBoxSvgString1 ? <div dangerouslySetInnerHTML={{ __html: headBoxSvgString1 }} /> : null,
    headBoxImg2: headBoxSvgString2 ? <div dangerouslySetInnerHTML={{ __html: headBoxSvgString2 }} /> : null,
    headBoxImg3: headBoxSvgString3 ? <div dangerouslySetInnerHTML={{ __html: headBoxSvgString3 }} /> : null,
    headBoxImg4: headBoxSvgString4 ? <div dangerouslySetInnerHTML={{ __html: headBoxSvgString4 }} /> : null,
  };

  return specialItem;
};

export { useControl_pdf };
