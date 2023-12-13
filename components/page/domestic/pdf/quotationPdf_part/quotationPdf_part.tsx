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
    sheet.columns = [
      { width: 30 /*font: { size: 16 }*/ }, // 直接在這邊設定font不知道為什麼無效
      { width: 10 }, // 在google試算表裡10被換算為69
      { width: 20 },
      { width: 10 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
    ];
    sheet.columns.forEach((item) => (item.font = { size: 16 }));
    // -----------------------------------------------------------

    let rowCount = 1;

    mainProductArr.forEach((item) => {
      sheet.getRow(rowCount).font = { bold: true, size: 18 };
      sheet.getRow(rowCount + 3).font = { bold: true, size: 18 };

      const { part } = item;
      const slatIndex = part.findIndex((item) => {
        return item.partName === '捲門片';
      });
      part[slatIndex].unit = 'M2';

      const profileColumns = infoKeyIndex.map((key) => ({ name: infoConfig[key].label }));
      const profileRows = infoKeyIndex.map((key) => item[key]);
      sheet.addTable({
        name: 'profile',
        ref: `A${rowCount}`,
        style: {
          showFirstColumn: true,
        },
        columns: [{ name: '報價編號' }, ...profileColumns],
        rows: [[quotationId, ...profileRows]],
      });

      const partColumns = keyIndex.map((key) => ({ name: config[key].label }));

      console.log(part);

      const partRows = part.map((item) => {
        return keyIndex.map((key) => item[key]);
      });

      sheet.addTable({
        name: 'part',
        ref: `A${rowCount + 3}`,
        style: {
          showFirstColumn: true,
        },
        columns: partColumns,
        rows: partRows,
      });

      // 這個迭代開始的的row編號 + header佔的row數 + part的數量 + 與下一次迭代的間隔
      rowCount = rowCount + 4 + part.length + 3;
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

  const partLimit = 30;
  let partCount = 0;
  let arrIndex = 0;
  const chunkedList: TmainProduct[][] = [[]];

  mainProductArr.forEach((prod) => {
    const partQty = prod.part.length;

    if (partCount + partQty > partLimit) {
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
            {index !== 0 && <hr className={scss.hr} />}
            <Header />
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
