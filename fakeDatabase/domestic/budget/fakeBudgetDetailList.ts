interface TbudgetDetail {
  // detailId: string
  date: string;
  describe: string;
  discount: string | number;
  doorQty: string | number;
  contractAmount: string | number;
}

const fakeBudgetDetailList: TbudgetDetail[] = [
  {
    date: '111-04-08',
    describe: '備註備註備註備註備註備註備註備註備註備註備註備註備註',
    discount: '80.00',
    doorQty: '7',
    contractAmount: '1506000',
  },
  {
    date: '111-04-07',
    describe: '備註備註備註備註備註備註備註備註備註備註備註',
    discount: '100.00',
    doorQty: '10',
    contractAmount: '1606541',
  },
  {
    date: '111-04-06',
    describe:
      '備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註',
    discount: '75.39',
    doorQty: '8',
    contractAmount: '5415',
  },
  {
    date: '111-04-05',
    describe:
      '備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註備註',
    discount: '80.00',
    doorQty: '7',
    contractAmount: '1506000',
  },
  {
    date: '111-04-04',
    describe: '備註備註備註備註備註備註備註備註備註備註備註',
    discount: '80.00',
    doorQty: '7',
    contractAmount: '1506000',
  },
];

export type { TbudgetDetail };
export { fakeBudgetDetailList };

export {};
