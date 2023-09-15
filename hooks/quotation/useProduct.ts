import { useState, useEffect } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {} from 'js/api/dtoTypes';

// class
import { Tprod, TprodKey, Class_product, prodkeyArrOri, prodCellConfig } from './classProduct';

import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
// =======================================================================

type TreRender = () => void;

type TcellConfig = {
  [key in string]: {
    label: string;
    theadItemClassName?: string;
    inputSelProps: TinputSelProps;
  };
};

type TproductList = {
  [key: string]: Class_product;
};

// =======================================================================
const useProductList = () => {
  const [render, serRender] = useState(0);
  const reRender: TreRender = () => serRender(render + 1);

  // ---------------------------------------------------------Z
  // product
  const [prodKeyArr, setProdKeyArr] = useState<TprodKey[]>([]);
  const [productList, setProductList] = useState<TproductList>({});

  console.log(prodKeyArr);

  const changeProdKeyArr = (v: TprodKey[]) => {
    setProdKeyArr(v);
    localStorage.setItem('domestic/quotation_prodKeyArr', JSON.stringify(v));
  };

  const delSelf = (key: string) => {
    delete productList[key];
    reRender();
  };

  const copySelf = (copyKey: string) => {
    const copy = { ...productList };
    const newKey = String(Object.keys(copy).length);
    alert('未完成');
    reRender();
  };

  const addProd = () => {
    const copy = { ...productList };
    const newKey = String(Object.keys(copy).length);
    const classProd = new Class_product({
      reRender,
      delSelf: () => delSelf(newKey),
      copySelf: () => copySelf(newKey),
    });
    copy[newKey] = classProd;
    setProductList(copy);
  };

  useEffect(() => {
    const prodKeyArr = (() => {
      const jsonStr = localStorage.getItem('domestic/quotation_prodKeyArr');

      if (!jsonStr) {
        return prodkeyArrOri();
      }

      return JSON.parse(jsonStr) as TprodKey[];
    })();
    setProdKeyArr(prodKeyArr);
  }, []);

  // ---------------------------------------------------------Z

  return {
    reRender,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    addProd,
    changeProdKeyArr,
    //
  };
};

export { useProductList };
export type { TreRender, TcellConfig, TprodKey };
