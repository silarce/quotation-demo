import { useState, useEffect, MouseEvent } from 'react';

import { useRouter } from 'next/router';

// components
import Thead from './contractList/thead';
import PanelHeader, { TtheadInfo } from './contractList/panelHeader';
import PanelBody, { Tdetail } from './contractList/panelBody';

// antd
import { Collapse } from 'antd';

// api
import { useGetContract_id_noItems, TquotationContractDto } from 'js/api/api_quotation';

// css
import style from './contractList.module.scss';

const { Panel } = Collapse;

// ========================

type Tcontract = TtheadInfo & {
  contractId: string;
};

type Tcontrol = {
  northernArr: Tcontract[];
  centralArr: Tcontract[];
  southernArr: Tcontract[];
  easternArr: Tcontract[];
  abroadArr: Tcontract[];
};

export type { Tcontract, Tcontrol as Tcontrol_sortedContractList };

// ========================

export default function ContractList_sorted({ control }: { control: Tcontrol }) {
  const router = useRouter();

  // ------------------------------------------------------------------

  const [targetContractId, setTargetContractId] = useState<string>();

  const [contractList, setContractList] = useState<{ [key: string]: TquotationContractDto | undefined }>({});

  const { update } = useGetContract_id_noItems(targetContractId);

  useEffect(() => {
    if (contractList[targetContractId ?? 'undefined']) {
      return;
    }

    (async () => {
      const res = await update();

      if (res) {
        setContractList((list) => {
          return {
            ...list,
            [res.id]: res,
          };
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetContractId]);

  const createContractDetailArr = (contractId: string): Tdetail[] => {
    const subContracts = contractList[contractId]?.subContracts ?? [];

    return subContracts.map((item) => {
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
    });
  };
  // ------------------------------------------------------------------

  const { northernArr, centralArr, southernArr, easternArr, abroadArr } = control;

  // ------------------------------------------------------------------
  return (
    <div className={style.container}>
      <Thead />
      {/*  */}
      <Collapse
        //
        expandIcon={() => <></>}
        accordion={false}
        destroyInactivePanel={true}
        activeKey={targetContractId}
      >
        {/*  */}
        <div className={style.sortTitle}>
          <span>北部</span>
        </div>
        {northernArr.map((item) => {
          const { contractId } = item;
          const isActive = contractId === targetContractId;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          const detailArr = createContractDetailArr(contractId);

          return (
            <Panel
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  contract={item}
                  isActive={isActive}
                  openQuotation={openQuotation}
                  onClick={() => {
                    //
                    if (isActive) {
                      setTargetContractId(undefined);
                    } else {
                      setTargetContractId(contractId);
                    }
                  }}
                />
              }
            >
              <PanelBody contractDetailArr={detailArr} />
            </Panel>
          );
        })}
        {/*  */}
        <div className={style.sortTitle}>
          <span>中部</span>
        </div>
        {centralArr.map((item) => {
          const { contractId } = item;
          const isActive = contractId === targetContractId;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          const detailArr = createContractDetailArr(contractId);

          return (
            <Panel
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  contract={item}
                  isActive={isActive}
                  openQuotation={openQuotation}
                  onClick={() => setTargetContractId(contractId)}
                />
              }
            >
              <PanelBody contractDetailArr={detailArr} />
            </Panel>
          );
        })}
        {/*  */}
        <div className={style.sortTitle}>
          <span>南部</span>
        </div>
        {southernArr.map((item) => {
          const { contractId } = item;
          const isActive = contractId === targetContractId;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          const detailArr = createContractDetailArr(contractId);

          return (
            <Panel
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  contract={item}
                  isActive={isActive}
                  openQuotation={openQuotation}
                  onClick={() => setTargetContractId(contractId)}
                />
              }
            >
              <PanelBody contractDetailArr={detailArr} />
            </Panel>
          );
        })}
        {/*  */}
        <div className={style.sortTitle}>
          <span>東部</span>
        </div>
        {easternArr.map((item) => {
          const { contractId } = item;
          const isActive = contractId === targetContractId;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          const detailArr = createContractDetailArr(contractId);

          return (
            <Panel
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  contract={item}
                  isActive={isActive}
                  openQuotation={openQuotation}
                  onClick={() => setTargetContractId(contractId)}
                />
              }
            >
              <PanelBody contractDetailArr={detailArr} />
            </Panel>
          );
        })}
        {/*  */}
        <div className={style.sortTitle}>
          <span>海外</span>
        </div>
        {abroadArr.map((item) => {
          const { contractId } = item;
          const isActive = contractId === targetContractId;

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation();
            router.push({
              pathname: '/worksDepartment/contractList/contract/workContactDoc',
              query: { contractId, version: 1 },
            });
          };

          const detailArr = createContractDetailArr(contractId);

          return (
            <Panel
              key={contractId}
              className={style.panel}
              header={
                <PanelHeader
                  //
                  contract={item}
                  isActive={isActive}
                  openQuotation={openQuotation}
                  onClick={() => setTargetContractId(contractId)}
                />
              }
            >
              <PanelBody contractDetailArr={detailArr} />
            </Panel>
          );
        })}
        {/*  */}
      </Collapse>
    </div>
  );
}

// =========================================================================
