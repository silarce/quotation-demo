import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_02 } from 'js/utils/options/productOptions';

// ==========================================================================================================================
const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { materialSurface, material } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,
    materialSurface: {
      ...materialSurface,
      createNode: null,
    },
    material: {
      ...material,
      createNode: null,
    },
  };

  return nodeConfig;
})();

// ==========================================================================================================================

class ClassCompnent_sidePlate extends ClassCompnent_base<'sidePlate'> implements Interface_ClassComponent_prime {
  readonly key = 'sidePlate' as const;
  readonly name = '支版' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '組';

  // ------------------------------------------------------------------------

  renewDesc() {
    this.state.desc = '';
    this.render();
  }

  // ------------------------------------------------------------------------
  onProdChangeSurface() {
    // do nothing
  }
  // ------------------------------------------------------------------------

  get options_material() {
    return optionsCreator_componentMaterial_02();
  }
  // ------------------------------------------------------------------------

  // ------------------------------------------------------------------------
}

export { ClassCompnent_sidePlate };
