import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config_component';

class ClassCompnent_middlePillar extends ClassCompnent_base<'middlePillar'> implements Interface_ClassComponent_prime {
  readonly key = 'middlePillar' as const;
  readonly name = '中柱' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_middlePillar };
