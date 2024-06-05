import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// gear
import TopBar from './ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './accountantSorting.module.scss';

// ================================================================================
// region START
export default function AccountantSorting({ className }: { className?: string }) {
  // -----------------------------------------------------------------------------
  // region RENDER

  return (
    <div className={classNames(scss.accountantSorting, className)}>
      <TopBar caption="應收帳款管理">
        <MyButton_v2 px="px22" py="py4">
          新增折讓
        </MyButton_v2>
      </TopBar>
      <div className={scss.table}>
        <Group className={classNames(scss.top)}>
          <Left className={scss.left}>發票開立資訊</Left>
          <Right className={scss.right}>已收款項明細</Right>
        </Group>
        {/*  */}
        <Group className={scss['thead']}>
          <Left className={scss.left}>
            <span>發票號碼</span>
            <span>開立日期</span>
            <span>開立金額</span>
          </Left>
          <Right className={scss.right}>
            <span>收款日期</span>
            <span>帳號/號碼</span>
            <span>到期日</span>
            <span>收款金額</span>
          </Right>
        </Group>
        {/*  */}
        <Group className={scss['foo']}></Group>
        <Group className={scss['foo']}></Group>
        <Group className={scss['foo']}></Group>
        <Group className={scss['foo']}></Group>
      </div>
    </div>
  );
}

// region END

// ================================================================================

// region COMPONENT

const Group = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.group, className)}>{children}</div>;
};

const Left = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.left, className)}>{children}</div>;
};

const Right = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.right, className)}>{children}</div>;
};

const Row = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};
