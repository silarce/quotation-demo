import classNames from 'classnames';

import scss from './index.module.scss';

// ================================================================================

function Btn({
  //
  theme,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & Tprops_btn) {
  const { Icon, className: themeClassName } = (theme && lookup_theme[theme]) ?? {};

  return (
    <button
      className={classNames(
        //
        scss.btn,
        theme && lookup_theme[theme].className,
        className
      )}
      {...props}
    >
      {Icon && (
        <div className={scss.iconContainer}>
          <Icon />
        </div>
      )}

      {children}
    </button>
  );
}

// ================================================================================

type TthemeName =
  | 'save'
  | 'send'
  | 'add'
  //
  | 'delete'
  | 'search'
  | 'return'
  | 'edit'
  | 'tempStore'
  | 'export'
  | 'expand'
  | 'fold'
  | 'query';

type Tprops_btn = {
  theme?: TthemeName;
} & React.HTMLAttributes<HTMLButtonElement>;

interface Ttheme {
  className: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null; // SVG component or null
}

// ================================================================================

// ================================================================================

const TempSvg = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1541_44902)">
        <path
          d="M16 4.58C15.9833 2.2755 14.0609 0.4375 11.7564 0.4375H4.24755C1.96042 0.4375 0.0449864 2.24669 0.000673921 4.53456C-0.00929359 5.08966 0.0913942 5.64119 0.296862 6.15696C0.502329 6.67272 0.808461 7.14241 1.19739 7.53859C1.58633 7.93478 2.05027 8.24954 2.56216 8.46451C3.07404 8.67947 3.62361 8.79033 4.1788 8.79062H7.53355C7.58819 8.79222 7.6407 8.81217 7.68262 8.84725C7.72455 8.88234 7.75344 8.93051 7.76464 8.98402C7.77584 9.03752 7.76871 9.09324 7.74438 9.14219C7.72006 9.19115 7.67996 9.23049 7.63055 9.25387L2.48774 11.5081C0.966486 12.1825 -0.0101386 13.6945 0.000736421 15.3585C0.0181739 17.6634 1.9393 19.503 4.24461 19.503H6.00442C8.32592 19.503 10.2588 17.6411 10.2552 15.3196C10.2504 13.6188 9.21617 12.0902 7.63917 11.4533C7.59541 11.4353 7.55794 11.4047 7.53143 11.3655C7.50492 11.3263 7.49055 11.2801 7.49012 11.2328C7.48968 11.1854 7.5032 11.139 7.52899 11.0993C7.55478 11.0596 7.59169 11.0284 7.63511 11.0096L13.517 8.43044C15.0367 7.75494 16.0117 6.24306 16 4.58Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1541_44902">
          <rect width="16" height="19.125" fill="white" transform="translate(0 0.4375)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const TempSvg_query = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="currentColor"
    >
      <path
        d="M4.43812 8.87624C3.19772 8.87624 2.14805 8.44654 1.2891 7.58714C0.430157 6.72774 0.000455553 5.67807 3.61263e-07 4.43812C-0.000454831 3.19818 0.429246 2.14851 1.2891 1.2891C2.14896 0.429701 3.19863 0 4.43812 0C5.67761 0 6.72751 0.429701 7.58782 1.2891C8.44814 2.14851 8.87761 3.19818 8.87624 4.43812C8.87624 4.93883 8.79659 5.41109 8.63727 5.85491C8.47795 6.29872 8.26174 6.69132 7.98862 7.03272L11.8122 10.8563C11.9374 10.9815 12 11.1408 12 11.3343C12 11.5277 11.9374 11.6871 11.8122 11.8122C11.6871 11.9374 11.5277 12 11.3343 12C11.1408 12 10.9815 11.9374 10.8563 11.8122L7.03272 7.98862C6.69132 8.26173 6.29872 8.47795 5.85491 8.63727C5.4111 8.79659 4.93883 8.87624 4.43812 8.87624ZM4.43812 7.51067C5.29161 7.51067 6.01718 7.21206 6.61485 6.61485C7.21252 6.01764 7.51112 5.29206 7.51067 4.43812C7.51021 3.58418 7.21161 2.85883 6.61485 2.26208C6.01809 1.66532 5.29252 1.36649 4.43812 1.36558C3.58373 1.36467 2.85838 1.6635 2.26208 2.26208C1.66578 2.86065 1.36694 3.586 1.36558 4.43812C1.36421 5.29024 1.66304 6.01582 2.26208 6.61485C2.86111 7.21388 3.58646 7.51249 4.43812 7.51067Z"
        fill="currentColor"
      />
    </svg>
  );
};

const TempSvg_add = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1485_21563)">
        <path
          d="M4 6H8M6 4V8M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1485_21563">
          <rect width="12" height="12" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

// ================================================================================

const lookup_theme: Record<TthemeName, Ttheme> = {
  save: {
    className: scss.save,
    Icon: TempSvg_query,
  },
  send: {
    className: scss.send,
    Icon: TempSvg,
  },
  add: {
    className: scss.add,
    Icon: TempSvg_add,
  },
  delete: {
    className: scss.delete,
    Icon: null,
  },
  search: {
    className: scss.search,
    Icon: null,
  },
  return: {
    className: scss.return,
    Icon: null,
  },
  edit: {
    className: scss.edit,
    Icon: null,
  },
  tempStore: {
    className: scss.tempStore,
    Icon: null,
  },
  export: {
    className: scss.export,
    Icon: null,
  },
  expand: {
    className: scss.expand,
    Icon: null,
  },
  fold: {
    className: scss.fold,
    Icon: null,
  },
  query: {
    className: scss.query,
    Icon: null,
  },
};

// ================================================================================
export default Btn;
