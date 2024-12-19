import type { TstateProd, TstateProdData, TstateProdDict, TstateComponentData } from './type';

const createEmptyStateProdData = () => {
  const emptyStateProdData: TstateProdData = {
    id: null,
    itemName: '',
    discount: '',
    quoteType: '',
    doorModelName: '',
    fullWidth: '',
    WG: '',
    height: '',
    boxB: '',
    boxD: '',
    area: '',
    volume: '',
    materialName: '',
    materialSurface: '',
    horsepower: '',
    motorVendor: null,
    motorVoltage: null,
    motorPhase: null,
    guideRail: null,
    guideRailThickness: '',
    hasSilencingStrip: null,
    guideRailG: null,
    isULGuideRail: null,
    hasMotorSupportStand: null,
    bottomBar: null,
    motorLockBox: null,
    isIntegratedHeadBox: null,
    headBoxThickness: null,
    isAntiTyphoon: null,
    bounceDoor: null,
    bounceDoorWidth: '',
    closingType: '電動',
    notes: '',
    bottomBarAngleIron: null,
    bottomBarPlate: null,
    distributionBoxPrice: '',
    distributionBoxUnitPrice: '',
    distributionBoxQuantity: '',
    distributionBoxDualPrice: '',
    distributionBoxTotalPrice: '',
    installationFeePrice: '',
    installationFeeDualPrice: '',
    installationFeeQuantity: '',
    installationFeeUnitPrice: '',
    installationFeeTotalPrice: '',
    slatCount: null,
    guideRailsOpening: null,
    gapA: '',
    gapC: '',
    gearNumber: null,
    weight: null,
    thickness: '',
    sprocketWheelModel: null,
    sprocketWheelTeethNumber: null,
    sprocketWheelChains: null,
    bearingInnerDiameter: null,
    diameter: null,
    bearingHousingTotalLength: null,
    slatLength: null,
    guideRailLength: null,
    headBoxLength: null,
    bearingHousingSize: null,
    bearingName: null,
    quantity: '',
    price: '',
    dualPrice: '',
    unitPrice: '',
    totalPrice: '',
    rootProductId: '',
  };

  return emptyStateProdData;
};

const createEmptyStateProd = (key: string) => {
  const emptyStateProd: TstateProd = {
    key,

    data_prod: createEmptyStateProdData(),
    data_componentDict: {},
    componentKeyArr: [],

    data_accessoryDict: {},
    accessoryKeyArr: [],

    doorModel: null,

    generalSpecs: null,
    availableComponents: null,
    generateDoorProductBom: null,
    isFetching: false,
    afterChangeQueue: undefined,
  };

  return emptyStateProd;
};

export { createEmptyStateProd };
