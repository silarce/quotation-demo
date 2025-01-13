import type { TstateProd, TstateProdDict } from '../type';
import Decimal from 'decimal.js';
import { ClassProd } from '../useQuotationProduct';

import type {
  TcreateQuotationProductComponentDto,
  TcreateQuotationProductAccessoryDto,
  TcreateQuotationProductDto,
} from 'js/api/dtoTypes';

// =====================================================================

// MARK:calcProductBody
const calcProductBody = ({
  prodKeyArr,
  state_prodDict,
  state_iterativeProdDict,

  createClassProd,
}: {
  prodKeyArr: string[];
  state_prodDict: TstateProdDict;
  state_iterativeProdDict: TstateProdDict;

  createClassProd: (stateProd: TstateProd) => ClassProd;
}) => {
  const totalQty_decimal = new Decimal(0);
  let isAllDoorModalValid = true;

  let stateProdArr = prodKeyArr.map((key) => state_prodDict[key]);
  stateProdArr = stateProdArr.map((stateProd, index) => {
    const { doorModelName, quantity } = stateProd.data_prod;
    totalQty_decimal.add(quantity || 0);

    !doorModelName && (isAllDoorModalValid = false);

    stateProd.data_prod.order = index;

    return stateProd;
  });

  const stateProdArr_iterative: TstateProd[] = Object.values(state_iterativeProdDict)
    .filter((stateProd) => {
      const { qty_reduce, modifyedProduct } = stateProd;

      if (!qty_reduce && !Object.keys(modifyedProduct).length) {
        return false;
      }

      return true;
    })
    .map((stateProd) => {
      const copy = { ...stateProd };
      copy.attachedToProduct = stateProd;

      copy.data_prod = {
        ...copy.data_prod,
        attachedToProductId: copy.data_prod.id,
      };

      // attachedToProduct

      const { qty_reduce, modifyedProduct } = copy;
      const qty_modify = Object.values(modifyedProduct)
        .reduce((acc, { quantity }) => acc.add(quantity), new Decimal(0))
        .toNumber();

      const quantity = new Decimal(copy.data_prod.quantity || 0)
        .sub(qty_reduce || 0)
        .sub(qty_modify)
        .toNumber();
      copy.data_prod.quantity = `${quantity}`;

      return copy;
    });

  // const invalidComponentArr: number[] = [];

  // const classProdArr = prodKeyArr.map((key) => {
  //   return createClassProd(state_prodDict[key]);
  // });

  // const stateArr = classProdArr.map((classProd, index) => {
  //   const { state: stateProd, isComponentValid } = classProd;

  //   // 目前isComponentValid只會為true，未來要再製作
  //   if (!isComponentValid) {
  //     const indexNumber = index + 1; // 給使用者看得流水號
  //     invalidComponentArr.push(indexNumber);
  //   }

  //   const { doorModelName, quantity } = stateProd.data_prod;
  //   totalQty_decimal.add(quantity || 0);

  //   !doorModelName && (isAllDoorModalValid = false);

  //   stateProd.data_prod.order = index;

  //   return stateProd;
  // });

  const quotationProductArr = stateProdArr.map((stateProd) => formatProdStateToBody(stateProd));
  const quotationProductArr_iterative = stateProdArr_iterative.map((stateProd) => formatProdStateToBody(stateProd));

  return {
    quotationProductArr: [...quotationProductArr, ...quotationProductArr_iterative],
    isAllDoorModalValid,
    // invalidComponentArr,
    totalQty: totalQty_decimal.toNumber(),
  };
};

// MARK: formatProdStateToBody
const formatProdStateToBody = (stateProd: TstateProd) => {
  const {
    data_prod,

    data_componentDict,
    componentKeyArr,

    data_accessoryDict,
    accessoryKeyArr,
    attachedToProduct,
  } = stateProd;

  const componentArr = componentKeyArr.map((key) => data_componentDict[key]);

  let someComponentInvalid = false;

  const components_pre: (TcreateQuotationProductComponentDto | 'invalid' | undefined)[] = componentArr.map(
    (component, index) => {
      if (component === undefined) {
        return undefined;
      }

      const { number, componentId, rawData } = component;

      if (!number || !componentId || !rawData) {
        someComponentInvalid = true;

        return 'invalid';
      }

      const body: TcreateQuotationProductComponentDto = {
        type: component.type,
        number,
        componentId,
        rawData: {}, // 必須要送隨便送一個物件
        bom: component.bom,
        material: component.material,
        materialSurface: component.materialSurface || undefined,
        isPainted: component.isPainted,
        price: Number(component.price || 0),
        quantity: component.quantity,
        order: index,
        desc: component.desc,
        density: component.density,
      };

      return body;
    }
  );

  const components: TcreateQuotationProductComponentDto[] = components_pre.filter(
    (item) => item !== 'invalid' && item !== undefined
  ) as TcreateQuotationProductComponentDto[];

  const accessoryArr = accessoryKeyArr.map((key) => data_accessoryDict[key]);
  const accessories: TcreateQuotationProductAccessoryDto[] = accessoryArr.map((acce) => {
    const body: TcreateQuotationProductAccessoryDto = {
      codeName: acce.codeName,
      name: acce.name,
      unit: acce.unit,
      quantity: Number(acce.quantity || 0),
      unitPrice: Number(acce.unitPrice || 0),
      totalPrice: Number(acce.totalPrice || 0),
      originalPrice: acce.originalPrice,
      price: Number(acce.price || 0),
      dualPrice: Number(acce.dualPrice || 0),
      order: acce.order,
      referenceSpec: acce.referenceSpec,
    };

    return body;
  });

  const formated: TcreateQuotationProductDto = {
    // 產品id
    // id: data_prod.id || undefined,
    id: attachedToProduct?.data_prod.id || undefined, // 追減或變更追加，id要送來源產品id
    // 來源產品
    attachedToProductId: data_prod.attachedToProductId,

    // 折數
    discount: data_prod.discount, // `${number}`
    // 項目名
    itemName: data_prod.itemName,
    // 報價別
    quoteType: data_prod.quoteType,
    // 門型
    doorModelName: data_prod.doorModelName,
    // L(mm)全寬 // 單位為mm
    fullWidth: new Decimal(data_prod.fullWidth).mul(1000).toNumber(),

    WG: new Decimal(data_prod.WG).mul(1000).toNumber(),
    // h(mm) // 單位為mm
    height: new Decimal(data_prod.height).mul(1000).toNumber(),
    // B(mm) // 單位為mm
    boxB: new Decimal(data_prod.boxB).mul(1000).toNumber(),
    // D(mm) // 單位為mm
    boxD: new Decimal(data_prod.boxD).mul(1000).toNumber(),
    // 面積
    area: data_prod.area,
    // 才數
    volume: data_prod.volume,
    // 材料
    materialName: data_prod.materialName,
    // 表面
    materialSurface: data_prod.materialSurface,
    // 門軌
    guideRail: data_prod.guideRail,
    // 馬力
    horsepower: data_prod.horsepower,
    // 馬達廠商
    motorVendor: data_prod.motorVendor || null,
    // 電壓
    motorVoltage: data_prod.motorVoltage,
    // 馬達支撐架
    hasMotorSupportStand: data_prod.hasMotorSupportStand,
    // 底座類型
    bottomBar: data_prod.bottomBar, // 鋁障感 | 止水型 | ''
    // 馬達鎖盒
    motorLockBox: data_prod.motorLockBox,
    // 門軌厚度
    guideRailThickness: data_prod.guideRailThickness || null,
    // 捲軸規格  // 棄用
    rollerSpec: null, // 無凸 | 雙凸
    // 門軌消音條
    hasSilencingStrip: data_prod.hasMotorSupportStand,
    // 一體式捲箱
    isIntegratedHeadBox: data_prod.isIntegratedHeadBox,
    // 捲箱厚度
    headBoxThickness: data_prod.headBoxThickness,
    // 數量
    quantity: Number(data_prod.quantity || 0),
    // 單價
    unitPrice: Number(data_prod.unitPrice || 0),
    // 牌價
    price: Number(data_prod.price || 0),
    // 複價
    totalPrice: Number(data_prod.totalPrice || 0),
    // 牌價複價
    dualPrice: Number(data_prod.dualPrice || 0),
    // 防颱
    isAntiTyphoon: data_prod.isAntiTyphoon,
    // 彈射門
    bounceDoor: data_prod.bounceDoor,
    // 彈射門寬度
    bounceDoorWidth: Number(data_prod.bounceDoorWidth || 0),
    // 彈射門高度
    // bounceDoorHeight?: data_prod.bounceDoorHeight,
    // 彈射門長度
    // bounceDoorLength?: data_prod.bounceDoorLength,
    // 關閉方式 // 在前端顯示的label為開閉方式
    closingType: data_prod.closingType,
    // 備註
    notes: data_prod.notes,
    // 相數
    motorPhase: data_prod.motorPhase,
    // 底座角鐵
    bottomBarAngleIron: data_prod.bottomBarAngleIron,
    // 底座板
    bottomBarPlate: data_prod.bottomBarPlate,
    // 排序
    order: data_prod.order ?? 9999,
    // 門片厚度
    thickness: data_prod.thickness,
    // 配電箱牌價
    distributionBoxPrice: data_prod.distributionBoxPrice ? Number(data_prod.distributionBoxPrice) : null,
    // 配電箱單價
    distributionBoxUnitPrice: data_prod.distributionBoxUnitPrice ? Number(data_prod.distributionBoxUnitPrice) : null,
    // 配電箱數量
    distributionBoxQuantity: data_prod.distributionBoxQuantity ? Number(data_prod.distributionBoxQuantity) : null,
    // 配電箱牌價複價
    distributionBoxDualPrice: data_prod.distributionBoxDualPrice ? Number(data_prod.distributionBoxDualPrice) : null,
    // 配電箱複價
    distributionBoxTotalPrice: data_prod.distributionBoxTotalPrice ? Number(data_prod.distributionBoxTotalPrice) : null,
    // 安裝費牌價
    installationFeePrice: data_prod.installationFeePrice ? Number(data_prod.installationFeePrice) : null,
    // 安裝費牌價複價
    installationFeeDualPrice: data_prod.installationFeeDualPrice || null,
    // 安裝費數量
    installationFeeQuantity: data_prod.installationFeeQuantity || null,
    // 安裝費單價
    installationFeeUnitPrice: data_prod.installationFeeUnitPrice ? Number(data_prod.installationFeeUnitPrice) : null,
    // 安裝費複價
    installationFeeTotalPrice: data_prod.installationFeeTotalPrice || null,
    // 門片 - 捲片支數
    slatCount: data_prod.slatCount,
    // 鏈齒輪 - 鏈齒輪番號
    sprocketWheelModel: data_prod.sprocketWheelModel,
    // 鏈齒輪 - 大鏈輪
    sprocketWheelTeethNumber: data_prod.sprocketWheelTeethNumber,
    // 不確定這個property的意義，可能為鍊條數量
    sprocketWheelChains: data_prod.sprocketWheelChains,
    // 鏈齒輪/捲軸 - 孔徑/軸徑
    bearingInnerDiameter: data_prod.bearingInnerDiameter,
    // 捲軸 - 尺寸
    diameter: data_prod.diameter,
    // 捲軸 - 總長
    bearingHousingTotalLength: data_prod.bearingHousingTotalLength,
    // 底座 - 開口
    guideRailsOpening: data_prod.guideRailsOpening,
    // 門片長度
    slatLength: data_prod.slatLength,
    // 門軌長度
    guideRailLength: data_prod.guideRailLength,
    // 捲箱長度
    headBoxLength: data_prod.headBoxLength,
    // 軸承座寸法
    bearingHousingSize: data_prod.bearingHousingSize,
    // 軸承
    bearingName: data_prod.bearingName,
    gapA: data_prod.gapA || null,
    gapC: data_prod.gapC || null,
    gearNumber: data_prod.gearNumber,
    weight: data_prod.weight,
    // guideRailG為門軌的width
    // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
    guideRailG: data_prod.guideRailG,
    // 門軌UL
    isULGuideRail: data_prod.isULGuideRail,
    // 材料/配件設定
    components: components,
    // 選配設定
    accessories: accessories,

    //
    //
    //
  };

  return formated;
};

// =====================================================================
export { calcProductBody };
