import { Newable } from 'ts-essentials';

import { TdoorComponentType } from 'js/api/dtoTypes';

import { Interface_ClassComponent_base, Interface_ClassComponent_prime } from './classComponent_base';

import { ClassCompnent_slat } from './classComponent_slat';
import { ClassCompnent_bottomBar } from './classComponent_bottomBar';
import { ClassCompnent_guideRail } from './classComponent_guideRail';
import { ClassCompnent_sidePlate } from './classComponent_sidePlate';
import { ClassCompnent_roller } from './classComponent_roller';
import { ClassCompnent_motor } from './classComponent_motor';
import { ClassCompnent_motorAccessories } from './classComponent_motorAccessories';
import { ClassCompnent_headBox } from './classComponent_headBox';
import { ClassCompnent_middlePillar } from './classComponent_middlePillar';
import { ClassCompnent_backBone } from './classComponent_backBone';

type Tlookup_classComponent = {
  [K in TdoorComponentType]: K extends 'slat'
    ? Newable<ClassCompnent_slat>
    : K extends 'bottomBar'
    ? Newable<ClassCompnent_bottomBar>
    : K extends 'guideRail'
    ? Newable<ClassCompnent_guideRail>
    : K extends 'sidePlate'
    ? Newable<ClassCompnent_sidePlate>
    : K extends 'roller'
    ? Newable<ClassCompnent_roller>
    : K extends 'motor'
    ? Newable<ClassCompnent_motor>
    : K extends 'motorAccessories'
    ? Newable<ClassCompnent_motorAccessories>
    : K extends 'headBox'
    ? Newable<ClassCompnent_headBox>
    : K extends 'middlePillar'
    ? Newable<ClassCompnent_middlePillar>
    : K extends 'backBone'
    ? Newable<ClassCompnent_backBone>
    : never;
};

const lookup_classComponent: Tlookup_classComponent = {
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
};

export type { Tlookup_classComponent };
export { lookup_classComponent };
