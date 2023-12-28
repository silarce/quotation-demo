import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ExcelJs from 'exceljs';
import Moment from 'moment';

import _ from 'lodash';

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
    const foo = 1.10456536503; // 乘上這個值才會是excel上的寬度
    sheet.columns = [
      { width: 5.89 * foo },
      { width: 50 },
      { width: 20 },
      { width: 10 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
    ];
    // sheet.columns = [
    //   { width: 40 },
    //   { width: 50 },
    //   { width: 20 },
    //   { width: 10 },
    //   { width: 20 },
    //   { width: 25 },
    //   { width: 20 },
    // ];
    sheet.columns.forEach((item) => (item.font = { name: 'Calibri', size: 11 }));
    // -----------------------------------------------------------

    const rowCount = 1;
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
    //
    //
    //
    //
    //
    //
    // mainProductArr.forEach((item) => {
    //   sheet.getRow(rowCount).font = { bold: true, size: 18 };
    //   sheet.getRow(rowCount + 3).font = { bold: true, size: 18 };

    //   let { part } = item;

    //   part = part.map((item, index) => {
    //     if (item.unit === 'm2' || item.partName === '捲門片' || item.partName === '按裝及製造費用') {
    //       item.unit = 'M2';
    //     }

    //     return item;
    //   });

    //   const profileColumns = infoKeyIndex.map((key) => ({ name: infoConfig[key].label }));
    //   const profileRows = infoKeyIndex.map((key) => item[key]);
    //   sheet.addTable({
    //     name: 'profile',
    //     ref: `A${rowCount}`,
    //     style: {
    //       showFirstColumn: true,
    //     },
    //     columns: [{ name: '報價編號' }, ...profileColumns],
    //     rows: [[quotationId, ...profileRows]],
    //   });

    //   const partColumns = keyIndex.map((key) => ({ name: config[key].label }));

    //   const partRows = part.map((item) => {
    //     return keyIndex.map((key) => item[key]);
    //   });

    //   sheet.addTable({
    //     name: 'part',
    //     ref: `A${rowCount + 3}`,
    //     style: {
    //       showFirstColumn: true,
    //     },
    //     columns: partColumns,
    //     rows: partRows,
    //   });

    //   // 這個迭代開始的的row編號 + header佔的row數 + part的數量 + 與下一次迭代的間隔
    //   rowCount = rowCount + 4 + part.length + 3;
    // });

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
  partName: string;
  material: string;
  desc: string;
  // unit: string;
  unit: React.ReactNode;
  qty: string;
  price: string;
  totalPrice: string;
};

type TkeyIndex = 'partName' | 'desc' | 'unit' | 'qty' | 'price' | 'totalPrice';
type Tconfig = {
  [key in TkeyIndex]: {
    label: string;
  };
};

const keyIndex: TkeyIndex[] = ['partName', 'desc', 'unit', 'qty', 'price', 'totalPrice'];

const config: Tconfig = {
  partName: {
    label: '名稱',
  },
  desc: {
    label: '說明',
  },
  unit: {
    label: '單位',
  },
  qty: {
    label: '數量',
  },
  price: {
    label: '單價',
  },
  totalPrice: {
    label: '金額',
  },
};

export type { TmainProduct, Tpart };
