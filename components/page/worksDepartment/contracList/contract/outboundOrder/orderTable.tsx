import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// css
import scss from './orderTable.module.scss';

// antd
import { Popover } from 'antd';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import OutsourcingSelector, { ToutsourcingDto } from 'components/global/gear/modal/outsourctingSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TemployeeDto, ToutsourcingDto } from 'js/api/dtoTypes';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// icon
import { IconAddCircle, IconEdit, IconDelete01, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

// import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import * as antdIcon from '@ant-design/icons';

// ================================================================================

// region type

type TrowProps_other = {
  showLeft?: boolean | undefined;
  changeShowLeft?: () => void;
  isThead?: boolean;
};

type TrowProps = {
  key?: string | number;
  className?: string;
  isHeadRow?: boolean;
  isProdRow?: boolean;
  side?: {
    serialNumber: React.ReactNode;
    projectName: React.ReactNode;
  };
  left?: {
    L?: React.ReactNode;
    WG?: React.ReactNode;
    B?: React.ReactNode;
    qty?: React.ReactNode;
    volume?: React.ReactNode;
    total_volume?: React.ReactNode;
    doorModelName?: React.ReactNode;
    material?: React.ReactNode;
    horsepower?: React.ReactNode;
    surface?: React.ReactNode;
  };
  center?: {
    projectName?: React.ReactNode;
    L?: React.ReactNode;
    WG?: React.ReactNode;
    B?: React.ReactNode;
    qty?: React.ReactNode;
    volume?: React.ReactNode;
    total_volume?: React.ReactNode;
    doorModelName?: React.ReactNode;
    material?: React.ReactNode;
    horsepower?: React.ReactNode;
    surface?: React.ReactNode;
    establishmentDate?: string | null; // 工作表開立日期
  };
  right?: {
    accessorie?: React.ReactNode;
    installationDate?: React.ReactNode;
    shippingDate?: React.ReactNode;
    installerEmployeesName?: React.ReactNode;
    itemName?: React.ReactNode;
    notes?: React.ReactNode;
  };
  rightPanelArr?: Tpanel[];
};

type Tpanel = {
  key?: string | number;
  isUndefined?: boolean;
  accessorie: React.ReactNode; // 選配
  installationDate: string; // 施工日期
  shippingDate: string; // 出貨日
  installer_employee?: TemployeeDto | undefined | null; // 安裝人員 員工
  installer_outsourcing?: ToutsourcingDto | undefined | null; // 安裝人員 外包廠商
  itemName: string; //項目
  notes: string; // 備註
  onAddClick: (() => void) | undefined;
  onDeleteClick: (() => void) | undefined;
  onConfirmClick:
    | ((parameters: {
        employeeId?: string;
        outsourcingId?: string;
        installationDate: string;
        shippingDate: string;
        itemName: string;
        notes: string;
      }) => Promise<void>)
    | undefined;
};

type Tcontrol = {
  rowPropsArr: TrowProps[];
};

export type { Tcontrol as Tcontrol_orderTable, TrowProps, Tpanel };

// ================================================================================

const SelectorGroup = selectModalCreator_multi<['employee', 'outsourcing']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '員工',
      tip: '單選',
      limit: 1,
      clearOther: [1],
    },
    {
      key: 'outsourcing',
      caption: '外包廠商',
      tip: '單選',
      limit: 1,
      clearOther: [0],
    },
  ],
});

// ================================================================================
// region START

export default function OrderTable({ control }: { control: Tcontrol }) {
  const { rowPropsArr } = control;

  const [showLeft, setShowLeft] = useState(true);

  const changeShowLeft = () => {
    setShowLeft((state) => !state);
  };

  // -------------------------------------------------------------------------------

  // region RENDER
  return (
    <div className={scss.tableContainer}>
      <div className={scss.orderTable}>
        {/*  */}

        <Thead showLeft={showLeft} changeShowLeft={changeShowLeft} isThead={true} />

        {rowPropsArr.map((rowProps, index) => {
          const { isHeadRow, key } = rowProps;

          if (isHeadRow) {
            return <HeadRow key={key || index} showLeft={showLeft} changeShowLeft={changeShowLeft} {...rowProps} />;
          }

          return <Row key={key || index} showLeft={showLeft} changeShowLeft={changeShowLeft} {...rowProps} />;
        })}
      </div>
    </div>
  );
}

// region END

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

// region COMPONENT
//
//
//
//
//
// region Row
const Row = ({
  //
  className,
  showLeft = true,
  changeShowLeft,
  isThead,
  side,
  left,
  center,
  right,
  rightPanelArr: rightPanelArr,
}: TrowProps & TrowProps_other) => {
  return (
    <div className={classNames(scss.row, className)}>
      <div className={classNames(scss.side)}>
        <div className={classNames(scss.cell, !side && 'invisible', 'w-7')}>{side?.serialNumber}</div>
        <div className={classNames(scss.cell, !side && 'invisible', 'w-16')}>{side?.projectName}</div>
        <div className={classNames(scss.cell, scss.showLeftBtnCell, !isThead && 'invisible', 'w-8')}>
          <Popover content="顯示/不顯示源頭產品" trigger="hover" mouseEnterDelay={0.5}>
            {showLeft && <antdIcon.StepBackwardOutlined className={scss.showLeftBtn} onClick={changeShowLeft} />}
            {!showLeft && <antdIcon.StepForwardOutlined className={scss.showLeftBtn} onClick={changeShowLeft} />}
          </Popover>
        </div>
      </div>

      {/* <div className={classNames(scss.left, !showLeft && scss.hidden, scss.plus)}> */}
      <div className={classNames(scss.left, !showLeft && scss.notShow, scss.plus)}>
        <div className={classNames(scss.cell, 'w-9')}>{left?.L}</div>
        <div className={classNames(scss.cell, 'w-9')}>{left?.WG}</div>
        <div className={classNames(scss.cell, 'w-9')}>{left?.B}</div>
        <div className={classNames(scss.cell, 'w-8')}>{left?.qty}</div>
        <div className={classNames(scss.cell, 'w-12')}>{left?.volume}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.total_volume}</div>
        <div className={classNames(scss.cell, 'w-16')}>{left?.doorModelName}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.material}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.horsepower}</div>
        <div className={classNames(scss.cell, 'w-8')}>{left?.surface}</div>
      </div>

      <div className={classNames(scss.divider, !left && 'invisible')} />

      <div className={scss.center}>
        <div className={classNames(scss.cell, 'w-16')}>{center?.projectName}</div>
        <div className={classNames(scss.cell, 'w-9')}>{center?.L}</div>
        <div className={classNames(scss.cell, 'w-9')}>{center?.WG}</div>
        <div className={classNames(scss.cell, 'w-9')}>{center?.B}</div>
        <div className={classNames(scss.cell, 'w-8')}>{center?.qty}</div>
        <div className={classNames(scss.cell, 'w-12')}>{center?.volume}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.total_volume}</div>
        <div className={classNames(scss.cell, 'w-16')}>{center?.doorModelName}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.material}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.horsepower}</div>
        <div className={classNames(scss.cell, 'w-8')}>{center?.surface}</div>
        <div className={classNames(scss.cell, 'w-[98px]')}>{center?.establishmentDate}</div>
      </div>

      <div className={scss.divider} />

      {right && (
        <div className={scss.right}>
          <div className={classNames(scss.cell, 'w-52')}>{right.accessorie}</div>
          <div className={classNames(scss.cell, 'w-24')}></div>
          <div className={classNames(scss.cell, 'w-28')}>{right.shippingDate}</div>
          <div className={classNames(scss.cell, 'w-28')}>{right.installationDate}</div>
          <div className={classNames(scss.cell, 'w-24')}>{right.installerEmployeesName}</div>
          <div className={classNames(scss.cell, 'w-24')}>{right.itemName}</div>
          <div className={classNames(scss.cell, 'w-52')}>{right.notes}</div>
        </div>
      )}

      {/* {rightPanelArr && <Panel {...rightPanelArr} />} */}
      {rightPanelArr && (
        <div className={scss.rightPanel}>
          {rightPanelArr.map((rightPanel, index) => {
            return <Panel key={rightPanel.key || index} {...rightPanel} />;
          })}
        </div>
      )}

      {!right && !rightPanelArr && (
        <div className={scss.right}>
          <div className={classNames(scss.cell, 'w-52')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-28')} />
          <div className={classNames(scss.cell, 'w-28')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-52')} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// region Thead
const Thead = (rowProps_other: TrowProps_other) => {
  return (
    <Row
      className={scss.thead}
      {...rowProps_other}
      // showLeft={showLeft}
      // changeShowLeft={changeShowLeft}
      side={{
        serialNumber: '序號',
        projectName: '工程名稱',
      }}
      left={{
        L: 'L',
        WG: 'WG',
        B: 'B',
        qty: '數量',
        volume: '才數',
        total_volume: '總才數',
        doorModelName: '門型',
        material: '材料',
        horsepower: '馬力',
        surface: '表面',
      }}
      center={{
        projectName: '項目',
        L: 'L',
        WG: 'WG',
        B: 'B',
        qty: '數量',
        volume: '才數',
        total_volume: '總才數',
        doorModelName: '門型',
        material: '材料',
        horsepower: '馬力',
        surface: '表面',
        establishmentDate: '工作表開立日期',
      }}
      right={{
        accessorie: '選配',
        installationDate: '施工日期',
        shippingDate: '出貨日期',
        installerEmployeesName: '安裝人員',
        itemName: '項目',
        notes: '備註',
      }}
    />
  );
};

// ============================================================================

// region HeadRow

const HeadRow = (rowProps: TrowProps & TrowProps_other) => {
  return (
    <Row
      {...rowProps}
      showLeft={rowProps.showLeft}
      changeShowLeft={rowProps.changeShowLeft}
      className={classNames(scss.headRow, rowProps.isProdRow && scss.prodRow)}
    />
  );
};

// ------------------------------------------------------------------------

// region Panel

const Panel = ({
  isUndefined,
  accessorie,
  installationDate,
  shippingDate,
  installer_employee,
  installer_outsourcing,
  itemName,
  notes,
  onAddClick,
  onDeleteClick,
  onConfirmClick,
}: Tpanel) => {
  const [disabled, setDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [state_employee, setState_Employee] = useState(installer_employee);
  const [state_outsourcing, setState_Outsourcing] = useState(installer_outsourcing);

  const [state, setState] = useState({
    installationDate,
    shippingDate,
    itemName,
    notes,
  });

  const defaultSeletedDataArrArr = useMemo(() => {
    type TdefaultSeletedDataArrArr = [TemployeeDto[] | undefined, ToutsourcingDto[] | undefined];
    let arr: TdefaultSeletedDataArrArr = [[], []];

    if (state_outsourcing) {
      arr = [undefined, [state_outsourcing]] as TdefaultSeletedDataArrArr;
    } else if (state_employee) {
      arr = [[state_employee], undefined] as TdefaultSeletedDataArrArr;
    }

    return arr;
  }, [state_outsourcing, state_employee]);

  const reset = () => {
    setState({
      installationDate,
      shippingDate,
      itemName,
      notes,
    });
    setState_Employee(installer_employee);
    setState_Outsourcing(installer_outsourcing);
  };

  return (
    <div className={scss.panel}>
      <div className={classNames(scss.cell, scss.accessorie, 'w-52')}>{accessorie}</div>

      <div className={classNames(scss.cell, scss.btnBar, 'w-24')}>
        <IconAddCircle onClick={onAddClick} />
        <IconEdit
          className={classNames(
            //
            !disabled && scss.active,
            (!onDeleteClick || isUndefined) && 'invisible'
          )}
          onClick={async () => {
            if (disabled) {
              setDisabled(false);
            } else {
              setDisabled(true);
              reset();
            }
          }}
        />
        {disabled && (
          <IconDelete01
            onClick={onDeleteClick}
            className={classNames(
              //
              (!onDeleteClick || isUndefined) && 'invisible'
            )}
          />
        )}
        {!disabled && (
          <IconCheck02
            className={classNames(!onConfirmClick && 'invisible')}
            onClick={async () => {
              await onConfirmClick?.({
                employeeId: state_employee?.id,
                outsourcingId: state_outsourcing?.id,
                installationDate: state.installationDate,
                shippingDate: state.shippingDate,
                itemName: state.itemName,
                notes: state.notes,
              }).then(() => {
                setDisabled(true);
              });
            }}
          />
        )}
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', 'w-28')}>
        <InputSel
          name="shippingDate"
          disabled={disabled}
          datePickerProps={{
            props: {
              value: state.shippingDate ? moment(state.shippingDate) : undefined,
              onChange: (v) => {
                setState((state) => ({
                  ...state,
                  shippingDate: v?.toISOString() ?? '',
                }));
              },
            },
          }}
        />
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', 'w-28')}>
        <InputSel
          name="installationDate"
          disabled={disabled}
          datePickerProps={{
            props: {
              value: state.installationDate ? moment(state.installationDate) : undefined,
              onChange: (v) => {
                setState((state) => ({
                  ...state,
                  installationDate: v?.toISOString() ?? '',
                }));
              },
            },
          }}
        />
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', 'w-24')}>
        <InputSel
          name="installerEmployees"
          disabled={disabled}
          onClick={() => {
            !disabled && setShowModal(true);
          }}
          inputProps={{
            props: { value: state_employee?.chName ?? state_outsourcing?.name ?? '', onChange: () => {} },
          }}
        />
      </div>
      <div className={classNames(scss.cell, isUndefined && 'invisible', 'w-24')}>
        <InputSel
          name="itemName"
          disabled={disabled}
          inputProps={{
            props: {
              value: state.itemName,
              onChange: (e) => {
                setState((state) => ({
                  ...state,
                  itemName: e.target.value,
                }));
              },
            },
          }}
        />
      </div>
      <div className={classNames(scss.cell, isUndefined && 'invisible', 'w-52')}>
        <InputSel
          name="notes"
          disabled={disabled}
          inputProps={{
            props: {
              value: state.notes,
              onChange: (e) => {
                setState((state) => ({
                  ...state,
                  notes: e.target.value,
                }));
              },
            },
          }}
        />
      </div>
      {!disabled && (
        <SelectorGroup
          showModal={showModal}
          caption="安裝人員，選擇員工或外包廠商"
          tip="員工或外包擇一"
          onConfirm={(dataArr) => {
            const employeeArr = dataArr[0];
            const employee = employeeArr[0] as (typeof employeeArr)[0] | undefined;

            const outsourcingArr = dataArr[1];
            const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

            if (!employee && !outsourcing) {
              myAlert.info({ title: '必須選擇安裝人員' });

              return;
            }

            if (employee) {
              setState_Employee(employee);
              setState_Outsourcing(undefined);
            }

            if (outsourcing) {
              setState_Employee(undefined);
              setState_Outsourcing(outsourcing);
            }

            setShowModal(false);
          }}
          onCancel={() => {
            setShowModal(false);
          }}
          isCancelOnConfirm={false}
          defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        />
      )}
    </div>
  );
};
