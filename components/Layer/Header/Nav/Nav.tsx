import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// antd
import { Badge } from 'antd';

// css
import scss from './nav.module.scss';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

// 路由表
import { TtopPathListConfig, swappedErpFeaturesLookup } from 'components/Layer/SideNav/pathList/type';

import { topPathList } from 'components/Layer/SideNav/pathList/top';

// context

import { useGlobal_review } from 'hooks/globalState/useGlobal_review';

export default function Nav() {
  const router = useRouter();
  const { userErpFeature } = useGlobal_userInfo();
  const { reviewQty } = useGlobal_review();

  const pathname = router.pathname;

  return (
    <div className={scss.container}>
      {topPathList.map((item, index) => {
        const { icon, path, href, hrefList, label, subLabel, erpFeature } = item;
        const reg = new RegExp(`^${path}`);
        let active = reg.test(pathname) ? scss.active : '';

        if (path === '/') {
          active = pathname === path ? scss.active : '';
        }

        const isPassed = checkErpFeature({ erpFeature, userErpFeature });

        if (!isPassed) {
          return null;
        }

        const userErpFeatureKeyArr = (userErpFeature ?? []).map((item) => {
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

        const isDocumentManagement = theHref.pathname.startsWith('/documentManagement');

        if (isDocumentManagement) {
          return (
            <Link className={`${scss.link} ${active} flex items-center relative`} href={theHref} key={index}>
              <Image src={icon} alt={label + subLabel} />
              <span>{label}</span>

              {reviewQty && (
                <Badge key={reviewQty} className={scss.badge}>
                  <span className={scss.reviewQty}>{reviewQty}</span>
                </Badge>
              )}
            </Link>
          );
        }

        return (
          <Link className={`${scss.link} ${active} flex items-center`} href={theHref} key={index}>
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
  userErpFeature: { name: string }[] | undefined | null;
}) => {
  let isPassed = false;

  if (erpFeature === 'allPass') {
    return true;
  }

  isPassed = !userErpFeature
    ? false
    : userErpFeature.some((item1) => {
        return erpFeature.includes(item1.name);
      });

  return isPassed;
};
