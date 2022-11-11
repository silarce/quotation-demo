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

  const refPdf = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!isVisable || !refPdf.current[0]) return;

    const doc = new jsPDF("p", "px", "a4")
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();

    (async () => {
      let isFirst = true
      let item
      for (item of refPdf.current) {
        if (!item) return
        const image = await html2canvas(item)
          .then((canvas) => {
            const image = canvas.toDataURL("image/JPEG")
            return image

            // doc.addImage(avatar.src, "JPEG", 0, 0, 100, 100);
            // doc.addImage(image, "JPEG", 0, 0, 595, 842);
            // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);

          })

        if (!isFirst) doc.addPage()
        isFirst = false
        doc.addImage(image, "JPEG", 0, 0, pageWidth, pageHeight,);
      }
      doc.save('foo.pdf')
    })()


  }, [isVisable])


  console.log(refPdf)

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
        ref={ele => refPdf.current[0] = ele}>
        <Header />
        <Profile />
        <Table />
        <Total />
        <Other />
      </div>

      <div className={style.pdf}
        ref={ele => refPdf.current[1] = ele}>
        <Header />
        <Profile />
        <Table />
        <Total />
        <Other />
      </div>


    </Modal>
  )
}

// ========================================================================
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// 接著，製作另一個版本的排版，還有選擇兩種排版的切換按鈕，然後把資料引入PDF
// ========================================================================
// 或許可以用瀏覽器的列印功能產生pdf?

















