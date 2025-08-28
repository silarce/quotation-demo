import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Spin } from 'antd';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Btn from 'components/global/gear/button/btn_fong';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';
import SalesOrderInfo from 'components/page/accounting/salesOrder/salesOrderInfo';
import SalesOrderItemList from 'components/page/accounting/salesOrder/salesOrderItemList';
import { modal_leave } from 'components/global/gear/modal/fongModal';

import {
  useApiGetSalesOrderById,
  TsalesOrder_post_Dto,
  TsalesOrder_patch_Dto,
  apiPostSalesOrderData,
  apiPatchSalesOrderData,
} from 'js/api/api_netCore/api_accountsReceivable';

import { useSalesOrder } from 'components/page/accounting/salesOrder/hook/useSalesOrder';
import { useSalesOrderItemArr } from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';

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

  const {
    data: salesOrderData,
    isFetching: isFetchingSalesOrder,
    update: updateSalesOrder,
    req_salesOrderToAccountsReceivables,
  } = useApiGetSalesOrderById(query.id);

  const instance_salesOrder = useSalesOrder(salesOrderData);

  const instance_salesOrderItemArr = useSalesOrderItemArr(salesOrderData?.salesOrderItems);

  // ---------------------------------------------------------------------------

  const createBody_post = () => {
    const { state: state_salesOrder } = instance_salesOrder;
    const { state: state_salesOrderItemArr } = instance_salesOrderItemArr;

    const {
      sourceType,
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
    !sourceType && errorMessage.push('請選擇類別');
    !salesCurrency && errorMessage.push('請選擇幣別');
    // !exchangeRate && errorMessage.push('請輸入匯率');
    // !currencyAmount && errorMessage.push('請輸入外幣金額');
    !salesAmount && errorMessage.push('請輸入銷貨金額');
    !taxes && errorMessage.push('請輸入稅額');
    !totalAmount && errorMessage.push('請輸入銷售總總額');
    !state_salesOrderItemArr.length && errorMessage.push('請新增銷貨明細');

    if (errorMessage.length) {
      myAlert.err({
        title: '錯誤',
        content: errorMessage.join('\n'),
      });

      return null;
    }

    const salesOrderItems: TsalesOrder_post_Dto['salesOrderItems'] = state_salesOrderItemArr.map((item, index) => {
      const {
        attachedToProductId,
        productId,
        productName,
        productNumber,

        quantity,
        unitPrice,
        amount,
      } = item;

      const salesOrderItem: TsalesOrder_post_Dto['salesOrderItems'][number] = {
        id: null,
        attachedToProductId,
        salesOrderNumber: null,
        itemNumber: `${index}`,

        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        amount,
        productId,
        productName,
        productNumber,
      };

      return salesOrderItem;
    });

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
      sourceType: sourceType!,

      sourceId: null,
      quotationNumber,
      quotationContractNumber,
      taxId,
      taxDeductionCategory,
      invoiceType,
      salesOrderItems,
    };

    return body;
  };

  const createBody_patch = () => {
    if (!salesOrderData || !salesOrderData.salesOrderNumber) {
      return;
    }

    const body_post = createBody_post();

    if (!body_post) {
      return body_post;
    }

    const { state: state_salesOrderItemArr } = instance_salesOrderItemArr;

    const salesOrderItems = state_salesOrderItemArr.map((item, index) => {
      const {
        quantity,
        unitPrice,
        amount,

        productName,
        productNumber,
      } = item;

      const salesOrderItem: TsalesOrder_patch_Dto['salesOrderItems'][number] = {
        attachedToProductId: item.attachedToProductId,
        productId: item.productId,

        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        amount,
        productName,
        productNumber,
        itemNumber: `${index}`,

        id: null,
        salesOrderNumber: salesOrderData.salesOrderNumber,
      };

      return salesOrderItem;
    });

    const body: TsalesOrder_patch_Dto = {
      ...body_post,
      id: salesOrderData.id,
      salesOrderNumber: salesOrderData.salesOrderNumber,
      salesOrderItems,
      itemNumber: '',
    };

    return body;
  };

  const req_postOrPatch = async () => {
    if (isNew) {
      const body = createBody_post();

      if (body) {
        try {
          const id = await apiPostSalesOrderData(body);
          myAlert.success({
            title: '銷貨單已新增',
          });
          router.replace({
            query: {
              ...query,
              id,
            },
          });
        } catch (error) {}
      }
    } else {
      const body = createBody_patch();

      if (body) {
        try {
          await apiPatchSalesOrderData(body);
          await updateSalesOrder();
          myAlert.success({
            title: '銷貨單已更新',
          });
        } catch (error) {}
      }
    }
  };

  const handle_salesOrderToAccountsReceivables = async () => {
    if (!salesOrderData?.id) {
      return;
    }

    myAlert.confirm({
      title: '確認銷貨單轉應收款？',
      props: {
        onOk: async () => {
          await req_salesOrderToAccountsReceivables();
        },
      },
    });
  };

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
              customerNumber,
              customerId,
            } = quotation;

            instance_salesOrder.setState((prev) => ({
              ...prev,
              quotationNumber,
              quotationContractNumber: contractNumber || '',
              constructionSite: projectName || '',

              customerId,
              customerName: customerName || '',
              salesAmount: `${subTotal || ''}`,
              taxes: `${salesTax || ''}`,
              totalAmount: `${total || ''}`,
              customerNumber,
              sourceType: '',

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

  const handle_importOldProject = () => {};

  const handle_reset = () => {
    modal_leave({
      title: '確認重置嗎？',
      onConfirm: () => {
        instance_salesOrder.reset();
        instance_salesOrderItemArr.reset();
      },
    });
  };

  const handle_save = () => {
    req_postOrPatch();
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    instance_salesOrder.setAmount(instance_salesOrderItemArr.totalAmount);
  }, [instance_salesOrderItemArr.totalAmount, instance_salesOrder.state.taxDeductionCategory]);

  // ---------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          {!salesOrderData?.accountsReceivableId && salesOrderData?.id && (
            <Btn onClick={handle_salesOrderToAccountsReceivables}>銷貨單轉應收款</Btn>
          )}

          <Btn theme="import" onClick={handle_importOldProject}>
            舊案場匯入
          </Btn>
          <Btn theme="import" onClick={handle_importContract}>
            合約匯入
          </Btn>
          <Btn themeColor="red_I" onClick={handle_reset}>
            重置
          </Btn>
          <Btn theme="save" onClick={handle_save}>
            儲存
          </Btn>
        </div>
      </div>
      <Spin spinning={isFetchingSalesOrder} delay={300}>
        <SalesOrderInfo instance_salesOrder={instance_salesOrder} />
        <SalesOrderItemList className={'mt-10'} instance_salesOrderItemArr={instance_salesOrderItemArr} />
      </Spin>
    </div>
  );
}

// MARK: END
// ==========================================================================
