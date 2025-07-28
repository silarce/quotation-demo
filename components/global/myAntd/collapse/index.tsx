import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

import classNames from 'classnames';
// antd
import { Collapse as Antd_Collapse, CollapseProps } from 'antd';

import upDonwArrow from 'public/image/icon/arrow_change_tray.svg?url';
import Icon_arrowDown from 'public/image/icon/fong/arrowDown.svg';

import scss from './index.module.scss';

// ============================================================================

function Collapse({ className, ...props }: CollapseProps = {}) {
  return (
    <Antd_Collapse
      className={classNames(scss.collspse_fong, className)}
      expandIconPosition="end"
      expandIcon={({ isActive }) => {
        return <Icon_arrowDown className={classNames(scss.icon, isActive && scss.active)} />;
      }}
      {...props}
    />
  );
}

function Collapse_old(props?: CollapseProps) {
  const { ...antdProps } = props ?? {};

  return (
    <Antd_Collapse
      // expandIcon={() => null}
      {...antdProps}
      className={classNames(
        //
        scss.collapse_old,

        props?.className
      )}
    />
  );
}

// ============================================================================
// 管理狀態用的hook，選用
// 未來可以再依需求建置新的變更狀態的函數(目前只有changeActive)
const useActiveKey = ({ defaultActiveKey = [] }: { defaultActiveKey?: string[] } = {}) => {
  const [activePanelKeyArr, setActivePanelKeyArr] = useState<string[]>(defaultActiveKey);

  const changeActive = (theKey: string) => {
    if (activePanelKeyArr.includes(theKey)) {
      setActivePanelKeyArr(activePanelKeyArr.filter((key) => key !== theKey));
    } else {
      setActivePanelKeyArr([...activePanelKeyArr, theKey]);
    }
  };

  return {
    activePanelKeyArr,
    setActivePanelKeyArr,
    changeActive,
  };
};

// ============================================================================
// ICON
const UpDownArrow = (
  props: Omit<ImageProps, 'src' | 'alt'> & {
    alt?: string;
  }
) => {
  return (
    <Image
      //
      alt={props.alt || '展開'}
      {...props}
      className={classNames(props.className, scss.icon)}
      src={upDonwArrow}
    />
  );
};

export { Collapse_old, Collapse, useActiveKey, UpDownArrow };
