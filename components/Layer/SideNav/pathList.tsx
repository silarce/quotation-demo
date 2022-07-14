





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
        label: "國內工程",
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
      {
        label: "施工中",
        path: "/"
      },
    ]
  },
  // -----------------------------
  "/project": {
    defaultCollapse: "0",
    list: [
      {
        label: "工程部",
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
  // =======================================
}

export default pathList