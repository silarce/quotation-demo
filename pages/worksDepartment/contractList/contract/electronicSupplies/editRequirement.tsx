import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyTable, {
  TimperativeHandle,
  useStateToGroup,
} from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';
import DefaultItemSelector from 'components/page/worksDepartment/electronicSupplies/defaultItemSelector';

// antd
import { Select as AntdSelect } from 'antd';

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
  //
  useGetElectronicSuppliesRequirementRecord_id,
  useGetDefaultElectronicSuppliesRequirementData,
} from 'js/api/api_engineering';
// import { useApiGetProdDoorModels } from 'js/api/api_product';
import { useGetContract_id } from 'js/api/api_quotation';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

import {
  Tstate_info,
  createEmptyStateInfo,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

import { TemployeeDto } from 'js/api/dtoTypes';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
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

  const ref_supplyTable = useRef<TimperativeHandle>(null);

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

  const {
    data: data_contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const {
    data: data_requirementRecord,
    update: update_requirementRecord,
    isFetching: isFetching_requirementRecord,
  } = useGetElectronicSuppliesRequirementRecord_id(requirementRecordId, {
    autoUpdate: !isNew,
  });

  const {
    defaultElectronicSuppliesRequirementArr,
    worksheetIdArr,
    electronicSuppliesId,
    isFetching: isFetching_defaultElectronicSuppliesRequirement,
  } = useGetDefaultElectronicSuppliesRequirementData(contractId, {
    autoUpdate: isNew,
  });

  const { formatOptions } = useGlobal_doorModel();
  const options_doorModel = formatOptions();

  const engineeringContact = data_contract?.engineeringContact;

  const contractNumber = data_contract?.contractNumber ?? '';
  const projectName = engineeringContact?.projectName ?? '';
  const preparationEmployeeName = data_requirementRecord?.storageManagementPersonnelEmployee?.chName ?? '';

  // ------------------------------------------------------------------

  // region REQUIREST

  const reqPostPatch = async () => {
    const { date, preparer, doorModelName, doorQty } = state_info;

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

  // ------------------------------------------------------------------

  // MARK:updateDefaultToElectronicSuppliesRequirement
  const updateDefaultToElectronicSuppliesRequirement = async () => {
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

  // region PROPS

  const groupArr = useStateToGroup({
    stateArr: Object.values(state_electronicItemDict),
    handler_editItemQty: (key: string, qty: number) => {
      dispatch({
        type: 'editQty',
        payload: { key, qty },
      });
    },
    createAddCategory,
  });

  const defaultSeletedDataArrArr: Parameters<typeof SelectorGroup>[0]['defaultSeletedDataArrArr'] = useMemo(() => {
    const arr02 = [];

    state_info.preparer && arr02.push(state_info.preparer);

    return [arr02];
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
    <SubLayer
      isLoading_subLayer={
        isFetching_contract || isFetching_requirementRecord || isFetching_defaultElectronicSuppliesRequirement
      }
    >
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
                options={options_doorModel ?? []}
              />
            }
          />

          <div>
            <SquareBtn
              className={classNames((!isNew || disabled) && 'invisible')}
              sharp="mini"
              onClick={updateDefaultToElectronicSuppliesRequirement}
            >
              建議送電備品
            </SquareBtn>
          </div>
        </div>
        {/* table */}
        <SupplyTable
          ref={ref_supplyTable}
          className="border border-border mt-10"
          valueLabelArr={['需求數量']}
          groupArr={groupArr}
          disabled={disabled}
          //
          pdfInfo={{
            pdfFileName: `送電備品需求單_${contractNumber}_${moment().format('YYYY-MM-DD')}`,
            contractNumber: contractNumber,
            projectName: projectName,
            date: getTaiwanDateStr(data_requirementRecord?.updatedAt) ?? '',
            preparationEmployeeName: preparationEmployeeName,
          }}
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
