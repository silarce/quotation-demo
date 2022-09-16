// 這個元件必須要dynamic做import


import { useState } from "react";

// antd
import { Modal } from 'antd';

// // react-pdf
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// css
import style from "./pdfModal.module.scss"


export default function PdfModal({ visible, onCancel, pdfSrc, className = "" }:
  {
    visible: boolean
    onCancel: () => void
    pdfSrc: File | string
    className?: string,
  }) {

  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }:
    { numPages: number }) {
    setNumPages(nextNumPages);
  }
  // ===========================================


  return (
    <Modal
      className={`${style.modal} ${className}`}
      visible={visible}
      onCancel={onCancel}
      centered={true}
      destroyOnClose={true}
      footer={false}
      closable={false}
      width="auto"
    >
      <Document className={style.document}
        file={pdfSrc} onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from({ length: numPages || 0 }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    </Modal>
  )
}






