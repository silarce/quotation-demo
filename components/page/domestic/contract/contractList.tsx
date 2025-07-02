import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import _ from 'lodash';

// components
import ContractListTop from '../local/list/list01/listTop01';
import ListHeader01, { Tcontract } from '../local/list/list01/listHeader01';
import ListBody01, { TsubContract } from '../local/list/list01/listBody01';

// antd
import { Collapse } from 'antd';

// css
import style from './contractList.module.scss';

import { useGetContract_id_noItems_2 } from 'js/api/api_quotation';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

export type { Tcontract };

const { Panel } = Collapse;

export default function ContractList({
  //
  className,
  contractList,
  setActiveContractId,
}: {
  className?: string;
  contractList: Tcontract[];
  setActiveContractId: (id: string) => void;
}) {
  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeContract, setActiveContract] = useState<Tcontract>();

  const { data, update, clear } = useGetContract_id_noItems_2(activeContract?.id);
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

  const subContracts_Ordered = _.sortBy(subContracts, 'version') ?? [];
  const rootContractId = subContracts_Ordered[0]?.id;

  const memoArr: TsubContract[] = subContracts_Ordered.map((subContract) => {
    const { id: subContractId, content } = subContract;

    const { managerReviewedAt } = content;

    const verifyFormText = managerReviewedAt ? '已審核完畢' : '未審核完畢';

    const obj: TsubContract = {
      contractNumber: subContract.contractNumber ?? '---',
      createdAt: dayjs(subContract.content.createdAt).format('YYYY-MM-DD'),
      projectName: subContract.content.projectName,
      verifyForm: (
        <span
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setActiveContractId(subContractId);
          }}
        >
          <span style={{ color: !managerReviewedAt ? 'red' : undefined }}>{verifyFormText}</span>
          <IconDetail className="inline-block" />
        </span>
      ),
      href: {
        pathname: '/domestic/contract/quotation',
        query: {
          id: rootContractId,
          version: subContract.version,
        },
      },
    };

    return obj;
  });

  // 第一個version 1 ，不需要顯示在這邊
  memoArr.shift();

  // ----------------------------------------------------------
  return (
    <div className={classNames(style.container, className)}>
      <ContractListTop />
      <Collapse
        //
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        onChange={changeActive}
      >
        {contractList.map((contract, index) => {
          const isActive = activeIndex === index;

          return (
            <Panel
              key={index}
              //
              className={style.panel}
              header={<ListHeader01 contract={contract} isActive={isActive} />}
            >
              <ListBody01 memoList={memoArr} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
