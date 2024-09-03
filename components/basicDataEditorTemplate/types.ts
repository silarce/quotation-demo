import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { Moment } from 'moment';

// ---------------------------------------------------------------------------

// 這裡是預期會得到的資料型別

type rawDataItem = string | number | boolean | null;

type TrawData_primitive = {
  [key: string]: rawDataItem;
};

type TrawData_table = TrawData_primitive[];

type TrawData = {
  [key: string]: rawDataItem | TrawData_table;
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

// ===========================================================================

interface TinputSelProps_key extends TinputSelProps {
  key: string;
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

  tables?: {
    [tableName: string]: {
      columns: {
        key: string;
        label: string;
        width: string | number;
      }[];
      rows: TinputSelProps_key[];
    };
  };
}

type Ttemplate = React.FC<TemplateProps>;

export type {
  rawDataItem,
  TrawData,
  TrawData_primitive,
  TrawData_table,
  Tstate,
  TrawData_tableDict,
  TstateList,
  //
  TinputSelProps_key,
  TemplateProps,
  Ttemplate,
};
