import React, { createContext } from 'react';

import style from './layer.module.scss';

// components
import Header from './Header/Header';
import Header_mobile from './Header/Header_mobile';
import SideNav from './SideNav/SideNav';

// type
import { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';

type TlayerCtx = {
  reqLogout: () => void;
  userInfo: TuserDto;
  userErpFeature: TerpFeatureDto[];
};

export const LayerCtx = createContext<TlayerCtx>(null!);

// ======================================================================
export default function Layer({
  children,
  reqLogout,
  userInfo,
  userErpFeature,
}: {
  children: React.ReactNode;
  reqLogout: () => void;
  userInfo: TuserDto;
  userErpFeature: TerpFeatureDto[];
}) {
  return (
    <div className={style.container}>
      <LayerCtx.Provider value={{ reqLogout, userInfo, userErpFeature }}>
        <Header />
        <Header_mobile />
        <div className={style.wrapper}>
          <SideNav />
          {/* main */}
          <div className={style.main}>{children}</div>
        </div>
      </LayerCtx.Provider>
    </div>
  );
}
