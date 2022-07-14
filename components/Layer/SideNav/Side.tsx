import Link from 'next/link';
import { useRouter } from 'next/router';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from "./side.module.scss"

// meta
import pathList from './pathList';

export default function Side() {
  const pathname: string = useRouter().pathname

  let linkList = pathList[pathname]
  if (!linkList) linkList = pathList["/"]

  return (
    <div className={style.container}>
      {linkList.list.map((item, index) => {
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
              defaultActiveKey={[settingList.defaultCollapse]} ghost
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


// ==============================================


const settingList = {
  defaultCollapse: "0",
  list: [
    {
      label: "基本資料建立",
      list: [
        {
          label: "公司資料",
          path: "/setting/theCompanyInfo",
        },
        {
          label: "公司職等職稱",
          path: "/setting/grade",
        },
        {
          label: "人員資料",
          path: "/setting/staffProfile",
        },
        {
          label: "人事權限管理",
          path: "/setting/hrManage",
        },
      ]
    },
    {
      label: "客戶列表",
      path: "/setting/clientList",
    },
    {
      label: "產品列表",
      path: "/setting/productList"
    },
  ]
}

