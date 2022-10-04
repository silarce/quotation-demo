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
import style from "../table01.module.scss"


// type
import { Ttable01Config } from "../table01"


// =========================================================
// =========================================================
export default function DndThead
  <N extends string, I extends string>
  ({
    // productData, 
    config,
    allowMove,
    theadIndex,
    setTheadIndex }:
    {
      // productData: TfakeTable01<N, I>
      config: Ttable01Config<N, I>
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
            // const theadInfo = cellConfig[key]
            const theadInfo = config.config[key]
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
        // style={{
        //   width: "120px", height: "40px",
        //   cursor: "grabbing", transition: "0s",
        // }}
        />
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
