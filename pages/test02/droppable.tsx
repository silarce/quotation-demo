import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props: {
  children: ReactNode,
  id: string
}) {

  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  const style = {
    color: isOver ? 'green' : undefined,
    height: "100px",
    backgroundColor: "pink",
    border: "solid 1px black",
  };


  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}