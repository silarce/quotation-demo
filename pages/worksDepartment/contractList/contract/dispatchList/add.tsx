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
  Tprofile03,
} from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import EditDispatch, {
  Tcontroll as Tcontroll_EeditDispatch,
} from 'components/page/worksDepartment/contracList/contract/dispatchList/editDispatch';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiPostEngineeringDispatching, TcreateDispatchingDto } from 'js/api/api_engineering';
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import { TemployeeDto } from 'js/api/dtoTypes';
// css
import scss from './dispatchList.module.scss';

export default function AddDispatchList() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string };

  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  useEffect(() => {
    update_contract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);
  // ---------------------------------------------------------
  const [profile01, setProfile01] = useState<Tprofile01>();
  const [profile02, setProfile02] = useState<Tprofile02>();
  const [profile03, setProfile03] = useState<Tprofile03>();

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

  const onProfile03Change = (key: keyof Tprofile03, v: TemployeeDto) => {
    if (!profile03) {
      return;
    }

    const newProfile = { ...profile03 };
    newProfile[key] = v;
    setProfile03(newProfile);
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
    const {
      projectName,
      contactPerson,
      contactNumber,
      quotationNumber,

      county,
      district,
      address,
    } = contract?.content ?? {};

    const allAddress = `${county ?? ''}${district ?? ''}${address ?? ''}`;

    setProfile01({
      projectName: projectName ?? '',
      contractor: '',
      contact: contactPerson ?? '',
      contactNumber: contactNumber ?? '',
      allAddress,
      //
      projectNumber: '',
      badgeNumber: '',
    });
    setProfile02({
      dispatchDate: '',
      // workerName: '',
      finalContact: '',
    });
    setProfile03({
      workerName: undefined,
    });
    setEditDispatch({
      tasks: '',
      note: '',
      pricingMethod: '',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  // ---------------------------------------------------------

  const reqPost = async () => {
    if (!profile01 || !profile02 || !editDispatch) {
      return;
    }

    if (!contractId) {
      return myAlert.info({ title: '沒有合約ID' });
    }

    const body: TcreateDispatchingDto = {
      // 合約id
      contractId,
      ...profile01,
      ...profile02,
      ...editDispatch,
      county: '臺中市',
      district: '大安區',
      address: '小馬路',
      content: profile01.contact,
      workerName: profile03?.workerName?.chName ?? '',
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
            profile03={profile03}
            onProfile03Change={onProfile03Change}
          />
          <hr />
          <EditDispatch controll={controll_editDispatch} />
        </div>
      </div>
    </SubLayer>
  );
}
