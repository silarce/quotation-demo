import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';

// class
import { Class_product, Tprod, TprodKey, prodkeyArrOri, prodCellConfig } from './classProduct';
import { Class_component, comKeyArrOri, comCellConfig } from './classComponent';
import { Class_SubCom } from './classSubCom';
import { Class_other, Tothers, TothersKey, othersCellConfig, othersKeyArrOri, emptyOthersOri } from './classOthers';
import { TaccessoriesKey, Class_accessories, accessoriesCellConfig, accessoriesKeyArrOri } from './classAccessories';

// type
import { TcreateQuotationContentOtherDto, TquotationProductDto, TquotationContentOtherDto } from 'js/api/dtoTypes';

// =======================================================================

type TreRender = () => void;

type TcomponentKey =
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

type TcomList = {
  [key in TcomponentKey]: Class_component;
};
type TsubComList = {
  [key in TcomponentKey]: Class_SubCom;
};

type TaccessoriesList = {
  [key: string]: Class_accessories;
};

type TothersList = {
  [key: string]: Class_other;
};

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

  const [calcTrigger, setCalcTrigger] = useState(0);

  const callCalcSubTotal = () => {
    setCalcTrigger((state) => ++state);
  };

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
    createProdList();
  }, [resetTrigger, doorModelList]);

  const createProdList = () => {
    if (!productArr || !doorModelList) {
      return;
    }

    const copyArr = _.cloneDeep(productArr);

    const sortedProdArr = _.sortBy(copyArr, 'order');
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
        phase: prod.motorPhase,
        voltage: String(prod.motorVoltage),
        motorSupport: prod.hasMotorSupportStand,
        doorTrackThick: String(prod.guideRailThickness),
        rollUpBoxThick: String(prod.headBoxThickness),
        // 取得時是mm，要轉成m
        width: String(Number(prod.WG) / 1000),
        length: String(Number(prod.fullWidth) / 1000),
        height: String(Number(prod.height) / 1000),
        boxB: String(Number(prod.boxB) / 1000),
        boxD: String(Number(prod.boxD) / 1000),
        // options: prod.options ?? [],

        quantity: prod.items?.length ?? 0,
        // 後端說現階段每個items都長的一樣，隨便挑一個出來用就好了
        accessories: prod.items?.[0].accessories ?? [],
        components: prod.items?.[0].components ?? [],
        //

        doorType: prod.doorModelName,
        material: prod.materialName,
        surface: prod.materialSurface,
        close: prod.closingType,
        doorTrack: prod.guideRail,
        typhoonProtection: prod.isAntiTyphoon,
        motor: prod.motorVendor,
        doorTrackSilencerStrip: prod.hasSilencingStrip,
        onePieceRollUpBox: prod.isIntegratedHeadBox,
        thickness: String(prod.thickness ?? ''),
      };

      list[key] = new Class_product({
        reRender,
        prodData,
        delSelf: () => delSelf_prod(list, key),
        copySelf: () => copySelf_prod(list, key),
        callCalcSubTotal,
        doorModelList,
        originProd: prod,
      });
    });

    setProductList(list);
  };

  //

  const changeProdKeyArr = (v: TprodKey[]) => {
    setProdKeyArr(v);
    localStorage.setItem('domestic/quotation_prodKeyArr', JSON.stringify(v));
  };

  const delSelf_prod = (list: TproductList, key: string) => {
    delete list[key];
    callCalcSubTotal();
    reRender();
  };

  const copySelf_prod = (list: TproductList, copyKey: string, shouldKeepId?: boolean) => {
    if (!doorModelList) {
      return myAlert.info({ title: '尚未取得門型資料' });
    }

    const newKey = nanoid();

    const copy = _.cloneDeep(list[copyKey]);
    copy.delSelf = () => delSelf_prod(list, newKey);
    copy.copySelf = () => copySelf_prod(list, newKey);

    if (!shouldKeepId) {
      copy.clearId();
    }

    copy.attachId = newKey;

    Object.values(copy.accessoriesList).forEach((acce) => {
      acce.reNewMethod();
    });

    list[newKey] = copy;

    callCalcSubTotal();

    reRender();
  };

  const addProd = () => {
    if (!doorModelList) {
      return myAlert.info({ title: '尚未取得門型資料' });
    }

    const newKey = nanoid();
    const classProd = new Class_product({
      reRender,
      delSelf: () => delSelf_prod(productList, newKey),
      copySelf: () => copySelf_prod(productList, newKey),
      callCalcSubTotal,
      // calcSubTotalPrice,
      doorModelList,
    });
    productList[newKey] = classProd;

    reRender();
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
  const [comKeyArr, setComKeyArr] = useState<string[]>(comKeyArrOri());
  const [comVKeyArr, setComVKeyArr] = useState<string[]>([
    'slat',
    'roller',
    'headBox',
    'bottomBar',
    'guideRail',
    'motor',
    'motorAccessories',
    'sidePlate',
  ]);

  const changeComKeyArr = (v: string[]) => {
    setComKeyArr(v);
  };

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  const [accessoriesKeyArr, setAccessoriesKeyArr] = useState<TaccessoriesKey[]>(accessoriesKeyArrOri());

  const changeAccessoriesKeyArr = (v: TaccessoriesKey[]) => {
    setAccessoriesKeyArr(v);
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
      const copyArr = _.cloneDeep(others);

      copyArr.forEach((item, index) => {
        const key = `${item.id}`;
        list[key] = new Class_other({
          reRender,
          data: item,
          delSelf: () => delSelf_other(list, key),
          copySelf: () => copySelf_others(list, key),
          callCalcSubTotal,
        });
      });

      setOthersList(list);
      reRender();
    }
  };

  const changeOthersKeyArr = (v: TothersKey[]) => {
    setOthersKeyArr(v);
  };

  const delSelf_other = (list: TothersList, key: string) => {
    delete list[key];
    callCalcSubTotal();
    reRender();
  };

  const copySelf_others = (list: TothersList, key: string) => {
    const newKey = `new-${nanoid()}`;
    const bodyCopy = _.cloneDeep(list[key].body);

    list[newKey] = new Class_other({
      reRender,
      data: bodyCopy,
      delSelf: () => delSelf_other(list, newKey),
      copySelf: () => copySelf_others(list, newKey),
      callCalcSubTotal,
    });
    callCalcSubTotal();
    reRender();
  };

  const addOthers = () => {
    const newKey = `new-${nanoid()}`;

    othersList[newKey] = new Class_other({
      reRender,
      delSelf: () => delSelf_other(othersList, newKey),
      copySelf: () => copySelf_others(othersList, newKey),
      callCalcSubTotal,
    });

    reRender();
  };

  const getOthersPostBodyArr: () => TcreateQuotationContentOtherDto[] = () => {
    return Object.values(othersList).map((item) => {
      return item.body;
    });
  };

  // ---------------------------------------------------------
  // TODO!!!!!!因為很重要所以重複五次!!!!!
  // TODO報價單完成後，必須再次驗證計算出來的金額是否正確
  // 包括主產品、材料配件、選配設定的金額，且有沒有正確地受到折數影響
  // 還有其他設定的金額有沒有被算進小計中
  // TODO報價單完成後，必須再次驗證計算出來的金額是否正確
  // 包括主產品、材料配件、選配設定的金額，且有沒有正確地受到折數影響
  // 還有其他設定的金額有沒有被算進小計中
  // TODO報價單完成後，必須再次驗證計算出來的金額是否正確
  // 包括主產品、材料配件、選配設定的金額，且有沒有正確地受到折數影響
  // 還有其他設定的金額有沒有被算進小計中
  // TODO報價單完成後，必須再次驗證計算出來的金額是否正確
  // 包括主產品、材料配件、選配設定的金額，且有沒有正確地受到折數影響
  // 還有其他設定的金額有沒有被算進小計中
  // TODO報價單完成後，必須再次驗證計算出來的金額是否正確
  // 包括主產品、材料配件、選配設定的金額，且有沒有正確地受到折數影響
  // 還有其他設定的金額有沒有被算進小計中
  // TODO!!!!!!因為很重要所以重複五次!!!!!

  /**計算報價單小計，由calcTrigger觸發 */
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
    if (calcTrigger) {
      calcSubTotalPrice();
    }
  }, [calcTrigger]);

  // ---------------------------------------------------------
  /**回到編輯前的狀態，就是以一開始取得的資料重新建立list */
  const reset = () => {
    createProdList();
    createOthersList();
  };
  // ---------------------------------------------------------

  // 追加追減
  // 追加追減
  // 追加追減

  const [productList_attach, setProductList_attach] = useState<TproductList>({});

  const addProd_attach = () => {
    if (!doorModelList) {
      return myAlert.info({ title: '尚未取得門型資料' });
    }

    const newKey = nanoid();
    const classProd = new Class_product({
      reRender,
      delSelf: () => delSelf_prod(productList_attach, newKey),
      copySelf: () => {
        // FIXME 複製無效，應該是productList_attach的參照錯誤
        copySelf_prod(productList_attach, newKey);
      },
      callCalcSubTotal,
      doorModelList,
    });
    productList_attach[newKey] = classProd;

    reRender();
  };

  // TODO 暫時先在prod放attachId這個property處理每次list的key都不一樣的問題
  // 以後最好還是做成狀態較好
  const attachProdList: { [key: string]: Class_product } = {};
  Object.values(productList).forEach((prod, index) => {
    Object.values(prod.exchangeProdList).forEach((item) => {
      const newId = item.attachId;
      attachProdList[newId] = item;
    });
  });
  Object.values(productList_attach).forEach((item, index) => {
    const newId = item.attachId;
    attachProdList[newId] = item;
  });

  //
  let attachTotal = 0;
  Object.values(productList).forEach((prod) => {
    attachTotal = attachTotal - Number(prod.reduceExchangePrice);
  });

  Object.values(attachProdList).forEach((prod) => {
    attachTotal = attachTotal + Number(prod.totalPrice_num);
  });

  // ---------------------------------------------------------

  return {
    reRender,
    reset,
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
    comKeyArr,
    comVKeyArr,
    comCellConfig,
    changeComKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
    //
    attachProdList,
    // attachProdList: productList_attach,
    addProd_attach,
    attachTotal,
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
  Class_component,
  TcomponentKey,
  TcomList,
  //
  TsubComList,
  //
  TaccessoriesKey,
  TaccessoriesList,
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
 */

/**
目前用於計算價格的方法
useProducts
calcSubTotalPrice 計算productlist與otehrs totalPrice的總和`
這個方法會送到Class_prod與Class_otehrs，於需要時呼叫

 */
