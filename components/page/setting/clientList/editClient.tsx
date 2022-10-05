import {
  Dispatch, SetStateAction, ChangeEvent,
  useMemo, useState,
} from "react"

import { TclientProfile } from "fakeDatabase/client/fakeClientList";
// gear
import { Container01 } from "components/global/gear/container/container01"
//global gear
import { Input01 } from "components/global/gear/input/input";
import { Select02 } from "components/global/gear/select/select";
import SelectInput from "components/global/gear/HOC/selectInput.tsx/selectInput";
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";

// css
import style from "./editClient.module.scss"

// data type
import { Toption, optionsCreator_country, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'



export default function EditClient({ selData, setSelData }:
  {
    selData: TclientProfile
    setSelData: Dispatch<SetStateAction<TclientProfile>>
  }) {

  const formObj = useMemo(() =>
    formObjCreator(selData, setSelData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [selData])
  // ====================================================
  const { clientId: id } = selData
  const { name, shortName, phone,
    fax, head,
    //  address, billAddress, 
    taxtNumber,
    taxtType, type, contact
  } = formObj
  const styleWidth = {
    labelWidth: "80px"
  }
  // ====================================================
  const addContact = () => {
    // 把contact寫在setState外面是因為，在嚴格模式下
    // setState會執行兩次，也就是說push會執行兩次
    // 導致BUG
    const contact = selData.contact
    contact.push({
      name: "",
      phone: ""
    })
    setSelData(state => {
      return { ...state, contact }
    })
  }
  const removeContact = () => {
    // 附註同addContent
    const contact = selData.contact
    if (contact.length <= 1) return;
    contact.pop()
    setSelData(state => {
      return { ...state, contact }
    })
  }

  // ====================================================
  // 公司地址
  // 城市
  const countryOptions = optionsCreator_country()
  const [country, setCountry] = useState<Toption | null>(null)

  // 地區
  const [district, setDistrict] = useState<Toption | null>(null)
  const districtOptions = useMemo(() => {
    setDistrict(null)
    return districtOptionsSelector(country?.value || "")
  }, [country])

  // 剩餘地址
  const [address, setAddress] = useState("")


  const selectInputList = [
    {
      stateValue: country,
      options: countryOptions,
      placeholder: "選擇縣市",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setCountry(option)
      }
    },
    {
      stateValue: district,
      options: districtOptions,
      placeholder: "選擇地區",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setDistrict(option)
      }
    },
    {
      stateValue: address,
      placeholder: "請輸入剩餘地址",
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)
    },
  ]
  // --------------------------------
  // 發票地址
  // 城市
  const billCountryOptions = optionsCreator_country()
  const [billCountry, setBillCountry] = useState<Toption | null>(null)

  // 地區
  const [billDistrict, setBillDistrict] = useState<Toption | null>(null)
  const billDistrictOptions = useMemo(() => {
    setBillDistrict(null)
    return districtOptionsSelector(billCountry?.value || "")
  }, [billCountry])

  // 剩餘地址
  const [billAddress, setBillAddress] = useState("")

  const billSelectInputList = [
    {
      stateValue: billCountry,
      options: billCountryOptions,
      placeholder: "選擇縣市",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setBillCountry(option)
      }
    },
    {
      stateValue: billDistrict,
      options: billDistrictOptions,
      placeholder: "選擇地區",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setBillDistrict(option)
      }
    },
    {
      stateValue: billAddress,
      placeholder: "請輸入剩餘地址",
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => setBillAddress(e.target.value)
    },
  ]

  // ====================================================
  return (
    <div className={style.container}>
      <div className={style.id}>
        <span>使用者代號</span>
        <span>{id}</span>
      </div>
      <Container01 label={"客戶資料"} >
        <div className={style.form01}>
          <Input01 {...{ ...name, ...styleWidth, }} />
          <Input01 {...{ ...shortName, ...styleWidth, }} />
          {/*  */}
          <div>
            <Input01 {...{ ...head, ...styleWidth, }} />
            <Select02 labelWidth={"80px"} {...{ ...taxtType }} /> {/* 扣稅列別 */}
            <Input01 {...{ ...taxtNumber, ...styleWidth, }} />
          </div>
          <div className={style.vr} />
          <div>
            <Input01 {...{ ...phone, ...styleWidth, }} />
            <Input01 {...{ ...fax, ...styleWidth, }} />
          </div>
        </div>
        <div className={style.form02}>
          <Select02 {...{ ...type, labelWidth: "40px" }} />
        </div>
        <div className={style.form03}>
          <SelectInput className={style.selectInput}
            label="戶籍地址" searchInputPropsList={selectInputList}
            labelWidth="90px" />
          <SelectInput className={style.selectInput}
            label="聯絡地址" searchInputPropsList={billSelectInputList}
            labelWidth="90px" />
        </div>
      </Container01>

      <Container01 label={"聯絡人資訊"}>
        {contact.map((item, index) => {
          const { name, phone } = item
          return (
            <div className={style.form04} key={index}>
              <Input01 {...{ ...name, }} />
              <Input01 {...{ ...phone, }} />
              <div>
                <IconAddCircle onClick={addContact} />
                {index > 0 && <IconRemoveCircle onClick={removeContact} />}

              </div>
            </div>
          )
        })}
      </Container01>
    </div>
  )
}

// ======================================================================

const formObjCreator = (
  state: TclientProfile,
  setState: Dispatch<SetStateAction<TclientProfile>>
) => {
  // ==============================
  // InputDataCreator
  const idc = (
    label: string,
    key: Exclude<keyof TclientProfile, "contact">,
    placeholder?: string,
  ) => {
    if (!placeholder) placeholder = `請輸入${label}`
    const stateValue = state[key]
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setState(state => {
        state[key] = value
        return { ...state }
      })
    }
    const id = key
    return { label, placeholder, id, stateValue, onChange }
  }
  // =============================================
  // selectDataCreator
  const sdc = (optionObj: ToptionBox) => {
    let { key, label, placeholder, options } = optionObj
    const stateValue = state[key]
    const onChange = (option: Toption | null) => {
      if (!option) return
      const { value } = option
      setState(state => {
        state[key] = value
        return { ...state }
      })
    }
    return {
      label, stateValue, placeholder, options, onChange
    }
  }
  // =============================================
  // InputContactDataCreatorCore
  const icdc = () => {
    const contact = state.contact
    const list = contact.map((item, index) => {
      const creator = (
        key: keyof typeof item,
      ) => {
        // -------------------
        const stateValue = item[key]
        // -------------------
        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          setState(state => {
            state.contact[index][key] = value
            return { ...state }
          })
        }
        // -------------------
        const label = key === "phone" ? "電話" : `聯絡人 ${index + 1}`
        const placeholder = key === "phone" ? "請輸入電話" : `請輸入聯絡人`
        // -------------------
        return {
          label,
          placeholder,
          id: `contactName${index + 1}`,
          stateValue,
          onChange
        }
      }
      return {
        name: creator("name"),
        phone: creator("phone")
      }
    }) //list
    return list
  } //icdc
  // =============================================

  const data = {
    name: idc("客戶全稱", "name",),
    shortName: idc("客戶簡稱", "shortName",),
    phone: idc("公司電話", "phone",),
    fax: idc("公司傳真", "fax",),
    head: idc("負責人", "head",),
    address: idc("公司地址", "address",),
    billAddress: idc("發票地址", "billAddress",),
    taxtNumber: idc("統一編號", "taxtNumber",),
    taxtType: sdc(optionList.taxtType as ToptionBox),
    type: sdc(optionList.type as ToptionBox),
    contact: icdc()
  }
  return data
}

interface ToptionBox {
  key: Exclude<keyof TclientProfile, "contact">
  label: string
  placeholder?: string
  options: {
    value: string,
    label: string
  }[]
}

type ToptionList = {
  [key in keyof TclientProfile]?: ToptionBox
}

const optionList: ToptionList = {
  taxtType: {
    key: "taxtType",
    label: "扣稅類別",
    placeholder: "請選擇類別",
    options: [
      { value: "應稅", label: "應稅" },
      { value: "應稅外加", label: "應稅外加" },
      { value: "免稅", label: "免稅" },
    ]
  },
  type: {
    key: "type",
    label: "類別",
    placeholder: "請選擇類別",
    options: [
      { value: "客戶", label: "客戶" },
      { value: "廠商", label: "廠商" },
      { value: "客戶廠商", label: "客戶廠商" },
    ]
  },
}





