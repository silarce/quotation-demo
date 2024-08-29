// Input
// Textarea
// Select
// DatePicker
// CheckBox
// Radio
// 這幾個型別皆是基於inputSel_v2的零組件
// Option則是基於Toption

import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

interface Option {
  value: string;
  label: string;
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
  caption?: {
    [localeCode: string]: string;
    'zh-TW': string;
    en: string;
  };

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

// type InputSelItemArr = InputSelItem[];
type InputSelItemDict = {
  [key: string]: InputSelItem;
};

interface TemplateModelProps {
  //
  inputSelItemDict: InputSelItemDict;
  //
  apiGet?: string; // 取得資料
  apiPost?: string; // 新增資料使用apiPost // 要回應id，用於更新url與資料
  apiPatch?: string; // 更新資料使用apiPatch

  //

  // 根據template決定用哪一個模板
  // templateName: string;
  template: {
    t01?: {
      style?: Tstyle;
      layout: {
        a: string[]; // keyArr
      };
    };

    t02?: {
      style?: Tstyle;
      title01: string;
      layout: {
        a: string[]; // keyArr
        b: string[]; // keyArr
      };
    };

    // t03?: {
    //   style?: Tstyle;
    //   layout: {
    //     a: string[]; // keyArr
    //     b: string[]; // keyArr
    //     c: string[]; // keyArr
    //   };
    // };
  };
  //
}

export type { TemplateModelProps, InputSelItemDict, InputSelItem, TinputSelProps };
