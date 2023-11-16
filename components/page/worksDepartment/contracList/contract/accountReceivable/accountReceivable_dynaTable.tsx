import classNames from 'classnames';
import Image from 'next/image';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './accountReceivable_dynaTable.module.scss';

// icon
import { IconDelete01, IconRemoveCircle, IconChain } from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from 'public/image/icon/add.svg';

// ==========================================================================

type TtwoInputProps = {
  one: TinputProps;
  two: TinputProps;
};

type Trow = {
  panelCell_01?: {
    onDeleteClick: () => void;
    onChainClick: () => void;
  };
  panelCell_02?: {
    onDeleteClick: () => void;
  };
  list: {
    [key: string]: {
      label: string;
      cellStyle: React.CSSProperties;
      inputProps?: TinputProps;
      twoInputProps?: TtwoInputProps;
    };
  };
};

type Tcontrol = {
  caption: string;
  topRightBtnProps?: {
    label: string;
    onClick: () => void;
  };

  rowArr: Trow[];
  tableBottomBtnProps?: {
    label: string;
    onClick: () => void;
  };
  bottomBarProps?: {
    label: string;
    value: string;
  };
};

export type { Tcontrol as Tcontrol_dynaTable };

// ==========================================================================
export default function AccountReceivable_dynaTable({
  //
  control,
  disabled,
}: {
  control: Tcontrol;
  disabled?: boolean;
}) {
  const { caption, rowArr, tableBottomBtnProps, bottomBarProps, topRightBtnProps } = control;

  const firstRow = rowArr[0];
  const firstRowCellArr = Object.values(firstRow.list);

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>{caption}</span>
          {topRightBtnProps && <MyButton_v2 label={topRightBtnProps.label} onClick={topRightBtnProps.onClick} />}
        </div>
        {/* table */}
        <div className={scss.table}>
          <div className={classNames(scss.thead, scss.row)}>
            {firstRow.panelCell_01 && <PanelCell_01 isHidden={true} />}
            {firstRow.panelCell_02 && <PanelCell_02 isHidden={true} />}
            {firstRowCellArr.map((cell, index) => {
              const { label, cellStyle } = cell;

              return (
                <div key={index} style={cellStyle}>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          {/* tbody */}
          <div className={scss.tbody}>
            {/* <div className={scss.row}></div> */}

            {rowArr.map((row, index) => {
              const { panelCell_01, panelCell_02, list } = row;

              const arr = Object.values(list);

              return (
                <CellWithBar key={index} className={classNames(scss.row)}>
                  {panelCell_01 && (
                    <PanelCell_01 onDeleteClick={panelCell_01.onDeleteClick} onChainClick={panelCell_01.onChainClick} />
                  )}
                  {panelCell_02 && <PanelCell_02 onDeleteClick={panelCell_02.onDeleteClick} />}
                  {arr.map((cell, index) => {
                    const { cellStyle, inputProps, twoInputProps } = cell;

                    if (twoInputProps) {
                      const { one, two } = twoInputProps;

                      return (
                        <div key={index} style={cellStyle} className={scss.twoInputSel}>
                          <InputSel disabled={disabled} showBaseline="auto" inputProps={one} />
                          <InputSel disabled={disabled} showBaseline="auto" inputProps={two} />
                        </div>
                      );
                    }

                    return (
                      <div key={index} style={cellStyle}>
                        <InputSel disabled={disabled} showBaseline="auto" inputProps={inputProps} />
                      </div>
                    );
                  })}
                </CellWithBar>
              );
            })}
          </div>
        </div>
        {/*  */}
        {tableBottomBtnProps && (
          <div className={classNames(scss.tableBottomBtn, scss.row)} onClick={tableBottomBtnProps.onClick}>
            <div>
              <Image src={iconAdd} alt="" />
            </div>
            <div>
              <span>{tableBottomBtnProps.label}</span>
            </div>
          </div>
        )}
        {/*  */}
        {bottomBarProps && (
          <div className={classNames(scss.bottomBar)}>
            <div>
              <span>{bottomBarProps.label}</span>
            </div>
            <div>
              <span>{bottomBarProps.value}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================================

const PanelCell_01 = ({
  isHidden,
  onDeleteClick,
  onChainClick,
}: {
  isHidden?: boolean;
  onDeleteClick?: () => void;
  onChainClick?: () => void;
}) => {
  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div>
        <IconChain onClick={onChainClick} />
      </div>
      <div>
        <IconDelete01 onClick={onDeleteClick} />
      </div>
    </div>
  );
};

const PanelCell_02 = ({ isHidden, onDeleteClick }: { isHidden?: boolean; onDeleteClick?: () => void }) => {
  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div>
        <IconRemoveCircle className={scss.iconRemoveCircle} onClick={onDeleteClick} />
      </div>
    </div>
  );
};

// ==========================================================================
