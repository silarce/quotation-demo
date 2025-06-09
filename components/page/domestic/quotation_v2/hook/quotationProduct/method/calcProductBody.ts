import type { TstateProd, TstateProdDict, TcomponentRawDataDict, TstateComponentData } from '../type';
import Decimal from 'decimal.js';

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
}: {
  prodKeyArr: string[];
  state_prodDict: TstateProdDict;
  state_iterativeProdDict: TstateProdDict;
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
      const qty_reduce_num = Number(qty_reduce || 0);

      if (!qty_reduce_num && !Object.keys(modifyedProduct).length) {
        return false;
      }

      return true;
    })
    .map((stateProd) => {
      const copy = { ...stateProd };
      copy.rootProduct = stateProd;

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
      copy.action = '追減'; // 其實應該已經在呼叫useDefaultState_prodDict的時候設為追減了

      return copy;
    });

  const quotationProductArr = stateProdArr.map((stateProd) => formatProdStateToBody(stateProd));
  const quotationProductArr_iterative = stateProdArr_iterative.map((stateProd) => formatProdStateToBody(stateProd));

  const invalidMessageArr = stateProdArr
    .map((stateProd) => {
      return isPordComponentValid(stateProd)?.invalidMessage;
    })
    .filter((item) => item !== undefined);

  return {
    quotationProductArr: [...quotationProductArr, ...quotationProductArr_iterative],
    // invalidComponentArr,
    totalQty: totalQty_decimal.toNumber(),
    //
    isAllDoorModalValid,
    isValid: invalidMessageArr.length === 0,
    invalidMessageArr,
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
    rootProduct: rootProduct,
    action,
  } = stateProd;

  // 追減或變更追加，id要送來源產品id
  let id: string | undefined = undefined;
  (action === '變更追加' || action === '追減') && (id = rootProduct?.latestIterativeId);

  // 雖然在這裡是追減，但是在送給後端並傳回來後，若該主產品涉及到變更
  // parseProdAction會把這個主產品分析為變更追減
  let attachedToProductId: string | undefined = undefined;
  action === '追減' && (attachedToProductId = rootProduct?.latestIterativeId);

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
  const accessories: TcreateQuotationProductAccessoryDto[] = accessoryArr.map((acce, index) => {
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
      order: index,
      referenceSpec: acce.referenceSpec,
    };

    return body;
  });

  const formated: TcreateQuotationProductDto = {
    // 產品id
    id,
    // 來源產品
    attachedToProductId,

    // 折數
    discount: data_prod.discount || '0', // `${number}`
    // 項目名
    itemName: data_prod.itemName,
    // 報價別
    quoteType: data_prod.quoteType,
    // 門型
    doorModelName: data_prod.doorModelName,
    // L(mm)全寬 // 單位為mm
    fullWidth: new Decimal(data_prod.fullWidth || 0).mul(1000).toNumber(),

    WG: new Decimal(data_prod.WG || 0).mul(1000).toNumber(),
    // h(mm) // 單位為mm
    height: new Decimal(data_prod.height || 0).mul(1000).toNumber(),
    // B(mm) // 單位為mm
    boxB: new Decimal(data_prod.boxB || 0).mul(1000).toNumber(),
    // D(mm) // 單位為mm
    boxD: new Decimal(data_prod.boxD || 0).mul(1000).toNumber(),
    // 面積
    area: data_prod.area || null,
    // 才數
    volume: data_prod.volume || null,
    // 材料
    materialName: data_prod.materialName,
    // 表面
    materialSurface: data_prod.materialSurface || null,
    // 門軌
    guideRail: data_prod.guideRail || null,
    // 馬力
    horsepower: data_prod.horsepower,
    // 馬達廠商
    motorVendor: data_prod.motorVendor || null,
    // 電壓
    motorVoltage: data_prod.motorVoltage || null,
    // 馬達支撐架
    hasMotorSupportStand: data_prod.hasMotorSupportStand,
    // 底座類型
    bottomBar: data_prod.bottomBar || null, // 鋁障感 | 止水型 | ''
    // 馬達鎖盒
    motorLockBox: data_prod.motorLockBox || null,
    // 門軌厚度
    guideRailThickness: data_prod.guideRailThickness || null,
    // 捲軸規格  // 棄用
    rollerSpec: null, // 無凸 | 雙凸
    // 門軌消音條
    hasSilencingStrip: data_prod.hasSilencingStrip,
    // 一體式捲箱
    isIntegratedHeadBox: data_prod.isIntegratedHeadBox,
    // 捲箱厚度
    headBoxThickness: data_prod.headBoxThickness || null,
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
    // 彈射門寬度 // 單位轉為mm
    bounceDoorWidth: new Decimal(data_prod.bounceDoorWidth || 0).mul(1000).toNumber(),
    // 要限制彈射門寬度的浮點數位數
    // 彈射門高度
    // bounceDoorHeight?: data_prod.bounceDoorHeight,
    // 彈射門長度
    // bounceDoorLength?: data_prod.bounceDoorLength,
    // 關閉方式 // 在前端顯示的label為開閉方式
    closingType: data_prod.closingType || null,
    // 備註
    notes: data_prod.notes,
    // 相數
    motorPhase: data_prod.motorPhase || null,
    // 底座角鐵
    bottomBarAngleIron: data_prod.bottomBarAngleIron || null,
    // 底座板
    bottomBarPlate: data_prod.bottomBarPlate || null,
    // 排序
    order: data_prod.order ?? 9999,
    // 門片厚度
    thickness: data_prod.thickness || null,
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
    slatCount: data_prod.slatCount || null,
    // 鏈齒輪 - 鏈齒輪番號
    sprocketWheelModel: data_prod.sprocketWheelModel || null,
    // 鏈齒輪 - 大鏈輪
    sprocketWheelTeethNumber: data_prod.sprocketWheelTeethNumber || null,
    // 不確定這個property的意義，可能為鍊條數量
    sprocketWheelChains: data_prod.sprocketWheelChains || null,
    // 鏈齒輪/捲軸 - 孔徑/軸徑
    bearingInnerDiameter: data_prod.bearingInnerDiameter || null,
    // 捲軸 - 尺寸
    diameter: data_prod.diameter || null,
    // 捲軸 - 總長
    bearingHousingTotalLength: data_prod.bearingHousingTotalLength || null,
    // 底座 - 開口
    guideRailsOpening: data_prod.guideRailsOpening || null,
    // 門片長度
    slatLength: data_prod.slatLength || null,
    // 門軌長度
    guideRailLength: data_prod.guideRailLength || null,
    // 捲箱長度
    headBoxLength: data_prod.headBoxLength || null,
    // 軸承座寸法
    bearingHousingSize: data_prod.bearingHousingSize || null,
    // 軸承
    bearingName: data_prod.bearingName || null,
    gapA: data_prod.gapA || null,
    gapC: data_prod.gapC || null,
    gearNumber: data_prod.gearNumber || null,
    weight: data_prod.weight || null,
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

// 泛型引數隨便選一個，這裡選"slat"
const isComponentValid = (componentState: TstateComponentData<keyof TcomponentRawDataDict>) => {
  const { rawData, bom } = componentState;

  if (!rawData || !bom) {
    return false;
  }

  return true;
};

const isPordComponentValid = (prodState: TstateProd) => {
  const isSpecial = !prodState.doorModel;
  const itemName = prodState.data_prod.itemName;

  if (isSpecial) {
    return {
      isValid: true,
      invalidMessage: undefined,
      itemName: itemName,
    };
  }

  const validComQty = prodState.data_prod.doorModelName === 'W2' ? 5 : 8;

  const classComponentArr = Object.values(prodState.data_componentDict);

  const comQty = classComponentArr.length;

  if (validComQty !== comQty) {
    return {
      isValid: false,
      invalidMessage: `${itemName}的材料配件數量不正確，應為${validComQty}個，但有${comQty}個`,
      itemName: itemName,
    };
  }

  const inValidComponen = classComponentArr.filter((com) => !isComponentValid(com));
  const inValidComponentName = inValidComponen.length === 0 ? undefined : inValidComponen.join(', ');

  if (inValidComponentName) {
    return {
      isValid: false,
      invalidMessage: `${itemName}的材料配件不正確，${inValidComponentName}`,
      itemName: itemName,
    };
  }
};

// =====================================================================
export { calcProductBody };
