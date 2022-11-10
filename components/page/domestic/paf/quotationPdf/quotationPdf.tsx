import React, {
  Dispatch, SetStateAction,
  useState, useEffect, useRef,
} from "react"
import html2canvas from 'html2canvas'
import jsPDF from "jspdf"

// component
import Header from "./header"
import Profile from "./profile"
import Table from "./table"
import Total from "./total"
import Other from "./other"

// antd
import Modal from "antd/lib/modal/Modal"

// css
import style from "./quotationPdf.module.scss"

// import avatar from "public/image/avatar.png"


export default function QuotationPdf(
  { isVisable, onCancel }:
    {
      isVisable: boolean
      onCancel: () => void
    }
) {


  const refPdf = useRef(null!)
  const refFoo = useRef(null!)

  // const [bar, setBar] = useState()
  useEffect(() => {
    if (!isVisable) return;
    html2canvas(refPdf.current)
      .then((canvas) => {
        const doc = new jsPDF("p", "px", "a4")
        const image = canvas.toDataURL("image/JPEG")

        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        // refFoo.current.appendChild(canvas)
        // window.open(image)
        // setBar(image)
        // doc.addImage(avatar.src, "JPEG", 0, 0, 100, 100);
        // doc.addImage(image, "JPEG", 0, 0, 595, 842);
        // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);

        doc.addImage(image, "JPEG", 0, 0, width, height);
        doc.save('foo.pdf')
      })
  }, [isVisable])




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
      <div className={style.pdf}
        ref={refPdf}>
        <Header />
        <Profile />
        <Table />
        <Total />
        <Other />
      </div>

      {/* <div ref={refFoo}>
        <img src={bar} alt="" />
      </div> */}

    </Modal>
  )
}

// ========================================================================
// 或許可以用瀏覽器的列印功能產生pdf?

















