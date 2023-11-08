// import XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import 'xlsx-js-style';

// import { AppContextProps } from './AppContext';

import Decimal from 'decimal.js';

// const foo = 'foo';

const MaterialOptions = [
  { title: '不鏽鋼304#', value: '0' },
  { title: '不鏽鋼316#', value: '1' },
  { title: '鍍鋅鋼板', value: '2' },
  { title: '高耐腐蝕鋼板', value: '3' },
  { title: '樹脂鋼板', value: '4' },
];

const PowerOptions = [
  { title: '單向 220', value: '0' },
  { title: '三向 220', value: '1' },
  { title: '三向 380', value: '2' },
];

const RollBoxOptions = [
  { thickness: '前遮板', value: '0' },
  { thickness: '上蓋板', value: '1' },
  { thickness: '方型捲箱', value: '2' },
  { thickness: '捲箱+機箱', value: '3' },
];
const MemoOptions = [
  { thickness: '紅外線', value: '0' },
  { thickness: '鋁障感器', value: '1' },
  { thickness: '擋輪', value: '2' },
  { thickness: '門楣', value: '3' },
  { thickness: '防颱底座鎖固', value: '4' },
  { thickness: 'UL 熔金體', value: '5' },
  { thickness: '智慧型密碼開關', value: '6' },
  { thickness: '遙控器(1:2)', value: '7' },
  { thickness: '防颱活動中柱(滑軌)', value: '8' },
  { thickness: '防颱活動中柱(可拆式)', value: '9' },
  { thickness: '防爆裝置', value: '10' },
  { thickness: '手動關閉裝置', value: '11' },
  { thickness: 'UPS', value: '12' },
  { thickness: '煙感+中繼器', value: '13' },
  { thickness: '彈射門', value: '14' },
];
const CheckOptions = [
  { title: '一般烤', value: '0' },
  { title: '氟烤', value: '1' },
];

const PreferredCheckOptions = [
  { title: '左', value: '0' },
  { title: '右', value: '1' },
];

const DoorMtCheckOptions = [
  { title: 'BA', value: '0' },
  { title: 'HL', value: '1' },
  { title: 'No.4', value: '2' },
  { title: '一般烤', value: '3' },
  { title: '氟烤', value: '4' },
];

const MotorUnitCheckOptions = [
  { title: '大同', value: '0' },
  { title: '東元', value: '1' },
];

const DoorTrackTypeOptions = [
  { title: '直', value: '0' },
  { title: '彎', value: '1' },
];

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ====================================================================================================

type Tcontrol_head = {
  contractNumber: string;
  projectName: string;
  projectAddress: string;
  customerName: string;
  contactPerson: string;
  // 開單日期
  billingDate: string;
  // 出貨日期
  shippingDate: string;
};

type Tcontrol_body = {
  itemName: string;
  size: {
    qty: string;
    doorModelName: string;
    fullWidth: string;
    height: string;
    WG: string;
    gapA: string;
    gapC: string;
    /**支版尺寸 boxB*boxD */
    BD: string;
    /**捲門全高 */
    fullHeight: string;
  };
  roller: {
    diameter: string;
    bearingInnerDiameter: string;
    bearingName: string;
    bearingHousingTotalLength: string;
    bearingHousingSize: string;
  };
  headBox: {
    angleIronQty: string;
    angleIronSize: string;
    info: string;
  };
  doorPiece: {
    material: string;
    thickness: string;
    slatLength: string;
    slatCount: string;
    antyTyphoonHook: string;
  };
  motor: {
    vendor: string;
    /**相數加電壓 */
    phaseVoltage: string;
    horsepower: string;
  };
  guideRail: {
    彎直: string;
    material: string;
    guideRailLength: string;
    guideRailName: string;
    icon: string | undefined;
  };
  chainCog: {
    sprocketWheelModel: string;
    sprocketWheelTeethNumber: string;
    bearingInnerDiameter: string;
  };
  base: {
    material: string;
    guideRailsOpening: string;
  };
  memo: string;
};

type Tcontrol = {
  info: {
    contractNumber: string;
    projectName: string;
    projectAddress: string;
    customerName: string;
    contactPerson: string;
    // 開單日期
    billingDate: string;
    // 出貨日期
    shippingDate: string;
  };
  itemArr: Tcontrol_body[];
};

// ====================================================================================================
let array: string[][] = [];

function addHeader(control_head: Tcontrol_head) {
  array.push(['工作表']);
  array.push([
    '合約編號',
    control_head.contractNumber,
    '客戶名稱',
    control_head.customerName,
    '開單日期',
    control_head.billingDate,
  ]);
  array.push([
    '工程名稱',
    control_head.projectName,
    '聯絡人',
    control_head.contactPerson,
    '出貨日期',
    control_head.shippingDate,
  ]);
  array.push(['工程地點', control_head.projectAddress]);
}

function addBody({
  control_body,
  index,
  rowBegin,
  init,
}: {
  control_body: Tcontrol_body;
  index: number;
  rowBegin: number;
  init: boolean;
}) {
  // predefined fields
  // const _modelData = appCtx.specs[index].modelData;
  // const _model = appCtx.specs[index].model;
  // const _width = appCtx.specs[index].width;
  // const _height = appCtx.specs[index].height;
  // const _wg = appCtx.specs[index].wg;
  // const _angleIronCount = appCtx.specs[index].angleIronCount;
  // const _data = appCtx.specs[index].data;
  // const _useHook = appCtx.specs[index].useHook!;
  // const _motorIndex = appCtx.specs[index].motorIndex;
  // const _motorUnitIndex = appCtx.specs[index].motorUnitIndex;
  // const _doorTrackIndex = appCtx.specs[index].doorTrackIndex;
  // const _baseMtlIndex = appCtx.specs[index].baseMtlIndex;
  // const _doorMtlIndex = appCtx.specs[index].doorMtlIndex;
  // const _doorTrackMtlIndex = appCtx.specs[index].doorTrackMtlIndex;
  // const _doorTrackTypeIndex = appCtx.specs[index].doorTrackTypeIndex;
  // const _doorSectionLength = appCtx.specs[index].doorSectionLength;
  // const _useBakeDoorMt = appCtx.specs[index].useBakeDoorMt;
  // const _useBakeDoorTrackMt = appCtx.specs[index].useBakeDoorTrackMt;
  // const _useBakeBaseMt = appCtx.specs[index].useBakeBaseMt;
  // const _useBakeRollBox = appCtx.specs[index].useBakeRollBox;
  // const _power = appCtx.specs[index].powerIndex;
  // const _preferredBDirectionIndex = appCtx.specs[index].preferredBDirectionIndex;
  // const _rollBox = appCtx.specs[index].rollBoxIndexs;
  // const _memo = appCtx.specs[index].memoIndexs;
  // const _minA = appCtx.specs[index].minA;
  // const _minB = appCtx.specs[index].minB;
  // const _minC = appCtx.specs[index].minC;
  // const _minD = appCtx.specs[index].minD;
  // const _preferredA = appCtx.specs[index].preferredA;
  // const _preferredB = appCtx.specs[index].preferredB;
  // const _preferredC = appCtx.specs[index].preferredC;
  // const _preferredD = appCtx.specs[index].preferredD;
  // const _calculatedWidth = _width
  //   ? Decimal.mul(Number(_width), 1000).toNumber()
  //   : Decimal.mul(Number(_wg), 1000).plus(Number(_preferredA)).plus(Number(_preferredC)).toNumber();

  const xLabel = '捲片支數';
  const xValue = 0;

  // if (_data) {
  //   const H = Number(_height) * 1000 + Number(_preferredB);

  //   if (_model === 'SJ-302') {
  //     xValue = Math.ceil(Decimal.div(H, 110).minus(2).toNumber());
  //   } else if (_model === 'SJ-303A' || _model === 'SJ-303AS') {
  //     xValue = Math.ceil(Decimal.mul(Number(_height), 1000).div(100).toNumber());
  //   } else if (_model === 'SJ-305D') {
  //     xValue = Math.ceil(Decimal.div(H, 80).minus(2).toNumber());
  //   }
  // } else {
  //   xValue = 0;
  // }

  const yValue = 0;

  // if (_data) {
  //   if (_model === 'SJ-302') {
  //     yValue = new Decimal(_calculatedWidth)
  //       .minus(Number(_preferredA))
  //       .minus(Number(_preferredC))
  //       .minus(_useHook ? 50 : 30)
  //       .toNumber();
  //   } else if (_model === 'SJ-303A' || _model === 'SJ-303AS') {
  //     yValue = new Decimal(_calculatedWidth).minus(Number(_preferredA)).minus(Number(_preferredC)).minus(50).toNumber();
  //   } else if (_model === 'SJ-305D') {
  //     yValue = new Decimal(_calculatedWidth).minus(Number(_preferredA)).minus(Number(_preferredC)).minus(30).toNumber();
  //   }
  // } else {
  //   yValue = 0;
  // }

  if (init) {
    for (let i = 0; i < 25; i++) {
      array.push([]);
    }
  }

  const { itemName, size, roller, headBox, doorPiece, motor, guideRail, chainCog, base, memo } = control_body;

  array[rowBegin].push(itemName, '', '', '');
  array[rowBegin + 1].push('尺寸', '', '門片' + '', '');
  array[rowBegin + 2].push('數量', size.qty, '門片材質', doorPiece.material);
  array[rowBegin + 3].push('型號', size.doorModelName, '門片長度', doorPiece.slatLength);
  array[rowBegin + 4].push('全寬', `${size.fullWidth} mm`, xLabel, doorPiece.slatCount);
  array[rowBegin + 5].push('淨高', `${size.height} mm`, '防颱勾', doorPiece.antyTyphoonHook);
  array[rowBegin + 6].push('重量換算', '???', `電動機(${motor.vendor})`, '');
  array[rowBegin + 7].push('W+G', `${size.WG} mm`, '電供', motor.phaseVoltage);
  array[rowBegin + 8].push('機械縫 A', `${size.gapA} mm`, '馬力數', motor.horsepower);
  array[rowBegin + 9].push('機械縫 C', `${size.gapC} mm`, '門軌' + guideRail.guideRailName, '');
  array[rowBegin + 10].push('門片厚度', `${doorPiece.thickness} mm`, '門軌材質', guideRail.material);
  array[rowBegin + 11].push('支板尺寸 B*D', size.BD, '門軌長度', guideRail.guideRailLength);
  array[rowBegin + 12].push('捲門全高 H', `${size.fullHeight} mm`, '門軌形式' + guideRail.彎直, '');
  array[rowBegin + 13].push('捲軸', '', '', '');
  array[rowBegin + 14].push('捲軸尺寸', roller.diameter, '', '');
  array[rowBegin + 15].push('軸承', roller.bearingName, '', '');
  array[rowBegin + 16].push('總長', roller.bearingHousingTotalLength, '鏈齒輪', '');
  array[rowBegin + 17].push('寸法', roller.bearingHousingSize, '鏈齒輪番號', chainCog.sprocketWheelModel);
  array[rowBegin + 18].push('捲箱' + '', '', '齒數', '???');
  array[rowBegin + 19].push('捲箱角鐵數量', headBox.angleIronQty, '孔徑', chainCog.bearingInnerDiameter);
  array[rowBegin + 20].push('捲箱角鐵尺寸', headBox.angleIronSize, '底座' + '', '');
  array[rowBegin + 21].push('捲箱資訊', headBox.info, '底座材質', base.material);
  array[rowBegin + 22].push('', '', '底座開口', base.guideRailsOpening);
  array[rowBegin + 23].push('備註', memo);
}

export function downloadExcel(control: Tcontrol, fileName: string) {
  array = [];

  const wb = XLSX.utils.book_new();

  for (let i = 0; i < control.itemArr.length; i++) {
    const isPageHead = i % 6 === 0;
    const isSectionHead = i % 3 === 0;

    const rowsPerHeader = 4;
    const rowsPerSection = 25;
    const page = Math.floor(i / 6);
    const section = Math.floor(i / 3);

    if (isPageHead) {
      addHeader(control.info);
    }

    addBody({
      control_body: control.itemArr[i],
      index: i,
      rowBegin: rowsPerHeader * (page + 1) + rowsPerSection * section,
      init: isSectionHead,
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(array);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const colWidth = 150;
  ws['!cols'] = [
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
    { wpx: colWidth },
  ];

  // const page = Math.ceil(appCtx.specs.length / 6);
  // ws['!merges'] = [{ s: { c: 0, r: 0 }, e: { c: 11, r: 0 } }];

  for (let i = 0; i < control.itemArr.length; i++) {
    const isPageHead = i % 6 === 0;
    const isSectionHead = i % 3 === 0;

    const rowsPerHeader = 4;
    const rowsPerSection = 25;
    const page = Math.floor(i / 6);
    const section = Math.floor(i / 3);
  }

  for (const i in ws) {
    const cell = XLSX.utils.decode_cell(i);

    if (cell.c === 0) {
      ws[i].s = {
        border: {
          right: { style: 'thick', color: 'red' },
        },
      };
    }

    if (cell.r % 2 && ws[i].s) {
      console.log(ws[i].s);
      ws[i].s = {
        font: {
          name: 'Calibri',
          sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' },
        },
      };
    }
  }

  // XLSX.writeFile(wb, fileName + '.xlsx');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
