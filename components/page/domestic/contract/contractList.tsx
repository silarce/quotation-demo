import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';

// components
import ListTop01 from '../local/list/list01/listTop01';
import ListHeader01 from '../local/list/list01/listHeader01';
import ListBody01 from '../local/list/list01/listBody01';

// antd
import { Collapse } from 'antd';

// css
import style from './contractList.module.scss';

// type
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';

const { Panel } = Collapse;

export default function ContractList({
  contractList,
}: {
  contractList: Parameters<typeof ListHeader01>[0]['contract'][];
}) {
  const router = useRouter();

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
  };
  // =============================================

  return (
    <div className={style.container}>
      <ListTop01 />
      <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
        {contractList.map((item, index) => {
          const { quotationId } = item;
          const isActive = activeIndex === index;

          const onClick = (e: MouseEvent) => {
            e.stopPropagation();
            const isContract = true;
            router.push({
              pathname: `/domestic/contract/quotation`,
              query: { quotationId, isContract },
            });
          };

          return (
            <Panel
              key={index}
              className={style.panel}
              header={<ListHeader01 contract={item} onClick={onClick} isActive={isActive} />}
            >
              {fakeListBody.length > 0 ? <ListBody01 memoList={fakeListBody} /> : <span>無備註</span>}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

const fakeListBody = [
  {
    memoId: 'N-1110101-05',
    memoDate: '111-01-01',
    memoContent: '備註備註備註備註',
  },
  {
    memoId: 'N-1110101-05',
    memoDate: '111-01-01',
    memoContent: '備註備註備註備註',
  },
  {
    memoId: 'N-1110101-05',
    memoDate: '111-01-01',
    memoContent: '備註備註備註備註',
  },
];
