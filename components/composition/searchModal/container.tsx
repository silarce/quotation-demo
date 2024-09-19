import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import { useGetCustomers_infinite_2 } from 'js/api/api_customer';

import scss from './searchModal.module.scss';

export default function Container() {
  return (
    <div className={scss.container}>
      <div>
        <span>查找條件 : </span>
      </div>
      <div>
        <span>筆數 : 共{'999'}筆</span>
      </div>
      <div className={scss.left}>
        <Filter />
      </div>
      <div className={scss.right}>456</div>
    </div>
  );
}

// ===============================================================

const Filter = () => {
  return (
    <div className={scss.filter}>
      <div className={scss.inputPanel}>
        <InputSel caption="test" inputProps={{}} />
        <InputSel caption="test" inputProps={{}} />
        <InputSel caption="test" inputProps={{}} />
      </div>

      <div className={scss.btnBar}>
        <SquareBtn label="清除條件" sharp="long" />
        <SquareBtn label="搜尋" sharp="long" />
      </div>
    </div>
  );
};

// ===============================================================

const Table = () => {
  return <div className={scss.table}></div>;
};
