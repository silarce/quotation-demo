// 設計圖
// https://www.figma.com/design/9Gix0Odt4g7ahSOQMysmVh/%E4%B8%89%E4%B9%85?node-id=1282-40444&t=bXAfdnwklJLF2pZu-0

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Profile, {
  Tprops_profile,
  createValueList_profile_engineeringContact,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/profile';
import TotalCalc from 'components/page/worksDepartment/contracList/contract/accountReceivable/totalCalc';
import InvoiceTable from 'components/page/worksDepartment/contracList/contract/accountReceivable/invoiceTable';

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
import { TaccountantDto } from 'js/api/api_accountant';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './index.module.scss';

// ========================================================================

export default function AccountReceivable() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isFetching_req, setIsFetching_req] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);

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
      'accountReceivable.invoices',
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

  const isFetching = isFetching_contract || isFetching_finalProduct;

  // --------------------------------------------------------------------------

  // region REQUEST

  const reqAddInvoice = async (type: TcreateAccountReceivableInvoiceDto['type']) => {
    if (!accountReceivable?.id) {
      alert('沒有accountReceivable.id');

      return;
    }

    const body: TcreateAccountReceivableInvoiceDto = {
      invoiceDate: new Date().toISOString(),
      invoiceNumber: '',
      price: 0,
      note: '',
      type,
      isRetainage: false,
      isDeduction: false,
      isWriteOffDeposit: false,
    };

    await apiPostAccountReceivableIncoice(accountReceivable.id, body);
    await update_contract();
  };

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // region PROPS

  const props_profile: Tprops_profile = {
    valueList: createValueList_profile_engineeringContact({ engineeringContact }),
  };

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
        <InvoiceTable
          className="mt-10"
          data_finalProdcut={data_finalProdcut}
          data_invoices={accountReceivable.invoices}
          reqAddInvoice_請款={() => reqAddInvoice('請款')}
          reqAddInvoice_訂金={() => reqAddInvoice('訂金')}
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

const createdHeadRowList_收款紀錄 = (props?: {
  onDateClick?: () => void;
  onChequeDateClick?: () => void;
  onPriceClick?: () => void;
}) => ({
  date: {
    label: '日期',
    cellStyle: { width: '120px' },
    onClick: props?.onDateClick,
  },
  account: {
    label: '帳號',
    cellStyle: { width: '189px' },
  },
  chequeNumber: {
    label: '票據號碼',
    cellStyle: { width: '189px' },
  },
  chequeDate: {
    label: '票據日期',
    cellStyle: { width: '100px' },
    onClick: props?.onChequeDateClick,
  },
  price: {
    label: '金額',
    cellStyle: { width: '170px' },
    onClick: props?.onPriceClick,
  },
  incomingSubpoenaSerialNumber: {
    label: '收入傳票序號',
    cellStyle: { width: '187px' },
  },
});

const createHeadRowList_發票給予紀錄 = (props?: {
  onDateClick: () => void;
  onPriceClick: () => void;
  onPeriodClick: () => void;
}) => ({
  date: {
    label: '日期',
    cellStyle: { width: '120px' },
    onClick: props?.onDateClick,
  },
  invoiceNumber: {
    label: '發票號碼',
    cellStyle: { width: '300px' },
  },
  price: {
    label: '金額',
    cellStyle: { width: '290px' },
    onClick: props?.onPriceClick,
  },
  remark: {
    label: '備註',
    cellStyle: { width: '300px' },
  },
  period: {
    label: '對應期數',
    cellStyle: { width: '75px' },
    onClick: props?.onPeriodClick,
  },
});
