// 設計圖
// https://www.figma.com/design/9Gix0Odt4g7ahSOQMysmVh/%E4%B8%89%E4%B9%85?node-id=1282-40444&t=bXAfdnwklJLF2pZu-0

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

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

// import Table_requestPayment, {
//   Tcontrol_table_requestPayment,
// } from 'components/page/worksDepartment/contracList/contract/accountReceivable/table_requestPayment';
// import AccountReceivable_dynaTable, {
//   Tcontrol_dynaTable,
//   Trow,
// } from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountReceivable_dynaTable';
// import DeductionDetails from 'components/page/worksDepartment/contracList/contract/accountReceivable/deductionDetails';
// import Table_request from 'components/page/worksDepartment/contracList/contract/accountReceivable/table_request';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  // Tparams,
  // TupdateEngineeringContactDto,
  // TupdateAccountReceivableDto,
  // TaccountReceivableDto,
  TcreateAccountReceivablePeriodDto,
  TcreateAccountReceivableDto,
  TupdateAccountReceivablePeriodDto,
  // TaccountsReceivableInvoiceDto,
  //
  // useGetEngineeringContact,
  // useGetAccountReceivableAccountants,
  // useGetAccountReceivableIncoices,
  // useGetAccountReceivable_id,
  // useGetFinalProduct, // 不是這個
  //
  // apiPatchAccountReceivable,
  // apiPatchEngineeringContact,
  // apiPostWorkSheet,
  apiPatchAccountReceivablePeriodInvoiceAllowance,
  // apiPatchAccountReceivableAccountant,
  // apiPatchAccountReceivableVoidInvoice,
  apiPostAccountReceivable,
  // apiPostAccountReceivableAccountant,
  // apiDeleteAccountReceivableAccountant,
  apiPostAccountReceivablePeriod, // 新增應收帳款發票
  apiPatchAccountantInvoice,
  // apiPatchAccountReceivableDeduction_accountant, // 批量更新 應收帳款 扣款明細
} from 'js/api/api_engineering';
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';

import {
  TaccountantDto,
  // TupdateAccountantDto,
  // TupdateAccountantDeductionDto,

  //
  //  apiPatchAccountant,
  apiPatchAccountant_accountReceivable,
} from 'js/api/api_accountant';

import type { TupdateAccountReceivableDeductionDto } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';
import { AxiosError } from 'axios';

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
      // 'subContracts.content.verifyForm'
      'engineeringContact',
      'accountReceivable.periods.invoices.accountantList.accountsReceivableDeduction',
      // 'accountReceivable.periods',
    ],
  });

  const { engineeringContact, accountReceivable } = contract ?? {};

  // const {
  //   data: data_finalProdcut,
  //   update: update_finalProduct,
  //   isFetching: isFetching_finalProduct,
  // } = useGetFinalProduct(contractId); // 不是這個，這是舊的

  const {
    data: data_finalProdcut = [],
    update: update_finalProduct,
    isLoading: isFetching_finalProduct,
  } = useGetContract_id_finalProductItem(contractId);

  const periodArr = useMemo(() => {
    return _.sortBy(accountReceivable?.periods, 'createdAt');
  }, [accountReceivable?.periods]);

  const accountantArr = useMemo(() => {
    if (!periodArr) {
      return [];
    }

    const arr: TaccountantDto[] = [];
    periodArr.forEach((period) => {
      const invoiceArr = period.invoices;
      invoiceArr.forEach((invoice) => {
        invoice.accountantList && arr.push(...invoice.accountantList);
      });
    });

    return arr;
  }, [periodArr]);

  // --------------------------------------------------------------------------

  // region REQUEST
  //
  //
  //
  //

  const reaPostAccountReceivable = async () => {
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
      // accountantId: [],
      // accountReceivableDeduction: [],
      // invoices: [],
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

  // region reqAddInvoice
  // const reqAddInvoice = async (type: TcreateAccountReceivableInvoiceDto['type'], invoiceNumber: string) => {
  //   if (!accountReceivable?.id) {
  //     alert('沒有accountReceivable.id');

  //     return;
  //   }

  //   if (!invoiceNumber) {
  //     myAlert.info({ title: '請輸入發票號碼' });

  //     return;
  //   }

  //   const body: TcreateAccountReceivableInvoiceDto = {
  //     invoiceDate: new Date().toISOString(),
  //     invoiceNumber: invoiceNumber,
  //     price: 0,
  //     note: '',
  //     type,
  //     isRetainage: false,
  //     isDeduction: false,
  //     isWriteOffDeposit: false,
  //   };

  //   try {
  //     setIsFetching_req(true);
  //     await apiPostAccountReceivableIncoice(accountReceivable.id, body);
  //     await update_contract();
  //   } catch (error) {
  //     const err = error as AxiosError;

  //     if (err?.response?.status === 409) {
  //       myAlert.err({ title: '發票號碼重複' });

  //       return;
  //     }

  //     myAlert.err({ title: '新增發票失敗' });
  //   } finally {
  //     setIsFetching_req(false);
  //   }
  // };

  // region reqAddInvoice_whole
  const reqAddInvoice_whole = async (state_invoice: Tstate_period) => {
    if (!accountReceivable?.id) {
      alert('沒有accountReceivable.id');

      return;
    }

    if (!state_invoice.invoiceNumber) {
      myAlert.info({ title: '請輸入發票號碼' });

      return;
    }

    const {
      // renderCount,
      type,
      // period,
      rowArr,

      // subTotal, // 虛的，後端沒有
      // tax, // 虛的，後端沒有
      // contractTotal, // 虛的，後端沒有

      retainage,
      deduction,
      writeOffDeposit,

      minusRetainage,
      minusDeduction,
      minusWriteOffDeposit,

      // allowEditDeduction,

      price,
      invoiceNumber,

      retainageType,
      allowance,
      note,

      actualPrice,
    } = state_invoice;

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
      //
      invoiceDate: moment().toISOString(),
      invoiceNumber: invoiceNumber,
      price,
      actualPrice: Number(actualPrice),
    };

    try {
      setIsFetching_req(true);
      await apiPostAccountReceivablePeriod(accountReceivable.id, body);
      await update_contract();
    } catch (error) {
      const err = error as AxiosError;

      if (err?.response?.status === 409) {
        myAlert.err({ title: '發票號碼重複' });

        return;
      }

      myAlert.err({ title: '新增發票失敗' });
    } finally {
      setIsFetching_req(false);
    }
  };

  // region  reqPatchInvoiceAllowance
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

  // region reqPatchAccountant
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

  // region reqPatchAccountant_sorting
  const reqPatchAccountant_sorting = async (
    //
    stateList: Tstate_accountantSorting
  ) => {
    const accountantArr: {
      id: string;
      invoiceId: string;
      order: number;
      accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];
      isRelationedInvoiceChanged: boolean;
    }[] = [];

    for (const state of Object.values(stateList)) {
      const {
        isAccountantOrderChanged,
        isInvoiceAllowanceChanged,
        invoice,
        accountantArr: state_accountantArr,
      } = state;

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

    for (const accountant of accountantArr) {
      const {
        //
        id,
        invoiceId,
        order,
        accountsReceivableDeduction,
        isRelationedInvoiceChanged,
      } = accountant;

      // 修改accountant的關聯invoice;
      if (accountReceivable && isRelationedInvoiceChanged) {
        await apiPatchAccountantInvoice({
          accountReceivableId: accountReceivable.id,
          invoiceId,
          accountantId: id,
        });
      }

      //修改排序
      await apiPatchAccountant_accountReceivable(accountant.id, {
        order: order,
        // 雖然只是要改order，但是不送accountsReceivableDeduction的話
        // 原本的accountsReceivableDeduction會被清空
        // 所以要送跟原本一樣的accountsReceivableDeduction過去
        accountsReceivableDeduction: accountsReceivableDeduction,
      });
    }

    update_contract();
  };

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // region PROPS

  const props_profile: Tprops_profile = {
    valueList: createValueList_profile_engineeringContact({ engineeringContact }),
  };

  isFetching = isFetching_contract || isFetching_finalProduct || isFetching_req;

  const panelList_01: TpanelList = [
    { type: 'myButton', label: '建立應收帳款明細', onClick: () => reaPostAccountReceivable() },
  ];

  const panelList = panelList_01;

  // --------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update_contract();
    update_finalProduct();
  }, [contractId]);

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
        <TotalCalc className="mt-10" accountReceivable={accountReceivable} />

        <AccountantSorting
          //
          className="mt-10"
          periodArr={periodArr}
          onConfirm={reqPatchAccountant_sorting}
        />

        <AccountantDetails
          //
          className="mt-10"
          accountantArr={accountantArr}
          reqPatchAccountant={reqPatchAccountant}
        />

        <DeductionDetail className="mt-10" periodArr={periodArr} />

        <PeriodTable
          className="mt-10"
          data_finalProdcut={data_finalProdcut}
          data_period={accountReceivable.periods}
          // reqAddInvoice={reqAddInvoice}
          // reqPatchInvoiceArr={reqPatchInvoiceArr}
          onAddConfirm={reqAddInvoice_whole}
          reqPatchInvoiceAllowance={reqPatchInvoiceAllowance}
        />
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
