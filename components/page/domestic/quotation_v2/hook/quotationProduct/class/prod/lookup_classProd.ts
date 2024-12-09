import {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/interface';

import { ClassProd_SJ302 } from './classProd_SJ302';
import { ClassProd_SJ305D } from './classProd_SJ305D';
import { ClassProd_W2 } from './classProd_W2';

import { ClassProd_special } from './classProd_special';

const lookup_classProd = {
  'SJ-302': ClassProd_SJ302,
  'SJ-305D': ClassProd_SJ305D,
  W2: ClassProd_W2,
  special: ClassProd_special,
};

export { lookup_classProd };
export type {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_special,
  Interface_ClassProd_prime,
  ClassProd_special,
};
