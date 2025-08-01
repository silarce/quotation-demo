import { useState } from 'react';

import classNames from 'classnames';

import Btn, { Btn_UpDown } from 'components/global/gear/button/btn_fong';

import { DataEntry_fong, Input, Select, DatePicker, Input_money } from 'components/global/gear/dataEntry';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import { selector_customer } from 'components/composition/selectorModal/selector_customer';
import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';
import Selector_invoice from 'components/composition/selectorModal/selector_invoice';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

import { Tinstance_paymentRequest } from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/usePaymentRequest';

// =========================================================================

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];

type TprOffsetDetails = TpaymentRequest['prOffsetDetails'][number];

// =========================================================================

// MARK:START

const CurrentPaymentRequestDetails = ({
  className,
  disabled,
  instance_paymentRequest,
  children,
}: {
  className?: string;
  disabled?: boolean;
  instance_paymentRequest: Tinstance_paymentRequest;
  children?: React.ReactNode;
}) => {
  const { state_paymentRequest, setState_paymentRequest } = instance_paymentRequest;

  const [isActive_detail, setState_isActive_deta] = useState<boolean>(true);

  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------

  const handle_selectInvoiceBook = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onConfirm={async (invoiceBook) => {
            if (invoiceBook) {
              const { id, alphabeticLetter, period } = invoiceBook;
              setState_paymentRequest((prev) => ({
                ...prev,
                發票本: {
                  id,
                  alphabeticLetter,
                  period,
                },
              }));

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
    const invoiceBookId = state_paymentRequest.發票本?.id;

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
            統一編號: customer.taxId,
          }));
        };

        func();
        destroy();
      },
    });
  };

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
            <DataEntry_fong caption="類型" isMust={true} disabled={disabled}>
              <Select value={state_paymentRequest.type} />
            </DataEntry_fong>
            <DataEntry_fong caption="請款金額" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.paymentAmount}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    paymentAmount: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="營業稅(5%) no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.營業稅}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    營業稅: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="保留款(%) no property" isMust={true} disabled={disabled}>
              <Input
                type="number"
                value={state_paymentRequest.保留款}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    保留款: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="稅別 no property" isMust={true} disabled={disabled}>
              <Select
                value={state_paymentRequest.稅別}
                onChange={(value) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    稅別: value,
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款金額 no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.保留款金額}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    保留款金額: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <div />
            <div />

            <DataEntry_fong
              caption="發票本 no property"
              isMust={true}
              disabled={disabled}
              childrenWrapperProps={{
                className: disabled ? '' : 'cursor-pointer',
                onClick: disabled ? undefined : handle_selectInvoiceBook,
              }}
            >
              {state_paymentRequest.發票本
                ? state_paymentRequest.發票本?.alphabeticLetter + ' ' + `${state_paymentRequest.發票本?.period}期`
                : '- -'}
            </DataEntry_fong>

            <DataEntry_fong caption="發票日期 no property" isMust={true} disabled={disabled}>
              <DatePicker
                value={state_paymentRequest.發票日期}
                onChange={(date) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    發票日期: date,
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="發票號碼"
              isMust={true}
              disabled={disabled}
              childrenWrapperProps={{
                onClick: disabled ? undefined : handle_selectInvoice,
                className: disabled ? '' : 'cursor-pointer',
              }}
            >
              {state_paymentRequest.invoiceNumber}
            </DataEntry_fong>
            <DataEntry_fong caption="發票金額" isMust={true} disabled={disabled}>
              <Input_money
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
              disabled={disabled}
              childrenWrapperProps={{
                // onClick: handle_selectCustomer,
                onClick: disabled ? undefined : handle_selectCustomer,
                className: disabled ? '' : 'cursor-pointer',
              }}
            >
              {state_paymentRequest.customerName}
            </DataEntry_fong>

            <DataEntry_fong caption="統一編號 no property" isMust={true} disabled={disabled}>
              {state_paymentRequest.統一編號}
            </DataEntry_fong>
          </div>
          <div className="w-fit m-auto mt-10 mr-0 ml-auto">
            <Btn theme="save">儲存</Btn>
          </div>

          {children}
        </div>
      )}
    </div>
  );
};

// MARK:END

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK: useData

// ===============================================================================

// ==========================================================================

export default CurrentPaymentRequestDetails;
