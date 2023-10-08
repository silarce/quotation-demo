import React, { useState, useRef, Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

// component
import Header from './header';
import Profile, { Tprofile } from './profile';
import Table, { TtableProdList } from './table';
import Table_quoteTypeSum, { TquoteTypeSumList } from './table_quoteTypeSum';
import Total from './total';
import Other from './other';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf.module.scss';

// type
import { Class_product } from 'hooks/quotation/classProduct';

import { TquotationContentDto } from 'js/api/api_quotation';

type TtableProdList_series = (TtableProdList[number] & { series: string })[];

export default function QuotationPdf({
  isVisable,
  onCancel,

  productArr_f,
  basicInfo,
  noteArr,
  qrArr,
}: {
  isVisable: boolean;
  onCancel: () => void;
  productArr_f: Class_product[];
  basicInfo: TquotationContentDto;
  noteArr: string[];
  qrArr: string[];
}) {
  const { quotationNumber } = basicInfo;

  const {
    // customerName,
    customer,
    contactPerson,
    contactNumber,
    faxNumber,
    county,
    district,
    address,
    subTotal: subTotal_f,
    salesTax,
    total: total_f,
    agentEmployee,

    deliveryDate,
    deliveryLocation,
    paymentMethods,
  } = basicInfo;

  const agentName = agentEmployee.chName;

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

      const image = await html2canvas(item).then((canvas) => {
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

  // ----------------------------------------------------------------------------
  // profile
  const profilePram: Tprofile = (() => {
    const customerName = customer.name;

    const dateString = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

    return {
      quotationId: contactPerson,
      clientName: customerName,
      contactPerson: contactPerson,
      contactPhone: contactNumber,
      fax: faxNumber ?? '',
      builtDate: dateString,
      projectAddress: county + district + address,
    };
  })();
  // -------------------------------
  // total
  const totalPram = (() => {
    const memoArr = noteArr;

    let subTotal = String(subTotal_f);
    let businessTax = String(salesTax);
    let total = String(total_f);

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
      const payWay = paymentMethods.map((item) => ({
        label: item.milestone,
        value: item.totalPaymentRatio,
      }));

      const tradingDate = deliveryDate ? moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD') : '------';

      return {
        tradingLocation: deliveryLocation,
        tradingDate: tradingDate,
        payWay,
      };
    })();

    return { quoteRangeArr, payInfo: payInfo!, attn };
  })();

  const productArr: TtableProdList_series = (() => {
    return productArr_f.map((prod) => {
      // const lw = (Number(prod.WG) || Number(prod.fullWidth)) * 100;
      const lw = Number(prod.fullWidth || 0) * 100;
      const h = Number(prod.height) * 100;
      const b = Number(prod.thickness) * 100;

      const size = `${lw} X ${h} + ${b}`;

      return {
        category: prod.itemName,
        size,
        doorType: prod.doorType,
        material: prod.material,
        thickness: prod.thickness,
        surface: prod.surface,
        // doorRail 要收圖片路徑
        doorRail: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${prod.doorTrack}`,
        horsepower: prod.horsepower,
        openType: prod.close,
        qty: prod.quantity,
        unitPrice: prod.unitPrice,
        priceTotal: prod.totalPrice,
        memo: prod.notes,
        series: prod.itemName,
      };
    });
  })();

  // ----------------------------------------------------------------------------
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
        <div>
          <button onClick={dlPdf}>
            <span>下載PDF</span>
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
// typeA 用在只有一頁的情況
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
  totalPram: Parameters<typeof Total>[0];
  otherPram: Parameters<typeof Other>[0];
}) => {
  const chunkedList = _.chunk(productArr, 12) as (typeof productArr)[];
  const pageCount = chunkedList.length;

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 每一頁 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && <hr className={scss.hr} />}
            <div className={`${scss.pdf} ${scss.spaceBetween}`} ref={(ele) => (refPdf.current[0] = ele)}>
              <div>
                <Header />
                <Profile profileData={profilePram} index={index + 1} pageCount={pageCount} />
                <Table productList={chunk} />
              </div>
              <div>
                <Total memoArr={totalPram.memoArr} settlement={totalPram.settlement} />
                <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
              </div>
            </div>
          </Fragment>
        );
      })}
      {chunkedList.length === 0 && (
        <Fragment>
          <div className={`${scss.pdf} ${scss.spaceBetween}`} ref={(ele) => (refPdf.current[0] = ele)}>
            <div>
              <Header />
              <Profile profileData={profilePram} index={1} pageCount={1} />
            </div>
            <div>
              <Total memoArr={totalPram.memoArr} settlement={totalPram.settlement} />
              <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

// typeB 用在多頁的情況
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
  totalPram: Parameters<typeof Total>[0];
  otherPram: Parameters<typeof Other>[0];
}) => {
  const chunkedList = _.chunk(productArr, 40) as (typeof productArr)[];
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
      .plus(unitPrice.replaceAll(',', ''))
      .toNumber();
    quoteTypeSumObj[key].priceTotleSum = new Decimal(quoteTypeSumObj[key].priceTotleSum)
      .plus(priceTotal.replaceAll(',', ''))
      .toNumber();
  });
  const quoteTypeSumArr = Object.values(quoteTypeSumObj);

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 第一頁 */}
      <div className={`${scss.pdf} ${scss.spaceBetween}`} ref={(ele) => (refPdf.current[0] = ele)}>
        <div>
          <Header />
          <Profile profileData={profilePram} index={1} pageCount={pageCount} />
          <Table_quoteTypeSum quoteTypeSumArr={quoteTypeSumArr} />
        </div>
        <div>
          <Total memoArr={totalPram.memoArr} settlement={totalPram.settlement} />
          <Other quoteRangeArr={otherPram.quoteRangeArr} payInfo={otherPram.payInfo} attn={otherPram.attn} />
        </div>
      </div>
      {/* 第一頁之後 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            <hr className={scss.hr} />
            <div className={scss.pdf} ref={(ele) => (refPdf.current[index + 1] = ele)}>
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
