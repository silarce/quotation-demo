import React, { createContext } from "react";

import style from "./layer.module.scss"

// components
import Header from "./Header/Header"
import SideNav from "./SideNav/SideNav";




export const LayerCtx = createContext<{ reqLogout: () => void }>(null!)

// ======================================================================
export default function Layer(
  { children, reqLogout }:
    {
      children: React.ReactNode
      reqLogout: () => void
    }) {






  return (
    <div className={style.container}>
      <LayerCtx.Provider value={{ reqLogout }}>
        <Header />
      </LayerCtx.Provider>
      <div className={style.wrapper}>
        <SideNav />
        {/* main */}
        <div className={style.main}>{children}</div>
      </div>
    </div>
  )
}


