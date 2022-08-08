import Link from 'next/link';
import { useRouter } from 'next/router';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from "./side.module.scss"

// meta
import pathList from './pathList';

export default function SideNav() {
  // const pathname: string = useRouter().pathname
  const router = useRouter()
  const pathname = router.pathname
  const parentPath = "/" + pathname.split("/")[1]

  let linkList = pathList[parentPath]

  return (
    <div className={style.container}>
      {linkList?.list.map((item, index) => {
        const { label, path, list } = item
        if (path) {
          return (
            <Link href={path} key={index}>
              <a className={style.option} key={index}>{label}</a>
            </Link>
          )
        }
        if (list) {
          return (
            <Collapse key={index} className={style.collapse}
              defaultActiveKey={[linkList.defaultCollapse]} ghost
              // defaultActiveKey={['0']} ghost
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

