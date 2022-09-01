import {
  useState,
  ChangeEvent
} from "react";

// global gear
import { ModalInfo02 } from "components/global/gear/modal/simpleModal/alertModals"


// type
import type { Tquotation, TrangeList, Trange } from "meta/fakeData/fakeQuotation";
// data
import { fakeEmptyRange } from "meta/fakeData/fakeQuotation";



export default function
  useRangeList(quotationData?: Tquotation) {
  let rangeListOri;
  if (quotationData) rangeListOri = quotationData.rangeList
  else rangeListOri = fakeEmptyRange

  const [rangeList, setRangeList] = useState({ ...rangeListOri })

  const onChangeRangeCreator = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setRangeList(memoList => {
        memoList.list[index].content = value
        return { ...memoList }
      })
    }
  }

  const addRanges = ((selRange: Trange[]) => {
    if (!selRange[0]) return ModalInfo02({ title: "請選擇報價範圍" })
    rangeList.list = rangeList.list.concat([...structuredClone(selRange)])
    setRangeList({ ...rangeList })
  });


  const deleteRange = (index: number) => {
    rangeList.list.splice(index, 1)
    setRangeList({ ...rangeList })
  }

  return {
    rangeList, setRangeList,
    addRanges, onChangeRangeCreator, deleteRange,
  }
}

type TuseRangeList = ReturnType<typeof useRangeList>

export type { TuseRangeList }





