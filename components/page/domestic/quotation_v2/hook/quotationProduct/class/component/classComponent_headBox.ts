import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_headBox extends ClassCompnent_base<'headBox'> implements Interface_ClassComponent_prime {
  readonly key = 'headBox' as const;
  readonly name = '門箱' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_headBox };
