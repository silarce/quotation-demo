import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';

// =======================================================================
class Class_other {
  constructor({
    //
    reRender,
    delSelf,
    copySelf,
  }: {
    reRender: TreRender;
    delSelf: () => void;
    copySelf: () => void;
  }) {} // constructor
}
