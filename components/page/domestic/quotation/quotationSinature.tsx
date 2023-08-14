// global gear
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';
// css
import style from './quotationSinature.module.scss';

export type { TinputProps };

export default function QuotationSinature({
  signatureArr,
  disabled = false,
}: {
  signatureArr: { label: string; inputProps: TinputProps }[];
  disabled: boolean;
}) {
  return (
    <div className={style.container}>
      {signatureArr.map((item, index) => {
        const { label, inputProps } = item;

        return (
          <div key={index}>
            <span>{label}</span>
            <InputSel inputProps={inputProps} disabled={disabled} showBaseline={'always'} />
          </div>
        );
      })}
    </div>
  );
}
