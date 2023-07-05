import { Fragment } from "react"

import { optionsCre_doorTrack_normal } from "js/utils/options/doorTrackOptions";


import scss from "./productDatail02.module.scss"


// ====================================================================

const option_doorTrack_normal = optionsCre_doorTrack_normal()

// ====================================================================

export default function WorkSheetProductDetail02() {



  return (
    <div className={scss.container}>
      <p>設定產品細部規格：</p>

      <div className={scss.main}>
        <div className={scss.left}>
          <Item label="尺寸" optionArr={fakeSize} />
          <Item label="尺寸" optionArr={fakeSize} />
          <Item02 label="捲箱" optionArr={fakeRollBox} />
        </div> {/* left */}

        <div className={scss.right}>
          <Item label="尺寸" optionArr={fakeSize} />
          <Item label="尺寸" optionArr={fakeSize} />
          <Item label="尺寸" optionArr={fakeDoorTrack} />

        </div>
      </div>


    </div>
  )
}


// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

const Item = (
  { label, optionArr }:
    {
      label: string
      optionArr: {
        value?: string,
        label: string,
        img?: string
      }[]
    }
) => {

  return (
    <div className={scss.item}>
      <p>{label}</p>
      <div className={scss.grid}>

        {optionArr.map((option, index) => {
          const { value, label, img } = option

          return (
            <Fragment key={index}>
              <div><span>{label}</span></div>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              {img && <div><img src={img} alt="" /></div>}
              {!img && <div><span>{value}</span></div>}
            </Fragment >
          )
        })}
      </div>
    </div>
  )
}

const Item02 = (
  { label, optionArr }:
    {
      label: string
      optionArr: {
        value?: string,
        label: string,
        img?: string
        span?: 2
      }[]
    }
) => {

  return (
    <div className={scss.item_last}>
      <p>{label}</p>
      <div className={scss.grid}>

        {optionArr.map((option, index) => {
          const { value, label, img, span } = option

          if (span === 2) {
            return (
              <Fragment key={index}>
                <div className={scss.span2}>
                  <div>
                    <span>{label} : </span>
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    {img && <img src={img} alt="" />}
                    {!img && <span>{value}</span>}
                  </div>
                </div>
              </Fragment >
            )
          }
          return (
            <Fragment key={index}>
              <div><span>{label}</span></div>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              {img && <div><img src={img} alt="" /></div>}
              {!img && <div><span>{value}</span></div>}
            </Fragment >
          )
        })}
      </div>
    </div>
  )
}

// ====================================================================
// ====================================================================
// ====================================================================

const fakeSize = [
  { value: "型號", label: "SJ-302" },
  { value: "5250 mm", label: "全寬" },
  { value: "4870 mm", label: "淨高" },
  { value: "5160 mm", label: "W+G" },
  { value: "70 mm", label: "機械縫 A" },
  { value: "20 mm", label: "機械縫 C" },
  { value: "550*800", label: "支板尺寸 B*D(右)" },
  { value: "5420 mm", label: "捲門全高 H" },
]

const fakeDoorTrack = [
  { value: "單向 220", label: "門軌材質" },
  { value: "4970", label: "門軌長度" },
  { label: "門軌形式(直)", img: option_doorTrack_normal[0].icon },
]

const fakeRollBox = [
  { value: "4", label: "角鐵數量" },
  { value: "5240", label: "捲箱角鐵尺寸" },
  { value: "捲箱加機箱", label: "捲箱資訊", span: 2 as const },
]



