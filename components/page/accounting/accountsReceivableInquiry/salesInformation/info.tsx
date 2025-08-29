import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';

// =============================================================================

export default function Info() {
  return (
    <div>
      <div className="grid grid-cols-8 gap-fong ">
        {/*  */}

        {/* <DataEntry_fong caption="合約編號" isMust={true} className="col-span-4">
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
        <DataEntry_fong caption="幣別">{currency}</DataEntry_fong>

        <DataEntry_fong caption="外幣金額">{toLocaleString(foreignCurrencyAmount)}</DataEntry_fong>

        <DataEntry_fong className="col-span-2" caption="匯率">
          {exchangeRate}
        </DataEntry_fong>

        <DataEntry_fong className="col-span-2" caption="銷售金額">
          {toLocaleString(salesAmount)}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="銷售稅金">
          {toLocaleString(taxes)}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="追加減金額">
          {'no property'}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="追加減金額稅金">
          {'no property'}
        </DataEntry_fong>

        <DataEntry_fong className="col-span-2" caption="已收金額">
          {toLocaleString(collectAmount)}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="扣款折讓">
          {toLocaleString(deduction)}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="已請款總額">
          {toLocaleString(prAmount)}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="銷售總額">
          {toLocaleString(totalAmount)}
        </DataEntry_fong>

        <DataEntry_fong className="col-span-2" caption="合約保留款類型">
          {retainageType}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="稅別">
          {retainageTaxCategory}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="百分比%">
          {retainageRate}
        </DataEntry_fong>
        <DataEntry_fong className="col-span-2" caption="保留款金額">
          {toLocaleString(retainageAmount)}
        </DataEntry_fong> */}
      </div>
    </div>
  );
}

// ===============================================================================

const toLocaleString = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// ============================================================================
