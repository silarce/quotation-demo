import { useState, useMemo } from 'react';

import classNames from 'classnames';

import Btn, { Btn_UpDown } from 'components/global/gear/button/btn_fong';

import { DataEntry_fong, Input, Select, DatePicker, Input_money } from 'components/global/gear/dataEntry';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import { selector_customer } from 'components/composition/selectorModal/selector_customer';
import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';
import Selector_invoice from 'components/composition/selectorModal/selector_invoice';

import { Tinstance_paymentRequest } from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/usePaymentRequest';

import { useApiGetPaymentRequestType } from 'js/api/api_netCore/api_accountsReceivable';
import { useApiGetDropDown } from 'js/api/api_netCore/api_commonControllers';

import IconQuery from 'public/image/icon/fong/query.svg';
import IconCancel from 'public/image/icon/fong/cancel.svg';

// =========================================================================

// MARK:START

const CurrentPaymentRequestDetails = ({
  className,
  // disabled,
  instance_paymentRequest,
  children,
  onConfirm,
}: {
  className?: string;
  // disabled?: boolean;
  instance_paymentRequest: Tinstance_paymentRequest;
  children?: React.ReactNode;
  onConfirm?: () => void;
}) => {
  const { data: data_paymentRequestType } = useApiGetPaymentRequestType();
  const { options: options_retainageTaxCategory } = useApiGetDropDown('RetainageTaxCategory');

  const {
    state_paymentRequest,
    allowedInvoiceDate,
    invoiceDesc,
    isAllowEditInvoice,
    isAllowEdit,

    setState_paymentRequest,
    setPaymentAmount,
    setInvoiceBood,
  } = instance_paymentRequest;

  const invoiceBook = state_paymentRequest.invoiceBookInfo;

  const [isActive_detail, setState_isActive_deta] = useState<boolean>(true);

  // -----------------------------------------------------------------------------

  const handle_selectInvoiceBook = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onConfirm={async (invoiceBook) => {
            if (invoiceBook) {
              const year = invoiceBook.year as `${number}`;
              const month = invoiceBook.month as `${number}`;

              setInvoiceBood({ ...invoiceBook, year, month });

              destroy();
            }
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
    });
  };

  const handle_selectInvoice = () => {
    const invoiceBookId = state_paymentRequest.invoiceBookInfo?.id;

    if (!invoiceBookId) {
      return;
    }

    const { destroy } = modal_empty({
      content: (
        <Selector_invoice
          invoiceBookId={invoiceBookId}
          onCancel={() => {
            destroy();
          }}
          onConfirm={(invoice) => {
            if (invoice) {
              setState_paymentRequest((prev) => ({
                ...prev,
                // 發票日期: invoice.invoiceDate ? Dayjs(invoice.invoiceDate) : null,
                invoiceNumber: invoice.fullInvoiceNumber,
                // invoiceAmount: invoice.invoiceAmount,
              }));
            }

            destroy();
          }}
        />
      ),
    });
  };

  const handle_selectCustomer = () => {
    const { destroy } = selector_customer({
      onConfirm(customerArr) {
        const func = () => {
          const customer = customerArr[0];

          if (!customer) {
            return;
          }

          setState_paymentRequest((prev) => ({
            ...prev,
            customerName: customer.name,
            customerNumber: customer.customerNumber,
            customerTaxId: customer.taxId,
          }));
        };

        func();
        destroy();
      },
    });
  };

  // --------------------------------------------------------------------------

  const options_paymentType = useMemo(() => {
    return (
      data_paymentRequestType?.map((item) => ({
        value: item.name,
        label: item.name,
      })) ?? []
    );
  }, [data_paymentRequestType]);

  // --------------------------------------------------------------------------
  // MARK:RENDER
  return (
    <div className={className}>
      <div className="flex gap-3 items-center mb-10">
        <div className="text-xl font-semibold ">本次請款明細</div>
        <Btn_UpDown isActive={isActive_detail} onClick={() => setState_isActive_deta((prev) => !prev)}>
          展開
        </Btn_UpDown>
      </div>

      {isActive_detail && (
        <div className="p-6 border border-gray05 rounded-lg shadow-[0px_4px_4px_0px_#00000040]">
          <div className={classNames('grid grid-cols-4 gap-fong ')}>
            <DataEntry_fong caption="類型" isMust={true} disabled={!isAllowEdit}>
              <Select
                options={options_paymentType}
                value={state_paymentRequest.type}
                onChange={(value) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    type: value,
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="請款金額"
              disabled={true}
              childrenWrapperProps={{
                className: 'flex gap-1',
              }}
            >
              {/* <Input_money
                value={state_paymentRequest.請款金額}
                onChange={(e) => {
                  setPaymentAmount(e.target.value as `${number}` | '');
                }}
              /> */}
              <span>幣別</span>
              {toMoneyString(state_paymentRequest.請款金額)}
            </DataEntry_fong>

            <DataEntry_fong caption="營業稅(5%)" disabled={true}>
              {toMoneyString(state_paymentRequest.營業稅)}
            </DataEntry_fong>

            <DataEntry_fong caption="本期合計請款金額" disabled={true}>
              {toMoneyString(state_paymentRequest.paymentAmount)}
            </DataEntry_fong>

            <DataEntry_fong caption="保留款(%)" isMust={true} disabled={!isAllowEdit}>
              <Input
                type="number"
                value={state_paymentRequest.retainageRate}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    retainageRate: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="稅別" isMust={true} disabled={!isAllowEdit}>
              <Select
                options={options_retainageTaxCategory}
                value={state_paymentRequest.retainageTaxCategory}
                onChange={(value) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    retainageTaxCategory: value,
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款金額" isMust={true} disabled={!isAllowEdit}>
              <Input_money
                value={state_paymentRequest.retainageAmount}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    retainageAmount: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <div />

            <DataEntry_fong
              caption="發票本"
              disabled={!isAllowEditInvoice}
              childrenWrapperProps={{
                className: 'flex gap-4',
              }}
            >
              {invoiceDesc ? (
                invoiceDesc
              ) : (
                <>
                  <span
                    onClick={!isAllowEditInvoice ? undefined : handle_selectInvoiceBook}
                    className={classNames('w-full', !isAllowEditInvoice ? '' : 'cursor-pointer')}
                  >
                    {state_paymentRequest.invoiceBookInfo
                      ? state_paymentRequest.invoiceBookInfo?.alphabeticLetter +
                        ' ' +
                        `${state_paymentRequest.invoiceBookInfo?.period}期`
                      : '- -'}
                  </span>
                  <IconCancel
                    className={classNames('cursor-pointer', !isAllowEditInvoice ? 'invisible' : 'visible')}
                    onClick={() => setInvoiceBood(null)}
                  />
                </>
              )}
            </DataEntry_fong>

            <DataEntry_fong
              caption="發票日期"
              isMust={!!invoiceBook}
              disabled={!state_paymentRequest.invoiceBookInfo || !isAllowEditInvoice}
            >
              <DatePicker
                placeholder={!state_paymentRequest.invoiceBookInfo ? '請先選擇發票本' : undefined}
                value={state_paymentRequest.invoiceDate}
                onChange={(date) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    invoiceDate: date,
                  }));
                }}
                minDate={allowedInvoiceDate?.startDate}
                maxDate={allowedInvoiceDate?.endDate}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="發票號碼"
              isMust={!!invoiceBook}
              disabled={!state_paymentRequest.invoiceBookInfo || !isAllowEditInvoice}
              childrenWrapperProps={{
                onClick: !state_paymentRequest.invoiceBookInfo ? undefined : handle_selectInvoice,
                className: !isAllowEditInvoice ? '' : 'cursor-pointer',
              }}
            >
              {state_paymentRequest.invoiceBookInfo ? state_paymentRequest.invoiceNumber : '請先選擇發票本'}
            </DataEntry_fong>
            <DataEntry_fong caption="發票金額" isMust={!!invoiceBook} disabled={!isAllowEditInvoice}>
              <Input_money
                placeholder={!state_paymentRequest.invoiceBookInfo ? '請先選擇發票本' : undefined}
                value={state_paymentRequest.invoiceAmount}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    invoiceAmount: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="買受人"
              isMust={true}
              disabled={!isAllowEditInvoice}
              childrenWrapperProps={{
                className: 'flex gap-4',
              }}
            >
              <Input
                value={state_paymentRequest.customerName ?? ''}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }));
                }}
              />

              {/* <IconQuery
                onClick={handle_selectCustomer}
                className={classNames('cursor-pointer', disabled && 'invisible')}
              /> */}
            </DataEntry_fong>

            <DataEntry_fong caption="統一編號" disabled={!isAllowEditInvoice} isMust={true}>
              <Input
                value={state_paymentRequest.customerTaxId ?? ''}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    customerTaxId: e.target.value,
                  }));
                }}
              />
            </DataEntry_fong>
          </div>
          <div className="w-fit m-auto mt-10 mr-0 ml-auto">
            <Btn theme="save" onClick={onConfirm}>
              儲存
            </Btn>
          </div>

          {children}
        </div>
      )}
    </div>
  );
};

// MARK:END

// ===============================================================================

const toMoneyString = (value: number | null | `${number}` | '') => {
  if (value === null || value === '') {
    return '';
  }

  return '$' + Number(value).toLocaleString();
};

export default CurrentPaymentRequestDetails;
