import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_middlePillar extends ClassCompnent_base<'middlePillar'> implements Interface_ClassComponent_prime {
  readonly key = 'middlePillar' as const;
  readonly name = '中柱' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_middlePillar };
