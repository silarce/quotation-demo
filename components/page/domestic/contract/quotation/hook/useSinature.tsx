import { ChangeEvent, useState } from "react";

// type
import type { Tquotation } from "meta/fakeData/fakeQuotation";



export default function useSinature(quotationData: Tquotation) {
  const { sinature: sinatureOri } = quotationData
  type Tsinature = typeof sinatureOri

  const [sinature, setSinature] = useState(sinatureOri)

  const onChangeCreator = (key: keyof Tsinature) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSinature(sinature => {
        sinature[key].value = value
        return { ...sinature }
      })
    }
  }

  const onChangeManager = onChangeCreator("manager")
  const onChangeDirector = onChangeCreator("director")
  const onChangeAttn = onChangeCreator("attn")

  return {
    sinature, setSinature,
    onChangeManager, onChangeDirector, onChangeAttn,
  }
}

type TuseSinature = ReturnType<typeof useSinature>

export type { TuseSinature }







