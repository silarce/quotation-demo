import { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Draggable(props:
  {
    children: ReactNode,
    id: string
  }) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  // const style = transform ? {
  //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  // } : undefined;

  // Within your component that receives `transform` from `useDraggable`:
  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: "gray",
  }


  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}