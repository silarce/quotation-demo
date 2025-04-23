// component
import {
  Tprops_cell,
  Tprops_quotationRow_dndThead,
  //
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
  Panel_iterativeProd_right_thead,
  Panel_iterativeProd_right,
  Panel_prod,
  Panel_iterativeProd,
  Panel_accessory,
} from 'components/page/domestic/quotation_v2/quotationRow';

import scss from './index.module.scss';

export default function Table() {
  return (
    <div className={scss.table}>
      <QuotationRow_dndThead
        disabled={true}
        keyArr={keyArr}
        configDict={config}
        onDragEnd={() => {}}
        dragHandleInvisible={true}
      />

      <QuotationRow_dnd id="x" index={0}>
        {keyArr.map((key) => {
          const style = config[key]?.style ?? {};

          return (
            <Cell key={key} style={style}>
              {key}
            </Cell>
          );
        })}
      </QuotationRow_dnd>
      <QuotationRow_dnd id="y" index={1}>
        {keyArr.map((key) => {
          const style = config[key]?.style ?? {};

          return (
            <Cell key={key} style={style}>
              {key}
            </Cell>
          );
        })}
      </QuotationRow_dnd>
      <QuotationRow_dnd id="z" index={2}>
        {keyArr.map((key) => {
          const style = config[key]?.style ?? {};

          return (
            <Cell key={key} style={style}>
              {key}
            </Cell>
          );
        })}
      </QuotationRow_dnd>
    </div>
  );
}

// =====================================================================

const keyArr = ['a', 'b', 'c'];

const config: Tprops_quotationRow_dndThead['configDict'] = {
  a: {
    label: 'A',
    style: {
      width: 100,
    },
  },
  b: {
    label: 'B',
    style: {
      width: 200,
    },
  },
  c: {
    label: 'C',
    style: {
      width: 300,
    },
  },
};
