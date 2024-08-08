import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import { ExportToIncomeBill } from './exportToIncomeBill';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, {
  TinputProps,
  TtextareaProps,
  TselectProps,
  TdatePickerProps,
  TcheckBoxProps_v2,
  TinputSelProps,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto, TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';
import type { AxiosError } from 'axios';

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
  TupdateAccountReceivableDeductionDto,
  //
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,

  //
  useGetAccountant,
  useGetAccountantPreset,
} from 'js/api/api_accountant';

import {
  TcreateAccountReceivableAccountsDto,
  apiPostAccountReceivableAccountant,
  apiPostAccountReceivableAccounts,
} from 'js/api/api_engineering';

import { Tcurrency, TperiodType } from 'js/api/dtoTypes';

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
  billSerialNumber: string[];
  notes: string;

  isImported: boolean;
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];

  noteMaturityDate: Moment | null;
  receiptCollectionDate: Moment | null;
  receiptEstimatedDate: Moment | null;

  currency: Tcurrency; // 幣別
  // 匯率 不與幣別連動 // 手動輸入 在cre_emptyStateAccountant預設為1
  exchangeRate: string;
  currencyValue: string; // 金額
  price: string; // 新台幣 = 匯率 * 金額

  // 已分出金額
  readonly splitPayment: string;
};

type TreqPost = (state_accountant: Tstate_accountant) => Promise<void>;
type TreqPatch = (id: string, state_accountant: Tstate_accountant) => Promise<void>;

type TreqPostPatchIsImported = (
  //
  accountantId: string,
  incomeBillDate: string,
  splitPayment: number
) => Promise<void>;

type TreqDelete = (id: string) => Promise<void>;

export type { TreqPostPatchIsImported };

// =============================================================================

const defaultPaymentType: TpaymentType = '匯款';

const ContractSelector = selectModalCreator_multi<['contract']>({
  selectorArr: [
    {
      key: 'contract',
      limit: 1,
      caption: '付款匯入合約',
    },
  ],
});

const options_currency: {
  label: string;
  value: Tcurrency;
}[] = [
  {
    label: 'TWD 新臺幣',
    value: 'TWD 新臺幣',
  },
  {
    label: 'USD 美元',
    value: 'USD 美元',
  },
];

// =============================================================================

// region START
export default function Collection({ isWorksDepartment = false }: { isWorksDepartment?: boolean }) {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  // ------------------------------------------------------------------------------

  const router = useRouter();
  const query = router.query as Tquery;
  const { paymentType = defaultPaymentType, year = String(thisYear), month = String(thisMonth) } = query;

  // ------------------------------------------------------------------------------

  const [disabled = isWorksDepartment, setDisabled] = useState(true);
  const [showNewRow, setShowNewRow] = useState(false);

  // const [accountantId, setAccountantId] = useState<string>();
  const [accountantWillImport, setAccountantWillImport] = useState<TaccountantDto>();

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
        populate: ['incomeBill.accountsReceivableDeduction'],
        sort: 'insertDate',
        pageSize: 999999,
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

  const { data: data_accountantPreset } = useGetAccountantPreset();

  // ----------------------------------------------------------------------------
  // region REQUEST

  const reqPost = async (state_accountant: Tstate_accountant) => {
    if (isWorksDepartment) {
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
      noteMaturityDate: state_accountant.noteMaturityDate?.toISOString(true),
      receiptCollectionDate: state_accountant.receiptCollectionDate?.toISOString(true) ?? null,
      // 在這個階段，receiptEstimatedDate與receiptCashedDate同步
      receiptEstimatedDate: state_accountant.receiptEstimatedDate?.toISOString(true) ?? null,
      receiptCashedDate: state_accountant.receiptEstimatedDate?.toISOString(true) ?? null,
      currency: state_accountant.currency,
      exchangeRate: state_accountant.exchangeRate ? (state_accountant.exchangeRate as `${number}`) : '0',
      currencyValue: state_accountant.currencyValue ? (state_accountant.currencyValue as `${number}`) : '0',
    };

    await apiPostAccountant({ body });
    setShowNewRow(false);
    await update_accountant();
  };

  const reqPatch = async (id: string, state_accountant: Tstate_accountant) => {
    if (isWorksDepartment) {
      alert('isWorksDepartment should be true');

      return;
    }

    if (!state_accountant.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TupdateAccountantDto = {
      // ...state_accountant,
      accountingNumber: state_accountant.accountingNumber,
      vendorName: state_accountant.vendorName,
      notes: state_accountant.notes,
      importAccountingNumber: state_accountant.importAccountingNumber,
      noteNumber: state_accountant.noteNumber,

      insertDate: state_accountant.insertDate.toISOString(),
      paymentType,
      price: Number(state_accountant.price),
      // fee: 0,
      noteMaturityDate: state_accountant.noteMaturityDate?.toISOString(true),

      receiptCollectionDate: state_accountant.receiptCollectionDate?.toISOString(true) ?? null,
      // 在這個階段，receiptEstimatedDate與receiptCashedDate同步
      receiptEstimatedDate: state_accountant.receiptEstimatedDate?.toISOString(true) ?? null,
      receiptCashedDate: state_accountant.receiptEstimatedDate?.toISOString(true) ?? null,
      currency: state_accountant.currency,
      exchangeRate: state_accountant.exchangeRate ? (state_accountant.exchangeRate as `${number}`) : '0',
      currencyValue: state_accountant.currencyValue ? (state_accountant.currencyValue as `${number}`) : '0',
    };

    await apiPatchAccountant(id, { body });

    await update_accountant();
  };

  // 匯入紙本應收帳款
  const reqPatchIsImported: TreqPostPatchIsImported = async (
    //
    accountantId,
    incomeBillDate,
    splitPayment
  ) => {
    if (!isWorksDepartment) {
      alert('isWorksDepartment should be false');

      return;
    }

    const body: TcreateAccountReceivableAccountsDto = {
      accountantId: [accountantId],
      incomeBillDate,
      splitPayment,
    };

    // apiPostAccountReceivableAccounts 最後的單字是Accounts不是Accountant
    await apiPostAccountReceivableAccounts(body);
    await update_accountant();
  }; // reqPatchIsImported

  const reqDelete = async (id: string) => {
    await deleteAccountant(id);
    await update_accountant();
  };

  // 匯入發票
  const reqPostAccountReceivableAccountant: TreqPostPatchIsImported = async (
    //
    accountReceivableId,
    incomeBillDate,
    splitPayment
  ) => {
    if (!accountantWillImport) {
      alert('accountantId為undefined');

      return;
    }

    try {
      // apiPostAccountReceivableAccountant 最後的單字是Accountant不是Accounts
      await apiPostAccountReceivableAccountant(accountReceivableId, {
        accountantId: [accountantWillImport.id],
        incomeBillDate,
        splitPayment: splitPayment,
      });
      await update_accountant();
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '匯入失敗', content: err.message });
    }
  };

  // region FUNCTION

  const handle_import = (accountReceivableId: string, accountantWillImport: TaccountantDto) => {
    const modal = myAlert.btnBar({});
    modal.update({
      title: '匯入發票',
      content: (
        // <AddInovice
        //   onCancel={modal.destroy}
        //   accountReceivableId={accountReceivableId}
        //   reqPostAccountReceivableAccountant={reqPostAccountReceivableAccountant}
        // />
        <ExportToIncomeBill
          onConfirm={({ isoString, splitPayment }) =>
            reqPostAccountReceivableAccountant(accountReceivableId, isoString, splitPayment)
          }
          onCancel={modal.destroy}
          defaultPayment={accountantWillImport.price}
        />
      ),
    });
  };

  // ----------------------------------------------------------------------------

  // region PROPS

  let d_totalPrice = new Decimal(0);

  data_accountant?.forEach((data) => {
    d_totalPrice = d_totalPrice.add(data.price);
  });
  const totalPrice_localString = d_totalPrice.toNumber().toLocaleString();

  // _____________________________________________________________________________
  // _____________________________________________________________________________

  const tagList = useTagList();

  const selectPropsArr = useSelectPropsArr({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  const bankAccountOptionArr = useMemo(() => {
    const bankAccountOptionArr = (data_accountantPreset ?? []).map((data) => {
      return {
        label: data.accountName,
        value: data.accountName,
      };
    });

    return bankAccountOptionArr;
  }, [data_accountantPreset]);

  // ----------------------------------------------------------------------------
  // region RENDER
  return (
    <SubLayer
    //  isLoading_subLayer={isFetching}
    >
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
      />
      <div className={scss.body}>
        {/*  */}

        <div className={scss.tabBar}>
          <div className={scss.tab}>{paymentType}</div>
          {!showNewRow && !isWorksDepartment && (
            <IconAddCircle className={scss.newBtn} onClick={() => setShowNewRow(true)} />
          )}
          {showNewRow && !isWorksDepartment && (
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
              bankAccountOptionArr={bankAccountOptionArr}
              isWorksDepartment={isWorksDepartment}
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
                reqPatchIsImported={reqPatchIsImported}
                setAccountantId={setAccountantWillImport}
                bankAccountOptionArr={bankAccountOptionArr}
                isWorksDepartment={isWorksDepartment}
              />
            );
          })}

          <div className={scss.totalPriceWrapper}>
            <span className={scss.totalPrice}>{totalPrice_localString}</span>
          </div>
        </div>

        <ContractSelector
          showModal={!!accountantWillImport}
          onConfirm={(arr) => {
            const contractArr = arr[0];
            const accountReceivableId: string | undefined | null = contractArr[0]?.accountReceivableId;

            if (accountReceivableId === null) {
              myAlert.info({ title: '該合約尚未建立應收帳款' });
            }

            if (accountReceivableId) {
              handle_import(accountReceivableId, accountantWillImport!);
            }
          }}
          onCancel={() => {
            setAccountantWillImport(undefined);
          }}
        />

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
    <div className={classNames(scss.cell, scss.cell_span, className)} style={style}>
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
  // isReadOnly,
  setAccountantId,
  bankAccountOptionArr,
  reqPatchIsImported,
  isWorksDepartment,
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
  // isReadOnly: boolean;
  setAccountantId?: (accountant: TaccountantDto | undefined) => void;
  bankAccountOptionArr: Toption[];
  reqPatchIsImported?: TreqPostPatchIsImported;
  isWorksDepartment: boolean;
}) => {
  const isNew = !!postProps;

  const [disabled = !!data_accountant?.billSerialNumber, setDisabled] = useState(!isNew);
  const [state_accountant, setState_accountant] = useState<Tstate_accountant>(cre_emptyStateAccountant());

  let keyArr = lookup_keyArr[paymentType];
  keyArr = [...keyArr];

  // keyArr = keyArr.slice(baseArr_before.length);
  keyArr = keyArr.slice(1);

  const theKeyArr = keyArr as Exclude<TaccountantKey, 'btn' | 'accountsReceivableDeduction'>[];

  const limitedDate =
    state_accountant.insertDate ??
    (postProps &&
      moment({
        year: postProps.year,
        month: postProps.month - 1,
      }));

  // ---------------------------------------------------

  const isAllowToEdit = !isWorksDepartment;

  const { billSerialNumber, isImported, exchangeFromId } = data_accountant ?? {};
  const isBillSerialNumberValid = billSerialNumber && billSerialNumber.length > 0;

  let isAllowToEditIsImported = false;

  if (!isNew && isWorksDepartment && !state_accountant.billSerialNumber.length) {
    isAllowToEditIsImported = true;
  }

  let fonbiddenText: string | null = null;

  if ((isImported || isBillSerialNumberValid) && exchangeFromId) {
    fonbiddenText = '已匯入/已兌現';
  } else if (isImported || isBillSerialNumberValid) {
    fonbiddenText = '已匯入';
  } else if (exchangeFromId) {
    fonbiddenText = '已兌現';
  }

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
      myAlert.confirm({
        title: '確定刪除',
        props: {
          onOk: async () => {
            await reqDelete(data_accountant.id);
            setDisabled(true);
          },
        },
      });
    } else {
      alert('錯誤，data_accountant.id或reqDelete為undefined');
    }
  };

  const handle_checkIsImported = async () => {
    if (data_accountant?.id && reqPatchIsImported) {
      const modal = myAlert.btnBar({});

      modal.update({
        title: '匯入紙本應收帳款',
        content: (
          // <MakeIsImported
          //   reqPatchIsImported={reqPatchIsImported}
          //   accountReceivableId={data_accountant.id}
          //   onCancel={modal.destroy}
          // />
          <ExportToIncomeBill
            onConfirm={({ isoString, splitPayment: separatePayment }) =>
              reqPatchIsImported(data_accountant.id, isoString, separatePayment)
            }
            onCancel={modal.destroy}
            defaultPayment={Number(state_accountant.price)}
          />
        ),
      });
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

    const {
      //
      insertDate,
      noteMaturityDate,
      receiptCollectionDate,
      receiptEstimatedDate,
      //

      importAccountingNumber,
      noteNumber,
      accountingNumber,
      vendorName,
      price,
      billSerialNumber,
      notes,
      isImported,
      currency,
      exchangeRate,
      currencyValue,
      incomeBill,

      //
      splitPayment,
      //
    } = data_accountant;

    // 在IDE裡型別為TaccountsReceivableDeductionDto[]，
    // 但是在編譯時被認為是(TaccountsReceivableDeductionDto | undefined)[]
    // 因此在最後使用型別斷言
    const accountsReceivableDeduction: TaccountsReceivableDeductionDto[] = incomeBill
      .flatMap((ib) => ib.accountsReceivableDeduction)
      .filter((item) => !!item) as TaccountsReceivableDeductionDto[];

    setState_accountant({
      insertDate: insertDate ? moment(insertDate) : null,
      importAccountingNumber: importAccountingNumber ?? '',
      noteNumber: noteNumber ?? '',
      accountingNumber: accountingNumber ?? ' ',
      vendorName: vendorName ?? '',
      price: String(price),
      billSerialNumber: billSerialNumber ?? [],
      notes: notes ?? '',
      isImported: isImported,
      accountsReceivableDeduction: accountsReceivableDeduction,
      noteMaturityDate: noteMaturityDate ? moment(noteMaturityDate) : null,
      receiptCollectionDate: receiptCollectionDate ? moment(receiptCollectionDate) : null,
      receiptEstimatedDate: receiptEstimatedDate ? moment(receiptEstimatedDate) : null,
      currency: currency,
      exchangeRate: String(exchangeRate || ''),
      currencyValue: String(currencyValue || ''),

      splitPayment: splitPayment ? splitPayment.toLocaleString() : '',
    });
  }, [disabled, data_accountant?.id, data_accountant?.updatedAt]);

  // ---------------------------------------------------------------------------

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
        {
          //
          fonbiddenText ? (
            <span className="text-center">{fonbiddenText}</span>
          ) : isAllowToEdit ? (
            <>
              <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_check} />
              <IconEdit
                //
                className={classNames(!disabled && scss.active, scss.foo, isNew && 'invisible')}
                onClick={() => setDisabled((state) => !state)}
              />
              <IconDelete01 className={classNames(!disabled && 'invisible')} onClick={handle_delete} />
            </>
          ) : (
            <MyButton_v2 px="px22" py="py4" onClick={() => setAccountantId?.(data_accountant)}>
              匯入發票
            </MyButton_v2>
          )
        }
      </div>

      {theKeyArr.map((key) => {
        const isbillSerialNumber = key === 'billSerialNumber';

        const config = configList[key];

        const { reactNode, ...props } =
          config?.inputSelPropsCreator({
            disabled,
            bankAccountOptionArr,
            limitedDate,
            state_accountant,
            setState_accountant,
            handle_checkIsImported,
            isAllowToEditIsImported,
          }) ?? {};

        const theDiasbled = isbillSerialNumber || disabled;

        return (
          <div key={key} className={classNames(scss.cell, config?.className)} style={config?.style}>
            {reactNode ? (
              reactNode
            ) : (
              <InputSel
                //
                disabled={theDiasbled}
                showBaseline="auto"
                fontSize="14"
                {...config?.inputSelProps}
                {...props}
              />
            )}
          </div>
        );
      })}

      {/*  */}
    </div>
  );
};

// =========================================================================
// region: FUNCTION

const calcPrice = ({ currencyValue, exchangeRate }: Tstate_accountant) => {
  const d_currencyValue = new Decimal(currencyValue || 0);
  const d_price = d_currencyValue.mul(exchangeRate || 0);

  // return d_price.toNumber();
  return d_price.toDecimalPlaces(0).toNumber();
};

// =========================================================================

// region config

type TaccountantKey = keyof Tstate_accountant | 'btn' | 'isImported';

type Tconfig = {
  label?: string;
  style: React.CSSProperties;
  className?: string;
  labelByPaymentType?: {
    [key in TpaymentType]?: string;
  };
  inputSelProps?: TinputSelProps;
  // selectProps?:
  inputSelPropsCreator: (props: {
    //
    disabled?: boolean;
    bankAccountOptionArr?: Toption[];
    limitedDate?: Moment;
    // value: string | Moment | null | boolean;
    state_accountant: Tstate_accountant;
    setState_accountant: React.Dispatch<React.SetStateAction<Tstate_accountant>>;
    handle_checkIsImported: () => void;
    isAllowToEditIsImported?: boolean;
  }) => {
    inputProps?: TinputProps;
    textareaProps?: TtextareaProps;
    selectProps?: TselectProps;
    datePickerProps?: TdatePickerProps;
    checkBoxProps_v2?: TcheckBoxProps_v2;
    reactNode?: React.ReactNode;
  };
};

type TconfigList = {
  [key in TaccountantKey]?: Tconfig;
};

const baseArr_before: TaccountantKey[] = ['btn', 'isImported'];
// const baseArr_after: TaccountantKey[] = [
//   'accountingNumber',
//   'vendorName',
//   'price',
//   'currency',
//   'billSerialNumber',
//   'notes',
// ];

const lookup_keyArr: {
  [key in TpaymentType]: TaccountantKey[];
} = {
  匯款: [
    ...baseArr_before,
    'insertDate',
    'importAccountingNumber',

    'accountingNumber',
    'vendorName',

    'currency',
    'exchangeRate',
    'currencyValue',
    'price',

    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
  // 票據: [...baseArr_before, 'noteNumber', 'noteMaturityDate', ...baseArr_after],
  票據: [
    ...baseArr_before,
    'insertDate',
    'noteNumber',
    'importAccountingNumber',
    'accountingNumber',
    'vendorName',
    'noteMaturityDate',
    'currencyValue',
    // 'price',
    // 'currency',
    'receiptCollectionDate',
    'receiptEstimatedDate',
    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
  現金: [
    ...baseArr_before,
    'insertDate',

    'accountingNumber',
    'vendorName',
    'currencyValue',
    // 'price',
    // 'currency',
    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
};

const configList: TconfigList = {
  btn: {
    label: '',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: () => {
      return {};
    },
  },
  isImported: {
    label: '已匯入紙本應收帳款',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    inputSelProps: {
      wrapperStyle: { width: 16 },
      showBaseline: 'invisible',
      // disabled: false,
    },
    className: '',
    inputSelPropsCreator: ({
      isAllowToEditIsImported,
      // disabled,
      bankAccountOptionArr,
      handle_checkIsImported,
      limitedDate,
      state_accountant,
      setState_accountant,
    }) => {
      const value = state_accountant.isImported;

      const value_bool = !!value as boolean;

      const checkBoxProps_v2: TcheckBoxProps_v2 = {
        props: {
          disabled: !!value_bool || !isAllowToEditIsImported,
          value: value_bool ? ['true'] : [],
          onChange: (arr) => {
            const isImported = arr[0];

            if (isImported === 'true') {
              handle_checkIsImported?.();
              // setState_accountant((state) => ({ ...state, isImported: true }));
            }
          },
        },
        checkBoxPropsArr: [
          {
            value: 'true',
          },
        ],
      };

      return { checkBoxProps_v2 };
    },
  },
  insertDate: {
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    labelByPaymentType: {
      匯款: '匯入日期',
      票據: '收票日期',
      現金: '收現日期',
    },
    inputSelPropsCreator: ({ limitedDate, state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.insertDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, insertDate: date }));
          },
          disabledDate: (date) => {
            return !date.isSame(limitedDate, 'month');
          },
        },
      };

      return { datePickerProps };
    },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.noteMaturityDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, noteMaturityDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  accountingNumber: {
    label: '存入帳號',
    style: {
      width: 200,
    },
    className: '',
    inputSelPropsCreator: ({ bankAccountOptionArr, state_accountant, setState_accountant }) => {
      const value_str = state_accountant.accountingNumber || '';

      const selectProps: TselectProps = {
        props: {
          isSearchable: true,
          options: bankAccountOptionArr,
          value: value_str ? { label: value_str, value: value_str } : null,
          onChange: (option) => {
            setState_accountant((state) => ({ ...state, ['accountingNumber']: option?.value ?? '' }));
          },
        },
      };

      return {
        selectProps,
      };
    },
  },
  //
  noteNumber: {
    label: '票據號碼',
    style: {
      width: 120,
    },
    className: scss.stickyLeft,
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.noteNumber || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['noteNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  importAccountingNumber: {
    label: '付款帳號',
    style: {
      width: 160,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.importAccountingNumber || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['importAccountingNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  //
  vendorName: {
    label: '廠商名稱',
    style: {
      width: 100,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.vendorName || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['vendorName']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  price: {
    label: '新臺幣',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    className: '',
    inputSelProps: {
      showBaseline: 'invisible',
    },
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      // const inputType = disabled ? 'text' : 'number';

      const value_str = state_accountant.price || '';
      // const theValue = disabled ? Number(value_str).toLocaleString() : value_str;
      const theValue = Number(value_str).toLocaleString();

      const inputProps: TinputProps = {
        props: {
          style: { textAlign: 'end' },
          placeholder: '請輸入',
          // type: inputType,
          readOnly: true,
          value: theValue,
          onChange: (e) => {
            // !disabled && setState_accountant((state) => ({ ...state, ['price']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      // const value_str = state_accountant.billSerialNumber || '';
      const value_Arr = state_accountant.billSerialNumber || [];
      const value = value_Arr.join('\n');

      const reactNode = <span className="whitespace-pre-wrap">{value}</span>;

      // const textareaProps: TtextareaProps = {
      //   props: {
      //     readOnly: true,
      //     placeholder: '系統自動產生',
      //     value,
      //     onChange: (e) => {},
      //   },
      // };

      return { reactNode };
    },
  },
  notes: {
    label: '備註',
    // style: { flex: 'auto' },
    style: { width: 300 },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.notes || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['notes']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  receiptCollectionDate: {
    label: '託收日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.receiptCollectionDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, receiptCollectionDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  receiptEstimatedDate: {
    label: '預兌日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.receiptEstimatedDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, receiptEstimatedDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  currency: {
    label: '幣別',
    style: {
      width: 120,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_string = state_accountant.currency;

      const selectProps: TselectProps = {
        props: {
          value: value_string ? { label: value_string, value: value_string } : null,
          options: options_currency,
          onChange: (option) => {
            if (!option) {
              return;
            }

            const value = option.value as (typeof options_currency)[number]['value'];
            setState_accountant((state) => ({ ...state, ['currency']: value }));
          },
        },
      };

      return { selectProps };
    },
  },

  exchangeRate: {
    label: '匯率',
    style: {
      width: 70,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.exchangeRate || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '匯率',
          type: 'number',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => {
              const copy = { ...state };
              copy.exchangeRate = e.target.value;
              const price = calcPrice(copy);

              return { ...copy, price: String(price) };
            });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  currencyValue: {
    label: '金額',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    className: '',
    inputSelPropsCreator: ({ disabled, state_accountant, setState_accountant }) => {
      const inputType = disabled ? 'text' : 'number';
      const value_str = state_accountant.currencyValue || '';
      const theValue = disabled ? Number(value_str).toLocaleString() : value_str;

      const inputProps: TinputProps = {
        props: {
          style: { textAlign: 'end' },
          placeholder: '幣值',
          type: inputType,
          value: theValue,
          onChange: (e) => {
            setState_accountant((state) => {
              const copy = { ...state };
              copy.currencyValue = e.target.value;
              const price = calcPrice(copy);

              return { ...copy, price: String(price) };
            });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  splitPayment: {
    label: '已分出金額',
    style: {
      width: 100,
    },
    className: '',
    inputSelPropsCreator({ state_accountant }) {
      const reactNode = <span className="whitespace-pre-wrap break-words">{state_accountant.splitPayment}</span>;

      // const inputProps: TinputProps = {
      //   props: {
      //     placeholder: '',
      //     readOnly: true,
      //     style: { textAlign: 'end' },
      //     value: state_accountant.splitPayment,
      //     onChange: () => {},
      //   },
      // };

      return {
        disabled: true,
        reactNode,
      };
    },
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
  billSerialNumber: [],
  notes: '',
  isImported: false,
  accountsReceivableDeduction: [],
  noteMaturityDate: null,
  receiptCollectionDate: null,
  receiptEstimatedDate: null,
  currency: 'TWD 新臺幣',
  exchangeRate: '1', // 預設為1，不然price計算結果為0
  currencyValue: '', // 金額

  splitPayment: '',
});
