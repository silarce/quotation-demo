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

// type
import { TuseProfile } from "components/page/domestic/quotation/hook/useProfile"
import { TuseProduct } from "components/page/domestic/quotation/hook/useProduct"
import { TuseRemarkList } from "components/page/domestic/quotation/hook/useRemarkList"
import { TuseRangeList } from "components/page/domestic/quotation/hook/useRangeList"
import { TusePayInfo } from "components/page/domestic/quotation/hook/usePayInfo"
import { TuseSinature } from "components/page/domestic/quotation/hook/useSinature"

export default function QuotationPdf(
  { isVisable, onCancel,
    profileState,
    prodState,
    remarkListState,
    rangeListState,
    payInfoState,
    sinatureState,
  }:
    {
      isVisable: boolean
      onCancel: () => void
      profileState: TuseProfile
      prodState: TuseProduct
      remarkListState: TuseRemarkList
      rangeListState: TuseRangeList
      payInfoState: TusePayInfo
      sinatureState: TuseSinature
    }
) {

  const [pdfType, setPdfType] = useState("typeA")


  // ------------------------------------------------------------------
  const refPdf = useRef<(HTMLDivElement | null)[]>([])
  // useEffect(() => {
  //   if (!isVisable || !refPdf.current[0]) return;
  //   const doc = new jsPDF("p", "px", "a4")
  //   var pageWidth = doc.internal.pageSize.getWidth();
  //   var pageHeight = doc.internal.pageSize.getHeight();
  //   (async () => {
  //     let isFirst = true
  //     let item
  //     for (item of refPdf.current) {
  //       if (!item) return
  //       const image = await html2canvas(item)
  //         .then((canvas) => {
  //           const image = canvas.toDataURL("image/JPEG")
  //           return image
  //           // doc.addImage(avatar.src, "JPEG", 0, 0, 100, 100);
  //           // doc.addImage(image, "JPEG", 0, 0, 595, 842);
  //           // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
  //         })
  //       if (!isFirst) doc.addPage()
  //       isFirst = false
  //       doc.addImage(image, "JPEG", 0, 0, pageWidth, pageHeight,);
  //     }
  //     doc.save('foo.pdf')
  //   })()
  // }, [isVisable])


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
      <PdfTypeA refPdf={refPdf}
        profileState={profileState}
        prodState={prodState}
        remarkListState={remarkListState}
        rangeListState={rangeListState}
        payInfoState={payInfoState}
        sinatureState={sinatureState}
      />
    </Modal>
  )
}
// ========================================================================
const PdfTypeA = (
  { refPdf,
    profileState,
    prodState,
    remarkListState,
    rangeListState,
    payInfoState,
    sinatureState
  }:
    {
      refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>
      profileState: TuseProfile
      prodState: TuseProduct
      remarkListState: TuseRemarkList
      rangeListState: TuseRangeList
      payInfoState: TusePayInfo
      sinatureState: TuseSinature
    }
) => {


  return (
    <>
      <div className={style.pdf}
        ref={ele => refPdf.current[0] = ele}>
        <Header />
        <Profile profileState={profileState} />
        <Table prodState={prodState}/>
        <Total remarkListState={remarkListState} prodState={prodState} />
        <Other
          rangeListState={rangeListState}
          payInfoState={payInfoState}
          sinatureState={sinatureState}
        />
      </div>
      {/* <hr className={style.hr} />
      <div className={style.pdf}
        ref={ele => refPdf.current[1] = ele}>
        <Header />
        <Profile />
        <Table />
        <Total />
        <Other />
      </div> */}
    </>
  )
}

// ========================================================================





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

















