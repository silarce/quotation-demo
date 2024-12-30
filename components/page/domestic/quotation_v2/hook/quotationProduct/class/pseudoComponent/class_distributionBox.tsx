import {
  TstateProd,
  TsetProd,
  //
  TstateProdData,
  TstateProdDict,
  //
  TstateComponentData,
  TcomponentRawDataDict,
  Tdata_componentDict,
  TsetComponent,
} from '../../type';

import { Interface_ClassProd_prime } from '../prod/interface';

import { TnodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import type { Toption } from 'js/utils/options/options';
import { optionsCreator_surface, optionsCreator_surface_onlyPaint } from 'js/utils/options/productOptions';

import { checkIsSST, checkIsGalvanized } from '../library';

import type { Interface_ClassComponent_base, Interface_ClassComponent_prime } from '../component/classComponent_base';

import { createNodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { ClassProd } from '../prod/classProd_remake';
import { calcAllPrice } from '../../method/calcProd';

// ========================================================================

interface Tprops_constructor {
  stateProd: TstateProd;
  setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  classProd: ClassProd;
}

// ========================================================================

const nodeConfig = (() => {
  const nodeConfig_origin = createNodeConfig_component();
  const { density, number, material, materialSurface, isPainted } = nodeConfig_origin;

  const nodeConfig: typeof nodeConfig_origin = {
    ...nodeConfig_origin,

    number: {
      ...number,
      createNode: null,
    },
    material: {
      ...material,
      createNode: null,
    },
    materialSurface: {
      ...materialSurface,
      createNode: null,
    },
    density: {
      ...density,
      createNode: null,
    },
    isPainted: {
      ...isPainted,
      createNode: null,
    },
  };

  return nodeConfig;
})();

// ========================================================================

// MARK:Class_distributionBox
class Class_distributionBox implements Interface_ClassComponent_prime {
  key = 'distributionBox';
  name = '配電箱及按鈕開關';
  unit = '組';
  nodeConfig = nodeConfig;

  state: TstateProd;
  protected readonly setState: React.Dispatch<React.SetStateAction<TstateProd>>;
  data: TstateProd['data_prod'];
  protected render() {
    this.setState({ ...this.state });
  }

  classProd;

  constructor({ stateProd, setStateProd, classProd }: Tprops_constructor) {
    this.state = stateProd;
    this.data = this.state.data_prod;
    this.setState = setStateProd;
    this.classProd = classProd;
  } // constructor

  get number() {
    return undefined;
  }

  get desc() {
    return '';
  }

  get material() {
    return '';
  }

  get materialSurface() {
    return null;
  }

  get density() {
    return null;
  }

  get isPainted() {
    return false;
  }

  get quantity() {
    return this.data.distributionBoxQuantity;
  }
  set quantity(value) {
    this.data.distributionBoxQuantity = value;
    this.renewAllPrice();

    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  get price() {
    return this.data.distributionBoxPrice;
  }
  set price(v) {
    this.data.distributionBoxPrice = v;
    this.renewAllPrice();

    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  get dualPrice() {
    return Number(this.data.distributionBoxDualPrice || 0);
  }

  get unitPrice() {
    return Number(this.data.distributionBoxUnitPrice || 0);
  }

  get totalPrice() {
    return Number(this.data.distributionBoxTotalPrice || 0);
  }

  // ------------------------------------------------------------------------
  get options_material() {
    return undefined;
  }

  get options_materialSurface() {
    return undefined;
  }

  onProdChangeMaterial() {
    // do nothing
  }
  onProdChangeSurface() {
    // do nothing
  }
  renewDesc() {
    // do nothing
  }

  renewAllPrice() {
    this.classProd.renewDistributionBoxAllPrice();
  }
}

export { Class_distributionBox };
