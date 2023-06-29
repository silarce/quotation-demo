import { useState } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form";

// layer
import PageHeader, { TpanelList } from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// component
import WorkSheetProfile from "components/page/worksDepartment/contracList/contract/workSheet/profile"

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

  const { control, handleSubmit } = useForm({ defaultValues: fakeWorkSheet });

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
    <SubLayer className={scss.container}>
      <PageHeader panelList={panelList} />
      <form >

        <WorkSheetProfile control={control} disabled={disabled}
          fakeWorkSheet={fakeWorkSheet}
        />



      </form>

    </SubLayer>
  )
}

// ====================================================================

export type TfakeworkSheet = {
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

};


const fakeWorkSheet: TfakeworkSheet = {
  projectNumber: "工程編號",
  contractor: "承包商",
  principal: "負責人",
  companyPhone: "公司電話",
  companyFax: "公司傳真",

  projectName: "工程名稱",
  projectDesc: "工程內容",
  constructionSiteNumber: "工地電話",
  constructionSiteFax: "工地傳真",
  projectCity: "高雄市",
  projectDistrict: "大樹區",
  projectAddress: "花巷草弄20號",
  projectPrincipal: "工程負責人",
  projectPrincipalPhone: "工程負責人電話",
}







