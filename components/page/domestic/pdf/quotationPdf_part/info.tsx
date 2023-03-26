


import { ProdClass } from "components/page/domestic/quotation/hook/useProduct"


// css
import scss from "./quotationPdf_part.module.scss"




export default function Info(
  { prodAllData, quotationId }:
    {
      prodAllData: TInfo
      quotationId: string
    }
) {

  return (
    <div className={scss.info}>
      <div>
        <span>報價編號</span>
        <span>:</span>
        <span>{quotationId}</span>
      </div>
      {infoKeyIndex.map((key, index) => {
        const value = prodAllData[key]
        const { label } = infoConfig[key]
        return (
          <div key={index}>
            <span>{label}</span>
            <span>:</span>
            <span>{value}</span>
          </div>
        )
      })}
    </div>
  )
}
// ==============================================================================

type TInfo = {
  category: string
  material: string
  surface: string
  doorType: string
  size: string
}


type TinfoKeyIndex =
  "category" | "material" | "surface" | "doorType" | "size"
type TinfoConfig = {
  [key in TinfoKeyIndex]: { label: string }
}

const infoKeyIndex: TinfoKeyIndex[] =
  ["category", "material", "surface", "doorType", "size"]
const infoConfig: TinfoConfig = {
  category: { label: "項目" },
  material: { label: "材質" },
  surface: { label: "表面" },
  doorType: { label: "門型" },
  size: { label: "尺寸" },
}