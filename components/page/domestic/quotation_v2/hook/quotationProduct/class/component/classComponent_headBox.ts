import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_01 } from 'js/utils/options/productOptions';
class ClassCompnent_headBox extends ClassCompnent_base<'headBox'> implements Interface_ClassComponent_prime {
  //
  static subspecies(subspecies: string) {
    switch (subspecies) {
      case 'W2':
        return ClassCompnent_headBox_w2;

      default:
        return ClassCompnent_headBox;
    }
  }

  //
  readonly key = 'headBox' as const;
  readonly name = '門箱' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = 'M';

  // ------------------------------------------------------------------------

  renewDesc() {
    const { name } = this.state.rawData ?? {};
    const material = this.material;

    this.state.desc = `${name} ${material}`;
    this.render();
  }

  // ------------------------------------------------------------------------

  get options_material(): Interface_ClassComponent_prime['options_material'] {
    return optionsCreator_componentMaterial_01();
  }
}

class ClassCompnent_headBox_w2 extends ClassCompnent_headBox {
  get options_material() {
    return this.classProd?.options_material;
  }
}

export { ClassCompnent_headBox };
