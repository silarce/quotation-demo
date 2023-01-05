import React, { useRef } from "react"
import html2canvas from 'html2canvas'
import jsPDF from "jspdf"
import ExcelJs from "exceljs";
import Moment from 'moment';

const _ = require("lodash")

// component
import Header from "./header"
import Info from "./info"
import Table from "./table"

// global gear
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// antd
import Modal from "antd/lib/modal/Modal"

// css
import scss from "./quotationPdf_part.module.scss"

// type
import { TuseProfile } from "components/page/domestic/quotation/hook/useProfile"
import { TuseProduct, ProdClass, PartClass } from "components/page/domestic/quotation/hook/useProduct"

export default function QuotationPdf_part(
  { isVisable, onCancel,
    profileState,
    prodState,
  }:
    {
      isVisable: boolean
      onCancel: () => void
      profileState: TuseProfile
      prodState: TuseProduct
    }
) {


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



  const dlExcel = async () => {
    const workbook = new ExcelJs.Workbook();

    const sheetName = profileState.profile.quotationId
    const sheet = workbook.addWorksheet(sheetName)
    sheet.columns = [
      { width: 30, /*font: { size: 16 }*/ }, // 直接在這邊設定font不知道為什麼無效
      { width: 10, }, // 在google試算表裡10被換算為69
      { width: 20, },
      { width: 10, },
      { width: 20, },
      { width: 25, },
      { width: 20, },
    ]
    sheet.columns.forEach((item, index) => item.font = { size: 16 })
    // -----------------------------------------------------------
    const productList = prodState.productList

    let rowCount = 1

    productList.forEach((item, index) => {
      sheet.getRow(rowCount).font = { bold: true, size: 18 }
      sheet.getRow(rowCount + 3).font = { bold: true, size: 18 }

      const { part, allData } = item

      const profileColumns = infoKeyIndex.map((key) => ({ name: infoConfig[key].label }))
      const profileRows = infoKeyIndex.map((key) => allData[key])
      sheet.addTable({
        name: "profile",
        ref: `A${rowCount}`,
        style: {
          showFirstColumn: true
        },
        columns: [{ name: "報價編號" }, ...profileColumns],
        rows: [
          [profileState.profile.quotationId, ...profileRows]
        ]
      })


      const partColumns = keyIndex.map((key) => ({ name: config[key].label }))
      const partRows = part.map((item) => {
        return keyIndex.map((key) => item[key])
      })
      sheet.addTable({
        name: "part",
        ref: `A${rowCount + 3}`,
        style: {
          showFirstColumn: true
        },
        columns: partColumns,
        rows: partRows
      })

      // 這個迭代開始的的row編號 + header佔的row數 + part的數量 + 與下一次迭代的間隔
      rowCount = rowCount + 4 + part.length + 3
    })

    // -----------------------------------------------------------

    await workbook.xlsx.writeBuffer()

    // -----------------------------------------------------------
    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
    // 異步的等待他處理完之後，創建url與連結，觸發下載
    workbook.xlsx.writeBuffer().then((content) => {
      const link = document.createElement("a");
      const blobData = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;"
      });

      const id = profileState.profile.quotationId
      const today = Moment().format("yyyy-MM-DD")
      link.download = `${id}_${today}.xlsx`;
      link.href = URL.createObjectURL(blobData);
      link.click();
      link.remove()
    });

  }

  // -------------------------------------------------------------------------

  const { productList } = prodState
  const chunkedList = _.chunk(productList, 3) as ProdClass[][]
  // const pageCount = chunkedList.length

  // -------------------------------------------------------------------------
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

      <div className={scss.panel} id="">
        <div />
        <div className={scss.panelRight}>
          <button onClick={dlPdf}><span>下載PDF</span></button>
          <button onClick={dlExcel}><span>下載EXCEL</span></button>
        </div>
      </div>


      {chunkedList.map((list, index) => {
        return (
          <div className={scss.pdf} key={index} ref={ele => refPdf.current[0] = ele}>
            {index !== 0 && <hr className={scss.hr} />}
            <Header />
            {list.map((prod, index) => {
              return (
                <div className={scss.part} key={index}>
                  <Info prodAllData={prod.allData} quotationId={quotationId} />
                  <Table prod={prod} />
                </div>
              )
            })}
          </div>
        )
      })}

    </Modal>
  )
}
// ========================================================================

// ==============================================================================
type TinfoKeyIndex =
  keyof
  Pick<
    ProdClass["allData"],
    "project" | "material" | "surface" | "doorType" | "size"
  >
type TinfoConfig = {
  [key in TinfoKeyIndex]: { label: string }
}

const infoKeyIndex: TinfoKeyIndex[] =
  ["project", "material", "surface", "doorType", "size"]
const infoConfig: TinfoConfig = {
  project: { label: "項目" },
  material: { label: "材質" },
  surface: { label: "表面" },
  doorType: { label: "門型" },
  size: { label: "尺寸" },
}





type TkeyIndex =
  keyof
  Pick<
    PartClass,
    "subTypeName" | "material" | "surface" | "unit" | "qty" | "price" | "totalPrice"
  >
type Tconfig = {
  [key in TkeyIndex]: {
    label: string
    style: {
      width: string
      textAlign?: "left" | "center" | "right"
      flex?: string
    }
  }
}

const keyIndex: TkeyIndex[] =
  ["subTypeName", "material", "surface", "unit", "qty", "price", "totalPrice"]


const config: Tconfig = {
  subTypeName: {
    label: "名稱",
    style: {
      width: "300px"
    },
  },
  material: {
    label: "材質",
    style: {
      width: "auto",
      flex: "1"
    },

  },
  surface: {
    label: "表面",
    style: {
      width: "auto",
      flex: "1"
    },

  },
  unit: {
    label: "單位",
    style: {
      width: "80px"
    },

  },
  qty: {
    label: "數量",
    style: {
      width: "100px",
      textAlign: "right",
    },

  },
  price: {
    label: "單價",
    style: {
      width: "120px",
      textAlign: "right",
    },

  },
  totalPrice: {
    label: "金額",
    style: {
      width: "150px",
      textAlign: "right",
    },

  },
}




