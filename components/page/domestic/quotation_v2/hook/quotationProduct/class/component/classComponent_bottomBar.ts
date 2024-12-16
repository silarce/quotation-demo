import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
  Interface_ClassComponent_base,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_01 } from 'js/utils/options/productOptions';

// ==========================================================================================================================
const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { materialSurface } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,
    materialSurface: {
      ...materialSurface,
      createNode: null,
    },
  };

  return nodeConfig;
})();

// ==========================================================================================================================
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
  readonly nodeConfig = nodeConfig;
  readonly unit = 'M';

  // ------------------------------------------------------------------------

  renewDesc() {
    this.state.desc = this.classProd?.bottomBarAngleIron ?? '';
    this.render();
  }

  // ------------------------------------------------------------------------

  get options_material(): Interface_ClassComponent_prime['options_material'] {
    return optionsCreator_componentMaterial_01();
  }

  onProdChangeSurface() {
    // do nothing
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

  onProdChangeMaterial(prodMaterial: string) {
    let v = prodMaterial;

    if (v === '高耐鍍鋅鋼板') {
      v = '鍍鋅鋼板';
    } else {
    }
  }
}

// region subspecies

class ClassCompnent_bottomBar_w2 extends ClassCompnent_bottomBar {
  get options_material() {
    return this.classProd?.options_material;
  }
}

export { ClassCompnent_bottomBar };
