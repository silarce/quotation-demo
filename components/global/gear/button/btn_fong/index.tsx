import dynamic from 'next/dynamic';

import classNames from 'classnames';

import scss from './index.module.scss';

// ================================================================================

function Btn({
  theme = 'basic',
  className,
  children,
  props_icon,
  props_iconAfter,
  icon,
  iconAfter,
  ...props
}: Tprops_btn) {
  const { className: themeClassName } = theme && lookup_theme[theme];
  const Icon = icon !== undefined ? icon : lookup_theme[theme].Icon;
  const IconAfter = iconAfter !== undefined ? iconAfter : lookup_theme[theme].IconAfter;

  return (
    <button className={classNames(scss.btn, themeClassName, className)} {...props}>
      {/*  */}
      {Icon && (
        <div className={scss.iconContainer}>
          <Icon {...props_icon} />
        </div>
      )}

      {children}

      {IconAfter && (
        <div className={classNames(scss.iconContainer, scss.after)}>
          <IconAfter {...props_iconAfter} />
        </div>
      )}

      {/*  */}
    </button>
  );
}

// ================================================================================

type TthemeName =
  | 'basic'
  | 'add'
  | 'arrowDown'
  | 'arrowUp'
  | 'cross'
  | 'import'
  | 'query'
  | 'save'
  | 'saveAs'
  | 'tempIcon'
  | 'trash'
  | 'send'
  | 'brown';

type Tprops_btn = {
  theme?: TthemeName;
  props_icon?: React.SVGProps<SVGElement>;
  props_iconAfter?: React.SVGProps<SVGElement>;
  icon?: React.ComponentType<React.SVGProps<SVGElement>> | null;
  iconAfter?: React.ComponentType<React.SVGProps<SVGElement>> | null;
} & React.HTMLAttributes<HTMLButtonElement>;

interface Ttheme {
  className?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGElement>>;
  IconAfter?: React.ComponentType<React.SVGProps<SVGElement>>; // SVG component or null
}

// ================================================================================

const lookup_theme: Record<TthemeName, Ttheme> = {
  basic: {},
  save: {
    className: scss.blue_I,
    Icon: dynamic(() => import('public/image/icon/fong/save.svg')),
  },
  add: {
    className: scss.green_I,
    Icon: dynamic(() => import('public/image/icon/fong/add.svg')),
  },
  arrowDown: {
    IconAfter: dynamic(() => import('public/image/icon/fong/arrowDown.svg')),
  },
  arrowUp: {
    IconAfter: dynamic(() => import('public/image/icon/fong/arrowUp.svg')),
  },
  cross: {
    className: scss.green_II,
    Icon: dynamic(() => import('public/image/icon/fong/cross.svg')),
  },
  import: {
    Icon: dynamic(() => import('public/image/icon/fong/import.svg')),
  },
  query: {
    Icon: dynamic(() => import('public/image/icon/fong/query.svg')),
  },

  saveAs: {
    Icon: dynamic(() => import('public/image/icon/fong/saveAs.svg')),
  },
  tempIcon: {
    Icon: dynamic(() => import('public/image/icon/fong/tempIcon.svg')),
  },
  trash: {
    className: scss.red_I,
    Icon: dynamic(() => import('public/image/icon/fong/trash.svg')),
  },
  send: {
    className: scss.blue_I,
    Icon: dynamic(() => import('public/image/icon/fong/send.svg')),
  },
  brown: {
    className: scss.brown,
  },
};

// ================================================================================
export default Btn;
