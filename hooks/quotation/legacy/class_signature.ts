import { TemptyLegacyContract, TlegacyContractDto, TreRender } from './useLegacyContract';

class Class_signature {
  constructor(reRender: TreRender, legacyContract: TlegacyContractDto | TemptyLegacyContract) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
  }
  private _reRender;
  private _legacyContract;

  // // 經理
  // get managerName() {
  //   return this._legacyContract.managerName;
  // }
  // set managerName(v: string) {
  //   this._legacyContract.managerName = v;
  //   this._reRender();
  // }

  // // 主管
  // get supervisorName() {
  //   return this._legacyContract.supervisorName;
  // }
  // set supervisorName(v: string) {
  //   this._legacyContract.supervisorName = v;
  //   this._reRender();
  // }

  // // 經辦人
  // get operatorName() {
  //   return this._legacyContract.operatorName;
  // }
  // set operatorName(v: string) {
  //   this._legacyContract.operatorName = v;
  //   this._reRender();
  // }
}

export { Class_signature };
