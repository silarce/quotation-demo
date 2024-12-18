import type { TstateComponentData, Tdata_componentDict } from './type';

// bottomBar
// guideRail
// sidePlate
// roller
// motor
// motorAccessories
// headBox
// middlePillar
// backBone

const emptySlat: TstateComponentData<'slat'> = {
  type: 'slat',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyBottomBar: TstateComponentData<'bottomBar'> = {
  type: 'bottomBar',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyGuideRail: TstateComponentData<'guideRail'> = {
  type: 'guideRail',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptySidePlate: TstateComponentData<'sidePlate'> = {
  type: 'sidePlate',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '黑鐵',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyRoller: TstateComponentData<'roller'> = {
  type: 'roller',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '黑鐵',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyMotor: TstateComponentData<'motor'> = {
  type: 'motor',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '黑鐵',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyMotorAccessories: TstateComponentData<'motorAccessories'> = {
  type: 'motorAccessories',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '其他',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyHeadBox: TstateComponentData<'headBox'> = {
  type: 'headBox',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyMiddlePillar: TstateComponentData<'middlePillar'> = {
  type: 'middlePillar',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const emptyBackBone: TstateComponentData<'backBone'> = {
  type: 'backBone',
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  density: null,
  isPainted: false,
  quantity: '',
  price: '',
  rawData: null,
};

const createEmptyComponentDict = () => {
  const emptyComponentDict: Tdata_componentDict = {
    slat: { ...emptySlat },
    bottomBar: { ...emptyBottomBar },
    guideRail: { ...emptyGuideRail },
    sidePlate: { ...emptySidePlate },
    roller: { ...emptyRoller },
    motor: { ...emptyMotor },
    motorAccessories: { ...emptyMotorAccessories },
    headBox: { ...emptyHeadBox },
    middlePillar: { ...emptyMiddlePillar },
    backBone: { ...emptyBackBone },
  };

  return emptyComponentDict;
};

export { createEmptyComponentDict };
