// Input
// Textarea
// Select
// DatePicker
// CheckBox
// Radio
// 這幾個型別皆是基於inputSel_v2的零組件
// Option則是基於Toption

// ===============================================================================

interface Titles {
  [titleName: string]: string;
}
interface Sections {
  [sectionName: string]: string[]; // keyArr
}
interface Table_template {
  [tableTemplateName: string]: {
    targetTableKey: string; // 指定要置入的Ttables_inputSelProps[string]
    keyArr: string[];
  };
}

type Ttables_inputSelProps = {
  [propertyName: string]: {
    title?: string | null; // 預設值 // 若使用於tab，請確保title在經過i18n後有值，或設好預設值
    inputSelItemDict: InputSelItemDict;
    columns: {
      [key: string]: {
        // 預設值，若有值，找不到語系資料就會帶入預設值，
        // 若是null就不顯示
        label?: string | null;
        width: string | number; // auto | 100px
        flex?: string; // "1" | "none" | "auto"
      };
    };
  };
};

// _______________________________________________________________________
interface TemplateIngredients {
  // [optionsForTemplate: string]: any; // 未來給特定模板的property
  style?: Tstyle;
  // titleArr?: string[]; // 預設值，會被locale替換
  titles?: Titles; // 預設值，會被locale替換
  sections?: Sections;
  tables?: Table_template;
  // tabs_table裡的string對應指定的Table_template[string]
  tabs_table?: {
    [key: string]: string[];
  };
}

interface Locale {
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

interface WholeLocale {
  [key: string]: Locale;
}

// _______________________________________________________________________
interface Option {
  value: string;
  label?: string; // 預設值，不給也不要緊，會被locale替換。若沒有預設值也沒有locale，就用value替代
  [key: string]: string | number | boolean | undefined;
}

type Tstyle = {
  [property: string]: string; // React.CSSProperties
};

interface Input {
  wrapperStyle?: Tstyle;
  props?: {
    placeholder?: string;
    type?: 'text' | 'number';
    style?: Tstyle;
  };
}

interface Textarea {
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties
  allowNewLineByUser?: boolean;
  props?: {
    placeholder?: string;
    maxRows?: number;
    minRows?: number;
    // cacheMeasurements?: boolean;
    style?: { [property: Exclude<string, 'maxHeight' | 'minHeight'>]: string } & { height?: number }; // React.CSSProperties
  };
}

interface Select {
  wrapperStyle?: Tstyle;
  arrowType?: 'red' | 'black';
  props?: {
    options: Option[];
    isSearchable?: boolean;
    placeholder?: string;
  };
}

interface DatePicker {
  wrapperStyle?: Tstyle;
  showSuffixIcon?: 'always' | 'never' | 'auto';
  props?: {
    placeholder?: string;
    maxDate?: string;
    minDate?: string;
  };
}

interface CheckBox {
  wrapperStyle?: Tstyle;
  checkBoxPropsArr?: {
    key: string;
    label?: string;
  }[];
  props?: {
    name?: string;
  };
}

interface Radio {
  wrapperStyle?: Tstyle;
  radioPropsArr?: {
    key: string;
    label?: string;
  }[];
  props?: {
    name?: string;
  };
}

interface Span {
  style?: Tstyle;
}

// ============================================================================
interface InputSelItem {
  readonly valueType: 'string' | 'number' | 'boolean' | 'dateString';
  readonly nullable?: boolean;
  // readonly key: string; // 唯一值，對應要處理的資料 // 不可以放數字，會出問題

  // 為undefined，視為沒有caption
  // 為null，取i8n的值，若沒有值就取key (這個處理好像是多餘的)
  // 為string，視為預設值，取i8n的值，若沒有值就取caption的值
  caption?: string | null;

  // wrapperPreStyle?: 'ps01';
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties

  captionStyle?: { [property: string]: string }; // React.CSSProperties
  captionSize?: '14' | '16' | '18' | '20';
  captionWeight?: '400' | '500' | '600' | '700';
  captionColor?: 'main' | 'sub' | 'text' | 'active';

  fontSize?: '14' | '16' | '18' | '20';
  fontWeight?: '400' | '500' | '600' | '700';
  fontColor?: 'main' | 'sub' | 'text' | 'active';

  showBaseline?: 'invisible' | 'always' | 'auto';
  hrStyle?: { [property: string]: string }; // React.CSSProperties

  isMust?: boolean;
  // isMustPreStyle?: 'minimal';

  suffix?: string | number;
  //____________________
  //____________________
  // updateOnChange?: boolean;

  // reducer?:string[];
  // "decimal a.add.b.mul.c" 解析為 new Decimal(a)['add'](b)['mul'](c)
  // "conditional a===b?c:d" 解析為 a===b?c:d
  // "assignment a=0" 解析為 a=0
  // reducer會長的像這樣
  // [
  //   "decimal a.add.b.mul.c",
  //   "conditional a===b?c:d",
  //   "assignment a=0"
  // ]
  // 或許直接寫表達式字串再用eval執行就好了?
  //
  //
  // decoration?:string[];
  // disabled時對值的修飾
  // 例如"localeString"，執行Number(a).toLocaleString()
  // 例如"prefix $"，執行"$"+a
  // decoration會長的像這樣
  // [
  //   "localeString",
  //   "prefix $"
  // ]
  // 反正後端懂js，直接用表達式字串再用eval執行就好了吧

  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
  // 先不考慮用eval
  //____________________
  //____________________
  span?: Span;
  input?: Input;
  textarea?: Textarea;
  select?: Select;
  datePicker?: DatePicker;
  // checkBox?: CheckBox;
  // radio?: Radio;
  // InputSelBar?: {
  //   updateOnChange?: boolean;
  //   input?: Input;
  //   textarea?: Textarea;
  //   select?: Select;
  // }[];
}

// InputSelItem裝的僅有inputSel的props
interface InputSelItemDict {
  [key: string]: InputSelItem;
}

interface TemplateModelProps {
  //
  // inputSelItemDict與tables
  // 放的是欄位的設定
  // tables中還有columns的設定
  basic: InputSelItemDict; // 欄位資料
  tables?: Ttables_inputSelProps;

  //
  // 根據template決定用哪一個板
  // template只有設定那些欄位要放在哪裡，不管欄位的設定
  template: {
    [templateName: string]: TemplateIngredients;
  };

  // 語系物件
  locale: WholeLocale | undefined;
  localeSrc: string; // 例如 "bankManage" 或 "foo.bar.meow"
}

export type {
  //
  TemplateModelProps,
  InputSelItemDict,
  InputSelItem,
  Ttables_inputSelProps,
  //
  TemplateIngredients,
  //
  Option,
  Locale,
  WholeLocale,
};
