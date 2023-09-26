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
import { Class_accessory, acceKeyArrOri, acceCellConfig } from './classAccessory';
import { Tothers, TothersKey, Class_other, othersCellConfig, othersKeyArrOri, emptyOthersOri } from './classOthers';
import { ToptionsKey, Class_options, optionsCellConfig, optionsKeyArrOri } from './classOptions';

// type
import { TcreateQuotationContentOtherDto, TquotationProductDto, TquotationContentOtherDto } from 'js/api/dtoTypes';

// =======================================================================

type TreRender = () => void;

type TaccessoryKey =
  | 'slat'
  | 'bottomBar'
  | 'guideRail'
  | 'sidePlate'
  | 'roller'
  | 'motor'
  | 'motorAccessories'
  | 'headBox';

type TproductList = {
  [key: string]: Class_product;
};

type TacceList = {
  [key in TaccessoryKey]: Class_accessory;
};

type ToptionsList = {
  [key: string]: Class_options;
};

type TothersList = {
  [key: string]: Class_other;
};

// =======================================================================

/**
productsOrder使用構想
productsOrder是一個字串陣列，預想中會放進prod的id作為排序的依據
所以我可以將productsOrder送到table_prod.tbody的useVerticalDnd作為預設值
並取得dndKeyArr作為新的productsOrder

問題
新增的prod沒有id，使用者若新增了prod並排序，更新的productsOrder裡會是我用nanoid產生的key
無法於下次使用

Gina說之後會在product裡新增order這個property作為排序使用
 */

// =======================================================================
const useProductList = ({
  productArr,
  others,
  resetTrigger,
}: {
  productArr: TquotationProductDto[] | undefined;
  others: TquotationContentOtherDto[] | undefined;
  resetTrigger: any;
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
  const [prodVKeyArr, setProdVKeyArr] = useState<string[]>();

  useEffect(() => {
    if (!productArr || !doorModelList) {
      return;
    }

    // const orderArr = productArr.map((item) => {
    //   return item.order;
    // });

    // const isEqual = _.isEqual(_.sortBy(orderArr), _.sortBy(productsOrder));

    // if (isEqual) {
    //   setProdVKeyArr(productsOrder);
    // } else {
    //   setProdVKeyArr(undefined);
    // }

    createProdList();
  }, [resetTrigger, doorModelList]);

  const createProdList = () => {
    if (!productArr || !doorModelList) {
      return;
    }

    const sortedProdArr = _.sortBy(productArr, 'order');

    const list: TproductList = {};

    // 每次上傳前會將prod的order依照當時的排序重新設定
    // 所以理論上order不會重複
    sortedProdArr.forEach((prod) => {
      let key = prod.order !== undefined ? `${prod.order}` : nanoid();

      if (key in list) {
        key = nanoid();
      }

      const prodData: Tprod = {
        ...prod,
        phase: 1,
        voltage: String(prod.voltage),
        motorSupport: prod.motorSupport,
        doorTrackThick: String(prod.doorTrackThick),
        rollUpBoxThick: String(prod.rollUpBoxThick),
        // 取得時是mm，要轉成m
        width: String(Number(prod.width) / 1000),
        length: String(Number(prod.length) / 1000),
        height: String(Number(prod.height) / 1000),
        boxB: String(Number(prod.width) / 1000),
        boxD: String(Number(prod.boxD) / 1000),
        // options: prod.options ?? [],

        quantity: prod.items?.length ?? 0,
        // 後端說現階段每個items都長的一樣，隨便挑一個出來用就好了
        options: prod.items?.[0].options ?? [],
        components: prod.items?.[0].components ?? [],
      };

      list[key] = new Class_product({
        reRender,
        prodData,
        delSelf: () => delSelf(key),
        copySelf: () => copySelf(key),

        calcSubTotalPrice,
        doorModelList,

        originProd: prod,
      });
    });

    setProductList(list);
  };

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

    setProdVKeyArr((arr) => {
      if (!arr) {
        return undefined;
      }

      arr?.splice(arr.indexOf(key), 1);
    });

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

    const newKey = nanoid();
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

    setProdVKeyArr((arr) => {
      if (!arr) {
        return [newKey];
      }

      return [...arr, newKey];
    });

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

    setSubTotal(subTotal.ceil().toString());
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
  const [acceKeyArr, setAcceKeyArr] = useState<string[]>(acceKeyArrOri());
  const [acceVKeyArr, setacceVKeyArr] = useState<string[]>([
    'slat',
    'roller',
    'headBox',
    'bottomBar',
    'guideRail',
    'motor',
    'motorAccessories',
    'sidePlate',
  ]);

  const changeAcceKeyArr = (v: string[]) => {
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
    createOthersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  const createOthersList = () => {
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
  };

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
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    subTotal,
    //
    acceKeyArr,
    acceVKeyArr,
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
  TaccessoryKey,
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
