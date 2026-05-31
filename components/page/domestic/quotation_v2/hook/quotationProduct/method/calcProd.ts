import Decimal from 'decimal.js';
import _ from 'lodash';

import type { TstateProd, TstateProdDict } from '../type';
import type { TprodSource } from '../useQuotationProduct';
import type { XOR } from 'ts-essentials';

// MARK:calcProdTotalPrice
const calcProdTotalPrice = ({
  stateProd,
  quotationDiscount,
}: {
  stateProd: TstateProd;
  quotationDiscount: `${number}` | number | '';
}) => {
  const { isCustomPrice, data_prod, data_componentDict, data_accessoryDict } = stateProd;

  const priceDiscount_percent = calcPriceDiscount_percent({
    prodDiscount: (data_prod.discount || 0) as `${number}` | 0,
    quotationDiscount: quotationDiscount || 0,
  });

  if (isCustomPrice) {
    const { quantity, price } = data_prod;
    const dualPrice = new Decimal(price || 0).mul(quantity || 0).toNumber();
    const unitPrice = new Decimal(price || 0).mul(priceDiscount_percent).toDecimalPlaces(0).toNumber();
    const totalPrice = new Decimal(unitPrice)
      .mul(quantity || 0)
      .toDecimalPlaces(0)
      .toNumber();

    return {
      price: `${price}` as `${number}`,
      dualPrice: `${dualPrice}` as `${number}`,
      unitPrice: `${unitPrice}` as `${number}`,
      totalPrice: `${totalPrice}` as `${number}`,
    };
  }

  const { quantity } = data_prod;

  let dualPriceTotal_acce_decimal = new Decimal(0);
  let totalPriceTotal_acce_decimal = new Decimal(0);
  let dualPriceTotal_com_decimal = new Decimal(0);
  let totalPriceTotal_com_decimal = new Decimal(0);

  Object.values(data_accessoryDict).forEach((acce) => {
    dualPriceTotal_acce_decimal = dualPriceTotal_acce_decimal.add(acce.dualPrice || 0);
    totalPriceTotal_acce_decimal = totalPriceTotal_acce_decimal.add(acce.totalPrice || 0);
  });

  Object.values(data_componentDict).forEach((component) => {
    if (!component) {
      return;
    }

    const { quantity: q, price } = component;
    const { dualPrice, totalPrice } = calcAllPrice({
      price: price || 0,
      quantity: q || 0,
      priceDiscount_percent,
    });
    dualPriceTotal_com_decimal = dualPriceTotal_com_decimal.add(dualPrice);
    totalPriceTotal_com_decimal = totalPriceTotal_com_decimal.add(totalPrice);
  });

  const price = new Decimal(0).add(dualPriceTotal_acce_decimal).add(dualPriceTotal_com_decimal).toNumber();

  const dualPrice = new Decimal(price).mul(quantity || 0).toNumber();

  const unitPrice = new Decimal(0).add(totalPriceTotal_acce_decimal).add(totalPriceTotal_com_decimal).toNumber();

  const totalPrice = new Decimal(unitPrice).mul(quantity || 0).toNumber();

  return {
    price: `${price}` as `${number}`,
    dualPrice: `${dualPrice}` as `${number}`,
    unitPrice: `${unitPrice}` as `${number}`,
    totalPrice: `${totalPrice}` as `${number}`,
  };
};

// MARK:calcAndRenewAllProdPrice_sideEffect
const calcAndRenewAllProdPrice_sideEffect = ({
  prodDict,
  quotationDiscount,
}: {
  prodDict: TstateProdDict;
  quotationDiscount: `${number}` | '';
}) => {
  Object.values(prodDict).forEach((stateProd) => {
    stateProd.renderCount = (stateProd.renderCount ?? 0) + 1;
    const { data_prod, data_componentDict, data_accessoryDict } = stateProd;
    const priceDiscount_percent = calcPriceDiscount_percent({
      prodDiscount: (data_prod.discount || 0) as `${number}` | 0,
      quotationDiscount: quotationDiscount || 0,
    });

    Object.entries(data_componentDict).forEach(([_key, com]) => {
      const key = _key as keyof typeof data_componentDict;
      const theComponent = data_componentDict[key];

      if (!theComponent) {
        return;
      }

      const { unitPrice, totalPrice } = calcAllPrice({
        price: com!.price || 0,
        quantity: com!.quantity || 0,
        priceDiscount_percent,
      });
      theComponent.unitPrice = unitPrice;
      theComponent.totalPrice = totalPrice;
      theComponent.renderCount = (theComponent.renderCount ?? 0) + 1;
    });

    Object.entries(data_accessoryDict).forEach(([key, acce]) => {
      const copy = { ...acce };
      const { quantity, price } = copy;
      const { unitPrice, totalPrice } = calcAllPrice({
        price: price || 0,
        quantity: quantity || 0,
        priceDiscount_percent,
      });
      copy.unitPrice = `${unitPrice}` as `${number}`;
      copy.totalPrice = `${totalPrice}` as `${number}`;
      data_accessoryDict[key] = copy;
    });

    const { price, dualPrice, unitPrice, totalPrice } = calcProdTotalPrice({
      stateProd,
      quotationDiscount,
    });

    data_prod.price = price;
    data_prod.dualPrice = dualPrice;
    data_prod.unitPrice = unitPrice;
    data_prod.totalPrice = totalPrice;
  });

  return prodDict;
};

const calcAndRenewAllProdPrice = ({
  prodDict,
  quotationDiscount,
}: {
  prodDict: TstateProdDict;
  quotationDiscount: `${number}` | '';
}) => {
  return calcAndRenewAllProdPrice_sideEffect({ prodDict: _.cloneDeep(prodDict), quotationDiscount });
};

// MARK:calcAllPrice
const calcAllPrice = ({
  price,
  quantity,
  priceDiscount_percent,
}: {
  price: number | `${number}`;
  quantity: number | `${number}`;
  priceDiscount_percent: number | `${number}`;
}) => {
  const dualPrice = new Decimal(price || 0).mul(quantity).toDecimalPlaces(0).toNumber();
  const unitPrice = new Decimal(price || 0).mul(priceDiscount_percent).toDecimalPlaces(0).toNumber();
  const totalPrice = new Decimal(unitPrice)
    .mul(quantity || 0)
    .toDecimalPlaces(0)
    .toNumber();

  return { price, dualPrice, unitPrice, totalPrice };
};

// MARK:calcPriceDiscount_percent
const calcPriceDiscount_percent = ({
  prodDiscount,
  quotationDiscount,
}: {
  prodDiscount: `${number}` | '' | number;
  quotationDiscount: `${number}` | '' | number;
}) => {
  const prodDiscount_percent = new Decimal(prodDiscount || 0).div(100).toNumber();
  const quotationDiscount_percent = new Decimal(quotationDiscount || 0).div(100).toNumber();

  return new Decimal(prodDiscount_percent).mul(quotationDiscount_percent).toNumber();
};

// MARK:calcProdAllTotal
function calcProdAllTotal({ state_prodDict }: { state_prodDict: TstateProdDict }) {
  let total_d = new Decimal(0);
  Object.values(state_prodDict).forEach((prod) => {
    total_d = total_d.add(prod.data_prod.totalPrice || 0);
  });

  return total_d.toNumber();
}

const calcQtyModify = ({ modifyedProduct }: { modifyedProduct: TstateProd['modifyedProduct'] }) => {
  if (!modifyedProduct) {
    return 0;
  }

  return Object.values(modifyedProduct)
    .reduce((current, prod) => current.add((prod as any).quantity || 0), new Decimal(0))
    .toNumber();
};

const calcQtyReduceModified = ({ stateProd }: { stateProd: Pick<TstateProd, 'qty_reduce' | 'modifyedProduct'> }) => {
  const qty_reduce = Number(stateProd.qty_reduce || 0);
  const qty_modifyed = calcQtyModify({ modifyedProduct: stateProd.modifyedProduct });

  return new Decimal(qty_reduce).add(qty_modifyed).toNumber();
};

const calcProdRemain = ({ stateProd, prodSource }: XOR<{ stateProd: TstateProd }, { prodSource: TprodSource }>) => {
  let qty_reduce: number | `${number}` = 0;
  let modifyedProduct: any = {};
  let quantity: number | `${number}` = 0;

  if (stateProd) {
    qty_reduce = stateProd.qty_reduce || 0;
    modifyedProduct = stateProd.modifyedProduct;
    quantity = stateProd.data_prod.quantity || 0;
  } else if (prodSource) {
    const addition = prodSource.addition;
    qty_reduce = addition.qty_reduce || 0;
    modifyedProduct = addition.modifyedProduct || {};
    quantity = prodSource.quantity || 0;
  }

  const qty_modify = calcQtyModify({ modifyedProduct });

  return new Decimal(quantity || 0)
    .minus(qty_reduce || 0)
    .minus(qty_modify || 0)
    .toNumber();
};

const calcProdDeductedPrice = ({ stateProd }: { stateProd: TstateProd }) => {
  const { qty_reduce, modifyedProduct } = stateProd;
  const qty_modify = calcQtyModify({ modifyedProduct });
  const qty = new Decimal(qty_reduce || 0).add(qty_modify || 0);

  return new Decimal(stateProd.data_prod.unitPrice || 0).mul(qty).mul(-1).toNumber();
};

export {
  calcProdTotalPrice,
  calcAndRenewAllProdPrice_sideEffect,
  calcAndRenewAllProdPrice,
  calcAllPrice,
  calcPriceDiscount_percent,
  calcProdAllTotal,
  calcQtyModify,
  calcProdRemain,
  calcProdDeductedPrice,
  calcQtyReduceModified,
};
