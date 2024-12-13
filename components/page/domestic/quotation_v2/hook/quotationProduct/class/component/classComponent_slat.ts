import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
  TconstructorProps_componentBase,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { density } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,
    density: {
      ...density,
      createNode: ({ classComponent }) => {
        return classComponent.density;
      },
    },
  };

  return nodeConfig;
})();

class ClassCompnent_slat extends ClassCompnent_base<'slat'> implements Interface_ClassComponent_prime {
  //
  static subspecies(subspecies: string) {
    switch (subspecies) {
      case 'W2':
        return ClassCompnent_slat_W2;

      default:
        return ClassCompnent_slat;
    }
  }
  //
  readonly key = 'slat' as const;
  protected _name = '捲門片';
  readonly nodeConfig = nodeConfig;
  protected _unit = '㎡';
  // ------------------------------------------------------------------------

  renewDesc() {
    const { material } = this;
    const name = this.state.rawData?.name ?? '';
    let thickness: string | undefined | null = this.classProd?.thickness;
    thickness = thickness && `${thickness}t`;
    const desc = `${name} ${material} ${thickness}`;

    this.state.desc = desc;
    this.render();
  }

  onProdChangeMaterial() {
    // do nothing
  }

  // ------------------------------------------------------------------------

  get name() {
    return this._name;
  }
  get unit() {
    return this._unit;
  }

  // ------------------------------------------------------------------------

  get options_material() {
    const options = this.classProd?.options_material;

    if (options) {
      const theOption = options.find((item) => {
        return item.value === '黑鐵';
      });

      theOption && (theOption.label = '鐵材烤漆');
    }

    return options;
  }
}

class ClassCompnent_slat_W2 extends ClassCompnent_slat {
  protected _name = '門片';
  protected _unit = 'M';

  get options_material() {
    return this.classProd?.options_material;
  }
}

export { ClassCompnent_slat };
