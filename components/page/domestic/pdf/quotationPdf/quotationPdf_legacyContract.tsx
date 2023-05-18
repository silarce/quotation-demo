import React, { useState, useRef, Fragment } from "react"
import html2canvas from 'html2canvas'
import jsPDF from "jspdf"

import Decimal from "decimal.js"

const _ = require("lodash")

// component
import Header from "./header"
import Profile from "./profile"
import Table, { TtableProdList } from "./table"
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
import { Class_quotation } from "hooks/quotation/useQuotation"
import { Class_legacyContract } from "hooks/quotation/useLegacyContract"

export default function QuotationPdf(
  { isVisable, onCancel,
    classQuotation,
  }:
    {
      isVisable: boolean
      onCancel: () => void
      classQuotation: Class_quotation | Class_legacyContract
      // classQuotation: Class_quotation
    }
) {
  /**這個變數用來識別是哪個Class */
  const identify = classQuotation.identify

  const { classBasicInfo } = classQuotation

  const { quotationId } = classBasicInfo.all.basicInfo


  const [pdfType, setPdfType] = useState("typeA")

  // useEffect(() => {
  //   showRootLoading(true, "正在處理PDF")
  // }, [])

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
  // profile
  const profilePram = (() => {
    const { basicInfo, clientProfile } = classQuotation.classBasicInfo.all
    const {
      quotationId,
      date: builtDate,
      constructionCounty,
      constructionDistrict,
      constructionAddress,
    } = basicInfo
    const {
      name: clientName,
      contact,
      fax,
    } = clientProfile ?? {}

    return {
      quotationId,
      clientName: clientName ?? "",
      contactPerson: contact?.[0].name ?? "",
      contactPhone: contact?.[0].phone ?? "",
      fax: fax ?? "",
      builtDate,
      projectAddress: constructionCounty + constructionDistrict + constructionAddress,
    }
  })()
  // -------------------------------
  // total
  const totalPram = (() => {
    const memoArr = classQuotation.classMemo.stringArr

    const subTotal =
      identify === "normal" ? classQuotation.subTotal :
        identify === "legacy" ? classQuotation.classPayInfo.subTotal : "-1"
    const businessTax =
      identify === "normal" ? classQuotation.businessTax :
        identify === "legacy" ? classQuotation.classPayInfo.tax : "-1"
    const total =
      identify === "normal" ? classQuotation.total :
        identify === "legacy" ? classQuotation.classPayInfo.total : "-1"

    const settlement = {
      subTotal: parseFloat(subTotal), //小計
      businessTax: parseFloat(businessTax), //營業稅
      total: parseFloat(total), // 統計
    }

    return { memoArr, settlement, }
  })()
  // -------------------------------
  // other
  const otherPram = (() => {
    const quoteRangeArr = classQuotation.classQuoteRange.stringArr
    const attn = classQuotation.classSignature.operatorName
    const payInfo = (() => {
      if (identify === "normal") {
        const {
          tradingLocation, tradingDate,
          deposit, deliveryPayment, installedPayment, eleConnectPayment,
        } = classQuotation.classPayInfo
        return {
          tradingLocation,
          tradingDate,
          payWay: [
            { label: "訂製同時付總金額", value: deposit },
            { label: "交貨同時付總金額", value: deliveryPayment },
            { label: "按裝完成付總金額", value: installedPayment },
            { label: "接電使用付總金額", value: eleConnectPayment },
          ]
        }
      }
      if (identify === "legacy") {
        const { tradingLocation, tradingDate, paymentMethods: payWay } = classQuotation.classPayInfo
        return { tradingLocation, tradingDate, payWay }
      }
    })()

    return { quoteRangeArr, payInfo: payInfo!, attn, }
  })()


  const productArr = (() => {
    if (identify === "normal") return classQuotation.mainProductArr.map((mp) => mp.allData)
    if (identify === "legacy") {
      return classQuotation.classProductArr.map((mp) => {
        return {
          ...mp.allData,
          priceTotal: mp.allData.priceSubTotal
        }
      })
    }
    return []
  })()


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
          productArr={productArr}
          profilePram={profilePram}
          totalPram={totalPram}
          otherPram={otherPram} />
      }
      {pdfType === "typeB" &&
        <PdfTypeB
          refPdf={refPdf}
          productArr={productArr}
          profilePram={profilePram}
          totalPram={totalPram}
          otherPram={otherPram} />
      }
    </Modal>
  )
}
// ========================================================================
// typeA 用在只有一頁的情況
const PdfTypeA = (
  { refPdf,
    productArr,
    profilePram,
    totalPram,
    otherPram,
  }:
    {
      refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>
      productArr: Parameters<typeof Table>[0]["productList"]
      profilePram: Parameters<typeof Profile>[0]["profileData"]
      totalPram: Parameters<typeof Total>[0]
      otherPram: Parameters<typeof Other>[0]
    }
) => {

  const chunkedList = _.chunk(productArr, 12) as typeof productArr[]
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
                <Profile profileData={profilePram} index={index + 1} pageCount={pageCount} />
                <Table productList={chunk} />
              </div>
              <div>
                <Total memoArr={totalPram.memoArr} settlement={totalPram.settlement} />
                <Other
                  quoteRangeArr={otherPram.quoteRangeArr}
                  payInfo={otherPram.payInfo}
                  attn={otherPram.attn}
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
  {
    refPdf,
    productArr,
    profilePram,
    totalPram,
    otherPram,
  }:
    {
      refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>
      productArr: (Parameters<typeof Table>[0]["productList"][number] & { series: string })[]
      profilePram: Parameters<typeof Profile>[0]["profileData"]
      totalPram: Parameters<typeof Total>[0]
      otherPram: Parameters<typeof Other>[0]
    }
) => {

  const chunkedList = _.chunk(productArr, 40) as typeof productArr[]
  const pageCount = chunkedList.length + 1
  // --------------------------------------------------------------------------

  // 根據series(門型類型)分類，計算樘數、總單價金額、總複價功能
  const quoteTypeSumObj: TquoteTypeSumList = {}
  productArr.forEach((prod) => {
    const { series, qty, unitPrice, priceTotal } = prod
    const key = series
    if (!quoteTypeSumObj[key]) quoteTypeSumObj[key] = {
      series: series,
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
          <Profile profileData={profilePram} index={1} pageCount={pageCount} />
          <Table_quoteTypeSum quoteTypeSumArr={quoteTypeSumArr} />
        </div>
        <div>
          <Total memoArr={totalPram.memoArr} settlement={totalPram.settlement} />
          <Other
            quoteRangeArr={otherPram.quoteRangeArr}
            payInfo={otherPram.payInfo}
            attn={otherPram.attn} />
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
              <Profile profileData={profilePram} index={index + 2} pageCount={pageCount} />
              <Table productList={chunk} />
            </div>
          </Fragment>
        )
      })}
    </>
  )
}

// ========================================================================