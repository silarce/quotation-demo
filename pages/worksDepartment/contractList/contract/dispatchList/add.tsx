// 新增派工單

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import Profile from 'components/page/worksDepartment/contracList/contract/dispatchList/profile';
import EditDispatch from 'components/page/worksDepartment/contracList/contract/dispatchList/editDispatch';
// css
import style from './dispatchList.module.scss';

export default function AddDispatchList() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  // ---------------------------------------------------------
  const [profile, setProfile] = useState<Partial<TfakeProfile>>({});
  const [profile02, setProfile02] = useState<TdispatchEmpty>(fakeProfile02EmptyOri());

  useEffect(() => {
    setProfile(fakeProfileOri((router.query.contractId as string) ?? ''));
    setProfile02(fakeProfile02EmptyOri());
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '建立',
      onClick: () => {
        alert('建立派工單會在串接api後製作');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => router.back(),
    },
  ];

  // ---------------------------------------------------------
  if (!isReady) {
    return null;
  }

  // ---------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} />
      <div className={style.mainContainer}>
        <div className={style.add}>
          {profile && (
            <Profile profile={profile} setProfile={setProfile} profile02={profile02} setProfile02={setProfile02} />
          )}
          <hr />
          <EditDispatch />
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 假資料，為了開發方便容易辨識，
// 暫時先用中文變數
export type TfakeProfile = {
  工程名稱: string;
  承包商: string;
  聯絡人: string;
  工地電話: string;
  工程地點: string;
  工程編號: string;
  管制卡編號: string;
};

const fakeProfileOri = (工程編號: string): TfakeProfile => ({
  工程名稱: '台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程',
  承包商: '創典科技A有限公司',
  聯絡人: '林先生',
  工地電話: '04-1234567',
  工程地點: '臺中市梧棲區經二路27號',
  工程編號: 工程編號,
  管制卡編號: '',
});
// =====================================

export type TdispatchEmpty = {
  派工日期: string;
  工務人員: string;
  完工聯絡人: string;
};

const fakeProfile02EmptyOri = (): TdispatchEmpty => ({
  派工日期: '',
  工務人員: '',
  完工聯絡人: '',
});
