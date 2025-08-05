import React, { useRef, useEffect, createContext, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import style from './layer.module.scss';

// components
import Header from './Header/Header';
import Header_mobile from './Header/Header_mobile';
import SideNav from './SideNav/SideNav';

// type
import { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';

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
  const { pathname } = useRouter();

  const ref_main = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    ref_main.current.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={style.container}>
      <Header />
      <Header_mobile />
      <div className={style.wrapper}>
        <SideNav />
        {/* main */}
        <div ref={ref_main} className={style.main}>
          {children}
        </div>
      </div>
    </div>
  );
}
