import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_slat extends ClassCompnent_base<'slat'> implements Interface_ClassComponent_prime {
  readonly key = 'slat' as const;
  readonly name = '門片' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_slat };
