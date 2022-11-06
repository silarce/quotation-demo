import { useState, useMemo } from "react"
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
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

// import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
// --------------------

// components
import TheadItem from "./dndThead/theadItem"

// css
import style from "./dndThead.module.scss"
import styleL from "../local.module.scss"

// data hook type config
import { TuseProduct, Tproduct } from "../hook/useProduct"
import type { TuseProduct_new } from "../hook/useProduct_new"
// 格子的設定
// import { prodCellConfigOri } from "fakeDatabase/domestic/quotation/fakeQuotProductionList_new"
import { prodCellConfigOri } from "../hook/useProduct_new"
const { cellConfig } = prodCellConfigOri()


// =========================================================
// =========================================================
export default function DndThead({ productStates, allowMove }:
  {
    productStates: TuseProduct_new
    allowMove: boolean
  }) {

  // thead的目錄、排序
  const { theadIndex, setTheadIndex } = productStates
  const sensors = useSensors(
    useSensor(PointerSensor),
  )

  // =======================================================
  const [isMoving, setIsMoving] = useState("")
  // =======================================================
  return (
    <div className={styleL.thead}>
      <div className={style.emptyBlock} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        // modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={theadIndex}
          strategy={horizontalListSortingStrategy}
        >
          {theadIndex.map((key, index) => {
            const theadInfo = cellConfig[key]
            return (
              // key必須是items裡的值
              <TheadItem key={key} theadInfo={theadInfo}
                allowMove={allowMove}
                isMoving={isMoving === key}
              />
            )
          })}
        </SortableContext>
        <DragOverlay dropAnimation={null}
          // 為了讓滑鼠再拖移時保持cursor:"grabbing"而設這個style
          style={{
            width: "120px", height: "40px",
            cursor: "grabbing", transition: "0s",
          }}
        />
      </DndContext>
    </div>
  )
  // ============================================
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setIsMoving("")
    if (active.id !== over?.id) {
      let oldIndex: number = theadIndex.indexOf(active.id as Exclude<keyof Tproduct, "component" | "accessory" | "quoteTypeType">);
      let newIndex: number = theadIndex.indexOf(over?.id as Exclude<keyof Tproduct, "component" | "accessory" | "quoteTypeType">);
      setTheadIndex((item) => {
        return arrayMove(item, oldIndex, newIndex)
      })
    }
  }

  function handleDragStart(e: DragStartEvent) {
    const { id } = e.active
    setIsMoving(id as string)
  }

} // DndThead  


// ===========================================================
// ===========================================================
