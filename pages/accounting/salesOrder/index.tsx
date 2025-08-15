import { useState, useEffect, useReducer, useMemo } from 'react';

import { useRouter } from 'next/router';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import Btn from 'components/global/gear/button/btn_fong';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import SalesOrderInfo from 'components/page/accounting/salesOrder/salesOrderInfo';
import SalesOrderItemList from 'components/page/accounting/salesOrder/salesOrderItemList';

import {
  useApiGetSalesOrderById,
  TsalesOrder_Dto,
  TsalesOrder_post_Dto,
  TsalesOrder_patch_Dto,
  apiPostSalesOrderData,
  apiPatchSalesOrderData,
} from 'js/api/api_netCore/api_accountsReceivable';

import { useSalesOrderItemArr } from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';
import { useSalesOrder } from 'components/page/accounting/salesOrder/hook/useSalesOrder';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

// ============================================================================

interface Tquery {
  id?: string;
}

// ============================================================================

// MARK:START

export default function SalesOrder() {
  const router = useRouter();
  const query = router.query as Tquery;

  const { userInfo } = useGlobal_userInfo();

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
              quotationNumber,
              contractNumber,
              projectName,
              subTotal,
              salesTax,
              total,
              currency,
              foreignTotal,
              exchangeRate,
              customerName,
            } = quotation;

            instance_salesOrder.setState((prev) => ({
              ...prev,
              quotationNumber,
              quotationContractNumber: contractNumber || '',
              constructionSite: projectName || '',
              customerNumber: '',
              customerName: customerName || '',
              salesAmount: `${subTotal || ''}`,
              taxes: `${salesTax || ''}`,
              totalAmount: `${total || ''}`,
              sourceType: '',
              客戶聯絡電話1: '',
              客戶聯絡電話2: '',
              address: '',
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

  const createBody_post = () => {
    // TsalesOrder_post_Dto,
    // TsalesOrder_patch_Dto,
    //     instance_salesOrder
    const { state: state_salesOrder } = instance_salesOrder;
    const { state: state_salesOrderItemArr } = instance_salesOrderItemArr;

    const {
      quotationNumber,
      quotationContractNumber,
      constructionSite,

      customerId,
      customerNumber,
      customerName,
      companyPhone,
      companyFax,

      salesAmount,
      taxes,
      totalAmount,
      sourceType: 類別,
      客戶聯絡電話1,
      客戶聯絡電話2,
      address,
      invoiceType,
      taxId,
      taxDeductionCategory,
      salesCurrency,
      exchangeRate,
      currencyAmount,
    } = state_salesOrder;

    const userIdNumber = userInfo?.employee?.idNumber;

    const errorMessage: string[] = [];

    !userIdNumber && errorMessage.push('User idNumber is undefined');
    !salesCurrency && errorMessage.push('請選擇幣別');
    !exchangeRate && errorMessage.push('請輸入匯率');
    !currencyAmount && errorMessage.push('請輸入外幣金額');
    !salesAmount && errorMessage.push('請輸入銷貨金額');
    !taxes && errorMessage.push('請輸入稅額');
    !totalAmount && errorMessage.push('請輸入銷售總總額');

    if (errorMessage.length) {
      myAlert.err({
        title: '錯誤',
        content: errorMessage.join('\n'),
      });

      return null;
    }

    const salesOrderItems: TsalesOrder_post_Dto['salesOrderItems'] = [];

    // const salesOrderItems = state_salesOrderItemArr.map((item) => {
    //   const { raw, quantity, unitPrice, amount } = item;

    //   const salesOrderItem: TsalesOrder_post_Dto['salesOrderItems'][number] = {
    //     ...raw,
    //     id: null,
    //     salesOrderNumber: null,
    //     quantity: Number(quantity),
    //     unitPrice: Number(unitPrice),
    //     amount,
    //   };

    //   return salesOrderItem;
    // });

    const body: TsalesOrder_post_Dto = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userIdNumber!,
      updatedBy: userIdNumber!,

      customerId,
      customerNumber,
      customerName,
      constructionSite,
      companyPhone,
      companyFax,
      address,
      salesCurrency,
      exchangeRate: Number(exchangeRate),
      currencyAmount: Number(currencyAmount),

      salesAmount: Number(salesAmount),
      taxes: Number(taxes),
      changedAmount: null,
      changedTaxes: null,
      totalAmount: Number(totalAmount),

      status: null,
      // sourceType: null,
      sourceType: 'test',
      sourceId: null,
      quotationNumber,
      quotationContractNumber,
      taxId,
      taxDeductionCategory,
      invoiceType,
      salesOrderItems,
    };

    return body;

    //
    //
    //
  };

  const req_postOrPatch = async () => {
    const body = createBody_post();

    if (body) {
      await apiPostSalesOrderData(body);
    }
  };

  // ---------------------------------------------------------------------------

  const handle_save = () => {
    if (isNew) {
      req_postOrPatch();
    }
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
          <Btn theme="save" onClick={handle_save}>
            儲存
          </Btn>
        </div>
      </div>

      <SalesOrderInfo instance_salesOrder={instance_salesOrder} />

      <SalesOrderItemList className={'mt-10'} instance_salesOrderItemArr={instance_salesOrderItemArr} />
    </div>
  );
}

// MARK: END
// ==========================================================================
