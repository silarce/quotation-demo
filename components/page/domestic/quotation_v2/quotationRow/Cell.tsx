import { forwardRef } from 'react';

import classNames from 'classnames';

import scss from './QuotationRow.module.scss';

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
  // restrictToVerticalAxis,
  // restrictToWindowEdges,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';

type Tprops_cell = React.HTMLAttributes<HTMLDivElement> & {
  invisible?: boolean;
};

const Cell_pre = (
  {
    //
    children,
    className,
    invisible,
    ...props_cell
  }: Tprops_cell | undefined = {},
  // ref: React.ForwardedRef<HTMLDivElement> | undefined
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      ref={ref}
      {...props_cell}
      className={classNames('text-base', scss.cell, invisible && scss.invisible, className)}
    >
      {children}
    </div>
  );
};

const Cell = forwardRef(Cell_pre);

const Cell_dnd = ({
  children,
  id,
  index,
  className,
  style,
  ...rest
}: Tprops_cell & {
  index: number;
  id: UniqueIdentifier; // incomeBill id
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
    <Cell
      ref={setNodeRef}
      //
      {...rest}
      {...attributes}
      {...listeners}
      style={theStyle}
      className={classNames(isDragging && scss.isDragging, className)}
    >
      {children}
    </Cell>
  );
};

export { Cell, Cell_pre, Cell_dnd, arrayMove };
export type { Tprops_cell };
