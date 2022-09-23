





interface pathList {
  [key: string]: {
    defaultCollapse: string,
    list: {
      label: string
      path?: string
      list?: {
        label: string
        path: string
      }[]
    }[]
  }
}




const pathList: pathList = {
  "/": {
    defaultCollapse: "0",
    list: [
      {
        label: "首頁",
        list: [
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
        ]
      },
      {
        label: "施工中",
        path: "/",
      },
      {
        label: "施工中",
        path: "/"
      },
    ]
  },
  // ------------------------------------
  "/setting": {
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
  },
  // --------------------------------------
  "/domestic": {
    defaultCollapse: "0",
    list: [
      {
        label: "報價",
        list: [
          {
            label: "預算",
            path: "/domestic/budget",
          },
          {
            label: "投標",
            path: "/domestic/tender",
          },
          {
            label: "發包",
            path: "/domestic/outsourcing",
          },
          {
            label: "合約",
            path: "/domestic/contract",
          },
          {
            label: "查詢報價單",
            path: "/domestic/queryQuotation",
          },
          {
            label: "歷史紀錄",
            path: "/domestic/history",
          },
          {
            label: "報表",
            path: "/domestic/report",
          },
        ]
      },
      {
        label: "查詢派工作表",
        path: "/domestic/unSet",
      },
      {
        label: "查詢應收帳款明細",
        path: "/domestic/unSet",
      },
      {
        label: "查詢派工單明細",
        path: "/domestic/unSet",
      },
      {
        label: "統計表",
        list: [
          {
            label: "業績統計表",
            path: "/domestic/unSet",
          },
          {
            label: "個人業績統計表",
            path: "/domestic/unSet",
          },
          {
            label: "追加工程統計表",
            path: "/domestic/unSet",
          },
          {
            label: "報價統計表",
            path: "/domestic/unSet",
          },
        ]
      },
    ]
  },
  // -----------------------------
  "/foreign": {
    defaultCollapse: "0",
    list: [
      {
        label: "國外工程",
        list: [
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
          {
            label: "施工中",
            path: "/",
          },
        ]
      },
      {
        label: "施工中",
        path: "/",
      },
    ]
  },
  // -----------------------------
  "/worksDepartment": {
    defaultCollapse: "0",
    list: [
      {
        label: "合約",
        path: "/contract",
      },
      {
        label: "新增派工單",
        path: "/addDispatch",
      },
      {
        label: "派工進度表",
        path: "/schedule",
      },
      {
        label: "報表",
        list: [
          {
            label: "出貨統計表",
            path: "/shippingStatistics",
          },
          {
            label: "營業狀況表",
            path: "/StatementOfBusinessConditions",
          },
          {
            label: "應收帳款表",
            path: "/accountsReceivableStatement",
          },
          {
            label: "代辦事項總覽",
            path: "/toDoOverview",
          },
        ]
      },
      {
        label: "外包計價",
        path: "/outsourcingPricing",
      },
      {
        label: "矯正預防措施處理單",
        path: "/correctiveAndPreventiveActionSheet"
      },
      {
        label: "機具公物管理",
        list: [
          {
            label: "採購維修申請",
            path: "/purchaseRepairRequest",
          },
          {
            label: "公物紀錄表",
            path: "/publicPropertyRecord",
          },
        ]
      },
      {
        label: "保養合約",
        list: [
          {
            label: "合約",
            path: "/contract",
          },
          {
            label: "派工進度表",
            path: "/dispatchSchedule",
          },
          {
            label: "應收帳款明細",
            path: "/accountsReceivableDetails",
          },
        ]
      },
    ]
  },
  // =======================================
}

export default pathList