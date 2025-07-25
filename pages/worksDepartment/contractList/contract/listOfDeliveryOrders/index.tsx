// 調(退)貨單列表
// 調(退)貨單列表
// 調(退)貨單列表

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import classNames from 'classnames';

// global gear
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// component
// import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// api
import { Tparams, useGetEngineeringExchanges } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

// helper
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './listOfDeliveryOrders.module.scss';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

export default function ListOfDeliveryOrders() {
  const router = useRouter();

  const { contractId } = router.query as { contractId: string };

  // ----------------------------------------------------

  const customParams: Tparams = {
    filter: {
      contractId: { $eq: contractId },
    },
    pageSize: 9999,
  };

  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId);
  const {
    data: exchangeArr,
    update: update_exchange,
    isFetching: isFetching_exchange,
  } = useGetEngineeringExchanges(customParams);

  useEffect(() => {
    update_exchange();
    update_contract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '建立調(退)貨單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: {
            ...router.query,
          },
        }),
    },
    ...usePanel_returnWorksDepartmentContractList(),
  ];

  // ----------------------------------------------------
  return (
    <SubLayer isLoading_subLayer={isFetching_contract || isFetching_exchange}>
      {/* <PageHeader
        panelList={panelList}
        contractNumber={contract?.contractNumber ?? ''}
        contactThatSkipContract={contactThatSkipContract}
      /> */}

      <div>
        <PageHeader02 panelList={panelList} tag={`合約編號 ${contract?.contractNumber ?? ''}`} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div className={classNames(scss.mainContainer, scss.listOfDeliveryOrders)}>
        <div className={scss.thead}>
          {indexKeys.map((key, index) => {
            const { label } = config[key];

            return (
              <div key={index}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <div className={scss.tbody}>
          {exchangeArr?.map((rowData, rowIndex) => {
            const {
              id,
              //
              // contractNumber,
              contract,
              projectNumber: projectNumber,
              projectName,
              requirementsDate,
              dispatchDate,
            } = rowData;

            const href = {
              pathname: `${router.pathname}/edit`,
              query: { ...router.query, exchangeId: id },
            };
            const onClick = () => router.push(href);

            const rowItem: TrowItem = {
              contractNumber: contract?.content.quotationNumber ?? '',
              projectNumber,
              projectName,
              requirementsDate: getTaiwanDateStr(requirementsDate),
              dispatchDate: getTaiwanDateStr(dispatchDate),
            };

            return (
              <CellWithBar className={scss.row} key={rowIndex} onClick={onClick}>
                {indexKeys.map((key, index) => {
                  const value = rowItem[key];

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
    </SubLayer>
  );
}

// =============================================================

type TrowItem = {
  contractNumber: string;
  projectNumber: string;
  projectName: string;
  requirementsDate: string;
  dispatchDate: string;
};

type TindexKeys = keyof TrowItem;

const indexKeys: TindexKeys[] = ['contractNumber', 'projectNumber', 'projectName', 'requirementsDate', 'dispatchDate'];

const config: {
  [key in TindexKeys]: {
    label: string;
  };
} = {
  contractNumber: {
    label: '編號',
  },
  projectNumber: {
    label: '工程編號',
  },
  projectName: {
    label: '工程名稱',
  },
  requirementsDate: {
    label: '需要日期',
  },
  dispatchDate: {
    label: '填表日期',
  },
};
