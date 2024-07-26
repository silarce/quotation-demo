import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyTable, {
  Tgroup,
  Tprops_cell,
  Tprops_cell_input,
  //
  useStateToGroup,
} from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// api
import { useGetElectronicSuppliesPickupRecord_id } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// css
import scss from './editPickup.module.scss';

// type
import {
  Tstate_electronicItem,
  Tstate_info,
  //
  createEmptyStateInfo,
} from '.';

import { TemployeeDto } from 'js/api/dtoTypes';

// ==================================================================

type Tquery = {
  contractId: string | undefined;
  pickupRecordId: string | undefined;
};

type TstateList = {
  [key: string]: Tstate_electronicItem;
};

// ==================================================================

const SelectorGroup = selectModalCreator_multi<['employee']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '領料人員',
      tip: '單選',
      limit: 1,
    },
  ],
});

// ==================================================================
export default function EditPickup() {
  const router = useRouter();
  const { contractId, pickupRecordId } = router.query as Tquery;
  const isNew = !pickupRecordId;

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  const [state_electronicItemList, setState_electronicItemList] = useState<TstateList>({});
  const [state_info, setState_info] = useState<Tstate_info>(createEmptyStateInfo());

  // ------------------------------------------------------------------

  const { data: data_contract, update: update_contract } = useGetContract_id(contractId, {
    // customPopulate: [
    //   //
    //   'engineeringContact',
    // ],
  });

  const {
    data: data_pickup,
    update: update_pickup,
    isFetching,
  } = useGetElectronicSuppliesPickupRecord_id(pickupRecordId);

  const { electronicSuppliesId } = data_contract ?? {};
  const { options_doorModel, update: update_doorModelList } = useApiGetProdDoorModels();

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  // region FUNCTION

  const editItemQty = (key: string, qty: number) => {
    setState_electronicItemList((state) => {
      return {
        ...state,
        [key]: {
          ...state[key],
          quantity: qty,
        },
      };
    });
  };
  // ------------------------------------------------------------------

  const groupArr = useStateToGroup(Object.values(state_electronicItemList), editItemQty);

  // ------------------------------------------------------------------
  // region PROPS

  // region PROPS
  const defaultSeletedDataArrArr: Parameters<typeof SelectorGroup>[0]['defaultSeletedDataArrArr'] = useMemo(() => {
    const arr01 = [];

    state_info.picker && arr01.push(state_info.picker);

    return [arr01];
  }, [state_info.picker]);

  const panelList_disabled: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList_enabled: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList_new: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList = isNew ? panelList_new : disabled ? panelList_disabled : panelList_enabled;

  // ------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    update_doorModelList();
  }, []);

  useEffect(() => {
    update_contract();
  }, [contractId]);

  useEffect(() => {
    if (!disabled && data_pickup) {
      return;
    }

    const {
      // electronicSuppliesId,
      // electronicSupplies,
      // operationDate,
      // agentEmployeeId,
      // agentEmployee,
      pickupRecordDetails = [],
      // doorType,
      // storageManagementPersonnel,
      // storageManagementPersonnelId,
      // number: idNumber,
    } = data_pickup ?? {};

    const list: { [key: string]: Tstate_electronicItem } = {};

    pickupRecordDetails.forEach((detail) => {
      const {
        category,
        itemName,
        quantity,
        unit,
        //  code
      } = detail;

      list[category] = {
        ...list[category], // 可能是undefined // 會將subItemName帶入
        category,
        itemName,
        quantity,
        unit,
        // code,
      };

      //
    });

    let stateInfo = createEmptyStateInfo();

    if (data_pickup) {
      stateInfo = {
        date: data_pickup.operationDate ? moment(data_pickup.operationDate) : null,
        indexNumber: data_pickup.number,
        picker: undefined,
        preparer: data_pickup.takeOffEmployee || undefined,
        doorModelName: data_pickup.doorType ?? '',
      };
    }

    setState_electronicItemList(list);
    setState_info(stateInfo);
  }, [disabled, data_pickup]);

  // ------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader
        panelList={panelList}
        //  contractNumber={contract?.contractNumber ?? '---'}
        contractNumber={'foooo'}
      />

      <div className={scss.container}>
        {/* info */}
        <div className={scss.info}>
          <InputSel
            caption="需求日期"
            {...config_inputSel}
            disabled={disabled}
            datePickerProps={{
              props: {
                value: state_info.date,
                onChange: (date_m) => {
                  setState_info((state) => ({
                    ...state,
                    date: date_m,
                  }));
                },
              },
            }}
          />
          <InputSel
            key={state_info.indexNumber}
            caption="領料單號"
            {...config_inputSel}
            disabled={true}
            inputProps={{ props: { defaultValue: state_info.indexNumber } }}
          />

          {/* <InputSel
            caption="領料人員"
            {...config_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{
              props: {
                placeholder: '',
                value: state_info.picker?.chName ?? '',
              },
            }}
          /> */}

          <InputSel
            caption="備料人員"
            {...config_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{
              props: {
                placeholder: '',
                value: state_info.preparer?.chName ?? '',
              },
            }}
          />
          <InputSel
            caption="門型"
            {...config_inputSel}
            disabled={disabled}
            selectProps={{
              props: {
                isSearchable: true,
                options: options_doorModel,
                value: { value: state_info.doorModelName ?? '', label: state_info.doorModelName ?? '' },
                onChange: (option) => {
                  setState_info((state) => ({ ...state, doorModelName: option?.value ?? '' }));
                },
              },
            }}
          />
          {/* <InputSel
            caption="樘數"
            {...config_inputSel}
            disabled={disabled}
            inputProps={{
              props: {
                type: 'number',
                value: state_info.doorQty,
                onChange: (e) => {
                  const value = e.target.value as `${number}` | '';
                  setState_info((state) => ({ ...state, doorQty: value }));
                },
              },
            }}
          /> */}
        </div>
        {/* table */}
        <SupplyTable
          className="border border-border mt-10"
          valueLabelArr={['領取數量']}
          groupArr={groupArr}
          disabled={disabled}
        />
        {/*  */}
        <SelectorGroup
          showModal={showSelector}
          onConfirm={(arr) => {
            // setEmployee00(arr[0][0]);
            // setEmployee01(arr[1][0]);
          }}
          onCancel={() => {
            setShowSelector(false);
          }}
          defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        />
      </div>
    </SubLayer>
  );
}

// ==================================================================

// region CONFIG

const config_inputSel: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: '80px' },
  wrapperStyle: { gap: '25px' },
};

// ============================================================================
