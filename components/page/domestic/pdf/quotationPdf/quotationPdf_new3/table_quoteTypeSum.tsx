// css
import style from './quotationPdf.module.scss';

type TquoteTypeSum = {
  series: string;
  qtySum: number;
  unitPriceSum: number;
  priceTotleSum: number;
};

export type TquoteTypeSumList = {
  [key in string]: TquoteTypeSum;
};

type TquoteTypeSumArr = TquoteTypeSum[];

// ======================================================================
export default function Table_quoteTypeSum({ quoteTypeSumArr }: { quoteTypeSumArr: TquoteTypeSumArr }) {
  return (
    <div className={style.table_quoteTypeSum}>
      {/* thead */}
      {indexKeys.map((key, index) => {
        const { label, width } = config[key];
        const theStyle = { width };

        return (
          <div className={style.theadCell} key={index} style={theStyle}>
            <span>{label}</span>
          </div>
        );
      })}

      {/* tbody */}

      {quoteTypeSumArr.map((row) => {
        return indexKeys.map((key, cIndex) => {
          const value = row[key];
          const { width, align, suffix } = config[key];
          const theStyle = { width };
          const subClass = ' ' + style[align ?? ''];

          return (
            <div className={style.tbodyCell + subClass} key={cIndex} style={theStyle}>
              <span>
                {value.toLocaleString()}
                {suffix}
              </span>
            </div>
          );
        });
      })}
    </div>
  );
}

// =============================================================================

type TindexKeys = 'series' | 'qtySum' | 'unitPriceSum' | 'priceTotleSum';

type Tconfig = {
  [key in TindexKeys]: {
    label: string;
    width: string;
    align?: 'center' | 'right';
    suffix?: string;
  };
};

const indexKeys: TindexKeys[] = ['series', 'qtySum', 'unitPriceSum', 'priceTotleSum'];

const config: Tconfig = {
  series: {
    label: '門型類型',
    width: 'auto',
  },
  qtySum: {
    label: '樘數',
    width: 'auto',
    suffix: '樘',
  },
  unitPriceSum: {
    label: '總單價金額',
    width: 'auto',
  },
  priceTotleSum: {
    label: '總複價金額',
    width: 'auto',
  },
};

// =============================================================================
