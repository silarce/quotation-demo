import Link from 'next/link';
import { useRouter } from 'next/router';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from "./side.module.scss"

// 路由表
import sidePathList from './pathList';

export default function SideNav() {
  const router = useRouter()
  const pathname = router.pathname
  const parentPath = "/" + pathname.split("/")[1]

  let linkList = sidePathList[parentPath]


  return (
    <div className={style.container}>
      {linkList?.list.map((item, index) => {
        const { label, path, list } = item
        const reg = new RegExp(`^${path}`)
        let active = reg.test(pathname) ? style.active : ""
        if (path) {
          return (
            <Link href={path} key={index}>
              <a className={`${style.option} ${active}`} key={index}>{label}</a>
            </Link>
          )
        }
        if (list) {
          return (
            <Collapse key={index} className={style.collapse}
              defaultActiveKey={[linkList.defaultCollapse || "0"]} ghost
              // defaultActiveKey={['0']}  ghost
              onChange={() => { }}>
              <Panel header={label} key={`${index}`}>
                {/* <Panel header={label} key="1"> */}
                <ul>
                  {list.map((item, index) => {
                    const { label, path } = item
                    const reg = new RegExp(`^${path}`)
                    let active = reg.test(pathname) ? style.active : ""
                    return (
                      <li className={active} key={index}>
                        <Link href={path}>{label}</Link>
                      </li>
                    )
                  })}
                </ul>
              </Panel>
            </Collapse>
          )
        }
      })}
    </div>
  )
}

