import React, { useRef, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { download } from 'js/utils/downloadPdf.js';

// component
import Miku_frontend_table02, { Tcontrol_table02 } from 'components/otherProject/miku-frontend/Table02';

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './workSheetPDF.module.scss';

// import { downloadExcel } from '../downloadExcel';

// =====================================================================

// type Tcontrol = {
//   info: {
//     contractNumber: string;
//     projectName: string;
//     projectAddress: string;
//     customerName: string;
//     contactPerson: string;
//     // 開單日期
//     billingDate: string;
//     // 出貨日期
//     shippingDate: string;
//   };
//   itemArr: Tcontrol_table01[];
// };

export type { Tcontrol_table02 as Tcontrol_workSheetPDF_02 };

// =====================================================================
export default function WorkSheetPDF_02({
  isShow,
  onCancel,
  control,
}: {
  isShow: boolean;
  onCancel: () => void;
  control: Tcontrol_table02;
}) {
  // ---------------------------------------------------------------------

  const itemArr = control.itemArr;

  // const chunkedList = _.chunk(itemArr, 3);

  // ---------------------------------------------------------------------

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  // const dlPdf = async () => {
  //   if (!isShow || !refPdf.current[0]) {
  //     return;
  //   }

  //   showRootLoading(true, '正在處理PDF');

  //   // const doc = new jsPDF('l', 'px', 'a4');
  //   const doc = new jsPDF({
  //     orientation: 'l',
  //     unit: 'px',
  //     format: 'a4',
  //     // userUnit: 300,
  //     // compress: false,
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   let isFirst = true;
  //   let item;

  //   for (item of refPdf.current) {
  //     if (!item) {
  //       continue;
  //     }

  //     const image = await html2canvas(
  //       item,
  //       {
  //         scale: 5,
  //       }
  //       // ,{
  //       //   useCORS: true,
  //       //   allowTaint: true,
  //       // }
  //     ).then((canvas) => {
  //       const image = canvas.toDataURL('image/JPEG');

  //       return image;
  //     });

  //     if (!isFirst) {
  //       doc.addPage();
  //     }

  //     isFirst = false;
  //     // 留作參考
  //     // doc.addImage(image, "JPEG", 0, 0, 595, 842);
  //     // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
  //     doc.addImage(image, 'png', 0, 0, pageWidth, pageHeight);
  //   }

  //   doc.save(`廠務部工作表${''}.pdf`);
  //   showRootLoading(false);
  // };

  // ---------------------------------------------------------------------

  // const pages = Math.ceil(control.itemArr.length / 3);

  // const exportPDF = () => {
  //   const report = document.getElementById('report');

  //   const svgElements = document.body.querySelectorAll('svg');
  //   svgElements.forEach(function (item) {
  //     item.setAttribute('width', item.getBoundingClientRect().width.toString());
  //     item.setAttribute('height', item.getBoundingClientRect().height.toString());
  //     item.style.width = '';
  //     item.style.height = '';
  //   });

  //   html2canvas(report!, {
  //     scale: 2,
  //   }).then((canvas) => {
  //     const pdf = new jsPDF('landscape', 'mm', 'a3');
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     const imageWidth = canvas.width;
  //     const imageHeight = canvas.height;
  //     const w = report!.clientWidth;
  //     const h = report!.clientHeight / pages;

  //     console.log(pageWidth, pageHeight, imageWidth, imageHeight, w, h);

  //     for (let i = 0; i < pages; i++) {
  //       const onePageCanvas = document.createElement('canvas');
  //       onePageCanvas.setAttribute('width', imageWidth.toString());
  //       onePageCanvas.setAttribute('height', (imageHeight / pages).toString());

  //       const sX = 0;

  //       const sY = (imageHeight / pages) * i;
  //       // const sY = 0;

  //       const sWidth = imageWidth;

  //       const sHeight = imageHeight / pages;

  //       const dX = 0;

  //       const dY = 0;

  //       const dWidth = imageWidth;

  //       const dHeight = imageHeight / pages;

  //       const ctx = onePageCanvas.getContext('2d');
  //       ctx?.drawImage(canvas, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

  //       const canvasDataURL = onePageCanvas.toDataURL('image/png', 1.0);

  //       const ratio = pageWidth / imageWidth;
  //       pdf.addImage(canvasDataURL, 'PNG', 0, 0, imageWidth * ratio, (imageHeight / pages) * ratio);

  //       if (i !== pages - 1) {
  //         pdf.addPage();
  //       }
  //     }

  //     pdf.save(`${''} 工作表.pdf`);
  //   });
  // };

  const exportPDF2 = () => {
    const report = document.getElementById('report2');

    const svgElements = document.body.querySelectorAll('svg');
    svgElements.forEach(function (item) {
      item.setAttribute('width', item.getBoundingClientRect().width.toString());
      item.setAttribute('height', item.getBoundingClientRect().height.toString());
      item.style.width = '';
      item.style.height = '';
    });

    html2canvas(report!, {
      scale: 2,
    }).then((canvas) => {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const w = report!.clientWidth;
      const h = report!.clientHeight / pages2;

      console.log(pageWidth, pageHeight, imageWidth, imageHeight, w, h);

      for (let i = 0; i < pages2; i++) {
        const onePageCanvas = document.createElement('canvas');
        onePageCanvas.setAttribute('width', imageWidth.toString());
        onePageCanvas.setAttribute('height', (imageHeight / pages2).toString());

        const sX = 0;

        const sY = (imageHeight / pages2) * i;

        const sWidth = imageWidth;

        const sHeight = imageHeight / pages2;

        const dX = 0;

        const dY = 0;

        const dWidth = imageWidth;

        const dHeight = imageHeight / pages2;

        const ctx = onePageCanvas.getContext('2d');
        ctx?.drawImage(canvas, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

        const canvasDataURL = onePageCanvas.toDataURL('image/png', 1.0);

        const ratio = pageWidth / imageWidth;
        pdf.addImage(canvasDataURL, 'PNG', 0, 0, imageWidth * ratio, (imageHeight / pages2) * ratio);

        if (i !== pages2 - 1) {
          pdf.addPage();
        }
      }

      pdf.save(`${''} 廠務部工作表.pdf`);
    });
  };

  // ---------------------------------------------------------------------
  const pages2 = Math.ceil(itemArr.length / 7);

  // ---------------------------------------------------------------------
  return (
    <Modal
      //
      visible={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnHidden={true}
      width={'auto'}
      // width={'420mm'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="下載PDF" onClick={exportPDF2} />
        {/* <MyButton_v2 label="下載PDF" onClick={() => download()} /> */}
        {/* <MyButton_v2 label="下載PDF" onClick={() => exportPDF()} /> */}
        {/* <MyButton_v2
          label="下載EXCEL"
          onClick={() => {
            downloadExcel(control, 'foo');
          }}
        /> */}
      </div>

      <div id="report2" style={{ width: '297mm' }} className="pt-5 mx-5">
        {Array(pages2)
          .fill(null)
          .map((item, pageIndex) => (
            <div className="mb-5" key={pageIndex} style={{ width: '297mm', height: '210mm' }}>
              <Miku_frontend_table02 index={pageIndex} control={control} />
            </div>
          ))}
      </div>
    </Modal>
  );
}

// =====================================================================
