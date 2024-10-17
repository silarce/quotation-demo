import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Spin } from 'antd';

// components
import { Detail, Detail_thead, Detail_tfoot } from 'components/page/accounting/purchaseCollectTicket/detail';
import { SearchModal_prodreceipt } from 'components/composition/searchModal/useSearchModal/useSearchModal_prodreceipt';
import { SearchModal_purchaseCollectTicket } from 'components/composition/searchModal/useSearchModal/useSearchModal_purchaseCollectTicket';
import { Profile } from 'components/page/accounting/purchaseCollectTicket/profile';
// class
import { ClassState } from 'components/page/accounting/purchaseCollectTicket/class/ClassState';
import { ClassState_detail } from 'components/page/accounting/purchaseCollectTicket/class/ClassState_detail';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';

// css
import scss from './index.module.scss';

// api
import { useDepartments } from 'js/api/api_department';
import {
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  TpurchaseCollectTicket_Dto_detailed,
  apiPostAddPurchaseCollectTicket,
  useGetPurchaseCollectTicket,
  useGetPurchaseCollectTicketById,
  useGetPurchaseCollectTicketDetailByTicketId,
  useGetUnpaidProdreceiptByInvoiceNumber,
} from 'js/api/api_netCore/api_accountant';

// type
import { TuserDto, TemployeeDto } from 'js/api/dtoTypes';

import { useTranslation } from 'react-i18next';

// ===========================================================================
type Tquery = {
  purchaseCollectTicketId: string | undefined;
};
interface Tstate {
  id: string | undefined; // purchase_collect_ticket_uuid
  // prodreceipt_uuid: string | undefined; // 進貨單uuid
  //
  agent_employee: TemployeeDto | undefined;
  //
  serial_number: string | undefined; // 收票單號
  applicant_department: string; // 申請單位
  ticket_method: string; // 開票方式
  tax_deduction_category: string; //  扣稅類別
  journal_method: string; // 立帳方式
  invoice_number: string; // 發票號碼
  invoice_price: `${number}` | ''; // 發票金額
  note: string; // 備註
  //
  detailArr: Tstate_detail[];
}

interface Tstate_detail {
  updateCount: number;
  //
  id: string | undefined; // detail_uuid
  identifyId: string;
  //
  item: string;
  prodreceipt_number: string | number;
  transaction_date: Moment | null;
  quantity: `${number}` | '';
  unit: string;
  unit_price: `${number}` | '';
  amount: `${number}` | '';
  note: string;
  //
  goods_spec: string;
  prodreceipt_uuid: string;
}

type Interface_classState = Pick<
  Tstate,
  | 'serial_number'
  | 'applicant_department'
  | 'ticket_method'
  | 'tax_deduction_category'
  | 'journal_method'
  | 'invoice_number'
  // | 'invoice_price'
  | 'note'
> & {
  agentName: string;
  invoice_price: string;
  chagneAgent: (agent: TemployeeDto) => Interface_classState;
  changeInvoice: (invoice: { invoiceNumber: string; invoicePrice: `${number}` | number }) => Interface_classState;
  //
  detailArr: Interface_classState_detail[];
  detailAmountTotal: string;
  addDetail: (state_detailArr: Tstate_detail[]) => Interface_classState;
  deleteDetail: (identifyId: string) => Interface_classState;
  //
  reqBody: TcreatePurchaseCollectTicket_Dto | TupdatePurchaseCollectTicket_Dto;
};

type Interface_classState_detail = Pick<
  Tstate_detail,
  | 'identifyId'
  | 'updateCount'
  | 'item'
  | 'prodreceipt_number'
  | 'transaction_date'
  | 'quantity'
  | 'unit'
  | 'unit_price'
  | 'amount'
  | 'note'
  | 'goods_spec'
> & {
  // identifyId: string;
  // quantity: string;
  // unit_price: string;
  // amount: string;
  deleteSelf: () => Interface_classState_detail;
  reqBody: TcreatePurchaseCollectTicketDetail_Dto | TupdatePurchaseCollectTicketDetail_Dto;
};

export type { Tstate, Tstate_detail, Interface_classState, Interface_classState_detail };

// ===========================================================================

// MARK: START

export default function PurchaseCollectTicket({ userInfo, isAdmin }: { userInfo: TuserDto; isAdmin: boolean }) {
  const { t } = useTranslation('accounting', { keyPrefix: 'purchaseCollectTicket' });

  const router = useRouter();
  const query = router.query as Tquery;
  const { purchaseCollectTicketId } = query as Tquery;

  const [disabled, setDisabled] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  // ------------------------------------------------------------

  const {
    res: raw_purchaseCollectTicket,
    // setRes,
    clear,
    update: update_purchaseCollectTicket,
    reqPatch,
    isFetching: isFetching_purchaseCollectTicket,
  } = useGetPurchaseCollectTicketById(purchaseCollectTicketId);

  // console.log(raw_purchaseCollectTicket);

  // ------------------------------------------------------------

  const { state, setState } = useTicket({
    rawData: raw_purchaseCollectTicket,
    userEmployee: userInfo.employee,
    disabled,
  });

  const State = useMemo(() => {
    return new ClassState(state, setState, ClassState_detail);
  }, [state]);

  // ------------------------------------------------------------

  // region REQUEST

  const reqNewPurchaseCollectTicket = async () => {
    const body: TcreatePurchaseCollectTicket_Dto = State.reqBody;
    setIsFetching(true);
    await apiPostAddPurchaseCollectTicket(body)
      .then((id) => {
        router.replace({
          query: {
            ...query,
            purchaseCollectTicketId: id,
          },
        });
        setDisabled(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  // ------------------------------------------------------------

  // region Handle
  //
  //
  //
  //
  //
  //
  // MARK:handleNewPurchaseCollectTicket
  const handleNewPurchaseCollectTicket = () => {
    const { purchaseCollectTicketId, ...rest } = query;
    clear();

    router.replace({
      query: { ...rest },
    });
    setDisabled(false);
  };

  // MARK:handleSelectTicket
  const handleSelectTicket = () => {
    DragableModal.create({
      children: (
        <SearchModal_purchaseCollectTicket
          limit={1}
          onRowClick={(purchaseCollectTicket) => {
            router.replace({
              query: {
                ...query,
                purchaseCollectTicketId: purchaseCollectTicket.id,
              },
            });
          }}
        />
      ),
    });
  };

  // MARK:handleSelectInvoice
  const handleSelectInvoice = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_prodreceipt
          limit={1}
          onRowClick={(prodreceipt) => {
            State.changeInvoice({
              invoiceNumber: prodreceipt.invoice,
            });
            unmount();
          }}
          checkForbbiden={({ dto }) => {
            if (!dto.invoice) {
              return true;
            }

            if (State.invoice_number && State.invoice_number !== dto.invoice) {
              return true;
            }
          }}
          fixedFilter={{
            invoice: {
              value: State.invoice_number,
              disabled: true,
              placeholder: '',
            },
          }}
        />
      ),
    });
  };

  // MARK: handleSelectDetail
  const handleSelectDetail = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_prodreceipt
          fixedFilter={{
            invoice: {
              value: State.invoice_number,
              disabled: true,
              placeholder: '',
            },
          }}
          checkForbbiden={({ dto, dtoDirc }) => {
            if (
              //
              !dto.invoice ||
              (State.invoice_number && State.invoice_number !== dto.invoice)
            ) {
              return true;
            }

            const invoiceNumberArr = Object.values(dtoDirc).map((prodreceipt) => prodreceipt.invoice);

            if (invoiceNumberArr.length === 0) {
              return false;
            }

            if (!invoiceNumberArr.includes(dto.invoice)) {
              return true;
            }
          }}
          onConfirm={(dict) => {
            let invoiceNumber = '';
            const arr = Object.values(dict).map((prodreceipt) => {
              const { id, prodreceiptid, note, invoice } = prodreceipt;
              invoiceNumber = invoice; // 沒差錯的話所有prodreceipt.invoice都一樣

              if (invoiceNumber && invoiceNumber !== invoice) {
                console.log('invoice number is not the same', dict);

                throw new Error('invoice number is not the same');
              }

              const state_detail: Tstate_detail = {
                updateCount: 0,
                id: undefined,
                identifyId: nanoid(),
                item: '',
                prodreceipt_uuid: id,
                prodreceipt_number: prodreceiptid,
                transaction_date: null,
                quantity: '',
                unit: '',
                unit_price: '',
                amount: '',
                note,
                goods_spec: '',
              };

              return state_detail;
            });

            State.addDetail(arr);
            State.invoice_number = invoiceNumber;
            unmount();
          }}
        />
      ),
    });
  };

  // MARK: handelConfirm
  const handelConfirm = () => {
    if (raw_purchaseCollectTicket) {
    } else {
      reqNewPurchaseCollectTicket();
    }
  };

  // ------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag={t('purchaseCollectTicket')} />
      <div>
        <BtnBar
          disabled={disabled}
          isDataExist={!!raw_purchaseCollectTicket}
          onSearchClick={handleSelectTicket}
          onCancelClick={() => setDisabled(true)}
          onEditClick={() => setDisabled(false)}
          onAddClick={handleNewPurchaseCollectTicket}
          onConfirmClick={handelConfirm}
        />
        <Spin spinning={isFetching || isFetching_purchaseCollectTicket} delay={300}>
          <Profile disabled={disabled} classState={State} onInovoiceBtnClick={handleSelectInvoice} />
          <div className="mt-2 ">
            <div>
              <span className="text-xl text-main mr-5">{t('detail')}</span>
              {!disabled && <SquareBtn label={t('addDetail')} sharp="mini" onClick={handleSelectDetail} />}
            </div>
            <div className={classNames('mt-2', scss.table)}>
              <Detail_thead className={scss.thead} />
              {State.detailArr.map((classDetail, index) => {
                const identifyId = classDetail.identifyId;

                return <Detail key={identifyId} indexNumber={index + 1} disabled={disabled} classState={classDetail} />;
              })}
              <Detail_tfoot amountTotal={State.detailAmountTotal} className={scss.tfoot} />
            </div>
          </div>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK: BtnBar
const BtnBar = ({
  disabled,
  isDataExist,
  onSearchClick,
  onCancelClick,
  onEditClick,
  onAddClick,
  onConfirmClick,
}: {
  disabled: boolean;
  isDataExist: boolean;
  onSearchClick?: () => void;
  onCancelClick?: () => void;
  onEditClick?: () => void;
  onAddClick?: () => void;
  onConfirmClick?: () => void;
}) => {
  return (
    <ThreePartBar>
      <>
        <SquareBtn content="search" onClick={onSearchClick} />
        {isDataExist && <SquareBtn content="export" />}
      </>
      <>
        {!disabled && (
          <>
            <SquareBtn className="invisible" />
            <SquareBtn content="cancel" onClick={onCancelClick} />
            <SquareBtn content="save" theme="danger" onClick={onConfirmClick} />
          </>
        )}
        {disabled && (
          <>
            <SquareBtn content="add" onClick={onAddClick} />
            {isDataExist && <SquareBtn content="edit" onClick={onEditClick} />}
          </>
        )}
      </>
      <>
        <SquareBtn content="delete" theme="danger" />
      </>
    </ThreePartBar>
  );
};

// ===============================================================================

// MARK:useTicket
const useTicket = ({
  rawData,
  userEmployee,
  disabled,
}: {
  rawData: TpurchaseCollectTicket_Dto_detailed | undefined;
  userEmployee: TemployeeDto | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDefaultState(rawData, userEmployee);

  const [state, setState] = useState<Tstate>(defaultState);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return { state, setState };
};

const useDefaultState = (
  //
  rawData: TpurchaseCollectTicket_Dto_detailed | undefined,
  userEmployee: TemployeeDto | undefined
) => {
  const defaultState: Tstate = useMemo(() => {
    if (!rawData) {
      return emptyState(userEmployee);
    } else {
      const detailArr: Tstate_detail[] = rawData.detailArr.map((detail) => {
        const state_detail: Tstate_detail = {
          updateCount: 0,
          id: detail.id,
          identifyId: detail.id,
          item: detail.item || '',
          prodreceipt_number: detail.prodreceipt_number || '',
          transaction_date: detail.transaction_date ? moment(detail.transaction_date) : null,
          quantity: `${detail.quantity || ''}`,
          unit: detail.unit || '',
          unit_price: `${detail.unit_price || ''}`,
          amount: `${detail.amount || ''}`,
          note: detail.note || '',
          goods_spec: detail.goods_spec || '',
          prodreceipt_uuid: detail.prodreceipt_uuid,
        };

        return state_detail;
      });

      const state: Tstate = {
        id: rawData.id,
        agent_employee: rawData.agent_employee,
        // prodreceipt_uuid: prodreceipt_uuid,
        //
        serial_number: rawData.serial_number,
        applicant_department: rawData.applicant_department || '',
        ticket_method: rawData.ticket_method || '',
        tax_deduction_category: rawData.tax_deduction_category || '',
        journal_method: rawData.journal_method || '',
        invoice_number: rawData.invoice_number || '',
        invoice_price: String(rawData.invoice_price || '') as Tstate['invoice_price'],
        note: rawData.note || '',
        detailArr: detailArr,
      };

      return state;
    }
  }, [rawData, userEmployee]);

  return defaultState;
};

const emptyState = (agent_employee: TemployeeDto | undefined): Tstate => ({
  id: undefined,
  // prodreceipt_uuid: undefined,
  agent_employee,
  serial_number: undefined,
  applicant_department: '',
  ticket_method: '',
  tax_deduction_category: '',
  journal_method: '',
  invoice_number: '',
  invoice_price: '',
  note: '',
  detailArr: [],
});

// const emptyuState_detail = (): Tstate_detail => ({
//   updateCount: 0,
//   id: undefined,
//   identifyId: nanoid(),
//   //
//   item: '',
//   prodreceipt_number: '',
//   transaction_date: null,
//   quantity: '',
//   unit: '',
//   unit_price: '',
//   amount: '',
//   note: '',
//   //
//   goods_spec: '',
//   prodreceipt_uuid: undefined,
// });

// =============================================================================

// 進貨收票的發票號碼與所有明細的發票號碼皆相同
// 所以查詢進貨單只能選擇相同發票號碼的進貨單
