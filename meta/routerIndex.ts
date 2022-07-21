

// interface indexType {
//   [path: string]: {
//     label: string
//     [key: string]: {}
//   }
// }

// interface indexType {
//   label: string
//   [key: string]: string | object
// }
interface indexType {
  label: string
  [key: string]: string | object
}



const routerIndex: indexType = {
  label: "第一層",
  "/": {
    label: "首頁",
  },
  "/setting": {
    label: "公司設定",
    "/theCompanyInfo": { label: "公司資料" },
    "/grade": { label: "公司職等職稱" },
    "/staffProfile": { label: "人員資料" },
    "/hrManage": { label: "人事權限管理" },
    "/clientList": { label: "客戶列表" },
    "/productList": { label: "產品列表" },
  },
  "/domestic": {
    label: "營業部-國內工程"
  },
  "/foreign": {
    label: "營業部-國外工程"
  },
  "/project": {
    label: "工務部"
  },
}


export default routerIndex


