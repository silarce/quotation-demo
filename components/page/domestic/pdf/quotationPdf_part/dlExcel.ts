import ExcelJs from 'exceljs';
import Moment from 'moment';

import type { TmainProduct } from './quotationPdf_part';

const dlExcel = async ({ quotationId, mainProductArr }: { quotationId: string; mainProductArr: TmainProduct[] }) => {
  const workbook = new ExcelJs.Workbook();

  const sheetName = quotationId;
  const sheet = workbook.addWorksheet(sheetName);
  const widthAdjust = 1.10456536503; // 乘上這個值才會是excel上的寬度 // 但還是有誤差
  sheet.columns = [
    { width: 5.89 * widthAdjust },
    { width: 22.5 * widthAdjust },
    { width: 22.5 * widthAdjust },
    { width: 5.89 * widthAdjust },
    { width: 5.89 * widthAdjust },
    { width: 10.89 * widthAdjust },
    { width: 10.89 * widthAdjust },
  ];
  // sheet.columns = [
  //   { width: 5.89 * widthAdjust },
  //   { width: 21.89 * widthAdjust },
  //   { width: 21.89 * widthAdjust },
  //   { width: 5.89 * widthAdjust },
  //   { width: 5.89 * widthAdjust },
  //   { width: 10.89 * widthAdjust },
  //   { width: 10.89 * widthAdjust },
  // ];

  sheet.columns.forEach((item) => (item.font = { name: 'Calibri', size: 11 }));
  // -----------------------------------------------------------

  //
  const A1G1 = sheet.getCell('A1');
  sheet.mergeCells('A1:G1');
  A1G1.value = '三久建材工業股份有限公司';

  A1G1.alignment = { horizontal: 'center' };
  A1G1.font = { name: '微軟正黑體', size: 18 };
  //
  const A2 = sheet.getCell('A2');
  A2.value = '總公司工廠：台中市霧峰區峰北路666號';
  //
  const A3 = sheet.getCell('A3');
  A3.value = '台北分公司：台北市內湖路一段387巷5號2樓之2';
  //
  const G2 = sheet.getCell('G2');
  G2.value = 'TEL：04-24069939(七線)   FAX：04-24069909';
  G2.alignment = { horizontal: 'right' };
  //
  const G3 = sheet.getCell('G3');
  G3.value = 'TEL：02-26581508(三線)   FAX：02-26581507';
  G3.alignment = { horizontal: 'right' };
  //
  //

  let rowCount = 4;

  mainProductArr.forEach((item) => {
    let { part } = item;

    part = part.map((item, index) => {
      if (item.unit === 'm2' || item.partName === '捲門片' || item.partName === '按裝及製造費用') {
        item.unit = 'M2';
      }

      return item;
    });

    let rowIndex = rowCount + 1;

    const quotationNumberCell = sheet.getCell(`A${rowIndex}`);
    quotationNumberCell.value = `報價編號：${item.quotationNumber}`;

    const doorModelCell = sheet.getCell(`A${rowIndex + 1}`);
    doorModelCell.value = `門型：${item.doorType}`;

    const categoryCell = sheet.getCell(`C${rowIndex}`);
    categoryCell.value = `項目：${item.category}`;

    const sizeCell = sheet.getCell(`C${rowIndex + 1}`);
    sizeCell.value = `尺寸：${item.size}`;

    const materialCaptionCell = sheet.getCell(`D${rowIndex}`);
    materialCaptionCell.value = '材質：';

    const materialCell = sheet.getCell(`E${rowIndex}`);
    const material = item.material.includes('SST') ? 'SST' : item.material.includes('鍍鋅') ? '鍍鋅' : item.material;
    materialCell.value = material;

    const surfaceCaptionCell = sheet.getCell(`F${rowIndex}`);
    surfaceCaptionCell.value = '表面：';
    surfaceCaptionCell.alignment = { horizontal: 'right' };

    const surfaceCell = sheet.getCell(`G${rowIndex}`);
    surfaceCell.value = item.surface;

    rowIndex = rowIndex + 2;

    const letterLookup = 'ABCDEFG';
    excelKeyIndex.forEach((key, index) => {
      const letter = letterLookup[index];

      const cell = sheet.getCell(`${letter}${rowIndex}`);
      cell.value = excelConfig[key].label;
      cell.alignment = excelConfig[key].headAlignment;
      cell.border = {
        top: {
          style: 'thin',
          color: { argb: '000000' },
        },
        bottom: {
          style: 'thin',
          color: { argb: '000000' },
        },
      };
    });

    rowIndex = rowIndex + 1;

    part.forEach((partItem, pIndex) => {
      if (partItem.unit === 'M2' || partItem.partName === '捲門片' || partItem.partName === '按裝及製造費用') {
        partItem.unit = 'm2';
      }

      excelKeyIndex.forEach((key, kIndex) => {
        const letter = letterLookup[kIndex];
        const cell = sheet.getCell(`${letter}${rowIndex}`);

        let value = '';

        if (key === 'indexNumber') {
          value = `${pIndex + 1}`;
        } else {
          value = partItem[key];
        }

        if (key === 'qty' || key === 'price' || key === 'totalPrice' || key === 'indexNumber') {
          cell.value = Number(value.replaceAll(',', ''));

          if (key === 'price' || key === 'totalPrice' || key === 'indexNumber') {
            cell.numFmt = '###,##0';
          }
        } else {
          cell.value = value;
        }

        cell.alignment = excelConfig[key].alignment;

        if (pIndex === part.length - 1) {
          cell.border = {
            bottom: {
              style: 'thin',
              color: { argb: '000000' },
            },
          };
        }
      });

      rowIndex = rowIndex + 1;
    });

    const priceTotalCaptionCell = sheet.getCell(`F${rowIndex}`);
    priceTotalCaptionCell.value = '報價合計：';

    const priceTotalCell = sheet.getCell(`G${rowIndex}`);
    priceTotalCell.value = Number(item.priceTotal.replaceAll(',', ''));
    priceTotalCell.numFmt = '###,##0';

    // 這個迭代開始的的row編號 + header佔的row數 + part的數量 + 與下一次迭代的間隔
    rowCount = rowCount + 4 + part.length + 1;
  });

  // -----------------------------------------------------------

  await workbook.xlsx.writeBuffer();

  // -----------------------------------------------------------
  // 表格裡面的資料都填寫完成之後，訂出下載的callback function
  // 異步的等待他處理完之後，創建url與連結，觸發下載
  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const id = quotationId;
    const today = Moment().format('yyyy-MM-DD');
    link.download = `${id}_${today}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });
};

// ==========================================================================

const excelKeyIndex = [
  //
  'indexNumber',
  'partName',
  'desc',
  'unit_str',
  'qty',
  'price',
  'totalPrice',
] as const;

const excelConfig = {
  indexNumber: {
    label: '項次',
    alignment: {
      horizontal: 'center',
    },
    headAlignment: {
      horizontal: 'left',
    },
  },
  partName: {
    label: '名稱',
    alignment: {
      horizontal: 'left',
    },
    headAlignment: {
      horizontal: 'left',
    },
  },
  desc: {
    label: '說明',
    alignment: {
      horizontal: 'left',
    },
    headAlignment: {
      horizontal: 'left',
    },
  },
  unit_str: {
    label: '單位',
    alignment: {
      horizontal: 'center',
    },
    headAlignment: {
      horizontal: 'center',
    },
  },
  qty: {
    label: '數量',
    alignment: {
      horizontal: 'right',
    },
    headAlignment: {
      horizontal: 'center',
    },
  },
  price: {
    label: '單價',
    alignment: {
      horizontal: 'right',
    },
    headAlignment: {
      horizontal: 'center',
    },
  },
  totalPrice: {
    label: '金額',
    alignment: {
      horizontal: 'right',
    },
    headAlignment: {
      horizontal: 'center',
    },
  },
} as const;

export { dlExcel };
