// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/profile';
import WorkProject from 'components/page/worksDepartment/contracList/contract/workContactDoc/workProject';
import Remark from 'components/page/worksDepartment/contracList/contract/workContactDoc/remark';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';
import TextListEditor_v2, {
  TstringObj as Tcontroll_textListEditor,
} from 'components/page/domestic/quotation/quotationTotal/TextListEditor_v2';

// api
import {
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  TupdateEngineeringContactDto,
  TengineeringContactDto,
} from 'js/api/api_engineering';

// css
import scss from './workContactDoc.module.scss';

// type
import { TgetAnnotation } from 'js/api/api_workSheet';
import { set } from 'lodash';

// ============================================================================
type Tquery = {
  contractId: string;
};

type Tprofile = {
  paymentStatus: string;
  projectName: string;
  projectContent: string;
  county: string;
  district: string;
  address: string;
  projectPerson: string;
  projectPersonNumber: string;
  projectFaxNumber: string;
  projectNumber: string;
  engineeringNumber: string;
  contractor: string;
  principal: string;
  contactNumber: string;
  faxNumber: string;
};

// ============================================================================
export default function WorkContactDoc() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showAnnoSelector, setShowAnnoSelector] = useState(false);

  // ---------------------------------------------------------------------------

  /**data裡只會有一筆資料 */
  const { data: engineeringContact, update } = useGetEngineeringContact('e298fbc5-78e3-4bfc-a6ff-53c2bbfae83a');
  // const engineeringContact = data;

  useEffect(() => {
    (async () => {
      try {
        await update();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗' });
      }
    })();
  }, [contractId]);

  // ---------------------------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>();

  const profileChange = (key: keyof Tprofile, v: string) => {
    setProfile((profile) => {
      if (!profile) {
        return;
      }

      const newProfile = { ...profile };
      newProfile[key] = v;

      return newProfile;
    });
  };

  // ---------------------------------------------------------------------------

  const [annoArr, setAnnoArr] = useState<string[]>([]);

  const control_anno: Tcontroll_textListEditor = {
    stringArr: annoArr,
    editString: (index, v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr[index] = v;

        return newAnnoArr;
      });
    },
    delString: (index) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.splice(index, 1);

        return newAnnoArr;
      });
    },
    addString: (v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.push(v);

        return newAnnoArr;
      });
    },
    showSelector: () => setShowAnnoSelector(true),
  };

  const onConfirm_anno = (v: TgetAnnotation['data']) => {
    const vArr = v.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    setAnnoArr((arr) => {
      const newAnnoArr = [...arr];
      newAnnoArr.push(...vArr);

      return newAnnoArr;
    });
  };

  // ---------------------------------------------------------------------------

  const reSet = () => {
    if (!engineeringContact) {
      return;
    }

    const {
      annotations,
      //
      paymentStatus,
      projectName,
      projectContent,
      county,
      district,
      address,
      projectPerson,
      projectPersonNumber,
      projectFaxNumber,
      projectNumber,
      engineeringNumber,
      contractor,
      principal,
      contactNumber,
      faxNumber,
    } = engineeringContact;

    if (annotations) {
      setAnnoArr(annotations);
    }

    setProfile({
      paymentStatus,
      projectName,
      projectContent,
      county,
      district,
      address,
      projectPerson,
      projectPersonNumber,
      projectFaxNumber,
      projectNumber,
      engineeringNumber,
      contractor,
      principal,
      contactNumber,
      faxNumber,
    });
  };

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    reSet();
  }, [engineeringContact]);

  // ---------------------------------------------------------------------------
  const controll: Tcontroll_profile = {
    /**請款狀態 */
    paymentStatus: {
      value: profile?.paymentStatus ?? '',
      onChange: (v) => {
        profileChange('paymentStatus', v);
      },
    },
    projectName: {
      value: profile?.projectName ?? '',
      onChange: (v) => {
        profileChange('projectName', v);
      },
    },
    /**工程內容 */
    projectContent: {
      value: profile?.projectContent ?? '',
      onChange: (v) => {
        profileChange('projectContent', v);
      },
    },

    addressBarProps: {
      inputSelProps: {
        caption: '工程地點',
      },
      addressProps: {
        county: {
          props: {
            isDisabled: disabled,
            value: profile?.county ? { value: profile.county, label: profile.county } : null,
            onChange: (option) => {
              const value = option ? option.value : '';
              profileChange('county', value);
              profileChange('district', '');
            },
          },
        },
        district: {
          easyValue: profile?.district ?? null,
          props: {
            isDisabled: disabled,
            value: profile?.district ? { value: profile.district, label: profile.district } : null,
            onChange: (option) => {
              if (!option) {
                return;
              }

              const value = option ? option.value : '';
              profileChange('district', value);
            },
          },
        },
        address: {
          props: {
            disabled,
            onChange: (e) => {
              profileChange('address', e.target.value);
            },
          },
        },
      },
    },

    //
    //
    //
    /**工程負責人 */
    projectPerson: {
      value: profile?.projectPerson ?? '',
      onChange: (v) => {
        profileChange('projectPerson', v);
      },
    },
    /**工程負責人聯絡電話 */
    projectPersonNumber: {
      value: profile?.projectPersonNumber ?? '',
      onChange: (v) => {
        profileChange('projectPersonNumber', v);
      },
    },
    projectFaxNumber: {
      value: profile?.projectFaxNumber ?? '',
      // onChange: (v) => {
      //   profileChange('projectFaxNumber', v);
      // },
      disabled: true,
    },
    /**工地電話 */
    projectNumber: {
      value: profile?.projectNumber ?? '',
      onChange: (v) => {
        profileChange('projectNumber', v);
      },
    },
    /**工程編號 */
    engineeringNumber: {
      value: profile?.engineeringNumber ?? '',
      // onChange: (v) => {
      //   profileChange('engineeringNumber', v);
      // },
      disabled: true,
    },
    /**承包商 */
    contractor: {
      value: profile?.contractor ?? '',
      // onChange: (v) => {
      //   profileChange('contractor', v);
      // },
      disabled: true,
    },
    /**負責人 */
    principal: {
      value: profile?.principal ?? '',
      // onChange: (v) => {
      //   profileChange('principal', v);
      // },
      disabled: true,
    },
    /**公司電話 */
    contactNumber: {
      value: profile?.contactNumber ?? '',
      // onChange: (v) => {
      //   profileChange('contactNumber', v);
      // },
      disabled: true,
    },
    faxNumber: {
      value: profile?.faxNumber ?? '',
      onChange: (v) => {
        profileChange('faxNumber', v);
      },
    },
  };

  // ----------------------------------------------------------------------------

  const reqPatch = async () => {
    if (!profile || !engineeringContact) {
      return;
    }

    const body: TupdateEngineeringContactDto = {
      // contractNumber: profile.contractNumber,
      paymentStatus: profile.paymentStatus,
      projectName: profile.projectName,
      projectContent: profile.projectContent,
      county: profile.county,
      district: profile.district,
      address: profile.address,
      projectPerson: profile.projectPerson,
      projectPersonNumber: profile.projectPersonNumber,
      faxNumber: profile.faxNumber,
      projectNumber: profile.projectNumber,
      annotaion: annoArr,
    };

    try {
      setIsLoading(true);
      await apiPatchEngineeringContact(engineeringContact.id, body);
      await update();
      setDisabled(true);
    } catch (error) {
      myAlert.err({ title: '更新工程聯絡單失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------------------

  const panelList_01: TpanelList = [{ type: 'myButton', label: '編輯', onClick: () => setDisabled(false) }];
  const panelList_02: TpanelList = [
    { type: 'redButton', label: '上傳', onClick: reqPatch },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
        reSet();
      },
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;

  // ----------------------------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} />

      <div>
        <div>
          <Profile controll={controll} disabled={disabled} />
          <WorkProject />
          {/* <Remark /> */}
          <div className={scss.textListContainer}>
            <TextListEditor_v2 label={'備註'} disabled={disabled} stringObj={control_anno} />
          </div>
        </div>
      </div>

      <WorkSheetSelector
        label="備註"
        tip="可複選、可不選(按確定即可)"
        showModal={showAnnoSelector}
        onConfirm={(vArr) => onConfirm_anno(vArr)}
        onCancel={() => setShowAnnoSelector(false)}
        apiFamily="annotation"
      />
    </SubLayer>
  );
}
// ===========================================================
// ===========================================================
// ===========================================================

// const fakeData: TengineeringContactDto = {
//   id: '',
//   createdAt: '',
//   updatedAt: '',
//   contractNumber: 'test',
//   paymentStatus: 'test',
//   projectName: 'test',
//   projectContent: 'test',
//   county: '臺中市',
//   district: '大安區',
//   address: '路路路路路路',
//   projectPerson: 'test',
//   projectPersonNumber: 'test',
//   projectFaxNumber: 'test',
//   projectNumber: 'test',
//   engineeringNumber: 'test',
//   contractor: 'test',
//   principal: 'test',
//   contactNumber: 'test',
//   faxNumber: 'test',
//   annotations: [],
// };
