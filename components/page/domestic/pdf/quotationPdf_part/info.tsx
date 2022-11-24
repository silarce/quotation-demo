


import { ProdClass } from "components/page/domestic/quotation/hook/useProduct"


// css
import scss from "./quotationPdf_part.module.scss"




export default function Info(
  { prodAllData, quotationId }:
    {
      prodAllData: ProdClass["allData"]
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
type TinfoKeyIndex =
  keyof
  Pick<
    ProdClass["allData"],
    "project" | "material" | "surface" | "doorType" | "size"
  >
type TinfoConfig = {
  [key in TinfoKeyIndex]: { label: string }
}

const infoKeyIndex: TinfoKeyIndex[] =
  ["project", "material", "surface", "doorType", "size"]
const infoConfig: TinfoConfig = {
  project: { label: "項目" },
  material: { label: "材質" },
  surface: { label: "表面" },
  doorType: { label: "門型" },
  size: { label: "尺寸" },
}