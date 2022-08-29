import {
  useState,
  Dispatch, SetStateAction,
} from "react";

// type
import type { Tquotation, TrangeList, Trange } from "meta/fakeData/fakeQuotation";
// TrangeList, Trange,

interface TuseRangeList {
  rangeList: TrangeList
  setRangeList: Dispatch<SetStateAction<TrangeList>>
  addRange: (range: Trange) => void
  deleteRange: (index: number) => void
}


export default function
  useRangeList(quotationData: Tquotation): TuseRangeList {
  const { rangeList: rangeListOri } = quotationData
  const [rangeList, setRangeList] = useState({ ...rangeListOri })

  // 沒有用到
  const addRange = (range: Trange) => {
    rangeList.list.push({ ...range })
    setRangeList({ ...rangeList })
  }
  const deleteRange = (index: number) => {
    rangeList.list.splice(index, 1)
    setRangeList({ ...rangeList })
  }

  return {
    rangeList, setRangeList, addRange,
    deleteRange
  }
}

export type { TuseRangeList }





