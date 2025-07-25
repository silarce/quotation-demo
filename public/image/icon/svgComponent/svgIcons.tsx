import { SVGProps } from 'react';
import classNames from 'classnames';

import style from './svgIcons.module.scss';

// 將porps中的className取出，然後與本地css的className組合
const getClassName = (props: SVGProps<SVGSVGElement>) => {
  let { className, cursor } = props;

  if (!className) {
    className = '';
  }

  // 如果有送auto特性進來，就設cursorAuto className
  cursor = cursor === 'auto' ? style.cursorAuto : '';

  return (className = `${style.svg} ${cursor} ${className}`);
};

function IconDelete01(props: SVGProps<SVGSVGElement>) {
  const defaultClassName = getClassName(props);
  const { className, ...rest } = props;

  return (
    <svg
      className={classNames(defaultClassName, className)}
      {...rest}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.71091 4.82351L4.5998 18H15.2665L16.1554 4.82351" stroke="currentColor" />
      <path d="M8.15571 7.64708V15.1765" stroke="currentColor" />
      <path d="M11.7109 7.64708V15.1765" stroke="currentColor" />
      <path d="M0.866638 5.2L19 5.2" stroke="currentColor" />
      <path d="M7.26665 2L12.6 2" stroke="currentColor" />
    </svg>
  );
}

function IconEdit(props: SVGProps<SVGSVGElement> & { isActive?: boolean }) {
  const defaultClassName = getClassName(props);
  const { className, isActive, ...rest } = props;

  return (
    <svg
      className={classNames(defaultClassName, isActive && style.active, className)}
      {...rest}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.125 12.0955V14.7518H5.78125L13.6154 6.9176L10.9592 4.26135L3.125 12.0955ZM15.6696 4.86344C15.9458 4.58719 15.9458 4.14094 15.6696 3.86469L14.0121 2.20719C13.7358 1.93094 13.2896 1.93094 13.0133 2.20719L11.7171 3.50344L14.3733 6.15969L15.6696 4.86344Z"
        fill="currentColor"
      />
      <path d="M3 17.377H17" stroke="currentColor" />
    </svg>
  );
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.13636 14.2727C11.5254 14.2727 14.2727 11.5254 14.2727 8.13636C14.2727 4.74734 11.5254 2 8.13636 2C4.74734 2 2 4.74734 2 8.13636C2 11.5254 4.74734 14.2727 8.13636 14.2727Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.6364 12.6365L18.3636 18.3637" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCopy(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3.5" y="2.5" width="10" height="13" stroke="currentColor" />
      <path d="M13.5 8H17V19H9V15.6" stroke="currentColor" />
    </svg>
  );
}

function IconDetail(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6.5" y="4.5" width="7" height="4" stroke="currentColor" />
      <line x1="6" y1="14.5" x2="11" y2="14.5" stroke="currentColor" />
      <line x1="6" y1="11.5" x2="11" y2="11.5" stroke="currentColor" />
      <rect x="3.5" y="1.5" width="13" height="17" stroke="currentColor" />
    </svg>
  );
}

function IconAddCircle(props: SVGProps<SVGSVGElement>) {
  let className = getClassName(props);
  className = `${className} ${style.circle}`;

  return (
    <svg
      {...{ ...props, className }}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 18C35 8.61116 27.3888 1 18 1C8.61116 1 1 8.61116 1 18C1 27.3888 8.61116 35 18 35C27.3888 35 35 27.3888 35 18Z"
        strokeMiterlimit="10"
      />
      <path d="M7.99023 17.7872H27.9625M17.9764 8V28" strokeWidth="2" />
    </svg>
  );
}

function IconRemoveCircle(props: SVGProps<SVGSVGElement>) {
  let className = getClassName(props);
  className = `${className} ${style.circle}`;

  return (
    <svg
      {...{ ...props, className }}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 18C35 8.61116 27.3888 1 18 1C8.61116 1 1 8.61116 1 18C1 27.3888 8.61116 35 18 35C27.3888 35 35 27.3888 35 18Z"
        strokeMiterlimit="10"
      />
      <line x1="7.99023" y1="18" x2="27.9625" y2="18" strokeWidth="2" />
    </svg>
  );
}

function IconRemove02(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style type="text/css"></style>
      <path
        d="M17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9Z"
        strokeMiterlimit="10"
        stroke="#EA1833"
      />
      <path d="M5.59514 12.2521L12.241 5.60625M5.66132 5.67243L12.3164 12.3276" strokeWidth="2" stroke="#EA1833" />
    </svg>
  );
}

export const IconCheck01 = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.26573 3.49228L4.99141 7.74896L10.9771 0.630567" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

export const IconCheck02 = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 10.1579L8.04 17L17 4" stroke="#EA1833" strokeWidth="1.5" />
    </svg>
  );
};

// 叉叉 X
export const IconCross01 = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        y1="-0.5"
        x2="11.443"
        y2="-0.5"
        transform="matrix(-0.699118 0.715007 -0.699118 -0.715007 8 0)"
        stroke="currentColor"
      />
      <line
        y1="-0.5"
        x2="11.443"
        y2="-0.5"
        transform="matrix(0.699118 0.715007 -0.699118 0.715007 0 0.818184)"
        stroke="currentColor"
      />
    </svg>
  );
};

function IconChain(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="7"
      viewBox="0 0 20 7"
      fill="none"
    >
      <path
        d="M9 2V2C9 1.17157 8.32843 0.5 7.5 0.5H3C1.89543 0.5 1 1.39543 1 2.5V4.5C1 5.60457 1.89543 6.5 3 6.5H7.5C8.32843 6.5 9 5.82843 9 5V5"
        stroke="#14256A"
        strokeLinecap="round"
      />
      <path
        d="M11 2V2C11 1.17157 11.6716 0.5 12.5 0.5H17C18.1046 0.5 19 1.39543 19 2.5V4.5C19 5.60457 18.1046 6.5 17 6.5H12.5C11.6716 6.5 11 5.82843 11 5V5"
        stroke="#14256A"
        strokeLinecap="round"
      />
      <path d="M6 3.5H14" stroke="#14256A" strokeLinecap="round" />
    </svg>
  );
}

function IconBreakChain(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
    >
      <path
        d="M9 7V7C9 6.17157 8.32843 5.5 7.5 5.5H3C1.89543 5.5 1 6.39543 1 7.5V9.5C1 10.6046 1.89543 11.5 3 11.5H7.5C8.32843 11.5 9 10.8284 9 10V10"
        stroke="#14256A"
        strokeLinecap="round"
      />
      <path d="M6 8.5H9" stroke="#14256A" strokeLinecap="round" />
      <path
        d="M11.8564 7.86637V7.86637C12.1981 7.11173 13.0869 6.77702 13.8416 7.11878L17.9408 8.97521C18.947 9.43089 19.3933 10.616 18.9376 11.6222L18.1125 13.444C17.6569 14.4502 16.4718 14.8965 15.4656 14.4408L11.3663 12.5844C10.6117 12.2427 10.277 11.3538 10.6187 10.5992V10.5992"
        stroke="#14256A"
        strokeLinecap="round"
      />
      <path d="M11.2383 9.23279L13.9711 10.4704" stroke="#14256A" strokeLinecap="round" />
      <path d="M12.073 3.47432L12.5947 1.54358" stroke="#14256A" strokeLinecap="round" />
      <path d="M8.81758 3.43537L8.47266 1.46533" stroke="#14256A" strokeLinecap="round" />
      <path d="M14.7576 5.04058L16.0479 3.51245" stroke="#14256A" strokeLinecap="round" />
    </svg>
  );
}

function IconTearing(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
    >
      <path d="M1 13V0.5H9.5L6.5 4.5L9 7L6.5 9.5L8 13H1Z" stroke="#14256A" />
      <path d="M10 4.5L13 0.5H17V13H11L9.5 10L12.5 7L10 4.5Z" stroke="#14256A" />
    </svg>
  );
}

function IconAdd(props: SVGProps<SVGSVGElement>) {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="2" y1="9.57692" x2="17" y2="9.57692" stroke="#14256A" />
      <line x1="9.42308" y1="2" x2="9.42308" y2="17" stroke="#14256A" />
    </svg>
  );
}

const Icon_info = (props: SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      className={classNames(className, 'text-main')}
      color="currentColor"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="9" r="8.5" stroke="currentColor" />
      <path d="M9.83333 10.5H8.16667L7.75 7.26923V3.5H10.25V7.26923L9.83333 10.5Z" fill="currentColor" />
      <circle cx="9" cy="13.25" r="1.25" fill="currentColor" />
    </svg>
  );
};

const IconAddRole = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="16"
      height="16"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.25 9C4.25 9.19891 4.32902 9.38968 4.46967 9.53033C4.61032 9.67098 4.80109 9.75 5 9.75C5.19891 9.75 5.38968 9.67098 5.53033 9.53033C5.67098 9.38968 5.75 9.19891 5.75 9V5.75H9C9.19891 5.75 9.38968 5.67098 9.53033 5.53033C9.67098 5.38968 9.75 5.19891 9.75 5C9.75 4.80109 9.67098 4.61032 9.53033 4.46967C9.38968 4.32902 9.19891 4.25 9 4.25H5.75V1C5.75 0.801088 5.67098 0.610322 5.53033 0.46967C5.38968 0.329018 5.19891 0.25 5 0.25C4.80109 0.25 4.61032 0.329018 4.46967 0.46967C4.32902 0.610322 4.25 0.801088 4.25 1V4.25H1C0.801088 4.25 0.610322 4.32902 0.46967 4.46967C0.329018 4.61032 0.25 4.80109 0.25 5C0.25 5.19891 0.329018 5.38968 0.46967 5.53033C0.610322 5.67098 0.801088 5.75 1 5.75H4.25V9Z"
        fill="currentColor"
      />
    </svg>
  );
};

const IconTrash = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.66602 4.66667H13.3327M6.66602 7.33333V11.3333M9.33268 7.33333V11.3333M3.33268 4.66667L3.99935 12.6667C3.99935 13.0203 4.13982 13.3594 4.38987 13.6095C4.63992 13.8595 4.97906 14 5.33268 14H10.666C11.0196 14 11.3588 13.8595 11.6088 13.6095C11.8589 13.3594 11.9993 13.0203 11.9993 12.6667L12.666 4.66667M5.99935 4.66667V2.66667C5.99935 2.48986 6.06959 2.32029 6.19461 2.19526C6.31964 2.07024 6.4892 2 6.66602 2H9.33268C9.50949 2 9.67906 2.07024 9.80409 2.19526C9.92911 2.32029 9.99935 2.48986 9.99935 2.66667V4.66667"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const IconSave = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 4.11111V13.4444C15 13.8722 14.8478 14.2386 14.5434 14.5434C14.2391 14.8483 13.8727 15.0005 13.4444 15H2.55556C2.12778 15 1.7617 14.8478 1.45733 14.5434C1.15296 14.2391 1.00052 13.8727 1 13.4444V2.55556C1 2.12778 1.15244 1.7617 1.45733 1.45733C1.76222 1.15296 2.1283 1.00052 2.55556 1H11.8889L15 4.11111ZM13.4444 4.77222L11.2278 2.55556H2.55556V13.4444H13.4444V4.77222ZM8 12.6667C8.64815 12.6667 9.19907 12.4398 9.65278 11.9861C10.1065 11.5324 10.3333 10.9815 10.3333 10.3333C10.3333 9.68518 10.1065 9.13426 9.65278 8.68055C9.19907 8.22685 8.64815 8 8 8C7.35185 8 6.80093 8.22685 6.34722 8.68055C5.89352 9.13426 5.66667 9.68518 5.66667 10.3333C5.66667 10.9815 5.89352 11.5324 6.34722 11.9861C6.80093 12.4398 7.35185 12.6667 8 12.6667ZM3.33333 6.44444H10.3333V3.33333H3.33333V6.44444ZM2.55556 4.77222V13.4444V2.55556V4.77222Z"
        fill="currentColor"
      />
    </svg>
  );
};

const IconButtonNote = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width={props.width ?? 18}
      height={props.height ?? 18}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_763_2443)">
        <path
          d="M12.4902 15.0046H0.990234V2.50462H8.01523L9.02623 1.53062L9.00023 1.50462H0.990234C0.437984 1.50462 -0.00976562 1.95237 -0.00976562 2.50462V15.0046C-0.00976562 15.5569 0.437984 16.0046 0.990234 16.0046H12.4902C13.0425 16.0046 13.4902 15.5569 13.4902 15.0046V7.68187L12.4902 8.63636V15.0046ZM15.2227 0.647615C14.7715 0.215115 14.2735 -0.00415039 13.7423 -0.00415039C12.9108 -0.00415039 12.3042 0.53285 12.1392 0.697365C11.9052 0.928365 5.27725 7.54663 5.27725 7.54663C5.22525 7.59962 5.18725 7.66437 5.16775 7.73637C4.98825 8.39962 4.0885 11.3456 4.0795 11.3749C4.033 11.5259 4.0745 11.6904 4.18575 11.8001C4.22449 11.839 4.27055 11.8699 4.32127 11.8909C4.37199 11.9119 4.42636 11.9227 4.48127 11.9226C4.52427 11.9226 4.56752 11.9164 4.61 11.9031C4.6405 11.8929 7.68025 10.9099 8.1805 10.7606C8.2465 10.7411 8.30625 10.7054 8.35575 10.6571C8.6715 10.3456 14.7638 4.34788 15.2568 3.83863C15.7665 3.31263 16.02 2.76587 16.0102 2.21212C16.001 1.66512 15.735 1.13862 15.2227 0.647615ZM14.5385 3.1426C14.2603 3.4296 12.0815 5.5826 8.06273 9.5416L7.75523 9.84485C7.29448 9.98735 6.19122 10.3418 5.35722 10.6108C5.62572 9.7241 5.94797 8.65285 6.09172 8.14612C6.95048 7.28862 12.629 1.61887 12.8447 1.40587C12.8867 1.36385 13.27 0.9956 13.7422 0.9956C14.0102 0.9956 14.2685 1.11785 14.5307 1.36935C14.8442 1.6701 15.0057 1.9591 15.0102 2.2291C15.0152 2.5071 14.8565 2.81435 14.5385 3.1426Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_763_2443">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const IconLink = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width={props.width ?? 18}
      height={props.height ?? 18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.43691 10.6C6.23219 9.39041 6.34099 7.31997 7.67929 5.97675L11.5574 2.08389C12.8957 0.739863 14.9572 0.631061 16.1627 1.83988C17.3682 3.0487 17.2586 5.11994 15.9203 6.46396L13.9812 8.41039M10.5631 7.39997C11.7678 8.60959 11.659 10.68 10.3207 12.0232L6.44258 15.9161C5.10427 17.2601 3.04282 17.3689 1.8373 16.1601C0.631788 14.9513 0.741381 12.8801 2.07969 11.536L4.01875 9.58961"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const IconReturnBlue = (props: SVGProps<SVGSVGElement>) => {
  const className = getClassName(props);

  return (
    <svg
      {...{ ...props, className }}
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 0.689822V5.61465C13 5.77792 12.9352 5.9345 12.8198 6.04995C12.7044 6.1654 12.5478 6.23025 12.3846 6.23025H2.10196L4.74342 8.87273C4.85889 8.98825 4.92376 9.14491 4.92376 9.30827C4.92376 9.47163 4.85889 9.6283 4.74342 9.74381C4.62795 9.85932 4.47134 9.92422 4.30805 9.92422C4.14475 9.92422 3.98814 9.85932 3.87267 9.74381L0.180478 6.05019C0.123263 5.99302 0.0778743 5.92513 0.0469065 5.85039C0.0159386 5.77566 0 5.69555 0 5.61465C0 5.53375 0.0159386 5.45364 0.0469065 5.37891C0.0778743 5.30418 0.123263 5.23628 0.180478 5.17911L3.87267 1.48549C3.92985 1.42829 3.99772 1.38292 4.07242 1.35197C4.14713 1.32102 4.22719 1.30508 4.30805 1.30508C4.3889 1.30508 4.46897 1.32102 4.54367 1.35197C4.61837 1.38292 4.68624 1.42829 4.74342 1.48549C4.80059 1.54269 4.84594 1.61059 4.87689 1.68532C4.90783 1.76005 4.92376 1.84014 4.92376 1.92103C4.92376 2.00192 4.90783 2.08201 4.87689 2.15674C4.84594 2.23147 4.80059 2.29937 4.74342 2.35657L2.10196 4.99905H11.7693V0.689822C11.7693 0.526554 11.8341 0.369972 11.9495 0.254524C12.0649 0.139076 12.2214 0.0742188 12.3846 0.0742188C12.5478 0.0742188 12.7044 0.139076 12.8198 0.254524C12.9352 0.369972 13 0.526554 13 0.689822Z"
        fill="currentColor"
      />
    </svg>
  );
};

export {
  IconDelete01, //垃圾桶icon
  IconEdit,
  IconSearch,
  IconCopy,
  IconDetail,
  IconAddCircle,
  IconRemoveCircle,
  IconRemove02,
  IconChain,
  IconBreakChain,
  IconTearing,
  IconAdd,
  Icon_info,
  IconAddRole,
  IconTrash,
  IconSave,
  IconButtonNote,
  IconLink,
  IconReturnBlue,
};
