import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

interface TuseSearchModal<Dto extends Tdto = Tdto> {
  inputSelPropsArr: TinputSelProps[];
  clearFilter: () => void;
  confirmFilter: () => void;
  dataArr: Dto[];
  qty: number | string;
  viewRef?: ((node?: Element | null) => void) | undefined;
  isLoading?: boolean;
  dataConfig: Tconfig<Dto>;
  dataKeyArr: string[];
}

type Tstate = {
  [key: string]: string;
};

type Tconfig_filter = {
  caption: string;
  key: string;
  type: 'input' | 'select' | 'date';
  selectOptions?: { value: string; label: string }[];
}[];

type Tdto = {
  [key: string]: any;
  id: string;
};

type Tconfig<Dto extends Tdto = Tdto> = {
  [key in string]: {
    label: string;
    style: React.CSSProperties;
    reducer?: (props: { data: Dto; index: number }) => React.ReactNode;
  };
};

export type { TuseSearchModal, Tstate, Tconfig_filter, Tdto, Tconfig };
