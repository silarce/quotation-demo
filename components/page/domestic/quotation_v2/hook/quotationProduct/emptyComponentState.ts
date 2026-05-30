import type { TstateComponentData, Tdata_componentDict, TcomponentRawDataDict } from './type';

const createEmpty = <T extends keyof TcomponentRawDataDict>(type: T): TstateComponentData<T> => ({
  type,
  shouldInit: true,
  number: undefined,
  desc: '',
  material: '',
  materialSurface: null,
  quantity: '',
  price: '',
});

const createEmptyComponentStateDict = () => {
  const emptyComponentDict: Tdata_componentDict = {
    slat: createEmpty('slat'),
    bottomBar: createEmpty('bottomBar'),
    guideRail: createEmpty('guideRail'),
    sidePlate: createEmpty('sidePlate'),
    roller: createEmpty('roller'),
    motor: createEmpty('motor'),
    motorAccessories: createEmpty('motorAccessories'),
    headBox: createEmpty('headBox'),
    middlePillar: createEmpty('middlePillar'),
    backBone: createEmpty('backBone'),
  };

  return emptyComponentDict;
};

export { createEmptyComponentStateDict };
