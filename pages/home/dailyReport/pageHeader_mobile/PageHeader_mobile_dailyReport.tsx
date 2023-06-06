
// gear
import MyButton from "components/global/gear/button/myButton"

// css
import scss from "./pageHeader_mobile_dailyReport.module.scss"

// icon
import iconSearch from "public/image/icon/search.svg"



// ====================================================================
export default function PageHeader_mobile_dailyReport(
  { doShowDrawer, editRivewerPickArr }:
    {
      doShowDrawer: () => void
      editRivewerPickArr: () => void
    }
) {

  return (
    <div className={scss.container}>
      <div className={scss.right}>
        <MyButton label="搜尋" img={iconSearch.src}
          onClick={doShowDrawer} />
        <MyButton label="審核人員設定" onClick={editRivewerPickArr} />
      </div>
    </div>
  )
}
// ====================================================================


