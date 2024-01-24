// 送電備品列表
// 送電備品列表
// 送電備品列表

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// component
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import { useGetEngineeringContact, useGetElectronicSupplies } from 'js/api/api_engineering';

// helper
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import style from './powerTransmissionSpareList.module.scss';

// ==================================================================
type Tquery = {
  contractId: string;
};

// ==================================================================
export default function PowerTransmissionSpareList() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  // ----------------------------------------------------

  const customParams = {
    filter: {
      contractId: { $eq: contractId },
    },
  };

  const { data: contract, update } = useGetContract_id(contractId);
  const engineeringContactId = contract?.engineeringContactId ?? '';

  const { data: electronicSuppliesArr, update: updateElectronicSupplies } = useGetElectronicSupplies(customParams);

  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    update();
    updateElectronicSupplies();
  }, [contractId]);

  useEffect(() => {
    update_engineeringContact();
  }, [engineeringContactId]);

  // ----------------------------------------------------

  const fooArr: TspareData[] =
    electronicSuppliesArr?.map((item) => {
      return {
        id: item.id,
        quotationNumber: contract?.content.quotationNumber ?? '',
        projectNumber: engineeringContact?.projectNumber ?? '',
        projectName: engineeringContact?.projectName ?? '',
        neededDate: moment(convertDate_reduce1911(item.requirementsDate)).format('yy-MM-DD') || '',
        applyDate: moment(convertDate_reduce1911(item.dispatchDate)).format('yy-MM-DD') || '',
      };
    }) ?? [];

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '建立料單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: { ...router.query },
        }),
    },
  ];

  // ----------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader panelList={panelList} contractNumber={contract?.content.quotationNumber} />

      <div className={`${style.mainContainer} ${style.powerTransmissionSpareList}`}>
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
          {fooArr.map((rowData, rowIndex) => {
            const id = rowData.id;
            const href = {
              pathname: `${router.pathname}/edit`,
              query: {
                ...router.query,
                electronicSuppliesId: id,
              },
            };
            const onClick = () => router.push(href);

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
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================

type TspareData = {
  id: string;
  quotationNumber: string;
  projectNumber: string;
  projectName: string;
  neededDate: string;
  applyDate: string;
};

const indexKeys = ['quotationNumber', 'projectNumber', 'projectName', 'neededDate', 'applyDate'] as const;

const config = {
  quotationNumber: {
    label: '編號',
  },
  projectNumber: {
    label: '工程編號',
  },
  projectName: {
    label: '工程名稱',
  },
  neededDate: {
    label: '需要日期',
  },
  applyDate: {
    label: '填表日期',
  },
} as const;
