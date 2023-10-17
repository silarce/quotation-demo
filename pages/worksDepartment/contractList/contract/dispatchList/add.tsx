// 新增派工單
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, {
  Tprofile01,
  Tprofile02,
} from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import EditDispatch, {
  Tcontroll as Tcontroll_EeditDispatch,
} from 'components/page/worksDepartment/contracList/contract/dispatchList/editDispatch';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiPostEngineeringDispatching, TcreateDispatchingDto } from 'js/api/api_engineering';

// css
import scss from './dispatchList.module.scss';

export default function AddDispatchList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------
  const [profile01, setProfile01] = useState<Tprofile01>();
  const [profile02, setProfile02] = useState<Tprofile02>();

  const onProfile01Change = (key: keyof Tprofile01, v: string) => {
    if (!profile01) {
      return;
    }

    const newProfile = { ...profile01 };
    newProfile[key] = v;
    setProfile01(newProfile);
  };

  const onProfile02Change = (key: keyof Tprofile02, v: string) => {
    if (!profile02) {
      return;
    }

    const newProfile = { ...profile02 };
    newProfile[key] = v;
    setProfile02(newProfile);
  };

  // ---------------------------------------------------------

  const [editDispatch, setEditDispatch] = useState<{
    tasks: string;
    note: string;
    pricingMethod: string;
  }>();

  const controll_editDispatch: Tcontroll_EeditDispatch = {
    tasks: {
      value: editDispatch?.tasks ?? '',
      onChange: (v: string) => {
        console.log(v);

        setEditDispatch((data) => {
          if (!data) {
            return data;
          }

          data.tasks = v;

          return { ...data };
        });
      },
    },
    note: {
      value: editDispatch?.note ?? '',
      onChange: (v: string) => {
        setEditDispatch((data) => {
          if (!data) {
            return data;
          }

          data.note = v;

          return { ...data };
        });
      },
    },
    pricingMethod: {
      value: editDispatch?.pricingMethod ?? '',
      subValue: (() => {
        // 修理費用
        const value = editDispatch?.pricingMethod ?? '';
        let subValue = '';

        if (value.includes('修理費用')) {
          subValue = value.split('修理費用').pop() ?? '';
        }

        return subValue;
      })(),
      onChange: (v: string) => {
        setEditDispatch((data) => {
          if (!data) {
            return data;
          }

          data.pricingMethod = v;

          return { ...data };
        });
      },
    },
  };

  // ---------------------------------------------------------

  useEffect(() => {
    setProfile01({
      projectName: '測試',
      contractor: '測試',
      contact: '測試',
      contactNumber: '04-12345678',
      allAddress: '測試',
      projectNumber: '測試',
      badgeNumber: '',
    });
    setProfile02({
      dispatchDate: '',
      workerName: '',
      finalContact: '',
    });
    setEditDispatch({
      tasks: '',
      note: '',
      pricingMethod: '',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------

  const reqPost = async () => {
    if (!profile01 || !profile02 || !editDispatch) {
      return;
    }

    const body: TcreateDispatchingDto = {
      // 合約id
      contractId: 'e298fbc5-78e3-4bfc-a6ff-53c2bbfae83a',
      ...profile01,
      ...profile02,
      ...editDispatch,
      county: '臺中市',
      district: '大安區',
      address: '小馬路',
      content: profile01.contact,
    };

    try {
      setIsLoading(true);
      await apiPostEngineeringDispatching(body);
      myAlert.success({ title: '新增派工單成功' });
      router.back();
    } catch (error) {
      myAlert.err({ title: '新增派工單失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => router.back(),
    },
  ];

  // ---------------------------------------------------------

  // ---------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} />
      <div>
        <div className={scss.add}>
          <Profile
            profile01={profile01}
            onProfile01Change={onProfile01Change}
            profile02={profile02}
            onProfile02Change={onProfile02Change}
          />
          <hr />
          <EditDispatch controll={controll_editDispatch} />
        </div>
      </div>
    </SubLayer>
  );
}
