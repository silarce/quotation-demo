import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';

// class
import { Tprod, TprodKey, Class_product, prodkeyArrOri, prodCellConfig } from './classProduct';
import { TacceKey, Class_accessory, acceKeyArrOri, acceCellConfig } from './classAccessory';
import { Tothers, TothersKey, Class_other, othersCellConfig, othersKeyArrOri, emptyOthersOri } from './classOthers';
import { ToptionsKey, Class_options, optionsCellConfig, optionsKeyArrOri } from './classOptions';

// type
import { TcreateQuotationContentOtherDto, quotationProductDto, TquotationContentOtherDto } from 'js/api/dtoTypes';

// =======================================================================

type TreRender = () => void;

type TproductList = {
  [key: string]: Class_product;
};

type TacceList = {
  [key: string]: Class_accessory | null;
};

type ToptionsList = {
  [key: string]: Class_options;
};

type TothersList = {
  [key: string]: Class_other;
};

// =======================================================================
const useProductList = ({
  productArr,
  others,
}: {
  productArr: quotationProductDto[] | undefined;
  others: TquotationContentOtherDto[] | undefined;
}) => {
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

  //
  //
  //
  // productsOrder
  // productArr

  useEffect(() => {
    if (!productArr || !doorModelList) {
      return;
    }

    const list: TproductList = {};

    productArr.forEach((prod) => {
      const key = `${prod.id}`;

      const prodData: Tprod = {
        ...prod,
        phase: 1,
        voltage: String(prod.voltage),
        motorSupport: !!Number(prod.motorSupport || '0'),
        doorTrackThick: String(prod.doorTrackThick),
        rollUpBoxThick: String(prod.rollUpBoxThick),
        // 取得時是mm，要轉成m
        width: String(Number(prod.width) / 1000),
        length: String(Number(prod.length) / 1000),
        height: String(Number(prod.height) / 1000),
        boxB: String(Number(prod.width) / 1000),
      };

      list[key] = new Class_product({
        reRender,
        prodData,
        delSelf: () => delSelf(key),
        copySelf: () => copySelf(key),

        calcSubTotalPrice,
        doorModelList,
      });
    });
  }, [productArr, doorModelList]);

  //
  //
  //

  const changeProdKeyArr = (v: TprodKey[]) => {
    setProdKeyArr(v);
    localStorage.setItem('domestic/quotation_prodKeyArr', JSON.stringify(v));
  };

  const delSelf = (key: string) => {
    delete productList[key];
    calcSubTotalPrice();
    reRender();
  };

  const copySelf = (copyKey: string) => {
    const newKey = String(Object.keys(productList).length);
    const copy = _.cloneDeep(productList[copyKey]);
    productList[newKey] = copy;
    calcSubTotalPrice();
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
      calcSubTotalPrice,
      //
      doorModelList,
    });
    productList[newKey] = classProd;
    reRender();
    // setProductList(copy);
  };

  const calcSubTotalPrice = () => {
    let subTotal = new Decimal(0);

    Object.values(productList).forEach((prod) => {
      subTotal = subTotal.add(prod.totalPrice_num);
    });
    Object.values(othersList).forEach((item) => {
      subTotal = subTotal.add(item.totalPrice);
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
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  const [acceKeyArr, setAcceKeyArr] = useState<TacceKey[]>(acceKeyArrOri());

  const changeAcceKeyArr = (v: TacceKey[]) => {
    setAcceKeyArr(v);
  };

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  const [optionsKeyArr, setOptionsKeyArr] = useState<ToptionsKey[]>(optionsKeyArrOri());

  const changeOptionsKeyArr = (v: ToptionsKey[]) => {
    setOptionsKeyArr(v);
  };

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // 其他設定 other

  const [othersKeyArr, setOthersKeyArr] = useState<TothersKey[]>(othersKeyArrOri());
  const [othersList, setOthersList] = useState<TothersList>({});

  useEffect(() => {
    if (others) {
      const list: TothersList = {};

      others.forEach((item, index) => {
        const key = `${item.id}`;
        list[key] = new Class_other({
          reRender,
          data: item,
          delSelf: () => delSelf_other(key),
          copySelf: () => copySelf_others(key),
          calcSubTotalPrice,
        });
      });

      setOthersList(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [others]);

  const changeOthersKeyArr = (v: TothersKey[]) => {
    setOthersKeyArr(v);
  };

  const delSelf_other = (key: string) => {
    delete othersList[key];
    reRender();
  };

  const copySelf_others = (key: string) => {
    const newKey = `new-${nanoid()}`;
    const bodyCopy = _.cloneDeep(othersList[key].body);

    othersList[newKey] = new Class_other({
      reRender,
      data: bodyCopy,
      delSelf: () => delSelf_other(newKey),
      copySelf: () => copySelf_others(newKey),
      calcSubTotalPrice,
    });

    reRender();
  };

  const addOthers = () => {
    const newKey = `new-${nanoid()}`;

    othersList[newKey] = new Class_other({
      reRender,
      delSelf: () => delSelf_other(newKey),
      copySelf: () => copySelf_others(newKey),
      calcSubTotalPrice,
    });

    reRender();
  };

  const getOthersPostBodyArr: () => TcreateQuotationContentOtherDto[] = () => {
    return Object.values(othersList).map((item) => {
      return item.body;
    });
  };

  // ---------------------------------------------------------
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
    acceKeyArr,
    acceCellConfig,
    changeAcceKeyArr,
    //
    optionsKeyArr,
    changeOptionsKeyArr,
    optionsCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
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
  //
  ToptionsKey,
  ToptionsList,
  //
  Class_other,
  TothersKey,
  TothersList,
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
