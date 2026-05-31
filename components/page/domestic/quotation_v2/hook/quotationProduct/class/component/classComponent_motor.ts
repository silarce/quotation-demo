import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_motor extends ClassCompnent_base<'motor'> implements Interface_ClassComponent_prime {
  readonly key = 'motor' as const;
  readonly name = '馬達' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '台';
}

export { ClassCompnent_motor };
