import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Select, SelectProps } from 'antd';

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
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateElectronicSuppliesPickupRecordDto,
  TupdateElectronicSuppliesPickupRecordDto,
  TcreateElectronicSuppliesRecordDetailDto,
  //
  useGetElectronicSuppliesPickupRecord_id,
  useElectronicSupplies_id,
  useGetElectronicSuppliesRequirementRecord_id,
  //
  apiPostElectronicSuppliesPickupRecord,
  apiPatchElectronicSuppliesPickupRecord,
} from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// css
import scss from './index.module.scss';

import {
  Tstate_electronicItem,
  Tstate_info,
  createEmptyStateInfo,
  orderDetailArr,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

// ==================================================================

type Tquery = {
  contractId: string | undefined;
  pickupRecordId: string | undefined;
};

type TstateList = {
  [key: string]: Tstate_electronicItem;
};

// ==================================================================

const SelectorGroup = selectModalCreator_multi<['employee_factoryDepartment', 'employee_factoryDepartment']>({
  selectorArr: [
    {
      key: 'employee_factoryDepartment',
      caption: '領料人員',
      tip: '單選',
      limit: 1,
    },
    {
      key: 'employee_factoryDepartment',
      caption: '備料人員',
      tip: '單選',
      limit: 1,
    },
  ],
});

// ==================================================================
export default function EditElectronicSuppliesPickup({
  CustomPageHeader,
}: {
  CustomPageHeader?: (props: { disabled: boolean }) => JSX.Element;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, pickupRecordId } = query;

  const isNew = !pickupRecordId;

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(!isNew);
  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  const [state_electronicItemList, setState_electronicItemList] = useState<TstateList>({});
  const [state_info, setState_info] = useState<Tstate_info>(createEmptyStateInfo());

  const [requirementRecordId, setRequirementRecordId] = useState<string>();

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

  // ------------------------------------------------------------------

  const defaultState = useMemo(() => {
    let { pickupRecordDetails = [] } = data_pickup ?? {};

    const list: { [key: string]: Tstate_electronicItem } = {};

    pickupRecordDetails = orderDetailArr({ detailArr: pickupRecordDetails });

    pickupRecordDetails.forEach((detail) => {
      const { id, category, itemName, quantity, unit, code } = detail;

      list[category] = {
        ...list[category], // 可能是undefined // 會將subItemName帶入
        id,
        category,
        itemName,
        quantity,
        unit,
        code,
      };

      //
    });

    return list;
  }, [data_pickup]);

  // ------------------------------------------------------------------

  // region REQUEST

  const reqPostPatch = async () => {
    if (!data_electronicSupplies?.id) {
      myAlert.err({
        title: '尚未取得送電備品資料',
      });

      return;
    }

    const pass = check_stateInfo(state_info);

    if (!pass) {
      myAlert.info({
        title: '請填寫必要欄位',
      });

      return;
    }

    let pickupRecordDetails: (TcreateElectronicSuppliesRecordDetailDto & { id?: string })[] = Object.values(
      state_electronicItemList
    ).map((item) => {
      const { id, category, itemName, quantity, unit, code, subItemName } = item;
      const detail = {
        // 必須要送id，若id為undefined將會新增一筆detail
        // 預期:新增時每一筆資料都沒有id、編輯時每一筆資料都有id，
        id,
        itemName,
        category,
        quantity,
        unit,
        code,
      };

      return detail;
    });

    if (isNew) {
      pickupRecordDetails = pickupRecordDetails.filter((detail) => !!detail.quantity);
    }

    const body: TcreateElectronicSuppliesPickupRecordDto = {
      operationDate: state_info.date!.toISOString(),
      takeOffEmployeeId: state_info.picker!.id,
      action: '領取',
      preparationEmployeeId: state_info.preparer!.id,
      doorModel: state_info.doorModelName!,
      requirementRecordId: requirementRecordId || null,

      pickupRecordDetails,
      totalQuantity: Number(state_info.doorQty || 0),
    };

    if (isNew) {
      await apiPostElectronicSuppliesPickupRecord(data_electronicSupplies.id, body).then(async (res) => {
        router.replace({
          query: {
            ...query,
            pickupRecordId: res.id,
          },
        });
        setDisabled(true);
      });
    } else if (!data_pickup?.id) {
      myAlert.err({ title: '沒有領取單id' });

      return;
    } else {
      await apiPatchElectronicSuppliesPickupRecord(data_pickup.id, body).then(async () => {
        await update_pickup();
        setDisabled(true);
      });
    }
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

  const editCategoryValue = ({ key, categoryValue }: { key: string; categoryValue: string }) => {
    setState_electronicItemList((state) => {
      return {
        ...state,
        [key]: {
          ...state[key],
          categoryParam: categoryValue,
        },
      };
    });
  };

  const replaceState = () => {
    let requirementRecords = data_electronicSupplies?.requirementRecords ?? [];

    requirementRecords = requirementRecords.filter((record) => {
      return requirementRecordId?.includes(record.id);
    });

    let detailArr = requirementRecords
      .flatMap((record) => record.requirementRecordDetails)
      .filter((detail) => !!detail);
    detailArr = orderDetailArr({ detailArr });

    const list: { [key: string]: Tstate_electronicItem } = {};

    detailArr.forEach((detail) => {
      const { category, itemName, quantity, unit, code } = detail;

      const subItemName = itemName === '控制箱/盤' ? '捲門/水閘門' : undefined;

      if (!list[category]) {
        list[category] = {
          category,
          categoryParam: category,
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

  const groupArr = useStateToGroup({
    stateArr: Object.values(state_electronicItemList),
    handler_editItemQty: editItemQty,
    handler_editCategoryValue: editCategoryValue,
    disabled,
  });
  //
  // Object.values(state_electronicItemList),
  // editItemQty

  // ------------------------------------------------------------------
  // region PROPS

  const requirementRecordOptions = useMemo(() => {
    let requirementRecords = data_electronicSupplies?.requirementRecords ?? [];
    requirementRecords = _.orderBy(requirementRecords, 'createdAt');

    return requirementRecords.map((record) => {
      const { isPickupRecordAlreadyChoose } = record;

      const option: NonNullable<SelectProps['options']>[number] = {
        value: record.id,
        label: record.number || '無單號',
        className: classNames(isPickupRecordAlreadyChoose && scss.antd_usedOption),
      };

      return option;
    });

    //
  }, [data_electronicSupplies?.requirementRecords]);

  const defaultSeletedDataArrArr: Parameters<typeof SelectorGroup>[0]['defaultSeletedDataArrArr'] = useMemo(() => {
    const arr_picker = [];
    const arr_preparer = [];

    state_info.picker && arr_picker.push(state_info.picker);
    state_info.preparer && arr_preparer.push(state_info.preparer);

    return [arr_picker];
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
      onClick: reqPostPatch,
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
      onClick: reqPostPatch,
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

    let stateInfo = createEmptyStateInfo();

    if (data_pickup) {
      stateInfo = {
        date: data_pickup.operationDate ? moment(data_pickup.operationDate) : null,
        indexNumber: data_pickup.number || '',
        picker: data_pickup.preparationEmployee || undefined,
        preparer: data_pickup.takeOffEmployee || undefined,
        doorModelName: data_pickup.doorModel ?? '',
        doorQty: String(data_pickup.totalQuantity ?? '') as Tstate_info['doorQty'],
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
      {CustomPageHeader && <CustomPageHeader disabled={disabled} />}
      {!CustomPageHeader && (
        <PageHeader
          returnBtn={disabled}
          panelList={panelList}
          contractNumber={data_contract?.contractNumber ?? '---'}
        />
      )}

      <div className={scss.container}>
        {/* info */}
        <div className={scss.info}>
          <InputSel
            className="global_tip_must"
            caption="領取日期"
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

          <InputSel
            className="global_tip_must"
            caption="領料人員"
            {...config_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{
              props: {
                placeholder: '',
                value: state_info.picker?.chName ?? '',
                onChange: () => {},
              },
            }}
          />

          <InputSel
            className="global_tip_must"
            caption="備料人員"
            {...config_inputSel}
            disabled={disabled}
            onClick={() => setShowSelector(true)}
            inputProps={{
              props: {
                placeholder: '',
                value: state_info.preparer?.chName ?? '',
                onChange: () => {},
              },
            }}
          />
          <InputSel
            className="global_tip_must"
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
          <InputSel
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
          />
        </div>

        {isNew && (
          <div className={classNames(scss.selectBar, disabled && 'invisible')}>
            <Select
              placeholder="請選擇需求單"
              size="large"
              // className="w-96"
              className={classNames('w-36')}
              // mode="multiple"
              allowClear
              options={requirementRecordOptions}
              value={requirementRecordId}
              onChange={(value) => {
                setRequirementRecordId(value);
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
            const picker = arr[0][0];
            const preparer = arr[1][0];

            setState_info((state) => ({
              ...state,
              picker,
              preparer,
            }));
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

const check_stateInfo = (state_info: Tstate_info) => {
  let pass = true;

  !state_info.date && (pass = false);
  !state_info.preparer && (pass = false);
  !state_info.picker && (pass = false);
  !state_info.doorModelName && (pass = false);

  return pass;
};
