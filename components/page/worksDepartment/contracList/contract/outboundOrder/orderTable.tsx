import { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import scss from './outboundOrder.module.scss';

// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// icon
import { IconAddCircle, IconEdit, IconDelete01, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

// type
import { TemployeeDto } from 'components/global/gear/modal/employeeSelector';

// ================================================================================

type TcontractData = {
  project: string;
  L: string;
  W: string;
  B: string;
  qty: string;
  implementQty: string;
  cai: string;
  totalCai: string;
  doorType: string;
  material: string;
  horsepower: string;
  surface: string;
};

type TstaticData = {
  project: string;
  L: string;
  W: string;
  B: string;
  qty: string;
  implementQty: string;
  cai: string;
  totalCai: string;
  doorType: string;
  material: string;
  horsepower: string;
  surface: string;
};

type TdeliveryStatusItem = {
  value: string;
  empolyee?: undefined;
  onChange?: (str: string) => void;
  onChange_date?: undefined;
  onChange_employee?: undefined;
  hidden?: boolean;
  forbidden?: boolean;
  onEditClick?: undefined;
  onDeleteClick?: undefined;
  onAddClick?: undefined;
  onConfirmClick?: undefined;
};
type TdeliveryStatusItem_date = {
  value: string;
  empolyee?: undefined;
  onChange?: undefined;
  onChange_date?: (date: string | null) => void;
  onChange_employee?: undefined;
  hidden?: boolean;
  forbidden?: boolean;
  onEditClick?: undefined;
  onDeleteClick?: undefined;
  onAddClick?: undefined;
  onConfirmClick?: undefined;
};

type TdeliveryStatusItem_employee = {
  value?: string | undefined;
  empolyee: TemployeeDto | undefined | null;
  onChange?: undefined;
  onChange_date?: undefined;
  onChange_employee?: (emp: TemployeeDto | null) => void;
  hidden?: boolean;
  forbidden?: boolean;
  onEditClick?: undefined;
  onDeleteClick?: undefined;
  onAddClick?: undefined;
  onConfirmClick?: undefined;
};

type TdeliveryStatusItem_btnPanel = {
  value?: undefined;
  empolyee?: undefined;
  onChange?: undefined;
  onChange_date?: undefined;
  onChange_employee?: undefined;
  hidden?: boolean;
  forbidden?: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onAddClick: () => void;
  onConfirmClick: () => void;
};

type Tgroup = {
  itemName: string;
  rowArr: {
    contractData: TcontractData;
    staticData: TstaticData;
    staticData2: {
      remark01: TdeliveryStatusItem;
      orderCreatedDate: TdeliveryStatusItem;
    };

    deliveryStatus: {
      disabled?: boolean;
      groupList: {
        btnPanelArr: TdeliveryStatusItem_btnPanel[];
        installDateArr: TdeliveryStatusItem_date[];
        installerArr: TdeliveryStatusItem_employee[];
        itemNameArr: TdeliveryStatusItem[];
        notesArr: TdeliveryStatusItem[];
      };
    };
  }[];
};

type Tcontrol = Tgroup[];

export type { Tcontrol as Tcontrol_orderTable, Tgroup };

// ================================================================================
export default function OrderTable({ control }: { control: Tcontrol }) {
  const configList = creConfigList();

  // const [targetRow, setTargetRow] = useState<Tgroup['rowArr'][number]['deliveryStatus'] | undefined>();
  const [targetEmpControl, setTargetEmpControl] = useState<TdeliveryStatusItem_employee | undefined>();

  return (
    <div className={scss.orderTable}>
      <div className={scss.thead}>
        {/*  */}
        {/* <div className={`${style.theadItem} ${style.indexCell}`} /> */}
        {/*  */}

        {orderKeyArr_contract.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? scss.textCenter : '';

          if (index === 0) {
            return (
              <div className={`${scss.theadItem} ${textCenter}`} key={index} style={theStyle}>
                <span></span>
                <span>{label}</span>
              </div>
            );
          }

          // return (
          //   <div className={`${style.theadItem} ${textCenter}`} key={index} style={theStyle}>
          //     <span>{label}</span>
          //   </div>
          // );
          return (
            <div className={`${scss.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}

        {/* 灰色柱子 分隔線*/}
        <div className={` ${scss.pilar}`} />

        {orderKeyArr_static.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? scss.textCenter : '';

          return (
            <div className={`${scss.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
        {/* 灰色分隔線 */}
        <div className={` ${scss.pilar}`} />
        {/*  */}
        {orderKey_staticData2.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? scss.textCenter : '';

          return (
            <div className={`${scss.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
        {/*  */}
        {orderKey_deliveryStatus.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? scss.textCenter : '';

          return (
            <div className={`${scss.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
        {/*  */}
      </div>

      <div className={scss.tableList}>
        {control.map((item, groupIndex) => {
          const { itemName, rowArr } = item;

          return (
            <div key={groupIndex}>
              {rowArr.map((row, rowIndex) => {
                const bgcSub = rowIndex !== 0 ? scss.bgcSub : '';

                return (
                  <div className={`${scss.row} ${bgcSub}`} key={rowIndex}>
                    {/*  */}

                    {orderKeyArr_contract.map((key, columnIndex) => {
                      let value = row.contractData[key];

                      if (rowIndex !== 0 && columnIndex === 0) {
                        value = '';
                      }

                      const { width, position } = configList[key] ?? {};
                      const theStyle = { width };

                      if (columnIndex === 0) {
                        const isHiddenIndex = rowIndex !== 0;

                        return (
                          <div
                            className={classNames(
                              //
                              scss.column,
                              position === 'center' && scss.textCenter
                            )}
                            key={columnIndex}
                            style={theStyle}
                          >
                            <span className={classNames('pr-[10px]', isHiddenIndex && scss.hidden)}>
                              {groupIndex + 1}
                            </span>
                            <span>{value}</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          className={classNames(
                            //
                            scss.column,
                            position === 'center' && scss.textCenter,
                            rowIndex !== 0 && scss.hidden
                          )}
                          key={columnIndex}
                          style={theStyle}
                        >
                          <span>{value}</span>
                        </div>
                      );
                    })}

                    {/* 灰色分隔線 */}
                    <div className={classNames(scss.pilar, rowIndex !== 0 && scss.hidden)} />

                    {/* orderKeyIndex01 */}
                    {orderKeyArr_static.map((key, columnIndex) => {
                      let value = row.staticData[key];

                      if (rowIndex !== 0 && columnIndex === 0) {
                        value = '';
                      }

                      const { width, position } = configList[key] ?? {};
                      const theStyle = { width };

                      return (
                        <div
                          className={classNames(scss.column, position === 'center' && scss.textCenter)}
                          key={columnIndex}
                          style={theStyle}
                        >
                          <span>{value}</span>
                        </div>
                      );
                    })}

                    {/* 沒有柱子的灰色柱子 */}
                    <div className={`${scss.pilar}`} />

                    {/* orderKeyIndex02 */}
                    {orderKey_staticData2.map((key, columnIndex) => {
                      const { value } = row.staticData2[key];

                      const { width, position } = configList[key] ?? {};
                      const theStyle = { width };
                      const textCenter = position === 'center' ? scss.textCenter : '';

                      return (
                        <div className={`${scss.column} ${textCenter}`} key={columnIndex} style={theStyle}>
                          <InputSel
                            className={classNames(scss.input03)}
                            showBaseline={'invisible'}
                            disabled={true}
                            inputProps={{
                              props: {
                                value,
                                placeholder: '',
                              },
                            }}
                          />
                        </div>
                      );
                    })}
                    {/*  */}

                    {orderKey_deliveryStatus.map((key, index) => {
                      const { disabled, groupList } = row.deliveryStatus;

                      const group = groupList[key];

                      const { width, position, type } = configList[key] ?? {};
                      const theStyle = { width };
                      const textCenter = position === 'center' ? scss.textCenter : '';

                      const theProps: Parameters<typeof InputSel>[0] = {};

                      return (
                        <div
                          //
                          key={key}
                          className={classNames(scss.column, textCenter, scss.subGroup)}
                          style={theStyle}
                        >
                          {group.map((item, index) => {
                            const {
                              value,
                              empolyee,
                              onChange_date,
                              onChange_employee,

                              onAddClick,
                              onEditClick,
                              onDeleteClick,
                              onConfirmClick,
                            } = item;

                            if (key === 'btnPanelArr') {
                              const isFirst = index === 0;

                              return (
                                <div key={index} className={classNames(scss.btnPanel)}>
                                  <IconAddCircle className={classNames(!isFirst && scss.hidden)} onClick={onAddClick} />
                                  {disabled ? (
                                    <IconEdit onClick={onEditClick} />
                                  ) : (
                                    <IconCheck02 onClick={onConfirmClick} />
                                  )}
                                  <IconDelete01 onClick={onDeleteClick} />
                                </div>
                              );
                            }

                            //
                            if (onChange_employee) {
                              theProps.inputProps = {
                                props: {
                                  value: value || empolyee?.chName || empolyee?.enName || '',
                                  placeholder: '',
                                },
                              };

                              const onClick = () => {
                                !disabled && setTargetEmpControl(item);
                              };

                              return (
                                <div key={index} onClick={onClick}>
                                  <InputSel
                                    className={classNames(scss.input03)}
                                    showBaseline={'auto'}
                                    // placeholder=""
                                    disabled={disabled}
                                    {...theProps}
                                  />
                                </div>
                              );
                            }

                            //
                            if (onChange_date) {
                              return (
                                <div key={index}>
                                  <InputSel datePickerProps={{}} disabled={disabled} showBaseline={'auto'} />
                                </div>
                              );
                            }

                            return (
                              <div key={index}>
                                <InputSel inputProps={{}} disabled={disabled} showBaseline={'auto'} />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}

                    {/*  */}
                    {rowIndex !== 0 && <div className={scss.ribbon}></div>}
                  </div> // row
                ); // return
              })}
            </div>
          );
        })}
      </div>
      <EmployeeSelector
        showModal={!!targetEmpControl}
        onConfirm={(arr) => {
          targetEmpControl?.onChange_employee?.(arr[0] ?? null);
        }}
        onCancel={() => {
          setTargetEmpControl(undefined);
        }}
        selLimit={1}
      />
    </div>
  );
}

// =======================================================

const orderKeyArr_contract: (keyof TcontractData)[] = [
  'project',
  'L',
  'W',
  'B',
  'qty',
  // 'implementQty',
  'cai',
  'totalCai',
  'doorType',
  'material',
  'horsepower',
  'surface',
];

const orderKeyArr_static: (keyof TstaticData)[] = [
  // 'project',
  'L',
  'W',
  'B',
  'qty',
  // 'implementQty',
  'cai',
  'totalCai',
  'doorType',
  'material',
  'horsepower',
  'surface',
];

const orderKey_staticData2: (keyof Tgroup['rowArr'][number]['staticData2'])[] = [
  //
  'orderCreatedDate',
  'remark01',
];

const orderKey_deliveryStatus: (keyof Tgroup['rowArr'][number]['deliveryStatus']['groupList'])[] = [
  'btnPanelArr',
  'installDateArr',
  'installerArr',
  'itemNameArr',
  'notesArr',
];

// =======================================================================

type Tconfig = {
  label: string;
  width: string;
  type?: 'input' | 'select' | 'date' | 'employee' | 'textarea' | 'other';
  position: string;
};

type TcellConfigList = {
  [key: string]: Tconfig | undefined;
};

const creCellConfig_static = (): TcellConfigList => ({
  discount: {
    label: '折數',
    width: '75px',
    type: 'input',
    position: '',
  },
  project: {
    label: '項目',
    width: '120px',
    type: 'input',
    position: '',
  },
  quoteType: {
    label: '報價別',
    width: '105px',
    type: 'select',
    position: '',
  },
  L: {
    label: 'L',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  W: {
    label: 'W',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  H: {
    label: 'H',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  B: {
    label: 'B',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  area: {
    label: '面積',
    width: '60px',
    type: 'input',
    position: '',
  },
  cai: {
    label: '才數',
    width: '75px',
    type: 'input',
    position: '',
  },
  totalCai: {
    label: '總才數',
    width: '75px',
    type: 'input',
    position: '',
  },
  doorType: {
    label: '門型',
    width: '75px',
    type: 'input',
    position: '',
  },
  material: {
    label: '材料',
    width: '120px',
    type: 'select',
    position: '',
  },
  surface: {
    label: '表面',
    width: '55px',
    type: 'select',
    position: '',
  },
  // doorRail: {
  //   label: '門軌',
  //   width: '70px',
  //   type: 'selectWithIcon',
  //   position: '',
  // },
  horsepower: {
    label: '馬力',
    width: '60px',
    type: 'input',
    position: '',
  },
  qty: {
    label: '數量',
    width: '43px',
    type: 'input',
    position: 'center',
  },
  unitPrice: {
    label: '單價',
    width: '84px',
    type: 'input',
    position: '',
  },
  subTotal: {
    label: '複價',
    width: '84px',
    type: 'input',
    position: '',
  },
  memo: {
    label: '備註',
    width: '90px',
    type: 'select',
    position: '',
  },
  // ejectionDoor: {
  //   label: '彈射門',
  //   width: '60px',
  //   type: 'checkbox',
  //   position: '',
  // },
  openType: {
    label: '開門方式',
    width: '82px',
    type: 'select',
    position: 'center',
  },
  thickness: {
    label: '厚度',
    width: '45px',
    type: 'input',
    position: '',
  },
});
// =============================================================

const creCellConfig_staticData2 = (): TcellConfigList => ({
  remark01: {
    label: '備註1',
    width: '200px',
    type: 'textarea',
    position: '',
  },
  remark02: {
    label: '備註2',
    width: '150px',
    type: 'textarea',
    position: '',
  },
  remark03: {
    label: '備註3',
    width: '65px',
    type: 'input',
    position: '',
  },
  remark04: {
    label: '備註4',
    width: '65px',
    type: 'input',
    position: '',
  },
  appended: {
    label: '追加',
    width: '65px',
    type: 'input',
    position: '',
  },
  orderCreatedDate: {
    label: '工作表開立日期',
    width: '115px',
    type: 'input',
    position: '',
  },
  finishAppended: {
    label: '完成追加',
    width: '75px',
    type: 'input',
    position: '',
  },
  installer: {
    label: '安裝人員',
    width: '85px',
    type: 'employee',
    position: '',
  },
  installDate: {
    label: '安裝日期',
    width: '120px',
    type: 'date',
    position: '',
  },
  implementQty: {
    label: '實作數量',
    width: '75px',
    type: 'input',
    position: 'center',
  },
});

const creCellConfig_subGroup = (): TcellConfigList => ({
  btnPanelArr: {
    label: '',
    width: '92px',
    type: 'other',
    position: '',
  },
  installDateArr: {
    label: '安裝日期',
    width: '150px',
    type: 'date',
    position: '',
  },
  installerArr: {
    label: '安裝人員',
    width: '85px',
    type: 'input',
    position: '',
  },
  itemNameArr: {
    label: '項目',
    width: '100px',
    type: 'input',
    position: '',
  },
  notesArr: {
    label: '備註',
    width: '150px',
    type: 'input',
    position: '',
  },
});

// =============================================================

const creConfigList = (): TcellConfigList => ({
  ...creCellConfig_static(),
  ...creCellConfig_staticData2(),
  ...creCellConfig_subGroup(),
});
