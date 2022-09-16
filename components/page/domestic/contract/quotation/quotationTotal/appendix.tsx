import {
  ChangeEvent
  , useState
} from "react"

import dynamic from "next/dynamic";

// antd
import { Image } from 'antd';

// global gear
const PdfViewer01 = dynamic(() => import("components/global/gear/pdf/pdfViewer01"))
import { ModalInfo } from "components/global/gear/modal/simpleModal/alertModals";

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"
import iconAttacth from "public/image/icon/attach.svg"
// css
import styleL from "./local.module.scss"

// type
type TimgList = {
  fileType: string
  fileName: string
  fileSrc: string
}[]



export default function Appendix({ disabled }:
  { disabled: boolean }) {

  const [fileList, setFileList] = useState<TimgList>([])

  const removeFile = (index: number) => {
    fileList.splice(index, 1)
    setFileList([...fileList])
  }


  const preloadImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const imageReg = /^image/
    const pdfReg = /pdf$/

    const file = e.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) return
      if (typeof e.target.result !== "string") return
      const { name: fileName, type } = file
      const fileType =
        imageReg.test(type) ? "image"
          : pdfReg.test(type) ? "pdf" : "other"
      const fileSrc = e.target.result || ""

      if (fileType === "other") {
        console.log(fileType)
        return ModalInfo("只能上傳圖片或pdf")
      }
      
      fileList.push({
        fileType,
        fileName,
        fileSrc
      })
      setFileList([...fileList])
    }
  }

  // =========================================================
  // modal switch
  const [showModal, setShowModal] = useState(-1)
  const closeModal = () => {
    setShowModal(-1)
  }

  return (
    <div className={`${styleL.appendix} ${styleL.listContainer} `}>
      <p>附件</p>
      {fileList.map((item, index) => {
        const { fileType, fileName, fileSrc, } = item

        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => removeFile(index)} />}
            <span className={styleL.serialNumber}>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconAttacth.src} alt="" />
            </span>
            {/* <span className={styleL.serialNumber}>{index + 1}</span> */}
            <span className={styleL.fileName}
              onClick={() => setShowModal(index)}>{fileName}</span>
            {fileType === "pdf" && showModal === index &&
              <PdfViewer01 pdfSrc={fileSrc} fileName={fileName}
                closeModal={closeModal} />
            }
            {fileType === "image" &&
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image
                rootClassName={styleL.antdImage}
                style={{ display: 'none' }}
                src={fileSrc as string}
                preview={{
                  visible: showModal === index,
                  onVisibleChange: () => {
                    setShowModal(-1);
                  },
                  mask: null,
                }}
              />
            }
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













