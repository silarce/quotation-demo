import { useState, useEffect, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';

// antd
import { Modal, ModalProps, Select } from 'antd';

// gear
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

//
import { optionsCreator_deliveryStatusInstallationItem } from 'js/utils/options/productOptions';

// type
import { TemployeeDto, ToutsourcingDto, TdeliveryStatusInstallationItem } from 'js/api/dtoTypes';
import { TcreateEngineeringDeliveryStatusDto } from 'js/api/api_engineering';

// css
import scss from './modal_newDeliveryStatu.module.scss';

// ======================================================================

type Toption_generics<E extends string> = { value: E; label: string };
type Toption_installationItem = Toption_generics<TdeliveryStatusInstallationItem>;

type Tstate = {
  installationDate: Dayjs | null;
  shippingDate: Dayjs | null;
  itemName: string;
  notes: string;
};

type TpreCreateEngineeringDeliveryStatusDto = Omit<TcreateEngineeringDeliveryStatusDto, 'productItemId'>;

export type { TpreCreateEngineeringDeliveryStatusDto };

// ======================================================================

const SelectorGroup = selectModalCreator_multi<['employee', 'outsourcing']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '員工',
      // tip: '單選',
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

// ============================================================================
export default function Modal_newDeliveryStatu({
  visible,
  onCancel,
  onConfirm,
}: {
  onConfirm: (body: TpreCreateEngineeringDeliveryStatusDto) => void;
} & ModalProps) {
  //
  const [showSelector, setShowSelector] = useState(false);

  const [state_employeeArr, setState_EmployeeArr] = useState<TemployeeDto[]>();
  const [state_outsourcing, setState_Outsourcing] = useState<ToutsourcingDto>();
  const [state_installationItem, setState_installationItem] = useState<Toption_installationItem | null>(null);

  const [state, setState] = useState<Tstate>({
    installationDate: null,
    shippingDate: null,
    itemName: '',
    notes: '',
  });

  // -----------------------------------------------------------------------
  const reset = () => {
    setState({
      installationDate: null,
      shippingDate: null,
      itemName: '',
      notes: '',
    });
    setState_EmployeeArr(undefined);
    setState_Outsourcing(undefined);
    setState_installationItem(null);
  };

  const confirm = () => {
    const employeeIdArr = state_employeeArr?.map((em) => em.id) || null;

    const body: Omit<TcreateEngineeringDeliveryStatusDto, 'productItemId'> = {
      notes: state.notes,
      itemName: state.itemName,
      shippingDate: state.shippingDate?.toISOString() || null,
      installationDate: state.installationDate?.toISOString() || null,
      installerOutsourcingId: state_outsourcing?.id || null,
      installerEmployees: employeeIdArr,
      installationItem: state_installationItem?.value || null,

      append: null,
      completeAppend: null,
    };
    onConfirm(body);
  };

  // -----------------------------------------------------------------------------

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

  const installManNameArr =
    state_employeeArr?.map((em) => em.chName) ||
    (state_outsourcing ? [state_outsourcing.name || '未設定姓名'] : undefined);
  // -----------------------------------------------------------------------------

  useEffect(() => {
    !visible && reset();
  }, [visible]);

  // -----------------------------------------------------------------------------

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} destroyOnHidden={true} width={800}>
      <div className={scss.body}>
        <p className={scss.caption}>批次新增管理單</p>

        {/*  */}
        <div className={scss.grid}>
          <InputSel
            name="component"
            caption="安裝項目"
            {...config}
            selectProps={{
              props: {
                options: optionsCreator_deliveryStatusInstallationItem(),
                menuPortalTarget: undefined,
                value: state_installationItem,
                onChange: (v) => {
                  setState_installationItem(v as Toption_installationItem | null);
                },
              },
            }}
          />

          <InputSel
            name="installerEmployees"
            caption="安裝人員"
            {...config}
            onClick={() => {
              setShowSelector(true);
            }}
            // inputProps={{
            //   props: { value: state_employeeArr?.chName ?? state_outsourcing?.name ?? '', onChange: () => {} },
            // }}
            suffix={
              <Select
                className={classNames(scss.antd_select)}
                mode="multiple"
                // value={state_employeeArr?.map((em) => em.chName)}
                value={installManNameArr}
                open={false}
                removeIcon={null}
                style={{ width: '231px' }}
                autoFocus={false}
                bordered={false}
              />
            }
          />

          <InputSel
            name="shippingDate"
            caption="出貨日期"
            {...config}
            datePickerProps={{
              props: {
                value: state.shippingDate ? dayjs(state.shippingDate) : undefined,
                onChange: (v) => {
                  setState((state) => ({
                    ...state,
                    shippingDate: v,
                  }));
                },
              },
            }}
          />

          <InputSel
            name="installationDate"
            caption="施工日期"
            {...config}
            datePickerProps={{
              props: {
                value: state.installationDate ? dayjs(state.installationDate) : undefined,
                onChange: (v) => {
                  setState((state) => ({
                    ...state,
                    installationDate: v,
                  }));
                },
              },
            }}
          />

          <InputSel
            name="itemName"
            caption="項目"
            {...config}
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

          <InputSel
            name="notes"
            caption="備註"
            {...config}
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

          <SelectorGroup
            showModal={showSelector}
            caption="安裝人員，選擇員工或外包廠商"
            tip="員工或外包擇一"
            onConfirm={(dataArr) => {
              const employeeArr = dataArr[0] ? dataArr[0] : undefined;

              const outsourcingArr = dataArr[1];
              const outsourcing = outsourcingArr[0] as (typeof outsourcingArr)[0] | undefined;

              if (!employeeArr && !outsourcing) {
                myAlert.info({ title: '必須選擇安裝人員' });

                return;
              }

              if (employeeArr) {
                setState_EmployeeArr(employeeArr);
                setState_Outsourcing(undefined);
              }

              if (outsourcing) {
                setState_EmployeeArr(undefined);
                setState_Outsourcing(outsourcing);
              }

              setShowSelector(false);
            }}
            onCancel={() => {
              setShowSelector(false);
            }}
            isCancelOnConfirm={false}
            defaultSeletedDataArrArr={defaultSeletedDataArrArr}
          />

          {/*  */}
        </div>
        {/*  */}
        <div className={scss.footer}>
          <MyButton_v2 onClick={confirm}>確定</MyButton_v2>
          <MyButton_v2 theme="danger" onClick={onCancel}>
            取消
          </MyButton_v2>
        </div>
        {/*  */}
      </div>
    </Modal>
  );
}

// ===============================================================================

const config: TinputSelProps = {
  captionStyle: { width: '80px' },
};

// const configList: { [key: string]: TinputSelProps } = {};
