import DataEntry from 'components/global/gear/dataEntry';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

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
    <div>
      <div className="flex gap-2 mb-1">
        <span className="text-main text-xl">主產品</span>
        <DataEntry
          className="w-[170px] gap-2"
          caption="總折數 : "
          captionWrapperProps={{ className: 'text-xl font-normal w-fit' }}
          childrenWrapperProps={{
            className: 'text-xl',
          }}
        >
          <DataEntry.Input />
        </DataEntry>
      </div>

      <div className={scss.table}>
        <QuotationRow_dndThead
          className={scss.thead}
          disabled={true}
          keyArr={keyArr}
          configDict={config}
          onDragEnd={() => {}}
          dragHandleInvisible={true}
        />

        {Array.from({ length: 30 }).map((_, index) => {
          return (
            <QuotationRow_dnd key={index} id={`${index}`} index={0}>
              {keyArr.map((key) => {
                const style = config[key]?.style ?? {};

                return (
                  <Cell key={key} style={style}>
                    {key}
                  </Cell>
                );
              })}
            </QuotationRow_dnd>
          );
        })}
      </div>
      <div className="p-2 border border-t-0 border-border ">
        <SquareBtn sharp="mini">新增</SquareBtn>
      </div>
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
