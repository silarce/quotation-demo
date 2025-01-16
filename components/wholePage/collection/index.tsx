import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import _ from 'lodash';
import classNames from 'classnames';

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
import type { TaccountantDto, TcustomerDto } from 'js/api/dtoTypes';
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

import { cutCurrency } from 'js/utils/currency/cutCurrency';

// ______________________________________________________________
// ______________________________________________________________

import { Thead, Row } from './row';
import { calcQuota } from './function';

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
  billSerialNumber: string[];
  notes: string;

  // isImported: boolean;
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
  //
  vendorName: string;
  vendorCustomerId: string | null;
  vendorCustomer: TcustomerDto | undefined;
};

type TreqPost = (state_accountant: Tstate_accountant) => Promise<void>;
type TreqPatch = (id: string, state_accountant: Tstate_accountant) => Promise<void>;

type TreqPostPatchIsImported = (
  //
  accountantId: string,
  incomeBillDate: string,
  splitPayment: number,
  isForeign: boolean
) => Promise<void>;

type TreqPostAccountReceivableAccountant = (props: {
  accountReceivableId: string;
  accountant: TaccountantDto;
  incomeBillDate: string;
  splitPayment: number;
  isForeign: boolean;
}) => Promise<void>;

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

  // const [disabled = isWorksDepartment, setDisabled] = useState(true);
  const [showNewRow, setShowNewRow] = useState(false);

  // const [accountantId, setAccountantId] = useState<string>();
  const [accountantWillImport, setAccountantWillImport] = useState<TaccountantDto>();

  // ----------------------------------------------------------------------------

  // region get Data

  const {
    data: data_accountant_raw,
    update: update_accountant,
    isFetching,
  } = useGetAccountant({
    params: useMemo(() => {
      const m_date = moment({
        year: Number(year),
        month: Number(month) - 1,
      });

      const params: Tparams = {
        populate: ['incomeBill.accountsReceivableDeduction', 'vendorCustomer'],
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

  const data_accountant = useMemo(() => {
    const sortedData_accountant = _.orderBy(
      data_accountant_raw,
      (data) => {
        // 之前更新insertDate的時候時分秒沒有歸零，使的排序出問題，因此在這裡歸零
        const { insertDate, createdAt } = data;
        const insertDate_format = moment(insertDate).format('YYYY-MM-DD');

        return [insertDate_format, createdAt];
      },
      ['asc', 'asc']
    );

    return sortedData_accountant;
  }, [data_accountant_raw]);

  // ----------------------------------------------------------------------------
  // region REQUEST

  const reqPost = async (state_accountant: Tstate_accountant) => {
    if (isWorksDepartment) {
      alert('ReadOnly');

      return;
    }

    const { vendorCustomer, ...preBody } = state_accountant;

    if (!preBody.insertDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    const body: TcreateAccountantDto = {
      ...preBody,
      insertDate: preBody.insertDate.toISOString(true),
      paymentType,
      price: Number(preBody.price),
      fee: 0,
      noteMaturityDate: preBody.noteMaturityDate?.toISOString(true),
      receiptCollectionDate: preBody.receiptCollectionDate?.toISOString(true) ?? null,
      // 在這個階段，receiptEstimatedDate與receiptCashedDate同步
      receiptEstimatedDate: preBody.receiptEstimatedDate?.toISOString(true) ?? null,
      receiptCashedDate: preBody.receiptEstimatedDate?.toISOString(true) ?? null,
      currency: preBody.currency,
      exchangeRate: preBody.exchangeRate ? (preBody.exchangeRate as `${number}`) : '0',
      currencyValue: preBody.currencyValue ? (preBody.currencyValue as `${number}`) : '0',
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
      vendorCustomerId: state_accountant.vendorCustomerId,
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
    splitPayment,
    isForeign
  ) => {
    if (!isWorksDepartment) {
      alert('isWorksDepartment should be false');

      return;
    }

    const body: TcreateAccountReceivableAccountsDto = {
      accountantId: [accountantId],
      incomeBillDate,
      splitPayment,
      isForeign,
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
  const reqPostAccountReceivableAccountant: TreqPostAccountReceivableAccountant = async ({
    accountReceivableId,
    accountant,
    incomeBillDate,
    splitPayment,
    isForeign,
  }) => {
    if (!accountant) {
      alert('accountantId為undefined');

      return;
    }

    try {
      // apiPostAccountReceivableAccountant 最後的單字是Accountant不是Accounts
      await apiPostAccountReceivableAccountant(accountReceivableId, {
        accountantId: [accountant.id],
        incomeBillDate,
        splitPayment: splitPayment,
        isForeign,
      });
      await update_accountant();
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '匯入失敗', content: err.message });
    }
  };

  // region FUNCTION

  const handle_import = ({
    accountReceivableId,
    accountantWillImport,
    currency,
  }: {
    accountReceivableId: string;
    accountantWillImport: TaccountantDto;
    currency: string;
  }) => {
    const quota = calcQuota(accountantWillImport);

    const modal = myAlert.btnBar({});
    modal.update({
      title: '匯入發票',
      content: (
        <ExportToIncomeBill
          onConfirm={({ isoString, splitPayment, isForeign }) =>
            reqPostAccountReceivableAccountant({
              accountReceivableId,
              accountant: accountantWillImport,
              incomeBillDate: isoString,
              splitPayment,
              isForeign,
            })
          }
          onCancel={modal.destroy}
          quota={quota}
          currency={currency}
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

  // region COMPONENT

  // const ContractSelector = useMemo(() => {
  //   const ContractSelector = selectModalCreator_multi<['contract']>({
  //     selectorArr: [
  //       {
  //         key: 'contract',
  //         limit: 1,
  //         caption: '付款匯入合約',
  //         // customParams: {
  //         //   filter: {
  //         //     currency: {
  //         //       // $eq: 'TWD 新臺幣',
  //         //       $ne: 'TWD 新臺幣',
  //         //     },
  //         //     // isForeingn: {
  //         //     //   $eq: true,
  //         //     // },
  //         //   },
  //         // },
  //       },
  //     ],
  //   });

  //   return ContractSelector;
  // }, []);

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

          {/* note summary */}
          <div className={scss.noteSummary}>
            <div className={classNames(paymentType !== '票據' && 'hidden')}>
              <span>數量</span>：<span>{data_accountant.length}</span>
            </div>
            <div>
              <span>合計</span>：<span>{totalPrice_localString}</span>
            </div>
            {/* <span className={scss.totalPrice}>{totalPrice_localString}</span> */}
          </div>
        </div>

        <ContractSelector
          showModal={!!accountantWillImport}
          dynaSelectorPropsList={[
            {
              filter: () => {
                return {
                  currency: {
                    $eq: accountantWillImport?.currency,
                  },
                  accountReceivableId: {
                    $notNull: true,
                  },
                };
              },
            },
          ]}
          onConfirm={(arr) => {
            const contract = arr[0][0];
            const accountReceivableId: string | undefined | null = contract?.accountReceivableId;

            const accountantCurrency = accountantWillImport?.currency || ('TWD' as Tcurrency);
            const contractCurrency = contract?.currency;

            if (accountReceivableId === null) {
              myAlert.info({ title: '該合約尚未建立應收帳款' });
            }

            if (accountReceivableId) {
              handle_import({
                accountReceivableId,
                accountantWillImport: accountantWillImport!,
                currency: cutCurrency(accountantCurrency),
              });

              if (contractCurrency !== accountantCurrency) {
                myAlert.warning({
                  props: {
                    title: (
                      <span className="whitespace-pre-wrap">{`注意\n收款幣別(${accountantCurrency})\n合約幣別(${contractCurrency})\n幣別不一致`}</span>
                    ),
                  },
                });
              }
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
