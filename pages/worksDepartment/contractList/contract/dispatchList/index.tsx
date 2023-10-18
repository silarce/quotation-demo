// 派工單列表
// 派工單列表
// 派工單列表

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile, { Tprofile01 } from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import List, { Tdispatch_simple } from 'components/page/worksDepartment/contracList/contract/dispatchList/list';

// api
import { Tparams, useGetEngineeringDispatchingList, apiPostEngineeringDispatching } from 'js/api/api_engineering';
import { useGetContract_id_noItems } from 'js/api/api_quotation';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './dispatchList.module.scss';

// ==============================================================

export default function DispatchList() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string };
  // ----------------------------------------------------

  const { data: data_contract, update: update_contract } = useGetContract_id_noItems(contractId);

  // FIXME 現在後端似乎不會記錄contractId
  const params: Tparams = {
    // filter: {
    //   contractId: { $eq: contractId },
    // },
  };

  const { data: dispatchingArr, update } = useGetEngineeringDispatchingList(params);

  useEffect(() => {
    update();
    update_contract();
  }, []);

  // ----------------------------------------------------
  const [profile01, setProfile01] = useState<Tprofile01>(creEmptyProfile());

  const onProfile01Change = (key: keyof Tprofile01, v: string) => {
    if (!profile01) {
      return;
    }

    const newProfile = { ...profile01 };
    newProfile[key] = v;
    setProfile01(newProfile);
  };

  useEffect(() => {
    if (data_contract) {
      setProfile01(() => {
        const {
          projectName,
          contactPerson,
          contactNumber,
          quotationNumber,

          county,
          district,
          address,
        } = data_contract.content;

        const allAddress = `${county}${district}${address}`;

        return {
          projectName: projectName,
          contractor: '',
          contact: contactPerson,
          contactNumber: contactNumber,
          allAddress,
          //
          projectNumber: '',
          badgeNumber: '',
        };
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_contract]);

  // ----------------------------------------------------
  // dispatchingArr
  const dispatch_simpleArr =
    dispatchingArr?.map((item) => {
      return {
        dispatchDate: moment(convertDate_reduce1911(item.dispatchDate)).format('yy-MM-DD'),
        workerName: item.workerName,
        tasks: item.tasks,
      };
    }) ?? [];

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '新增派工單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/add`,
          query: { ...router.query },
        }),
    },
  ];

  // ----------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} />

      <div className={style.mainContainer}>
        {/*  */}
        <div className={style.dispatchList}>
          <Profile profile01={profile01} onProfile01Change={onProfile01Change} />
          <List list={dispatch_simpleArr} />
        </div>
        {/*  */}
      </div>
    </div>
  );
}

// =============================================

const creEmptyProfile = (): Tprofile01 => ({
  projectName: '',
  contractor: '',
  contact: '',
  contactNumber: '',
  allAddress: '',
  projectNumber: '',
  badgeNumber: '',
});

const fakeListOri = (): Tdispatch_simple[] => [
  {
    dispatchDate: '100-01-01',
    workerName: '王先生小文',
    tasks: `辦理事項`,
  },
  {
    dispatchDate: '100-01-02',
    workerName: '王先生',
    tasks: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    dispatchDate: '100-01-05',
    workerName: '王先生',
    tasks: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    dispatchDate: '100-11-01',
    workerName: '王先生大文',
    tasks: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
];
