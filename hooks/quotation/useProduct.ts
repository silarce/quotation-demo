import { useState, useEffect } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {} from 'js/api/dtoTypes';

// class
import { Tprod, TprodKey, Class_product, prodkeyArrOri, prodCellConfig } from './classProduct';

// =======================================================================

type TreRender = () => void;

type TproductList = {
  [key: string]: Class_product;
};

// =======================================================================
const useProductList = () => {
  const [render, setRender] = useState(0);
  const reRender: TreRender = () => setRender((state) => ++state);

  // 之後要記得做計算小計功能
  // 之後要記得做計算小計功能
  // 之後要記得做計算小計功能
  // 之後要記得做計算小計功能

  // ---------------------------------------------------------
  // product
  const [prodKeyArr, setProdKeyArr] = useState<TprodKey[]>([]);
  const [productList, setProductList] = useState<TproductList>({});

  const changeProdKeyArr = (v: TprodKey[]) => {
    setProdKeyArr(v);
    localStorage.setItem('domestic/quotation_prodKeyArr', JSON.stringify(v));
  };

  const delSelf = (key: string) => {
    delete productList[key];
    reRender();
  };

  const copySelf = (copyKey: string) => {
    const newKey = String(Object.keys(productList).length);
    alert('未完成');
    reRender();
  };

  const addProd = () => {
    const newKey = String(Object.keys(productList).length);
    const classProd = new Class_product({
      reRender,
      delSelf: () => delSelf(newKey),
      copySelf: () => copySelf(newKey),
    });
    productList[newKey] = classProd;
    reRender();
    // setProductList(copy);
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

export { useProductList, prodCellConfig };
export type { TreRender, TprodKey, Class_product, TproductList };
