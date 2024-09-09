interface TnetCoreapiBody {
  typeName: string;
  serviceName: string;
  functionName: string;
  filterConditions: string; // 將post或patch的body轉為JSON放進去
}

interface Tbase {
  id: string;
  create_by: string;
  created_at: string;
  update_by: string;
  updated_at: string;
}

interface TaccountantPresetDto extends Tbase {
  // 帳戶名稱
  accountName: string;
  // 帳號
  account: string;
  // 銀行代號
  bankCode: string;
  // 銀行名稱
  bankName: string;
}

type TcreateAccountantPresetDto = Omit<
  TaccountantPresetDto,
  'id' | 'create_by' | 'created_at' | 'update_by' | 'updated_at'
>;

export type {
  //
  TnetCoreapiBody,
  //
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  //
};
