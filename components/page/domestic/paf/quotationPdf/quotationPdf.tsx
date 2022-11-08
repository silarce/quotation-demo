

// component
import Header from "./header"
import Profile from "./profile"
import Table from "./table"



// antd
import Modal from "antd/lib/modal/Modal"

// css
import style from "./quotationPdf.module.scss"


export default function QuotationPdf(
  { isVisable, onCancel }:
    {
      isVisable: boolean
      onCancel: () => void
    }

) {




  return (
    <Modal className={style.quotationPdf}
      // wrapClassName={style.modal}
      visible={isVisable}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered={true}
      width={"fit-content"}
    >

      <Header />
      <Profile />
      <Table />




    </Modal>
  )
}

// ========================================================================
// 或許可以用瀏覽器的列印功能產生pdf?

















