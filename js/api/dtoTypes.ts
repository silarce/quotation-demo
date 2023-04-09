

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



export type TuserDto = {
  account: string
  createdAt: string
  id: string
  isActive: boolean
  updatedAt: string
  username: string
  employee?: TcompanyInfoDto
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
  "createdAt": string //"2022-10-17T05:35:08.115Z",
  "updatedAt": string //"2022-10-17T05:35:08.115Z",
  "createdBy": string
  "updatedBy": string
  "deletedBy": string | null
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
}

/**
 * TdepartmentDto型別裡加 jobs: TjobDto[] 
 */
export type TdepartmentDto_jobs = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  jobs: TjobDto[]
}

export type TdepartmentManagerDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  employees?: TemployeeDto[]
}


export type TerpFeatureDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  departments: TdepartmentDto_jobs[]
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
  id: string
  jobs: TcreateDepartmentJobDto[]
}











