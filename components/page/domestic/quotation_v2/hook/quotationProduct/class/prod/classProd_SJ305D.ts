import {
  Interface_ClassProd_prime,
  ClassProd_prime,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/classProd_prime';

import {
  optionsCreator_surface,
  optionsCreator_surface_onlyPaint,
  // optionsCreator_doorModel,
  // optionsCreator_bottomBarAngleIron,
  // optionsCreator_bottomBarPlate,
  // optionsCreator_bottomBarAngleIron_303A,
  // optionsCreator_bottomBarPlate_303A,
  // optionsCreator_bottomBarAngleIron_303AS,
  // optionsCreator_bottomBarPlate_303AS,
  // optionsCreator_boxB_SJ302,
  // optionsCreator_boxB_SJ303A,
  // optionsCreator_boxB_SJ312,
  // optionsCreator_boxB_SJ305D,
  // optionsCreator_horsePower,
  // optionsCreator_quoteType,
  // lookup_options_bottomBarAngleIronAndPlate,
  // optionsCreator_doorModelName,
  // lookup_quoteType_doorModelName,
} from 'js/utils/options/productOptions';

import {
  checkIsSST,
  // checkIsGalvanized
} from '../library';

import { TnodeConfig } from './config';

import _ from 'lodash';

const options_surface_onlyPaint = optionsCreator_surface_onlyPaint();
const options_surface = optionsCreator_surface();

// ========================================================================

const customizeNodeConfig = ({ classProd, nodeConfig }: { classProd: ClassProd_SJ305D; nodeConfig: TnodeConfig }) => {
  const config = _.cloneDeep(nodeConfig);

  const options_material = (() => {
    let options = options_surface_onlyPaint;
    const isSST = checkIsSST(classProd.data.materialName);

    if (isSST) {
      options = options_surface;
    }

    return options;
  })();

  // const node_material = config.materialName;

  // config.materialName.

  // 修改style與className時要注意避免修改影響寬度的樣式，避免與其他的row不對齊

  // 範例
  // config.itemName.style = { ...config.itemName.style, background: 'red' };
  // config.itemName.className = classNames(config.itemName.className, scss.foo);
  // config.itemName.createNode = (state) => {
  //   return null;
  // };

  return config;
};

// ========================================================================

class ClassProd_SJ305D extends ClassProd_prime implements Interface_ClassProd_prime {
  readonly doorModel = 'SJ-305D';

  get options_surface() {
    let options = options_surface_onlyPaint;

    const isSST = checkIsSST(this.data.materialName);
    // const isGalvanized = checkIsGalvanized(this.data.materialName); // 是否鍍鋅

    if (isSST) {
      options = options_surface;
    }

    return options;
  }
}

export { ClassProd_SJ305D };
