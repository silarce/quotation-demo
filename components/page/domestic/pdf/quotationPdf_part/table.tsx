// css
import scss from './quotationPdf_part.module.scss';

export default function Table({ partArr, priceTotal }: { partArr: Tpart[]; priceTotal: string }) {
  return (
    <div className={scss.table}>
      <div className={scss.thead}>
        <div style={{ width: '50px' }}>
          <span>項次:</span>
        </div>
        {keyIndex.map((key, index) => {
          const { label, style, headStyle } = config[key];

          return (
            <div key={index} style={{ ...style, ...headStyle }}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={scss.tbody}>
        {partArr.map((part, pIndex) => {
          return (
            <div className={scss.row} key={pIndex}>
              {/* 項次 */}
              <div style={{ width: '50px' }}>
                <span>{pIndex + 1}</span>
              </div>
              {keyIndex.map((key, cIndex) => {
                const { style } = config[key];
                const value = part[key] as string;

                return (
                  <div key={cIndex} style={style}>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className={scss.total}>
        <div>
          <span>報價合計 : </span>
        </div>
        <div>
          <span>{priceTotal}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================

type Tpart = {
  partName: string;
  desc: string;
  // unit: string;
  unit: React.ReactNode;
  qty: string;
  price: string;
  totalPrice: string;
};

type TkeyIndex = 'partName' | 'desc' | 'unit' | 'qty' | 'price' | 'totalPrice';
type Tconfig = {
  [key in TkeyIndex]: {
    label: string;
    style: {
      width: string;
      textAlign?: 'left' | 'center' | 'right';
      flex?: string;
    };
    headStyle?: React.CSSProperties;
  };
};

const keyIndex: TkeyIndex[] = ['partName', 'desc', 'unit', 'qty', 'price', 'totalPrice'];

const config: Tconfig = {
  partName: {
    label: '名稱',
    style: {
      width: '260px',
    },
  },
  desc: {
    label: '說明',
    style: {
      width: 'auto',
      flex: '1',
    },
  },
  unit: {
    label: '單位',
    style: {
      width: '60px',
      textAlign: 'center',
    },
  },
  qty: {
    label: '數量',
    style: {
      width: '80px',
      textAlign: 'right',
    },
    headStyle: {
      textAlign: 'left',
    },
  },
  price: {
    label: '單價',
    style: {
      width: '100px',
      textAlign: 'right',
    },
    headStyle: {
      textAlign: 'left',
    },
  },
  totalPrice: {
    label: '金額',
    style: {
      width: '100px',
      textAlign: 'right',
    },
    headStyle: {
      textAlign: 'left',
    },
  },
};
