// 工作表

import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
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
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductOutline';
import WorkSheetProductDetail01, {
  Tcontrol_detail,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail01';
import WorkSheetOptional from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetOptional';
import WorkSheetProductDetail02, {
  Tcontrol_detail02,
} from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProductDetail02';

// gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
// import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
// import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

// api

import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';

// css
import scss from './workSheet.module.scss';

// image
import imgIdk from 'public/image/fake/idk01.png';

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

type TproductOutline = {
  itemName: string;
  doorType: string;
  fullWidth: string;
  height: string;
  boxB: string;
  quantity: string;
  material: string;
  isAntiTyphoon: boolean;
};

type Tdetail = {
  reel: {
    size: string;
    hasConvex: string;
  };
  reelBox: {
    material: string;
    thickness: string;
    surface: string;
    front: string;
    hasConvex: string;
    type: string;
  };
  base: {
    material: string;
    angleMaterial: string;
    baseMaterial: string;
    type: string;
    surface: string;
  };
  support: {
    bearing: string;
    chain: string;
  };
  //
  doorPiece: {
    material: string;
    surface: string;
  };
  motor: {
    horsepower: string;
    manufacturer: string;
    powerSupply: string;
    voltage: string;
    support: string;
    chainType: string;
    lockBox: string;
  };
  doorTrack: {
    material: string;
    thickness: string;
    surface: string;
    silencer: string;
    doorTrackType: string;
    doorTrackName: string;
  };
};

// ====================================================================
export default function WorkSheet() {
  const router = useRouter();
  const { contractId } = router.query as { contractId: string | undefined };

  const [disabled, setDisabled] = useState(true);

  const [activeCard, setActiveCard] = useState(-1);

  // -------------------------------------------------------------------------
  const { data: contract, update: update_contract } = useGetContract_id_noItems(contractId);

  useEffect(() => {
    update_contract();
  }, []);

  // -------------------------------------------------------------------------

  const [profile, setProfile] = useState<Tprofile>(creEmptyProfile());

  const changeProfile = (key: keyof Tprofile, value: string) => {
    setProfile((state) => ({ ...state, [key]: value }));
  };

  // ______________________________________________________________
  const [oldProductOutline, setOldProductOutline] = useState<TproductOutline>(creEmptyProductOutline());
  const [productOutline, setProdcutOutline] = useState<TproductOutline>(creEmptyProductOutline());

  const changeProduct = (key: keyof TproductOutline, value: string | boolean) => {
    setProdcutOutline((state) => ({ ...state, [key]: value }));
  };

  // ______________________________________________________________

  const [detail, setDetail] = useState<Tdetail>(creEmptyDetail());

  function changeDetail<TpKey extends keyof Tdetail, TcKey extends keyof Tdetail[TpKey]>(
    pKey: TpKey,
    cKey: TcKey,
    value: Tdetail[TpKey][TcKey]
  ) {
    setDetail((state) => {
      const copy = { ...state };

      copy[pKey][cKey] = value;

      return copy;
    });
  }

  // -------------------------------------------------------------------------

  const [others, setOthers] = useState<string[]>([]);

  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!contract) {
      return;
    }

    const { projectName: projectName_contract, county, district, address } = contract.content;

    const {
      projectName,
      projectContent,
      /**工地電話 */
      projectNumber,
      /**工地傳真 */
      projectFaxNumber,
      /**工程負責人 */
      projectPerson,
      /**工程負責人聯絡電話 */
      projectPersonNumber,
    } = creEmptyProfile();

    setProfile({
      projectName: projectName || projectName_contract,
      projectContent,
      projectNumber,
      projectFaxNumber,
      projectPerson,
      projectPersonNumber,
      allAddress: `${county}${district}${address}`,
      engineeringNumber: '999',
      contractor: '999',
      principal: '999',
      contactNumber: '999',
      faxNumber: '999',
    });

    //
  }, [contract]);

  // -------------------------------------------------------------------------

  // TODO 串接上api後，要放入取得的資料
  // useEffect(() => {
  //   setOldProduct({
  //     itemName: sheet.itemName,
  //     doorType: sheet.doorType,
  //     fullWidth: sheet.fullWidth,
  //     height: sheet.height,
  //     boxB: sheet.boxB,
  //     quantity: sheet.quantity,
  //     material: sheet.material,
  //     isAntiTyphoon: sheet.isAntiTyphoon,
  //   });
  // }, [sheet]);
  // -------------------------------------------------------------------------
  // const { control, handleSubmit, watch, setValue } = useForm({ defaultValues: fakeWorkSheet });

  // const fakeWorkSheet_ori = useMemo(() => {
  //   const copy = _.cloneDeep(watch());
  //   const keyArr = ['itemName', 'doorType', 'length', 'height', 'thickness', 'quantity', 'material'] as const;

  //   keyArr.forEach((key) => {
  //     setValue(key, '');
  //   });
  //   setValue('typhoonProtection', true);

  //   return copy;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // // console.log(watch())
  // // console.log(watch("doorType"))

  // const onSubmit: SubmitHandler<TfakeworkSheet> = (data) => {
  //   // alert(JSON.stringify(data));
  //   console.log(data);
  // };

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

  const control_product: Tcontrol_productOutline = {
    itemName: {
      value: productOutline.itemName,
      onChange: (v) => {
        changeProduct('itemName', v);
      },
    },
    doorType: {
      value: productOutline.doorType,
      onChange: (v) => {
        changeProduct('doorType', v);
      },
    },
    fullWidth: {
      value: productOutline.fullWidth,
      onChange: (v) => {
        changeProduct('fullWidth', v);
      },
    },
    height: {
      value: productOutline.height,
      onChange: (v) => {
        changeProduct('height', v);
      },
    },
    boxB: {
      value: productOutline.boxB,
      onChange: (v) => {
        changeProduct('boxB', v);
      },
    },
    quantity: {
      value: productOutline.quantity,
      onChange: (v) => {
        changeProduct('quantity', v);
      },
    },
    material: {
      value: productOutline.material,
      onChange: (v) => {
        changeProduct('material', v);
      },
    },
    isAntiTyphoon: {
      value: productOutline.isAntiTyphoon,
      onChange: (v) => {
        changeProduct('isAntiTyphoon', v);
      },
    },
  };

  const onCalcClick = () => {
    alert('test');
  };

  // -------------------------------------------------------------------------

  const control_detail: Tcontrol_detail = {
    reel: {
      size: {
        value: detail.reel.size,
        onChange: (v) => {
          changeDetail('reel', 'size', v);
        },
      },
      hasConvex: {
        value: detail.reel.hasConvex,
        onChange: (v) => {
          changeDetail('reel', 'hasConvex', v);
        },
      },
    },
    reelBox: {
      material: {
        value: detail.reelBox.material,
        onChange: (v) => {
          changeDetail('reelBox', 'material', v);
        },
      },
      thickness: {
        value: detail.reelBox.thickness,
        onChange: (v) => {
          changeDetail('reelBox', 'thickness', v);
        },
      },
      surface: {
        value: detail.reelBox.surface,
        onChange: (v) => {
          changeDetail('reelBox', 'surface', v);
        },
      },
      front: {
        value: detail.reelBox.front,
        onChange: (v) => {
          changeDetail('reelBox', 'front', v);
        },
      },
      hasConvex: {
        value: detail.reelBox.hasConvex,
        onChange: (v) => {
          changeDetail('reelBox', 'hasConvex', v);
        },
      },
      type: {
        value: detail.reelBox.type,
        onChange: (v) => {
          changeDetail('reelBox', 'type', v);
        },
      },
    },
    base: {
      material: {
        value: detail.base.material,
        onChange: (v) => {
          changeDetail('base', 'material', v);
        },
      },
      angleMaterial: {
        value: detail.base.angleMaterial,
        onChange: (v) => {
          changeDetail('base', 'angleMaterial', v);
        },
      },
      baseMaterial: {
        value: detail.base.baseMaterial,
        onChange: (v) => {
          changeDetail('base', 'baseMaterial', v);
        },
      },
      type: {
        value: detail.base.type,
        onChange: (v) => {
          changeDetail('base', 'type', v);
        },
      },
      surface: {
        value: detail.base.surface,
        onChange: (v) => {
          changeDetail('base', 'surface', v);
        },
      },
    },
    support: {
      bearing: {
        value: detail.support.bearing,
        onChange: (v) => {
          changeDetail('support', 'bearing', v);
        },
      },
      chain: {
        value: detail.support.chain,
        onChange: (v) => {
          changeDetail('support', 'chain', v);
        },
      },
    },
    doorPiece: {
      material: {
        value: detail.doorPiece.material,
        onChange: (v) => {
          changeDetail('doorPiece', 'material', v);
        },
      },
      surface: {
        value: detail.doorPiece.surface,
        onChange: (v) => {
          changeDetail('doorPiece', 'surface', v);
        },
      },
    },
    motor: {
      horsepower: {
        value: detail.motor.horsepower,
        onChange: (v) => {
          changeDetail('motor', 'horsepower', v);
        },
      },
      manufacturer: {
        value: detail.motor.manufacturer,
        onChange: (v) => {
          changeDetail('motor', 'manufacturer', v);
        },
      },
      powerSupply: {
        value: detail.motor.powerSupply,
        onChange: (v) => {
          changeDetail('motor', 'powerSupply', v);
        },
      },
      voltage: {
        value: detail.motor.voltage,
        onChange: (v) => {
          changeDetail('motor', 'voltage', v);
        },
      },
      support: {
        value: detail.motor.support,
        onChange: (v) => {
          changeDetail('motor', 'support', v);
        },
      },
      chainType: {
        value: detail.motor.chainType,
        onChange: (v) => {
          changeDetail('motor', 'chainType', v);
        },
      },
      lockBox: {
        value: detail.motor.lockBox,
        onChange: (v) => {
          changeDetail('motor', 'lockBox', v);
        },
      },
    },
    doorTrack: {
      material: {
        value: detail.doorTrack.material,
        onChange: (v) => {
          changeDetail('doorTrack', 'material', v);
        },
      },
      thickness: {
        value: detail.doorTrack.thickness,
        onChange: (v) => {
          changeDetail('doorTrack', 'thickness', v);
        },
      },
      surface: {
        value: detail.doorTrack.surface,
        onChange: (v) => {
          changeDetail('doorTrack', 'surface', v);
        },
      },
      silencer: {
        value: detail.doorTrack.silencer,
        onChange: (v) => {
          changeDetail('doorTrack', 'silencer', v);
        },
      },
      doorTrackType: {
        value: detail.doorTrack.doorTrackType,
        onChange: (v) => {
          changeDetail('doorTrack', 'doorTrackType', v);
        },
      },
      doorTrackName: {
        value: detail.doorTrack.doorTrackName,
        onChange: (v) => {
          changeDetail('doorTrack', 'doorTrackName', v);
        },
      },
    },
  };

  // -------------------------------------------------------------------------

  const control_detail02: Tcontrol_detail02 = {
    size01: {
      doorType: '999',
      fullWidth: '999',
      淨高: '999',
      WG: '999',
      gapA: '999',
      gapC: '999',
      支板尺寸: '999',
      捲門全高: '999',
    },
    size02: {
      捲軸尺寸: '999',
      軸徑: '999',
      軸承: '999',
      總長: '999',
      寸法: '999',
    },
    rollBox: {
      角鐵數量: '999',
      捲箱角鐵尺寸: '999',
      捲箱資訊: '999',
    },
    doorPiece: {
      門片材質: '999',
      門片厚度: '999',
      門片長度: '999',
      捲片支數: '999',
      防颱勾: '999',
    },
    motor: {
      vendor: '999',
      電供: '999',
      馬力: '999',
    },
    doorTrack: {
      門軌材質: '999',
      門軌長度: '999',
      門軌形式: {
        value: '999',
        img: '999',
      },
    },
    chainCog: {
      鏈齒輪番號: '999',
      大鏈輪: '999',
      孔徑: '999',
    },
    base: {
      底座材質: '999',
      底座開口: '999',
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

  return (
    <SubLayer>
      <PageHeader panelList={panelList} />

      <form>
        <WorkSheetProfile control={control_profile} disabled={true} />
        <div className={scss.subTitle}>工程項目</div>
        <div className={scss.main}>
          {/* left */}
          <div className={scss.left}>
            {[0, 1, 2, 3, 4, 5, 6].map((key, index) => {
              const onClick = () => setActiveCard(key);
              const isActive = key === activeCard;

              const control = {
                itemName: 'D-SD1-1',
                doorType: 'SJ-302',
                qty: '999',
              };

              return (
                <div key={key} onClick={onClick}>
                  <WorkSheetProdCard control={control} isActive={isActive} img={imgIdk} />
                </div>
              );
            })}
          </div>

          {/* right */}
          <div className={scss.right}>
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
              value={others}
              onChange={(arr) => {
                setOthers(arr);
              }}
              optionArr={othersOptions}
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

// ====================================================================

// export type TfakeworkSheet = {
//   // profile right
//   /**工程編號 */
//   projectNumber: string;
//   /**承包商 */
//   contractor: string;
//   /**負責人 */
//   principal: string;
//   /**公司電話 */
//   companyPhone: string;
//   /**公司傳真 */
//   companyFax: string;

//   // profile left
//   /**工程名稱 */
//   projectName: string;
//   /**工程內容 */
//   projectDesc: string;
//   /**工地電話 */
//   constructionSiteNumber: string;
//   /**工地傳真 */
//   constructionSiteFax: string;
//   /**工地位置縣市 */
//   projectCity: string;
//   /**工地位置地區 */
//   projectDistrict: string;
//   /**工地位置地址 */
//   projectAddress: string;
//   /**工程負責人 */
//   projectPrincipal: string;
//   /**工程負責人電話 */
//   projectPrincipalPhone: string;

//   // 合約產品項目
//   /**項目 */
//   itemName: string;
//   /**門型 */
//   doorType: string;
//   /**全寬(L) */
//   length: string;
//   /**淨高(h) */
//   height: string;
//   /**捲箱高(B) */
//   thickness: string;
//   /**數量 */
//   quantity: string;
//   /**材質 */
//   material: string;
//   /**防颱 */
//   typhoonProtection: boolean;

//   // 產品細部規格
//   // 卷軸
//   reel: {
//     /**尺寸 */
//     size: string;
//     /**有無凸 */
//     hasConvex: boolean;
//   };
//   // 捲箱
//   reelBox: {
//     /**材質 */
//     material: string;
//     /**厚度 */
//     thickness: string;
//     /**表面 */
//     surface: string;
//     /**正面 */
//     front: string;
//     /**有無凸 */
//     hasConvex: boolean;
//     /**捲箱型式 */
//     type: string;
//   };
//   // 底座
//   base: {
//     /**材質 */
//     material: string;
//     /**角鐵材質 */
//     angleMaterial: string;
//     /**底座板材質 */
//     baseMaterial: string;
//     /**型式 */
//     type: string;
//     /**表面 */
//     surface: string;
//   };
//   // 支版
//   support: {
//     /**軸承 */
//     bearing: string;
//     /**鏈條 */
//     chain: string;
//   };
//   // 門片
//   doorPiece: {
//     /**材質 */
//     material: string;
//     /**表面 */
//     surface: string;
//   };
//   // 電動機
//   motor: {
//     /** 馬力數*/
//     horsepower: string;
//     /** 廠商*/
//     manufacturer: string;
//     /** 電供*/
//     powerSupply: string;
//     /** 電壓*/
//     voltage: string;
//     /** 支撐架*/
//     support: boolean;
//     /** 鏈條型式*/
//     chainType: string;
//     /** 鎖盒*/
//     lockBox: string;
//   };
//   // 門軌
//   doorTrack: {
//     /** 材質*/
//     material: string;
//     /** 厚度*/
//     thickness: string;
//     /** 表面*/
//     surface: string;
//     /** 消音條*/
//     silencer: boolean;
//     /** 型式*/
//     doorTrackType: string;
//     /** 型式2*/
//     doorTrackName: string;
//   };
// };

// const fakeWorkSheet: TfakeworkSheet = {
//   // profile的資料不應該編輯，之後要把profile的資料從抽出另外處理
//   // profile right
//   projectNumber: 'M-1101201',
//   contractor: '創典科技A有限公司',
//   principal: '李先生',
//   companyPhone: '04-1234567',
//   companyFax: '04-1234567',

//   // profile left
//   projectName: '台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程',
//   projectDesc: '捲門＋大門工程',
//   constructionSiteNumber: '04-1234567',
//   constructionSiteFax: '04-1234567',
//   projectCity: '台中市',
//   projectDistrict: '梧棲區',
//   projectAddress: '經二路27號',
//   projectPrincipal: '王先生',
//   projectPrincipalPhone: '0987654321',
//   //
//   // 合約產品項目
//   /**項目 */
//   itemName: 'D-SD1-1',
//   /**門型 */
//   doorType: 'SJ-302',
//   /**全寬(L) */
//   length: '5.25',
//   /**淨高(h) */
//   height: '4.87',
//   /**捲箱高(B) */
//   thickness: '5.50',
//   /**數量 */
//   quantity: '12',
//   /**材質 */
//   material: '不鏽鋼304#',
//   /**防颱 */
//   typhoonProtection: true,

//   // 產品細部規格
//   // 捲軸
//   reel: {
//     /**尺寸 */
//     size: '5',
//     /**有無凸 */
//     hasConvex: true,
//   },
//   // 捲箱
//   reelBox: {
//     /**材質 */
//     material: 'SST 304# (2B 霧面)',
//     /**厚度 */
//     thickness: '0.8',
//     /**表面 */
//     surface: '氟烤',
//     /**正面 */
//     front: '正乳白',
//     /**有無凸 */
//     hasConvex: true,
//     /**捲箱型式 */
//     type: '捲箱+機箱',
//   },
//   // 底座
//   base: {
//     /**材質 */
//     material: 'SST 304# (2B 霧面)',
//     /**角鐵材質 */
//     angleMaterial: 'SST 304# (2B 霧面)',
//     /**底座板材質 */
//     baseMaterial: 'SST 304# (2B 霧面)',
//     /**型式 */
//     type: '止水型',
//     /**表面 */
//     surface: '氟烤',
//   },
//   // 支版
//   support: {
//     /**軸承 */
//     bearing: '6208#',
//     /**鏈條 */
//     chain: '640#',
//   },
//   // 門片
//   doorPiece: {
//     /**材質 */
//     material: 'SST 304# (2B 霧面)',
//     /**表面 */
//     surface: '氟烤',
//   },
//   // 電動機
//   motor: {
//     /** 馬力數*/
//     horsepower: '1/2HP',
//     /** 廠商*/
//     manufacturer: '大同',
//     /** 電供*/
//     powerSupply: '單相',
//     /** 電壓*/
//     voltage: '220V',
//     /** 支撐架*/
//     support: true,
//     /** 鏈條型式*/
//     chainType: '雙排',
//     /** 鎖盒*/
//     lockBox: '防盜式',
//   },
//   // 門軌
//   doorTrack: {
//     /** 材質*/
//     material: 'SST 304# (2B 霧面)',
//     /** 厚度*/
//     thickness: '1.5T',
//     /** 表面*/
//     surface: '氟烤',
//     /** 消音條*/
//     silencer: true,
//     /** 型式*/
//     doorTrackType: '彎',
//     /** 型式2*/
//     doorTrackName: 'sJ302_30',
//   },
// };

// ===========================================================================

const othersOptions = [
  { value: '門楣', label: '門楣' },
  { value: '防颱底座鎖固', label: '防颱底座鎖固' },
  { value: 'UL 熔金體', label: 'UL 熔金體' },
  { value: '智慧型密碼開關', label: '智慧型密碼開關' },
  { value: '遙控器(1:2)', label: '遙控器(1:2)' },
  { value: '防颱活動中柱(滑軌)', label: '防颱活動中柱(滑軌)' },
  { value: '颱風活動中柱(可拆式)', label: '颱風活動中柱(可拆式)' },
  { value: '防爆裝置', label: '防爆裝置' },
  { value: '手動關閉裝置', label: '手動關閉裝置' },
  { value: 'UPS', label: 'UPS' },
  { value: '煙感+中繼器', label: '煙感+中繼器' },
  { value: '彈射門', label: '彈射門' },
];

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

const creEmptyProductOutline = (): TproductOutline => ({
  itemName: '',
  doorType: '',
  fullWidth: '',
  height: '',
  boxB: '',
  quantity: '',
  material: '',
  isAntiTyphoon: false,
});

const creEmptyDetail = (): Tdetail => ({
  reel: {
    size: '',
    hasConvex: '',
  },
  reelBox: {
    material: '',
    thickness: '456',
    surface: '',
    front: '',
    hasConvex: '',
    type: '',
  },
  base: {
    material: '',
    angleMaterial: '',
    baseMaterial: '',
    type: '',
    surface: '',
  },
  support: {
    bearing: '',
    chain: '',
  },
  //
  doorPiece: {
    material: '',
    surface: '',
  },
  motor: {
    horsepower: '',
    manufacturer: '',
    powerSupply: '',
    voltage: '',
    support: '',
    chainType: '',
    lockBox: '',
  },
  doorTrack: {
    material: '',
    thickness: '',
    surface: '',
    silencer: '',
    doorTrackType: '',
    doorTrackName: '',
  },
});
