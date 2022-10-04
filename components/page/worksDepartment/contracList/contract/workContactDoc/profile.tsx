


// glogal gear
import Input02 from "components/global/gear/input/input02"
import Status from "components/global/gear/other/status"

// css
import style from "./workContactDoc.module.scss"


// ==================================================
export default function Profile() {


  return (
    <div className={style.profile}>

      <div className={style.leftBlock}>
        <Status text={`請款狀態:${"已出具證明，尚未收足款項"}`} />
        <div className={style.leftUpBlock}>
          <Input02
            {...{
              className: style.input02,
              label: "工程名稱", stateValue: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
              disabled: true, ...inputStyle01
            }} />
          <Input02
            {...{
              className: style.input02,
              label: "工程內容", stateValue: "捲門＋大門工程",
              disabled: true, ...inputStyle01
            }} />
        </div>

        <hr />

        <div className={style.leftDownBlock}>
          <Input02
            {...{
              className: style.input02,
              label: "工程電話", stateValue: "04-1234567",
              disabled: true, ...inputStyle01
            }} />
          <Input02
            {...{
              className: style.input02,
              label: "工程負責人", stateValue: "王先生",
              disabled: true, ...inputStyle02
            }} />
          <Input02
            {...{
              className: style.input02,
              label: "工程傳真", stateValue: "04-1234567",
              disabled: true, ...inputStyle01
            }} />
          <Input02
            {...{
              className: style.input02,
              label: "負責人電話", stateValue: "0987654321",
              disabled: true, ...inputStyle02
            }} />
          <Input02
            {...{
              className: style.input02,
              label: "工程地點", stateValue: "臺中市梧棲區經二路27號臺中市梧棲區經二路27號臺中市梧棲區經二路27號臺中市梧棲區經二路27號",
              disabled: true, ...inputStyle01
            }} />
        </div>
      </div>

      <div className={style.rightBlock}>
        <Input02
          {...{
            className: style.input02,
            label: "工程編號", stateValue: "M-1101201",
            disabled: true, ...inputStyle01
          }} />
        <Input02
          {...{
            className: style.input02,
            label: "承包商", stateValue: "創典科技A有限公司",
            disabled: true, ...inputStyle01
          }} />
        <Input02
          {...{
            className: style.input02,
            label: "負責人", stateValue: "李先生",
            disabled: true, ...inputStyle01
          }} />
        <Input02
          {...{
            className: style.input02,
            label: "公司電話", stateValue: "04-1234567",
            disabled: true, ...inputStyle01
          }} />
        <Input02
          {...{
            className: style.input02,
            label: "公司傳真", stateValue: "04-1234567",
            disabled: true, ...inputStyle01
          }} />
      </div>


    </div>
  )
}


// =============================================================
// =============================================================
// =============================================================
const inputStyle01 = {
  labelWidth: "80px",
  gap: "24px"
}
const inputStyle02 = {
  labelWidth: "90px",
  gap: "24px"
}

