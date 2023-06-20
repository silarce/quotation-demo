

import {
  Toption,
  addEmpty
} from "./options"

export type { Toption }


// 類別
export const optionsCreator_category =
  (props: { haveEmpty?: boolean } = {}
  ): Toption[] => {
    const { haveEmpty } = props
    const arr = [
      { value: "防火防煙捲門系列", label: "防火防煙捲門系列" },
      { value: "防水防洪門系列", label: "防水防洪門系列" },
      { value: "抗風防颱捲門系列", label: "抗風防颱捲門系列" },
      { value: "上折門", label: "上折門" },
      { value: "廠辦管制門", label: "廠辦管制門" },
      { value: "圍牆大門", label: "圍牆大門" },
      { value: "機械門", label: "機械門" },
      { value: "客製化", label: "客製化" },
    ]
    if (haveEmpty) addEmpty(arr)
    return arr
  }

// 門型
export const optionsCreator_doorModel =
  (props: { haveEmpty?: boolean } = {}
  ): Toption[] => {
    const { haveEmpty } = props
    const arr = [
      { value: "SJ-302" as const, label: "SJ-302" },
      // { value: "SJ-302A", label: "SJ-302A" },
      // { value: "SJ-302AS", label: "SJ-302AS" },
      // { value: "SJ-305D", label: "SJ-305D" },
      { value: "SJ-312", label: "SJ-312" },
      // { value: "SJ-120A", label: "SJ-120A" },
      // { value: "SJ-303S", label: "SJ-303S" },
    ]
    if (haveEmpty) addEmpty(arr)
    return arr
  }


// 門的形式
export const optionsCreator_doorForm =
  (props: { haveEmpty?: boolean } = {}
  ): Toption[] => {
    const { haveEmpty } = props
    const arr = [
      { value: "normal" as const, label: "一般" },
      { value: "anti-typhoon" as const, label: "防颱" },
    ]
    if (haveEmpty) addEmpty(arr)
    return arr
  }
