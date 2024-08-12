import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';

import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import { ExportToIncomeBill } from './exportToIncomeBill';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto } from 'js/api/dtoTypes';
import type { AxiosError } from 'axios';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

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

import { Tcurrency } from 'js/api/dtoTypes';

// ______________________________________________________________
// ______________________________________________________________

import { Thead, Row } from './row';

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
  readonly splitPayment: number[];
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

export type {
  TselectPropsArr,
  TpaymentType,
  Tstate_accountant,
  TreqPost,
  TreqPatch,
  TreqPostPatchIsImported,
  TreqDelete,
};

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
