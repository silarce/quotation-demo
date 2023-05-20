import {
  ChangeEvent,
  useState, useEffect
} from "react"
import Link from "next/link";
import classNames from "classnames";

import dynamic from "next/dynamic";


// global gear
const PdfViewer01 = dynamic(() => import("components/global/gear/pdf/pdfViewer01"))
import { ModalInfo } from "components/global/gear/modal/simpleModal/alertModals";

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"
import iconAttacth from "public/image/icon/attach.svg"
// css
import styleL from "./local.module.scss"
import scss from "./appendix_legacy_noReview.module.scss"
// type
export type TattachmentInfo = {
  fileType: string
  fileName: string
  fileSrc: string
  isNew: boolean
  willDelete?: boolean
}



export default function Appendix(
  { disabled, appendixParams }:
    {
      disabled: boolean
      appendixParams: {
        addFile: (file: File) => void
        removeFile: (index: number) => void
        attachmentsInfo: TattachmentInfo[]
      }
    }) {

  const { addFile, removeFile, attachmentsInfo, } = appendixParams

  const [imgInfoArr, setImgInfoArr] = useState<TattachmentInfo[]>(attachmentsInfo)


  useEffect(() => {
    setImgInfoArr(attachmentsInfo)
  }, [attachmentsInfo])

  const removeImgInfo = (index: number) => {
    imgInfoArr.splice(index, 1)
    setImgInfoArr([...imgInfoArr])
    removeFile(index)
  }


  const preloadImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const imageReg = /^image/
    const pdfReg = /pdf$/

    const file = e.target.files[0]

    const { name: fileName, type } = file


    const fileType =
      imageReg.test(type) ? "image"
        : pdfReg.test(type) ? "pdf" : "other"
    if (fileType === "other") {
      console.log(fileType)
      return ModalInfo("只能上傳圖片或pdf")
    }

    const fileSrc = URL.createObjectURL(file);

    imgInfoArr.push({
      fileType,
      fileName,
      fileSrc,
      isNew: true
    })

    addFile(file)
    setImgInfoArr([...imgInfoArr])
  }

  // =========================================================


  return (
    <div className={`${styleL.appendix} ${styleL.listContainer} `}>
      <p>附件</p>
      {imgInfoArr.map((item, index) => {
        const { fileType, fileName, fileSrc, } = item

        return (
          <div key={index} className={classNames(scss.row, scss.rowPlus)}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => removeImgInfo(index)} />}
            <span className={styleL.serialNumber}>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconAttacth.src} alt="" />
            </span>

            <a className={classNames(styleL.fileName, scss.link)} href={fileSrc} download={fileName}>
              {fileName}
            </a>
            {/* <Link className={classNames(styleL.fileName, scss.link)} href={fileSrc}>
              {fileName}
            </Link> */}
          </div>
        )
      })}
      <div>
        {disabled
          ? <span></span>
          : <label htmlFor="uploadImg">
            <input id="uploadImg" type="file" style={{ display: "none" }}
              onChange={preloadImg}
            />
            <IconAddCircle onClick={() => { }} />
          </label>
        }
      </div>

    </div>
  )
}













