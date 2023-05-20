// 報價單
import React, {
  Dispatch, SetStateAction, FocusEvent,
  useState, useRef, useEffect, useMemo,
} from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"
import Image from "next/image"

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"


// components

import QuotationProfile from "components/page/domestic/quotation/quotationProfile_legacyContract"
import QuotationProduction from "components/page/domestic/quotation/quotationProduct_legacyContract"
import QuotationAdditions from "components/page/domestic/quotation/quotationAdditions"
import QuotationTotal from "components/page/domestic/quotation/quotationTotal_legacyContract"
import QuotationSinature from "components/page/domestic/quotation/quotationSinature"

import QuotationPdf from "components/page/domestic/pdf/quotationPdf/quotationPdf_legacyContract"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// icon
import iconUpload from "public/image/icon/upload.svg"

// css
import style from "./quotation.module.scss"
// ========================================================================
import { Class_legacyContract, useLegacyContract } from "hooks/quotation/useLegacyContract"
// ========================================================================
// api
import {
  useLegacyContract_id,
  useLegacyContracts_id_attachments,
  apiPostLegacyContracts,
  apiPatchLegacyContracts_id,
  apiPostLegacyContracts_id_attachments,
  apiDelLegacyContracts_id_attachments
} from "js/api/api_legacy-contract"
import { useCustomers, TapiGetCustomersParams } from "js/api/api_customer"
import { apiGetFileDownload_id } from "js/api/api_file"

// type
import { TattachmentInfo } from "components/page/domestic/quotation/quotationTotal/appendix_legacy"




// ========================================================================
// ========================================================================
// ========================================================================

export default function Quotation() {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return <TheQuotation router={router} />
}

function TheQuotation({ router }: { router: NextRouter }) {

  /**合約id，若為undefined就逮代表為新增合約 */
  const contractId = router.query.contractId as string | undefined

  // --------------------------------------------------------------------------
  const [allowEdit, setAllowEdit] = useState(false)
  // --------------------------------------------------------------------------
  const [page_customer, setPage_customer] = useState(1)
  const [searchCustomerName, setSearchCustomerName] = useState<string>()

  const customerParams: TapiGetCustomersParams = {
    page: page_customer,
    pageSize: 10,
    populate: ["contacts", "types"],
    // filter:{$contains:""},
    filter: { "name": { $contains: searchCustomerName } },
    sort: "customerNumber"
  }

  const {
    data: customerArr, meta: customerMeta,
    update: updateCustomerArr, update_infinite: updateCustomerArr_infinite } = useCustomers(customerParams)

  const getCustomerByPage = () => {
    if (!customerMeta?.hasNextPage) return
    setPage_customer(page => ++page)
  }

  const searchCustomer = (v: string | undefined) => {
    setPage_customer(1)
    if (!v) v = undefined
    setSearchCustomerName(v)
  }

  useEffect(() => {
    (async () => {
      updateCustomerArr()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCustomerName])

  useEffect(() => {
    if (page_customer === 1) return;
    (async () => {
      await updateCustomerArr_infinite()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page_customer])


  // --------------------------------------------------------------------------
  let [legacyContractParams, setLegacyContractParams] = useState({
    populate: ["customer", "products", "additions"],
  })
  const { legacyContract, updateLegacyContract, } = useLegacyContract_id(contractId, legacyContractParams)
  const { attachments, updateAttachments, domain } = useLegacyContracts_id_attachments(contractId)
  const [fileArr, setFileArr] = useState<File[]>([])



  
  const attachmentsInfo: TattachmentInfo[] = useMemo(() => {
    const arr = attachments?.map((item) => {
      const imageReg = /^image/
      const pdfReg = /pdf$/
      const fileType = imageReg.test(item.mime) ? "image"
        : pdfReg.test(item.mime) ? "pdf" : "other"
      return {
        fileType,
        fileName: item.name,
        fileSrc: `${domain}file/download/${item.id}`,
        // fileSrc: `https://gaia.komica.org/00b/src/1684580436003.jpg`,
        isNew: false,
      }
    })
    return arr ?? []
  }, [attachments])




  const { classLegacyContract, rewind } = useLegacyContract(legacyContract)

  const addFile = (file: File) => {
    setFileArr(arr => {
      const arrCopy = [...arr]
      arrCopy.push(file)
      return arrCopy
    })
  }

  const removeFile = (index: number) => {
    setFileArr(arr => {
      const arrCopy = [...arr]
      arrCopy.splice(index, 1)
      return arrCopy
    })
  }

  const appendixParams = {
    attachmentsInfo,
    addFile,
    removeFile,
  }


  const uploadAttachment = async (id: string) => {

    // apiDelLegacyContracts_id_attachments

    // for (const file of fileArr) {
    //   const formData = new FormData
    //   formData.append("file", file)
    //   try {
    //     await apiPostLegacyContracts_id_attachments(id, formData)
    //   }
    //   catch (error) { }
    // }



  }


  useEffect(() => {
    (async () => {
      await Promise.all([
        updateLegacyContract(),
        updateAttachments()
      ])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId])

  // --------------------------------------------------------------------------


  const classSignature = classLegacyContract.classSignature
  const signatureArr = [
    {
      label: "經理",
      signature: classSignature.managerName,
      onChange: (v: string) => { classSignature.managerName = v },
    },
    {
      label: "主管",
      signature: classSignature.supervisorName,
      onChange: (v: string) => { classSignature.supervisorName = v },
    },
    {
      label: "經辦",
      signature: classSignature.operatorName,
      onChange: (v: string) => { classSignature.operatorName = v },
    },
  ]

  useEffect(() => {
    rewind()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit, legacyContract])


  // -----------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false)
  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `報價編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
      onClick: () => { }
    },
    // { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  const panel_editable: TpanelList = [
    {
      type: "redButton", label: "上傳", onClick: async () => {

        const postBody = classLegacyContract.postBody
        if (!postBody) return
        try {
          showRootLoading(true)


          const res =
            contractId
              ? await apiPatchLegacyContracts_id(contractId, classLegacyContract.postBody)
              : await apiPostLegacyContracts(classLegacyContract.postBody)

          showRootLoading(true, "正在上傳附件")
          await uploadAttachment(res.id)

          if (contractId) {
            await Promise.all([
              updateLegacyContract(),
              updateAttachments()
            ])
          }
          else router.push({ query: { contractId: res.id } })

          myAlert.success({ title: "上傳完成" })
        }
        catch { myAlert.err({ title: "上傳失敗" }) }
        finally { showRootLoading(false) }
        setAllowEdit(false)
      }
    },
    { type: "myButton", label: "取消", onClick: () => setAllowEdit(false) },
  ]
  const panel_noEditable: TpanelList = [
    {
      type: "myButton", label: "匯出報價單", img: iconUpload.src,
      onClick: () => setShowPdf(true)
    },
    { type: "myButton", label: "編輯", onClick: () => setAllowEdit(true) },
    // { type: "myButton", label: "送審", onClick: () => alert("送審") },
    { type: "myButton", label: "返回", onClick: () => router.back() },
  ]

  // -----------------------------------------------------------------------
  if (!classLegacyContract) return null
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <SubLayer>

      <PageHeader02 tagList={tagList}
        panelList={allowEdit ? panel_editable : panel_noEditable}
      />

      <div>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile
            classLegacyContract={classLegacyContract}
            classBasicInfo={classLegacyContract.classBasicInfo}
            customerArr={customerArr ?? []}
            customerMeta={customerMeta}
            getCustomerByPage={getCustomerByPage}
            searchCustomer={searchCustomer}
            disabled={!allowEdit} />
          {/*  */}
          <div className={style.switchBar}>
            <div className={style.active}>
              合約項目
            </div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction legacyContract={classLegacyContract} disabled={!allowEdit} />
          {/* 其他設定 */}
          <QuotationAdditions legacyContract={classLegacyContract} disabled={!allowEdit} />
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            legacyContract={classLegacyContract}
            disabled={!allowEdit}
            appendixParams={appendixParams}
          />
          {/* 簽名 */}
          <QuotationSinature
            signatureArr={signatureArr}
            disabled={!allowEdit} />
        </div>
      </div>
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => { setShowPdf(false) }}
        classLegacyContract={classLegacyContract} />

      {/* <img src="https://gaia.komica.org/00b/src/1684580436003.jpg" alt="" /> */}
      {/* <Image
        // crossOrigin="anonymous"
        src="https://sanjeou-erp-be.caprover.credot-web.com/file/download/99c1e51b-6be3-4178-97e3-710d5d5318ed"
        alt="" 
        width={100}
        height={100}
        /> */}
      {/* <img
        // crossOrigin="anonymous"
        src="https://sanjeou-erp-be.caprover.credot-web.com/file/download/99c1e51b-6be3-4178-97e3-710d5d5318ed"
        alt=""
      /> */}

    </SubLayer>
  )
}


// https://sanjeou-erp-be.caprover.credot-web.com/file/download/99c1e51b-6be3-4178-97e3-710d5d5318ed 