import {
  useState,
  Dispatch, SetStateAction,
} from "react";

// type
import type { Tquotation, TmemoList, Tmemo } from "meta/fakeData/fakeQuotation";


interface TuseMemoList {
  memoList: TmemoList
  setMemoList: Dispatch<SetStateAction<TmemoList>>
  addMemo: (memo: Tmemo) => void
  deleteMemo: (index: number) => void
}


export default function
  useMemoList(quotationData: Tquotation): TuseMemoList {
  const { memoList: memoListOri } = quotationData
  const [memoList, setMemoList] = useState({ ...memoListOri })

  // 沒有用到
  const addMemo = (memo: Tmemo) => {
    memoList.list.push({ ...memo })
    setMemoList({ ...memoList })
  }
  const deleteMemo = (index: number) => {
    memoList.list.splice(index, 1)
    setMemoList({ ...memoList })
  }

  return {
    memoList, setMemoList, addMemo,
    deleteMemo
  }
}


export type { TuseMemoList }





