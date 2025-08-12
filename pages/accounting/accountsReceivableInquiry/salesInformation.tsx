import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _ from 'lodash';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import Selector_quotation, {
  TquotationListViewModel_Dto,
} from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_note from 'public/image/icon/fong/note.svg';

// api
import {
  TaccountsReceivable,
  apiQuotationToAccountsReceivables,
  useGetAccountsReceivables,
} from 'js/api/api_netCore/api_accountsReceivable';

// ============================================================================

interface Tquery {
  id?: string;
}

type TsalseOrderItem = TaccountsReceivable['salesOrderItem'][0];
type TpaymentRequest = TaccountsReceivable['paymentRequests'][0];

// ============================================================================

// MARK: START

export default function SalesInformation() {
  const router = useRouter();
  const { id: accountsReceivableId } = router.query as Tquery;
  const isNew = !accountsReceivableId;

  const { data, isFetching } = useGetAccountsReceivables(accountsReceivableId);

  const { accountsReceivablesList, paymentRequests, salesOrderItem } = data ?? {};

  const orderedPaymentRequests = useMemo(() => {
    return _.orderBy(paymentRequests, (item) => Number(item.period));
  }, [paymentRequests]);

  const {
    accountsReceivableNumber,
    sourceType,
    sourceId,
    customerNumber,
    customerName,
    companyPhone,
    companyFax,
    salesAmount,
    taxes,
    salesCurrency,
    exchangeRate,
    requestAmount,
    foreignCurrencyAmount,
    uncollectedPayment,
    collectAmount,
    totalAmount,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    status,
    prAmount,
    deduction,
    quotationContractNumber,
    projectName,
    salesOrderNumber,
    taxId,
    taxDeductionCategory,
  } = accountsReceivablesList ?? {};

  const onSelectQuotation = async (data: TquotationListViewModel_Dto | undefined) => {
    if (!data) {
      return;
    }

    await apiQuotationToAccountsReceivables(data.quotationNumber).then((id) => {
      router.replace({
        query: {
          ...router.query,
          id: id,
        },
      });
    });
  };

  const handle_search = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_quotation
          onConfirm={([data]) => {
            onSelectQuotation(data);
            destroy();
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
    });
  };

  // MARK: RENDER
  return (
    <div>
      {/*  */}
      <div className="pageTop ">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-semibold">應收款編輯</span>
          </div>
          <div className="flex gap-3">
            <Btn onClick={router.back}>返回</Btn>

            {isNew && (
              <>
                <Btn theme="query" onClick={handle_search}>
                  新增應收款
                </Btn>
              </>
            )}
          </div>
        </div>
      </div>
      {/*  */}

      <div className="border border-gray05 rounded-01 py-8 px-6">
        <div className="text-xl font-semibold mb-6">應收款</div>
        <div className="grid grid-cols-8 gap-fong ">
          {/*  */}

          <DataEntry_fong caption="合約編號" isMust={true} className="col-span-4">
            {quotationContractNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="案場名稱" className="col-span-4">
            {projectName}
          </DataEntry_fong>

          <DataEntry_fong caption="客戶編號" className="col-span-4">
            {customerNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="客戶名稱" className="col-span-4">
            {customerName}
          </DataEntry_fong>

          <DataEntry_fong className="col-span-2" caption="統一編號">
            {taxId}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="稅別">
            {taxDeductionCategory}
          </DataEntry_fong>
          <DataEntry_fong caption="外幣">{toLocaleString(foreignCurrencyAmount)}</DataEntry_fong>

          <DataEntry_fong caption="外幣金額">{'no property'}</DataEntry_fong>

          <DataEntry_fong caption="匯率">{exchangeRate}</DataEntry_fong>

          <DataEntry_fong className="col-span-2" caption="銷售金額">
            {<span className="text-right">{toLocaleString(salesAmount)}</span>}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="銷售稅金">
            {<span className="text-right">{toLocaleString(taxes)}</span>}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="追加減金額">
            {'no property'}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="追加減金額稅金">
            {'no property'}
          </DataEntry_fong>

          <DataEntry_fong className="col-span-2" caption="已收金額">
            {collectAmount}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="扣款折讓">
            {deduction}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="已請款總額">
            {prAmount}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="銷售總額">
            {totalAmount}
          </DataEntry_fong>

          <DataEntry_fong className="col-span-2" caption="合約保留款類型">
            {'no property'}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="稅別">
            {'no property'}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="百分比%">
            {'no property'}
          </DataEntry_fong>
          <DataEntry_fong className="col-span-2" caption="保留款金額">
            {'no property'}
          </DataEntry_fong>
        </div>
        {/*  */}
        <div className="mt-10">
          <div className="mb-6">
            <span className="text-xl font-semibold">銷貨明細</span>
          </div>
          <Table_antd columns={columns_salseOrderItem} dataSource={salesOrderItem} pagination={false} />
        </div>
        <div className="mt-10">
          <div className="mb-6">
            <span className="text-xl font-semibold mr-3">請款狀況</span>
            {data && (
              <Link
                href={{
                  pathname: 'paymentRequest',
                  query: {
                    accountsReceivableId: data.accountsReceivablesList.id,
                  },
                }}
              >
                <Btn theme="cross">新增請款資料</Btn>
              </Link>
            )}
          </div>
          <Table_antd columns={columns_paymentRequests} dataSource={orderedPaymentRequests} pagination={false} />
        </div>
      </div>
    </div>
  );
}

// MARK: END

// ==========================================================================

const toLocaleString = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// ==========================================================================

const columns_salseOrderItem: TableProps<TsalseOrderItem>['columns'] = [
  {
    title: '序號',
    dataIndex: 'serialNumber',
    width: 80,
    align: 'center',
    render: (_, __, index) => {
      return index + 1;
    },
  },
  {
    title: '產品代號',
    dataIndex: 'productNumber',
    width: 120,
  },
  {
    title: '產品名稱',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: '數量',
    align: 'right',
    dataIndex: 'quantity',
    width: 150,
  },
  {
    title: '單價',
    dataIndex: 'unitPrice',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {
    title: '金額',
    dataIndex: 'amount',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {},
];

const columns_paymentRequests: TableProps<TpaymentRequest>['columns'] = [
  {
    title: '請款單號',
    dataIndex: 'paymentRequestNumber',
    width: 150,
    align: 'right',
  },
  {
    title: '期別',
    dataIndex: 'period',
    width: 120,
    align: 'right',
  },
  {
    title: '類型',
    dataIndex: 'type',
    width: 150,
  },
  {
    title: '請款金額',
    dataIndex: 'paymentAmount',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {
    title: '實收金額',
    dataIndex: 'collect_amount',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {
    title: '折讓',
    dataIndex: 'deduction',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {
    title: '發票號碼',
    dataIndex: 'invoiceNumber',
    align: 'right',
    width: 150,
  },
  {
    title: '發票金額',
    dataIndex: 'invoiceAmount',
    align: 'right',
    width: 150,
    render: (value: number | null) => toLocaleString(value),
  },
  {},
  {
    title: '操作',
    key: 'action',
    width: 90,
    align: 'center',
    render: (_, record) => {
      return (
        <div className="flex justify-center items-center gap-6">
          <Link
            href={{
              pathname: 'paymentRequest',
              query: { id: record.id },
            }}
          >
            <Icon_note className="inline w-[16px] h-[16px] text-blue01" />
          </Link>
        </div>
      );
    },
  },
];
