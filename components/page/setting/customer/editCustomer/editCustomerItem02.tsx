import { ChangeEvent, Dispatch, SetStateAction } from "react";


// global gear
import Input02 from "components/global/gear/input/input02"

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";


// css
import style from "../customer.module.scss"

// type
import { TcustomersData, TcontactData } from "js/api/api_customer";



// ======================================================
export default function EditCustomerItem02({ data, setData }: {
  data: TcustomersData
  setData:
  Dispatch<SetStateAction<TcustomersData>>
}) {

  const contacts = data.contacts ?? []
  if (!contacts[0]) contacts.push({})

  return (
    <div className={style.editCustomerItem02}>
      <p className={style.subTitle}>公司資訊</p>

      <div className={`${style.form}`}>

        {contacts?.map((item, index) => {
          const { name, phone } = item
          const onChange01 = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
            setData(data => {
              data.contacts![index].name = value
              return { ...data }
            })
          }
          const onChange02 = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
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
              <Input02
                className={style.input02}
                stateValue={name}
                label={`聯絡人 ${index + 1}`}
                onChange={onChange01}
              />
              <Input02
                className={style.input02}
                stateValue={phone}
                label={"電話"}
                onChange={onChange02}
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