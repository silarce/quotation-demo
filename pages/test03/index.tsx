import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';

import { SortableItem } from './SortableItem';

export default function App() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // console.log(items)

  const fooCss = {
    width: "100%",
    // width: "fit-content",
    // overflow: "auto",
    // whiteSpace: "nowrap",

  }

  return (
    <div style={fooCss}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          // strategy={verticalListSortingStrategy}
          strategy={horizontalListSortingStrategy}
        >
          {items.map(id => <SortableItem key={id} id={id} />)}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log(event)

    if (active.id !== over?.id) {
      setItems((items) => {

        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over?.id as number);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}






// For most sortable lists, we recommend you use a DragOverlay if your sortable list is
// scrollable or if the contents of the scrollable list are taller than the viewport of the window.
//  Check out the sortable drag overlay guide below to learn more.