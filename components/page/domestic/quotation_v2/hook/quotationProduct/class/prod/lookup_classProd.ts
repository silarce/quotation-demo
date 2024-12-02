import {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/interface';

import { ClassProd_SJ202 } from './classProd_SJ302';
import { ClassProd_special } from './classProd_special';

const lookup_classProd = {
  'SJ-302': ClassProd_SJ202,
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
