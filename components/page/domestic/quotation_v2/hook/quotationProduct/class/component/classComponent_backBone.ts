import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

class ClassCompnent_backBone extends ClassCompnent_base<'backBone'> implements Interface_ClassComponent_prime {
  readonly key = 'backBone' as const;
  readonly name = '背撐' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = '支';

  // ------------------------------------------------------------------------
  renewDesc() {
    this.state.desc = '背撐';
    this.render();
  }
  // ------------------------------------------------------------------------

  get options_material() {
    return undefined;
  }
}

export { ClassCompnent_backBone };
