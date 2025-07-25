import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { useRouter } from 'next/router';

// components
import PanelHeader, { TtheadInfo } from './contractList/panelHeader';
import PanelBody, { Tdetail } from './contractList/panelBody';

// antd
import { Collapse } from 'antd';

// api
import { useGetContract_id, TquotationContractDto } from 'js/api/api_quotation';

// css
import scss from './contractList_sorted.module.scss';

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

  const arr = [
    {
      label: '北部',
      contractArr: northernArr,
    },
    {
      label: '中部',
      contractArr: centralArr,
    },
    {
      label: '南部',
      contractArr: southernArr,
    },
    {
      label: '海外或其他',
      contractArr: abroadArr,
    },
  ];

  // ------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <Collapse
        expandIcon={() => null}
        destroyOnHidden={true}
        items={arr.map((item, index) => {
          const { label, contractArr } = item;

          return {
            key: index,
            className: classNames(scss.panel, scss.locationPanel, scss.plus),
            label: (
              <div className={scss.sortTitle}>
                <span>{label}</span>
              </div>
            ),
            children: <List key={label} contractArr={contractArr} createContractDetailArr={createContractDetailArr} />,
          };
        })}
      />
    </div>
  );
}

// =========================================================================

const List = ({
  contractArr,
  createContractDetailArr,
}: {
  contractArr: Tcontract[];
  createContractDetailArr: (contractId: string) => Tdetail[];
}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { targetContractId } = query;

  return (
    <Collapse
      //
      expandIcon={() => null}
      destroyOnHidden={true}
      activeKey={targetContractId}
      items={contractArr.map((item) => {
        const { contractId } = item;
        const isActive = contractId === targetContractId;

        const detailLinkProps: Parameters<typeof PanelHeader>[0]['detailLinkProps'] = {
          onClick(e) {
            e.stopPropagation();
          },
          href: {
            pathname: '/worksDepartment/contractList/contract/workContactDoc',
            query: { contractId, version: 1 },
          },
        };

        const detailArr = createContractDetailArr(contractId);

        return {
          key: contractId,
          className: scss.panel,
          label: (
            <PanelHeader
              contract={item}
              isActive={isActive}
              detailLinkProps={detailLinkProps}
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
          ),
          children: <PanelBody contractDetailArr={detailArr} />,
        };
      })}
    />
  );
};
