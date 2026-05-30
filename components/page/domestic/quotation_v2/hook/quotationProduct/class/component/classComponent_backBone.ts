import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_backBone extends ClassCompnent_base<'backBone'> implements Interface_ClassComponent_prime {
  readonly key = 'backBone' as const;
  readonly name = '背骨' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '支';
}

export { ClassCompnent_backBone };