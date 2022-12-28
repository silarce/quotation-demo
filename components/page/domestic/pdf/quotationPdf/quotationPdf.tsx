import React, {
  Dispatch, SetStateAction,
  useState, useEffect, useRef, Fragment
} from "react"
import html2canvas from 'html2canvas'
import jsPDF from "jspdf"

import Decimal from "decimal.js"

const _ = require("lodash")

// component
import Header from "./header"
import Profile from "./profile"
import Table from "./table"
import Table_quoteTypeSum, { TquoteTypeSumList } from "./table_quoteTypeSum"
import Total from "./total"
import Other from "./other"

// global gear
import { setRootLoading, showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// antd
import Modal from "antd/lib/modal/Modal"

// css
import scss from "./quotationPdf.module.scss"

// type
import { TuseProfile } from "components/page/domestic/quotation/hook/useProfile"
import { TuseProduct, ProdClass } from "components/page/domestic/quotation/hook/useProduct"
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

  // useEffect(() => {
  //   showRootLoading(true, "正在處理PDF")
  // }, [])

  // ------------------------------------------------------------------

  const quotationId = profileState.profile.quotationId

  // ------------------------------------------------------------------
  const refPdf = useRef<(HTMLDivElement | null)[]>([])

  const dlPdf = async () => {
    if (!isVisable || !refPdf.current[0]) return;

    showRootLoading(true, "正在處理PDF")

    const doc = new jsPDF("p", "px", "a4")
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true
    let item
    for (item of refPdf.current) {
      if (!item) continue
      const image = await html2canvas(item)
        .then((canvas) => {
          const image = canvas.toDataURL("image/JPEG")
          return image
        })
      if (!isFirst) doc.addPage()
      isFirst = false
      // 留作參考
      // doc.addImage(image, "JPEG", 0, 0, 595, 842);
      // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
      doc.addImage(image, "JPEG", 0, 0, pageWidth, pageHeight,);
    }
    doc.save(`${quotationId}.pdf`)
    showRootLoading(false)
  }

  // ----------------------------------------------------------------------------
  return (
    <Modal className={scss.quotationPdf}
      // wrapClassName={style.modal}
      visible={isVisable}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered={true}
      width={"fit-content"}
    >

      <div className={scss.panel}>
        <div className={scss.left}>
          <button className={pdfType === "typeA" ? scss.active : ""}
            onClick={() => { setPdfType("typeA") }}>
            <span>typeA</span>
          </button>
          <button className={pdfType === "typeB" ? scss.active : ""}
            onClick={() => { setPdfType("typeB") }}>
            <span>typeB</span>
          </button>
        </div>
        <div>
          <button onClick={dlPdf}><span>下載PDF</span></button>
        </div>
      </div>

      {pdfType === "typeA" &&
        <PdfTypeA refPdf={refPdf}
          profileState={profileState}
          prodState={prodState}
          remarkListState={remarkListState}
          rangeListState={rangeListState}
          payInfoState={payInfoState}
          sinatureState={sinatureState}
        />
      }
      {pdfType === "typeB" &&
        <PdfTypeB refPdf={refPdf}
          profileState={profileState}
          prodState={prodState}
          remarkListState={remarkListState}
          rangeListState={rangeListState}
          payInfoState={payInfoState}
          sinatureState={sinatureState}
        />
      }
    </Modal>
  )
}
// ========================================================================
// typeA 用在只有一頁的情況
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

  const { productList } = prodState
  const chunkedList = _.chunk(productList, 12) as ProdClass[][]
  const pageCount = chunkedList.length

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 每一頁 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && <hr className={scss.hr} />}
            <div className={`${scss.pdf} ${scss.spaceBetween}`}
              ref={ele => refPdf.current[0] = ele}>
              <div>
                <Header />
                <Profile profileState={profileState} index={index + 1} pageCount={pageCount} />
                <Table productList={chunk} />
              </div>
              <div>
                <Total remarkListState={remarkListState} prodState={prodState} />
                <Other
                  rangeListState={rangeListState}
                  payInfoState={payInfoState}
                  sinatureState={sinatureState}
                />
              </div>
            </div>
          </Fragment>
        )
      })}
    </>
  )
}

// typeB 用在多頁的情況
const PdfTypeB = (
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

  const { productList } = prodState
  const chunkedList = _.chunk(productList, 40) as ProdClass[][]
  const pageCount = chunkedList.length + 1
  // --------------------------------------------------------------------------



  // console.log(productList)

  const quoteTypeSumObj: TquoteTypeSumList = {}

  productList.forEach((prod) => {
    const { quoteType, qty, unitPrice, priceTotal } = prod
    const key = quoteType.value

    if (!quoteTypeSumObj[key]) quoteTypeSumObj[key] = {
      quoteType: quoteType.label,
      qtySum: 0,
      unitPriceSum: 0,
      priceTotleSum: 0,
    }


    quoteTypeSumObj[key].qtySum
      = quoteTypeSumObj[key].qtySum + parseInt(qty)
    quoteTypeSumObj[key].unitPriceSum
      = new Decimal(quoteTypeSumObj[key].unitPriceSum).plus(unitPrice.replace(",", "")).toNumber()
    quoteTypeSumObj[key].priceTotleSum
      = new Decimal(quoteTypeSumObj[key].priceTotleSum).plus(priceTotal.replace(",", "")).toNumber()
  })

  const quoteTypeSumArr = Object.values(quoteTypeSumObj)

  // --------------------------------------------------------------------------
  return (
    <>
      {/* 第一頁 */}
      <div className={`${scss.pdf} ${scss.spaceBetween}`}
        ref={ele => refPdf.current[0] = ele}>
        <div>
          <Header />
          <Profile profileState={profileState} index={1} pageCount={pageCount} />
          <Table_quoteTypeSum quoteTypeSumArr={quoteTypeSumArr} />
        </div>
        <div>
          <Total remarkListState={remarkListState} prodState={prodState} />
          <Other
            rangeListState={rangeListState}
            payInfoState={payInfoState}
            sinatureState={sinatureState}
          />
        </div>
      </div>
      {/* 第一頁之後 */}
      {chunkedList.map((chunk, index) => {
        return (
          <Fragment key={index}>
            <hr className={scss.hr} />
            <div className={scss.pdf}
              ref={ele => refPdf.current[index + 1] = ele}>
              <Header />
              <Profile profileState={profileState} index={index + 2} pageCount={pageCount} />
              <Table productList={chunk} />
            </div>
          </Fragment>
        )
      })}
    </>
  )
}

// ========================================================================







