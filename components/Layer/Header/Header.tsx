// components
import Logo from './Logo/Logo';
import Info from './Info/Info';
import Nav from './Nav/Nav';
// css
import style from './header.module.scss';

// hooks
import { useGlobal_sideNavConfig } from 'hooks/globalState/useGlobal_sideNavConfig';

export default function Header() {
  const { useNewSideNav } = useGlobal_sideNavConfig();

  return (
    <div className={style.container}>
      <Logo />
      {useNewSideNav ? <div /> : <Nav />}
      <Info />
    </div>
  );
}
