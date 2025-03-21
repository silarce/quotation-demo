import { useState, useEffect, useMemo, useReducer, Fragment } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyTable, { useStateToGroup } from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';

// antd
import { Select as AntdSelect } from 'antd';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import DataEntry from 'components/global/gear/dataEntry';

// css
import scss from './editRequirement.module.scss';

// api
import {
  TcreateElectronicSuppliesRequirementRecordDto,
  TcreateElectronicSuppliesRecordDetailDto,
  TupdateElectronicSuppliesRequirementRecordDto,
  //
  apiPostElectronicSuppliesRequirementRecord,
  apiPatchElectronicSuppliesRequirementRecord,
  // apiGetDefaultElectronicSuppliesRequirementData,
  //
  useGetElectronicSuppliesRequirementRecord_id,
  useGetDefaultElectronicSuppliesRequirementData,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels } from 'js/api/api_product';

import { useGetContract_id } from 'js/api/api_quotation';

import {
  Tstate_info,
  createEmptyStateInfo,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

import { TemployeeDto } from 'js/api/dtoTypes';

// ==================================================================

import {
  useElectronicSuppliesRequirement,
  Tstate_electronicItem,
} from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

// ==================================================================
type Tquery = {
  contractId: string | undefined;
  requirementRecordId: string | undefined;
};

type Taction =
  | {
      type: 'checked';
      payload: {
        index: number;
        checked: boolean;
      };
    }
  | {
      type: 'category';
      payload: {
        index: number;
        category: string;
      };
    }
  | {
      type: 'qty';
      payload: {
        index: number;
        qty: number | `${number}` | '';
      };
    };

// ==================================================================

const SelectorGroup = selectModalCreator_multi<['employee_factoryDepartment']>({
  selectorArr: [
    {
      key: 'employee_factoryDepartment',
      caption: '備料人員',
      tip: '單選',
      limit: 1,
    },
  ],
});

const config_inputSel: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: '80px' },
  wrapperStyle: { gap: '25px' },
};

const check_stateInfo = (state_info: Tstate_info) => {
  let pass = true;

  !state_info.date && (pass = false);
  !state_info.preparer && (pass = false);
  !state_info.doorModelName && (pass = false);

  return pass;
};

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

  const {
    state_electronicItemDict,
    dispatch,
    replaceState: replaceState_electronicSuppliesRequirment,
    createAddCategory,
  } = useElectronicSuppliesRequirement();

  const [state_info, setState_info] = useState<Tstate_info>(createEmptyStateInfo());

  // ------------------------------------------------------------------

  const { data: data_contract, update: update_contract, contactThatSkipContract } = useGetContract_id(contractId);

  const {
    data: data_requirementRecord,
    update: update_requirementRecord,
    // isFetching: isFetching_requirementRecord,
  } = useGetElectronicSuppliesRequirementRecord_id(requirementRecordId, {
    autoUpdate: !isNew,
  });

  const { defaultElectronicSuppliesRequirementArr, worksheetIdArr, electronicSuppliesId } =
    useGetDefaultElectronicSuppliesRequirementData(contractId, {
      autoUpdate: isNew,
    });

  const { options_doorModel, update: update_doorModelList } = useApiGetProdDoorModels();

  // ------------------------------------------------------------------

  // region REQUIREST

  const reqPostPatch = async () => {
    const {
      date,
      // indexNumber,
      // picker,
      preparer,
      doorModelName,
      doorQty,
    } = state_info;

    const pass = check_stateInfo(state_info);

    if (!pass) {
      myAlert.info({
        title: '請填寫必要欄位',
      });

      return;
    }

    let requirementRecordDetails: TcreateElectronicSuppliesRecordDetailDto[] = Object.values(
      state_electronicItemDict
    ).map((item) => {
      const { id, category, itemName, quantity, unit, code, subItemName, categoryParam } = item;

      return {
        // 必須要送id，若id為undefined將會新增一筆detail
        // 預期:新增時每一筆資料都沒有id、編輯時每一筆資料都有id，
        id,
        itemName,
        category,
        quantity,
        unit,
        code,
        categoryParam,
      };
    });

    if (isNew) {
      requirementRecordDetails = requirementRecordDetails.filter((details) => {
        return !!details.quantity;
      });
    }

    const body: Pick<
      TcreateElectronicSuppliesRequirementRecordDto,
      'operationDate' | 'storageManagementPersonnelId' | 'doorType' | 'requirementRecordDetails' | 'quantity'
    > = {
      operationDate: date!.toISOString(),
      storageManagementPersonnelId: preparer!.id,
      doorType: JSON.stringify(doorModelName),
      requirementRecordDetails,
      quantity: doorQty ? String(doorQty || 0) : null,
    };

    if (requirementRecordId) {
      body.requirementRecordDetails = (
        body as TupdateElectronicSuppliesRequirementRecordDto
      ).requirementRecordDetails.filter((detail) => !(!detail.id && !detail.quantity));

      await apiPatchElectronicSuppliesRequirementRecord(requirementRecordId, body).then(async () => {
        await update_requirementRecord();
        setDisabled(true);
      });
    } else {
      if (!electronicSuppliesId) {
        myAlert.err({ title: '沒有electronicSuppliesId' });

        return;
      }

      const body_create: TcreateElectronicSuppliesRequirementRecordDto = {
        ...body,
        worksheetIds: worksheetIdArr ?? [],
      };

      await apiPostElectronicSuppliesRequirementRecord(electronicSuppliesId, body_create).then(async (reqData) => {
        const requirementRecordId = reqData.id;
        router.replace({
          query: { ...router.query, requirementRecordId },
        });
        await update_requirementRecord();
        setDisabled(true);
      });
    }
  };

  const reqGetDefaultElectronicSuppliesRequirement = async () => {
    const state_electronicItemArr = (defaultElectronicSuppliesRequirementArr ?? []).map((item) => {
      const subItemName = item.category === '控制箱/盤' ? '捲門/水閘門' : null;

      const state: Tstate_electronicItem = {
        category: item.category,
        categoryParam: item.category,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit ?? null,
        code: item.code,
        subItemName,
      };

      return state;
    });

    const { destroy } = myAlert.clear({
      content: (
        <DefaultItemSelector
          state_electronicItemArr={state_electronicItemArr}
          onConfirm={(stateArr) => {
            replaceState_electronicSuppliesRequirment(stateArr);
            destroy();
          }}
        />
      ),
    });
  };

  // ------------------------------------------------------------------

  // region FUNCTION

  const editItemQty = (key: string, qty: number) => {
    dispatch({
      type: 'editQty',
      payload: { key, qty },
    });
  };

  // ------------------------------------------------------------------

  const groupArr = useStateToGroup({
    stateArr: Object.values(state_electronicItemDict),
    handler_editItemQty: editItemQty,
    createAddCategory,
  });

  // ------------------------------------------------------------------

  // region PROPS
  const defaultSeletedDataArrArr: Parameters<typeof SelectorGroup>[0]['defaultSeletedDataArrArr'] = useMemo(() => {
    const arr02 = [];

    state_info.preparer && arr02.push(state_info.preparer);

    return [arr02];
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
    if (!disabled && data_requirementRecord) {
      return;
    }

    const { requirementRecordDetails = [] } = data_requirementRecord ?? {};

    const stateArr: Tstate_electronicItem[] = requirementRecordDetails?.map((detail) => {
      const { id: detailId, category, itemName, quantity, unit, code, categoryParam } = detail;

      return {
        id: detailId,
        category,
        itemName,
        quantity,
        unit,
        code,
        categoryParam: categoryParam ?? '',
      } as Tstate_electronicItem;

      //
    });

    let stateInfo = createEmptyStateInfo();

    if (data_requirementRecord) {
      stateInfo = {
        date: data_requirementRecord.operationDate ? moment(data_requirementRecord.operationDate) : null,
        indexNumber: data_requirementRecord.number ?? '',
        picker: undefined,
        preparer: data_requirementRecord.storageManagementPersonnelEmployee || undefined,
        // doorModelName: data_requirementRecord.doorType ?? '',
        doorModelName: data_requirementRecord.addition.doorTypeArr ?? [],
        doorQty: String(data_requirementRecord.quantity || '') as Tstate_info['doorQty'],
      };
    } else {
      stateInfo.date = moment();
    }

    replaceState_electronicSuppliesRequirment(stateArr);
    setState_info(stateInfo);
  }, [disabled, data_requirementRecord]);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      <PageHeader
        showReturnBtn={disabled}
        panelList={panelList}
        contractNumber={data_contract?.contractNumber ?? '---'}
        contactThatSkipContract={contactThatSkipContract}
      />

      <div className={scss.container}>
        {/* info */}
        <div className={scss.info}>
          <InputSel
            className="global_tip_must"
            caption="需求日期"
            {...config_inputSel}
            disabled={true}
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
            caption="需求單號"
            {...config_inputSel}
            disabled={true}
            inputProps={{ props: { defaultValue: state_info.indexNumber } }}
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
                readOnly: true,
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

          <InputSel
            className="global_tip_must col-span-2"
            caption="門型"
            {...config_inputSel}
            disabled={disabled}
            showBaseline="invisible"
            node={
              <AntdSelect
                className="w-full"
                mode="multiple"
                allowClear
                disabled={disabled}
                value={state_info.doorModelName}
                onChange={(arr: string[]) => {
                  setState_info((state) => ({ ...state, doorModelName: arr }));
                }}
                options={options_doorModel}
              />
            }
          />

          <div>
            <SquareBtn
              className={classNames((!isNew || disabled) && 'invisible')}
              sharp="mini"
              onClick={reqGetDefaultElectronicSuppliesRequirement}
            >
              建議送電備品
            </SquareBtn>
          </div>
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
          const preparer = arr[0][0] as TemployeeDto | undefined;

          setState_info((state) => ({
            ...state,
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

const reducer = (state: (Tstate_electronicItem & { checked: boolean })[], action: Taction) => {
  const copy = [...state];
  const { type, payload } = action;
  const index = payload.index;

  switch (type) {
    case 'checked':
      copy[index].checked = payload.checked;

      return copy;
    case 'category':
      copy[index].category = payload.category;

      return copy;

    case 'qty':
      copy[index].quantity = payload.qty === '' ? null : Number(payload.qty);

      return copy;

    default:
      return state;
  }
};

// MARK:DefaultItemSelector
const DefaultItemSelector = ({
  state_electronicItemArr,
  onConfirm: _onConfirm,
}: {
  state_electronicItemArr: Tstate_electronicItem[];
  onConfirm: (arr: Tstate_electronicItem[]) => void;
}) => {
  const arr = state_electronicItemArr.map((item) => ({ ...item, checked: false }));

  const [stateArr, dispatch] = useReducer(reducer, arr);

  const onConfirm = () => {
    const arr = stateArr
      .filter((state) => state.checked)
      .map((_item) => {
        const { checked, ...item } = _item;

        return {
          ...item,
          category: item.category.trim(),
        };
      });

    _onConfirm(arr);
  };

  return (
    <div className="p-5">
      <div className="text-main text-bold text-xl">建議送電備品</div>
      <br />
      <div className={scss.row}>
        <br />
        <span className="text-bold text-lg">品名</span>
        <span className="text-bold text-lg">種類</span>
        <span className="text-bold text-lg">數量</span>
        {/*  */}
        {stateArr.map((state, index) => {
          return (
            <Fragment key={index}>
              <DataEntry.Checkbox
                value={state.checked}
                onChange={(e) =>
                  dispatch({
                    type: 'checked',
                    payload: {
                      index,
                      checked: e.target.checked,
                    },
                  })
                }
              />
              <span>{state.itemName}</span>
              <DataEntry.Input
                value={state.category}
                onChange={(e) => dispatch({ type: 'category', payload: { index, category: e.target.value } })}
              />
              <DataEntry.Input
                type="number"
                min={0}
                step={0}
                value={state.quantity ?? ''}
                onChange={(e) => {
                  if (e.target.validity.valid) {
                    dispatch({ type: 'qty', payload: { index, qty: e.target.value as `${number}` } });
                  }
                }}
              />
            </Fragment>
          );
        })}

        {/*  */}
      </div>
      <br />
      <SquareBtn sharp="long" onClick={onConfirm}>
        確認
      </SquareBtn>
    </div>
  );
};

// ==================================================================
