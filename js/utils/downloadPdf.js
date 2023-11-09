import $ from 'jquery';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function download() {
  const element = $('#report'); // 這個dom元素是要匯出pdf的div容器

  const w = element.width(); // 獲得該容器的寬

  const h = element.height(); // 獲得該容器的高

  const offsetTop = element.offset().top; // 獲得該容器到文件頂部的距離

  const offsetLeft = element.offset().left; // 獲得該容器到文件最左的距離

  const canvas = document.createElement('canvas');

  let abs = 0;

  const win_i = $(window).width(); // 獲得當前可視視窗的寬度（不包含滾動條）

  const win_o = window.innerWidth; // 獲得當前視窗的寬度（包含滾動條）

  if (win_o > win_i) {
    abs = (win_o - win_i) / 2; // 獲得滾動條長度的一半
  }

  canvas.width = w * 2; // 將畫布寬&&高放大兩倍
  canvas.height = h * 2;
  const context = canvas.getContext('2d');

  context.scale(2, 2);
  context.translate(-offsetLeft - abs, -offsetTop);
  // 這裡預設橫向沒有滾動條的情況，因為offset.left(),有無滾動條的時候存在差值，因此
  // translate的時候，要把這個差值去掉
  html2canvas(element[0]).then(function (canvas) {
    const contentWidth = canvas.width;

    const contentHeight = canvas.height;

    //一頁pdf顯示html頁面生成的canvas高度;
    const pageHeight = (contentWidth / 592.28) * 841.89;

    //未生成pdf的html頁面高度
    let leftHeight = contentHeight;

    //頁面偏移
    let position = 0;

    //a4紙的尺寸[595.28,841.89]，html頁面生成的canvas在pdf中圖片的寬高
    const imgWidth = 595.28;

    const imgHeight = (592.28 / contentWidth) * contentHeight;

    const pageData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF('', 'pt', 'a4');

    //有兩個高度需要區分，一個是html頁面的實際高度，和生成pdf的頁面高度(841.89)
    //當內容未超過pdf一頁顯示的範圍，無需分頁
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // 分頁
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;

        //避免新增空白頁
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save('我的簡歷.pdf');
  });
}
