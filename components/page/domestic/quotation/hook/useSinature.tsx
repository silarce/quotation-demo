import { ChangeEvent, useState } from 'react';

// type
import { Tquotation, Tsinature } from 'fakeDatabase/domestic/quotation/fakeQuotationList';

export default function useSinature(quotationData?: Tquotation) {
  let sinatureOri;

  if (quotationData) {
    sinatureOri = quotationData.sinature;
  } else {
    sinatureOri = fakeEmptySinature;
  }

  type Tsinature = typeof sinatureOri;
  const [sinature, setSinature] = useState(sinatureOri);

  const onChangeCreator = (key: keyof Tsinature) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSinature((sinature) => {
        sinature[key].value = value;

        return { ...sinature };
      });
    };
  };

  const onChangeManager = onChangeCreator('manager');
  const onChangeDirector = onChangeCreator('director');
  const onChangeAttn = onChangeCreator('attn');

  return {
    sinature,
    setSinature,
    onChangeManager,
    onChangeDirector,
    onChangeAttn,
  };
}

type TuseSinature = ReturnType<typeof useSinature>;

export type { TuseSinature };

// =====================================================
const fakeEmptySinature: Tsinature = {
  manager: { value: '', label: '經理' }, // 經理
  director: { value: '', label: '主管' }, // 主管
  attn: { value: '', label: '經辦' }, // 經辦
};
