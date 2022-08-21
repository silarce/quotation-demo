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

  const { theadList, setTheadList, dndProductList,setDndProductList } = productStates


  // 長的像這樣[1,2,3,4,5,6,7, ...]
  const [items, setItems] = useState(theadList.map((item) => item.id))
  // const [items, setItems] = useState(theadList.map((item) => item.id))

  // const items = useMemo(() => {
  //   return theadList.map((item) => item.id)
  // }, [theadList])


  console.log(items)
  console.log(theadList)
  console.log(dndProductList[0])

  // console.log(itemsFoo)
  // console.log(theadList)

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

      // let oldIndex: number;
      // let newIndex: number;
      let oldIndex: number = items.indexOf(active.id as number);
      let newIndex: number = items.indexOf(over?.id as number);

      // setTheadList((listItem) => {
      //   oldIndex = items.indexOf(active.id as number)
      //   newIndex = items.indexOf(over?.id as number)
      //   return arrayMove(listItem, oldIndex, newIndex)
      // })

      setItems((items) => {
        // oldIndex = items.indexOf(active.id as number)
        // newIndex = items.indexOf(over?.id as number)
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



