import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {} from 'js/api/dtoTypes';
// api
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';

// class
import { Tprod, TprodKey, Class_product, prodkeyArrOri, prodCellConfig } from './classProduct';
import { acceKeyArrOri, TacceKey } from './classAccessory';

// =======================================================================

type TreRender = () => void;

type TproductList = {
  [key: string]: Class_product;
};

// =======================================================================
const useProductList = () => {
  const [render, setRender] = useState(0);
  const reRender: TreRender = () => setRender((state) => ++state);
  // ---------------------------------------------------------

  const { res: doorModelArr, update: updateDoorModelArr } = useApiGetProdDoorModels();

  const doorModelList = useMemo(() => {
    if (!doorModelArr) {
      return undefined;
    }

    const list: { [key: string]: TdoorModelInfoDto } = {};

    doorModelArr.forEach((item, index) => {
      const key = item.name;
      list[key] = item;
    });

    return Object.freeze(list);
  }, [doorModelArr]);

  useEffect(() => {
    (async () => {
      try {
        updateDoorModelArr();
      } catch (error) {
        myAlert.err({ title: '取得門型列表失敗' });
      }
    })();
  }, []);

  // ---------------------------------------------------------

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
    if (!doorModelList) {
      return myAlert.info({ title: '尚未取得門型資料' });
    }

    const newKey = String(Object.keys(productList).length);
    const classProd = new Class_product({
      reRender,
      delSelf: () => delSelf(newKey),
      copySelf: () => copySelf(newKey),
      //
      doorModelList,
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

      const localArr = JSON.parse(jsonStr) as TprodKey[];

      if (
        _.difference(localArr, prodkeyArrOri()).length !== 0 ||
        _.difference(prodkeyArrOri(), localArr).length !== 0
      ) {
        return prodkeyArrOri();
      } else {
        return localArr;
      }
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
