import React, { useState, useRef, Fragment } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';
import ExcelJs from 'exceljs';

// component
import Header from './header';
import Profile, { Tprofile } from './profile';
import Table, { TtableProdList, TtableProdListItem } from './table';
import Table_quoteTypeSum, { TquoteTypeSumList } from './table_quoteTypeSum';
import Total, { TmemoArr, Tsettlement } from './total';
import Other from './other';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf.module.scss';

// config
import { doorTrackLookup } from 'js/utils/options/doorTrackOptions';
import { findGuideRailUnicode } from 'config/product/lookup';

// type
import { TquotationContentDto } from 'js/api/api_quotation';
//
import { Class_product, Class_other } from 'hooks/quotation/useProduct';
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

import { optionsCreator_quotationStatus } from 'js/utils/options/options';

// ============================================================================

const quotationStatusLookup: { [key: string]: string } = {};
optionsCreator_quotationStatus().forEach((item) => {
  quotationStatusLookup[item.value] = item.label;
});

// ============================================================================
type TtableProdList_series = (TtableProdListItem & { series: string })[];

type Tcontrol_basicInfo = {
  quotationDate: string;
  quotationNumber: string;
  projectName: string;
  // quotationStatus: string;
  customerName: string;
  contactPerson: string;
  contactNumber: string;
  faxNumber: string;
  allAddress: string;
  subTotal: string;
  salesTax: string;
  total: string;
  agentName: string;
  tradingDate: string; // 交貨日期
  tradingLocation: string; // 交貨地點
  validityPeriod: string;
  payWayArr: { label: string; value: string }[];
};

type Tcontrol_prodArr = TtableProdList_series;

type Tcontrol_noteArr = string[];
type Tcontrol_qrArr = string[];

export type { Tcontrol_basicInfo, Tcontrol_prodArr, Tcontrol_noteArr, Tcontrol_qrArr };

// ============================================================================

export default function QuotationPdf({
  isVisable,
  onCancel,
  noteArr,
  qrArr,
  control_basicInfo,
  control_prodArr,
  isBidding,
}: {
  isVisable: boolean;
  onCancel: () => void;
  noteArr: Tcontrol_noteArr;
  qrArr: Tcontrol_qrArr;
  control_basicInfo: Tcontrol_basicInfo;
  control_prodArr: Tcontrol_prodArr;
  isBidding?: boolean;
}) {
  // const {
  //   quotationDate,
  //   quotationNumber,
  //   projectName,
  //   customerName,
  //   contactPerson,
  //   contactNumber,
  //   faxNumber,
  //   allAddress,
  //   subTotal: subTotal_f,
  //   salesTax,
  //   total: total_f,
  //   agentName,
  //   tradingDate,
  //   tradingLocation,
  //   validityPeriod,
  //   payWayArr,
  // } = control_basicInfo;
  const {
    quotationDate,
    quotationNumber,
    projectName,
    // quotationStatus,
    // customerName,
    // contactPerson,
    // contactNumber,
    // faxNumber,
    allAddress,
    subTotal: subTotal_f,
    salesTax,
    total: total_f,
    agentName,
    tradingDate,
    tradingLocation,
    validityPeriod,
    payWayArr,
  } = control_basicInfo;
  let { customerName, contactPerson, contactNumber, faxNumber } = control_basicInfo;

  if (isBidding) {
    customerName = '';
    contactPerson = '';
    contactNumber = '';
    faxNumber = '';
  }

  const productArr = control_prodArr;

  // const agentName = agentEmployee.chName;

  const [pdfType, setPdfType] = useState('typeA');

  // useEffect(() => {
  //   showRootLoading(true, "正在處理PDF")
  // }, [])

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
        // useCORS: true,
        // allowTaint: true,
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

    doc.save(`${quotationNumber}.pdf`);
    showRootLoading(false);
  };

  const dlExcel = async () => {
    // 一頁13列產品
    const prodQtyPerPage = 13;

    // console.log(control_prodArr);

    const {
      quotationDate,
      quotationNumber,
      projectName,
      // quotationStatus,
      customerName,
      contactPerson,
      contactNumber,
      faxNumber,
      allAddress,
      subTotal,
      salesTax,
      total,
      agentName,
      tradingDate,
      tradingLocation,
      validityPeriod,
      payWayArr,
    } = control_basicInfo;

    const subTotal_num = Number(subTotal.replaceAll(',', ''));
    const salesTax_num = Number(salesTax.replaceAll(',', ''));
    const total_num = Number(total.replaceAll(',', ''));

    const quotationDate_tw = (() => {
      const m_quotationDate = dayjs(quotationDate);
      const isValid = m_quotationDate.isValid();

      if (!isValid) {
        return '';
      } else {
        m_quotationDate.subtract(1911, 'year');

        return m_quotationDate.format('yy年MM月DD日');
      }
    })();

    const tradingDate_tw = (() => {
      const m_tradingDate = dayjs(tradingDate);
      const isValid = m_tradingDate.isValid();

      if (!isValid) {
        return '';
      } else {
        // m_tradingDate.subtract(1911, 'year');

        return m_tradingDate.format('yy年MM月DD日');
      }
    })();

    let qrArr_formated = _.cloneDeep(qrArr);
    qrArr_formated = qrArr_formated.map((qr, index) => {
      return `${index + 1}. ` + qr;
    });

    if (payWayArr.length > 4) {
      payWayArr.splice(4);
    }

    const payWayArr_formated = payWayArr.map((payway, index) => {
      const { value, label } = payway;

      if (!value) {
        return `           ${index + 1}. ${label} ________%`;
      } else {
        return `           ${index + 1}. ${label}      ${value}     %`;
      }
    });

    // -------------------------------------------------------------------
    const chunkProdArr = _.chunk(control_prodArr, prodQtyPerPage);

    // -------------------------------------------------------------------
    const workbook = new ExcelJs.Workbook();
    const sheetName = quotationNumber;
    const sheet = workbook.addWorksheet(sheetName, {
      pageSetup: {
        paperSize: 9, // A4 paper size
        orientation: 'portrait', // page orientation
        // showGridLines: true,
        // fitToPage: true, // fit to page
        // fitToWidth: 1, // fit to one page wide
        // fitToHeight: 0, // auto height
      },
    });

    // const worksheetWriter = workbookWriter.addWorksheet('sheet', {
    //   pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    // });

    // 之后调整页面设置配置
    sheet.pageSetup.margins = {
      left: 0.2,
      right: 0.2,
      top: 0.2,
      bottom: 0.2,
      header: 0.3,
      footer: 0.3,
    };

    // 打開excel右下方的視圖模式 設為"頁面配置"
    // 欄寬的單位就會是cm
    // 0.1"大約"等於0.02cm
    // 會有怎麼樣都無法調整到想要的公分值的情況

    // 調整欄寬時建議視圖模式不要用"標準"
    // 怪怪的

    // 這個放到最後再調整
    sheet.columns = [
      { width: 1 }, // A // 0.56
      { width: 7.6 }, // B // 6.33
      { width: 14.25 }, // C // 12.33
      // { width: 10.9 }, // D // 9.33
      // { width: 6.7 }, // E // 5.33
      { width: 8.9 }, // D // 8.14
      { width: 8.7 }, // E // 8
      { width: 6.1 }, // F // 4.89
      { width: 6.1 }, // G // 4.89
      { width: 6.1 }, // H // 4.89
      { width: 6.1 }, // I // 4.89
      { width: 7.6 }, // J // 6.33
      { width: 4.4 }, // K // 3.33
      { width: 2.9 }, // L // 1.89
      { width: 9.7 }, // M // 8.33
      { width: 11.5 }, // N // 9.89
      { width: 6.2 }, // O // 4.89
      { width: 0.65 }, // P // 0.38
    ];

    sheet.columns.forEach((item) => (item.font = { size: 11 }));

    //
    // 公司有些電腦的excel是2010版本
    // 在2010版本，同樣的height，呈現的列高不一樣
    // 所以要用這個方式來調整列高
    // const rowHeightAdjust = 1.25;
    const rowHeightAdjust = 1.05;

    // const rowHeight_pageDeparate = 20 * rowHeightAdjust;
    const rowHeight_pageDeparate = 15.8 * rowHeightAdjust;
    const rowHeight_companyName = 30 * rowHeightAdjust;
    const rowHeight_companyInfo = 15 * rowHeightAdjust;
    const rowHeight_hr = 5 * rowHeightAdjust;
    // const rowHeight_title = 30 * rowHeightAdjust;
    const rowHeight_title = 25 * rowHeightAdjust;
    const rowHeight_thead = 24.9 * rowHeightAdjust;
    const rowHeight_tbody = 20 * rowHeightAdjust;
    // const rowHeight_tbody = 19.9 * rowHeightAdjust;
    // const rowHeight_tbody = 16 * rowHeightAdjust;
    const rowHeight_notes = 14.1 * rowHeightAdjust;
    const rowHeight_total = 20.1 * rowHeightAdjust;

    // const rowHeight_otherFirstRow = 20.1 * rowHeightAdjust;
    const rowHeight_otherFirstRow = 18 * rowHeightAdjust;
    const rowHeight_other_beforePayWay = 13.5 * rowHeightAdjust;
    const rowHeight_other_payWay = 18 * rowHeightAdjust;
    const rowHeight_other_afterPayWay = 9.9 * rowHeightAdjust;
    const rowHeight_other_agent = 15 * rowHeightAdjust;

    // -----------------------------------------------------------

    // -----------------------------------------------------------

    //
    chunkProdArr.forEach((prodArr, index) => {
      const page = index + 1;

      const totalRowPerPage = 50;
      const notesRowQty = 10;
      const quotaionRangeRowQty = 12;

      const beginRow = index * totalRowPerPage;

      const letters = 'BCDEFGHIJKLMNO';
      const letterArr = letters.split('');

      //
      const r1 = beginRow + 1;
      const r2 = beginRow + 2;
      const r3 = beginRow + 3;
      const r4 = beginRow + 4;
      const r5 = beginRow + 5;
      const r6 = beginRow + 6;
      const r7 = beginRow + 7;
      const r8 = beginRow + 8;
      const r9 = beginRow + 9;
      const r10 = beginRow + 10;
      const r11 = r10 + 1;
      // const rThead = beginRow + 11;
      const rThead = r11 + 1;
      const rTbody = rThead + 1;
      const rTbodyLatest = rTbody + prodQtyPerPage - 1;
      // const r12 = beginRow + 12;
      // const r24 = beginRow + 24;
      const rNotes = rThead + prodQtyPerPage + 1;
      const rNotesLatest = rNotes + notesRowQty - 1;
      const rSubToTal = rNotesLatest + 1;
      const rTax = rSubToTal + 1;
      const rTotal = rSubToTal + 2;
      const rOther = rTotal + 1;
      const rQuotationRange = rOther + 1;
      const rQuotationRangeLatest = rQuotationRange + quotaionRangeRowQty - 2;

      const rPayWay = rOther + 4;
      const rAgent = rPayWay + 6;

      //
      const row1 = sheet.getRow(r1);
      row1.height = rowHeight_pageDeparate;
      //____________________________________________________
      const B2O2 = sheet.getCell(`B${r2}`);
      sheet.mergeCells(`B${r2}:O${r2}`);
      B2O2.value = '三久建材工業股份有限公司';
      B2O2.alignment = { horizontal: 'center', vertical: 'top' };
      B2O2.font = { size: 16, bold: true };
      //
      const B3 = sheet.getCell(`B${r3}`);
      B3.value = '總公司工廠：台中市霧峰區峰北路666號';
      //
      const B4 = sheet.getCell(`B${r4}`);
      B4.value = '台北分公司：台北市內湖路一段387巷5號2樓之2';
      //
      const O3 = sheet.getCell(`O${r3}`);
      O3.value = 'TEL：04-24069939(七線)   FAX：04-24069909';
      O3.alignment = { horizontal: 'right' };
      //
      const O4 = sheet.getCell(`O${r4}`);
      O4.value = 'TEL：02-26581508(三線)   FAX：02-26581507';
      O4.alignment = { horizontal: 'right' };
      //

      const row2 = sheet.getRow(r2);
      row2.height = rowHeight_companyName;
      const row3 = sheet.getRow(r3);
      row3.height = rowHeight_companyInfo;
      const row4 = sheet.getRow(r4);
      row4.height = rowHeight_companyInfo;

      //
      const row5 = sheet.getRow(r5);
      row5.height = rowHeight_hr;

      sheet.getCell(`O${r5}`).border = {
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
      };

      row5.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.border = {
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
          };
        }
      });

      //____________________________________________________
      const row6 = sheet.getRow(r6);
      row6.height = rowHeight_title;

      const B6O6 = sheet.getCell(`B${r6}`);
      sheet.mergeCells(`B${r6}:O${r6}`);
      B6O6.alignment = { horizontal: 'center', vertical: 'bottom' };
      B6O6.font = { size: 16, bold: true };
      B6O6.value = '報價單';

      //

      const B7 = sheet.getCell(`B${r7}`);
      B7.value = `A T T N ：${contactPerson}`;
      const B8 = sheet.getCell(`B${r8}`);
      B8.value = `客戶名稱：${customerName}`;
      const B9 = sheet.getCell(`B${r9}`);
      B9.value = `電　　話： ${contactNumber}`;
      const B10 = sheet.getCell(`B${r10}`);
      B10.value = `工程名稱：${projectName}`;
      const B11 = sheet.getCell(`B${r11}`);
      B11.value = `工程地點：${allAddress}`;

      const E9 = sheet.getCell(`E${r9}`);
      E9.value = `傳　　真：${faxNumber}`;

      const K7 = sheet.getCell(`K${r7}`);
      K7.value = `報價編號：${quotationNumber}`;
      const K8 = sheet.getCell(`K${r8}`);
      K8.value = `報價時效：${validityPeriod} 天內`;
      const K9 = sheet.getCell(`K${r9}`);
      K9.value = `報價日期：${quotationDate_tw}`;

      const O7 = sheet.getCell(`O${r7}`);
      O7.value = `頁次:${index + 1}/${chunkProdArr.length}`;
      O7.alignment = { horizontal: 'right' };
      // O7.font = { size: 9 };
      //____________________________________________________

      const headArr = [
        //
        '項目',
        '尺寸(單位:cm)',
        '門型',
        '材料',
        '厚度',
        '表面',
        '門軌',
        '馬力',
        '開閉方式',
        '數量',
        '',
        '單價',
        '複價',
        '備註',
      ];
      headArr.forEach((head, headIndex) => {
        const letter = letterArr[headIndex];
        const cell = sheet.getCell(`${letter}${rThead}`);
        cell.value = head;

        cell.alignment = { horizontal: 'center' };

        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };

        cell.font = { bold: true };

        if (headIndex === 0) {
          cell.border.left = { style: 'thin', color: { argb: '000000' } };
        }

        if (letter === 'J') {
          cell.font = { size: 8 };
        }

        return cell;
      });

      sheet.mergeCells(`K${rThead}:L${rThead}`);

      const rowThead = sheet.getRow(rThead);
      rowThead.height = rowHeight_thead;

      for (let i = rTbody; i <= rTbodyLatest; i++) {
        const row = sheet.getRow(i);
        row.height = rowHeight_tbody;
      }

      let pageSubTotal = 0;

      //
      prodArr.forEach((prod, prodRowIndex) => {
        prodRowIndex = prodRowIndex + 1;

        const {
          category,
          // size,
          doorType,
          thickness,
          surface,
          // doorRail,
          doorRailForExcel,
          horsepower,
          openType,
          qty,
          unitPrice,
          priceTotal,
          memo,
        } = prod;

        // const doorRailUnicode

        let { size, material } = prod;

        size = size.replaceAll('Ｘ', ' x ');
        size = size.replaceAll('＋', ' + ');

        if (material.includes('鍍鋅')) {
          material = '鍍鋅';
        } else if (material.includes('#304')) {
          material = 'SST304#';
        } else if (material.includes('#316')) {
          material = 'SST316#';
        } else if (
          //
          material.includes('SST') &&
          !material.includes('304') &&
          !material.includes('316')
        ) {
          material = 'SST304#';
        }
        // else if (material === '黑鐵') {
        //   material = '鍍鋅';
        // }

        const qty_num = Number(qty.replaceAll(',', ''));
        const unitPrice_num = Number(unitPrice.replaceAll(',', ''));
        const priceTotal_num = Number(priceTotal.replaceAll(',', ''));

        pageSubTotal = pageSubTotal + priceTotal_num;

        const [cellB, cellC, cellD, cellE, cellF, cellG, cellH, cellI, cellJ, cellK, cellL, cellM, cellN, cellO] =
          letterArr.map((letter, letterIndex) => {
            const cell = sheet.getCell(`${letter}${rThead + prodRowIndex}`);

            cell.font = { size: 10 };
            cell.alignment = { vertical: 'top' };

            cell.border = {
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } },
            };

            if (letterIndex === 0) {
              cell.border.left = { style: 'thin', color: { argb: '000000' } };
            }

            return cell;
          });
        cellB.value = category;
        cellC.value = size;
        cellD.value = doorType;
        cellE.value = material;
        cellF.value = thickness;
        cellG.value = surface;
        cellH.value = doorRailForExcel;
        cellI.value = horsepower;
        cellJ.value = openType;
        cellK.value = qty_num;
        cellL.value = '樘';
        cellM.value = unitPrice_num;
        cellN.value = priceTotal_num;
        cellO.value = memo;

        cellE.alignment.horizontal = 'center';
        cellF.alignment.horizontal = 'center';
        cellG.alignment.horizontal = 'center';
        cellH.alignment.horizontal = 'center';
        cellI.alignment.horizontal = 'center';
        cellJ.alignment.horizontal = 'center';
        cellO.alignment.horizontal = 'center';

        cellH.font = { size: 10 };

        cellM.numFmt = '###,##0';
        cellN.numFmt = '###,##0';

        cellK.border.right = undefined;
      });

      //____________________________________________________

      for (let i = rNotes; i <= rNotesLatest; i++) {
        const row = sheet.getRow(i);
        row.height = rowHeight_notes;
      }

      //

      const notesCaptionCell = sheet.getCell(`B${rNotes}`);
      notesCaptionCell.value = '備註：';
      // notesCaptionCell.border.top = { style: 'thin', color: { argb: '000000' } };
      notesCaptionCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
      };

      const notesCaptionLatestCell = sheet.getCell(`B${rNotesLatest}`);
      // notesCaptionLatestCell.border.bottom = { style: 'thin', color: { argb: '000000' } };
      notesCaptionLatestCell.border = {
        bottom: { style: 'thin', color: { argb: '000000' } },
      };

      for (let i = rNotes; i <= rNotesLatest; i++) {
        const cell = sheet.getCell(`B${i}`);

        if (!cell.border) {
          cell.border = {};
        }

        cell.border.left = {
          style: 'thin',
          color: { argb: '000000' },
        };
      }

      //
      const notesCell = sheet.getCell(`C${rNotes}`);
      sheet.mergeCells(`C${rNotes}:O${rNotesLatest}`);
      notesCell.value = noteArr.join('\n');
      notesCell.alignment = { vertical: 'top', wrapText: true };
      notesCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      notesCell.font = { size: 10 };

      //____________________________________________________

      const totalRowIndexArr = [rSubToTal, rTax, rTotal];

      totalRowIndexArr.forEach((totalRowIndex) => {
        const row = sheet.getRow(totalRowIndex);
        row.height = rowHeight_total;

        letterArr.forEach((letter, letterIndex) => {
          const cell = sheet.getCell(`${letter}${totalRowIndex}`);
          cell.border = {
            bottom: { style: 'thin', color: { argb: '000000' } },
          };

          if (letterIndex === 0) {
            cell.border.left = { style: 'thin', color: { argb: '000000' } };
          }

          if (letterIndex === letterArr.length - 1) {
            cell.border.right = { style: 'thin', color: { argb: '000000' } };
          }
        });

        const cellM = sheet.getCell(`M${totalRowIndex}`);
        cellM.border.right = { style: 'thin', color: { argb: '000000' } };
        const cellN = sheet.getCell(`N${totalRowIndex}`);
        cellN.border.right = { style: 'thin', color: { argb: '000000' } };
      });

      const subTotalCaptionCell = sheet.getCell(`B${rSubToTal}`);
      const subTotalCell = sheet.getCell(`N${rSubToTal}`);
      subTotalCell.numFmt = '###,##0';
      subTotalCell.font = { size: 10 };

      const taxCaptionCell = sheet.getCell(`B${rTax}`);
      const taxCell = sheet.getCell(`N${rTax}`);
      taxCell.numFmt = '###,##0';
      taxCell.font = { size: 10 };

      const totalCaptionCell = sheet.getCell(`B${rTotal}`);
      const totalCell = sheet.getCell(`N${rTotal}`);
      totalCell.numFmt = '###,##0';
      const totalChineseCell = sheet.getCell(`D${rTotal}`);
      sheet.mergeCells(`D${rTotal}:L${rTotal}`);
      totalCell.font = { size: 10 };

      totalChineseCell.alignment = { horizontal: 'right' };
      totalChineseCell.border.right = {
        style: 'thin',
        color: { argb: '000000' },
      };
      totalChineseCell.font = { size: 12 };

      if (page !== chunkProdArr.length) {
        subTotalCaptionCell.value = '　本頁合計';
        subTotalCell.value = pageSubTotal;
      } else {
        subTotalCaptionCell.value = `　小　　計  (共  ${chunkProdArr.length}  頁)`;
        subTotalCaptionCell.alignment = { wrapText: false };
        subTotalCell.value = subTotal_num;

        taxCaptionCell.value = '　營業稅5％';
        taxCell.value = salesTax_num;

        totalCaptionCell.value = '　總　　計   新台幣:';
        totalCaptionCell.alignment = { wrapText: false };
        totalCell.value = total_num;
        totalChineseCell.value = total_num;
        totalChineseCell.numFmt = '[DBNum2][$-404]General元整';

        sheet.getCell(`M${rTotal}`).value = '總金額';
        sheet.getCell(`M${rTotal}`).font = { size: 12 };
      }

      //____________________________________________________

      const rowOtherFirstRow = sheet.getRow(rOther);
      rowOtherFirstRow.height = rowHeight_otherFirstRow;

      for (let i = rQuotationRange; i <= rQuotationRangeLatest; i++) {
        const row = sheet.getRow(i);
        row.height = rowHeight_other_beforePayWay;
      }

      for (let i = rPayWay + 1; i <= rPayWay + 5; i++) {
        const row = sheet.getRow(i);
        row.height = rowHeight_other_payWay;
      }

      sheet.getRow(rPayWay + 5).height = rowHeight_other_afterPayWay;
      sheet.getRow(rAgent).height = rowHeight_other_agent;

      //

      const quotationRangeCaptionCell = sheet.getCell(`B${rOther}`);
      quotationRangeCaptionCell.value = '一、報價範圍';
      const cellQuotationRange = sheet.getCell(`B${rQuotationRange}`);
      sheet.mergeCells(`B${rQuotationRange}:H${rQuotationRangeLatest}`);
      cellQuotationRange.alignment = {
        vertical: 'top',
        wrapText: true,
      };
      cellQuotationRange.font = { size: 9 };
      cellQuotationRange.value = qrArr_formated.join('\n');

      //____________________________________________________
      const cellTradingLocation = sheet.getCell(`J${rOther}`);
      cellTradingLocation.value = `      二、交貨地點：  ${tradingLocation}`;

      const cellTradingDate = sheet.getCell(`J${rOther + 2}`);
      cellTradingDate.value = `      三、交貨日期：  ${tradingDate_tw}`;

      //____________________________________________________
      const cellPayWay = sheet.getCell(`J${rPayWay}`);
      cellPayWay.value = '      四、付款辦法：  ';

      payWayArr_formated.forEach((payWayStr, index) => {
        const cellPayWayContent = sheet.getCell(`J${rPayWay + index + 1}`);
        cellPayWayContent.value = payWayStr;
      });

      //____________________________________________________

      const cellAgent = sheet.getCell(`J${rAgent}`);
      cellAgent.value = `      經辦人： ${agentName}`;

      //
    }); // chunkProdArr.forEach close

    // -----------------------------------------------------------

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

      const id = quotationNumber;
      const today = dayjs().format('yyyy-MM-DD');
      link.download = `${id}_${today}.xlsx`;
      link.href = URL.createObjectURL(blobData);
      link.click();
      link.remove();
    });

    //
    //
    //
  };

  // ----------------------------------------------------------------------------
  // profile
  const profilePram: Tprofile = (() => {
    // const customerName = customer.name;

    // const dateString = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');
    const dateString = dayjs(quotationDate).subtract(1911, 'year').format('yy-MM-DD');

    return {
      quotationId: quotationNumber,
      // quotationStatus,
      clientName: customerName,
      contactPerson: contactPerson,
      contactPhone: contactNumber,
      fax: faxNumber ?? '',
      builtDate: dateString, // 報價日期
      // projectAddress: county + district + address,
      projectAddress: allAddress,
      projectName: projectName,
      validityPeriod: validityPeriod,
    };
  })();
  // -------------------------------
  // total
  const totalPram = (() => {
    const memoArr = noteArr;

    let subTotal = subTotal_f;
    let businessTax = salesTax;
    let total = total_f;

    subTotal = Number(subTotal.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });
    businessTax = Number(businessTax.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });
    total = Number(total.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });

    const settlement = {
      subTotal, //小計
      businessTax, //營業稅
      total, // 統計
    };

    return { memoArr, settlement };
  })();

  // -------------------------------
  // other
  const otherPram = (() => {
    const quoteRangeArr = qrArr;
    const attn = agentName;

    const payInfo = (() => {
      return {
        tradingLocation: tradingLocation,
        tradingDate: tradingDate, // 交貨日期
        payWay: payWayArr,
      };
    })();

    return { quoteRangeArr, payInfo, attn };
  })();

  // ----------------------------------------------------------------------------
  return (
    <Modal
      className={scss.quotationPdf}
      // wrapClassName={style.modal}
      open={isVisable}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered={true}
      width={'fit-content'}
      destroyOnHidden={true}
    >
      <div className={scss.panel}>
        <div className={scss.left}>
          <button
            className={pdfType === 'typeA' ? scss.active : ''}
            onClick={() => {
              setPdfType('typeA');
            }}
          >
            <span>typeA</span>
          </button>
          <button
            className={pdfType === 'typeB' ? scss.active : ''}
            onClick={() => {
              setPdfType('typeB');
            }}
          >
            <span>typeB</span>
          </button>
        </div>
        <div className={scss.right}>
          <button onClick={dlPdf}>
            <span>下載PDF</span>
          </button>
          <button onClick={dlExcel}>
            <span>下載Excel</span>
          </button>
        </div>
      </div>

      {pdfType === 'typeA' && (
        <PdfTypeA
          refPdf={refPdf}
          productArr={productArr}
          profilePram={profilePram}
          totalPram={totalPram}
          otherPram={otherPram}
        />
      )}
      {pdfType === 'typeB' && (
        <PdfTypeB
          refPdf={refPdf}
          productArr={productArr}
          profilePram={profilePram}
          totalPram={totalPram}
          otherPram={otherPram}
        />
      )}
    </Modal>
  );
}

// ========================================================================

const PdfTypeA = ({
  refPdf,
  productArr,
  profilePram,
  totalPram,
  otherPram,
}: {
  refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>;
  productArr: TtableProdList;
  profilePram: Tprofile;
  totalPram: {
    memoArr: TmemoArr;
    settlement: Tsettlement;
  };
  //
  otherPram: Parameters<typeof Other>[0];
}) => {
  const chunkedList: TtableProdList[] = [[]];

  const rowLimit = 12;
  const rowStrLengthLimit = 4; // 項目欄位只能容納四個中文字 六個英文字母
  let rowCount = 0;
  let arrIndex = 0;

  productArr.forEach((prod) => {
    let categoryStrLength = 0;
    let memoStrLength = 0;
    let doorTypeLength = 0;

    for (let i = 0; i < prod.category.length; i++) {
      const char = prod.category[i];

      if (
        // 如果字元是中文
        /[\u4e00-\u9fa5]/.test(char)
      ) {
        categoryStrLength += 1;
      } else if (
        // 如果字元是英文字母
        /[a-zA-Z]/.test(char)
      ) {
        categoryStrLength += 0.66; // 一個英文字母約是0.66個中文字寬
      }
    }

    for (let i = 0; i < prod.memo.length; i++) {
      const char = prod.memo[i];

      if (
        // 如果字元是中文
        /[\u4e00-\u9fa5]/.test(char)
      ) {
        memoStrLength += 1;
      } else if (
        // 如果字元是英文字母
        /[a-zA-Z]/.test(char)
      ) {
        memoStrLength += 0.66;
      }
    }

    for (let i = 0; i < prod.doorType.length; i++) {
      const char = prod.doorType[i];

      if (
        // 如果字元是中文
        /[\u4e00-\u9fa5]/.test(char)
      ) {
        doorTypeLength += 1;
      } else if (
        // 如果字元是英文字母
        /[a-zA-Z]/.test(char)
      ) {
        doorTypeLength += 0.66;
      }
    }

    const categoryStrRowCount = Math.ceil(categoryStrLength / 4) || 1; // 一行容納四個中文
    const memoStrRowCount = Math.ceil(memoStrLength / 3) || 1; // 一行容納三個中文
    const doorTypeRowCount = Math.ceil(doorTypeLength / 5) || 1; // 一行容納五個中文

    const rowQty = Math.max(categoryStrRowCount, memoStrRowCount, doorTypeRowCount);

    if (rowCount + rowQty > rowLimit) {
      rowCount = rowQty;
      arrIndex++;
      chunkedList[arrIndex] = [];
    } else {
      rowCount += rowQty;
    }

    chunkedList[arrIndex].push(prod);
  });

  const pageCount = chunkedList.length;

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 每一頁 */}
      {chunkedList.map((chunk, index) => {
        let subTotal_page_Decimal = new Decimal(0);
        chunk.forEach((item) => {
          const priceTotal = item.priceTotal.replaceAll(',', '');
          subTotal_page_Decimal = subTotal_page_Decimal.add(priceTotal || 0);
        });

        const subTotal_page = subTotal_page_Decimal.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 });

        return (
          <Fragment key={index}>
            {index !== 0 && <hr className={scss.hr} />}
            <div
              className={`${scss.pdf} ${scss.spaceBetween}`}
              ref={(ele) => {
                refPdf.current[index] = ele;
              }}
            >
              <div>
                <Header />
                <Profile profileData={profilePram} index={index + 1} pageCount={pageCount} />
                <Table productList={chunk} />
              </div>
              <div>
                <Total
                  //
                  memoArr={totalPram.memoArr}
                  settlement={totalPram.settlement}
                  page={index + 1}
                  totalPage={pageCount}
                  subTotal_page={subTotal_page}
                />
                <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
              </div>
            </div>
          </Fragment>
        );
      })}
      {chunkedList.length === 0 && (
        <Fragment>
          <div
            className={`${scss.pdf} ${scss.spaceBetween}`}
            ref={(ele) => {
              refPdf.current[0] = ele;
            }}
          >
            <div>
              <Header />
              <Profile profileData={profilePram} index={1} pageCount={pageCount} />
            </div>
            <div>
              <Total
                //
                memoArr={totalPram.memoArr}
                settlement={totalPram.settlement}
                page={1}
                totalPage={pageCount}
              />
              <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

// ========================================================================
const PdfTypeB = ({
  refPdf,
  productArr,
  profilePram,
  totalPram,
  otherPram,
}: {
  refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>;
  productArr: TtableProdList_series;
  profilePram: Tprofile;
  totalPram: {
    memoArr: TmemoArr;
    settlement: Tsettlement;
  };
  otherPram: Parameters<typeof Other>[0];
}) => {
  const chunkedList = chunkProdArr({ productArr, rowLimit: 35 });
  const pageCount = chunkedList.length + 1;
  // --------------------------------------------------------------------------

  // 根據series(門型類型)分類，計算樘數、總單價金額、總複價功能
  const quoteTypeSumObj: TquoteTypeSumList = {};
  productArr.forEach((prod) => {
    const { series, qty, unitPrice, priceTotal } = prod;
    const key = series;

    if (!quoteTypeSumObj[key]) {
      quoteTypeSumObj[key] = {
        series: series,
        qtySum: 0,
        unitPriceSum: 0,
        priceTotleSum: 0,
      };
    }

    quoteTypeSumObj[key].qtySum = quoteTypeSumObj[key].qtySum + parseInt(qty);
    quoteTypeSumObj[key].unitPriceSum = new Decimal(quoteTypeSumObj[key].unitPriceSum)
      .plus(unitPrice.replaceAll(',', '') || 0)
      .toNumber();
    quoteTypeSumObj[key].priceTotleSum = new Decimal(quoteTypeSumObj[key].priceTotleSum)
      .plus(priceTotal.replaceAll(',', '') || 0)
      .toNumber();
  });

  const quoteTypeSumArr = Object.values(quoteTypeSumObj);

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 第一頁 */}
      <div
        className={`${scss.pdf} ${scss.spaceBetween}`}
        ref={(ele) => {
          refPdf.current[0] = ele;
        }}
      >
        <div>
          <Header />
          <Profile profileData={profilePram} index={1} pageCount={pageCount} />
          <Table_quoteTypeSum quoteTypeSumArr={quoteTypeSumArr} />
        </div>
        <div>
          <Total
            //
            memoArr={totalPram.memoArr}
            settlement={totalPram.settlement}
            page={1}
            totalPage={pageCount}
          />
          <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
        </div>
      </div>
      {/* 第一頁之後 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            <hr className={scss.hr} />
            <div
              className={scss.pdf}
              ref={(ele) => {
                refPdf.current[index + 1] = ele;
              }}
            >
              <Header />
              <Profile profileData={profilePram} index={index + 2} pageCount={pageCount} />
              <Table productList={chunk} />
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

// ========================================================================

const chunkProdArr = ({ productArr, rowLimit }: { productArr: TtableProdList; rowLimit: number }) => {
  const chunkedList: TtableProdList[] = [[]];

  // const rowLimit = 12;
  const rowStrLengthLimit = 4; // 項目欄位只能容納四個中文字 六個英文字母
  let rowCount = 0;
  let arrIndex = 0;

  productArr.forEach((prod) => {
    let categoryStrLength = 0;
    let memoStrLength = 0;

    for (let i = 0; i < prod.category.length; i++) {
      const char = prod.category[i];

      if (
        // 如果字元是中文
        /[\u4e00-\u9fa5]/.test(char)
      ) {
        categoryStrLength += 1;
      } else if (
        // 如果字元是英文字母
        /[a-zA-Z]/.test(char)
      ) {
        categoryStrLength += 0.66; // 一個英文字母約是0.66個中文字寬
      }
    }

    for (let i = 0; i < prod.memo.length; i++) {
      const char = prod.memo[i];

      if (
        // 如果字元是中文
        /[\u4e00-\u9fa5]/.test(char)
      ) {
        memoStrLength += (1 * 4) / 3; // 乘4除3是因為備註欄為只能容納3個中文字
      } else if (
        // 如果字元是英文字母
        /[a-zA-Z]/.test(char)
      ) {
        memoStrLength += (0.66 * 4) / 3; // 乘4除3是因為備註欄為只能容納3個中文字
      }
    }

    const length = categoryStrLength > memoStrLength ? categoryStrLength : memoStrLength;

    const rowQty = Math.ceil(length / rowStrLengthLimit) || 1;

    if (rowCount + rowQty > rowLimit) {
      rowCount = rowQty;
      arrIndex++;
      chunkedList[arrIndex] = [];
    } else {
      rowCount += rowQty;
    }

    chunkedList[arrIndex].push(prod);
  });

  return chunkedList;
};

// ========================================================================

const emptyBasicInfo = (): Tcontrol_basicInfo => {
  return {
    quotationDate: '',
    quotationNumber: '',
    projectName: '',
    // quotationStatus: '',
    customerName: '',
    contactPerson: '',
    contactNumber: '',
    faxNumber: '',
    allAddress: '',
    subTotal: '',
    salesTax: '',
    total: '',
    agentName: '',
    tradingDate: '',
    tradingLocation: '',
    validityPeriod: '',
    payWayArr: [],
  };
};

// 專門給報價單使用的
const quotationContentToBasicInfo = (quotationContent: TquotationContentDto | undefined): Tcontrol_basicInfo => {
  if (!quotationContent) {
    return emptyBasicInfo();
  }

  const {
    quotationDate,
    quotationNumber,
    projectName,
    status,
    customer,
    contactPerson,
    contactNumber,
    faxNumber,
    county,
    district,
    address,
    subTotal,
    salesTax,
    total,
    agentEmployee,

    deliveryDate,
    deliveryLocation,
    paymentMethods,
    validityPeriod,
  } = quotationContent;

  const payWayArr = paymentMethods.map((item) => {
    let value = item.totalPaymentRatio;

    if (value === '0') {
      value = '';
    }

    return {
      value,
      label: item.milestone,
    };
  });

  // const quotationStatus = quotationStatusLookup[status] ?? '';

  const customerName = customer?.name ?? '';
  const agentName = agentEmployee?.chName ?? '';

  const allAddress = county + district + address;

  const tradingDate = dayjs(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

  const control_basicInfo: Tcontrol_basicInfo = {
    quotationDate,
    quotationNumber,
    projectName,
    // quotationStatus,
    customerName,
    contactPerson,
    contactNumber,
    faxNumber,
    allAddress,
    subTotal: String(subTotal),
    salesTax: String(salesTax),
    total: String(total),
    agentName,
    tradingDate,
    tradingLocation: deliveryLocation,
    validityPeriod,
    payWayArr,
  };

  return control_basicInfo;
};

// 專門給報價單使用的 // 好像沒有在用
const quotationProdToTableProdList = ({
  classProductArr,
  classOthersArr,
}: {
  classProductArr: Class_product[];
  classOthersArr: Class_other[];
}): Tcontrol_prodArr => {
  const productArr: TtableProdList_series = (() => {
    return classProductArr.map((prod) => {
      const { typhoonProtection, doorTrackSilencerStrip, doorType, doorTrack } = prod;

      const fullWidth = new Decimal(prod.fullWidth || 0).mul(100).toNumber();
      const height = new Decimal(prod.height || 0).mul(100).toNumber();
      const boxB = new Decimal(prod.boxB || 0).mul(100).toNumber();
      const bounceDoorWidth = prod.bounceDoorWidth_cm || '';

      const boxB_formated = boxB ? `＋${boxB}` : '';
      const bounceDoorWidth_formated = bounceDoorWidth ? `＋${bounceDoorWidth}` : '';

      const size = `${fullWidth}${bounceDoorWidth_formated}Ｘ${height}${boxB_formated}`;

      const thickness_num = Number(prod.thickness.replaceAll('t', ''));
      const thickness_str = thickness_num === 0 ? '' : new Decimal(thickness_num).toFixed(1) + 't';

      let material = prod.material;

      const doorRailForExcel = (() => {
        const guideRailName = doorTrack?.replace('.svg', '').toUpperCase();
        console.log('doorTrack', doorTrack);
        console.log('guideRailName', guideRailName);

        return guideRailName ? findGuideRailUnicode({ guideRail: guideRailName }) : '';
      })();

      // const doorRailForExcel =
      //   doorType !== 'SJ-302'
      //     ? ''
      //     : findGuideRailUnicode({
      //         isAntiTyphoon: typhoonProtection,
      //         isSilencing: doorTrackSilencerStrip,
      //       });

      // 曉君要求，當材料為高耐鍍鋅鋼板時只要顯示鍍鋅鋼板
      // 21204-04-12 材料為鐵材烤漆(value為黑鐵)時，也視為鍍鋅鋼板
      if (material === '高耐鍍鋅鋼板' || material === '黑鐵') {
        material = '鍍鋅鋼板';
      }

      return {
        category: prod.itemName,
        size,
        doorType: prod.doorType,
        material: material,
        thickness: thickness_str,
        surface: prod.surface,
        doorRail: `${prod.doorTrack}`,
        horsepower: prod.horsepower,
        openType: prod.close,
        qty: prod.quantity,
        unitPrice: prod.unitPrice,
        priceTotal: prod.totalPrice,
        memo: prod.notes,
        series: prod.doorType,
        //
        doorRailForExcel: doorRailForExcel,
      };
    });
  })();

  const othersArr: TtableProdList_series = classOthersArr.map((item, index) => {
    return {
      category: String(index + 1),
      size: item.item,
      doorType: item.description,
      material: '',
      thickness: '',
      surface: '',
      doorRail: '',
      horsepower: '',
      openType: '',
      qty: String(item.quantity),
      unitPrice: item.unitPrice_locale,
      priceTotal: item.totalPrice_locale,
      memo: item.notes,
      series: '其他',
    };
  });

  return [...productArr, ...othersArr];
};

// 舊合約專用
const legacyContractToBasicInfo = ({
  classLegacyContract,
  agentName,
}: {
  classLegacyContract: Class_legacyContract;
  agentName: string;
}): Tcontrol_basicInfo => {
  if (!classLegacyContract) {
    return emptyBasicInfo();
  }

  const { classBasicInfo } = classLegacyContract;

  const {
    contractNumber,
    customerName,
    contactPerson,
    contactNumber,
    faxNumber,
    // quoteDate,
    projectCity,
    projectDistrict,
    projectAddress,
    projectName,
  } = classBasicInfo;

  const { subTotal, salesTax, total } = classLegacyContract?.classPayInfo ?? {};

  const { deliveryLocation, deliveryDate, paymentMethods } = classLegacyContract.classPayInfo;

  const payWayArr = paymentMethods.map((item) => {
    let value = item.totalPaymentRatio;

    if (value === '0') {
      value = '';
    }

    return {
      value,
      label: item.milestone,
    };
  });

  const allAddress = projectCity + projectDistrict + projectAddress;

  const tradingDate = dayjs(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

  const control_basicInfo: Tcontrol_basicInfo = {
    quotationDate: '', // 舊合約沒有報價日期
    quotationNumber: contractNumber,
    projectName,
    // quotationStatus: '舊合約',
    customerName,
    contactPerson,
    contactNumber,
    faxNumber: faxNumber ?? '',
    allAddress,
    subTotal: subTotal,
    salesTax: salesTax,
    total: total,
    agentName,
    tradingDate,
    tradingLocation: deliveryLocation,
    validityPeriod: '', // 舊合約沒有報價時效
    payWayArr,
  };

  return control_basicInfo;
};

// 舊合約專用
const legacyContractToTableProdList = ({
  // 其實可以直接帶資料進來，但是為了避免有失誤，還是先直接複製原本的quotationPdf_legacyContract
  classLegacyContract,
  verticalKeyArr,
  verticalKeyArr_addi,
}: {
  classLegacyContract: Class_legacyContract;
  verticalKeyArr: string[];
  verticalKeyArr_addi: string[];
}): Tcontrol_prodArr => {
  //
  //
  //
  //

  const productArr: TtableProdList_series = (() => {
    const prodList = classLegacyContract.prodList;

    let arr = verticalKeyArr.map((key) => {
      const prod = prodList[key];

      if (!prod) {
        return null;
      }

      const lw = new Decimal(Number(prod?.width || 0) || Number(prod?.length || 0)).mul(100).toString();
      const h = new Decimal(Number(prod?.height || 0)).mul(100).toString();
      const b = new Decimal(Number(prod?.boxB || 0)).mul(100).toNumber();

      const size = `${lw} X ${h} ${b ? `+ ${b}` : ''}`;

      const thickness_num = Number(prod.thickness.replaceAll('t', ''));
      const thickness_str = thickness_num === 0 ? '' : thickness_num.toFixed(1) + 't';

      return {
        category: prod.itemName,
        size,
        doorType: prod.doorType,
        material: prod.material,
        // thickness: prod.thickness,
        // thickness: prod.thickness === '0' ? '' : prod.thickness + 't',
        thickness: thickness_str,
        surface: prod.surface,
        doorRail: doorTrackLookup[prod.doorTrack]?.icon,
        horsepower: prod.horsepower,
        openType: prod.closingType,
        qty: prod.quantity,
        unitPrice: prod.unitPrice_locale,
        priceTotal: prod.totalPrice,
        memo: prod.notes,
        series: prod.itemName,
        //
        // 舊合約沒有消音條參數，不能取得正確的doorRailForExcel
        // doorRailForExcel: doorTrackLookup[prod.doorTrack]?.excel,
        doorRailForExcel: prod.doorTrack,
      };
    });

    arr = arr.filter((item) => !!item);

    return arr as TtableProdList_series;
  })();

  const { additionList } = classLegacyContract;

  const addiArr: TtableProdList_series = (() => {
    let addiArr: (TtableProdList_series[number] | null)[] = verticalKeyArr_addi.map((key, index) => {
      const addi = additionList[key];

      if (!addi) {
        return null;
      }

      return {
        category: String(index + 1),
        size: addi.itemName,
        doorType: addi.content,
        material: '',
        thickness: '',
        surface: '',
        doorRail: '',
        horsepower: '',
        openType: '',
        qty: addi.quantity,
        unitPrice: addi.unitPrice_locale,
        priceTotal: addi.totalPrice,
        memo: addi.notes,
        series: '其他',
      };
    });
    addiArr = addiArr.filter((item) => !!item);

    return addiArr as TtableProdList_series;
  })();

  return [...productArr, ...addiArr];
};

export {
  quotationContentToBasicInfo,
  quotationProdToTableProdList,
  legacyContractToBasicInfo,
  legacyContractToTableProdList,
};

// =================================================================
