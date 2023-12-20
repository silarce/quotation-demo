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

// config
import { doorTrackLookup } from 'js/utils/options/doorTrackOptions';

// css
import scss from './quotationPdf.module.scss';

// type
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

type TtableProdList_series = (TtableProdList[number] & { series: string })[];

export default function QuotationPdf({
  isVisable,
  onCancel,
  classLegacyContract,
  verticalKeyArr,
  agentName,
  notesArrBeforeThisBatchAndThisBatch,
}: {
  isVisable: boolean;
  onCancel: () => void;
  classLegacyContract: Class_legacyContract;
  agentName: string;
  verticalKeyArr: string[];
  notesArrBeforeThisBatchAndThisBatch: string[];
}) {
  const { classBasicInfo } = classLegacyContract;

  const { contractNumber } = classBasicInfo;

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

    doc.save(`${contractNumber}.pdf`);
    showRootLoading(false);
  };

  // ----------------------------------------------------------------------------
  // profile
  const profilePram: Tprofile = (() => {
    const {
      customerName,
      contactPerson,
      contactNumber,
      faxNumber,
      quoteDate,
      projectCity,
      projectDistrict,
      projectAddress,
      projectName,
    } = classBasicInfo;

    // const updatedAtStr = moment(updatedAt).subtract(1911, 'year').format('yy-MM-DD');
    const updatedAtStr = '';
    // const dateString = quoteDate ? moment(quoteDate).subtract(1911, 'year').format('yy-MM-DD') : '';

    return {
      quotationId: contractNumber,
      clientName: customerName,
      contactPerson: contactPerson,
      contactPhone: contactNumber,
      fax: faxNumber ?? '',
      builtDate: updatedAtStr,
      projectAddress: projectCity + projectDistrict + projectAddress,
      projectName,
      validityPeriod: '',
    };
  })();
  // -------------------------------
  // total
  const totalPram = (() => {
    // const memoArr = classLegacyContract.classNotes.stringArr;
    const memoArr = notesArrBeforeThisBatchAndThisBatch;

    // let subTotal: string | number = classLegacyContract.classPayInfo.subTotal;
    // let businessTax: string | number = classLegacyContract.classPayInfo.salesTax;
    // let total: string | number = classLegacyContract.classPayInfo.total;
    // subTotal = Number(subTotal.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });
    // businessTax = Number(businessTax.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });
    // total = Number(total.replaceAll(',', '')).toLocaleString(undefined, { maximumFractionDigits: 2 });

    const { subTotal, salesTax: businessTax, total } = classLegacyContract?.countProdTotal() ?? {};

    const theSubTotal = subTotal?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '';
    const theBusinessTax = businessTax?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '';
    const theTotal = total?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '';

    const settlement = {
      subTotal: theSubTotal, //小計
      businessTax: theBusinessTax, //營業稅
      total: theTotal, // 統計
    };

    return { memoArr, settlement };
  })();
  // -------------------------------
  // other
  const otherPram = (() => {
    const quoteRangeArr = classLegacyContract.classQuoteScopes.stringArr;
    // const attn = classLegacyContract.classSignature.operatorName;
    const attn = agentName;

    const payInfo = (() => {
      const { deliveryLocation, deliveryDate, paymentMethods } = classLegacyContract.classPayInfo;
      const payWay = paymentMethods.map((item) => ({
        label: item.milestone,
        value: item.totalPaymentRatio,
      }));

      // const tradingDate = deliveryDate ? moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD') : '';
      const tradingDate = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

      return {
        tradingLocation: deliveryLocation,
        tradingDate: tradingDate,
        payWay,
      };
    })();

    return { quoteRangeArr, payInfo: payInfo!, attn };
  })();

  const productArr: TtableProdList_series = (() => {
    // const classProdArr = classLegacyContract.prodArr;

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        doorRail: doorTrackLookup[prod.doorTrack]?.icon,
        horsepower: prod.horsepower,
        openType: prod.closingType,
        qty: prod.quantity,
        unitPrice: prod.unitPrice,
        priceTotal: prod.totalPrice,
        memo: prod.notes,
        series: prod.itemName,
      };
    });

    arr = arr.filter((item) => !!item);

    return arr as TtableProdList_series;
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
  const chunkedList: TtableProdList[] = chunkProdArr({ productArr, rowLimit: 12 });

  const pageCount = chunkedList.length;

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 每一頁 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && <hr className={scss.hr} />}
            <div className={`${scss.pdf} ${scss.spaceBetween}`} ref={(ele) => (refPdf.current[index] = ele)}>
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
  const chunkedList: TtableProdList[] = chunkProdArr({ productArr, rowLimit: 35 });

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
