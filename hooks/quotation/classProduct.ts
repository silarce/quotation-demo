import _, { set } from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';
import { optionsCreator_doorModel, optionsCreator_quoteType } from 'js/utils/options/productOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
// child class
import { Class_accessory, Taccessory } from './classAccessory';
// =============================================================================
// api
import { apiGetProdCalcGeneralSpec, apiGetProdAvailableComponents } from 'js/api/api_product';
// =============================================================================
// type
import type { TlegacyContractProductDto, TcreateLegacyContractProductDto } from 'js/api/dtoTypes';
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TdoorModelInfoDto } from 'js/api/api_product';
import type { TpcgsPrams, TpacParams, TdoorGeneralSpecsDto } from 'js/api/api_product';

// =============================================================================
class Class_product {
  constructor({
    reRender,
    prodData = emptyProdOri(),
    accessoryDataArr = [],
    delSelf,
    copySelf,
    // from api
    doorModelList,
  }: {
    reRender: TreRender;
    prodData?: Tprod;
    accessoryDataArr?: Taccessory[];
    delSelf: () => void;
    copySelf: () => void;
    // from api
    doorModelList: { [key: string]: TdoorModelInfoDto };
  }) {
    this.reRender = reRender;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    // from api
    this._doorModelList = doorModelList;
    //
    this._quantity = String(this._prodData.quantity);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);
    const motorVendor = this._prodData.motorVendor;
    this._motorVendor = motorVendor ? { value: motorVendor, label: motorVendor } : null;
    //
    // ___________________________________________________________
    accessoryDataArr.forEach((data, index) => {
      const id = index;

      // this._acceList[`${id}`] = new Class_accessory({
      //   reRender,
      //   delSelf,
      //   // copySelf,
      // });
    });
    // ___________________________________________________________
  } //  constructor close

  private reRender;
  readonly delSelf;
  readonly copySelf;
  // from api
  // 門型資料
  private _doorModelList;
  private _doorGeneralSpecs: TdoorGeneralSpecsDto | undefined;
  private _motorVendor: Toption | null;
  private _boxB: number | undefined;
  //
  private _prodData;
  private _quantity;
  private _unitPrice;
  private _totalPrice;

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;
  // ---------------------------------------------------------
  _acceList: { [key: string]: Taccessory } = {};
  get acceList() {
    return this._acceList;
  }

  // ---------------------------------------------------------

  // 防抖
  cgsTimeout: NodeJS.Timeout | null = null;
  pacTimeout: NodeJS.Timeout | null = null;

  req_calcGeneralSpec() {
    const req = async () => {
      if (!this.doorModel || !this.height) {
        return;
      }

      if (!this.length && !this.width) {
        return;
      }

      const res = await apiGetProdCalcGeneralSpec({
        modelName: this.doorModel as TpcgsPrams['modelName'],
        fullHeight: Number(this.height),
        // 要再跟後端或經理確認什麼是全寬
        fullWidth: Number(this.length), //  全寬
        WG: Number(this.width), // 全寬扣除機械縫
      });

      if (!res) {
        return;
      }

      //
      const defaultMotorIndex = res.defaultMotorIndex;
      const defaultMotor = res.motors[defaultMotorIndex];
      const defaultMotorBox = defaultMotor.box;
      // ________________________
      // 設定馬力
      this.horsepower = defaultMotor.hp;

      // ________________________
      // 設定boxB與thickness
      // 後端說boxB只會在defaultMotorIndex指定的motors裡面會有
      const boxB = defaultMotorBox?.default?.boxB || defaultMotorBox?.東元?.boxB || defaultMotorBox?.大同?.boxB;
      this._boxB = boxB;
      this.thickness = String(boxB || '');

      // ________________________
      // 設定馬達廠商
      if (defaultMotorBox) {
        if (defaultMotorBox.default) {
          this.motorVendor = creOption_teco();
        } else if (defaultMotorBox.東元) {
          this.motorVendor = creOption_teco();
        } else if (defaultMotorBox.大同) {
          this.motorVendor = creOption_datong();
        } else {
          this.motorVendor = null;
        }
      } else {
        this.motorVendor = null;
      }

      // ________________________

      // getProdAvailableComponent用的weight與rollerDiameter來自doorGeneralSpecs
      if (
        //
        this._doorGeneralSpecs?.weight !== res.weight ||
        this._doorGeneralSpecs?.diameter !== res.diameter
      ) {
        this._doorGeneralSpecs = res;
        this.req_getProdAvailableComponents();
      } else {
        this._doorGeneralSpecs = res;
      }

      this.reRender();
    }; // req

    if (this.cgsTimeout) {
      clearTimeout(this.cgsTimeout);
    }

    this.cgsTimeout = setTimeout(() => {
      req();
    }, 500);
  } // calcGeneralSpec

  req_getProdAvailableComponents() {
    const req = async () => {
      const rollerDiameter = this._doorGeneralSpecs?.diameter;

      if (!this.doorModel || !this.weight || !rollerDiameter) {
        return;
      }

      const res = await apiGetProdAvailableComponents({
        modelName: this.doorModel as TpacParams['modelName'],
        weight: this.weight,
        isAntiTyphoon: this.typhoonProtection,
        rollerDiameter: rollerDiameter,
      });

      if (!res) {
        return;
      }

      this.reRender();
    }; // req

    if (this.pacTimeout) {
      clearTimeout(this.pacTimeout);
    }

    setTimeout(() => {
      req();
    }, 500);
  } //  req_getProdAvailableComponents

  // ---------------------------------------------------------

  get weight() {
    return this._doorGeneralSpecs?.weight;
  }

  // ---------------------------------------------------------

  /**門型 options */
  get options_doorModel() {
    return Object.values(this._doorModelList).map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });
  }

  /**門軌 options */
  get options_doorTrack() {
    const doorModel = this._doorModelList[this.doorModel];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.guideRails.map((item) => {
      const imgSrc = item.imgSrc;
      const withHook = item.withHook;

      const option = {
        value: imgSrc,
        label: imgSrc,
        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
      };

      if (withHook === null || withHook === this.typhoonProtection) {
        return option;
      }

      return undefined;
    });

    _.pull(arr, undefined);

    return arr;
  } // options_doorTrack

  /**門片材質 主產品設定的材質 */
  get options_material() {
    const doorModel = this._doorModelList[this.doorModel];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.slatMaterials.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

    return arr;
  }

  /**馬力 */
  get options_horsepower() {
    if (!this._doorGeneralSpecs) {
      return undefined;
    }

    const motorArr = this._doorGeneralSpecs.motors;

    return motorArr.map((item) => {
      return {
        value: item.hp,
        label: item.hp,
      };
    });
  }

  get options_motorVendor() {
    if (!this._doorGeneralSpecs) {
      return undefined;
    }

    const defaultMotorIndex = this._doorGeneralSpecs.defaultMotorIndex;
    const defaultMotor = this._doorGeneralSpecs.motors[defaultMotorIndex];
    const box = defaultMotor.box;

    if (!box) {
      return undefined;
    }

    if (box.default) {
      return [creOption_teco(), creOption_datong()];
    }

    if (box.東元) {
      return [creOption_teco()];
    }

    if (box.大同) {
      return [creOption_datong()];
    }

    // const motorOption = this._doorGeneralSpecs.motors.find((item) => {
    //   item.hp === this.horsepower;
    // });
    // if (!motorOption) {
    //   return undefined;
    // }

    //
    //
    //
    //
  } // options_motorVendor

  private countTotalPrice() {
    const quantity = this.quantity.replace(/,/g, '') || 0;
    const unitPrice = this.unitPrice.replace(/,/g, '') || 0;
    const total = Decimal.mul(quantity, unitPrice).toString();
    this.totalPrice = total;
  }

  private calcArea = () => {
    const area = Decimal.add(this._prodData.height || '0', this._prodData.thickness || '0') // h+b
      /** "0"被視為true，所以用型別為number的值來計算 */
      .mul(this._prodData.width || this._prodData.length || '0') // *w or *h
      .toFixed(2)
      .toString();

    return area;
  };

  /**計算才數 */
  private calcVolume = () => {
    return Decimal.mul(this.area || 0, 10.89)
      .toFixed(2)
      .toString();
  };

  // ---------------------------------------------------------

  get discountRate() {
    return this._prodData.discountRate;
  }
  set discountRate(v) {
    if ((v as string) === '') {
      v = '0';
    }

    if (Number(v) > 100) {
      v = '100';
    }

    if (v.split('.')[1]?.length > 2) {
      return;
    }

    this._prodData.discountRate = `${Number(v)}`;
    this.reRender();
  }
  // set discountRate_noLoop(v) {}
  //
  get itemName() {
    return this._prodData.itemName;
  }
  set itemName(v) {
    if (v.length >= 11) {
      v = v.slice(0, 10);
    }

    this._prodData.itemName = v;
    this.reRender();
  }
  //
  get quoteType() {
    return this._prodData.quoteType;
  }
  set quoteType(v) {
    this._prodData.quoteType = v;
    this.reRender();
  }
  //
  get doorModel() {
    return this._prodData.doorModel;
  }

  set doorModel(v) {
    this._prodData.doorModel = v;
    this.req_calcGeneralSpec();
    this.req_getProdAvailableComponents();
    this.reRender();
  }
  //
  get length() {
    return this._prodData.length;
  }
  set length(v) {
    this._prodData.length = v;
    this._prodData.width = '0';
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  //
  get width() {
    return this._prodData.width;
  }
  set width(v) {
    this._prodData.width = v;
    this._prodData.length = '0';
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  //
  get height() {
    return this._prodData.height;
  }
  set height(v) {
    this._prodData.height = v;
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  //
  /**B(m) */
  get thickness() {
    return this._prodData.thickness;
  }
  set thickness(v) {
    this._prodData.thickness = v;
    this.area = this.calcArea();
    this.reRender();
  }
  //
  get area() {
    return this._prodData.area;
  }
  set area(v) {
    this._prodData.area = v;
    this.volume = this.calcVolume();
    this.reRender();
  }
  //
  /** 才數*/
  get volume() {
    return this._prodData.volume;
  }
  set volume(v) {
    this._prodData.volume = v;
    this.reRender();
  }
  //
  get material() {
    return this._prodData.material;
  }
  set material(v) {
    this._prodData.material = v;
    this.reRender();
  }
  //
  get surface() {
    return this._prodData.surface;
  }
  set surface(v) {
    this._prodData.surface = v;
    this.reRender();
  }

  get doorTrack() {
    return this._prodData.doorTrack;
  }
  set doorTrack(v) {
    this._prodData.doorTrack = v;
    this.reRender();
  }

  get horsepower() {
    return this._prodData.horsepower;
  }
  set horsepower(v) {
    this._prodData.horsepower = v;
    this.reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._prodData.quantity = Number(v);
    this._quantity = v;
    this.countTotalPrice();
    this.reRender();
  }

  get unitPrice() {
    if (!this._unitPrice) {
      return '';
    }

    return Number(this._unitPrice).toLocaleString();
  }
  set unitPrice(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.unitPrice = Number(v);
    this._unitPrice = v;
    this.countTotalPrice();
    this.reRender();
  }

  get totalPrice() {
    if (!this._totalPrice) {
      return '';
    }

    return Number(this._totalPrice).toLocaleString();
  }
  set totalPrice(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.totalPrice = Number(v);
    this._totalPrice = v;
    this.reRender();
  }

  get typhoonProtection() {
    return this._prodData.typhoonProtection;
  }
  set typhoonProtection(v) {
    this._prodData.typhoonProtection = v;
    this._prodData.doorTrack = '';
    this.req_getProdAvailableComponents();
    this.reRender();
  }

  get bounceDoor() {
    return this._prodData.bounceDoor;
  }
  set bounceDoor(v) {
    this._prodData.bounceDoor = v;
    this.reRender();
  }

  get notes() {
    return this._prodData.notes;
  }
  set notes(v) {
    this._prodData.notes = v;
    this.reRender();
  }

  //----------------------------------------------------------
  //----------------------------------------------------------
  //----------------------------------------------------------

  get motorVendor() {
    return this._motorVendor;
  }
  set motorVendor(v: Toption | null) {
    this._motorVendor = v;

    // if (v?.boxB) {
    //   this.thickness = v.boxB;
    // }
    this.thickness = String(this._boxB ?? '');

    this._prodData.motorVendor = v?.value || '';
    this.reRender();
  }
  //
  get voltage() {
    return this._prodData.voltage;
  }
  set voltage(v) {
    this._prodData.voltage = v;
    this.reRender();
  }
  //
  get hasSupportStand() {
    return this._prodData.hasSupportStand;
  }
  set hasSupportStand(v) {
    this._prodData.hasSupportStand = v;
    this.reRender();
  }
  //
  get bottomBar() {
    return this._prodData.bottomBar;
  }
  set bottomBar(v) {
    this._prodData.bottomBar = v;
    this.reRender();
  }
  //
  get lockBox() {
    return this._prodData.lockBox;
  }
  set lockBox(v) {
    this._prodData.lockBox = v;
    this.reRender();
  }
  //
  get railThick() {
    return this._prodData.railThick;
  }
  set railThick(v) {
    this._prodData.railThick = v;
    this.reRender();
  }
  //
  get rollerType() {
    return this._prodData.rollerType;
  }
  set rollerType(v) {
    this._prodData.rollerType = v;
    this.reRender();
  }
  //
  get hasSilencingStrip() {
    return this._prodData.hasSilencingStrip;
  }
  set hasSilencingStrip(v) {
    this._prodData.hasSilencingStrip = v;
    this.reRender();
  }
  //
  get isIntegrated() {
    return this._prodData.isIntegrated;
  }
  set isIntegrated(v) {
    this._prodData.isIntegrated = v;
    this.reRender();
  }
  //
  get headBoxThick() {
    return this._prodData.headBoxThick;
  }
  set headBoxThick(v) {
    this._prodData.headBoxThick = v;
    this.reRender();
  }
  //
  get openWay() {
    return this._prodData.openWay;
  }
  set openWay(v) {
    this._prodData.openWay = v;
    this.reRender();
  }
  //

  //-----------------------------------------
} // Class_product close

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================

type Tprod = {
  id?: string;
  order?: string;
  discountRate: `${number}`;
  itemName: string;
  quoteType: string;
  doorModel: string;
  length: string; // L(m)
  width: string; // W(m)
  height: string; //h(m)
  thickness: string; // B(m)
  area: string; // 面積
  volume: string; // 才數
  material: string;
  surface: string;
  doorTrack: string;
  horsepower: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  typhoonProtection: boolean;
  bounceDoor: boolean;
  notes: string;
  //
  motorVendor: string; // 馬達廠商
  voltage: string; // 電壓
  hasSupportStand: boolean; // 馬達支撐架
  bottomBar: string; // 底座類型
  lockBox: string; // 馬達鎖盒
  railThick: string; // 門軌厚度
  rollerType: string; // 捲軸規格
  hasSilencingStrip: boolean; // 門軌消音條
  isIntegrated: boolean; // 一體式捲箱
  headBoxThick: string; // 捲箱厚度
  openWay: string; // 開閉方式
};

type TprodKey = Exclude<keyof Tprod, 'id' | 'order'>;

const prodkeyArrOri: () => TprodKey[] = () => {
  return [
    'discountRate',
    'itemName',
    'quoteType',
    'doorModel',
    'length',
    'width',
    'height',
    'thickness',
    'area',
    'volume',
    'material',
    'surface',
    'doorTrack',
    'horsepower',
    'quantity',
    'unitPrice',
    'totalPrice',
    'typhoonProtection',
    'bounceDoor',
    'notes',
    //
    'motorVendor', // 馬達廠商
    'voltage', // 電壓
    'hasSupportStand', // 馬達支撐架
    'bottomBar', // 底座類型
    'lockBox', // 馬達鎖盒
    'railThick', // 門軌厚度
    'rollerType', // 捲軸規格
    'hasSilencingStrip', // 門軌消音條
    'isIntegrated', // 一體式捲箱
    'headBoxThick', // 捲箱厚度
    'openWay', // 開閉方式
  ];
};

// type TprodCellConfig = {
//   [key in string]: {
//     label: string;
//     theadItemClassName?: string;
//     inputSelProps: TinputSelProps;
//   };
// };

const prodCellConfig: TcellConfig = {
  discountRate: {
    label: '折數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  itemName: {
    label: '項目',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {},
      },
    },
  },
  quoteType: {
    label: '報價別',
    inputSelProps: {
      wrapperStyle: { width: '105px' },
      selectProps: {
        props: {
          options: optionsCreator_quoteType(),
        },
      },
    },
  },
  doorModel: {
    label: '門型',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {
          // options: optionsCreator_doorModel(),
        },
      },
    },
  },
  length: {
    label: 'L(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  /**全寬 在product系列api的key為WG */
  width: {
    label: 'W(m)', // 全寬 // 好像不對，跟api的描述不符 // 是全寬扣除機械縫?
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  height: {
    label: 'h(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  thickness: {
    label: 'B(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  area: {
    label: '面積',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  volume: {
    label: '才數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  material: {
    label: '材料',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {},
      },
    },
  },
  surface: {
    label: '表面',
    inputSelProps: {
      wrapperStyle: { width: '55px' },
      inputProps: {
        props: {},
      },
    },
  },
  doorTrack: {
    label: '門軌',
    inputSelProps: {
      wrapperStyle: { width: '300px' },
      selectProps: {
        withIcon: true,
        creOptionWithIconProps: {
          imgProps: {
            style: { height: '40px' },
          },
        },
        creSingleValueWithIconProps: {
          imgProps: {
            style: { height: '40px' },
          },
        },
        props: {},
        // dynaOptionsList: {
        //   normal: optionsCre_doorTrack_normal(),
        //   typhoonProtection: optionsCre_doorTrack_typhoonProtection(),
        // },
      },
    },
  },
  horsepower: {
    label: '馬力',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {},
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '55px' },
      inputProps: {
        props: { type: 'number' },
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {},
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      wrapperStyle: { width: '140px' },
      inputProps: {
        props: {},
      },
    },
  },
  typhoonProtection: {
    label: '防颱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'typhoonProtection' }],
      },
    },
  },
  bounceDoor: {
    label: '彈射門',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'bounceDoor' }],
      },
    },
  },
  notes: {
    label: '備註',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      inputProps: {
        props: {},
      },
    },
  },
  //
  //
  //
  motorVendor: {
    label: '馬達廠商',
    isOptionValue: true,
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '東元', label: '東元' },
            { value: '大同', label: '大同' },
          ],
        },
      },
    },
  },
  voltage: {
    label: '電壓',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '220V', label: '220V' },
            { value: '380V', label: '380V' },
          ],
        },
      },
    },
  },
  hasSupportStand: {
    label: '馬達支撐架',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'hasSupportStand' }],
      },
    },
  },
  bottomBar: {
    label: '底座類型',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: 'none', label: '無' },
            { value: '鋁障感型', label: '鋁障感型' },
            { value: '止水型', label: '止水型' },
          ],
        },
      },
    },
  },
  lockBox: {
    label: '馬達鎖盒',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '外露', label: '外露' },
            { value: '防盜', label: '防盜' },
          ],
        },
      },
    },
  },
  railThick: {
    label: '門軌厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            // { value: '1.0T', label: '1.0T' },
            // { value: '3.0T', label: '3.0T' },
            // { value: '4.5T', label: '4.5T' },
            { value: 'api給', label: 'api給' },
          ],
        },
      },
    },
  },
  rollerType: {
    label: '捲軸規格',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '無凸', label: '無凸' },
            { value: '雙凸', label: '雙凸' },
          ],
        },
      },
    },
  },
  hasSilencingStrip: {
    label: '門軌消音條',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'hasSilencingStrip' }],
      },
    },
  },
  isIntegrated: {
    label: '一體式捲箱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'isIntegrated' }],
      },
    },
  },
  headBoxThick: {
    label: '捲箱厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            // { value: '0.8T', label: '0.8T' },
            { value: 'api給', label: 'api給' },
          ],
        },
      },
    },
  },
  openWay: {
    label: '開閉方式',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [{ value: '電動', label: '電動' }],
        },
      },
    },
  },
}; // prodCellConfig close

const emptyProdOri: () => Tprod = () => {
  return {
    discountRate: '100',
    itemName: '',
    quoteType: '',
    doorModel: '',
    length: '',
    width: '',
    height: '',
    thickness: '',
    area: '',
    volume: '',
    material: '',
    surface: '',
    doorTrack: '',
    horsepower: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    notes: '',
    //
    motorVendor: '',
    voltage: '',
    hasSupportStand: false,
    bottomBar: '',
    lockBox: '',
    railThick: '',
    rollerType: '',
    hasSilencingStrip: false,
    isIntegrated: false,
    headBoxThick: '',
    openWay: '',
  };
};

const creOption_teco: () => Toption = () => {
  return {
    value: '東元',
    label: '東元',
  };
};

const creOption_datong: () => Toption = () => {
  return {
    value: '大同',
    label: '大同',
  };
};

// ===========================================================
// ===========================================================
// ===========================================================
export { Class_product, prodkeyArrOri, prodCellConfig };
export type { Tprod, TprodKey, TcellConfig };
