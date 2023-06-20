import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from "lodash"

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from "./side.module.scss"

// 路由表
import sidePathList from './pathList';

// context
import { LayerCtx } from '../Layer';


export default function SideNav() {
  const router = useRouter()
  const { userErpFeature } = useContext(LayerCtx)

  // -------------------------------------------------------------------
  // pathname與route在404的時候值是"_error"
  // 會導致無法取到路由表的值
  const asPath = router.asPath
  const parentPath = "/" + asPath.split("/")[1]
  const routerQuery = router.query
  let linkList = sidePathList[parentPath]
  // -------------------------------------------------------------------

  return (
    <div className={classNames(style.container, "relative")}>
      {linkList?.list.map((item, index) => {
        const { label, path, list, erpFeature } = item
        const reg = new RegExp(`^${path}`)
        let active = reg.test(asPath) ? style.active : ""

        const isPassed = checkErpFeature({ erpFeature, userErpFeature })
        if (!isPassed) return null

        if (path) {
          return (
            <Link className={`${style.option} ${active}`} href={path} key={index}>
              {label}
            </Link>
          )
        }
        if (list) {
          return (
            <Collapse key={index} className={style.collapse}
              defaultActiveKey={[linkList.defaultCollapse || "0"]} ghost
              onChange={() => { }}>
              <Panel header={label} key={`${index}`}>
                <ul>
                  {list.map((item, index) => {
                    const { label, path, erpFeature, query } = item
                    const reg = new RegExp(`^${path}`)
                    let isActive = (() => {
                      const isMatch = _.isMatch(routerQuery, query ?? {})
                      return reg.test(asPath) && isMatch
                    })()
                    const href = { pathname: path, query }
                    const isPassed = checkErpFeature({ erpFeature, userErpFeature })
                    if (!isPassed) return null
                    return (
                      // <li className={active} key={index}>
                      <li className={classNames({ [style.active]: isActive })} key={index}>
                        <Link href={href}>{label}</Link>
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


const checkErpFeature = (
  { erpFeature, userErpFeature, }:
    {
      erpFeature: string[] | "allPass"
      userErpFeature: { name: string }[]
    }
) => {
  let isPassed: boolean = false
  if (erpFeature === "allPass") return true
  isPassed = userErpFeature.some((item1) => {
    return erpFeature.includes(item1.name)
  })
  return isPassed
}
