import html2canvas, { Options } from 'html2canvas';
import jsPDF from 'jspdf';

const dlPdf = async ({
  //
  divElementArr,
  fileName,
  ISO216 = 'a4',
  canvasOptions,
}: {
  divElementArr: (HTMLDivElement | null)[];
  fileName: string;
  ISO216?: string;
  canvasOptions?: Partial<Options>;
}) => {
  // showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF('p', 'px', ISO216);
  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;

  for (const ele of divElementArr) {
    if (!ele) {
      continue;
    }

    const image = await html2canvas(ele, {
      scale: 3,
      // useCORS: true,
      // allowTaint: true,
      ...canvasOptions,
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

  doc.save(`${fileName}.pdf`);
  // showRootLoading(false);
};

export { dlPdf };
