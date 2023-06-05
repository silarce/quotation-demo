

import MyButton from "components/global/gear/button/myButton"


import scss from "./pageHeader_mobile.module.scss"

// icon
import iconSearch from "public/image/icon/search.svg"

export default function PageHeader_mobile() {

  return (
    <div className={scss.container}>
      <div className={scss.right}>
        <MyButton label="搜尋" img={iconSearch.src}
          onClick={() => { }} />
        <MyButton label="審核人員設定" onClick={() => { }} />
      </div>
    </div>
  )
}






