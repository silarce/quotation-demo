
import MyButton_v2 from "components/global/gear/button/myButton_v2";

import { filterHolidays } from "js/utils/helpers/date/filterHolidays";
import { createJSONDonwload } from "js/utils/helpers/createJSONDonwload";


// 把需要過濾的中華民國政府行政機關辦公日曆表.json import進來
// https://data.gov.tw/dataset/14718
// 按檢視資料，點選JSON
import calendar from "public/calendar/112年中華民國政府行政機關辦公日曆表.json"


// 以後有空再改成用input引入檔案


export default function Labe00() {

  const calendar_group = filterHolidays(calendar)
  const handleDownload = createJSONDonwload(calendar_group, "中華民國假日表_112年")


  return (
    <div className="p-5">
      <MyButton_v2
        onClick={handleDownload}
        label="下載過濾好的假日表"
      />
    </div>
  )
}


