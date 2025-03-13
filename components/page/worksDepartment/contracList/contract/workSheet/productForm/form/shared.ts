import classNames from 'classnames';
import scss from './productForm.module.scss';

import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import { createAssetUrl } from 'js/api/api_product';

// type
import { TquotationProductItemDto } from 'js/api/dtoTypes';

// ====================================================================================================================

type TsetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);
type TsetState<T> = (action: TsetStateAction<T>) => void;

// ====================================================================================================================
const options_motorSupportStand = [
  { value: 'true', label: '有' },
  { value: 'false', label: '無' },
];
const options_electricSupply = [
  { value: JSON.stringify({ motorPhase: 1, motorVoltage: 110 }), label: '單相 110V' },
  { value: JSON.stringify({ motorPhase: 3, motorVoltage: 110 }), label: '三相 110V' },
  { value: JSON.stringify({ motorPhase: 3, motorVoltage: 380 }), label: '三相 380V' },
  { value: JSON.stringify({ motorPhase: null, motorVoltage: null }), label: '無' },
];
const options_boolean = [
  { value: 'false', label: '無' },
  { value: 'true', label: '有' },
];
const options_前遮 = [
  { value: 'none', label: '無' },
  { value: 'half', label: '半遮' },
  { value: 'full', label: '全遮' },
];

const basicConfig: TinputSelProps = {
  wrapperStyle: { gap: '10px', height: 'fit-content' },
  captionStyle: { width: '100px' },
  captionSize: '18',
  captionColor: 'main',
  fontSize: '18',
  showBaseline: 'always',
  hrClassName: classNames(scss.inputSel_hr, scss.plus),
};

const inputNumberProps = {
  type: 'number',
  min: 0,
  step: 0,
};

// ========================================================================

const createElectricSupply = ({
  motorPhase,
  motorVoltage,
}: {
  motorPhase: number | null;
  motorVoltage: number | null;
}) => {
  let value_electricSupply = {
    value: JSON.stringify({ motorPhase, motorVoltage }),
    label: `${motorPhase === 1 ? '單' : motorPhase === 3 ? '三' : motorPhase}相 ${motorVoltage}V`,
  };

  if (!motorVoltage && !motorPhase) {
    value_electricSupply = { value: JSON.stringify({ motorPhase: null, motorVoltage: null }), label: '無' };
  }

  return value_electricSupply;
};

const getSvgUrl_headBox1 = ({
  isIntegratedHeadBox,
  hasWheel,
  sizeB,
}: {
  isIntegratedHeadBox: boolean;
  hasWheel: boolean;
  sizeB: number;
}) => {
  let url;
  let name;

  if (isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '一體式有檔輪.svg');
    name = '一體式有檔輪';
  } else if (isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '一體式無檔輪.svg');
    name = '一體式無檔輪';
  } else if (!isIntegratedHeadBox && hasWheel) {
    if (sizeB > 630) {
      url = createAssetUrl('head-box', '機加捲大於630有檔輪.svg');
      name = '機加捲大於630有檔輪';
    } else {
      url = createAssetUrl('head-box', '機加捲小於630有檔輪.svg');
      name = '機加捲小於630有檔輪';
    }
  } else if (!isIntegratedHeadBox && !hasWheel) {
    if (sizeB > 630) {
      url = createAssetUrl('head-box', '機加捲大於630無檔輪.svg');
      name = '機加捲大於630無檔輪';
    } else {
      url = createAssetUrl('head-box', '機加捲小於630無檔輪.svg');
      name = '機加捲小於630無檔輪';
    }
  }

  return { url, name };
};

const getSvgUrl_headBox2 = ({ isIntegratedHeadBox, hasWheel }: { isIntegratedHeadBox: boolean; hasWheel: boolean }) => {
  let url;
  let name;

  // 阿不是都一樣...?給我的判斷條件長這樣那就這樣吧
  if (isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
    name = '機械箱';
  } else if (isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
    name = '機械箱';
  }
  // else if (!isIntegratedHeadBox && hasWheel) {
  //   url = createAssetUrl('head-box', '機械箱.svg');
  //   name = '機械箱';
  // } else if (!isIntegratedHeadBox && !hasWheel) {
  //   url = createAssetUrl('head-box', '機械箱.svg');
  //   name = '機械箱';
  // }

  return { url, name };
};

const getSvgUrl_headBoxTopCover = ({ headBoxTopCover }: { headBoxTopCover: boolean }) => {
  let url;
  let name;

  if (headBoxTopCover) {
    url = createAssetUrl('head-box', '上蓋.svg');
    name = '上蓋';
  }

  return { url, name };
};

const getSvgUrl_headBoxCover = ({
  headBoxCover,
}: {
  headBoxCover: NonNullable<TquotationProductItemDto['headBoxCover']>;
}) => {
  let url;
  let name;

  if (headBoxCover === 'half') {
    url = createAssetUrl('head-box', '前遮半.svg');
    name = '前遮半';
  } else if (headBoxCover === 'full') {
    url = createAssetUrl('head-box', '前遮全.svg');
    name = '前遮全';
  }

  return { url, name };
};

const getProductHeadBoxImgUrl = ({
  isIntegratedHeadBox,
  hasWheel,
  headBoxTopCover,
  headBoxCover,
  sizeB,
}: {
  isIntegratedHeadBox: boolean;
  hasWheel: boolean;
  headBoxTopCover: boolean;
  headBoxCover: NonNullable<TquotationProductItemDto['headBoxCover']>;
  sizeB: number;
}) => {
  return {
    // headBox1: getSvgUrl_headBox1({ isIntegratedHeadBox, hasWheel, sizeB }),
    // headBox2: getSvgUrl_headBox2({ isIntegratedHeadBox, hasWheel }),
    // headBoxTopCover: getSvgUrl_headBoxTopCover({ headBoxTopCover }),
    // headBoxCover: getSvgUrl_headBoxCover({ headBoxCover }),
    headBox1: getSvgUrl_headBox1({ isIntegratedHeadBox, hasWheel, sizeB }),
    headBox2: getSvgUrl_headBox2({ isIntegratedHeadBox, hasWheel }),
    headBoxTopCover: getSvgUrl_headBoxTopCover({ headBoxTopCover }),
    headBoxCover: getSvgUrl_headBoxCover({ headBoxCover }),
  };
};

// ========================================================================

export {
  options_motorSupportStand,
  options_electricSupply,
  options_boolean,
  options_前遮,
  basicConfig,
  inputNumberProps,
  getSvgUrl_headBox1,
  getSvgUrl_headBox2,
  getSvgUrl_headBoxTopCover,
  getSvgUrl_headBoxCover,
  getProductHeadBoxImgUrl,
  createElectricSupply,
};

export type { TsetStateAction, TsetState };
