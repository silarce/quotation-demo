import React, { useRef, useEffect, createContext, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import style from './layer.module.scss';

// components
import Header from './Header/Header';
import Header_mobile from './Header/Header_mobile';
import SideNav from './SideNav/SideNav';
import SideNavNew from './SideNav/SideNavNew';

// type
import { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';
import { useGlobal_optionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';

// ======================================================================
export default function Layer({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const { isUseNewSideNav } = useGlobal_optionalConfig();
  const ref_main = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    ref_main.current.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={style.container}>
      <Header />
      <Header_mobile />
      <div className={style.wrapper}>
        {isUseNewSideNav ? <SideNavNew /> : <SideNav />}
        {/* main */}
        <div ref={ref_main} className={style.main}>
          {children}
        </div>
      </div>
    </div>
  );
}
