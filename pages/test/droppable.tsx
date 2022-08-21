import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props: {
  children: ReactNode
}) {

  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    color: isOver ? 'green' : undefined,
    height: "300px",
    backgroundColor: "pink",

  };


  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}