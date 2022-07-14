import React from "react";

import style from "./layer.module.scss"

// components
import Header from "./Header/Header"
import Side from "./SideNav/Side";

export default function Layer({ children }: { children: React.ReactNode }) {





  
  return (
    <div className={style.container}>
      {/* nav */}
      <Header />

      {/*  */}
      <div className={style.wrapper}>
        {/* sideNav */}
        <Side />
        {/* main */}
        <div className={style.main}>{children}</div>
      </div>
    </div>
  )
}


