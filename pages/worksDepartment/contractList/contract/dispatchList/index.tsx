// 派工單列表
// 派工單列表
// 派工單列表

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// component
import List from 'components/page/worksDepartment/contracList/contract/dispatchList/list';

// gear
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// api
import { Tparams, useGetEngineeringContact, useGetEngineeringDispatchingList } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

// helper
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './dispatchList.module.scss';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ==============================================================

type Tquery = {
  contractId: string;
  tab: 'completed' | 'notCompleted' | undefined;
};

// ==============================================================

export default function DispatchList() {
  const router = useRouter();
  const { contractId, tab = 'notCompleted' } = router.query as Tquery;

  // ----------------------------------------------------

  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId);
  const engineeringContactId = contract?.engineeringContactId;
  const {
    data: engineeringContact,
    update: update_engineeringContact,
    isFetching: isFetching_engineeringContact,
  } = useGetEngineeringContact(engineeringContactId);

  const params: Tparams = {
    populate: ['todoList', 'workerEmployee', 'outsourcing'],
    filter: {
      contractId: { $eq: contractId },
      isCompleted: { $eq: tab === 'completed' ? true : false },
    },
  };

  const { data: dispatchingArr, update } = useGetEngineeringDispatchingList(params);

  // ----------------------------------------------------

  const allAddress = `${engineeringContact?.county ?? ''}${engineeringContact?.district ?? ''}${
    engineeringContact?.address ?? ''
  }`;

  // ----------------------------------------------------

  // ----------------------------------------------------

  useEffect(() => {
    update_contract();
  }, []);

  useEffect(() => {
    update();
  }, [tab]);

  useEffect(() => {
    update_engineeringContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContactId]);

  // ----------------------------------------------------
  const dispatch_simpleArr = useMemo(() => {
    const dispatch_simpleArr =
      dispatchingArr?.map((item) => {
        return {
          dispatchDate: getTaiwanDateStr(item.dispatchDate),
          workerNameArr: item.workerEmployee.map((worker) => worker.chName || worker.enName),
          outsourcingNameArr: item.outsourcing.map((worker) => worker.name),

          tasks: item.tasks,
          href: {
            pathname: `${router.pathname}/edit`,
            query: {
              ...router.query,
              dispatchingId: item.id,
            },
          },
        };
      }) ?? [];

    return dispatch_simpleArr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchingArr]);

  // ----------------------------------------------------
  const tabArr = [
    {
      label: '待派工',
      isActive: tab === 'notCompleted',
      onClick: () => {
        router.push({
          query: {
            ...router.query,
            tab: 'notCompleted',
          },
        });
      },
    },
    {
      label: '已完工',
      isActive: tab === 'completed',
      onClick: () => {
        router.push({
          query: {
            ...router.query,
            tab: 'completed',
          },
        });
      },
    },
  ];
  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '新增派工單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: {
            ...router.query,
          },
        }),
    },
    ...usePanel_returnWorksDepartmentContractList(),
  ];

  // ----------------------------------------------------------
  return (
    <SubLayer isLoading_subLayer={isFetching_contract || isFetching_engineeringContact}>
      <div>
        <PageHeader02 panelList={panelList} tag={`合約編號 ${contract?.contractNumber ?? ''}`} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div className={scss.body}>
        <div className={scss.profile}>
          <div className={scss.left}>
            <InputSel caption="工程名稱" {...config_inputSel} node={engineeringContact?.projectName} />
            <InputSel caption="工程簡稱" {...config_inputSel} node={engineeringContact?.projectAbbreviation} />
            <InputSel caption="承包商" {...config_inputSel} node={engineeringContact?.contractor} />
            <InputSel
              caption="聯絡人"
              {...config_inputSel}
              inputProps={{
                props: {
                  defaultValue: dispatchingArr?.[0]?.contractorContactPerson,
                  readOnly: true,
                },
              }}
            />
            <InputSel
              caption="工地電話"
              {...config_inputSel}
              inputProps={{
                props: {
                  defaultValue: engineeringContact?.constructionSitePrincipalContactNumber,
                  readOnly: true,
                },
              }}
            />
            <InputSel
              caption="工程地點"
              {...config_inputSel}
              wrapperStyle={{ width: '600px' }}
              textareaProps={{
                props: {
                  defaultValue: allAddress,
                  readOnly: true,
                },
              }}
            />
          </div>
          {/*  */}
          <div className={scss.rigth}>
            <InputSel
              caption="工程編號"
              {...config_inputSel}
              inputProps={{
                props: {
                  defaultValue: engineeringContact?.projectNumber,
                  readOnly: true,
                },
              }}
            />
          </div>
        </div>

        <Wrapper_tab
          className={scss.wrapper}
          tabArr={tabArr}
          childrenOption={{
            noBorderTop: true,
          }}
          stickyTop={{
            top: 40,
          }}
        >
          <List list={dispatch_simpleArr} />
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// =============================================

const config_inputSel: TinputSelProps = {
  captionStyle: { width: '80px' },
  wrapperStyle: { width: '300px' },
  showBaseline: 'invisible',
};
