import { useState } from 'react';
import classNames from 'classnames';
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

import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

// import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
// --------------------

// components
import TheadItem from './dndThead/theadItem';

// css
import style from './dndThead.module.scss';
import styleL from '../local.module.scss';
// type
import { Class_legacyContract } from 'hooks/quotation/useLegacyContract';

// =========================================================
// =========================================================
export default function DndThead({
  allowMove,
  classQuotation,
  isAppend,
  isExchange,
}: {
  classQuotation: Class_legacyContract;
  allowMove: boolean;
  isAppend?: boolean;
  isExchange?: boolean;
}) {
  const cellConfig = classQuotation.prodCellConfig.cellConfig;
  // const theadIndex = isExchange ? classQuotation.exProdKeyLArr : classQuotation.prodkeyArr;
  const theadIndex = isExchange
    ? classQuotation.exProdKeyArr
    : isAppend
    ? classQuotation.prodkeyArr
    : classQuotation.editProdKeyArr;

  const sensors = useSensors(useSensor(PointerSensor));

  // =======================================================
  const [isMoving, setIsMoving] = useState('');

  // =======================================================
  return (
    <div className={styleL.thead}>
      {/*  */}
      <div className={classNames(style.emptyBlock, isAppend && style.append, isExchange && style.exchange)} />
      {/*  */}
      <DndContext
        modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
        sensors={sensors}
        // collisionDetection={closestCenter}
        // modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={theadIndex} strategy={horizontalListSortingStrategy}>
          {theadIndex.map((key, index) => {
            // const theadInfo = prodCellConfig.cellConfig[key];

            const { id, label, inputSelProps } = cellConfig[key as keyof typeof cellConfig];

            const theadInfo = {
              id,
              label,
              width: `${inputSelProps?.wrapperStyle?.width}` ?? 'auto',
            };

            return (
              // key必須是items裡的值
              <TheadItem key={key} theadInfo={theadInfo} allowMove={allowMove} isMoving={isMoving === key} />
            );
          })}
        </SortableContext>
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </div>
  );

  // ============================================
  // function handleDragEnd(e: DragEndEvent) {
  //   const { active, over } = e
  //   setIsMoving("")
  //   if (active.id !== over?.id) {
  //     let oldIndex: number =
  //       theadIndex.
  //         indexOf(active.id as typeof theadIndex[number]);
  //     let newIndex: number = theadIndex.indexOf(over?.id as typeof theadIndex[number]);
  //     classQuotation.mainProdkeyList = arrayMove(theadIndex, oldIndex, newIndex)
  //   }
  // }
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setIsMoving('');

    if (active.id !== over?.id) {
      const oldIndex: number = theadIndex.indexOf(active.id as keyof typeof cellConfig);
      const newIndex: number = theadIndex.indexOf(over?.id as keyof typeof cellConfig);

      if (isAppend) {
        classQuotation.prodkeyArr = arrayMove(theadIndex, oldIndex, newIndex) as typeof classQuotation.prodkeyArr;
      } else if (isExchange) {
        classQuotation.exProdKeyArr = arrayMove(theadIndex, oldIndex, newIndex) as typeof classQuotation.prodkeyArr;
        console.log(classQuotation.exProdKeyArr);
      } else {
        classQuotation.editProdKeyArr = arrayMove(theadIndex, oldIndex, newIndex) as typeof classQuotation.prodkeyArr;
      }
    }
  }

  function handleDragStart(e: DragStartEvent) {
    const { id } = e.active;
    setIsMoving(id as string);
  }
} // DndThead
