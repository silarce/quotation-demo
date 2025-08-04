import { useState, useEffect, useReducer, useMemo } from 'react';
import Decimal from 'decimal.js';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { TdataEntrycontainerProps, DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

import SalesDetails from 'components/page/accounting/salesOrder/salesDetails';

import { Ttax_type } from 'js/api/api_netCore/schemas';

// ============================================================================

interface Tstate {
  contractNumber: string;
  projectName: string;

  customerNumber: string;
  customerName: string;
  customerTaxId: string;

  price: `${number}` | '';
  tax: `${number}` | '';
  已請款總額: `${number}` | '';
  銷售總額: `${number}` | '';
  已收金額: `${number}` | '';
  扣款折讓: `${number}` | '';
  稅別: Ttax_type | null;
  應稅外加: string;
}

// type Taction =
//   | {
//       type: 'contractNumber' | 'projectName' | '應稅外加' | 'customerNumber' | 'customerName' | 'customerTaxId';
//       payload: string;
//     }
//   | {
//       type: 'price' | 'tax' | '已請款總額' | '銷售總額' | '已收金額' | '扣款折讓';
//       payload: `${number}` | '';
//     }
//   | {
//       type: '稅別';
//       payload: Ttax_type | null;
//     };

// ============================================================================

// MARK:START

export default function SalesOrder() {
  const [disabled, setDisabled] = useState(false);

  const { state, setState, reset } = useData(undefined);

  // ---------------------------------------------------------------------------
  const handle_importContract = () => {
    const { destroy } = modal_empty({
      width: 'fit-content',
      content: (
        <Selector_quotation
          onConfirm={([quotation]) => {
            if (!quotation) {
              return;
            }

            const {
              id,
              status,
              reviewManagerEmployeeId,
              managerReviewedAt,
              quotationNumber,
              version,
              customerId,
              projectName,
              county,
              district,
              address,
              contactPerson,
              contactNumber,
              quantity,
              editNotes,
              discount,
              subTotal,
              salesTax,
              total,
              deliveryLocation,
              paymentMethods,
              supervisorEmployeeId,
              agentEmployeeId,
              reviewSalesEmployeeId,
              productsOrder,
              tuneTotal,
              averageDiscount,
              estimatedDiscount,
              type,
              currency,
              foreignTotal,
              exchangeRate,
              contractId,
              contractStatus,
              contractNumber,
              customerName,
              additionalAmount,
            } = quotation;

            setState((prev) => ({
              ...prev,
              contractNumber: contractNumber ?? '',
              projectName,
              customerNumber: 'no property',
              customerName: customerName ?? '',
              customerTaxId: 'no property',
            }));

            destroy();

            //
          }}
        />
      ),
    });
  };

  // ---------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          <Btn theme="import" onClick={handle_importContract}>
            合約匯入
          </Btn>
          <Btn theme="trash">清空</Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-fong">
        <DataEntry_fong caption="合約編號" className="col-span-2" isMust={true}>
          <Input
            value={state.contractNumber}
            onChange={(e) => setState({ ...state, contractNumber: e.target.value })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="案場名稱" className="col-span-2" isMust={true}>
          <Input value={state.projectName} onChange={(e) => setState({ ...state, projectName: e.target.value })} />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
          {state.customerNumber}
        </DataEntry_fong>
        <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
          {state.customerName}
        </DataEntry_fong>
        <DataEntry_fong caption="統一編號" className="col-span-2" isMust={true}>
          {state.customerTaxId}
        </DataEntry_fong>
        <div />
        <div />
        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.price}
            onChange={(e) => setState({ ...state, price: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="稅金" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.tax}
            onChange={(e) => setState({ ...state, tax: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="已請款總額" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.已請款總額}
            onChange={(e) => setState({ ...state, 已請款總額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.銷售總額}
            onChange={(e) => setState({ ...state, 銷售總額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="已收金額" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.已收金額}
            onChange={(e) => setState({ ...state, 已收金額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="扣款折讓" isMust={true}>
          <Input
            type="number"
            toLocalString={disabled}
            value={state.扣款折讓}
            onChange={(e) => setState({ ...state, 扣款折讓: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="稅別" isMust={true}>
          <Select />
        </DataEntry_fong>
        <DataEntry_fong caption="應稅外加" isMust={true}>
          <Input value={state.應稅外加} onChange={(e) => setState({ ...state, 應稅外加: e.target.value })} />
        </DataEntry_fong>
      </div>

      <SalesDetails className={'mt-10'} />
    </div>
  );
}

// MARK: END
// ==========================================================================

const emptyState = (): Tstate => {
  return {
    contractNumber: '',
    projectName: '',
    customerNumber: '',
    customerName: '',
    customerTaxId: '',
    price: '',
    tax: '',
    已請款總額: '',
    銷售總額: '',
    已收金額: '',
    扣款折讓: '',
    稅別: null,
    應稅外加: '',
  };
};

const useDefaultState = (raw: unknown | undefined | null) => {
  return useMemo(emptyState, [raw]);
};

const useData = (raw: unknown | undefined | null) => {
  const defaultState = useDefaultState(raw);

  const [state, setState] = useState<Tstate>(defaultState);

  // const dispatch = (action: Taction) => {
  //   const { type, payload } = action;
  // };

  const reset = () => {
    setState(defaultState);
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state,
    setState,
    reset,
  };
};
