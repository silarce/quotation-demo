import { ChangeEvent, Dispatch, SetStateAction } from "react";
import classNames from "classnames"

// antd
import { Checkbox } from 'antd';

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import InputSelBar_address from "components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address";

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';

// option
import {
  Toption,
  optionsCreator_taxDeductionCategory,
  //  optionsCreator_customerCategory
} from "fakeDatabase/options/options";

const optionsTaxDeductionCategory
  = optionsCreator_taxDeductionCategory()
// const optionsCustomerCategory
//   = optionsCreator_customerCategory()

// css
import scss from "../customer.module.scss"

// type and config
import { TcustomerDto, TpostCustomer, TprePostCustomer, customerCategoryArr } from "js/api/api_customer";


export default function EditCustomerItem01({ data, setData, nameCheck }: {
  data: TprePostCustomer
  setData:
  Dispatch<SetStateAction<TprePostCustomer>>
  nameCheck: "ok" | "notOk" | "loading"
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
    = (key: keyof Omit<TcustomerDto, "contacts" | "category">) => {
      return (value: string) => {
        setData(data => {
          data[key] = value
          return { ...data }
        })
      }
    }
  // ======================================================
  const onChangeCategory = (checked: boolean, v: string) => {
    if (checked) data.category.push(v)
    else {
      const index = data.category.findIndex((category) => category === v)
      if (index !== -1) {
        data.category.splice(index, 1)
      }
    }
    setData(data => { return ({ ...data }) })
  }

  // ======================================================
  return (
    <div className={scss.editCustomerItem01}>
      <p className={scss.subTitle}>員工個人資料</p>

      <div className={scss.form01}>
        {/* 上邊 */}
        <div>

          <div className={scss.customreName}>
            <InputSel
              className={scss.input02}
              label={"客戶全稱"}
              presetStyle="s01"
              captionWidth="100px"
              textareaProps={{
                value: data["name"],
                onChange: createOnChange("name"),
              }}
            />
            {nameCheck &&
              <span className={scss.checkTip}>
                {nameCheck === "ok" ? <IconCheck01 className={scss.check} cursor="auto" />
                  : nameCheck === "notOk" ? <IconCross01 className={scss.cross} cursor="auto" />
                    : <CircularProgress size={30} />
                }
                {nameCheck === "notOk" &&
                  <span className={scss.alertTip}>
                    {data.name ? "此客戶全稱已被使用" : "請輸入客戶全稱"}
                  </span>
                }
              </span>
            }
          </div>


          <InputSel
            className={scss.input02}
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
            className={scss.input02}
            label={"負責人"}
            presetStyle="s01"
            captionWidth="100px"
            inputProps={{
              value: data["principal"],
              onChange: createOnChange("principal"),
            }}
          />
          <InputSel
            className={scss.select02}
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
            className={scss.input02}
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
        <div className={scss.vr} />
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
                className={scss.input02}
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
            className={scss.selectInput}
            label="公司地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsAddress} />
          <InputSelBar_address
            className={scss.selectInput}
            label="發票地址"
            presetStyle="s01"
            captionWidth="100px"
            addressProps={selectInputPropsInvoice} />
        </div>


        <div className={classNames(scss.rightSide)}>
          <div className={scss.checkboxGroup}>
            <div>
              <span>類別</span>
            </div>
            <div>
              {customerCategoryArr.map((item, index) => {
                const isChecked = !!data.category.find((category) => category === item)
                return (
                  <Checkbox key={index}
                    checked={isChecked}
                    onChange={(e) => { onChangeCategory(e.target.checked, item) }}
                  >{item}</Checkbox>
                )
              })}
            </div>
          </div>

          {/* <InputSel
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
          /> */}

        </div>
      </div> {/* form01 */}
      {/* 右側 */}
    </div >
  )
}


// ==========================================================

type TkeyIndex01Key = (keyof Pick<TcustomerDto,
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
