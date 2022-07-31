
interface TstaffInfo {
  key?: string | number; // key 是antd table用的參數 ,會在最後加進去
  staffId: string //使用者代號，假資料先用陣列方法新增
  chName: string  //中文姓名
  enName: string  //英文姓名  //每個人都會有英文名字嗎?
  idNumber: string  //身分證字號
  phone01: string  //連絡電話 1
  phone02: string  //連絡電話 2
  birthday: string  //生日
  sex: string  //性別
  marital: string  //婚應
  education: string  //學歷
  expertise: string  //專長
  residenceAddress: string //戶籍地址
  contactAddress: string  //聯絡地址
  seniority: string  //年資
  arrivalDate: string  //到職日
  resignationDate: string  //離職日
  retirementDate: string  //退休日
  layoffDate: string  //資遣日
  //  部門1
  department01: {
    departmentId: string
    department: string
    jobTitle: string
    level: string
  }
  //  部門2
  department02: {
    departmentId: string
    department: string
    jobTitle: string
    level: string
  }
}



let fakeData: TstaffInfo[] = [
  {
    staffId: "",
    chName: '王小明',
    enName: "",
    idNumber: "A123456789",
    phone01: "0911123456",
    phone02: "0922123456",
    birthday: "2001-01-01",
    sex: "男",
    marital: "未婚",
    education: "很大大學",
    expertise: "",
    residenceAddress: "台中市和平鄉山路草弄5號",
    contactAddress: "台中市西區台灣大道9999號",
    seniority: "5年10月",
    arrivalDate: "2020-02-30",
    resignationDate: "",
    retirementDate: "",
    layoffDate: "",
    department01: {
      departmentId: "A",
      department: "管理部",
      jobTitle: "資深經理",
      level: "Level 7",
    },
    department02: {
      departmentId: "B",
      department: "營業部",
      jobTitle: "資淺業務經理",
      level: "Level 5",
    }
  },
  {
    staffId: "",
    chName: '王大明',
    enName: "Big-Ming",
    idNumber: "B123456789",
    phone01: "0933123456",
    phone02: "0944123456",
    birthday: "2001-02-02",
    sex: "男",
    marital: "已婚",
    education: "大大大學",
    expertise: "上大學",
    residenceAddress: "花蓮縣壽豐鄉海路樹巷50號",
    contactAddress: "花蓮縣壽豐鄉山路9999號",
    seniority: "10年1月",
    arrivalDate: "2010-01-20",
    resignationDate: "",
    retirementDate: "",
    layoffDate: "",
    department01: {
      departmentId: "C",
      department: "研發部",
      jobTitle: "總工程師",
      level: "Level 9",
    },
    department02: {
      departmentId: "",
      department: "",
      jobTitle: "",
      level: "",
    },
  },
  {
    staffId: "",
    chName: '王中明',
    enName: "",
    idNumber: "C987654321",
    phone01: "0911654321",
    phone02: "0922654321",
    birthday: "1990-01-01",
    sex: "女",
    marital: "未婚",
    education: "很大大學",
    expertise: "",
    residenceAddress: "高雄市三民區柏油路大巷小弄1號",
    contactAddress: "高雄市三民區柏油路大巷小弄1號",
    seniority: "20年0月",
    arrivalDate: "1970-07-18",
    resignationDate: "1990-07-18",
    retirementDate: "1990-07-18",
    layoffDate: "",
    department01: {
      departmentId: "D",
      department: "工程部",
      jobTitle: "專業協理",
      level: "Level 8",
    },
    department02: {
      departmentId: "E",
      department: "廠務部",
      jobTitle: "專業協理",
      level: "Level 8",
    }
  },
  {
    staffId: "",
    chName: '王聰明',
    enName: "Smart-Ming",
    idNumber: "D123456789",
    phone01: "0911852741",
    phone02: "0922987654",
    birthday: "2010-01-01",
    sex: "女",
    marital: "已婚",
    education: "有間大學",
    expertise: "會計",
    residenceAddress: "台北市內湖區湖邊路水草巷60號",
    contactAddress: "台南市新營區蔗糖路微甜巷10號",
    seniority: "1年10月",
    arrivalDate: "2021-02-30",
    resignationDate: "",
    retirementDate: "",
    layoffDate: "2022-12-31",
    department01: {
      departmentId: "F",
      department: "會計部",
      jobTitle: "助理",
      level: "Level 1",
    },
    department02: {
      departmentId: "",
      department: "",
      jobTitle: "",
      level: "",
    },
  },
];





fakeData = fakeData.concat(JSON.parse(JSON.stringify(fakeData)))
fakeData = fakeData.concat(JSON.parse(JSON.stringify(fakeData)))
fakeData = fakeData.concat(JSON.parse(JSON.stringify(fakeData)))

fakeData.forEach((item, index) => {
  item.key = index
  item.staffId = "A" + (`${index}`.padStart(3, "0"))
})



export type { TstaffInfo, TstaffInfo as TstaffProfile }
export { fakeData as fakeStaffList }







