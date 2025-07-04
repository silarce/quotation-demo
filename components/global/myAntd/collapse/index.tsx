import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

import classNames from 'classnames';
// antd
import { Collapse as Antd_Collapse, CollapseProps, CollapsePanelProps } from 'antd';

import upDonwArrow from 'public/image/icon/arrow_change_tray.svg';

import scss from './index.module.scss';

const { Panel: Antd_Panel } = Antd_Collapse;

// ============================================================================
function Collapse(
  props?: CollapseProps & {
    // 將top left right的border拿掉
    noTlrBorder?: boolean;
  }
) {
  const { noTlrBorder, ...antdProps } = props ?? {};

  return (
    <Antd_Collapse
      // expandIcon={() => null}
      {...antdProps}
      className={classNames(
        //
        scss.collapse,
        noTlrBorder && scss.noTlrBorder,
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

export { Collapse, useActiveKey, UpDownArrow };
