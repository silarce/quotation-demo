import classNames from 'classnames';

import ExchangeRow from './exchangeRow';
import ExchangeThead from './exchangeThead';

import scss from './exchangePanel.module.scss';

export { ExchangeRow };

export default function ExchangePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className={scss.exchangePanel}>
      <ExchangeThead />

      <div className={classNames('pl-[20px] pr-[30px]')}>{children}</div>
    </div>
  );
}
