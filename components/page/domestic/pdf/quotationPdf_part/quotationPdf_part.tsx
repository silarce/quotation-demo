import React, { useRef } from 'react';

// component
import Header from './header';
import Info from './info';
import Table from './table';

// antd
import Modal from 'antd/lib/modal/Modal';

// css
import scss from './quotationPdf_part.module.scss';

import { dlExcel } from './dlExcel';
import { dlPdf } from './dlPdf';

import Decimal from 'decimal.js';
import { Class_product } from 'hooks/quotation/useProduct';
// ===================================================================

type TmainProduct = {
  quotationNumber: string;
  category: string;
  material: string;
  surface: string;
  doorType: string;
  size: string;
  priceTotal: string;
  part: Tpart[];
};

type Tpart = {
  partName: string; //名稱
  material: string;
  desc: string; // 說明
  // unit: string;
  unit: React.ReactNode; // 單位
  unit_str: string; // 單位
  qty: string; // 數量
  price: string; // 單價
  totalPrice: string; //金額
};

export type { TmainProduct, Tpart };

// ===================================================================
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

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const handle_dlPdf = () => {
    dlPdf({
      refPdf,
      quotationNumber: quotationId,
    });
  };

  const handle_dlExcel = () => {
    dlExcel({
      quotationId,
      mainProductArr,
    });
  };

  // -------------------------------------------------------------------------

  // 如果發現有欄位裡的值有換行的情形，必須要調整欄位寬度或是調整演算法
  // 不然應該會跑版
  //  w 要找個時間以新的pdf製作方式重製，不要再用下面這種方式處理了

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
          <button onClick={handle_dlPdf}>
            <span>下載PDF</span>
          </button>
          <button onClick={handle_dlExcel}>
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

// ==============================================================================

const extractPdfPartFromClassProduct = ({
  quotationNumber,
  productList,
}: {
  quotationNumber: string;
  productList: { [key: string]: Class_product };
}) => {
  const pdfPartProps: TmainProduct[] = Object.values(productList).map((prod) => {
    // const lw = Number(prod.fullWidth || 0) || Number(prod.WG || 0) * 100;

    const lw = new Decimal(prod.fullWidth || 0).mul(100).toNumber();
    const h = new Decimal(prod.height || 0).mul(100).toNumber();
    const b = new Decimal(prod.boxB || 0).mul(100).toNumber();
    const bounceDoorWidth = prod.bounceDoorWidth_cm;
    const bounceDoorWidth_formated = bounceDoorWidth ? `＋${bounceDoorWidth}` : '';

    const size = `${lw}${bounceDoorWidth_formated} X ${h} + ${b}`;

    const list_com = { ...prod.comList, ...prod.subComList };

    if (list_com.sidePlate?.totalPrice === '0') {
      delete list_com['sidePlate'];
    }

    delete list_com['motorAccessories'];

    const list_acce = prod.accessoriesList;

    const componentArr = Object.values(list_com ?? {});

    let totalPrice = 0;

    const part: Tpart[] = componentArr.map((com) => {
      totalPrice += Number(com.totalPrice || 0);

      let unit_str = '';

      if (typeof com.unit === 'object') {
        unit_str = 'm\u00B2';
      } else {
        unit_str = com.unit as string;
      }

      return {
        partName: com.comName,
        material: com.material,
        unit: com.unit,
        unit_str,
        // qty: Number(com.quantity).toFixed(2),
        qty: new Decimal(com.quantity || 0).toFixed(2),
        desc: com.desc ?? '',
        // price: Number(com.price || 0).toLocaleString(),
        price: com.unitPrice_locale,
        totalPrice: Number(com.totalPrice || 0).toLocaleString(),
      };
    });

    const part_acce: Tpart[] = Object.values(list_acce).map((acce) => {
      totalPrice += Number(acce.totalPrice || 0);

      let unit_str = '';

      if (typeof list_acce.unit === 'object') {
        unit_str = 'm\u00B2';
      } else {
        unit_str = list_acce.unit as string;
      }

      let partName = acce.name.replaceAll('60A', '');

      if (partName === '氟碳烤漆' || partName === '粉體烤漆') {
        partName = '烤漆';
      }

      return {
        partName,
        material: '',
        unit: acce.unit,
        unit_str,
        // FIXME 型別為number，但實際上為string
        // hooks/quotation/classAccessories.tsx // get quantity
        // qty: Number(acce.quantity).toFixed(2),
        qty: new Decimal(acce.quantity || 0).toFixed(2),
        price: acce.unitPrice_locale,
        desc: '',
        totalPrice: acce.totalPrice_locale,
      };
    });

    return {
      quotationNumber: quotationNumber,
      category: prod.itemName,
      material: prod.material,
      surface: prod.surface,
      doorType: prod.doorType,
      size: size,
      part: [...part, ...part_acce],
      // priceTotal: totalPrice.toLocaleString(),
      priceTotal: totalPrice.toLocaleString(),
    };
  });

  return pdfPartProps;
};

export { extractPdfPartFromClassProduct };
