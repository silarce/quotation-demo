import {
  Dispatch, SetStateAction
} from "react";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";


// css
import style from "../customer.module.scss"

// type
import { TcustomerDto, TpostCustomer } from "js/api/api_customer";

// ======================================================
export default function EditCustomerItem02({ data, setData }: {
  data: TpostCustomer
  setData:
  Dispatch<SetStateAction<TpostCustomer>>
}) {



  const contacts: TpostCustomer["contacts"] = (data.contacts ?? [])
  if (!contacts[0]) contacts.push({
    name: "",
    phone: ""
  })

  return (
    <div className={style.editCustomerItem02}>
      <p className={style.subTitle}>公司資訊</p>

      <div className={`${style.form}`}>

        {contacts?.map((item, index) => {
          const { name, phone } = item
          const onChange01 = (value: string) => {
            setData(data => {
              data.contacts![index].name = value
              return { ...data }
            })
          }
          const onChange02 = (value: string) => {
            setData(data => {
              data.contacts![index].phone = value
              return { ...data }
            })
          }

          const addContact = () => {
            data.contacts!.push({
              name: "",
              phone: ""
            })
            setData({ ...data })
          }
          const deleteContact = () => {
            if (contacts.length === 1) return;
            data.contacts!.splice(index, 1)
            setData({ ...data })
          }

          return (
            <div className={style.inputBox} key={index}>
              <InputSel
                className={style.input02}
                label={`聯絡人 ${index + 1}`}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: name ?? "",
                  onChange: onChange01,
                }}
              />
              <InputSel
                className={style.input02}
                label={"電話"}
                presetStyle="s01"
                captionWidth="100px"
                inputProps={{
                  value: phone ?? "",
                  onChange: onChange02,
                }}
              />
              <div className={style.buttonBox}>
                <IconAddCircle onClick={addContact} />
                <IconRemoveCircle
                  className={contacts.length === 1 ? style.noShow : ""}
                  onClick={deleteContact}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}