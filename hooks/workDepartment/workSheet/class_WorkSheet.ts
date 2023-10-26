import _ from 'lodash';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiGetQuotationProducts } from 'js/api/api_quotation';

// type
import { TquotationProductDto, TquotationProductItemDto, TquotationProductComponentsDto } from 'js/api/dtoTypes';

class Class_workSheet {
  constructor({
    forceUpdate,
    prod,
    itemIdArr, // itemIdArr裝的是被這個class代表的item的id，
    // 未來若分堆需求，oldProd可能會要是未被修改的資料
    // 這樣可以取父prod的oldProd放進來，prod則是父prod的資料
    oldProd = _.cloneDeep(prod),
  }: {
    //
    forceUpdate: () => void;
    prod: TquotationProductItemDto;
    itemIdArr: string[];
    oldProd?: TquotationProductItemDto;
  }) {
    this.forceUpdate = forceUpdate;
    this._prod = _.cloneDeep(prod);
    this.oldProd = oldProd;
    this.itemIdArr = itemIdArr;

    const comList: { [key: string]: TquotationProductComponentsDto } = {};

    this._prod.components.forEach((com) => {
      comList[com.type] = com;
    });

    this.comList = comList as { [key in TquotationProductComponentsDto['type']]: TquotationProductComponentsDto };
  } //  constructor close

  // ---------------------------------------------------------------------

  private _prod;
  private forceUpdate;
  private itemIdArr;
  readonly oldProd;
  // ---------------------------------------------------------------------

  private comList;

  // ---------------------------------------------------------------------

  // getWholeProduct() {
  //   const req = async () => {
  //     try {
  //       const res = await apiGetQuotationProducts(this._prod.id);

  //       if (res) {
  //         this._prod = res;
  //         this.forceUpdate();
  //       }
  //     } catch (error) {
  //       const err = error as Error;
  //       myAlert.err({ title: '取得產品資料失敗', content: err.message });
  //     }
  //   };

  //   return req();
  // }

  // ---------------------------------------------------------------------

  // get rootProductId() {
  //   return this._prod.rootProductId;
  // }
  get productId() {
    return this._prod.productId;
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
    return String(this.itemIdArr.length);
  }
  // set quantity(str) {
  //   this._prod.quantity = Number(str);
  //   this.forceUpdate();
  // }

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

  // -------------------------------------------------------

  // | 'slat'
  // | 'bottomBar'
  // | 'guideRail'
  // | 'sidePlate'
  // | 'roller'
  // | 'motor'
  // | 'motorAccessories'
  // | 'headBox';

  // 捲軸

  // TODO 尺寸
  private _com_roller_size = '999';
  get com_roller_size() {
    // return this.comList.roller.size;
    return this._com_roller_size;
  }
  set com_roller_size(str) {
    this._com_roller_size = str;
    this.forceUpdate();
  }
  // TODO 有無凸
  // 介面為無/有
  // 但是主產品為無凸/雙凸 // rollerSpec
  private _com_roller_spec = false;
  get com_roller_spec() {
    // return this.comList.roller.spec;
    return this._com_roller_spec;
  }
  set com_roller_spec(bool) {
    this._com_roller_spec = bool;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 捲箱

  // 材質
  get com_headBox_material() {
    return this.comList.headBox.material;
  }
  set com_headBox_material(str) {
    this.comList.headBox.material = str;
    this.forceUpdate();
  }

  // 厚度
  get headBoxThickness() {
    return String(this._prod.headBoxThickness);
  }
  set headBoxThickness(str) {
    this._prod.headBoxThickness = Number(str);
    this.forceUpdate();
  }

  // 表面
  get com_headBox_surface() {
    return this.comList.headBox.materialSurface;
  }
  set com_headBox_surface(str) {
    this.comList.headBox.materialSurface = str;
    this.forceUpdate();
  }

  // TODO 正面
  private _com_headBox_front = '無';
  get com_headBox_front() {
    // return this.comList.headBox.front;
    return this._com_headBox_front;
  }
  set com_headBox_front(str) {
    this._com_headBox_front = str;
    this.forceUpdate();
  }

  // TODO 有無凸
  private _com_headBox_spec = '無';
  get com_headBox_spec() {
    // return this.comList.headBox.spec;
    return this._com_headBox_spec;
  }
  set com_headBox_spec(str) {
    this._com_headBox_spec = str;
    this.forceUpdate();
  }

  // TODO 捲箱型式 在主產品是boolean
  private _com_headBox_type = '捲箱999';
  get com_headBox_type() {
    // return this.comList.headBox.type;
    return this._com_headBox_type;
  }
  set com_headBox_type(str) {
    this._com_headBox_type = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 底座

  // 材質
  get com_bottomBar_material() {
    return this.comList.bottomBar.material;
  }
  set com_bottomBar_material(str) {
    this.comList.bottomBar.material = str;
    this.forceUpdate();
  }

  // 角鐵材質
  get bottomBarAngleIron() {
    return this._prod.bottomBarAngleIron;
  }
  set bottomBarAngleIron(str) {
    this._prod.bottomBarAngleIron = str;
    this.forceUpdate();
  }

  // 底座板材質
  get bottomBarPlate() {
    return this._prod.bottomBarPlate;
  }
  set bottomBarPlate(str) {
    this._prod.bottomBarPlate = str;
    this.forceUpdate();
  }

  // 型式
  get bottomBar() {
    return this._prod.bottomBar;
  }
  set bottomBar(str) {
    this._prod.bottomBar = str;
    this.forceUpdate();
  }

  // TODO 表面
  private _com_bottomBar_surface = '無';
  get com_bottomBar_surface() {
    // return this.comList.bottomBar.surface;
    return this._com_bottomBar_surface;
  }
  set com_bottomBar_surface(str) {
    this._com_bottomBar_surface = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 支版
  get sidePlateTip() {
    return '馬達荷重(max:500,min:600),馬力數:2Hp';
  }

  // TODO 軸承
  private _com_sidePlate_bearing = '9999#';
  get com_sidePlate_bearing() {
    // return this.comList.sidePlate.bearing;
    return this._com_sidePlate_bearing;
  }
  set com_sidePlate_bearing(str) {
    this._com_sidePlate_bearing = str;
    this.forceUpdate();
  }

  // TODO 鍊條
  private _com_sidePlate_chain = '999#';
  get com_sidePlate_chain() {
    // return this.comList.sidePlate.chain;
    return this._com_sidePlate_chain;
  }
  set com_sidePlate_chain(str) {
    this._com_sidePlate_chain = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 門片 slat

  // 材質
  get com_slat_material() {
    return this.comList.slat.material;
  }
  set com_slat_material(str) {
    this.comList.slat.material = str;
    this.forceUpdate();
  }

  // 表面
  get com_slat_surface() {
    return this.comList.slat.materialSurface;
  }
  set com_slat_surface(str) {
    this.comList.slat.materialSurface = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 電動機 motor

  // 馬力數
  get horsepower() {
    return this._prod.horsepower;
  }
  set horsepower(str) {
    this._prod.horsepower = str;
    this.forceUpdate();
  }
  //廠商
  get motorVendor() {
    return this._prod.motorVendor;
  }
  set motorVendor(str) {
    this._prod.motorVendor = str;
    this.forceUpdate();
  }

  // 電供
  get motorPhase() {
    return String(this._prod.motorPhase);
  }
  set motorPhase(str) {
    this._prod.motorPhase = Number(str);
    this.forceUpdate();
  }

  // 電壓
  get motorVoltage() {
    return String(this._prod.motorVoltage);
  }
  set motorVoltage(str) {
    this._prod.motorVoltage = Number(str);
    this.forceUpdate();
  }

  // 支撐架
  get hasMotorSupportStand() {
    return this._prod.hasMotorSupportStand;
  }
  set hasMotorSupportStand(str) {
    this._prod.hasMotorSupportStand = str;
    this.forceUpdate();
  }

  // TODO 鍊條型式
  private _com_motor_chainType = '';
  get com_motor_chainType() {
    // return this.comList.motor.chain;
    return this._com_motor_chainType;
  }
  set com_motor_chainType(str) {
    this._com_motor_chainType = str;
    this.forceUpdate();
  }

  // 鎖盒
  get motorLockBox() {
    return this._prod.motorLockBox;
  }
  set motorLockBox(str) {
    this._prod.motorLockBox = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 門軌 guideRail

  // 材質
  get com_guideRail_material() {
    return this.comList.guideRail.material;
  }
  set com_guideRail_material(str) {
    this.comList.guideRail.material = str;
    this.forceUpdate();
  }

  // 厚度

  get guideRailThickness() {
    return String(this._prod.guideRailThickness);
  }
  set guideRailThickness(str) {
    this._prod.guideRailThickness = Number(str);
    this.forceUpdate();
  }

  // TODO 表面
  private _com_guideRail_surface = '無';
  get com_guideRail_surface() {
    // return this.comList.guideRail.surface;
    return this._com_guideRail_surface;
  }
  set com_guideRail_surface(str) {
    this._com_guideRail_surface = str;
    this.forceUpdate();
  }

  // 消音條
  get hasSilencingStrip() {
    return this._prod.hasSilencingStrip;
  }
  set hasSilencingStrip(str) {
    this._prod.hasSilencingStrip = str;
    this.forceUpdate();
  }

  // TODO 型式
  private _com_guideRail_type = '';
  get com_guideRail_type() {
    // return this.comList.guideRail.type;
    return this._com_guideRail_type;
  }
  set com_guideRail_type(str) {
    this._com_guideRail_type = str;
    this.forceUpdate();
  }

  // 型式02
  get guideRail() {
    return this._prod.guideRail;
  }
  set guideRail(str) {
    this._prod.guideRail = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  //
} // Class_workSheet close

export { Class_workSheet as Class_workSheet };
