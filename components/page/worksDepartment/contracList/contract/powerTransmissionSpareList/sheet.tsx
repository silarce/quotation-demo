// @ t s-nocheck
import styled from "@emotion/styled"
import id from "date-fns/esm/locale/id/index.js"
import React, { Fragment } from "react"







// css
import style from "./powerTransmissionSpareList.module.scss"



export default function Sheet(
  { editable }:
    { editable: boolean }

) {

  return (
    <div className={style.sheet}>

      <div className={style.thead}>
        <div><span>門型/數量</span></div>
        <div><span>品名</span></div>
        <div><span>種類</span></div>
        <div><span>數量</span></div>
      </div>

      <Tbody>
        <C1><span>門型</span></C1>
        {c2IndexKeys.map((c2Key, index) => {
          const { label, rSpan } = c2Config[c2Key]

          const noBottomBorder = c2Key === "其他" ? true : false
          return (
            <Fragment key={index}>

              <C2
                rSpan={rSpan}
                noBottomBorder={noBottomBorder}
              ><span>{label}</span></C2>

              {c3Config[c2Key]
                .indexKeys.map((c3Key, c3Index) => {

                  const { label, rSpan, cSpan, type, defaultValue }
                    = c3Config[c2Key].config[c3Key]

                  if (c2Key === "其他") {
                    return (
                      <Fragment key={c3Index}>
                        <Cother {...{ rSpan, cSpan }}>
                          <textarea placeholder="其他..." disabled={!editable}/>
                        </Cother>
                      </Fragment>
                    )
                  }

                  if (type === "subCell") {
                    const { label, subKeys, subConfig }
                      = c3Config[c2Key].config[c3Key]
                    const rSpan = subKeys!.length
                    console.log(rSpan)
                    return (
                      <Fragment key={c3Index}>
                        <SubCell rSpan={6}>
                          <C2><span>{label}</span></C2>
                          <div>
                            {subKeys!.map((key, subIndex) => {
                              const { label } = subConfig![key]
                              return (
                                <C3 key={subIndex}><span>{label}</span></C3>
                              )
                            })}
                          </div>
                        </SubCell>
                        {subKeys!.map((key, subIndex) => {
                          return (
                            <C4 key={subIndex}
                              editable={editable}
                            >
                              <input type="text" defaultValue={defaultValue}
                                disabled={!editable} />
                            </C4>
                          )
                        })}
                      </Fragment>
                    )
                  }

                  return (
                    <Fragment key={c3Index}>
                      <C3><span>{label}</span></C3>
                      <C4 editable={editable}>
                        <input type="text" defaultValue={defaultValue}
                          disabled={!editable}
                        />
                      </C4>
                    </Fragment>
                  )
                })}

            </Fragment>
          )
        })}

      </Tbody>



    </div >
  )
}


// =======================================
// =======================================
// =======================================
// =======================================

const Tbody = styled.div`
display: grid;
grid-template-columns: 2fr 2fr 7fr 1fr;
`

const CellInit = styled.div<{
  rSpan?: number
  cSpan?: number
  noBottomBorder?: boolean
}>`
grid-row: span ${({ rSpan }) => rSpan || 1};
grid-column: span ${({ cSpan }) => cSpan || 1};
min-height:${({ rSpan }) => (rSpan || 1) * 50}px;
border: solid 1px ${style.colorBorder01};
border-width: 0 1px 1px 0;
display: grid;
border-bottom: ${({ noBottomBorder }) => noBottomBorder ? "0" : ""};
>*{
  margin:auto;
  font-weight: 400;
  font-size: 16px;
}
`

const C1 = styled(CellInit)`
grid-row: span 100;
border-bottom: none;
>*{
  margin-top:20px;
}
`
const C2 = styled(CellInit)`
`
const C3 = styled(CellInit)`
>*{
  margin-left:20px;
}
`
const C4 = styled(CellInit) <{ editable: boolean }>`
display: grid;
border-right: none;
>input{
  width:50px;
  margin:auto;
  border-bottom:solid 1px ${({ editable }) => editable ? "black" : "transparent"} ;
  text-align: center;
  background-color: transparent;
}
`

const Cother = styled(CellInit)`
border-right: none;
border-bottom: none;
>textarea{
  width:100%;
  height:100%;
  resize: none;
  padding:10px;
}
`

const SubCell = styled(CellInit)`
display: grid;
grid-template-columns: 25% 75%;
border:none;
>*{
  width:100%;
  height:100%;
}
`


// ===========================================
// ===========================================
// ===========================================

type Tc2IndexKeys =
  "鎖盒" | "鎖匙" | "押扣" | "控制箱盤" |
  "消防備品" | "板門配件" | "主機" | "紅外線" |
  "防颱配件" | "其他"

const c2IndexKeys: Tc2IndexKeys[] = [
  "鎖盒", "鎖匙", "押扣", "控制箱盤",
  "消防備品", "板門配件", "主機", "紅外線",
  "防颱配件", "其他",
]



const c3Config: {
  [key in Tc2IndexKeys]:
  {
    indexKeys: string[]
    config: {
      [key: string]: {
        label?: string
        rSpan?: number
        cSpan?: number
        type?: "textarea" | "input" | "subCell"
        subKeys?: string[]
        subConfig?: {
          [key: string]: {
            label: string
          }
        }
        defaultValue?: string
      }
    }
  }
} = {
  鎖盒: {
    indexKeys: ["a", "b", "c", "d", "e", "f",],
    config: {
      a: { label: "智慧型", defaultValue: "1" },
      b: { label: "面板式", defaultValue: "3" },
      c: { label: "埋入式", defaultValue: "" },
      d: { label: "外露式", defaultValue: "2" },
      e: { label: "電子式", defaultValue: "1" },
      f: { label: "防爆式", defaultValue: "1" },
    }
  },
  鎖匙: {
    indexKeys: ["a", "b"],
    config: {
      a: { label: "鎖號", defaultValue: "1" },
      b: { label: "特殊鎖號", defaultValue: "2" },
    }
  },
  押扣: {
    indexKeys: ["a", "b"],
    config: {
      a: { label: "三點式（一般）" },
      b: { label: "三點式（遮煙）" },
    }
  },
  控制箱盤: {
    indexKeys: ["a"],
    config: {
      a: {
        label: "捲門/水閘門",
        type: "subCell",
        subKeys: ["a", "b", "c", "d", "e", "f"],
        subConfig: {
          a: { label: "3HP 馬達控制箱（380V）" },
          b: { label: "3HP 馬達控制箱（380V）" },
          c: { label: "2HP 馬達控制箱（220V）" },
          d: { label: "2HP 馬達控制箱（220V）" },
          e: { label: "彈射門控制箱" },
          f: { label: "紅外線控制盤（含面板）" },
        }
      },
    }
  },
  消防備品: {
    indexKeys: ["a", "b"],
    config: {
      a: { label: "煙感器" },
      b: { label: "中繼器" },
    }
  },
  板門配件: {
    indexKeys: ["a", "b", "c"],
    config: {
      a: { label: "門弓器", defaultValue: "3" },
      b: { label: "平推鎖" },
      c: { label: "電磁扣", defaultValue: "5" },
    }
  },
  主機: {
    indexKeys: ["a", "b", "c", "d"],
    config: {
      a: { label: "遙控器（1:2）+障感器" },
      b: { label: "遙控器（1:2）" },
      c: { label: "障感器" },
      d: { label: "大門用主機" },
    }
  },
  紅外線: {
    indexKeys: ["a", "b"],
    config: {
      a: { label: "對照式" },
      b: { label: "反射式" },
    }
  },
  防颱配件: {
    indexKeys: ["a", "b"],
    config: {
      a: { label: "防颱鎖固", defaultValue: "8" },
      b: { label: "防颱中柱" },
    }
  },
  其他: {
    indexKeys: ["a"],
    config: {
      a: {
        rSpan: 3,
        cSpan: 2,
        type: "textarea"
      },
    }
  },
}





const c2Config: {
  [key in Tc2IndexKeys]: {
    label: string
    rSpan: number
  }
} = {
  鎖盒: {
    label: "鎖盒",
    rSpan: c3Config["鎖盒"].indexKeys.length,
  },
  鎖匙: {
    label: "鎖匙",
    rSpan: c3Config["鎖匙"].indexKeys.length,
  },
  押扣: {
    label: "押扣",
    rSpan: c3Config["押扣"].indexKeys.length,
  },
  控制箱盤: {
    label: "控制箱/盤",
    rSpan: 6,
  },
  消防備品: {
    label: "消防備品",
    rSpan: c3Config["消防備品"].indexKeys.length,
  },
  板門配件: {
    label: "板門配件",
    rSpan: c3Config["板門配件"].indexKeys.length,
  },
  主機: {
    label: "主機",
    rSpan: c3Config["主機"].indexKeys.length,
  },
  紅外線: {
    label: "紅外線",
    rSpan: c3Config["紅外線"].indexKeys.length,
  },
  防颱配件: {
    label: "防颱配件",
    rSpan: c3Config["防颱配件"].indexKeys.length,
  },
  其他: {
    label: "其他",
    rSpan: 3,
  },
}

let c4Index: any[] = [];
Object.values(c3Config)
  .forEach((item) => {
    c4Index = c4Index.concat(item.indexKeys)
  })




// type Tfoo = {
//   [pk: string]:
//   {
//     indexKeys: string[]
//     data: {
//       [key: string]: string
//     }
//   }
// }
// const foo: Tfoo = {
//   one: {
//     indexKeys: ["a", "b"],
//     data: {
//       a: "",
//       b: "",
//     }
//   },
//   two: {
//     indexKeys: ["a", "b", "c"],
//     data: {
//       a: "",
//       b: "",
//       c: "",
//     }
//   },
// }
// foo.one.indexKeys.map((key, index) => {
//   const value = foo.one.data[key]
//   return value
// })


