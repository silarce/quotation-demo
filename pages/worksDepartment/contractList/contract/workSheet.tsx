// 工作表

/*

在報價單主產品
呼叫get /products/door/available-components
是為了取得材料配件資料，並顯出來
顯示出來的欄位有代號、說明、材料、表面、烤漆、單位、數量、牌價、牌價複價、單價、複價
這些欄位中，只有材料與表面會在工作表顯示出來
而材料與表面的選項目前是固定的，
所以應該是不需要呼叫 get /products/door/available-components
況且component換掉就是整個主產品換掉，這應該不是工作表這邊要做的事
component不變的話
get /products/door/generate-door-product-bom 也不需要呼叫了

看來需要呼叫並用來更新資料的只有
get /products/door/calc-general-spec
get /products/door/calc-detail-spec
這兩個api的呼叫已經放進Class_workSheet.calcProd與Class_workSheet.getInitData了
按下計算按鈕就會呼叫Class_workSheet.getInitData

如果工作表的是到現場實作後，修改主產品規格的紀錄
那麼是不是厚度、馬力數的選項就不應該是從後端取得的資料
而是應該包含所有可能的選項?
在主產品
options_horsepower
options_motor
options_phase
options_voltage
options_rollUpBoxThick
options_doorTrackThick
都是從_availableComponents拿的
先用主產品的作法吧，只是取得availableComponents後不把component換掉
只取得options

-----------------------------

工作表更新後
被更新的item會產生adjustedItem這個property
型別同item，內容是更新後的item

*/

import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
// import _ from 'lodash';
import { useRouter } from 'next/router';

// layer
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';
import WorkSheetProdCard from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProdCard';
import WorkSheetProductOutline, {
  Tcontrol_productOutline,
  ToldProductOutline,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductOutline';
import WorkSheetProductDetail01, {
  Tcontrol_detail,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail01';
import WorkSheetOptional, {
  Tcontrol_optional,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetOptional';
import WorkSheetProductDetail02, {
  Tcontrol_detail02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TupdateWorkSheetItem,
  useGetEngineeringContact,
  useGetWorkSheet,
  apiPatchWorkSheet,
  apiPostEngineeringDeliveryList,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels, TdoorModelInfoDto } from 'js/api/api_product';

// hook
import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// css
import scss from './workSheet.module.scss';

// image
import imgIdk from 'public/image/fake/idk01.png';

// options
import {
  Toption,
  optionsCreator_bottomBar,
  optionsCreator_motorLockBox,
  optionsCreator_rollerSpec,
  optionsCreator_closingType,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
  optionsCreator_surface,
  optionsCreator_componentMaterial_01,
} from 'js/utils/options/productOptions';

// type
import type { TquotationProductItemDto } from 'js/api/dtoTypes';
import { set } from 'lodash';

// ====================================================================

type Tprofile = {
  projectName: string;
  projectContent: string;
  projectNumber: string;
  projectFaxNumber: string;
  projectPerson: string;
  projectPersonNumber: string;
  allAddress: string;
  engineeringNumber: string;
  contractor: string;
  principal: string;
  contactNumber: string;
  faxNumber: string;
};

// ====================================================================
export default function WorkSheet() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);
  // const engineeringContactId = contract?.engineeringContactId;
  const { engineeringContactId, worksheetId } = contract ?? {};
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);
  const { workSheet, update_workSheet } = useGetWorkSheet(worksheetId);
  const { res: doorModelArr, update: update_doorModelArr, doorModelList } = useApiGetProdDoorModels();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得合約失敗', content: err.message });
        setIsLoading(false);
      }

      update_doorModelArr();
    })();
  }, []);

  // --------------------------------------------------------
  // --------------------------------------------------------
  const { itemTokenList, itemIdArrList } = useMemo(() => {
    /**
送給後端的item必須要有id，

要將同一類的所有id，以arr的形式紀錄，就叫itemIdArr好了，然後送進class裡面
未來要分堆的時候，就切割itemIdArr，送到另一堆的class就可以了

送給後端時，依照itemIdArr的length產生item，並把id放進去

送給後端時，只可以送有更改過的prod
用useWorkSheet裡的changedList配合forceUpdate紀錄

 */

    if (!workSheet?.contractProductItems) {
      return {};
    }

    const contractProductItems = workSheet.contractProductItems;

    const itemTokenList: { [key: string]: TquotationProductItemDto } = {};
    const itemIdArrList: { [key: string]: string[] } = {};

    contractProductItems.forEach((item) => {
      const { productId, adjustedItem, adjustedItemId } = item;

      let theItem: typeof item;
      let theId: string;

      if (adjustedItem && adjustedItemId) {
        theItem = adjustedItem;
        theId = adjustedItemId;
      } else {
        theItem = item;
        theId = productId;
      }

      itemTokenList[theId] = theItem;

      //
      if (!itemIdArrList[theId]) {
        itemIdArrList[theId] = [];
      }

      itemIdArrList[theId].push(item.id);

      // //
      // if (!itemTokenList[productId]) {
      //   itemTokenList[productId] = item;
      // }

      // if (!itemTokenList[productId]) {
      //   itemTokenList[productId] = item;
      // }

      // //
      // if (!itemIdArrList[productId]) {
      //   itemIdArrList[productId] = [];
      // }

      // itemIdArrList[productId].push(item.id);
      // //
    });

    return {
      itemTokenList,
      itemIdArrList,
    };
  }, [workSheet]);

  // --------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res01 = update_engineeringContact();
        const res02 = update_workSheet();
        await Promise.all([res01, res02]);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const [targetSheetKey, setTargetSheetKey] = useState<string>();

  const { sheetList, changedSheetList, reset } = useWorkSheet({
    itemTokenList: itemTokenList ?? {},
    itemIdArrList: itemIdArrList ?? {},
  });

  const targetSheet: Class_workSheet | undefined = sheetList[targetSheetKey ?? 'undefined'];

  const doorModelOptionArr = useMemo(() => {
    if (!doorModelList) {
      return [];
    }

    return Object.values(doorModelList).map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });
  }, [doorModelList]);

  const { guideRailOptionArr_noHook, guideRailOptionArr_withHook, doorModelMaterialOptionArr } = useMemo(() => {
    const empty = {
      guideRailOptionArr_noHook: [],
      guideRailOptionArr_withHook: [],
      doorModelMaterialOptionArr: [],
    };

    if (!doorModelList || !targetSheet?.doorModelName) {
      return empty;
    }

    const theDoorModel = doorModelList[targetSheet.doorModelName];

    if (!theDoorModel) {
      myAlert.warning({ title: '沒有匹配的門型', content: '資料庫中沒有該產品之門型資料' });

      return empty;
    }

    const guideRailOptionArr_noHook: Toption[] = [];
    const guideRailOptionArr_withHook: Toption[] = [];
    const doorModelMaterialOptionArr: Toption[] = [];

    const { guideRails, slatMaterials } = theDoorModel;

    guideRails.forEach((item) => {
      if (item.withHook) {
        guideRailOptionArr_withHook.push({
          value: item.imgSrc,
          label: item.imgSrc,
          opening: item.opening,
          icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${item.imgSrc}`,
        });
      } else {
        guideRailOptionArr_noHook.push({
          value: item.imgSrc,
          label: item.imgSrc,
          opening: item.opening,
          icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${item.imgSrc}`,
        });
      }
    });

    slatMaterials.forEach((item) => {
      doorModelMaterialOptionArr.push({ value: item.name, label: item.name });
    });

    return {
      guideRailOptionArr_noHook,
      guideRailOptionArr_withHook,
      doorModelMaterialOptionArr,
    };
  }, [doorModelList, targetSheet?.doorModelName]);

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>(creEmptyProfile());

  const changeProfile = (key: keyof Tprofile, value: string) => {
    setProfile((state) => ({ ...state, [key]: value }));
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    const {
      //
      projectName,
      projectContent,
      projectNumber,
      projectPrincipal,
      constructionSitePrincipalContactNumber,
      constructionSiteFaxNumber,
      constructionSiteContactNumber,
      contractor,
      contractorPrincipal,
      contractorContactNumber,
      contractorFaxNumber,

      //
      county,
      district,
      address,
    } = engineeringContact;

    setProfile({
      projectName: projectName,
      projectContent,
      projectNumber: constructionSiteContactNumber,
      projectFaxNumber: constructionSiteFaxNumber,
      projectPerson: projectPrincipal,
      projectPersonNumber: constructionSitePrincipalContactNumber,
      allAddress: `${county}${district}${address}`,
      engineeringNumber: projectNumber,
      contractor: contractor,
      principal: contractorPrincipal,
      contactNumber: contractorContactNumber,
      faxNumber: contractorFaxNumber,
    });

    //
  }, [engineeringContact]);

  //
  useEffect(() => {
    if (disabled) {
      reset();

      if (targetSheet) {
        targetSheet.getInitData();
      }
    }
  }, [disabled, itemTokenList]);
  //

  useEffect(() => {
    if (!targetSheet) {
      return;
    }

    targetSheet.getInitData();
  }, [targetSheet]);

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  const control_profile: Tcontrol_profile = {
    projectName: {
      value: profile.projectName,
      onChange: (v) => {
        changeProfile('projectName', v);
      },
    },
    projectContent: {
      value: profile.projectContent,
      onChange: (v) => {
        changeProfile('projectContent', v);
      },
    },
    projectNumber: {
      value: profile.projectNumber,
      onChange: (v) => {
        changeProfile('projectNumber', v);
      },
    },
    projectFaxNumber: {
      value: profile.projectFaxNumber,
      onChange: (v) => {
        changeProfile('projectFaxNumber', v);
      },
    },
    projectPerson: {
      value: profile.projectPerson,
      onChange: (v) => {
        changeProfile('projectPerson', v);
      },
    },
    projectPersonNumber: {
      value: profile.projectPersonNumber,
      onChange: (v) => {
        changeProfile('projectPersonNumber', v);
      },
    },
    allAddress: {
      value: profile.allAddress,
      onChange: (v) => {
        changeProfile('allAddress', v);
      },
    },
    engineeringNumber: {
      value: profile.engineeringNumber,
      onChange: (v) => {
        changeProfile('engineeringNumber', v);
      },
    },
    contractor: {
      value: profile.contractor,
      onChange: (v) => {
        changeProfile('contractor', v);
      },
    },
    principal: {
      value: profile.principal,
      onChange: (v) => {
        changeProfile('principal', v);
      },
    },
    contactNumber: {
      value: profile.contactNumber,
      onChange: (v) => {
        changeProfile('contactNumber', v);
      },
    },
    faxNumber: {
      value: profile.faxNumber,
      onChange: (v) => {
        changeProfile('faxNumber', v);
      },
    },
  };

  // -------------------------------------------------------------------------

  const oldProductOutline = {
    itemName: targetSheet?.oldProd.itemName ?? '',
    doorType: targetSheet?.oldProd.doorModelName ?? '',
    fullWidth: String(targetSheet?.oldProd.fullWidth ?? ''),
    height: String(targetSheet?.oldProd.height ?? ''),
    boxB: String(targetSheet?.oldProd.boxB ?? ''),
    quantity: targetSheet?.quantity ?? '',
    material: targetSheet?.oldProd.materialName ?? '',
    isAntiTyphoon: !!targetSheet?.oldProd.isAntiTyphoon,
  };

  // -------------------------------------------------------------------------

  const control_product: Tcontrol_productOutline = {
    itemName: {
      inputProps: {
        value: targetSheet?.itemName ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.itemName = v;
          }
        },
      },
    },
    doorType: {
      selectProps: {
        value: targetSheet?.doorModelName ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.doorModelName = v?.value ?? '';
          }
        },
        options: doorModelOptionArr,
      },
    },
    fullWidth: {
      inputProps: {
        value: targetSheet?.fullWidth ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.fullWidth = v;
          }
        },
        inputType: 'number',
      },
    },
    height: {
      inputProps: {
        value: targetSheet?.height ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.height = v;
          }
        },
        inputType: 'number',
      },
    },
    boxB: {
      selectProps: {
        value: targetSheet?.boxB ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.boxB = v?.value ?? '';
          }
        },
        options: targetSheet?.options_boxB ?? [],
      },
    },
    quantity: {
      inputProps: {
        value: targetSheet?.quantity ?? '',
      },
      disabled: true,
    },
    material: {
      selectProps: {
        value: targetSheet?.materialName ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.materialName = v?.value ?? '';
          }
        },
        options: doorModelMaterialOptionArr,
      },
    },
    isAntiTyphoon: {
      value: !!targetSheet?.isAntiTyphoon,
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.isAntiTyphoon = v;
        }
      },
    },
  };

  const onCalcClick = () => {
    if (!disabled) {
      targetSheet?.calcProd();
    }
  };

  // -------------------------------------------------------------------------

  const control_detail: Tcontrol_detail = {
    // 捲軸
    reel: {
      size: {
        value: targetSheet?.com_roller_size ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_roller_size = v;
          }
        },
        forbidden: true,
      },
      hasConvex: {
        value: targetSheet?.rollerSpec ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.rollerSpec = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_rollerSpec() }),
      },
    },
    // ______________________________________________________________
    // 捲箱
    reelBox: {
      material: {
        value: targetSheet?.com_headBox_material ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_material = v;
          }
        },
        optionArr: optionsCreator_componentMaterial_01(),
      },
      thickness: {
        value: targetSheet?.headBoxThickness ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.headBoxThickness = v;
          }
        },
        optionArr: targetSheet?.options_rollUpBoxThick ?? [],
      },
      surface: {
        value: targetSheet?.com_headBox_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_surface = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_surface() }),
      },
      front: {
        value: targetSheet?.com_headBox_front ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_front = v;
          }
        },
        forbidden: true,
      },
      hasConvex: {
        value: targetSheet?.com_headBox_spec ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_spec = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_rollerSpec() }),
        forbidden: true,
      },
      type: {
        value: targetSheet?.com_headBox_type ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_type = v;
          }
        },
        forbidden: true,
      },
    },
    // ______________________________________________________________
    // 底座
    base: {
      material: {
        value: targetSheet?.com_bottomBar_material ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_bottomBar_material = v;
          }
        },
        optionArr: optionsCreator_componentMaterial_01(),
      },
      angleMaterial: {
        value: targetSheet?.bottomBarAngleIron ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBarAngleIron = v;
          }
        },
        optionArr: optionsCreator_bottomBarAngleIron(),
      },
      baseMaterial: {
        value: targetSheet?.bottomBarPlate ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBarPlate = v;
          }
        },
        optionArr: optionsCreator_bottomBarPlate(),
      },
      type: {
        value: targetSheet?.bottomBar ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBar = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_bottomBar() }),
      },
      surface: {
        value: targetSheet?.com_bottomBar_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_bottomBar_surface = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_surface() }),
      },
    },
    // _________________________________________________
    // 支板
    support: {
      bearing: {
        value: targetSheet?.com_sidePlate_bearing ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_sidePlate_bearing = v;
          }
        },
        forbidden: true,
      },
      chain: {
        value: targetSheet?.com_sidePlate_chain ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_sidePlate_chain = v;
          }
        },
        forbidden: true,
      },
    },
    // _____________________________________________________
    // 門片

    doorPiece: {
      material: {
        value: targetSheet?.com_slat_material ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_slat_material = v;
          }
        },
        optionArr: doorModelMaterialOptionArr,
      },
      surface: {
        value: targetSheet?.com_slat_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_slat_surface = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_surface() }),
      },
    },
    // _____________________________________________________________
    motor: {
      horsepower: {
        value: targetSheet?.horsepower ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.horsepower = v;
          }
        },
        optionArr: targetSheet?.options_horsepower ?? [],
      },
      manufacturer: {
        value: targetSheet?.motorVendor ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorVendor = v;
          }
        },
        optionArr: targetSheet?.options_motor ?? [],
      },
      powerSupply: {
        value: targetSheet?.motorPhase ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorPhase = v;
          }
        },
        optionArr: targetSheet?.options_phase ?? [],
      },
      voltage: {
        value: targetSheet?.motorVoltage ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorVoltage = v;
          }
        },
        optionArr: targetSheet?.options_voltage ?? [],
      },
      support: {
        value: (() => {
          const spec = targetSheet?.hasMotorSupportStand;

          if (!spec) {
            return 'no';
          } else {
            return 'yes';
          }
        })(),
        onChange: (v) => {
          if (targetSheet) {
            if (v === 'no') {
              targetSheet.hasMotorSupportStand = false;
            } else if (v === 'yes') {
              targetSheet.hasMotorSupportStand = true;
            }
          }
        },
      },
      chainType: {
        value: targetSheet?.com_motor_chainType ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_motor_chainType = v;
          }
        },
        forbidden: true,
      },
      lockBox: {
        value: targetSheet?.motorLockBox ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorLockBox = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_motorLockBox() }),
      },
    },
    // ________________________________________________________________
    doorTrack: {
      material: {
        value: targetSheet?.com_guideRail_material ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_guideRail_material = v;
          }
        },
        optionArr: optionsCreator_componentMaterial_01(),
      },
      thickness: {
        value: targetSheet?.guideRailThickness ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.guideRailThickness = v;
          }
        },
        optionArr: targetSheet?.options_doorTrackThick ?? [],
      },
      surface: {
        value: targetSheet?.com_guideRail_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_guideRail_surface = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_surface() }),
      },
      silencer: {
        value: (() => {
          const spec = targetSheet?.hasSilencingStrip;

          if (!spec) {
            return 'no';
          } else {
            return 'yes';
          }
        })(),
        onChange: (v) => {
          if (targetSheet) {
            if (v === 'no') {
              targetSheet.hasSilencingStrip = false;
            } else if (v === 'yes') {
              targetSheet.hasSilencingStrip = true;
            }
          }
        },
      },
      doorTrackType: {
        value: targetSheet?.com_guideRail_type ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_guideRail_type = v;
          }
        },
        forbidden: true,
      },
      doorTrackName: {
        value: targetSheet?.guideRailName ?? '',
        // onChange: (v) => {
        //   if (targetSheet) {
        //     targetSheet.guideRail = v;
        //   }
        // },
        onChange_select: (option) => {
          if (targetSheet) {
            targetSheet.guideRail = option;
          }
        },

        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRail}`,
        optionArr: targetSheet?.isAntiTyphoon ? guideRailOptionArr_withHook : guideRailOptionArr_noHook,
      },
    },
  };

  // -------------------------------------------------------------------------

  const control_detail02: Tcontrol_detail02 = {
    size01: {
      doorType: targetSheet?.doorModelName ?? '',
      fullWidth: targetSheet?.fullWidth ?? '',
      淨高: targetSheet?.height ?? '',
      WG: targetSheet?.WG ?? '',
      gapA: numToStr(targetSheet?.prodSpec?.gapA),
      gapC: numToStr(targetSheet?.prodSpec?.gapC),
      支板尺寸: targetSheet?.BD ?? '',
      捲門全高: '999',
    },
    size02: {
      捲軸尺寸: targetSheet?.diameter ?? '',
      軸徑: targetSheet?.bearingInnerDiameter ?? '',
      軸承: targetSheet?.prodSpec?.bearingName ?? '',
      總長: targetSheet?.bearingHousingTotalLength ?? '',
      寸法: numToStr(targetSheet?.prodSpec?.bearingHousingSize), //  軸承座寸法
    },
    rollBox: {
      角鐵數量: '999',
      捲箱角鐵尺寸: '999',
      捲箱資訊: '是指一體式捲箱嗎?',
    },
    doorPiece: {
      門片材質: targetSheet?.com_slat_material ?? '',
      門片厚度: targetSheet?.thickness ?? '',
      門片長度: numToStr(targetSheet?.prodSpec?.slatLength),
      捲片支數: targetSheet?.slatCount ?? '',
      防颱勾: '是否是指主產品的"防颱"?',
    },
    motor: {
      vendor: targetSheet?.motorVendor ?? '',
      電供: (targetSheet?.motorPhase ?? '') + '相',
      馬力: targetSheet?.horsepower ?? '',
    },
    doorTrack: {
      門軌材質: targetSheet?.com_guideRail_material ?? '',
      門軌長度: numToStr(targetSheet?.prodSpec?.guideRailLength),
      門軌形式: {
        value: targetSheet?.guideRailName ?? '',
        img: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRail}`,
      },
    },
    chainCog: {
      // 鏈齒輪番號: 'gearNumber',
      鏈齒輪番號: targetSheet?.sprocketWheelModel ?? '',
      大鏈輪: targetSheet?.sprocketWheelTeethNumber ?? '',
      孔徑: targetSheet?.bearingInnerDiameter ?? '',
    },
    base: {
      底座材質: targetSheet?.com_bottomBar_material ?? '',
      底座開口: targetSheet?.guideRailsOpening ?? '',
    },
  };

  // -------------------------------------------------------------------------

  const reqPatch = async () => {
    if (!worksheetId) {
      return;
    }

    let body: TupdateWorkSheetItem[] = [];

    Object.values(changedSheetList).forEach((sheet) => {
      const bodyItemArr = sheet.bodyItemArr;
      body = [...bodyItemArr];
    });

    try {
      await apiPatchWorkSheet(worksheetId, { contractProductItems: body });
      await update_workSheet();
      setDisabled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新工作單失敗', content: err.message });
    }
  };

  /**產生出庫單 */
  const reqPostDeliveryList = async () => {
    if (!contractId) {
      return;
    }

    try {
      setIsLoading(true);
      await apiPostEngineeringDeliveryList({ contractId });
      myAlert.success({ title: '產生出庫單成功' });
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '產生出庫單失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------

  const control_optional: Tcontrol_optional = {
    value: targetSheet?.acceNameArr ?? [],
    onChange: (arr: string[]) => {
      if (targetSheet) {
        targetSheet.acceNameArr = arr;
      }
    },
  };

  // -------------------------------------------------------------------------
  const panelList_allow: TpanelList = [
    {
      type: 'myButton',
      label: '產生出庫單',
      onClick: reqPostDeliveryList,
    },
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
  ];

  const panelList_notAllow: TpanelList = [
    {
      type: 'redButton',
      label: '更新',
      onClick: reqPatch,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_allow : panelList_notAllow;
  // -----------------------------------------------------------------

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <form>
        <WorkSheetProfile control={control_profile} disabled={true} />
        <div className={scss.subTitle}>工程項目</div>
        <div className={scss.main}>
          {/* left */}
          <div className={scss.left}>
            {Object.keys(sheetList).map((key) => {
              const sheet = sheetList[key];
              const { itemName, doorModelName, quantity } = sheet;

              const onClick = () => {
                setTargetSheetKey(key);
              };

              // const isActive = key === targetSheet?.productId;
              const isActive = key === targetSheet?.identifyKey;

              const control = {
                itemName,
                doorType: doorModelName,
                qty: String(quantity),
              };

              return (
                <div key={key} onClick={onClick}>
                  <WorkSheetProdCard control={control} isActive={isActive} img={imgIdk} />
                </div>
              );
            })}
          </div>

          {/* right */}
          {/* targetSheet */}
          <div className={classNames(scss.right, !targetSheet && 'hidden')}>
            <WorkSheetProductOutline
              control={control_product}
              oldProductOutline={oldProductOutline}
              onCalcClick={onCalcClick}
              disabled={disabled}
            />

            <hr />
            <WorkSheetProductDetail01
              control={control_detail}
              disabled={disabled}
              supportTip={`馬達荷重(max:${9999},min:${9999}),馬力數:${9999}Hp`}
            />

            <hr />
            <WorkSheetOptional
              control={control_optional}
              optionArr={targetSheet?.accessoriesOptionArr_easy ?? []}
              disabled={disabled}
            />
            <hr />
            <WorkSheetProductDetail02 control={control_detail02} />
          </div>
          {/* right */}
        </div>
        {/* main */}
      </form>
    </SubLayer>
  );
}

// ===========================================================================

const numToStr = (num: number | undefined) => {
  if (num === undefined) {
    return '';
  }

  return String(num);
};

const creCheckBarOptionArr = ({ optionArr }: { optionArr: Toption[] }) => {
  const arr = optionArr.map((item) => {
    return { key: item.value, label: item.label };
  });

  return arr;
};

// ============================================================================

const creEmptyProfile = (): Tprofile => ({
  projectName: '',
  projectContent: '',
  projectNumber: '',
  projectFaxNumber: '',
  projectPerson: '',
  projectPersonNumber: '',
  allAddress: '',
  engineeringNumber: '',
  contractor: '',
  principal: '',
  contactNumber: '',
  faxNumber: '',
});
