import { Tparams } from './dtoTypes';

type TuseNoMeta = (props?: {
  params?: Tparams;
  id?: string;
  date?: string;
  [key: string]: string | number | Tparams | undefined;
  // other?: {
  //   [key: string]: string | number | undefined;
  // };
}) => {
  data: any[] | undefined;
  isLoading: boolean;
  // update: Awaited<() => void>;
  update: () => void;
};

export type { TuseNoMeta };
