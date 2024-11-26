import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_backBone extends ClassCompnent_base<'backBone'> implements Interface_ClassComponent_prime {
  readonly key = 'backBone' as const;
  readonly name = '背撐' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_backBone };
