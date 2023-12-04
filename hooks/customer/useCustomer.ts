import { useState, useEffect } from 'react';
import _ from 'lodash';

// type
import { Tcontact } from 'js/api/dtoTypes';
import { TpostCustomer, TcustomerDto_TC } from 'js/api/api_customer';

class Class_customer {
  constructor(reRender: () => void, customerOri: TcustomerDto_TC) {
    this._reRender = reRender;
    this._customerData = _.cloneDeep(customerOri);
    this._classContactArr = this._customerData.contacts.map(
      (contact) => new Class_customerContact(this._reRender, contact)
    );

    if (this._classContactArr.length === 0) {
      this._classContactArr.push(new Class_customerContact(this._reRender));
    }

    this._typesArr = this._customerData.types.map((type) => type.name);
  }
  private _reRender;
  private _customerData;
  private _classContactArr;
  private _typesArr;

  get classContactArr() {
    return this._classContactArr;
  }
  addContact = () => {
    this._classContactArr.push(new Class_customerContact(this._reRender));
    this._reRender();
  };
  removeContact = (index: number) => {
    this._classContactArr.splice(index, 1);
    this._reRender();
  };

  get typeArr() {
    return this._typesArr;
  }
  addType = (v: TpostCustomer['types'][number]) => {
    this._typesArr.push(v);
    this._reRender();
  };
  removeType = (index: number) => {
    console.log(this);
    this._typesArr.splice(index, 1);
    this._reRender();
  };

  get customerNumber() {
    return this._customerData.customerNumber;
  }

  get name() {
    return this._customerData.name;
  }
  set name(v: string) {
    this._customerData.name = v;
    this._reRender();
  }
  get nickname() {
    return this._customerData.nickname;
  }
  set nickname(v: string) {
    this._customerData.nickname = v;
    this._reRender();
  }
  get principal() {
    return this._customerData.principal;
  }
  set principal(v: string) {
    this._customerData.principal = v;
    this._reRender();
  }
  get taxDeductionCategory() {
    return this._customerData.taxDeductionCategory;
  }
  set taxDeductionCategory(v: string) {
    this._customerData.taxDeductionCategory = v;
    this._reRender();
  }
  get taxId() {
    return this._customerData.taxId;
  }
  set taxId(v: string) {
    this._customerData.taxId = v;
    this._reRender();
  }
  get phone() {
    return this._customerData.phone;
  }
  set phone(v: string) {
    this._customerData.phone = v;
    this._reRender();
  }
  get fax() {
    return this._customerData.fax;
  }
  set fax(v: string) {
    this._customerData.fax = v;
    this._reRender();
  }
  get county() {
    return this._customerData.county;
  }
  set county(v: string) {
    this._customerData.county = v;
    this._reRender();
  }
  get district() {
    return this._customerData.district;
  }
  set district(v: string) {
    this._customerData.district = v;
    this._reRender();
  }
  get address() {
    return this._customerData.address;
  }
  set address(v: string) {
    this._customerData.address = v;
    this._reRender();
  }
  get invoiceCounty() {
    return this._customerData.invoiceCounty;
  }
  set invoiceCounty(v: string) {
    this._customerData.invoiceCounty = v;
    this._reRender();
  }
  get invoiceDistrict() {
    return this._customerData.invoiceDistrict;
  }
  set invoiceDistrict(v: string) {
    this._customerData.invoiceDistrict = v;
    this._reRender();
  }
  get invoiceAddress() {
    return this._customerData.invoiceAddress;
  }
  set invoiceAddress(v: string) {
    this._customerData.invoiceAddress = v;
    this._reRender();
  }

  get postBody(): TpostCustomer {
    return {
      ...this._customerData,
      customerNumber: undefined,
      types: this._typesArr,
    };
  }
} // Class_customer

class Class_customerContact {
  constructor(reRender: () => void, contact?: TcustomerDto_TC['contacts'][number]) {
    this._reRender = reRender;
    this._contact = contact ?? { name: '', phone: '' };
  } // constructor
  private _reRender;
  private _contact: TpostCustomer['contacts'][number];

  get name() {
    return this._contact.name;
  }
  set name(v: string) {
    this._contact.name = v;
    this._reRender();
  }
  get phone() {
    return this._contact.phone;
  }
  set phone(v: string) {
    this._contact.phone = v;
    this._reRender();
  }

  get postBody() {
    return {
      id: this._contact.id,
      name: this._contact.name,
      phone: this._contact.phone,
    };
  }
} // Class_customerContacts

const useClassCustomer = (customerData?: TcustomerDto_TC | undefined) => {
  const [render, setRender] = useState(0);
  const reRender = () => setRender((state) => state + 1);
  const [classCustomer, setClassCustomer] = useState(new Class_customer(reRender, emptyCustomer()));
  useEffect(() => {
    if (customerData) {
      setClassCustomer(new Class_customer(reRender, customerData));
    }
  }, [customerData]);

  return classCustomer;
};

export { useClassCustomer, Class_customer };
export type { TcustomerDto_TC, Tcontact, TpostCustomer };

const emptyCustomer = (): TcustomerDto_TC => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  customerNumber: '',
  name: '',
  nickname: '',
  principal: '',
  taxDeductionCategory: '',
  taxId: '',
  phone: '',
  fax: '',
  county: '',
  district: '',
  address: '',
  invoiceCounty: '',
  invoiceDistrict: '',
  invoiceAddress: '',
  contacts: [],
  types: [],
});
