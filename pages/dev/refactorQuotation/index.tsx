import { useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import Image from 'next/image';

import { nanoid } from 'nanoid';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

//
import scss from './index.module.scss';
import theme from 'styles/_theme01.module.scss';

// ===========================================================================

type TconfigItem = {
  label: string;
  style: React.CSSProperties;
};

type Tconfig = {
  [key: string]: TconfigItem;
};

type Tcell = {
  key?: string; // 作為key，沒有給key的話會以index代替key
  label?: React.ReactNode;
  style: React.CSSProperties;
  inputSelProps?: TinputSelProps;
  children?: React.ReactNode;
};

type Tthead = {
  // sidePanel會被隱藏(visibility: hidden)，
  // 在thead裡放sidePanel的主要作用是使thead左側的留白可以與row同width，使其對齊
  // 所以thead的sidePanel原則上要與row.sidePanel用一樣的元件(或其他width相同的元件)
  leftPanel?: React.ReactNode;
  mainPanelCellArr: Omit<Tcell, 'inputSelProps'>[];
  rightPanelCellArr?: Tcell[];
};

type Trow = {
  id?: string; // 作為key，沒有給id的話會以index代替key
  leftPanel?: React.ReactNode;
  mainPanelCellArr: Omit<Tcell, 'label'>[];
  rightPanelCellArr?: Tcell[];
  onRowClick?: () => void;
  checker_isActive?: (props: { id?: string; index: number }) => boolean;
};

// ===========================================================================

const config: Tconfig = {
  itemName: {
    label: '項目',
    style: { width: '60px' },
  },
  productType: {
    label: '報價別',
    style: { width: '100px' },
  },
  //
  attachAdd: {
    label: '追加',
    style: { width: '60px' },
  },
  attachMinu: {
    label: '追減',
    style: { width: '60px' },
  },
  attachDiff: {
    label: '差額',
    style: { width: '60px' },
  },
};

const config_inputSel: TinputSelProps = {
  fontSize: '16',
};

// ===========================================================================

export default function Labe10() {
  // ----------------------------------------------------

  // 改作activeTrigger
  const [activeId, setActiveId] = useState<string | null>();

  // ----------------------------------------------------

  const { thead, rowArr } = useMemo(() => {
    //

    const thead: Tthead = {
      leftPanel: <LeftPanel_mdc />,
      mainPanelCellArr: [
        {
          label: config.itemName.label,
          style: config.itemName.style,
        },
        {
          label: config.productType.label,
          style: config.productType.style,
        },
      ],
      rightPanelCellArr: [
        {
          label: config.attachAdd.label,
          style: config.attachAdd.style,
        },
        {
          label: config.attachMinu.label,
          style: config.attachMinu.style,
        },
        {
          label: config.attachDiff.label,
          style: config.attachDiff.style,
        },
      ],
    };

    const rowArr: Trow[] = [
      {
        id: '001',
        onRowClick: () => {
          setActiveId('001');
        },
        checker_isActive: ({ id }) => {
          if (id === activeId) {
            return true;
          }

          return false;
        },
        leftPanel: <LeftPanel_mdc />,
        mainPanelCellArr: [
          {
            // 項目
            style: config.itemName.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 報價別
            style: config.productType.style,
            inputSelProps: {
              selectProps: {
                props: {
                  isSearchable: true,
                  options: [
                    { value: '001', label: '001' },
                    { value: '002', label: '002' },
                    { value: '003', label: '003' },
                    { value: '004', label: '004' },
                    { value: '005', label: '005' },
                  ],
                  onChange: (option) => {
                    console.log(option);
                  },
                },
              },
            },
          },
        ], // mainPanelCellArr
        rightPanelCellArr: [
          {
            // 追加
            style: config.attachAdd.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 追減
            style: config.attachMinu.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 差額
            style: config.attachDiff.style,
            children: '999',
          },
        ],
      },
      {
        id: '002',
        onRowClick: () => {
          setActiveId('002');
        },
        checker_isActive: ({ id }) => {
          if (id === activeId) {
            return true;
          }

          return false;
        },
        leftPanel: <LeftPanel_mdc />,
        mainPanelCellArr: [
          {
            // 項目
            style: config.itemName.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 報價別
            style: config.productType.style,
            inputSelProps: {
              selectProps: {
                props: {
                  isSearchable: true,
                  options: [
                    { value: '001', label: '001' },
                    { value: '002', label: '002' },
                    { value: '003', label: '003' },
                    { value: '004', label: '004' },
                    { value: '005', label: '005' },
                  ],
                  onChange: (option) => {
                    console.log(option);
                  },
                },
              },
            },
          },
        ], // mainPanelCellArr
        rightPanelCellArr: [
          {
            // 追加
            style: config.attachAdd.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 追減
            style: config.attachMinu.style,
            inputSelProps: {
              inputProps: {},
            },
          },
          {
            // 差額
            style: config.attachDiff.style,
            children: '999',
          },
        ],
      },
    ];

    // rowArr.push(rowArr[0]);

    return { thead, rowArr };
  }, []);

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
        <Table
          thead={thead}
          rowArr={rowArr}
          // bottomBtn={{
          //   label: '新增',
          //   onClick: prompt,
          // }}
        />
        {/* table close */}
      </div>
    </div>
  );
}

// ===============================================================

const Table = ({
  //
  thead,
  rowArr,
  bottomBtn,
}: {
  thead: Tthead;
  rowArr: Trow[];
  bottomBtn?: {
    label: string;
    onClick?: () => void;
  };
}) => {
  return (
    <div className={scss.table}>
      <Thead thead={thead} />
      {/*  */}

      {rowArr.map((row, index) => {
        const { id } = row;

        return <Row {...row} key={id ?? index} index={index} />;
      })}

      {bottomBtn && (
        <div className={scss.bottomBtnRow}>
          <MyButton_v2
            theme="transparent"
            className={classNames(scss.bottomBtn, scss.plus)}
            onClick={bottomBtn.onClick}
          >
            {bottomBtn.label}
          </MyButton_v2>
        </div>
      )}
    </div>
  );
};

// ===============================================================

const Thead = ({ thead }: { thead: Tthead }) => {
  const { leftPanel, mainPanelCellArr, rightPanelCellArr } = thead;

  return (
    <div className={scss.thead}>
      {leftPanel}
      <div className={scss.mainPanel}>
        {mainPanelCellArr.map((cell, index) => {
          const { key, label, style, children } = cell;

          return (
            <div key={key || index} className={scss.cell} style={style}>
              {label && <span className={scss.label}>{label}</span>}
              {children}
            </div>
          );
        })}
      </div>

      {rightPanelCellArr && <RightPanel rightPanelCellArr={rightPanelCellArr} />}
    </div>
  );
};

const Row = ({
  //
  id,
  index,
  leftPanel,
  mainPanelCellArr,
  rightPanelCellArr,
  onRowClick,
  checker_isActive,
}: Trow & {
  index: number;
}) => {
  const isActive = checker_isActive?.({ id, index });

  console.log('id', id);
  console.log('isActive', isActive);

  return (
    <div className={classNames(scss.bodyRow, isActive && scss.active)} onClick={onRowClick}>
      {leftPanel}

      <div className={scss.mainPanel}>
        {mainPanelCellArr.map((cell, index) => {
          const { key, style, inputSelProps, children } = cell;

          return (
            <div key={key || index} style={style}>
              {inputSelProps && <InputSel {...config_inputSel} {...inputSelProps} />}
              {children}
            </div>
          );
        })}
      </div>
      {rightPanelCellArr && <RightPanel rightPanelCellArr={rightPanelCellArr} />}
    </div>
  );
};

const RightPanel = ({ rightPanelCellArr }: { rightPanelCellArr: Tcell[] }) => {
  return (
    <div className={scss.rightPanel}>
      {rightPanelCellArr.map((cell, index) => {
        const { key, label, style, inputSelProps, children } = cell;

        return (
          <div key={key || index} className={scss.cell} style={style}>
            {label && <span className={scss.label}>{label}</span>}
            {inputSelProps && <InputSel {...config_inputSel} {...inputSelProps} />}
            {children}
          </div>
        );
      })}
    </div>
  );
};

const LeftPanel_mdc = ({
  //
  onDeleteClick,
  onCopyClick,
}: {
  onDeleteClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onCopyClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}) => {
  return (
    <div className={scss.leftPanel}>
      <Image src={iconMove} alt="iconMove" />
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

const LeftPanel_m = () => {
  return (
    <div className={scss.leftPanel}>
      <Image src={iconMove} alt="iconMove" />
    </div>
  );
};

// ===============================================================
// const IconMove = () => {
//   return <Image src={iconMove} alt="iconMove" />;
// };
