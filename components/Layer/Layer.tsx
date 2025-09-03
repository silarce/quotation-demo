import React, { useRef, useEffect, createContext, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { useGlobal_sideNavConfig } from 'hooks/globalState/useGlobal_sideNavConfig';
import style from './layer.module.scss';

// components
import Header from './Header/Header';
import Header_mobile from './Header/Header_mobile';
import SideNav from './SideNav/SideNav';
import SideNavNew from './SideNav/SideNavNew';

// type
import { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';

// ======================================================================
export default function Layer({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();

  const ref_main = useRef<HTMLDivElement>(null!);
  const { useNewSideNav } = useGlobal_sideNavConfig();
  useEffect(() => {
    ref_main.current.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={style.container}>
      <Header />
      <Header_mobile />
      <div className={style.wrapper}>
        {useNewSideNav ? <SideNavNew /> : <SideNav />}
        {/* main */}
        <div ref={ref_main} className={style.main}>
          {children}
        </div>
      </div>
    </div>
  );
}
