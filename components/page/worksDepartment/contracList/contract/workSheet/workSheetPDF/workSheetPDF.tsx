import React, { useRef, Fragment } from 'react';
import classNames from 'classnames';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// component
import Miku_frontend_table01, { Tcontrol_table01 } from 'components/otherProject/miku-frontend/Table01';

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
    customerContactPerson: string;
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

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    // if (!isVisable || !refPdf.current[0]) {
    //   return;
    // }

    // showRootLoading(true, '正在處理PDF');

    const doc = new jsPDF('p', 'px', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    for (item of refPdf.current) {
      if (!item) {
        continue;
      }

      const image = await html2canvas(
        item
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
      doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
    }

    doc.save(`${'foo'}.pdf`);
    // showRootLoading(false);
  };

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
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="下載PDF" onClick={dlPdf} />
      </div>
      <div
        //
        ref={(ele) => (refPdf.current[0] = ele)}
        className={scss.container}
      >
        <div className="text-2xl text-center pt-5 mb-1">工作表</div>

        <table className={classNames('w-full', scss.infoTable)}>
          <tbody>
            <tr>
              <td>合約編號: {control.info.contractNumber}</td>
              <td>客戶名稱: {control.info.customerName}</td>
              <td>開單日期: {control.info.billingDate}</td>
            </tr>
            <tr>
              <td>工程名稱: {control.info.projectName}</td>
              <td>聯絡人: {control.info.customerContactPerson}</td>
              <td>出貨日期: {control.info.shippingDate}</td>
            </tr>
            <tr>
              <td colSpan={3}>{`工程地點: ${control.info.projectAddress}`}</td>
            </tr>
          </tbody>
        </table>
        <br />

        <div>
          {control.itemArr.map((control_item, index) => {
            return (
              <Fragment key={index}>
                <Miku_frontend_table01 control={control_item} />
              </Fragment>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

// =====================================================================
