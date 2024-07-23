// 設計圖
// https://www.figma.com/design/9Gix0Odt4g7ahSOQMysmVh/%E4%B8%89%E4%B9%85?node-id=1282-40444&t=bXAfdnwklJLF2pZu-0

import { useState, useEffect, useMemo, createContext } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Profile, {
  Tprops_profile,
  createValueList_profile_engineeringContact,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/profile';
import TotalCalc from 'components/page/worksDepartment/contracList/contract/accountReceivable/totalCalc';
import PeriodTable, {
  Tstate_period,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/invoiceTable/periodTable';
import AccountantDetails, {
  Tstate_accountant,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDetails';
import DeductionDetail from 'components/page/worksDepartment/contracList/contract/accountReceivable/deductionDetail';
import AccountantSorting, {
  Tstate_accountantSorting,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantSorting';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateAccountReceivablePeriodDto,
  TcreateAccountReceivableDto,
  TupdateAccountReceivableDto,
  TupdateAccountReceivableAccountantDto,
  apiPatchAccountReceivablePeriodInvoiceAllowance,
  apiPostAccountReceivable,
  apiPatchAccountReceivable,
  apiPostAccountReceivablePeriod, // 新增應收帳款發票
  apiDeleteAccountReceivableInvoice,
  apiDeleteAccountReceivablePeriod,
  apiPatchAccountReceivableAccountant,
} from 'js/api/api_engineering';
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';

import { TaccountantDto, apiPatchAccountant_accountReceivable } from 'js/api/api_accountant';

import type { TcustomerDto, TupdateAccountReceivableDeductionDto } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';
import { AxiosError } from 'axios';

// ========================================================================

type TaccountReceivableContext = {
  customer: TcustomerDto | undefined;
};

type TreqPatchAccountReceivable = (body: TupdateAccountReceivableDto) => Promise<void>;

export type { TreqPatchAccountReceivable };

// ========================================================================

export const AccountReceivableContext = createContext<TaccountReceivableContext>(null!);

// ========================================================================

// region START

export default function AccountReceivable() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isFetching_req, setIsFetching_req] = useState<boolean>(false);

  let isFetching = false;

  // --------------------------------------------------------------------------

  // region get data

  const {
    data: contract,
    update: update_contract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      'content.customer',
      'engineeringContact',
      'accountReceivable.periods.invoices.accountantList.accountsReceivableDeduction',
      'accountReceivable.periods.invoices.accountantInvoiceBook',
      'accountReceivable.accountantList.invoices',
      'accountReceivable.accountantList.accountsReceivableDeduction',
    ],
  });

  const { engineeringContact, accountReceivable } = contract ?? {};

  const {
    data: data_finalProdcut = [],
    update: update_finalProduct,
    isLoading: isFetching_finalProduct,
  } = useGetContract_id_finalProductItem(contractId);

  const periodArr = useMemo(() => {
    return _.sortBy(accountReceivable?.periods, 'createdAt');
  }, [accountReceivable?.periods]);

  // const accountantArr = useMemo(() => {
  //   if (!periodArr) {
  //     return [];
  //   }

  //   const arr: TaccountantDto[] = [];
  //   periodArr.forEach((period) => {
  //     const invoiceArr = period.invoices;
  //     invoiceArr.forEach((invoice) => {
  //       invoice.accountantList && arr.push(...invoice.accountantList);
  //     });
  //   });

  //   return arr;
  // }, [periodArr]);

  const { accountantArr, accountantArr_noInvoice } = useMemo(() => {
    const accountantArr = accountReceivable?.accountantList ?? [];

    const accountantArr_noInvoice = accountantArr.filter((acc) => {
      if (!acc.invoices) {
        return true;
      } else if (acc.invoices.length === 0) {
        return true;
      }
    });

    return {
      accountantArr,
      accountantArr_noInvoice,
    };
  }, [accountReceivable?.accountantList]);

  // --------------------------------------------------------------------------

  // region REQUEST
  //
  //
  //
  //

  // MARK:PostAccountReceivable

  const reqPostAccountReceivable = async () => {
    if (!contractId) {
      return myAlert.info({ title: '沒有合約編號' });
    }

    const emptyBody: TcreateAccountReceivableDto = {
      valuationDate: null,
      payOffDay: null,
      performanceBond: false,
      depositGuaranteeTicket: false,
      warrantyTicket: false,
      hasNoContract: false,
      hasUncollectedAmounts: false,
      hasNotInstall: false,

      contractId: contractId,
      legacyContractId: null,
      isDone: false,
    };

    try {
      setIsFetching_req(true);
      await apiPostAccountReceivable(emptyBody);
      update_contract();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '新增應收帳款明細失敗', content: err.message });
    } finally {
      setIsFetching_req(false);
    }
  };

  // MARK: PatchAccountReceivable
  const reqPatchAccountReceivable: TreqPatchAccountReceivable = async (body) => {
    const id = accountReceivable?.id;

    if (!id) {
      return;
    }

    return await apiPatchAccountReceivable(id, body)
      .then(async () => {
        await update_contract();
      })
      .catch((err) => {
        throw err;
      });
  };

  // region AddInvoice
  const reqAddInvoice = async (state_invoice: Tstate_period) => {
    if (!accountReceivable?.id) {
      alert('沒有accountReceivable.id');

      return Promise.reject();
    }

    const {
      type,
      rowArr,
      retainage,
      deduction,
      writeOffDeposit,

      minusRetainage,
      minusDeduction,
      minusWriteOffDeposit,

      retainageType,
      retainagePercent,
      allowance,
      note,

      price, // 發票金額
      invoiceNumber, // 發票號碼
      invoiceDate, // 發票日期
      actualPrice, // 發票實際金額

      invoiceBook: accountantInvoiceBook,
      //
      nameOfBusinessEntity,
      businessIdNumber,
      isOriginalCustomer,
    } = state_invoice;

    if (accountantInvoiceBook || actualPrice) {
      if (!(invoiceNumber && invoiceDate && actualPrice)) {
        myAlert.info({
          title: '請輸入完整發票資料或清除所有發票資料',
          content: '發票本、發票實際金額、發票號碼、發票日期',
        });

        return Promise.reject();
      }
    }

    const completedProduct = rowArr.map((row) => {
      return {
        productId: row.productId,
        completedQuantity: Number(row.completedQuantity),
        completedPayment: Number(row.completedPayment),
      };
    });

    const body: TcreateAccountReceivablePeriodDto = {
      type,
      note,
      completedProduct,
      retainage: Number(retainage),
      deduction: Number(deduction),
      writeOffDeposit: Number(writeOffDeposit),
      isRetainage: minusRetainage,
      isDeduction: minusDeduction,
      isWriteOffDeposit: minusWriteOffDeposit,
      retainageType: retainageType === 'null' ? null : retainageType,
      allowance: Number(allowance),
      price,
      //
      invoiceDate: invoiceDate ? invoiceDate.toISOString() : null,
      invoiceNumber: invoiceNumber || null,
      actualPrice: actualPrice ? Number(actualPrice) : null,
      accountantInvoiceBookId: accountantInvoiceBook?.id || null,

      nameOfBusinessEntity: nameOfBusinessEntity || null,
      businessIdNumber: businessIdNumber || null,
      isOriginalCustomer,
      retainagePercent: retainagePercent || null,
    };

    try {
      setIsFetching_req(true);

      return await apiPostAccountReceivablePeriod(accountReceivable.id, body).then(() => {
        update_contract();
      });
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '新增發票失敗', content: err.message });

      throw err;
    } finally {
      setIsFetching_req(false);
    }
  };

  // region  PatchInvoiceAllowance
  const reqPatchInvoiceAllowance = async (invoiceId: string, allowance: number) => {
    try {
      setIsFetching_req(true);

      await apiPatchAccountReceivablePeriodInvoiceAllowance(invoiceId, { allowance });
      await update_contract();
    } catch (error) {
      const err = error as AxiosError;

      myAlert.err({ title: '更新發票失敗', content: err.message });
    } finally {
      setIsFetching_req(false);
    }
  }; //reqPatchInvoiceArr

  // region PatchAccountant
  const reqPatchAccountant = async (state_accountant: Tstate_accountant[]) => {
    for (const state of state_accountant) {
      const state_deduction = state.state_deduction;

      const accountsReceivableDeduction = state_deduction.map((item) => {
        return {
          ...item,
          detailedAmount: Number(item.detailedAmount),
        };
      });

      await apiPatchAccountant_accountReceivable(state.id, {
        fee: Number(state.fee),
        accountsReceivableDeduction,
      });
    }

    update_contract();
  };

  // MARK: PatchAccountant_sorting
  const reqPatchAccountant_sorting = async (
    //
    stateList: Tstate_accountantSorting
  ) => {
    if (!accountReceivable) {
      return;
    }

    const accountantArr: {
      id: string;
      invoiceId: string;
      order: number;
      accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];
      isRelationedInvoiceChanged: boolean;
    }[] = [];

    const relationChangedList: Tstate_accountantSorting = {};

    for (const key of Object.keys(stateList)) {
      const state = stateList[key];

      const {
        isAccountantOrderChanged,
        isInvoiceAllowanceChanged,
        isInvoiceAccountantRelationChanged,
        invoice,
        accountantArr: state_accountantArr,
      } = state;

      if (isInvoiceAccountantRelationChanged) {
        relationChangedList[key] = state;
      }

      if (isInvoiceAllowanceChanged) {
        await apiPatchAccountReceivablePeriodInvoiceAllowance(String(invoice.id), {
          allowance: Number(invoice.allowance),
        });
      }

      if (isAccountantOrderChanged) {
        state_accountantArr.forEach((accountant, index) => {
          const {
            //
            id: accountantId,
            accountsReceivableDeduction,
            isRelationedInvoiceChanged,
          } = accountant;

          accountantArr.push({
            id: String(accountantId),
            invoiceId: String(invoice.id),
            order: index + 1,
            accountsReceivableDeduction: accountsReceivableDeduction,
            isRelationedInvoiceChanged: isRelationedInvoiceChanged,
          });
        });
      }
    }

    const relationChangedArr = Object.values(relationChangedList);

    if (relationChangedArr.length > 0) {
      const body: TupdateAccountReceivableAccountantDto = relationChangedArr.map((state) => {
        const { invoice, accountantArr } = state;

        return {
          invoiceId: String(invoice.id),
          accountantId: accountantArr.map((accountant) => String(accountant.id)),
        };
      });

      await apiPatchAccountReceivableAccountant(accountReceivable.id, body);
    }

    for (const accountant of accountantArr) {
      const {
        //
        // id,
        // invoiceId,
        order,
        accountsReceivableDeduction,
        // isRelationedInvoiceChanged,
      } = accountant;

      // 棄用，以上面的apiPatchAccountReceivableAccountant取代;
      // 修改accountant的關聯invoice;
      // if (accountReceivable && isRelationedInvoiceChanged) {
      //   await apiPatchAccountantInvoice({
      //     accountReceivableId: accountReceivable.id,
      //     invoiceId,
      //     accountantId: id,
      //   });
      // }

      // 修改排序;
      await apiPatchAccountant_accountReceivable(accountant.id, {
        order: order,
        // 雖然只是要改order，但是不送accountsReceivableDeduction的話
        // 原本的accountsReceivableDeduction會被清空
        // 所以要送跟原本一樣的accountsReceivableDeduction過去
        accountsReceivableDeduction: accountsReceivableDeduction ?? [],
      });
    }

    update_contract();
  };

  // MARK: DeleteInvoice
  const reqDeleteInvoice = async (invoiceId: string) => {
    try {
      setIsFetching_req(true);
      await apiDeleteAccountReceivableInvoice(invoiceId);
      await update_contract();
    } catch (error) {
    } finally {
      setIsFetching_req(false);
    }
  };

  const reqDeletePeriod = async (periodId: string) => {
    try {
      setIsFetching_req(true);
      await apiDeleteAccountReceivablePeriod(periodId);
      await update_contract();
    } catch (error) {
    } finally {
      setIsFetching_req(false);
    }
  };

  // --------------------------------------------------------------------------

  // region PROPS

  const props_profile: Tprops_profile = {
    valueList: createValueList_profile_engineeringContact({ engineeringContact }),
  };

  isFetching = isFetching_contract || isFetching_finalProduct || isFetching_req;

  const panelList_01: TpanelList = [
    { type: 'myButton', label: '建立應收帳款明細', onClick: () => reqPostAccountReceivable() },
  ];

  const panelList = panelList_01;

  // --------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update_contract();
    update_finalProduct();
  }, [contractId]);

  // --------------------------------------------------------------------------

  const contextValue = useMemo(() => {
    return {
      customer: contract?.content.customer,
    };
  }, [contract?.content.customer]);

  // --------------------------------------------------------------------------
  // region RENDER

  if (!contract) {
    <SubLayer>{null}</SubLayer>;
  }

  if (!accountReceivable) {
    return (
      <SubLayer isLoading_all={isFetching}>
        <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />
        <EmptyMain />
      </SubLayer>
    );
  }

  return (
    <SubLayer isLoading_all={isFetching}>
      <PageHeader panelList={[]} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div className={scss.main}>
        <Profile {...props_profile} />

        <TotalCalc
          className="mt-10"
          accountReceivable={accountReceivable}
          reqPatchAccountReceivable={reqPatchAccountReceivable}
        />

        <AccountantSorting
          //
          className="mt-10"
          periodArr={periodArr}
          accountantArr_noInvoice={accountantArr_noInvoice}
          onConfirm={reqPatchAccountant_sorting}
        />

        <AccountantDetails className="mt-10 " accountantArr={accountantArr} reqPatchAccountant={reqPatchAccountant} />

        <DeductionDetail className="mt-10 " periodArr={periodArr} />

        <AccountReceivableContext.Provider value={contextValue}>
          <PeriodTable
            className="mt-10 "
            data_finalProdcut={data_finalProdcut}
            data_period={accountReceivable.periods}
            onAddConfirm={reqAddInvoice}
            reqPatchInvoiceAllowance={reqPatchInvoiceAllowance}
            reqDeleteInvoice={reqDeleteInvoice}
            reqDeletePeriod={reqDeletePeriod}
          />
        </AccountReceivableContext.Provider>
      </div>
    </SubLayer>
  );
}

// region END

// ========================================================================
// ========================================================================
// ========================================================================

// region COMPONENT

const EmptyMain = () => {
  return (
    <div className={scss.main}>
      <p className="text-3xl text-center">請先建立應收帳款明細</p>
      <p className="text-2xl text-center">按鈕在右上方</p>
    </div>
  );
};

// ========================================================================
