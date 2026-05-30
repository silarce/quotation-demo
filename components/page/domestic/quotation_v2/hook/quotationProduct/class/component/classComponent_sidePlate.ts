import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_sidePlate extends ClassCompnent_base<'sidePlate'> implements Interface_ClassComponent_prime {
  readonly key = 'sidePlate' as const;
  readonly name = '側板組' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '組';
}

export { ClassCompnent_sidePlate };