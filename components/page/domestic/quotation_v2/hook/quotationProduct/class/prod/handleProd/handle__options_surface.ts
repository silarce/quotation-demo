import _ from 'lodash';

import { ClassProd } from '../classProd_remake';

import { optionsCreator_surface, optionsCreator_surface_onlyPaint } from 'js/utils/options/productOptions';
import {
  checkIsSST,
  checkIsGalvanized,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/library';

const createOptions_surface = (classProd: ClassProd) => {
  let options = optionsCreator_surface_onlyPaint();

  const isSST = checkIsSST(classProd.data.materialName);
  const isGalvanized = checkIsGalvanized(classProd.data.materialName); // 是否鍍鋅

  if (isSST) {
    options = optionsCreator_surface();
  }

  if (!isGalvanized) {
    options = options.filter((item) => item.value !== '無烤漆');
  }

  return options;
};

const createOptions_surface_SJ305D = (classProd: ClassProd) => {
  let options = optionsCreator_surface_onlyPaint();

  const isSST = checkIsSST(classProd.data.materialName);
  // const isGalvanized = checkIsGalvanized(this.data.materialName); // 是否鍍鋅

  if (isSST) {
    options = optionsCreator_surface();
  }

  return options;
};

const dict__options_surface = {
  'SJ-305D': createOptions_surface_SJ305D,
  standard: createOptions_surface,
} as const;

const handle__options_surface = (doorModelName: string) => {
  const isValidKey = (key: string): key is keyof typeof dict__options_surface => {
    return key in dict__options_surface;
  };

  const options = isValidKey(doorModelName) ? dict__options_surface[doorModelName] : dict__options_surface.standard;

  return options;
};

export { handle__options_surface, dict__options_surface };
