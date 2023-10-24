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
import {
  TcreateDispatchingDto,
  TdispatchingDto,
  apiPostEngineeringDispatching,
  apiPatchEngineeringDispatching,
  useGetEngineeringDispatching_id,
  useGetEngineeringContact,
} from 'js/api/api_engineering';
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import { TemployeeDto } from 'js/api/dtoTypes';
// css
import scss from './dispatchList.module.scss';

export default function EditDispatchList() {
  const router = useRouter();
  const { contractId, dispatchingId } = router.query as { contractId: string; dispatchingId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const theDiasbled = !dispatchingId ? false : disabled;

  // ---------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { data: dispatching, update: update_dispatching } = useGetEngineeringDispatching_id(dispatchingId);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        if (!contract) {
          await update_contract();
        }
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
      }

      try {
        await update_dispatching();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得派工單失敗', content: err.message });
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, dispatchingId]);

  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

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
    if (!disabled || !engineeringContact) {
      return;
    }

    const {
      projectName,
      // contactPerson,
      projectNumber,
      contractor,
      constructionSitePrincipalContactNumber,
      // quotationNumber,

      county,
      district,
      address,
    } = engineeringContact;

    const allAddress = `${county ?? ''}${district ?? ''}${address ?? ''}`;

    const {
      contractorContactPerson,
      // contractor,
      projectNumber: engineeringNumber,
      badgeNumber,
      dispatchDate,
      finalContactPerson: finalContact,
      workerEmployee,
      tasks,
      note,
      pricingMethod,
      // constructionSiteContactNumber: projectNumber,
    } = dispatching ?? {};

    setProfile01({
      projectName: projectName ?? '',
      contractor: contractor ?? '',
      // 這是承包商的聯絡人
      contractorContactPerson: contractorContactPerson ?? '',
      constructionSiteContactNumber: constructionSitePrincipalContactNumber ?? '',
      allAddress,
      //
      projectNumber: projectNumber ?? '',
      badgeNumber: badgeNumber ?? '',
    });
    setProfile02({
      dispatchDate: dispatchDate ?? '',
      finalContactPerson: finalContact ?? '',
    });
    setProfile03({
      workerEmployee: workerEmployee,
    });
    setEditDispatch({
      tasks: tasks ?? '',
      note: note ?? '',
      pricingMethod: pricingMethod ?? '',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContact, dispatching, disabled]);

  // ---------------------------------------------------------

  const reqPost = async () => {
    if (!profile01 || !profile02 || !editDispatch) {
      return;
    }

    if (!contractId) {
      return myAlert.info({ title: '沒有合約ID' });
    }

    if (!profile02.dispatchDate) {
      return myAlert.info({ title: '請選擇派工日期' });
    }

    if (!profile03?.workerEmployee?.id) {
      return myAlert.info({ title: '請選擇公務人員' });
    }

    const body: TcreateDispatchingDto = {
      // 合約id
      contractId,
      ...profile01,
      ...profile02,
      ...editDispatch,
      county: contract?.content.county ?? '',
      district: contract?.content.district ?? '',
      address: contract?.content.address ?? '',
      workerId: profile03?.workerEmployee?.id ?? '',
    };

    try {
      setIsLoading(true);

      let res: TdispatchingDto;

      if (dispatchingId) {
        res = await apiPatchEngineeringDispatching(dispatchingId, body);
        myAlert.success({ title: '更新派工單成功' });
        await update_dispatching();
      } else {
        res = await apiPostEngineeringDispatching(body);
        myAlert.success({ title: '新增派工單成功' });

        if (res) {
          router.push({
            query: {
              ...router.query,
              dispatchingId: res.id,
            },
          });
        }
      }

      setDisabled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增派工單失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  const panelList01: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '取消',
      // onClick: () => router.back(),
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/contractList/contract/dispatchList',
          query: {
            contractId,
          },
        });
      },
    },
  ];
  const panelList02: TpanelList = [
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
          pathname: '/worksDepartment/contractList/contract/dispatchList',
          query: {
            contractId,
          },
        });
      },
    },
  ];
  const panelList03: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: reqPost,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = !dispatchingId ? panelList01 : disabled ? panelList02 : panelList03;

  // ---------------------------------------------------------

  // ---------------------------------------------------------
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />
      <div>
        <div className={scss.add}>
          <Profile
            disabled={theDiasbled}
            profile01={profile01}
            onProfile01Change={onProfile01Change}
            profile02={profile02}
            onProfile02Change={onProfile02Change}
            profile03={profile03}
            onProfile03Change={onProfile03Change}
          />
          <hr />
          <EditDispatch controll={controll_editDispatch} disabled={theDiasbled} />
        </div>
      </div>
    </SubLayer>
  );
}
