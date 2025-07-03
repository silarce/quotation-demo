import { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import _ from 'lodash';

// antd
import { Collapse, Drawer } from 'antd';
const { Panel } = Collapse;

// gear
import ChangePwPanel from 'components/global/gear/modal/changePwPanel';

// img
import iconMember from 'public/image/icon/member.svg';
import logo from 'public/image/logo/logo_header_mobile.png';

// icon
import iconMenu from 'public/image/icon/menu02.svg';
import iconLogout from 'public/image/icon/logout.svg';
import iconCross from 'public/image/icon/cross_hover.svg';
import iconHome from 'public/image/icon/home.svg';

// css
import scss from './header_mobile.module.scss';

// ctx
import { LayerCtx } from 'components/Layer/Layer';

// 路由表
import { sidePathList } from '../SideNav/pathList/side';

// ================================================================

export default function Header_mobile() {
  const [isShowMenu, setIsShowMenu] = useState(false);

  return (
    <div className={scss.container}>
      <Image src={logo} alt="logo" />
      <Image className={scss.iconMenu} src={iconMenu} alt="menu" onClick={() => setIsShowMenu(true)} />
      <Menu showMenu={isShowMenu} closeMenu={() => setIsShowMenu(false)} />
    </div>
  );
}

// ================================================================================

const Menu = ({ showMenu, closeMenu }: { showMenu: boolean; closeMenu: () => void }) => {
  const { reqLogout, userInfo } = useContext(LayerCtx);
  const [isShowChangePw, setIsShowChangePw] = useState(false);
  // ------
  const userName = (() => {
    if (userInfo.employee?.chName) {
      return userInfo.employee.chName;
    }

    if (userInfo.employee?.enName) {
      return userInfo.employee.enName;
    } else {
      return userInfo.username;
    }
  })();
  const departmentName = userInfo.employee?.jobs[0]?.department.name ?? '無部門';
  // ------

  const [activePanel, setActivePanel] = useState<string[]>([]);
  const checkIsActive = (key: string) => activePanel.some((theKey) => key === theKey);

  return (
    <>
      <Drawer className={scss.menu} open={showMenu} width={317} closable={false}>
        {/* close btn */}
        <Image className="absolute top-[21px] right-[26px] w-[18px]" src={iconCross} alt="close" onClick={closeMenu} />
        {/*  */}
        <div className={scss.info}>
          <Image src={iconMember} alt="avatar" />
          <div>
            <p>{userName}</p>
            <p>{departmentName}</p>
          </div>
        </div>
        {/*  */}
        <div className={scss.panel}>
          <span className={scss.left} onClick={() => setIsShowChangePw(true)}>
            變更密碼
          </span>
          <div className={scss.center} />
          <div className={scss.right} onClick={reqLogout}>
            <Image src={iconLogout} alt="logout" />
            <span>登出</span>
          </div>
        </div>
        {/*  */}

        <Collapse
          className={scss.navWrapper}
          ghost
          onChange={(v) => {
            setActivePanel(v as string[]);
          }}
        >
          <Panel header={<PanelHeader />} key="0" className={classNames({ [scss.isActive]: checkIsActive('0') })}>
            <PanelBody />
          </Panel>
        </Collapse>
      </Drawer>

      <ChangePwPanel open={isShowChangePw} onCancel={() => setIsShowChangePw(false)} />
    </>
  );
};

// ====================================================================

const PanelHeader = () => {
  return (
    <div className={classNames(scss.panelHeader)}>
      <Image src={iconHome} alt="home" />
      <span>首頁</span>
    </div>
  );
};

const PanelBody = () => {
  const router = useRouter();
  const { userErpFeature } = useContext(LayerCtx);

  const asPath = router.asPath;
  const routerQuery = router.query;

  const linkList = sidePathList['/home'];

  return (
    <div className={classNames(scss.nav, 'relative')}>
      {linkList?.list.map((item, index) => {
        const { label, path, list, erpFeature } = item;
        const reg = new RegExp(`^${path}`);
        const active = reg.test(asPath) ? scss.active : '';

        // const isPassed = checkErpFeature({ erpFeature, userErpFeature })
        // if (!isPassed) return null

        if (path) {
          return (
            <Link className={`${scss.foooooo} ${active}`} href={path} key={index}>
              {label}
            </Link>
          );
        }

        if (list) {
          return (
            <Collapse
              key={index}
              className={scss.nav}
              defaultActiveKey={[linkList.defaultCollapse || '0']}
              ghost
              onChange={() => {}}
            >
              <Panel header={label} key={`${index}`}>
                <ul>
                  {list.map((item, index) => {
                    const { label, path, erpFeature, query } = item;
                    const reg = new RegExp(`^${path}`);
                    const isActive = (() => {
                      const isMatch = _.isMatch(routerQuery, query ?? {});

                      return reg.test(asPath) && isMatch;
                    })();
                    const href = { pathname: path, query };

                    // const isPassed = checkErpFeature({ erpFeature, userErpFeature })
                    // if (!isPassed) return null
                    return (
                      <li className={classNames(scss.li, { [scss.active]: isActive })} key={index}>
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
  );
};
