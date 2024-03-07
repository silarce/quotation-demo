// 新增派工單
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, { Tcontrol_profile } from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import EditDispatch, {
  Tcontroll as Tcontroll_editDispatch,
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
import { useGetContract_id } from 'js/api/api_quotation';
import { apiPatchTodo } from 'js/api/api_todo';

// css
import scss from './edit.module.scss';

// type
import { TemployeeDto, TtodoDto } from 'js/api/dtoTypes';

// =====================================================================

type Tquery = {
  contractId: string;
  dispatchingId: string | undefined;
  todoIdForDispatch: string | undefined;
};

type Tstate_profile = {
  dispatchDate: string;
  workerEmployee: TemployeeDto[];
  projectName: string;
  projectNumber: string;
  contractor: string;
  contractorContactPerson: string;
  county: string;
  district: string;
  address: string;
  constructionSiteContactNumber: string;
  warrantyDate: string;
  finalContactPerson: string;
};

// =====================================================================

export default function EditDispatchList() {
  const router = useRouter();
  const { contractId, dispatchingId, todoIdForDispatch } = router.query as Tquery;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const theDiasbled = !dispatchingId ? false : disabled;

  // ---------------------------------------------------------
  const [state_profile, setState_profile] = useState<Tstate_profile>(emptyState_profile());

  const [state_dispatch, setState_dispatch] = useState<{
    tasks: string;
    note: string;
    pricingMethod: string;
    isCompleted: boolean;
  }>();

  // ---------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  const { data: dispatching, update: update_dispatching } = useGetEngineeringDispatching_id(dispatchingId);

  // ---------------------------------------------------------

  const { todoForDispatch } = useMemo(() => {
    let todoForDispatch: TtodoDto | null = null;

    if (todoIdForDispatch) {
      const todoJSON = window.sessionStorage.getItem('todoForDispatch');

      if (todoJSON) {
        //確保取得的東西是JSON
        try {
          const todo = JSON.parse(todoJSON);
          todo && (todoForDispatch = todo);
        } catch (error) {
          myAlert.err({ title: '取得待辦事項失敗' });
          console.log(error);
        }
      }
    }

    return { todoForDispatch };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoIdForDispatch]);

  // ---------------------------------------------------------

  const controll_editDispatch: Tcontroll_editDispatch = {
    tasks: {
      value: state_dispatch?.tasks ?? '',
      onChange: (v: string) => {
        setState_dispatch((data) => {
          if (!data) {
            return data;
          }

          data.tasks = v;

          return { ...data };
        });
      },
    },
    note: {
      value: state_dispatch?.note ?? '',
      onChange: (v: string) => {
        setState_dispatch((data) => {
          if (!data) {
            return data;
          }

          data.note = v;

          return { ...data };
        });
      },
    },
    pricingMethod: {
      value: state_dispatch?.pricingMethod ?? '',
      subValue: (() => {
        // 修理費用
        const value = state_dispatch?.pricingMethod ?? '';
        let subValue = '';

        if (value.includes('修理費用')) {
          subValue = value.split('修理費用').pop() ?? '';
        }

        return subValue;
      })(),
      onChange: (v: string) => {
        setState_dispatch((data) => {
          if (!data) {
            return data;
          }

          data.pricingMethod = v;

          return { ...data };
        });
      },
    },
    isCompleted: {
      value: state_dispatch?.isCompleted ?? false,
      onChange: (bool) => {
        setState_dispatch((state) => {
          if (!state) {
            return state;
          }

          return { ...state, isCompleted: bool };
        });
      },
    },
  };

  // ---------------------------------------------------------

  const changeProfile = (key: keyof Omit<Tstate_profile, 'workerEmployee'>, v: string) => {
    setState_profile((state) => ({ ...state, [key]: v }));
  };

  const changeProfile_workerEmployee = (v: TemployeeDto[]) => {
    setState_profile((state) => ({ ...state, workerEmployee: v }));
  };

  // ---------------------------------------------------------

  const reqPost = async () => {
    if (!state_dispatch) {
      return;
    }

    if (!contractId) {
      return myAlert.info({ title: '沒有合約ID' });
    }

    const workerId = state_profile.workerEmployee.map((employee) => employee.id);

    if (!state_profile.dispatchDate) {
      return myAlert.info({ title: '請選擇派工日期' });
    }

    if (!workerId[0]) {
      return myAlert.info({ title: '請選擇工務人員' });
    }

    const body: TcreateDispatchingDto = {
      contractId,
      dispatchDate: state_profile.dispatchDate,
      contractorContactPerson: state_profile.contractorContactPerson,
      constructionSiteContactNumber: state_profile.constructionSiteContactNumber,
      county: state_profile.county,
      district: state_profile.district,
      address: state_profile.address,
      workerId,
      finalContactPerson: state_profile.finalContactPerson,
      tasks: state_dispatch.tasks,
      pricingMethod: state_dispatch.pricingMethod,
      note: state_dispatch.note || null,
      isCompleted: state_dispatch.isCompleted,
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

      if (todoForDispatch && todoForDispatch.engineeringContactId) {
        const body = [
          {
            isAlreadyDisPatching: true,
            id: todoForDispatch.id,
          },
        ];

        await apiPatchTodo(body);
        window.sessionStorage.removeItem('todoForDispatch');
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增派工單失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------

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

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    const {
      dispatchDate,
      contractorContactPerson,
      constructionSiteContactNumber,
      county = engineeringContact.county,
      district = engineeringContact.district,
      address = engineeringContact.address,
      // workerId,
      workerEmployee,
      finalContactPerson,
      tasks,
      pricingMethod,
      note,
      // contractId,
      // contract,
      // quotationId,
      // quotation,
      // todoListId,
      // todoList,
      // isCompleted,
      warrantyDate,
      isCompleted,
      // constructionSiteContactNumber: projectNumber,
    } = dispatching ?? {};

    setState_profile({
      dispatchDate: dispatchDate ?? '',
      workerEmployee: workerEmployee ?? [],
      projectName: contract?.content.projectName ?? '',
      projectNumber: contract?.content.quotationNumber ?? '',
      contractor: engineeringContact.contractor,
      contractorContactPerson: contractorContactPerson ?? '',
      county: county,
      district: district,
      address: address,
      constructionSiteContactNumber: constructionSiteContactNumber ?? '',
      warrantyDate: warrantyDate ?? '',
      finalContactPerson: finalContactPerson ?? '',
    });

    setState_dispatch({
      tasks: tasks ?? todoForDispatch?.content ?? '',
      note: note ?? '',
      pricingMethod: pricingMethod ?? '',
      isCompleted: !!isCompleted,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContact, dispatching, disabled, todoForDispatch]);

  // ---------------------------------------------------------

  const control_profile: Tcontrol_profile = {
    dispatchDate: {
      value: state_profile.dispatchDate ? moment(state_profile.dispatchDate) : null,
      disabled: theDiasbled,
      onChange: (m) => changeProfile('dispatchDate', m?.toISOString() ?? ''),
    },
    workerEmployee: {
      value: state_profile.workerEmployee,
      onChange: changeProfile_workerEmployee,
    },
    projectName: state_profile.projectName,
    projectNumber: state_profile.projectNumber,
    contractor: state_profile.contractor,
    contractorContactPerson: {
      value: state_profile.contractorContactPerson,
      disabled: theDiasbled,
      onChange: (e) => changeProfile('contractorContactPerson', e.target.value),
    },
    // allAddress: state_profile.allAddress,
    county: {
      value: state_profile.county,
      disabled: theDiasbled,
      onChange: (str) => changeProfile('county', str),
    },
    district: {
      value: state_profile.district,
      disabled: theDiasbled,
      onChange: (str) => changeProfile('district', str),
    },
    address: {
      value: state_profile.address,
      disabled: theDiasbled,
      onChange: (e) => changeProfile('address', e.target.value),
    },
    constructionSiteContactNumber: {
      value: state_profile.constructionSiteContactNumber,
      disabled: theDiasbled,
      onChange: (e) => changeProfile('constructionSiteContactNumber', e.target.value),
    },
    warrantyDate: state_profile.warrantyDate,
    finalContactPerson: {
      value: state_profile.finalContactPerson,
      disabled: theDiasbled,
      onChange: (e) => changeProfile('finalContactPerson', e.target.value),
    },
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
  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div className={scss.body}>
        <Profile disabled={theDiasbled} control={control_profile} />
        <br />
        <EditDispatch
          controll={controll_editDispatch}
          disabled={theDiasbled}
          dispatchDate={
            state_profile.dispatchDate ? moment(state_profile.dispatchDate).format('YYYY-MM-DD') : undefined
          }
        />
      </div>
    </SubLayer>
  );
}

// =====================================================================

const emptyState_profile = (): Tstate_profile => ({
  dispatchDate: '',
  workerEmployee: [],
  projectName: '',
  projectNumber: '',
  contractor: '',
  contractorContactPerson: '',
  county: '',
  district: '',
  address: '',
  constructionSiteContactNumber: '',
  warrantyDate: '',
  finalContactPerson: '',
});
