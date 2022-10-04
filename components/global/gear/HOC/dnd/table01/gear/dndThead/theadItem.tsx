
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// css
import style from "../../table01.module.scss"

import { Tconfig } from "config/dndCellConfig"


export default function TheadItem({ theadInfo, allowMove, isMoving }:
  {
    theadInfo: Tconfig
    allowMove?: boolean
    isMoving?: boolean
  }) {

  const { id, label, width, position } = theadInfo

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
  const styleAllowMove = allowMove ? style.allowMove : ""
  const styleIsMoving = isMoving ? style.isMoving : ""

  const styleIsCentewr = position === "center" ? style.textCenter : ""

  return (
    <div className={`${style.theadItem} ${styleAllowMove} ${styleIsMoving} ${styleIsCentewr}`}
      ref={setNodeRef} style={itemStyle} {...attributes} {...listeners}      >
      <span>{label}</span>
    </div>
  )
}
// ==========================================================

