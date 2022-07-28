import { Dispatch, SetStateAction } from 'react';

// antd
import { Dropdown, Menu } from 'antd';
// import { Select as antdSelect } from 'antd';
import reactSel, { SingleValue, ActionMeta } from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down_red.svg"

// css
import style from "./_localLayout.module.scss"

// type
import { TstaffInfo } from "components/setting/staffProfile/fakeData";
type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>



const Foo = () => {

  const Select = reactSel

  const options = [
    { value: "男", label: "男" },
    { value: "女", label: "女" },
  ]

  const handleChange = (option: SingleValue<{
    value: string;
    label: string;
  }>) => {

    const { value } = option

    // console.log(option.value)

  }


  return (
    <>
      <Select
        // defaultValue={}
        // value={}
        options={options}
        onChange={handleChange}
      />
    </>
  )

}










