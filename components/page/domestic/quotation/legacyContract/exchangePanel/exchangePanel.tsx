import classNames from 'classnames';

import ExchangeRow from './exchangeRow';
import ExchangeThead from './exchangeThead';

import scss from './exchangePanel.module.scss';

export { ExchangeRow };

export default function ExchangePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className={scss.exchangePanel}>
      <ExchangeThead />

      <div className={classNames('pl-[20px] pr-[30px]')}>
        {children}

        {/* row1 */}
        {/* {classProductArr.map((prod, index) => {
          exchangeTotal += Number(prod.reduceExchangePrice);

          return (
            <ExchangeRow
              key={index}
              oriQty={prod.quantity}
              reduce={prod.reduceQty}
              reduceOnChange={(v) => {
                prod.reduceQty = v;
              }}
              exchange={prod.exchangeQty}
              changedMoney={prod.reduceExchangePrice}
            />
          );
        })} */}
        {/*  */}
      </div>
    </div>
  );
}
