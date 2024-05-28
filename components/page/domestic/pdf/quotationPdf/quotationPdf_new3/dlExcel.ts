import _ from 'lodash';
import ExcelJs from 'exceljs';
import moment from 'moment';

import { Tprod, TpdfData } from './modal_quotationPdf';

import { companyInfo } from 'config/companyInfo';

const dlExcel = async ({
  fileName,
  chunkedProdArr,
  // prodArr,
  data,
  excelRowMaxQty,
}: {
  fileName: string;
  chunkedProdArr: Tprod[][];
  // prodArr: Tprod[];
  data: TpdfData;
  excelRowMaxQty: number;
}) => {
  const {
    top: {
      contactPerson,
      customerName,
      contactNumber,
      faxNumber,
      quotationNumber,
      validityPeriod,
      quotationDate,
      projectName,
      projectWholeAddress,
      //
    },
    bottom: {
      subTotal,
      tax,
      total,
      total_chinese,
      deliveryLocation,
      deliveryDate,
      paymentMethods,
      notesArr,
      qrArr,
      agentName,
      //
      subTotal_num,
      tax_num,
      total_num,
    },
    // prodArr,
  } = data;

  // const chunkProdArr = _.chunk(prodArr, excelRowMaxQty);
  const chunkProdArr = chunkedProdArr; // chunkedProdArr的陣列長度限制為excelRowMaxQty

  let qrArr_formated = _.cloneDeep(qrArr);
  qrArr_formated = qrArr_formated.map((qr, index) => {
    return `${index + 1}. ` + qr;
  });

  if (paymentMethods.length > 4) {
    paymentMethods.splice(4);
  }

  const payWayArr_formated = paymentMethods.map((payway, index) => {
    const { value, label } = payway;

    if (!value) {
      return `           ${index + 1}. ${label} ________%`;
    } else {
      return `           ${index + 1}. ${label}      ${value}     %`;
    }
  });

  // -------------------------------------------------------------------

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

    const letterArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

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
    const rTbodyLatest = rTbody + excelRowMaxQty - 1;
    // const r12 = beginRow + 12;
    // const r24 = beginRow + 24;
    const rNotes = rThead + excelRowMaxQty + 1;
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
    B2O2.value = companyInfo.name;
    B2O2.alignment = { horizontal: 'center', vertical: 'top' };
    B2O2.font = { size: 16, bold: true };
    //
    const B3 = sheet.getCell(`B${r3}`);
    B3.value = `總公司工廠：${companyInfo.headOffice.wholeAddress}`;
    //
    const B4 = sheet.getCell(`B${r4}`);
    B4.value = `台北分公司：${companyInfo.taipeiOffice.wholeAddress}`;
    //
    const O3 = sheet.getCell(`O${r3}`);
    O3.value = `TEL：${companyInfo.headOffice.tel2}   FAX：${companyInfo.headOffice.fax}`;
    O3.alignment = { horizontal: 'right' };
    //
    const O4 = sheet.getCell(`O${r4}`);
    O4.value = `TEL：${companyInfo.taipeiOffice.tel2}   FAX：${companyInfo.taipeiOffice.fax}`;
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
    B11.value = `工程地點：${projectWholeAddress}`;

    const E9 = sheet.getCell(`E${r9}`);
    E9.value = `傳　　真：${faxNumber}`;

    const K7 = sheet.getCell(`K${r7}`);
    K7.value = `報價編號：${quotationNumber}`;
    const K8 = sheet.getCell(`K${r8}`);
    K8.value = `報價時效：${validityPeriod} 天內`;
    const K9 = sheet.getCell(`K${r9}`);
    K9.value = `報價日期：${quotationDate}`;

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
        itemName,
        // size,
        doorModelName,
        // materialName,
        thickness,
        materialSurface,
        guideRail,
        horsepower,
        closingType,
        qty,
        unitPrice,
        totalPrice,
        notes,
        //
        unitPrice_num,
        totalPrice_num,
        qty_num,
        guideRailForExcel,
      } = prod;

      // const doorRailUnicode

      let { size, materialName } = prod;

      size = size.replaceAll('Ｘ', ' x ');
      size = size.replaceAll('＋', ' + ');

      if (materialName.includes('鍍鋅')) {
        materialName = '鍍鋅';
      } else if (materialName.includes('#304')) {
        materialName = 'SST304#';
      } else if (materialName.includes('#316')) {
        materialName = 'SST316#';
      } else if (
        //
        materialName.includes('SST') &&
        !materialName.includes('304') &&
        !materialName.includes('316')
      ) {
        materialName = 'SST304#';
      }
      // else if (materialName === '黑鐵') {
      //   materialName = '鍍鋅';
      // }

      // const qty_num = Number(qty.replaceAll(',', ''));
      // const unitPrice_num = Number(unitPrice.replaceAll(',', ''));
      // const priceTotal_num = Number(priceTotal.replaceAll(',', ''));

      pageSubTotal = pageSubTotal + totalPrice_num;

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
      cellB.value = itemName;
      cellC.value = size;
      cellD.value = doorModelName;
      cellE.value = materialName;
      cellF.value = thickness;
      cellG.value = materialSurface;
      cellH.value = guideRailForExcel;
      cellI.value = horsepower;
      cellJ.value = closingType;
      cellK.value = qty_num;
      cellL.value = '樘';
      cellM.value = unitPrice_num;
      cellN.value = totalPrice_num;
      cellO.value = notes;

      const cellArr = [
        cellB,
        cellC,
        cellD,
        cellE,
        cellF,
        cellG,
        cellH,
        cellI,
        cellJ,
        cellK,
        cellL,
        cellM,
        cellN,
        cellO,
      ];

      cellArr.forEach((cell) => {
        cell.alignment.wrapText = true;
      });

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
    notesCell.value = notesArr.join('\n');
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
      taxCell.value = tax_num;

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
    cellTradingLocation.value = `      二、交貨地點：  ${deliveryLocation}`;

    const cellTradingDate = sheet.getCell(`J${rOther + 2}`);
    cellTradingDate.value = `      三、交貨日期：  ${deliveryDate}`;

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

    const today = moment().format('yyyy-MM-DD');
    link.download = `${fileName}_${today}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });

  //
  //
  //
};

export { dlExcel };
