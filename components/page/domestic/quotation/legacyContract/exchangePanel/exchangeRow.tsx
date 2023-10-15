import scss from './exchangeRow.module.scss';

const ExchangeRow = ({
  oriQty,
  reduce,
  reduceOnChange,
  exchange,
  changedMoney,
  style,
  disabled,
}: {
  oriQty: number | string;
  reduce: number | string;
  reduceOnChange: (v: string) => void;
  exchange: number | string;
  changedMoney: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) => {
  return (
    <div className={scss.row} style={style}>
      <span>{oriQty}</span>
      <div className={scss.inputBox}>
        <span>-</span>
        <input
          disabled={disabled}
          type="number"
          value={reduce ?? ''}
          // onFocus={() => reduceOnChange('0')}
          onChange={(e) => {
            reduceOnChange(e.target.value);
          }}
        />
      </div>
      <span>- {exchange}</span>
      <span>- {Number(changedMoney).toLocaleString()}</span>
    </div>
  );
};

export default ExchangeRow;
