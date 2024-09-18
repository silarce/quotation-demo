# sanjeou-erp-fe
三久ERP 前端



node.js版本為20.13.1



不完備的元件使用說明
---
1.在antd的Radio或Checkbox的className加入originalDisabledStyle就可以取消自訂樣式而使用原本的antd disabled樣式
樣式寫在 styles/globals.scss


QA
---
Q1.
為什麼無法用滑鼠滾輪改變input的數字?
A1.
inputSel_v2的input元件有做blurOnWheel，避免在滾動滾輪時意外的改變了值
components/global/gear/inputAndSel_v2/cog/input.tsx

Q2.
為什麼我新增了語系文件卻沒有效果?
A2.
還需要去 hooks/i18n.ts 引入、設置語系文件