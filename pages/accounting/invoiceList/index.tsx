import { useRouter } from 'next/router';

import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import { Form } from 'antd';

import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';

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

  const handle_searchInvoiceBood = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onCancel={() => destroy()}
          onConfirm={(selectd) => {
            destroy();

            console.log('Selected Invoice Book:', selectd);
          }}
        />
      ),
    });
  };

  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <div className={classNames('flex gap-4 items-center')}>
          <div className="text-base font-semibold">應收款列表</div>

          <Btn theme="query" onClick={handle_searchInvoiceBood}>
            搜索資料
          </Btn>
        </div>
        <div></div>
      </div>
    </div>
  );
}

// MARK: END
