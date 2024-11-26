import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from '../prod/config';

class ClassCompnent_motor extends ClassCompnent_base<'motor'> implements Interface_ClassComponent_prime {
  readonly key = 'motor' as const;
  readonly name = '馬達' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_motor };
