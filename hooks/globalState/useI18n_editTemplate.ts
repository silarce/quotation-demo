import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// api
// import { apiGetLocale } from '..........';等api完成

// fake i18n
import locale_tw from 'public/locale_tw.json';
import locale_en from 'public/locale_en.json';

// ===========================================================================
interface Locale_tamplateDoc {
  titles?: {
    [titleName: string]: string;
  };
  basic?: {
    [key: string]: {
      caption?: string; // 如果在locale沒有取到值，用key替代
      // suffix?: string; // 有需要時再做吧
      // placeholder?: string; // 有需要時再做吧
      options?: {
        [value: string]: string;
      }; // 考慮到可能會有動態option，改用字典型別。 key為option的value
    };
  };
  tables?: {
    [tableName: string]: {
      title?: string;
      items?: {
        [key: string]: {
          columnLable?: string;
        };
      };
    };
  };
}

interface NestedObject {
  [key: string]: string | undefined | NestedObject;
}

// interface Locale {
//   [key: string]: Locale_tamplateDoc;
// }
type Locale = NestedObject;

interface I18nEditTemplate {
  localeCode: string;
  wholeLocale: Locale | undefined;
  getTemplateDoc: (src: string) => Locale_tamplateDoc | undefined;

  switchLocale: (localeCode: string) => void;
}

// ===========================================================================

const useI18nEditTemplate = create<I18nEditTemplate>()(
  immer((set, get) => ({
    localeCode: '',
    wholeLocale: undefined,
    getTemplateDoc: (src) => {
      const wholeLocale = get().wholeLocale;

      if (!wholeLocale) {
        return undefined;
      }

      return wholeLocale[src] as Locale_tamplateDoc | undefined;
    },

    switchLocale: (localeCode: string) => {
      let localeDoc: Locale | undefined = undefined;

      switch (localeCode) {
        case 'zh-TW':
          localeDoc = locale_tw as Locale;

          break;
        case 'en':
          localeDoc = locale_en as Locale;
          break;

        default:
          localeDoc = undefined;
          break;
      }

      set((state) => {
        state.wholeLocale = localeDoc;
        state.localeCode = localeCode;

        return state;
      });

      // 等api完成要把上面的假資料改為串接api取得資料
      // set((state) => {
      //   state.wholeLocale = undefined;
      // });
    },
  }))
);

export { useI18nEditTemplate };
export type { Locale_tamplateDoc, Locale, I18nEditTemplate };
