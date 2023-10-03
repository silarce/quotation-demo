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
  length: number;
  /**W(m) */
  width: number;
  /**h(m) */
  height: number;
  /**B(m) */
  thickness: number;
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
  //
  /**批次 */
  batch: number;
  /**所屬批次編號 */
  batchNumber: string;
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
  //
  /**批次 */
  batch: number;
  /**所屬批次編號 */
  batchNumber: string;
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
  /**報價範圍 */
  quoteScopes: string[];
  /**經理 */
  managerName: string;
  /**主管 */
  supervisorName: string;
  /**經辦人 */
  operatorName: string;
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
  length: number;
  /** W(m) */
  width: number;
  /** h(m) */
  height: number;
  /** B(m) */
  thickness: number;
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
};

export type TupdateLegacyContractAdditionDto = TcreateLegacyContractAdditionDto & {
  // batchNumber?: string;
  id?: string;
};

export type TcreateLegacyContractDto = {
  /* 客戶ID */
  customerId: string;
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
  managerName: string;
  /* 主管 */
  supervisorName: string;
  /* 經辦人 */
  operatorName: string;
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
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// work-sheet

export type TannotationDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  /**類別 */
  category: string;
  /**門型 */
  doorModelName: string;
  /**型式 */
  type: 'normal' | 'anti-typhoon';
  /**內容 */
  description: string;
};

export type TcreateAnnotationDto = {
  category: string;
  doorModelName: string;
  type: 'normal' | 'anti-typhoon';
  description: string;
};

export type TcreateQuotationRangeDto = {
  category: string;
  doorModelName: string;
  type: 'normal' | 'anti-typhoon';
  description: string;
};

export type TquotationRangeDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  /**類別 */
  category: string;
  /**門型 */
  doorModelName: string;
  /**型式 */
  type: 'normal' | 'anti-typhoon';
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
>;

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
  rawData: object;
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
  doorType: string;
  // L(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  length: number;
  // W(m) // 已跟後端討論好所有送去後端或後端送來的 l w h b 單位都是mm，所以要換算
  width: number;
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
  material: string;
  // 表面
  surface: string;
  // 門軌
  doorTrack: string;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motor: string;
  // 電壓
  voltage: number;
  // 馬達支撐架
  motorSupport: boolean;
  // 底座類型
  bottomBar: string;
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  doorTrackThick: number;
  // 捲軸規格
  rollerSpec: string;
  // 門軌消音條
  doorTrackSilencerStrip: boolean;
  // 一體式捲箱
  onePieceRollUpBox: boolean;
  // 捲箱厚度
  rollUpBoxThick: number;
  // 單價
  unitPrice: number;
  // 牌價
  price: number;
  // 牌價複價
  dualPrice: number;
  // 複價
  totalPrice: number;
  // // 防颱
  typhoonProtection: boolean;
  // 彈射門
  bounceDoor: boolean;
  // 關閉方式
  close: string;
  // 備註
  notes: string;
  order: number;

  bottomBarAngleIron: string; // 底座角鐵
  bottomBarPlate: string; // 底座板

  items: {
    // 材料配件
    components: TquotationProductComponentsDto[];
    // 選配設定
    accessories: TquotationProductAccessoriesDto[];
    // TODO 還有其他很多有的沒有的，用不到，以後有空再補上
  }[];

  attachedToProductId?: string | null;
  attachedToProduct?: TquotationProductDto | null;
};

export type TquotationContentDto = {
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
  status: 'Budget' | 'Bidding' | 'Contracting'; // 報價單狀態: 預算 投標 發包
  managerEmployee: TemployeeDto | null;
  supervisorEmployee: TemployeeDto | null;
  agentEmployee: TemployeeDto;
  //審核相關
  reviewSalesEmployee: TemployeeDto | null;
  salesReviewedAt: string | null;
  reviewWorkDirectorEmployee: TemployeeDto | null;
  workDirectorReviewedAt: string | null;
  reviewSupervisorEmployee: TemployeeDto | null;
  supervisorReviewedAt: string | null;
  reviewManagerEmployee: TemployeeDto | null;
  managerReviewedAt: string | null;
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
  toSalesAt: string | null;
  toSupervisorAt: string | null;

  others: TquotationContentOtherDto[];
  products: TquotationProductDto[];

  verifyForm: TquotationVerifyFormDto;
};

export type TquotationDto = {
  id: string;
  createdAt: string;
  updateAt: string;
  quotationNumber: string;
  latestContent: TquotationContentDto;
  contents: TquotationContentDto[];
  attachedToContract: TquotationContentDto & { verifyForm: TquotationVerifyFormDto };
};

export type TcreateQuotationProductDto = {
  /**折數 */
  discount: string;
  // 項目名
  itemName: string;
  // 報價別
  quoteType: string;
  // 門型
  doorType: string;
  // L(m)
  length: number;
  // W(m)
  width: number;
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
  material: string;
  // 表面
  surface: string;
  // 門軌
  doorTrack: string;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motor: string;
  // 電壓
  voltage: number;
  // 馬達支撐架
  motorSupport: boolean;
  // 底座類型
  bottomBar: string;
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  doorTrackThick: number;
  // 捲軸規格
  rollerSpec: string;
  // 門軌消音條
  doorTrackSilencerStrip: boolean;
  // 一體式捲箱
  onePieceRollUpBox: boolean;
  // 捲箱厚度
  rollUpBoxThick: number;
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
  typhoonProtection: boolean;
  // 彈射門
  bounceDoor: boolean;
  // 關閉方式
  close: string;
  // 備註
  notes: string;
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
  materialSurface: string;
  isPainted: boolean;
  order: number;
  bottomBarAngleIron: string; // 底座角鐵
  bottomBarPlate: string; // 底座板
};

// type TupdateQuotationContentDto = {
//   quotationDate: string; // 報價日期
//   validityPeriod: string; // 報價時效
//   customerId: string;
//   projectName: string; // 工程名稱
//   county: string; // 縣市
//   district: string; // 區
//   address: string; // 剩餘地址
//   contactPerson: string; //  聯絡人
//   contactNumber: string; //  聯絡電話
//   faxNumber: string; // 傳真號碼
//   trackProgress: string; // 追蹤狀態
//   projectProgress: string; //工地進度
//   quantity: number; // 樘數
//   editNotes: string; // 編輯備註
//   status: 'Budget' | 'Bidding' | 'Contracting'; // 報價單狀態: 預算 投標 發包
//   /**備註 */
//   annotations: string[] | null;
//   /**報價範圍 */
//   quotationRanges: string[] | null;
//   managerId: string | null;
// };

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
  status: 'Budget' | 'Bidding' | 'Contracting'; // 報價單狀態: 預算 投標 發包
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
  deliveryDate: string;
  paymentMethods: TpaymentMethodDto[];

  others: TcreateQuotationContentOtherDto[];
  products: TcreateQuotationProductDto[];
  productsOrder?: string[] | null; // 已棄用
};

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
  rootContract: TquotationContractDto; // 源合約
  attachedToContract: TquotationContractDto; // 上一份追加減合約
  attachedContract: TquotationContractDto; // 下一份追加減合約
  //
  subContracts: TquotationContractDto[];
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
  // 從name來看，get /products/door/models取得的陣列應該會有7個item，但實際上只一個?
  // 因為DuST還在做
  name: TdoorModelName;
  density: number; // 密度?
  guideRails: {
    imgSrc: string;
    opening: string; // 印象中好像跟圖片中的開口有關??
    thickness: string;
    withHook: boolean | null; // 防颱勾?
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
  bearingInnerDiameter: string;
  bearingName: string; // 軸承
  defaultMotorIndex: number;
  density: number; // 密度
  diameter: number; // 捲軸直徑
  gapA: number;
  gapC: number;
  motors: TdoorGeneralSpecsMotorDto[];
  sprocketWheelModel: string;
  sprocketWheelTeethNumber: string;
  sprocketWheelChains: number;
  thickness: string;
  weight: number;
  slatLength: number; // 門片長度
  guideRailLength: number; // 門軌長度
  headBoxLength: number; //  捲箱長度
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
  materialSurface?: '2B' | 'HL' | 'BA' | 'NO.4' | null; // 表面處理
  isPainted: boolean; // 烤漆
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
  price: number;
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
  note: string;
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
  // 合約審核表審核主管(工務部主管)
  workDirectorId: string;
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
