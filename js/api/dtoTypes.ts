

// get
// get
// get

export type TpageMetaDto = {
  page: number
  pageSize: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}


/** 如果是admin帳號，不會有employee */
export type TuserDto = {
  account: string
  createdAt: string
  id: string
  isActive: boolean
  updatedAt: string
  username: string
  employee?: TemployeeDto & Required<Pick<TemployeeDto, "jobs">>
}

export type TuserDto_login = {
  account: string
  createdAt: string
  id: string
  isActive: boolean
  updatedAt: string
  username: string
}


export type TUserPasswordDto = {
  id: string
  createdAt: string
  updatedAt: string
  account: string
  username: string
  roles?: string[] | null
  groups?: string[] | null
  isActive: boolean
  password: string
  employee: TemployeeDto
}

export type TcompanyInfoDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  phone: string
  email: string
  county: string
  district: string
  address: string
  fax: string
  taxId: string
  logoLink: string
}

// api文件沒有清楚contact的型別
export type Tcontact = {
  "id": string,
  // "createdAt": string //"2022-10-17T05:35:08.115Z",
  // "updatedAt": string //"2022-10-17T05:35:08.115Z",
  // "createdBy": string
  // "updatedBy": string
  // "deletedBy": string | null
  "name": string
  "phone": string
}

export type TcustomerDto = {
  id: string
  createdAt: string
  updatedAt: string
  customerNumber: string
  name: string
  nickname: string
  principal: string
  taxDeductionCategory: string
  taxId: string
  phone: string
  fax: string
  county: string
  district: string
  address: string
  invoiceCounty: string
  invoiceDistrict: string
  invoiceAddress: string
  contacts?: Tcontact[]
  types?: { //客戶類型
    id: string
    createdAt: string
    updateAt: string
    name: "construction" | "firm" | "propertyOwner" | "contractor"
  }[]
}

type TcustomerDtoPopulateArr = (keyof Pick<TcustomerDto, "types" | "contacts">)[]

export type TcustomerDto_Populate<populateArr extends TcustomerDtoPopulateArr = []>
  = TcustomerDto & Required<Pick<TcustomerDto, populateArr[number]>>



export type TemployeeDto = {
  id: string // 應該是資料庫的 pk
  createdAt: string  // 目前用不到
  updatedAt: string  // 目前用不到
  idNumber: string // 員工編號
  chName: string
  enName: string
  identity: string  // 身分證字號 // 目前用不到
  birthday: string
  gender: string
  marital: string // 婚姻
  education: string
  expertise: string // 專長
  phone1: string
  phone2: string
  email: string
  residenceCounty: string
  residenceDistrict: string
  residenceAddress: string
  mailingCounty: string
  mailingDistrict: string
  mailingAddress: string
  processPermission: true //  處理權限? 目前用不到 // api文件表示這個值會是true
  seniority: string // 年資
  startDate: string // 到職日
  leaveDate: string // 離職日
  retireDate: string //退休日
  severanceDate: string // 資遣日
  militaryServiceType: string // 兵役別
  emergencyContactPhone: string // 緊急聯絡人電話
  emergencyContactRelationship: string // 緊急聯絡人關係
  qualifications: { name: string, years: number }[] // 個人資歷
  jobs?: TjobDto[]
  user?: TuserDto | null
}

export type TjobDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  grade: number
  department: TdepartmentDto_jobs
  employees?: TemployeeDto[]
}

export type TdepartmentDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  code: string
}

/**
 * TdepartmentDto型別裡加 jobs: TjobDto[] 
 */
export type TdepartmentDto_jobs = TdepartmentDto & {
  jobs: TjobDto[]
}

export type TdepartmentManagerDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  code: string
  employees?: TemployeeDto[]
}

export type TerpFeatureDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  departments: TdepartmentDto_jobs[]
}


export type TdailyReportItemDto = {
  id: string
  // createdAt: string // date
  // updatedAt: string //date
  periodOfDay: "AM" | "PM"
  customerName: string
  contactName: string
  order: number
  workingTypes: "install" | "repair" | "power-delivery" | "maintenace" | "inspection"
  descriptiona: string
}

export type TdailyReportDto = {
  id: string
  // createdAt: string // date
  // updatedAt: string //date
  employee: TemployeeDto
  reviewedByEmployee: TemployeeDto
  reviewedAt: string // date
  items: TdailyReportItemDto[]
}

export type TsetReportersDto = {
  employeeIds: string[]
}

export type TcreateDailyReportItemDto = {
  periodOfDay: "AM" | "PM"
  customerName: string
  contactName: string
  workingTypes: "install" | "repair" | "power-delivery" | "maintenace" | "inspection"
  descriptiona: string
}

export type TupdateDailyReportDto = {
  date: string // date
  items: TcreateDailyReportItemDto[]
}









// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// post put patch
// post put patch
// post put patch

export type TupdateCompanyInfoDto = {
  "name": string,
  "phone": string,
  "email": string,
  "county": string,
  "district": string,
  "address": string,
  "fax": string,
  "taxId": string,
}

export type TcreateDepartmentJobDto = {
  name: string
  grade: number
}

export type TupdateDepartmentJobDto = {
  name?: string
  code?: string
  id: string
  jobs: TcreateDepartmentJobDto[]
}











