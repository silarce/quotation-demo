import { useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import Image from 'next/image';

import { nanoid } from 'nanoid';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// antd
import { Collapse } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

//
import scss from './index.module.scss';
import theme from 'styles/_theme01.module.scss';

// ===========================================================================

type Tconfig = {
  label: string;
  style: React.CSSProperties;
};

// ===========================================================================

const arr = new Array(60).fill(0);

export default function Labe10() {
  // ----------------------------------------------------

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ----------------------------------------------------
  return (
    <div className="px-5">
      <div className={scss.tableContainer}>
        <div className={scss.topPanel}>
          <div>主產品設定</div>
          <MyButton_v2 px="px22" py="py4">
            設定排序
          </MyButton_v2>
        </div>
        <div className={scss.table}>
          <Thead />
          {/*  */}
          {/*  */}

          <Collapse expandIcon={() => null} ghost={true}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => {
              return (
                <Collapse.Panel
                  key={index}
                  className={classNames(scss.antdPanel, scss.plus)}
                  header={<Row isActive={index === activeIndex} onRowClick={() => setActiveIndex(index)} />}
                >
                  <p>foooooo</p>
                  <p>foooooo</p>
                  <p>foooooo</p>
                  <p>foooooo</p>
                  <p>foooooo</p>
                </Collapse.Panel>
              );
            })}
          </Collapse>
          <div className={scss.bottomBtnRow}>
            <MyButton_v2 theme="transparent" className={classNames(scss.bottomBtn, scss.plus)}>
              新增
            </MyButton_v2>
          </div>
        </div>
        {/* table close */}
      </div>
    </div>
  );
}

// ===============================================================

const Thead = () => {
  return (
    <div className={scss.thead}>
      <SidePanel_mdc />
      {arr.map((item, index) => {
        return (
          <div key={index} className={scss.cell}>
            Foo{index}
          </div>
        );
      })}

      <RightPanel />
    </div>
  );
};

const Row = ({
  //
  isActive,
  onRowClick,
}: {
  isActive?: boolean;
  onRowClick?: () => void;
}) => {
  return (
    <div className={classNames(scss.bodyRow, isActive && scss.active)} onClick={onRowClick}>
      <SidePanel_mdc />
      <RowMain />
      <RightPanel />
    </div>
  );
};

const RowMain = () => {
  return (
    <>
      {arr.map((item, index) => {
        return (
          <div key={index} className={scss.cell}>
            Foo{index}
          </div>
        );
      })}
    </>
  );
};

const RightPanel = () => {
  return (
    <div className={scss.rightPanel}>
      <div className={scss.rightCell}>attach</div>
      <div className={scss.rightCell}>attach</div>
      <div className={scss.rightCell}>attach</div>
    </div>
  );
};

const SidePanel_mdc = ({
  //
  onDeleteClick,
  onCopyClick,
}: {
  onDeleteClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onCopyClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}) => {
  return (
    <div className={scss.sidePanel}>
      <IconMove />
      <IconDelete01
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick?.(e);
        }}
      />
      <IconCopy
        onClick={(e) => {
          e.stopPropagation();
          onCopyClick?.(e);
        }}
      />
    </div>
  );
};

const IconMove = () => {
  return <Image src={iconMove} alt="iconMove" />;
};

// ===============================================================
