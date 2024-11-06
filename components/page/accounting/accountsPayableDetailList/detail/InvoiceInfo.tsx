import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

interface TinvoiceInfo {
  發票類別: React.ReactNode;
  invoice_date: React.ReactNode;
  invoice_number: React.ReactNode;
  申報期別: React.ReactNode;
  進貨費用: string;
  買受人統一編號: React.ReactNode;
  買受人抬頭: React.ReactNode;
  買受人發票地址: React.ReactNode;
  營業人統一編號: React.ReactNode;
  營業人抬頭: React.ReactNode;
  稅別: string;
  稅額: React.ReactNode;
  進項金額: React.ReactNode;
  合計金額: React.ReactNode;
}

const InvoiceInfo = ({
  disabled,
  //
  發票類別,
  invoice_date,
  invoice_number,
  申報期別,
  進貨費用,
  買受人統一編號,
  買受人抬頭,
  買受人發票地址,
  營業人統一編號,
  營業人抬頭,
  稅別,
  稅額,
  進項金額,
  合計金額,
}: TinvoiceInfo & { disabled?: boolean }) => {
  return (
    <>
      <span className="text-base block mb-2">{'[發票資訊]'}</span>
      <div className="global_grid01">
        <InputSel disabled={disabled} showBaseline="auto" caption="發票類別" node={發票類別} />
        <InputSel disabled={disabled} showBaseline="auto" caption="發票號碼" node={invoice_number} />
        <InputSel disabled={disabled} showBaseline="auto" caption="發票日期" node={invoice_date} />
        <InputSel disabled={disabled} showBaseline="auto" caption="申報期別" node={申報期別} />
        <hr className="col-span-4 border-dashed border-border" />
        {/*  */}
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          caption="進貨費用"
          radioProps={{
            props: {
              value: 進貨費用,
              onChange: (e) => {
                console.log(e.target.value);
              },
            },
            radioPropsArr: [
              {
                value: '可折抵',
                children: '可折抵',
              },
              {
                value: '不可折抵',
                children: '不可折抵',
              },
            ],
          }}
        />
        <hr className="col-span-4 border-dashed border-border" />
        {/*  */}
        <InputSel disabled={disabled} showBaseline="auto" caption="買受人統一編號" node={買受人統一編號} />
        <InputSel disabled={disabled} showBaseline="auto" caption="買受人抬頭" node={買受人抬頭} />
        <InputSel disabled={disabled} showBaseline="auto" caption="買受人發票地址" node={買受人發票地址} />
        <hr className="col-span-4 border-dashed border-border" />
        {/*  */}
        <InputSel disabled={disabled} showBaseline="auto" caption="營業人統一編號" node={營業人統一編號} />
        <InputSel disabled={disabled} showBaseline="auto" caption="營業人抬頭" node={營業人抬頭} />
        <div />
        <div />
        {/*  */}

        <InputSel
          disabled={disabled}
          showBaseline="auto"
          caption="稅別"
          radioProps={{
            props: {
              value: 稅別,
              onChange: (e) => {
                console.log(e.target.value);
              },
            },
            radioPropsArr: [
              {
                value: '應稅',
                children: '應稅',
              },
              {
                value: '零稅',
                children: '零稅',
              },
              {
                value: '免稅',
                children: '免稅',
              },
            ],
          }}
        />
        <InputSel disabled={disabled} showBaseline="auto" caption="稅額" node={稅額} />
        <InputSel disabled={disabled} showBaseline="auto" caption="進項金額" node={進項金額} />
        <InputSel disabled={disabled} showBaseline="auto" caption="合計金額" node={合計金額} />
      </div>
    </>
  );
};

export default InvoiceInfo;
