import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { Moment } from 'moment';

// ---------------------------------------------------------------------------

// 這裡是預期會得到的資料型別

type TrawDataItem = string | number | boolean | null;

type TrawData_primitive = {
  [key: string]: TrawDataItem;
};

type TrawData_table = TrawData_primitive[];

type TrawData = {
  [key: string]: TrawDataItem | TrawData_table;
};
// ---------------------------------------------------------------------------

// table的資料要整理成這個模樣
type TrawData_tableDict = {
  [key: string]: TrawData_table;
};
// ---------------------------------------------------------------------------

type Tstate = string | boolean | Moment | null | undefined;

type TstateList = {
  [key: string]: Tstate;
};

type Tstate_table = {
  [key: string]: {
    [key: string]: Tstate;
  }[];
};

// ===========================================================================

interface TinputSelProps_key extends TinputSelProps {
  key: string;
}

type TcellDict = {
  [key: string]: TinputSelProps_key;
};

type TgetData = () => { propertyName: string; state: unknown; body: unknown };

interface Ttemplate_table {
  [tableTemplateName: string]: {
    title?: string | undefined | null;
    keyArr: string[];
    columns: {
      [key: string]: {
        label?: string | undefined | null;
        width: React.CSSProperties['width'];
        flex?: React.CSSProperties['flex'];
      };
    };
    // rowArr: TcellDict[];
    // rowArr: {
    //   row: TcellDict[];
    // };
    rowArr: {
      cellDict: TcellDict;
      getData: TgetData;
    }[];
  };
}

interface TemplateProps {
  // [optionsForTemplate: string]: any; // 未來給特定模板的property
  style?: { [cssProperty: string]: string }; // React.CSSProperties
  titles?: {
    [titleName: string]: string;
  };
  sections: {
    [sectionName: string]: TinputSelProps_key[]; // keyArr
  };

  tables?: Ttemplate_table | null;
  tabs_table?: {
    [key: string]: string[];
  };
}

type Ttemplate = React.FC<TemplateProps>;

export type {
  TrawDataItem,
  TrawData,
  TrawData_primitive,
  TrawData_table,
  Tstate,
  TrawData_tableDict,
  TstateList,
  Ttemplate_table,
  TinputSelProps_key,
  TemplateProps,
  Ttemplate,
  TcellDict,
  Tstate_table,
  TgetData,
};
