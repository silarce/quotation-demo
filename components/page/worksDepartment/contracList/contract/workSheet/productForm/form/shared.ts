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

const getHeadBoxSvgUrl1 = ({ isIntegratedHeadBox, hasWheel }: { isIntegratedHeadBox: boolean; hasWheel: boolean }) => {
  let url: null | string = null;

  if (isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '一體式有檔輪.svg');
  } else if (isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '一體式無檔輪.svg');
  } else if (!isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '機加捲有檔輪.svg');
  } else if (!isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '機加捲無檔輪.svg');
  }

  return url as string;
};

const getHeadBoxSvgUrl2 = ({ isIntegratedHeadBox, hasWheel }: { isIntegratedHeadBox: boolean; hasWheel: boolean }) => {
  let url: null | string = null;

  // 阿不是都一樣...?給我的判斷條件長這樣那就這樣吧
  if (isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
  } else if (isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
  } else if (!isIntegratedHeadBox && hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
  } else if (!isIntegratedHeadBox && !hasWheel) {
    url = createAssetUrl('head-box', '機械箱.svg');
  }

  return url as string;
};

const getHeadBoxSvgUrl3 = ({ headBoxTopCover }: { headBoxTopCover: boolean }) => {
  let url: null | string = null;

  if (headBoxTopCover) {
    url = createAssetUrl('head-box', '上蓋.svg');
  }

  return url;
};

const getHeadBoxSvgUrl4 = ({
  headBoxCover,
}: {
  headBoxCover: NonNullable<TquotationProductItemDto['headBoxCover']>;
}) => {
  let url: null | string = null;

  if (headBoxCover === 'half') {
    url = createAssetUrl('head-box', '前遮半.svg');
  } else if (headBoxCover === 'full') {
    url = createAssetUrl('head-box', '前遮全.svg');
  }

  return url;
};

export {
  options_motorSupportStand,
  options_electricSupply,
  options_boolean,
  options_前遮,
  basicConfig,
  inputNumberProps,
  getHeadBoxSvgUrl1,
  getHeadBoxSvgUrl2,
  getHeadBoxSvgUrl3,
  getHeadBoxSvgUrl4,
};

export type { TsetStateAction, TsetState };
