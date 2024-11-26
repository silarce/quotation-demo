import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
// css
import styled from './nav.module.scss';

// 路由表
import {
  TtopPathListConfig,
  erpFeaturesLookup,
  swappedErpFeaturesLookup,
} from 'components/Layer/SideNav/pathList/type';

import { topPathList } from 'components/Layer/SideNav/pathList/top';

// context
import { LayerCtx } from 'components/Layer/Layer';

export default function Nav() {
  const router = useRouter();
  const { userErpFeature } = useContext(LayerCtx);

  const pathname = router.pathname;

  return (
    <div className={styled.container}>
      {topPathList.map((item, index) => {
        const { icon, path, href, hrefList, label, subLabel, erpFeature } = item;
        const reg = new RegExp(`^${path}`);
        let active = reg.test(pathname) ? styled.active : '';

        if (path === '/') {
          active = pathname === path ? styled.active : '';
        }

        const isPassed = checkErpFeature({ erpFeature, userErpFeature });

        if (!isPassed) {
          return null;
        }

        const userErpFeatureKeyArr = userErpFeature.map((item) => {
          return swappedErpFeaturesLookup[item.name];
        });

        let theHref: TtopPathListConfig['href'] | undefined = undefined;

        // 為了按照hrefList的順序，所以用hrefList執行forEach
        Object.keys(hrefList ?? {}).forEach((key) => {
          if (theHref) {
            return;
          }

          const href = hrefList?.[key];

          if (userErpFeatureKeyArr.includes(key)) {
            theHref = href;
          }
        });

        theHref = theHref ?? href;

        return (
          <Link className={`${styled.link} ${active}`} href={theHref} key={index}>
            <Image src={icon} alt={label + subLabel} />
            <span>{label}</span>
            {subLabel && <span>{subLabel}</span>}
          </Link>
        );
      })}
    </div>
  );
}

// ========================================
const checkErpFeature = ({
  erpFeature,
  userErpFeature,
}: {
  erpFeature: string[] | 'allPass';
  userErpFeature: { name: string }[];
}) => {
  let isPassed = false;

  if (erpFeature === 'allPass') {
    return true;
  }

  isPassed = userErpFeature.some((item1) => {
    return erpFeature.includes(item1.name);
  });

  return isPassed;
};
