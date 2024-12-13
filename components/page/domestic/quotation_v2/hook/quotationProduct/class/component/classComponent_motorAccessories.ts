import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_03 } from 'js/utils/options/productOptions';

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

class ClassCompnent_motorAccessories
  extends ClassCompnent_base<'motorAccessories'>
  implements Interface_ClassComponent_prime
{
  readonly key = 'motorAccessories' as const;
  readonly name = '馬達配件' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = '組';

  // ------------------------------------------------------------------------

  renewDesc() {
    // const { name, bearingType, chains } = this.state.rawData ?? {};
    this.state.desc = '';
    this.render();
  }

  // ------------------------------------------------------------------------

  get options_material() {
    return optionsCreator_componentMaterial_03();
  }
}

export { ClassCompnent_motorAccessories };
