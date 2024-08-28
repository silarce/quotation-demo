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

interface Input {
  wrapperStyle?: {
    [property: string]: string; // React.CSSProperties
  };
  props: {
    placeholder?: string;
    type?: 'text' | 'number';
    style?: { [property: string]: string }; // React.CSSProperties
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
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties
  arrowType?: 'red' | 'black';
  props?: {
    options: Option[];
    isSearchable?: boolean;
    placeholder?: string;
  };
}

interface DatePicker {
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties
  showSuffixIcon?: 'always' | 'never' | 'auto';
  props?: {
    placeholder?: string;
    maxDate?: string;
    minDate?: string;
  };
}

interface CheckBox {
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties
  checkBoxPropsArr?: {
    key: string;
    label?: string;
  }[];
  props: {
    name?: string;
  };
}

interface Radio {
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties
  radioPropsArr?: {
    key: string;
    label?: string;
  }[];
  props: {
    name?: string;
  };
}

interface Span {
  style?: { [property: string]: string }; // React.CSSProperties
}

// ============================================================================
interface InputSelItem {
  readonly valueType: 'string' | 'number' | 'dateString' | 'boolean';
  readonly nullable?: boolean;
  readonly key: string; // 唯一值，對應要處理的資料 // 不可以放數字，會出問題
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
  //____________________
  //____________________
  span?: Span;
  input?: Input;
  textarea?: Textarea;
  select?: Select;
  datePicker?: DatePicker;
  checkBox?: CheckBox;
  radio?: Radio;
  InputSelBar?: {
    updateOnChange?: boolean;
    input?: Input;
    textarea?: Textarea;
    select?: Select;
  }[];
}

// type InputSelItemArr = InputSelItem[];
type InputSelItemDict = {
  [key: string]: InputSelItem;
};

interface TemplateModel {
  //
  inputSelItemDict: InputSelItemDict;
  //
  getApi: string;
  postApi: string;
  patchApi: string;
  //

  // 根據template決定用哪一個模板
  // templateName: string;
  template: {
    t01?: {
      a: string[]; // keyArr
    };

    t02?: {
      containerLabel01: string;
      a: string[]; // keyArr
      b: string[]; // keyArr
    };

    t03?: {
      a: string[]; // keyArr
      b: string[]; // keyArr
      c: string[]; // keyArr
    };
  };
  //
}

export type { TemplateModel, InputSelItemDict, InputSelItem, TinputSelProps };
