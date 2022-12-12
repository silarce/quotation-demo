import { ChangeEvent, Dispatch, SetStateAction } from "react";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import InputSelBar_address from "components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address";

// option
import {
  Toption,
  optionsCreator_taxDeductionCategory, optionsCreator_customerCategory
} from "fakeDatabase/options/options";

const optionsTaxDeductionCategory
  = optionsCreator_taxDeductionCategory()
const optionsCustomerCategory
  = optionsCreator_customerCategory()

// css
import style from "../customer.module.scss"

// type
import { TcustomersData } from "js/api/api_customer";


export default function EditCustomerItem01({ data, setData }: {
  data: TcustomersData
  setData:
  Dispatch<SetStateAction<TcustomersData>>
}) {

  const {
    county, district, address,
    invoiceCounty, invoiceDistrict, invoiceAddress
  } = data




  // ======================================================
  const selectInputPropsAddress = {
    county: county,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.county = value
        data.district = ""
        return { ...data }
      })
    },
    district: district,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.district = value
        return { ...data }
      })
    },
    address: address,
    onChangeAddress: (value: string) => {
      setData(data => {
        data.address = value
        return { ...data }
      })
    },
  }
  const selectInputPropsInvoice = {
    county: invoiceCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.invoiceCounty = value
        data.invoiceDistrict = ""
        return { ...data }
      })
    },
    district: invoiceDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.invoiceDistrict = value
        return { ...data }
      })
    },
    address: invoiceAddress,
    onChangeAddress: (value: string) => {
      setData(data => {
        data.invoiceAddress = value
        return { ...data }
      })
    },
  }
  // ======================================================
  const createOnChange
    = (key: keyof Omit<TcustomersData, "contacts">) => {
      return (value: string) => {
        setData(data => {
          data[key] = value
          return { ...data }
        })
      }
    }
  // ======================================================
  return (
    <div className={style.editCustomerItem01}>
      <p className={style.subTitle}>員工個人資料</p>



      <div className={style.form01}>
        {/* 上邊 */}
        <div>
          <InputSel
            className={style.input02}
            label={"客戶全稱"}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: data["name"],
              onChange: createOnChange("name"),
            }}
          />
          <InputSel
            className={style.input02}
            label={"客戶簡稱"}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: data["nickname"],
              onChange: createOnChange("nickname"),
            }}
          />
        </div>
        {/* 左邊 */}
        <div>
          <InputSel
            className={style.input02}
            label={"負責人"}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: data["principal"],
              onChange: createOnChange("principal"),
            }}
          />
          <InputSel
            className={style.select02}
            label={"扣稅類別"}
            presetStyle="s01"
            captionWidth="100px"
            selectProps={{
              value: data["taxDeductionCategory"],
              options: optionsTaxDeductionCategory,
              onChange: (option: Toption | null) => {
                if (!option) return
                const { value } = option
                setData(data => {
                  data["taxDeductionCategory"] = value
                  return ({ ...data })
                })
              },
            }}
          />
          <InputSel
            className={style.input02}
            label={"統一編號"}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: data["taxId"],
              onChange: createOnChange("taxId"),
            }}
          />
        </div>
        {/* 垂直分隔線 */}
        <div className={style.vr} />
        {/* 右邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key]
            const stateValue = data[key]
            const onChange = (value: string) => {
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <InputSel key={index}
                className={style.input02}
                label={label}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: stateValue,
                  onChange: onChange,
                }}
              />
            )
          })}
        </div>
        {/* 下面 */}
        <div>
          <InputSelBar_address
            className={style.selectInput}
            label="公司地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsAddress} />
          <InputSelBar_address
            className={style.selectInput}
            label="發票地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsInvoice} />
        </div>

        <div className={style.rightSide}>
          <InputSel
            className={style.select02}
            label={"類別"}
            presetStyle="s01"
            captionWidth="50px"
            selectProps={{
              value: data["category"],
              options: optionsCustomerCategory,
              onChange: (option: Toption | null) => {
                if (!option) return
                const { value } = option
                setData(data => {
                  data["category"] = value
                  return ({ ...data })
                })
              },
            }}
          />
        </div>
      </div> {/* form01 */}
      {/* 右側 */}
    </div>
  )

}


// ==========================================================

type TkeyIndex01Key = (keyof Pick<TcustomersData,
  "phone" | "fax">)

const keyIndex01: TkeyIndex01Key[]
  = ["phone", "fax"]

const config01: {
  [key in TkeyIndex01Key]: {
    label: string
  }
} = {
  phone: {
    label: "公司電話"
  },
  fax: {
    label: "公司傳真"
  },
}
