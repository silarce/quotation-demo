interface TproductString {
  discount: string; // 折數
  project: string; // 項目
  L: string; // L
  W: string; // W
  h: string; // h  // 單位應該是m
  qty: string; // 數量
  memo: string; //備註
  // cai: string  // 才數 // 只有台灣在用的單位，沒有英文譯名
  // area: string  // 面積
  // unitPrice: string  // 單價
  // subTotal: string  // 複價
  unitWeight: number;
}

interface TproductObject {
  doorType: string; // 門型
  horsepower: string; // 馬力
  quoteType: string;
  material: string;
  surface: string;
  doorRail: string;
  B: string; // B
}

interface TproductBoolean {
  ejectionDoor: boolean; // 是否可選彈射門
  typhoonProof: boolean;
}

type Tproduct = TproductString & TproductBoolean & TproductObject;

const fakeQuotProductListOri = (): Tproduct[] => [
  {
    discount: '100.00',
    project: 'SD1',
    quoteType: '不是捲門',
    L: '3',
    W: '0',
    h: '2',
    B: '',
    // area: "14.19",
    // cai: "1540.5", //才數
    doorType: 'SJ-302', //門型
    material: 'SST304#',
    surface: '2B',
    doorRail: '60',
    horsepower: '',
    qty: '1',
    // unitPrice: "158610",
    // subTotal: "158610",
    memo: '防颱',
    ejectionDoor: false,
    typhoonProof: false,
    unitWeight: 22,
  },
  {
    discount: '86.43',
    project: 'SD2',
    quoteType: '捲門',
    L: '5',
    W: '0',
    h: '3',
    B: '',
    // area: "22.66",
    // cai: "200.87",
    doorType: 'SJ-302', //門型
    material: 'SST304#',
    surface: '2B',
    doorRail: '75',
    horsepower: '',
    qty: '1',
    // unitPrice: "158610",
    // subTotal: "158610",
    memo: '一般',
    ejectionDoor: true,
    typhoonProof: true,
    unitWeight: 22,
  },
];

export type { Tproduct, TproductString, TproductBoolean, TproductObject };
export { fakeQuotProductListOri };
