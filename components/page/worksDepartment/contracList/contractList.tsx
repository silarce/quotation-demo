import { useState, useEffect, MouseEvent, useMemo, forwardRef } from 'react';
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

// globalState
import { useUrlHistory } from 'hooks/globalState/useUrlHistory';

const { Panel } = Collapse;

// ========================

type Tcontract = TtheadInfo & {
  contractId: string;
  page: number | string;
};

export type { Tcontract };

// ========================

function ContractList_pre(
  {
    contractArr,
    viewRef,
    viewRef_top,
    activeContractId,
    onChangeActiveContract,
    targetUrl,
  }: {
    contractArr: Tcontract[];
    viewRef?: (node?: Element | null | undefined) => void;
    viewRef_top?: (node?: Element | null | undefined) => void;
    activeContractId: string | undefined;
    onChangeActiveContract: (contractId: string | undefined) => void;
    targetUrl: string;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const history_contractList = useUrlHistory((state) => state.contractList);

  const router = useRouter();

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------

  const {
    data: contract,
    update,
    clear,
  } = useGetContract_id(activeContractId, { preBuiltPopulate: 'worksDepartment03' });

  const subContracts = useMemo(() => {
    let subContracts = contract?.subContracts ?? [];

    subContracts = _.sortBy(subContracts, 'version');

    return subContracts;
  }, [contract?.subContracts]);

  // ------------------------------------------------------------------

  const changeActive = (
    //
    key: string | string[] | undefined
  ) => {
    if (key === undefined || typeof key === 'string') {
      onChangeActiveContract(key);
    }

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
              query: { contractId: activeContractId, version: item.version },
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
  }, [activeContractId]);

  // ------------------------------------------------------------------

  return (
    <div ref={ref} className={style.container}>
      <Thead />

      <Collapse
        //
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        onChange={changeActive}
        activeKey={activeContractId}
      >
        {contractArr.map((item, index) => {
          const { contractId } = item;
          const isActive = activeContractId === contractId;

          const handleIconDetailClick = (e: MouseEvent) => {
            e.stopPropagation();
            router.replace({
              query: {
                ...router.query,
                activeContractId: contractId,
                activeContractPage: item.page,
              },
            });

            history_contractList.set({
              pathname: router.pathname,
              query: {
                ...router.query,
                activeContractId: contractId,
                activeContractPage: String(item.page),
              },
            });

            router.push({
              pathname: targetUrl,
              query: { contractId, version: 1 },
            });
          };

          const theViewRef = index <= 3 ? viewRef_top : index > contractArr.length - 3 ? viewRef : undefined;

          return (
            <Panel
              id={contractId}
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  viewRef={theViewRef}
                  contract={item}
                  isActive={isActive}
                  onIconDetailClick={handleIconDetailClick}
                />
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

export default forwardRef(ContractList_pre);
