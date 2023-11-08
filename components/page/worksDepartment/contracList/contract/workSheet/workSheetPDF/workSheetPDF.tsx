import React, { useRef, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { download } from 'js/utils/downloadPdf.js';

// component
import Miku_frontend_table01, { Tcontrol_table01 } from 'components/otherProject/miku-frontend/Table01';

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './workSheetPDF.module.scss';

// =====================================================================

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
  itemArr: Tcontrol_table01[];
};

export type { Tcontrol as Tcontrol_workSheetPDF_01 };

// =====================================================================
export default function WorkSheetPDF({
  isShow,
  onCancel,
  control,
}: {
  isShow: boolean;
  onCancel: () => void;
  control: Tcontrol;
}) {
  // ---------------------------------------------------------------------

  const itemArr = control.itemArr;

  const chunkedList = _.chunk(itemArr, 3);

  // ---------------------------------------------------------------------

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    if (!isShow || !refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    // const doc = new jsPDF('l', 'px', 'a4');
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'px',
      format: 'a4',
      // userUnit: 300,
      // compress: false,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    for (item of refPdf.current) {
      if (!item) {
        continue;
      }

      const image = await html2canvas(
        item,
        {
          scale: 5,
        }
        // ,{
        //   useCORS: true,
        //   allowTaint: true,
        // }
      ).then((canvas) => {
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
      doc.addImage(image, 'png', 0, 0, pageWidth, pageHeight);
    }

    doc.save(`工作表${control.info.contractNumber}.pdf`);
    showRootLoading(false);
  };

  // ---------------------------------------------------------------------

  const pages = Math.ceil(control.itemArr.length / 3);

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

  // ---------------------------------------------------------------------
  return (
    <Modal
      //
      visible={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
      width={'auto'}
      // width={'420mm'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="下載PDF" onClick={dlPdf} />
      </div>

      {chunkedList.map((itemArr, index) => {
        return (
          <div key={index}>
            {index !== 0 && <hr className=" border-black" />}

            <div
              //
              ref={(ele) => (refPdf.current[index] = ele)}
              className={scss.container}
              id="report"
            >
              <div>
                <div className="text-2xl text-center pt-5 mb-1 relative">
                  <span>工作表</span>
                  <span className="absolute right-0">
                    {index + 1} / {chunkedList.length} 頁
                  </span>
                </div>

                <table className={classNames('w-full mb-1', scss.infoTable)}>
                  <tbody>
                    <tr>
                      <td>合約編號: {control.info.contractNumber}</td>
                      <td>客戶名稱: {control.info.customerName}</td>
                      <td>開單日期: {control.info.billingDate}</td>
                    </tr>
                    <tr>
                      <td>工程名稱: {control.info.projectName}</td>
                      <td>聯絡人: {control.info.contactPerson}</td>
                      <td>出貨日期: {control.info.shippingDate}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}>{`工程地點: ${control.info.projectAddress}`}</td>
                    </tr>
                  </tbody>
                </table>

                <div className={scss.itemGrid}>
                  {itemArr.map((control_item, index) => {
                    return (
                      <Fragment key={index}>
                        <Miku_frontend_table01 control={control_item} />
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
}

// =====================================================================
