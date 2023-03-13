import {
  Dispatch, SetStateAction,
  useState, useMemo
} from "react"
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
import style from "../dndTable01.module.scss"


// type
import { Ttable01Config } from "../dndTable01"
import { TdndCellConfigKeys } from "config/dndCellConfig"

// config
import { dndCellConfigOri } from "config/dndCellConfig"
const dndCellConfig = dndCellConfigOri()


// =========================================================
// =========================================================
export default function DndThead
  <N extends TdndCellConfigKeys, I extends TdndCellConfigKeys>
  ({
    allowMove,
    theadIndex,
    setTheadIndex
  }:
    {
      allowMove: boolean
      theadIndex: (N | I)[]
      setTheadIndex: Dispatch<SetStateAction<(N | I)[]>>
    }) {

  // thead的目錄、排序
  // const { theadIndex, setTheadIndex } = productData
  const sensors = useSensors(
    useSensor(PointerSensor),
  )

  // =======================================================
  const [isMoving, setIsMoving] = useState("")
  // =======================================================
  return (
    <div className={style.dndThead}>
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
            const theadInfo = dndCellConfig[key]
            return (
              // key必須是items裡的值
              <TheadItem<typeof key> key={key} theadInfo={theadInfo}
                allowMove={allowMove}
                isMoving={isMoving === key}
              />
            )
          })}
        </SortableContext>
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </div>
  )
  // ============================================
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setIsMoving("")
    if (active.id !== over?.id) {
      let oldIndex: number = theadIndex.indexOf(active.id as (N | I));
      let newIndex: number = theadIndex.indexOf(over?.id as (N | I));
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
