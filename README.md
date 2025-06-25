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




---
2025-04-25
發現next.js v13.0.4不能配合使用typescript的satisfies語句
似乎是編譯時出了問題，import任意東西進來放進物件中再配合satisfies，該import就會在編譯時無效
所以將next.js更新到13.5.11

例如這樣就會壞掉
import { taxRate } from 'config/config_common';
const foo = {
  a: taxRate,
} satisfies any;

若是在引入後寫下該引入的述句就會正常

例如這樣就會正常
import { taxRate } from 'config/config_common';
taxRate
const foo = {
  a: taxRate,
} satisfies any;

---
2025-04-30
13.2.2降版本到13.2.2

next.js 13.5.11與antd v4搭配時有問題
build時，antd的modal元件會呼叫document.createDocumentFragment
但是document找不到
next.js13.2.2沒有這個問題

---
2025-06-25
升級react、antd、next.js與其他相關套件
@ant-design/icons
antd
next
react
react-dom
react-i18next
@types/react
@types/react-dom
eslint-config-next
react-select

安裝套件
adayjs





