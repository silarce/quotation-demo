import { DataEntry_fong, Input, Input_money, Select } from 'components/global/gear/dataEntry';

import { Ttax_type } from 'js/api/api_netCore/schemas';

import { Tinstance_salesOrder } from 'components/page/accounting/salesOrder/hook/useSalesOrder';

export default function SalesOrderInfo({ instance_salesOrder }: { instance_salesOrder: Tinstance_salesOrder }) {
  const { state: state_salesOrder, setState: setState_salesOrder } = instance_salesOrder;

  return (
    <div className="grid grid-cols-4 gap-fong">
      {/*  */}
      <DataEntry_fong caption="類別" className="" isMust={true}>
        <Select
          value={state_salesOrder.類別}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, 類別: e as string })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="合約編號" className="">
        <Input
          value={state_salesOrder.quotationContractNumber}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, quotationContractNumber: e.target.value })}
        />
      </DataEntry_fong>

      <DataEntry_fong caption="案場名稱" className="col-span-2">
        <Input
          value={state_salesOrder.constructionSite}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, constructionSite: e.target.value })}
        />
      </DataEntry_fong>
      {/*  */}
      <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
        {state_salesOrder.customerNumber}
      </DataEntry_fong>

      <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
        {state_salesOrder.customerName}
      </DataEntry_fong>
      {/*  */}

      <DataEntry_fong caption="客戶地址" className="col-span-2">
        {state_salesOrder.customerName}
      </DataEntry_fong>

      <DataEntry_fong caption="客戶聯絡電話1" className="">
        <Input
          value={state_salesOrder.客戶聯絡電話1}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, 客戶聯絡電話1: e.target.value })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="客戶聯絡電話2" className="">
        <Input
          value={state_salesOrder.客戶聯絡電話2}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, 客戶聯絡電話2: e.target.value })}
        />
      </DataEntry_fong>

      {/*  */}

      <DataEntry_fong caption="統一編號" className="col-span-2">
        {state_salesOrder.taxId}
      </DataEntry_fong>

      <DataEntry_fong caption="發票類型" className="">
        <Select
          value={state_salesOrder.invoiceType}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, invoiceType: e as string })}
        />
      </DataEntry_fong>

      <div />

      {/*  */}
      <DataEntry_fong caption="幣別" className="" isMust={true}>
        <Select
          value={state_salesOrder.salesCurrency}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, salesCurrency: e as string })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="匯率" className="" isMust={true}>
        <Input
          type="number"
          value={state_salesOrder.exchangeRate}
          onChange={(e) => setState_salesOrder({ ...state_salesOrder, exchangeRate: e.target.value as `${number}` })}
        />
      </DataEntry_fong>
      <DataEntry_fong caption="外幣金額" className="" isMust={true}>
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

      <DataEntry_fong caption="稅別" className="" isMust={true}>
        <Select
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
