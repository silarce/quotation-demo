import { Dispatch, SetStateAction } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import style from './powerTransmissionSpareList.module.scss';

// fake
import { Tsignature } from 'pages/worksDepartment/contractList/contract/powerTransmissionSpareList/edit';

export default function Signature({
  signature,
  setSignature,
  editable,
}: {
  signature: Partial<Tsignature>;
  setSignature: Dispatch<SetStateAction<Partial<Tsignature>>>;
  editable: boolean;
}) {
  return (
    <div className={style.signature}>
      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key];
        const stateValue = signature[key];

        const onChange = (v: string) => {
          signature[key] = v;
          setSignature({ ...signature });
        };

        return (
          <div className={style.cell} key={index}>
            <span>{label}</span>
            <InputSel
              className={style.input02}
              inputProps={{
                value: stateValue ?? '',
                onChange,
              }}
              placeholder={placeholder}
              disabled={!editable}
              showBaseline="auto"
            />
          </div>
        );
      })}
    </div>
  );
}

// ========================================================

type TindexKeys = keyof Tsignature;
const indexKeys: TindexKeys[] = ['領料人員', '配料人員', '填表人員'];

const config: {
  [key in TindexKeys]: {
    label: string;
    placeholder: string;
  };
} = {
  領料人員: {
    label: '領料人員',
    placeholder: '請輸入領料人員',
  },
  配料人員: {
    label: '配料人員',
    placeholder: '請輸入配料人員',
  },
  填表人員: {
    label: '填表人員',
    placeholder: '請輸入填表人員',
  },
};
