import scss from './exchangeRow.module.scss';

const ExchangeRow = ({
  oriQty,
  reduce,
  reduceOnChange,
  exchange,
  changedMoney,
}: {
  oriQty: number | string;
  reduce: number | string;
  reduceOnChange: (v: string) => void;
  exchange: number | string;
  changedMoney: string;
}) => {
  return (
    <div className={scss.row}>
      <span>{oriQty}</span>
      <div className={scss.inputBox}>
        <span>-</span>
        <input
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
