


// icon
import icon_home from "public/image/icon/home.svg"
import icon_setting from "public/image/icon/setting.svg"
import icon_domestic from "public/image/icon/domestic.svg"
import icon_foreign from "public/image/icon/foreign.svg"
import icon_project from "public/image/icon/project.svg"



// 給antd Collapse用的東西
interface TsidePathConfig {
  //antd Collapse用的，設定預設被選中的面板，大部分時候用不到
  defaultCollapse?: string
  path01: string
  list: {
    label: string
    path?: string
    list?: {
      label: string
      path: string
    }[]
  }[]
}


interface TsidePathList {
  [key: string]: TsidePathConfig
}

const sidePathList: TsidePathList = {
  "/home": (() => {
    const path01 = "/home"
    return {
      path01,
      list: [
        {
          label: "首頁",
          list: [
            {
              label: "施工中",
              path: path01 + "/",
            },
            {
              label: "施工中",
              path: path01 + "/",
            },
            {
              label: "施工中",
              path: path01 + "/",
            },
            {
              label: "施工中",
              path: path01 + "/",
            },
          ]
        },
        {
          label: "施工中",
          path: path01 + "/",
        },
        {
          label: "施工中",
          path: path01 + "/",
        },
      ]
    }
  })(),
  // ------------------------------------
  "/setting": (() => {
    const path01 = "/setting"
    return {
      path01,
      list: [
        {
          label: "基本資料建立",
          list: [
            {
              label: "公司資料",
              path: path01 + "/theCompanyInfo",
            },
            {
              label: "公司職等職稱",
              path: path01 + "/grade",
            },
            {
              label: "人員資料",
              path: path01 + "/employees",
            },
            {
              label: "人事權限管理",
              path: path01 + "/hrManage",
            },
          ]
        },
        {
          label: "客戶列表",
          path: path01 + "/customer",
        },
        {
          label: "產品列表",
          path: path01 + "/productList"
        },
      ]
    }
  })(),
  // --------------------------------------
  "/domestic": (() => {
    const path01 = "/domestic"
    return {
      path01,
      list: [
        {
          label: "報價",
          list: [
            {
              label: "預算",
              path: path01 + "/budget",
            },
            {
              label: "投標",
              path: path01 + "/tender",
            },
            {
              label: "發包",
              path: path01 + "/outsourcing",
            },
            {
              label: "合約",
              path: path01 + "/contract",
            },
            {
              label: "查詢報價單",
              path: path01 + "/queryQuotation",
            },
            {
              label: "歷史紀錄",
              path: path01 + "/history",
            },
            {
              label: "報表",
              path: path01 + "/report",
            },
          ]
        },
        {
          label: "查詢派工作表",
          path: path01 + "/unSet",
        },
        {
          label: "查詢應收帳款明細",
          path: path01 + "/unSet",
        },
        {
          label: "查詢派工單明細",
          path: path01 + "/unSet",
        },
        {
          label: "統計表",
          list: [
            {
              label: "業績統計表",
              path: path01 + "/unSet",
            },
            {
              label: "個人業績統計表",
              path: path01 + "/unSet",
            },
            {
              label: "追加工程統計表",
              path: path01 + "/unSet",
            },
            {
              label: "報價統計表",
              path: path01 + "/unSet",
            },
          ]
        },
      ]
    }
  })(),
  // -----------------------------
  "/foreign": (() => {
    const path01 = "/foreign"
    return {
      path01,
      list: [
        {
          label: "國外工程",
          list: [
            {
              label: "施工中",
              path: path01 + "/unset",
            },
            {
              label: "施工中",
              path: path01 + "/unset",
            },
            {
              label: "施工中",
              path: path01 + "/unset",
            },
            {
              label: "施工中",
              path: path01 + "/unset",
            },
          ]
        },
        {
          label: "施工中",
          path: path01 + "/unset",
        },
      ]
    }
  })(),
  // -----------------------------
  "/worksDepartment": (() => {
    const path01 = "/worksDepartment"
    return {
      path01,
      list: [
        {
          label: "合約",
          path: path01 + "/contractList",
        },
        {
          label: "新增派工單",
          path: path01 + "/addDispatch",
        },
        {
          label: "派工進度表",
          path: path01 + "/schedule",
        },
        {
          label: "報表",
          list: [
            {
              label: "出貨統計表",
              path: path01 + "/shippingStatistics",
            },
            {
              label: "營業狀況表",
              path: path01 + "/StatementOfBusinessConditions",
            },
            {
              label: "應收帳款表",
              path: path01 + "/accountsReceivableStatement",
            },
            {
              label: "代辦事項總覽",
              path: path01 + "/toDoOverview",
            },
          ]
        },
        {
          label: "外包計價",
          path: path01 + "/outsourcingPricing",
        },
        {
          label: "矯正預防措施處理單",
          path: path01 + "/correctiveAndPreventiveActionSheet"
        },
        {
          label: "機具公物管理",
          list: [
            {
              label: "採購維修申請",
              path: path01 + "/purchaseRepairRequest",
            },
            {
              label: "公物紀錄表",
              path: path01 + "/publicPropertyRecord",
            },
          ]
        },
        {
          label: "保養合約",
          list: [
            {
              label: "合約",
              path: path01 + "/contract",
            },
            {
              label: "派工進度表",
              path: path01 + "/dispatchSchedule",
            },
            {
              label: "應收帳款明細",
              path: path01 + "/accountsReceivableDetails",
            },
          ]
        },
      ]
    }
  })(),
  // =======================================
}


const topPathList = [
  {
    icon: icon_home,
    label: "首頁",
    path01: sidePathList["/home"].path01, href: "/home",
  },
  {
    icon: icon_setting,
    label: "公司設定",
    path01: sidePathList["/setting"].path01,
    href: sidePathList["/setting"].path01 + "/theCompanyInfo",
  },
  {
    icon: icon_domestic,
    label: "營業部", subLabel: "-國內工程",
    path01: sidePathList["/domestic"].path01,
    href: sidePathList["/domestic"].path01 + "/budget",
  },
  {
    icon: icon_foreign,
    label: "營業部", subLabel: "-國外工程",
    path01: sidePathList["/foreign"].path01,
    href: sidePathList["/foreign"].path01 + "",
  },
  {
    icon: icon_project,
    label: "工務部",
    path01: sidePathList["/worksDepartment"].path01,
    href: sidePathList["/worksDepartment"].path01 + "/contractList",
  },
]



export default sidePathList
export { topPathList }
