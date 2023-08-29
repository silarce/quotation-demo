import { useState, useEffect } from 'react';
import _ from 'lodash';

// dnd
import {
  // DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  // DraggableAttributes,
} from '@dnd-kit/core';

import {
  arrayMove,
  // SortableContext,
  // horizontalListSortingStrategy,
  // verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// import {
//   restrictToVerticalAxis,
//   //  restrictToHorizontalAxis, restrictToWindowEdges
// } from '@dnd-kit/modifiers';

// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

const useVerticalDnd = (listKeyArr: string[]) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const [movingId, setMovingId] = useState<string>();

  const [dndKeyArr, setDndKeyArr] = useState<string[]>([]);

  useEffect(() => {
    // const newArr = Object.keys(addiExchangeList);
    const newArr = listKeyArr;

    if (newArr.length > dndKeyArr.length) {
      const newKeyArr = _.difference(newArr, dndKeyArr);
      setDndKeyArr([...dndKeyArr, ...newKeyArr]);
    }

    if (newArr.length < dndKeyArr.length) {
      const delDndKey = _.difference(dndKeyArr, newArr)[0];
      const delIndex = dndKeyArr.indexOf(delDndKey);
      dndKeyArr.splice(delIndex, 1);
      setDndKeyArr([...dndKeyArr]);
    }
  }, [listKeyArr.length]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = dndKeyArr.indexOf(active.id as string);
      const newIndex = dndKeyArr.indexOf(over?.id as string);

      const newKeyArr = arrayMove(dndKeyArr, oldIndex, newIndex);
      setDndKeyArr(newKeyArr);
    }

    setMovingId(undefined);
  };

  function onDragStart(e: DragStartEvent) {
    const { id } = e.active;
    setMovingId(id as string);
  }

  return {
    sensors,
    dndKeyArr,
    movingId,
    onDragEnd,
    onDragStart,
  };
};

export { useVerticalDnd };
