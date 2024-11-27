import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config_component';

class ClassCompnent_sidePlate extends ClassCompnent_base<'sidePlate'> implements Interface_ClassComponent_prime {
  readonly key = 'sidePlate' as const;
  readonly name = '支版' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_sidePlate };
