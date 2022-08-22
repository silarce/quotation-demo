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

import style from "./dndThead.module.scss"

// data/hook
import { TuseProduct } from "./useProduct"
import { Divider } from "antd"



export default function DndThead({ productStates, allowMove }:
  {
    productStates: TuseProduct
    allowMove: boolean
  }) {

  const { theadList, setTheadList, setDndProductList } = productStates

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
    <div >
      <div className={style.emptyBlock} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        // modifiers={[restrictToHorizontalAxis]}
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
            width: "100px", height: "20px", cursor: "grabbing",
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

      let oldIndex: number = items.indexOf(active.id);
      let newIndex: number = items.indexOf(over?.id as number | string);

      setTheadList((item) => {
        return arrayMove(item, oldIndex, newIndex)
      })

      setDndProductList(list => {
        const newList = list.map((item) => {
          return arrayMove(item, oldIndex, newIndex)
        })
        return newList
      })
    }
  }

  function handleDragStart(e: DragStartEvent) {
    const { id } = e.active
    setIsMoving(id as string)
    // document.getElementById("__next")?.addEventListener("mouseUp", () => alert("trest"))
    // document.body.addEventListener("click",()=>{alert("test")})
    // window.addEventListener("onMouseUp",()=>{alert("test")})
  }

} // DndThead  




// ===========================================================
// ===========================================================


// document.body.addEventListener("click",()=>{alert("test")})

// document.getElementById("__next")?.addEventListener("mouseUp",()=>alert("trest"))
