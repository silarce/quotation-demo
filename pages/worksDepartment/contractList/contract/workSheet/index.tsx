// 工作表

// 按下計算按鈕會呼叫targetSheet.calcProd()

/*


捲軸
捲箱
底座
支版
門片
電動機
門軌
這七個區塊的內容"大多"是對應的component
沒有馬達配件區塊


呼叫get /products/door/available-components
是為了取得材料配件資料，並顯出來
顯示出來的欄位有代號、說明、材料、表面、烤漆、單位、數量、牌價、牌價複價、單價、複價
這些欄位中，只有材料與表面會在工作表顯示出來
而材料與表面的選項目前是固定的，
所以應該是不需要呼叫 get /products/door/available-components
況且component換掉就是整個主產品換掉，這應該不是工作表這邊要做的事
component不變的話
get /products/door/generate-door-product-bom 也不需要呼叫了

在工作表甚至工務部這邊，不需要 componentId
所以即使componentId對應的規格與使用者編輯後的規格不搭配也沒關係
工作表就是讓使用者依現場的情況編輯規格，然後交給相關部門(例如業務部)參考用的

_________________________________________________________________


get /products/door/calc-general-spec // 用來取得經過計算才能知道的規格(不可以隨意編輯)
get /products/door/calc-detail-spec // 用來取得門片數量
這兩個api的呼叫已經放進Class_workSheet.calcProd了

get /products/door/calc-side-plate-size-d // 用來取得boxD
這個不需要在init呼叫，按下計算按鈕時呼叫就好了


Class_workSheet.getInitData
會呼叫 getAccessoriesArr與getProdAvailableComponents


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

必須要把取得boxD的api放進去

工作表更新後
被更新的item會產生adjustedItem這個property
型別同item，內容是更新後的item
*/

import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile, {
  Tcontrol_profile,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';
import WorkSheetProdCard, {
  Tcontrol_prodCard,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProdCard';
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
import WorkSheetPDF, {
  Tcontrol_workSheetPDF_01,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF';

import WorkSheetPDF_02, {
  Tcontrol_workSheetPDF_02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetPDF/workSheetPDF_02';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// api
import { useGetContract_id_noItems } from 'js/api/api_quotation';
import {
  TupdateWorkSheetItem,
  useGetEngineeringContact,
  useGetWorkSheet,
  apiPatchWorkSheet,
  apiDeleteWorkSheetItem,
} from 'js/api/api_engineering';
import { useApiGetProdDoorModels } from 'js/api/api_product';

// hook
import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// utils
import { downloadExcel } from 'components/page/worksDepartment/contracList/contract/workSheet/downloadExcel';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './workSheet.module.scss';

// options
import {
  Toption,
  optionsCreator_bottomBar,
  optionsCreator_motorLockBox,
  optionsCreator_rollerSpec,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
  optionsCreator_surface,
  optionsCreator_componentMaterial_01,
} from 'js/utils/options/productOptions';

// type
import type { TquotationProductItemDto, TerpFeatureDto } from 'js/api/dtoTypes';

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
export default function WorkSheet({
  isAdmin,
  userErpFeature,
}: {
  isAdmin: boolean;
  userErpFeature: TerpFeatureDto[] | undefined;
}) {
  const havePermissionToEdit = useMemo(() => {
    if (isAdmin) {
      return true;
    }

    const isHave = userErpFeature?.some((item) => {
      return item.name === '工務部-工作表編輯';
    });

    return !!isHave;
  }, [userErpFeature]);
  // ----------------------------------------------------------------

  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [isShowPdf, setIsShowPdf] = useState(false);
  const [isShowPdf02, setIsShowPdf02] = useState(false);

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
用useWorkSheet裡的changedList配合forceUpdate紀錄 */

    if (!workSheet?.contractProductItems) {
      return {};
    }

    const contractProductItems = _.sortBy(workSheet.contractProductItems, 'createdAt');

    type TitemTokenList = {
      [key: string]: {
        originalItem: TquotationProductItemDto;
        [key: string]: TquotationProductItemDto;
      };
    };

    type TitemIdArrList = { [key: string]: { [key: string]: string[] } };

    const itemTokenList: TitemTokenList = {};
    const itemIdArrList: TitemIdArrList = {};

    contractProductItems.forEach((item) => {
      const { productId, adjustedItem, adjustedItemId } = item;

      let theItem: typeof item;
      let theId: string;

      if (adjustedItem && adjustedItemId) {
        theItem = adjustedItem;
        theItem.adjustedItemId = adjustedItemId;
        theId = adjustedItemId;
      } else {
        theItem = item;
        theId = productId;
      }

      if (!itemTokenList[productId]) {
        itemTokenList[productId] = {
          originalItem: item,
          [productId]: item, //itemTokenList[productId][productId] 為原始資料
        };
      }

      itemTokenList[productId][theId] = theItem;

      //
      if (!itemIdArrList[productId]) {
        itemIdArrList[productId] = {
          [productId]: [], //itemIdArrList[productId][productId] 為原始資料代表的itemId陣列
        };
      }

      if (!itemIdArrList[productId][theId]) {
        itemIdArrList[productId][theId] = [];
      }

      itemIdArrList[productId][theId].push(item.id);

      //
    }); //  forEach close

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
  const {
    sheetList,
    changedSheetList,
    reset,
    isHookLoading,
    doorModelList: doorModelList_hook,
    options_doorModel,
  } = useWorkSheet({
    itemTokenList: _.cloneDeep(itemTokenList) ?? {},
    itemIdArrList: _.cloneDeep(itemIdArrList) ?? {},
  });

  const [targetSheetKey, setTargetSheetKey] = useState<[string, string]>();

  const targetSheetKey_p = targetSheetKey?.[0];
  const targetSheetKey_c = targetSheetKey?.[1];
  const firstSheetKey_p = Object.keys(sheetList ?? {})[0] ?? undefined;

  const [targetDivideItem, setTargetDivideItem] = useState<(qty: number) => void>();

  const targetSheet: Class_workSheet | undefined =
    targetSheetKey_p && targetSheetKey_c
      ? sheetList[targetSheetKey_p]?.[targetSheetKey_c]
      : sheetList[firstSheetKey_p]?.[firstSheetKey_p];

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
      // projectNumber: contract?.content.quotationNumber ?? '',
      // 有空時把key改成projectPhoneNumber
      projectNumber: constructionSiteContactNumber ?? '',
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
    if (!doorModelList) {
      return;
    }

    if (disabled) {
      reset();

      if (targetSheet) {
        targetSheet.getInitData();
      }
    }
  }, [disabled, itemTokenList, doorModelList_hook]);
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
    // 有空時把key改成projectPhoneNumber
    projectNumber: {
      // value: profile.projectNumber,
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
        options: options_doorModel,
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
        // options: doorModelMaterialOptionArr,
        options: targetSheet?.options_material ?? null,
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
        // value: targetSheet?.com_roller_size ?? '',
        value: targetSheet?.diameter ? `${targetSheet.diameter}"` : '',
        disabled: true,
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
      //
      front: {
        value: targetSheet?.headBoxFront ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.headBoxFront = v;
          }
        },
      },
      //
      hasConvex: {
        value: targetSheet?.headBoxProtruding ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.headBoxProtruding = v;
          }
        },
        checkBarOptionArr: creCheckBarOptionArr({ optionArr: optionsCreator_rollerSpec() }),
      },
      //
      type: {
        value: String(targetSheet?.headBoxForm),
        onChange: (v) => {
          if (targetSheet) {
            const bool = v === 'true' ? true : false;
            targetSheet.headBoxForm = bool;
          }
        },
        optionArr: [
          { value: 'false', label: '捲箱 + 機箱' },
          { value: 'true', label: '方形捲箱' },
        ],
      },
      // 角鐵數量
      angleIronQuantity: {
        value: targetSheet?.headBoxAngleIronQuantity ?? '',
        onChange: (str) => {
          if (targetSheet) {
            targetSheet.headBoxAngleIronQuantity = str;
          }
        },
        inputType: 'number',
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
        value: targetSheet?.prodSpec?.bearingName ?? '',
        disabled: true,
      },
      chain: {
        value: targetSheet?.sprocketWheelModel ?? '',
        disabled: true,
      },
      // 方向
      direction: {
        value: targetSheet?.sidePlateDirection ?? '',
        onChange: (str) => {
          if (targetSheet) {
            targetSheet.sidePlateDirection = str;
          }
        },
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
        optionArr: targetSheet?.options_material ?? null,
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
        value: targetSheet?.electricMotorChainType ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.electricMotorChainType = v;
          }
        },
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
      // 方向
      direction: {
        value: targetSheet?.electricMotorDirection ?? '',
        onChange: (str) => {
          if (targetSheet) {
            targetSheet.electricMotorDirection = str;
          }
        },
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
        value: targetSheet?.guideRailType ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.guideRailType = v;
          }
        },
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

        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRailName}`,
        // optionArr: targetSheet?.isAntiTyphoon ? guideRailOptionArr_withHook : guideRailOptionArr_noHook,
        optionArr: targetSheet?.options_guideRail ?? [],
      },
    },
  };

  // -------------------------------------------------------------------------

  const control_detail02: Tcontrol_detail02 = {
    size01: {
      doorType: targetSheet?.doorModelName ?? '',
      fullWidth: targetSheet?.fullWidth_mm ?? '',
      淨高: targetSheet?.height_mm ?? '',
      WG: targetSheet?.WG_mm ?? '',
      gapA: numToStr(targetSheet?.prodSpec?.gapA),
      gapC: numToStr(targetSheet?.prodSpec?.gapC),
      支板尺寸: `${targetSheet?.boxB_mm ?? ''}*${targetSheet?.boxD_mm ?? ''}`,
      捲門全高: targetSheet?.fullHeight ?? '',
    },
    size02: {
      捲軸尺寸: targetSheet?.diameter ? `${targetSheet.diameter}"` : '',
      軸徑: targetSheet?.bearingInnerDiameter ?? '',
      軸承: targetSheet?.prodSpec?.bearingName ?? '',
      總長: targetSheet?.bearingHousingTotalLength ?? '',
      寸法: numToStr(targetSheet?.prodSpec?.bearingHousingSize), //  軸承座寸法
    },
    rollBox: {
      角鐵數量: targetSheet?.headBoxAngleIronQuantity ?? '',
      捲箱角鐵尺寸: targetSheet?.angleIronSize ?? '',
      捲箱資訊: targetSheet?.headBoxForm_str ?? '',
    },
    doorPiece: {
      門片材質: targetSheet?.com_slat_material ?? '',
      門片厚度: targetSheet?.thickness ?? '',
      門片長度: numToStr(targetSheet?.prodSpec?.slatLength),
      捲片支數: targetSheet?.slatCount ?? '',
      防颱勾: !targetSheet ? '' : targetSheet?.isAntiTyphoon ? '是' : '否',
    },
    motor: {
      vendor: targetSheet?.motorVendor ?? '',
      電供: targetSheet?.motorPhaseVoltage ?? '',
      馬力: targetSheet?.horsepower ?? '',
    },
    doorTrack: {
      門軌材質: targetSheet?.com_guideRail_material ?? '',
      門軌長度: numToStr(targetSheet?.prodSpec?.guideRailLength),
      門軌形式: {
        value: targetSheet?.guideRailName ?? '',
        img: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRailName}`,
      },
    },
    chainCog: {
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
    if (!worksheetId || !workSheet?.contractProductItems || !havePermissionToEdit) {
      return;
    }

    let deleteIdList: { [key: string]: string[] } = {};
    let body: TupdateWorkSheetItem[] = [];

    Object.values(changedSheetList).forEach((sheet) => {
      if (sheet.isOriginal) {
        deleteIdList = { ...deleteIdList, ...sheet.idListShouldDelete };
        // deleteIdArr = [...deleteIdArr, ...sheet.idListShouldDelete];
      } else {
        const bodyItemArr = sheet.bodyItemArr;
        body = [...body, ...bodyItemArr];
      }
    });

    setIsLoading(true);

    //

    for (const key in deleteIdList) {
      const deleteIdArr = deleteIdList[key];

      try {
        await apiDeleteWorkSheetItem(worksheetId, { contractProductItemsId: deleteIdArr });
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '清除工作表項目失敗', content: err.message });
        setDisabled(true);
      }
    }

    //

    for (const key in changedSheetList) {
      const sheet = changedSheetList[key];

      if (sheet.isOriginal) {
        continue;
      }

      // 必須先執行確保accessories的name都有值的步驟才可以取body
      const body = changedSheetList[key].bodyItemArr;

      try {
        await apiPatchWorkSheet(worksheetId, { contractProductItems: body });
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '更新工作表失敗', content: err.message });
        setDisabled(true);
        break;
      }
    } // for

    await update_workSheet();
    setIsLoading(false);
    setDisabled(true);

    //
  };

  // -------------------------------------------------------------------------

  const control_optional: Tcontrol_optional = {
    value: targetSheet?.acceIdArr ?? [],
    onChange: (arr: string[]) => {
      if (targetSheet) {
        targetSheet.acceIdArr = arr;
      }
    },
  };

  // -------------------------------------------------------------------------

  const { control_workSheetPDF_01, control_workSheetPDF_02 } = useMemo(() => {
    const workSheetPDF_01_itemArr: Tcontrol_workSheetPDF_01['itemArr'] = [];

    Object.values(sheetList).forEach((subList) => {
      Object.values(subList).forEach((sheet) => {
        const control_item: Tcontrol_workSheetPDF_01['itemArr'][number] = {
          itemName: sheet.itemName,
          size: {
            qty: sheet.quantity,
            doorModelName: sheet.doorModelName,
            fullWidth: sheet.fullWidth_mm,
            height: sheet.height_mm,
            WG: sheet.WG_mm,
            gapA: numToStr(sheet.prodSpec?.gapA),
            gapC: numToStr(sheet.prodSpec?.gapC),
            /**支版尺寸 boxB*boxD */
            BD: `${sheet.boxB_mm}*${sheet.boxD_mm}`,
            /**捲門全高 */
            fullHeight: sheet.fullHeight,
            weightConversion: '', // 未知 // 重量換算 沒有在任一表單顯示
          },
          roller: {
            diameter: `${sheet.diameter}"` ?? '', // 要有 " 符號，代表吋
            bearingInnerDiameter: sheet.bearingInnerDiameter ?? '',
            bearingName: sheet.prodSpec?.bearingName ?? '',
            bearingHousingTotalLength: sheet.bearingHousingTotalLength ?? '',
            bearingHousingSize: numToStr(sheet.prodSpec?.bearingHousingSize),
          },
          headBox: {
            angleIronQty: sheet.headBoxAngleIronQuantity,
            angleIronSize: sheet.angleIronSize,
            form: sheet.headBoxForm_str,
            surface: '',
          },
          doorPiece: {
            material: sheet.com_slat_material,
            surface: sheet.com_slat_surface ?? '',
            thickness: sheet.thickness,
            slatLength: numToStr(sheet.prodSpec?.slatLength),
            slatCount: sheet.slatCount,
            antyTyphoonHook: sheet.isAntiTyphoon ? '有' : '無',
          },
          motor: {
            vendor: sheet.motorVendor,
            /**相數加電壓 */
            phaseVoltage: sheet.motorPhaseVoltage,
            horsepower: sheet.horsepower,
            direction: '', // 未知 // 在廠務部工作表 電動機方向
          },
          guideRail: {
            form: sheet.isAntiTyphoon ? '防颱' : '一般',
            material: sheet.com_guideRail_material,
            guideRailLength: numToStr(sheet.prodSpec?.guideRailLength),
            guideRailName: sheet.guideRailName,
            icon: sheet?.guideRailName
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${sheet?.guideRailName}`
              : undefined,
            antiTyphoonHook: '-50', // 未知 // 在廠務部工作表
            bendStraight: sheet.guideRailType ?? '',
          },
          chainCog: {
            sprocketWheelModel: sheet.sprocketWheelModel ?? '',
            sprocketWheelTeethNumber: sheet.sprocketWheelTeethNumber ?? '',
            bearingInnerDiameter: sheet.bearingInnerDiameter ?? '',
            teethQuantity: '', // 未知 // 在廠務部工作表 齒數
            centerDistance: '', // 未知 // 在廠務部工作表 中心距
            eyesQuantity: '', // 未知 // 在廠務部工作表 目數
          },
          base: {
            material: sheet.com_bottomBar_material,
            guideRailsOpening: sheet.guideRailsOpening,
            surface: '', // 未知 在廠務部工作表
          },
          sidePlate: {
            direction: '', // 未知 在廠務部工作表
            bigSidePlate: `${sheet.boxB_mm}*${sheet.boxD_mm}`,
            smallSidePlate: `${sheet.boxB_mm}*${sheet.boxB_mm}`,
          },
          memo: sheet.acceNameArr.length > 0 ? sheet.acceNameArr.join('、') : '',
        };
        workSheetPDF_01_itemArr.push(control_item);
      });
    });

    const control_workSheetPDF_01: Tcontrol_workSheetPDF_01 = {
      info: {
        contractNumber: profile.projectNumber,
        projectName: profile.projectName,
        projectAddress: profile.allAddress,
        customerName: contract?.content.customer.name ?? '',
        contactPerson: engineeringContact?.contactInfo?.[0]?.contactPerson ?? '',
        // 開單日
        billingDate: workSheet?.createdAt ? getTaiwanDateStr(workSheet.createdAt) ?? '' : '', // 未知
        // 出貨日
        shippingDate: '', // 未知
      },
      itemArr: workSheetPDF_01_itemArr,
      // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
    };

    let totalQty_PDF_02 = 0;
    workSheetPDF_01_itemArr.forEach((item) => {
      totalQty_PDF_02 = totalQty_PDF_02 + Number(item.size.qty);
    });
    const control_workSheetPDF_02: Tcontrol_workSheetPDF_02 = {
      info: {
        projectName: profile.projectName,
        totalQty: String(totalQty_PDF_02),
      },
      itemArr: workSheetPDF_01_itemArr,
      // itemArr: [...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr, ...workSheetPDF_01_itemArr],
    };

    return {
      control_workSheetPDF_01,
      control_workSheetPDF_02,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetList]);

  // -------------------------------------------------------------------------

  const panelList_allow: TpanelList = [
    {
      type: 'myButton',
      label: '匯出EXCEL',
      onClick: () => downloadExcel(control_workSheetPDF_01, `工作表_${profile.projectName}`),
    },
    {
      type: 'myButton',
      label: '匯出廠務部工作表',
      onClick: () => setIsShowPdf02(true),
    },
    {
      type: 'myButton',
      label: '匯出工作表',
      onClick: () => setIsShowPdf(true),
    },
    {
      type: 'myButton',
      label: havePermissionToEdit ? '編輯' : '沒有編輯權限',
      onClick: () => {
        if (havePermissionToEdit) {
          setDisabled(false);
        }
      },
    },
  ];

  // if (!havePermissionToEdit) {
  //   panelList_allow.pop();
  // }

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

  const forbidden = targetSheet?.isOriginal;

  return (
    <SubLayer isLoading_all={isLoading || isHookLoading || targetSheet?.isLoading}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <WorkSheetProfile control={control_profile} disabled={true} />
        <div className={scss.subTitle}>工程項目</div>
        <div className={scss.main}>
          {/* left */}
          <div className={scss.left}>
            {Object.keys(sheetList).map((pKey) => {
              const list: Tcontrol_prodCard['list'] = [];

              let qty = 0;

              Object.keys(sheetList[pKey]).forEach((cKey) => {
                const item = sheetList[pKey][cKey];
                qty += Number(item.quantity);

                const {
                  itemName,
                  // doorModelName,
                  //  quantity
                  quantity,
                } = item;

                let isActive = false;

                if (targetSheetKey_p === pKey && targetSheetKey_c === cKey) {
                  isActive = true;
                }

                const length = Object.keys(sheetList[pKey]).length;

                list.push({
                  isOriginal: item.isOriginal,
                  itemName: itemName,
                  qty: quantity,
                  onClick: (e) => {
                    e.stopPropagation();
                    setTargetSheetKey([pKey, cKey]);
                  },
                  isActive,
                  onDivideClick: () => {
                    setTargetDivideItem(() => {
                      return (qty: number) => {
                        item.divideItem(qty, `-${String(length)}`);
                        setTargetDivideItem(undefined);
                      };
                    });
                  },
                  onDeleteClick: () => item.clearSheet(),
                });
              });

              const originalItem = itemTokenList?.[pKey].originalItem;

              let width = originalItem?.fullWidth ?? 0;
              width = new Decimal(width).div(1000).toNumber();

              let height = originalItem?.height ?? 0;
              height = new Decimal(height).div(1000).toNumber();

              const control: Tcontrol_prodCard = {
                itemName: originalItem?.itemName ?? '',
                doorType: originalItem?.doorModelName ?? '',
                qty: String(qty),
                width: String(width),
                height: String(height),
                onClick: (e) => {
                  setTargetSheetKey([pKey, pKey]);
                },
                list,
              };

              return (
                <div key={pKey}>
                  <WorkSheetProdCard disabled={disabled} control={control} />
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
              disabled={forbidden || disabled}
            />

            <hr />
            <WorkSheetProductDetail01
              control={control_detail}
              disabled={forbidden || disabled}
              // supportTip={`馬達荷重(max:${9999},min:${9999}),馬力數:${9999}Hp`}
            />

            <hr />
            <WorkSheetOptional
              control={control_optional}
              optionArr={targetSheet?.accessoriesOptionArr_easy ?? []}
              disabled={forbidden || disabled}
            />
            <hr />
            <WorkSheetProductDetail02 control={control_detail02} />
          </div>
          {/* right */}
        </div>
        {/* main */}
      </form>
      <InputModal
        visible={!!targetDivideItem}
        title="分堆"
        placeholder="請輸入數量"
        onConfirm={(str) => {
          targetDivideItem?.(Number(str));
        }}
        onCancel={() => setTargetDivideItem(undefined)}
        inputAttr={{
          type: 'number',
        }}
      />
      <WorkSheetPDF isShow={isShowPdf} onCancel={() => setIsShowPdf(false)} control={control_workSheetPDF_01} />
      <WorkSheetPDF_02 isShow={isShowPdf02} onCancel={() => setIsShowPdf02(false)} control={control_workSheetPDF_02} />
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

// ============================================================================

/**
 *
 * 一體式捲箱 true === 方形捲箱
 * false ==="捲箱 + 機箱"
 *
 * 方向 數量加方向 2右 6左 8左   這樣
 * 捲箱的角鐵尺寸為 WG + gapA + gapC - 10
 *
 * 門軌的防颱先全部放-50
 * 捲箱角鐵數量由使用者輸入
 *
 *
 * 電動機與支版的方向是一樣的
 * 所以記錄在product就好了
 *
 *
 *
根據PDF缺的欄位而需要新增的property
方向 角鐵數量 彎直
另外要新增的欄位

開單日 date string
出貨日 date string

捲箱
正面 string
有無凸 string
角鐵數量 number

支版
鍊條 string 應該是不可編輯的欄位
方向 string

電動機
鍊條型式 string
方向 string

門軌
型式 string





另外開單日期與出貨日期還不知道要帶入什麼值
 
馬達荷重怎麼算
 
 */
