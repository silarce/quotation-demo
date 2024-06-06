// 設計圖
// https://www.figma.com/design/9Gix0Odt4g7ahSOQMysmVh/%E4%B8%89%E4%B9%85?node-id=1282-40444&t=bXAfdnwklJLF2pZu-0

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
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
import InvoiceTable, {
  Tstate_invoice,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/invoiceTable';
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
import InputSel, { TinputSelProps, TcheckboxProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import PaymentRecordSelector from 'components/global/gear/modal/paymentRecordSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TwoButtonModal_free, { TwoBtnFooter } from 'components/global/gear/modal/simpleModal/twoButtonModal_free';
import InvoiceSelector from 'components/global/gear/modal/invoiceSelector';

// api
import {
  Tparams,
  TupdateEngineeringContactDto,
  TupdateAccountReceivableDto,
  TaccountReceivableDto,
  TcreateAccountReceivableInvoiceDto,
  TcreateAccountReceivableDto,
  TupdateAccountReceivableInvoiceDto,
  TaccountsReceivableInvoiceDto,
  //
  useGetEngineeringContact,
  useGetAccountReceivableAccountants,
  useGetAccountReceivableIncoices,
  useGetAccountReceivable_id,
  // useGetFinalProduct, // 不是這個
  //
  apiPatchAccountReceivable,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
  apiPatchAccountReceivableInvoice,
  apiPatchAccountReceivableAccountant,
  apiPatchAccountReceivableVoidInvoice,
  apiPostAccountReceivable,
  apiPostAccountReceivableAccountant,
  apiDeleteAccountReceivableAccountant,
  apiPostAccountReceivableIncoice, // 新增應收帳款發票
} from 'js/api/api_engineering';
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';

import {
  TaccountantDto,
  TupdateAccountantDto,
  TupdateAccountantDeductionDto,

  //
  //  apiPatchAccountant,
  apiPatchAccountant_accountReceivable,
} from 'js/api/api_accountant';

import type { TupdateAccountReceivableDeductionDto } from 'js/api/dtoTypes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './index.module.scss';
import { AxiosError } from 'axios';

// ========================================================================

export default function AccountReceivable() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isFetching_req, setIsFetching_req] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);

  let isFetching = false;

  // --------------------------------------------------------------------------

  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [showPeriodModal, setShowPeriodModal] = useState<boolean>(false);

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
      'accountReceivable.invoices.accountantList.accountsReceivableDeduction',
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

  const invoiceArr = useMemo(() => {
    return _.sortBy(accountReceivable?.invoices, 'createdAt');
  }, [accountReceivable?.invoices]);

  const accountantArr = useMemo(() => {
    if (!invoiceArr) {
      return [];
    }

    const arr: TaccountantDto[] = [];
    invoiceArr.forEach((invoice) => {
      invoice.accountantList && arr.push(...invoice.accountantList);
    });

    return arr;
  }, [invoiceArr]);

  // --------------------------------------------------------------------------

  // region REQUEST

  const reqAddInvoice = async (type: TcreateAccountReceivableInvoiceDto['type'], invoiceNumber: string) => {
    if (!accountReceivable?.id) {
      alert('沒有accountReceivable.id');

      return;
    }

    if (!invoiceNumber) {
      myAlert.info({ title: '請輸入發票號碼' });

      return;
    }

    const body: TcreateAccountReceivableInvoiceDto = {
      invoiceDate: new Date().toISOString(),
      invoiceNumber: invoiceNumber,
      price: 0,
      note: '',
      type,
      isRetainage: false,
      isDeduction: false,
      isWriteOffDeposit: false,
    };

    try {
      setIsFetching_req(true);
      await apiPostAccountReceivableIncoice(accountReceivable.id, body);
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

  const reqPatchInvoiceArr = async (state_invoiceArr: Tstate_invoice[]) => {
    let haveEmptyId = false;

    const bodyArr: {
      id: string | undefined;
      body: TupdateAccountReceivableInvoiceDto;
    }[] = state_invoiceArr.map((state) => {
      const {
        id,
        rowArr,
        retainage,
        deduction,
        writeOffDeposit,
        minusRetainage,
        minusDeduction,
        minusWriteOffDeposit,
        price,
        invoiceNumber,
      } = state;

      !id && (haveEmptyId = true);

      const completedProduct = rowArr.map((row) => {
        return {
          productId: row.productId,
          completedQuantity: Number(row.completedQuantity),
          completedPayment: Number(row.completedPayment),
        };
      });

      const body: TupdateAccountReceivableInvoiceDto = {
        completedProduct: completedProduct,
        retainage: Number(retainage),
        deduction: Number(deduction),
        writeOffDeposit: Number(writeOffDeposit),
        isRetainage: minusRetainage,
        isDeduction: minusDeduction,
        isWriteOffDeposit: minusWriteOffDeposit,
        price,
        invoiceNumber,
        //
        // invoiceDate: new Date().toISOString(),
        // note: '',
        //
        // accountants: [],
      };

      return {
        id,
        body,
      };
    }); // state_invoiceArr.map

    if (haveEmptyId) {
      alert('有空的id');

      return;
    }

    try {
      setIsFetching_req(true);

      for (const body of bodyArr) {
        await apiPatchAccountReceivableInvoice(body.id!, body.body);
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err?.response?.status === 409) {
        const body = JSON.parse(err.config?.data);
        const repeatInvoiceNumber = body.invoiceNumber;
        myAlert.err({ title: '發票號碼重複', content: `重複的號碼為${repeatInvoiceNumber}` });

        return;
      }

      myAlert.err({ title: '新增發票失敗' });
    } finally {
      await update_contract();
      setIsFetching_req(false);
    }
  }; //reqPatchInvoiceArr

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

    Object.values(stateList).forEach((state) => {
      const { isAccountantOrderChanged, invoice, accountantArr: state_accountantArr } = state;

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
    });

    for (const accountant of accountantArr) {
      const { id, invoiceId, order, accountsReceivableDeduction, isRelationedInvoiceChanged: isChanged } = accountant;

      // 修改accountant的關聯invoice
      // if (accountReceivable && isChanged) {
      //   await apifoo({
      //     accountReceivableId: accountReceivable.id,
      //     invoiceId,
      //     accountantId: id,
      //   });
      // }

      await apiPatchAccountant_accountReceivable(accountant.id, {
        order: order,
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
        <PageHeader panelList={[]} contractNumber={engineeringContact?.contractNumber ?? ''} />
        <EmptyMain />
      </SubLayer>
    );
  }

  return (
    <SubLayer isLoading_all={isFetching}>
      <PageHeader panelList={[]} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div className={scss.main}>
        <Profile {...props_profile} />
        <TotalCalc className="mt-10" />

        <AccountantSorting className="mt-10" invoiceArr={invoiceArr} onConfirm={reqPatchAccountant_sorting} />

        <AccountantDetails
          //
          className="mt-10"
          accountantArr={accountantArr}
          reqPatchAccountant={reqPatchAccountant}
        />

        <DeductionDetail className="mt-10" invoiceArr={invoiceArr} />

        <InvoiceTable
          className="mt-10"
          data_finalProdcut={data_finalProdcut}
          data_invoices={accountReceivable.invoices}
          reqAddInvoice={reqAddInvoice}
          reqPatchInvoiceArr={reqPatchInvoiceArr}
        />
      </div>
    </SubLayer>
  );
}

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
