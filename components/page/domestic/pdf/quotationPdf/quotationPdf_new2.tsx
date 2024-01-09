import React, { useState, useRef, Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

// component
import Header from './header';
import Profile, { Tprofile } from './profile';
import Table, { TtableProdList, TtableProdListItem } from './table';
import Table_quoteTypeSum, { TquoteTypeSumList } from './table_quoteTypeSum';
import Total from './total';
import Other from './other';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf.module.scss';

// config
import { doorTrackLookup } from 'js/utils/options/doorTrackOptions';

// type
import { TquotationContentDto } from 'js/api/api_quotation';
//
import { Class_product, Class_other } from 'hooks/quotation/useProduct';
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

import { optionsCreator_quotationStatus } from 'js/utils/options/options';

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
  quotationStatus: string;
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
    quotationStatus,
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

  // ----------------------------------------------------------------------------
  // profile
  const profilePram: Tprofile = (() => {
    // const customerName = customer.name;

    // const dateString = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');
    const dateString = moment(quotationDate).subtract(1911, 'year').format('yy-MM-DD');

    return {
      quotationId: quotationNumber,
      quotationStatus,
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
      visible={isVisable}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered={true}
      width={'fit-content'}
      destroyOnClose={true}
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
    quotationStatus: '',
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

  const quotationStatus = quotationStatusLookup[status] ?? '';

  const customerName = customer.name;
  const agentName = agentEmployee.chName;

  const allAddress = county + district + address;

  const tradingDate = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

  const control_basicInfo: Tcontrol_basicInfo = {
    quotationDate,
    quotationNumber,
    projectName,
    quotationStatus,
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

// 專門給報價單使用的
const quotationProdToTableProdList = ({
  classProductArr,
  classOthersArr,
}: {
  classProductArr: Class_product[];
  classOthersArr: Class_other[];
}): Tcontrol_prodArr => {
  const productArr: TtableProdList_series = (() => {
    return classProductArr.map((prod) => {
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

      // 曉君要求，當材料為高耐鍍鋅鋼板時只要顯示鍍鋅鋼板
      if (material === '高耐鍍鋅鋼板') {
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

  const tradingDate = moment(deliveryDate).subtract(1911, 'year').format('yy-MM-DD');

  const control_basicInfo: Tcontrol_basicInfo = {
    quotationDate: '', // 舊合約沒有報價日期
    quotationNumber: contractNumber,
    projectName,
    quotationStatus: '舊合約',
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
