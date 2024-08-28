import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTW_common from 'public/locales/zh-TW/common.json';

import en_common from 'public/locales/en/common.json';

// ======================================================================
const zhTW = {
  common: zhTW_common,
};

const en = {
  common: en_common,
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
