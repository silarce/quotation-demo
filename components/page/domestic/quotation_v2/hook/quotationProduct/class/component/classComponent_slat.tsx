import {
  ClassCompnent_base,
  Interface_ClassComponent_prime,
  TconstructorProps_componentBase,
} from './classComponent_base';
import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import {
  TinputSelProps,
  InputSel_prod,
  InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';
import { Toption } from 'js/utils/options/options';

const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { desc, density } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,
    desc: {
      ...desc,
      createNode({ classComponent, disabled }) {
        const v = classComponent.desc;
        const value = { value: v, label: v };

        const slatArr = classComponent.availableComponents?.slats;

        let options: Toption[] | undefined = undefined;

        !!slatArr && (options = slatArr.map((item) => ({ value: item.name, label: item.name })));

        const inputSelProps: TinputSelProps = {
          disabled,
          selectProps: {
            props: {
              placeholder: '',
              // options: classComponent.options_material,
              options,
              value,
              onChange(newValue) {
                classComponent.changeRaw?.(newValue?.value ?? '');
              },
            },
          },
        };

        return <InputSel_prod_memo_select {...inputSelProps} />;
      },
    },
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
      case 'SJ-305D':
        return ClassCompnent_slat_sj305D;

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

  onProdChangeMaterial(prodMaterial: string | null | undefined) {
    if (!this.state.material) {
      super.onProdChangeMaterial(prodMaterial);
    }
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

class ClassCompnent_slat_sj305D extends ClassCompnent_slat {
  get options_material() {
    return this.classProd?.options_material;
  }

  onProdChangeMaterial(prodMaterial: string | null | undefined) {
    // super.onProdChangeMaterial(prodMaterial);
    this.state.material = prodMaterial ?? '';
    this.render();
  }

  renewDesc() {
    const name = this.state.rawData?.name ?? '';
    const desc = `${name}`;

    this.state.desc = desc;
    this.render();
  }
  // ------------------------------------------------------------------------

  // get desc() {
  //   return super.desc;
  // }

  changeRaw(name: string) {
    const availableComponents_slats = this.availableComponents?.slats;

    const raw = availableComponents_slats?.find((item) => item.name === name);

    this.state.rawData = raw ?? null;

    this.renewDesc();

    this.render();
  }
}

export { ClassCompnent_slat };
