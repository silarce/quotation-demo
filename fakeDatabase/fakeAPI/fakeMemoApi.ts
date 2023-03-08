
import {
  TfakeMemoData,
  fakeMemoDataArr
} from "fakeDatabase/fakeMemo";




export class FakeApi_memo {
  private _memoArr = fakeMemoDataArr

  private _fitler = (
    tagArr: string[],
    keywordArr: string[] | undefined
  ) => {
    if (!keywordArr || !keywordArr[0]) return true
    let isPassed = false
    tagArr.forEach((tag) => {
      const result = keywordArr?.some((keyword) => {
        return tag === keyword
      })
      if (result) isPassed = true
    })
    return isPassed
  }

  get = (
    filter?: {
      prodClass?: string[]
      doorType?: string[]
      doorForm?: string[]
      content?: string
    }
  ) => {
    this._memoArr;
    const memoArr: TfakeMemoData[] = []
    this._memoArr.forEach((item, index) => {
      if (item.statu === "deleted") return
      const { prodClass, doorType, doorForm, content } = item

      let isPassed = true
      isPassed = this._fitler(prodClass, filter?.prodClass)
      if (!isPassed) return
      isPassed = this._fitler(doorType, filter?.doorType)
      if (!isPassed) return
      isPassed = this._fitler(doorForm, filter?.doorForm)
      if (!isPassed) return
      if (filter?.content) {
        const regex = new RegExp(filter.content)
        if (!regex.test(content)) return
      }
      memoArr.push(item)
    })
    return memoArr
  };
  post = (body: Omit<TfakeMemoData, 'id'>) => {
    const newId = this._memoArr.length + 1
    const newMemo = {
      id: newId,
      ...body
    }
    this._memoArr.push(newMemo)
  };
  put = (id: number, body: Omit<TfakeMemoData, 'id'>) => {
    let target = this._memoArr.find((item) => item.id === id)
    if (target) Object.assign(target, body)
    else alert(`找不到這個id，id:${id}`)
  };
  delete = (id: number) => {
    let target = this._memoArr.find((item) => item.id === id)
    if (target) target.statu = "deleted"
    else alert(`找不到這個id，id:${id}`)
  }
}
