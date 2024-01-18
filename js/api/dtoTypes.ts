export type Tparams = {
  order?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  filter?: {
    [key: string]: any;
  };
  populate?: string[];
  sort?: string;
};

export type TpageMetaDto = {
  page: number;
  pageSize: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TfileDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  parent: string;
  name: string;
  size: number;
  mime: string;
  etag: string;
  isDir: boolean;
  isWritable: boolean;
  isDeletable: boolean;
};

/** 如果是admin帳號，不會有employee */
export type TuserDto = {
  account: string;
  createdAt: string;
  id: string;
  isActive: boolean;
  updatedAt: string;
  username: string;
  employee?: TemployeeDto & Required<Pick<TemployeeDto, 'jobs'>>;
};

export type TuserDto_login = {
  account: string;
  createdAt: string;
  id: string;
  isActive: boolean;
  updatedAt: string;
  username: string;
};

export type TUserPasswordDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  username: string;
  roles?: string[] | null;
  groups?: string[] | null;
  isActive: boolean;
  password: string;
  employee: TemployeeDto;
};

export type TcompanyInfoDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  county: string;
  district: string;
  address: string;
  fax: string;
  taxId: string;
  logoFileId: string;
};

// api文件沒有清楚contact的型別
export type Tcontact = {
  id: string;
  // "createdAt": string //"2022-10-17T05:35:08.115Z",
  // "updatedAt": string //"2022-10-17T05:35:08.115Z",
  // "createdBy": string
  // "updatedBy": string
  // "deletedBy": string | null
  name: string;
  phone: string;
};

export type TcustomerDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerNumber: string;
  name: string;
  nickname: string;
  principal: string;
  taxDeductionCategory: string;
  taxId: string;
  phone: string;
  fax: string;
  county: string;
  district: string;
  address: string;
  invoiceCounty: string;
  invoiceDistrict: string;
  invoiceAddress: string;
  contacts?: Tcontact[];
  types: {
    //客戶類型
    id: string;
    createdAt: string;
    updateAt: string;
    name: 'construction' | 'firm' | 'propertyOwner' | 'contractor';
  }[];
  legacyContracts?: TlegacyContractDto[];
};

type TcustomerDtoPopulateArr = (keyof Pick<TcustomerDto, 'types' | 'contacts'>)[];

export type TcustomerDto_Populate<populateArr extends TcustomerDtoPopulateArr = []> = TcustomerDto &
  Required<Pick<TcustomerDto, populateArr[number]>>;

export type TemployeeDto = {
  id: string; // 應該是資料庫的 pk
  createdAt: string; // 目前用不到
  updatedAt: string; // 目前用不到
  idNumber: string; // 員工編號
  chName: string;
  enName: string;
  identity: string; // 身分證字號 // 目前用不到
  birthday: string;
  gender: string;
  marital: string; // 婚姻
  education: string;
  expertise: string; // 專長
  phone1: string;
  phone2: string;
  email: string;
  residenceCounty: string;
  residenceDistrict: string;
  residenceAddress: string;
  mailingCounty: string;
  mailingDistrict: string;
  mailingAddress: string;
  processPermission: true; //  處理權限? 目前用不到 // api文件表示這個值會是true
  seniority: string; // 年資
  startDate: string; // 到職日
  leaveDate: string; // 離職日
  retireDate: string; //退休日
  severanceDate: string; // 資遣日
  militaryServiceType: string; // 兵役別
  emergencyContactPhone: string; // 緊急聯絡人電話
  emergencyContactRelationship: string; // 緊急聯絡人關係
  qualifications: { name: string; years: number }[]; // 個人資歷
  jobs?: TjobDto[];
  user?: TuserDto | null;
};

export type TjobDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  grade: number;
  department: TdepartmentDto_jobs;
  employees?: TemployeeDto[];
};

export type TdepartmentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  code: string;
};

/**
 * TdepartmentDto型別裡加 jobs: TjobDto[]
 */
export type TdepartmentDto_jobs = TdepartmentDto & {
  jobs: TjobDto[];
};

export type TdepartmentManagerDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  code: string;
  employees?: TemployeeDto[];
};

export type TerpFeatureDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  departments: TdepartmentDto_jobs[];
  employees: TemployeeDto[];
};

// export type TdailyReportItemDto = {
//   id?: string
//   order?: number
//   // createdAt: Date // date
//   // updatedAt: Date //date
//   periodOfDay: "AM" | "PM"
//   customerName: string
//   contactName: string
//   mealsCost: number
//   description: string
// }
export type TdailyReportItemDto = {
  readonly id: string;
  // 用於設定item的排序
  order: number;
  readonly createdAt: string; // date
  readonly updatedAt: string; //date
  periodOfDay: 'AM' | 'PM' | null;
  customerName: string;
  contactName: string;
  // meals: "breakfast" | "lunch" | "dinner" | null
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  description: string;
  /**date */
  departureTime?: string | null;
  /**date */
  arrivalTime?: string | null;
  /**date */
  departureWorksiteTime?: string | null;
  licensePlate?: string | null;
  stayLength?: number | null; // 基本上是 1|0|null，但如果舊資料沒有更新過，那就可能會是其他數值
  workers: TemployeeDto[] | null;
  workOrderNumber: string | null;
};

export type TdailyReportReviewStatusDto = {
  id: string;
  createdAt: string; // date
  updatedAt: string; //date
  reviewerEmployeeId: string;
  reviewerEmployee: TemployeeDto;
  reviewedAt: string | null; //date
  type: 'reviewer' | 'examiner';
  // examinerEmployeeId: string
  // examinerEmployee: TemployeeDto | null
};

export type TdailyReportDto = {
  id: string;
  createdAt: string; // date
  updatedAt: string; //date
  date: string; // yyyy-MM-DD
  employee: TemployeeDto;
  reviewStatus: TdailyReportReviewStatusDto[];
  isReviewCompleted: boolean;
  reportedAt: Date;
  items: TdailyReportItemDto[];
};

export type TsetReportersDto = {
  employeeIds: string[];
};

export type TcreateDailyReportItemDto = {
  // 帶id代表修改舊有的item，沒id就是新增item
  id?: string;
  periodOfDay: 'AM' | 'PM';
  customerName: string;
  contactName: string;
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  description: string;
  /**date 發出req時會自動被轉為字串*/
  departureTime: string | null;
  /**date 發出req時會自動被轉為字串*/ /**date */ arrivalTime: string | null;
  /**date 發出req時會自動被轉為字串*/
  departureWorksiteTime: string | null;
  licensePlate: string;
  stayLength: number; // 基本上是 1|0
  workerIds: string[] | null;
  workOrderNumber: string;
  // 用於設定item的排序
  order: number;
};

export type TupdateDailyReportDto = {
  // reviewerIds: string[];
  // examinerIds: string[];
  items: TcreateDailyReportItemDto[];
};

export type TdailyReportWorkerJobsDto = {
  name: TjobDto['name'];
  grade: TjobDto['grade'];
};

export type TdailyReportWokerDto = {
  id: TemployeeDto['id'];
  idNumber: TemployeeDto['idNumber'];
  chName: TemployeeDto['chName'];
  jobs: TdailyReportWorkerJobsDto[];
};

// 文件上就沒有Dto後綴
export type TaccountingReportStatistic = {
  date: string;
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  stayLength: number;
  dailyReportId: string;
  isWorker: boolean;
};

export type TaccountingReportDto = {
  employeeId: string;
  employeeName: string | null;
  statistic: TaccountingReportStatistic[];
};

export type TreviewerPresets = {
  createdAt: string;
  updatedAt: string;
  id: string;
  reportEmployee: TemployeeDto;
  reportEmployeeId: string;
  reviewerEmployee: TemployeeDto;
  reviewerEmployeeId: string;
  type: 'reviewer' | 'examiner';
};

// =======================================================
// =======================================================
// =======================================================
// =======================================================

/**付款辦法 */
export type TpaymentMethodDto = {
  /**付款階段(里程碑) */
  milestone: string;
  /**總付款比例(0.0 - 1.0) */
  totalPaymentRatio: string;
};

/**舊合約產品 */
export type TlegacyContractProductDto = {
  id: string;
  /**date */
  createdAt: string;
  /**date */
  updatedAt: string;
  /**折數 0.0~1.0*/
  discountRate: string;
  /**編號 */
  idNumber: number;
  /**項目名 */
  itemName: string;
  /**報價別 */
  quoteType: string;
  /**門型 */
  doorType: string;
  /**L(m) */
  length: string;
  /**W(m) */
  width: string;
  /**h(m) */
  height: string;
  /**B(m) */
  boxB: string;
  /**面積 */
  area: string;
  /**才數 */
  volume: string;
  /**材質 */
  material: string;
  /**表面 */
  surface: string;
  /**門軌 */
  doorTrack: string;
  /**馬力 */
  horsepower: string;
  /**數量 */
  quantity: number;
  /**單價 */
  unitPrice: number;
  /**複價 */
  totalPrice: number;
  /**防颱 */
  typhoonProtection: boolean;
  /**彈射門 */
  bounceDoor: boolean;
  /**備註 */
  notes: string;
  /**厚度 */
  thickness: string;
  /**開閉方式 */
  closingType: string;
  //
  /**批次 */
  batch: number;
  /**所屬批次編號 */
  batchNumber: string;
  //
  order: number; // 排序編號
};

export type TlegacyContractProductItemDto = Omit<TlegacyContractProductDto, 'batch' | 'batchNumber' | 'quantity'> & {
  productId: string;
  product: TlegacyContractProductDto;
};

/**舊合約額外項目 */
export type TlegacyContractAdditionDto = {
  id: string;
  /**date */
  createdAt: string;
  /**date */
  updatedAt: string;
  /**項目名 */
  itemName: string;
  /**內容 */
  content: string;
  /**數量 */
  quantity: number;
  /**單價 */
  unitPrice: number;
  /**複價 */
  totalPrice: number;
  /**備註 */
  notes: string;
  /**單位 */
  unit: string | null;
  //
  /**批次 */
  batch: number;
  /**所屬批次編號 */
  batchNumber: string;

  order: number; // 排序編號
};

/**舊合約 */
export type TlegacyContractDto = {
  id: string;
  /**date */
  createdAt: string;
  /**date */
  updatedAt: string;
  //
  /**合約編號 */
  contractNumber: string;
  /**報價時效 */
  quoteValidity: string;
  /**報價日期 date*/
  quoteDate: string;
  /**工程名稱 */
  projectName: string;
  /**客戶名稱 */
  customerName: string;
  /**聯絡人 */
  contactPerson: string;
  /**聯絡電話 */
  contactNumber: string;
  /**傳真號碼 */
  faxNumber: string;
  /**追蹤狀態 */
  trackingStatus: string;
  /**工地進度 */
  projectProgress: string;
  /**工地位置縣市 */
  projectCity: string;
  /**工地位置地區 */
  projectDistrict: string;
  /**工地位置地址 */
  projectAddress: string;
  //
  /**折扣率(0.0 - 1.0 */
  discountRate: string;
  /**小計 */
  subTotal: number;
  /**營業稅 */
  salesTax: number;
  /**總計 */
  total: number;
  /**交貨地點 */
  deliveryLocation: string;
  /**交貨日期 date*/
  deliveryDate: string;
  /**付款方式 */
  paymentMethods: TpaymentMethodDto[];
  //
  /**備註 */
  notes: string[];

  // 備註編輯紀錄
  notesRecord?: {
    updatedAt: string;
    createdAt: string;
    batch: number;
    legacyContractId: string;
    notes: string[];
  }[];

  /**報價範圍 */
  quoteScopes: string[];
  // /**經理 */
  // managerName: string;
  // /**主管 */
  // supervisorName: string;
  // /**經辦人 */
  // operatorName: string;
  /**經理 */
  managerId: string | null;
  manager: TemployeeDto | null;
  /**主管 */
  supervisorId: string | null;
  supervisor: TemployeeDto | null;
  /**經辦人 */
  operatorId: string | null;
  operator: TemployeeDto | null;
  /**產品 */
  products: TlegacyContractProductDto[];
  /**額外項目 */
  additions: TlegacyContractAdditionDto[];
  //
  /**客戶 */
  customer: TcustomerDto;
  //
  /**最新批次 */
  latestBatch: number;
  /**附屬合約編號 */
  attachBatchNumbers: string[];
  priceRecord: {
    discountRate: string; // 總折數
    subTotal: string; //小計
    salesTax: number; // 營業稅
    total: number; // 總計
  };
};

// 舊合約post主產品
export type TcreateLegacyContractProductDto = {
  /**編號 */
  idNumber: number;
  /**折數 0.0~1.0*/
  discountRate: string;
  /** 項目名 */
  itemName: string;
  /** 報價別 */
  quoteType: string;
  /** 門型 */
  doorType: string;
  /** L(m) */
  length: string;
  /** W(m) */
  width: string;
  /** h(m) */
  height: string;
  /** B(m) */
  boxB: string;
  /** 面積 */
  area: string;
  /** 才數 */
  volume: string;
  /** 材質 */
  material: string;
  /** 表面 */
  surface: string;
  /** 門軌 */
  doorTrack: string;
  /** 馬力 */
  horsepower: string;
  /** 數量 */
  quantity: number;
  /** 單價 */
  unitPrice: number;
  /** 複價 */
  totalPrice: number;
  /** 防颱 */
  typhoonProtection: boolean;
  /** 彈射門 */
  bounceDoor: boolean;
  /** 備註 */
  notes: string;
  /**厚度 */
  thickness: string;
  /**開閉方式 */
  closingType: string;
  //
  order: number; // 排序編號
};

export type TupdateLegacyContractProductDto = TcreateLegacyContractProductDto & {
  // batchNumber?: string;
  id?: string;
};

export type TcreateLegacyContractAdditionDto = {
  /**項目名 */
  itemName: string;
  /** 內容 */
  content: string;
  /** 數量 */
  quantity: number;
  /** 單價 */
  unitPrice: number;
  /** 複價 */
  totalPrice: number;
  /** 備註 */
  notes: string;
  /**單位 */
  unit: string | null;
  order: number; // 排序編號
};

export type TupdateLegacyContractAdditionDto = TcreateLegacyContractAdditionDto & {
  // batchNumber?: string;
  id?: string;
};

export type TcreateLegacyContractDto = {
  /* 客戶ID */
  customerId: string | null;
  /* 合約編號 */
  contractNumber: string;
  /* 報價時段 */
  quoteValidity?: string | null;
  /* 報價日期 date*/
  quoteDate?: string | null;
  /* 工程名稱 */
  projectName: string;
  /* 客戶名稱 */
  customerName: string;
  /* 聯絡人 */
  contactPerson: string;
  /* 聯絡電話 */
  contactNumber: string;
  /* 傳真號碼 */
  faxNumber?: string | null;
  /* 追蹤狀態 */
  trackingStatus?: string | null;
  /* 工地進度 */
  projectProgress?: string | null;
  /* 工地位置縣市 */
  projectCity: string;
  /* 工地位置地區 */
  projectDistrict: string;
  /* 工地位置地址 */
  projectAddress: string;
  /* 折扣率 0.0-1.0*/
  discountRate: string;
  /* 小計 */
  subTotal: number;
  /* 營業稅 */
  salesTax: number;
  /* 總計 */
  total: number;
  /* 交貨地點 */
  deliveryLocation: string;
  /* 交貨日期 date*/
  deliveryDate: string | null;
  /* 付款方式 */
  paymentMethods: TpaymentMethodDto[];
  //
  /* 備註 */
  notes: string[];
  /* 報價範圍 */
  quoteScopes: string[];
  //
  /* 經理 */
  managerId: string | null;
  // managerName: string;
  /* 主管 */
  supervisorId: string | null;
  // supervisorName: string;
  /* 經辦人 */
  operatorId: string | null;
  // operatorName: string;

  //
  /* 產品 */
  products: TcreateLegacyContractProductDto[];
  /* 額外項目 */
  additions: TcreateLegacyContractAdditionDto[];
};

// export type TupdateLegacyContractDto = Partial<
//   Omit<TcreateLegacyContractDto, 'products' | 'additions'> & {
//     products: Partial<TcreateLegacyContractProductDto>[];
//     additions: Partial<TcreateLegacyContractAdditionDto>[];
//   }
// >;
export type TupdateLegacyContractDto = Partial<
  Omit<TcreateLegacyContractDto, 'products' | 'additions'> & {
    products: TupdateLegacyContractProductDto[];
    additions: TupdateLegacyContractAdditionDto[];
  }
>;

export type TmodifyLegacyContractDto = {
  products?: TupdateLegacyContractProductDto[];
  additions?: TupdateLegacyContractAdditionDto[];
  batchNumber: string;
  priceRecord: {
    discountRate: string; // 總折數
    subTotal: string; //小計
    salesTax: number; // 營業稅
    total: number; // 總計
  };
  notesRecord: string[]; // 備註
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// work-sheet

export type annotationAndQuotationRangeType =
  | 'normal'
  | 'anti-typhoon'
  | 'heat-protection'
  | 'heat-protection-smoke-covering';

export type TannotationDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  /**類別 */
  category: string;
  /**門型 */
  doorModelName: 'SJ-302' | 'SJ-312' | 'SJ-305D' | 'SJ-303A' | 'SJ-303AS' | 'SJ-120A' | 'SJ-303S';
  /**型式 */
  type: annotationAndQuotationRangeType;
  /**內容 */
  description: string;
};

export type TcreateAnnotationDto = {
  category: string;
  doorModelName: 'SJ-302' | 'SJ-312' | 'SJ-305D' | 'SJ-303A' | 'SJ-303AS' | 'SJ-120A' | 'SJ-303S';
  type: annotationAndQuotationRangeType;
  description: string;
};

export type TcreateQuotationRangeDto = {
  category: string;
  doorModelName: 'SJ-302' | 'SJ-312' | 'SJ-305D' | 'SJ-303A' | 'SJ-303AS' | 'SJ-120A' | 'SJ-303S';
  type: annotationAndQuotationRangeType;
  description: string;
};

export type TquotationRangeDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  /**類別 */
  category: string;
  /**門型 */
  doorModelName: 'SJ-302' | 'SJ-312' | 'SJ-305D' | 'SJ-303A' | 'SJ-303AS' | 'SJ-120A' | 'SJ-303S';
  /**型式 */
  type: annotationAndQuotationRangeType;
  /**內容 */
  description: string;
};

// ==========================================================================

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

export type TupdateCompanyInfoDto = {
  name: string;
  phone: string;
  email: string;
  county: string;
  district: string;
  address: string;
  fax: string;
  taxId: string;
};

export type TcreateDepartmentJobDto = {
  name: string;
  grade: number;
};

export type TupdateDepartmentJobDto = {
  name?: string;
  code?: string;
  id: string;
  jobs: TcreateDepartmentJobDto[];
};

// ==========================================================================
// quotation model
// quotation

export type TquotationContentOtherDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
  unit: string | null;
};

export type TcreateQuotationContentOtherDto = Omit<TquotationContentOtherDto, 'id' | 'createdAt' | 'updatedAt'>;

/**選配設定 */
export type TquotationProductAccessoriesDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  codeName: string; //代號
  name: string; //名稱
  unit: string; // 單位
  quantity: number; // 數量
  unitPrice: number; // 單價
  totalPrice: number; // 複價
  price: number; // 牌價
  dualPrice: number; // 牌價複價
  order: number;
  //
  referenceSpec: string | null;
  // originalPrice: number;
  originalPrice?: number | undefined;
};
// 但是後端有建立這個型別
export type TcreateQuotationProductAccessoriesDto = Omit<
  TquotationProductAccessoriesDto,
  'id' | 'createdAt' | 'updatedAt'
> & { id?: string };

// 後端其實沒有建立這個型別 // 後端其實沒有建立這個型別
export type TquotationProductComponentsDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type:
    | 'slat'
    | 'bottomBar'
    //
    | 'guideRail'
    | 'sidePlate'
    | 'roller'
    | 'motor'
    | 'motorAccessories'
    | 'headBox';
  number: string;
  componentId: string;
  // TODO 有空要調整型別
  rawData: object; // 裡面裝的其實是TdoorComponentListDto裡面的property之一
  // rawData:
  //   | TdoorSlatDto
  //   | TdoorBottomBarDto
  //   | TdoorGuideRailDto
  //   | TdoorSidePlateDto
  //   | TdoorRollerDto
  //   | TdoorMotorDto
  //   | TdoorMotorAccessoriesDto
  //   | TdoorHeadBoxDto;
  /**
  從TdoorBomDto_Component取得的bom要直接送進來這個bom
   */
  bom: any; // 前端不會直接用到，先直接設object
  material: string;
  materialSurface: string | null | undefined;
  isPainted: boolean;
  price: number;
  quantity: string;
  order: number;

  desc: string | null;
  density: string | null;
  //
};
// 但是後端有建立這個型別
export type TcreateQuotationProductComponentDto = Omit<
  TquotationProductComponentsDto,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TquotationProductDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /**折數 */
  discount: string;
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  fullWidth: number;
  // W(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  WG: number;
  // h(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  height: number;
  // B(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  boxB: number;
  boxD: number;
  // 面積
  area: string;
  // 才數
  volume: string;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string;
  // 門軌G
  guideRailG: number | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string;
  // 電壓
  motorVoltage: number;
  // 馬達支撐架
  hasMotorSupportStand: boolean;
  // 底座類型
  bottomBar: string; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  guideRailThickness: number;
  // 捲軸規格
  rollerSpec: string; // 雙凸|無凸
  // 門軌消音條
  hasSilencingStrip: boolean;
  // 一體式捲箱
  isIntegratedHeadBox: boolean;
  // 捲箱厚度
  headBoxThickness: number;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 複價
  totalPrice: number;
  // 防颱
  isAntiTyphoon: boolean;
  // 彈射門
  bounceDoor: boolean;
  // 關閉方式 //(實際上前端顯示的文字為"開"閉方式)
  closingType: string;
  // 備註
  notes: string;
  order: number;

  motorPhase: number;

  bottomBarAngleIron: string; // 底座角鐵
  bottomBarPlate: string; // 底座板

  isULGuideRail?: boolean | null;
  // 彈射門尺寸
  bounceDoorWidth?: number | null;

  items?: {
    // 材料配件
    components: TquotationProductComponentsDto[];
    // 選配設定
    accessories: TquotationProductAccessoriesDto[];
    // TODO 還有其他很多有的沒有的，用不到，以後有空再補上
  }[];

  quantity: number;
  // 配電箱牌價;
  distributionBoxPrice: number;
  // 配電箱單價;
  distributionBoxUnitPrice: number;
  // 安裝費牌價;
  installationFeePrice: number;
  // 安裝費牌價複價;
  installationFeeDualPrice: number;
  // 安裝費數量;
  installationFeeQuantity: number;
  // 安裝費單價;
  installationFeeUnitPrice: number;
  // 安裝費複價;
  installationFeeTotalPrice: number;

  attachedToProductId?: string | null;
  attachedToProduct?: TquotationProductDto | null;

  rootProductId: string;

  guideRailsOpening?: string | null; //底座 - 開口
  slatCount: string | null; //門片 - 捲片支數

  bearingHousingSize?: number | null; //軸承座寸法
  bearingHousingTotalLength?: string | null; //捲軸 - 總長
  bearingInnerDiameter?: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
  bearingName?: string | null; //軸承
  diameter?: string | null; //捲軸 - 尺寸
  gapA?: string | null; //
  gapC?: string | null; //
  gearNumber?: string | null; //
  sprocketWheelModel?: string | null; //鏈齒輪 - 鏈齒輪番號
  sprocketWheelTeethNumber?: string | null; //鏈齒輪 - 大鏈輪
  sprocketWheelChains?: string | null; //
  weight?: string | null; //
  slatLength?: number | null; //門片長度
  guideRailLength?: number | null; //門軌長度
  headBoxLength?: number | null; //捲箱長度
  thickness: string; // 門片厚度

  //
  // 前端用的，後端沒有
  // 只是為了方便才寫在這邊
  reduceQty?: number;
};

export type TdeliveryStatusDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  productItemId: string;
  //  '所屬產品'
  productItem?: TquotationProductItemDto;
  //  '備註'
  notes: string | null;
  itemName: string | null;
  shippingDate: string | null;
  //  '安裝人員Id'
  installerEmployeeId: string | null;
  //  '安裝人員'
  installerEmployee?: TemployeeDto | null;
  //  '安裝日期'
  installationDate: string | null;
  //  '工作表開立日期'
  workSheetInvoiceDate: string | null;
  //  '追加'
  append: string | null;
  //  '完成追加'
  completeAppend: string | null;
  //
  completePayment: boolean | null;
  productPaymentId: boolean | null;
  productPayments: TaccountsReceivableProductPaymentDto[] | null;
};

export type TcreateEngineeringDeliveryStatusDto = {
  notes: string | null;
  itemName: string | null;
  shippingDate: string | null;
  installerEmployeeId: string | null;
  installationDate: string | null;
  append: string | null;
  completeAppend: string | null;
  productItemId: string;
};

export type TupdateEngineeringDeliveryStatusDto = {
  notes: string | null;
  itemName: string | null;
  shippingDate: string | null;
  installerEmployeeId: string | null;
  installationDate: string | null;
  append: string | null;
  completeAppend: string | null;
  productItemId: string;
};

export type TupdateDeliveryStatus = {
  id: string;
  notes: string;
  installerEmployeeId: string | null;
  installationDate: string | null;
  append: string | null;
  completeAppend: string | null;
};

export type TquotationProductItemDto = Omit<
  TquotationProductDto,
  | 'order'
  | 'items'
  | 'distributionBoxPrice'
  | 'distributionBoxUnitPrice'
  | 'installationFeePrice'
  | 'installationFeeDualPrice'
  | 'installationFeeQuantity'
  | 'installationFeeUnitPrice'
  | 'installationFeeTotalPrice'
  | 'attachedToProductId'
  | 'attachedToProduct'
  | 'rootProductId'
  | 'reduceQty'
  | 'quantity'
> & {
  components: TquotationProductComponentsDto[];
  accessories: TquotationProductAccessoriesDto[];
  product: TquotationProductDto;
  productId: string;
  itemNumber: string;
  worksheetId: string;
  others: null;
  deliveryStatus?: TdeliveryStatusDto[] | null;
  adjustedItem?: Omit<TquotationProductItemDto, 'adjustedItem'> | null;
  adjustedItemId?: string | null;
  //
  // 門片捲片支數
  slatCount: string;
  // 練齒輪番號
  sprocketWheelModel: string;
  // 練齒輪大鏈輪
  sprocketWheelTeethNumber: string;
  // 孔徑 軸徑
  bearingInnerDiameter: string;
  // 卷軸尺寸
  diameter: string;
  // 捲軸總長
  bearingHousingTotalLength: string;
  // 底座開口
  guideRailsOpening: string;
  //  '捲箱 - 正面'
  headBoxFront: string | null;
  //  '捲箱 - 有無凸'
  headBoxProtruding: string | null;
  //  '捲箱 - 角鐵數量'
  headBoxAngleIronQuantity: number | null;
  //  '支板 - 鏈條'
  sidePlateChain: string | null;
  //  '支板 - 方向'
  sidePlateDirection: string | null;
  //  '電動機 - 鍊條形式'
  electricMotorChainType: string | null;
  //  '電動機 - 方向'
  electricMotorDirection: string | null;
  //  '門軌 - 型式'
  guideRailType: string | null;
  // 底座 - 表面
  bottomBarSurface: string | null;
  // 門軌 - 表面
  guideRailSurface: string | null;
};

type TquotationContentDto_copy = {
  id: string;
  createdAt: string;
  updateAt: string;
  quotationNumber: string;
  version: number;

  quotationDate: string; // 報價日期
  validityPeriod: string; // 報價時效
  customer: TcustomerDto;
  projectName: string; // 工程名稱
  county: string; // 縣市
  district: string; // 區
  address: string; // 剩餘地址
  contactPerson: string; //  聯絡人
  contactNumber: string; //  聯絡電話
  quantity: number; // 樘數
  editNotes: string; // 編輯備註
  status: TquotationStatus; // 報價單狀態: 預算 投標 發包 合約 準合約
  managerEmployee: TemployeeDto | null;
  supervisorEmployee: TemployeeDto | null;
  agentEmployee: TemployeeDto;

  //審核相關
  reviewSalesEmployee: TemployeeDto | null;
  salesReviewedAt: string | null;
  toSalesAt: string | null; // date

  reviewSupervisorEmployee: TemployeeDto | null;
  supervisorReviewedAt: string | null;
  toSupervisorAt: string | null; // date

  reviewWorkDirectorEmployee: TemployeeDto | null;
  workDirectorReviewedAt: string | null;
  toWorkDirectorAt: string | null; // date

  reviewManagerEmployee: TemployeeDto | null;
  managerReviewedAt: string | null;
  toManagerAt: string | null; // date

  /**備註 */
  annotations: string[] | null;
  /**報價範圍 */
  quotationRanges: string[] | null;

  faxNumber: string; // 傳真號碼
  trackProgress: string; // 追蹤狀態
  projectProgress: string; //工地進度
  productsOrder?: string[]; // 已棄用
  /** 總折數*/
  discount: string;
  /**小計 */
  subTotal: number;
  /**營業稅 */
  salesTax: number;
  /**總計 */
  total: number;
  /**交貨地點 */
  deliveryLocation: string;
  /**交貨日期 date*/
  deliveryDate: string;
  /**付款方式 */
  paymentMethods: TpaymentMethodDto[];

  others: TquotationContentOtherDto[];
  products: TquotationProductDto[];

  verifyForm: TquotationVerifyFormDto;
};

// 報價單狀態: 預算 投標 發包 合約 準合約
export type TquotationStatus = 'Budget' | 'Bidding' | 'Contracting' | 'Contract' | 'Pending';

export type TquotationContentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  quotationNumber: string;
  version: number;

  quotationDate: string; // 報價日期
  validityPeriod: string; // 報價時效
  customer: TcustomerDto;
  projectName: string; // 工程名稱
  county: string; // 縣市
  district: string; // 區
  address: string; // 剩餘地址
  contactPerson: string; //  聯絡人
  contactNumber: string; //  聯絡電話
  quantity: number; // 樘數
  editNotes: string; // 編輯備註
  status: TquotationStatus; // 報價單狀態: 預算 投標 發包 合約 準合約
  managerEmployee: TemployeeDto | null;
  supervisorEmployee: TemployeeDto | null;
  agentEmployee: TemployeeDto;

  //審核相關
  reviewSalesEmployee: TemployeeDto | null;
  salesReviewedAt: string | null;
  toSalesAt: string | null; // date

  reviewSupervisorEmployee: TemployeeDto | null;
  supervisorReviewedAt: string | null;
  toSupervisorAt: string | null; // date

  reviewWorkDirectorEmployee: TemployeeDto | null;
  workDirectorReviewedAt: string | null;
  toWorkDirectorAt: string | null; // date

  reviewManagerEmployee: TemployeeDto | null;
  managerReviewedAt: string | null;
  toManagerAt: string | null; // date

  /**備註 */
  annotations: string[] | null;
  /**報價範圍 */
  quotationRanges: string[] | null;

  faxNumber: string; // 傳真號碼
  trackProgress: string; // 追蹤狀態
  projectProgress: string; //工地進度
  productsOrder?: string[]; // 已棄用
  /** 總折數*/
  discount: string;
  /**小計 */
  subTotal: number;
  /**營業稅 */
  salesTax: number;
  /**總計 */
  total: number;
  /**交貨地點 */
  deliveryLocation: string;
  /**交貨日期 date*/
  deliveryDate: string;
  /**付款方式 */
  paymentMethods: TpaymentMethodDto[];

  others: TquotationContentOtherDto[];
  products: TquotationProductDto[];

  verifyForm: TquotationVerifyFormDto;

  // ! 直接放TquotationContractDto會造成循環參考，電腦的效能被吃光
  // ! 所以只設需要拿的東西
  // contract?: TquotationContractDto;
  contract?: {
    id: string;
  };

  // api文件上沒寫但應該會有的東西
  // rootContract?: Omit<TquotationContractDto, 'rootContract'>;
  // rootContract?: TquotationContractDto;

  // 為了避免check壞掉，暫時先這樣
  rootContract?: TquotationContentDto_copy;
};

export type TquotationDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  quotationNumber: string;
  latestContent: TquotationContentDto;
  contents: TquotationContentDto[];
  attachedToContract?: TquotationContractDto;
  attachedToContractId: string | null;
};

export type TcreateQuotationProductDto = {
  /**折數 */
  discount: string;
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(m)
  fullWidth: number;
  // W(m)
  WG: number;
  // h(m)
  height: number;
  // B(m)
  boxB: number;
  boxD: number;
  // 面積
  area: string;
  // 才數
  volume: string;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string;
  // 門軌G
  guideRailG: number | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string;
  // 電壓
  motorVoltage: number;
  // 馬達支撐架
  hasMotorSupportStand: boolean;
  // 底座類型
  bottomBar: string; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  guideRailThickness: number;
  // 捲軸規格
  rollerSpec: string; // 雙凸|無凸
  // 門軌消音條
  hasSilencingStrip: boolean;
  // 一體式捲箱
  isIntegratedHeadBox: boolean;
  // 捲箱厚度
  headBoxThickness: number;
  // 數量
  quantity: number;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 複價
  totalPrice: number;
  // 防颱
  isAntiTyphoon: boolean;
  // 彈射門
  bounceDoor: boolean;
  // 彈射門尺寸
  bounceDoorWidth: number | null;
  // 關閉方式 //(實際上前端顯示的文字為"開"閉方式)
  closingType: string;
  // 備註
  notes: string;

  motorPhase: number;

  // 選配設定
  accessories: {
    codeName: string; //代號
    name: string; //名稱
    unit: string; // 單位
    quantity: number; // 數量
    unitPrice: number; // 單價
    totalPrice: number; // 複價
    price: number; // 牌價
    dualPrice: number; // 牌價複價
    order: number;
  }[];
  components: TcreateQuotationProductComponentDto[];
  //
  // materialSurface: string;
  isPainted: boolean;
  order: number;
  bottomBarAngleIron: string; // 底座角鐵
  bottomBarPlate: string; // 底座板

  // 門片厚度
  thickness: string;
  // 配電箱 牌價;
  distributionBoxPrice: number;
  // 配電箱 單價;
  distributionBoxUnitPrice: number;
  // 安裝費 牌價;
  installationFeePrice: number;
  // 安裝費 牌價複價;
  installationFeeDualPrice: number;
  // 安裝費 數量;
  installationFeeQuantity: number;
  // 安裝費 單價;
  installationFeeUnitPrice: number;
  // 安裝費 複價;
  installationFeeTotalPrice: number;

  slatCount: string | null; //門片 - 捲片支數
  sprocketWheelModel: string | null; //鏈齒輪 - 鏈齒輪番號
  sprocketWheelTeethNumber: string | null; //鏈齒輪 - 大鏈輪
  sprocketWheelChains: string | null; //
  bearingInnerDiameter: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
  diameter: string | null; //捲軸 - 尺寸
  bearingHousingTotalLength: string | null; //捲軸 - 總長
  guideRailsOpening: string | null; //底座 - 開口
  slatLength: number | null; //門片長度
  guideRailLength: number | null; //門軌長度
  headBoxLength: number | null; //捲箱長度
  bearingHousingSize: number | null; //軸承座寸法
  bearingName: string | null; //軸承
  gapA: string | null; //
  gapC: string | null; //
  gearNumber: string | null; //
  weight: string | null; //
};

export type TcreateQuotationContentDto = {
  quotationDate: string; // 報價日期
  validityPeriod: string; // 報價時效
  customerId: string; // 客戶ID
  projectName: string; // 工程名稱
  county: string; // 縣市
  district: string; // 區
  address: string; // 剩餘地址
  contactPerson: string; //  聯絡人
  contactNumber: string; //  聯絡電話

  quantity: number; // 樘數
  editNotes: string; // 編輯備註
  status: TquotationStatus; // 報價單狀態: 預算 投標 發包 合約 準合約
  managerId?: string | undefined | null; // 經理ID
  supervisorId?: string | undefined | null; // 主管ID
  agentId: string; // 經辦人ID
  //
  faxNumber: string;
  trackProgress: string;
  projectProgress: string;
  // 備註列表
  annotations: string[];
  // 報價範圍
  quotationRanges: string[];
  discount: `${number}`; // api文件上是string,但送number似乎也行 // 總折數
  subTotal: number;
  salesTax: number;
  total: number;
  deliveryLocation: string;
  // 交貨日期
  deliveryDate: string | null;
  paymentMethods: TpaymentMethodDto[];

  others: TcreateQuotationContentOtherDto[];
  products: TcreateQuotationProductDto[];
  productsOrder?: string[] | null; // 已棄用
};

/**合約 */
export type TquotationContractDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  annotations: string[] | null;
  quotationRanges: string[] | null;
  discount: string;
  subTotal: number;
  salesTax: number;
  total: number;
  deliveryLocation: string;
  deliveryDate: string | null; // date
  paymentMethods: TpaymentMethodDto[];
  verifyForm: TquotationVerifyFormDto;
  quotation: TquotationDto;
  content: TquotationContentDto;
  // attachedToContract: TquotationContractDto; // 上一份追加減合約
  // attachedContract: TquotationContractDto; // 下一份追加減合約
  rootContract?: TquotationContractDto; // 源合約
  version: number;
  //
  subContracts: TquotationContractDto[];
  /**工程聯絡單ID */
  engineeringContactId: string | null;
  /**工作表 */
  worksheet?: TworkSheetDto; // populate
  /**工作表ID */
  worksheetId: string | null;
  /**出庫單ID */
  engineeringDeliveryListId: string | null;
  /**應收帳款明細 */
  accountReceivable?: TaccountReceivableDto; // populate
  accountReceivableId: string | null;
};

export type TcreateModifyQuotationDto = {
  // 報價日期
  quotationDate?: string;
  // 報價時效
  validityPeriod?: string;
  // 客戶 ID
  customerId?: string;
  // 工程名稱
  projectName?: string;
  // 縣市
  county?: string;
  // 區
  district?: string;
  // 詳細地址
  address?: string;
  // 聯絡人
  contactPerson?: string;
  // 聯絡電話
  contactNumber?: string;
  // 傳真電話
  faxNumber?: string;
  // 追蹤進度
  trackProgress?: string;
  // 工地進度
  projectProgress?: string;
  // 樘數
  quantity?: number;
  // 編輯備註
  editNotes?: string;
  annotations?: string[] | null;
  quotationRanges?: string[] | null;
  // 經理
  managerId?: string | null;
  // 主管
  supervisorId?: string | null;
  // 經辦人
  agentId?: string;
  // 總折數
  discount?: string;
  // 小計
  subTotal?: number;
  // 營業稅
  salesTax?: number;
  // 總計
  total?: number;
  // 交貨地點
  deliveryLocation?: string;
  // 交貨日期
  deliveryDate?: string | null;
  paymentMethods?: TpaymentMethodDto[];
  products?: TcreateQuotationProductDto[];
  others?: TcreateQuotationContentOtherDto[];
};

export type TquotationAccouting = {
  quotetype: string;
  totalsum: string; // 牌價複價
  pricesum: string; // 單價複價
  quotation_number: string;
  project_name: string;
  contactnumber: string;
  contactperson: string;
  customername: string;
  percentage: number;
};

export type TquotationAccouting_years = {
  year: number | null;
  // month: number;
  // 這是前端設的，後端是設為number
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;
  totalsum: string;
  company_location: string;
};

// 全區業績統計表
export type TquotationAccouting_area = {
  quotetype: string;
  year: number;
  month: number;
  county: string;
  totalsum: string; // 牌價複價
  pricesum: string; // 單價複價
  percentage: number | null; // 百分比
};

// 個人業績統計表_報價單
export type TquotationAccounting_personal_content = {
  project_name: string;
  quotation_number: string;
  quotetype: string;
  totalsum: `${number}`;
  pricesum: `${number}`;
  percentage: number;
};

// 個人業績統計表_合約
export type TquotationAccounting_personal_contract = {
  projectname: string;
  quotationnumber: string;
  quotetype: string;
  totalsum: `${number}`;
  pricesum: `${number}`;
  percentage: number;
};

// 追加減工程統計表
export type TquotationAccounting_modifyContract = {
  projectname: string;
  quotationnumber: string;
  quotetype: string;
  year: number;
  month: number;
  totalsum: `${number}`;
  pricesum: `${number}`;
  county: string;
  percentage: number | null;
};

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
export type TdoorModelName = 'SJ-302' | 'SJ-312' | ' SJ-305D' | ' SJ-303A' | 'SJ-303AS' | 'SJ-120A' | ' SJ-303S';

export type TdoorMaterialDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string; //材質代號
  name: string; //材質名稱
};

export type TdoorModelInfoDto = {
  name: TdoorModelName;
  density: number; // 密度?
  guideRails: {
    imgSrc: string;
    opening: string; // 印象中好像跟圖片中的開口有關??
    thickness: string;
    withHook: boolean | null; // 防颱勾?
    hasSilencingStrip: boolean;
    width: number;
  }[];
  thickness: string;
  slatMaterials: TdoorMaterialDto[]; // 支板材質?
};

export type TdoorGeneralSpecsMotorBoxPropertyDto = {
  boxB: number;
  boxD: number;
};
export type TdoorGeneralSpecsMotorBoxDto = {
  default?: TdoorGeneralSpecsMotorBoxPropertyDto;
  大同?: TdoorGeneralSpecsMotorBoxPropertyDto;
  東元?: TdoorGeneralSpecsMotorBoxPropertyDto;
};

export type TdoorGeneralSpecsMotorDto = {
  box?: TdoorGeneralSpecsMotorBoxDto;
  hp: string;
};

export type TdoorGeneralSpecsDto = {
  bearingHousingSize: number; // 軸承座寸法
  bearingHousingTotalLength: number; // 軸承座總長(=捲軸長度)
  bearingInnerDiameter: string; // 軸承內徑
  bearingName: string; // 軸承
  defaultMotorIndex: number;
  density: number; // 密度
  diameter: number; // 捲軸直徑
  gapA: number;
  gapC: number;
  motors: TdoorGeneralSpecsMotorDto[];
  gearNumber: string;
  sprocketWheelModel: string;
  sprocketWheelTeethNumber: string;
  sprocketWheelChains: number;
  weight: number;
  slatLength: number; // 門片長度
  guideRailLength: number; // 門軌長度
  headBoxLength: number; //  捲箱長度
  thickness: string; // 門片厚度
};

export type TdoorSlatDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  isAntiTyphoon: boolean;
};

export type TdoorBottomBarDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  isAntiTyphoon: boolean;
  isWaterProof: boolean;
  hasAluminumBarrier: boolean; // 鋁障感
};

export type TdoorGuideRailDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  thickness: string | null;
  isAntiTyphoon: boolean;
  /**消音條 */
  hasSilencingStrip: boolean; // 消音條
  imageName: string | null; // 圖片名稱

  isUL: boolean;
};

export type TdoorSidePlateDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  bearingType: string | null; // 軸承
  gearNumber: string | null; // 鍊齒輪番號
  /**一體式捲箱 */
  isIntegrated: boolean | null; // 一體式捲箱
  motorVendor: string | null; // 馬達廠商
  maxDoorWeight: number | null; // 最大門重量(kg)
  minDoorWeight: number | null; // 最小門重量(kg)

  sizeB: number | null;
  // 需要有表面
};

export type TdoorRollerDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  /**直徑(inch) */
  diameter: string; // 直徑(inch)
};

export type TdoorMotorDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  horsePower: string; // 馬力數
  gearNumber: string; // 鍊齒輪番號
  motorVendor: string | null; // 馬達廠商
  phase: number | null; // 相數
  /**電壓(V) */
  voltage: number | null; // 電壓(V)
  /**荷重(kg) */
  loadWeight: number | null; // 荷重(kg)
  hasSupportStand: boolean | null; // 有腳 // 馬達支撐架
};

export type TdoorMotorAccessoriesDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;

  /**鍊條排數 */
  chains: number; // 鍊條排數
  /**軸承 */
  bearingType: string; // 軸承
  gearNumber: string;
};

export type TdoorHeadBoxDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name: string;

  thickness: string; // 厚度
  /**一體式捲箱 */
  isIntegrated: boolean; // 一體式捲箱
};

export type TdoorComponentListDto = {
  slats: TdoorSlatDto[]; // 門片
  bottomBars: TdoorBottomBarDto[]; // 底座
  guideRails: TdoorGuideRailDto[]; // 門軌
  sidePlates: TdoorSidePlateDto[]; // 支板
  rollers: TdoorRollerDto[]; // 卷軸
  motors: TdoorMotorDto[]; // 馬達
  motorAccessories: TdoorMotorAccessoriesDto[]; // 馬達配件
  headBoxes: TdoorHeadBoxDto[]; // 捲箱
};

export type TgenerateDoorProductBomDto_ComponentInfo = {
  id: string;
  material: string; // 材質
  materialSurface?: '2B' | 'HL' | 'BA' | 'NO.4' | '烤漆' | '氟碳' | null; // 表面處理
  isPainted: boolean; // 烤漆
  thickness?: string; // 厚度
};

export type TgenerateDoorProductBomDto_DoorSpec = {
  modelName: TdoorModelName;
  weight: number;
  height: number;
  B: number;
  D: number;
  slatLength: number;
  guideRailLength: number;
  rollerLength: number;
  headBoxLength: number;
  isAntiTyphoon: boolean;
  rollerDiameter: number;
  bearingType: string;
  gearNumber: string;
  chains: number;
  fullWidth: number;

  bottomBarAngleIron: string;
  bottomBarPlate: string;
};

export type TgenerateDoorProductBomDto = {
  doorSpec: TgenerateDoorProductBomDto_DoorSpec;
  slat: TgenerateDoorProductBomDto_ComponentInfo;
  bottomBar: TgenerateDoorProductBomDto_ComponentInfo;
  guideRail: TgenerateDoorProductBomDto_ComponentInfo;
  sidePlate: TgenerateDoorProductBomDto_ComponentInfo;
  roller: TgenerateDoorProductBomDto_ComponentInfo;
  motor: TgenerateDoorProductBomDto_ComponentInfo;
  motorAccessories: TgenerateDoorProductBomDto_ComponentInfo;
  headBox: TgenerateDoorProductBomDto_ComponentInfo;
};

export type TdoorBomDto_Component = {
  id: string;
  number: string;
  bom: object[]; // 前端不會直接用到，先直接設object
  unitPrice: number;
  quantity: number;
};

export type TdoorProductBomDto = {
  slat: TdoorBomDto_Component;
  bottomBar: TdoorBomDto_Component;
  guideRail: TdoorBomDto_Component;
  sidePlate: TdoorBomDto_Component;
  roller: TdoorBomDto_Component;
  motor: TdoorBomDto_Component;
  motorAccessories: TdoorBomDto_Component;
  headBox: TdoorBomDto_Component;
};

export type TdoorAccessoryDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: TdoorModelName;
  name: string;
  unit: string | null;
  referenceSpec: string | null;
  cost: number | null;
  price: number | null;
};

// =========================================================================

export type TpaymentRatioDto = {
  // '階段'
  level: string;
  // example: '0.35', description: '比例(0.0 - 1.0)'
  paymentRatio: string;
  // 金額
  price: string;
  // 備註
  note: string | null;
};

export type TquotationVerifyFormDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  //  請款日期
  askForPaymentDate: string;
  //  放款日期
  disbursementDate: string;
  //  請款比例
  paymentRatio: TpaymentRatioDto[];
  //  合理放款票期
  paymentTenor: string;
  //  履約保證票
  performanceBond: boolean;
  //  可否請款訂金
  depositPayment: boolean;
  //  保固期(年)
  warrantyPeriod: number;
  //  備註
  note: string;
  //  保固金或保固票
  warrantyPayment: boolean;
  //  防火證明
  fireproofCertificate: boolean;
  //  保固書
  warranty: boolean;
  //  是否需配合工地試車
  testDrive: boolean;
  //  扣款項目、比例、金額
  debitItem: string;
  // 合約審核表審核主管(工務部主管)
  workDirectorId: string;
};

export type TcreateQuotationVerifyFormDto = {
  //  請款日期
  askForPaymentDate: string;
  //  放款日期
  disbursementDate: string;
  //  請款比例
  paymentRatio: TpaymentRatioDto[];
  //  合理放款票期
  paymentTenor: string;
  //  履約保證票
  performanceBond: boolean;
  //  可否請款訂金
  depositPayment: boolean;
  //  保固期(年)
  warrantyPeriod: number;
  //  備註
  note: string;
  //  保固金或保固票
  warrantyPayment: boolean;
  //  防火證明
  fireproofCertificate: boolean;
  //  保固書
  warranty: boolean;
  //  是否需配合工地試車
  testDrive: boolean;
  //  扣款項目、比例、金額
  debitItem: string;
};

export type TreviewQuotationContentDto = {
  reviewSalesEmployeeId?: string | null;
  reviewSupervisorEmployeeId?: string | null;
  reviewWorkDirectorEmployeeId?: string | null;
  reviewManagerEmployeeId?: string | null;
  reviewResult: boolean;
};

export type TsubmitReviewQotuationContentDto = {
  reviewSalesEmployeeId?: string | null;
  reviewSupervisorEmployeeId?: string | null;
  reviewWorkDirectorEmployeeId?: string | null;
};

// =========================================================================

// engineering
// 工程聯絡單
export type TengineeringContactDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  contractNumber: string;

  /**請款狀態 */
  paymentStatus: string;
  projectName: string;
  /**工程內容 */
  projectContent: string;
  zipCode: string | null;
  county: string;
  district: string;
  address: string;
  /**工程負責人 */
  projectPrincipal: string;
  /**工程負責人聯絡電話 */
  constructionSitePrincipalContactNumber: string;
  /**工地傳真 */
  constructionSiteFaxNumber: string;
  /**工地電話 */
  constructionSiteContactNumber: string;
  /**工程編號 */
  projectNumber: string;
  /**承包商 */
  contractor: string;
  /**承包商負責人 */
  contractorPrincipal: string;
  /**承包商公司電話 */
  contractorContactNumber: string;
  contractorFaxNumber: string;
  /**備註列表 */
  annotations: string[] | null;
  /**聯絡人列表 */
  contactInfo:
    | {
        contactPerson: string;
        contactNumber: string;
      }[]
    | null;
  //
  contractId?: string | null;
  contract?: TquotationContractDto | null;
  quotationId?: string | null;
  quotation?: TquotationDto | null;
};

export type TupdateEngineeringContactDto = {
  /**合約編號 */
  contractNumber?: string;
  /**請款狀態 */
  paymentStatus?: string;
  /**工程名稱 */
  projectName?: string;
  /**工程內容 */
  projectContent?: string;
  zipCode?: string | null;
  county?: string;
  district?: string;
  address?: string;
  /**工程負責人 */
  projectPrincipal?: string;
  /**工程負責人聯絡電話 */
  constructionSitePrincipalContactNumber?: string;
  constructionSiteFaxNumber?: string;
  /**工地電話 */
  constructionSiteContactNumber?: string;
  /**工程編號 */
  projectNumber: string;
  /**承包商 */
  contractor: string;
  /**承包商負責人 */
  contractorPrincipal: string;
  /**承包商公司電話 */
  contractorContactNumber: string;
  /**承包商公司傳真 */
  contractorFaxNumber: string;

  /**備註列表 */
  annotations?: string[] | null;

  /**聯絡人列表 */
  contactInfo: {
    contactPerson: string;
    contactNumber: string;
  }[];
};

export type TcreateEngineeringContactDto = {
  quotationId?: string | null; // 報價單ID
  contractId?: string | null; // 合約ID
};

// 派工單
export type TdispatchingDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // 派工日期
  dispatchDate: string;
  // 工程名稱
  projectName: string;
  // 承包商;
  // contractor: string;
  // 承包商聯絡人;
  contractorContactPerson: string;
  // 工地電話;
  constructionSiteContactNumber: string;
  // 工程縣市;
  county: string;
  // 工程區;
  district: string;
  // 工程詳細地址;
  address: string;
  // 工程編號;
  projectNumber: string;
  // 管制卡編號;
  badgeNumber: string;
  // 工務人員ID
  workerId: string;
  // 工務人員
  workerEmployee: TemployeeDto;
  // 完工聯絡人;
  finalContactPerson: string;
  // 辦理事項;
  tasks: string;
  // 派工批價方式;
  pricingMethod: string;
  // 備註下次注意事項;
  note: string | null;
  // 所屬合約Id;
  contractId: string | null;
  contract: TquotationContractDto | null;
  quotationId: string | null;
  quotation?: TquotationDto | null;
};

export type TcreateDispatchingDto = {
  // 合約id
  contractId: string;
  // 派工日期;
  dispatchDate: string;
  // 工程名稱;
  projectName: string;
  // 承包商;
  // contractor: string;
  // 承包商聯絡人;
  contractorContactPerson: string;
  // 工地電話;
  constructionSiteContactNumber: string;
  // 工程縣市;
  county: string;
  // 工程區;
  district: string;
  // 工程詳細地址;
  address: string;
  // 工程編號;
  projectNumber: string;
  // 管制卡編號;
  badgeNumber: string;
  // 工務人員ID
  workerId: string;
  // 完工聯絡人
  finalContactPerson: string;
  // 辦理事項
  tasks: string;
  // 派工批價方式
  pricingMethod: string;
  // 備註下次注意事項
  note: string | null;
};

export type TelectronicSuppliesRecordDto = {
  id: string;
  electronicSuppliesId: string; // 前端用不到
  createdAt: string;
  updatedAt: string;
  doorType: string;
  itemName: '鎖盒' | '鑰匙' | '押扣' | '控制箱/盤' | '消防備品' | '板門配件' | '主機' | '紅外線' | '防颱配件' | '其他';
  category: string;
  quantity: number;
  unit: string | null;
};

export type TcreateElectronicSuppliesRecordDto = {
  id?: string; // 後端沒有，前端為了方便加上去的
  doorType: string;
  itemName: '鎖盒' | '鑰匙' | '押扣' | '控制箱/盤' | '消防備品' | '板門配件' | '主機' | '紅外線' | '防颱配件' | '其他';
  category: string;
  quantity: number;
  unit: string | null;
};

export type TupdateElectronicSuppliesRecordDto = Partial<TcreateElectronicSuppliesRecordDto> & { id?: string };

export type TelectronicSuppliesDto = {
  id: string;
  createdAt: string; // date
  updatedAt: string; // date
  // 填表日期
  dispatchDate: string; //date
  // 需要日期
  requirementsDate: string; //date
  // 工程編號
  // engineeringNumber: string;
  projectNumber: string;
  // 工程名稱
  projectName: string;

  electronicSuppliesRecords: TelectronicSuppliesRecordDto[];
  // others: string;

  // 備料人員Id
  materialHandlerId?: string | null;
  // 備料人員
  materialHandler?: TemployeeDto | null;
  // 領料人員ID
  ingredientTechnicianId?: string | null;
  // 領料人員
  ingredientTechnician?: TemployeeDto | null;
  //填表人員ID
  formCompleterId?: string | null;
  // 填表人員
  formCompleter?: TemployeeDto | null;

  contractId?: string;
  contract?: TquotationContractDto;
  legacyContractId?: string;
  legacyContract?: TlegacyContractDto;
  // quotationId: string;
  // quotation: TquotationDto;
};

export type TcreateElectronicSuppliesDto = Omit<
  TelectronicSuppliesDto,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'contract'
  | 'legacyContract'
  | 'quotation'
  | 'materialHandler'
  | 'ingredientTechnician'
  | 'formCompleter'
  | 'electronicSuppliesRecords'
> & {
  electronicSuppliesRecords: TcreateElectronicSuppliesRecordDto[];
};

export type TupdateElectronicSuppliesDto = Omit<Partial<TcreateElectronicSuppliesDto>, 'electronicSuppliesRecords'> & {
  electronicSuppliesRecords: TupdateElectronicSuppliesRecordDto[];
};

export type TexchangeRecordDto = {
  id: string;
  createdAt: string; // date
  updatedAt: string; // date
  goodsName: string;
  goodsSpec: string;
  goodsQuantity: number;
  reason: string;
};

export type TcreateExchangeRecordDto = {
  id?: string;
  goodsName: string;
  goodsSpec: string;
  goodsQuantity: number;
  reason: string;
};

export type TexchangeDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  dispatchDate: string; // date // 填表日期
  requirementsDate: string; // date // 需要日期
  projectNumber: string; // 工程編號
  projectName: string;
  exchangeRecords: TexchangeRecordDto[];
  accountingId: string;
  accounting: TemployeeDto; // 會計
  warehouseEmployeeId: string;
  warehouseEmployee: TemployeeDto; // 倉庫人員
  factoryEmployeeId: string;
  factoryEmployee: TemployeeDto; // 廠務人員
  supervisorId: string;
  supervisor: TemployeeDto; //單位主管
  formCompleterId: string;
  formCompleter: TemployeeDto; // 填表人員
  contractId: string | null;
  contract: TquotationContractDto | null;
  legacyContractId: string | null;
  legacyContract: TlegacyContractDto | null;
};

export type TcreateExchgangeDto = {
  dispatchDate: string; // date // 填表日期
  requirementsDate: string; // date // 需要日期
  projectNumber: string; // 工程編號
  projectName: string;
  exchangeRecords: TcreateExchangeRecordDto[];
  accountingId: string;
  warehouseEmployeeId: string;
  factoryEmployeeId: string;
  supervisorId: string;
  formCompleterId: string;
  contractId?: string | null;
  legacyContractId?: string | null;
};

export type TworkSheetDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  contractProductItems: TquotationProductItemDto[];
  legacyProductItems: TlegacyContractProductItemDto[];
  contractId: string | null;
  contract?: TquotationContentDto;
  legacyContractId: string | null;
  legacyContract?: TlegacyContractDto;
};

export type TcreateWorkSheetDto = {
  contractId?: string | null;
  legacyContractId?: string | null;
};

// export type TupdateWorkSheet = {
//   id: string;
//   // createdAt: string;
//   // updatedAt: string;
//   // createdBy: string;
//   // updatedBy: string;
//   // deletedBy: string;
//   itemNumber: string;
//   itemName: string;
//   discount: string;
//   quoteType: string;
//   doorModelName: string;
//   fullWidth: number;
//   WG: number;
//   height: number;
//   boxB: number;
//   area: string;
//   volume: string;
//   materialName: string;
//   materialSurface: string;
//   guideRail: string;
//   horsepower: string;
//   motorVendor: string;
//   motorVoltage: number;
//   hasMotorSupportStand: boolean;
//   bottomBar: string;
//   motorLockBox: string;
//   guideRailThickness: string;
//   rollerSpec: string;
//   hasSilencingStrip: boolean;
//   isIntegratedHeadBox: boolean;
//   headBoxThickness: string;
//   unitPrice: number;
//   totalPrice: number;
//   price: number;
//   dualPrice: number;
//   isAntiTyphoon: boolean;
//   bounceDoor: boolean;
//   closingType: string;
//   notes: string;
//   motorPhase: number;
//   bottomBarAngleIron: string;
//   bottomBarPlate: string;
//   productId: string;
//   worksheetId: string;
//   others: null;
//   components: TquotationProductComponentsDto[];
//   accessories: TcreateQuotationProductAccessoriesDto[];
//   adjustedItem: undefined;
//   adjustedItemId: undefined;
// };
export type TupdateWorkSheetItem = {
  id: string;
  itemNumber: string;
  itemName: string;
  discount: string;
  quoteType: string;
  doorModelName: string;
  fullWidth: number;
  WG: number;
  height: number;
  boxB: number;
  area: string;
  volume: string;
  materialName: string;
  materialSurface: string | null;
  guideRail: string;
  horsepower: string;
  motorVendor: string;
  motorVoltage: number;
  hasMotorSupportStand: boolean;
  bottomBar: string; // 鋁障感 | 止水型 | ''
  motorLockBox: string;
  guideRailThickness: string;
  rollerSpec: string; // 雙凸|無凸
  hasSilencingStrip: boolean;
  isIntegratedHeadBox: boolean;
  headBoxThickness: string;
  unitPrice: number;
  totalPrice: number;
  price: number;
  dualPrice: number;
  isAntiTyphoon: boolean;
  bounceDoor: boolean;
  // 彈射門尺寸
  // bounceDoorWidth: number | null;
  closingType: string;
  notes: string;
  motorPhase: number;
  bottomBarAngleIron: string;
  bottomBarPlate: string;
  productId: string;
  worksheetId: string;
  others: null;
  components: TquotationProductComponentsDto[];
  accessories: TcreateQuotationProductAccessoriesDto[];
  adjustedItem: undefined;
  adjustedItemId: undefined;
  //
  // 門片捲片支數
  slatCount: string;
  // 底座開口
  guideRailsOpening: string;
  //
  //
  // thickness: string;
  boxD: number;

  bearingHousingSize?: number | null; //軸承座寸法
  bearingHousingTotalLength?: string | null; //捲軸 - 總長
  bearingInnerDiameter?: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
  bearingName?: string | null; //軸承
  diameter?: string | null; //捲軸 - 尺寸
  gapA?: string | null; //
  gapC?: string | null; //
  gearNumber?: string | null; //
  sprocketWheelModel?: string | null; //鏈齒輪 - 鏈齒輪番號
  sprocketWheelTeethNumber?: string | null; //鏈齒輪 - 大鏈輪
  sprocketWheelChains?: string | null; //
  weight?: string | null; //
  slatLength?: number | null; //門片長度
  guideRailLength?: number | null; //門軌長度
  headBoxLength?: number | null; //捲箱長度
  thickness: string; // 門片厚度

  //  '捲箱 - 正面'
  headBoxFront: string | null;
  //  '捲箱 - 有無凸'
  headBoxProtruding: string | null;
  //  '捲箱 - 角鐵數量'
  headBoxAngleIronQuantity: number | null;
  //  '支板 - 鏈條'
  sidePlateChain: string | null; // 改取用 sprocketWheelModel，這個property應該就不需要了
  //  '支板 - 方向'
  sidePlateDirection: string | null;
  //  '電動機 - 鍊條形式'
  electricMotorChainType: string | null;
  //  '電動機 - 方向'
  electricMotorDirection: string | null;
  //  '門軌 - 型式'
  guideRailType: string | null;
  // 底座 - 表面
  bottomBarSurface: string | null; // 可以記錄在component裡面，這個property應該就不需要了
  // 門軌 - 表面
  guideRailSurface: string | null; // 可以記錄在component裡面，這個property應該就不需要了
  //
  //
  guideRailG: number | null;
};

export type TupdateWorkSheet = {
  contractProductItems: TupdateWorkSheetItem[];
};

// 出庫單

export type TengineeringDeliveryListDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  contract: TquotationContractDto;
};

// export type TupdateEngineeringDeliveryList = {
//   notes: string;
//   productsItemStatus?: TupdateDeliveryStatus[];
// };

export type TupdateEngineeringDeliveryListDto = {
  notes: string;
};

// 應收帳款明細
export type TaccountReceivableDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // 估價日期
  valuationDate: string | null;
  // 付清日期
  payOffDay: string | null;
  // 履約保證票
  performanceBond: boolean;
  // 訂金款保證票
  depositGuaranteeTicket: boolean;
  // 保固票
  warrantyTicket: boolean;
  // 異常燈號(工作表已開立，合約尚未簽回)
  hasNoContract: boolean;
  // 提醒燈號(已出具證明，尚未收足款項)
  hasUncollectedAmounts: boolean;
  // 已出貨，因故尚未安裝
  hasNotInstall: boolean;
  // 請款比例
  paymentRatio: TpaymentRatioDto[];
  contract: TquotationContractDto;
  legacyContract: TlegacyContractDto;
  accountReceivableDeduction: TaccountsReceivableDeductionDto[] | null;
  accountant: TaccountantDto | null;
  isDone: boolean;
};

export type TcreateAccountReceivableDto = {
  // 估價日期
  valuationDate: string | null;
  // 付清日期
  payOffDay: string | null;
  // 履約保證票
  performanceBond: boolean;
  // 訂金款保證票
  depositGuaranteeTicket: boolean;
  // 保固票
  warrantyTicket: boolean;
  // 異常燈號(工作表已開立，合約尚未簽回)
  hasNoContract: boolean;
  // 提醒燈號(已出具證明，尚未收足款項)
  hasUncollectedAmounts: boolean;
  // 已出貨，因故尚未安裝
  hasNotInstall: boolean;
  // 收款明細
  accountantId: string[] | null;
  // 扣款明細
  accountReceivableDeduction: TcreateAccountReceivableDeductionDto[] | null;
  // 發票紀錄
  invoices: TcreateAccountReceivableInvoiceDto[] | null;
  // 所屬合約Id;
  contractId: string | null;
  // 所屬合約Id;
  legacyContractId: string | null;
  // 是否已做完
  isDone: boolean;
};

export type TupdateAccountReceivableDto = Pick<
  TaccountReceivableDto,
  | 'valuationDate'
  | 'payOffDay'
  | 'performanceBond'
  | 'depositGuaranteeTicket'
  | 'warrantyTicket'
  | 'hasNoContract'
  | 'hasUncollectedAmounts'
  | 'hasNotInstall'
  | 'isDone'
>;

// 發票
export type TaccountsReceivableInvoiceDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** 發票日期 */
  invoiceDate: string;
  /** 發票號碼 */
  invoiceNumber: string;
  price: number;
  note: string | null;
  invoiceStatus: '已開立' | '已作廢';
  period: number | null;
  /** 所屬應收帳款ID */
  accountsReceivableId: string | null;
  accountsReceivable?: TaccountReceivableDto | null;

  accountantList: TaccountantDto[];
};

export type TcreateAccountReceivableInvoiceDto = Pick<
  TaccountsReceivableInvoiceDto,
  'invoiceDate' | 'invoiceNumber' | 'price' | 'note'
>;

export type TupdateAccountReceivableInvoiceDto = Pick<
  TaccountsReceivableInvoiceDto,
  'invoiceDate' | 'invoiceNumber' | 'price' | 'note'
> & {
  // 關聯的收款紀錄Id
  accountants: string[];
};

export type TaccountantDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  paymentType: '匯款' | '票據' | '現金'; // 收款類型
  accountingNumber: string; // 編號/存入帳號
  price: number; // 金額
  notes: string | null; // 備註
  billSerialNumber: string | null; // 收入傳票序號
  noteMaturityDate: string | null; // 票據到期日
  invoice: TaccountsReceivableInvoiceDto[] | null;
  noteNumber: string | null; // 票據號碼
};

export type TcreateAccountantDto = Omit<TaccountantDto, 'id' | 'createdAt' | 'updatedAt' | 'noteMaturityDate'> & {
  noteMaturityDate?: string | null;
};

/**扣款明細 */
export type TaccountsReceivableDeductionDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  itemName: string; // 項目
  period: number; // 期數
  detailedAmount: number; // 明細金額
  accountsReceivableId: string; // 所屬應收帳款Id
  accountsReceivable?: TaccountReceivableDto | null; // 所屬應收帳款
};

export type TcreateAccountReceivableDeductionDto = Pick<
  TaccountsReceivableDeductionDto,
  'itemName' | 'period' | 'detailedAmount'
>;

export type TupdateAccountReceivableDeductionDto = Partial<TcreateAccountReceivableDeductionDto> & {
  id: string; // 不提供時將此筆視為新增資料
};

export type TfinalProduct = {
  //源合約產品包含item deliveryStatus productPayment(主產品數量已扣追減)
  // finalRootContractProduct: TquotationProductDto[];
  // finalRootContractProduct: TquotationProductItemDto[];
  finalAppendContractProductsItems: TquotationProductItemDto[];
  //追加合約產品包含item deliveryStatus productPayment
  // finalAppendContractProducts: TquotationProductItemDto[];
  finalRootContractProductItems: TquotationProductItemDto[];
};

/**應收帳款明細 主產品請款比例 */
export type TaccountsReceivableProductPaymentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // //  '期數'
  // period: number;
  // //  '請款比例(完成數量)'
  // paymentRatio: string | null;
  // //  '發票id'
  // invoiceId: string | null;
  // //  '發票' 要用的時候在跟Gina要型別吧
  // // invoice: AccountsReceivableInvoiceDto;
  // //  '關聯產品itemId'
  // productItemId: string | null;
  // //  '關聯產品itemId'
  // productItem: TquotationProductItemDto;
  // //  '完成項目'
  // // completeItemStatus: EngineeringDeliveryStatusDto[];
  // completeItemStatus: TdeliveryStatusDto[];

  // @ApiProperty({ description: '請款比例(完成數量)' })
  paymentRatio: string | null;

  // @ApiProperty({ description: '發票id' })
  invoiceId: string | null;

  // @ApiProperty({ description: '發票' })
  invoice: TaccountsReceivableInvoiceDto | undefined;

  // @ApiProperty({ description: '關聯產品itemId' })
  productItemId: string | null;

  // @ApiProperty({ description: '關聯產品item' })
  productItem: TquotationProductItemDto | undefined;

  // @ApiProperty({ description: '完成項目' })
  // completeItemStatus: TengineeringDeliveryStatusDto[];
  completeItemStatus: TdeliveryStatusDto[];
};

export type TcreateAccountReceivableProductPaymentDto = {
  paymentRatio: string | null;
  accountsReceivableId: string;
  invoiceId: string | null;
  productItemId: string | null;
  deliveryStatusId: string[];
};

export type TupdateAccountReceivableProductPaymentDto = {
  paymentRatio: string | null;
  accountsReceivableId: string;
  invoiceId: string | null;
  productItemId: string | null;
  deliveryStatusId: string[];
  id?: string; // ID, 不提供時將此筆視為新增資料
};
