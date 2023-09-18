import type { TreRender } from './useProduct';
import { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

class Class_accessory {
  constructor({
    //
    reRender,
    data,
  }: {
    reRender: TreRender;
    data: Taccessory;
  }) {
    this.reRender = reRender;
    this._data = data;
  } // constructor

  private reRender;
  private _data;
  // ---------------------------------------------------------
  get doorModelName() {
    return this._data.doorModelName;
  }
  set doorModelName(v) {
    this._data.doorModelName = v;
    this.reRender();
  }

  get code() {
    return this._data.code;
  }
  set code(v) {
    this._data.code = v;
    this.reRender();
  }

  get specialSpec() {
    return this._data.specialSpec;
  }
  set specialSpec(v) {
    this._data.specialSpec = v;
    this.reRender();
  }

  get price() {
    return this._data.price;
  }
  set price(v) {
    this._data.price = v;
    this.reRender();
  }

  get name() {
    return this._data.name;
  }
  set name(v) {
    this._data.name = v;
    this.reRender();
  }

  get isAntiTyphoon() {
    return this._data.isAntiTyphoon;
  }
  set isAntiTyphoon(v) {
    this._data.isAntiTyphoon = v;
    this.reRender();
  }

  get gearNumber() {
    return this._data.gearNumber;
  }
  set gearNumber(v) {
    this._data.gearNumber = v;
    this.reRender();
  }

  get motorVendor() {
    return this._data.motorVendor;
  }
  set motorVendor(v) {
    this._data.motorVendor = v;
    this.reRender();
  }

  get bearingType() {
    return this._data.bearingType;
  }
  set bearingType(v) {
    this._data.bearingType = v;
    this.reRender();
  }

  get thickness() {
    return this._data.thickness;
  }
  set thickness(v) {
    this._data.thickness = v;
    this.reRender();
  }

  get isIntegrated() {
    return this._data.isIntegrated;
  }
  set isIntegrated(v) {
    this._data.isIntegrated = v;
    this.reRender();
  }

  get isWaterProof() {
    return this._data.isWaterProof;
  }
  set isWaterProof(v) {
    this._data.isWaterProof = v;
    this.reRender();
  }

  get hasAluminumBarrier() {
    return this._data.hasAluminumBarrier;
  }
  set hasAluminumBarrier(v) {
    this._data.hasAluminumBarrier = v;
    this.reRender();
  }

  get hasSilencingStrip() {
    return this._data.hasSilencingStrip;
  }
  set hasSilencingStrip(v) {
    this._data.hasSilencingStrip = v;
    this.reRender();
  }

  get maxDoorWeight() {
    return this._data.maxDoorWeight;
  }
  set maxDoorWeight(v) {
    this._data.maxDoorWeight = v;
    this.reRender();
  }

  get minDoorWeight() {
    return this._data.minDoorWeight;
  }
  set minDoorWeight(v) {
    this._data.minDoorWeight = v;
    this.reRender();
  }

  get diameter() {
    return this._data.diameter;
  }
  set diameter(v) {
    this._data.diameter = v;
    this.reRender();
  }

  get horsePower() {
    return this._data.horsePower;
  }
  set horsePower(v) {
    this._data.horsePower = v;
    this.reRender();
  }

  get phase() {
    return this._data.phase;
  }
  set phase(v) {
    this._data.phase = v;
    this.reRender();
  }

  get voltage() {
    return this._data.voltage;
  }
  set voltage(v) {
    this._data.voltage = v;
    this.reRender();
  }

  get loadWeight() {
    return this._data.loadWeight;
  }
  set loadWeight(v) {
    this._data.loadWeight = v;
    this.reRender();
  }

  get hasSupportStand() {
    return this._data.hasSupportStand;
  }
  set hasSupportStand(v) {
    this._data.hasSupportStand = v;
    this.reRender();
  }

  get chains() {
    return this._data.chains;
  }
  set chains(v) {
    this._data.chains = v;
    this.reRender();
  }
} // Class_accessory

// ===========================================================

type Taccessory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
  name?: string; // TdoorMotorAccessoriesDto沒有name

  // ----------------------------------------------
  // 這邊是共有的property
  // TdoorSlatDto  TdoorBottomBarDto  TdoorGuideRailDto
  isAntiTyphoon?: boolean;

  // TdoorSidePlateDto  TdoorMotorDto
  gearNumber: string | null; // 鍊齒輪番號
  motorVendor: string | null; // 馬達廠商

  // TdoorSidePlateDto  TdoorMotorAccessoriesDto
  bearingType: string | null; // 軸承

  // TdoorGuideRailDto TdoorMotorAccessoriesDto
  thickness: string | null; // 厚度

  // TdoorSidePlateDto TdoorMotorAccessoriesDto
  isIntegrated: boolean | null; // 一體式捲箱

  // ----------------------------------------------
  // TdoorBottomBarDto
  isWaterProof: boolean;
  hasAluminumBarrier: boolean;

  // TdoorGuideRailDto
  /**消音條 */
  hasSilencingStrip: boolean; // 消音條

  //TdoorSidePlateDto
  /**一體式捲箱 */
  maxDoorWeight: number | null; // 最大門重量(kg)
  minDoorWeight: number | null; // 最小門重量(kg)

  // TdoorRollerDto
  /**直徑(inch) */
  diameter: string; // 直徑(inch)

  // TdoorMotorDto
  horsePower: string; // 馬力數
  phase: number | null; // 相位
  /**電壓(V) */
  voltage: number | null; // 電壓(V)
  /**荷重(kg) */
  loadWeight: number | null; // 荷重(kg)
  hasSupportStand: string | null; // 有腳

  // TdoorMotorAccessoriesDto
  // 沒有name
  /**鍊條排數 */
  chains: number; // 鍊條排數

  // TdoorMotorAccessoriesDto
  // 兩個property，都是共有property
  //
  //
}; //  Taccessory

// type TacceKey = keyof Taccessory;
type TacceKey = string;

const acceKeyArrOri: () => TacceKey[] = () => {
  return [];
};

const acceCellConfig: TcellConfig = {};

// ===========================================================

// ===========================================================
export { Class_accessory, acceKeyArrOri, acceCellConfig };
export type { Taccessory, TacceKey };

/**
 * get /products/door/models
 * 報價別下拉式選單用這個api給的name，其他都不要給人選
 * 下面這兩個是下拉式選單的選項
 * guideRails.withHook, 這是防颱勾 true必須有防颱才能選 false就是必須非防颱 null就是都可以
 * slatMaterials 這是門片材質(英文的意思不要管)
 *
 *
 * /products/door/calc-general-spec
 * 會用到的似乎只有weight與motors
 * defaultMotorIndex的意思是系統算出來最合適的馬達的index
 *
 * motors.box 裡面有default 東元 大同 如果只有default，那就是東元跟大同都可以，我自己隨便預設一個
 * 如果同時有東元與大同我自己隨便預設一個
 * 如果只有東元或只有大同，那就是東元或大同
 * motors.box..boxB就是 B(m)
 * 基本上只有defaultMotorIndex指定的motors.box會有boxB
 * boxD用不到先不管
 *
 * diameter就是卷軸直徑
 * 作為/products/door/available-components 的rollerDiameter引數
 *
 *
 *
 * /products/door/available-components
 * slats就是門片
 * botomBar底座
 *
 * sidePlates 這是支版
 * 軸承跟齒輪先跳過不判定
 *
 * motors.loadWeight 門重不可以大於這個值
 * phase與voltage 如果可以讓使用者選擇就要檢查
 * gearNumber先不管，理論上馬達的gearNumber要跟支版的gearNumber一樣
 *
 * bearingType對應calc-general-spec的bearing name
 *
 *
 *
 *
 */
