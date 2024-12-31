import { formatProdStateToBody } from 'components/page/domestic/quotation_v2/hook/quotationProduct/method/formatProdStateToBody';
import type { TstateProd, TstateProdDict } from '../type';
import Decimal from 'decimal.js';
import { ClassProd } from '../useQuotationProduct';

const calcProductBody = ({
  prodKeyArr,
  createClassProd,
  state_prodDict,
}: {
  prodKeyArr: string[];
  createClassProd: (stateProd: TstateProd) => ClassProd;
  state_prodDict: TstateProdDict;
}) => {
  const totalQty_decimal = new Decimal(0);
  let isAllDoorModalValid = true;

  const invalidComponentArr: number[] = [];

  const classProdArr = prodKeyArr.map((key) => {
    return createClassProd(state_prodDict[key]);
  });

  const stateArr = classProdArr.map((classProd, index) => {
    const { state: stateProd, isComponentValid } = classProd;

    // 目前isComponentValid只會為true，未來要再製作
    if (!isComponentValid) {
      const indexNumber = index + 1; // 給使用者看得流水號
      invalidComponentArr.push(indexNumber);
    }

    const { doorModelName, quantity } = stateProd.data_prod;
    totalQty_decimal.add(quantity || 0);

    !doorModelName && (isAllDoorModalValid = false);

    stateProd.data_prod.order = index;

    return stateProd;
  });

  const quotationProductArr = stateArr.map((stateProd) => formatProdStateToBody(stateProd));

  return {
    quotationProductArr,
    isAllDoorModalValid,
    invalidComponentArr,
    totalQty: totalQty_decimal.toNumber(),
  };
};

export { calcProductBody };
