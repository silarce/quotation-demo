import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/gear/profile';
import Sheet, {
  Tcontroll as Tcontroll_sheet,
} from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/sheet';
import Signature, {
  Tcontroll as Tcontroll_Signature,
} from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/signature';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  apiPostElectronicSupplies,
  apiPatchElectronicSupplies,
  TcreateElectronicSuppliesDto,
  // TupdateElectronicSuppliesDto,
  // TelectronicSuppliesDto,
  TcreateElectronicSuppliesRecordDto,
  useGetElectronicSupplies_id,
} from 'js/api/api_engineering';

// css
import style from './powerTransmissionSpareList.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

// =================================================================
type Tprofile = {
  projectNumber: string;
  projectName: string;
  requirementsDate: string;
  dispatchDate: string;
};

type TemployeeList = {
  materialHandler: TemployeeDto | undefined; // 備料人員
  ingredientTechnician: TemployeeDto | undefined; // 配料人員
  formCompleter: TemployeeDto | undefined; // 填表人員
};

// type Tsheet = {
//   智慧型: { qty: string; itemName: string; category: string };
//   面板式: { qty: string; itemName: string; category: string };
//   埋入式: { qty: string; itemName: string; category: string };
//   外露式: { qty: string; itemName: string; category: string };
//   電子式: { qty: string; itemName: string; category: string };
//   防爆式: { qty: string; itemName: string; category: string };
//   鎖號: { qty: string; itemName: string; category: string };
//   特殊鎖號: { qty: string; itemName: string; category: string };
//   三點式一般: { qty: string; itemName: string; category: string };
//   三點式遮煙: { qty: string; itemName: string; category: string };
//   '3HP馬達控制箱380v': { qty: string; itemName: string; category: string };
//   '2HP馬達控制箱380v': { qty: string; itemName: string; category: string };
//   '3HP馬達控制箱220v': { qty: string; itemName: string; category: string };
//   '2HP馬達控制箱220v': { qty: string; itemName: string; category: string };
//   彈射門控制箱: { qty: string; itemName: string; category: string };
//   紅外線控制盤: { qty: string; itemName: string; category: string };
//   煙感器: { qty: string; itemName: string; category: string };
//   中繼器: { qty: string; itemName: string; category: string };
//   門弓器: { qty: string; itemName: string; category: string };
//   平推鎖: { qty: string; itemName: string; category: string };
//   電磁扣: { qty: string; itemName: string; category: string };
//   遙控器加障感器: { qty: string; itemName: string; category: string };
//   遙控器: { qty: string; itemName: string; category: string };
//   障感器: { qty: string; itemName: string; category: string };
//   大門用主機: { qty: string; itemName: string; category: string };
//   對照式: { qty: string; itemName: string; category: string };
//   反射式: { qty: string; itemName: string; category: string };
//   防颱鎖固: { qty: string; itemName: string; category: string };
//   防颱中柱: { qty: string; itemName: string; category: string };
// };
type Tsheet = {
  [key: string]: { itemName: string; category: string; quantity: string } | undefined;
};

type Tsheet_else = {
  others: string;
};

// =================================================================
export default function Edit() {
  const router = useRouter();
  const { contractId, electronicSuppliesId } = router.query as {
    contractId: string;
    electronicSuppliesId: string | undefined;
  };

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------
  const { data: contract, update } = useGetContract_id_noItems(contractId);
  const { data: electronicSupplies, update: update_electronicSupplies } =
    useGetElectronicSupplies_id(electronicSuppliesId);

  useEffect(() => {
    update();
    update_electronicSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  // ----------------------------------------------------
  const [profile, setProfile] = useState<Tprofile>(cre_emptyProfile());
  const [employeeList, setEmployeeList] = useState<TemployeeList>({
    materialHandler: undefined,
    ingredientTechnician: undefined,
    formCompleter: undefined,
  });

  const changeProfile = (key: keyof Tprofile, v: string) => {
    setProfile((state) => {
      return {
        ...state,
        [key]: v,
      };
    });
  };

  useEffect(() => {
    setProfile((state) => {
      return {
        ...state,
        projectName: contract?.content.projectName ?? '',
      };
    });
  }, [contract]);

  // ----------------------------------------------------

  const [sheet, setSheet] = useState<Tsheet>({});
  // const [sheet_else, setSheet_else] = useState<Tsheet_else>({ others: '' });

  const changeSheet = ({
    //
    key,
    itemName,
    quantity,
  }: {
    key: string;
    itemName: string;
    quantity: string;
  }) => {
    setSheet((state) => {
      return {
        ...state,
        [key]: {
          itemName,
          category: key,
          quantity: quantity,
        },
      };
    });
  };

  // const changeSheet_else = (key: keyof Tsheet_else, v: string) => {
  //   setSheet_else((state) => {
  //     return {
  //       ...state,
  //       [key]: v,
  //     };
  //   });
  // };

  // ---------------------------------------------------------------------

  useEffect(() => {
    const {
      projectNumber: engineeringNumber,
      projectName,
      requirementsDate,
      dispatchDate,
      materialHandler,
      ingredientTechnician,
      formCompleter,
      electronicSuppliesRecords,
    } = electronicSupplies ?? {};
    // const {} = contract ?? {};
    const projectName_contract = contract?.content.projectName ?? '';

    setProfile({
      projectNumber: engineeringNumber ?? '',
      projectName: projectName ?? projectName_contract ?? '',
      requirementsDate: requirementsDate ?? '',
      dispatchDate: dispatchDate ?? '',
    });

    setEmployeeList({
      materialHandler,
      ingredientTechnician,
      formCompleter,
    });

    const sheet: Tsheet = {};
    electronicSuppliesRecords?.forEach((item) => {
      sheet[item.category] = {
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
      };
    });

    setSheet(sheet);

    // setSheet_else({
    //   // others: electronicSupplies?.others ?? '',
    //   others: '',
    // });
  }, [contract, electronicSupplies]);

  // ---------------------------------------------------------------------

  const controll_sheet: Tcontroll_sheet = {
    智慧型: {
      value: sheet.智慧型?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '智慧型', quantity, itemName });
      },
    },
    面板式: {
      value: sheet.面板式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '面板式', quantity, itemName });
      },
    },
    埋入式: {
      value: sheet.埋入式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '埋入式', quantity, itemName });
      },
    },
    外露式: {
      value: sheet.外露式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '外露式', quantity, itemName });
      },
    },
    電子式: {
      value: sheet.電子式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '電子式', quantity, itemName });
      },
    },
    防爆式: {
      value: sheet.防爆式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '防爆式', quantity, itemName });
      },
    },
    鎖號: {
      value: sheet.鎖號?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '鎖號', quantity, itemName });
      },
    },
    特殊鎖號: {
      value: sheet.特殊鎖號?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '特殊鎖號', quantity, itemName });
      },
    },
    三點式一般: {
      value: sheet.三點式一般?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '三點式一般', quantity, itemName });
      },
    },
    三點式遮煙: {
      value: sheet.三點式遮煙?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '三點式遮煙', quantity, itemName });
      },
    },
    //
    '3HP馬達控制箱380v': {
      value: sheet['3HP馬達控制箱380v']?.quantity ?? '',
      onChange: (quantity, itemName) => {
        console.log('foo');
        changeSheet({ key: '3HP馬達控制箱380v', quantity, itemName });
      },
    },
    '2HP馬達控制箱380v': {
      value: sheet['2HP馬達控制箱380v']?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '2HP馬達控制箱380v', quantity, itemName });
      },
    },
    '3HP馬達控制箱220v': {
      value: sheet['3HP馬達控制箱220v']?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '3HP馬達控制箱220v', quantity, itemName });
      },
    },
    '2HP馬達控制箱220v': {
      value: sheet['2HP馬達控制箱220v']?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '2HP馬達控制箱220v', quantity, itemName });
      },
    },
    彈射門控制箱: {
      value: sheet.彈射門控制箱?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '彈射門控制箱', quantity, itemName });
      },
    },
    紅外線控制盤: {
      value: sheet.紅外線控制盤?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '紅外線控制盤', quantity, itemName });
      },
    },
    //
    煙感器: {
      value: sheet.煙感器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '煙感器', quantity, itemName });
      },
    },
    中繼器: {
      value: sheet.中繼器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '中繼器', quantity, itemName });
      },
    },
    //
    門弓器: {
      value: sheet.門弓器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '門弓器', quantity, itemName });
      },
    },
    平推鎖: {
      value: sheet.平推鎖?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '平推鎖', quantity, itemName });
      },
    },
    電磁扣: {
      value: sheet.電磁扣?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '電磁扣', quantity, itemName });
      },
    },
    //
    遙控器加障感器: {
      value: sheet.遙控器加障感器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '遙控器加障感器', quantity, itemName });
      },
    },
    遙控器: {
      value: sheet.遙控器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '遙控器', quantity, itemName });
      },
    },
    障感器: {
      value: sheet.障感器?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '障感器', quantity, itemName });
      },
    },
    大門用主機: {
      value: sheet.大門用主機?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '大門用主機', quantity, itemName });
      },
    },
    //
    對照式: {
      value: sheet.對照式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '對照式', quantity, itemName });
      },
    },
    反射式: {
      value: sheet.反射式?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '反射式', quantity, itemName });
      },
    },
    //
    防颱鎖固: {
      value: sheet.防颱鎖固?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '防颱鎖固', quantity, itemName });
      },
    },
    防颱中柱: {
      value: sheet.防颱中柱?.quantity ?? '',
      onChange: (quantity, itemName) => {
        changeSheet({ key: '防颱中柱', quantity, itemName });
      },
    },
    //
    其他: {
      value: sheet.other?.category ?? '',
      onChange: (v) => {
        setSheet((state) => {
          return {
            ...state,
            other: {
              itemName: '其他',
              category: v,
              quantity: '0',
            },
          };
        });
      },
    },
    //
  };

  // ----------------------------------------------------

  const control_profile: Tcontroll_profile = {
    projectNumber: {
      value: profile.projectNumber,
      onChange: (v) => {
        changeProfile('projectNumber', v);
      },
    },
    projectName: {
      value: profile.projectName,
      onChange: (v) => {
        changeProfile('projectName', v);
      },
      disabled: true,
    },
    requirementsDate: {
      value: profile.requirementsDate,
      onChange: (v) => {
        changeProfile('requirementsDate', v);
      },
    },
    dispatchDate: {
      value: profile.dispatchDate,
      onChange: (v) => {
        changeProfile('dispatchDate', v);
      },
    },
  };

  // ------------------------------------------------
  const contrll_signature: Tcontroll_Signature = {
    materialHandler: {
      employee: employeeList.materialHandler,
      onChange: (employee) => {
        setEmployeeList((state) => ({
          ...state,
          materialHandler: employee,
        }));
      },
    },
    ingredientTechnician: {
      employee: employeeList.ingredientTechnician,
      onChange: (employee) => {
        setEmployeeList((state) => ({
          ...state,
          ingredientTechnician: employee,
        }));
      },
    },
    formCompleter: {
      employee: employeeList.formCompleter,
      onChange: (employee) => {
        setEmployeeList((state) => ({
          ...state,
          formCompleter: employee,
        }));
      },
    },
  };

  // ----------------------------------------------------

  const reqPost = async () => {
    if (!employeeList.materialHandler?.id) {
      return myAlert.info({ title: '請選擇備料人員' });
    } else if (!employeeList.ingredientTechnician?.id) {
      return myAlert.info({ title: '請選擇配料人員' });
    } else if (!employeeList.formCompleter?.id) {
      return myAlert.info({ title: '請選擇填表人員' });
    } else if (!profile.dispatchDate) {
      return myAlert.info({ title: '請選擇派工日期' });
    } else if (!profile.requirementsDate) {
      return myAlert.info({ title: '請選擇需求日期' });
    }

    const electronicSuppliesRecords: TcreateElectronicSuppliesRecordDto[] = [];
    Object.values(sheet).forEach((item) => {
      if (item) {
        electronicSuppliesRecords.push({
          // TODO 目前寫死為SJ-302，需要確認doorType怎麼決定
          doorType: 'SJ-302',
          itemName: item.itemName as TcreateElectronicSuppliesRecordDto['itemName'],
          category: item.category,
          quantity: item.quantity,
        });
      }
    });

    // const body: TcreateElectronicSuppliesDto | TupdateElectronicSuppliesDto = {
    const body: TcreateElectronicSuppliesDto = {
      ...profile,
      materialHandlerId: employeeList.materialHandler?.id ?? '',
      ingredientTechnicianId: employeeList.ingredientTechnician?.id ?? '',
      formCompleterId: employeeList.formCompleter?.id ?? '',
      electronicSuppliesRecords,
      projectNumber: profile.projectNumber,
      contractId: contractId,
    };

    try {
      setIsLoading(true);

      if (electronicSuppliesId) {
        const res = await apiPatchElectronicSupplies(electronicSuppliesId, body);

        if (res) {
          update_electronicSupplies();
        }
      } else {
        const res = await apiPostElectronicSupplies(body);

        if (res) {
          update_electronicSupplies();
        }
      }
    } catch (error) {
      const err = error as Error;
      console.log(err);
      myAlert.err({ title: '新增送電備品表失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  const panelList01: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      // onClick: () => router.back(),
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/powerTransmissionSpareList',
          query: { contractId },
        });
      },
    },
  ];
  const panelList02: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/powerTransmissionSpareList',
          query: { contractId },
        });
      },
    },
  ];

  const panelList = electronicSuppliesId ? panelList02 : panelList01;

  // ----------------------------------------------------

  return (
    <SubLayer className={style.container} isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div className={`${style.mainContainer}`}>
        <div className={style.powerTransmissionSpareList}>
          <Profile controll={control_profile} disabled={disabled} />
          <Sheet editable={!disabled} isAdd={true} controll={controll_sheet} />
          <Signature controll={contrll_signature} disabled={disabled} />
        </div>
      </div>
    </SubLayer>
  );
}

// ===========================================================

const cre_emptyProfile = () => ({
  projectNumber: '',
  projectName: '未取得工程名稱',
  requirementsDate: '',
  dispatchDate: '',
});

// const cre_emptySheet = (): Tsheet => ({
//   智慧型: { quantity: '', itemName: '', category: '' },
//   面板式: { quantity: '', itemName: '', category: '' },
//   埋入式: { quantity: '', itemName: '', category: '' },
//   外露式: { quantity: '', itemName: '', category: '' },
//   電子式: { quantity: '', itemName: '', category: '' },
//   防爆式: { quantity: '', itemName: '', category: '' },
//   鎖號: { quantity: '', itemName: '', category: '' },
//   特殊鎖號: { quantity: '', itemName: '', category: '' },
//   三點式一般: { quantity: '', itemName: '', category: '' },
//   三點式遮煙: { quantity: '', itemName: '', category: '' },
//   '3HP馬達控制箱380v': { quantity: '', itemName: '', category: '' },
//   '2HP馬達控制箱380v': { quantity: '', itemName: '', category: '' },
//   '3HP馬達控制箱220v': { quantity: '', itemName: '', category: '' },
//   '2HP馬達控制箱220v': { quantity: '', itemName: '', category: '' },
//   彈射門控制箱: { quantity: '', itemName: '', category: '' },
//   紅外線控制盤: { quantity: '', itemName: '', category: '' },
//   煙感器: { quantity: '', itemName: '', category: '' },
//   中繼器: { quantity: '', itemName: '', category: '' },
//   門弓器: { quantity: '', itemName: '', category: '' },
//   平推鎖: { quantity: '', itemName: '', category: '' },
//   電磁扣: { quantity: '', itemName: '', category: '' },
//   遙控器加障感器: { quantity: '', itemName: '', category: '' },
//   遙控器: { quantity: '', itemName: '', category: '' },
//   障感器: { quantity: '', itemName: '', category: '' },
//   大門用主機: { quantity: '', itemName: '', category: '' },
//   對照式: { quantity: '', itemName: '', category: '' },
//   反射式: { quantity: '', itemName: '', category: '' },
//   防颱鎖固: { quantity: '', itemName: '', category: '' },
//   防颱中柱: { quantity: '', itemName: '', category: '' },
// });
