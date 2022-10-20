import {
  Dispatch, SetStateAction,
} from "react";
import { useRouter } from "next/router";

// component
import EditCustomerItem01 from "./editCustomerItem01";
import EditCustomerItem02 from "./editCustomerItem02";

// global gear
import Input02 from "components/global/gear/input/input02";

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';

// type
import { TcustomersData } from "js/api/api_customer";

// css
import style from "../customer.module.scss"

export default function EditCustomer({ data, setData, check }: {
  data: TcustomersData
  setData: Dispatch<SetStateAction<TcustomersData>>
  check?: "ok" | "notOk" | "loading"
}) {

  const router = useRouter()
  // ==================================================
  const idNumberIsDisabled
    = router.pathname === "/setting/customer/edit/[id]"

  // ==================================================
  return (
    <div className={style.editCustomer}>

      <div className={style.theId}>
        <Input02
          className={style.input02}
          stateValue={data.customerNumber}
          label="客戶編號"
          onChange={(e) => {
            const value = e.target.value
            setData(data => ({ ...data, idNumber: value }))
          }}
          disabled={idNumberIsDisabled}
        />
        {check &&
          <span className={style.checkTip}>
            {check === "ok" ? <IconCheck01 className={style.check} cursor="auto" />
              : check === "notOk" ? <IconCross01 className={style.cross} cursor="auto" />
                : <CircularProgress size={30} />
            }
            {check === "notOk" &&
              <span className={style.alertTip}>
                {data.customerNumber ? "此編號已被使用" : "請輸入客戶編號"}
              </span>
            }
          </span>
        }
      </div>

      <EditCustomerItem01
        data={data}
        setData={setData}
      />
      <EditCustomerItem02
        data={data}
        setData={setData}
      />
    </div>
  )
}