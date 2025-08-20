import { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import _ from 'lodash';

// antd
import { Collapse, Drawer } from 'antd';

// gear
import ChangePwPanel from 'components/global/gear/modal/changePwPanel';

// img
import IconRole from 'public/image/icon/fong/role.svg';
import IconMember from 'public/image/icon/fong/member.svg';
import IconDepartment from 'public/image/icon/fong/department.svg';
import IconLogout from 'public/image/icon/fong/logout.svg';
import IconPassword from 'public/image/icon/fong/password.svg';
import logo from 'public/image/logo/logo_header_mobile.png';

// icon
import IconMenu from 'public/image/icon/fong/menu.svg';
import IconCross from 'public/image/icon/fong/cross_hover.svg';
import iconHome from 'public/image/icon/home.svg?url';
import IconLogo from 'public/image/logo/logo01.svg';
import IconWeb from 'public/image/icon/fong/web.svg';

// css
import scss from './header_mobile.module.scss';

// 路由表
import { sidePathList } from '../SideNav/pathList/side';
import Icon from '@ant-design/icons';

import { apiLogout } from 'js/api/api_auth';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

// ================================================================

export default function Header_mobile() {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const router = useRouter();

  // 預設標題
  let currentTitle = '首頁';

  // 如果路徑包含 /mobile/leaveApplication 就改成「請假作業」
  if (router.asPath.includes('/mobile/leaveApplication')) {
    currentTitle = '請假作業';
  }

  return (
    <div className={scss.container}>
      <div className="flex items-center gap-[14px]">
        <IconMenu
          className={scss.iconMenu}
          onClick={() => setIsShowMenu(true)}
          style={{ width: '48px', height: '48px' }}
        />
        {router.asPath !== '/lab/mobile/home' && <span onClick={() => router.back()}>返回</span>}
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 font-bold text-[16px]">{currentTitle}</span>
      <Link href="/lab/mobile/home" className="flex items-center">
        {/* <Image src={logo} alt="logo" /> */}
        <IconLogo style={{ width: '32px', height: '24px' }} />
      </Link>
      <Menu showMenu={isShowMenu} closeMenu={() => setIsShowMenu(false)} />
    </div>
  );
}

// ================================================================================

const Menu = ({ showMenu, closeMenu }: { showMenu: boolean; closeMenu: () => void }) => {
  const { userInfo, clear } = useGlobal_userInfo();
  const [isShowChangePw, setIsShowChangePw] = useState(false);
  // ------
  const userName = (() => {
    if (userInfo?.employee?.chName) {
      return userInfo?.employee.chName;
    }

    if (userInfo?.employee?.enName) {
      return userInfo?.employee.enName;
    } else {
      return userInfo?.username;
    }
  })();
  const departmentName = userInfo?.employee?.jobs[0]?.department.name ?? '無部門';
  // ------

  const [activePanel, setActivePanel] = useState<string[]>([]);

  const logout = async () => {
    await apiLogout();
    clear();
  };

  return (
    <>
      <Drawer className={scss.menu} open={showMenu} width="80%" closable={false} placement="left">
        {/* close btn */}
        {/* <Image
          className="absolute top-[21px] right-[26px] w-[18px] text-white"
          src={iconCross}
          alt="close"
          onClick={closeMenu}
        /> */}
        <IconCross className="absolute top-[21px] right-[26px] w-[18px] text-white" onClick={closeMenu} />
        <div className={scss.info}>
          {/* <Image src={iconMember} alt="avatar" /> */}
          <IconMember style={{ width: '56px', height: '56px', color: 'white' }} />
          <div className="flex flex-col justify-center items-start gap-6">
            <p className="flex gap-2 items-center">
              <IconMember style={{ width: '24px', height: '24px', color: 'white' }} /> {userName}
            </p>
            <p className="flex gap-2 items-center">
              <IconRole style={{ width: '24px', height: '24px', color: 'white', marginLeft: '1px' }} />
              模組管理員、一般人員
            </p>
            <p className="flex gap-2 items-center">
              <IconDepartment style={{ width: '24px', height: '24px', color: 'white' }} />
              {departmentName}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="px-4 py-2 h-[40px] flex items-center gap-2">
            <IconWeb style={{ width: '24px', height: '24px', color: '#616161' }} />
            語言切換
          </div>
          <div className="px-4 py-2 h-[40px] flex items-center gap-2">
            <IconRole style={{ width: '24px', height: '24px', color: '#616161' }} />
            身分切換
          </div>
          <div
            className="px-4 py-2 h-[40px] flex items-center gap-2 text-blue01"
            onClick={() => setIsShowChangePw(true)}
          >
            <IconPassword style={{ width: '24px', height: '24px' }} />
            變更密碼
          </div>
          <div className="px-4 py-2 h-[40px] flex items-center gap-2 text-[#EA1833]">
            <IconLogout style={{ width: '24px', height: '24px', color: '#EA1833' }} />
            登出
          </div>
        </div>

        {/* <div className={scss.panel}>
          <span className={scss.left} onClick={() => setIsShowChangePw(true)}>
            變更密碼
          </span>
          <div className={scss.center} />
          <div className={scss.right} onClick={logout}>
            <Image src={iconLogout} alt="logout" />
            <span>登出</span>
          </div>
        </div> */}

        {/* <Collapse
          className={scss.navWrapper}
          ghost
          onChange={(v) => {
            setActivePanel(v as string[]);
          }}
          items={[
            {
              key: '0',
              label: <PanelHeader />,
              children: <PanelBody />,
            },
          ]}
        /> */}
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

  const asPath = router.asPath;
  const routerQuery = router.query;

  const linkList = sidePathList['/home'];

  return (
    <div className={classNames(scss.nav, 'relative')}>
      {linkList?.list.map((item, index) => {
        const { label, path, list } = item;
        const reg = new RegExp(`^${path}`);
        const active = reg.test(asPath) ? scss.active : '';

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
              // onChange={() => {}}
              items={[
                {
                  key: `${index}`,
                  label: label,
                  children: (
                    <ul>
                      {list.map((item, index) => {
                        const { label, path, query } = item;
                        const reg = new RegExp(`^${path}`);
                        const isActive = (() => {
                          const isMatch = _.isMatch(routerQuery, query ?? {});

                          return reg.test(asPath) && isMatch;
                        })();
                        const href = { pathname: path, query };

                        return (
                          <li className={classNames(scss.li, { [scss.active]: isActive })} key={index}>
                            <Link href={href}>{label}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  ),
                },
              ]}
            />
          );
        }
      })}
    </div>
  );
};
