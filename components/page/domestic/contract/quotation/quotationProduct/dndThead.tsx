import { useMemo } from "react"
// --------------------
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
// --------------------


// components
import TheadItem from "./dndThead/theadItem"

// data/hook
import { TuseProduct } from "./useProduct"



export default function DndThead({ productStates }:
  {
    productStates: TuseProduct
  }) {

  const { theadList, setTheadList, setDndProductList } = productStates

  const items = useMemo(() => {
    return theadList.map((item) => item.id)
  }, [theadList])

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items}
          strategy={horizontalListSortingStrategy}
        >
          {items.map((item, index) => {
            const theadInfo = theadList[index]
            return (
              // key必須是items裡的值
              <TheadItem key={item} theadInfo={theadInfo} />
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
    if (active.id !== over?.id) {

      let oldIndex: number = items.indexOf(active.id as number);
      let newIndex: number = items.indexOf(over?.id as number);

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

} // DndThead

// ===========================================================
// ===========================================================



