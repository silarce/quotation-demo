# sanjeou-erp-fe
三久ERP 前端


QA
---
Q1.
為什麼無法用滑鼠滾輪改變input的數字?
A1.
inputSel_v2的input元件有做blurOnWheel，避免在滾動滾輪時意外的改變了值
components/global/gear/inputAndSel_v2/cog/input.tsx

