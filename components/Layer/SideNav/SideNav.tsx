import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from 'lodash';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from './side.module.scss';

// 路由表
import { sidePathList } from './pathList/side';

// context
import { LayerCtx } from '../Layer';
import { TuserDto } from 'js/api/dtoTypes';

export default function SideNav() {
  const router = useRouter();
  const { userErpFeature, userInfo } = useContext(LayerCtx);

  // -------------------------------------------------------------------
  // pathname與route在404的時候值是"_error"
  // 會導致無法取到路由表的值
  const pathname = router.pathname;
  const parentPath = '/' + pathname.split('/')[1];
  const routerQuery = router.query;
  const linkList = sidePathList[parentPath];
  // -------------------------------------------------------------------

  return (
    <div className={style.wrapper}>
      <div className={classNames(style.sideNav, 'relative')}>
        {linkList?.list.map((item, index) => {
          const { label, path, list, erpFeature, otherPermissions, activeChecker } = item;

          let isActive = pathname.startsWith(path ?? 'undefined');

          if (activeChecker) {
            isActive = activeChecker({ router });
          }

          let isPassed = false;
          isPassed = checkErpFeature({ erpFeature, userErpFeature });

          if (isPassed && otherPermissions) {
            isPassed = checkOtherPermissions({ userInfo, otherPermissions });
          }

          if (!isPassed) {
            return null;
          }

          if (path) {
            return (
              <Link className={classNames(style.option, isActive && style.active)} href={path} key={index}>
                {label}
              </Link>
            );
          }

          if (list) {
            return (
              <Collapse
                key={index}
                className={style.collapse}
                defaultActiveKey={[linkList.defaultCollapse || '0']}
                ghost
              >
                <Panel header={label} key={`${index}`}>
                  <ul>
                    {list.map((item, index) => {
                      const {
                        //
                        label,
                        path,
                        erpFeature,
                        query,
                        otherPermissions,
                        exception,
                        activeChecker,
                      } = item;

                      let isActive = pathname.startsWith(path);

                      if (activeChecker) {
                        isActive = activeChecker({ router });
                      } else if (query) {
                        isActive = _.isMatch(routerQuery, query ?? {});
                      }

                      const href = { pathname: path, query };

                      let isPassed = false;
                      isPassed = checkErpFeature({ erpFeature, userErpFeature });

                      if (isPassed && otherPermissions) {
                        isPassed = checkOtherPermissions({ userInfo, otherPermissions, exception });
                      }

                      if (!isPassed) {
                        return null;
                      }

                      return (
                        <li className={classNames({ [style.active]: isActive })} key={index}>
                          <Link href={href}>{label}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              </Collapse>
            );
          }
        })}
      </div>
      <div>　v{process.env.DEPLOY_TIME}</div>
    </div>
  );
}

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

const checkOtherPermissions = ({
  userInfo,
  otherPermissions,
  exception,
}: {
  userInfo: TuserDto;
  otherPermissions: {
    grade?: number;
  };
  exception?: {
    idNumber?: string[];
  };
}) => {
  // -------------------------------------------------------
  // -------------------------------------------------------
  if (exception) {
    const { idNumber } = exception;

    if (idNumber && idNumber.includes(userInfo?.employee?.idNumber ?? '')) {
      return true;
    }
  }
  // -------------------------------------------------------
  // -------------------------------------------------------

  let isPassed = false;
  const { grade } = otherPermissions;

  const { jobs } = userInfo?.employee ?? {};

  // -------------------------
  if (grade) {
    const highestGrade = (() => {
      if (jobs) {
        const sortedJobs = _.sortBy(jobs, 'grade').reverse();

        return sortedJobs[0]?.grade ?? null;
      }

      return null;
    })();

    if (highestGrade && highestGrade >= grade) {
      isPassed = true;
    }
  }
  // -------------------------

  return isPassed;
};
