



interface TclientProfile {
  clientId: string
  type: string
  name: string
  shortName: string
  phone: string
  fax: string
  head: string // 負責人
  address: string
  billAddress: string //發票地址
  taxtNumber: string //統一編號
  taxtType: string //扣稅類別
  contact: {
    name: string // 聯絡人
    phone: string // 聯絡人電話
  }[]
}

const foo = (
  data: TclientProfile,
  key: keyof TclientProfile
) => {
  const bar = data[key]
  return bar
}


type TclientProfileList = TclientProfile[]

// ===============================================================================

const client01: TclientProfile = {
  clientId: "S00001",
  type: "客戶",
  name: "新加坡商犀牛頓科技股份有限公司",
  shortName: "犀牛盾/愛進化",
  phone: "04-12345678",
  fax: "04-12345656",
  head: "王李言小華",
  address: "台北市大安區和平東路一段100號",
  billAddress: "台北市大安區和平東路一段100號",
  taxtNumber: "83207153",
  taxtType: "應稅外加",
  contact: [
    {
      name: "陳小明小華",
      phone: "0987654321",
    },
    {
      name: "王李言小華",
      phone: "0987654321",
    },
    {
      name: "Darren",
      phone: "0987654321",
    },
  ]
}

const client02: TclientProfile = {
  clientId: "S00002",
  type: "客戶/廠商",
  name: "尚比亞商大象皮成衣股份有限公司",
  shortName: "大象皮成衣",
  phone: "04-11111111",
  fax: "04-11111111",
  head: "王小華",
  address: "屏東縣新埤鄉龍潭路10號",
  billAddress: "屏東縣新埤鄉龍潭路10號",
  taxtNumber: "11111111",
  taxtType: "應稅外加",
  contact: [
    {
      name: "王小華",
      phone: "0987556677",
    },
  ]
}
const client03: TclientProfile = {
  clientId: "S00003",
  type: "廠商",
  name: "英屬維京群島商加勒比貿易股份有限公司台灣分公司",
  shortName: "加勒比貿易",
  phone: "04-22222222",
  fax: "04-22222222",
  head: "海大副",
  address: "新竹縣關西鎮豐德街20號",
  billAddress: "新竹縣關西鎮豐德街20號",
  taxtNumber: "22222222",
  taxtType: "應稅外加",
  contact: [
    {
      name: "林中華",
      phone: "0987654321",
    },
    {
      name: "林東華",
      phone: "0987654321",
    },
  ]
}
const client04: TclientProfile = {
  clientId: "S00004",
  type: "客戶/廠商",
  name: "有間有限公司",
  shortName: "有間公司",
  phone: "04-33333333",
  fax: "04-33333333",
  head: "林有間",
  address: "高雄市大寮區青山街二段150巷68弄20號B棟10樓之9",
  billAddress: "高雄市大寮區青山街二段150巷68弄20號B棟10樓之9",
  taxtNumber: "33333333",
  taxtType: "應稅",
  contact: [
    {
      name: "林有間",
      phone: "0955132978",
    },
  ]
}


let fakeClientList: TclientProfileList = [
  client01,
  client02,
  client03,
  client04,
]


fakeClientList = fakeClientList.concat(JSON.parse(JSON.stringify(fakeClientList)))
fakeClientList = fakeClientList.concat(JSON.parse(JSON.stringify(fakeClientList)))
fakeClientList = fakeClientList.concat(JSON.parse(JSON.stringify(fakeClientList)))

fakeClientList.forEach((item, index) => {
  item.clientId = "S" + `${index}`.padStart(4, "0")
})

// ===============================================================================
const clientEmpty: TclientProfile = {
  clientId: "",
  type: "",
  name: "",
  shortName: "",
  phone: "",
  fax: "",
  head: "",
  address: "",
  billAddress: "",
  taxtNumber: "",
  taxtType: "",
  contact: [
    {
      name: "",
      phone: "",
    },
  ]
}
// ===============================================================================








export type { TclientProfile, TclientProfileList }

export { fakeClientList, clientEmpty }














