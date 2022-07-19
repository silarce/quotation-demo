// 根據當前的url，取得當前頁面的資料


import { useRouter } from "next/router"
// meta
import routerIndex from "meta/routerIndex"


export default function usePageInfo() {
  const router = useRouter()

  const pathArr = router.pathname.split("/").map(item => ("/" + item))
  pathArr.shift()

  let pageInfo = routerIndex

  pathArr.forEach(item => {
    pageInfo = pageInfo[item] as typeof routerIndex
  })
  return pageInfo
}

