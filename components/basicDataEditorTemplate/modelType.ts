// Input
// Textarea
// Select
// DatePicker
// CheckBox
// Radio
// 這幾個型別皆是基於inputSel_v2的零組件
// Option則是基於Toption

// ===============================================================================

interface TemplateIngredients {
  // [optionsForTemplate: string]: any; // 未來給特定模板的property
  style?: Tstyle;
  // titleArr?: string[]; // 預設值，會被locale替換
  titles?: {
    [titleName: string]: string;
  }; // 預設值，會被locale替換
  sections?: {
    [sectionName: string]: string[]; // keyArr
  };
}

interface Locale {
  // titles?: string[];
  titles?: {
    [titleName: string]: string;
  };
  items?: {
    [key: string]: {
      caption?: string; // 如果在locale沒有取到值，用key替代
      // suffix?: string; // 有需要時再做吧
      // placeholder?: string; // 有需要時再做吧
      options?: {
        [value: string]: string;
      }; // 考慮到可能會有動態option，改用字典型別。 key為option的value
    };
  };
}

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

interface InputSelItemDict {
  [key: string]: InputSelItem;
}

interface TemplateModelProps {
  inputSelItemDict: InputSelItemDict; // 欄位資料
  locale: Locale | undefined; // 語系物件

  // 根據template決定用哪一個模板
  template: {
    [templateName: string]: TemplateIngredients;

    // 例子
    // t01?: {
    //   style?: Tstyle;
    //   layout: {
    //     a: string[]; // keyArr
    //   };
    // };

    // 例子
    // t02?: {
    //   style?: Tstyle;
    //   titleArr?: string[];
    //   layout: {
    //     a: string[]; // keyArr
    //     b: string[]; // keyArr
    //   };
    // };
  };
  //
}

export type {
  //
  TemplateModelProps,
  InputSelItemDict,
  InputSelItem,
  TemplateIngredients,
  Option,
  Locale,
};
