import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';

import {
  Tparams,
  useGetAccountantInvoiceBook,
  TaccountantInvoiceBookDto,
  apiGetAccountantInvoiceBook,
} from 'js/api/api_accountant';

import { Tinvoice_Dto, useApiGetInvoiceNumberLists } from 'js/api/api_netCore/api_invoice';

// ==========================================================================

interface Tquery {
  id?: string;
}

// ==========================================================================

// MARK: START

export default function InvoiceList() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: invoiceBookId } = query;

  const [state_invoiceBook, setState_invoiceBook] = useState<TaccountantInvoiceBookDto>();

  const invoiceBookDesc = state_invoiceBook && getInvoiceBookDesc(state_invoiceBook);

  const { data: raw_invoiceArr } = useApiGetInvoiceNumberLists(state_invoiceBook?.id);

  // ----------------------------------------------------------------------------

  // ----------------------------------------------------------------------------

  const handle_searchInvoiceBood = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onCancel={() => destroy()}
          onConfirm={(invoiceBook) => {
            if (invoiceBook) {
              setState_invoiceBook(invoiceBook);
            }

            if (invoiceBook?.id) {
              router.replace({
                query: {
                  ...query,
                  id: invoiceBook.id,
                },
              });
            }

            destroy();
          }}
        />
      ),
    });
  };

  // ----------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      if (!invoiceBookId) {
        return;
      }

      await apiGetAccountantInvoiceBook({
        filter: {
          id: { $eq: invoiceBookId },
        },
      })
        .then(({ data: invoiceBookArr }) => {
          setState_invoiceBook(invoiceBookArr[0]);
        })
        .catch(() => {
          myAlert.notify.error({ message: '取得發票本失敗' });
        });
    })();
  }, []);

  // ----------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <div className={classNames('flex gap-4 items-center')}>
          <div className="text-base font-semibold">發票列表</div>

          <span className="w-[150px]">{invoiceBookDesc}</span>

          <Btn theme="query" onClick={handle_searchInvoiceBood}>
            選擇發票本
          </Btn>
        </div>
      </div>
      <Table_antd key={state_invoiceBook?.id} dataSource={raw_invoiceArr || []} columns={columns} pagination={{}} />
    </div>
  );
}

// MARK: END

const getInvoiceBookDesc = (invoiceBook: TaccountantInvoiceBookDto) => {
  const { year, month, period, alphabeticLetter } = invoiceBook;

  const twYear = Number(year) - 1911;

  const monthRanve = `${month}-${Number(month) + 1}`;

  return `${twYear}年 ${monthRanve} ${alphabeticLetter} 第${period}期`;
};

const columns: TableProps<Tinvoice_Dto>['columns'] = [
  {
    title: '發票號碼',
    dataIndex: 'fullInvoiceNumber',
    width: 150,
  },
  {
    title: '專案名稱',
    dataIndex: 'projectName',
  },
  {
    title: '買受人',
    dataIndex: 'buyer',
    width: 300,
  },
  {
    title: '未稅金額',
    dataIndex: 'invoiceAmount',
    width: 150,
    align: 'right',
    render: (text) => '$' + text?.toLocaleString(),
  },
  {
    title: '稅金',
    dataIndex: 'invoiceTaxes',
    width: 150,
    align: 'right',
    render: (text) => '$' + text?.toLocaleString(),
  },
  {
    title: '發票金額',
    dataIndex: 'totalAmount',
    width: 150,
    align: 'right',
    render: (text) => '$' + text?.toLocaleString(),
  },
  {
    key: 'panel',
    width: 100,
    align: 'center',
    render: (text) => {
      return <SquareBtn sharp="mini">開立</SquareBtn>;
    },
  },
];
