import { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import scss from './squarebtn.module.scss';

// ======================================================================

import { btnLookup } from './btnLookup';

// ======================================================================
type Tprops = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  content?: keyof typeof btnLookup;
  label?: string | null;
  sharp?: 'basic' | 'long' | 'mini';
  theme?: 'danger';
  disabled?: boolean;
  defaultIconColor?: boolean;
  attr_icon?: React.SVGProps<SVGSVGElement>;
  attr_label?: React.HTMLAttributes<HTMLSpanElement>;
};

// ======================================================================
const SquareBtn = (props: Tprops) => {
  const { t } = useTranslation('larrysBtn');

  const {
    //
    children,
    content,
    label,
    sharp = 'basic',
    theme,
    defaultIconColor,

    className,
    attr_icon,
    attr_label,

    disabled,
    ...btnAttr
  } = props;

  const { Icon, i18nKey } = useMemo(() => {
    if (content) {
      return btnLookup[content];
    }

    return {
      Icon: null,
      i18nKey: null,
    };
  }, [content]);

  const theLabel = (() => {
    if (label !== null && label !== undefined) {
      return label;
    }

    if (label === null) {
      return null;
    }

    return i18nKey && t(i18nKey);
  })();

  return (
    <button
      //
      {...btnAttr}
      className={classNames(
        scss[sharp],
        theme && scss[theme],
        disabled && scss.disabled,
        defaultIconColor && scss.defaultIconColor,
        className
      )}
    >
      {Icon && <Icon {...attr_icon} />}
      {theLabel !== null && theLabel !== undefined && <span {...attr_label}>{theLabel}</span>}
      {children}
    </button>
  );
};

export default SquareBtn;

// ======================================================================
