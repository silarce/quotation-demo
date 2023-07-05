import { Fragment } from "react"

import { optionsCre_doorTrack_normal } from "js/utils/options/doorTrackOptions";


import scss from "./productDatail02.module.scss"

// fake
import { TfakeworkSheet } from "pages/worksDepartment/contractList/contract/workSheet";


// ====================================================================

const option_doorTrack_normal = optionsCre_doorTrack_normal()

const doorTrackLookUp_normal = (() => {
  const obj = {} as any
  option_doorTrack_normal.forEach(item => {
    obj[item.value] = item
  })
  return obj
})()



// ====================================================================

export default function WorkSheetProductDetail02(
  { watch, fakeWorkSheet_ori }:

    {
      // watch: (v?: string) => string | TfakeworkSheet
      watch: (v: string) => string
      fakeWorkSheet_ori: TfakeworkSheet
    }
) {



  const arr_size01 = [
    { value: `${watch("doorType") || fakeWorkSheet_ori.doorType}`, label: "型號" },
    { value: `${parseFloat(watch("length") || fakeWorkSheet_ori.length)} mm`, label: "全寬" },
    { value: `${parseFloat(watch("height") || fakeWorkSheet_ori.height)} mm`, label: "淨高" },
    { value: `9999 mm`, label: "W+G" },
    { value: `99 mm`, label: "機械縫 A" },
    { value: `99 mm`, label: "機械縫 C" },
    { value: `${watch("thickness") || fakeWorkSheet_ori.thickness}*999`, label: "支板尺寸 B*D(右)" },
    { value: `9999 mm`, label: "捲門全高 H" },
  ]

  const arr_size02 = [
    { value: watch("reel.size"), label: "捲軸尺寸" },
    { value: "999", label: "軸徑" },
    { value: watch("support.bearing"), label: "軸承" },
    { value: "9999", label: "總長" },
    { value: "9999", label: "寸法" },
  ]

  const arr_rollBox = [
    { value: "99", label: "角鐵數量" },
    { value: "9999", label: "捲箱角鐵尺寸" },
    { value: watch("reelBox.type"), label: "捲箱資訊", span: 2 as const },
  ]

  const arr_doorPiece = [
    { value: watch("doorPiece.material"), label: "門片材質" },
    { value: "999", label: "門片厚度" },
    { value: "999", label: "門片長度" },
    { value: "999", label: "捲片支數" },
    { value: watch("typhoonProtection"), label: "防颱勾" },
  ]

  const arr_montor = [
    { value: watch("motor.voltage"), label: "電供" },
    { value: watch("motor.horsepower"), label: "馬力" },
  ]

  const arr_doorTrack = [
    { value: watch("doorTrack.material"), label: "門軌材質" },
    { value: "999", label: "門軌長度" },
    {
      value: watch("doorTrack.doorTrackName"), label: "門軌形式(直)",
      img: doorTrackLookUp_normal[watch("doorTrack.doorTrackName")].icon
    },
  ]

  const arr_chainCog = [
    { value: "#999單列", label: "鏈齒輪番號" },
    { value: "", label: "大鏈輪" },
    { value: "99", label: "孔徑" },
  ]

  const arr_base = [
    { value: watch("base.material"), label: "底座材質" },
    { value: "99", label: "底座開口" },
  ]


  // console.log(watch("doorTrack.material"))

  return (
    <div className={scss.container}>
      <p>設定產品細部規格：</p>

      <div className={scss.main}>
        <div className={scss.left}>
          <Item label="尺寸" optionArr={arr_size01} />
          <Item label="尺寸" optionArr={arr_size02} />
          <Item02 label="捲箱" optionArr={arr_rollBox} />
        </div> {/* left */}

        <div className={scss.right}>
          <Item label="門片" optionArr={arr_doorPiece} />
          <Item label={`發動機(${watch("motor.manufacturer")})`} optionArr={arr_montor} />
          <Item label="門軌" optionArr={arr_doorTrack} />
          <Item label="鍊齒輪" optionArr={arr_chainCog} />
          <Item label="底座" optionArr={arr_base} />
        </div> {/* right */}
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



// ======================================================================



