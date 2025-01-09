import Decimal from 'decimal.js';
import { TstateProdDict } from '../type';

import { calcPriceDiscount_percent } from './calcProd';

type TdoorModelSummeryItem = {
  doorModel: string;
  quantity: number;
  avgDiscount: number;
};

type TdoorModelSummeryItem_d = {
  doorModel: string;
  quantity: Decimal;
  discountTotal: Decimal;
};

const calcProdSummary = ({
  state_prodDict,
  state_quotationDiscount,
}: {
  state_prodDict: TstateProdDict;
  state_quotationDiscount: `${number}` | number;
}) => {
  // const state_prodDict = debounced_state_prodDict;

  let prodQty_d = new Decimal(0);
  let prodDiscountTotal_d = new Decimal(0);

  const doorModelSummery_d: Record<string, TdoorModelSummeryItem_d> = {};

  Object.values(state_prodDict).forEach((state) => {
    const { discount, quantity } = state.data_prod;
    let { doorModelName } = state.data_prod;
    doorModelName = doorModelName || '---';

    const priceDiscount_percent = calcPriceDiscount_percent({
      prodDiscount: discount || 0,
      quotationDiscount: state_quotationDiscount || 0,
    });

    prodQty_d = prodQty_d.add(quantity || 0);
    prodDiscountTotal_d = prodDiscountTotal_d.add(priceDiscount_percent);

    doorModelSummery_d[doorModelName] ??= {
      doorModel: doorModelName,
      quantity: new Decimal(0),
      discountTotal: new Decimal(0),
    };

    doorModelSummery_d[doorModelName].quantity = doorModelSummery_d[doorModelName].quantity.add(quantity || 0);
    doorModelSummery_d[doorModelName].discountTotal =
      doorModelSummery_d[doorModelName].discountTotal.add(priceDiscount_percent);
  });

  // page右下方的平均折數
  const isProdQtyValid = prodQty_d.toNumber();
  const avgDiscount = isProdQtyValid
    ? prodDiscountTotal_d.div(prodQty_d).mul(100).toDecimalPlaces(3).toNumber()
    : Number(state_quotationDiscount);

  // profile下的 門型彙總
  const doorModelSummery = Object.entries(doorModelSummery_d).reduce((doorModelSummery, [key, item]) => {
    const qty = item.quantity.toNumber();
    const avgDiscount_prod = item.discountTotal.div(item.quantity).mul(100).toDecimalPlaces(3).toNumber();

    doorModelSummery[key] = {
      doorModel: item.doorModel,
      quantity: qty,
      avgDiscount: avgDiscount_prod,
    };

    return doorModelSummery;
  }, {} as Record<string, TdoorModelSummeryItem>);

  //
  return { avgDiscount, doorModelSummery };
};

export { calcProdSummary };
export type { TdoorModelSummeryItem };
