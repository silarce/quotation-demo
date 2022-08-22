import {
  Dispatch, SetStateAction,
  useState
} from "react"
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
import { TtheadItem } from "./useProduct"


export default function DndThead({ theadList, setDndProductList }:
  {
    theadList: TtheadItem[]
    setDndProductList: Dispatch<SetStateAction<string[][]>>
  }) {

  // 長的像這樣[1,2,3,4,5,6,7, ...]
  const [items, setItems] = useState(theadList.map((item) => item.id))


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
          {items.map((item) => {
            const theadInfo = theadList[item - 1]
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

      let oldIndex: number;
      let newIndex: number;

      setItems((items) => {
        oldIndex = items.indexOf(active.id as number)
        newIndex = items.indexOf(over?.id as number)
        return arrayMove(items, oldIndex, newIndex)
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



