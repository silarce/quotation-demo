import classNames from 'classnames';

import scss from './exchangeThead.module.scss';
import styleL from 'components/page/domestic/quotation/local.module.scss';

export default function ExchangeThead() {
  return (
    <div className={classNames(scss.header, styleL.thead)}>
      <div className={classNames(styleL.theadCell)}>
        <span>原數量</span>
      </div>
      <div className={classNames(styleL.theadCell)}>
        <span>追減</span>
      </div>
      <div className={classNames(styleL.theadCell)}>
        <span>變更</span>
      </div>
      <div className={classNames(styleL.theadCell)}>
        <span>追減/變更金額</span>
      </div>
    </div>
  );
}
