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
import Icon_warning from 'public/image/icon/fong/warning.svg';
import Icon_setting from 'public/image/icon/fong/setting.svg';
import Icon_calendar from 'public/image/icon/fong/calendar.svg';

// ================================================================================

function Btn_fong({
  className,
  children,
  //
  theme = 'basic',
  props_icon,
  props_iconAfter,
  icon,
  iconAfter,
  themeColor: customThemeColor,
  //
  ...props
}: Tprops_btn) {
  const { themeColor } = lookup_theme[theme];

  const Icon = typeof icon === 'string' ? lookup_icon[icon] : icon || lookup_theme[theme].Icon;
  const IconAfter = typeof iconAfter === 'string' ? lookup_icon[iconAfter] : iconAfter || lookup_theme[theme].IconAfter;

  const themeColorName = customThemeColor || themeColor;

  return (
    <button className={classNames(scss.btn, themeColorName && scss[themeColorName], className)} {...props}>
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
    </button>
  );
}

// ================================================================================

type Tcolors = 'basic' | 'blue_I' | 'blue_II' | 'green_I' | 'green_II' | 'red_I' | 'brown_I' | 'warning_I' | 'yellow_I';

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
  | 'brown'
  | 'warning'
  | 'warning_2'
  | 'setting'
  | 'calendar';

type Tprops_btn = {
  theme?: TthemeName;
  props_icon?: React.SVGProps<SVGElement>;
  props_iconAfter?: React.SVGProps<SVGElement>;
  icon?: React.ComponentType<React.SVGProps<SVGElement>> | null | TiconName;
  iconAfter?: React.ComponentType<React.SVGProps<SVGElement>> | null | TiconName;
  themeColor?: Tcolors;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

interface Ttheme {
  themeColor?: Tcolors;
  className?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGElement>>;
  IconAfter?: React.ComponentType<React.SVGProps<SVGElement>>;
}

type TiconName = keyof typeof lookup_icon;

// ================================================================================

const lookup_icon = {
  add: Icon_add,
  arrowDown: Icon_arrowDown,
  arrowUp: Icon_arrowUp,
  cross: Icon_cross,
  import: Icon_import,
  query: Icon_query,
  save: Icon_save,
  saveAs: Icon_saveAs,
  tempIcon: Icon_tempIcon,
  trash: Icon_trash,
  send: Icon_send,
  setting: Icon_setting,
} as const;

const lookup_theme: Record<TthemeName, Ttheme> = {
  basic: {
    themeColor: 'basic',
  },
  save: {
    themeColor: 'blue_I',
    Icon: Icon_save,
  },
  add: {
    themeColor: 'green_I',
    Icon: Icon_add,
  },
  arrowDown: {
    IconAfter: Icon_arrowDown,
  },
  arrowUp: {
    IconAfter: Icon_arrowUp,
  },
  cross: {
    themeColor: 'green_II',
    Icon: Icon_cross,
  },
  import: {
    themeColor: 'blue_II',
    Icon: Icon_import,
  },
  query: {
    themeColor: 'blue_II',
    Icon: Icon_query,
  },
  saveAs: {
    Icon: Icon_saveAs,
  },
  tempIcon: {
    Icon: Icon_tempIcon,
  },
  trash: {
    themeColor: 'red_I',
    Icon: Icon_trash,
  },
  send: {
    themeColor: 'blue_I',
    Icon: Icon_send,
  },
  brown: {
    themeColor: 'brown_I',
  },
  warning: {
    themeColor: 'warning_I',
    Icon: Icon_warning,
  },
  warning_2: {
    themeColor: 'yellow_I',
    Icon: Icon_warning,
  },
  setting: {
    themeColor: 'blue_II',
    Icon: Icon_setting,
  },
  calendar: {
    themeColor: 'blue_II',
    Icon: Icon_calendar,
  },
};

const Btn = Btn_fong;

export default Btn;
export type { Tprops_btn };
