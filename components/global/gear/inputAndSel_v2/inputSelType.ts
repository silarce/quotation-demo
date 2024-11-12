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
    cacheMeasurements?: boolean;
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
interface InputSelTemplate {
  key: string; // 唯一值，對應要處理的資料

  wrapperPreStyle?: 'ps01';
  wrapperStyle?: { [property: string]: string }; // React.CSSProperties

  // 基本上由前端i18n處理，依據上面的key取得對應的值。
  // 但若後端有給caption，則直接用caption
  caption?: string;
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
  isMustPreStyle?: 'minimal';

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
  // checkBox?: CheckBox;
  // radio?: Radio;
  InputSelBar?: {
    updateOnChange?: boolean;
    input?: Input;
    textarea?: Textarea;
    select?: Select;
  }[];
}

type InputSelTemplateArr = InputSelTemplate[];
// type InputSelTemplateDir = {
//   [key: string]: InputSelTemplate;
// };

export type { InputSelTemplateArr, InputSelTemplate };
