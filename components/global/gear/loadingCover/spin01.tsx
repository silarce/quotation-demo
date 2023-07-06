// 不好用
// 暫時先放著

import { css } from '@emotion/react';
import { ClassNames } from '@emotion/react';

import React from 'react';
import { Spin } from 'antd';

const theClassName = css`
  .ant-spin-nested-loading {
    /* min-height:500px */
  }
  /* 包裹著children的容器 */
  .ant-spin-blur {
    /* opacity: 0; */
  }
  /* 後景，不會蓋掉icon */
  .ant-spin-container::after {
    /* opacity: 1; */
    background: #000;
    height: 100%;
  }
`;

export default function Spin01({
  children,
  spinning,
  className = '',
}: {
  children: React.ReactNode;
  spinning: boolean;
  className?: string;
}) {
  // className = `${className} ${css(theClassName)}`

  return (
    // <Spin spinning={true}
    // >
    //   {children}
    // </Spin>

    <ClassNames>
      {({ css, cx }) => (
        <Spin spinning={true} wrapperClassName={`${className} ${css(theClassName)}`}>
          {children}
        </Spin>
      )}
    </ClassNames>
  );
}
