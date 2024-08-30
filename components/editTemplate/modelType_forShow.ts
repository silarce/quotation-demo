// Input
// Textarea
// Select
// DatePicker
// CheckBox
// Radio
// 這幾個型別皆是基於inputSel_v2的零組件
// Option則是基於Toption

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

  // 改由送語系參數給後端，後端直接給對應語系的caption
  caption?: string;

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
  suffix?: string | number;

  //____________________
  //____________________
  span?: Span;
  input?: Input;
  textarea?: Textarea;
  select?: Select;
  datePicker?: DatePicker;
  // checkBox radio InputSelBar 這三種欄位還未實作
  // checkBox?: CheckBox;
  // radio?: Radio;
  // InputSelBar?: {
  //   updateOnChange?: boolean;
  //   input?: Input;
  //   textarea?: Textarea;
  //   select?: Select;
  // }[];
}

type InputSelItemDict = {
  [key: string]: InputSelItem;
};

interface TemplateModelProps {
  //
  inputSelItemDict: InputSelItemDict;
  //

  // 根據template決定用哪一個模板
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
  };
  //
}

export type { TemplateModelProps, InputSelItemDict, InputSelItem };
