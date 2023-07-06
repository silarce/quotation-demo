import { useState } from 'react';
// --------------------
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';

import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

// import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
// --------------------

// components
import TheadItem from './dndThead/theadItem';

// css
import style from './dndThead.module.scss';
import styleL from '../local.module.scss';

// type
import { Class_quotation } from 'hooks/quotation/useQuotation';

// =========================================================
// =========================================================
export default function DndThead({
  allowMove,
  classQuotation,
}: {
  classQuotation: Class_quotation;
  allowMove: boolean;
}) {
  const {
    mainProdCellConfig: prodCellConfig, // 格子的資訊(label, width這些)
    mainProdkeyList: theadIndex, // thead的目錄、排序
  } = classQuotation;

  const sensors = useSensors(useSensor(PointerSensor));

  // =======================================================
  const [isMoving, setIsMoving] = useState('');

  // =======================================================
  return (
    <div className={styleL.thead}>
      {/*  */}
      <div className={style.emptyBlock} />
      {/*  */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        // modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={theadIndex} strategy={horizontalListSortingStrategy}>
          {theadIndex.map((key, index) => {
            // const theadInfo = prodCellConfig.cellConfig[key];
            const theadInfo = prodCellConfig.cellConfig[key as keyof typeof prodCellConfig.cellConfig];

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
      const oldIndex: number = theadIndex.indexOf(active.id as keyof typeof prodCellConfig.cellConfig);
      const newIndex: number = theadIndex.indexOf(over?.id as keyof typeof prodCellConfig.cellConfig);
      classQuotation.mainProdkeyList = arrayMove(
        theadIndex,
        oldIndex,
        newIndex
      ) as typeof classQuotation.mainProdkeyList;
    }
  }

  function handleDragStart(e: DragStartEvent) {
    const { id } = e.active;
    setIsMoving(id as string);
  }
} // DndThead
