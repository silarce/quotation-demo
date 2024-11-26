import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';
class ClassCompnent_bottomBar extends ClassCompnent_base<'bottomBar'> implements Interface_ClassComponent_prime {
  readonly key = 'bottomBar' as const;
  readonly name = '底座' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_bottomBar };
