import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// type
import { UrlObject } from 'url';

// css
import style from './pageHeaderFlex01.module.scss';

// type
interface Ttag {
  label: string;
  onClick: () => void;
}

interface Tlink {
  label: string;
  href: string | UrlObject;
  disabled?: boolean;
}

export default function PageHeaderFlex01({
  tagList = [],
  linkList = [],
}: {
  tagList?: Ttag[]; // 左邊的多個標籤，帶click事件
  linkList?: Tlink[]; // 左邊的標籤，不過是Link
}) {
  const [active, setActive] = useState(0);

  const router = useRouter();
  const { asPath, pathname } = router;

  return (
    <div className={style.pageHeaderFlex01}>
      <TagList />
      {/* 多個tag 附帶onClick */}
      <LinkList />
      {/* 連結 */}
    </div>
  );

  // =====================================
  // ---
  function TagList() {
    if (!tagList[0]) {
      return null;
    }

    return (
      <>
        {tagList.map((item, index) => {
          const { label, onClick } = item;

          const theOnClick = () => {
            onClick();
            setActive(index);
          };

          const isActive = active === index ? style.active : '';

          return (
            <button key={index} className={isActive} onClick={theOnClick}>
              <span>{label}</span>
              <hr className={style.bottomBar} />
            </button>
          );
        })}
      </>
    );
  }

  // ---
  function LinkList() {
    if (!linkList[0]) {
      return null;
    }

    return (
      <>
        {linkList.map((config, index) => {
          const { label, href, disabled } = config;
          let hrefPathname: string;

          if (typeof href === 'string') {
            hrefPathname = href;
          } else {
            hrefPathname = href.pathname ?? '';
          }

          const reg = new RegExp(`^${hrefPathname}`);
          const isActive = reg.test(router.pathname);

          console.log(disabled);

          if (disabled) {
            return (
              <span className={style.fakeA} key={index}>
                <span>{label}</span>
                <hr className={style.bottomBar} />
              </span>
            );
          }

          return (
            <Link className={classNames(isActive && style.active)} href={href} key={index}>
              <span>{label}</span>
              <hr className={style.bottomBar} />
            </Link>
          );
        })}
      </>
    );
  }
}
