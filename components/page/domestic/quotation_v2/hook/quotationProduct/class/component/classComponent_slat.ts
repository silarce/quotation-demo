import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

class ClassCompnent_slat extends ClassCompnent_base<'slat'> implements Interface_ClassComponent_prime {
  readonly key = 'slat' as const;
  readonly name = '門片' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = '㎡';
}

export { ClassCompnent_slat };
