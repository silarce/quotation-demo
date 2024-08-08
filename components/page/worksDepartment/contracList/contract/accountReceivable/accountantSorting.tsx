import { useState, useEffect, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';

// gear
import TopBar from './ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './accountantSorting.module.scss';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import type {
  TaccountsReceivablePeriodDto,
  TupdateAccountReceivableDeductionDto,
  TaccountsReceivableInvoiceDto,
  TincomeBillSerialDto,
} from 'js/api/dtoTypes';

// DND
import type { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  //
  useDroppable,
  useSensor,
  useSensors,
  // useDraggable,
  // DragOverlay,
  DndContext,
  closestCenter,
  // KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  // sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import {
  //
  // restrictToHorizontalAxis,
  restrictToVerticalAxis,
  // restrictToWindowEdges,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';

// ================================================================================

// region TYPE

type Tstate = {
  isAccountantOrderChanged: boolean;
  isInvoiceAllowanceChanged: boolean;
  isInvoiceAccountantRelationChanged: boolean;
  invoice: Tinvoice;
  incomeBillArr: TincomeBill[];
};

type Tinvoice = {
  id: UniqueIdentifier | 'noInvoice'; // 就是string | number // id 必須唯一
  invoiceNumber: React.ReactNode;
  invoiceDate: React.ReactNode;
  price: React.ReactNode;
  allowance: string;
};

type TincomeBill = {
  id: UniqueIdentifier; // 就是string | number // id 必須唯一
  invoiceId: UniqueIdentifier; //  同所屬invoice
  importAccountingNumber: React.ReactNode;
  noteMaturityDate: React.ReactNode; // 票據到期日

  receiveDate: React.ReactNode;
  receivablePayment: React.ReactNode;
  receivablePayment_num: number;

  //
  isRelationedInvoiceChanged: boolean;
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];

  raw: TincomeBillSerialDto;
};

type TstateList = {
  [invoiceId: UniqueIdentifier]: Tstate;
};

type TdndData_row = {
  invoice: Tinvoice;
  incomeBill: TincomeBill;
};

type TdndData_group = {
  isContainer: true;
  invoice: Tinvoice;
  isEmpty: boolean;
};

export type { TstateList as Tstate_incomeBillSorting };

// ================================================================================
// region START
export default function AccountantSorting({
  className,
  periodArr,
  incomeBillList_noInvoice,
  onConfirm,
}: {
  className?: string;
  periodArr: TaccountsReceivablePeriodDto[];
  incomeBillList_noInvoice: TincomeBillSerialDto[];
  onConfirm: (stateList: TstateList) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(true);

  const [stateList, setStateList] = useState<TstateList>({});
  const [activeAccountant, setActiveAccountant] = useState<TincomeBill>();

  // -----------------------------------------------------------------------------

  // region FUNCTION

  const handle_onDragStart = (e: DragStartEvent) => {
    handleDragStart(e, setActiveAccountant);
  };

  const handle_onDragEnd = (e: DragEndEvent) => {
    handleDragEnd(e, stateList, setActiveAccountant, setStateList);
  };

  const handle_onDragOver = (e: DragOverEvent) => {
    handleDragOver(e, stateList, setStateList);
  };

  const handle_confirm = async () => {
    const { noInvoice, ...rest } = stateList;

    await onConfirm(rest);
    setDisabled(true);
  };

  const handle_editAllowance = (invoiceId: string, value: string) => {
    setStateList((list) => {
      list = { ...list };
      const state = list[invoiceId];
      const invoice = state.invoice;
      invoice.allowance = value;

      state.isInvoiceAllowanceChanged = true;

      return list;
    });
  };

  // -----------------------------------------------------------------------------

  // region props

  const sensors = useSensors(useSensor(PointerSensor));

  // const { total_invoice, total_accountant, amountNotCollected } = useMemo(() => {
  //   let total_invoice_d = new Decimal(0);
  //   let total_accountant_d = new Decimal(0);

  //   periodArr.forEach((period) => {
  //     const invoice: TaccountsReceivableInvoiceDto | undefined = period.invoices[0] as
  //       | TaccountsReceivableInvoiceDto
  //       | undefined;

  //     if (!invoice) {
  //       return;
  //     }

  //     const price = period.price || 0;

  //     const { accountantList } = invoice;

  //     total_invoice_d = total_invoice_d.add(price || 0);

  //     accountantList?.forEach((accountant) => {
  //       total_accountant_d = total_accountant_d.add(accountant.price || 0);
  //     });
  //   });

  //   return {
  //     total_invoice: total_invoice_d.toNumber().toLocaleString(),

  //     total_accountant: total_accountant_d.toNumber().toLocaleString(),

  //     amountNotCollected: total_invoice_d.minus(total_accountant_d).toNumber().toLocaleString(),
  //   };
  // }, [periodArr]);

  const {
    //
    total_invoice,
    total_invoice_num,
    total_accountant,
    amountNotCollected,
  } = useMemo(() => {
    let total_invoice_d = new Decimal(0);
    let total_accountant_d = new Decimal(0);

    periodArr.forEach((period) => {
      const invoice: TaccountsReceivableInvoiceDto | undefined = period.invoices[0] as
        | TaccountsReceivableInvoiceDto
        | undefined;

      if (!invoice) {
        return;
      }

      const incomeBillList = invoice.incomeBillList;

      // const price = period.price || 0;
      const price = invoice.actualPrice || 0;

      total_invoice_d = total_invoice_d.add(price || 0);

      incomeBillList?.forEach((incomeBill) => {
        total_accountant_d = total_accountant_d.add(incomeBill.receivablePayment || 0);
      });
    }); // periodArr.forEach

    incomeBillList_noInvoice?.forEach((incomeBill) => {
      total_accountant_d = total_accountant_d.add(incomeBill.receivablePayment || 0);
    });

    const amountNotCollected = new Decimal(total_invoice_d).minus(total_accountant_d).toNumber().toLocaleString();

    return {
      total_invoice_num: total_invoice_d.toNumber(),
      total_invoice: total_invoice_d.toNumber().toLocaleString(),
      total_accountant: total_accountant_d.toNumber().toLocaleString(),
      amountNotCollected,
    };
  }, [periodArr, incomeBillList_noInvoice]);

  // 棄用
  // const { total_accountant, amountNotCollected } = useMemo(() => {
  //   let total_accountant = new Decimal(0);

  //   const { noInvoice, ...rest } = stateList;

  //   Object.values(rest).forEach((state) => {
  //     state.accountantArr.forEach((acc) => {
  //       total_accountant = total_accountant.add(acc.price_num || 0);
  //     });
  //   });

  //   // const amountNotCollected = total_accountant.minus(total_invoice_num).toNumber().toLocaleString();
  //   const amountNotCollected = new Decimal(total_invoice_num).minus(total_accountant).toNumber().toLocaleString();

  //   return {
  //     total_accountant: total_accountant.toNumber().toLocaleString(),
  //     amountNotCollected,
  //   };
  // }, [total_invoice_num, stateList]);

  // -----------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setDisabled(true);
  }, [periodArr]);

  useEffect(() => {
    const list: TstateList = {};
    list.noInvoice = createNoInvoiceState(incomeBillList_noInvoice);

    periodArr.forEach((period) => {
      // const periodPrice = period.price || 0;

      const invoice: TaccountsReceivableInvoiceDto | undefined = period.invoices[0] as
        | TaccountsReceivableInvoiceDto
        | undefined;

      if (!invoice) {
        return;
      }

      const {
        //
        id: invoiceId,
        incomeBillList,
        invoiceNumber,
        invoiceDate,
        actualPrice: invoiceActualPrice,
        allowance,
      } = invoice;

      const orderedincomeBillList = _.sortBy(incomeBillList, 'order');

      const incomeBillArr = orderedincomeBillList.map((incomeBill) => {
        const {
          //
          id: incomeBillId,
          receiveDate,
          importAccountingNumber,
          noteMaturityDate,
          receivablePayment,
          accountsReceivableDeduction,
        } = incomeBill;

        return {
          id: incomeBillId,
          invoiceId,
          receiveDate: getTaiwanDateStr(receiveDate),
          importAccountingNumber,
          noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
          // price: price.toLocaleString(),
          receivablePayment: receivablePayment?.toLocaleString(),
          receivablePayment_num: receivablePayment || 0,
          accountsReceivableDeduction,
          isRelationedInvoiceChanged: false,
          raw: incomeBill,
        } as TincomeBill;
      }); // accountantArr

      list[invoiceId] = {
        isAccountantOrderChanged: false,
        isInvoiceAllowanceChanged: false,
        isInvoiceAccountantRelationChanged: false,
        invoice: {
          id: invoiceId,
          invoiceNumber,
          invoiceDate: invoiceDate ? getTaiwanDateStr(invoiceDate) : '',
          // price: periodPrice.toLocaleString(),
          price: invoiceActualPrice.toLocaleString(),
          allowance: String(allowance || ''),
        },
        incomeBillArr: incomeBillArr,
      };
    }); // invoiceArr.forEach

    setStateList(list);
  }, [periodArr, incomeBillList_noInvoice, disabled]);

  // -----------------------------------------------------------------------------
  // region RENDER

  return (
    <div className={classNames(scss.accountantSorting, className)}>
      <TopBar caption="應收帳款管理">
        {/* <MyButton_v2 px="px22" py="py4">
          新增折讓
        </MyButton_v2> */}

        {disabled && (
          <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(false)}>
            排序/編輯
          </MyButton_v2>
        )}

        {!disabled && (
          <>
            <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(true)}>
              取消
            </MyButton_v2>
            <MyButton_v2 theme={'danger'} px="px22" py="py4" onClick={handle_confirm}>
              確認
            </MyButton_v2>
          </>
        )}
      </TopBar>
      {/*  */}
      {/*  */}
      <div className={scss.table}>
        <Group className={classNames(scss.top)}>
          <Left>發票開立資訊</Left>
          <Right>已收款項明細</Right>
        </Group>
        {/*  */}
        <Group className={scss['thead']}>
          <Left>
            <Row>
              <span>發票號碼</span>
              <span>開立日期</span>
              <span>開立金額</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span>收款日期</span>
              <span>帳號/號碼</span>
              <span>到期日</span>
              <span>收款金額</span>
            </Row>
          </Right>
        </Group>
        {/*  */}
        {/*  */}
        {/*  */}

        <div
          className={scss.dndContainer}
          onWheel={(e) => {
            const target = e.target as HTMLElement;

            // 修正當input type為number時，避免因為滾輪而意外改變了值
            if (target.tagName === 'INPUT') {
              target.blur();
            }
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
            //
            onDragStart={handle_onDragStart}
            onDragEnd={handle_onDragEnd}
            onDragOver={handle_onDragOver}
          >
            {Object.values(stateList).map((state) => {
              const invoiceId = state.invoice.id;

              return (
                <Group_Dnd
                  key={invoiceId}
                  state={state}
                  disabled={disabled}
                  //
                  activeAccountandId={activeAccountant?.id}
                  handle_editAllowance={handle_editAllowance}
                />
              );
            })}

            {/* DragOverlay會無法觸發底下元素的hover */}
            {/* <DragOverlay>
              <Row className={scss.activeState}>
                <span>{activeAccountant?.insertDate}</span>
                <span>{activeAccountant?.importAccountingNumber}</span>
                <span>{activeAccountant?.noteMaturityDate}</span>
                <span>{activeAccountant?.price}</span>
              </Row>
            </DragOverlay> */}
          </DndContext>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}

        <Group className={scss['total']}>
          <Left>
            <Row>
              <span></span>
              <span>合計</span>
              <span>{total_invoice}</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>{total_accountant}</span>
            </Row>
          </Right>
        </Group>

        <div className={scss.footCaption}>已開立發票未收款項</div>

        <Group className={scss['total']}>
          <Left></Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>{amountNotCollected}</span>
            </Row>
          </Right>
        </Group>
      </div>
    </div>
  );
}

// region END

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

// region COMPONENT

const Group = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.group, className)}>{children}</div>;
};

const Left = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.left, className)}>{children}</div>;
};

const Right = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.right, className)}>{children}</div>;
};

const Row_pre = (
  attributes: React.HTMLAttributes<HTMLDivElement>,

  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} {...attributes} className={classNames(scss.row, attributes.className)}>
      {attributes.children}
    </div>
  );
};

const Row = forwardRef(Row_pre);

// region Dnd COMPONENT
const Group_Dnd = ({
  //
  state,
  disabled,
  activeAccountandId,
  handle_editAllowance,
}: {
  state: Tstate;
  disabled: boolean;
  activeAccountandId?: UniqueIdentifier | undefined;
  handle_editAllowance: (invoiceId: string, value: string) => void;
}) => {
  const { invoice, incomeBillArr: accountantArr } = state;
  const { id, invoiceNumber, invoiceDate, price } = invoice;
  let { allowance } = invoice;

  const dndData_group: TdndData_group = {
    isContainer: true,
    invoice,
    isEmpty: accountantArr.length === 0,
  };
  const { setNodeRef } = useDroppable({
    id: invoice.id,
    data: dndData_group,
  });

  if (allowance !== '') {
    allowance = disabled ? Number(allowance).toLocaleString() : allowance;
  }

  const isNoInvoice = invoice.id === 'noInvoice';

  return (
    <Group className={classNames(scss['tbody'], !disabled && scss.abled)}>
      <Left>
        <Row>
          <span>{invoiceNumber}</span>
          <span>{invoiceDate}</span>
          <span className="justify-self-end mr-5">{price}</span>
        </Row>

        <Row className={classNames(scss.allowance, scss.plus, (disabled || isNoInvoice) && scss.disabled)}>
          <div></div>
          <p>折讓</p>
          <input
            className="justify-self-end mr-5"
            placeholder="無折讓"
            readOnly={disabled || isNoInvoice}
            type={disabled ? 'text' : 'number'}
            value={allowance}
            onChange={(e) => {
              handle_editAllowance(String(invoice.id), e.target.value);
            }}
          />
        </Row>
      </Left>
      <Right>
        {accountantArr.length === 0 && (
          //  dropContainer必須有固定高度，否則拖拉時會有bug
          <div ref={setNodeRef} className={scss.dropContainer}>
            無收款
          </div>
        )}

        <SortableContext disabled={disabled} items={accountantArr} strategy={verticalListSortingStrategy}>
          {accountantArr.map((accountant) => {
            const {
              //
              id,
              receiveDate: insertDate,
              importAccountingNumber,
              noteMaturityDate,
              receivablePayment: price,
            } = accountant;

            return (
              <Row_Dnd
                className={classNames(activeAccountandId === id && scss.active)}
                key={accountant.id}
                id={accountant.id}
                invoice={invoice}
                accountant={accountant}
              >
                <span>{insertDate}</span>
                <span>{importAccountingNumber}</span>
                <span>{noteMaturityDate}</span>
                <span>{price}</span>
              </Row_Dnd>
            );
          })}
        </SortableContext>
      </Right>
    </Group>
  );
};

const Row_Dnd = ({
  //
  id,
  children,
  invoice,
  accountant,
  className,
}: {
  id: UniqueIdentifier; // accountant id
  children: React.ReactNode;
  invoice: Tinvoice;
  accountant: TincomeBill;
  className?: string;
}) => {
  const {
    //
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,

    data: {
      invoice,
      accountant,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Row className={className} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Row>
  );
};

// ================================================================================

// region FUNCTION

const findIdIndex = (dndData: TdndData_row, stateList: TstateList) => {
  const { invoice, incomeBill: accountant } = dndData;
  const { id: invoiceId } = invoice;
  const { id: accountantId } = accountant;

  const state = stateList[invoiceId];
  const { incomeBillArr: accountantArr } = state;
  const accountantIndex = accountantArr.findIndex((item) => item.id === accountantId);

  return {
    invoiceId,
    accountantIndex,
  };
};

function handleDragStart(
  e: DragStartEvent,
  setActiveState: React.Dispatch<React.SetStateAction<TincomeBill | undefined>>
) {
  const { active } = e;
  const { data } = active;
  const activeAccountant = data.current?.accountant as TincomeBill;
  setActiveState(activeAccountant);
}

// region handleDragEnd

function handleDragEnd(
  //
  e: DragEndEvent,
  stateList: TstateList,
  setActiveState: React.Dispatch<React.SetStateAction<TincomeBill | undefined>>,
  setStateListArr: React.Dispatch<React.SetStateAction<TstateList>>
) {
  const { active, over } = e;

  if (over?.data.current?.isContainer) {
    setActiveState(undefined);

    return;
  }

  // 假設兩者的invoice一樣(因為在handleDragOver就處理成一樣了，沒有觸發過handleDragOver的話那也會一樣)

  // const { invoice: invoice_active, accountant: accountant_active } = (active.data.current as TdndData) ?? {};
  // const { invoice: invoice_over, accountant: accountant_over } = (over?.data.current as TdndData) ?? {};

  const { invoiceId: invoiceId_active, accountantIndex: accountantIndex_old } = findIdIndex(
    active.data.current as TdndData_row,
    stateList
  );
  const { invoiceId: invoiceId_over, accountantIndex: accountantIndex_new } = findIdIndex(
    over?.data.current as TdndData_row,
    stateList
  );

  if (invoiceId_active !== invoiceId_over || accountantIndex_old === accountantIndex_new) {
    setActiveState(undefined);

    return;
  }

  setStateListArr((list) => {
    list = { ...list };
    const state = list[invoiceId_active];
    state.incomeBillArr = arrayMove(state.incomeBillArr, accountantIndex_old, accountantIndex_new);
    state.isAccountantOrderChanged = true;

    return list;
  });
  setActiveState(undefined);
}

// region handleDragOver
function handleDragOver(
  e: DragEndEvent,
  stateList: TstateList,
  setStateListArr: React.Dispatch<React.SetStateAction<TstateList>>
) {
  const { active, over } = e;

  //over是否為Droppable container 就是useDroppable處理並綁定的的那個div
  if (over?.data.current?.isContainer) {
    const {
      //  isContainer,
      invoice,
      isEmpty,
    } = (over?.data.current as TdndData_group) ?? {};

    if (!isEmpty) {
      return;
    }

    const { invoiceId: invoiceId_active, accountantIndex: accountantIndex_active } = findIdIndex(
      active.data.current as TdndData_row,
      stateList
    );
    const invoiceId_over = invoice.id;

    if (invoiceId_active === invoiceId_over) {
      return;
    }

    const activeAccountant = (active.data.current as TdndData_row)?.incomeBill;

    activeAccountant.isRelationedInvoiceChanged = true;
    activeAccountant.invoiceId = invoiceId_over;

    setStateListArr((list) => {
      list = { ...list };

      const state_active = list[invoiceId_active];
      const state_over = list[invoiceId_over];

      state_active.isAccountantOrderChanged = true;
      state_over.isAccountantOrderChanged = true;
      state_active.isInvoiceAccountantRelationChanged = true;
      state_over.isInvoiceAccountantRelationChanged = true;

      // 必須更新，送進SortableContext的items才會更新狀態
      state_active.incomeBillArr = [...state_active.incomeBillArr];
      state_over.incomeBillArr = [...state_over.incomeBillArr];

      const accountantArr_active = state_active.incomeBillArr;
      const accountantArr_over = state_over.incomeBillArr;

      accountantArr_active.splice(accountantIndex_active, 1);
      accountantArr_over.push(activeAccountant);

      return list;
    });

    return;
  } // if (over?.data.current?.isContainer) close

  // const { invoice: invoice_active, accountant: accountant_active } = (active.data.current as TdndData) ?? {};
  // const { invoice: invoice_over, accountant: accountant_over } = (over?.data.current as TdndData) ?? {};

  const { invoiceId: invoiceId_active, accountantIndex: accountantIndex_active } = findIdIndex(
    active.data.current as TdndData_row,
    stateList
  );
  const { invoiceId: invoiceId_over, accountantIndex: accountantIndex_over } = findIdIndex(
    over?.data.current as TdndData_row,
    stateList
  );

  if (invoiceId_active === invoiceId_over) {
    return;
  }

  const activeAccountant = (active.data.current as TdndData_row)?.incomeBill;

  activeAccountant.isRelationedInvoiceChanged = true;
  activeAccountant.invoiceId = invoiceId_over;

  setStateListArr((list) => {
    list = { ...list };
    const state_active = list[invoiceId_active];
    const state_over = list[invoiceId_over];

    state_active.isAccountantOrderChanged = true;
    state_over.isAccountantOrderChanged = true;
    state_active.isInvoiceAccountantRelationChanged = true;
    state_over.isInvoiceAccountantRelationChanged = true;

    // 必須更新，送進SortableContext的items才會更新狀態
    state_active.incomeBillArr = [...state_active.incomeBillArr];
    state_over.incomeBillArr = [...state_over.incomeBillArr];

    const accountantArr_active = state_active.incomeBillArr;
    const accountantArr_over = state_over.incomeBillArr;

    accountantArr_active.splice(accountantIndex_active, 1);

    if (accountantIndex_over === 0) {
      accountantArr_over.unshift(activeAccountant);
    } else {
      accountantArr_over.push(activeAccountant);
    }
    // accountantArr_over.splice(accountantIndex_over, 0, activeAccountant);

    return list;
  });
}

// ===============================================================================

const createNoInvoiceState = (incomeBillList_noInvoice: TincomeBillSerialDto[]) => {
  const virtualInvoice: Tinvoice = {
    id: 'noInvoice',
    invoiceNumber: '---',
    invoiceDate: '---',
    price: '---',
    allowance: '',
  };

  const incomeBillList_noInvoice_order = _.sortBy(incomeBillList_noInvoice, 'order');

  const incomeBillArr = incomeBillList_noInvoice_order.map((incomeBill) => {
    const {
      //
      id: incomeBillId,
      receiveDate,
      importAccountingNumber,
      noteMaturityDate,
      receivablePayment,
      accountsReceivableDeduction,
    } = incomeBill;

    return {
      id: incomeBillId,
      invoiceId: 'noInvoice',
      receiveDate: getTaiwanDateStr(receiveDate),
      importAccountingNumber,
      noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
      receivablePayment: receivablePayment?.toLocaleString(),
      receivablePayment_num: receivablePayment,
      accountsReceivableDeduction,
      isRelationedInvoiceChanged: false,
      raw: incomeBill,
    } as TincomeBill;
  });

  return {
    isAccountantOrderChanged: false,
    isInvoiceAllowanceChanged: false,
    isInvoiceAccountantRelationChanged: false,
    invoice: virtualInvoice,
    incomeBillArr,
  };
};
