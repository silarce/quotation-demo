// typhoonProtection
import icon_sj302_75_30t from 'public/image/doorTrack/typhoonProtection/SJ302_75_30t.svg';
import icon_sJ302_90_30t from 'public/image/doorTrack/typhoonProtection/SJ302_90_30t.svg';
import icon_sJ302_95_30t from 'public/image/doorTrack/typhoonProtection/SJ302_95_30t.svg';
import icon_sJ302_95_45t from 'public/image/doorTrack/typhoonProtection/SJ302_95_45t.svg';

// normal
import icon_sJ120A_100_25_105_25 from 'public/image/doorTrack/normal/SJ120A_100_25_105_25.svg';
import icon_sJ302_30 from 'public/image/doorTrack/normal/SJ302_30.svg';
import icon_sJ303A_100_25_25 from 'public/image/doorTrack/normal/SJ303A_100_25_25.svg';
import icon_sJ303A_100_65_25 from 'public/image/doorTrack/normal/SJ303A_100_65_25.svg';
import icon_sJ303S_85 from 'public/image/doorTrack/normal/SJ303S_85.svg';
import icon_sJ305D_22 from 'public/image/doorTrack/normal/SJ305D_22.svg';
import icon_sJ312_106_60t from 'public/image/doorTrack/normal/SJ312_106_60t.svg';
import icon_sJ312_150_90t from 'public/image/doorTrack/normal/SJ312_150_90t.svg';

// type
import { Toption } from 'js/utils/options/options';

export type { Toption };

export const optionsCre_doorTrack_typhoonProtection = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = [
    { value: 'sj302_75_30t', label: 'sj302_75_30t', icon: icon_sj302_75_30t.src },
    { value: 'sJ302_90_30t', label: 'sJ302_90_30t', icon: icon_sJ302_90_30t.src },
    { value: 'sJ302_95_30t', label: 'sJ302_95_30t', icon: icon_sJ302_95_30t.src },
    { value: 'sJ302_95_45t', label: 'sJ302_95_45t', icon: icon_sJ302_95_45t.src },
  ];

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘', icon: undefined });
  }

  return optionArr;
};

export const optionsCre_doorTrack_normal = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = [
    {
      value: 'sJ120A_100_25_105_25',
      label: 'sJ120A_100_25_105_25',
      icon: icon_sJ120A_100_25_105_25.src,
    },
    {
      value: 'sJ302_30',
      label: 'sJ302_30',
      icon: icon_sJ302_30.src,
    },
    {
      value: 'sJ303A_100_25_25',
      label: 'sJ303A_100_25_25',
      icon: icon_sJ303A_100_25_25.src,
    },
    {
      value: 'sJ303A_100_65_25',
      label: 'sJ303A_100_65_25',
      icon: icon_sJ303A_100_65_25.src,
    },
    {
      value: 'sJ303S_85',
      label: 'sJ303S_85',
      icon: icon_sJ303S_85.src,
    },
    {
      value: 'sJ305D_22',
      label: 'sJ305D_22',
      icon: icon_sJ305D_22.src,
    },
    {
      value: 'sJ312_106_60t',
      label: 'sJ312_106_60t',
      icon: icon_sJ312_106_60t.src,
    },
    {
      value: 'sJ312_150_90t',
      label: 'sJ312_150_90t',
      icon: icon_sJ312_150_90t.src,
    },
  ];

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘', icon: undefined });
  }

  return optionArr;
};
