import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import scss from './squarebtn.module.scss';

// ======================================================================

import { Icon_fc_add2 } from '../../svgIcon/fcIcon';

// ======================================================================
type Tprops = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  content: string;
  theme?: 'basic' | 'danger' | 'long';
  disabled?: boolean;
  defaultIconColor?: boolean;
};

// ======================================================================
const SquareBtn = (props: Tprops) => {
  const { t } = useTranslation('larrysBtn');

  const { children, content, theme = 'basic', className, disabled, defaultIconColor, ...btnAttr } = props;

  return (
    <button
      //
      title="查尋單據"
      {...btnAttr}
      className={classNames(
        scss[theme],
        disabled && scss.disabled,
        defaultIconColor && scss.defaultIconColor,
        className
      )}
    >
      <Icon_fc_add2 />
      {t('add')}
      {children}
    </button>
  );
};

export default SquareBtn;
