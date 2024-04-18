import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import scss from './orderTable.module.scss';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import OutsourcingSelector, { ToutsourcingDto } from 'components/global/gear/modal/outsourctingSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TemployeeDto, ToutsourcingDto } from 'js/api/dtoTypes';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// icon
import { IconAddCircle, IconEdit, IconDelete01, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

// ================================================================================

// type Tcontrol_2 = {
//   projectName: string;
//   L: string;
//   W: string;
//   B: string;
//   qty: string;
//   total_volume: string;
//   doorModelName: string;
//   material: string;
//   horsepower: string;
//   surface: string;
//   worksheetArr: {
//     projectName: string;
//     total_qty: string;
//     total_volume: string;
//     establishmentDate: string; // 工作表開立日期
//     worksheetItemArr: {
//       projectName: string;
//       L: string;
//       W: string;
//       B: string;
//       volume: string;
//       doorModelName: string;
//       material: string;
//       horsepower: string;
//       surface: string;
//       deliveryStatuArr: {
//         accessorie: string; // 選配
//         installationDate: string; // 施工日期
//         installerEmployeesName: string; // 安裝人員
//         itemName: string; //項目
//         notes: string; // 備註
//         onAddClick: () => void;
//         onEditClick?: () => void;
//         onDeleteClick?: () => void;
//         onConfirmClick?: () => void;
//         onCancelClick?: () => void;
//       }[];
//     }[];
//   }[];
// }[];

type TrowProps = {
  className?: string;
  isHeadRow?: boolean;
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
    establishmentDate?: string; // 工作表開立日期
  };
  right?: {
    accessorie?: React.ReactNode;
    installationDate?: React.ReactNode;
    installerEmployeesName?: React.ReactNode;
    itemName?: React.ReactNode;
    notes?: React.ReactNode;
  };
  rightPanel?: Tpanel;
};

type Tpanel = {
  accessorie: React.ReactNode; // 選配
  installationDate: string; // 施工日期
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
// type TcontractData = {
//   project: string;
//   L: string;
//   W: string;
//   B: string;
//   qty: string;
//   implementQty: string;
//   cai: string;
//   totalCai: string;
//   doorType: string;
//   material: string;
//   horsepower: string;
//   surface: string;
// };

// type TstaticData = {
//   project: string;
//   L: string;
//   W: string;
//   B: string;
//   qty: string;
//   implementQty: string;
//   cai: string;
//   totalCai: string;
//   doorType: string;
//   material: string;
//   horsepower: string;
//   surface: string;
// };

// type TdeliveryStatusItem = {
//   value: string;
//   installer?: undefined;
//   onChange?: (str: string) => void;
//   onChange_date?: undefined;
//   onChange_installer?: undefined;
//   hidden?: boolean;
//   disabled?: boolean;
//   forbidden?: boolean;
//   onEditClick?: undefined;
//   onDeleteClick?: undefined;
//   onAddClick?: undefined;
//   onConfirmClick?: undefined;
//   onCancelClick?: undefined;
// };

// type TdeliveryStatusItem_data = {
//   value: string;
//   installer?: undefined;
//   onChange?: undefined;
//   onChange_date?: (date: string | null) => void;
//   onChange_installer?: undefined;
//   hidden?: boolean;
//   disabled?: boolean;
//   forbidden?: boolean;
//   onEditClick?: undefined;
//   onDeleteClick?: undefined;
//   onAddClick?: undefined;
//   onConfirmClick?: undefined;
//   onCancelClick?: undefined;
// };

// type TdeliveryStatusItem_installer = {
//   value?: string | undefined;
//   installer: ToutsourcingDto | TemployeeDto | undefined | null;
//   onChange?: undefined;
//   onChange_date?: undefined;
//   // onChange_installer?: (installer: ToutsourcingDto | TemployeeDto | null) => void;
//   onChange_installer?: (props: { outsourcing?: ToutsourcingDto; employee?: TemployeeDto }) => void;
//   hidden?: boolean;
//   disabled?: boolean;
//   forbidden?: boolean;
//   onEditClick?: undefined;
//   onDeleteClick?: undefined;
//   onAddClick?: undefined;
//   onConfirmClick?: undefined;
//   onCancelClick?: undefined;
// };

// type TdeliveryStatusItem_btnPanel = {
//   value?: undefined;
//   installer?: undefined;
//   onChange?: undefined;
//   onChange_date?: undefined;
//   onChange_installer?: undefined;
//   hidden?: boolean;
//   disabled?: boolean;
//   forbidden?: boolean;
//   onEditClick?: () => void;
//   onDeleteClick?: () => void;
//   onAddClick: () => void;
//   onConfirmClick: () => void;
//   onCancelClick: () => void;
// };

// type Tgroup = {
//   itemName: string;
//   rowArr: {
//     contractData: TcontractData;
//     staticData: TstaticData;
//     staticData2: {
//       remark01: TdeliveryStatusItem;
//       orderCreatedDate: TdeliveryStatusItem;
//     };

//     deliveryStatus: {
//       // disabled?: boolean;
//       groupList: {
//         btnPanelArr: TdeliveryStatusItem_btnPanel[];
//         installDateArr: TdeliveryStatusItem_data[];

//         installerArr: TdeliveryStatusItem_installer[];

//         itemNameArr: TdeliveryStatusItem[];
//         notesArr: TdeliveryStatusItem[];
//       };
//     };
//   }[];
// };

// type Tcontrol = Tgroup[];

// export type { Tcontrol as Tcontrol_orderTable, Tgroup };

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
export default function OrderTable({ control }: { control: Tcontrol }) {
  const { rowPropsArr } = control;

  // const configList = creConfigList();

  // const [targetRow, setTargetRow] = useState<Tgroup['rowArr'][number]['deliveryStatus'] | undefined>();
  // const [targetEmpControl, setTargetEmpControl] = useState<TdeliveryStatusItem_installer | undefined>();

  // -------------------------------------------------------------------------------

  // 決定簡單處理就好
  // const defaultSeletedDataArrArr = useMemo(() => {
  //   const installer = targetEmpControl?.installer;

  //   if (!installer) {
  //     return undefined;
  //   }

  //   type TdefaultSeletedDataArrArr = [TemployeeDto[] | undefined, ToutsourcingDto[] | undefined];
  //   let arr: TdefaultSeletedDataArrArr = [[], []];

  //   if ('name' in installer) {
  //     arr = [undefined, [installer]] as TdefaultSeletedDataArrArr;
  //   } else if ('chName' in installer) {
  //     arr = [[installer], undefined] as TdefaultSeletedDataArrArr;
  //   }

  //   return arr;
  // }, [targetEmpControl]);

  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------

  return (
    <div className={scss.tableContainer}>
      <div className={scss.orderTable}>
        {/*  */}

        <Thead />

        {rowPropsArr.map((rowProps, index) => {
          const { isHeadRow } = rowProps;

          if (isHeadRow) {
            return <HeadRow key={index} {...rowProps} />;
          }

          return <Row key={index} {...rowProps} />;
        })}

        {/* <HeadRow
          side={{
            serialNumber: '1',
            projectName: 'fooo',
          }}
          left={{
            L: '999',
            WG: '999',
            B: '999',
            qty: '999',
            volume: '999',
            total_volume: '999',
            doorModelName: '999',
            material: '999',
            horsepower: '999',
            surface: '999',
          }}
          center={{
            projectName: '999',
            L: '999',
            WG: '999',
            B: '999',
            qty: '999',
            volume: '999',
            total_volume: '999',
            doorModelName: '999',
            material: '999',
            horsepower: '999',
            surface: '999',
            establishmentDate: '999',
          }}
        />
        <Row
          left={{
            L: '999',
            WG: '999',
            B: '999',
            qty: '999',
            volume: '999',
            total_volume: '999',
            doorModelName: '999',
            material: '999',
            horsepower: '999',
            surface: '999',
          }}
          center={{
            projectName: '999',
            L: '999',
            WG: '999',
            B: '999',
            qty: '999',
            volume: '999',
            total_volume: '999',
            doorModelName: '999',
            material: '999',
            horsepower: '999',
            surface: '999',
            establishmentDate: '999',
          }}
          rightPanel={{
            accessorie: '',
            installationDate: '',
            installer_employee: undefined,
            itemName: '',
            notes: '',
            onAddClick: () => {},
            onDeleteClick: () => {},
            onConfirmClick: async () => {},
          }}
        />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row /> */}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* 安裝人員欄位 */}
        {/* <SelectorGroup
          showModal={!!targetEmpControl}
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

            targetEmpControl?.onChange_installer &&
              targetEmpControl.onChange_installer({
                employee,
                outsourcing,
              });
            setTargetEmpControl(undefined);
          }}
          onCancel={() => {
            setTargetEmpControl(undefined);
          }}
          isCancelOnConfirm={false}
          defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        /> */}
      </div>
    </div>
  );
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

const Row = ({
  //
  className,
  side,
  left,
  center,
  right,
  rightPanel,
}: TrowProps) => {
  return (
    <div className={classNames(scss.row, className)}>
      <div className={classNames(scss.side)}>
        <div className={classNames(scss.cell, !side && 'invisible', 'w-8')}>{side?.serialNumber}</div>
        <div className={classNames(scss.cell, !side && 'invisible', 'w-32')}>{side?.projectName}</div>
      </div>

      <div className={scss.left}>
        <div className={classNames(scss.cell, 'w-14')}>{left?.L}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.WG}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.B}</div>
        <div className={classNames(scss.cell, 'w-14')}>{left?.qty}</div>
        <div className={classNames(scss.cell, 'w-20')}>{left?.volume}</div>
        <div className={classNames(scss.cell, 'w-24')}>{left?.total_volume}</div>
        <div className={classNames(scss.cell, 'w-24')}>{left?.doorModelName}</div>
        <div className={classNames(scss.cell, 'w-24')}>{left?.material}</div>
        <div className={classNames(scss.cell, 'w-24')}>{left?.horsepower}</div>
        <div className={classNames(scss.cell, 'w-24')}>{left?.surface}</div>
      </div>

      <div className={classNames(scss.divider, !left && 'invisible')} />

      <div className={scss.center}>
        <div className={classNames(scss.cell, 'w-32')}>{center?.projectName}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.L}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.WG}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.B}</div>
        <div className={classNames(scss.cell, 'w-14')}>{center?.qty}</div>
        <div className={classNames(scss.cell, 'w-20')}>{center?.volume}</div>
        <div className={classNames(scss.cell, 'w-24')}>{center?.total_volume}</div>
        <div className={classNames(scss.cell, 'w-24')}>{center?.doorModelName}</div>
        <div className={classNames(scss.cell, 'w-24')}>{center?.material}</div>
        <div className={classNames(scss.cell, 'w-24')}>{center?.horsepower}</div>
        <div className={classNames(scss.cell, 'w-24')}>{center?.surface}</div>
        <div className={classNames(scss.cell, 'w-28')}>{center?.establishmentDate}</div>
      </div>

      <div className={scss.divider} />

      {right && (
        <div className={scss.right}>
          <div className={classNames(scss.cell, 'w-52')}>{right.accessorie}</div>
          <div className={classNames(scss.cell, 'w-24')}></div>
          <div className={classNames(scss.cell, 'w-28')}>{right.installationDate}</div>
          <div className={classNames(scss.cell, 'w-24')}>{right.installerEmployeesName}</div>
          <div className={classNames(scss.cell, 'w-24')}>{right.itemName}</div>
          <div className={classNames(scss.cell, 'w-52')}>{right.notes}</div>
        </div>
      )}

      {rightPanel && <Panel {...rightPanel} />}

      {!right && !rightPanel && (
        <div className={scss.right}>
          <div className={classNames(scss.cell, 'w-52')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-28')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-24')} />
          <div className={classNames(scss.cell, 'w-52')} />
        </div>
      )}
    </div>
  );
};

const Thead = () => {
  return (
    <Row
      className={scss.thead}
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
        installerEmployeesName: '安裝人員',
        itemName: '項目',
        notes: '備註',
      }}
    />
  );
};

const HeadRow = (rowProps: TrowProps) => {
  return <Row {...rowProps} className={scss.headRow} />;
};

// ------------------------------------------------------------------------

const Panel = ({
  accessorie,
  installationDate,
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
      itemName,
      notes,
    });
    setState_Employee(installer_employee);
    setState_Outsourcing(installer_outsourcing);
  };

  return (
    <div className={scss.panel}>
      <div className={classNames(scss.cell, 'w-52')}>{accessorie}</div>

      <div className={classNames(scss.cell, scss.btnBar, 'w-24')}>
        <IconAddCircle onClick={onAddClick} />
        <IconEdit
          className={classNames(!disabled && scss.active, !onDeleteClick && 'invisible')}
          onClick={async () => {
            if (disabled) {
              setDisabled(false);
            } else {
              setDisabled(true);
              reset();
            }
          }}
        />
        {disabled && <IconDelete01 className={classNames(!onDeleteClick && 'invisible')} />}
        {!disabled && (
          <IconCheck02
            className={classNames(!onConfirmClick && 'invisible')}
            onClick={async () => {
              await onConfirmClick?.({
                employeeId: state_employee?.id,
                outsourcingId: state_outsourcing?.id,
                installationDate: state.installationDate,
                itemName: state.itemName,
                notes: state.notes,
              }).then(() => {
                setDisabled(true);
              });
            }}
          />
        )}
      </div>

      <div className={classNames(scss.cell, 'w-28')}>
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
      <div className={classNames(scss.cell, 'w-24')}>
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
      <div className={classNames(scss.cell, 'w-24')}>
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
      <div className={classNames(scss.cell, 'w-52')}>
        <InputSel
          name="notes"
          disabled={disabled}
          inputProps={{
            props: {
              value: notes,
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

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

// const orderKeyArr_contract: (keyof TcontractData)[] = [
//   'project',
//   'L',
//   'W',
//   'B',
//   'qty',
//   // 'implementQty',
//   'cai',
//   'totalCai',
//   'doorType',
//   'material',
//   'horsepower',
//   'surface',
// ];

// const orderKeyArr_static: (keyof TstaticData)[] = [
//   'project', // 這個欄位顯示出來應該會讓這個報表比較清楚
//   'L',
//   'W',
//   'B',
//   'qty',
//   // 'implementQty',
//   'cai',
//   'totalCai',
//   'doorType',
//   'material',
//   'horsepower',
//   'surface',
// ];

// const orderKey_staticData2: (keyof Tgroup['rowArr'][number]['staticData2'])[] = [
//   //
//   'orderCreatedDate',
//   'remark01',
// ];

// const orderKey_deliveryStatus: (keyof Tgroup['rowArr'][number]['deliveryStatus']['groupList'])[] = [
//   'btnPanelArr',
//   'installDateArr',
//   'installerArr',
//   'itemNameArr',
//   'notesArr',
// ];

// // =======================================================================

// type Tconfig = {
//   label: string;
//   width: string;
//   type?: 'input' | 'select' | 'date' | 'employee' | 'textarea' | 'other';
//   position: string;
// };

// type TcellConfigList = {
//   [key: string]: Tconfig | undefined;
// };

// const creCellConfig_static = (): TcellConfigList => ({
//   discount: {
//     label: '折數',
//     width: '75px',
//     type: 'input',
//     position: '',
//   },
//   project: {
//     label: '項目',
//     width: '120px',
//     type: 'input',
//     position: '',
//   },
//   quoteType: {
//     label: '報價別',
//     width: '105px',
//     type: 'select',
//     position: '',
//   },
//   L: {
//     label: 'L',
//     width: '60px',
//     type: 'input',
//     position: 'center',
//   },
//   W: {
//     label: 'W',
//     width: '60px',
//     type: 'input',
//     position: 'center',
//   },
//   H: {
//     label: 'H',
//     width: '60px',
//     type: 'input',
//     position: 'center',
//   },
//   B: {
//     label: 'B',
//     width: '60px',
//     type: 'input',
//     position: 'center',
//   },
//   area: {
//     label: '面積',
//     width: '60px',
//     type: 'input',
//     position: '',
//   },
//   cai: {
//     label: '才數',
//     width: '75px',
//     type: 'input',
//     position: '',
//   },
//   totalCai: {
//     label: '總才數',
//     width: '75px',
//     type: 'input',
//     position: '',
//   },
//   doorType: {
//     label: '門型',
//     width: '75px',
//     type: 'input',
//     position: '',
//   },
//   material: {
//     label: '材料',
//     width: '120px',
//     type: 'select',
//     position: '',
//   },
//   surface: {
//     label: '表面',
//     width: '55px',
//     type: 'select',
//     position: '',
//   },
//   // doorRail: {
//   //   label: '門軌',
//   //   width: '70px',
//   //   type: 'selectWithIcon',
//   //   position: '',
//   // },
//   horsepower: {
//     label: '馬力',
//     width: '60px',
//     type: 'input',
//     position: '',
//   },
//   qty: {
//     label: '數量',
//     width: '43px',
//     type: 'input',
//     position: 'center',
//   },
//   unitPrice: {
//     label: '單價',
//     width: '84px',
//     type: 'input',
//     position: '',
//   },
//   subTotal: {
//     label: '複價',
//     width: '84px',
//     type: 'input',
//     position: '',
//   },
//   memo: {
//     label: '備註',
//     width: '90px',
//     type: 'select',
//     position: '',
//   },
//   // ejectionDoor: {
//   //   label: '彈射門',
//   //   width: '60px',
//   //   type: 'checkbox',
//   //   position: '',
//   // },
//   openType: {
//     label: '開門方式',
//     width: '82px',
//     type: 'select',
//     position: 'center',
//   },
//   thickness: {
//     label: '厚度',
//     width: '45px',
//     type: 'input',
//     position: '',
//   },
// });
// // =============================================================

// const creCellConfig_staticData2 = (): TcellConfigList => ({
//   remark01: {
//     label: '選配',
//     width: '200px',
//     type: 'textarea',
//     position: '',
//   },
//   remark02: {
//     label: '備註2',
//     width: '150px',
//     type: 'textarea',
//     position: '',
//   },
//   remark03: {
//     label: '備註3',
//     width: '65px',
//     type: 'input',
//     position: '',
//   },
//   remark04: {
//     label: '備註4',
//     width: '65px',
//     type: 'input',
//     position: '',
//   },
//   appended: {
//     label: '追加',
//     width: '65px',
//     type: 'input',
//     position: '',
//   },
//   orderCreatedDate: {
//     label: '工作表開立日期',
//     width: '115px',
//     type: 'input',
//     position: '',
//   },
//   finishAppended: {
//     label: '完成追加',
//     width: '75px',
//     type: 'input',
//     position: '',
//   },
//   installer: {
//     label: '安裝人員',
//     width: '85px',
//     type: 'employee',
//     position: '',
//   },
//   installDate: {
//     label: '施工日期',
//     width: '120px',
//     type: 'date',
//     position: '',
//   },
//   implementQty: {
//     label: '實作數量',
//     width: '75px',
//     type: 'input',
//     position: 'center',
//   },
// });

// const creCellConfig_subGroup = (): TcellConfigList => ({
//   btnPanelArr: {
//     label: '',
//     width: '92px',
//     type: 'other',
//     position: '',
//   },
//   installDateArr: {
//     label: '施工日期',
//     width: '150px',
//     type: 'date',
//     position: '',
//   },
//   installerArr: {
//     label: '安裝人員',
//     width: '85px',
//     type: 'input',
//     position: '',
//   },
//   itemNameArr: {
//     label: '項目',
//     width: '100px',
//     type: 'input',
//     position: '',
//   },
//   notesArr: {
//     label: '備註',
//     width: '150px',
//     type: 'input',
//     position: '',
//   },
// });

// // =============================================================

// const creConfigList = (): TcellConfigList => ({
//   ...creCellConfig_static(),
//   ...creCellConfig_staticData2(),
//   ...creCellConfig_subGroup(),
// });

// // =============================================================
