import { Class_distributionBox } from './class_distributionBox';

import { calcAllPrice } from '../../method/calcProd';

// MARK:Class_installationFee
class Class_installationFee extends Class_distributionBox {
  key = 'installationFee';
  name = '按裝及製造費用';
  unit = '㎡';

  get quantity() {
    return this.data.installationFeeQuantity;
  }
  set quantity(value) {
    this.data.installationFeeQuantity = value;
    this.renewAllPrice();

    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get price() {
    return this.data.installationFeePrice;
  }
  set price(v) {
    this.data.installationFeePrice = v;
    this.renewAllPrice();

    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get dualPrice() {
    return Number(this.data.installationFeeDualPrice || 0);
  }

  get unitPrice() {
    return Number(this.data.installationFeeUnitPrice || 0);
  }

  get totalPrice() {
    return Number(this.data.installationFeeTotalPrice || 0);
  }

  renewAllPrice() {
    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: this.data.installationFeePrice || 0,
      quantity: this.data.installationFeeQuantity || 0,
      priceDiscount_percent: this.classProd.priceDiscount_percent,
    });

    this.data.installationFeeDualPrice = `${dualPrice}`;
    this.data.installationFeeUnitPrice = `${unitPrice}`;
    this.data.installationFeeTotalPrice = `${totalPrice}`;
  }
}

export { Class_installationFee };
