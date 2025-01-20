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
import ModalPdf, { Tdata_pdf } from './modalPdf';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateDispatchingDto,
  TdispatchingDto,
  useGetEngineeringDispatching_id,
  useGetEngineeringContact,
  apiPostEngineeringDispatching,
  apiPatchEngineeringDispatching,
  apiDeleteEngineeringDispatching,
} from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';
import { TupdateTodoDto, apiPatchTodo } from 'js/api/api_todo';

// css
import scss from './edit.module.scss';

// type
import { TemployeeDto, TtodoDto } from 'js/api/dtoTypes';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// =====================================================================

type Tquery = {
  contractId: string;
  dispatchingId: string | undefined;
  todoIdForDispatch: string | undefined;
};

type Tstate_profile = {
  idNumber: string;
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

  pointContactPerson: string;
  pointContactNumber: string;

  projectSiteContactPerson: string;
  projectSiteContactPersonNumber: string;

  contactPersonArr: {
    name: string;
    phoneNumber: string;
  }[];
};

type Tstate_pricingMethod = {
  pricingMethod: string;
  note: string;
};

// =====================================================================

// MARK: START

export default function EditDispatchList() {
  const router = useRouter();
  const { contractId, dispatchingId, todoIdForDispatch } = router.query as Tquery;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const theDiasbled = !dispatchingId ? false : disabled;

  const [showPdf, setShowPdf] = useState(false);

  // ---------------------------------------------------------
  const [state_profile, setState_profile] = useState<Tstate_profile>(emptyState_profile());

  const [state_dispatch, setState_dispatch] = useState<{
    tasks: string;
    note: string;
    // pricingMethod: string;
    isCompleted: boolean;
  }>();

  const [state_pricingMethod, setState_pricingMethod] = useState<Tstate_pricingMethod>({
    pricingMethod: '',
    note: '',
  });

  // ---------------------------------------------------------

  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      'content.customer',
      'engineeringContact',
      // 'accountReceivable'
    ],
  });

  const {
    //
    engineeringContactId,
    engineeringContact,
    // accountReceivable,
  } = contract ?? {};
  // const { data: engineeringContact, update: update_engineeringContact } =
  //   useGetEngineeringContact(engineeringContactId);

  const { data: dispatching, update: update_dispatching } = useGetEngineeringDispatching_id(dispatchingId);

  const haveTodoList = !!dispatching?.todoList;

  // ---------------------------------------------------------

  const workerIdArr = state_profile.workerEmployee.map((employee) => employee.id);

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

  // MARK: controll_editDispatch

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
      value: state_pricingMethod.pricingMethod,
      note: state_pricingMethod.note,
      onChange: (str) => {
        setState_pricingMethod({
          pricingMethod: str,
          note: '',
        });
      },
      onInputChange: (str) => {
        setState_pricingMethod((state) => ({
          ...state,
          note: str,
        }));
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

  // MARK: REQ

  const reqPostPatch = async () => {
    if (!state_dispatch) {
      return;
    }

    if (!contractId) {
      return myAlert.info({ title: '沒有合約ID' });
    }

    const workerId = workerIdArr;

    if (!state_profile.dispatchDate) {
      return myAlert.info({ title: '請選擇派工日期' });
    }

    if (!workerId[0]) {
      return myAlert.info({ title: '請選擇工務人員' });
    }

    if (!state_pricingMethod.pricingMethod) {
      return myAlert.info({ title: '請選擇派工批價' });
    }

    const body: TcreateDispatchingDto = {
      idNumber: state_profile.idNumber,
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
      // pricingMethod: state_dispatch.pricingMethod,
      pricingMethod: JSON.stringify(state_pricingMethod),
      note: state_dispatch.note || null,
      isCompleted: state_dispatch.isCompleted,

      pointContactPerson: state_profile.pointContactPerson,
      pointContactNumber: state_profile.pointContactNumber,

      projectSiteContactPerson: state_profile.projectSiteContactPerson,
      projectSiteContactPersonNumber: state_profile.projectSiteContactPersonNumber,
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
          router.replace({
            query: {
              ...router.query,
              dispatchingId: res.id,
            },
          });
        }
      }

      setDisabled(true);

      if (todoForDispatch && todoForDispatch.engineeringContactId) {
        const body: TupdateTodoDto[] = [
          {
            isAlreadyDispatching: true,
            id: todoForDispatch.id,
          },
        ];

        await apiPatchTodo(body, { callAlert: false });
        window.sessionStorage.removeItem('todoForDispatch');
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增派工單失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // apiDeleteEngineeringDispatching
  const reqDelete = async () => {
    if (!dispatchingId) {
      return myAlert.info({ title: '沒有派工單ID' });
    }

    try {
      setIsLoading(true);

      await apiDeleteEngineeringDispatching(dispatchingId);
      myAlert.success({ title: '刪除派工單成功' });

      router.back();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------

  // MARK: useEffect

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

  // useEffect(() => {
  //   update_engineeringContact();
  // }, [engineeringContactId]);

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    const {
      idNumber,
      dispatchDate,
      contractorContactPerson,
      workerEmployee,
      finalContactPerson,
      tasks,
      pricingMethod,
      note,
      warrantyDate,
      isCompleted,
    } = dispatching ?? {};

    let {
      //
      constructionSiteContactNumber,
      county,
      district,
      address,
      pointContactPerson,
      pointContactNumber,

      projectSiteContactPerson,
      projectSiteContactPersonNumber,
      // warrantyDate,
    } = dispatching ?? {};

    // 如果dispatching不存在，也就是新增派工單
    if (!dispatching) {
      const contactInfo = engineeringContact.contactInfo;

      const defaultPointContactPerson = contactInfo?.[0]?.contactPerson ?? '';
      const defaultPointContactNumber = contactInfo?.[0]?.contactNumber ?? '';

      constructionSiteContactNumber = engineeringContact.constructionSiteContactNumber;
      county = engineeringContact.county;
      district = engineeringContact.district;
      address = engineeringContact.address;

      pointContactPerson = defaultPointContactPerson ?? '';
      pointContactNumber = defaultPointContactNumber ?? '';

      projectSiteContactPerson = defaultPointContactPerson ?? '';
      projectSiteContactPersonNumber = defaultPointContactNumber ?? '';

      // warrantyDate = accountReceivable?.warrantyDate ?? '';
    }

    setState_profile({
      idNumber: idNumber ?? '',
      dispatchDate: dispatchDate ?? '',
      workerEmployee: workerEmployee ?? [],
      projectName: contract?.content.projectName ?? '',
      projectNumber: contract?.content.quotationNumber ?? '',
      contractor: engineeringContact.contractor,
      contractorContactPerson: contractorContactPerson ?? '',
      county: county ?? '',
      district: district ?? '',
      address: address ?? '',
      constructionSiteContactNumber: constructionSiteContactNumber ?? '',
      warrantyDate: warrantyDate ?? '',
      finalContactPerson: finalContactPerson ?? '',

      pointContactPerson: pointContactPerson ?? '',
      pointContactNumber: pointContactNumber ?? '',

      projectSiteContactPerson: projectSiteContactPerson ?? '',
      projectSiteContactPersonNumber: projectSiteContactPersonNumber ?? '',

      contactPersonArr: [],
    });

    setState_dispatch({
      tasks: tasks ?? todoForDispatch?.content ?? '',
      note: note ?? '',
      isCompleted: !!isCompleted,
    });

    if (pricingMethod) {
      try {
        const thePricingMethod = JSON.parse(pricingMethod) as Tstate_pricingMethod;
        setState_pricingMethod(thePricingMethod);
      } catch (error) {}
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    engineeringContact,
    dispatching,
    disabled,
    todoForDispatch,
    // accountReceivable?.warrantyDate
  ]);

  // ---------------------------------------------------------

  // MARK: control_profile

  const control_profile: Tcontrol_profile = useMemo(() => {
    const contactInfo = engineeringContact?.contactInfo ?? [];

    const options = contactInfo.map((info) => {
      return {
        label: info.contactPerson,
        value: info.contactPerson,
        phoneNumber: info.contactNumber,
      };
    });

    const control_profile: Tcontrol_profile = {
      idNumber: {
        value: state_profile.idNumber,
        disabled: theDiasbled,
        onChange: (e) => changeProfile('idNumber', e.target.value),
      },
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

      pointContactPerson: {
        value: state_profile.pointContactPerson,
        disabled: theDiasbled,
        onChange: (option) => {
          const { value, phoneNumber } = option ?? {};
          changeProfile('pointContactPerson', value ?? '');
          changeProfile('pointContactNumber', phoneNumber ?? '');
        },
      },

      pointContactNumber: {
        value: state_profile.pointContactNumber,
        disabled: theDiasbled,
        onChange: (e) => changeProfile('pointContactNumber', e.target.value),
      },

      pointContractPersonOptions: options,

      projectSiteContactPerson: {
        value: state_profile.projectSiteContactPerson,
        disabled: theDiasbled,
        onChange: (option) => {
          const { value, phoneNumber } = option ?? {};
          changeProfile('projectSiteContactPerson', value ?? '');
          changeProfile('projectSiteContactPersonNumber', phoneNumber ?? '');
        },
      },

      projectSiteContactPersonNumber: {
        value: state_profile.projectSiteContactPersonNumber,
        disabled: theDiasbled,
        onChange: (e) => changeProfile('projectSiteContactPersonNumber', e.target.value),
      },

      addContactPerson: () => {
        setState_profile((prev) => {
          const copy = { ...prev };
          const contactPersonArr = [...copy.contactPersonArr];
          contactPersonArr.push({
            name: '',
            phoneNumber: '',
          });

          copy.contactPersonArr = contactPersonArr;

          return copy;
        });
      },
      // contractPersonArr: [],
      contractPersonArr: state_profile.contactPersonArr.map((item, index) => {
        const { name, phoneNumber } = item;

        const setContact = ({ name, phoneNumber }: { name?: string; phoneNumber?: string }) => {
          setState_profile((prev) => {
            const copy = { ...prev };
            const contactPersonArr = [...copy.contactPersonArr];
            const contactPerson = { ...contactPersonArr[index] };

            if (name !== undefined) {
              contactPerson.name = name;
            }

            if (phoneNumber !== undefined) {
              contactPerson.phoneNumber = phoneNumber;
            }

            contactPersonArr[index] = contactPerson;
            copy.contactPersonArr = contactPersonArr;

            return copy;
          });
        };

        return {
          name: {
            value: name,
            disabled: theDiasbled,
            onChange: (option) => {
              const { value, phoneNumber } = option ?? {};
              setContact({ name: value, phoneNumber: '' });
              phoneNumber !== undefined && setContact({ phoneNumber });
            },
          },
          phoneNumber: {
            value: phoneNumber,
            disabled: theDiasbled,
            onChange: (e) => {
              setContact({ phoneNumber: e.target.value });
            },
          },
          remove: () => {
            setState_profile((prev) => {
              const copy = { ...prev };
              const contactPersonArr = [...copy.contactPersonArr];
              contactPersonArr.splice(index, 1);

              copy.contactPersonArr = contactPersonArr;

              return copy;
            });
          },
        };
      }),
    };

    return control_profile;
  }, [state_profile, theDiasbled, engineeringContact?.contactInfo]);

  // ---------------------------------------------------------

  // MARK:data_pdf

  const data_pdf: Tdata_pdf = useMemo(() => {
    const {
      //
      county = '',
      district = '',
      address = '',
      warrantyDate,
      tasks = '',
      pointContactPerson = '',
      pointContactNumber = '',

      projectSiteContactPerson = '',
      projectSiteContactPersonNumber = '',
    } = dispatching ?? {};

    const wholeAddress = `${county}${district}${address}`;

    const data_pdf: Tdata_pdf = {
      idNumber: dispatching?.idNumber ?? '',
      customerName: contract?.content.projectName ?? '',
      phoneNumber: (projectSiteContactPerson || '') + '\n' + (projectSiteContactPersonNumber || ''),
      contactPerson: (pointContactPerson || '') + '\n' + (pointContactNumber || ''),
      address: wholeAddress,
      projectNumber: contract?.contractNumber ?? '',
      warrantyPeriod: (warrantyDate ? getTaiwanDateStr(warrantyDate) : '') || '',
      content: tasks,
    };

    return data_pdf;
  }, [
    //
    contract,
    engineeringContact,
    dispatching,
  ]);

  // MARK: panelList
  const panelList01: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: reqPostPatch,
    },
    {
      type: 'myButton',
      label: '取消',
      // onClick: () => router.back(),
      onClick: () => {
        router.back();
        // router.push({
        //   pathname: '/worksDepartment/contractList/contract/dispatchList',
        //   query: {
        //     contractId,
        //   },
        // });
      },
    },
  ];
  const panelList02: TpanelList = [
    {
      type: 'redButton',
      label: '刪除',
      onClick: () => {
        myAlert.confirm({
          title: '確定刪除此派工單？',
          content: (() => {
            if (haveTodoList) {
              // return '此派工單已連結待辦事項，\n該待辦事項將會一起被刪除';
              return (
                <span>
                  此派工單已連結待辦事項
                  <br />
                  該待辦事項將會一起被刪除
                </span>
              );
            }
          })(),
          props: {
            onOk: reqDelete,
          },
        });
      },
    },
    {
      type: 'myButton',
      label: '匯出',
      onClick: () => setShowPdf(true),
    },
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => setDisabled(false),
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
        // router.push({
        //   pathname: '/worksDepartment/contractList/contract/dispatchList',
        //   query: {
        //     contractId,
        //   },
        // });
      },
    },
  ];
  const panelList03: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: reqPostPatch,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = !dispatchingId ? panelList01 : disabled ? panelList02 : panelList03;

  // ---------------------------------------------------------

  // MARK:RENDER

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader returnBtn={disabled} panelList={panelList} contractNumber={contract?.contractNumber ?? ''} />

      <div className={scss.body}>
        <Profile disabled={theDiasbled} control={control_profile} />
        <br />
        <EditDispatch
          controll={controll_editDispatch}
          disabled={theDiasbled}
          workerIdArr={workerIdArr}
          dispatchDate={
            state_profile.dispatchDate ? moment(state_profile.dispatchDate).format('YYYY-MM-DD') : undefined
          }
        />
      </div>

      <ModalPdf visible={showPdf} onCancel={() => setShowPdf(false)} data={data_pdf} />
    </SubLayer>
  );
}

// MARK: END

// =====================================================================

const emptyState_profile = (): Tstate_profile => ({
  idNumber: '',
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
  pointContactPerson: '',
  pointContactNumber: '',
  projectSiteContactPerson: '',
  projectSiteContactPersonNumber: '',
  contactPersonArr: [],
});
