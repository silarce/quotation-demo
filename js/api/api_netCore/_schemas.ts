interface TnetCoreapiBody {
  TypeName: string;
  ServiceName: string;
  FunctionName: string;
  FilterConditions: string; // 將post或patch的body轉為JSON放進去
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
  account_name: string;
  // 帳號
  account: string;
  // 銀行代號
  bank_code: string;
  // 銀行名稱
  bank_name: string;
}

type TcreateAccountantPresetDto = Omit<
  TaccountantPresetDto,
  'id' | 'create_by' | 'created_at' | 'update_by' | 'updated_at'
>;
type TupdateAccountantPresetDto = Partial<TcreateAccountantPresetDto> & {
  id: string;
};

export type {
  //
  TnetCoreapiBody,
  //
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  //
};
