import { Dispatch, SetStateAction, ChangeEvent } from 'react';

import { TclientProfile } from "fakeDatabase/client/fakeClientList";

import { Input01 } from "components/global/gear/input/input";





interface Tdata {
  label: string
  stateValue: string
  placeholder: string
  key: keyof TclientProfile
  setState: Dispatch<SetStateAction<TclientProfile>>
}



export default function EditClientInput({ data, width, labelWidth }: {
  data: Tdata
  width: string
  labelWidth: string
}) {

  const { label, stateValue, placeholder, key, setState } = data

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setState(state => {
      if (key === "contact") return state
      state[key] = value
      return state
    })
  }


  const id = key
  return <Input01 {...{ label, stateValue, placeholder, id, onChange }} />


}








