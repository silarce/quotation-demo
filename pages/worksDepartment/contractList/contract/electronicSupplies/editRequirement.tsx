import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from 'lodash';
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
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './editRequirement.module.scss';

// api
import {
  TcreateElectronicSuppliesRequirementRecordDto,
  TcreateElectronicSuppliesRecordDetailDto,
  //
  apiPostElectronicSuppliesRequirementRecord,
  //
  useGetElectronicSuppliesRequirementRecord_id,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels } from 'js/api/api_product';

import { useGetContract_id } from 'js/api/api_quotation';

// type
import {
  Tstate_electronicItem,
  Tstate_info,
  //
  createEmployeeStateInfo,
} from '.';
import {
  //
  TelectronicSuppliesDefaultItemName,
  TemployeeDto,
  TelectronicSuppliesRequirementRecordDto,
  TelectronicSuppliesDefaultCategory,
} from 'js/api/dtoTypes';

// ==================================================================
type Tquery = {
  contractId: string | undefined;
  requirementRecordId: string | undefined;
};

type TstateList = {
  [key: string]: Tstate_electronicItem;
};

// ==================================================================

const SelectorGroup = selectModalCreator_multi<['employee']>({
  selectorArr: [
    // {
    //   key: 'employee',
    //   caption: '領料人員',
    //   tip: '單選',
    //   limit: 1,
    // },
    {
      key: 'employee',
      caption: '備料人員',
      tip: '單選',
      limit: 1,
    },
  ],
});

// ==================================================================

// MARK: START

export default function EditRequirementRecord() {
  const router = useRouter();
  const { contractId, requirementRecordId } = router.query as Tquery;
  const isNew = !requirementRecordId;

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(!isNew);
  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------

  const [state_electronicItemList, setState_electronicItemList] = useState<TstateList>({});
  const [state_info, setState_info] = useState<Tstate_info>(createEmployeeStateInfo());

  // ------------------------------------------------------------------

  const { data: data_contract, update: update_contract } = useGetContract_id(contractId, {
    // customPopulate: [
    //   //
    //   'engineeringContact',
    // ],
  });

  const {
    data: data_requirementRecord,
    // update: update_requirementRecord,
    isFetching: isFetching_requirementRecord,
  } = useGetElectronicSuppliesRequirementRecord_id(requirementRecordId, {
    autoUpdate: !isNew,
  });

  const { electronicSuppliesId } = data_contract ?? {};

  const { options_doorModel, update: update_doorModelList } = useApiGetProdDoorModels();

  // ------------------------------------------------------------------

  // region REQUIREST

  const reqPost = async () => {
    state_electronicItemList;
    state_info;

    const {
      date,
      // indexNumber,
      // picker,
      preparer,
      doorModelName,
      //  doorQty
    } = state_info;

    const requirementRecordDetails: TcreateElectronicSuppliesRecordDetailDto[] = Object.values(
      state_electronicItemList
    ).map((item) => {
      const { id, category, itemName, quantity, unit, code, subItemName } = item;

      return {
        itemName,
        category,
        quantity,
        unit,
        code,
      };
    });

    if (!electronicSuppliesId) {
      myAlert.err({ title: '沒有electronicSuppliesId' });

      return;
    }

    if (!date) {
      myAlert.err({ title: '請設定需求日期' });

      return;
    }

    if (!preparer) {
      myAlert.err({ title: '請選擇備料人員' });

      return;
    }

    const body: TcreateElectronicSuppliesRequirementRecordDto = {
      operationDate: date?.toISOString(),
      storageManagementPersonnelId: preparer.id,
      doorType: doorModelName || null,
      requirementRecordDetails,
    };

    // apiPostElectronicSuppliesRequirementRecord
    await apiPostElectronicSuppliesRequirementRecord(electronicSuppliesId, body).then(() => {
      setDisabled(true);
    });
    // .catch(() => {});
  };

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
  const defaultSeletedDataArrArr: Parameters<typeof SelectorGroup>[0]['defaultSeletedDataArrArr'] = useMemo(() => {
    // const arr01 = [];
    const arr02 = [];

    // state_info.picker && arr01.push(state_info.picker);
    state_info.preparer && arr02.push(state_info.preparer);

    return [
      // arr01,
      arr02,
    ];
  }, [state_info.picker, state_info.preparer]);

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
      onClick: () => {
        alert('上傳');
      },
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
      onClick: reqPost,
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
    update_contract();
  }, []);

  useEffect(() => {
    if (!disabled && data_requirementRecord) {
      return;
    }

    const { defaultStateList } = createDefaultState();

    const {
      electronicSuppliesId,
      electronicSupplies,
      operationDate,
      agentEmployeeId,
      agentEmployee,
      requirementRecordDetails = [],
      doorType,
      storageManagementPersonnel,
      storageManagementPersonnelId,
    } = data_requirementRecord ?? {};

    requirementRecordDetails.forEach((detail) => {
      const { category, itemName, quantity, unit, code } = detail;

      defaultStateList[category] = {
        ...defaultStateList[category], // 可能是undefined // 會將subItemName帶入
        category,
        itemName,
        quantity,
        unit,
        code,
      };

      //
    });

    let stateInfo = createEmployeeStateInfo();

    if (data_requirementRecord) {
      stateInfo = {
        date: data_requirementRecord.operationDate ? moment(data_requirementRecord.operationDate) : null,
        indexNumber: '',
        picker: undefined,
        preparer: data_requirementRecord.storageManagementPersonnel || undefined,
        doorModelName: data_requirementRecord.doorType ?? '',
      };
    }

    setState_electronicItemList(defaultStateList);
    setState_info(stateInfo);
  }, [disabled, data_requirementRecord]);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isFetching_requirementRecord}>
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
            {...confit_inputSel}
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
            {...confit_inputSel}
            disabled={disabled}
            inputProps={{ props: { defaultValue: state_info.indexNumber } }}
          />

          {/* <InputSel
            caption="領料人員"
            {...confit_inputSel}
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
            {...confit_inputSel}
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
            {...confit_inputSel}
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
            {...confit_inputSel}
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
          valueLabelArr={['需求數量']}
          groupArr={groupArr}
          disabled={disabled}
        />

        {/*  */}
      </div>
      <SelectorGroup
        showModal={showSelector}
        defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        onConfirm={(arr) => {
          // const picker = arr[0][0] as TemployeeDto | undefined;
          // const preparer = arr[1][0] as TemployeeDto | undefined;

          const preparer = arr[0][0] as TemployeeDto | undefined;

          setState_info((state) => ({
            ...state,
            // picker,
            preparer,
          }));
        }}
        onCancel={() => {
          setShowSelector(false);
        }}
      />
    </SubLayer>
  );
}

// MARK: END

// ==================================================================

const confit_inputSel: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: '80px' },
  wrapperStyle: { gap: '25px' },
};

// ==================================================================

// region DEFAULT

// const defaultStateList: {
//   [key in TelectronicSuppliesDefaultCategory[keyof TelectronicSuppliesDefaultCategory]]: Tstate;
// } = {
//   '智慧型（含主機）': {
//     itemName: '鎖盒',
//     category: '智慧型（含主機）',
//     quantity: null,
//   },
// };

// w category應該會是唯一的，並且之後會用category作為key
const defaultStateArr_鎖盒: Tstate_electronicItem[] = [
  {
    category: '智慧型（含主機）',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發訊器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發射器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發訊器 + 發射器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '面板式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '埋入式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '外露式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_鎖匙: Tstate_electronicItem[] = [
  {
    category: '鎖號',
    itemName: '鎖匙',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '特殊鎖號',
    itemName: '鎖匙',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_控制箱盤: Tstate_electronicItem[] = [
  {
    category: '3HP馬達控制箱(380V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(380V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '3HP馬達控制箱(220V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(220V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_押扣: Tstate_electronicItem[] = [
  {
    itemName: '押扣',
    subItemName: undefined,
    category: '三點式(一般)',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_消防備品: Tstate_electronicItem[] = [
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '煙感器',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 1φ 220v',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 3φ 380v',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_主機: Tstate_electronicItem[] = [
  {
    itemName: '主機',
    subItemName: undefined,
    category: '遙控器（1:2）+ 障感器',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '遙控器（1:2）',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '障感器',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_紅外線: Tstate_electronicItem[] = [
  {
    itemName: '紅外線',
    subItemName: undefined,
    category: '反射式',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '紅外線',
    subItemName: undefined,
    category: '對照式',
    quantity: null,
    unit: null,
    code: null,
  },
];

const createDefaultState = () => {
  const defaultStateArr = _.cloneDeep([
    ...defaultStateArr_鎖盒,
    ...defaultStateArr_鎖匙,
    ...defaultStateArr_控制箱盤,
    ...defaultStateArr_押扣,
    ...defaultStateArr_消防備品,
    ...defaultStateArr_主機,
    ...defaultStateArr_紅外線,
  ]);

  const defaultStateList: { [key: string]: Tstate_electronicItem } = {};

  defaultStateArr.forEach((item) => {
    const { category } = item;
    defaultStateList[category] = item;
  });

  return {
    defaultStateArr,
    defaultStateList,
  };
};
