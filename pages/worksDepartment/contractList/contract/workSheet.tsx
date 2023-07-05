import { useState, useMemo } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import _ from "lodash"

// layer
import PageHeader, { TpanelList } from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// component
import WorkSheetProfile from "components/page/worksDepartment/contracList/contract/workSheet/profile"
import WorkSheetCard from "components/page/worksDepartment/contracList/contract/workSheet/card";
import WorkSheetProduct from "components/page/worksDepartment/contracList/contract/workSheet/product";
import WorkSheetProductDetail from "components/page/worksDepartment/contracList/contract/workSheet/productDatail";
import WorkSheetOptional from "components/page/worksDepartment/contracList/contract/workSheet/optional";

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import { OptionWithIcon01 } from "components/global/gear/select/optionWithIcon";
import { SingleValueWithIcon01 } from "components/global/gear/select/singleValueWithIcon";


// css
import scss from "./workSheet.module.scss"

// image
import imgIdk from "public/image/fake/idk01.png"



// other
import { optionsCre_doorTrack_normal } from "js/utils/options/doorTrackOptions";

const optionArr_doorTrack = optionsCre_doorTrack_normal()


export default function WorkSheet() {
  const [disabled, setDisabled] = useState(true)

  const { control, handleSubmit, watch, setValue } = useForm({ defaultValues: fakeWorkSheet });

  const [activeCard, setActiveCard] = useState(-1)



  const fakeWorkSheet_ori = useMemo(() => {
    const copy = _.cloneDeep(watch())
    const keyArr = [
      "itemName", "doorType", "length", "height",
      "thickness", "quantity", "material",
    ] as const

    keyArr.forEach(key => {
      setValue(key, "")
    })
    setValue("typhoonProtection", true)
    return copy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])





  const onSubmit: SubmitHandler<TfakeworkSheet> = data => {
    alert(JSON.stringify(data))
    console.log(data)
  };


  const panelList_allow: TpanelList = [
    {
      type: "myButton",
      label: "編輯",
      onClick: () => { setDisabled(false) },
    }
  ]

  const panelList_notAllow: TpanelList = [
    {
      type: "myButton",
      label: "取消",
      onClick: () => { setDisabled(true) },
    }
  ]


  const panelList = disabled ? panelList_allow : panelList_notAllow


  return (
    <SubLayer>
      <PageHeader panelList={panelList} />

      <form >
        <WorkSheetProfile control={control} disabled={disabled} />
        <div className={scss.subTitle}>工程項目</div>
        <div className={scss.main}>
          <div className={scss.left}>
            {[0, 1, 2, 3, 4, 5, 6].map((key, index) => {
              const onClick = () => setActiveCard(key)
              const isActive = key === activeCard
              return (
                <div key={key} onClick={onClick}>
                  <WorkSheetCard isActive={isActive} img={imgIdk} />
                </div>
              )
            })}
          </div> {/* left */}


          <div className={scss.right}>
            <WorkSheetProduct
              control={control}
              fakeWorkSheet_ori={fakeWorkSheet_ori}
              disabled={disabled}
            />

            <hr />
            <WorkSheetProductDetail
              control={control}
              fakeWorkSheet_ori={fakeWorkSheet_ori}
              disabled={disabled}
            />

            <hr />
            <WorkSheetOptional
              optionArr={options}
              onChange={(arr) => { }}
            />

            <hr />

          </div> {/* right */}


        </div> {/* main */}

      </form>

    </SubLayer>
  )
}

// ====================================================================

export type TfakeworkSheet = {
  // profile right
  /**工程編號 */
  projectNumber: string
  /**承包商 */
  contractor: string
  /**負責人 */
  principal: string
  /**公司電話 */
  companyPhone: string
  /**公司傳真 */
  companyFax: string

  // profile left
  /**工程名稱 */
  projectName: string
  /**工程內容 */
  projectDesc: string,
  /**工地電話 */
  constructionSiteNumber: string
  /**工地傳真 */
  constructionSiteFax: string
  /**工地位置縣市 */
  projectCity: string
  /**工地位置地區 */
  projectDistrict: string
  /**工地位置地址 */
  projectAddress: string
  /**工程負責人 */
  projectPrincipal: string
  /**工程負責人電話 */
  projectPrincipalPhone: string

  // 合約產品項目
  /**項目 */
  itemName: string
  /**門型 */
  doorType: string
  /**全寬(L) */
  length: string
  /**淨高(h) */
  height: string
  /**捲箱高(B) */
  thickness: string
  /**數量 */
  quantity: string
  /**材質 */
  material: string
  /**防颱 */
  typhoonProtection: boolean

  // 產品細部規格
  // 卷軸
  reel: {
    /**尺寸 */
    size: string
    /**有無凸 */
    hasConvex: boolean
  }
  // 捲箱
  reelBox: {
    /**材質 */
    material: string
    /**厚度 */
    thickness: string
    /**表面 */
    surface: string
    /**正面 */
    front: string
    /**有無凸 */
    hasConvex: boolean
    /**捲箱型式 */
    type: string
  }
  // 底座
  base: {
    /**材質 */
    material: string
    /**角鐵材質 */
    angleMaterial: string
    /**底座板材質 */
    baseMaterial: string
    /**型式 */
    type: string
    /**表面 */
    surface: string
  }
  // 支版
  support: {
    /**軸承 */
    bearing: string
    /**鏈條 */
    chain: string
  }
  // 門片
  doorPiece: {
    /**材質 */
    material: string
    /**表面 */
    surface: string
  }
  // 電動機
  motor: {
    /** 馬力數*/
    horsepower: string
    /** 廠商*/
    manufacturer: string
    /** 電供*/
    powerSupply: string
    /** 電壓*/
    voltage: string
    /** 支撐架*/
    support: boolean
    /** 鏈條型式*/
    chainType: string
    /** 鎖盒*/
    lockBox: string
  }
  // 門軌
  doorTrack: {
    /** 材質*/
    material: string
    /** 厚度*/
    thickness: string
    /** 表面*/
    surface: string
    /** 消音條*/
    silencer: boolean
    /** 型式*/
    doorTrackType: string
    /** 型式2*/
    doorTrackName: string
  }
};



const fakeWorkSheet: TfakeworkSheet = {
  // profile right
  projectNumber: "工程編號",
  contractor: "承包商",
  principal: "負責人",
  companyPhone: "公司電話",
  companyFax: "公司傳真",

  // profile left
  projectName: "工程名稱",
  projectDesc: "工程內容",
  constructionSiteNumber: "工地電話",
  constructionSiteFax: "工地傳真",
  projectCity: "高雄市",
  projectDistrict: "大樹區",
  projectAddress: "花巷草弄20號",
  projectPrincipal: "工程負責人",
  projectPrincipalPhone: "工程負責人電話",

  // 合約產品項目
  /**項目 */
  itemName: "項目",
  /**門型 */
  doorType: "門型",
  /**全寬(L) */
  length: "全寬(L)",
  /**淨高(h) */
  height: "淨高(h)",
  /**捲箱高(B) */
  thickness: "捲箱高(B)",
  /**數量 */
  quantity: "數量",
  /**材質 */
  material: "材質",
  /**防颱 */
  typhoonProtection: true,

  // 產品細部規格
  // 捲軸
  reel: {
    /**尺寸 */
    size: "5",
    /**有無凸 */
    hasConvex: true,
  },
  // 捲箱
  reelBox: {
    /**材質 */
    material: "SST 304# (2B 霧面)",
    /**厚度 */
    thickness: "0.8",
    /**表面 */
    surface: "氟烤",
    /**正面 */
    front: "正乳白",
    /**有無凸 */
    hasConvex: true,
    /**捲箱型式 */
    type: "捲箱+機箱",
  },
  // 底座
  base: {
    /**材質 */
    material: "SST 304# (2B 霧面)",
    /**角鐵材質 */
    angleMaterial: "SST 304# (2B 霧面)",
    /**底座板材質 */
    baseMaterial: "SST 304# (2B 霧面)",
    /**型式 */
    type: "止水型",
    /**表面 */
    surface: "氟烤",
  },
  // 支版
  support: {
    /**軸承 */
    bearing: "6208#",
    /**鏈條 */
    chain: "640#",
  },
  // 門片
  doorPiece: {
    /**材質 */
    material: "SST 304# (2B 霧面)",
    /**表面 */
    surface: "氟烤",
  },
  // 電動機
  motor: {
    /** 馬力數*/
    horsepower: "1/2HP",
    /** 廠商*/
    manufacturer: "大同",
    /** 電供*/
    powerSupply: "單相",
    /** 電壓*/
    voltage: "220V",
    /** 支撐架*/
    support: true,
    /** 鏈條型式*/
    chainType: "雙排",
    /** 鎖盒*/
    lockBox: "防盜式",
  },
  // 門軌
  doorTrack: {
    /** 材質*/
    material: "SST 304# (2B 霧面)",
    /** 厚度*/
    thickness: "1.5T",
    /** 表面*/
    surface: "氟烤",
    /** 消音條*/
    silencer: true,
    /** 型式*/
    doorTrackType: "彎",
    /** 型式2*/
    doorTrackName: "sJ302_30"
  },

}



// ===========================================================================

const options = [
  { value: "門楣", label: "門楣" },
  { value: "防颱底座鎖固", label: "防颱底座鎖固" },
  { value: "UL 熔金體", label: "UL 熔金體" },
  { value: "智慧型密碼開關", label: "智慧型密碼開關" },
  { value: "遙控器(1:2)", label: "遙控器(1:2)" },
  { value: "防颱活動中柱(滑軌)", label: "防颱活動中柱(滑軌)" },
  { value: "颱風活動中柱(可拆式)", label: "颱風活動中柱(可拆式)" },
  { value: "防爆裝置", label: "防爆裝置" },
  { value: "手動關閉裝置", label: "手動關閉裝置" },
  { value: "UPS", label: "UPS" },
  { value: "煙感+中繼器", label: "煙感+中繼器" },
  { value: "彈射門", label: "彈射門" },
];





