import { Interface_ClassComponent_base } from './classComponent_base';

import { ClassCompnent_slat } from './classComponent_slat';
import { ClassCompnent_bottomBar } from './classComponent_bottomBar';

const lookup_classComponent = {
  slat: ClassCompnent_slat,
  bottomBar: ClassCompnent_bottomBar,
} as const;

export { lookup_classComponent };
