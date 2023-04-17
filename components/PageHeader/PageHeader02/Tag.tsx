


// css
import scss from "./pageHeader02.module.scss"

/** 單一tag */
export default function Tag({ tag }: { tag?: string }) {
  if (!tag) return null
  return (
    <div>
      <span>{tag}</span>
      <hr className={scss.bottomBar} />
    </div>
  )
}



