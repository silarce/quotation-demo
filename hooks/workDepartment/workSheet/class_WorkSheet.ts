// type
import { TquotationProductDto } from 'js/api/dtoTypes';

class Class_workSheet {
  constructor({
    forceUpdate,
    prod,
  }: {
    //
    forceUpdate: () => void;
    prod: TquotationProductDto;
  }) {
    this.forceUpdate = forceUpdate;
    this._prod = prod;
  } //  constructor close

  // ---------------------------------------------------------------------

  private _prod;
  private forceUpdate;

  // ---------------------------------------------------------------------

  get rootProductId() {
    return this._prod.rootProductId;
  }
  //
  //
  get itemName() {
    return this._prod.itemName;
  }
  set itemName(str) {
    this._prod.itemName = str;
    this.forceUpdate();
  }

  get doorModelName() {
    return this._prod.doorModelName;
  }
  set doorModelName(str) {
    this._prod.doorModelName = str;
    this.forceUpdate();
  }

  get fullWidth() {
    return String(this._prod.fullWidth);
  }
  set fullWidth(str) {
    this._prod.fullWidth = Number(str);
    this.forceUpdate();
  }

  get height() {
    return String(this._prod.height);
  }
  set height(str) {
    this._prod.height = Number(str);
    this.forceUpdate();
  }

  get boxB() {
    return String(this._prod.boxB);
  }
  set boxB(str) {
    this._prod.boxB = Number(str);
    this.forceUpdate();
  }

  get quantity() {
    return String(this._prod.quantity);
  }
  set quantity(str) {
    this._prod.quantity = Number(str);
    this.forceUpdate();
  }

  get materialName() {
    return this._prod.materialName;
  }
  set materialName(str) {
    this._prod.materialName = str;
    this.forceUpdate();
  }

  get isAntiTyphoon() {
    return this._prod.isAntiTyphoon;
  }
  set isAntiTyphoon(str) {
    this._prod.isAntiTyphoon = str;
    this.forceUpdate();
  }
  //
} // Class_workSheet close

export { Class_workSheet as Class_workSheet };
