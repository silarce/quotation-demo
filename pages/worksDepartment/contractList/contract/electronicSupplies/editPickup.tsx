import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Select } from 'antd';

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
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import {
  //
  useGetElectronicSuppliesPickupRecord_id,
  useElectronicSupplies_id,
  useGetElectronicSuppliesRequirementRecord_id,
} from 'js/api/api_engineering';
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

  const [requirementRecordIdArr, setRequirementRecordIdArr] = useState<string[]>();

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

  const {
    data: data_electronicSupplies,
    update: update_electronicSupplies,
    isFetching: isFetching_electronicSupplies,
  } = useElectronicSupplies_id(electronicSuppliesId, {
    params_cover: {
      populate: ['requirementRecords.requirementRecordDetails'],
    },
  });

  // const { data: data_requirementRecord } = useGetElectronicSuppliesRequirementRecord_id(requirementRecordId);

  // ------------------------------------------------------------------

  const defaultState = useMemo(() => {
    const { pickupRecordDetails = [] } = data_pickup ?? {};

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

    // let stateInfo = createEmptyStateInfo();

    // if (data_pickup) {
    //   stateInfo = {
    //     date: data_pickup.operationDate ? moment(data_pickup.operationDate) : null,
    //     indexNumber: data_pickup.number,
    //     picker: undefined,
    //     preparer: data_pickup.takeOffEmployee || undefined,
    //     doorModelName: data_pickup.doorType ?? '',
    //   };
    // }

    return list;
  }, [data_pickup]);

  // const requirementState = useMemo(() => {
  //   let requirementRecords = data_electronicSupplies?.requirementRecords ?? [];

  //   requirementRecords = requirementRecords.filter((record) => {
  //     return requirementRecordIdArr?.includes(record.id);
  //   });

  //   const detailArr = requirementRecords
  //     .flatMap((record) => record.requirementRecordDetails)
  //     .filter((detail) => !!detail);

  //   const list: { [key: string]: Tstate_electronicItem } = {};

  //   detailArr.forEach((detail) => {
  //     const { category, itemName, quantity, unit, code } = detail;

  //     if (!list[category]) {
  //       list[category] = {
  //         category,
  //         itemName,
  //         quantity: quantity || 0,
  //         unit,
  //         code,
  //       };
  //     } else {
  //       list[category].quantity! += quantity || 0;
  //     }
  //   });

  //   return list;
  // }, [data_electronicSupplies?.requirementRecords, requirementRecordIdArr]);

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

  const replaceState = () => {
    let requirementRecords = data_electronicSupplies?.requirementRecords ?? [];

    requirementRecords = requirementRecords.filter((record) => {
      return requirementRecordIdArr?.includes(record.id);
    });

    const detailArr = requirementRecords
      .flatMap((record) => record.requirementRecordDetails)
      .filter((detail) => !!detail);

    const list: { [key: string]: Tstate_electronicItem } = {};

    detailArr.forEach((detail) => {
      const { category, itemName, quantity, unit, code } = detail;

      const subItemName = itemName === '控制箱/盤' ? '捲門/水閘門' : undefined;

      if (!list[category]) {
        list[category] = {
          category,
          itemName,
          quantity: quantity || 0,
          unit,
          code,
          subItemName,
        };
      } else {
        list[category].quantity! += quantity || 0;
      }
    });

    setState_electronicItemList(list);
  };

  // ------------------------------------------------------------------

  const groupArr = useStateToGroup(Object.values(state_electronicItemList), editItemQty);

  // ------------------------------------------------------------------
  // region PROPS

  const requirementRecordOptions = useMemo(() => {
    const requirementRecords = data_electronicSupplies?.requirementRecords ?? [];

    return requirementRecords.map((record) => {
      return {
        value: record.id,
        label: record.number || '無單號',
      };
    });

    //
  }, [data_electronicSupplies?.requirementRecords]);

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

  // useEffect(() => {
  //   if (!disabled && data_pickup) {
  //     return;
  //   }

  //   const { pickupRecordDetails = [] } = data_pickup ?? {};

  //   const list: { [key: string]: Tstate_electronicItem } = {};

  //   pickupRecordDetails.forEach((detail) => {
  //     const {
  //       category,
  //       itemName,
  //       quantity,
  //       unit,
  //       //  code
  //     } = detail;

  //     list[category] = {
  //       ...list[category], // 可能是undefined // 會將subItemName帶入
  //       category,
  //       itemName,
  //       quantity,
  //       unit,
  //       // code,
  //     };

  //     //
  //   });

  //   let stateInfo = createEmptyStateInfo();

  //   if (data_pickup) {
  //     stateInfo = {
  //       date: data_pickup.operationDate ? moment(data_pickup.operationDate) : null,
  //       indexNumber: data_pickup.number,
  //       picker: undefined,
  //       preparer: data_pickup.takeOffEmployee || undefined,
  //       doorModelName: data_pickup.doorType ?? '',
  //     };
  //   }

  //   setState_electronicItemList(list);
  //   setState_info(stateInfo);
  // }, [disabled, data_pickup]);
  useEffect(() => {
    if (!disabled && data_pickup) {
      return;
    }

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

    setState_info(stateInfo);
  }, [disabled, data_pickup]);

  useEffect(() => {
    if (disabled) {
      setState_electronicItemList(defaultState);
    }
  }, [defaultState]);

  // ------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={data_contract?.contractNumber ?? '---'} />

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

        {isNew && (
          <div className={scss.selectBar}>
            <Select
              placeholder="請選擇需求單"
              size="large"
              className="w-96"
              mode="multiple"
              allowClear
              options={requirementRecordOptions}
              value={requirementRecordIdArr}
              onChange={(value) => {
                setRequirementRecordIdArr(value as string[]);
              }}
            />
            <MyButton_v2 px="px22" py="py4" onClick={replaceState}>
              代入需求單
            </MyButton_v2>
          </div>
        )}

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
