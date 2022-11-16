import {
  useState,
  ChangeEvent
} from "react";

// global gear
import { ModalInfo02 } from "components/global/gear/modal/simpleModal/alertModals"

// type
import { Tquotation, Trange } from "fakeDatabase/domestic/quotation/fakeQuotationList"

const _ = require("lodash")

export default function
  useRangeList(quotationData?: Tquotation) {
  let rangeListOri;
  if (quotationData) rangeListOri = quotationData.rangeList
  else rangeListOri = fakeEmptyRange

  const [rangeList, setRangeList] = useState<Trange[]>(_.cloneDeep(rangeListOri))

  const onChangeRangeCreator = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setRangeList(rangeList => {
        rangeList[index].content = value
        return [...rangeList]
      })
    }
  }

  const addRanges = ((selRange: Trange[]) => {
    if (!selRange[0]) return ModalInfo02({ title: "請選擇報價範圍" })
    const newRangeList = rangeList.concat([..._.cloneDeep(selRange)])
    setRangeList([...newRangeList])
  });


  const deleteRange = (index: number) => {
    rangeList.splice(index, 1)
    setRangeList([...rangeList])
  }

  return {
    rangeList, setRangeList,
    addRanges, onChangeRangeCreator, deleteRange,
  }
}

type TuseRangeList = ReturnType<typeof useRangeList>

export type { TuseRangeList }

// ===============================================
const fakeEmptyRange: Trange[] = []



