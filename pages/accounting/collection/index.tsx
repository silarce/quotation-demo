import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
// import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01 from 'components/global/gear/table/table01';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';

// =============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// type paymentType = '匯款' | '票據' | '現金';
type TpaymentType = TaccountantDto['paymentType'];

type Tquery = {
  paymentType: TpaymentType | undefined;
  year: string | undefined;
  month: string | undefined;
};

type Tstate_accountant = {
  insertDate: Moment;
  importAccountingNumber: string;
  noteNumber: string;
  accountingNumber: string;
  vendorName: string;
  price: string;
  billSerialNumber: string;
  notes: string;
};

// =============================================================================

const defaultPaymentType: TpaymentType = '匯款';

// =============================================================================

// region START
export default function Collection() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  // ------------------------------------------------------------------------------

  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType, year = String(thisYear), month = String(thisMonth) } = query;
  const year_tw = Number(year) - 1911;

  // ------------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  // ----------------------------------------------------------------------------
  // region USE HOOK
  const tagList = useTagList();

  const selectPropsArr = useSelectPropsArr({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  // ----------------------------------------------------------------------------

  // region PROPS

  const panelList = create_panelList({
    disabled,
    setDisabled,
  });

  // ----------------------------------------------------------------------------
  // region RENDER
  return (
    <SubLayer>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />
      <div className={scss.body}>
        {/*  */}
        <div className={scss.cover} />
        <div className={scss.tabBar}>
          <div className={scss.tab}>{paymentType}</div>
        </div>

        <div>
          <Thead paymentType={paymentType} />
        </div>

        {/*  */}
      </div>
    </SubLayer>
  );
}
// region END

// =============================================================================
// =============================================================================
// =============================================================================

// region HOOK

const useTagList = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType } = query;

  const switchCategory = (category: TpaymentType) => {
    router.replace({
      query: {
        ...query,
        paymentType: category,
      },
    });
  };

  const tagList: TtagList = [
    {
      label: '匯款',
      isActive: paymentType === '匯款',
      onClick: () => switchCategory('匯款'),
    },
    {
      label: '票據',
      isActive: paymentType === '票據',
      onClick: () => switchCategory('票據'),
    },
    {
      label: '現金',
      isActive: paymentType === '現金',
      onClick: () => switchCategory('現金'),
    },
  ];

  return tagList;
};

// -------------------------------------------------------------------------------
const useYearMonth = () => {
  const m_today = moment();
  const thisYear = m_today.year();
  const thisMonth = m_today.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    return yearOptionArr;
  }, [thisYear]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    return monthOptionArr;
  }, []);

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisMonth,
  };
};

const useSelectPropsArr = ({
  year,
  month,
  yearOptionArr,
  monthOptionArr,
}: {
  year: string;
  month: string;
  yearOptionArr: Toption[];
  monthOptionArr: Toption[];
}) => {
  const router = useRouter();
  const query = router.query as Tquery;

  const selectPropsArr: TselectPropsArr = useMemo(() => {
    return [
      {
        selectProps: {
          value: year,
          options: yearOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  year: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇年份',
        boxStyle: { width: '140px' },
      },
      {
        selectProps: {
          value: month,
          options: monthOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  month: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇月份',
        boxStyle: { width: '140px' },
      },
    ];
  }, [year, yearOptionArr, month, monthOptionArr, router, query]);

  return selectPropsArr;
};

// ---------------------------------------------------------------------------

// region function

const create_panelList = ({
  //
  disabled,
  setDisabled,
}: {
  disabled: boolean;
  setDisabled: (value: boolean) => void;
}) => {
  const panelList_disable: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => setDisabled(false),
    },
  ];

  const panelList_able: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = disabled ? panelList_disable : panelList_able;

  return panelList;
};

// =========================================================================
// region component

const Cell = ({
  //
  value,
  onChange,
  style,
  className,
}: {
  value: string;
  onChange: (str: string) => void;
  style: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.cell, className)} style={style}>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

const Cell_span = ({
  //
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.cell, className)} style={style}>
      {children}
    </div>
  );
};

const Thead = ({ paymentType }: { paymentType: TpaymentType }) => {
  const keyArr = lookup_keyArr[paymentType];

  return (
    <div className={classNames(scss.row, scss.thead)}>
      {keyArr.map((key) => {
        const config = configList[key];

        const label = config?.label ?? config?.labelByPaymentType?.[paymentType] ?? key;

        return (
          <Cell_span key={key} {...config}>
            {label}
          </Cell_span>
        );
      })}
    </div>
  );
};

const Row = ({ data_accountant }: { data_accountant: TaccountantDto }) => {
  return <div></div>;
};

// =========================================================================

// region config

type TaccountantKey = keyof TaccountantDto | 'btn';

type Tconfig = {
  label?: string;
  style: React.CSSProperties;
  className?: string;
  labelByPaymentType?: {
    [key in TpaymentType]?: string;
  };
};

type TconfigList = {
  [key in TaccountantKey]?: Tconfig;
};

const baseArr: TaccountantKey[] = ['accountingNumber', 'vendorName', 'price', 'billSerialNumber', 'notes'];

const lookup_keyArr: {
  [key in TpaymentType]: TaccountantKey[];
} = {
  匯款: ['btn', 'insertDate', 'importAccountingNumber', ...baseArr],
  票據: ['btn', 'insertDate', 'noteNumber', ...baseArr],
  現金: ['btn', 'insertDate', ...baseArr],
} as const;

const configList: TconfigList = {
  btn: {
    label: '',
    style: {
      width: 100,
    },
    className: '',
  },
  insertDate: {
    style: {
      width: 100,
    },
    className: '',
    labelByPaymentType: {
      匯款: '匯入日期',
      票據: '收票日期',
      現金: '收現日期',
    },
  },
  accountingNumber: {
    label: '存入帳號',
    style: {
      width: 185,
    },
    className: '',
  },
  //
  noteNumber: {
    label: '票據號碼',
    style: {
      width: 185,
    },
    className: '',
  },
  importAccountingNumber: {
    label: '匯入帳號',
    style: {
      width: 185,
    },
    className: '',
  },
  //
  vendorName: {
    label: '廠商名稱',
    style: {
      width: 185,
    },
    className: '',
  },
  price: {
    label: '金額',
    style: {
      width: 185,
    },
    className: '',
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: {
      width: 185,
    },
    className: '',
  },
  notes: {
    label: '備註',
    style: { flex: 'auto' },
    className: '',
  },
};

// =========================================================================

// region fakeData

const fake_accountant: TaccountantDto = {
  id: '1',
  createdAt: '2021-09-01T00:00:00',
  updatedAt: '20221-09-01T00:00:00',
  paymentType: '匯款',
  accountingNumber: 'a-55-aa5555-777',
  insertDate: '101-11-01',
  vendorName: '八八八有限公司',
  price: 9999,
  notes: 'AAAA',
  noteNumber: null,
  fee: 9999,
  noteMaturityDate: null,
  invoice: null,

  //
  billSerialNumber: null,
  importAccountingNumber: 'a-454554-sd55455',
};

const fake_accountantArr = Array.from({ length: 10 }, (_, i) => {
  return {
    ...fake_accountant,
    id: String(i),
  };
});
