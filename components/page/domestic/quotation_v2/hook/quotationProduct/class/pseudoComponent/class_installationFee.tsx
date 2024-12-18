import { Class_distributionBox } from './class_distributionBox';

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
    this.render();
  }

  get price() {
    return this.data.installationFeePrice;
  }
  set price(v) {
    this.data.installationFeePrice = v;
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
}

export { Class_installationFee };
