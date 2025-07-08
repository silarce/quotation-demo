import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs from 'dayjs';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// antd
import { Select as AntdSelect, SelectProps } from 'antd';

// component
import SupplyTable, {
  TimperativeHandle,
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
  TcreateElectronicSuppliesRecordDetailDto,
  //
  useGetElectronicSuppliesPickupRecord_id,
  useElectronicSupplies_id,
  //
  apiPostElectronicSuppliesPickupRecord,
  apiPatchElectronicSuppliesPickupRecord,
} from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// css
import scss from './index.module.scss';

import {
  Tstate_info,
  createEmptyStateInfo,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

import {
  Tstate_electronicItem,
  orderDetailArr,
  useElectronicSuppliesRequirement,
} from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ==================================================================

type Tquery = {
  contractId: string | undefined;
  pickupRecordId: string | undefined;
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

// MARK:START

export default function EditElectronicSuppliesPickup({
  CustomPageHeader,
}: {
  CustomPageHeader?: (props: { disabled: boolean }) => React.ReactNode;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, pickupRecordId } = query;

  const isNew = !pickupRecordId;

  const ref_supplyTable = useRef<TimperativeHandle>(null);

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(!isNew);
  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------------------------

  const {
    state_electronicItemDict,
    dispatch,
    replaceState: replaceState_electronicSuppliesRequirment,
  } = useElectronicSuppliesRequirement();

  const [state_info, setState_info] = useState<Tstate_info>(createEmptyStateInfo());

  const [requirementRecordId, setRequirementRecordId] = useState<string>();

  // ------------------------------------------------------------------

  const {
    data: data_contract,
    update: update_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const {
    data: data_pickup,
    update: update_pickup,
    isFetching: isFetching_pickup,
  } = useGetElectronicSuppliesPickupRecord_id(pickupRecordId);

  const { electronicSuppliesId, engineeringContact } = data_contract ?? {};
  const { options_doorModel, update: update_doorModelList } = useApiGetProdDoorModels();

  const { data: data_electronicSupplies, isFetching: isFetching_electronicSupplies } = useElectronicSupplies_id(
    electronicSuppliesId,
    {
      params_cover: {
        populate: ['requirementRecords.requirementRecordDetails'],
      },
    }
  );

  const contractNumber = data_contract?.contractNumber ?? '';
  const projectName = engineeringContact?.projectName ?? '';
  const takeOffEmployeeName = data_pickup?.takeOffEmployee?.chName ?? '';
  const preparationEmployeeName = data_pickup?.preparationEmployee?.chName ?? '';

  // ------------------------------------------------------------------

  const defaultState = useMemo(() => {
    let { pickupRecordDetails = [] } = data_pickup ?? {};

    const list: { [key: string]: Tstate_electronicItem } = {};

    pickupRecordDetails = orderDetailArr({ detailArr: pickupRecordDetails });

    pickupRecordDetails.forEach((detail) => {
      const { id, category, itemName, quantity, unit, code, categoryParam } = detail;

      list[category] = {
        ...list[category], // 可能是undefined // 會將subItemName帶入
        id,
        category,
        itemName,
        quantity,
        unit,
        code,
        categoryParam: categoryParam ?? '',
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
      state_electronicItemDict
    ).map((item) => {
      const { id, category, itemName, quantity, unit, code, subItemName, categoryParam } = item;
      const detail = {
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
      doorModel: JSON.stringify(state_info.doorModelName),
      requirementRecordId: requirementRecordId || null,
      pickupRecordDetails,
      totalQuantity: Number(state_info.doorQty || 0),
    };

    if (isNew) {
      await apiPostElectronicSuppliesPickupRecord(data_electronicSupplies.id, body);
      router.back();

      return;
    }

    if (!data_pickup?.id) {
      myAlert.err({ title: '沒有領取單id' });

      return;
    }

    await apiPatchElectronicSuppliesPickupRecord(data_pickup.id, body);
    await update_pickup();
    setDisabled(true);
  };

  // ------------------------------------------------------------------

  // region FUNCTION

  const editItemQty = (key: string, qty: number) => {
    dispatch({
      type: 'editQty',
      payload: { key, qty },
    });
  };

  const replaceState = () => {
    let requirementRecords = data_electronicSupplies?.requirementRecords ?? [];

    // 預期只會有一個
    requirementRecords = requirementRecords.filter((record) => {
      return requirementRecordId?.includes(record.id);
    });

    let detailArr = requirementRecords
      .flatMap((record) => record.requirementRecordDetails)
      .filter((detail) => !!detail);
    detailArr = orderDetailArr({ detailArr });

    const list: { [key: string]: Tstate_electronicItem } = {};

    detailArr.forEach((detail) => {
      const { category, itemName, quantity, unit, code, categoryParam } = detail;

      const subItemName = itemName === '控制箱/盤' ? '捲門/水閘門' : undefined;

      if (!list[category]) {
        list[category] = {
          category,
          categoryParam: categoryParam ?? '',
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

    const dooprTypeArr = (() => {
      const doorType = requirementRecords[0].doorType;
      let arr: string[] = [];

      if (doorType) {
        try {
          arr = JSON.parse(doorType);
        } catch (error) {
          arr = [doorType];
        }
      }

      return arr;
    })();

    replaceState_electronicSuppliesRequirment(list);
    setState_info((state) => ({ ...state, doorModelName: dooprTypeArr }));
  };

  // ------------------------------------------------------------------

  const groupArr = useStateToGroup({
    stateArr: Object.values(state_electronicItemDict),
    handler_editItemQty: editItemQty,
  });

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
      label: '匯出PDF',
      onClick: () => {
        ref_supplyTable.current?.openPdf();
      },
    },
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
    ...usePanel_returnWorksDepartmentContractList(),
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
        date: data_pickup.operationDate ? dayjs(data_pickup.operationDate) : null,
        indexNumber: data_pickup.number || '',
        picker: data_pickup.preparationEmployee || undefined,
        preparer: data_pickup.takeOffEmployee || undefined,
        doorModelName: data_pickup.addition.doorTypeArr ?? [],
        doorQty: String(data_pickup.totalQuantity ?? '') as Tstate_info['doorQty'],
      };
    }

    setState_info(stateInfo);
  }, [disabled, data_pickup]);

  useEffect(() => {
    if (disabled) {
      replaceState_electronicSuppliesRequirment(defaultState);
    }
  }, [defaultState]);

  // ------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer isLoading_subLayer={isFetching_pickup || isFetching_electronicSupplies}>
      {CustomPageHeader && <CustomPageHeader disabled={disabled} />}
      {!CustomPageHeader && (
        <div>
          <PageHeader02 tag={`合約編號 ${contractNumber ?? ''}`} panelList={panelList} />
          <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
        </div>
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
        </div>

        {isNew && (
          <div className={classNames(scss.selectBar, disabled && 'invisible')}>
            <AntdSelect
              placeholder="請選擇需求單"
              size="large"
              className={classNames('w-36')}
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
          ref={ref_supplyTable}
          className="border border-border mt-10"
          valueLabelArr={['領取數量']}
          groupArr={groupArr}
          disabled={disabled}
          pdfInfo={{
            pdfFileName: `送電備品領取單_${contractNumber}_${dayjs().format('YYYY-MM-DD')}`,
            contractNumber: contractNumber,
            projectName: projectName,
            date: getTaiwanDateStr(data_pickup?.updatedAt) ?? '',
            takeOffEmployeeName: takeOffEmployeeName,
            preparationEmployeeName: preparationEmployeeName,
          }}
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
