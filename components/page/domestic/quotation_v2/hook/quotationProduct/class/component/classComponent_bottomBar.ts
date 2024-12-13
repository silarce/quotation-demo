import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_01 } from 'js/utils/options/productOptions';

class ClassCompnent_bottomBar extends ClassCompnent_base<'bottomBar'> implements Interface_ClassComponent_prime {
  //
  static subspecies(subspecies: string) {
    switch (subspecies) {
      case 'SJ-302':
        return ClassCompnent_bottomBar_sj302;
      case 'W2':
        return ClassCompnent_bottomBar_w2;

      default:
        return ClassCompnent_bottomBar;
    }
  }
  //

  readonly key = 'bottomBar' as const;
  readonly name = '底座' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = 'M';

  get options_material(): Interface_ClassComponent_prime['options_material'] {
    return optionsCreator_componentMaterial_01();
  }
}

class ClassCompnent_bottomBar_sj302 extends ClassCompnent_bottomBar {
  //
  // SJ-302的底座沒有高耐鍍鋅鋼板，因此將高耐鍍鋅鋼板的選項拿掉
  get options_material() {
    let options = super.options_material;
    options = options?.filter((option) => option.value !== '高耐鍍鋅鋼板');

    return options;
  }
}
class ClassCompnent_bottomBar_w2 extends ClassCompnent_bottomBar {
  get options_material() {
    return this.classProd?.options_material;
  }
}

export { ClassCompnent_bottomBar };
