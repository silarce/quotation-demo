
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import style from "./theadItem.module.scss"

interface TtheadItem {
  id: number
  label: string
  width: string
}



export default function TheadItem({ theadInfo, }:
  { theadInfo: TtheadItem }) {

  const { id, label, width } = theadInfo

  const {
    attributes, listeners, setNodeRef, transform, transition
  } = useSortable({
    id,
    transition: {
      duration: 200,
      easing: "ease"
    }
  })

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    // transition: "transform 200ms ease 0s",
    transition,
    width
  }

  return (
    <div className={style.container}
      ref={setNodeRef} style={itemStyle} {...attributes} {...listeners}>
      <span>{label}</span>
    </div>
  )
}
// ==========================================================

