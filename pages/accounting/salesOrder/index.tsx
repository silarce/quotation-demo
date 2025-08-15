import { useState, useEffect, useReducer, useMemo } from 'react';

import { useRouter } from 'next/router';

import Btn from 'components/global/gear/button/btn_fong';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import SalesOrderInfo from 'components/page/accounting/salesOrder/salesOrderInfo';
import SalesOrderItemList from 'components/page/accounting/salesOrder/salesOrderItemList';

import {
  useApiGetSalesOrderById,
  TsalesOrder_Dto,
  apiPostSalesOrderData,
  apiPatchSalesOrderData,
} from 'js/api/api_netCore/api_accountsReceivable';

import { useSalesOrderItemArr } from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';
import { useSalesOrder } from 'components/page/accounting/salesOrder/hook/useSalesOrder';

// ============================================================================

interface Tquery {
  id?: string;
}

// ============================================================================

// MARK:START

export default function SalesOrder() {
  const router = useRouter();
  const query = router.query as Tquery;

  const isNew = !query.id;

  const [disabled, setDisabled] = useState(false);

  const {
    data: salesOrderData,
    isFetching: isFetchingSalesOrder,
    update: updateSalesOrder,
  } = useApiGetSalesOrderById(query.id);

  const instance_salesOrder = useSalesOrder(salesOrderData);

  const instance_salesOrderItemArr = useSalesOrderItemArr(salesOrderData?.salesOrderItems);

  // ---------------------------------------------------------------------------
  const handle_importContract = () => {
    const { destroy } = modal_empty({
      width: 'fit-content',
      content: (
        <Selector_quotation
          onCancel={() => {
            destroy();
          }}
          onConfirm={([quotation]) => {
            if (!quotation) {
              destroy();

              return;
            }

            const {
              projectName,
              subTotal,
              salesTax,
              total,
              currency,
              foreignTotal,
              exchangeRate,
              contractNumber,
              customerName,
            } = quotation;

            instance_salesOrder.setState((prev) => ({
              ...prev,
              quotationContractNumber: contractNumber || '',
              constructionSite: projectName || '',
              customerNumber: '',
              customerName: customerName || '',
              salesAmount: `${subTotal || ''}`,
              taxes: `${salesTax || ''}`,
              totalAmount: `${total || ''}`,
              類別: '',
              客戶聯絡電話1: '',
              客戶聯絡電話2: '',
              客戶地址: '',
              invoiceType: '',
              taxId: '',
              taxDeductionCategory: '',
              salesCurrency: currency,
              exchangeRate: `${exchangeRate || ''}`,
              currencyAmount: `${foreignTotal || ''}`,
            }));

            destroy();

            //
          }}
        />
      ),
    });
  };

  // ---------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          <Btn theme="import" onClick={handle_importContract}>
            合約匯入
          </Btn>
          <Btn themeColor="red_I" onClick={instance_salesOrder.reset}>
            重置
          </Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>

      <SalesOrderInfo instance_salesOrder={instance_salesOrder} />

      <SalesOrderItemList className={'mt-10'} instance_salesOrderItemArr={instance_salesOrderItemArr} />
    </div>
  );
}

// MARK: END
// ==========================================================================
