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
import SheetPDF from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/sheetPDF/sheetPDF';

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
  useGetEngineeringContact,
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
  [key: string]:
    | {
        id?: string;
        itemName: string;
        category: string;
        quantity: string;
        unit: string;
      }
    | undefined;
};

// =================================================================
export default function Edit() {
  const router = useRouter();
  const { contractId, electronicSuppliesId } = router.query as {
    contractId: string;
    electronicSuppliesId: string | undefined;
  };

  const [disabled, setDisabled] = useState(!!electronicSuppliesId);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------
  const { data: contract, update } = useGetContract_id_noItems(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { data: electronicSupplies, update: update_electronicSupplies } =
    useGetElectronicSupplies_id(electronicSuppliesId);

  useEffect(() => {
    update();
    update_electronicSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, electronicSuppliesId]);
  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

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
        projectName: engineeringContact?.projectName ?? '',
        projectNumber: engineeringContact?.projectNumber ?? '',
      };
    });
  }, [engineeringContact]);

  // ----------------------------------------------------

  const [sheet, setSheet] = useState<Tsheet>({});

  const changeSheetQty = ({
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
          id: state[key]?.id,
          itemName,
          category: key,
          unit: state[key]?.unit ?? '',
          quantity,
        },
      };
    });
  };

  const changeSheetUnit = ({
    //
    key,
    itemName,
    unit,
  }: {
    key: string;
    itemName: string;
    unit: string;
  }) => {
    setSheet((state) => {
      return {
        ...state,
        [key]: {
          id: state[key]?.id,
          itemName,
          category: key,
          unit,
          quantity: state[key]?.quantity ?? '',
        },
      };
    });
  };

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
      if (item.itemName === '其他') {
        sheet.other = {
          id: item.id,
          itemName: item.itemName,
          category: item.category,
          quantity: String(item.quantity),
          unit: item.unit ?? '',
        };

        return;
      }

      sheet[item.category] = {
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        quantity: String(item.quantity),
        unit: item.unit ?? '',
      };
    });

    setSheet(sheet);
  }, [contract, electronicSupplies]);

  // ---------------------------------------------------------------------

  const controll_sheet: Tcontroll_sheet = {
    智慧型: {
      unit: sheet.智慧型?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '智慧型', unit, itemName });
      },
      qty: sheet.智慧型?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '智慧型', quantity, itemName });
      },
    },
    面板式: {
      unit: sheet.面板式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '面板式', unit, itemName });
      },
      qty: sheet.面板式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '面板式', quantity, itemName });
      },
    },
    埋入式: {
      unit: sheet.埋入式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '埋入式', unit, itemName });
      },
      qty: sheet.埋入式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '埋入式', quantity, itemName });
      },
    },
    外露式: {
      unit: sheet.外露式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '外露式', unit, itemName });
      },
      qty: sheet.外露式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '外露式', quantity, itemName });
      },
    },
    電子式: {
      unit: sheet.電子式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '電子式', unit, itemName });
      },
      qty: sheet.電子式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '電子式', quantity, itemName });
      },
    },
    防爆式: {
      unit: sheet.防爆式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '防爆式', unit, itemName });
      },
      qty: sheet.防爆式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '防爆式', quantity, itemName });
      },
    },
    鎖號: {
      unit: sheet.鎖號?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '鎖號', unit, itemName });
      },
      qty: sheet.鎖號?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '鎖號', quantity, itemName });
      },
    },
    特殊鎖號: {
      unit: sheet.特殊鎖號?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '特殊鎖號', unit, itemName });
      },
      qty: sheet.特殊鎖號?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '特殊鎖號', quantity, itemName });
      },
    },
    三點式一般: {
      unit: sheet.三點式一般?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '三點式一般', unit, itemName });
      },
      qty: sheet.三點式一般?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '三點式一般', quantity, itemName });
      },
    },
    三點式遮煙: {
      unit: sheet.三點式遮煙?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '三點式遮煙', unit, itemName });
      },
      qty: sheet.三點式遮煙?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '三點式遮煙', quantity, itemName });
      },
    },
    //
    '3HP馬達控制箱380v': {
      unit: sheet['3HP馬達控制箱380v']?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '3HP馬達控制箱380v', unit, itemName });
      },
      qty: sheet['3HP馬達控制箱380v']?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '3HP馬達控制箱380v', quantity, itemName });
      },
    },
    '2HP馬達控制箱380v': {
      unit: sheet['2HP馬達控制箱380v']?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '2HP馬達控制箱380v', unit, itemName });
      },
      qty: sheet['2HP馬達控制箱380v']?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '2HP馬達控制箱380v', quantity, itemName });
      },
    },
    '3HP馬達控制箱220v': {
      unit: sheet['3HP馬達控制箱220v']?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '3HP馬達控制箱220v', unit, itemName });
      },
      qty: sheet['3HP馬達控制箱220v']?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '3HP馬達控制箱220v', quantity, itemName });
      },
    },
    '2HP馬達控制箱220v': {
      unit: sheet['2HP馬達控制箱220v']?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '2HP馬達控制箱220v', unit, itemName });
      },
      qty: sheet['2HP馬達控制箱220v']?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '2HP馬達控制箱220v', quantity, itemName });
      },
    },
    彈射門控制箱: {
      unit: sheet.彈射門控制箱?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '彈射門控制箱', unit, itemName });
      },
      qty: sheet.彈射門控制箱?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '彈射門控制箱', quantity, itemName });
      },
    },
    紅外線控制盤: {
      unit: sheet.紅外線控制盤?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '紅外線控制盤', unit, itemName });
      },
      qty: sheet.紅外線控制盤?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '紅外線控制盤', quantity, itemName });
      },
    },
    //
    煙感器: {
      unit: sheet.煙感器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '煙感器', unit, itemName });
      },
      qty: sheet.煙感器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '煙感器', quantity, itemName });
      },
    },
    中繼器: {
      unit: sheet.中繼器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '中繼器', unit, itemName });
      },
      qty: sheet.中繼器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '中繼器', quantity, itemName });
      },
    },
    //
    門弓器: {
      unit: sheet.門弓器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '門弓器', unit, itemName });
      },
      qty: sheet.門弓器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '門弓器', quantity, itemName });
      },
    },
    平推鎖: {
      unit: sheet.平推鎖?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '平推鎖', unit, itemName });
      },
      qty: sheet.平推鎖?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '平推鎖', quantity, itemName });
      },
    },
    電磁扣: {
      unit: sheet.電磁扣?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '電磁扣', unit, itemName });
      },
      qty: sheet.電磁扣?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '電磁扣', quantity, itemName });
      },
    },
    //
    遙控器加障感器: {
      unit: sheet.遙控器加障感器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '遙控器加障感器', unit, itemName });
      },
      qty: sheet.遙控器加障感器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '遙控器加障感器', quantity, itemName });
      },
    },
    遙控器: {
      unit: sheet.遙控器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '遙控器', unit, itemName });
      },
      qty: sheet.遙控器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '遙控器', quantity, itemName });
      },
    },
    障感器: {
      unit: sheet.障感器?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '障感器', unit, itemName });
      },
      qty: sheet.障感器?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '障感器', quantity, itemName });
      },
    },
    大門用主機: {
      unit: sheet.大門用主機?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '大門用主機', unit, itemName });
      },
      qty: sheet.大門用主機?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '大門用主機', quantity, itemName });
      },
    },
    //
    對照式: {
      unit: sheet.對照式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '對照式', unit, itemName });
      },
      qty: sheet.對照式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '對照式', quantity, itemName });
      },
    },
    反射式: {
      unit: sheet.反射式?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '反射式', unit, itemName });
      },
      qty: sheet.反射式?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '反射式', quantity, itemName });
      },
    },
    //
    防颱鎖固: {
      unit: sheet.防颱鎖固?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '防颱鎖固', unit, itemName });
      },
      qty: sheet.防颱鎖固?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '防颱鎖固', quantity, itemName });
      },
    },
    防颱中柱: {
      unit: sheet.防颱中柱?.unit ?? '',
      onUnitChange: (unit, itemName) => {
        changeSheetUnit({ key: '防颱中柱', unit, itemName });
      },
      qty: sheet.防颱中柱?.quantity ?? '',
      onQtyChange: (quantity, itemName) => {
        changeSheetQty({ key: '防颱中柱', quantity, itemName });
      },
    },
    //
    其他: {
      qty: sheet.other?.category ?? '',
      onQtyChange: (v) => {
        setSheet((state) => {
          return {
            ...state,
            other: {
              ...state.other,
              itemName: '其他',
              category: v,
              unit: state.other?.unit ?? '',
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
      disabled: true,
      showBaseline: 'invisible',
    },
    projectName: {
      value: profile.projectName,
      onChange: (v) => {
        changeProfile('projectName', v);
      },
      disabled: true,
      showBaseline: 'invisible',
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
          id: item.id, // 如果是新的就會是undefined，patch時如果沒有id，後端就會新增一筆資料
          itemName: item.itemName as TcreateElectronicSuppliesRecordDto['itemName'],
          category: item.category,
          quantity: Number(item.quantity),
          unit: item.unit,
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
          router.push({
            query: {
              contractId,
              electronicSuppliesId: res.id,
            },
          });
        }
      }

      setDisabled(true);
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
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList03: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => setDisabled(false),
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

  const panelList = !electronicSuppliesId ? panelList01 : disabled ? panelList03 : panelList02;

  // ----------------------------------------------------

  return (
    <SubLayer className={style.container} isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div className={`${style.mainContainer}`}>
        <div className={style.powerTransmissionSpareList}>
          <Profile controll={control_profile} disabled={disabled} />
          <Sheet editable={!disabled} controll={controll_sheet} />
          <Signature controll={contrll_signature} disabled={disabled} />
        </div>
      </div>
      <SheetPDF />
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
