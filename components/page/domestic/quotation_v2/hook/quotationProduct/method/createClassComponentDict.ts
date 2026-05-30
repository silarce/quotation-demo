import { ClassProd } from '../class/prod/classProd_remake';
import type { TcreateSetComponent, TclassComponentDict } from '../useQuotationProduct';

import {
  ClassCompnent_slat,
  ClassCompnent_bottomBar,
  ClassCompnent_guideRail,
  ClassCompnent_sidePlate,
  ClassCompnent_roller,
  ClassCompnent_motor,
  ClassCompnent_motorAccessories,
  ClassCompnent_headBox,
  ClassCompnent_middlePillar,
  ClassCompnent_backBone,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component';

import type { TdoorComponentType } from 'js/api/dtoTypes';

const Lookup = {
  slat: ClassCompnent_slat,
  bottomBar: ClassCompnent_bottomBar,
  guideRail: ClassCompnent_guideRail,
  sidePlate: ClassCompnent_sidePlate,
  roller: ClassCompnent_roller,
  motor: ClassCompnent_motor,
  motorAccessories: ClassCompnent_motorAccessories,
  headBox: ClassCompnent_headBox,
  middlePillar: ClassCompnent_middlePillar,
  backBone: ClassCompnent_backBone,
} as const;

const createClassComponentDict = ({
  activedClassProd,
  createSetComponent,
}: {
  activedClassProd: ClassProd;
  createSetComponent: TcreateSetComponent;
}) => {
  const data_componentDict = activedClassProd.state.data_componentDict;
  const activeProdKey = activedClassProd.key;

  const classComponentDict: TclassComponentDict = {};

  (Object.keys(Lookup) as TdoorComponentType[]).forEach((key) => {
    const stateComponent = data_componentDict[key];
    if (!stateComponent) return;

    const Klass = Lookup[key] as any;
    (classComponentDict as any)[key] = new Klass({
      state_component: stateComponent,
      setState_component: createSetComponent({ pordKey: activeProdKey, componentKey: key }),
    });
  });

  return classComponentDict;
};

export { createClassComponentDict };