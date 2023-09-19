import { TlegacyContractDto } from 'js/api/dtoTypes';

import { TemptyLegacyContract, TreRender } from './useLegacyContract';

class Class_basicInfo {
  constructor(reRender: TreRender, legacyContract: TlegacyContractDto | TemptyLegacyContract) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
    this._legacyContract.quoteDate = (() => {
      if (!this._legacyContract.quoteDate) {
        return '';
      }

      // const quoteDate = moment(this._legacyContract.quoteDate).format("YYYY-MM-DD")
      // return yearConversion_standardToCh(quoteDate ?? "", true)
      return this._legacyContract.quoteDate;
    })();
    this._legacyContract.deliveryDate = (() => {
      if (!this._legacyContract.deliveryDate) {
        return '';
      }

      // const deliveryDate = moment(this._legacyContract.deliveryDate).format("YYYY-MM-DD")
      // return yearConversion_standardToCh(deliveryDate ?? "", true)
      return this._legacyContract.deliveryDate;
    })();
  }

  private _reRender;
  private _legacyContract;

  get contractNumber() {
    return this._legacyContract.contractNumber;
  }
  set contractNumber(v) {
    this._legacyContract.contractNumber = v;
    this._reRender();
  }

  get quoteValidity() {
    return this._legacyContract.quoteValidity;
  }
  set quoteValidity(v) {
    this._legacyContract.quoteValidity = v;
    this._reRender();
  }

  get quoteDate() {
    return this._legacyContract.quoteDate;
  }
  set quoteDate(v) {
    this._legacyContract.quoteDate = v;
    this._reRender();
  }

  get projectName() {
    return this._legacyContract.projectName;
  }
  set projectName(v) {
    this._legacyContract.projectName = v;
    this._reRender();
  }

  get customerName() {
    return this._legacyContract.customerName;
  }
  set customerName(v) {
    this._legacyContract.customerName = v;
    this._reRender();
  }

  get contactPerson() {
    return this._legacyContract.contactPerson;
  }
  set contactPerson(v) {
    this._legacyContract.contactPerson = v;
    this._reRender();
  }

  get contactNumber() {
    return this._legacyContract.contactNumber;
  }
  set contactNumber(v) {
    this._legacyContract.contactNumber = v;
    this._reRender();
  }

  get faxNumber() {
    return this._legacyContract.faxNumber;
  }
  set faxNumber(v) {
    this._legacyContract.faxNumber = v;
    this._reRender();
  }

  get trackingStatus() {
    return this._legacyContract.trackingStatus;
  }
  set trackingStatus(v) {
    this._legacyContract.trackingStatus = v;
    this._reRender();
  }

  get projectProgress() {
    return this._legacyContract.projectProgress;
  }
  set projectProgress(v) {
    this._legacyContract.projectProgress = v;
    this._reRender();
  }

  get projectCity() {
    return this._legacyContract.projectCity;
  }
  set projectCity(v) {
    this._legacyContract.projectCity = v;
    this._reRender();
  }

  get projectDistrict() {
    return this._legacyContract.projectDistrict;
  }
  set projectDistrict(v) {
    this._legacyContract.projectDistrict = v;
    this._reRender();
  }

  get projectAddress() {
    return this._legacyContract.projectAddress;
  }
  set projectAddress(v) {
    this._legacyContract.projectAddress = v;
    this._reRender();
  }
}

export { Class_basicInfo };
