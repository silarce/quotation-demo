import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
// import Profile from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/profile';
import EditTransfer, {
  Tcontroll as Tcontroll_transfer,
} from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/editTransfer';
import IconEdit from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/iconEdit';
import Signature, {
  Tcontroll as Tcontroll_signature,
  TemployeeDto,
} from 'components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/signature';
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/gear/profile';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TcreateExchgangeDto,
  useGetEngineeringExchanges_id,
  apiPostEngineeringExchange,
  apiPatchEngineeringExchange,
} from 'js/api/api_engineering';
import { set } from 'lodash';

// -----------------------------------------------------------
type Tprofile = {
  engineeringNumber: string;
  projectName: string;
  requirementsDate: string;
  dispatchDate: string;
};

type Tsignature = {
  accounting: TemployeeDto | undefined;
  warehouseEmployee: TemployeeDto | undefined;
  factoryEmployee: TemployeeDto | undefined;
  supervisor: TemployeeDto | undefined;
  formCompleter: TemployeeDto | undefined;
};

type Ttransfer = {
  goodsName: string;
  goodsSpec: string;
  goodsQuantity: number;
  reason: string;
};

// -----------------------------------------------------------
export default function Edit() {
  const router = useRouter();
  const { contractId, exchangeId } = router.query as { contractId: string; exchangeId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(!!exchangeId);
  // ----------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const { data: exchange, update: update_exchange } = useGetEngineeringExchanges_id(exchangeId);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
      }

      try {
        await update_exchange();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得調(退)貨單失敗', content: err.message });
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, exchangeId]);

  // ----------------------------------------------------
  const [profile, setProfile] = useState<Tprofile>(emptyProfileOri());

  const changeProfile = (key: keyof Tprofile, v: string) => {
    setProfile((profile) => {
      return { ...profile, [key]: v };
    });
  };

  // ----------------------------------------------------
  const [signature, setSignature] = useState<Tsignature>(emptySignature());

  const changeSignature = (key: keyof Tsignature, v: TemployeeDto) => {
    setSignature((signature) => {
      return { ...signature, [key]: v };
    });
  };

  // ----------------------------------------------------

  const [transferArr, setTransferArr] = useState<Ttransfer[]>([]);

  const addTransfer = () => {
    setTransferArr((transferList) => {
      return [...transferList, emptyTransferOri()];
    });
  };

  const deleteTransfer = (index: number) => {
    setTransferArr((transferList) => {
      const newTransferList = [...transferList];
      newTransferList.splice(index, 1);

      return newTransferList;
    });
  };

  const changeTransfer = (index: number, key: keyof Ttransfer, v: string) => {
    setTransferArr((transferList) => {
      const newTransferList = [...transferList];

      if (key === 'goodsQuantity') {
        newTransferList[index][key] = Number(v);
      } else {
        newTransferList[index][key] = v;
      }

      return newTransferList;
    });
  };

  // ----------------------------------------------------

  useEffect(() => {
    const { projectName: projectName_contract } = contract?.content ?? {};
    const {
      projectName,
      engineeringNumber,
      requirementsDate,
      dispatchDate,
      //
      accounting,
      warehouseEmployee,
      factoryEmployee,
      supervisor,
      formCompleter,
    } = exchange ?? {};

    setProfile({
      engineeringNumber: engineeringNumber ?? '',
      projectName: (projectName || projectName_contract) ?? '',
      requirementsDate: requirementsDate ?? '',
      dispatchDate: dispatchDate ?? '',
    });

    setSignature({
      accounting,
      warehouseEmployee,
      factoryEmployee,
      supervisor,
      formCompleter,
    });

    // TODO 等候端更新api後要把資料放進去
    setTransferArr([]);
    //
    //
  }, [contract, exchange, disabled]);

  // ----------------------------------------------------

  const controll_profile: Tcontroll_profile = {
    engineeringNumber: {
      value: profile.engineeringNumber,
      onChange: (v: string) => changeProfile('engineeringNumber', v),
    },
    projectName: {
      value: profile.projectName,
      onChange: (v: string) => changeProfile('projectName', v),
      disabled: true,
    },
    requirementsDate: {
      value: profile.requirementsDate,
      onChange: (v: string) => changeProfile('requirementsDate', v),
    },
    dispatchDate: {
      value: profile.dispatchDate,
      onChange: (v: string) => changeProfile('dispatchDate', v),
    },
  };

  // ----------------------------------------------------

  const controll_signature: Tcontroll_signature = {
    accounting: {
      employee: signature.accounting,
      onChange: (v: TemployeeDto) => changeSignature('accounting', v),
    },
    warehouseEmployee: {
      employee: signature.warehouseEmployee,
      onChange: (v: TemployeeDto) => changeSignature('warehouseEmployee', v),
    },
    factoryEmployee: {
      employee: signature.factoryEmployee,
      onChange: (v: TemployeeDto) => changeSignature('factoryEmployee', v),
    },
    supervisor: {
      employee: signature.supervisor,
      onChange: (v: TemployeeDto) => changeSignature('supervisor', v),
    },
    formCompleter: {
      employee: signature.formCompleter,
      onChange: (v: TemployeeDto) => changeSignature('formCompleter', v),
    },
  };

  // ----------------------------------------------------

  const controll_transfer_arr: Tcontroll_transfer['arr'] = transferArr.map((item, index) => {
    return {
      goodsName: {
        value: item.goodsName,
        onChange: (v: string) => changeTransfer(index, 'goodsName', v),
      },
      goodsSpec: {
        value: item.goodsSpec,
        onChange: (v: string) => changeTransfer(index, 'goodsSpec', v),
      },
      goodsQuantity: {
        value: String(item.goodsQuantity),
        onChange: (v: string) => changeTransfer(index, 'goodsQuantity', v),
      },
      reason: {
        value: item.reason,
        onChange: (v: string) => changeTransfer(index, 'reason', v),
      },
      onDelete: () => deleteTransfer(index),
    };
  });

  const controll_transfer: Tcontroll_transfer = {
    arr: controll_transfer_arr,
    add: addTransfer,
  };

  // ----------------------------------------------------

  const reqPost = async () => {
    const body: TcreateExchgangeDto = {
      ...profile,
      exchangeRecord: transferArr,
      accountingId: signature.accounting?.id ?? '',
      warehouseEmployeeId: signature.warehouseEmployee?.id ?? '',
      factoryEmployeeId: signature.factoryEmployee?.id ?? '',
      supervisorId: signature.supervisor?.id ?? '',
      formCompleterId: signature.formCompleter?.id ?? '',
      contractId: contractId,
    };

    if (!body.accountingId) {
      return myAlert.info({ title: '請選擇會計' });
    } else if (!body.warehouseEmployeeId) {
      return myAlert.info({ title: '請選擇倉庫人員' });
    } else if (!body.factoryEmployeeId) {
      return myAlert.info({ title: '請選擇廠務人員' });
    } else if (!body.supervisorId) {
      return myAlert.info({ title: '請選擇單位主管' });
    } else if (!body.formCompleterId) {
      return myAlert.info({ title: '請選擇填表人員' });
    } else if (!body.dispatchDate) {
      return myAlert.info({ title: '請選擇派工日期' });
    } else if (!body.requirementsDate) {
      return myAlert.info({ title: '請選擇需求日期' });
    }

    try {
      setIsLoading(true);

      if (exchangeId) {
        await apiPatchEngineeringExchange(exchangeId, body);
        setDisabled(true);
      } else {
        const res = await apiPostEngineeringExchange(body);
        router.push({
          query: { ...router.query, exchangeId: res.id },
        });
      }

      myAlert.success({ title: '更新調(退)貨單成功' });
    } catch (error) {
      myAlert.err({ title: '更新調(退)貨單失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------

  const tagCallback = () => {
    return `新增調(退)貨單 ${contract?.content.quotationNumber}`;
  };

  const panelList_add: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/listOfDeliveryOrders',
          query: {
            contractId,
          },
        });
      },
    },
  ];

  const panelList_edit01: TpanelList = [
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
        router.push({
          pathname: '/worksDepartment/contractList/contract/listOfDeliveryOrders',
          query: {
            contractId,
          },
        });
      },
    },
  ];
  const panelList_edit02: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = !exchangeId ? panelList_add : disabled ? panelList_edit01 : panelList_edit02;

  // ----------------------------------------------------

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} tagCallback={tagCallback} contractNumber={contract?.content.quotationNumber} />

      <div>
        <div>
          <Profile controll={controll_profile} disabled={disabled} />
          <EditTransfer controll={controll_transfer} disabled={disabled} />
          <IconEdit />
          <Signature controll={controll_signature} disabled={disabled} />
        </div>
      </div>
    </SubLayer>
  );
}

// ===========================================================

const emptyProfileOri = (): Tprofile => ({
  engineeringNumber: '',
  projectName: '',
  requirementsDate: '',
  dispatchDate: '',
});

const emptySignature = () => ({
  accounting: undefined,
  warehouseEmployee: undefined,
  factoryEmployee: undefined,
  supervisor: undefined,
  formCompleter: undefined,
});

const emptyTransferOri = (): Ttransfer => ({
  goodsName: '',
  goodsSpec: '',
  goodsQuantity: 1,
  reason: '',
});
