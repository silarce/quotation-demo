
// components
import Logo from "./Logo/Logo"
import Info from "./Info/Info"
import Nav from "./Nav/Nav"
// css
import style from "./header.module.scss"




export default function Header() {

  return (
    <div className={style.container}>
      <Logo />
      <Nav />
      <Info />
    </div>
  )
}