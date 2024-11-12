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

type Tstate_filter = {
  [key: string]: string;
};

type Tconfig_filter = {
  caption: string;
  key: string;
  type: 'input' | 'select' | 'date';
  selectOptions?: { value: string; label: string }[];
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
}[];

type Tdto = {
  [key: string]: any;
  id: string;
};

type Tconfig<Dto extends Tdto = Tdto> = {
  [key in string]: {
    label: string;
    style: React.CSSProperties;
    reducer?: (data: Dto, optional: { index: number }) => React.ReactNode;
  };
};

type TmodalData<Dto extends Tdto = Tdto> = {
  dataArr: Dto[];
  qty: number | string;
  viewRef?: ((node?: Element | null) => void) | undefined;
  isLoading?: boolean;
};

export type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData };
