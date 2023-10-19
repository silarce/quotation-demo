// 調(退)貨單列表
// 調(退)貨單列表
// 調(退)貨單列表

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// css
import style from './listOfDeliveryOrders.module.scss';

export default function ListOfDeliveryOrders() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  // ----------------------------------------------------
  const [data, setData] = useState<TspareData[]>([]);

  useEffect(() => {
    setData(fakeDataListOri());
    setIsReady(true);
  }, []);

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '建立調(退)貨單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/add`,
          query: { ...router.query },
        }),
    },
  ];

  // ----------------------------------------------------
  if (!isReady) {
    return null;
  }

  // ----------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} />

      <div className={`${style.mainContainer} ${style.listOfDeliveryOrders}`}>
        <div className={style.thead}>
          {indexKeys.map((key, index) => {
            const { label } = config[key];

            return (
              <div key={index}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <div className={style.tbody}>
          {data.map((rowData, rowIndex) => {
            const id = rowData.id;
            const href = {
              pathname: `${router.pathname}/edit`,
              query: { ...router.query, id },
            };
            const onClick = () => router.push(href);

            return (
              <CellWithBar className={style.row} key={rowIndex} onClick={onClick}>
                {indexKeys.map((key, index) => {
                  const value = rowData[key];

                  return (
                    <div key={index}>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </CellWithBar>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================

type TspareData = {
  id: string;
  projectId: string;
  projectName: string;
  neededDate: string;
  applyDate: string;
};

type TindexKeys = keyof TspareData;

const indexKeys: TindexKeys[] = ['id', 'projectId', 'projectName', 'neededDate', 'applyDate'];

const config: {
  [key in TindexKeys]: {
    label: string;
  };
} = {
  id: {
    label: '編號',
  },
  projectId: {
    label: '工程編號',
  },
  projectName: {
    label: '工程名稱',
  },
  neededDate: {
    label: '需要日期',
  },
  applyDate: {
    label: '填表日期',
  },
};

const fakeDataListOri = (): TspareData[] => {
  const dataOri = () => ({
    id: '111001',
    projectId: 'M-1102112',
    projectName: '台中港加工處理區-宇隆科技廠房增建工程A',
    neededDate: '111-02-02',
    applyDate: '111-02-02',
  });
  const arr = new Array(30).fill(undefined).map((item, index, arr) => {
    return (arr[index] = dataOri());
  });

  return arr;
};
