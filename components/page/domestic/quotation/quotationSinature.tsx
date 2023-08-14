// global gear
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';
// css
import style from './quotationSinature.module.scss';

type TsignatureProps = {
  label: string;
  inputProps: TinputProps;
};

export type { TinputProps, TsignatureProps };

export default function QuotationSinature({
  signatureArr,
  disabled = false,
}: {
  signatureArr: TsignatureProps[];
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
