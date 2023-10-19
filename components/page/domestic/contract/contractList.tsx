import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// components
import ListTop01 from '../local/list/list01/listTop01';
import ListHeader01, { Tcontract } from '../local/list/list01/listHeader01';
import ListBody01, { TmemoList } from '../local/list/list01/listBody01';

// antd
import { Collapse } from 'antd';

// css
import style from './contractList.module.scss';

// type
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';

import { useGetContract_id_noItems } from 'js/api/api_quotation';

export type { Tcontract };

const { Panel } = Collapse;

export default function ContractList({ contractList }: { contractList: Tcontract[] }) {
  const router = useRouter();

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeContract, setActiveContract] = useState<Tcontract>();

  const { data, update, clear } = useGetContract_id_noItems(activeContract?.id);
  const subContracts = data?.subContracts;

  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string);
    setActiveIndex(activeIndex);
    setActiveContract(contractList[activeIndex]);
  };
  // ----------------------------------------------------------

  useEffect(() => {
    clear();
    update();
  }, [activeContract]);

  // ----------------------------------------------------------

  const memoArr: TmemoList[] =
    subContracts?.map((item) => {
      return {
        memoId: item.content.quotationNumber,
        memoDate: moment(item.content.createdAt).format('YYYY-MM-DD'),
        // memoContent: item.content.editNotes,
        memoContent: '',
        href: {
          pathname: '/domestic/contract/quotation',
          query: {
            id: subContracts[0].id,
            version: item.version,
          },
        },
      };
    }) ?? [];
  memoArr.shift();

  // ----------------------------------------------------------
  return (
    <div className={style.container}>
      <ListTop01 />
      <Collapse
        //
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        onChange={changeActive}
      >
        {contractList.map((item, index) => {
          const { quotationId, id } = item;
          const isActive = activeIndex === index;

          const onClick = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: `/domestic/contract/quotation`,
              query: { id, version: 1 },
            });
          };

          return (
            <Panel
              key={index}
              className={style.panel}
              header={<ListHeader01 contract={item} onClick={onClick} isActive={isActive} />}
            >
              <ListBody01 memoList={memoArr} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
