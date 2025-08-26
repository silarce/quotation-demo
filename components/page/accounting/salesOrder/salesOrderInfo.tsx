import { DataEntry_fong, Input, Input_money, Select } from 'components/global/gear/dataEntry';

import { Ttax_type } from 'js/api/api_netCore/schemas';

import { Tinstance_salesOrder } from 'components/page/accounting/salesOrder/hook/useSalesOrder';

import { useApiGetDropDown } from 'js/api/api_netCore/api_commonControllers';

import { optionsCreator_currency } from 'js/utils/options/options';

const options_currency = optionsCreator_currency();

import { selector_customer } from 'components/composition/selectorModal/selector_customer';

export default function SalesOrderInfo({ instance_salesOrder }: { instance_salesOrder: Tinstance_salesOrder }) {
  const { state: state_salesOrder, setState: setState_salesOrder } = instance_salesOrder;

  const { options: options_invoiceType } = useApiGetDropDown('InvoiceType');
  const { options: options_salesOrderType } = useApiGetDropDown('sales_order_type');
  const { options: options_taxCategory } = useApiGetDropDown('RetainageTaxCategory');

  const hancle_selectCustomer = () => {
    const { destroy } = selector_customer({
      onConfirm: (customerArr) => {
        const customer = customerArr[0];

        if (!customer) {
          return;
        }

        setState_salesOrder((prev) => {
          const copy = { ...prev };

          const {
            id,
            customerNumber,
            name,
            address,
            taxId,

            phone,
            fax,
          } = customer;

          return {
            ...copy,
            customerId: id,
            customerNumber,
            customerName: name,
            address,
            taxId,
            companyPhone: phone,
            companyFax: fax,
          };
        });
        destroy();
      },
      onCancel() {
        destroy();
      },
    });
  };

  return (
    <div className="grid grid-cols-4 gap-fong">
      {/*  */}
      <DataEntry_fong caption="類別" isMust={true}>
        <Select
          options={options_salesOrderType}
          value={state_salesOrder.sourceType}
          onChange={(v) => setState_salesOrder({ ...state_salesOrder, sourceType: v })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="合約編號">
        <Input
          value={state_salesOrder.quotationContractNumber}
          onChange={(e) => {
            setState_salesOrder({ ...state_salesOrder, quotationContractNumber: e.target.value });
          }}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="案場名稱" className="col-span-2">
        <Input
          value={state_salesOrder.constructionSite}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, constructionSite: e.target.value })}
        />
      </DataEntry_fong>
      {/*  */}
      <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true} onClick={hancle_selectCustomer}>
        {state_salesOrder.customerNumber}
      </DataEntry_fong>

      <DataEntry_fong caption="客戶名稱" className="col-span-2" disabled={true}>
        {state_salesOrder.customerName}
      </DataEntry_fong>
      {/*  */}

      <DataEntry_fong caption="客戶地址" className="col-span-2" disabled={true}>
        {state_salesOrder.address}
      </DataEntry_fong>

      <DataEntry_fong caption="客戶聯絡電話">
        <Input
          value={state_salesOrder.companyPhone}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, companyPhone: e.target.value })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="傳真">
        <Input
          value={state_salesOrder.companyFax}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, companyFax: e.target.value })}
        />
      </DataEntry_fong>

      {/*  */}

      <DataEntry_fong caption="統一編號" className="col-span-2" disabled={true}>
        {state_salesOrder.taxId}
      </DataEntry_fong>

      <DataEntry_fong caption="發票類型">
        <Select
          options={options_invoiceType}
          value={state_salesOrder.invoiceType}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, invoiceType: e as string })}
        />
      </DataEntry_fong>

      <div />

      {/*  */}
      <DataEntry_fong caption="幣別" isMust={true}>
        <Select
          options={options_currency}
          value={state_salesOrder.salesCurrency}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, salesCurrency: e as string })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="匯率">
        <Input
          type="number"
          value={state_salesOrder.exchangeRate}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, exchangeRate: e.target.value as `${number}` })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="外幣金額">
        <Input_money
          value={state_salesOrder.currencyAmount}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, currencyAmount: e.target.value as `${number}` })}
        />
      </DataEntry_fong>

      <div />

      {/*  */}

      <DataEntry_fong caption="銷售金額" isMust={true}>
        <Input_money
          value={state_salesOrder.salesAmount}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, salesAmount: e.target.value as `${number}` })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="稅別" isMust={true}>
        <Select
          options={options_taxCategory}
          value={state_salesOrder.taxDeductionCategory}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, taxDeductionCategory: e as Ttax_type })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="稅金" isMust={true}>
        <Input_money
          value={state_salesOrder.taxes}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, taxes: e.target.value as `${number}` })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="銷售總額" isMust={true}>
        <Input_money
          value={state_salesOrder.totalAmount}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, totalAmount: e.target.value as `${number}` })}
        />
      </DataEntry_fong>
    </div>
  );
}
