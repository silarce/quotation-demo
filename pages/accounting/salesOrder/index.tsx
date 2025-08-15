import { useState, useEffect, useReducer, useMemo } from 'react';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, {
  TdataEntrycontainerProps,
  DataEntry_fong,
  Input,
  Input_money,
  Select,
} from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

import SalesDetails from 'components/page/accounting/salesOrder/salesDetails';

import { Ttax_type } from 'js/api/api_netCore/schemas';

import { useApiGetSalesOrderById } from 'js/api/api_netCore/api_accountsReceivable';

// ============================================================================

interface Tquery {
  id?: string;
}

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

  類別: string | null;
  客戶聯絡電話1: string;
  客戶聯絡電話2: string;
  發票類型: string | null;
  幣別: string | null;
  匯率: `${number}` | '';
  外幣金額: `${number}` | '';
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
  const router = useRouter();
  const query = router.query as Tquery;

  const [disabled, setDisabled] = useState(false);

  const { state, setState, reset } = useData(undefined);

  const {} = useApiGetSalesOrderById(query.id);

  // ---------------------------------------------------------------------------
  const handle_importContract = () => {
    const { destroy } = modal_empty({
      width: 'fit-content',
      content: (
        <Selector_quotation
          onCancel={() => {
            destroy();
          }}
          onConfirm={([quotation]) => {
            if (!quotation) {
              destroy();

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
        {/*  */}
        <DataEntry_fong caption="類別" className="" isMust={true}>
          <Select value={state.類別} onChange={(e) => setState({ ...state, 類別: e as string })} />
        </DataEntry_fong>

        <DataEntry_fong caption="合約編號" className="">
          <Input
            value={state.contractNumber}
            onChange={(e) => setState({ ...state, contractNumber: e.target.value })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="案場名稱" className="col-span-2">
          <Input value={state.projectName} onChange={(e) => setState({ ...state, projectName: e.target.value })} />
        </DataEntry_fong>
        {/*  */}
        <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
          {state.customerNumber}
        </DataEntry_fong>

        <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
          {state.customerName}
        </DataEntry_fong>
        {/*  */}

        <DataEntry_fong caption="客戶地址" className="col-span-2">
          {state.customerName}
        </DataEntry_fong>

        <DataEntry_fong caption="客戶聯絡電話1" className="">
          <Input value={state.客戶聯絡電話1} onChange={(e) => setState({ ...state, 客戶聯絡電話1: e.target.value })} />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶聯絡電話2" className="">
          <Input value={state.客戶聯絡電話2} onChange={(e) => setState({ ...state, 客戶聯絡電話2: e.target.value })} />
        </DataEntry_fong>

        {/*  */}

        <DataEntry_fong caption="統一編號" className="col-span-2">
          {state.customerTaxId}
        </DataEntry_fong>

        <DataEntry_fong caption="發票類型" className="">
          <Select value={state.發票類型} onChange={(e) => setState({ ...state, 發票類型: e as string })} />
        </DataEntry_fong>

        <div />

        {/*  */}
        <DataEntry_fong caption="幣別" className="" isMust={true}>
          <Select value={state.幣別} onChange={(e) => setState({ ...state, 幣別: e as string })} />
        </DataEntry_fong>
        <DataEntry_fong caption="匯率" className="" isMust={true}>
          <Input
            type="number"
            value={state.匯率}
            onChange={(e) => setState({ ...state, 匯率: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="外幣金額" className="" isMust={true}>
          <Input_money
            value={state.外幣金額}
            onChange={(e) => setState({ ...state, 外幣金額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <div />

        {/*  */}

        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input_money
            value={state.price}
            onChange={(e) => setState({ ...state, price: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="稅別" className="" isMust={true}>
          <Select value={state.稅別} onChange={(e) => setState({ ...state, 稅別: e as Ttax_type })} />
        </DataEntry_fong>

        <DataEntry_fong caption="稅金" isMust={true}>
          <Input_money value={state.tax} onChange={(e) => setState({ ...state, tax: e.target.value as `${number}` })} />
        </DataEntry_fong>

        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input_money
            value={state.銷售總額}
            onChange={(e) => setState({ ...state, 銷售總額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        {/*  */}

        <DataEntry_fong caption="已請款總額" isMust={true}>
          <Input_money
            value={state.已請款總額}
            onChange={(e) => setState({ ...state, 已請款總額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="已收金額" isMust={true}>
          <Input_money
            value={state.已收金額}
            onChange={(e) => setState({ ...state, 已收金額: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="扣款折讓" isMust={true}>
          <Input_money
            value={state.扣款折讓}
            onChange={(e) => setState({ ...state, 扣款折讓: e.target.value as `${number}` })}
          />
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

    類別: null,
    客戶聯絡電話1: '',
    客戶聯絡電話2: '',
    發票類型: null,
    幣別: null,
    匯率: '',
    外幣金額: '',
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
