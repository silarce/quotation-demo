

interface Taccessory {
  id: string
  name: string
  unit: string
  qty: string
  listPrice: string //牌價
  totalListPrice: string //牌價複價
  price: string //單價
  totalPrice: string //複價
}

interface TaccessoryObjList {
  [key: string]: Taccessory
}

type TaccessoryList = Taccessory[]


const fakeAccessoryObjListOri = (): TaccessoryObjList => ({
  "SJ0A09": {
    id: "SJ0A09",
    name: "鋁合金障礙感知器",
    unit: "M",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
  "SJ0A77": {
    id: "SJ0A77",
    name: "紅外線",
    unit: "組",
    qty: "1",
    listPrice: "15000",
    totalListPrice: "15000",
    price: "15000",
    totalPrice: "15000",
  },
  "SJ0A07": {
    id: "SJ0A07",
    name: "遙控器",
    unit: "組",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
  "SJ0A01": {
    id: "SJ0A01",
    name: "防颱底座鎖固",
    unit: "組",
    qty: "1",
    listPrice: "5000",
    totalListPrice: "5000",
    price: "5000",
    totalPrice: "5000",
  },
})


const fakeAccessoryListOri = 
(): Taccessory[] => Object.values(fakeAccessoryObjListOri())



export type {
  Taccessory,
  TaccessoryObjList,
  TaccessoryList,
}

export {  fakeAccessoryObjListOri, fakeAccessoryListOri }