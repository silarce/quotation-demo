import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
// css
import styled from './nav.module.scss';

// 路由表
import { topPathList } from 'components/Layer/SideNav/pathList';

// context
import { LayerCtx } from 'components/Layer/Layer';

export default function Nav() {
  const router = useRouter();
  const { userErpFeature } = useContext(LayerCtx);

  const pathname = router.pathname;

  return (
    <div className={styled.container}>
      {topPathList.map((item, index) => {
        const { icon, path01, href, label, subLabel, erpFeature } = item;
        const reg = new RegExp(`^${path01}`);
        let active = reg.test(pathname) ? styled.active : '';

        if (path01 === '/') {
          active = pathname === path01 ? styled.active : '';
        }

        const isPassed = checkErpFeature({ erpFeature, userErpFeature });

        if (!isPassed) {
          return null;
        }

        return (
          <Link className={`${styled.link} ${active}`} href={href} key={index}>
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
