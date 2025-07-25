import { useState, useEffect, useMemo } from 'react';

import classNames from 'classnames';
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

// api
import {
  apiQuotationToAccountsReceivables,
  getAccountsReceivableFromQuotation,
} from 'js/api/api_netCore/api_accountsReceivable';

// ============================================================================

type Tstate = {
  id?: string;
  contractNumber: string; // 合約編號
  projectName: string; // 案場名稱
  customerNumber: string; // 客戶編號
  customerName: string; // 客戶名稱
  customerTaxId: string; // 統一編號
  taxType: string; // 稅別
  currency: string; // 外幣
  total: number | null; // 銷售金額
  salesTax: number | null; // 銷售稅金

  attachmentTotal: '沒有property' | number | null; // 追加減金額
  attachmentTax: '沒有property' | number | null; // 追加減金額稅金

  receivedAmount: '沒有property' | number | null; // 已收金額
  discountAmount: '沒有property' | number | null; // 扣款折讓

  totalAmount: '沒有property' | number | null; // 已請款總額
  salesTotal: '沒有property' | number | null; // 銷售總額
};

// ============================================================================

// MARK: START

export default function SalesInformation() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = !id;

  const [state, setState] = useState<Tstate>();

  const onSelectQuotation = async (data: TquotationListViewModel_Dto | undefined) => {
    if (!data) {
      return;
    }

    await getAccountsReceivableFromQuotation(data.id);

    const {
      // status,
      // reviewManagerEmployeeId,
      // managerReviewedAt,
      // quotationNumber,
      // version,
      // customerId,
      projectName,
      // county,
      // district,
      // address,
      // contactPerson,
      // contactNumber,
      // quantity,
      // editNotes,
      // discount,
      // subTotal,
      salesTax,
      total,
      // deliveryLocation,
      // paymentMethods,
      // supervisorEmployeeId,
      // agentEmployeeId,
      // reviewSalesEmployeeId,
      // productsOrder,
      // tuneTotal,
      // averageDiscount,
      // estimatedDiscount,
      // type,
      currency,
      // foreignTotal,
      // exchangeRate,
      // contractId,
      // ontractStatus,
    } = data;

    const newState: Tstate = {
      ...state,
      contractNumber: '沒有property',
      projectName,
      customerNumber: '沒有property',
      customerName: '沒有property',
      customerTaxId: '沒有property',
      taxType: '沒有property',
      currency,
      total,
      salesTax,
      attachmentTotal: '沒有property',
      attachmentTax: '沒有property',
      receivedAmount: '沒有property',
      discountAmount: '沒有property',
      totalAmount: '沒有property',
      salesTotal: '沒有property',
    };

    setState(newState);
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
                查詢資料
              </Btn>
              <Btn theme="save">儲存</Btn>
            </>
          )}
        </div>
      </div>
      {/*  */}

      <div className="border border-gray05 rounded-01 py-8 px-6">
        <div className="text-xl font-semibold mb-6">應收款</div>
        <div className="grid grid-cols-4 gap-fong ">
          <DataEntry_fong caption="合約編號" isMust={true} className="col-span-2">
            {state?.contractNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="案場名稱" className="col-span-2">
            {state?.projectName}
          </DataEntry_fong>
          <DataEntry_fong caption="客戶編號" className="col-span-2">
            {state?.customerNumber}
          </DataEntry_fong>
          <DataEntry_fong caption="客戶名稱" className="col-span-2">
            {state?.customerName}
          </DataEntry_fong>
          <DataEntry_fong caption="統一編號" className="col-span-2">
            {state?.customerTaxId}
          </DataEntry_fong>
          <DataEntry_fong caption="稅別">{state?.taxType}</DataEntry_fong>
          <DataEntry_fong caption="外幣">{state?.currency}</DataEntry_fong>
          <DataEntry_fong caption="銷售金額">
            {<span className="text-right"></span>}
            {/* {<span className="text-right">{toLocaleString(state?.total)}</span>} */}
          </DataEntry_fong>
          <DataEntry_fong caption="銷售稅金">
            {<span className="text-right">{toLocaleString(state?.salesTax)}</span>}
          </DataEntry_fong>
          <DataEntry_fong caption="追加減金額">{state?.attachmentTotal}</DataEntry_fong>
          <DataEntry_fong caption="追加減金額稅金">{state?.attachmentTax}</DataEntry_fong>
          <DataEntry_fong caption="已收金額">{state?.receivedAmount}</DataEntry_fong>
          <DataEntry_fong caption="扣款折讓">{state?.discountAmount}</DataEntry_fong>
          <DataEntry_fong caption="已請款總額">{state?.totalAmount}</DataEntry_fong>
          <DataEntry_fong caption="銷售總額">{state?.salesTotal}</DataEntry_fong>
        </div>
        {/*  */}
        <div className="mt-10">
          <div className="mb-6">
            <span className="text-xl font-semibold">銷貨明細</span>
          </div>
          <Table_antd columns={columns01} dataSource={fakeData01} pagination={false} />
        </div>
        <div className="mt-10">
          <div className="mb-6">
            <span className="text-xl font-semibold mr-3">請款狀況</span>
            <Link href="receivable">
              <Btn theme="cross">新增資料</Btn>
            </Link>
          </div>
          <Table_antd columns={columns02} dataSource={fakeData02} pagination={false} />
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

interface TfakeData01 {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
}
interface TfakeData02 {
  id: string;
  idNumber: string;
  period: string;
  type: string;
  requestAmount: number;
  amountReceived: number;
  discount: number;
}
const columns01: TableProps<TfakeData01>['columns'] = [
  {
    title: '序號',
    dataIndex: 'serialNumber',
    width: 80,
    align: 'center',
  },
  {
    title: '產品代號',
    dataIndex: 'idNumber',
    width: 120,
  },
  {
    title: '產品名稱',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '數量',
    align: 'right',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '單價',
    dataIndex: 'price',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '金額',
    dataIndex: 'totalPrice',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {},
];

const columns02: TableProps<TfakeData02>['columns'] = [
  {
    title: '請款單號',
    dataIndex: 'idNumber',
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
    dataIndex: 'requestAmount',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '實收金額',
    dataIndex: 'amountReceived',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '折讓',
    dataIndex: 'discount',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {},
  {
    title: '操作',
    key: 'action',
    width: 90,
    align: 'center',
    render: (_, record) => {
      return <Icon_trash className="inline w-[16px] h-[16px] text-red01" />;
    },
  },
];

const fakeData01: TfakeData01[] = Array.from({ length: 11 }, (_, index) => ({
  id: `id-${index}`,
  serialNumber: `${index + 1}`,
  idNumber: `SD${index + 1000}`,
  name: 'SJ-302',
  qty: Math.floor(Math.random() * 10) + 1,
  price: 99999,
  totalPrice: 99999,
}));

const fakeData02: TfakeData02[] = Array.from({ length: 10 }, (_, index) => ({
  id: `id-${index}`,
  idNumber: `INV${index + 2000}`,
  period: `2023/06`,
  type: '代收支付',
  requestAmount: 99999,
  amountReceived: 99999,
  discount: 99999,
}));
