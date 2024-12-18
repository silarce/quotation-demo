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

const options_surface_onlyPaint = optionsCreator_surface_onlyPaint();
const options_surface = optionsCreator_surface();

// ========================================================================

class ClassProd_W2 extends ClassProd_prime implements Interface_ClassProd_prime {
  readonly doorModel = 'W2';

  get options_surface() {
    if (!this.materialName || !this.doorModelName) {
      return undefined;
    }

    let options = options_surface_onlyPaint;

    const isSST = checkIsSST(this.data.materialName);
    // const isGalvanized = checkIsGalvanized(this.data.materialName); // 是否鍍鋅

    if (isSST) {
      options = options_surface;
    }

    return options;
  }

  // ------------------------------------------------------------------------

  replaceToEmptyComponent() {
    const emptyComponentDict = super.replaceToEmptyComponent({ returnOnly: true });

    const { backBone, middlePillar, bottomBar, guideRail, slat } = emptyComponentDict;

    this.state.data_componentDict = {
      slat,
      bottomBar,
      guideRail,

      backBone,
      middlePillar,
    };

    return emptyComponentDict;
  }
}

export { ClassProd_W2 };
