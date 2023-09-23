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
import { TacceKey, Class_accessory, acceKeyArrOri, acceCellConfig } from './classAccessory';
import { Class_other, othersCellConfig, othersKeyArrOri } from './classOthers';

// =======================================================================

type TreRender = () => void;

type TproductList = {
  [key: string]: Class_product;
};

type TacceList = {
  [key: string]: Class_accessory | null;
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
  // product
  const [prodKeyArr, setProdKeyArr] = useState<TprodKey[]>([]);
  const [productList, setProductList] = useState<TproductList>({});

  const [subTotal, setSubTotal] = useState('');

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
      calcSubTotalPrice: calcProdSubTotalPrice,
      //
      doorModelList,
    });
    productList[newKey] = classProd;
    reRender();
    // setProductList(copy);
  };

  const calcProdSubTotalPrice = () => {
    let subTotal = new Decimal(0);

    Object.values(productList).forEach((prod) => {
      subTotal = subTotal.add(prod.totalPrice_num);
    });

    setSubTotal(subTotal.toString());
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

  // ---------------------------------------------------------
  // 其他設定 other

  // ---------------------------------------------------------

  return {
    reRender,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    addProd,
    changeProdKeyArr,
    //
    subTotal,
    //
    acceKeyArr: acceKeyArrOri(),
    acceCellConfig,
    //
  };
};

export { useProductList, prodCellConfig };
export type {
  TreRender,
  //
  Class_product,
  TprodKey,
  TproductList,
  //
  Class_accessory,
  TacceKey,
  TacceList,
};

/**
 * get /products/door/models
 * 報價別下拉式選單用這個api給的name，其他都不要給人選
 * 下面這兩個是下拉式選單的選項
 * guideRails.withHook, 這是防颱勾 true必須有防颱才能選 false就是必須非防颱 null就是都可以
 * slatMaterials 這是門片材質(英文的意思不要管)
 *
 *
 * /products/door/calc-general-spec
 * 會用到的似乎只有weight與motors
 * defaultMotorIndex的意思是系統算出來最合適的馬達的index
 *
 * motors.box 裡面有default 東元 大同 如果只有default，那就是東元跟大同都可以，我自己隨便預設一個
 * 如果同時有東元與大同我自己隨便預設一個
 * 如果只有東元或只有大同，那就是東元或大同
 * motors.box..boxB就是 B(m)，選擇馬達後要同步改變B(m)
 * 基本上只有defaultMotorIndex指定的motors.box會有boxB
 * boxD用不到先不管
 *
 * diameter就是卷軸直徑
 * 作為/products/door/available-components 的rollerDiameter引數
 *
 *
 *
 * /products/door/available-components
 * slats就是門片
 * botomBar底座
 *
 * sidePlates 這是支版
 * 軸承跟齒輪先跳過不判定
 *
 * motors.loadWeight 門重不可以大於這個值
 * phase與voltage 如果可以讓使用者選擇就要檢查
 * gearNumber先不管，理論上馬達的gearNumber要跟支版的gearNumber一樣
 *
 * bearingType對應calc-general-spec的bearing name
 *
 *
 *
 *
 */
