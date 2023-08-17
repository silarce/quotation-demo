import { useState } from 'react';

// components
import DndThead from './quotationProduct/dndThead';
import ProductList from './quotationProduct/productList';
import ProductList_legacy from './quotationProduct/productList_legacy';

// global gear
import AddButton from 'components/global/gear/button/addButton';

// css
import style from './quotationProduct.module.scss';
import styleL from './local.module.scss';

// type
import {
  TinputSelProps,
  TinputProps,
  TselectProps,
  TcheckboxProps,
} from 'components/global/gear/inputAndSel_v2/inputSel';

import { Class_quotation } from 'hooks/quotation/useQuotation';

// ======================================================================
export default function QuotationProduction({
  classQuotation,
  disabled,
  switch02,
  className = '',
}: {
  classQuotation: Class_quotation;
  disabled: boolean;
  switch02?: boolean;
  className?: string;
}) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()

  const [allowMove, setAllowMove] = useState(false);

  const borderRed = switch02 ? style.borderRed : '';

  return (
    <div className={`${style.container} ${borderRed} ${className}`}>
      <div className={styleL.header}>
        <h2>主產品設定</h2>
        <button className={(allowMove && styleL.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      <div className={style.listContainer}>
        <div className={style.thead}>
          <DndThead classQuotation={classQuotation} allowMove={allowMove} />
        </div>

        <ProductList classQuotation={classQuotation as Class_quotation} disabled={disabled} />

        <AddButton className={style.addBtn} label="新增產品" onClick={classQuotation.addMainProd} />
      </div>
    </div>
  );
}
// =========================================================================

type Tkey = 'discount' | 'category' | 'series' | 'ejectionDoor' | 'listPrice'; // | 'doorRail';

const keyArr: Tkey[] = [
  //
  'discount',
  'category',
  'series',
  'ejectionDoor',
  'listPrice',
  // 'doorRail',
];

const disabled = false;

// const config = {
//   discount: { id: 'discount', label: '折數', width: '75px', type: 'input', inputType: 'number' },
//   category: { id: 'category', label: '項目', width: '60px', type: 'input' },
//   // select
//   series: { id: 'series', label: '報價別', width: '105px', type: 'select' },
//   // selectWithIcon
//   doorRail: { id: 'doorRail', label: '門軌', width: '210px', type: 'selectWithIcon' },
//   // checkbox
//   ejectionDoor: { id: 'ejectionDoor', label: '彈射門', width: '60px', type: 'checkbox' },
//   // readOnly
//   listPrice: { id: 'listPrice', label: '牌價', width: '120px', type: 'readOnly' },
// } as const;

type Tconfig = {
  [key in Tkey]: {
    label: string; // header用的
    inputSelProps: TinputSelProps; // body用的
  };
};

const config: Tconfig = {
  discount: {
    label: '折數',
    inputSelProps: {
      disabled,
      wrapperStyle: {
        width: '75px',
      },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  category: {
    label: '項目',
    inputSelProps: {
      disabled,
      wrapperStyle: {
        width: '60px',
      },
      inputProps: {
        props: {},
      },
    },
  },
  series: {
    label: '報價別',
    inputSelProps: {
      disabled,
      wrapperStyle: {
        width: '105px',
      },
      selectProps: {
        props: {
          options: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ],
        },
      },
    },
  },
  ejectionDoor: {
    label: '彈射門',
    inputSelProps: {
      disabled,
      wrapperStyle: {
        width: '60px',
      },
      checkBoxProps: {
        propsArr: [{ key: 'ejectionDoor' }],
      },
    },
  },
  listPrice: {
    label: '牌價',
    inputSelProps: {
      disabled,
      wrapperStyle: {
        width: '120px',
      },
      inputProps: {
        props: { disabled: true },
      },
    },
  },
  // doorRail: {
  //   label: '門軌',
  //   inputSelProps: {
  //     disabled,
  //     wrapperStyle: {
  //       width: '210px',
  //     },
  //     selectProps: {
  //       props: {
  //         options: [
  //           { value: '1', label: '1' },
  //           { value: '2', label: '2' },
  //         ],
  //       },
  //     },
  //   },
  // },
  //
};
