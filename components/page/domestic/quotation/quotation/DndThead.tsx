import { useState, useEffect } from 'react';
import classNames from 'classnames';

// css
import scss from './dndThead.module.scss';

// --------------------
import {
  DndContext,
  // closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

// ==================================================================

import { TcellConfig } from './tbody';

// ==================================================================

export default function DndThead({
  allowMove,
  keyArr,
  cellConfigList,
  onDragEndCallback,
  resetTrigger,
  emptyBlockWidth,
}: {
  allowMove: boolean;
  keyArr: string[];
  cellConfigList: TcellConfig;
  onDragEndCallback?: (dndKeyArr: string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetTrigger?: any;
  emptyBlockWidth: string;
}) {
  const [movingKey, setMovingKey] = useState<string>();
  const [dndKeyArr, setDndKeyArr] = useState<string[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setDndKeyArr(keyArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  // ------------------------------------------------------------------
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setMovingKey(undefined);

    if (active.id !== over?.id) {
      const oldIndex = dndKeyArr.indexOf(active.id as string);
      const newIndex = dndKeyArr.indexOf(over?.id as string);

      const newKeyArr = arrayMove(dndKeyArr, oldIndex, newIndex);
      setDndKeyArr(newKeyArr);

      onDragEndCallback && onDragEndCallback(newKeyArr);

      return newKeyArr;
    }
  };

  const onDragStart = (e: DragStartEvent) => {
    const { id } = e.active;
    setMovingKey(id as string);
  };

  // ------------------------------------------------------------------
  return (
    <div className={scss.thead}>
      {/*  */}
      <div className={classNames(scss.emptyBlock)} style={{ width: emptyBlockWidth }} />
      {/*  */}
      <DndContext
        modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
        sensors={sensors}
        // collisionDetection={closestCenter}
        // modifiers={[restrictToHorizontalAxis]}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <DragOverlay dropAnimation={null} />
        <SortableContext items={dndKeyArr} strategy={horizontalListSortingStrategy}>
          {dndKeyArr.map((key, index) => {
            // const theadInfo = prodCellConfig.cellConfig[key];
            const { label, inputSelProps, theadItemClassName } = cellConfigList[key];
            const theadInfo = {
              id: key,
              label,
              width: `${inputSelProps?.wrapperStyle?.width}` ?? 'auto',
            };

            return (
              // key必須是items裡的值
              <TheadItem
                key={key}
                className={theadItemClassName}
                theadInfo={theadInfo}
                allowMove={allowMove}
                isMoving={movingKey === key}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// =======================================================================

type TtheadInfo = {
  id: string;
  label: string;
  width: string;
};

function TheadItem({
  theadInfo,
  allowMove,
  isMoving,
  className,
}: {
  theadInfo: TtheadInfo;
  allowMove?: boolean;
  isMoving?: boolean;
  className?: string;
}) {
  const { id, label, width } = theadInfo;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: allowMove ? false : true,
    // transition: {
    //   duration: 200,
    //   easing: "ease"
    // }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
  };

  // ===========================================================

  return (
    <div
      className={classNames(
        scss.theadCell,
        allowMove && scss.allowMove,
        isMoving && scss.isMoving,
        className,
        'relative'
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span>{label}</span>
    </div>
  );
}
