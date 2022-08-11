import React from "react";

import style from "./layer.module.scss"

// components
import Header from "./Header/Header"
import SideNav from "./SideNav/SideNav";

export default function Layer({ children }: { children: React.ReactNode }) {






  return (
    <div className={style.container}>
      <Header />
      <div className={style.wrapper}>
        <SideNav />
        {/* main */}
        <div className={style.main}>{children}</div>
      </div>
    </div>
  )
}


