import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

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

class ClassCompnent_backBone extends ClassCompnent_base<'backBone'> implements Interface_ClassComponent_prime {
  readonly key = 'backBone' as const;
  readonly name = '背撐' as const;
  readonly nodeConfig = nodeConfig;
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
