type TfakeMemoData = {
  id: number;
  statu?: 'deleted';
  prodClass: string[];
  doorType: string[];
  doorForm: string[];
  content: string;
};

const fakeMemoDataArr: TfakeMemoData[] = [
  {
    id: 1,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['一般'],
    content: '檔輪(門寬>3-5米)、鋁合金障感器及遙控器(1:2)，捲箱2面SST304#0.8T。',
  },
  {
    id: 2,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['防颱'],
    content: '防颱型捲門含檔輪(門寬>3-5米)、鋁合金障感器及遙控器(1:2)，捲箱2面SST304#0.8T。',
  },
  {
    id: 3,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['一般', '防颱'],
    content: '自動防火捲門消防連動操作裝置及強壓開關，屬機電消防廠商，非捲門工程。',
  },
  {
    id: 4,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['一般', '防颱'],
    content:
      '抗風壓結構計算技師簽證費用、實驗室門樘試燒、剖門檢驗、水閘門試水認證、材料檢驗費用、防颱底座鎖固、防颱中柱、高空作業、自動防火連動操作裝置、前遮板、砂利康、懸吊系統、門框補強立柱、收邊料，單價另計。',
  },
  {
    id: 5,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['一般', '防颱'],
    content: '施工架、自走車由工地提供。',
  },
  {
    id: 6,
    prodClass: ['防火防煙捲門系列'],
    doorType: ['SJ-302'],
    doorForm: ['一般', '防颱'],
    content: '保固壹年。',
  },
];

const checkData = () => {
  fakeMemoDataArr.forEach((item, index) => {
    if (item.id !== index + 1) {
      throw new Error(`fakeMemoData資料的id要等於index-1。${`id:${item.id}`} ${`index:${index}`}   `);
    }
  });
};

checkData();

export { fakeMemoDataArr };
export type { TfakeMemoData };
