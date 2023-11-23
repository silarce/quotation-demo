import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Collapse } from 'antd';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel, { TinputProps, TdatePickerProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// css
import scss from './accountReceivable_dynaTable.module.scss';

// icon
import {
  //
  IconDelete01,
  IconRemoveCircle,
  IconChain,
  IconBreakChain,
  IconEdit,
  IconTearing,
} from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from 'public/image/icon/add.svg';

// ==========================================================================

type TpanelCell0_01 = {
  onDeleteClick?: () => void;
  onChainClick?: () => void;
};
type TpanelCell0_02 = {
  onDeleteClick?: () => void;
};
type TpanelCell0_03 = {
  onChainBreakClick?: () => void;
  onEditClick?: () => void;
  onAbandonClick?: () => void;
};
type TpanelCell0_04 = {
  onChainBreakClick?: () => void;
};
type TpanelCell0_05 = {
  onChainClick?: () => void;
  onRemoveClick?: () => void;
};
type TpanelCell0_06 = {
  onBreakChainClick?: () => void;
  onRemoveClick?: () => void;
};
type TpanelCell0_07 = {
  onBreakChainClick?: () => void;
};

type TtwoInputProps = {
  one: TinputProps;
  two: TinputProps;
};

type Trow = {
  panelCell_01?: TpanelCell0_01;
  panelCell_02?: TpanelCell0_02;
  panelCell_03?: TpanelCell0_03;
  panelCell_04?: TpanelCell0_04;
  panelCell_05?: TpanelCell0_05;
  panelCell_06?: TpanelCell0_06;
  panelCell_07?: TpanelCell0_07;
  list: {
    [key: string]: {
      label: string;
      cellStyle: React.CSSProperties;
      inputProps?: TinputProps;
      twoInputProps?: TtwoInputProps;
      datePickerProps?: TdatePickerProps;
    };
  };
  subTable?: {
    subHeadRow: TheadRow;
    subRowArr: Trow[];
  };
};

type TheadRow = {
  panelCell_01?: TpanelCell0_01;
  panelCell_02?: TpanelCell0_02;
  panelCell_03?: TpanelCell0_03;
  panelCell_04?: TpanelCell0_04;
  panelCell_05?: TpanelCell0_05;
  panelCell_06?: TpanelCell0_06;
  panelCell_07?: TpanelCell0_07;
  list: {
    [key: string]: {
      label: string;
      cellStyle: React.CSSProperties;
    };
  };
};

type Tcontrol = {
  caption: string;
  headRow: TheadRow;
  rowArr: Trow[];

  topRightBtnProps?: {
    label: string;
    onClick: () => void;
  };

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
const { Panel } = Collapse;

// ==========================================================================
export default function AccountReceivable_dynaTable({
  //
  control,
  disabled,
}: {
  control: Tcontrol;
  disabled?: boolean;
}) {
  const {
    //
    caption,
    headRow,
    rowArr,
    tableBottomBtnProps,
    bottomBarProps,
    topRightBtnProps,
  } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>{caption}</span>
          {topRightBtnProps && <MyButton_v2 label={topRightBtnProps.label} onClick={topRightBtnProps.onClick} />}
        </div>
        {/* table */}

        <div className={scss.table}>
          <Thead headRow={headRow} headRowCellArr={Object.values(headRow.list)} />

          {/* tbody */}
          <div className={scss.tbody}>
            <Collapse
              //
              onChange={() => {}}
              expandIcon={() => <></>}
            >
              {rowArr.map((row, index) => {
                const { subHeadRow, subRowArr } = row.subTable ?? {};

                return (
                  <Panel
                    //
                    key={index}
                    header={<Row row={row} disabled={disabled} />}
                  >
                    {subHeadRow && subRowArr && (
                      <div className={classNames(scss.table, scss.sub)}>
                        <Thead headRow={subHeadRow} headRowCellArr={Object.values(subHeadRow.list)} />

                        <div className={scss.tbody}>
                          {subRowArr.map((row, index) => {
                            return <Row key={index} row={row} disabled={disabled} />;
                          })}
                        </div>
                      </div>
                    )}
                  </Panel>
                );
              })}
            </Collapse>
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

const PanelCell_03 = ({
  //
  isHidden,
  control,
}: {
  isHidden?: boolean;
  control?: {
    onChainBreakClick?: () => void;
    onEditClick?: () => void;
    onAbandonClick?: () => void;
  };
}) => {
  const { onChainBreakClick, onEditClick, onAbandonClick } = control ?? {};

  return (
    <div className={classNames(scss.panelCell)}>
      <div>
        <IconBreakChain onClick={onChainBreakClick} className={classNames(isHidden && scss.hidden)} />
      </div>
      <div>
        <IconEdit onClick={onEditClick} className={classNames(isHidden && scss.hidden)} />
      </div>
      <div className={classNames(scss.abandon)}>
        {isHidden && <span>作廢</span>}
        {!isHidden && <IconTearing onClick={onAbandonClick} className={classNames(scss.iconRemoveCircle)} />}
      </div>
    </div>
  );
};

const PanelCell_04 = ({
  //
  isHidden,
  control,
}: {
  isHidden?: boolean;
  control?: {
    onChainBreakClick?: () => void;
  };
}) => {
  const { onChainBreakClick } = control ?? {};

  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div>
        <IconBreakChain className={classNames(scss.hidden)} />
      </div>
      <div>
        <IconEdit className={classNames(scss.hidden)} />
      </div>
      <div className={classNames(scss.abandon)}>
        <IconBreakChain onClick={onChainBreakClick} className={classNames(scss.iconRemoveCircle)} />
      </div>
    </div>
  );
};

const PanelCell_05 = ({
  //
  isHidden,
  control,
}: {
  isHidden?: boolean;
  control?: TpanelCell0_05;
}) => {
  const { onRemoveClick, onChainClick } = control ?? {};

  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div>
        <IconChain onClick={onChainClick} />
      </div>
      <div>
        <IconRemoveCircle className={scss.iconRemoveCircle} onClick={onRemoveClick} />
      </div>
    </div>
  );
};

const PanelCell_06 = ({
  //
  isHidden,
  control,
}: {
  isHidden?: boolean;
  control?: TpanelCell0_06;
}) => {
  const { onRemoveClick, onBreakChainClick } = control ?? {};

  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div>
        <IconBreakChain onClick={onBreakChainClick} />
      </div>
      <div>
        <IconRemoveCircle className={scss.iconRemoveCircle} onClick={onRemoveClick} />
      </div>
    </div>
  );
};

const PanelCell_07 = ({
  //
  isHidden,
  control,
}: {
  isHidden?: boolean;
  control?: TpanelCell0_07;
}) => {
  const { onBreakChainClick } = control ?? {};

  return (
    <div className={classNames(scss.panelCell, isHidden && scss.hidden)}>
      <div className={scss.hidden}>
        <IconBreakChain />
      </div>
      <div>
        <IconBreakChain onClick={onBreakChainClick} />
      </div>
    </div>
  );
};

// ================
const Row = ({
  //
  row,
  disabled,
}: {
  row: Trow;
  disabled?: boolean;
}) => {
  const {
    //
    list,
    panelCell_01,
    panelCell_02,
    panelCell_03,
    panelCell_04,
    panelCell_05,
    panelCell_06,
    panelCell_07,
  } = row;

  const arr = Object.values(list);

  return (
    <CellWithBar className={classNames(scss.row)}>
      {panelCell_01 && (
        <PanelCell_01 onDeleteClick={panelCell_01.onDeleteClick} onChainClick={panelCell_01.onChainClick} />
      )}
      {panelCell_02 && <PanelCell_02 onDeleteClick={panelCell_02.onDeleteClick} />}
      {panelCell_03 && <PanelCell_03 control={panelCell_03} />}
      {panelCell_04 && <PanelCell_04 control={panelCell_04} />}
      {panelCell_05 && <PanelCell_05 control={panelCell_05} />}
      {panelCell_06 && <PanelCell_06 control={panelCell_06} />}
      {panelCell_07 && <PanelCell_07 control={panelCell_07} />}
      {arr.map((cell, index) => {
        const { cellStyle, inputProps, datePickerProps, twoInputProps } = cell;

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
            <InputSel
              //
              disabled={disabled}
              showBaseline="auto"
              inputProps={inputProps}
              datePickerProps={datePickerProps}
            />
          </div>
        );
      })}
    </CellWithBar>
  );
};

const Thead = ({
  //
  headRow,
  headRowCellArr,
}: {
  headRow: TheadRow;
  headRowCellArr: TheadRow['list'][string][];
}) => {
  return (
    <div className={classNames(scss.thead, scss.row)}>
      {headRow.panelCell_01 && <PanelCell_01 isHidden={true} />}
      {headRow.panelCell_02 && <PanelCell_02 isHidden={true} />}
      {headRow.panelCell_03 && <PanelCell_03 isHidden={true} />}
      {headRow.panelCell_04 && <PanelCell_04 isHidden={true} />}
      {headRow.panelCell_05 && <PanelCell_05 isHidden={true} />}
      {headRow.panelCell_06 && <PanelCell_06 isHidden={true} />}
      {headRow.panelCell_07 && <PanelCell_07 isHidden={true} />}
      {headRowCellArr.map((cell, index) => {
        const { label, cellStyle } = cell;

        return (
          <div key={index} style={cellStyle}>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================================================
