import Decimal from 'decimal.js';
import { TstateProdDict } from '../type';

import { calcPriceDiscount_percent, calcQtyModify, calcQtyReduceModified } from './calcProd';

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
    prodDiscountTotal_d = prodDiscountTotal_d.add(new Decimal(priceDiscount_percent || 0).mul(quantity || 0));

    doorModelSummery_d[doorModelName] ??= {
      doorModel: doorModelName,
      quantity: new Decimal(0),
      discountTotal: new Decimal(0),
    };

    doorModelSummery_d[doorModelName].quantity = doorModelSummery_d[doorModelName].quantity.add(quantity || 0);

    const subDiscountTotal = new Decimal(priceDiscount_percent).mul(quantity || 0);

    doorModelSummery_d[doorModelName].discountTotal =
      doorModelSummery_d[doorModelName].discountTotal.add(subDiscountTotal);
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

const calcDoorModelSummery_reduceModified = ({ state_prodDict }: { state_prodDict: TstateProdDict }) => {
  const reduceModifiedProdArr = Object.values(state_prodDict).filter((stateProd) => {
    return !!calcQtyReduceModified({ stateProd });
  });

  const itemDict: Record<string, TdoorModelSummeryItem_d> = {};

  reduceModifiedProdArr.forEach((stateProd) => {
    const {
      quotationDiscount_iterativeProd,
      data_prod: { discount, doorModelName },
    } = stateProd;

    const reduceModifiedQty = calcQtyReduceModified({ stateProd });
    const priceDiscount_percent = calcPriceDiscount_percent({
      prodDiscount: discount || 0,
      quotationDiscount: quotationDiscount_iterativeProd || 0,
    });

    if (!itemDict[doorModelName]) {
      itemDict[doorModelName] = {
        doorModel: doorModelName,
        quantity: new Decimal(0),
        discountTotal: new Decimal(0),
      };
    }

    const item = itemDict[doorModelName];
    item.quantity = item.quantity.add(reduceModifiedQty);
    const discountTotal = item.quantity.mul(priceDiscount_percent);
    item.discountTotal = item.discountTotal.add(discountTotal);
  });

  const doorModelSummery = Object.values(itemDict).map((item) => {
    const avgDiscount = item.discountTotal.div(item.quantity).mul(100).toDecimalPlaces(3).toNumber();
    const summery: TdoorModelSummeryItem = {
      doorModel: item.doorModel,
      quantity: item.quantity.mul(-1).toNumber(),
      avgDiscount: avgDiscount,
    };

    return summery;
  });

  return doorModelSummery;
};

export { calcProdSummary, calcDoorModelSummery_reduceModified as doorModelSummery_reduceModified };
export type { TdoorModelSummeryItem };
