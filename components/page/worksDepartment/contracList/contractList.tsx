import { useState, useEffect, MouseEvent } from 'react';

import { useRouter } from 'next/router';

// components
import Thead from './contractList/thead';
import PanelHeader, { TtheadInfo } from './contractList/panelHeader';
import PanelBody, { Tdetail } from './contractList/panelBody';

// antd
import { Collapse } from 'antd';

// api
import { useGetContract_id_noItems } from 'js/api/api_quotation';

// css
import style from './contractList.module.scss';

const { Panel } = Collapse;

// ========================

type Tcontract = TtheadInfo & {
  contractId: string;
};

export type { Tcontract };

// ========================

export default function ContractList({ contractArr }: { contractArr: Tcontract[] }) {
  const router = useRouter();

  // ------------------------------------------------------------------

  const [contractId, setContractId] = useState<string>();

  const { data: contract, update, clear } = useGetContract_id_noItems(contractId);
  const subContracts = contract?.subContracts;

  useEffect(() => {
    update();
  }, [contractId]);

  console.log('contract', contract);

  // ------------------------------------------------------------------

  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  const changeActive = (panelIndex: string | string[]) => {
    panelIndex = panelIndex as string;

    const activeIndex = Number(panelIndex);
    setActiveIndex(activeIndex);

    const contractId = contractArr[Number(panelIndex)].contractId;
    setContractId(contractId);
    clear();
  };

  // ------------------------------------------------------------------

  const contractDetailArr: Tdetail[] =
    subContracts?.map((item) => {
      const content = item.content;

      const foo: Tdetail = {
        date: content.quotationDate,
        describe: content.editNotes,
        discount: content.discount,
        doorQty: String(content.quantity),
        contractAmount: content.total.toLocaleString(),
        onIconClick: () => {
          router.push({
            pathname: '/worksDepartment/contractList/contract/workContactDoc',
            query: { contractId, version: item.version },
          });
        },
      };

      return foo;
    }) ?? [];

  // ------------------------------------------------------------------
  return (
    <div className={style.container}>
      <Thead />

      <Collapse expandIcon={() => <></>} accordion={true} destroyInactivePanel={true} onChange={changeActive}>
        {contractArr.map((item, index) => {
          const { contractId } = item;
          const isActive = activeIndex === index;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          // ===========================

          return (
            <Panel
              key={index}
              className={style.panel}
              header={<PanelHeader contract={item} isActive={isActive} openQuotation={openQuotation} />}
            >
              <PanelBody contractDetailArr={contractDetailArr} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
