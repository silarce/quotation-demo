import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTW_common from 'public/locales/zh-TW/common.json';
import zhTW_accounting from 'public/locales/zh-TW/accounting.json';
import zhTW_larrysBtn from 'public/locales/zh-TW/larrysBtn.json';

import en_common from 'public/locales/en/common.json';
import en_accounting from 'public/locales/en/accounting.json';
import en_larrysBtn from 'public/locales/en/larrysBtn.json';

// ======================================================================
const zhTW = {
  common: zhTW_common,
  accounting: zhTW_accounting,
  larrysBtn: zhTW_larrysBtn,
};

const en = {
  common: en_common,
  accounting: en_accounting,
  larrysBtn: en_larrysBtn,
};
// ======================================================================

const resources = {
  'zh-TW': zhTW,
  en,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-TW',
  fallbackLng: 'zh-TW',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
