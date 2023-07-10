import _ from 'lodash';

interface TcontractMemo {
  memoId: string;
  memoDate: string;
  memoContent: string;
  belongQuotation: string;
}

interface TcontractMemoObjList {
  [key: string]: TcontractMemo;
}

type TcontractMemoList = TcontractMemo[];

const fakeContractMemoObjList: TcontractMemoObjList = {
  'N-1110101-01': {
    memoId: 'N-1110101-01',
    memoDate: '',
    memoContent: '',
    belongQuotation: '',
  },
};

let i = 2;

for (i; i <= 30; i++) {
  const key = `N-1110101-${`${i}`.padStart(2, '0')}`;
  const memoDate = `111-${`${_.random(1, 12)}`.padStart(2, '0')}-${`${_.random(1, 30)}`.padStart(2, '0')}`;
  const belongQuotation = `S-110211-${`${_.random(1, 12)}`.padStart(2, '0')}`;
  fakeContractMemoObjList[key] = {
    memoId: key,
    memoDate,
    memoContent: randomContent(),
    belongQuotation: belongQuotation,
  };
}

const fakeContractMemoList = Object.values(fakeContractMemoObjList);

export type { TcontractMemo, TcontractMemoObjList, TcontractMemoList };
export { fakeContractMemoObjList, fakeContractMemoList };

// =================================================
function randomContent() {
  const contents = {
    '0': '備註零備註零備註零備註零備註零備註零備註零備註零',
    '1': '備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一備註一',
    '2': '備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二備註二',
    '3': '備註三備註三備註三備註三備註三備註三',
    '4': '備註四',
    '5': '備註五備註五備註五備註五備註五備註五備註五備註五',
  };
  const randomKey = _.random(0, 5).toString() as keyof typeof contents;

  return contents[randomKey];
}
