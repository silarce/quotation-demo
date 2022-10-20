import { ChangeEvent, Dispatch, SetStateAction } from "react";

// global gear
import Input02 from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"
import SelectInput_address from "components/global/gear/HOC/selectInput.tsx/selectInput_address";


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
    onChangeCountry: (option: Toption | null) => {
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
    onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setData(data => {
        data.address = value
        return { ...data }
      })
    },
  }
  const selectInputPropsInvoice = {
    county: invoiceCounty,
    onChangeCountry: (option: Toption | null) => {
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
    onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setData(data => {
        data.invoiceAddress = value
        return { ...data }
      })
    },
  }
  // ======================================================
  const createOnChange
    = (key: keyof Omit<TcustomersData, "contacts">) => {
      return (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
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
          <Input02
            className={style.input02}
            stateValue={data["name"]}
            label={"客戶全稱"}
            onChange={createOnChange("name")}
          />
          <Input02
            className={style.input02}
            stateValue={data["nickname"]}
            label={"客戶簡稱"}
            onChange={createOnChange("nickname")}
          />
        </div>
        {/* 左邊 */}
        <div>
          <Input02
            className={style.input02}
            stateValue={data["principal"]}
            label={"負責人"}
            onChange={createOnChange("principal")}
          />
          <Select02
            className={style.select02}
            stateValue={data["taxDeductionCategory"]}
            label={"扣稅類別"}
            options={optionsTaxDeductionCategory}
            onChange={(option: Toption | null) => {
              if (!option) return
              const { value } = option
              setData(data => {
                data["taxDeductionCategory"] = value
                return ({ ...data })
              })
            }}
          />
          <Input02
            className={style.input02}
            stateValue={data["taxId"]}
            label={"統一編號"}
            onChange={createOnChange("taxId")}
          />
        </div>
        {/* 垂直分隔線 */}
        <div className={style.vr} />
        {/* 右邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key]
            const stateValue = data[key]
            const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <Input02 key={index}
                className={style.input02}
                stateValue={stateValue}
                label={label}
                onChange={onChange}
              />
            )
          })}
        </div>
        {/* 下面 */}
        <div>
          <SelectInput_address
            className={style.selectInput}
            label="公司地址"
            selectInputProps={selectInputPropsAddress} />
          <SelectInput_address
            className={style.selectInput}
            label="發票地址"
            selectInputProps={selectInputPropsInvoice} />
        </div>

        <div className={style.rightSide}>
          <Select02
            className={style.select02}
            stateValue={data["category"]}
            label={"類別"}
            options={optionsCustomerCategory}
            labelWidth="50px"
            onChange={(option: Toption | null) => {
              if (!option) return
              const { value } = option
              setData(data => {
                data["category"] = value
                return ({ ...data })
              })
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
