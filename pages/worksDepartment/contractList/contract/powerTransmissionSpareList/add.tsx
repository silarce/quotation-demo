import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/profile';
import Sheet from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/sheet';
import Signature, {
  Tcontroll as Tcontroll_Signature,
} from 'components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/signature';

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

// =================================================================
export default function Edit() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
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

  const [signature, setSignature] = useState<Partial<Tsignature>>({});

  const init = () => {
    setSignature(fakeSignatureOri());
  };

  useEffect(() => {
    init();
  }, []);

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
      employee: { chName: 'fooo' },
      onChange: (employee) => {},
    },
    ingredientTechnician: {
      employee: { chName: 'fooo' },
      onChange: (employee) => {},
    },
    formCompleter: {
      employee: { enName: 'qooo' },
      onChange: (employee) => {},
    },
  };

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
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

  // ----------------------------------------------------

  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} />

      <div className={`${style.mainContainer}`}>
        <div className={style.powerTransmissionSpareList}>
          <Profile controll={control_profile} disabled={disabled} />
          <Sheet editable={!disabled} isAdd={true} />
          <Signature controll={contrll_signature} editable={!disabled} />
        </div>
      </div>
    </div>
  );
}

// ===========================================================

const cre_emptyProfile = () => ({
  projectNumber: '',
  projectName: '未取得工程名稱',
  requirementsDate: '',
  dispatchDate: '',
});

// const fakeProfileOri = (): Tprofile => ({
//   // id: "111001",
//   projectNumber: '',
//   projectName: '台中港加工處理區-宇隆科技廠房增建工程A',
//   neededDate: '',
//   applyDate: '',
// });

// ===================================================
export type Tsignature = {
  領料人員: string;
  配料人員: string;
  填表人員: string;
};

const fakeSignatureOri = (): Tsignature => ({
  領料人員: '',
  配料人員: '',
  填表人員: '',
});
