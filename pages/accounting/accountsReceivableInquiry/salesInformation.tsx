import { useRouter } from 'next/router';
import Link from 'next/link';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import Selector_quotation, {
  TquotationListViewModel_Dto,
} from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_note from 'public/image/icon/fong/note.svg';

// api
import { TaccountsReceivable, useGetAccountsReceivables } from 'js/api/api_netCore/api_accountsReceivable';

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
  const { id } = router.query as Tquery;
  const isNew = !id;

  const { data, isFetching } = useGetAccountsReceivables(id);

  const { accountsReceivablesList, paymentRequests, salesOrderItem } = data ?? {};

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
  } = accountsReceivablesList ?? {};

  const onSelectQuotation = async (data: TquotationListViewModel_Dto | undefined) => {
    if (!data) {
      return;
    }

    router.replace({
      query: {
        ...router.query,
        id: data.quotationNumber,
      },
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
        <div className="flex gap-3 w-fit ml-auto mr-0">
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
      {/*  */}

      <div className="border border-gray05 rounded-01 py-8 px-6">
        <div className="text-xl font-semibold mb-6">應收款</div>
        <div className="grid grid-cols-4 gap-fong ">
          <DataEntry_fong caption="合約編號" isMust={true} className="col-span-2">
            {quotationContractNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="案場名稱" className="col-span-2">
            {projectName}
          </DataEntry_fong>
          <DataEntry_fong caption="客戶編號" className="col-span-2">
            {customerNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="客戶名稱" className="col-span-2">
            {customerName}
          </DataEntry_fong>
          <DataEntry_fong caption="統一編號" className="col-span-2">
            {'customerTaxId'}
          </DataEntry_fong>
          <DataEntry_fong caption="稅別">{'taxType'}</DataEntry_fong>
          <DataEntry_fong caption="外幣">{toLocaleString(foreignCurrencyAmount)}</DataEntry_fong>
          <DataEntry_fong caption="銷售金額">
            {<span className="text-right">{toLocaleString(salesAmount)}</span>}
          </DataEntry_fong>
          <DataEntry_fong caption="銷售稅金">
            {<span className="text-right">{toLocaleString(taxes)}</span>}
          </DataEntry_fong>
          <DataEntry_fong caption="追加減金額">{'attachmentTotal'}</DataEntry_fong>
          <DataEntry_fong caption="追加減金額稅金">{'attachmentTax'}</DataEntry_fong>
          <DataEntry_fong caption="已收金額">{'receivedAmount'}</DataEntry_fong>
          <DataEntry_fong caption="扣款折讓">{'discountAmount'}</DataEntry_fong>
          <DataEntry_fong caption="已請款總額">{prAmount}</DataEntry_fong>
          <DataEntry_fong caption="銷售總額">{totalAmount}</DataEntry_fong>
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
            <Link href="paymentRequest">
              <Btn theme="cross">新增工程項目明細</Btn>
            </Link>
          </div>
          <Table_antd columns={columns_paymentRequests} dataSource={paymentRequests} pagination={false} />
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
  },
  {
    title: '期別',
    dataIndex: 'period',
    width: 120,
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
          <Icon_trash className="inline w-[16px] h-[16px] text-red01" />
        </div>
      );
    },
  },
];
