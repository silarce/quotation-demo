import { useState, useEffect, MouseEvent } from 'react';

import { useRouter } from 'next/router';

// components
import Thead from './contractList/thead';
import PanelHeader, { TtheadInfo } from './contractList/panelHeader';
import PanelBody, { Tdetail } from './contractList/panelBody';

// antd
import { Collapse } from 'antd';

// api
import { useGetContract_id, TquotationContractDto } from 'js/api/api_quotation';

// css
import style from './contractList.module.scss';

const { Panel } = Collapse;

// ========================

type Tcontract = TtheadInfo & {
  contractId: string;
};

type Tcontrol = {
  northernArr: Tcontract[]; // N
  centralArr: Tcontract[]; // M
  southernArr: Tcontract[]; // H
  // easternArr: Tcontract[]; //
  abroadArr: Tcontract[];
};

type Tquery = {
  targetContractId?: string | undefined;
};

export type { Tcontract, Tcontrol as Tcontrol_sortedContractList };

// ========================

export default function ContractList_sorted({ control }: { control: Tcontrol }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { targetContractId } = query;

  // ------------------------------------------------------------------

  const [contractList, setContractList] = useState<{ [key: string]: TquotationContractDto | undefined }>({});

  const { update } = useGetContract_id(targetContractId, { preBuiltPopulate: 'worksDepartment03' });

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

  const { northernArr, centralArr, southernArr, abroadArr } = control;

  // ------------------------------------------------------------------
  return (
    <div className={style.container}>
      <Thead />
      {/*  */}ㄋ
      <List label="北部" arr={northernArr} createContractDetailArr={createContractDetailArr} />
      <List label="中部" arr={centralArr} createContractDetailArr={createContractDetailArr} />
      <List label="南部" arr={southernArr} createContractDetailArr={createContractDetailArr} />
      <List label="海外或其他" arr={abroadArr} createContractDetailArr={createContractDetailArr} />
    </div>
  );
}

// =========================================================================

const List = ({
  label,
  arr,
  createContractDetailArr,
}: {
  label: string;
  arr: Tcontract[];
  createContractDetailArr: (contractId: string) => Tdetail[];
}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { targetContractId } = query;

  return (
    <Collapse
      //
      expandIcon={() => <></>}
      accordion={false}
      destroyInactivePanel={true}
      activeKey={targetContractId}
    >
      <div className={style.sortTitle}>
        <span>{label}</span>
      </div>
      {arr.map((item) => {
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
                onIconDetailClick={openQuotation}
                onClick={() => {
                  //
                  if (isActive) {
                    router.replace({
                      query: { ...query, targetContractId: undefined },
                    });
                  } else {
                    router.replace({
                      query: { ...query, targetContractId: contractId },
                    });
                  }
                }}
              />
            }
          >
            <PanelBody contractDetailArr={detailArr} />
          </Panel>
        );
      })}
    </Collapse>
  );
};
