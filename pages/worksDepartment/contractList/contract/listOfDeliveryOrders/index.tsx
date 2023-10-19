// 調(退)貨單列表
// 調(退)貨單列表
// 調(退)貨單列表

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// api
import {
  TexchangeDto,
  Tparams,
  //
  useGetEngineeringExchanges,
} from 'js/api/api_engineering';
import { useGetContract_id_noItems } from 'js/api/api_quotation';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './listOfDeliveryOrders.module.scss';

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

  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  const { data: exchangeArr, update: update_exchange } = useGetEngineeringExchanges(customParams);

  useEffect(() => {
    // update_exchange();
    update_contract();
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
  ];

  // ----------------------------------------------------

  // ----------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div className={`${style.mainContainer} ${style.listOfDeliveryOrders}`}>
        <div className={style.thead}>
          {indexKeys.map((key, index) => {
            const { label } = config[key];

            return (
              <div key={index}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <div className={style.tbody}>
          {exchangeArr?.map((rowData, rowIndex) => {
            const {
              id,
              //
              // contractNumber,
              contract,
              projectNumber,
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
              requirementsDate: moment(convertDate_reduce1911(requirementsDate)).format('yy-MM-DD'),
              dispatchDate: moment(convertDate_reduce1911(dispatchDate)).format('yy-MM-DD'),
            };

            return (
              <CellWithBar className={style.row} key={rowIndex} onClick={onClick}>
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
          {/*  */}
          {/* {data.map((rowData, rowIndex) => {
            const id = rowData.contractNumber;
            const href = {
              pathname: `${router.pathname}/edit`,
              query: { ...router.query, id },
            };
            const onClick = () => router.push(href);

            const rowItem: TrowItem = {
              contractNumber: '',
              projectNumber: '',
              projectName: '',
              neededDate: '',
              applyDate: '',
            };

            return (
              <CellWithBar className={style.row} key={rowIndex} onClick={onClick}>
                {indexKeys.map((key, index) => {
                  const value = rowData[key];

                  return (
                    <div key={index}>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </CellWithBar>
            );
          })} */}
          {/*  */}
        </div>
      </div>
    </div>
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

const fakeDataListOri = (): TrowItem[] => {
  const dataOri = () => ({
    contractNumber: '111001',
    projectNumber: 'M-1102112',
    projectName: '台中港加工處理區-宇隆科技廠房增建工程A',
    requirementsDate: '111-02-02',
    dispatchDate: '111-02-02',
  });
  const arr = new Array(30).fill(undefined).map((item, index, arr) => {
    return (arr[index] = dataOri());
  });

  return arr;
};
