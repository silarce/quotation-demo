import _ from 'lodash';

// typhoonProtection
import icon_sj302_75_30t from 'public/image/doorTrack/typhoonProtection/SJ302_75_30t.svg?url';
import icon_sJ302_90_30t from 'public/image/doorTrack/typhoonProtection/SJ302_90_30t.svg?url';
import icon_sJ302_95_30t from 'public/image/doorTrack/typhoonProtection/SJ302_95_30t.svg?url';
import icon_sJ302_95_45t from 'public/image/doorTrack/typhoonProtection/SJ302_95_45t.svg?url';

// normal
import icon_sJ120A_100_25_105_25 from 'public/image/doorTrack/normal/SJ120A_100_25_105_25.svg?url';
import icon_sJ302_30 from 'public/image/doorTrack/normal/SJ302_30.svg?url';
import icon_sJ303A_100_25_25 from 'public/image/doorTrack/normal/SJ303A_100_25_25.svg?url';
import icon_sJ303A_100_65_25 from 'public/image/doorTrack/normal/SJ303A_100_65_25.svg?url';
import icon_sJ303S_85 from 'public/image/doorTrack/normal/SJ303S_85.svg?url';
import icon_sJ305D_22 from 'public/image/doorTrack/normal/SJ305D_22.svg?url';
import icon_sJ312_106_60t from 'public/image/doorTrack/normal/SJ312_106_60t.svg?url';
import icon_sJ312_150_90t from 'public/image/doorTrack/normal/SJ312_150_90t.svg?url';

// type
import { Toption } from 'js/utils/options/options';

export type { Toption };

type TdoorTrack_sorted = {
  [key: string]:
    | {
        [key: string]: Toption;
      }
    | undefined;
};

// ==========================================================================

// 未來重構時要確認使用doorTrack_typhoonProtection的部分，到底還有沒有需要用到doorTrack_typhoonProtection
// 然後把doorTrack_typhoonProtection與doorTrack_typhoonProtection_forLookup留一
const doorTrack_typhoonProtection: { [key: string]: Toption } = {
  // sj302_75_30t: { value: 'sj302_75_30t', label: 'sj302_75_30t', icon: icon_sj302_75_30t.src },
  // sJ302_90_30t: { value: 'sJ302_90_30t', label: 'sJ302_90_30t', icon: icon_sJ302_90_30t.src },
  // sJ302_95_30t: { value: 'sJ302_95_30t', label: 'sJ302_95_30t', icon: icon_sJ302_95_30t.src },
  // sJ302_95_45t: { value: 'sJ302_95_45t', label: 'sJ302_95_45t', icon: icon_sJ302_95_45t.src },
};
const doorTrack_typhoonProtection_forLookup: { [key: string]: Toption } = {
  sj302_75_30t: { value: 'sj302_75_30t', label: 'sj302_75_30t', icon: icon_sj302_75_30t.src },
  sJ302_90_30t: { value: 'sJ302_90_30t', label: 'sJ302_90_30t', icon: icon_sJ302_90_30t.src },
  sJ302_95_30t: { value: 'sJ302_95_30t', label: 'sJ302_95_30t', icon: icon_sJ302_95_30t.src },
  sJ302_95_45t: { value: 'sJ302_95_45t', label: 'sJ302_95_45t', icon: icon_sJ302_95_45t.src },
};

const doorTrack_normal: { [key: string]: Toption } = {
  sJ120A_100_25_105_25: {
    value: 'sJ120A_100_25_105_25',
    label: 'sJ120A_100_25_105_25',
    icon: icon_sJ120A_100_25_105_25.src,
  },
  sJ302_30: {
    value: 'sJ302_30',
    label: 'sJ302_30',
    icon: icon_sJ302_30.src,
  },
  sJ303A_100_25_25: {
    value: 'sJ303A_100_25_25',
    label: 'sJ303A_100_25_25',
    icon: icon_sJ303A_100_25_25.src,
  },
  sJ303A_100_65_25: {
    value: 'sJ303A_100_65_25',
    label: 'sJ303A_100_65_25',
    icon: icon_sJ303A_100_65_25.src,
  },
  sJ303S_85: {
    value: 'sJ303S_85',
    label: 'sJ303S_85',
    icon: icon_sJ303S_85.src,
  },
  sJ305D_22: {
    value: 'sJ305D_22',
    label: 'sJ305D_22',
    icon: icon_sJ305D_22.src,
  },
  sJ312_106_60t: {
    value: 'sJ312_106_60t',
    label: 'sJ312_106_60t',
    icon: icon_sJ312_106_60t.src,
  },
  sJ312_150_90t: {
    value: 'sJ312_150_90t',
    label: 'sJ312_150_90t',
    icon: icon_sJ312_150_90t.src,
  },
};

const doorTrack_other: { [key: string]: Toption } = {
  '6kg': {
    value: '6kg',
    label: '6kg',
    icon: '',
  },
  '△': {
    value: '△',
    label: '△',
    icon: '',
  },
  扇形: {
    value: '扇形',
    label: '扇形',
    icon: '',
  },
  單開: {
    value: '單開',
    label: '單開',
    icon: '',
  },
  雙開: {
    value: '雙開',
    label: '雙開',
    icon: '',
  },
};

const doorTrack_sorted: TdoorTrack_sorted = {
  'SJ-120A': {
    sJ120A_100_25_105_25: {
      value: 'sJ120A_100_25_105_25',
      label: 'SJ120A_100_25_105_25',
      icon: icon_sJ120A_100_25_105_25.src,
    },
  },
  'SJ-302': {
    sJ302_30: {
      value: 'sJ302_30',
      label: 'SJ302_30',
      icon: icon_sJ302_30.src,
    },
    sj302_75_30t: {
      //
      value: 'sj302_75_30t',
      label: 'Sj302_75_30t',
      icon: icon_sj302_75_30t.src,
      typhoonProtection: 'true',
    },
    sJ302_90_30t: {
      //
      value: 'sJ302_90_30t',
      label: 'SJ302_90_30t',
      icon: icon_sJ302_90_30t.src,
      typhoonProtection: 'true',
    },
    sJ302_95_30t: {
      //
      value: 'sJ302_95_30t',
      label: 'SJ302_95_30t',
      icon: icon_sJ302_95_30t.src,
      typhoonProtection: 'true',
    },
    sJ302_95_45t: {
      //
      value: 'sJ302_95_45t',
      label: 'SJ302_95_45t',
      icon: icon_sJ302_95_45t.src,
      typhoonProtection: 'true',
    },
  },
  'SJ-303A': {
    sJ303A_100_25_25: {
      value: 'sJ303A_100_25_25',
      label: 'SJ303A_100_25_25',
      icon: icon_sJ303A_100_25_25.src,
    },
    sJ303A_100_65_25: {
      value: 'sJ303A_100_65_25',
      label: 'SJ303A_100_65_25',
      icon: icon_sJ303A_100_65_25.src,
    },
  },
  'SJ-303S': {
    sJ303S_85: {
      value: 'sJ303S_85',
      label: 'SJ303S_85',
      icon: icon_sJ303S_85.src,
    },
  },
  'SJ-305D': {
    sJ305D_22: {
      value: 'sJ305D_22',
      label: 'SJ305D_22',
      icon: icon_sJ305D_22.src,
    },
  },
  'SJ-312': {
    sJ312_106_60t: {
      value: 'sJ312_106_60t',
      label: 'SJ312_106_60t',
      icon: icon_sJ312_106_60t.src,
      typhoonProtection: 'true',
    },
    sJ312_150_90t: {
      value: 'sJ312_150_90t',
      label: 'SJ312_150_90t',
      icon: icon_sJ312_150_90t.src,
      typhoonProtection: 'true',
    },
  },
};

const doorTrackLookup = {
  ...doorTrack_normal,
  // ...doorTrack_typhoonProtection,
  ...doorTrack_typhoonProtection_forLookup,
  ...doorTrack_other,
} as const;

const optionsCre_doorTrack_typhoonProtection = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = Object.values(doorTrack_typhoonProtection);

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘', icon: undefined });
  }

  return optionArr;
};

const optionsCre_doorTrack_normal = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = Object.values(doorTrack_other);

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘', icon: undefined });
  }

  return optionArr;
};

const getDoorTrackByDoorModel = ({ doorModelName }: { doorModelName: string }): Toption[] | undefined => {
  const list = _.cloneDeep(doorTrack_sorted[doorModelName]);

  if (list) {
    const arr = Object.values(list);

    return arr;
  } else {
    return undefined;
  }
};

export {
  doorTrackLookup,
  optionsCre_doorTrack_typhoonProtection,
  optionsCre_doorTrack_normal,
  getDoorTrackByDoorModel,
};
