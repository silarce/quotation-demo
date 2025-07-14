import classNames from 'classnames';

import scss from './index.module.scss';

import Icon_add from 'public/image/icon/fong/add.svg';
import Icon_arrowDown from 'public/image/icon/fong/arrowDown.svg';
import Icon_arrowUp from 'public/image/icon/fong/arrowUp.svg';
import Icon_cross from 'public/image/icon/fong/cross.svg';
import Icon_import from 'public/image/icon/fong/import.svg';
import Icon_query from 'public/image/icon/fong/query.svg';
import Icon_save from 'public/image/icon/fong/save.svg';
import Icon_saveAs from 'public/image/icon/fong/saveAs.svg';
import Icon_tempIcon from 'public/image/icon/fong/tempIcon.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_send from 'public/image/icon/fong/send.svg';

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
  | 'send';

type Tprops_btn = {
  theme?: TthemeName;
  props_icon?: React.SVGProps<SVGSVGElement>; // SVG component or null
  props_iconAfter?: React.SVGProps<SVGSVGElement>; // SVG component or null
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null; // SVG component or null
  iconAfter?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null; // SVG component or null
} & React.HTMLAttributes<HTMLButtonElement>;

interface Ttheme {
  className?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null; // SVG component or null
  IconAfter?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null; // SVG component or null
}

// ================================================================================

const lookup_theme: Record<TthemeName, Ttheme> = {
  basic: {},
  save: {
    className: scss.save,
    Icon: Icon_save,
  },
  add: {
    className: scss.add,
    Icon: Icon_add,
  },
  arrowDown: {
    className: scss.arrowDown,
    IconAfter: Icon_arrowDown,
  },
  arrowUp: {
    className: scss.arrowUp,
    IconAfter: Icon_arrowUp,
  },
  cross: {
    className: scss.cross,
    Icon: Icon_cross,
  },
  import: {
    className: scss.import,
    Icon: Icon_import,
  },
  query: {
    className: scss.query,
    Icon: Icon_query,
  },

  saveAs: {
    className: scss.saveAs,
    Icon: Icon_saveAs,
  },
  tempIcon: {
    className: scss.tempIcon,
    Icon: Icon_tempIcon,
  },
  trash: {
    className: scss.trash,
    Icon: Icon_trash,
  },
  send: {
    className: scss.send,
    Icon: Icon_send,
  },
};

// ================================================================================
export default Btn;
