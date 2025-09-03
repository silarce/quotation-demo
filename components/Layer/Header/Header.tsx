// components
import Logo from './Logo/Logo';
import Info from './Info/Info';
import Nav from './Nav/Nav';
// css
import style from './header.module.scss';
import { useGlobal_optionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';

export default function Header() {
  const { isUseNewSideNav } = useGlobal_optionalConfig();

  return (
    <div className={style.container}>
      <Logo />
      {isUseNewSideNav ? <div /> : <Nav />}
      <Info />
    </div>
  );
}
