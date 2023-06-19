


// icon
import icon_home from "public/image/icon/home.svg"
import icon_setting from "public/image/icon/setting.svg"
import icon_domestic from "public/image/icon/domestic.svg"
import icon_foreign from "public/image/icon/foreign.svg"
import icon_project from "public/image/icon/project.svg"


type ErpFeaturesValues = typeof erpFeaturesLookup[keyof typeof erpFeaturesLookup];

type TsidePathConfig = {
  //antd Collapse用的，設定預設被選中的面板，大部分時候用不到
  defaultCollapse?: string
  path01: string
  list: {
    label: string
    path?: string
    query?: {
      [key: string]: string
    }
    erpFeature: ErpFeaturesValues[] | "allPass"
    list?: {
      label: string
      path: string
      query?: {
        [key: string]: string
      }
      /**空陣列會全部禁止 */
      erpFeature: ErpFeaturesValues[] | "allPass"
    }[]
  }[]
}

type TtopPathListConfig = {
  icon: string
  label: string
  subLabel?: string
  path01: string
  href: {
    pathname: string
    query?: {
      [key: string]: string
    }
  }

  erpFeature: ErpFeaturesValues[] | "allPass"
}

interface TsidePathList {
  [key: string]: TsidePathConfig
}

// =========================================================================

const erpFeaturesLookup = {
  // 基本資料建立
  // BasicDataCreation: "5553602b-f640-4af0-aae6-7e284544a7a3",
  BasicDataCreation: "基本資料建立",
  // 人事權限建立
  // HRAuthoritySetup: "c02998a7-ee2f-4ce7-9f96-4af2740d50f4",
  HRAuthoritySetup: "人事權限建立",
} as const

const { BasicDataCreation, HRAuthoritySetup } = erpFeaturesLookup

/** "allPass" 即使沒有任何權限也pass */
/** allPass 至少有一個權限就pass */
const allPass = [BasicDataCreation, HRAuthoritySetup,]

/**未決定權限的page會放這個，NEXT_PUBLIC_NAV_DEV_PERMISSIONS基本上會是"allPass"" */
// const devPass: TtopPathListConfig["erpFeature"] = (process.env.NEXT_PUBLIC_NAV_DEV_PERMISSIONS ?? []) as TtopPathListConfig["erpFeature"]
// const devPass: TtopPathListConfig["erpFeature"] = (allPass) as TtopPathListConfig["erpFeature"]
const devPass: TtopPathListConfig["erpFeature"] = "allPass"
// =========================================================================

const sidePathList: TsidePathList = {
  "/home": ((): TsidePathConfig => {
    const path01 = "/home"
    return {
      path01,
      list: [
        {
          label: "日報表",
          erpFeature: "allPass",
          list: [
            {
              label: "我的日報表",
              path: path01 + "/dailyReport",
              query: { isMine: "true" },
              erpFeature: "allPass",
            },
            {
              label: "審核日報表",
              path: path01 + "/dailyReport",
              query: { isMine: "false" },
              erpFeature: "allPass",
            },
          ]
        },
      ]
    }
  })(),
  // ------------------------------------
  "/setting": ((): TsidePathConfig => {
    const path01 = "/setting"
    return {
      path01,
      list: [
        {
          label: "基本資料建立",
          erpFeature: [BasicDataCreation, HRAuthoritySetup],
          list: [
            {
              label: "公司資料",
              path: path01 + "/company-info",
              erpFeature: [BasicDataCreation],
            },
            {
              label: "公司職等職稱",
              path: path01 + "/departments",
              erpFeature: [BasicDataCreation],
            },
            {
              label: "人員資料",
              path: path01 + "/employees",
              erpFeature: [BasicDataCreation],
            },
            {
              label: "人事權限管理",
              path: path01 + "/hrManage/erpCtrlPermissions",
              erpFeature: [HRAuthoritySetup],
            },
          ]
        },
        {
          label: "客戶列表",
          path: path01 + "/customer",
          erpFeature: allPass,
        },
        {
          label: "產品列表",
          path: path01 + "/productList",
          erpFeature: devPass,
        },
        {
          label: "備註列表",
          path: path01 + "/annotationList",
          erpFeature: devPass,
        },
        {
          label: "報價範圍列表",
          path: path01 + "/quotationRanges",
          erpFeature: devPass,
        },
      ]
    }
  })(),
  // --------------------------------------
  "/domestic": ((): TsidePathConfig => {
    const path01 = "/domestic"
    return {
      path01,
      list: [
        {
          label: "報價",
          // erpFeature: devPass,
          erpFeature: "allPass",
          list: [
            {
              label: "預算",
              path: path01 + "/budget",
              erpFeature: devPass,
            },
            {
              label: "投標",
              path: path01 + "/tender",
              erpFeature: devPass,
            },
            {
              label: "發包",
              path: path01 + "/outsourcing",
              erpFeature: devPass,
            },
            {
              label: "合約",
              path: path01 + "/contract",
              erpFeature: devPass,
            },
            {
              label: "查詢報價單",
              path: path01 + "/queryQuotation",
              erpFeature: devPass,
            },
            {
              label: "歷史紀錄",
              path: path01 + "/history",
              erpFeature: devPass,
            },
            {
              label: "報表",
              path: path01 + "/report",
              erpFeature: devPass,
            },
            {
              label: "舊合約整合",
              path: path01 + "/legacyContractIntegration",
              erpFeature: "allPass",
            },
          ]
        },
        {
          label: "查詢工作表",
          path: path01 + "/unSet",
          erpFeature: devPass,
        },
        {
          label: "查詢應收帳款明細",
          path: path01 + "/unSet",
          erpFeature: devPass,
        },
        {
          label: "查詢派工單明細",
          path: path01 + "/unSet",
          erpFeature: devPass,
        },
        {
          label: "統計表",
          erpFeature: devPass,
          list: [
            {
              label: "報價統計表",
              path: path01 + "/quoteStatistics",
              erpFeature: devPass,
            },
            {
              label: "個人業績統計表",
              path: path01 + "/personalPerformanceStatistics",
              erpFeature: devPass,
            },
            {
              label: "全區業績統計表",
              path: path01 + "/regionalPerformanceStatistics",
              erpFeature: devPass,
            },
            {
              label: "追加工程統計表",
              path: path01 + "/additionalEngineeringStatistics",
              erpFeature: devPass,
            },
            {
              label: "年度業績統計表",
              path: path01 + "/annualPerformanceStatistics",
              erpFeature: devPass,
            },
          ]
        },
      ]
    }
  })(),
  // -----------------------------
  "/foreign": ((): TsidePathConfig => {
    const path01 = "/foreign"
    return {
      path01,
      list: [
        {
          label: "國外工程",
          erpFeature: devPass,
          list: [
            {
              label: "施工中",
              path: path01 + "/unset",
              erpFeature: devPass,

            },
            {
              label: "施工中",
              path: path01 + "/unset",
              erpFeature: devPass,
            },
            {
              label: "施工中",
              path: path01 + "/unset",
              erpFeature: devPass,
            },
            {
              label: "施工中",
              path: path01 + "/unset",
              erpFeature: devPass,
            },
          ]
        },
        {
          label: "施工中",
          path: path01 + "/unset",
          erpFeature: devPass,
        },
      ]
    }
  })(),
  // -----------------------------
  "/worksDepartment": ((): TsidePathConfig => {
    const path01 = "/worksDepartment"
    return {
      path01,
      list: [
        {
          label: "合約",
          path: path01 + "/contractList",
          erpFeature: devPass,
        },
        {
          label: "新增派工單",
          path: path01 + "/addDispatch",
          erpFeature: devPass,
        },
        {
          label: "派工進度表",
          path: path01 + "/schedule",
          erpFeature: devPass,
        },
        {
          label: "報表",
          erpFeature: devPass,
          list: [
            {
              label: "出貨統計表",
              path: path01 + "/shippingStatistics",
              erpFeature: devPass,
            },
            {
              label: "營業狀況表",
              path: path01 + "/StatementOfBusinessConditions",
              erpFeature: devPass,
            },
            {
              label: "應收帳款表",
              path: path01 + "/accountsReceivableStatement",
              erpFeature: devPass,
            },
            {
              label: "代辦事項總覽",
              path: path01 + "/toDoOverview",
              erpFeature: devPass,
            },
          ]
        },
        {
          label: "外包計價",
          path: path01 + "/outsourcingPricing",
          erpFeature: devPass,
        },
        {
          label: "矯正預防措施處理單",
          path: path01 + "/correctiveAndPreventiveActionSheet",
          erpFeature: devPass,
        },
        {
          label: "機具公物管理",
          erpFeature: devPass,
          list: [
            {
              label: "採購維修申請",
              path: path01 + "/purchaseRepairRequest",
              erpFeature: devPass,
            },
            {
              label: "公物紀錄表",
              path: path01 + "/publicPropertyRecord",
              erpFeature: devPass,
            },
          ]
        },
        {
          label: "保養合約",
          erpFeature: devPass,
          list: [
            {
              label: "合約",
              path: path01 + "/contract",
              erpFeature: devPass,
            },
            {
              label: "派工進度表",
              path: path01 + "/dispatchSchedule",
              erpFeature: devPass,
            },
            {
              label: "應收帳款明細",
              path: path01 + "/accountsReceivableDetails",
              erpFeature: devPass,
            },
          ]
        },
      ]
    }
  })(),
  // =======================================
}

// 上方nav用的路由表
// components\Layer\Header\Nav\Nav.tsx
const topPathList: TtopPathListConfig[] = [
  {
    icon: icon_home,
    label: "首頁",
    path01: sidePathList["/home"].path01,
    href: {
      pathname: "/home/dailyReport",
      query: { isMine: "true" }
    },
    erpFeature: "allPass",
  },
  {
    icon: icon_setting,
    label: "公司設定",
    path01: sidePathList["/setting"].path01,
    href: {
      pathname: sidePathList["/setting"].path01 + "/company-info",
    },
    erpFeature: [BasicDataCreation, HRAuthoritySetup],
  },
  {
    icon: icon_domestic,
    label: "營業部",
    subLabel: "-國內工程",
    path01: sidePathList["/domestic"].path01,
    href: {
      pathname: sidePathList["/domestic"].path01 + "/legacyContractIntegration",
    },
    erpFeature: "allPass",
  },
  {
    icon: icon_foreign,
    label: "營業部",
    subLabel: "-國外工程",
    path01: sidePathList["/foreign"].path01,
    href: {
      pathname: sidePathList["/foreign"].path01 + "",
    },
    erpFeature: devPass,
  },
  {
    icon: icon_project,
    label: "工務部",
    path01: sidePathList["/worksDepartment"].path01,
    href: {
      pathname: sidePathList["/worksDepartment"].path01 + "/contractList",
    },
    erpFeature: devPass,
  },
]

export default sidePathList
export { topPathList }

// =========================================================
// TsidePathConfig範例
// {
//   path01,
//   list: [
//     {
//       label: "首頁",
//       list: [
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//       ]
//     },
//     {
//       label: "施工中",
//       path: path01 + "/",
//     },
//     {
//       label: "施工中",
//       path: path01 + "/",
//     },
//   ]
// }


