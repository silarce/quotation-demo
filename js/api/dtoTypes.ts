

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
  category: string
  principal: string
  taxDeductionCategory: string
  taxId: string
  phone: string
  fax: string
  county: string | null
  district: string | null
  address: string | null
  invoiceCounty: string | null
  invoiceDistrict: string | null
  invoiceAddress: string | null
  contacts: Tcontact[] | null
}

export type TemployeeDto = {
  id: string // 應該是資料庫的 pk
  createdAt: string
  updatedAt: string
  idNumber: string // 員工編號
  chName: string
  enName: string
  identity: string  // 身分證字號
  birthday: string
  gender: string
  marital: string
  education: string
  expertise: string
  phone1: string
  phone2: string
  email: string
  residenceCounty: string
  residenceDistrict: string
  residenceAddress: string
  mailingCounty: string
  mailingDistrict: string
  mailingAddress: string
  processPermission: boolean
  seniority: string
  startDate: string
  leaveDate: string
  retireDate: string
  severanceDate: string
  jobs?: TjobDto[]
  user?: TuserDto | null
}

export type TjobDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  grade: number
  department?: TdepartmentDto
  employees?: TemployeeDto[]
}

export type TdepartmentDto = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  jobs?: TjobDto[] //api文件似乎有誤，這邊應該是陣列
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
  departments: TdepartmentDto[]
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











