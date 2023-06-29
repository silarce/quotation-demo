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

// gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import { OptionWithIcon01 } from "components/global/gear/select/optionWithIcon";
import { SingleValueWithIcon01 } from "components/global/gear/select/singleValueWithIcon";


// css
import scss from "./workSheet.module.scss"


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
                  <WorkSheetCard isActive={isActive} />
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





}







