import { useState, useEffect, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// gear
import TopBar from './ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './accountantSorting.module.scss';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import type { TaccountsReceivableInvoiceDto, TupdateAccountReceivableDeductionDto } from 'js/api/dtoTypes';

// DND
import type { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  //
  useDroppable,
  useSensor,
  useSensors,
  // useDraggable,
  DragOverlay,
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

import { restrictToHorizontalAxis, restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';

// ================================================================================

// region TYPE

type Tinvoice = {
  id: UniqueIdentifier; // 就是string | number // id 必須唯一
  invoiceNumber: React.ReactNode;
  invoiceDate: React.ReactNode;
  price: React.ReactNode;
};

type Taccountant = {
  id: UniqueIdentifier; // 就是string | number // id 必須唯一
  invoiceId: UniqueIdentifier; //  同所屬invoice
  insertDate: React.ReactNode;
  importAccountingNumber: React.ReactNode;
  noteMaturityDate: React.ReactNode; // 票據到期日
  price: React.ReactNode;
  //
  isRelationedInvoiceChanged: boolean;
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];
};

type Tstate = {
  isAccountantOrderChanged: boolean;
  invoice: Tinvoice;
  accountantArr: Taccountant[];
};

type TstateList = {
  [invoiceId: UniqueIdentifier]: Tstate;
};

type TdndData_row = {
  invoice: Tinvoice;
  accountant: Taccountant;
};

type TdndData_group = {
  isContainer: true;
  invoice: Tinvoice;
  isEmpty: boolean;
};

export type { TstateList as Tstate_accountantSorting };

// ================================================================================
// region START
export default function AccountantSorting({
  className,
  invoiceArr,
  onConfirm,
}: {
  className?: string;
  invoiceArr: TaccountsReceivableInvoiceDto[];
  onConfirm: (stateList: TstateList) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(true);

  const [stateList, setStateListArr] = useState<TstateList>({});
  const [activeAccountant, setActiveAccountant] = useState<Taccountant>();

  // -----------------------------------------------------------------------------

  // region FUNCTION

  const handle_onDragStart = (e: DragStartEvent) => {
    handleDragStart(e, setActiveAccountant);
  };

  const handle_onDragEnd = (e: DragEndEvent) => {
    handleDragEnd(e, stateList, setActiveAccountant, setStateListArr);
  };

  const handle_onDragOver = (e: DragOverEvent) => {
    handleDragOver(e, stateList, setStateListArr);
  };

  const handle_confirm = async () => {
    await onConfirm(stateList);
    setDisabled(true);
  };

  // -----------------------------------------------------------------------------

  // region props

  const sensors = useSensors(useSensor(PointerSensor));

  // -----------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setDisabled(true);
  }, [invoiceArr]);

  useEffect(() => {
    const list: TstateList = {};

    invoiceArr.forEach((invoice) => {
      const { id: invoiceId, accountantList, invoiceNumber, invoiceDate, price } = invoice;

      const orderedAccountantList = _.sortBy(accountantList, 'order');

      const accountantArr = orderedAccountantList.map((accountant) => {
        const {
          //
          id: accountantId,
          insertDate,
          importAccountingNumber,
          noteMaturityDate,
          price,
          accountsReceivableDeduction,
        } = accountant;

        return {
          id: accountantId,
          invoiceId,
          insertDate: getTaiwanDateStr(insertDate),
          importAccountingNumber,
          noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
          price: price.toLocaleString(),
          accountsReceivableDeduction,
          isRelationedInvoiceChanged: false,
        } as Taccountant;
      });

      list[invoiceId] = {
        isAccountantOrderChanged: false,
        invoice: {
          id: invoiceId,
          invoiceNumber,
          invoiceDate: getTaiwanDateStr(invoiceDate),
          price: price.toLocaleString(),
        },
        accountantArr: accountantArr,
      };
    }); // invoiceArr.forEach

    setStateListArr(list);
  }, [invoiceArr, disabled]);

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
            排序
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

        <div className={scss.dndContainer}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
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
                />
              );
            })}

            <DragOverlay>
              <Row className={scss.activeState}>
                <span>{activeAccountant?.insertDate}</span>
                <span>{activeAccountant?.importAccountingNumber}</span>
                <span>{activeAccountant?.noteMaturityDate}</span>
                <span>{activeAccountant?.price}</span>
              </Row>
            </DragOverlay>
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
              <span>20000</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>50000</span>
            </Row>
          </Right>
        </Group>

        <div className={scss.footCaption}>已開立發票未收款項</div>

        <Group className={scss['total']}>
          <Left>
            <Row>
              <span></span>
              <span>合計</span>
              <span>20000</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>50000</span>
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
}: {
  state: Tstate;
  disabled: boolean;
  activeAccountandId?: UniqueIdentifier | undefined;
}) => {
  const { invoice, accountantArr } = state;
  const { id, invoiceNumber, invoiceDate, price } = invoice;

  const dndData_group: TdndData_group = {
    isContainer: true,
    invoice,
    isEmpty: accountantArr.length === 0,
  };
  const { setNodeRef } = useDroppable({
    id: invoice.id,
    data: dndData_group,
  });

  return (
    <Group className={scss['tbody']}>
      <Left>
        <Row>
          <span>{invoiceNumber}</span>
          <span>{invoiceDate}</span>
          <span>{price}</span>
        </Row>
      </Left>
      <Right>
        {accountantArr.length === 0 && (
          <div ref={setNodeRef} className={scss.dropContainer}>
            無收款
          </div>
        )}

        <SortableContext disabled={disabled} items={accountantArr} strategy={verticalListSortingStrategy}>
          {accountantArr.map((accountant) => {
            const {
              //
              id,
              insertDate,
              importAccountingNumber,
              noteMaturityDate,
              price,
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
  accountant: Taccountant;
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
  const { invoice, accountant } = dndData;
  const { id: invoiceId } = invoice;
  const { id: accountantId } = accountant;

  const state = stateList[invoiceId];
  const { accountantArr } = state;
  const accountantIndex = accountantArr.findIndex((item) => item.id === accountantId);

  return {
    invoiceId,
    accountantIndex,
  };
};

function handleDragStart(
  e: DragStartEvent,
  setActiveState: React.Dispatch<React.SetStateAction<Taccountant | undefined>>
) {
  const { active } = e;
  const { data } = active;
  const activeAccountant = data.current?.accountant as Taccountant;
  setActiveState(activeAccountant);
}

// region handleDragEnd

function handleDragEnd(
  //
  e: DragEndEvent,
  stateList: TstateList,
  setActiveState: React.Dispatch<React.SetStateAction<Taccountant | undefined>>,
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
    state.accountantArr = arrayMove(state.accountantArr, accountantIndex_old, accountantIndex_new);
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

    const activeAccountant = (active.data.current as TdndData_row)?.accountant;

    activeAccountant.isRelationedInvoiceChanged = true;
    activeAccountant.invoiceId = invoiceId_over;

    setStateListArr((list) => {
      list = { ...list };

      const state_active = list[invoiceId_active];
      const state_over = list[invoiceId_over];

      state_active.isAccountantOrderChanged = true;
      state_over.isAccountantOrderChanged = true;

      // 必須更新，送進SortableContext的items才會更新狀態
      state_active.accountantArr = [...state_active.accountantArr];
      state_over.accountantArr = [...state_over.accountantArr];

      const accountantArr_active = state_active.accountantArr;
      const accountantArr_over = state_over.accountantArr;

      accountantArr_active.splice(accountantIndex_active, 1);
      accountantArr_over.push(activeAccountant);

      return list;
    });

    return;
  }

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

  const activeAccountant = (active.data.current as TdndData_row)?.accountant;

  activeAccountant.isRelationedInvoiceChanged = true;
  activeAccountant.invoiceId = invoiceId_over;

  setStateListArr((list) => {
    list = { ...list };
    const state_active = list[invoiceId_active];
    const state_over = list[invoiceId_over];

    state_active.isAccountantOrderChanged = true;
    state_over.isAccountantOrderChanged = true;

    // 必須更新，送進SortableContext的items才會更新狀態
    state_active.accountantArr = [...state_active.accountantArr];
    state_over.accountantArr = [...state_over.accountantArr];

    const accountantArr_active = state_active.accountantArr;
    const accountantArr_over = state_over.accountantArr;

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
