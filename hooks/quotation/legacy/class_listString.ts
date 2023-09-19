import { TemptyLegacyContract, TlegacyContractDto, TreRender } from './useLegacyContract';

/**備註notes與報價範圍quoteScopes*/
class Class_listString {
  constructor(reRender: TreRender, stringArr: (TlegacyContractDto | TemptyLegacyContract)['notes' | 'quoteScopes']) {
    this._reRender = reRender;
    this.stringArr = stringArr;
  }

  private _reRender;
  stringArr;

  editString = (index: number, v: string) => {
    this.stringArr[index] = v;
    this._reRender();
  };
  addString = (v: string | string[]) => {
    if (typeof v === 'string') {
      this.stringArr.push(v);
    } else {
      this.stringArr = [...this.stringArr, ...v];
    }

    this._reRender();
  };
  delString = (index: number) => {
    this.stringArr.splice(index, 1);
    this._reRender();
  };
}

export { Class_listString };
