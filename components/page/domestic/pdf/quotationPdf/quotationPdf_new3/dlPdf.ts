import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

// global gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

const dlPdf = async ({
  ref_pdf,
  fileName,
}: {
  ref_pdf: React.MutableRefObject<HTMLDivElement[]>;
  fileName: string;
}) => {
  if (!ref_pdf.current[0]) {
    return;
  }

  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF('p', 'px', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;
  let item;

  for (item of ref_pdf.current) {
    if (!item) {
      continue;
    }

    // =====================================================
    const image = await html2canvas(item, {
      scale: 3,
      // 關於cookie的問題，這三個都沒用
      // useCORS: true,
      // allowTaint: true,
      // credentials: true,
    }).then((canvas) => {
      const image = canvas.toDataURL('image/JPEG');

      return image;
    });

    // =====================================================
    if (!isFirst) {
      doc.addPage();
    }

    isFirst = false;
    // 留作參考
    // doc.addImage(image, "JPEG", 0, 0, 595, 842);
    // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
    doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
  }

  const today = dayjs().format('YYYY-MM-DD');
  doc.save(`${fileName}_${today}.pdf`);
  showRootLoading(false);
};

export { dlPdf };
