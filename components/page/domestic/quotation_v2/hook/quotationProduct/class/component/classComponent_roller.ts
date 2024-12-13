import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_02 } from 'js/utils/options/productOptions';
// =================================================================================================================================

const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { material } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,
    material: {
      ...material,
      createNode: null,
    },
  };

  return nodeConfig;
})();

// =================================================================================================================================
class ClassCompnent_roller extends ClassCompnent_base<'roller'> implements Interface_ClassComponent_prime {
  readonly key = 'roller' as const;
  readonly name = '捲軸' as const;
  readonly nodeConfig = nodeConfig;
  readonly unit = 'M';

  // ------------------------------------------------------------------------

  renewDesc() {
    const diameter = this.state.rawData?.diameter ?? '';

    this.state.desc = `∮${diameter}`;
    this.render();
  }

  // ------------------------------------------------------------------------

  get options_material() {
    return optionsCreator_componentMaterial_02();
  }
}

export { ClassCompnent_roller };
