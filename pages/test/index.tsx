import { useState, MouseEvent } from 'react';

import { DndContext, DragEndEvent } from '@dnd-kit/core';

import Draggable from './draggable';
import Droppable from './droppable';




export default function Test() {

  const [isDropped, setIsDropped] = useState(false);

  const draggableMarkup = (
    <Draggable>
      <h1>Drag me</h1>
      <h1>Drag me</h1>
      <h1>Drag me</h1>
    </Draggable>
  );


  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        {!isDropped ? draggableMarkup : null}

        <Droppable>
          {isDropped ? draggableMarkup : 'Drop here'}
        </Droppable>
      </DndContext>
    </>
  )

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }
}


