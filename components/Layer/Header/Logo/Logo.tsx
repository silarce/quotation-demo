import Link from 'next/link';

import scss from './logo.module.scss';

// logo
import logo from 'public/image/logo/logo01.svg';

export default function Logo() {
  return (
    <Link className={scss.container} href="/home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="logo" />
      <div className={scss.title}>
        <p>ERP</p>
        <p>管理系統</p>
      </div>
      <div className={scss.redBlock} />
    </Link>
  );
}
