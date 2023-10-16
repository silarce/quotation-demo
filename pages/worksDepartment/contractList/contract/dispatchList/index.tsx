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
import { useGetEngineeringDispatchingList, apiPostEngineeringDispatching } from 'js/api/api_engineering';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './dispatchList.module.scss';

// ==============================================================
export default function DispatchList() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  // ----------------------------------------------------

  const { data: dispatchingArr, update } = useGetEngineeringDispatchingList();

  useEffect(() => {
    update();
  }, []);

  // ----------------------------------------------------
  // const [data, setData] = useState<TfakeData>()
  const [profile01, setProfile01] = useState<Tprofile01>();

  const onProfile01Change = (key: keyof Tprofile01, v: string) => {
    if (!profile01) {
      return;
    }

    const newProfile = { ...profile01 };
    newProfile[key] = v;
    setProfile01(newProfile);
  };

  useEffect(() => {
    setProfile01(fakeProfileOri());
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (!isReady) {
    return null;
  }

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

const fakeProfileOri = (): Tprofile01 => ({
  projectName: '台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程',
  contractor: '創典科技A有限公司',
  contact: '林先生',
  contactNumber: '04-1234567',
  allAddress: '臺中市梧棲區經二路27號',
  projectNumber: '工程編號',
  badgeNumber: '管制卡編號',
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
