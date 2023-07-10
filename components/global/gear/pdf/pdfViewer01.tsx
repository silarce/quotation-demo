import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// css
import style from './pdfViewer.module.scss';

export default function PdfViewer01({
  pdfSrc,
  fileName,
  closeModal,
  className = '',
}: {
  pdfSrc: string;
  fileName: string;
  closeModal: () => void;
  className?: string;
}) {
  // defaultLayoutPlugin是hook
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // 如果哪天workerUrl出問題，查看下面網址
  // https://react-pdf-viewer.dev/docs/basic-usage/

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/legacy/build/pdf.worker.js">
      <div className={`${style.pdfViewer01} ${className}`}>
        <div className={style.panelBar}>
          <div>{fileName}</div>
          <button onClick={closeModal}>Close</button>
        </div>

        <div className={style.viewerWrapper}>
          <Viewer fileUrl={pdfSrc} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </div>
    </Worker>
  );
}
