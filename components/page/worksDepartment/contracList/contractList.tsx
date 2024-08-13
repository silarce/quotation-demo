import { useState, useEffect, MouseEvent, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

// components
import Thead from './contractList/thead';
import PanelHeader, { TtheadInfo } from './contractList/panelHeader';
import PanelBody, { Tdetail } from './contractList/panelBody';

// antd
import { Collapse } from 'antd';

// api
import { useGetContract_id } from 'js/api/api_quotation';

// css
import style from './contractList.module.scss';

const { Panel } = Collapse;

// ========================

type Tcontract = TtheadInfo & {
  contractId: string;
};

export type { Tcontract };

// ========================

export default function ContractList({
  contractArr,
  viewRef,
}: {
  contractArr: Tcontract[];
  viewRef?: (node?: Element | null | undefined) => void;
}) {
  const router = useRouter();

  // ------------------------------------------------------------------

  const [contractId, setContractId] = useState<string>();

  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1);

  // ------------------------------------------------------------------

  const { data: contract, update, clear } = useGetContract_id(contractId, { preBuiltPopulate: 'worksDepartment03' });

  const subContracts = useMemo(() => {
    let subContracts = contract?.subContracts ?? [];

    subContracts = _.sortBy(subContracts, 'version');

    return subContracts;
  }, [contract?.subContracts]);

  // ------------------------------------------------------------------

  const changeActive = (panelIndex: string | string[]) => {
    panelIndex = panelIndex as string;

    const activeIndex = Number(panelIndex);
    setActiveIndex(activeIndex);

    const contractId = contractArr[Number(panelIndex)]?.contractId;
    setContractId(contractId);
    clear();
  };

  // ------------------------------------------------------------------

  const contractDetailArr: Tdetail[] = useMemo(() => {
    const [first, ...subContracts_reduce] = subContracts;

    const contractDetailArr =
      subContracts_reduce.map((item, index) => {
        const content = item.content;
        const detail: Tdetail = {
          date: content.quotationDate,
          describe: '',
          onIconClick: () => {
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: item.version },
            });
          },
        };

        return detail;
      }) ?? [];

    return contractDetailArr;
  }, [subContracts]);

  // ------------------------------------------------------------------

  useEffect(() => {
    update();
  }, [contractId]);

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

          const theViewRef = index === contractArr.length - 3 ? viewRef : undefined;

          return (
            <Panel
              key={index}
              className={style.panel}
              header={
                <PanelHeader viewRef={theViewRef} contract={item} isActive={isActive} openQuotation={openQuotation} />
              }
            >
              <PanelBody contractDetailArr={contractDetailArr} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
