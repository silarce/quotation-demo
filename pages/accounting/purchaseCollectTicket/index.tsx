import { useState, useEffect, useMemo, memo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment from 'moment';

// antd
import { Spin } from 'antd';

// components
import { Detail, Detail_thead, Detail_tfoot } from 'components/page/accounting/purchaseCollectTicket/detail';
import {
  SearchModal_prodreceipt,
  Tconfig_filter,
} from 'components/composition/searchModal/useSearchModal/useSearchModal_prodreceipt';
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
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './index.module.scss';

// api
import {
  TcreatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicket_Dto_detailed,
  apiPostAddPurchaseCollectTicket,
  useGetPurchaseCollectTicketById,
} from 'js/api/api_netCore/api_accountant';

// type
import { TuserDto, TemployeeDto } from 'js/api/dtoTypes';
import { Tstate, Tstate_detail, Interface_classState } from 'components/page/accounting/purchaseCollectTicket/type';

//
import { useTranslation } from 'react-i18next';

// ===========================================================================
type Tquery = {
  purchaseCollectTicketId: string | undefined;
};

// ===========================================================================

const Detail_memo = memo(Detail, (prevProps, nextProps) => {
  if (
    prevProps.classState.updateCount !== nextProps.classState.updateCount ||
    prevProps.classState.identifyId !== nextProps.classState.identifyId ||
    prevProps.indexNumber !== nextProps.indexNumber
  ) {
    return false;
  }

  return true;
});

// ===========================================================================

// MARK: START
// 進貨收票的發票號碼與所有明細的發票號碼皆相同
// 所以查詢進貨單只能選擇相同發票號碼的進貨單
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
    // update: update_purchaseCollectTicket,
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

  const customerFilter = useCustomerFilter();
  const customerFilter_forDetail = useCustomerFilter_forDetail(State);

  // ------------------------------------------------------------

  // region REQUEST

  const reqNewPurchaseCollectTicket = async () => {
    const body: TcreatePurchaseCollectTicket_Dto = State.reqBody.body_create;
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

  const reqUpdatePurchaseCollectTicket = async () => {
    const body = State.reqBody.body_update;

    if (!body) {
      myAlert.err({ content: 'body is undefined' });

      return;
    }

    setIsFetching(true);
    await reqPatch(body).finally(() => {
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
      // 進貨收票單
      handleText: t('purchaseCollectTicket'),
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
      // handleText: '未結案發票',
      handleText: t('unclosedInvoices'),
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

            // if (State.invoice_number && State.invoice_number !== dto.invoice) {
            //   return true;
            // }
          }}
          options={{
            customKeyArr: ['indexNumber', 'invoice'],
            coverFilter: customerFilter,
            uniqInvoice: true,
            dontShotNoInvoiceData: true,
          }}
        />
      ),
    });
  };

  const handleInputInvoice = () => {
    const { destroy } = myAlert.input({
      title: '發票號碼',
      onConfirm: (value) => {
        State.invoice_number = value;
        destroy();
      },
    });
  };

  // MARK:handleClearInvoice
  const handleClearInvoice = () => {
    State.invoice_number = '';
    State.clearDetail();
    // myAlert.confirm({
    //   title: t('clearInvoiceWarning'),
    //   props: {
    //     onOk: () => {
    //       State.invoice_number = '';
    //       State.clearDetail();
    //     },
    //   },
    // });
  };

  // MARK: handleSelectDetail
  const handleSelectDetail = () => {
    const { unmount } = DragableModal.create({
      // 選擇明細資料
      handleText: t('selectDetail'),
      children: (
        <SearchModal_prodreceipt
          options={{
            coverFilter: customerFilter_forDetail,
            dontShotNoInvoiceData: false,
          }}
          checkForbbiden={({ dto, dtoDirc }) => {
            if (State.invoice_number && State.invoice_number !== dto.invoice) {
              return true;
            }

            const invoiceNumberArr = Object.values(dtoDirc).map((prodreceipt) => prodreceipt.invoice);

            if (invoiceNumberArr.length === 0) {
              return false;
            }

            // 預期只會有一個item是有值的
            const validInvoiceNumber = invoiceNumberArr.find((item) => !!item);

            if (validInvoiceNumber && dto.invoice && validInvoiceNumber !== dto.invoice) {
              return true;
            }
          }}
          onConfirm={(dict) => {
            let invoiceNumber = '';

            const arr = Object.values(dict).map((prodreceipt) => {
              const { id, prodreceiptid, note, invoice } = prodreceipt;

              // 預期所有prodreceipt.invoice都一樣或是空字串
              if (invoiceNumber && invoice && invoiceNumber !== invoice) {
                console.error('invoice number is not the same', dict);

                throw new Error('進貨單的發票號碼不一致');
              }

              if (!invoiceNumber) {
                invoiceNumber = invoice;
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
      reqUpdatePurchaseCollectTicket();
    } else {
      reqNewPurchaseCollectTicket();
    }
  };

  // ------------------------------------------------------------

  // if (!isAdmin) {
  //   return (
  //     <SubLayer bodyPreStyle="style01">
  //       <PageHeader02 tag={t('purchaseCollectTicket')} />
  //       <div>
  //         <h1 className="text-5xl">施工中</h1>
  //       </div>
  //     </SubLayer>
  //   );
  // }

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
          <Profile
            //
            disabled={disabled}
            classState={State}
            // onInovoiceBtnClick={handleSelectInvoice}
            changeInvoice={(invoiceNumber) => {
              State.changeInvoice({ invoiceNumber });
            }}
            invoiceBtn={{
              onSelectClick: handleSelectInvoice,
              onInputClick: handleInputInvoice,
              onClearClick: handleClearInvoice,
              status: State.invoice_number ? 'selected' : 'unselected',
            }}
          />
          <div className="mt-2 ">
            <div>
              <span className="text-xl text-main mr-5">{t('detail')}</span>

              {!disabled && (
                <SquareBtn className={classNames()} label={t('addDetail')} sharp="mini" onClick={handleSelectDetail} />
              )}
            </div>
            <div className={classNames('mt-2', scss.table)}>
              <Detail_thead className={scss.thead} />
              {State.detailArr.map((classDetail, index) => {
                const identifyId = classDetail.identifyId;

                return (
                  <Detail_memo key={identifyId} indexNumber={index + 1} disabled={disabled} classState={classDetail} />
                );
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
      {/* <>
        <SquareBtn content="delete" theme="danger" />
      </> */}
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

// =============================================================================

const useCustomerFilter = () => {
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'prodreceipt' });

  const confit_filter: Tconfig_filter = useMemo(() => {
    return [
      {
        caption: t('wholeInvoiceNumber'),
        key: 'invoice',
        type: 'input',
        // placeholder: '完整發票號碼',
      },
    ];
  }, [i18n.language]);

  return confit_filter;
};

const useCustomerFilter_forDetail = (State: Interface_classState) => {
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'prodreceipt' });

  const config_filter: Tconfig_filter = useMemo(() => {
    const filter: Tconfig_filter = [
      {
        caption: t('prodreceiptid'),
        key: 'prodreceiptid',
        type: 'input',
      },
      {
        caption: t('wholeInvoiceNumber'),
        key: 'invoice',
        type: 'input',
        defaultValue: State.invoice_number,
        // disabled: !!State.invoice_number,
        freeze: !!State.invoice_number,
        placeholder: '',
      },
    ];

    return filter;
  }, [State.invoice_number, i18n.language]);

  return config_filter;
};
