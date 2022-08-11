
import {
  useState, useEffect,
  ChangeEvent, Dispatch, SetStateAction
} from "react"


interface Tdata {
  label: string
  id?: string | number
  editLabel?: (e: ChangeEvent<HTMLInputElement>) => void
  list: { label: string | null, editLabel?: (e: ChangeEvent<HTMLInputElement>) => void }[]
}

export default function useData() {

  const [data, setData] = useState<Tdata[]>([])

  const resetData = () => {
    setData([])
    metaList.forEach((item, index) => {
      const { id, label, list } = item
      new Department({ id, label, index, list, setData })
    })
  }

  useEffect(() => {
    resetData()
  }, [])

  // return data
  return [data, resetData]

}

class Manager {
  index
  parentIndex
  label
  setData
  constructor(
    { parentIndex, index, label, setData }: {
      parentIndex: number, index: number, label: string | null,
      setData: Dispatch<SetStateAction<Tdata[]>>
    }
  ) {
    this.parentIndex = parentIndex
    this.index = index
    this.label = label
    this.setData = setData
  }
  editLabel = (e: ChangeEvent<HTMLInputElement>) => {
    this.label = e.target.value
    this.setData((state: Tdata[]) => {
      state[this.parentIndex].list[this.index] = this
      return [...state]
    })
  }
}





class Department {
  index
  id
  label
  list
  setData
  constructor(
    { index, id, label, list, setData }: {
      index: number, id: string, label: string, list: type_Unit
      // setData: any
      setData: Dispatch<SetStateAction<Tdata[]>>
    }
  ) {
    this.index = index
    this.id = id
    this.label = label
    this.setData = setData
    this.list = list.map((item, childIndex) => {
      const { label } = item
      const parentIndex = this.index
      return new Manager({ label, parentIndex, index: childIndex, setData })
    })

    setData((state: Tdata[]) => {
      state[index] = this
      return [...state]
    })
  }
  editLabel = (e: ChangeEvent<HTMLInputElement>) => {
    this.label = e.target.value
    this.setData((state: Tdata[]) => {
      state[this.index] = this
      return [...state]
    })
  }
}












interface type_metaList {
  id: string
  label: string

}[]


// type type_Unit = typeof metaList[0]["list"]
type type_Unit = typeof metaList[0]["list"]




const metaList = [
  {
    id: "A", label: "管理部",
    list: [
      { label: "總經理" },
      { label: "副總經理" },
      { label: "協理" },
      { label: "資深經理" },
      { label: "經理經理" },
      { label: "副理" },
      { label: "課長" },
      { label: "副課長" },
      { label: null },
      { label: null },
    ]
  },
  {
    id: "B", label: "營業部",
    list: [
      { label: null },
      { label: "業務副總" },
      { label: "業務協理" },
      { label: "資深業務經理" },
      { label: "業務經理" },
      { label: "業務副理" },
      { label: "業務專員" },
      { label: "高級專員" },
      { label: "專員" },
      { label: "助理" },
    ]
  },
  {
    id: "C", label: "研發部",
    list: [
      { label: null },
      { label: "總工程師" },
      { label: "技術協理" },
      { label: "資深技術經理" },
      { label: "技術經理" },
      { label: "技術副理" },
      { label: "資深工程師" },
      { label: "高級工程師" },
      { label: "工程師" },
      { label: "助理工程師" },
    ]
  },
  {
    id: "D", label: "工程部",
    list: [
      { label: null },
      { label: null },
      { label: "專業協理" },
      { label: "資深專業經理" },
      { label: "專業經理" },
      { label: "專業副理" },
      { label: "資深專員" },
      { label: "高級專員" },
      { label: "專員" },
      { label: "助理" },
    ]
  },
  {
    id: "E", label: "廠務部",
    list: [
      { label: null },
      { label: null },
      { label: "專業協理" },
      { label: "資深專業經理" },
      { label: "專業經理" },
      { label: "專業副理" },
      { label: "資深專員" },
      { label: "高級專員" },
      { label: "專員" },
      { label: "助理" },
    ]
  },
  {
    id: "F", label: "會計部",
    list: [
      { label: null },
      { label: null },
      { label: "專業協理" },
      { label: "資深專業經理" },
      { label: "專業經理" },
      { label: "專業副理" },
      { label: "資深專員" },
      { label: "高級專員" },
      { label: "專員" },
      { label: "助理" },
    ]
  },
]