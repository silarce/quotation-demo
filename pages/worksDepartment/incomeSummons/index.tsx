import classNames from 'classnames';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
// import Table01, { Ttable, Tcell, Tconfig_table } from 'components/global/gear/table/table01';

// css
import scss from './index.module.scss';

// ==============================================================================

type Tquery = {
  tab: 'domestic' | 'export';
  year: string;
  month: string;
};

// ==============================================================================

// MARK:START

export default function IncomeSummons() {
  const router = useRouter();
  const query = router.query as Tquery;

  // -----------------------------------------------------------------------------

  // MARK: PROPS

  // -----------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tagList={createTagList()} />
      <div className={scss.main}>
        <div className={scss.tableWrapper}>
          <div className={scss.table}>
            <Row className={scss.thead}>
              {keyArr.map((key) => {
                const { label, style } = config[key];

                return (
                  <div key={key} style={style}>
                    {label}
                  </div>
                );
              })}
            </Row>

            {createFakeData().map((fd, index) => {
              const { id } = fd;

              return (
                <Row key={id} className={scss.tbody}>
                  {keyArr.map((key) => {
                    const { label, style } = config[key];
                    const data = fd[key];

                    return (
                      <div key={key} style={style}>
                        {data}
                      </div>
                    );
                  })}
                </Row>
              );
            })}
          </div>
        </div>
        {/*  */}
      </div>
    </SubLayer>
  );
}

// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// MARK: COMPONENT
const Row = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

// ==============================================================================

// MARK: PROPS

const createTagList = (): TtagList => {
  return [
    {
      label: '收入傳票(內銷)',
      onClick: () => {},
      isActive: undefined,
    },
    {
      label: '收入傳票(外銷)',
      onClick: () => {},
      isActive: undefined,
    },
  ];
};

// ==============================================================================

type TconfigKey =
  | 'indexNumber'
  | 'invoiceType'
  | 'insertDate'
  | 'contractNumber'
  | 'projectName'
  | 'contractPrice'
  | 'periodValuation'
  | 'receivedInThePreviousPeriod'
  | 'account_from'
  | 'noteNumber'
  | 'noteMaturityDate'
  | 'paymentAmount'
  | 'deductionAmount'
  | 'balance';

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
};

type Tconfig = {
  [key in TconfigKey]: TconfigItem;
};

const keyArr: TconfigKey[] = [
  'indexNumber',
  'invoiceType',
  'insertDate',
  'contractNumber',
  'projectName',
  'contractPrice',
  'periodValuation',
  'receivedInThePreviousPeriod',
  'account_from',
  'noteNumber',
  'noteMaturityDate',
  'paymentAmount',
  'deductionAmount',
  'balance',
];

const config: Tconfig = {
  indexNumber: {
    label: '收入傳票序號',
    style: { width: 120 },
  },
  invoiceType: {
    label: '發票類別',
    style: { width: 80 },
  },
  insertDate: {
    label: '日期',
    style: { width: 80 },
  },
  contractNumber: {
    label: '合約編號',
    style: { width: 100 },
  },
  projectName: {
    label: '工程名稱',
    style: {
      flex: '1',
    },
  },
  contractPrice: {
    label: '承攬價',
    style: { width: 100 },
  },
  periodValuation: {
    label: '本期計價',
    style: { width: 100 },
  },
  receivedInThePreviousPeriod: {
    label: '前期已收',
    style: { width: 100 },
  },
  account_from: {
    label: '票據/匯入帳號',
    style: { width: 120 },
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 100 },
  },
  noteMaturityDate: {
    label: '票據日期', // (到期日)
    style: { width: 80 },
  },
  paymentAmount: {
    label: '收款金額',
    style: { width: 100 },
  },
  deductionAmount: {
    label: '扣款金額',
    style: { width: 100 },
  },
  balance: {
    label: '餘額',
    style: { width: 100 },
  },
} as const;

// ==============================================================================

// ==============================================================================

const fakeData: ({
  [key in TconfigKey]: string;
} & { id: string })[] = [
  {
    id: 'aaa',
    indexNumber: 'aaa',
    invoiceType: 'aaa',
    insertDate: 'aaa',
    contractNumber: 'aaa',
    projectName: 'aaa',
    contractPrice: 'aaa',
    periodValuation: 'aaa',
    receivedInThePreviousPeriod: 'aaa',
    account_from: 'aaa',
    noteNumber: 'aaa',
    noteMaturityDate: 'aaa',
    paymentAmount: 'aaa',
    deductionAmount: 'aaa',
    balance: 'aaa',
  },
  {
    id: 'bbb',
    indexNumber: 'bbb',
    invoiceType: 'bbb',
    insertDate: 'bbb',
    contractNumber: 'bbb',
    projectName: 'bbb',
    contractPrice: 'bbb',
    periodValuation: 'bbb',
    receivedInThePreviousPeriod: 'bbb',
    account_from: 'bbb',
    noteNumber: 'bbb',
    noteMaturityDate: 'bbb',
    paymentAmount: 'bbb',
    deductionAmount: 'bbb',
    balance: 'bbb',
  },
];

const createFakeData = () => {
  const arr = Array.from({ length: 100 }, (_, index) => {
    const id = index.toString();

    return {
      id,
      indexNumber: id,
      invoiceType: id,
      insertDate: id,
      contractNumber: id,
      projectName: id,

      contractPrice: id,
      periodValuation: id,
      receivedInThePreviousPeriod: id,
      account_from: id,
      noteNumber: id,
      noteMaturityDate: id,
      paymentAmount: id,
      deductionAmount: id,
      balance: id,
    };
  });

  return arr;
};
