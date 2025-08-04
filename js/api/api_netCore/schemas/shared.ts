type Guid = string;
type DateTime = string; // UTC
type decimal = number;

interface Tmeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

interface TpageResponse<T> {
  items: T[];
  meta: Tmeta;
}

interface TapiParams {
  page?: number;
  pageSize?: number;
}

interface TnetCoreApiBody {
  TypeName: string;
  ServiceName: string;
  FunctionName: string;
  FilterConditions: string; // 將post或patch的body轉為JSON放進去
}

type Tinvoice_type = '二聯式' | '三聯式';
type Ttax_type = '應稅' | '零稅' | '免稅';
type Treview_status = '未審核' | '已審核' | '審核中';

type Treview_status__stages = '核准' | '提出' | '簽核中' | '';
type Tdocument_status = '審核中' | '駁回' | '核准' | '抽單';

interface Tbase {
  id: string;
  create_by: string | null;
  created_at: string;
  update_by: string | null;
  updated_at: string;
}

export type {
  Tbase,
  Tmeta,
  TapiParams,
  TpageResponse,
  TnetCoreApiBody,
  Guid,
  DateTime,
  decimal,
  Tinvoice_type,
  Ttax_type,
  Treview_status,
  Treview_status__stages,
  Tdocument_status,
};
