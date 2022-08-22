
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import style from "./theadItem.module.scss"

interface TtheadItem {
  id: string
  label: string
  width: string
}



export default function TheadItem({ theadInfo, allowMove, isMoving }:
  {
    theadInfo: TtheadItem
    allowMove?: boolean
    isMoving?: boolean
  }) {

  const { id, label, width } = theadInfo

  const {
    attributes, listeners, setNodeRef, transform, transition
  } = useSortable({
    id,
    disabled: allowMove ? false : true
    // transition: {
    //   duration: 200,
    //   easing: "ease"
    // }
  })

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    width
  }

  // ===========================================================
  const lwhbReg = /L|W|H|B/

  const styleAllowMove = allowMove ? style.allowMove : ""
  const styleIsMoving = isMoving ? style.isMoving : ""
  const styleIsCentewr = lwhbReg.test(id) ? style.textCenter : ""

  return (
    <div className={`
    ${style.container} ${styleAllowMove} 
    ${styleIsMoving} ${styleIsCentewr}
    `}
      ref={setNodeRef} style={itemStyle} {...attributes} {...listeners}      >
      <span>{label}</span>
    </div>
  )
}
// ==========================================================

