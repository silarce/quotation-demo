import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto } from 'js/api/dtoTypes';

// icon
import {
  IconAddCircle,
  IconRemoveCircle,
  IconCheck02,
  IconEdit,
  IconDelete01,
} from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// api
import {
  Tparams,
  TcreateAccountantDto,
  TupdateAccountantDto,
  //
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,
  useGetAccountant,
} from 'js/api/api_accountant';

// 匯入的api
// engineering/account-receivable/:id/accountants

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
  insertDate: Moment | null;
  importAccountingNumber: string;
  noteNumber: string;
  accountingNumber: string;
  vendorName: string;
  price: string;
  billSerialNumber: string;
  notes: string;
};

type TreqPost = (state_accountant: Tstate_accountant) => Promise<void>;
type TreqPatch = (id: string, state_accountant: Tstate_accountant) => Promise<void>;
type TreqDelete = (id: string) => Promise<void>;

// =============================================================================

const defaultPaymentType: TpaymentType = '匯款';

// =============================================================================

// region START
export default function Collection({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  // ------------------------------------------------------------------------------

  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType, year = String(thisYear), month = String(thisMonth) } = query;

  // ------------------------------------------------------------------------------

  const [disabled = isReadOnly, setDisabled] = useState(true);
  const [showNewRow, setShowNewRow] = useState(false);

  // ----------------------------------------------------------------------------

  // region get Data

  const {
    data: data_accountant,
    update: update_accountant,
    isFetching,
  } = useGetAccountant({
    params: useMemo(() => {
      const m_date = moment({
        year: Number(year),
        month: Number(month) - 1,
      });

      const params: Tparams = {
        sort: 'insertDate',
        filter: {
          insertDate: {
            $gte: m_date.startOf('month').toISOString(),
            $lte: m_date.endOf('month').toISOString(),
          },
          paymentType: {
            $eq: paymentType,
          },
        },
      };

      return params;
    }, [year, month, paymentType]),
  });

  // ----------------------------------------------------------------------------
  // region REQUEST

  const reqPost = async (state_accountant: Tstate_accountant) => {
    if (isReadOnly) {
      alert('ReadOnly');

      return;
    }

    if (!state_accountant.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TcreateAccountantDto = {
      ...state_accountant,
      insertDate: state_accountant.insertDate.toISOString(true),
      paymentType,
      price: Number(state_accountant.price),
      fee: 0,
    };

    await apiPostAccountant({ body });
    setShowNewRow(false);
    await update_accountant();
  };

  const reqPatch = async (id: string, state_accountant: Tstate_accountant) => {
    if (isReadOnly) {
      alert('ReadOnly');

      return;
    }

    if (!state_accountant.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TupdateAccountantDto = {
      ...state_accountant,
      insertDate: state_accountant.insertDate.toISOString(),
      paymentType,
      price: Number(state_accountant.price),
      fee: 0,
    };

    await apiPatchAccountant(id, { body });
    await update_accountant();
  };

  const reqDelete = async (id: string) => {
    await deleteAccountant(id);
    await update_accountant();
  };

  // ----------------------------------------------------------------------------

  // region PROPS

  let d_totalPrice = new Decimal(0);
  data_accountant?.forEach((data) => {
    d_totalPrice = d_totalPrice.add(data.price);
  });
  const totalPrice_localString = d_totalPrice.toNumber().toLocaleString();

  const tagList = useTagList();

  const selectPropsArr = useSelectPropsArr({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  // 這個好像沒用
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

        <div className={scss.tabBar}>
          <div className={scss.tab}>{paymentType}</div>
          {!showNewRow && !isReadOnly && <IconAddCircle className={scss.newBtn} onClick={() => setShowNewRow(true)} />}
          {showNewRow && !isReadOnly && (
            <IconRemoveCircle className={scss.newBtn} onClick={() => setShowNewRow(false)} />
          )}
        </div>

        <div className={scss.table}>
          <Thead paymentType={paymentType} />

          {showNewRow && (
            <Row
              //
              postProps={{
                year: Number(year),
                month: Number(month),
                reqPost,
              }}
              className={scss.newRow}
              data_accountant={undefined}
              paymentType={paymentType}
              //
              isReadOnly={isReadOnly}
            />
          )}

          {data_accountant?.map((data) => {
            return (
              <Row
                key={data.id}
                data_accountant={data}
                paymentType={paymentType}
                reqPatch={reqPatch}
                reqDelete={reqDelete}
                isReadOnly={isReadOnly}
              />
            );
          })}

          <div className={scss.totalPriceWrapper}>
            <span className={scss.totalPrice}>{totalPrice_localString}</span>
          </div>
        </div>
        <div className={scss.cover_bottom}></div>

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

// region Row

const Row = ({
  // children,
  paymentType,
  data_accountant,
  className,
  postProps,
  reqPatch,
  reqDelete,
  isReadOnly,
}: {
  // children: React.ReactNode;
  paymentType: TpaymentType;
  data_accountant: TaccountantDto | undefined;
  className?: string;
  postProps?: {
    year: number;
    month: number;
    reqPost: TreqPost;
  };
  reqPatch?: TreqPatch;
  reqDelete?: TreqDelete;
  isReadOnly: boolean;
}) => {
  const isNew = !!postProps;

  const [disabled = !!data_accountant?.billSerialNumber, setDisabled] = useState(!isNew);
  const [state_accountant, setState_accountant] = useState<Tstate_accountant>(cre_emptyStateAccountant());

  let keyArr = lookup_keyArr[paymentType];
  keyArr = [...keyArr];
  keyArr.shift();
  keyArr.shift();

  const theKeyArr = keyArr as Exclude<TaccountantKey, 'btn' | 'insertDate'>[];

  const limitedDate =
    state_accountant.insertDate ??
    (postProps &&
      moment({
        year: postProps.year,
        month: postProps.month - 1,
      }));

  // ---------------------------------------------------

  const handle_check = async () => {
    if (postProps) {
      postProps.reqPost(state_accountant);
    } else if (data_accountant?.id && reqPatch) {
      await reqPatch(data_accountant.id, state_accountant);
      setDisabled(true);
    } else {
      alert('錯誤，data_accountant.id或reqPatch為undefined');
    }
  };

  const handle_delete = async () => {
    if (data_accountant?.id && reqDelete) {
      await reqDelete(data_accountant.id);
      setDisabled(true);
    } else {
      alert('錯誤，data_accountant.id或reqDelete為undefined');
    }
  };

  // ---------------------------------------------------

  useEffect(() => {
    if (!data_accountant) {
      setState_accountant({
        ...cre_emptyStateAccountant(),
      });

      return;
    }

    setState_accountant({
      insertDate: data_accountant.insertDate ? moment(data_accountant.insertDate) : null,
      importAccountingNumber: data_accountant.importAccountingNumber ?? '',
      noteNumber: data_accountant.noteNumber ?? '',
      accountingNumber: data_accountant.accountingNumber ?? ' ',
      vendorName: data_accountant.vendorName ?? '',
      price: String(data_accountant.price),
      billSerialNumber: data_accountant.billSerialNumber ?? '',
      notes: data_accountant.notes ?? '',
    });
  }, [disabled, data_accountant?.id, data_accountant?.updatedAt]);

  return (
    <div className={classNames(scss.row, className)}>
      <div
        className={classNames(
          //
          scss.cell,
          scss.cell_btn,
          configList?.btn?.className
        )}
        style={configList?.btn?.style}
      >
        {!isReadOnly && (
          <>
            <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_check} />
            <IconEdit
              //
              className={classNames(!disabled && scss.active, scss.foo, isNew && 'invisible')}
              onClick={() => setDisabled((state) => !state)}
            />
            <IconDelete01 className={classNames(!disabled && 'invisible')} onClick={handle_delete} />
          </>
        )}
        {isReadOnly && (
          <MyButton_v2 px="px22" py="py4">
            匯入
          </MyButton_v2>
        )}
      </div>

      <div className={classNames(scss.cell, configList?.insertDate?.className)} style={configList?.insertDate?.style}>
        <InputSel
          key={
            // 為了重置defaultPickerValue
            limitedDate?.toISOString()
          }
          disabled={disabled}
          showBaseline="auto"
          // wrapperStyle={{ width: 85 }}
          datePickerProps={{
            props: {
              // allowClear: false,
              // suffixIcon: null,
              defaultPickerValue: limitedDate,
              value: state_accountant.insertDate,
              onChange: (date) => {
                setState_accountant((state) => ({ ...state, insertDate: date }));
              },
              disabledDate: (date) => {
                return !date.isSame(limitedDate, 'month');
              },
            },
          }}
        />
      </div>

      {theKeyArr.map((key) => {
        const isbillSerialNumber = key === 'billSerialNumber';

        const config = configList[key];

        let value = state_accountant[key];

        let inputType = 'text';

        if (key === 'price') {
          inputType = 'number';

          if (disabled) {
            value = Number(value).toLocaleString();
            inputType = 'text';
          }
        }

        if (key === 'price') {
          console.log(config);
        }

        return (
          <div key={key} className={classNames(scss.cell, config?.className)} style={config?.style}>
            <InputSel
              disabled={isbillSerialNumber || disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  ...config?.inputProps?.props,
                  placeholder: isbillSerialNumber ? '系統產生' : '請輸入',
                  type: inputType,
                  value: value,
                  onChange: (e) => {
                    setState_accountant((state) => ({ ...state, [key]: e.target.value }));
                  },
                },
              }}
            />
          </div>
        );
      })}

      {/*  */}
    </div>
  );
};

// =========================================================================

// region config

type TaccountantKey = keyof Tstate_accountant | 'btn';

type Tconfig = {
  label?: string;
  style: React.CSSProperties;
  className?: string;
  labelByPaymentType?: {
    [key in TpaymentType]?: string;
  };
  inputProps?: TinputProps;
};

type TconfigList = {
  [key in TaccountantKey]?: Tconfig;
};

const baseArr_before: TaccountantKey[] = ['btn', 'insertDate'];
const baseArr_after: TaccountantKey[] = ['accountingNumber', 'vendorName', 'price', 'billSerialNumber', 'notes'];

const lookup_keyArr: {
  [key in TpaymentType]: TaccountantKey[];
} = {
  匯款: [...baseArr_before, 'importAccountingNumber', ...baseArr_after],
  票據: [...baseArr_before, 'noteNumber', ...baseArr_after],
  現金: [...baseArr_before, ...baseArr_after],
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
      width: 130,
      // justifyContent: 'center',
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
      width: 200,
    },
    className: '',
  },
  price: {
    label: '金額',
    style: {
      width: 135,
      justifyContent: 'flex-end',
    },
    className: '',
    inputProps: {
      props: {
        style: { textAlign: 'end' },
      },
    },
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

const cre_emptyStateAccountant = (): Tstate_accountant => ({
  insertDate: null,
  importAccountingNumber: '',
  noteNumber: '',
  accountingNumber: '',
  vendorName: '',
  price: '',
  billSerialNumber: '',
  notes: '',
});
