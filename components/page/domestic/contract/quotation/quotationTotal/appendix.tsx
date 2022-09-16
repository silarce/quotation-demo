import {
  ChangeEvent
  , useState
} from "react"

import dynamic from "next/dynamic";

// antd
import { Image } from 'antd';
// global gear
const PdfModal = dynamic(() => import("components/global/gear/modal/pdfModal/pdfModal"), {
  ssr: false
});

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import styleL from "./local.module.scss"


// type
type TimgList = {
  fileType: string
  fileName: string
  fileSrc: string | File
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
      const fileSrc =
        fileType === "image" ? e.target.result
          : fileType === "pdf" ? file : ""
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

  return (
    <div className={`${styleL.listContainer}`}>
      <p>附件</p>
      {fileList.map((item, index) => {
        const { fileType, fileName, fileSrc, } = item

        return (
          <div key={index}>
            {disabled ?
              <span></span> :
              <IconRemoveCircle onClick={() => removeFile(index)} />}
            <span className={styleL.serialNumber}>{index + 1}</span>
            <span className={styleL.fileName}
              onClick={() => setShowModal(index)}>{fileName}</span>
            {fileType === "pdf" &&
              <PdfModal
                visible={showModal === index}
                onCancel={() => setShowModal(-1)}
                pdfSrc={fileSrc}
              />
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













