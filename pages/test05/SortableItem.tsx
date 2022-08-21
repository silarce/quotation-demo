import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props: {
  id: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,        
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100px",
    border: "solid 1px black",
    // display:"inline-block",
  };

  return (
    <button ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>{props.id}</span>
      <span>{props.id}</span>
      <span>{props.id}</span>
      <span>{props.id}</span>
    </button>
  );
}




