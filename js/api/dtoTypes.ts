export type TdoorModel = 'SJ-302' | 'SJ-312' | 'SJ-305D' | 'SJ-303A' | 'SJ-303AS' | 'SJ-120A' | 'SJ-303S';

// 表面處理
export type TmaterialSurface = '2B' | 'HL' | 'BA' | 'NO.4' | '烤漆' | '氟碳' | null;

export type TdeliveryStatus = '未安裝' | '已安裝' | '已結清';

export type TdocType = '防火證明' | '出廠證明' | '保固書';

export type TnorthernCounty = '臺北市' | '新北市' | '基隆市' | '新竹市' | '桃園市' | '新竹縣' | '宜蘭縣' | '連江縣';
export type TcentralCounty = '臺中市' | '苗栗縣' | '彰化縣' | '南投縣' | '雲林縣' | '金門縣';
export type TsouthernCounty = '高雄市' | '臺南市' | '嘉義市' | '嘉義縣' | '屏東縣' | '澎湖縣';
export type TeasternCounty = '花蓮縣' | '臺東縣';
export type Tabroad = '海外';

// 報價單狀態: Budget預算 Bidding投標 Contracting發包 Contract合約 Pending準合約 TempPending待審核準合約
export type TquotationStatus = 'Budget' | 'Bidding' | 'Contracting' | 'Contract' | 'Pending' | 'TempPending';

export type TdeliveryStatusInstallationItem = '門片' | '馬達' | '支軌';

export type TinvoiceStatus = '已開立' | '已作廢';

export type TperiodType = '請款' | '訂金';
export type TretainageType = '含稅' | '未稅';

export type TengineeringContactAttachmentType = 'color' | 'construction' | 'detail' | 'floor' | 'design';

export type TaccountantPaymentType = '匯款' | '票據' | '現金';
export type TreceiptStatus = '託收' | '已兌現';
export type Tcurrency = 'TWD 新臺幣' | 'USD 美元';

// =============================================================================
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

export type TpageResponse<Tdata> = {
  data: Tdata[];
  meta: TpageMetaDto;
};

// =============================================================

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
  //付款階段(里程碑)
  milestone: string;
  //總付款比例(0.0 - 1.0)
  // 不知何時變成送1~100了
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
  //
  spec: string | null;
};

export type TcreateQuotationContentOtherDto = Omit<TquotationContentOtherDto, 'id' | 'createdAt' | 'updatedAt'>;

/**選配設定 */
export type TquotationProductAccessoryDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  codeName: string; //代號
  name: string; //名稱
  unit: string; // 單位
  quantity: number; // 數量
  unitPrice: number; // 單價
  totalPrice: number; // 複價
  originalPrice?: number | undefined;
  price: number; // 牌價
  dualPrice: number; // 牌價複價
  order: number;
  referenceSpec: string | null;
};

export type TcreateQuotationProductAccessoryDto = Omit<
  TquotationProductAccessoryDto,
  'id' | 'createdAt' | 'updatedAt'
> & { id?: string };

export type TupdateQuotationProductAccessoryDto = Partial<
  Omit<TquotationProductAccessoryDto, 'createdAt' | 'updatedAt'>
>;

export type TdoorComponentType =
  | 'slat'
  | 'bottomBar'
  | 'guideRail'
  | 'sidePlate'
  | 'roller'
  | 'motor'
  | 'motorAccessories'
  | 'headBox';

export type TquotationProductComponentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: TdoorComponentType;
  // 從get /products/door/generate-door-product-bom 取得的number
  number: string; // TdoorBomDto_Component['number']
  componentId: string; // 從avalibleComponent過濾出來的component的id，會與rawData的id相同
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

  // 從TdoorBomDto_Component取得的bom要直接送進來這個bom

  bom: any; // 前端不會直接用到，先直接設object
  material: string;
  // materialSurface: TmaterialSurface | null | undefined;
  materialSurface: string | null | undefined;
  isPainted: boolean;
  price: number;
  quantity: string;
  order: number;

  desc: string | null;
  density: string | null;
  //
};

export type TcreateQuotationProductComponentDto = Omit<TquotationProductComponentDto, 'id' | 'createdAt' | 'updatedAt'>;

export type TupdateQuotationProductComponentDto = Partial<
  Omit<TquotationProductComponentDto, 'createdAt' | 'updatedAt'>
>;

export type TquotationProductDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 折數
  discount: string; // `${number}`
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(mm)全寬 // 單位為mm
  fullWidth: number;
  // WG(mm) // 單位為mm
  WG: number;
  // h(mm) // 單位為mm
  height: number;
  // B(mm) // 單位為mm
  boxB: number;
  // D(mm) // 單位為mm
  boxD: number;
  // 面積
  area: string | null;
  // 才數
  volume: string | null;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string | null;
  // 電壓
  motorVoltage: number | null;
  // 馬達支撐架
  hasMotorSupportStand: boolean | null;
  // 底座類型
  bottomBar: string | null; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string | null;
  // 門軌厚度
  guideRailThickness: string | null;
  // 捲軸規格  // 棄用
  rollerSpec: string | null; // 無凸 | 雙凸
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度
  headBoxThickness: string | null;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 複價
  totalPrice: number;
  // 防颱
  isAntiTyphoon: boolean | null;
  // 彈射門
  bounceDoor: boolean | null;
  // 彈射門寬度
  bounceDoorWidth: number | null;
  // 彈射門高度
  bounceDoorHeight: number | null;
  // 彈射門長度
  bounceDoorLength: number | null;
  // 關閉方式 // 在前端顯示的label為開閉方式
  closingType: string | null;
  // 備註
  notes: string;
  // 相數
  motorPhase: number | null;
  // 底座角鐵
  bottomBarAngleIron: string | null;
  // 底座板
  bottomBarPlate: string | null;
  // 排序
  order: number;
  // 數量
  quantity: number;
  // 門片厚度
  thickness: string | null;
  // 配電箱牌價
  distributionBoxPrice: number | null;
  // 配電箱單價
  distributionBoxUnitPrice: number | null;
  // 配電箱數量
  distributionBoxQuantity: number | null;
  // 配電箱牌價複價
  distributionBoxDualPrice: number | null;
  // 配電箱複價
  distributionBoxTotalPrice: number | null;
  // 安裝費牌價
  installationFeePrice: number | null;
  // 安裝費牌價複價
  installationFeeDualPrice: string | null;
  // 安裝費數量
  installationFeeQuantity: string | null;
  // 安裝費單價
  installationFeeUnitPrice: number | null;
  // 安裝費複價
  installationFeeTotalPrice: string | null;
  // 門片 - 捲片支數
  slatCount: string | null;
  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel: string | null;
  // 鏈齒輪 - 大鏈輪
  sprocketWheelTeethNumber: string | null;
  // 不確定這個property的意義，可能為鍊條數量
  sprocketWheelChains: string | null;
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  bearingInnerDiameter: string | null;
  // 捲軸 - 尺寸
  diameter: string | null;
  // 捲軸 - 總長
  bearingHousingTotalLength: string | null;
  // 底座 - 開口
  guideRailsOpening: string | null;
  // 門片長度
  slatLength: number | null;
  // 門軌長度
  guideRailLength: number | null;
  // 捲箱長度
  headBoxLength: number | null;
  // 軸承座寸法
  bearingHousingSize: number | null;
  // 軸承
  bearingName: string | null;
  gapA: string | null;
  gapC: string | null;
  gearNumber: string | null;
  weight: string | null;
  // guideRailG為門軌的width
  // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
  guideRailG: number | null;
  // 門軌UL
  isULGuideRail: boolean | null;
  // 個別產品
  items: TquotationProductItemDto[];
  // 來源產品Id
  attachedToProductId?: string | null;
  // 來源產品
  attachedToProduct?: TquotationProductDto;

  // 源頭產品
  // 實際上可能為null，運作正常的話預期不會為null。若為null代表有問題，要跟後端討論
  rootProductId: string;

  //
  // 前端用的，後端沒有
  // 只是為了方便才寫在這邊
  reduceQty?: number;
};

// export type TquotationProductDto = {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   /**折數 */
//   discount: string;
//   // 項目名
//   itemName: string;
//   // 報價別
//   quoteType: string;
//   // 門型
//   doorModelName: TdoorModel;
//   // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm
//   fullWidth: number;
//   // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm
//   WG: number;
//   // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm
//   height: number;
//   // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm
//   boxB: number;
//   boxD: number | null;
//   // 面積
//   area: string;
//   // 才數
//   volume: string;
//   // 材料
//   materialName: string;
//   // 表面
//   materialSurface: TmaterialSurface | null;
//   // 門軌
//   guideRail: string;
//   // 門軌G // guideRailG是指單邊門軌的寬度。但是在工務部，G其實是指兩邊門軌寬度的總和。
//   guideRailG: number | null;
//   // 馬力
//   horsepower: string;
//   // 馬達廠商
//   motorVendor: string;
//   // 電壓
//   motorVoltage: number;
//   // 馬達支撐架
//   hasMotorSupportStand: boolean;
//   // 底座類型
//   bottomBar: string; // 鋁障感 | 止水型 | ''
//   // 馬達鎖盒
//   motorLockBox: string;
//   // 門軌厚度
//   guideRailThickness: string;
//   // 捲軸規格
//   rollerSpec: string; // 雙凸|無凸
//   // 門軌消音條
//   hasSilencingStrip: boolean;
//   // 一體式捲箱
//   isIntegratedHeadBox: boolean;
//   // 捲箱厚度
//   headBoxThickness: string;
//   // 單價
//   unitPrice: number;
//   // 牌價
//   price: number;
//   // 牌價複價
//   dualPrice: number;
//   // 複價
//   totalPrice: number;
//   // 防颱
//   isAntiTyphoon: boolean;
//   // 彈射門
//   bounceDoor: boolean;
//   // 關閉方式 //(實際上前端顯示的文字為"開"閉方式)
//   closingType: string;
//   // 備註
//   notes: string;
//   order: number;

//   motorPhase: number;

//   bottomBarAngleIron: string; // 底座角鐵
//   bottomBarPlate: string; // 底座板

//   isULGuideRail?: boolean | null;
//   // 彈射門尺寸
//   bounceDoorWidth?: number | null;

//   // items?: {
//   //   // 材料配件
//   //   components: TquotationProductComponentsDto[];
//   //   // 選配設定
//   //   accessories: TquotationProductAccessoriesDto[];
//   //   worksheetId: string | null;
//   //   worksheetRecordId: string | null; // 棄用

//   //   // TODO 還有其他很多有的沒有的，用不到，以後有空再補上
//   // }[];
//   // items?: {
//   //   // 材料配件
//   //   components: TquotationProductComponentsDto[];
//   //   // 選配設定
//   //   accessories: TquotationProductAccessoriesDto[];
//   //   worksheetId: string | null;
//   //   worksheetRecordId: string | null; // 棄用

//   //   // TODO 還有其他很多有的沒有的，用不到，以後有空再補上
//   // }[];
//   items?: TquotationProductItemDto[];

//   quantity: number;

//   // 配電箱數量;
//   distributionBoxQuantity: number | null;
//   // 配電箱牌價;
//   distributionBoxPrice: number;
//   // 配電箱牌價複價;
//   distributionBoxDualPrice: number | null;
//   // 配電箱單價;
//   distributionBoxUnitPrice: number;
//   // 配電箱複價;
//   distributionBoxTotalPrice: number | null;
//   //
//   // 安裝費數量;
//   installationFeeQuantity: number;
//   // 安裝費牌價;
//   installationFeePrice: number;
//   // 安裝費牌價複價;
//   installationFeeDualPrice: number;
//   // 安裝費單價;
//   installationFeeUnitPrice: number;
//   // 安裝費複價;
//   installationFeeTotalPrice: number;

//   attachedToProductId?: string | null;
//   attachedToProduct?: TquotationProductDto | null;

//   rootProductId: string;

//   guideRailsOpening?: string | null; //底座 - 開口
//   slatCount: string | null; //門片 - 捲片支數

//   bearingHousingSize?: number | null; //軸承座寸法
//   bearingHousingTotalLength?: string | null; //捲軸 - 總長
//   bearingInnerDiameter?: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
//   bearingName?: string | null; //軸承
//   diameter?: string | null; //捲軸 - 尺寸
//   gapA?: string | null;
//   gapC?: string | null;
//   gearNumber?: string | null; //
//   sprocketWheelModel?: string | null; //鏈齒輪 - 鏈齒輪番號
//   sprocketWheelTeethNumber?: string | null; //鏈齒輪 - 大鏈輪
//   sprocketWheelChains?: string | null; //
//   weight?: string | null; //
//   slatLength?: number | null; //門片長度
//   guideRailLength?: number | null; //門軌長度
//   headBoxLength?: number | null; //捲箱長度
//   thickness: string | null; // 門片厚度

//   //
//   // 前端用的，後端沒有
//   // 只是為了方便才寫在這邊
//   reduceQty?: number;
// };

// 棄用
// export type TdeliveryStatusDto = {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   productItemId: string;
//   //  '所屬產品'
//   productItem?: TquotationProductItemDto;
//   //  '備註'
//   notes: string | null;
//   itemName: string | null;
//   shippingDate: string | null;
//   //  '安裝人員Id'
//   installerEmployeeId: string | null;
//   //  '安裝人員/外包人員'
//   installerEmployee?: ToutsourcingDto | null;
//   //  '安裝日期'
//   installationDate: string | null;
//   //  '工作表開立日期'
//   workSheetInvoiceDate: string | null;
//   //  '追加'
//   append: string | null;
//   //  '完成追加'
//   completeAppend: string | null;
//   //
//   completePayment: boolean | null;
//   productPaymentId: boolean | null;
//   productPayments: TaccountsReceivableProductPaymentDto[] | null;
//   //
//   otherInstallation: string | null; // 特殊項目施作內容
//   otherQuantity: number | null; // 特殊項目數量
//   otherUnitPrice: number | null; // 特殊項目計價
//   otherSubTotalPrice: number | null; // 特殊項目小計
//   otherWorkItemTotal: number | null; // 特殊項目之合計
//   itemId: string | null; // 自動代入之productItem的id
//   itemPrice: number | null; // productItem的才數計價
// };

export type TengineeringDeliveryStatusDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // 所屬產品Id
  productItemId: string | null;
  // 所屬產品
  productItem: TquotationProductItemDto;
  // 備註
  notes: string | null;
  // 出貨日
  shippingDate: string | null;
  // 項目名稱
  itemName: string | null;
  // 安裝人員(外包)ID
  installerOutsourcingId: string | null;
  // 安裝人員(外包)
  installerOutsourcing: ToutsourcingDto;
  // 安裝人員(員工)
  installerEmployees: TemployeeDto[];

  // 安裝日期
  installationDate: string | null;
  // 工作表開立日期
  workSheetInvoiceDate: string | null;
  // 追加
  append: string | null;
  // 完成追加
  completeAppend: string | null;
  // 單樘計價
  unitPrice: number | null;
  // 其他特殊工作項目
  // otherWorkItems: ToutsourcingPaymentDetailItemDto[] | null;
  otherWorkItems: ToutsourcingPaymentDetailItemDto | null;
  // 其他特殊工作項目合計
  otherWorkItemTotal: number | null;
  // 安裝項目
  installationItem: TdeliveryStatusInstallationItem | null;
};

export type TcreateEngineeringDeliveryStatusDto = {
  // 備註
  notes: string | null;
  // 項目名稱
  itemName: string | null;
  // 出貨日
  shippingDate: string | null;

  // installerOutsourcingId與installerEmployees二擇一

  // 安裝人員id(外包廠商)
  installerOutsourcingId: string | null;
  // 安裝人員id(員工)
  // installerEmployees: (string | null)[];
  // api文件錯誤，應該長這樣才對
  installerEmployees: string[] | null;
  // 安裝日期
  installationDate: string | null;
  // 追加
  append: string | null;
  // 完成追加
  completeAppend: string | null;
  // 所屬產品id // 預期要放latestWorksheetItemId
  productItemId: string;
  // 安裝項目
  installationItem: TdeliveryStatusInstallationItem | null;
};

export type TupdateEngineeringDeliveryStatusDto = TcreateEngineeringDeliveryStatusDto;

export type TupdateDeliveryStatus = {
  id: string;
  notes: string;
  installerEmployeeId: string | null;
  installationDate: string | null;
  append: string | null;
  completeAppend: string | null;
};

// export type TquotationProductItemDto = Omit<
//   TquotationProductDto,
//   | 'order'
//   | 'items'
//   | 'distributionBoxPrice'
//   | 'distributionBoxUnitPrice'
//   | 'installationFeePrice'
//   | 'installationFeeDualPrice'
//   | 'installationFeeQuantity'
//   | 'installationFeeUnitPrice'
//   | 'installationFeeTotalPrice'
//   | 'attachedToProductId'
//   | 'attachedToProduct'
//   | 'rootProductId'
//   | 'reduceQty'
//   | 'quantity'
// > & {
//   components: TquotationProductComponentsDto[];
//   accessories: TquotationProductAccessoriesDto[];
//   product: TquotationProductDto;
//   productId: string;
//   itemNumber: string;
//   itemName: string;
//   others: null;
//   deliveryStatus?: TengineeringDeliveryStatusDto[] | null;
//   adjustedItem?: Omit<TquotationProductItemDto, 'adjustedItem'> | null;
//   adjustedItemId?: string | null;
//   //
//   // 門片捲片支數
//   slatCount: string;
//   // 練齒輪番號
//   sprocketWheelModel: string;
//   // 練齒輪大鏈輪
//   sprocketWheelTeethNumber: string;
//   // 孔徑 軸徑
//   bearingInnerDiameter: string;
//   // 卷軸尺寸
//   diameter: string;
//   // 捲軸總長
//   bearingHousingTotalLength: string;
//   // 底座開口
//   guideRailsOpening: string;
//   //  '捲箱 - 正面'
//   headBoxFront: string | null;
//   //  '捲箱 - 有無凸'
//   headBoxProtruding: string | null;
//   //  '捲箱 - 角鐵數量'
//   headBoxAngleIronQuantity: number | null;
//   //  '支板 - 鏈條'
//   sidePlateChain: string | null;
//   //  '支板 - 方向'
//   sidePlateDirection: string | null;
//   //  '電動機 - 鍊條形式'
//   electricMotorChainType: string | null;
//   //  '電動機 - 方向'
//   electricMotorDirection: string | null;
//   //  '門軌 - 型式'
//   guideRailType: string | null;
//   // 底座 - 表面
//   bottomBarSurface: string | null;
//   // 門軌 - 表面
//   guideRailSurface: string | null;
//   //
//   itemPrice: number | null; // 每一才的價格

//   worksheetId: string | null;
//   worksheetRecordId: string | null; // 棄用
// };

export type TquotationProductItemDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 個別產品編號
  itemNumber: string;
  // 項目名
  itemName: string;
  // 折數
  discount: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(mm)全寬
  fullWidth: number;
  // W(mm)
  WG: number;
  // h(mm)
  height: number;
  // B(mm)
  boxB: number;
  // D(mm)
  boxD: number | null;
  // 面積
  area: string | null;
  // 才數
  volume: string | null;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string | null;
  // 電壓
  motorVoltage: number | null;
  // 馬達支撐架
  hasMotorSupportStand: boolean | null;
  // 底座類型
  bottomBar: string | null;
  // 馬達鎖盒
  motorLockBox: string | null;
  // 門軌厚度
  guideRailThickness: string | null;
  // 捲軸規格 // 棄用
  rollerSpec: string | null; // 無凸 | 雙凸
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度
  headBoxThickness: string | null;
  // 單價
  unitPrice: number;
  // 複價
  totalPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 防颱
  isAntiTyphoon: boolean | null;
  // 彈射門
  bounceDoor: boolean | null;
  // 彈射門寬度
  bounceDoorWidth: number | null;
  // 彈射門高度
  bounceDoorHeight: number | null;
  // 彈射門長度
  bounceDoorLength: number | null;
  // 關閉方式
  closingType: string | null;
  // 備註
  notes: string;
  // 相數
  motorPhase: number | null;
  // 底座角鐵
  bottomBarAngleIron: string | null;
  // 底座板
  bottomBarPlate: string | null;
  // 主產品Id
  productId: string | null;
  // 門片厚度
  thickness: string | null;
  // 配電箱牌價
  distributionBoxPrice: number | null;
  // 配電箱單價
  distributionBoxUnitPrice: number | null;
  // 配電箱數量
  distributionBoxQuantity: number | null;
  // 配電箱牌價複價
  distributionBoxDualPrice: number | null;
  // 配電箱複價
  distributionBoxTotalPrice: number | null;
  // 安裝費牌價
  installationFeePrice: number | null;
  // 安裝費牌價複價
  installationFeeDualPrice: string | null;
  // 安裝費數量
  installationFeeQuantity: string | null;
  // 安裝費單價
  installationFeeUnitPrice: number | null;
  // 安裝費複價
  installationFeeTotalPrice: string | null;
  // 門片 - 捲片支數
  slatCount: string | null;
  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel: string | null;
  // 鏈齒輪 - 大鏈輪
  sprocketWheelTeethNumber: string | null;
  // 可能為鍊條數量
  sprocketWheelChains: string | null;
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  bearingInnerDiameter: string | null;
  // 捲軸 - 尺寸
  diameter: string | null;
  // 捲軸 - 總長
  bearingHousingTotalLength: string | null;
  // 底座 - 開口
  guideRailsOpening: string | null;
  // 門片長度
  slatLength: number | null;
  // 門軌長度
  guideRailLength: number | null;
  // 捲箱長度
  headBoxLength: number | null;
  // 軸承座寸法
  bearingHousingSize: number | null;
  // 軸承
  bearingName: string | null;
  gapA: string | null;
  gapC: string | null;
  gearNumber: string | null;
  weight: string | null;
  // 捲箱 - 正面
  headBoxFront: string | null;
  // 捲箱 - 有無凸 // 棄用
  headBoxProtruding: string | null; // 棄用
  // 捲箱 - 角鐵數量
  headBoxAngleIronQuantity: number | null;
  // 支板 - 鏈條
  sidePlateChain: string | null;
  // 支板 - 方向
  sidePlateDirection: string | null;
  // 電動機 - 鍊條形式
  electricMotorChainType: string | null;
  // 電動機 - 方向
  electricMotorDirection: string | null;
  // 門軌 - 型式
  guideRailType: string | null;
  // 底座 - 表面
  bottomBarSurface: string | null;
  // 門軌 - 表面
  guideRailSurface: string | null;
  guideRailG: number | null;
  isULGuideRail: boolean | null;
  // 選配設定
  // accessories: QuotationProductAccessoryDto[];
  accessories: TquotationProductAccessoryDto[];
  // 主產品
  product: TquotationProductDto;
  // 產品元件
  // components: QuotationProductComponentDto[];
  components: TquotationProductComponentDto[];
  // 請款比例(完成數量) 棄用
  // productPayment: TaccountsReceivableProductPaymentDto[];
  // 出庫狀態詳情
  deliveryStatus: TengineeringDeliveryStatusDto[];
  // 審核狀態類別
  // deliveryStatusType: DeliveryStatus;
  deliveryStatusType: TdeliveryStatus;
  // 外包單堂計價
  itemPrice: number | null;
  // 工作表id
  worksheetId: string | null;
  // 工作表紀錄id
  worksheetRecordId: string | null;

  // 最新的worksheetItemId
  latestWorksheetItemId: string | null;
  // 最新的worksheetItem
  latestWorksheetItem?: TquotationProductItemDto;
  // 每次修改worksheet的紀錄
  adjustedWorksheetItems?: TquotationProductItemDto[];
  //
  rootWorksheetItemId: string | null;
  // worksheet修改紀錄中第一個worksheetItem
  rootWorksheetItem?: TquotationProductItemDto;
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

  toCashierAt: string | null;
  reviewCashierEmployee: TemployeeDto | null;
  cashierReviewedAt: string | null;

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
  // 失件
  isLost: boolean;
};

export type TquotationContentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  quotationNumber: string;
  version: number;

  quotationDate: string; // 報價日期
  validityPeriod: string; // 報價時效
  customer?: TcustomerDto;
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
  agentEmployee?: TemployeeDto;

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

  toCashierAt: string | null;
  reviewCashierEmployee: TemployeeDto | null;
  cashierReviewedAt: string | null;

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
  // 小計微調
  tuneTotal: string;
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
  // 失件
  isLost: boolean;
  //
  settleProducts: TsettleProductDto[];
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
  // 產品id
  id?: string;
  // 折數
  discount: string; // `${number}`
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(mm)全寬 // 單位為mm
  fullWidth: number;
  // W(mm) // 單位為mm
  WG: number;
  // h(mm) // 單位為mm
  height: number;
  // B(mm) // 單位為mm
  boxB: number;
  // D(mm) // 單位為mm
  boxD: number;
  // 面積
  area: string | null;
  // 才數
  volume: string | null;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string | null;
  // 電壓
  motorVoltage: number | null;
  // 馬達支撐架
  hasMotorSupportStand: boolean | null;
  // 底座類型
  bottomBar: string | null; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string | null;
  // 門軌厚度
  guideRailThickness: string | null;
  // 捲軸規格  // 棄用
  rollerSpec: string | null; // 無凸 | 雙凸
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度
  headBoxThickness: string | null;
  // 數量
  quantity: number;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 複價
  totalPrice: number;
  // 牌價複價
  dualPrice: number;
  // 防颱
  isAntiTyphoon: boolean | null;
  // 彈射門
  bounceDoor: boolean | null;
  // 彈射門寬度
  bounceDoorWidth?: number | null;
  // 彈射門高度
  bounceDoorHeight?: number | null;
  // 彈射門長度
  bounceDoorLength?: number | null;
  // 關閉方式 // 在前端顯示的label為開閉方式
  closingType: string | null;
  // 備註
  notes: string;
  // 相數
  motorPhase: number | null;
  // 底座角鐵
  bottomBarAngleIron: string | null;
  // 底座板
  bottomBarPlate: string | null;
  // 排序
  order: number;
  // 門片厚度
  thickness: string | null;
  // 配電箱牌價
  distributionBoxPrice: number | null;
  // 配電箱單價
  distributionBoxUnitPrice: number | null;
  // 配電箱數量
  distributionBoxQuantity: number | null;
  // 配電箱牌價複價
  distributionBoxDualPrice: number | null;
  // 配電箱複價
  distributionBoxTotalPrice: number | null;
  // 安裝費牌價
  installationFeePrice: number | null;
  // 安裝費牌價複價
  installationFeeDualPrice: string | null;
  // 安裝費數量
  installationFeeQuantity: string | null;
  // 安裝費單價
  installationFeeUnitPrice: number | null;
  // 安裝費複價
  installationFeeTotalPrice: string | null;
  // 門片 - 捲片支數
  slatCount?: string | null;
  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel?: string | null;
  // 鏈齒輪 - 大鏈輪
  sprocketWheelTeethNumber?: string | null;
  // 不確定這個property的意義，可能為鍊條數量
  sprocketWheelChains?: string | null;
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  bearingInnerDiameter?: string | null;
  // 捲軸 - 尺寸
  diameter?: string | null;
  // 捲軸 - 總長
  bearingHousingTotalLength?: string | null;
  // 底座 - 開口
  guideRailsOpening?: string | null;
  // 門片長度
  slatLength?: number | null;
  // 門軌長度
  guideRailLength?: number | null;
  // 捲箱長度
  headBoxLength?: number | null;
  // 軸承座寸法
  bearingHousingSize?: number | null;
  // 軸承
  bearingName?: string | null;
  gapA?: string | null;
  gapC?: string | null;
  gearNumber?: string | null;
  weight?: string | null;
  // guideRailG為門軌的width
  // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
  guideRailG?: number | null;
  // 門軌UL
  isULGuideRail?: boolean | null;
  // 材料/配件設定
  components: TcreateQuotationProductComponentDto[];
  // 選配設定
  accessories: TcreateQuotationProductAccessoryDto[];
  // 來源產品
  attachedToProductId?: string | null;
};

export type TupdateQuotationProductDto = TcreateQuotationProductDto & {
  // 主產品id
  id?: string;
  // 源頭產品id
  rootProductId?: string;
  // 來源產品id
  attachedToProductId?: string | null;
};

// export type TcreateQuotationProductDto = {
//   /**折數 */
//   discount: string;
//   // 項目名
//   itemName: string;
//   // 報價別
//   quoteType: string;
//   // 門型
//   doorModelName: string;
//   // L(m)
//   fullWidth: number;
//   // W(m)
//   WG: number;
//   // h(m)
//   height: number;
//   // B(m)
//   boxB: number;
//   boxD: number;
//   // 面積
//   area: string;
//   // 才數
//   volume: string;
//   // 材料
//   materialName: string;
//   // 表面
//   materialSurface: string | null;
//   // 門軌
//   guideRail: string;
//   // 門軌G // guideRailG是指單邊門軌的寬度。但是在工務部，G其實是指兩邊門軌寬度的總和。
//   guideRailG: number | null;
//   // 馬力
//   horsepower: string;
//   // 馬達廠商
//   motorVendor: string;
//   // 電壓
//   motorVoltage: number;
//   // 馬達支撐架
//   hasMotorSupportStand: boolean;
//   // 底座類型
//   bottomBar: string; // 鋁障感 | 止水型 | ''
//   // 馬達鎖盒
//   motorLockBox: string;
//   // 門軌厚度
//   guideRailThickness: number;
//   // 捲軸規格
//   rollerSpec: string; // 雙凸|無凸
//   // 門軌消音條
//   hasSilencingStrip: boolean;
//   // 一體式捲箱
//   isIntegratedHeadBox: boolean;
//   // 捲箱厚度
//   headBoxThickness: number;
//   // 數量
//   quantity: number;
//   // 單價
//   unitPrice: number;
//   // 牌價
//   price: number;
//   // 牌價複價
//   dualPrice: number;
//   // 複價
//   totalPrice: number;
//   // 防颱
//   isAntiTyphoon: boolean;
//   // 彈射門
//   bounceDoor: boolean;
//   // 彈射門尺寸
//   bounceDoorWidth: number | null;
//   // 關閉方式 //(實際上前端顯示的文字為"開"閉方式)
//   closingType: string;
//   // 備註
//   notes: string;

//   motorPhase: number;

//   // 選配設定
//   accessories: {
//     codeName: string; //代號
//     name: string; //名稱
//     unit: string; // 單位
//     quantity: number; // 數量
//     unitPrice: number; // 單價
//     totalPrice: number; // 複價
//     price: number; // 牌價
//     dualPrice: number; // 牌價複價
//     order: number;
//   }[];
//   components: TcreateQuotationProductComponentDto[];
//   //
//   // materialSurface: string;
//   isPainted: boolean;
//   order: number;
//   bottomBarAngleIron: string; // 底座角鐵
//   bottomBarPlate: string; // 底座板

//   // 門片厚度
//   thickness: string;

//   // 配電箱數量;
//   distributionBoxQuantity: number;
//   // 配電箱牌價;
//   distributionBoxPrice: number;
//   // 配電箱牌價複價;
//   distributionBoxDualPrice: number;
//   // 配電箱單價;
//   distributionBoxUnitPrice: number;
//   // 配電箱複價;
//   distributionBoxTotalPrice: number;
//   //
//   // 安裝費數量;
//   installationFeeQuantity: number;
//   // 安裝費牌價;
//   installationFeePrice: number;
//   // 安裝費牌價複價;
//   installationFeeDualPrice: number;
//   // 安裝費單價;
//   installationFeeUnitPrice: number;
//   // 安裝費複價;
//   installationFeeTotalPrice: number;

//   slatCount: string | null; //門片 - 捲片支數
//   sprocketWheelModel: string | null; //鏈齒輪 - 鏈齒輪番號
//   sprocketWheelTeethNumber: string | null; //鏈齒輪 - 大鏈輪
//   sprocketWheelChains: string | null; //
//   bearingInnerDiameter: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
//   diameter: string | null; //捲軸 - 尺寸
//   bearingHousingTotalLength: string | null; //捲軸 - 總長
//   guideRailsOpening: string | null; //底座 - 開口
//   slatLength: number | null; //門片長度
//   guideRailLength: number | null; //門軌長度
//   headBoxLength: number | null; //捲箱長度
//   bearingHousingSize: number | null; //軸承座寸法
//   bearingName: string | null; //軸承
//   gapA: string | null; //
//   gapC: string | null; //
//   gearNumber: string | null; //
//   weight: string | null; //
// };

export type TcreateQuotationContentDto = {
  // 送ISOString過去，回來的是YYYY-MM-DD
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
  // 小計微調
  tuneTotal: string;
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

  // 失件
  isLost: boolean;
};

/**合約 */
export type TquotationContractDto = {
  id: string;
  contractNumber: string | null;
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
  engineeringContact?: TengineeringContactDto | null;
  /**工作表 */
  worksheet?: TworksheetDto[]; // populate
  /**工作表ID */
  // worksheetId: string | null;
  worksheetId?: undefined | null; // 已經沒有這個property了，未來有空要把它刪掉並處理型別錯誤
  /**出庫單ID */
  engineeringDeliveryListId: string | null;
  /**應收帳款明細 */
  accountReceivable?: TaccountsReceivableDto; // populate
  accountReceivableId: string | null;
  //
  //

  engineeringDeliveryList?: TengineeringDeliveryListDto;
  //
  certificatedDoc?: TcertificatedDocDto[];
};

export type TcreateModifyQuotationDto = TcreateQuotationContentDto;

// export type TcreateModifyQuotationDto = {
//   // 報價日期
//   quotationDate?: string;
//   // 報價時效
//   validityPeriod?: string;
//   // 客戶 ID
//   customerId?: string;
//   // 工程名稱
//   projectName?: string;
//   // 縣市
//   county?: string;
//   // 區
//   district?: string;
//   // 詳細地址
//   address?: string;
//   // 聯絡人
//   contactPerson?: string;
//   // 聯絡電話
//   contactNumber?: string;
//   // 傳真電話
//   faxNumber?: string;
//   // 追蹤進度
//   trackProgress?: string;
//   // 工地進度
//   projectProgress?: string;
//   // 樘數
//   quantity?: number;
//   // 編輯備註
//   editNotes?: string;
//   annotations?: string[] | null;
//   quotationRanges?: string[] | null;
//   // 經理
//   managerId?: string | null;
//   // 主管
//   supervisorId?: string | null;
//   // 經辦人
//   agentId?: string;
//   // 總折數
//   discount?: string;
//   // 小計
//   subTotal?: number;
//   // 營業稅
//   salesTax?: number;
//   // 總計
//   total?: number;
//   // 交貨地點
//   deliveryLocation?: string;
//   // 交貨日期
//   deliveryDate?: string | null;
//   paymentMethods?: TpaymentMethodDto[];
//   products?: TcreateQuotationProductDto[];
//   others?: TcreateQuotationContentOtherDto[];
// };

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
export type TcontractAccountingReportFormDto = {
  projectNumber: string;
  projectName: string;
  contractor: string | null; //營造(承包商)
  designUnit: string | null; // 設計單位
  quoteType: string | null;

  totalSum: number;
  priceSum: number;
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

export type TdoorMaterialDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string; //材質代號
  name: string; //材質名稱
};

export type TdoorModelInfoDto = {
  name: TdoorModel;
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
  gearNumber: string | null; // 齒輪番號 // 舊稱:鏈齒輪番號
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
  gearNumber: string; // 齒輪番號 // 舊稱:鏈齒輪番號
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
  materialSurface?: TmaterialSurface;
  isPainted: boolean; // 烤漆
  thickness?: string; // 厚度
};

export type TgenerateDoorProductBomDto_DoorSpec = {
  modelName: TdoorModel;
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
  doorModelName: TdoorModel;
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
  performanceBondNote: string | null;
  //  可否請款訂金
  depositPayment: boolean;
  //  保固期(年)
  warrantyPeriod: number;
  //  備註
  note: string;
  //  保固金或保固票
  warrantyPayment: boolean;
  warrantyPaymentNote: string | null;
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
  performanceBondNote: string | null;
  //  可否請款訂金
  depositPayment: boolean;
  //  保固期(年)
  warrantyPeriod: number;
  //  備註
  note: string;
  //  保固金或保固票
  warrantyPayment: boolean;
  warrantyPaymentNote: string | null;
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
  reviewCashierEmployeeId?: string | null;
  reviewManagerEmployeeId?: string | null;
  reviewResult: boolean;
};

export type TsubmitReviewQotuationContentDto = {
  reviewSalesEmployeeId?: string | null;
  reviewSupervisorEmployeeId?: string | null;
  // reviewWorkDirectorEmployeeId?: string | null; // 改為固定人
  // reviewCashierEmployeeId?: string | null;
};

// =========================================================================

// region /engineering

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
  //
  // 是否要應有該工程圖表
  shouldHasColor: boolean | null; // 色卡
  shouldHasConstruction: boolean | null; // 施工圖
  shouldHasDetail: boolean | null; // 大樣詳圖、簽認圖
  shouldHasFloor: boolean | null; // 平面圖
  shouldHasDesign: boolean | null; // 設計圖

  // 20240329新增

  // 工務 ID
  reviewWorkerEmployeeId: string | null;
  // 工務
  reviewWorkerEmployee?: TemployeeDto;
  // 總經理 ID
  reviewManagerEmployeeId: string | null;
  // 總經理
  reviewManagerEmployee?: TemployeeDto;

  // 簽認圖送審給工務的時間
  detailToWorkerAt: string | null;
  // 工務審核簽認圖時間
  detailWorkerReviewedAt: string | null;
  // 簽認送審給總經理的時間
  detailToManagerAt: string | null;
  // 總經理審核簽認圖時間
  detailManagerReviewedAt: string | null;

  // 設計圖送審給工務的時間
  designToWorkerAt: string | null;
  // 工務審核設計圖時間
  designWorkerReviewedAt: string | null;
  // 設計圖送審給總經理的時間
  designToManagerAt: string | null;
  // 總經理審核設計圖時間
  designManagerReviewedAt: string | null;

  // 平面圖送審給工務的時間
  floorToWorkerAt: string | null;
  // 工務審核平面圖時間
  floorWorkerReviewedAt: string | null;
  // 平面圖送審給總經理的時間
  floorToManagerAt: string | null;
  // 總經理審核平面圖時間
  floorManagerReviewedAt: string | null;

  // 施工圖(工程圖)送審給工務的時間
  constructionToWorkerAt: string | null;
  // 工務審核施工圖(工程圖)時間
  constructionWorkerReviewedAt: string | null;
  // 施工圖(工程圖)送審給總經理的時間
  constructionToManagerAt: string | null;
  // 總經理審核施工圖(工程圖)時間
  constructionManagerReviewedAt: string | null;

  // 色卡送審給工務的時間
  colorToWorkerAt: string | null;
  // 工務審核色卡時間
  colorWorkerReviewedAt: string | null;
  // 色卡送審給總經理的時間
  colorToManagerAt: string | null;
  // 總經理審核色卡時間
  colorManagerReviewedAt: string | null;
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
  // 是否要有該工程圖表
  shouldHasColor: boolean; // 色卡
  shouldHasConstruction: boolean; // 施工圖
  shouldHasDetail: boolean; // 大樣詳圖、簽認圖
  shouldHasFloor: boolean; // 平面圖
  shouldHasDesign: boolean; // 設計圖
};

export type TcreateEngineeringContactDto = {
  quotationId?: string | null; // 報價單ID
  contractId?: string | null; // 合約ID
};

export type TsubmitEngineeringContactDto = {
  attachmentType: TengineeringContactAttachmentType;
};

export type TreviewEngineeringContactDto = {
  attachmentType: string;
  isPass: boolean;
};

// 派工單
export type TdispatchingDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  //  '派工日期'
  dispatchDate: string;
  //  '承包商聯絡人'
  contractorContactPerson: string;
  //  '工地電話'
  constructionSiteContactNumber: string;
  //  '工程縣市'
  county: string;
  //  '工程區'
  district: string;
  //  '工程詳細地址'
  address: string;
  //  '工務人員Id'
  workerId: string[];
  //  '工務人員'
  workerEmployee: TemployeeDto[];
  //  '完工聯絡人'
  finalContactPerson: string;
  //  '辦理事項'
  tasks: string;
  //  '派工批價方式'
  pricingMethod: string;
  //  '備註下次注意事項'
  note: string | null;
  //  '所屬合約Id'
  contractId: string | null;
  // 所屬合約
  contract: TquotationContractDto | null;
  // 所屬報價單Id
  quotationId: string | null;
  // 所屬報價單
  quotation?: TquotationDto | null;
  // 包含的代辦事項id
  todoListId: string | null;
  // 包含的代辦事項
  todoList?: TtodoDto;
  // 是否已完工
  isCompleted: boolean;
  // 保固日期
  warrantyDate: string | null;

  pointContactPerson: string | null;
  pointContactNumber: string | null;

  projectSiteContactPerson: string | null;
  projectSiteContactPersonNumber: string | null;
};

type TcreateDispatchingDto_pre = Omit<TdispatchingDto, 'contractId' | 'warrantyDate' | 'note'>;

export type TcreateDispatchingDto = Pick<
  TcreateDispatchingDto_pre,
  | 'dispatchDate'
  | 'contractorContactPerson'
  | 'constructionSiteContactNumber'
  | 'county'
  | 'district'
  | 'address'
  | 'workerId'
  | 'finalContactPerson'
  | 'tasks'
  | 'pricingMethod'
  | 'pointContactPerson'
  | 'pointContactNumber'
  | 'projectSiteContactPerson'
  | 'projectSiteContactPersonNumber'

  // | 'note'
  // | 'contractId'
  | 'isCompleted'
> & {
  contractId: string;
  note?: string | null;
};

export type TupdateDispatchingDto = Omit<Partial<TcreateDispatchingDto>, 'contractId'>;

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

  sheetNumber: string | null; // 調貨單編號
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
  sheetNumber: string; // 調貨單編號
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

export type TworksheetDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 出貨日;
  shipDay: string | null;
  // 合約Id
  contractId: string | null;
  // 合約
  contract?: TquotationContractDto;
  // 舊合約Id
  legacyContractId: string | null;
  // 舊合約
  legacyContract?: TlegacyContractDto;
  // 所有紀錄
  records: TworksheetRecordDto[];
  // 最新紀錄id
  latestRecordId: string;
  // 最新紀錄
  latestRecord: TworksheetRecordDto;
  // 已捨棄
  isAbandoned: boolean;
};

export type TworksheetDto_legacy = {
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

export type TcreateWorksheetDto = {
  //  出貨日
  shipDay?: string | null;
  //  合約id
  contractId?: string | null;
  //  舊合約id
  legacyContractId?: string | null;
  // 一般合約 productItem
  contractProductItems?: TupdateContractProductItemDto[];
};

export type TworksheetRecordDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 所屬工作主表Id
  worksheetId: string | null;
  // 所屬工作主表
  worksheet?: TworksheetDto;
  // 合約產品
  contractProductItems?: TquotationProductItemDto[];
  // 舊合約產品
  legacyProductItems?: TlegacyContractProductItemDto[];
  // 審核狀態
  status: TworksheetStatus | null; // 棄用
  // 審核業務Id
  reviewSalesEmployeeId: string | null;
  // 審核業務
  reviewSalesEmployee?: TemployeeDto;
  // 送審給業務審核時間
  toReviewSales: string | null;
  // 業務審核時間
  salesReviewAt: string | null;
  // 審核總經理Id
  reviewManagerEmployeeId: string | null;
  // 審核總經理
  reviewManagerEmployee?: TemployeeDto;
  // 送審給總經理審核時間
  toReviewManager: string | null;
  // 總經理審核時間
  managerReviewAt: string | null;
  // 版本
  version: number;
};

type TworksheetStatus = 'edit' | 'reviewing' | 'conform';

// 調整工作表產品時使用的dto
export type TupdateContractProductItemDto = {
  // 產品item id
  id: string;
  // 個別產品編號
  itemNumber: string;
  // 折數
  discount: string;
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;
  // L(mm)全寬
  fullWidth: number;
  // W(mm)
  WG: number;
  // h(mm)
  height: number;
  // B(mm)
  boxB: number;
  // D(mm)
  boxD: number;
  // 面積
  area: string | null;
  // 才數
  volume: string | null;
  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;
  // 門軌
  guideRail: string | null;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string | null;
  // 電壓
  motorVoltage: number | null;
  // 馬達支撐架
  hasMotorSupportStand: boolean | null;
  // 底座類型
  bottomBar: string | null; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string | null;
  // 門軌厚度
  guideRailThickness: string | null;
  // 捲軸規格 // 棄用
  rollerSpec: string | null; // 無凸 | 雙凸
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度
  headBoxThickness: string | null;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 複價
  totalPrice: number;
  // 防颱
  isAntiTyphoon: boolean | null;
  // 彈射門
  bounceDoor: boolean | null;
  // 彈射門寬度
  bounceDoorWidth?: number | null;
  // 彈射門高度
  bounceDoorHeight?: number | null;
  // 彈射門長度
  bounceDoorLength?: number | null;
  // 關閉方式
  closingType: string | null;
  // 備註
  notes: string;
  // 相數
  motorPhase: number | null;
  // 底座角鐵
  bottomBarAngleIron: string | null;
  // 底座板
  bottomBarPlate: string | null;
  // 門片厚度
  thickness: string | null;
  // 門片 - 捲片支數
  slatCount?: string | null;
  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel?: string | null;
  //可能為鍊條數量
  sprocketWheelChains?: string | null;
  // 鏈齒輪 - 大鏈輪
  sprocketWheelTeethNumber?: string | null;
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  bearingInnerDiameter?: string | null;
  // 捲軸 - 尺寸
  diameter?: string | null;
  // 捲軸 - 總長
  bearingHousingTotalLength?: string | null;
  // 底座 - 開口
  guideRailsOpening?: string | null;
  // 門片長度
  slatLength?: number | null;
  // 門軌長度
  guideRailLength?: number | null;
  // 捲箱長度
  headBoxLength?: number | null;
  // 軸承座寸法
  bearingHousingSize?: number | null;
  // 軸承
  bearingName?: string | null;
  gapA?: string | null;

  gapC: string | null;

  gearNumber?: string | null;

  weight?: string | null;
  // 捲箱 - 正面
  headBoxFront?: string | null;
  // 捲箱 - 有無凸 // 棄用
  headBoxProtruding?: string | null; // 棄用
  // 捲箱 - 角鐵數量
  headBoxAngleIronQuantity?: number | null;
  // 支板 - 鏈條
  sidePlateChain?: string | null;
  // 支板 - 方向
  sidePlateDirection?: string | null;
  // 電動機 - 鍊條形式
  electricMotorChainType?: string | null;
  // 電動機 - 方向
  electricMotorDirection?: string | null;
  // 門軌 - 型式
  guideRailType?: string | null;
  // guideRailG
  guideRailG?: number | null;
  // 國外認證防火規範
  isULGuideRail?: boolean | null;

  // @ApiProperty({ type: QuotationProductDto, description: '主產品' })
  // product: QuotationProductDto;

  // 選配設定
  accessories: TcreateQuotationProductAccessoryDto[]; // 不用送id
  // 產品元件
  components: TupdateQuotationProductComponentDto[];
};

export type TupdateWorkSheet = {
  contractProductItems: TupdateContractProductItemDto[];
};

// 送審工作表用的
export type TsubmitWorksheetProductsItemsDto = {
  reviewSalesEmployeeId: string;
};
// 審核工作表用的
export type TreviewWorksheetProductsItemsDto = {
  isPass: boolean;
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

export type TcompletedProductDto = {
  // 這個型別不是表，沒有id
  // 產品id
  productId: string;
  // 完成數量
  completedQuantity: number;
  // 完成數量金額
  completedPayment: number;
};

export type TincomeBillSerialDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 收入傳票號碼
  billSerialNumber: string;
  // 匯款時間點/收到票據時間點
  receiveDate: string | null;
  // 合約編號
  contractNumber: string | null;
  // 工程名稱
  projectName: string | null;
  // 承攬款
  contractPayment: number | null;
  // 本期計價
  periodPayment: number | null;
  // 前期已收
  priorPeriodPayment: number | null;
  // 票據/匯款 匯入帳號
  importAccountingNumber: string | null;
  // 票據編號
  noteNumber: string | null;
  // 票據到期日
  noteMaturityDate: string | null;
  // 收款金額
  receivablePayment: number | null;
  // 扣款金額
  deductionPayment: number | null;
  // 未收款金額
  unpaidPayment: number | null;
  // 是否為國外收入傳票
  isForeign: boolean;
  // 差額 // 更新accountant的扣款明細、手續費會更新差額
  difference: string | null;
};

export type TupdateIncomeBillSerialDto = Pick<
  TincomeBillSerialDto,
  | 'receiveDate'
  | 'contractNumber'
  | 'projectName'
  | 'contractPayment'
  | 'periodPayment'
  | 'priorPeriodPayment'
  | 'importAccountingNumber'
  | 'noteNumber'
  | 'noteMaturityDate'
  | 'receivablePayment'
  | 'deductionPayment'
  | 'unpaidPayment'
>;

export type TcreateAccountReceivableAccountsDto = {
  type: TperiodType;
  accountantId: string[];
};

// endregion /engineering

// =========================================================================
// region /accountant

// 公司銀行帳戶資料
export type TaccountantPresetDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  accountName: string;
  account: string;
  bankCode: string;
  bankName: string;
};

export type TcreateAccountantPresetDto = Pick<
  TaccountantPresetDto,
  'accountName' | 'account' | 'bankCode' | 'bankName'
>;
export type TupdateAccountantPresetDto = Pick<
  TaccountantPresetDto,
  'accountName' | 'account' | 'bankCode' | 'bankName'
>;

// 應收帳款明細
export type TaccountsReceivableDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // '估價日期'
  valuationDate: string | null;
  // '付清日期'
  payOffDay: string | null;
  // '履約保證票'
  performanceBond: boolean;
  // '訂金款保證票'
  depositGuaranteeTicket: boolean;
  // '保固票'
  warrantyTicket: boolean;
  // '異常燈號(工作表已開立，合約尚未簽回)'
  hasNoContract: boolean;
  // '提醒燈號(已出具證明，尚未收足款項)'
  hasUncollectedAmounts: boolean;
  // '已出貨，因故尚未安裝'
  hasNotInstall: boolean;
  // '已完工'
  isDone: boolean;
  // '放款票期'
  paymentTenor: string | null;
  // 所屬合約
  contract: TquotationContractDto | null;
  // 所屬舊合約
  legacyContract: TlegacyContractDto | null;
  // 扣款明細 // 棄用?
  accountReceivableDeduction: TaccountsReceivableDeductionDto[] | null;
  // 收款期
  periods: TaccountsReceivablePeriodDto[] | null;
  // 合約總金額(會因為追加而增加)
  contractTotalPrice: number;
  // 已收帳款金額(目前總計請款)
  receivedPayment: number;
  // 手續費總合計
  totalFee: number;
  // 總扣款金額
  totalDeduction: number;
  // 未收款金額
  unpaidPayment: number;
  // 尾款
  finalPayment: number | null;
  // 累計完成項目細節
  totalCompletedProduct: TcompletedProductDto | null;
  // 目前請款合計(未稅)
  totalPayment: number;
  // 目前合計請款營業稅額
  totalTax: number;
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
  // accountantId: string[] | null;
  // 扣款明細
  // accountReceivableDeduction: TcreateAccountReceivableDeductionDto[] | null;
  // 發票紀錄
  // invoices: TcreateAccountReceivableInvoiceDto[] | null;
  // 所屬合約Id;
  contractId: string | null;
  // 所屬合約Id;
  legacyContractId: string | null;
  // 是否已做完
  isDone: boolean;
};

export type TupdateAccountReceivableDto = Pick<
  TaccountsReceivableDto,
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

// 期數
export type TaccountsReceivablePeriodDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  //  期數
  type: TperiodType;
  // 請款期數
  period: number | null;
  // 訂金期數
  depositPeriod: number | null;
  // 備註
  note: string | null;
  // 所屬應收帳款Id
  accountsReceivableId: string | null;
  // 所屬應收帳款
  accountsReceivable?: TaccountsReceivableDto;
  // 每期完成項目細節
  completedProduct: TcompletedProductDto[] | null;
  // 保留款
  retainage: number | null;
  // 扣款
  deduction: number | null;
  // 沖訂金
  writeOffDeposit: number | null;
  // 是否要扣保留款
  isRetainage: boolean;
  // 是否要扣扣款
  isDeduction: boolean;
  // 是否要扣沖訂金
  isWriteOffDeposit: boolean;
  // 保留款類型
  retainageType: TretainageType | null;
  // 折讓 // 沒用到
  allowance: number | null;
  // 發票 // 目前發票只會有一張，UI與post,patch的用法都是假設發票只有一張的情況
  invoices: TaccountsReceivableInvoiceDto[];

  // 發票金額
  price: number | null;
};

export type TcreateAccountReceivablePeriodDto = Pick<
  TaccountsReceivablePeriodDto,
  | 'type'
  | 'note'
  | 'completedProduct'
  | 'retainage'
  | 'deduction'
  | 'writeOffDeposit'
  | 'isRetainage'
  | 'isDeduction'
  | 'isWriteOffDeposit'
  | 'retainageType'
  | 'allowance' // 會記錄在invoice
  | 'price'
> & {
  invoiceDate: string | null;
  invoiceNumber: string | null;
  actualPrice: number | null;
};

export type TupdateAccountReceivablePeriodDto = Partial<TcreateAccountReceivablePeriodDto>;

export type TaccountsReceivableInvoiceDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 日期
  invoiceDate: string;
  // 發票號碼
  invoiceNumber: string;

  // 實際發票金額
  actualPrice: number;
  // 發票狀態
  invoiceStatus: TinvoiceStatus;
  // 發票備註
  note: string | null;
  // 關聯收款紀錄
  accountantList: TaccountantDto[];
  // 所屬應收帳款期數Id
  accountsReceivablePeriodId: string | null;
  // 所屬應收帳款期數
  accountsReceivablePeriod: TaccountsReceivablePeriodDto;
  // 折讓
  allowance: number | null;
};

//
//
//
export type TaccountantDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 收款類型
  paymentType: TaccountantPaymentType;
  // 編號 / 現金存入帳號
  accountingNumber: string | null;
  // 匯入帳號 // 匯款來源帳號
  importAccountingNumber: string | null;
  // 匯入日期 // 收款日 // 收票日
  insertDate: string | null;
  // 廠商名稱
  vendorName: string | null;
  // 金額
  price: number;
  // 備註
  notes?: string | null;
  // 票據號碼
  noteNumber?: string | null;
  // 手續費
  fee: number;
  // 發票
  invoices?: TaccountsReceivableInvoiceDto[];
  // 收入傳票序號
  billSerialNumber?: string | null;
  // 收入傳票
  incomeBill: TincomeBillSerialDto;
  // 票據到期日
  noteMaturityDate: string | null;
  // 排序
  order: number;
  // 扣款明細
  accountsReceivableDeduction: TaccountsReceivableDeductionDto[];
  // 已匯入紙本應收帳款(舊的收款紀錄)
  isImported: boolean;
  // 票據狀態
  receiptStatus: TreceiptStatus | null;
  // 票據託收日
  receiptCollectionDate: string | null;
  // 票據預兌日
  receiptEstimatedDate: string | null;
  // 匯兌單id
  exchangeFromId: string | null;
  // 匯兌單
  exchangeFrom?: TaccountantExchangeFromDto | null;
  // 幣別
  currency: Tcurrency;
  // 票據實際兌現日
  receiptCashedDate: string | null;
};

export type TcreateAccountantDto = Pick<
  TaccountantDto,
  | 'paymentType'
  //
  | 'accountingNumber'
  | 'insertDate'
  | 'vendorName'
  | 'price'
  | 'notes'
  | 'fee'
  | 'importAccountingNumber'
  | 'noteNumber'
  | 'receiptCollectionDate'
  | 'receiptEstimatedDate'
  | 'receiptCashedDate'
  | 'currency'
> & {
  noteMaturityDate?: string | null; // 票據到期日
  // receiptCollectionDate?: string | null; // 託收日
  // receiptEstimatedDate?: string | null; // 預兌日
};

export type TupdateAccountantDto = Partial<
  TcreateAccountantDto & {
    accountsReceivableDeduction: Partial<TaccountsReceivableDeductionDto>[];
  }
>;

export type TupdateAccountantDeductionDto = {
  fee?: number | null;
  // 沒有改也必須要送，所以沒有改就是送原本的
  accountsReceivableDeduction: TupdateAccountReceivableDeductionDto[];
  order?: number;
  isImported?: boolean;
};

/**扣款明細 */
export type TaccountsReceivableDeductionDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  itemName: string; // 項目
  // period: number; // 期數 // 棄用
  detailedAmount: number; // 明細金額
  accountsReceivableId: string; // 所屬應收帳款Id
  accountsReceivable?: TaccountsReceivableDto | null; // 所屬應收帳款
};

export type TcreateAccountReceivableDeductionDto = Pick<TaccountsReceivableDeductionDto, 'itemName' | 'detailedAmount'>;

export type TupdateAccountReceivableDeductionDto = {
  id?: string; // ID, 不提供時將此筆視為新增資料
  itemName: string;
  detailedAmount: number;
};

export type TfinalProduct = {
  //追加合約產品包含item deliveryStatus productPayment
  finalAppendContractProductsItems: TquotationProductItemDto[];

  //源合約產品包含item deliveryStatus productPayment(主產品數量已扣追減)
  // finalAppendContractProductsItems已經整合進這裡面了
  finalRootContractProductItems: TquotationProductItemDto[];
};

// 應收帳款明細 主產品請款比例  棄用
// export type TaccountsReceivableProductPaymentDto = {
//   id: string;
//   createdAt: string;
//   updatedAt: string;

//   // 請款比例(完成數量)
//   paymentRatio: string | null;
//   // 發票id
//   invoiceId: string | null;
//   // 發票
//   invoice: TaccountsReceivablePeriodDto | undefined;
//   // 關聯產品itemId
//   productItemId: string | null;
//   //關聯產品item
//   productItem: TquotationProductItemDto | undefined;
// };

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

export type TaccountantExchangeFromDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 匯兌單號
  sheetNumber: string;
  // 兌現日期
  cashExchangeDate: string | null;
  // 兌現帳戶
  cashExchangeAccount: string | null;
  // 包含的accountant
  accountant: TaccountantDto[];
};

export type TcreateAccountantExchangeFromDto = {
  accountantId: string[];
};

// MARK: /accountant end
// endregion /accountant

// =========================================================================

// 外包計價
// outsourcing

export type ToutsourcingDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // 外包廠商名
  name: string;
  // 連絡電話
  contactNumber: string;
  // 負責人
  principal: string;
  // 統編
  taxId: string;
  // 廠商地點(縣市)
  county: string;
  // 廠商地點(區)
  district: string;
  // 廠商地點(詳細地點)
  address: string;
  // 備註
  notes: string | null;
  // 外包計價單
  outsourcingPayment?: ToutsourcingPaymentDto[];
  // 最新外包計價單
  latestPayment?: ToutsourcingPaymentDto;
};

export type TcreateOutsourcingDto = Omit<
  ToutsourcingDto,
  'outsourcingPayment' | 'latestPayment' | 'id' | 'createdAt' | 'updatedAt'
>;
export type TupdateOutsourcingDto = TcreateOutsourcingDto;

// 外包計價單
export type ToutsourcingPaymentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
  //  '外包廠商Id'
  outsourcingId: string | null;
  //  '外包廠商'
  outsourcing: ToutsourcingDto;
  //  '外包計價單日期'
  date: string; // ISOstring
  //  '是否已結清'
  isPaymentCleared: boolean;
  //  '請款合計'
  paymentSubTotal: number | null;
  //  '扣款明細'
  deduction: TdeductionDto[] | null;
  //  '扣款合計'
  deductionTotal: number | null;
  //  '上期保留款'
  priorPeriodRetainage: number | null;
  //  '本期保留款'
  retainage: number | null;
  //  '小計'
  subTotal: number | null;
  //  '營業稅'
  salesTax: number | null;
  //  '實領總計'
  total: number | null;
  //  '外包計價帳款明細'
  outsourcingPaymentDetail: ToutsourcingPaymentDetailDto[];
  //  '經辦人Id'
  agentEmployeeId: string | null;
  //  '經辦人'
  agentEmployee: TemployeeDto;
  //  '送審給核對人員的時間'
  toReviewCheckerAt: string | null; // ISOstring
  //  '核對人員Id'
  reviewCheckerEmployeeId: string;
  //  '核對人員'
  reviewCheckerEmployee: TemployeeDto;
  //  '核對人員審核時間'
  checkerReviewedAt: string | null; // ISOstring
  //  '送審給主管的時間'
  toReviewSupervisorAt: string | null; // ISOstring
  //  '審核主管id'
  reviewSupervisorEmployeeId: string;
  //  '審核主管'
  reviewSupervisorEmployee: TemployeeDto;
  //  '主管審核時間'
  supervisorReviewedAt: string | null; // ISOstring
  //  '送審給總經理的時間'
  toManagerAt: string | null; // ISOstring
  //  '總經理id'
  reviewManagerEmployeeId: string;
  //  '總經理'
  reviewManagerEmployee: TemployeeDto;
  //  '總經理審核時間'
  managerReviewedAt: string | null; // ISOstring
  //  '送審給會計的時間'
  toAccountingAt: string | null; // ISOstring
  //  '會計id'
  reviewAccountingEmployeeId: string;
  //  '會計'
  reviewAccountingEmployee: TemployeeDto;
  //  '會計審核時間'
  accountingReviewedAt: string | null; // ISOstring
  //  '送審給出納的時間'
  toCashierAt: string | null; // ISOstring
  //  '出納id'
  reviewCashierEmployeeId: string;
  //  '出納'
  reviewCashierEmployee: TemployeeDto;
  //  '出納審核時間'
  cashierReviewedAt: string | null; // ISOstring
};

export type TdeductionDto = {
  // 類別
  type: string;
  // 項目
  itemName: string;
  // 扣款金額 // IsNumberString
  // price: string;
  price: number;
};

export type TupdateOutsourcingPaymentDto = {
  // 外包計價日期
  date: string;
  // 請款合計
  paymentSubTotal: number | null;
  // 扣款明細
  deduction: TdeductionDto[] | null;
  // 扣款總金額
  deductionTotal: number | null;
  // 上期保留款項 // 不應該使用
  // priorPeriodRetainage: number | null;
  // 本期保留款項
  retainage: number | null;
  // 小計
  subTotal: number | null;
  // 營業稅
  salesTax: number | null;
  // 實領總計
  total: number | null;

  reviewCheckerEmployeeId?: string | null;
  reviewSupervisorEmployeeId?: string | null;
  reviewAccountingEmployeeId?: string | null;
  reviewCashierEmployeeId?: string | null;
};

export type ToutsourcingPaymentDetailDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 工程聯絡單Id
  engineeringContactId: string | null;
  // 工程聯絡單
  engineeringContact?: TengineeringContactDto;
  // 若為一般工程之一般項，則有此property
  installItems?: TquotationProductItemDto[];
  // 是否為非一般工程之特殊項
  isOther: boolean;
  // 項目名
  itemName: string;
  // 安裝內容
  installation: string | null;
  // 樘數
  quantity: number | null;
  // 單樘計價
  unitPrice: number | null;
  // 外包計價合計
  outsourcingTotal: number;
  // 外包計價單id
  outsourcingPaymentId: string | null;
  // 外包計價單
  outsourcingPayment?: ToutsourcingPaymentDto;
};

export type TcreateOutsourcingPaymentDetailItemDto = {
  // otherInstallation: string | null; // 特殊項目施作內容
  // otherQuantity: number | null; // 特殊項目數量
  // otherUnitPrice: number | null; // 特殊項目計價
  // otherSubTotalPrice: number | null; // 特殊項目小計
  itemId: string | null; // 自動代入之productItem的id
  itemPrice: number | null; // productItem的才數計價
  otherWorkItems: ToutsourcingPaymentDetailItemDto[] | null;
  otherWorkItemTotal: number | null; // 特殊項目之合計
};

export type TupdateOutsourcingPaymentDetailDto = {
  engineeringContactId: string; // 工程聯落單id
  installItems: TcreateOutsourcingPaymentDetailItemDto[]; // 項目
  // outsourcing: number; // 外包計價明細總計
  outsourcingTotal: number; // 外包計價明細總計
};

export type ToutsourcingPaymentDetailItemDto = {
  // 特殊項目施作內容
  otherInstallation?: string | null;
  // 特殊項目數量
  otherQuantity?: number | null;
  // 特殊項目計價
  otherUnitPrice: number;
  // 特殊項目小計
  otherSubTotalPrice?: number | null;
  // 特殊項目關聯status
  quotationItemStatusId?: string | null; // 其實應該是必填，不給會沒效果的樣子
};

// ====================================================================

// meeting-minutes

export type Tpopulate_meetingMinutesDto = {
  contract?: boolean;
  chairmanEmployee?: boolean;
  attendeesEmployee?: boolean;
  minuteTakerEmployee?: boolean;
  formMakerEmployee?: boolean;
};

export type TmeetingMinutesDto<Tpopulate extends Tpopulate_meetingMinutesDto = object> = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 所屬合約
  contractId: string | null;
  // 所屬合約
  contract: Tpopulate['contract'] extends true ? TquotationContractDto : undefined;
  // 會議名稱
  name: string;
  // 地點
  location: string;
  // 主席id
  chairmanEmployeeId: string | null;
  // 主席
  chairmanEmployee: Tpopulate['chairmanEmployee'] extends true ? TemployeeDto : undefined;
  // 與會人員
  attendeesEmployee: Tpopulate['attendeesEmployee'] extends true ? TemployeeDto[] : undefined;
  // 會議時間 date
  minuteDate: string;
  // 記錄人id
  minuteTakerEmployeeId: string | null;
  // 記錄人
  minuteTakerEmployee: Tpopulate['minuteTakerEmployee'] extends true ? TemployeeDto : undefined;
  // 會議記錄內容
  content: string;
  // 進場時間 date
  entryTime: string | null;
  // 消檢時間 date
  inspectionTime: string | null;
  // 使照時程 date
  timeline: string | null;
  // 竣工時間 date
  completionTime: string | null;
  // 製表人
  formMakerEmployee: Tpopulate['formMakerEmployee'] extends true ? TemployeeDto : undefined;
};

export type TcreateMeetingMinutesDto = {
  // 所屬合約Id
  contractId: string;
  // 會議名稱
  name: string;
  // 地點
  location: string;
  // 主席Id
  chairmanEmployeeId: string;
  // 與會人員
  attendeesEmployee: string[];
  // 會議時間
  minuteDate: string;
  // 記錄人
  minuteTakerEmployeeId: string;
  // 會議記錄內容
  content: string;
  // 進場時間
  entryTime?: string | null;
  // 消檢時間
  inspectionTime?: string | null;
  // 使照時程
  timeline?: string | null;
  // 竣工時間
  completionTime?: string | null;
  // 製表人
  formMakerEmployeeId: string;
};

export type TupdateMeetingMinutesDto = Omit<TcreateMeetingMinutesDto, 'id'>;

// ============================================================================

// todoDTO

export type Tpopulate_todoDto = {
  engineeringContact?: boolean;
  dispatching?: boolean;
  agentEmployee?: boolean;
};

export type TtodoDto<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>> = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // 工程聯絡單Id
  engineeringContactId: string | null;
  // 工程聯絡單
  engineeringContact: P['engineeringContact'] extends true ? TengineeringContactDto | null : undefined;
  // 派工單Id
  dispatchingId: string | null;
  // 派工單
  dispatching: P['dispatching'] extends true ? TdispatchingDto | null : undefined;
  // 聯絡人(接洽人欄位)
  contactPerson: TtodoContactDto[] | null;
  // 主旨
  purpose: string | null;
  // 通知日期
  notificationDate: string | null;
  // 預計進場日期
  entryDate: string | null;
  // 聯絡電話
  contactNumber: string | null;
  // 內容
  content: string;
  // 是否已派工
  isAlreadyDispatching: boolean;
  // 經辦人Id
  agentEmployeeId: string | null;
  // 經辦人
  agentEmployee: P['agentEmployee'] extends true ? TemployeeDto : undefined;
};

export type TtodoContactDto = {
  contactPerson: string;
  contactNumber: string;
};

export type TcreateTodoDto = {
  // 工程聯絡單Id
  engineeringContactId: string | null;
  // 聯絡人(接洽人欄位)
  contactPerson: TtodoContactDto[];
  purpose: string;
  notificationDate: string;
  entryDate: string;
  // 接洽人(目前沒用到，接洽人欄位用contactPerson代替)
  pointContactPerson: ''; // 目前用不到，但是必須要送
  pointContactNumber: ''; // 目前用不到，但是必須要送
  content: string;
  // isAlreadyDisPatching?: boolean;
};

// export type TupdateTodoDto = TcreateTodoDto & {
//   id: string;
// };
export type TupdateTodoDto = Partial<TcreateTodoDto> & {
  id: string;
  isAlreadyDispatching?: boolean;
};

// =============================================================================

// 工務部 備忘錄

export type Tpopulate_memorandumDto = {
  poster?: boolean;
  recipient?: boolean;
};

export type TmemorandumDto<P extends Tpopulate_memorandumDto = Tpopulate_memorandumDto> = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 發文者id
  posterId: string | null;
  // 發文者
  poster: P['poster'] extends true ? TcustomerDto | undefined : undefined;
  posterEmail: string;

  // 收件者id
  recipientId: string | null;
  // 收件者
  recipient: P['recipient'] extends true ? TcustomerDto | undefined : undefined;
  recipientEmail: string;
  // 發文日期
  postDate: string | null;
  // 收件日期
  recipientDate: string | null;

  // 日期
  // date: string;
  // 回簽日期 // 待後端修改型別後，要確認property是否正確
  // replyDate?: string | null;
  // 發文字號
  issueNumber: string;
  // 主旨
  purpose: string;
  // 說明
  description: string;
  // 是否為發文者
  isPoster: boolean;
  // 是否為源發文/回文
  isRootMail: boolean;
  // 信件串 // memorandumId陣列 // 不含rootMail
  mailThread: string[] | null;
};

export type TcreateMemorandumDto = {
  posterId: string;
  posterEmail: string | null;
  recipientId: string;
  recipientEmail: string | null;
  issueNumber: string;
  purpose: string;
  description: string;
  rootMailId: string | null;
};

// =============================================================================

// 證明文件

export type TcertificatedDocDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 工程編號
  projectNumber: string | null;
  // 承包商
  contractor: string | null;
  // 本期請款
  payment: number | null;
  // 請款日
  paymentDate: string | null;
  // 申請日期
  applicationDate: string | null;
  // 工程名稱
  projectName: string | null;
  // 本期計價
  valuation: number | null;
  // 保留款
  retainage: number | null;
  // 放款日
  disbursementDate: string | null;
  // 說明
  description: string | null;
  // 備註
  note: string | null;
  // 文件種類
  docStyle: TdocType;
  // 證明書開立快照 // 就是證明書內的資料，是JSON，資料結構與內容全由前端決定
  snapShot: string | null;
  // 狀態(審核中/審核完成尚未用印/已印出)
  status: '編輯中' | '審核中' | '審核完成尚未用印' | '已用印';
  // 開立產品
  products: TcertificatedProductDto[];

  // 送審給擔保人的時間 //Date
  toGuarantorAt?: string | null;
  // 擔保人
  reviewGuarantorEmployee?: TemployeeDto | null;
  // 擔保人審核時間 // Date
  guarantorReviewedAt?: string | null;

  // 送審給會計的時間 // Date
  toAccountingAt?: string | null;
  // 會計
  reviewAccountingEmployee?: TemployeeDto | null;
  // 會計審核時間 // Date
  accountingReviewedAt?: string | null;

  // 送審給"審核"的時間 // Date
  toAuditorAt?: string | null;
  // "審核"人
  reviewAuditorEmployee?: TemployeeDto | null;
  // "審核"人審核時間 // Date
  auditorReviewedAt?: string | null;

  // 送審給總經理的時間 // Date
  toManagerAt?: string | null;
  // 總經理
  reviewManagerEmployee?: TemployeeDto | null;
  // 總經理審核時間 // Date
  managerReviewedAt?: string | null;

  // 經辦
  agentEmployee?: TemployeeDto | null;

  // 保固日
  warrantyDate: string | null;

  // _____________
  // 所屬合約Id
  contractId: string | null;
  // 所屬合約
  contract: TquotationContractDto;

  // 以上的最後這兩個 可能會改成content 還沒決定

  // @ApiProperty({ description: '所屬合約Id' })
  //   contractId: string | null;

  //   @ApiProperty({ description: '所屬合約' })
  //   contract: QuotationContractDto;
};

export type TcertificatedProductDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 項目名
  itemName: string;
  // L(mm)全寬
  fullWidth: number;
  // h(mm)高
  height: number;
  // B(mm)
  boxB: number | null;
  // 門型
  doorModelName: string;
  // 數量(應皆為1)
  quantity: number;
  // 防火證明已開立
  firePreventionCertificated: boolean;
  // 出廠證明已開立
  factoryCertificated: boolean;
  // 保固證明已開立
  warrantyCertificated: boolean;
  settleProductId: string | null;
  settleProduct: TsettleProductDto;
};

export type TsettleProductDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 項目名
  itemName: string;
  // L(mm)全寬
  fullWidth: number;
  // h(mm)高
  height: number;
  // B(mm)
  boxB: number | null;
  // 門型
  doorModelName: string;
  // 合約最終數量
  quantity: number;
  // 防火證明已開立數量
  firePreventionCertificatedQuantity: number | null;
  // 出廠證明已開立數量
  factoryCertificatedQuantity: number | null;
  // 保固證明已開立數量
  warrantyCertificatedQuantity: number | null;

  preFactoryCertificatedQuantity: number | null;
  preFirePreventionCertificatedQuantity: number | null;
  preWarrantyCertificatedQuantity: number | null;

  contentId: string | null;
  content: TquotationContentDto;
};

export type TcreateCertificatedDocDto = Pick<
  TcertificatedDocDto,
  | 'projectNumber'
  | 'contractor'
  | 'payment'
  | 'paymentDate'
  | 'applicationDate'
  | 'projectName'
  | 'valuation'
  | 'retainage'
  | 'disbursementDate'
  | 'warrantyDate'
  | 'description'
  | 'docStyle'
  | 'status'
  | 'note'
> & {
  products: TcreateCertificatedProductDto[]; // 不可以是空陣列
};

export type TupdateCertificatedDocDto_pre = Pick<
  TcertificatedDocDto,
  | 'projectNumber'
  | 'contractor'
  | 'payment'
  | 'paymentDate'
  | 'applicationDate'
  | 'projectName'
  | 'valuation'
  | 'retainage'
  | 'disbursementDate'
  | 'warrantyDate'
  | 'description'
  | 'note'
  | 'docStyle'
  | 'status'
  | 'snapShot'
> & {
  products: TupdateCertificatedProductDto[]; // 不可以是空陣列
};

export type TupdateCertificatedDocDto = Partial<TupdateCertificatedDocDto_pre>;

export type TcreateCertificatedProductDto = {
  settleProductId: string; // 最終產品ID
  quantity: number;
};

export type TupdateCertificatedProductDto = {
  settleProductId: string; // 最終產品ID
  quantity: number;
};

export type TsubmitCertificatedDocDto = {
  reviewGuarantorEmployeeId: string; // 擔保人id
};

export type TreviewCertificatedDocDto = {
  reviewResult: boolean;
};

export type TcreateCertificatedDocSnapShotDto = {
  snapShot: string;
};

// =============================================================================

// region report-form

// 獎金統計表
export type TbonusDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // 獎金年份
  bonusYear: string;
  // 獎金月份
  bonusMonth: string;
  // 業績總額
  totalSales: number;
  // 獎金總額
  totalBonus: number;
  // 備註
  note: string | null;
  // 業務id
  salesEmployeeId: string | null;
  // 業務
  salesEmployee: TemployeeDto;
  // 課長Id
  reviewTeamLeaderEmployeeId: string | null;
  // 審核課長
  reviewTeamLeaderEmployee: TemployeeDto;
  // 送審給課長審核時間
  toReviewTeamLeader: string | null;
  // 課長審核時間
  teamLeaderReviewAt: string | null;
  // 審核主管Id
  reviewSupervisorEmployeeId: string | null;
  // 審核主管
  reviewSupervisorEmployee: TemployeeDto;
  // 送審給主管審核時間
  toReviewSupervisor: string | null;
  // 主管審核時間
  supervisorReviewAt: string | null;
  // 審核總經理Id
  reviewManagerEmployeeId: string | null;
  // 審核總經理
  reviewManagerEmployee: TemployeeDto;
  // 送審給總經理審核時間
  toReviewManager: string | null;
  // 總經理審核時間
  managerReviewAt: string | null;
};

// 結算週期
export type TsettlementCycleDto = {
  id: string;
  createdAt: string;
  updatedAt: string;

  settleYear: string | null; // 結算年份 ex:2021
  settleMonth: string | null; // 結算月份 ex: 2
  startDate: string; // ISO
  dueDate: string; // ISO
  status: 'set' | 'lock';
};

export type TcreateSettlementCycleDto = {
  settleYear?: string | null; // 結算年份 ex:2021
  settleMonth?: string | null; // 結算月份 ex: 2
  startDate: string; // ISO
  dueDate: string; // ISO
};

export type TupdateSettlementCycleDto = {
  settleYear?: string | null; // 結算年份 ex:2021
  settleMonth?: string | null; // 結算月份 ex: 2
  startDate?: string; // ISO
  dueDate?: string; // ISO
  id: string | undefined; // 不提供時將此筆視為新增資料
};

export type TsettleBonusDto = {
  settlementCycleId: string;
};

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================

// 依賴populate的泛型寫法

// type Tbarr = {
//   engineeringContact?: boolean;
//   dispatching?: boolean;
//   agentEmployee?: boolean;
// };

// export type Tfooo<P extends Tbarr = Partial<Tbarr>> = {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   engineeringContact: P['engineeringContact'] extends true ? TengineeringContactDto | null : undefined;
//   dispatching: P['dispatching'] extends true ? TdispatchingDto | null : undefined;
//   agentEmployee: P['agentEmployee'] extends true ? TemployeeDto : undefined;
// };

// type Tfoooooooooo = Tfooo<{ engineeringContact: true }>;
