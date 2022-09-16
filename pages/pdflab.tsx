import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("../components/pdf-viewer"), {
  ssr: false
});

// import PDFViewer from "components/pdf-viewer";

export default function PdfLab() {
  return (
    <PDFViewer />
  )
}