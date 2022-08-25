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
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
// --------------------

// components
import TheadItem from "./dndThead/theadItem"

// css
import style from "./dndThead.module.scss"
import styleL from "../local.module.scss"

// data/hook
import { TuseProduct, Tproduct } from "../hook/useProduct"




export default function DndThead({ productStates, allowMove }:
  {
    productStates: TuseProduct
    allowMove: boolean
  }) {

  const { theadList, setTheadList } = productStates

  const items = useMemo(() => {
    return theadList.map((item) => item.id)
  }, [theadList])

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
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items}
          strategy={horizontalListSortingStrategy}
        >
          {items.map((item, index) => {
            const theadInfo = theadList[index]
            const { id } = theadInfo
            return (
              // key必須是items裡的值
              <TheadItem key={item} theadInfo={theadInfo}
                allowMove={allowMove}
                isMoving={isMoving === id}
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
      let oldIndex: number = items.indexOf(active.id as Exclude<keyof Tproduct, "component" | "accessory">);
      let newIndex: number = items.indexOf(over?.id as Exclude<keyof Tproduct, "component" | "accessory">);
      setTheadList((item) => {
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
