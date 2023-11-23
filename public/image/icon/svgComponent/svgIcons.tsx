import { SVGProps } from 'react';

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
      <path d="M3.71091 4.82351L4.5998 18H15.2665L16.1554 4.82351" stroke="currentColor" />
      <path d="M8.15571 7.64708V15.1765" stroke="currentColor" />
      <path d="M11.7109 7.64708V15.1765" stroke="currentColor" />
      <path d="M0.866638 5.2L19 5.2" stroke="currentColor" />
      <path d="M7.26665 2L12.6 2" stroke="currentColor" />
    </svg>
  );
}

function IconEdit(props: SVGProps<SVGSVGElement>) {
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
};
