import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';

// antd
import { Checkbox, Popover, Button, Switch, Select } from 'antd';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import OutsourcingSelector, { ToutsourcingDto } from 'components/global/gear/modal/outsourctingSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_rounded from 'components/global/gear/button/myButton_rounded';

import { TemployeeDto, ToutsourcingDto, TdeliveryStatusInstallationItem } from 'js/api/dtoTypes';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import { Toption } from 'js/utils/options/options';
import { optionsCreator_deliveryStatusInstallationItem } from 'js/utils/options/productOptions';

// icon
import { IconAddCircle, IconEdit, IconDelete01, IconCheck02, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import * as antdIcon from '@ant-design/icons';

// css
import scss from './orderTable.module.scss';

// ================================================================================

// region type

type Toption_generics<E extends string> = { value: E; label: string };
type Toption_installationItem = Toption_generics<TdeliveryStatusInstallationItem>;

type TpostDeliveryStatusParams = {
  // employeeId?: string;
  employeeIdArr?: string[];
  outsourcingId?: string;
  installationDate: string;
  shippingDate: string;
  itemName: string;
  notes: string;
  installationItem: TdeliveryStatusInstallationItem | null;
};

type TrowProps_other = {
  showLeft?: boolean | undefined;
  changeShowLeft?: () => void;
  isThead?: boolean;
  showBatchAdd?: boolean;
};

type TrowProps = {
  key?: string | number;
  className?: string;
  isHeadRow?: boolean;
  isProdRow?: boolean;
  // onCheckClick?: null | (() => void);
  // isChecked?: boolean;
  side?: {
    serialNumber: React.ReactNode;
    projectName: React.ReactNode;
  };
  left?: {
    L?: React.ReactNode;
    WG?: React.ReactNode;
    h?: React.ReactNode;
    B?: React.ReactNode;
    qty?: React.ReactNode;
    implementationQty?: number | string;
    volume?: React.ReactNode;
    total_volume?: React.ReactNode;
    implementationVolume?: number | string;
    doorModelName?: React.ReactNode;
    material?: React.ReactNode;
    horsepower?: React.ReactNode;
    surface?: React.ReactNode;
  };
  center?: {
    projectName?: React.ReactNode;
    L?: React.ReactNode;
    WG?: React.ReactNode;
    h?: React.ReactNode;
    B?: React.ReactNode;
    qty?: React.ReactNode;
    volume?: React.ReactNode;
    total_volume?: React.ReactNode;
    doorModelName?: React.ReactNode;
    material?: React.ReactNode;
    horsepower?: React.ReactNode;
    surface?: React.ReactNode;
    establishmentDate?: string | null; // 工作表開立日期
    //
    onCheckClick?: null | (() => void);
    isChecked?: boolean;
  };
  right?: {
    accessorie?: React.ReactNode;
    installationItem?: React.ReactNode;
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
  // component: React.ReactNode;
  installationDate: string; // 施工日期
  shippingDate: string; // 出貨日

  installer_employeeArr?: TemployeeDto[]; // 安裝人員 員工
  installer_outsourcing?: ToutsourcingDto | undefined | null; // 安裝人員 外包廠商

  itemName: string; //項目
  notes: string; // 備註
  installationItem: string | null;
  onAddClick?: (() => void) | undefined;
  onDeleteClick: (() => void) | undefined;
  onConfirmClick?: (parameters: TpostDeliveryStatusParams) => Promise<void>;
  onCopyClick: ((parameters: TpostDeliveryStatusParams) => Promise<void>) | undefined;

  isLatest?: boolean;
};

// type Tcontrol = {
//   rowPropsArr: TrowProps[];
// };

export type { TrowProps, Tpanel, TpostDeliveryStatusParams };

// ================================================================================

const SelectorGroup = selectModalCreator_multi<['employee', 'outsourcing']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '員工',
      tip: '單選',
      // limit: 1,
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

export default function OrderTable({
  rowPropsArr,
  batchWorksheetItem,
}: {
  rowPropsArr: TrowProps[];
  batchWorksheetItem: {
    onBatchAddChange?: (showBatchAdd: boolean) => void;
    onBatchAddClick?: () => void;
  };
}) {
  const [showLeft, setShowLeft] = useState(true);
  const [showBatchAdd, setShowBatchAdd] = useState(false);

  const changeShowLeft = () => {
    setShowLeft((state) => !state);
  };

  // -------------------------------------------------------------------------------

  const { totalImplementationQty, totalImplementationVolume, totalVolume } = useMemo(() => {
    const totalImplementation = rowPropsArr.reduce(
      (
        { totalImplementationQty, totalImplementationVolume, totalVolume },
        { left: { implementationQty, implementationVolume } = {}, center: { volume } = {} }
      ) => {
        const implementationQty_num = typeof implementationQty === 'number' ? implementationQty : 0;
        const implementationVolume_num = typeof implementationVolume === 'number' ? implementationVolume : 0;
        const volume_num = Number(volume) || 0;

        return {
          totalImplementationQty: new Decimal(totalImplementationQty).add(implementationQty_num).toNumber(),
          totalImplementationVolume: new Decimal(totalImplementationVolume).add(implementationVolume_num).toNumber(),
          totalVolume: new Decimal(totalVolume).add(volume_num).toNumber(),
        };
      },
      {
        totalImplementationQty: 0,
        totalImplementationVolume: 0,
        totalVolume: 0,
      }
    );

    return totalImplementation;
  }, [rowPropsArr]);

  // -------------------------------------------------------------------------------
  useEffect(() => {
    batchWorksheetItem.onBatchAddChange && batchWorksheetItem.onBatchAddChange(showBatchAdd);
  }, [showBatchAdd]);

  // -------------------------------------------------------------------------------

  // region RENDER
  return (
    <div className={scss.tableContainer}>
      <div className={scss.topPanel}>
        <Switch
          checkedChildren="勾選工作表"
          unCheckedChildren="勾選工作表"
          checked={showBatchAdd}
          // defaultChecked={showBatchAdd}
          onChange={(bool) => {
            setShowBatchAdd(bool);
          }}
        />
        <div className={'ml-5'}>
          <BatchProdPanel
            className={classNames(!showBatchAdd && 'hidden')}
            onBatchAddClick={batchWorksheetItem.onBatchAddClick}
          />
        </div>
      </div>

      <div className={scss.orderTable}>
        {/*  */}
        <Thead showLeft={showLeft} changeShowLeft={changeShowLeft} isThead={true} />

        {rowPropsArr.map((rowProps, index) => {
          const { isHeadRow, key } = rowProps;

          if (isHeadRow) {
            return (
              <HeadRow
                //
                key={key || index}
                showLeft={showLeft}
                changeShowLeft={changeShowLeft}
                {...rowProps}
                showBatchAdd={showBatchAdd}
              />
            );
          }

          return (
            <Row
              key={key || index}
              showLeft={showLeft}
              changeShowLeft={changeShowLeft}
              {...rowProps}
              showBatchAdd={showBatchAdd}
            />
          );
        })}

        <TotalRow
          totalImplementationQty={totalImplementationQty}
          totalImplementationVolume={totalImplementationVolume}
          totalVolume={totalVolume}
        />
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
  showBatchAdd,
}: TrowProps & TrowProps_other) => {
  return (
    <div className={classNames(scss.row, className)}>
      <div className={classNames(scss.side)}>
        <div className={classNames(scss.cell, !side && 'invisible', config.serialNumber.className)}>
          {side?.serialNumber}
        </div>
        <div className={classNames(scss.cell, !side && 'invisible', config.projectName.className)}>
          {side?.projectName}
        </div>
        <div className={classNames(scss.cell, scss.showLeftBtnCell, !isThead && 'invisible', 'w-8')}>
          <Popover content="顯示/不顯示源頭產品" trigger="hover" mouseEnterDelay={0.5}>
            {showLeft && <antdIcon.StepBackwardOutlined className={scss.showLeftBtn} onClick={changeShowLeft} />}
            {!showLeft && <antdIcon.StepForwardOutlined className={scss.showLeftBtn} onClick={changeShowLeft} />}
          </Popover>
        </div>
      </div>

      <div className={classNames(scss.left, !showLeft && scss.notShow, scss.plus)}>
        <div className={classNames(scss.cell, config.L.className)}>{left?.L}</div>
        <div className={classNames(scss.cell, config.WG.className)}>{left?.WG}</div>
        <div className={classNames(scss.cell, config.h.className)}>{left?.h}</div>
        <div className={classNames(scss.cell, config.B.className)}>{left?.B}</div>
        {/*  */}
        <div className={classNames(scss.cell, config.qty.className)}>{left?.qty}</div>
        <div className={classNames(scss.cell, config.volume.className)}>{left?.volume}</div>
        <div className={classNames(scss.cell, config.total_volume.className)}>{left?.total_volume}</div>
        {/*  */}
        <div className={classNames(scss.cell, config.implementationQty.className)}>{left?.implementationQty}</div>
        <div className={classNames(scss.cell, config.implementationVolume.className)}>{left?.implementationVolume}</div>
        {/*  */}
        <div className={classNames(scss.cell, config.doorModelName.className)}>{left?.doorModelName}</div>
        <div className={classNames(scss.cell, config.material.className)}>{left?.material}</div>
        <div className={classNames(scss.cell, config.horsepower.className)}>{left?.horsepower}</div>
        <div className={classNames(scss.cell, config.surface.className)}>{left?.surface}</div>
      </div>

      {/* <div className={classNames(scss.divider, !left && 'invisible')} /> */}
      <div className={classNames(scss.divider)} />

      <div className={scss.center}>
        <div className={classNames(scss.cell, config.projectName.className)}>{center?.projectName}</div>
        <div className={classNames(scss.cell, config.L.className)}>{center?.L}</div>
        <div className={classNames(scss.cell, config.WG.className)}>{center?.WG}</div>
        <div className={classNames(scss.cell, config.h.className)}>{center?.h}</div>
        <div className={classNames(scss.cell, config.B.className)}>{center?.B}</div>
        {/* <div className={classNames(scss.cell, config.qty.className)}>{center?.qty}</div> */}
        <div className={classNames(scss.cell, config.volume.className)}>{center?.volume}</div>
        {/* <div className={classNames(scss.cell, config.total_volume.className)}>{center?.total_volume}</div> */}
        <div className={classNames(scss.cell, config.doorModelName.className)}>{center?.doorModelName}</div>
        <div className={classNames(scss.cell, config.material.className)}>{center?.material}</div>
        <div className={classNames(scss.cell, config.horsepower.className)}>{center?.horsepower}</div>
        <div className={classNames(scss.cell, config.surface.className)}>{center?.surface}</div>
        <div className={classNames(scss.cell, config.establishmentDate.className)}>{center?.establishmentDate}</div>

        <div className={classNames(scss.cell, config.centerCheckBox.className)}>
          {center?.onCheckClick && (
            <Checkbox
              className={classNames(scss.antd_checkBox, !showBatchAdd && 'invisible')}
              onChange={center.onCheckClick}
              checked={center.isChecked}
            />
          )}
        </div>
      </div>

      <div className={scss.divider} />

      {right && (
        <div className={scss.right}>
          <div className={classNames(scss.cell, config.accessorie.className)}>{right.accessorie}</div>
          <div className={classNames(scss.cell, config.shippingDate.className)}>{right.shippingDate}</div>
          <div className={classNames(scss.cell, config.btnBar.className)}></div>
          <div className={classNames(scss.cell, config.installationItem.className)}>{right.installationItem}</div>
          <div className={classNames(scss.cell, config.installationDate.className)}>{right.installationDate}</div>
          <div className={classNames(scss.cell, config.installerEmployeesName.className)}>
            {right.installerEmployeesName}
          </div>
          <div className={classNames(scss.cell, config.itemName.className)}>{right.itemName}</div>
          <div className={classNames(scss.cell, config.notes.className)}>{right.notes}</div>
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
          <div className={classNames(scss.cell, config.accessorie.className)} />
          <div className={classNames(scss.cell, config.shippingDate.className)} />
          <div className={classNames(scss.cell, config.btnBar.className)} />
          <div className={classNames(scss.cell, config.installationItem.className)} />
          <div className={classNames(scss.cell, config.installationDate.className)} />
          <div className={classNames(scss.cell, config.installerEmployeesName.className)} />
          <div className={classNames(scss.cell, config.itemName.className)} />
          <div className={classNames(scss.cell, config.notes.className)} />
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
        projectName: '項目',
      }}
      left={{
        L: config.L.caption,
        WG: config.WG.caption,
        h: config.h.caption,
        B: config.B.caption,
        qty: config.qty.caption,
        implementationQty: config.implementationQty.caption,
        volume: config.volume.caption,
        total_volume: config.total_volume.caption,
        implementationVolume: config.implementationVolume.caption,
        doorModelName: config.doorModelName.caption,
        material: config.material.caption,
        horsepower: config.horsepower.caption,
        surface: config.surface.caption,
      }}
      center={{
        projectName: config.projectName.caption,
        L: config.L.caption,
        WG: config.WG.caption,
        h: config.h.caption,
        B: config.B.caption,
        qty: config.qty.caption,
        volume: config.volume.caption,
        total_volume: config.total_volume.caption,
        doorModelName: config.doorModelName.caption,
        material: config.material.caption,
        horsepower: config.horsepower.caption,
        surface: config.surface.caption,
        establishmentDate: config.establishmentDate.caption,
      }}
      right={{
        accessorie: config.accessorie.caption,
        installationItem: config.installationItem.caption,
        shippingDate: config.shippingDate.caption,
        installationDate: config.installationDate.caption,
        installerEmployeesName: config.installerEmployeesName.caption,
        itemName: config.itemName.caption,
        notes: config.notes.caption,
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

// region TotalRow
const TotalRow = ({
  totalImplementationQty,
  totalImplementationVolume,
  totalVolume,
}: {
  totalImplementationQty: number | string;
  totalImplementationVolume: number | string;
  totalVolume: number | string;
}) => {
  return (
    <div className={scss.totalRow}>
      <Row
        left={{
          implementationQty: '總實作數量',
          implementationVolume: '總實作才數',
        }}
        center={{
          volume: '總才數',
        }}
      />
      <Row
        left={{
          implementationQty: totalImplementationQty,
          implementationVolume: totalImplementationVolume,
        }}
        center={{
          volume: totalVolume,
        }}
      />
    </div>
  );
};

// ------------------------------------------------------------------------

// region Panel

const Panel = ({
  isUndefined,
  accessorie,
  installationItem,
  installationDate,
  shippingDate,
  installer_employeeArr,
  installer_outsourcing,
  itemName,
  notes,
  onAddClick,
  onDeleteClick,
  onConfirmClick,
  onCopyClick,
  isLatest,
}: Tpanel) => {
  const [disabled, setDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // const [state_employee, setState_Employee] = useState(installer_employee);
  // const [state_outsourcing, setState_Outsourcing] = useState(installer_outsourcing);
  const [state_employeeArr, setState_EmployeeArr] = useState(installer_employeeArr);
  const [state_outsourcing, setState_Outsourcing] = useState(installer_outsourcing);

  const [state_installationItem, setState_installationItem] = useState<Toption_installationItem | null>(
    installationItem ? { value: installationItem as TdeliveryStatusInstallationItem, label: installationItem } : null
  );

  const [state, setState] = useState({
    installationDate,
    shippingDate,
    itemName,
    notes,
  });

  // ------------------------------------------------------------------------

  const reset = () => {
    setState({
      installationDate,
      shippingDate,
      itemName,
      notes,
    });
    setState_EmployeeArr(installer_employeeArr);
    setState_Outsourcing(installer_outsourcing);
    setState_installationItem(
      installationItem ? { value: installationItem as TdeliveryStatusInstallationItem, label: installationItem } : null
    );
  };

  // ------------------------------------------------------------------------
  const defaultSeletedDataArrArr = useMemo(() => {
    type TdefaultSeletedDataArrArr = [TemployeeDto[] | undefined, ToutsourcingDto[] | undefined];
    let arr: TdefaultSeletedDataArrArr = [[], []];

    if (state_outsourcing) {
      arr = [undefined, [state_outsourcing]] as TdefaultSeletedDataArrArr;
    } else if (state_employeeArr) {
      arr = [state_employeeArr, undefined] as TdefaultSeletedDataArrArr;
    }

    return arr;
  }, [state_outsourcing, state_employeeArr]);

  // ------------------------------------------------------------------------

  return (
    <div className={scss.panel}>
      <div className={classNames(scss.cell, scss.accessorie, config.accessorie.className)}>{accessorie}</div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', config.shippingDate.className)}>
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

      <div className={classNames(scss.cell, scss.btnBar, config.btnBar.className)}>
        <IconAddCircle className={classNames(!isLatest && 'invisible')} onClick={onAddClick} />

        {/* {isUndefined && <IconAddCircle onClick={onAddClick} />} */}
        {!isUndefined && (
          <IconCopy
            onClick={() =>
              onCopyClick?.({
                employeeIdArr: state_employeeArr?.map((emp) => emp.id),
                outsourcingId: state_outsourcing?.id,
                installationDate: state.installationDate,
                shippingDate: state.shippingDate,
                itemName: state.itemName,
                notes: state.notes,
                installationItem: state_installationItem?.value || null,
              })
            }
          />
        )}
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
                employeeIdArr: state_employeeArr?.map((emp) => emp.id),
                outsourcingId: state_outsourcing?.id,
                installationDate: state.installationDate,
                shippingDate: state.shippingDate,
                itemName: state.itemName,
                notes: state.notes,
                installationItem: state_installationItem?.value || null,
              }).then(() => {
                setDisabled(true);
              });
            }}
          />
        )}
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', config.installationItem.className)}>
        <InputSel
          name="installationItem"
          disabled={disabled}
          selectProps={{
            props: {
              menuPortalTarget: undefined,
              classNames: {
                menuPortal: (state) => classNames(scss.menuPortal, scss.plus),
              },
              options: optionsCreator_deliveryStatusInstallationItem(),
              value: state_installationItem,
              onChange: (v) => {
                setState_installationItem(v as Toption_installationItem | null);
              },
            },
          }}
        />
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', config.installationDate.className)}>
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

      <div className={classNames(scss.cell, isUndefined && 'invisible', config.installerEmployeesName.className)}>
        <InputSel
          name="installerEmployees"
          disabled={disabled}
          onClick={() => {
            !disabled && setShowModal(true);
          }}
          // inputProps={{
          //   props: {
          //     //
          //     value: state_employeeArr?.chName ?? state_outsourcing?.name ?? '',
          //     onChange: () => {},
          //   },
          // }}
          // textareaProps={{
          //   props: {
          //     maxRows: 3,
          //     value: (() => {
          //       if (state_employeeArr && state_employeeArr.length > 0) {
          //         return state_employeeArr.map((emp) => emp.chName).join('\n');
          //       } else if (state_outsourcing) {
          //         return state_outsourcing.name;
          //       } else {
          //         return '';
          //       }
          //     })(),
          //     onChange: () => {},
          //   },
          // }}
          suffix={
            <Select
              className={classNames(scss.antd_select, disabled && scss.disabled, scss.plus)}
              disabled={disabled}
              style={{ width: '160px' }}
              mode="multiple"
              value={(() => {
                if (state_employeeArr && state_employeeArr?.length > 0) {
                  return state_employeeArr.map((emp) => emp.chName);
                } else if (state_outsourcing) {
                  return [state_outsourcing.name];
                } else {
                  return undefined;
                }
              })()}
              open={false}
              removeIcon={null}
              autoFocus={false}
              bordered={false}
            />
          }
        />
      </div>

      <div className={classNames(scss.cell, isUndefined && 'invisible', config.itemName.className)}>
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
      <div className={classNames(scss.cell, isUndefined && 'invisible', config.notes.className)}>
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
            const outsourcingArr = dataArr[1];
            const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

            if (employeeArr.length === 0 && !outsourcing) {
              // myAlert.info({ title: '必須選擇安裝人員' });
              setState_EmployeeArr([]);
              setState_Outsourcing(null);
            } else if (employeeArr.length > 0 && !outsourcing) {
              setState_EmployeeArr(employeeArr);
              setState_Outsourcing(null);
            } else if (outsourcing && employeeArr.length === 0) {
              setState_EmployeeArr([]);
              setState_Outsourcing(outsourcing);
            } else {
              alert('意外錯誤，employeeArr與outsourcing都有資料');

              return;
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

// region batchProdPanel
// 被勾選的工作表，批次新增相同的管理單(deliveryStatus)
const BatchProdPanel = ({ className, onBatchAddClick }: { className?: string; onBatchAddClick?: () => void }) => {
  return (
    <div className={classNames(className)}>
      <Button onClick={onBatchAddClick}>批次新增</Button>
    </div>
  );
};

// region config

type TcellKeys =
  | 'serialNumber'
  | 'projectName'
  //
  | 'L'
  | 'WG'
  | 'h'
  | 'B'
  | 'qty'
  | 'implementationQty'
  | 'volume'
  | 'total_volume'
  | 'implementationVolume'
  | 'doorModelName'
  | 'material'
  | 'horsepower'
  | 'surface'
  //
  | 'projectName'
  | 'establishmentDate'
  //
  | 'accessorie'
  | 'btnBar'
  | 'installationItem'
  | 'shippingDate'
  | 'installationDate'
  | 'installerEmployeesName'
  | 'itemName'
  | 'notes'
  //
  | 'centerCheckBox';

type TconfigList = {
  [key in TcellKeys]: {
    caption: string;
    className: string;
    // width: number;
  };
};

const config: TconfigList = {
  serialNumber: {
    caption: '序號',
    className: 'w-7',
  },
  projectName: {
    caption: '工程名稱',
    className: 'w-16',
  },

  L: {
    caption: 'L',
    className: 'w-9',
  },
  WG: {
    caption: 'WG',
    className: 'w-9 text-center',
  },
  h: {
    caption: 'h',
    className: 'w-9 text-center',
  },
  B: {
    caption: 'B',
    className: 'w-9 text-center',
  },
  qty: {
    caption: '數量',
    className: 'w-8 text-center',
  },
  volume: {
    caption: '才數',
    className: 'w-12 text-center',
  },
  total_volume: {
    caption: '總才數',
    className: 'w-14 text-center',
  },
  implementationQty: {
    caption: '實作數量',
    className: 'w-[75px] text-center',
  },
  implementationVolume: {
    caption: '實作總才數',
    className: 'w-20 text-center',
  },
  doorModelName: {
    caption: '門型',
    className: 'w-16',
  },
  material: {
    caption: '材料',
    className: 'w-14',
  },
  horsepower: {
    caption: '馬力',
    className: 'w-14',
  },
  surface: {
    caption: '表面',
    className: 'w-8',
  },

  establishmentDate: {
    caption: '工作表開立日期',
    className: 'w-[98px]',
  },

  accessorie: {
    caption: '未用選配',
    className: 'w-52',
  },
  btnBar: {
    caption: '',
    className: 'w-[150px]',
  },
  installationItem: {
    caption: '安裝項目',
    className: 'w-28',
  },
  shippingDate: {
    caption: '出貨日期',
    className: 'w-28',
  },
  installationDate: {
    caption: '施工日期',
    className: 'w-28',
  },
  installerEmployeesName: {
    caption: '安裝人員',
    className: 'w-[160px]',
  },
  itemName: {
    caption: '項目',
    className: 'w-24',
  },
  notes: {
    caption: '備註',
    className: 'w-52',
  },
  centerCheckBox: {
    caption: '',
    className: 'w-8 text-center',
  },
};

//
