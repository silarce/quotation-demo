import type { TstateProdDict } from '../type';
import type { TcreateQuotationProductDto } from 'js/api/dtoTypes';

// API 已停用：保留呼叫端，回傳極簡 stub。
const calcProductBody = (_: {
  prodKeyArr: string[];
  state_prodDict: TstateProdDict;
  state_iterativeProdDict: TstateProdDict;
}) => {
  return {
    quotationProductArr: [] as TcreateQuotationProductDto[],
    iterativeQuotationProductArr: [] as TcreateQuotationProductDto[],
    totalQty: 0,
    isValid: true as boolean,
    invalidMessageArr: [] as string[],
  };
};

export { calcProductBody };