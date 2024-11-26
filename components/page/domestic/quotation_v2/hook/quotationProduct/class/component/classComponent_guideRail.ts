import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_guideRail extends ClassCompnent_base<'guideRail'> implements Interface_ClassComponent_prime {
  readonly key = 'guideRail' as const;
  readonly name = '門軌' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_guideRail };
