import { useState, useRef, useMemo } from 'react';

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

import { lookup_componentConfig } from 'config/product/lookup';

import { calcAllPrice, calcPriceDiscount_percent } from '../../quotation_v2/hook/quotationProduct/method/calcProd';

// type
import type {
  TquotationContentDto,
  TquotationProductDto,
  TquotationProductItemDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { TprodSource } from '../../quotation_v2/hook/quotationProduct/useQuotationProduct';

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

const conponentToPart = ({
  component,
  priceDiscount_percent,
  doorModelName,
}: {
  component: TquotationProductComponentDto;
  priceDiscount_percent: number | `${number}`;
  doorModelName: string;
}): Tpart & {
  totalPrice_num: number;
} => {
  const { type, material, price, quantity, desc } = component;

  const lookup = lookup_componentConfig(doorModelName);
  const { name, unit } = lookup[type];

  const { unitPrice, totalPrice } = calcAllPrice({
    price,
    priceDiscount_percent,
    quantity: quantity as `${number}`,
  });

  return {
    partName: name,
    material: material,
    unit: unit,
    unit_str: unit,
    qty: new Decimal(quantity).toFixed(2),
    desc: desc ?? '',
    price: unitPrice.toLocaleString(),
    totalPrice: totalPrice.toLocaleString(),
    totalPrice_num: totalPrice,
  };
};

const accessoryToPart = ({
  accessory,
}: {
  accessory: TquotationProductAccessoryDto;
}): Tpart & {
  totalPrice_num: number;
} => {
  const { name, unit, quantity, unitPrice, totalPrice } = accessory;
  let partName = name.replaceAll('60A', '');

  if (partName === '氟碳烤漆' || partName === '粉體烤漆') {
    partName = '烤漆';
  }

  return {
    partName,
    material: '',
    unit: unit,
    unit_str: unit,
    qty: new Decimal(quantity).toFixed(2),
    price: unitPrice.toLocaleString(),
    desc: '',
    totalPrice: totalPrice.toLocaleString(),
    totalPrice_num: totalPrice,
  };
};

const prodToPart = ({ product_item }: { product_item: TquotationProductItemDto }) => {
  const {
    distributionBoxUnitPrice,
    distributionBoxQuantity,
    distributionBoxTotalPrice,
    installationFeeQuantity,
    installationFeeUnitPrice,
    installationFeeTotalPrice,
  } = product_item;

  const part_distributionBox: Tpart = {
    partName: '配電箱及按鈕開關',
    material: '',
    unit: '組',
    unit_str: '組',
    qty: new Decimal(distributionBoxQuantity || 0).toFixed(2),
    desc: '',
    price: distributionBoxUnitPrice ? distributionBoxUnitPrice.toLocaleString() : '0',
    totalPrice: distributionBoxTotalPrice ? distributionBoxTotalPrice.toLocaleString() : '0',
  };

  const part_installationFee: Tpart = {
    partName: '按裝及製造費用',
    material: '',
    unit: '㎡',
    unit_str: '㎡',
    qty: new Decimal(installationFeeQuantity || 0).toFixed(2),
    desc: '',
    price: installationFeeUnitPrice ? installationFeeUnitPrice.toLocaleString() : '0',
    totalPrice: installationFeeTotalPrice ? installationFeeTotalPrice.toLocaleString() : '0',
  };

  return {
    part_distributionBox,
    part_installationFee,
  };
};

const productTomainProduct = ({
  quotationNumber,
  product_item,
  quotationDiscount,
}: {
  quotationNumber: string;
  product_item: TquotationProductItemDto;
  quotationDiscount: number | `${number}`;
}) => {
  const {
    doorModelName,
    discount,
    //
    itemName,
    materialName,
    materialSurface,
    //
    fullWidth,
    height,
    boxB,
    bounceDoorWidth,

    //
    accessories,
    components: _components,
    //
  } = product_item;

  const priceDiscount_percent = calcPriceDiscount_percent({
    prodDiscount: discount as `${number}`,
    quotationDiscount,
  });

  const components = [..._components];

  const fullWidtn_cm = new Decimal(fullWidth || 0).mul(100).toNumber();
  const height_cm = new Decimal(height || 0).mul(100).toNumber();
  const boxB_cm = new Decimal(boxB || 0).mul(100).toNumber();
  const bounceDoorWidth_cm = new Decimal(bounceDoorWidth || 0).mul(100).toNumber();
  const bounceDoorWidth_formated = bounceDoorWidth_cm ? `＋${bounceDoorWidth_cm}` : '';

  const size = `${fullWidtn_cm}${bounceDoorWidth_formated} X ${height_cm} + ${boxB_cm}`;

  const sidePlate = components.find(({ type }) => type === 'sidePlate');
  const motorAccessories = components.find(({ type }) => type === 'motorAccessories');

  if (sidePlate && sidePlate.price === 0) {
    components.splice(components.indexOf(sidePlate), 1);
  }

  motorAccessories && components.splice(components.indexOf(motorAccessories), 1);

  let totalPrice_d = new Decimal(0);

  const part_component = components.map((component) => {
    const part = conponentToPart({
      component,
      doorModelName,
      priceDiscount_percent,
    });

    totalPrice_d = totalPrice_d.add(part.totalPrice_num);

    return part;
  });

  const part_accessory = accessories.map((accessory) => {
    const part = accessoryToPart({
      accessory,
    });

    totalPrice_d = totalPrice_d.add(part.totalPrice_num);

    return part;
  });

  const { distributionBoxTotalPrice, installationFeeTotalPrice } = product_item;

  totalPrice_d = totalPrice_d.add(distributionBoxTotalPrice || 0).add(installationFeeTotalPrice || 0);

  const { part_distributionBox, part_installationFee } = prodToPart({
    product_item,
  });

  console.log(part_distributionBox.totalPrice);

  const mainProduct: TmainProduct = {
    quotationNumber: quotationNumber,
    category: itemName,
    material: materialName,
    surface: materialSurface ?? '',
    doorType: doorModelName,
    size: size,
    part: [...part_component, ...part_accessory, part_distributionBox, part_installationFee],
    priceTotal: totalPrice_d.toNumber().toLocaleString(),
  };

  return mainProduct;
};

const usePdfPart = ({
  quotationContent,
  prodArrForPDf,
}: {
  quotationContent: TquotationContentDto | undefined;
  prodArrForPDf?: TprodSource[];
}) => {
  const [show_pdfPart, setShow_pdfPart] = useState(false);

  const pdfPartProps = useMemo(() => {
    const { quotationNumber, discount } = quotationContent ?? {};

    const products: TprodSource[] | TquotationProductDto[] = prodArrForPDf
      ? prodArrForPDf
      : quotationContent?.products ?? [];

    const pdfPartProps: TmainProduct[] = products.map((_prod) => {
      const prod = _prod as TprodSource | TquotationProductDto;

      const { items } = prod;

      const addition = 'addition' in prod ? prod.addition : undefined;

      const quotationDiscount = (addition?.quotationDiscount ?? discount ?? '0') as number | `${number}`;

      return productTomainProduct({
        quotationNumber: quotationNumber ?? '',
        product_item: items[0],
        quotationDiscount: quotationDiscount,
      });
    });

    return pdfPartProps;
  }, [quotationContent, prodArrForPDf]);

  return { pdfPartProps, show_pdfPart, setShow_pdfPart };
};

export { extractPdfPartFromClassProduct, usePdfPart };
