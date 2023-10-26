// 工作表

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
import { useGetEngineeringContact, useGetWorkSheet } from 'js/api/api_engineering';

// hook
import { Class_workSheet, useWorkSheet } from 'hooks/workDepartment/workSheet/useSheet';

// css
import scss from './workSheet.module.scss';

// image
import imgIdk from 'public/image/fake/idk01.png';

import type { TquotationProductItemDto } from 'js/api/dtoTypes';

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

// type TproductOutline = {
//   itemName: string;
//   doorType: string;
//   fullWidth: string;
//   height: string;
//   boxB: string;
//   quantity: string;
//   material: string;
//   isAntiTyphoon: boolean;
// };

// type Tdetail = {
//   reel: {
//     size: string;
//     hasConvex: string;
//   };
//   reelBox: {
//     material: string;
//     thickness: string;
//     surface: string;
//     front: string;
//     hasConvex: string;
//     type: string;
//   };
//   base: {
//     material: string;
//     angleMaterial: string;
//     baseMaterial: string;
//     type: string;
//     surface: string;
//   };
//   support: {
//     bearing: string;
//     chain: string;
//   };
//   //
//   doorPiece: {
//     material: string;
//     surface: string;
//   };
//   motor: {
//     horsepower: string;
//     manufacturer: string;
//     powerSupply: string;
//     voltage: string;
//     support: string;
//     chainType: string;
//     lockBox: string;
//   };
//   doorTrack: {
//     material: string;
//     thickness: string;
//     surface: string;
//     silencer: string;
//     doorTrackType: string;
//     doorTrackName: string;
//   };
// };

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
    })();
  }, []);

  // const productList = useMemo(() => {
  //   const list: { [key: string]: TquotationProductDto } = {};

  //   if (!contract) {
  //     return list;
  //   }

  //   contract.subContracts.forEach((item) => {
  //     item.content.products.forEach((prod) => {
  //       list[prod.rootProductId] = prod;
  //     });
  //   });

  //   return list;
  // }, [contract]);

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
      const productId = item.productId;

      if (!itemTokenList[productId]) {
        itemTokenList[productId] = item;
      }

      if (!itemIdArrList[productId]) {
        itemIdArrList[productId] = [];
      }

      itemIdArrList[productId].push(item.id);
    });

    return {
      itemTokenList,
      itemIdArrList,
    };

    // console.log(workSheet);
  }, [workSheet]);

  // console.log('productList', productList);
  // console.log('itemIdArrList', itemIdArrList);
  // console.log('itemTokenList', itemTokenList);
  // console.log('----------------------------------------------');

  // --------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
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

  const [targetSheet, setTargetSheet] = useState<Class_workSheet>();

  const { sheetList, reset } = useWorkSheet({
    itemTokenList: itemTokenList ?? {},
    itemIdArrList: itemIdArrList ?? {},
  });

  // console.log(productList);
  // console.log(sheetList);

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>(creEmptyProfile());

  const changeProfile = (key: keyof Tprofile, value: string) => {
    setProfile((state) => ({ ...state, [key]: value }));
  };

  // ______________________________________________________________
  // const [oldProductOutline, setOldProductOutline] = useState<TproductOutline>(creEmptyProductOutline());
  // const [productOutline, setProdcutOutline] = useState<TproductOutline>(creEmptyProductOutline());

  // const changeProduct = (key: keyof TproductOutline, value: string | boolean) => {
  //   setProdcutOutline((state) => ({ ...state, [key]: value }));
  // };

  // ______________________________________________________________

  // const [detail, setDetail] = useState<Tdetail>(creEmptyDetail());

  // function changeDetail<TpKey extends keyof Tdetail, TcKey extends keyof Tdetail[TpKey]>(
  //   pKey: TpKey,
  //   cKey: TcKey,
  //   value: Tdetail[TpKey][TcKey]
  // ) {
  //   setDetail((state) => {
  //     const copy = { ...state };

  //     copy[pKey][cKey] = value;

  //     return copy;
  //   });
  // }

  // -------------------------------------------------------------------------

  // const [others, setOthers] = useState<string[]>([]);

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
    }
  }, [disabled, itemTokenList]);
  //

  useEffect(() => {
    if (!targetSheet) {
      return;
    }

    if (targetSheet.accessoriesOptionArr.length === 0) {
      targetSheet.getAccessoriesArr();
    }
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

  /*
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面
接下來把options放到control裡面

*/

  const control_product: Tcontrol_productOutline = {
    itemName: {
      value: targetSheet?.itemName ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.itemName = v;
        }
      },
    },
    doorType: {
      value: targetSheet?.doorModelName ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.doorModelName = v;
        }
      },
    },
    fullWidth: {
      value: targetSheet?.fullWidth ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.fullWidth = v;
        }
      },
    },
    height: {
      value: targetSheet?.height ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.height = v;
        }
      },
    },
    boxB: {
      value: targetSheet?.boxB ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.boxB = v;
        }
      },
    },
    quantity: {
      value: targetSheet?.quantity ?? '',
      // onChange: (v) => {
      //   if (targetSheet) {
      //     targetSheet.quantity = v;
      //   }
      // },
      disabled: true,
    },
    material: {
      value: targetSheet?.materialName ?? '',
      onChange: (v) => {
        if (targetSheet) {
          targetSheet.materialName = v;
        }
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
    alert('test');
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
        value: (() => {
          const spec = targetSheet?.com_roller_spec;

          if (!spec) {
            return 'no';
          } else {
            return 'yes';
          }
        })(),
        onChange: (v) => {
          if (targetSheet) {
            if (v === 'no') {
              targetSheet.com_roller_spec = false;
            } else if (v === 'yes') {
              targetSheet.com_roller_spec = true;
            }
          }
        },
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
      },
      thickness: {
        value: targetSheet?.headBoxThickness ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.headBoxThickness = v;
          }
        },
      },
      surface: {
        value: targetSheet?.com_headBox_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_surface = v;
          }
        },
      },
      front: {
        value: targetSheet?.com_headBox_front ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_front = v;
          }
        },
      },
      hasConvex: {
        value: targetSheet?.com_headBox_spec ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_spec = v;
          }
        },
      },
      type: {
        value: targetSheet?.com_headBox_type ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_headBox_type = v;
          }
        },
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
      },
      angleMaterial: {
        value: targetSheet?.bottomBarAngleIron ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBarAngleIron = v;
          }
        },
      },
      baseMaterial: {
        value: targetSheet?.bottomBarPlate ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBarPlate = v;
          }
        },
      },
      type: {
        value: targetSheet?.bottomBar ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.bottomBar = v;
          }
        },
      },
      surface: {
        value: targetSheet?.com_bottomBar_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_bottomBar_surface = v;
          }
        },
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
      },
      chain: {
        value: targetSheet?.com_sidePlate_chain ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_sidePlate_chain = v;
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
      },
      surface: {
        value: targetSheet?.com_slat_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_slat_surface = v;
          }
        },
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
      },
      manufacturer: {
        value: targetSheet?.motorVendor ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorVendor = v;
          }
        },
      },
      powerSupply: {
        value: targetSheet?.motorPhase ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorPhase = v;
          }
        },
      },
      voltage: {
        value: targetSheet?.motorVoltage ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorVoltage = v;
          }
        },
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
      },
      lockBox: {
        value: targetSheet?.motorLockBox ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.motorLockBox = v;
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
      },
      thickness: {
        value: targetSheet?.guideRailThickness ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.guideRailThickness = v;
          }
        },
      },
      surface: {
        value: targetSheet?.com_guideRail_surface ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.com_guideRail_surface = v;
          }
        },
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
      },
      doorTrackName: {
        value: targetSheet?.guideRail ?? '',
        onChange: (v) => {
          if (targetSheet) {
            targetSheet.guideRail = v;
          }
        },
        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRail}`,
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
      gapA: '999',
      gapC: '999',
      支板尺寸: targetSheet?.BD ?? '',
      捲門全高: '999',
    },
    size02: {
      捲軸尺寸: '是指捲軸的數量嗎?',
      軸徑: '999',
      軸承: '999',
      總長: '是指捲軸的數量嗎?',
      寸法: '999',
    },
    rollBox: {
      角鐵數量: '999',
      捲箱角鐵尺寸: '999',
      捲箱資訊: '是指一體式捲箱嗎?',
    },
    doorPiece: {
      門片材質: targetSheet?.com_slat_material ?? '',
      門片厚度: targetSheet?.thickness ?? '',
      門片長度: '999',
      捲片支數: '999',
      防颱勾: '是否是指主產品的"防颱"?',
    },
    motor: {
      vendor: targetSheet?.motorVendor ?? '',
      電供: (targetSheet?.motorPhase ?? '') + '相',
      馬力: targetSheet?.horsepower ?? '',
    },
    doorTrack: {
      門軌材質: targetSheet?.com_guideRail_material ?? '',
      門軌長度: '999',
      門軌形式: {
        value: targetSheet?.guideRail ?? '',
        img: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${targetSheet?.guideRail}`,
      },
    },
    chainCog: {
      鏈齒輪番號: '999',
      大鏈輪: '999',
      孔徑: '999',
    },
    base: {
      底座材質: targetSheet?.com_bottomBar_material ?? '',
      底座開口: '999',
    },
  };

  // -------------------------------------------------------------------------

  // Tcontrol_optional

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
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
  ];

  const panelList_notAllow: TpanelList = [
    // {
    //   type: 'myButton',
    //   label: 'test',
    //   onClick: () => {},
    // },
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
      <PageHeader panelList={panelList} />

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
                setTargetSheet(sheet);
              };

              const isActive = key === targetSheet?.productId;

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
              supportTip={`馬達荷重(max:${999},min:${999}),馬力數:${99}Hp`}
            />

            <hr />
            <WorkSheetOptional
              // value={others}
              // onChange={(arr) => {
              //   setOthers(arr);
              // }}
              control={control_optional}
              // optionArr={othersOptions}
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

// const othersOptions = [
//   { value: '門楣', label: '門楣' },
//   { value: '防颱底座鎖固', label: '防颱底座鎖固' },
//   { value: 'UL 熔金體', label: 'UL 熔金體' },
//   { value: '智慧型密碼開關', label: '智慧型密碼開關' },
//   { value: '遙控器(1:2)', label: '遙控器(1:2)' },
//   { value: '防颱活動中柱(滑軌)', label: '防颱活動中柱(滑軌)' },
//   { value: '颱風活動中柱(可拆式)', label: '颱風活動中柱(可拆式)' },
//   { value: '防爆裝置', label: '防爆裝置' },
//   { value: '手動關閉裝置', label: '手動關閉裝置' },
//   { value: 'UPS', label: 'UPS' },
//   { value: '煙感+中繼器', label: '煙感+中繼器' },
//   { value: '彈射門', label: '彈射門' },
// ];

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

// const creEmptyProductOutline = (): TproductOutline => ({
//   itemName: '',
//   doorType: '',
//   fullWidth: '',
//   height: '',
//   boxB: '',
//   quantity: '',
//   material: '',
//   isAntiTyphoon: false,
// });

// const creEmptyDetail = (): Tdetail => ({
//   reel: {
//     size: '',
//     hasConvex: '',
//   },
//   reelBox: {
//     material: '',
//     thickness: '456',
//     surface: '',
//     front: '',
//     hasConvex: '',
//     type: '',
//   },
//   base: {
//     material: '',
//     angleMaterial: '',
//     baseMaterial: '',
//     type: '',
//     surface: '',
//   },
//   support: {
//     bearing: '',
//     chain: '',
//   },
//   //
//   doorPiece: {
//     material: '',
//     surface: '',
//   },
//   motor: {
//     horsepower: '',
//     manufacturer: '',
//     powerSupply: '',
//     voltage: '',
//     support: '',
//     chainType: '',
//     lockBox: '',
//   },
//   doorTrack: {
//     material: '',
//     thickness: '',
//     surface: '',
//     silencer: '',
//     doorTrackType: '',
//     doorTrackName: '',
//   },
// });

console.log(
  JSON.parse(`{
  "contractProductItem":                {
            "id": "1fa79772-a846-46af-9ba2-0d67ada04585",
            "createdAt": "2023-10-26T02:05:55.107Z",
            "updatedAt": "2023-10-26T02:08:40.117Z",
            "createdBy": "4ab9a27a-1fcb-437a-9cdf-f239e768930e",
            "updatedBy": "4ab9a27a-1fcb-437a-9cdf-f239e768930e",
            "deletedBy": null,
            "itemNumber": "S-1121026-02undefined0101",
            "itemName": "測試update第1次",
            "discount": "100",
            "quoteType": "捲門",
            "doorModelName": "SJ-302",
            "fullWidth": 3000,
            "WG": 50000,
            "height": 55000,
            "boxB": 0,
            "area": "165.00",
            "volume": "",
            "materialName": "SST#304",
            "materialSurface": "HL",
            "guideRail": "SJ302_30.svg",
            "horsepower": "",
            "motorVendor": "",
            "motorVoltage": 0,
            "hasMotorSupportStand": false,
            "bottomBar": "",
            "motorLockBox": "外露",
            "guideRailThickness": "0",
            "rollerSpec": "無凸",
            "hasSilencingStrip": false,
            "isIntegratedHeadBox": false,
            "headBoxThickness": "0",
            "unitPrice": 302940,
            "totalPrice": 302940,
            "price": 302940,
            "dualPrice": 302940,
            "isAntiTyphoon": false,
            "bounceDoor": true,
            "closingType": "電動",
            "notes": "",
            "motorPhase": 1,
            "bottomBarAngleIron": "不鏽鋼#304 50*50*3T",
            "bottomBarPlate": "不鏽鋼#304 1.5T",
            "productId": "1f534566-4d0d-45e6-bbc7-4dfce1fda512",
            "worksheetId": "844fb786-1a65-4008-a40c-2bd4b5b6d64b",
            "others": null
        }
}`)
);
