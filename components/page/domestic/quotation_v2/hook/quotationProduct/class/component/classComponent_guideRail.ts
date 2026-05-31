import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = createNodeConfig_component();

class ClassCompnent_guideRail extends ClassCompnent_base<'guideRail'> implements Interface_ClassComponent_prime {
  readonly key = 'guideRail' as const;
  readonly name = '軌道' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = 'M';
}

export { ClassCompnent_guideRail };
