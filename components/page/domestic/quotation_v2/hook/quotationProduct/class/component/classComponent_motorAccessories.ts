import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config_component';

class ClassCompnent_motorAccessories
  extends ClassCompnent_base<'motorAccessories'>
  implements Interface_ClassComponent_prime
{
  readonly key = 'motorAccessories' as const;
  readonly name = '馬達配件' as const;
  readonly nodeConfig = createNodeConfig_component();
}

export { ClassCompnent_motorAccessories };
