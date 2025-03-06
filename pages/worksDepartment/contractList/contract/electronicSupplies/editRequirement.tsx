import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyTable, { useStateToGroup } from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

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
  Tstate_electronicItem,
  Tstate_info,
  createEmptyStateInfo,
  createDefaultState,
  // orderDetailArr,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

import {
  //
  TemployeeDto,
  // TelectronicSuppliesDefaultItemName,
  // TelectronicSuppliesRequirementRecordDto,
  // TelectronicSuppliesDefaultCategory,
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

const SelectorGroup = selectModalCreator_multi<['employee_factoryDepartment']>({
  selectorArr: [
    // {
    //   key: 'employee',
    //   caption: '領料人員',
    //   tip: '單選',
    //   limit: 1,
    // },
    {
      key: 'employee_factoryDepartment',
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
    data: data_requirementRecord,
    update: update_requirementRecord,
    isFetching: isFetching_requirementRecord,
  } = useGetElectronicSuppliesRequirementRecord_id(requirementRecordId, {
    autoUpdate: !isNew,
  });

  // const { electronicSuppliesId } = data_contract ?? {};

  const {
    isFetching,
    // update,
    defaultElectronicSuppliesRequirementArr,
    worksheetIdArr,
    electronicSuppliesId,
  } = useGetDefaultElectronicSuppliesRequirementData(contractId);

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
      state_electronicItemList
    ).map((item) => {
      const { id, category, itemName, quantity, unit, code, subItemName } = item;

      return {
        // 必須要送id，若id為undefined將會新增一筆detail
        // 預期:新增時每一筆資料都沒有id、編輯時每一筆資料都有id，
        id,
        itemName,
        category,
        quantity,
        unit,
        code,
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
      doorType: doorModelName || null,
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
        electronicSuppliesId,
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
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit ?? null,
        code: item.code,
        subItemName,
      };

      return state;
    });

    const list = _.keyBy(state_electronicItemArr, 'category');
    const { defaultStateList } = createDefaultState();

    setState_electronicItemList({
      ...defaultStateList,
      ...list,
    });
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

    const { defaultStateList } = createDefaultState();

    const { requirementRecordDetails = [] } = data_requirementRecord ?? {};

    // 其實沒有必要用orderDetailArr排序
    // requirementRecordDetails = orderDetailArr({ detailArr: requirementRecordDetails });

    requirementRecordDetails?.forEach((detail) => {
      const { id: detailId, category, itemName, quantity, unit, code } = detail;

      defaultStateList[category] = {
        ...defaultStateList[category], // 可能是undefined // 會將subItemName帶入
        id: detailId,
        category,
        itemName,
        quantity,
        unit,
        code,
      };

      //
    });

    // // 若不是新增而是編輯
    // if (!isNew) {
    //   // 將defaultStateList中所有沒有id的item刪掉
    //   for (const [key, value] of Object.entries(defaultStateList)) {
    //     if (!value.id) {
    //       delete defaultStateList[key];
    //     }
    //   }
    // }

    let stateInfo = createEmptyStateInfo();

    if (data_requirementRecord) {
      stateInfo = {
        date: data_requirementRecord.operationDate ? moment(data_requirementRecord.operationDate) : null,
        indexNumber: data_requirementRecord.number ?? '',
        picker: undefined,
        preparer: data_requirementRecord.storageManagementPersonnelEmployee || undefined,
        doorModelName: data_requirementRecord.doorType ?? '',
        doorQty: String(data_requirementRecord.quantity || '') as Tstate_info['doorQty'],
      };
    } else {
      stateInfo.date = moment();
    }

    setState_electronicItemList(defaultStateList);
    setState_info(stateInfo);
  }, [disabled, data_requirementRecord]);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer
    // isLoading_subLayer={isFetching_requirementRecord} api回應很快，不需要
    >
      <PageHeader returnBtn={disabled} panelList={panelList} contractNumber={data_contract?.contractNumber ?? '---'} />

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
            className="global_tip_must"
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

          <div>
            <SquareBtn sharp="mini" onClick={reqGetDefaultElectronicSuppliesRequirement}>
              重置為預設需求單
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

const config_inputSel: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: '80px' },
  wrapperStyle: { gap: '25px' },
};

// ==================================================================

const check_stateInfo = (state_info: Tstate_info) => {
  let pass = true;

  !state_info.date && (pass = false);
  !state_info.preparer && (pass = false);
  !state_info.doorModelName && (pass = false);

  return pass;
};
