import { ClassProd } from '../class/prod/classProd_remake';
import type { TcreateSetComponent } from '../useQuotationProduct';

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

import type { TclassComponentDict } from '../useQuotationProduct';

// ===============================================

const createClassComponentDict = ({
  activedClassProd,
  createSetComponent,
}: {
  activedClassProd: ClassProd;
  createSetComponent: TcreateSetComponent;
}) => {
  const data_componentDict = activedClassProd.state.data_componentDict;
  const activeProdKey = activedClassProd.key;

  const slat =
    data_componentDict['slat'] &&
    new (ClassCompnent_slat.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['slat'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'slat',
      }),
      // activedClassProd,
    });

  const bottomBar =
    data_componentDict['bottomBar'] &&
    new (ClassCompnent_bottomBar.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['bottomBar'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'bottomBar',
      }),
      // activedClassProd,
    });

  const guideRail =
    data_componentDict['guideRail'] &&
    new (ClassCompnent_guideRail.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['guideRail'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'guideRail',
      }),
      // activedClassProd,
    });

  const sidePlate =
    data_componentDict['sidePlate'] &&
    new ClassCompnent_sidePlate({
      state_component: data_componentDict['sidePlate'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'sidePlate',
      }),
      // activedClassProd,
    });

  const roller =
    data_componentDict['roller'] &&
    new ClassCompnent_roller({
      state_component: data_componentDict['roller'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'roller',
      }),
      // activedClassProd,
    });

  const motor =
    data_componentDict['motor'] &&
    new ClassCompnent_motor({
      state_component: data_componentDict['motor'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'motor',
      }),
      // activedClassProd,
    });

  const motorAccessories =
    data_componentDict['motorAccessories'] &&
    new ClassCompnent_motorAccessories({
      state_component: data_componentDict['motorAccessories'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'motorAccessories',
      }),
      // activedClassProd,
    });
  const headBox =
    data_componentDict['headBox'] &&
    new (ClassCompnent_headBox.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['headBox'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'headBox',
      }),
      // activedClassProd,
    });
  const middlePillar =
    data_componentDict['middlePillar'] &&
    new ClassCompnent_middlePillar({
      state_component: data_componentDict['middlePillar'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'middlePillar',
      }),
      // activedClassProd,
    });
  const backBone =
    data_componentDict['backBone'] &&
    new ClassCompnent_backBone({
      state_component: data_componentDict['backBone'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'backBone',
      }),
      // activedClassProd,
    });

  const classComponentDict: TclassComponentDict = {
    slat,
    bottomBar,
    guideRail,
    sidePlate,
    roller,
    motor,
    motorAccessories,
    headBox,
    middlePillar,
    backBone,
  };

  // 清除classComponentDict中為undefined的項目
  Object.keys(classComponentDict).forEach((key) => {
    const theKey = key as keyof TclassComponentDict;

    if (classComponentDict[theKey] === undefined) {
      delete classComponentDict[theKey];
    }
  });

  return classComponentDict;
};

export { createClassComponentDict };
