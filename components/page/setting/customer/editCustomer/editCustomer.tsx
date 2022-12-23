import {
  Dispatch, SetStateAction,
} from "react";
import { useRouter } from "next/router";

// component
import EditCustomerItem01 from "./editCustomerItem01";
import EditCustomerItem02 from "./editCustomerItem02";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';

// type
import { TcustomerDto,TpostCustomer } from "js/api/api_customer";

// css
import style from "../customer.module.scss"

export default function EditCustomer({ data, setData, check }: {
  data: TpostCustomer
  setData: Dispatch<SetStateAction<TpostCustomer>>
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
        <InputSel
          className={style.input02}
          label="客戶編號"
          captionWidth="100px"
          gap="40px"
          disabled={idNumberIsDisabled}
          inputProps={{
            value: data.customerNumber,
            onChange: (value: string) => {
              setData(data => ({ ...data, customerNumber: value }))
            },
          }}
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