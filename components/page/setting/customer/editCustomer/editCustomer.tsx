
// component
import EditCustomerItem01 from "./editCustomerItem01";
import EditCustomerItem02 from "./editCustomerItem02";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";

// type
import { Class_customer } from "hooks/customer/useCustomer";

// css
import style from "../customer.module.scss"

export default function EditCustomer({ classCustomer, nameCheck }: {
  classCustomer: Class_customer
  nameCheck: "ok" | "notOk" | "loading"
}) {

  // ==================================================
  return (
    <div className={style.editCustomer}>

      <div className={style.theId}>
        <InputSel
          className={style.input02}
          label="客戶編號"
          captionWidth="100px"
          gap="40px"
          disabled={true}
          inputProps={{
            value: classCustomer.customerNumber || "新客戶",
            onChange: (value: string) => { },
          }} />
      </div>

      <EditCustomerItem01
        classCustomer={classCustomer}
        nameCheck={nameCheck}
      />
      <EditCustomerItem02
        classCustomer={classCustomer}
      />
    </div>
  )
}