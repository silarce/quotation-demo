import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from 'public/locales/en/common.json';
import zh_TW from 'public/locales/zh-TW/common.json';

// const resources = {
//   en,
//   'zh-TW': zh_TW,
// };

const resources = {
  'zh-TW': {
    translation: zh_TW,
  },
  en: {
    translation: en,
  },
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
