import { useState, forwardRef, useCallback } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

import { Tprops_cell, Cell, Cell_dnd } from './Cell';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

import scss from './QuotationRow.module.scss';

// =====================================================================

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
  horizontalListSortingStrategy,
  // verticalListSortingStrategy,
  useSortable,
  arraySwap,
} from '@dnd-kit/sortable';

import {
  //
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  // restrictToWindowEdges,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';

// =====================================================================

type TdivAttr = React.HTMLAttributes<HTMLDivElement>;

type Tprops_quotationRow = TdivAttr & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  props_left?: TdivAttr;
  props_center?: TdivAttr;
  props_right?: TdivAttr;
  isActive?: boolean;

  dragHandle?: React.HTMLAttributes<HTMLDivElement>;
  dragHandleInvisible?: boolean;
};

type Tprops_quotationRow_dndThead = Omit<Tprops_quotationRow, 'onDragEnd'> & {
  disabled: boolean;
  keyArr: string[];
  configDict: {
    [key: string]:
      | undefined
      | {
          label: React.ReactNode;
          style?: React.CSSProperties;
        };
  };
  onDragEnd: (props: {
    active: {
      id: UniqueIdentifier;
      index: number;
    };
    over: {
      id: UniqueIdentifier;
      index: number;
    };
    move: <A extends any[]>(arr: A) => A;
  }) => void;
};

type Tprops_table_dnd = Omit<TdivAttr, 'onDragEnd'> & {
  items: UniqueIdentifier[];
  onDragEnd: (props: {
    active: {
      id: UniqueIdentifier;
      index: number;
    };
    over: {
      id: UniqueIdentifier;
      index: number;
    };
    move: <A extends any[]>(arr: A) => A;
  }) => void;
};

// =====================================================================

// MARK:QuotationRow
const QuotationRow_pre = (
  {
    children,
    className,
    left,
    right,
    props_left,
    props_center,
    props_right,
    dragHandle,
    dragHandleInvisible,
    isActive,
    ...props_row
  }: Tprops_quotationRow | undefined = {},
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      //
      ref={ref}
      {...props_row}
      className={classNames(scss.row, isActive, isActive && scss.active, className)}
    >
      {(left || dragHandle || dragHandleInvisible) && (
        <div {...props_left} className={classNames(scss.left, props_left?.className)}>
          {(dragHandle || dragHandleInvisible) && (
            <Cell
              //
              {...dragHandle}
              className={classNames(dragHandleInvisible && 'invisible', dragHandle?.className)}
            >
              <Image src={iconMove} alt="move" />
            </Cell>
          )}
          {left}
        </div>
      )}
      <div {...props_center} className={classNames(scss.center, props_center?.className)}>
        {children}
      </div>
      {right && (
        <div {...props_right} className={classNames(scss.right, props_right?.className)}>
          {right}
        </div>
      )}
    </div>
  );
};

const QuotationRow = forwardRef(QuotationRow_pre);

// =====================================================================

function QuotationRow_dndThead({
  disabled,
  keyArr,
  configDict,
  onDragEnd,
  className,
  //
  ...props_quotationRow
}: Tprops_quotationRow_dndThead) {
  return (
    <QuotationRow {...props_quotationRow} className={classNames(scss.row_dndThead, className)}>
      <DndContext
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={(e) => {
          const index = e.active.data.current?.index as number | undefined;
        }}
        onDragEnd={(e) => {
          const { active, over } = e;

          if (!over) {
            return;
          }

          const { id: activeId, data: activeData } = active;
          const activeIndex = activeData.current?.index as number;

          const { id: overId, data: overData } = over;
          const overIndex = overData.current?.index as number;

          onDragEnd({
            active: {
              id: activeId,
              index: activeIndex,
            },
            over: {
              id: overId,
              index: overIndex,
            },
            move<A extends any[]>(arr: A) {
              return arrayMove(arr, activeIndex, overIndex) as A;
            },
          });
        }}
      >
        <SortableContext disabled={disabled} items={keyArr} strategy={horizontalListSortingStrategy}>
          {keyArr.map((key, index) => {
            const { label = key, style } = configDict[key] ?? {};

            return (
              <Cell_dnd
                key={key}
                id={key}
                index={index}
                style={style}
                className={classNames(
                  //
                  scss.cell_dnd,
                  disabled && scss.disabled,
                  'text-lg text-main'
                )}
              >
                {label}
              </Cell_dnd>
            );
          })}
        </SortableContext>
      </DndContext>
    </QuotationRow>
  );
}

// =====================================================================

const QuotationRow_dnd = ({
  children,
  id,
  index,
  className,
  style,
  ...props_quotationRow
}: Tprops_quotationRow & {
  index: number;
  id: UniqueIdentifier;
}) => {
  const {
    //
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      id,
      index,
    },
  });
  const theStyle = {
    // transform: CSS.Transform.toString(transform),
    transform: CSS.Translate.toString(transform),
    transition,
    ...style,
  };

  return (
    <QuotationRow
      //
      ref={setNodeRef}
      {...props_quotationRow}
      dragHandle={{
        ...attributes,
        ...listeners,
      }}
      style={theStyle}
      className={classNames(isDragging && scss.isDragging, className)}
    >
      {children}
    </QuotationRow>
  );
};

const Table_dnd = ({
  //
  items,
  children,
  onDragEnd,
  // rowArr,
  ...props_table_dnd
}: Tprops_table_dnd) => {
  return (
    <div {...props_table_dnd}>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragStart={(e) => {
          const index = e.active.data.current?.index as number | undefined;
        }}
        onDragEnd={(e) => {
          const { active, over } = e;

          if (!over) {
            return;
          }

          const { id: activeId, data: activeData } = active;
          const activeIndex = activeData.current?.index as number;

          const { id: overId, data: overData } = over;
          const overIndex = overData.current?.index as number;

          onDragEnd({
            active: {
              id: activeId,
              index: activeIndex,
            },
            over: {
              id: overId,
              index: overIndex,
            },
            move<A extends any[]>(arr: A) {
              return arrayMove(arr, activeIndex, overIndex) as A;
            },
          });
        }}
      >
        <SortableContext items={items}>{children}</SortableContext>
      </DndContext>
    </div>
  );
};

// =====================================================================
export {
  //
  QuotationRow,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
  //
  arrayMove,
};
