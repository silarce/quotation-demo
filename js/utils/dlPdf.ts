import html2canvas, { Options } from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

// import domtoimage from 'dom-to-image';
// import domtoimage from 'dom-to-image-more';

import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// ==================================================================================================

// ==================================================================================================
// ISO 216 標準紙張尺寸
// https://zh.wikipedia.org/zh-tw/ISO_216
const ISO216Sizes = {
  a3: { short: 297, long: 420 },
  a4: { short: 210, long: 297 },
  a5: { short: 148, long: 210 },

  b4: { short: 250, long: 353 },
  b5: { short: 176, long: 250 },
} as const;

// ==================================================================================================

const dlPdf = async ({
  divElementArr,
  fileName,
  ISO216 = 'a4',
  horizontal = false,
}: {
  divElementArr: (HTMLDivElement | null)[];
  fileName: string;
  ISO216?: string;
  horizontal?: boolean;
}) => {
  showRootLoading(true, '正在處理PDF');

  const doc = new jsPDF(horizontal ? 'l' : 'p', 'px', ISO216);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let isFirst = true;

  for (const ele of divElementArr) {
    if (!ele) {
      continue;
    }

    const image = await html2canvas(ele, {
      scale: 3, // PDF的寬高不會改變，但是會變清楚，檔案也更大
      // useCORS: true,
      // allowTaint: true,
      // ...canvasOptions,
    }).then((canvas) => {
      const image = canvas.toDataURL('image/JPEG');

      return image;
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

/**
 * @deprecated 棄用，改用getIso216Rect
 */
const getA4Rect = ({ scale = 2, horizontal = false }: { scale?: number; horizontal?: boolean } = {}) => {
  let width;
  let height;

  if (!horizontal) {
    width = new Decimal(595).mul(scale).toNumber();
    height = new Decimal(842).mul(scale).toNumber();
  } else {
    width = new Decimal(842).mul(scale).toNumber();
    height = new Decimal(595).mul(scale).toNumber();
  }

  return {
    width,
    height,
  };
};

const getIso216Rect = (
  ISO216: keyof typeof ISO216Sizes,
  { scale = 6, horizontal = false }: { scale?: number; horizontal?: boolean } = {}
) => {
  const size = ISO216Sizes[ISO216];

  const width = horizontal ? size.long : size.short;
  const height = horizontal ? size.short : size.long;

  return {
    width: new Decimal(width).mul(scale).toNumber(),
    height: new Decimal(height).mul(scale).toNumber(),
  };
};

export { dlPdf, calcHeight_a4, getA4Rect, getIso216Rect };
