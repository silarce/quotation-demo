// 員工投保紀錄
export interface InsuranceItem {
  insuranceId?: string | null; // 若未傳表示新增
  insuranceTypePcode: 'health' | 'labor'; // 健保 or 勞保
  effectiveDate: string; // 生效日期
  levelAmount: string; // 投保級距
  // monthlySalary?: number; // 月投保薪資 (可不傳)
  reason: string; // 備註或異動原因
  createdAt: string; // 異動日期
}

// 員工眷屬
export interface DependentItem {
  empRelativeId?: string | null; // 若未傳表示新增
  empRelativeName: string; // 姓名
  empRelativeIdNo: string; // 身分證
  empRelativeBirthday: string; // 生日
  empRelativeRelationPcode: string; // 關係
  empRelativeDomesticPcode: string; // 是否國外
  is_nhi: boolean; // 是否計入健保扶養
}

// 員工任用資料
export interface EmployeeEmployment {
  workTypePcode: string; // 勤務類別
  workLocationPcode: string; // 工作地點
  salaryAccountPcode: string; // 薪資帳別
  salaryPlainText: string; // 本薪
  laborRetirePercentage: string; // 勞退百分比
  shiftId: string; // 班別
  userAddr: string; // 卡號
  extensionNo: string; // 分機
}

// 新增員工 payload
export interface CreateEmployeePayload {
  empCode: string;
  userId: string;
  idNo: string;
  empChName: string;
  empEnName?: string;
  email: string;
  birthdayDate: string;
  genderPcode: string;
  maritalPcode: string;
  educationPcode: string;
  phone1: string;
  phone2?: string;
  nationalityPcode: string;
  residenceCountyPcode: string;
  residenceDistrictPcode?: string;
  residenceAddress: string;
  mailingCountyPcode: string;
  mailingDistrictPcode?: string;
  mailingAddress: string;
  militaryServiceTypePcode: string;
  emergencyContactPhone: string;
  emergencyContactName: string;
  emergencyContactRelationshipPcode: string;
  phoneNumber?: string;
  seniority?: string;
  startDate: string;
  leaveDate?: string;
  retireDate?: string;
  severanceDate?: string;
  department: string;
  jobGradeId: string;
  isEnable?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
  deletedAt?: string;
  isInvalid?: boolean;

  // 子結構
  employeeEmployment: EmployeeEmployment;
  dependents: DependentItem[];
  insuranceItems: InsuranceItem[];
}
