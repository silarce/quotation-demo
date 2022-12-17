// ERP操作權限
// ERP操作權限
// ERP操作權限


import { useState } from "react"

// component
import Header from "components/page/setting/hrManage/header/header"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"


import scss from "./erpCtrlPermissions.module.scss"






export default function ErpCtrlPermissions() {



  return (
    <div className={scss.container}>
      <div className={scss.header}>
        <Header />
        <div className={scss.countBox}>
          <span>已加入人數 / 操作人數上限 :</span>
          <span className={scss.numerator}>9</span>
          <span> / 30</span>
        </div>
      </div>

      <div className={scss.mainContainer}>
        <div>

          
        </div>
      </div>


    </div>
  )
}







