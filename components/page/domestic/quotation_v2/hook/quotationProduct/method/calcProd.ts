import Decimal from 'decimal.js';

import type { TstateProd, TstateProdDict, TstateComponentData } from '../type';

// MARK:calcProdTotalPrice
const calcProdTotalPrice = ({
  stateProd,
  quotationDiscount,
}: {
  stateProd: TstateProd;
  quotationDiscount: `${number}` | number | ''; // 必須是已經除過100的數字，也就是0.52這類
}) => {
  const { isCustomPrice, data_prod, data_componentDict, data_accessoryDict } = stateProd;

  const priceDiscount_percent = calcPriceDiscount_percent({
    prodDiscount: (data_prod.discount || 0) as `${number}` | 0,
    quotationDiscount: quotationDiscount || 0,
  });

  // ___________________________________________________________________
  // ___________________________________________________________________
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
  // ___________________________________________________________________
  // ___________________________________________________________________

  const { quantity } = data_prod;

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

    const {
      dualPrice,
      //  unitPrice,
      totalPrice,
    } = calcAllPrice({
      price: price || 0,
      quantity: quantity || 0,
      priceDiscount_percent,
    });

    dualPriceTotal_com_decimal = dualPriceTotal_com_decimal.add(dualPrice);
    totalPriceTotal_com_decimal = totalPriceTotal_com_decimal.add(totalPrice);
  });

  // ___________________________________________________________________
  // ___________________________________________________________________

  // dual
  const price = new Decimal(0) // 沒有折扣過的價格
    .add(data_prod.distributionBoxDualPrice || 0)
    .add(data_prod.installationFeeDualPrice || 0)
    .add(dualPriceTotal_acce_decimal)
    .add(dualPriceTotal_com_decimal)
    .toNumber();

  const dualPrice = new Decimal(price).mul(quantity || 0).toNumber();

  // total
  const unitPrice = new Decimal(0)
    .add(data_prod.distributionBoxTotalPrice || 0)
    .add(data_prod.installationFeeTotalPrice || 0)
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

// MARK:calcAndRenewAllProdPrice_sideEffect
// 注意，有副作用，會直接修改prodDict的內容
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

    const { distributionBoxQuantity, distributionBoxPrice, installationFeeQuantity, installationFeePrice } = data_prod;

    const priceDiscount_percent = calcPriceDiscount_percent({
      prodDiscount: (data_prod.discount || 0) as `${number}` | 0,
      quotationDiscount: quotationDiscount || 0,
    });

    // ___________________________________________________________________
    // ___________________________________________________________________

    Object.entries(data_componentDict).forEach(([_key, com]) => {
      const key = _key as keyof typeof data_componentDict;

      const theComponent = data_componentDict[key];

      if (!theComponent) {
        return;
      }

      const {
        //  dualPrice,
        unitPrice,
        totalPrice,
      } = calcAllPrice({
        price: com.price || 0,
        quantity: com.quantity || 0,
        priceDiscount_percent,
      });

      // theComponent.dualPrice = dualPrice;
      theComponent.unitPrice = unitPrice;
      theComponent.totalPrice = totalPrice;
      theComponent.renderCount = (theComponent.renderCount ?? 0) + 1;
    });

    // ___________________________________________________________________
    // ___________________________________________________________________

    Object.entries(data_accessoryDict).forEach(([key, acce]) => {
      const copy = { ...acce };
      const { quantity, price } = copy;

      const {
        // dualPrice,
        unitPrice,
        totalPrice,
      } = calcAllPrice({
        price: price || 0,
        quantity: quantity || 0,
        priceDiscount_percent,
      });

      // copy.dualPrice = `${dualPrice}` as `${number}`;
      copy.unitPrice = `${unitPrice}` as `${number}`;
      copy.totalPrice = `${totalPrice}` as `${number}`;

      data_accessoryDict[key] = copy;
    });

    // ___________________________________________________________________
    // ___________________________________________________________________

    const { distributionBoxUnitPrice, distributionBoxTotalPrice, installationFeeUnitPrice, installationFeeTotalPrice } =
      calcProdDistributionBoxAndInstallationFee({
        stateProd,
        priceDiscount_percent,
      });

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

// MARK:calcAllPrice
const calcAllPrice = ({
  price,
  quantity,
  priceDiscount_percent,
}: {
  price: number | `${number}`;
  quantity: number | `${number}`;
  priceDiscount_percent: number | `${number}`; // 浮點數
}) => {
  const dualPrice = new Decimal(price || 0).mul(quantity).toNumber();
  const unitPrice = new Decimal(price || 0).mul(priceDiscount_percent).toDecimalPlaces(0).toNumber();
  const totalPrice = new Decimal(unitPrice)
    .mul(quantity || 0)
    .toDecimalPlaces(0)
    .toNumber();

  return {
    price,
    dualPrice,
    unitPrice,
    totalPrice,
  };
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

  return new Decimal(prodDiscount_percent).mul(quotationDiscount_percent).toDecimalPlaces(3).toNumber();
};

// MARK:calcProdDistributionBoxAndInstallationFee
const calcProdDistributionBoxAndInstallationFee = ({
  stateProd,
  priceDiscount_percent,
}: {
  stateProd: TstateProd;
  priceDiscount_percent: number | `${number}`;
}) => {
  const {
    data_prod: { distributionBoxPrice, distributionBoxQuantity, installationFeePrice, installationFeeQuantity },
  } = stateProd;

  const distributionBoxUnitPrice = new Decimal(distributionBoxPrice || 0)
    .mul(priceDiscount_percent)
    .toString() as `${number}`;
  const distributionBoxTotalPrice = new Decimal(distributionBoxUnitPrice)
    .mul(distributionBoxQuantity || 0)
    .toString() as `${number}`;

  const installationFeeUnitPrice = new Decimal(installationFeePrice || 0)
    .mul(priceDiscount_percent)
    .toString() as `${number}`;
  const installationFeeTotalPrice = new Decimal(installationFeeUnitPrice)
    .mul(installationFeeQuantity || 0)
    .toString() as `${number}`;

  return {
    distributionBoxUnitPrice,
    distributionBoxTotalPrice,
    installationFeeUnitPrice,
    installationFeeTotalPrice,
  };
};

// ========================================================================
export {
  calcProdTotalPrice,
  calcAndRenewAllProdPrice_sideEffect,
  calcAllPrice,
  calcPriceDiscount_percent,
  calcProdDistributionBoxAndInstallationFee,
};
