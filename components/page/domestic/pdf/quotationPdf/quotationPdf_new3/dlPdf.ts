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

  // ____________________________________________________________________
  // html2canvas 和 Tailwind CSS 在 CSS 上會有部分衝突，
  // 只要在專案中使用 Tailwind CSS，Tailwind CSS 在 preflight 時會將 img 標籤的 display 屬性設置為 display: block，
  // 這會在 element 中引入一個換行。當然，在 頁面 render 時不會顯示出來。但當使用 html2canvas 將相同的 HTML 轉換為圖片時，這個換行就會會被渲染出來。

  // 解法
  // https://blog.subarya.me/2024/10/18/[html2canvas]%20%E4%BD%BF%E7%94%A8%20html%20%E8%BD%89%E6%88%90%20pdf%20%E6%99%82%E6%8E%A1%E7%9A%84%E5%9D%91/
  // https://github.com/niklasvh/html2canvas/issues/2775#issuecomment-1316356991

  const style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');
  // ____________________________________________________________________

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

  // ____________________________________________________________________
  // 接上面的 tailwind CSS 衝突問題處理
  style.remove();
  // ____________________________________________________________________

  const today = dayjs().format('YYYY-MM-DD');
  doc.save(`${fileName}_${today}.pdf`);
  showRootLoading(false);
};

export { dlPdf };
