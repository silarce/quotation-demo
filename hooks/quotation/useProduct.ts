// comVKeyArr 材料配件垂直排序的key

import { useState, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';
import { apiGetAnnotation, apiGetQuotationRanges } from 'js/api/api_workSheet';

// class
import { Class_product, Tprod, TprodKey, prodkeyArrOri, prodCellConfig } from './classProduct';
import { Class_component, comKeyArrOri, comCellConfig } from './classComponent';
import { Class_SubCom } from './classSubCom';
import { Class_accessories, TaccessoriesKey, accessoriesCellConfig, accessoriesKeyArrOri } from './classAccessories';
import { Class_other, Tothers, TothersKey, othersCellConfig, othersKeyArrOri, emptyOthersOri } from './classOthers';

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
  onDoorTypeChange,
  productArr_attach,
  quotationDiscount,
  onDiscountChange,
}: {
  productArr: TquotationProductDto[] | undefined;
  others: TquotationContentOtherDto[] | undefined;
  resetTrigger: any;
  onDoorTypeChange?: (obj: {
    annoShouldRemove: string[] | undefined;
    qrShouldRemove: string[] | undefined;
    annoArr: string[] | undefined;
    qrArr: string[] | undefined;
  }) => void;
  productArr_attach?: TquotationProductDto[] | undefined;
  quotationDiscount: number;
  onDiscountChange?: (avgDiscount: number) => void;
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

  const { createProdList, addProd, onClassDiscountChange } = useMemo(() => {
    //
    const list: TproductList = {};
    //

    const calcAvgDiscount = () => {
      let discountTotal = new Decimal(0);
      let count = 0;

      // const prodArr = Object.values(productList);

      Object.values(list).forEach((prod) => {
        discountTotal = discountTotal.add(prod.discount);
        count = count + 1;

        const exchangeProdList = prod.exchangeProdList;

        Object.values(exchangeProdList).forEach((exchangeProd) => {
          discountTotal = discountTotal.add(exchangeProd.discount);
          count = count + 1;
        });
      });

      // 目前productList_attach從頭到尾都是同一個，setProductList_attach沒有被使用過
      Object.values(productList_attach).forEach((prod_attach) => {
        discountTotal = discountTotal.add(prod_attach.discount);
        count = count + 1;
      });

      const avgDiscount = discountTotal.div(count).toDecimalPlaces(3).toNumber();

      return avgDiscount;
    };

    const onClassDiscountChange = () => {
      onDiscountChange?.(calcAvgDiscount());
    };

    const addProd = () => {
      if (!doorModelList) {
        return myAlert.info({ title: '尚未取得門型資料' });
      }

      const newKey = nanoid();
      const classProd = new Class_product({
        reRender,
        delSelf: () => {
          delSelf_prod(list, newKey);
          onClassDiscountChange();
        },
        copySelf: () => {
          copySelf_prod(list, newKey);
          onClassDiscountChange();
        },
        callCalcSubTotal,
        // calcSubTotalPrice,
        doorModelList,
        onDoorTypeChange: onClassDoorTypeChange,
        // quotationDiscount: quotationDiscount,
        onDiscountChange: onClassDiscountChange,
      });
      list[newKey] = classProd;

      onClassDiscountChange();

      reRender();
    };

    const createProdList = () => {
      if (!doorModelList) {
        return;
      }

      const listKeyArr = Object.keys(list);
      listKeyArr.forEach((key) => {
        delete list[key];
      });

      const copyArr = _.cloneDeep(productArr ?? []);
      // TODO 之後要改為以productOrder排序
      // 考慮到不同的追加追減合約裡的主產品的order可能會重複
      // 所以要用productOrder排序
      const sortedProdArr = _.sortBy(copyArr, 'order');

      // 每次上傳前會將prod的order依照當時的排序重新設定
      // 所以理論上order不會重複
      sortedProdArr.forEach((prod) => {
        let key = prod.order !== undefined ? `${prod.order}` : nanoid();

        if (key in list) {
          key = nanoid();
        }

        const prodData: Tprod = quotationProductToProd({ quotationProduct: prod });

        list[key] = new Class_product({
          reRender,
          prodData,
          delSelf: () => {
            delSelf_prod(list, key);
            onClassDiscountChange();
          },
          copySelf: () => {
            copySelf_prod(list, key);
            onClassDiscountChange();
          },
          callCalcSubTotal,
          doorModelList,
          originProd: prod,
          onDoorTypeChange: onClassDoorTypeChange,
          // quotationDiscount: quotationDiscount,
          onDiscountChange: onClassDiscountChange,
        });
      });

      // setProductList(list);
      // setProductList((state) => {
      //   const keyArr = Object.keys(state);

      //   return state;
      // });

      // Object.assign(productList, list);

      onClassDiscountChange();
      setProductList(list);
    };

    return { createProdList, addProd, onClassDiscountChange };

    // reRender();
  }, [resetTrigger, doorModelList]);

  useEffect(() => {
    createProdList();
  }, [createProdList]);

  // const createProdList = () => {
  //   // if (!productArr || !doorModelList) {
  //   //   return;
  //   // }
  //   if (!doorModelList) {
  //     return;
  //   }

  //   // 先清除原本的list
  //   const keyArr = Object.keys(productList);
  //   keyArr.forEach((key) => {
  //     delete productList[key];
  //   });

  //   const copyArr = _.cloneDeep(productArr ?? []);

  //   // TODO 之後要改為以productOrder排序
  //   // 考慮到不同的追加追減合約裡的主產品的order可能會重複
  //   // 所以要用productOrder排序
  //   const sortedProdArr = _.sortBy(copyArr, 'order');
  //   // const list: TproductList = {};

  //   // 每次上傳前會將prod的order依照當時的排序重新設定
  //   // 所以理論上order不會重複
  //   sortedProdArr.forEach((prod) => {
  //     const key = prod.order !== undefined ? `${prod.order}` : nanoid();

  //     // if (key in productList) {
  //     //   key = nanoid();
  //     // }

  //     const prodData: Tprod = quotationProductToProd({ quotationProduct: prod });

  //     productList[key] = new Class_product({
  //       reRender,
  //       prodData,
  //       delSelf: () => {
  //         delSelf_prod(productList, key);
  //         onClassDiscountChange();
  //       },
  //       copySelf: () => {
  //         copySelf_prod(productList, key);
  //         onClassDiscountChange();
  //       },
  //       callCalcSubTotal,
  //       doorModelList,
  //       originProd: prod,
  //       onDoorTypeChange: onClassDoorTypeChange,
  //       // quotationDiscount: quotationDiscount,
  //       onDiscountChange: onClassDiscountChange,
  //     });
  //   });

  //   // setProductList(list);
  //   // setProductList((state) => {
  //   //   const keyArr = Object.keys(state);

  //   //   return state;
  //   // });

  //   // Object.assign(productList, list);

  //   onClassDiscountChange();

  //   reRender();
  // };

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
    // copy.rootProductId = undefined;

    copy.delSelf = () => {
      delSelf_prod(list, newKey);
      onClassDiscountChange();
    };

    copy.copySelf = () => {
      copySelf_prod(list, newKey);
      onClassDiscountChange();
    };

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

  // const addProd = () => {
  //   if (!doorModelList) {
  //     return myAlert.info({ title: '尚未取得門型資料' });
  //   }

  //   const newKey = nanoid();
  //   const classProd = new Class_product({
  //     reRender,
  //     delSelf: () => {
  //       delSelf_prod(productList, newKey);
  //       onClassDiscountChange();
  //     },
  //     copySelf: () => {
  //       copySelf_prod(productList, newKey);
  //       onClassDiscountChange();
  //     },
  //     callCalcSubTotal,
  //     // calcSubTotalPrice,
  //     doorModelList,
  //     onDoorTypeChange: onClassDoorTypeChange,
  //     // quotationDiscount: quotationDiscount,
  //     onDiscountChange: onClassDiscountChange,
  //   });
  //   productList[newKey] = classProd;

  //   onClassDiscountChange();

  //   reRender();
  // };

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

  /**計算報價單小計，由calcTrigger觸發 */
  const calcSubTotalPrice = () => {
    let subTotal = new Decimal(0);

    Object.values(productList).forEach((prod) => {
      subTotal = subTotal.add(prod.totalPrice_num);
    });
    Object.values(othersList).forEach((item) => {
      subTotal = subTotal.add(item.totalPrice);
    });

    // setSubTotal(subTotal.toFixed(0));
    setSubTotal(new Decimal(subTotal).toFixed(0));
  };

  useEffect(() => {
    if (calcTrigger) {
      calcSubTotalPrice();
    }
  }, [calcTrigger]);

  // 修改所有class_product的quotationDiscount
  // const changeAllProdQuotationDiscount = (v: number) => {
  //   Object.values(productList).forEach((prod) => {
  //     prod.quotationDiscount = v;
  //   });
  //   Object.values(attachProdList).forEach((prod) => {
  //     prod.quotationDiscount = v;
  //   });
  // };

  // useEffect(() => {
  //   // component裡面只有紀錄牌價，其他金額都是算出來的
  //   // 因此即使沒有要變更主產品或總折數，也必須要執行changeAllProdQuotationDiscount
  //   // 否則若quotationDiscount不是100，component的單價就會錯誤

  //   changeAllProdQuotationDiscount(quotationDiscount);
  // }, [quotationDiscount]);

  // const calcAvgDiscount = () => {
  //   let discountTotal = new Decimal(0);
  //   let count = 0;

  //   // const prodArr = Object.values(productList);

  //   Object.values(productList).forEach((prod) => {
  //     discountTotal = discountTotal.add(prod.discount);
  //     count = count + 1;

  //     const exchangeProdList = prod.exchangeProdList;

  //     Object.values(exchangeProdList).forEach((exchangeProd) => {
  //       discountTotal = discountTotal.add(exchangeProd.discount);
  //       count = count + 1;
  //     });
  //   });

  //   Object.values(productList_attach).forEach((prod_attach) => {
  //     discountTotal = discountTotal.add(prod_attach.discount);
  //     count = count + 1;
  //   });

  //   const avgDiscount = discountTotal.div(count).toDecimalPlaces(3).toNumber();

  //   return avgDiscount;
  // };

  // ---------------------------------------------------------
  // 回到編輯前的狀態，就是以一開始取得的資料重新建立list

  const reset = () => {
    createProdList();
    createOthersList();
    setSubTotal('');
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
      delSelf: () => {
        delSelf_prod(productList_attach, newKey);
        onClassDiscountChange();
      },
      copySelf: () => {
        copySelf_prod(productList_attach, newKey);
        onClassDiscountChange();
      },
      callCalcSubTotal,
      doorModelList,
      onDoorTypeChange: onClassDoorTypeChange,
      // quotationDiscount: quotationDiscount,
      onDiscountChange: onClassDiscountChange,
    });
    productList_attach[newKey] = classProd;

    onClassDiscountChange();

    reRender();
  };

  useEffect(() => {
    if (productArr_attach && doorModelList) {
      // const list: TproductList = {};

      const keyArr_productList_attach = Object.keys(productList_attach);
      keyArr_productList_attach.forEach((key) => {
        delete productList_attach[key];
      });

      productArr_attach.forEach((prod) => {
        const key = prod.order !== undefined ? `${prod.order}` : nanoid();

        // if (key in productList_attach) {
        //   key = nanoid();
        // }

        const prodData: Tprod = quotationProductToProd({ quotationProduct: prod });

        productList_attach[key] = new Class_product({
          reRender,
          prodData,
          delSelf: () => {
            delSelf_prod(productList_attach, key);
            onClassDiscountChange();
          },
          copySelf: () => {
            copySelf_prod(productList_attach, key);
            onClassDiscountChange();
          },
          callCalcSubTotal,
          doorModelList,
          originProd: prod,
          onDoorTypeChange: onClassDoorTypeChange,
          onDiscountChange: onClassDiscountChange,
          disabled_quantity: true,
          // quotationDiscount: quotationDiscount,
        });
      });

      // setProductList_attach(list);

      onClassDiscountChange();
      reRender();
    }
  }, [productArr_attach]);

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

  /**追加總金額 */
  let attachAddTotal = 0;
  // Object.values(productList).forEach((prod) => {
  //   attachAddTotal = attachAddTotal - Number(prod.reduceExchangePrice);
  // });

  Object.values(attachProdList).forEach((prod) => {
    attachAddTotal = attachAddTotal + Number(prod.totalPrice_num);
  });

  let attachDivTotal = 0;
  Object.values(productList).forEach((item) => {
    attachDivTotal = attachDivTotal - Number(item.reduceExchangePrice);
  });

  const attachTotal = attachAddTotal + attachDivTotal;

  // 追加追減close
  // ---------------------------------------------------------

  const [annoArr, setAnnoArr] = useState<string[]>([]);
  const [qrArr, setQrArr] = useState<string[]>([]);

  const onClassDoorTypeChange = async ({
    //
    // oldDoorType,
    newDoorType,
    // oldIsAntiTyphoon,
    newIsAntiTyphoon,
  }: {
    // oldDoorType: string;
    newDoorType: string;
    // oldIsAntiTyphoon: boolean;
    newIsAntiTyphoon: boolean;
  }) => {
    if (!onDoorTypeChange) {
      return;
    }

    const type = newIsAntiTyphoon ? 'anti-typhoon' : 'normal';

    const annoShouldRemove = [...annoArr];
    const qrShouldRemove = [...qrArr];

    const newAnnoArr = (await getAnno({ doorModelName: newDoorType, type })) ?? [];
    const newQrArr = (await getQr({ doorModelName: newDoorType, type })) ?? [];

    setAnnoArr(newAnnoArr);
    setQrArr(newQrArr);

    onDoorTypeChange({
      annoShouldRemove,
      qrShouldRemove,
      annoArr: newAnnoArr,
      qrArr: newQrArr,
    });

    //
  };

  // const onClassDiscountChange = () => {
  //   onDiscountChange?.(calcAvgDiscount());
  // };

  const changeAllProductDiscount = (num: number) => {
    Object.values(productList).forEach((prod) => {
      prod.discount_noTimeout = String(num);
    });

    Object.values(productList_attach).forEach((prod) => {
      prod.discount_noTimeout = String(num);
    });
  };

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
    // 追加總金額
    attachAddTotal,
    // 追減總金額
    attachDivTotal,
    // 追加追減總金額
    attachTotal,
    //
    calcSubTotalPrice,
    // changeAllProdQuotationDiscount, // 修改所有class_product的quotationDiscount
    changeAllProductDiscount,
  };
};

// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
const getAnno = async ({
  //
  doorModelName,
  type,
}: {
  doorModelName: string | undefined;
  type: string | undefined;
}) => {
  const params = {
    pageSize: 9999,
    filter: {
      doorModelName: {
        $eq: doorModelName,
      },
      type: {
        $eq: type,
      },
    },
  };

  if (!doorModelName) {
    return undefined;
  }

  try {
    // const res = await apiGetQuotationRanges(params);
    const res = await apiGetAnnotation(params);

    if (res) {
      const arr = res.data.map((item) => item.description);

      return arr;
    }
  } catch (error) {
    myAlert.err({ title: '取得備註失敗' });

    return undefined;
  }
};

const getQr = async ({
  //
  doorModelName,
  type,
}: {
  doorModelName: string | undefined;
  type: string | undefined;
}) => {
  const params = {
    pageSize: 9999,
    filter: {
      doorModelName: {
        $eq: doorModelName,
      },
      type: {
        $eq: type,
      },
    },
  };

  if (!doorModelName) {
    return undefined;
  }

  try {
    const res = await apiGetQuotationRanges(params);

    if (res) {
      const arr = res.data.map((item) => item.description);

      return arr;
    }
  } catch (error) {
    myAlert.err({ title: '取得備註失敗' });

    return undefined;
  }
};

const quotationProductToProd = ({ quotationProduct }: { quotationProduct: TquotationProductDto }): Tprod => {
  const prodData: Tprod = {
    ...quotationProduct,
    phase: quotationProduct.motorPhase ?? -1,
    voltage: String(quotationProduct.motorVoltage),
    motorSupport: quotationProduct.hasMotorSupportStand ?? false,
    doorTrackThick: String(quotationProduct.guideRailThickness),
    rollUpBoxThick: String(quotationProduct.headBoxThickness),
    // 取得時是mm，要轉成m
    WG: String(Number(quotationProduct.WG) / 1000),
    fullWidth: String(Number(quotationProduct.fullWidth) / 1000),
    height: String(Number(quotationProduct.height) / 1000),
    boxB: String(Number(quotationProduct.boxB) / 1000),
    boxD: String(Number(quotationProduct.boxD) / 1000),
    // guideRailG: quotationProduct.guideRailG || 0,
    // options: quotationProduct.options ?? [],

    // quantity: quotationProduct.items?.length ?? 0,
    // quantity: quotationProduct.quantity ?? 0,
    // 後端說現階段每個items都長的一樣，隨便挑一個出來用就好了
    accessories: quotationProduct.items?.[0]?.accessories ?? [],
    components: quotationProduct.items?.[0]?.components ?? [],
    //

    doorType: quotationProduct.doorModelName,
    material: quotationProduct.materialName,
    surface: quotationProduct.materialSurface ?? '',
    close: quotationProduct.closingType ?? '',
    doorTrack: quotationProduct.guideRail ?? '',
    typhoonProtection: quotationProduct.isAntiTyphoon ?? false,
    motor: quotationProduct.motorVendor ?? '',
    doorTrackSilencerStrip: quotationProduct.hasSilencingStrip ?? false,
    onePieceRollUpBox: quotationProduct.isIntegratedHeadBox ?? false,
    // thickness: String(quotationProduct.thickness ?? ''),
    // bottomBar: quotationProduct.bottomBar ? quotationProduct.bottomBar : 'none',

    // sprocketWheelModel: quotationProduct.sprocketWheelModel ?? '',
    // sprocketWheelTeethNumber: quotationProduct.sprocketWheelTeethNumber ?? '',
    // sprocketWheelChains: quotationProduct.sprocketWheelChains ?? '',
    // bearingInnerDiameter: quotationProduct.bearingInnerDiameter ?? '',
    // diameter: quotationProduct.diameter ?? '',
    // bearingHousingTotalLength: quotationProduct.bearingHousingTotalLength ?? '',
    // guideRailsOpening: quotationProduct.guideRailsOpening ?? '',
    // slatLength: quotationProduct.slatLength ?? 0,
    // guideRailLength: quotationProduct.guideRailLength ?? 0,
    // headBoxLength: quotationProduct.headBoxLength ?? 0,
    // bearingHousingSize: quotationProduct.bearingHousingSize ?? 0,
    // bearingName: quotationProduct.bearingName ?? '',
    // gapA: quotationProduct.gapA ?? '',
    // gapC: quotationProduct.gapC ?? '',
    // gearNumber: quotationProduct.gearNumber ?? '',
    // weight: quotationProduct.weight ?? '',
    // isULGuideRail: quotationProduct.isULGuideRail ?? false,

    // bounceDoorWidth: quotationProduct.bounceDoorWidth || 0,
    //
    // distributionBoxQuantity: quotationProduct.distributionBoxQuantity ?? 1,
    // distributionBoxDualPrice: quotationProduct.distributionBoxDualPrice ?? quotationProduct.distributionBoxPrice ?? 0,
    // distributionBoxTotalPrice: quotationProduct.distributionBoxTotalPrice ?? quotationProduct.distributionBoxUnitPrice ?? 0,
    //
    //
    // area: quotationProduct.area ?? '',
    // volume: quotationProduct.volume ?? '',
    // bounceDoor: quotationProduct.bounceDoor ?? false,
    // motorLockBox: quotationProduct.motorLockBox ?? '',
    // rollerSpec: quotationProduct.rollerSpec ?? '',
    // bottomBarAngleIron: quotationProduct.bottomBarAngleIron ?? '',
    // bottomBarPlate: quotationProduct.bottomBarPlate ?? '',
    // distributionBoxPrice: quotationProduct.distributionBoxPrice ?? 0,
    // distributionBoxUnitPrice: quotationProduct.distributionBoxUnitPrice ?? 0,

    //
    //
    //
    area: quotationProduct.area ?? '',
    volume: quotationProduct.volume ?? '',
    // guideRail: quotationProduct.guideRail ?? '',
    // motorVendor: quotationProduct.motorVendor ?? '',
    // motorVoltage: quotationProduct.motorVoltage ?? '',
    bottomBar: quotationProduct.bottomBar ? quotationProduct.bottomBar : 'none',
    motorLockBox: quotationProduct.motorLockBox ?? '',
    // guideRailThickness: quotationProduct.guideRailThickness ?? '',
    rollerSpec: quotationProduct.rollerSpec ?? '',
    // hasSilencingStrip: quotationProduct.hasSilencingStrip ?? '',
    // isIntegratedHeadBox: quotationProduct.isIntegratedHeadBox ?? '',
    // headBoxThickness: quotationProduct.headBoxThickness ?? '',
    // isAntiTyphoon: quotationProduct.isAntiTyphoon ?? '',
    bounceDoor: quotationProduct.bounceDoor ?? false,
    bounceDoorWidth: quotationProduct.bounceDoorWidth ?? 0,
    // bounceDoorHeight: quotationProduct.bounceDoorHeight ?? '',
    // bounceDoorLength: quotationProduct.bounceDoorLength ?? '',
    // closingType: quotationProduct.closingType ?? '',
    // motorPhase: quotationProduct.motorPhase ?? '',
    bottomBarAngleIron: quotationProduct.bottomBarAngleIron ?? '',
    bottomBarPlate: quotationProduct.bottomBarPlate ?? '',
    thickness: String(quotationProduct.thickness ?? ''),
    distributionBoxPrice: quotationProduct.distributionBoxPrice ?? 0,
    distributionBoxUnitPrice: quotationProduct.distributionBoxUnitPrice ?? 0,
    distributionBoxQuantity: quotationProduct.distributionBoxQuantity ?? 0,
    distributionBoxDualPrice: quotationProduct.distributionBoxDualPrice ?? 0,
    distributionBoxTotalPrice: quotationProduct.distributionBoxTotalPrice ?? 0,
    installationFeePrice: quotationProduct.installationFeePrice ?? 0,
    installationFeeDualPrice: Number(quotationProduct.installationFeeDualPrice ?? 0),
    installationFeeQuantity: Number(quotationProduct.installationFeeQuantity ?? 0),
    installationFeeUnitPrice: quotationProduct.installationFeeUnitPrice ?? 0,
    installationFeeTotalPrice: Number(quotationProduct.installationFeeTotalPrice ?? 0),
    // slatCount: quotationProduct.slatCount,
    // sprocketWheelModel: quotationProduct.sprocketWheelModel,
    // sprocketWheelTeethNumber: quotationProduct.sprocketWheelTeethNumber,
    // sprocketWheelChains: quotationProduct.sprocketWheelChains,
    // bearingInnerDiameter: quotationProduct.bearingInnerDiameter,
    // diameter: quotationProduct.diameter,
    // bearingHousingTotalLength: quotationProduct.bearingHousingTotalLength,
    // guideRailsOpening: quotationProduct.guideRailsOpening,
    // slatLength: quotationProduct.slatLength,
    guideRailLength: quotationProduct.guideRailLength,
    headBoxLength: quotationProduct.headBoxLength,
    bearingHousingSize: quotationProduct.bearingHousingSize,
    bearingName: quotationProduct.bearingName,
    gapA: quotationProduct.gapA,
    gapC: quotationProduct.gapC,
    gearNumber: quotationProduct.gearNumber,
    weight: quotationProduct.weight,
    guideRailG: quotationProduct.guideRailG ?? 0,
    isULGuideRail: quotationProduct.isULGuideRail ?? false,

    //
  }; // prodData

  return prodData;
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

//
// get /products/door/models
// 報價別下拉式選單用這個api給的name，其他都不要給人選
// 下面這兩個是下拉式選單的選項
// guideRails.withHook, 這是防颱勾 true必須有防颱才能選 false就是必須非防颱 null就是都可以
// slatMaterials 這是門片材質(英文的意思不要管)
//
//
// /products/door/calc-general-spec
// 會用到的似乎只有weight與motors
// defaultMotorIndex的意思是系統算出來最合適的馬達的index
//
// motors.box 裡面有default 東元 大同 如果只有default，那就是東元跟大同都可以，我自己隨便預設一個
// 如果同時有東元與大同我自己隨便預設一個
// 如果只有東元或只有大同，那就是東元或大同
// motors.box..boxB就是 B(m)，選擇馬達後要同步改變B(m)
// 基本上只有defaultMotorIndex指定的motors.box會有boxB
// boxD用不到先不管
//
// diameter就是卷軸直徑
// 作為/products/door/available-components 的rollerDiameter引數
//
//
//
// /products/door/available-components
// slats就是門片
// botomBar底座
//
// sidePlates 這是支版
// 軸承跟齒輪先跳過不判定
//
// motors.loadWeight 門重不可以大於這個值
// phase與voltage 如果可以讓使用者選擇就要檢查
// gearNumber先不管，理論上馬達的gearNumber要跟支版的gearNumber一樣
//
// bearingType對應calc-general-spec的bearing name
//
//
//
// 目前用於計算價格的方法
// useProducts
// calcSubTotalPrice 計算productlist與otehrs totalPrice的總和`
// 這個方法會送到Class_prod與Class_otehrs，於需要時呼叫
