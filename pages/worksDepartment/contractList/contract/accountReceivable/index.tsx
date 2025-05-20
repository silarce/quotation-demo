import { useState, useEffect, useMemo, createContext } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// component
import Profile, {
  Tprops_profile,
  createValueList_profile_engineeringContact,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/profile';
import TotalCalc from 'components/page/worksDepartment/contracList/contract/accountReceivable/totalCalc';
import PeriodTable, {
  Tstate_period,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/invoiceTable/periodTable';
import IncomeBillDetails, {
  Tstate_incomeBill,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/incomeBillDetails';
import DeductionDetail from 'components/page/worksDepartment/contracList/contract/accountReceivable/deductionDetail';
import IncomeBillSorting, {
  Tstate_incomeBillSorting,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/incomeBillSorting';
import WarrantyDate from 'components/page/worksDepartment/contracList/contract/accountReceivable/warrantyDate';
// import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
// import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  TcreateAccountReceivablePeriodDto,
  TcreateAccountReceivableDto,
  TupdateAccountReceivableDto,
  TupdateAccountReceivableAccountantDto,
  //
  apiPatchIncomeBill,
  apiPatchAccountReceivablePeriodInvoiceAllowance,
  apiPostAccountReceivable,
  apiPatchAccountReceivable,
  apiPostAccountReceivablePeriod, // 新增應收帳款發票
  apiDeleteAccountReceivableInvoice,
  apiDeleteAccountReceivablePeriod,
  apiPatchAccountReceivableAccountant,
} from 'js/api/api_engineering';
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';

import type { TcustomerDto, TincomeBillSerialDto, TupdateAccountReceivableDeductionDto } from 'js/api/dtoTypes';
import type { TquotationProductDto, TquotationContractDto } from 'js/api/api_quotation';

// css
import scss from './index.module.scss';
import { AxiosError } from 'axios';

import { cutCurrency, Tcurrency } from 'js/utils/currency/cutCurrency';

// import PdfTemplate_accountReceivable from 'components/page/worksDepartment/contracList/contract/accountReceivable/pdfTemplate';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ========================================================================

type Tquery = {
  contractId: string | undefined;
};

type TaccountReceivableContext = {
  customer: TcustomerDto | undefined;
  haveTax: boolean;
};

type TreqPatchAccountReceivable = (body: TupdateAccountReceivableDto) => Promise<void>;

export type { TreqPatchAccountReceivable };

// ========================================================================

export const AccountReceivableContext = createContext<TaccountReceivableContext>(null!);

// ========================================================================

// region START

export default function AccountReceivable({
  //
  contractId: contractId_outside,
  readonly = false,
  showSubPageHeader = true,
}: {
  contractId?: string | undefined;
  readonly?: boolean;
  showSubPageHeader?: boolean;
}) {
  const router = useRouter();
  const { contractId = contractId_outside } = router.query as Tquery;

  const [isFetching_req, setIsFetching_req] = useState<boolean>(false);

  // --------------------------------------------------------------------------

  // region get data

  const {
    data: contract,
    update: update_contract,
    isFetching: isFetching_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      'content.customer',
      'content.others',
      'engineeringContact',

      // 'accountReceivable.periods.invoices.accountantList.accountsReceivableDeduction',
      // 現在 invoices下沒有accountantList
      // 'accountReceivable.periods.invoices.incomeBillList',
      // 'accountReceivable.periods.invoices.incomeBillSerialList',
      'accountReceivable.periods.invoices.incomeBillSerialList.invoices',
      'accountReceivable.periods.invoices.incomeBillSerialList.accountsReceivableDeduction',

      'accountReceivable.periods.invoices.accountantInvoiceBook',
      'accountReceivable.accountantList.invoices',
      // 'accountReceivable.accountantList', // 棄用
      'accountReceivable.incomeBillList.accountant',
      'accountReceivable.incomeBillList.invoices',
      'accountReceivable.incomeBillList.accountsReceivableDeduction',
      //
      'subContracts.content.products',
    ],
  });

  const { engineeringContact, accountReceivable, content } = contract ?? {};

  const currency = cutCurrency(accountReceivable?.currency ?? ('TWD 新台幣' as Tcurrency));

  const {
    data: data_finalProdcut = [],
    update: update_finalProduct,
    isLoading: isFetching_finalProduct,
  } = useGetContract_id_finalProductItem(contractId);

  const periodArr = useMemo(() => {
    return _.sortBy(accountReceivable?.periods, 'createdAt');
  }, [accountReceivable?.periods]);

  const { incomeBillList, incomeBillList_noInvoice } = useMemo(() => {
    let incomeBillList = accountReceivable?.incomeBillList ?? [];
    let incomeBillList_noInvoice = incomeBillList.filter((incomeBill) => {
      return !incomeBill.invoices || incomeBill.invoices.length === 0;
    });

    incomeBillList = _.sortBy(incomeBillList, 'billSerialNumber');
    incomeBillList_noInvoice = _.sortBy(incomeBillList_noInvoice, 'billSerialNumber');

    return {
      incomeBillList,
      incomeBillList_noInvoice,
    };
  }, [accountReceivable?.incomeBillList]);

  const haveTax = !!content?.salesTax;

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
      isOlderInvoice,

      contractArr,
    } = state_invoice;

    if (!isOlderInvoice && (accountantInvoiceBook || actualPrice)) {
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
      // w 注意 invoiceDate的時分秒務必設為00:00:00
      // w 後端會檢查invoiceDate是否比該發票本的latestInvoiceDate更晚
      // w 更晚的話會404，所以統一設為00:00:00
      // 已在源頭onChange設為00:00:00
      invoiceDate: invoiceDate ? invoiceDate.toISOString() : null,
      invoiceNumber: invoiceNumber || null,
      actualPrice: actualPrice ? Number(actualPrice) : null,
      accountantInvoiceBookId: accountantInvoiceBook?.id || null,

      nameOfBusinessEntity: nameOfBusinessEntity || null,
      businessIdNumber: businessIdNumber || null,
      isOriginalCustomer,
      retainagePercent: retainagePercent || null,
      isOlderInvoice,

      // 在選擇器已經剔除accountReceivableId為null的合約

      otherAccountReceivableIds: contractArr.map((item) => item.accountReceivableId!),
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
  const reqPatchIncomeBill_feeAndDeduction = async (state_incomeBillArr: Tstate_incomeBill[]) => {
    for (const state_incomeBill of state_incomeBillArr) {
      const state_deduction = state_incomeBill.state_deduction;

      const accountsReceivableDeduction = state_deduction.map((item) => {
        return {
          ...item,
          detailedAmount: Number(item.detailedAmount),
        };
      });

      await apiPatchIncomeBill(state_incomeBill.id, {
        ...state_incomeBill.raw,
        fee: Number(state_incomeBill.theFee),
        incomeBillDeduction: accountsReceivableDeduction,
      });
    }

    update_contract();
  };

  // MARK: PatchAccountant_sorting
  const reqPatchAccountant_sorting = async (
    //
    stateList: Tstate_incomeBillSorting
  ) => {
    if (!accountReceivable) {
      return;
    }

    const incomeBillArr: {
      id: string;
      invoiceId: string;
      order: number;
      accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];
      isRelationedInvoiceChanged: boolean;
      raw: TincomeBillSerialDto;
    }[] = [];

    const relationChangedList: Tstate_incomeBillSorting = {};

    for (const key of Object.keys(stateList)) {
      const state = stateList[key];

      const {
        isIncomeBillOrderChanged,
        isInvoiceAllowanceChanged,
        isInvoiceIncomeBillRelationChanged,
        invoice,
        incomeBillArr: state_incomeBillArr,
      } = state;

      if (isInvoiceIncomeBillRelationChanged) {
        relationChangedList[key] = state;
      }

      if (isInvoiceAllowanceChanged) {
        await apiPatchAccountReceivablePeriodInvoiceAllowance(String(invoice.id), {
          allowance: Number(invoice.allowance),
        });
      }

      if (isIncomeBillOrderChanged) {
        state_incomeBillArr.forEach((incomeBill, index) => {
          const {
            //
            id: incomeBillId,
            accountsReceivableDeduction,
            isRelationedInvoiceChanged,
            raw,
          } = incomeBill;

          incomeBillArr.push({
            id: String(incomeBillId),
            invoiceId: String(invoice.id),
            order: index + 1,
            accountsReceivableDeduction: accountsReceivableDeduction,
            isRelationedInvoiceChanged: isRelationedInvoiceChanged,
            raw,
          });
        });
      }
    }

    const relationChangedArr = Object.values(relationChangedList);

    if (relationChangedArr.length > 0) {
      const body: TupdateAccountReceivableAccountantDto = relationChangedArr.map((state) => {
        const { invoice, incomeBillArr: incomeBillArr } = state;

        return {
          invoiceId: String(invoice.id),
          // accountantId: incomeBillArr.map((accountant) => String(accountant.id)),
          incomeBillId: incomeBillArr.map((accountant) => String(accountant.id)),
        };
      });

      await apiPatchAccountReceivableAccountant(accountReceivable.id, body);
    }

    for (const incomeBill of incomeBillArr) {
      const {
        //
        id: incomeBillId,
        // invoiceId,
        order,
        accountsReceivableDeduction,
        raw,
        // isRelationedInvoiceChanged,
      } = incomeBill;

      // 修改排序;
      await apiPatchIncomeBill(incomeBillId, {
        ...raw,
        order: order,
        // 雖然只是要改order，但是不送accountsReceivableDeduction的話
        // 原本的accountsReceivableDeduction會被清空
        // 所以要送跟原本一樣的accountsReceivableDeduction過去
        // 2024-08-08 api換了，incomeBillDeduction為必須要送
        incomeBillDeduction: accountsReceivableDeduction ?? [],
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

  const returnPanel = usePanel_returnWorksDepartmentContractList();

  const props_profile: Tprops_profile = {
    valueList: createValueList_profile_engineeringContact({ engineeringContact }),
  };

  const panelList_01: TpanelList = [
    { type: 'myButton', label: '建立應收帳款明細', onClick: () => reqPostAccountReceivable() },
    ...returnPanel,
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
      haveTax,
    };
  }, [contract?.content.customer, haveTax]);

  // --------------------------------------------------------------------------
  // region RENDER

  if (!contract) {
    <SubLayer>{null}</SubLayer>;
  }

  if (!accountReceivable) {
    return (
      <SubLayer isLoading_all={isFetching_contract || isFetching_finalProduct || isFetching_req}>
        <div>
          <PageHeader02 panelList={panelList} tag={`合約編號 ${engineeringContact?.contractNumber ?? ''}`} />
          <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
        </div>

        <EmptyMain />
      </SubLayer>
    );
  }

  return (
    <SubLayer isLoading_all={isFetching_contract || isFetching_finalProduct || isFetching_req}>
      <div>
        <PageHeader02 tag={`合約編號 ${engineeringContact?.contractNumber ?? ''}`} panelList={returnPanel} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div className={scss.main}>
        <Profile {...props_profile} />

        <br />
        <WarrantyDate accountReceivable={accountReceivable} reqPatchAccountReceivable={reqPatchAccountReceivable} />
        {/* <div className="w-[250px]">
          <InputSel caption="保固日期" datePickerProps={{}} />
        </div> */}
        <br />

        {/* 總計算 */}
        <TotalCalc
          className="mt-10"
          accountReceivable={accountReceivable}
          reqPatchAccountReceivable={reqPatchAccountReceivable}
          readonly={readonly}
          currency={currency}
        />

        {/* 應收帳款管理 */}
        <IncomeBillSorting
          className="mt-10"
          periodArr={periodArr}
          incomeBillList_noInvoice={incomeBillList_noInvoice}
          onConfirm={reqPatchAccountant_sorting}
          readonly={readonly}
          currency={currency}
        />

        {/* 已收款紀錄 */}
        <IncomeBillDetails
          className="mt-10 "
          incomeBillList={incomeBillList}
          reqPatchIncomeBill_feeAndDeduction={reqPatchIncomeBill_feeAndDeduction}
          readonly={readonly}
          totalOtherFee={accountReceivable.totalOtherFee}
          isForeign={accountReceivable.currency !== 'TWD 新臺幣'}
          accountReceivableCurrency={accountReceivable.currency}
        />

        {/* 扣款明細 */}
        <DeductionDetail className="mt-10 " periodArr={periodArr} currency={currency} />

        {/* 請款明細 */}
        <AccountReceivableContext.Provider value={contextValue}>
          <PeriodTable
            className="mt-10 "
            data_finalProdcut={data_finalProdcut}
            data_period={accountReceivable.periods}
            data_otherArr={content?.others}
            onAddConfirm={reqAddInvoice}
            reqPatchInvoiceAllowance={reqPatchInvoiceAllowance}
            reqDeleteInvoice={reqDeleteInvoice}
            reqDeletePeriod={reqDeletePeriod}
            readonly={readonly}
            // currency={currency}
            currency={'TWD'}
            contractId={contractId}
          />
        </AccountReceivableContext.Provider>
        <br />
        <br />
        <br />

        {/* <PdfTemplate_accountReceivable visible={true} /> */}
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
