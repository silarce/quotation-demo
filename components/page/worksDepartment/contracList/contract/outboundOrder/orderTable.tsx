import { useState } from 'react';
import style from './outboundOrder.module.scss';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// ================================================================================

type TstaticData = {
  project: string;
  L: string;
  W: string;
  B: string;
  qty: string;
  implementQty: string;
  cai: string;
  totalCai: string;
  doorType: string;
  material: string;
  horsepower: string;
  surface: string;
};

type TdeliveryStatusItem = {
  value: string;
  onChange: (str: string) => void;
};

type Tgroup = {
  itemName: string;
  rowArr: {
    staticData: TstaticData;
    deliveryStatus: {
      remark01: TdeliveryStatusItem;
      remark02: TdeliveryStatusItem;
      remark03: TdeliveryStatusItem;
      remark04: TdeliveryStatusItem;
      appended: TdeliveryStatusItem;
      orderCreatedDate: TdeliveryStatusItem;
      finishAppended: TdeliveryStatusItem;
      installer: TdeliveryStatusItem;
      installDate: TdeliveryStatusItem;
    };
  }[];
};

type Tcontrol = Tgroup[];

export type { Tcontrol as Tcontrol_orderTable };

// ================================================================================
export default function OrderTable({ disabled, control }: { disabled: boolean; control: Tcontrol }) {
  // const [orderList, setOrderList] = useState(fakeOrderData);
  const configList = creConfigList();

  return (
    <div className={style.orderTable}>
      <div className={style.thead}>
        {/*  */}
        <div className={`${style.theadItem} ${style.indexCell}`} />
        {/*  */}

        {orderKeyArr_static.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? style.textCenter : '';

          return (
            <div className={`${style.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
        {/* 灰色柱子 */}
        <div className={` ${style.pilar}`}>
          <div />
        </div>
        {/*  */}
        {orderKeyIndex02.map((key, index) => {
          const { label, width, position } = configList[key] ?? {};
          const theStyle = {
            width,
          };
          const textCenter = position === 'center' ? style.textCenter : '';

          return (
            <div className={`${style.theadItem} ${textCenter}`} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={style.tableList}>
        {control.map((item, groupIndex) => {
          const { itemName, rowArr } = item;

          return (
            <div key={groupIndex}>
              {rowArr.map((row, rowIndex) => {
                const bgcSub = rowIndex !== 0 ? style.bgcSub : '';

                return (
                  <div className={`${style.row} ${bgcSub}`} key={rowIndex}>
                    {/*  */}
                    {rowIndex === 0 ? (
                      <div className={`${style.column} ${style.indexCell}`}>
                        <span>{groupIndex + 1}</span>
                      </div>
                    ) : (
                      <div className={`${style.column} ${style.indexCell}`}>
                        <span></span>
                      </div>
                    )}

                    {/* orderKeyIndex01 */}
                    {orderKeyArr_static.map((key, columnIndex) => {
                      let value = row.staticData[key];

                      if (rowIndex !== 0 && columnIndex === 0) {
                        value = '';
                      }

                      const { width, position } = configList[key] ?? {};
                      const theStyle = { width };
                      const textCenter = position === 'center' ? style.textCenter : '';

                      return (
                        <div className={`${style.column} ${textCenter}`} key={columnIndex} style={theStyle}>
                          <span>{value}</span>
                        </div>
                      );
                    })}

                    {/* 沒有柱子的灰色柱子 */}
                    <div className={`${style.pilar}`} />

                    {/* orderKeyIndex02 */}
                    {orderKeyIndex02.map((key, columnIndex) => {
                      const { value, onChange } = row.deliveryStatus[key];

                      // if (rowIndex !== 0 && columnIndex === 0) {
                      //   value = '';
                      // }

                      const { width, position } = configList[key] ?? {};
                      const theStyle = { width };
                      const textCenter = position === 'center' ? style.textCenter : '';

                      // const onChange = (v: string) => {
                      //   orderList[groupIndex].list[rowIndex][key].value = v;
                      //   setOrderList([...orderList]);
                      // };

                      return (
                        <div className={`${style.column} ${textCenter}`} key={columnIndex} style={theStyle}>
                          <InputSel
                            className={style.input03}
                            inputProps={{
                              value,
                              onChange,
                            }}
                            placeholder=""
                            disabled={disabled}
                          />
                        </div>
                      );
                    })}
                    {/*  */}
                    {rowIndex !== 0 && <div className={style.ribbon}></div>}
                  </div> // row
                ); // return
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =======================================================
const orderKeyArr_static: (keyof TstaticData)[] = [
  'project',
  'L',
  'W',
  'B',
  'qty',
  'implementQty',
  'cai',
  'totalCai',
  'doorType',
  'material',
  'horsepower',
  'surface',
];

const orderKeyIndex02: (keyof Tgroup['rowArr'][number]['deliveryStatus'])[] = [
  'remark01',
  'remark02',
  'remark03',
  'remark04',
  'appended',
  'orderCreatedDate',
  'finishAppended',
  'installer',
  'installDate',
];

const fakeOrderDataItemOri = () => ({
  project: {
    value: 'SD2',
  },
  L: {
    value: '516',
  },
  W: {
    value: '230',
  },
  B: {
    value: '45',
  },
  qty: {
    value: '1',
  },
  implementQty: {
    value: '1',
  },
  cai: {
    value: '22181.49',
  },
  totalCai: {
    value: '22181.49',
  },
  doorType: {
    value: 'SJ-302',
  },
  material: {
    value: '不鏽鋼304#',
  },
  horsepower: {
    value: '1/3HP',
  },
  surface: {
    value: '烤漆',
  },

  remark01: {
    value: '',
  },
  remark02: {
    value: '',
  },
  remark03: {
    value: '',
  },
  remark04: {
    value: '',
  },
  appended: {
    value: '',
  },
  orderCreatedDate: {
    value: '',
  },
  finishAppended: {
    value: '',
  },
  installer: {
    value: '',
  },
  installDate: {
    value: '',
  },
});
// const fakeOrderDataItem = {
//   project: {
//     value: "SD2"
//   },
//   L: {
//     value: "516"
//   },
//   W: {
//     value: "230"
//   },
//   B: {
//     value: "45"
//   },
//   qty: {
//     value: "1"
//   },
//   implementQty: {
//     value: "1"
//   },
//   cai: {
//     value: "22181.49"
//   },
//   totalCai: {
//     value: "22181.49"
//   },
//   doorType: {
//     value: "SJ-302"
//   },
//   material: {
//     value: "不鏽鋼304#"
//   },
//   horsepower: {
//     value: "1/3HP"
//   },
//   surface: {
//     value: "烤漆"
//   },

//   remark01: {
//     value: ""
//   },
//   remark02: {
//     value: ""
//   },
//   remark03: {
//     value: ""
//   },
//   remark04: {
//     value: ""
//   },
//   appended: {
//     value: ""
//   },
//   orderCreatedDate: {
//     value: ""
//   },
//   finishAppended: {
//     value: ""
//   },
//   installer: {
//     value: ""
//   },
//   installDate: {
//     value: ""
//   },
// }

const fakeOrderData = [
  {
    project: 'SD2',
    list: [fakeOrderDataItemOri(), fakeOrderDataItemOri()],
  },
  {
    project: 'SD3',
    list: [fakeOrderDataItemOri(), fakeOrderDataItemOri(), fakeOrderDataItemOri()],
  },
  {
    project: 'SD4',
    list: [fakeOrderDataItemOri(), fakeOrderDataItemOri()],
  },
  {
    project: 'SD5',
    list: [fakeOrderDataItemOri()],
  },
  {
    project: 'SD5',
    list: [fakeOrderDataItemOri()],
  },
];

// =======================================================================

type Tconfig = {
  label: string;
  width: string;
  type: string;
  position: string;
};

type TcellConfigList = {
  [key: string]: Tconfig | undefined;
};

const creCellConfig_static = (): TcellConfigList => ({
  discount: {
    label: '折數',
    width: '75px',
    type: 'input',
    position: '',
  },
  project: {
    label: '項目',
    width: '60px',
    type: 'input',
    position: '',
  },
  quoteType: {
    label: '報價別',
    width: '105px',
    type: 'select',
    position: '',
  },
  L: {
    label: 'L',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  W: {
    label: 'W',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  H: {
    label: 'H',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  B: {
    label: 'B',
    width: '60px',
    type: 'input',
    position: 'center',
  },
  area: {
    label: '面積',
    width: '60px',
    type: 'input',
    position: '',
  },
  cai: {
    label: '才數',
    width: '75px',
    type: 'input',
    position: '',
  },
  totalCai: {
    label: '總才數',
    width: '75px',
    type: 'input',
    position: '',
  },
  doorType: {
    label: '門型',
    width: '75px',
    type: 'input',
    position: '',
  },
  material: {
    label: '材料',
    width: '120px',
    type: 'select',
    position: '',
  },
  surface: {
    label: '表面',
    width: '55px',
    type: 'select',
    position: '',
  },
  doorRail: {
    label: '門軌',
    width: '70px',
    type: 'selectWithIcon',
    position: '',
  },
  horsepower: {
    label: '馬力',
    width: '60px',
    type: 'input',
    position: '',
  },
  qty: {
    label: '數量',
    width: '43px',
    type: 'input',
    position: 'center',
  },
  unitPrice: {
    label: '單價',
    width: '84px',
    type: 'input',
    position: '',
  },
  subTotal: {
    label: '複價',
    width: '84px',
    type: 'input',
    position: '',
  },
  memo: {
    label: '備註',
    width: '90px',
    type: 'select',
    position: '',
  },
  ejectionDoor: {
    label: '彈射門',
    width: '60px',
    type: 'checkbox',
    position: '',
  },
  openType: {
    label: '開門方式',
    width: '82px',
    type: 'select',
    position: 'center',
  },
  thickness: {
    label: '厚度',
    width: '45px',
    type: 'input',
    position: '',
  },
});
// =============================================================

const creCellConfig_deliveryStatus = (): TcellConfigList => ({
  remark01: {
    label: '備註1',
    width: '65px',
    type: 'input',
    position: '',
  },
  remark02: {
    label: '備註2',
    width: '65px',
    type: 'input',
    position: '',
  },
  remark03: {
    label: '備註3',
    width: '65px',
    type: 'input',
    position: '',
  },
  remark04: {
    label: '備註4',
    width: '65px',
    type: 'input',
    position: '',
  },
  appended: {
    label: '追加',
    width: '65px',
    type: 'input',
    position: '',
  },
  orderCreatedDate: {
    label: '工作表開立日期',
    width: '115px',
    type: 'input',
    position: '',
  },
  finishAppended: {
    label: '完成追加',
    width: '75px',
    type: 'input',
    position: '',
  },
  installer: {
    label: '安裝人員',
    width: '85px',
    type: 'input',
    position: '',
  },
  installDate: {
    label: '安裝日期',
    width: '85px',
    type: 'input',
    position: '',
  },
  implementQty: {
    label: '實作數量',
    width: '75px',
    type: 'input',
    position: 'center',
  },
});

const creConfigList = (): TcellConfigList => ({
  ...creCellConfig_static(),
  ...creCellConfig_deliveryStatus(),
});
