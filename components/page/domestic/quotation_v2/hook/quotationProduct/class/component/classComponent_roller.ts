import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config_component';

class ClassCompnent_roller extends ClassCompnent_base<'roller'> implements Interface_ClassComponent_prime {
  readonly key = 'roller' as const;
  readonly name = '捲軸' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_roller };
