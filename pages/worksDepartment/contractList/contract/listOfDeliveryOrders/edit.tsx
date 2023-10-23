import { Dispatch, SetStateAction, useState, useEffect } from 'react';
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

// gear
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/gear/profile';

// api
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TcreateExchgangeDto,
  useGetEngineeringExchanges_id,
  apiPostEngineeringExchange,
  apiPatchEngineeringExchange,
} from 'js/api/api_engineering';

// css
import style from './listOfDeliveryOrders.module.scss';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  goodsQuantity: string;
  reason: string;
};

// -----------------------------------------------------------
export default function Edit() {
  const router = useRouter();
  const { contractId, exchangeId } = router.query as { contractId: string; exchangeId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // ----------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const { data: exchange, update: update_exchange } = useGetEngineeringExchanges_id(contractId);

  useEffect(() => {
    (async () => {
      try {
        await update_contract();
      } catch (error) {
        myAlert.err({ title: '取得合約失敗' });
      }

      // try {
      //   await update_exchange();
      // } catch (error) {
      //   myAlert.err({ title: '取得調(退)貨單失敗' });
      // }
    })();
  }, [contractId]);

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
      newTransferList[index][key] = v;

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
  }, [contract, exchange]);

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
        value: item.goodsQuantity,
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
      // TODO 等api更新後要調整
      goodsName: '',
      goodsSpec: '',
      goodsQuantity: 0,
      reason: '',
      //
      accountingId: signature.accounting?.id ?? '',
      warehouseEmployeeId: signature.warehouseEmployee?.id ?? '',
      factoryEmployeeId: signature.factoryEmployee?.id ?? '',
      supervisorId: signature.supervisor?.id ?? '',
      formCompleterId: signature.formCompleter?.id ?? '',
      contractId: contractId,
    };

    try {
      setIsLoading(true);

      if (exchangeId) {
        await apiPatchEngineeringExchange(exchangeId, body);
      } else {
        await apiPostEngineeringExchange(body);
      }
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
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => router.back(),
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
      onClick: () => router.back(),
    },
  ];
  const panelList_edit02: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: () => {
        alert('test');
      },
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
  goodsQuantity: '',
  reason: '',
});
