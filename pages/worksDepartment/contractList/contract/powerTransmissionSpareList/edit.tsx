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
  TupdateElectronicSuppliesDto,
  TelectronicSuppliesDto,
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

type Tsheet = {
  智慧型: string;
  面板式: string;
  埋入式: string;
  外露式: string;
  電子式: string;
  防爆式: string;
  鎖號: string;
  特殊鎖號: string;
  三點式一般: string;
  三點式遮煙: string;
  三HP馬達控制箱380: string;
  二HP馬達控制箱380: string;
  三HP馬達控制箱220: string;
  二HP馬達控制箱220: string;
  彈射門控制箱: string;
  紅外線控制盤: string;
  煙感器: string;
  中繼器: string;
  門弓器: string;
  平推鎖: string;
  電磁扣: string;
  遙控器加障感器: string;
  遙控器: string;
  障感器: string;
  大門用主機: string;
  對照式: string;
  反射式: string;
  防颱鎖固: string;
  防颱中柱: string;
  其他: string;
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

  useEffect(() => {
    update();
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

  const [sheet, setSheet] = useState<Tsheet>(cre_emptySheet());

  const changeSheet = (key: keyof Tsheet, v: string) => {
    setSheet((state) => {
      return {
        ...state,
        [key]: v,
      };
    });
  };

  const controll_sheet: Tcontroll_sheet = {
    智慧型: {
      value: sheet.智慧型 ?? '',
      onChange: (v) => {
        changeSheet('智慧型', v);
      },
    },
    面板式: {
      value: sheet.面板式 ?? '',
      onChange: (v) => {
        changeSheet('面板式', v);
      },
    },
    埋入式: {
      value: sheet.埋入式 ?? '',
      onChange: (v) => {
        changeSheet('埋入式', v);
      },
    },
    外露式: {
      value: sheet.外露式 ?? '',
      onChange: (v) => {
        changeSheet('外露式', v);
      },
    },
    電子式: {
      value: sheet.電子式 ?? '',
      onChange: (v) => {
        changeSheet('電子式', v);
      },
    },
    防爆式: {
      value: sheet.防爆式 ?? '',
      onChange: (v) => {
        changeSheet('防爆式', v);
      },
    },
    鎖號: {
      value: sheet.鎖號 ?? '',
      onChange: (v) => {
        changeSheet('鎖號', v);
      },
    },
    特殊鎖號: {
      value: sheet.特殊鎖號 ?? '',
      onChange: (v) => {
        changeSheet('特殊鎖號', v);
      },
    },
    三點式一般: {
      value: sheet.三點式一般 ?? '',
      onChange: (v) => {
        changeSheet('三點式一般', v);
      },
    },
    三點式遮煙: {
      value: sheet.三點式遮煙 ?? '',
      onChange: (v) => {
        changeSheet('三點式遮煙', v);
      },
    },
    //
    三HP馬達控制箱380: {
      value: sheet.三HP馬達控制箱380 ?? '',
      onChange: (v) => {
        changeSheet('三HP馬達控制箱380', v);
      },
    },
    二HP馬達控制箱380: {
      value: sheet.二HP馬達控制箱380 ?? '',
      onChange: (v) => {
        changeSheet('二HP馬達控制箱380', v);
      },
    },
    三HP馬達控制箱220: {
      value: sheet.三HP馬達控制箱220 ?? '',
      onChange: (v) => {
        changeSheet('三HP馬達控制箱220', v);
      },
    },
    二HP馬達控制箱220: {
      value: sheet.二HP馬達控制箱220 ?? '',
      onChange: (v) => {
        changeSheet('二HP馬達控制箱220', v);
      },
    },
    彈射門控制箱: {
      value: sheet.彈射門控制箱 ?? '',
      onChange: (v) => {
        changeSheet('彈射門控制箱', v);
      },
    },
    紅外線控制盤: {
      value: sheet.紅外線控制盤 ?? '',
      onChange: (v) => {
        changeSheet('紅外線控制盤', v);
      },
    },
    //
    煙感器: {
      value: sheet.煙感器 ?? '',
      onChange: (v) => {
        changeSheet('煙感器', v);
      },
    },
    中繼器: {
      value: sheet.中繼器 ?? '',
      onChange: (v) => {
        changeSheet('中繼器', v);
      },
    },
    //
    門弓器: {
      value: sheet.門弓器 ?? '',
      onChange: (v) => {
        changeSheet('門弓器', v);
      },
    },
    平推鎖: {
      value: sheet.平推鎖 ?? '',
      onChange: (v) => {
        changeSheet('平推鎖', v);
      },
    },
    電磁扣: {
      value: sheet.電磁扣 ?? '',
      onChange: (v) => {
        changeSheet('電磁扣', v);
      },
    },
    //
    遙控器加障感器: {
      value: sheet.遙控器加障感器 ?? '',
      onChange: (v) => {
        changeSheet('遙控器加障感器', v);
      },
    },
    遙控器: {
      value: sheet.遙控器 ?? '',
      onChange: (v) => {
        changeSheet('遙控器', v);
      },
    },
    障感器: {
      value: sheet.障感器 ?? '',
      onChange: (v) => {
        changeSheet('障感器', v);
      },
    },
    大門用主機: {
      value: sheet.大門用主機 ?? '',
      onChange: (v) => {
        changeSheet('大門用主機', v);
      },
    },
    //
    對照式: {
      value: sheet.對照式 ?? '',
      onChange: (v) => {
        changeSheet('對照式', v);
      },
    },
    反射式: {
      value: sheet.反射式 ?? '',
      onChange: (v) => {
        changeSheet('反射式', v);
      },
    },
    //
    防颱鎖固: {
      value: sheet.防颱鎖固 ?? '',
      onChange: (v) => {
        changeSheet('防颱鎖固', v);
      },
    },
    防颱中柱: {
      value: sheet.防颱中柱 ?? '',
      onChange: (v) => {
        changeSheet('防颱中柱', v);
      },
    },
    //
    其他: {
      value: sheet.其他 ?? '',
      onChange: (v) => {
        changeSheet('其他', v);
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
    // const body: TcreateElectronicSuppliesDto|TupdateElectronicSuppliesDto = {
    //   ...profile,
    //   materialHandlerId: employeeList.materialHandler?.id ?? '',
    //   ingredientTechnicianId: employeeList.ingredientTechnician?.id ?? '',
    //   formCompleterId: employeeList.formCompleter?.id ?? '',
    // };

    try {
      setIsLoading(true);

      if (electronicSuppliesId) {
        //
        // const res = await apiPatchElectronicSupplies(body);
        // if (res) {
        //   update_electronicSupplies();
        // }
      } else {
        // const res = await apiPostElectronicSupplies(body);
        // if (res) {
        //   router.push({
        //     query: {
        //       ...router.query,
        //       electronicSuppliesId: res.id,
        //     },
        //   });
        // }
      }
    } catch (error) {
      myAlert.err({ title: '新增送電備品表失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  const panelList01: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: () => reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => router.back(),
    },
  ];
  const panelList02: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: () => reqPost,
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => router.back(),
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

const cre_emptySheet = (): Tsheet => ({
  智慧型: '',
  面板式: '',
  埋入式: '',
  外露式: '',
  電子式: '',
  防爆式: '',
  鎖號: '',
  特殊鎖號: '',
  三點式一般: '',
  三點式遮煙: '',
  三HP馬達控制箱380: '',
  二HP馬達控制箱380: '',
  三HP馬達控制箱220: '',
  二HP馬達控制箱220: '',
  彈射門控制箱: '',
  紅外線控制盤: '',
  煙感器: '',
  中繼器: '',
  門弓器: '',
  平推鎖: '',
  電磁扣: '',
  遙控器加障感器: '',
  遙控器: '',
  障感器: '',
  大門用主機: '',
  對照式: '',
  反射式: '',
  防颱鎖固: '',
  防颱中柱: '',
  其他: '',
});
