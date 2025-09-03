import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from 'lodash';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import IconCircle from 'public/image/icon/fong/circle.svg';
import IconFillCircle from 'public/image/icon/fong/fillCircle.svg';
import { MenuItem } from 'components/page/organization/system/menu/type';

// antd
import { Collapse } from 'antd';

// css
import style from './sideNavNew.module.scss';

// hooks
import { useNavStore } from 'components/page/organization/system/menu/navStore';

export default function SideNav() {
  const router = useRouter();
  const { sideNav } = useNavStore();

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [activePathIds, setActivePathIds] = useState<string[]>([]);

  const pathname = router.pathname;

  // 遞迴找 router active 鏈路
  const findActivePath = useCallback((menus: MenuItem[], pathname: string): string[] => {
    let bestMatch: string[] = [];

    for (const menu of menus) {
      if (menu.menu_url && pathname.startsWith(menu.menu_url)) {
        const childPath = menu.children ? findActivePath(menu.children, pathname) : [];
        const fullPath = [menu.menu_id, ...childPath];

        if (fullPath.length > bestMatch.length) {
          bestMatch = fullPath;
        }
      } else if (menu.children?.length) {
        const childPath = findActivePath(menu.children, pathname);

        if (childPath.length > bestMatch.length) {
          bestMatch = [menu.menu_id, ...childPath];
        }
      }
    }

    return bestMatch;
  }, []);

  const renderMenu = (menu: MenuItem, pathname: string) => {
    if (menu.children && menu.children.length > 0) {
      const isExpanded = expandedKeys.includes(menu.menu_id);

      return (
        <Collapse
          key={menu.menu_id}
          className={classNames(
            style.collapse,
            menu.level === 1 && style.topCollapse,
            menu.level === 2 && style.level2
          )}
          ghost
          expandIcon={() => null}
          activeKey={isExpanded ? [menu.menu_id] : []}
          onChange={() => {
            setExpandedKeys((prev) =>
              prev.includes(menu.menu_id) ? prev.filter((id) => id !== menu.menu_id) : [...prev, menu.menu_id]
            );
          }}
          items={[
            {
              key: menu.menu_id,
              label: (
                <div
                  className={classNames(style.headerContent, {
                    [style.activeFirst]: activePathIds.includes(menu.menu_id) && menu.level === 1,
                    [style.activeSecond]: activePathIds.includes(menu.menu_id) && menu.level === 2,
                  })}
                >
                  <div className="flex items-center gap-2">
                    {menu.level === 2 &&
                      (activePathIds.includes(menu.menu_id) ? (
                        <IconFillCircle className={style.iconCircle} />
                      ) : (
                        <IconCircle className={style.iconCircle} />
                      ))}
                    <span>{menu.menu_name}</span>
                  </div>

                  <span className={style.customArrow}>{isExpanded ? <DownOutlined /> : <RightOutlined />}</span>
                </div>
              ),
              children: (
                <ul>{menu.children?.filter((child) => child.is_enable).map((child) => renderMenu(child, pathname))}</ul>
              ),
            },
          ]}
        />
      );
    } else {
      return (
        <li
          key={menu.menu_id}
          className={classNames(style.menuItem, {
            [style.activeThird]: activePathIds.includes(menu.menu_id) && menu.level === 3,
            [style.level3]: menu.level === 3,
            [style.level2Leaf]: menu.level === 2,
          })}
        >
          <Link href={menu.menu_url ?? '#'}>{menu.menu_name}</Link>
        </li>
      );
    }
  };

  useEffect(() => {
    if (sideNav.length > 0) {
      const pathIds = findActivePath(sideNav, pathname);
      setActivePathIds(pathIds);
      setExpandedKeys((prev) => _.uniq([...prev, ...pathIds])); // router 的一定展開
    }
  }, [pathname, sideNav, findActivePath]);

  return (
    <div className={style.wrapper}>
      <div className={classNames(style.sideNav, 'relative')}>{sideNav.map((menu) => renderMenu(menu, pathname))}</div>
    </div>
  );
}
