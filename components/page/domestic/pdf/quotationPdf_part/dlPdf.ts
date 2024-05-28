import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

const dlPdf = async ({
  //
  refPdf,
  quotationNumber,
}: {
  refPdf: React.MutableRefObject<(HTMLDivElement | null)[]>;
  quotationNumber: string;
}) => {
  if (!refPdf.current[0]) {
    return;
  }

  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF('p', 'px', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;
  let item;

  for (item of refPdf.current) {
    if (!item) {
      continue;
    }

    const image = await html2canvas(item, {
      scale: 3,
    }).then((canvas) => {
      const image = canvas.toDataURL('image/JPEG');

      return image;
    });

    if (!isFirst) {
      doc.addPage();
    }

    isFirst = false;
    // 留作參考
    // doc.addImage(image, "JPEG", 0, 0, 595, 842);
    // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
    doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
  }

  doc.save(`${quotationNumber}.pdf`);
  showRootLoading(false);
};

export { dlPdf };
