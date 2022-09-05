import {
  useState,
  ChangeEvent
} from "react";

// global gear
import { ModalInfo02 } from "components/global/gear/modal/simpleModal/alertModals"

// type
import type { Tquotation, TmemoList, Tmemo } from "meta/fakeData/fakeQuotation/fakeQuotation";
// data
import { fakeEmptyMemo } from "meta/fakeData/fakeQuotation/fakeQuotation";


export default function
  useMemoList(quotationData?: Tquotation) {
  let memoListOri;
  if (quotationData) memoListOri = quotationData.memoList
  else memoListOri = fakeEmptyMemo;

  const [memoList, setMemoList] = useState({ ...memoListOri })

  const onChangeMemoCreator = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setMemoList(memoList => {
        memoList.list[index].content = value
        return { ...memoList }
      })
    }
  }
  
  const addMemos = ((selMemo: Tmemo[]) => {
    if (!selMemo[0]) return ModalInfo02({ title: "請選擇備註" })
    memoList.list = memoList.list.concat([...structuredClone(selMemo)])
    setMemoList({ ...memoList })
  });

  const deleteMemo = (index: number) => {
    memoList.list.splice(index, 1)
    setMemoList({ ...memoList })
  }

  return {
    memoList, setMemoList,
    addMemos, onChangeMemoCreator, deleteMemo,
  }
}

type TuseMemoList = ReturnType<typeof useMemoList>


export type { TuseMemoList }





