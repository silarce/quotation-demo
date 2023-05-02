import classNames from "classnames"


// css
import scss from "./pageHeader02.module.scss"

/** 單一tag */
export default function Tag(
  { tag,
    className
  }: {
    tag?: string
    className?: string
  }
) {
  if (!tag) return null
  return (
    <div className={classNames(className)}>
      <span>{tag}</span>
      <hr className={scss.bottomBar} />
    </div>
  )
}



