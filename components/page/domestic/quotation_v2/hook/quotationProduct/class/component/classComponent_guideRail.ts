import { ClassCompnent_base, Interface_ClassComponent_prime } from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { optionsCreator_componentMaterial_01 } from 'js/utils/options/productOptions';

class ClassCompnent_guideRail extends ClassCompnent_base<'guideRail'> implements Interface_ClassComponent_prime {
  //
  static subspecies(subspecies: string) {
    switch (subspecies) {
      case 'W2':
        return ClassCompnent_guideRail_w2;

      default:
        return ClassCompnent_guideRail;
    }
  }
  //

  readonly key = 'guideRail' as const;
  readonly name = '門軌' as const;
  readonly nodeConfig = createNodeConfig_component();
  readonly unit = 'M';

  // ------------------------------------------------------------------------

  renewDesc() {
    const { material } = this;
    const name = this.state.rawData?.name ?? '';

    this.state.desc = `${name ?? ''} ${material ?? ''} `;
    this.render();
  }

  // ------------------------------------------------------------------------
  get options_material(): Interface_ClassComponent_prime['options_material'] {
    return optionsCreator_componentMaterial_01();
  }

  // ------------------------------------------------------------------------

  onProdChangeSurface(prodSurface: string | null | undefined) {
    super.onProdChangeSurface(prodSurface);

    const isSST = ClassCompnent_guideRail.utils.checkIsSST(this.state.material);

    if (isSST && prodSurface === '無烤漆') {
      prodSurface = '2B';
      this.state.materialSurface = prodSurface;
      this.render();
    }
  }
}

// ================================================================================
// ================================================================================
// ================================================================================
// region subspecies
class ClassCompnent_guideRail_w2 extends ClassCompnent_guideRail {
  get options_material() {
    return this.classProd?.options_material;
  }
}

export { ClassCompnent_guideRail };
