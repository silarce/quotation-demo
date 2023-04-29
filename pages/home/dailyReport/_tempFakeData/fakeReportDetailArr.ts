





export type TreportDetail = {
  period: "上午(內)" | "上午(外)" | "下午(內)" | "下午(外)"
  customerName: string
  contactPerson: string
  purpose: {
    openUp: boolean // 開拓
    valuation: boolean // 估價
    contract: boolean // 訂約
    collectMoney: boolean // 收款
    serve: boolean // 服務
  }
  content: string
}



export const fakeReportDetailArr: TreportDetail[] = [
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: false,
    },
    content: "沒事",
  },
  {
    period: "上午(外)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: true,
      contract: true,
      collectMoney: false,
      serve: false,
    },
    content: "有事",
  },
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: true,
    },
    content: "有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事",
  },
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: true,
    },
    content: "有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事",
  },
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: true,
    },
    content: "有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事",
  },
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: true,
    },
    content: "有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事",
  },
  {
    period: "上午(內)",
    customerName: "阿阿阿阿",
    contactPerson: "伊伊伊伊",
    purpose: {
      openUp: false,
      valuation: false,
      contract: false,
      collectMoney: false,
      serve: true,
    },
    content: "有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事有事沒事",
  },
]








