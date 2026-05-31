import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_slat extends ClassCompnent_base<'slat'> implements Interface_ClassComponent_prime {
  readonly key = 'slat' as const;
  readonly name = '門板' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '㎡';
}

export { ClassCompnent_slat };
