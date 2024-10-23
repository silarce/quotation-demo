import { Moment } from 'moment';
import Decimal from 'decimal.js';

import { Tstate_detail, Interface_classState, Interface_classState_detail } from '../type';
import {
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
} from 'js/api/api_netCore/api_accountant';

class ClassState_detail implements Interface_classState_detail {
  state_datail;
  setState_detail;
  parent;
  constructor(
    //
    state_datail: Tstate_detail,
    setState_detail: (state_detail: Tstate_detail) => void,
    parent: Interface_classState
  ) {
    this.state_datail = state_datail;

    this.setState_detail = (state_detail: Tstate_detail) => {
      state_detail.updateCount = this.state_datail.updateCount + 1;
      setState_detail(state_detail);
    };

    this.parent = parent;
  } // constructor

  get identifyId() {
    return this.state_datail.identifyId;
  }

  get updateCount() {
    return this.state_datail.updateCount;
  }

  get item() {
    return this.state_datail.item;
  }
  set item(item: string) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      item: item,
    });
  }

  get prodreceipt_number() {
    return this.state_datail.prodreceipt_number;
  }

  get transaction_date() {
    return this.state_datail.transaction_date;
  }
  set transaction_date(date: Moment | null) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      transaction_date: date,
    });
  }

  get quantity() {
    return this.state_datail.quantity;
  }
  set quantity(value) {
    // this.countUpdate();

    const state_detail = {
      ...this.state_datail,
      quantity: value,
    };
    state_detail.amount = `${this.calcAmount(state_detail)}`;

    this.setState_detail(state_detail);
  }

  get unit() {
    return this.state_datail.unit;
  }
  set unit(unit: string) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      unit: unit,
    });
  }

  get unit_price() {
    return this.state_datail.unit_price;
  }
  set unit_price(price) {
    // this.countUpdate();

    const state_detail = {
      ...this.state_datail,
      unit_price: price,
    };
    state_detail.amount = `${this.calcAmount(state_detail)}`;

    this.setState_detail(state_detail);
  }

  get amount() {
    return this.state_datail.amount;
  }
  set amount(amount) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      amount: amount,
    });
  }

  get note() {
    return this.state_datail.note;
  }
  set note(note) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      note: note,
    });
  }

  get goods_spec() {
    return this.state_datail.goods_spec;
  }
  set goods_spec(spec) {
    // this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      goods_spec: spec,
    });
  }

  get reqBody() {
    const {
      id,
      prodreceipt_uuid,
      //
      item,
      goods_spec,
      unit_price,
      note,
      transaction_date,
    } = this.state_datail;

    const body: TcreatePurchaseCollectTicketDetail_Dto | TupdatePurchaseCollectTicketDetail_Dto = {
      detail_uuid: id,
      item: item,
      goods_spec: goods_spec,
      unit_price: unit_price || null,
      note: note,
      transaction_date: transaction_date?.toISOString() || null,
      prodreceipt_uuid,
    };

    return body;
  }

  // ------------------------------------------------------------
  // private countUpdate() {
  //   this.setState_detail({
  //     ...this.state_datail,
  //     updateCount: this.state_datail.updateCount + 1,
  //   });

  //   return this;
  // }

  // changeProdreceipt({ prodreceiptNumber, prodreceiptId }: { prodreceiptNumber: string; prodreceiptId: string }) {
  //   this.setState_detail({
  //     ...this.state_datail,
  //     prodreceipt_number: prodreceiptNumber,
  //     prodreceipt_uuid: prodreceiptId,
  //   });

  //   this.countUpdate();

  //   return this;
  // }

  private calcAmount(state_datail: Tstate_detail) {
    const { quantity, unit_price } = state_datail;
    const amount = new Decimal(quantity || 0).mul(unit_price || 0).toNumber();

    return amount;
  }

  deleteSelf() {
    this.parent.deleteDetail(this.identifyId);

    return this;
  }
} // ClassState_detail

export { ClassState_detail };
