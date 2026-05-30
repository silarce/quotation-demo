import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_headBox extends ClassCompnent_base<'headBox'> implements Interface_ClassComponent_prime {
  readonly key = 'headBox' as const;
  readonly name = '捲箱' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = 'M';
}

export { ClassCompnent_headBox };