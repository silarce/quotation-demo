import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// antd
import { Badge } from 'antd';

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
import { useGlobal_review } from 'hooks/globalState/useGlobal_review';

export default function Nav() {
  const router = useRouter();
  const { userErpFeature } = useContext(LayerCtx);
  const { reviewQty } = useGlobal_review();

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

        const isDocumentManagement = theHref.pathname.startsWith('/documentManagement');

        if (isDocumentManagement) {
          return (
            <Link className={`${styled.link} ${active} relative`} href={theHref} key={index}>
              <Image src={icon} alt={label + subLabel} />
              <span>{label}</span>
              {subLabel && <span>{subLabel}</span>}
              <Badge key={index} className={styled.badge} count={reviewQty} offset={[10, -7]}></Badge>
            </Link>
          );
        }
        // if (isDocumentManagement) {
        //   return (
        //     <Link className={`${styled.link} ${active}`} href={theHref} key={index}>
        //       <Badge key={index} count={reviewQty} offset={[10, -7]}>
        //         <Image src={icon} alt={label + subLabel} />
        //         <span>{label}</span>
        //         {subLabel && <span>{subLabel}</span>}
        //       </Badge>
        //     </Link>
        //   );
        // }

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

const Svg_exclamation = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="#ea1833"
    width="800px"
    height="800px"
    viewBox="0 0 14 14"
    role="img"
    focusable="false"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m 7.0052968,1.0051645 c -0.00159,0 -0.00371,2.648e-4 -0.0053,2.648e-4 -0.00185,0 -0.00344,-2.648e-4 -0.0053,-2.648e-4 -3.3105211,0 -5.99469681,2.6839108 -5.99469681,5.994968 0,3.3105275 2.68417571,5.9947035 5.99470311,5.9947035 0.00185,0 0.00344,0 0.0053,0 0.00159,0 0.00371,0 0.0053,0 C 10.315824,12.994836 13,10.31066 13,7.0001324 13.000265,3.6890753 10.316089,1.0051645 7.0052968,1.0051645 Z m 0,10.2734945 c -0.00159,0 -0.00371,-2.65e-4 -0.0053,-2.65e-4 -0.00185,0 -0.00344,2.65e-4 -0.0053,2.65e-4 -0.5418671,0 -0.9812403,-0.439109 -0.9812403,-0.981241 0,-0.5416024 0.4393732,-0.9807104 0.9812403,-0.9807104 0.00185,0 0.00344,0 0.0053,0 0.00159,0 0.00371,0 0.0053,0 0.5416023,0 0.9815052,0.439108 0.9815052,0.9807104 0,0.541867 -0.4391083,0.981241 -0.9815052,0.981241 z M 8.4124034,3.8013683 c -0.064092,0.9791216 -0.5116751,3.8910616 -0.5116751,3.8910616 0,0.4910175 -0.4022953,0.8888105 -0.8933127,0.8888105 -0.00265,0 -0.0053,0 -0.00768,0 -0.00238,0 -0.0053,0 -0.00768,0 -0.4907526,0 -0.8930479,-0.3983226 -0.8930479,-0.8888105 0,0 -0.4473184,-2.91194 -0.5114103,-3.8910616 -0.031781,-0.4902229 0.3437652,-1.4004856 1.4047231,-1.4004856 0.00265,0 0.0053,2.649e-4 0.00768,2.649e-4 0.00238,0 0.00503,-2.649e-4 0.00768,-2.649e-4 1.060693,0 1.4367689,0.9102627 1.404723,1.4004856 z" />
  </svg>
);
