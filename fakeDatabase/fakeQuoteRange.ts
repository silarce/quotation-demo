type TfakeQuoteRangeData = {
  id: number;
  statu?: 'deleted';
  prodClass: string[];
  doorType: string[];
  content: string;
};

const fakeQuoteRangeDataArr: TfakeQuoteRangeData[] = [
  {
    id: 1,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '以上報價產品使用本公司規格及配件。',
  },
  {
    id: 2,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '電源及開開配管配線不在估價之內。',
  },
  {
    id: 3,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '水泥補修及與以上報價產品無開之工作或鐵件皆不在承作範倒之內。',
  },
  {
    id: 4,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '施工期間之電力由買方(或業主)供應。',
  },
  {
    id: 5,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '負責本產品按装及電力公司正式接電後之接線及調幣。',
  },
  {
    id: 6,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '若有天花板装修者不加門箱及機械箱。',
  },
  {
    id: 7,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '除特殊說明外,不銹鋼材質為SUS304＃。',
  },
  {
    id: 8,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '款項收訖90%後出具防火證明及出廠證明書，尾款收訖提供保固書。',
  },
  {
    id: 9,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    content: '價格隨材料行情可能有變動。超過有效日期限請來電查詢。',
  },
];

const checkData = () => {
  fakeQuoteRangeDataArr.forEach((item, index) => {
    if (item.id !== index + 1) {
      throw new Error(`資料的id要等於index-1。${`id:${item.id}`} ${`index:${index}`}   `);
    }
  });
};

checkData();

export { fakeQuoteRangeDataArr };
export type { TfakeQuoteRangeData };
