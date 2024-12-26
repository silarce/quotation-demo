import Decimal from 'decimal.js';

import type { TstateProd, TstateProdDict } from '../type';

const calcProdTotalPrice = ({
  stateProd,
  quotationDiscount,
}: {
  stateProd: TstateProd;
  quotationDiscount: `${number}` | number | '';
}) => {
  const { data_prod, data_componentDict, data_accessoryDict } = stateProd;

  const { quantity } = data_prod;

  const prodDiscount = new Decimal(data_prod.discount || 0).div(100).toNumber();
  const discount = new Decimal(quotationDiscount).mul(prodDiscount).toNumber();

  let dualPriceTotal_acce_decimal = new Decimal(0);
  let totalPriceTotal_acce_decimal = new Decimal(0);

  let dualPriceTotal_com_decimal = new Decimal(0);
  let totalPriceTotal_com_decimal = new Decimal(0);

  // ___________________________________________________________________
  // ___________________________________________________________________

  Object.entries(data_accessoryDict).forEach(([key, acce]) => {
    const copy = { ...acce };
    const { dualPrice, totalPrice } = copy;

    dualPriceTotal_acce_decimal = dualPriceTotal_acce_decimal.add(dualPrice);
    totalPriceTotal_acce_decimal = totalPriceTotal_acce_decimal.add(totalPrice);
  });

  Object.values(data_componentDict).forEach((component) => {
    const { quantity, price } = component;
    const dualPrice = new Decimal(price || 0).mul(quantity).toString();
    const unitPrice = new Decimal(price || 0).mul(discount).toString();
    const totalPrice = new Decimal(unitPrice).mul(quantity || 0).toString();

    dualPriceTotal_com_decimal = dualPriceTotal_com_decimal.add(dualPrice);
    totalPriceTotal_com_decimal = totalPriceTotal_com_decimal.add(totalPrice);
  });

  // ___________________________________________________________________
  // ___________________________________________________________________

  // dual
  const price = new Decimal(0) // 沒有折扣過的價格
    .add(data_prod.distributionBoxDualPrice)
    .add(data_prod.installationFeeDualPrice)
    .add(dualPriceTotal_acce_decimal)
    .add(dualPriceTotal_com_decimal)
    .toNumber();

  const dualPrice = new Decimal(price).mul(quantity || 0).toNumber();

  // total
  const unitPrice = new Decimal(0)
    .add(data_prod.distributionBoxTotalPrice)
    .add(data_prod.installationFeeTotalPrice)
    .add(totalPriceTotal_acce_decimal)
    .add(totalPriceTotal_com_decimal)
    .toNumber();

  const totalPrice = new Decimal(unitPrice).mul(quantity || 0).toNumber();

  return {
    price: `${price}` as `${number}`,
    dualPrice: `${dualPrice}` as `${number}`,
    unitPrice: `${unitPrice}` as `${number}`,
    totalPrice: `${totalPrice}` as `${number}`,
  };
};

// 注意，有副作用，會直接修改prodDict的內容
const calcAndRenewAllProdPrice_sideEffect = ({
  prodDict,
  quotationDiscount: _quotationDiscount,
}: {
  prodDict: TstateProdDict;
  quotationDiscount: `${number}` | '';
}) => {
  const quotationDiscount = new Decimal(_quotationDiscount || 0).div(100).toNumber();

  Object.values(prodDict).forEach((stateProd) => {
    stateProd.renderCount = (stateProd.renderCount ?? 0) + 1;

    const {
      data_prod,

      data_accessoryDict,
    } = stateProd;

    const { distributionBoxQuantity, distributionBoxPrice, installationFeeQuantity, installationFeePrice } = data_prod;

    const prodDiscount = new Decimal(data_prod.discount || 0).div(100).toNumber();
    const discount = new Decimal(quotationDiscount).mul(prodDiscount).toNumber();

    // ___________________________________________________________________
    // ___________________________________________________________________

    Object.entries(data_accessoryDict).forEach(([key, acce]) => {
      const copy = { ...acce };
      const { quantity, price } = copy;

      const unitPrice = new Decimal(price || 0).mul(discount).toDecimalPlaces().toString();
      const totalPrice = new Decimal(unitPrice).mul(quantity || 0).toString();

      copy.unitPrice = unitPrice as `${number}`;
      copy.totalPrice = totalPrice as `${number}`;

      data_accessoryDict[key] = copy;
    });

    // ___________________________________________________________________
    // ___________________________________________________________________

    const distributionBoxUnitPrice = new Decimal(distributionBoxPrice || 0).mul(discount).toString() as `${number}`;
    const distributionBoxTotalPrice = new Decimal(distributionBoxUnitPrice)
      .mul(distributionBoxQuantity || 0)
      .toString() as `${number}`;

    const installationFeeUnitPrice = new Decimal(installationFeePrice || 0).mul(discount).toString() as `${number}`;
    const installationFeeTotalPrice = new Decimal(installationFeeUnitPrice)
      .mul(installationFeeQuantity || 0)
      .toString() as `${number}`;

    data_prod.distributionBoxUnitPrice = distributionBoxUnitPrice;
    data_prod.distributionBoxTotalPrice = distributionBoxTotalPrice;

    data_prod.installationFeeUnitPrice = installationFeeUnitPrice;
    data_prod.installationFeeTotalPrice = installationFeeTotalPrice;

    // ___________________________________________________________________
    // ___________________________________________________________________

    const { price, dualPrice, unitPrice, totalPrice } = calcProdTotalPrice({
      stateProd,
      quotationDiscount,
    });

    data_prod.price = price;
    data_prod.dualPrice = dualPrice;
    data_prod.unitPrice = unitPrice;
    data_prod.totalPrice = totalPrice;
  });

  // ___________________________________________________________________
  // ___________________________________________________________________

  return prodDict;
};

// ========================================================================
export { calcProdTotalPrice, calcAndRenewAllProdPrice_sideEffect };
