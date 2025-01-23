// import html2canvas, { Options } from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

import domtoimage from 'dom-to-image';
// import domtoimage from 'dom-to-image-more';

import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

const dlPdf = async ({
  //
  divElementArr,
  fileName,
  ISO216 = 'a4',
}: // canvasOptions,
{
  divElementArr: (HTMLDivElement | null)[];
  fileName: string;
  ISO216?: string;
  // canvasOptions?: Partial<Options>;
}) => {
  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF('p', 'px', ISO216);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;

  for (const ele of divElementArr) {
    if (!ele) {
      continue;
    }

    // const image = await html2canvas(ele, {
    //   scale: 3,
    //   // useCORS: true,
    //   // allowTaint: true,
    //   ...canvasOptions,
    // }).then((canvas) => {
    //   const image = canvas.toDataURL('image/JPEG');

    //   return image;
    // });

    // 用toBlob的話input會有border，還不知道怎麼處理
    // const scale = 1.5;
    // const image = await domtoimage
    //   .toBlob(ele, {
    //     width: ele.clientWidth * scale,
    //     height: ele.clientHeight * scale,
    //     style: {
    //       transform: 'scale(' + scale + ')',
    //       transformOrigin: 'top left',
    //     },
    //   })
    //   .then((blob) => {
    //     const imgUrl = URL.createObjectURL(blob);

    //     const img = new Image();

    //     img.src = imgUrl;

    //     return img;
    //   });

    const image = await domtoimage
      .toJpeg(ele, {
        style: {
          background: 'white',
        },
      })
      .then((imgUrl) => {
        const img = new Image();

        img.src = imgUrl;

        return img;
      });

    //
    if (!isFirst) {
      doc.addPage();
    }

    isFirst = false;
    // 留作參考
    // doc.addImage(image, "JPEG", 0, 0, 595, 842);
    // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
    // doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
    doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
  }

  doc.save(`${fileName}.pdf`);
  showRootLoading(false);
};

const calcHeight_a4 = (width: number, { round = true }: { round?: boolean } = {}) => {
  // 210/297 這是width/height的比例

  // const height = width / (210 / 297);
  const height = new Decimal(width).div(210).times(297).toDecimalPlaces(4).toNumber();

  return round ? Math.round(height) : height;

  // return Math.round(width / (210 / 297));
};

export { dlPdf, calcHeight_a4 };
