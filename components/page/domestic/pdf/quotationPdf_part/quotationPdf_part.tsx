import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ExcelJs from 'exceljs';
import Moment from 'moment';

// component
import Header from './header';
import Info from './info';
import Table from './table';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf_part.module.scss';

export default function QuotationPdf_part({
  isVisable,
  onCancel,

  mainProductArr,
  quotationId,
}: {
  isVisable: boolean;
  onCancel: () => void;
  mainProductArr: TmainProduct[];
  quotationId: string;
}) {
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    if (!isVisable || !refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    const doc = new jsPDF('p', 'px', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    for (item of refPdf.current) {
      if (!item) {
        continue;
      }

      const image = await html2canvas(item, {
        scale: 3,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/JPEG');

        return image;
      });

      if (!isFirst) {
        doc.addPage();
      }

      isFirst = false;
      // 留作參考
      // doc.addImage(image, "JPEG", 0, 0, 595, 842);
      // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
      doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
    }

    doc.save(`${quotationId}.pdf`);
    showRootLoading(false);
  };

  const dlExcel = async () => {
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

  // -------------------------------------------------------------------------

  // 如果發現有欄位裡的值有換行的情形，必須要調整欄位寬度或是調整演算法
  // 不然應該會跑版

  const partLimit = 52;
  const partLimit_afterPage1 = partLimit + 4; // 公司資訊(<Header/>)約佔4行多
  let partCount = 0;
  let arrIndex = 0;
  const chunkedList: TmainProduct[][] = [[]];

  mainProductArr.forEach((prod) => {
    const limit = arrIndex === 0 ? partLimit : partLimit_afterPage1;

    // +6是因為
    // 兩行基本資料
    // 一行thead
    // 一行報價合計
    // 一行空白分隔
    // +1 border的高度
    const partQty = prod.part.length + 6;

    if (partCount + partQty > limit) {
      partCount = partQty;
      arrIndex++;
      chunkedList[arrIndex] = [];
    } else {
      partCount += partQty;
    }

    chunkedList[arrIndex].push(prod);
  });

  // -------------------------------------------------------------------------
  return (
    <Modal
      className={scss.quotationPdf}
      // wrapClassName={style.modal}
      visible={isVisable}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered={true}
      width={'fit-content'}
    >
      <div className={scss.panel} id="">
        <div />
        <div className={scss.panelRight}>
          <button onClick={dlPdf}>
            <span>下載PDF</span>
          </button>
          <button onClick={dlExcel}>
            <span>下載EXCEL</span>
          </button>
        </div>
      </div>

      {chunkedList.map((chunk, index) => {
        return (
          <div className={scss.pdf} key={index} ref={(ele) => (refPdf.current[index] = ele)}>
            {/* {index !== 0 && <hr className={scss.hr} />} */}
            {index === 0 && <Header />}

            {chunk.map((prod, index) => {
              return (
                <div className={scss.part} key={index}>
                  <Info prodAllData={prod} quotationId={quotationId} />
                  <Table
                    partArr={prod.part}
                    priceTotal={prod.priceTotal} // 主產品 複價
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </Modal>
  );
}
// ========================================================================

// ==============================================================================
type TmainProduct = {
  quotationNumber: string;
  category: string;
  material: string;
  surface: string;
  doorType: string;
  size: string;
  priceTotal: string;
  part: Tpart[];
};

type TinfoKeyIndex = 'category' | 'material' | 'surface' | 'doorType' | 'size';
type TinfoConfig = {
  [key in TinfoKeyIndex]: { label: string };
};

const infoKeyIndex: TinfoKeyIndex[] = ['category', 'material', 'doorType', 'size'];
const infoConfig: TinfoConfig = {
  category: { label: '項目' },
  material: { label: '材質' },
  surface: { label: '表面' },
  doorType: { label: '門型' },
  size: { label: '尺寸' },
};

// ----------------------------------------

type Tpart = {
  partName: string; //名稱
  material: string;
  desc: string; // 說明
  // unit: string;
  unit: React.ReactNode; // 單位
  unit_str: string; // 單位
  qty: string; // 數量
  price: string; // 單價
  totalPrice: string; //金額
};

// type TkeyIndex = 'partName' | 'desc' | 'unit' | 'qty' | 'price' | 'totalPrice';
// type Tconfig = {
//   [key in TkeyIndex]: {
//     label: string;
//   };
// };

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

export type { TmainProduct, Tpart };
