import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

const InvoiceInfo = () => {
  return (
    <>
      <span className="text-base block mb-2">{'[發票資訊]'}</span>
      <div className="global_grid01">
        <InputSel showBaseline="always" caption="發票類別" />
        <InputSel showBaseline="always" caption="發票號碼" />
        <InputSel showBaseline="always" caption="發票日期" />
        <InputSel showBaseline="always" caption="申報期別" />
        <hr className="col-span-4 border-dashed border-border" />
        {/*  */}
        <InputSel
          showBaseline="always"
          caption="進貨費用"
          radioProps={{
            props: {
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
        <InputSel showBaseline="always" caption="買受人統一編號" />
        <InputSel showBaseline="always" caption="買受人抬頭" />
        <InputSel showBaseline="always" caption="買受人發票地址" />
        <hr className="col-span-4 border-dashed border-border" />
        {/*  */}
        <InputSel showBaseline="always" caption="營業人統一編號" />
        <InputSel showBaseline="always" caption="營業人抬頭" />
        <div />
        <div />
        {/*  */}

        <InputSel
          showBaseline="always"
          caption="稅別"
          radioProps={{
            props: {
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
        <InputSel showBaseline="always" caption="稅額" />
        <InputSel showBaseline="always" caption="進項金額" />
        <InputSel showBaseline="always" caption="合計金額" />
      </div>
    </>
  );
};

export default InvoiceInfo;
