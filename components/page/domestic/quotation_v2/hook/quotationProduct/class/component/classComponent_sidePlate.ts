import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_sidePlate extends ClassCompnent_base<'sidePlate'> implements Interface_ClassComponent_prime {
  readonly key = 'sidePlate' as const;
  readonly name = '支版' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_sidePlate };
