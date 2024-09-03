import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

type rawDataItem = string | number | boolean | null;

type TrawData = {
  [key: string]: rawDataItem | rawDataItem[];
};

type TrawData_primitive = {
  [key: string]: rawDataItem;
};

type rawData_table = {
  [key: string]: rawDataItem[];
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
  rawData_table,
  //
  TinputSelProps_key,
  TemplateProps,
  Ttemplate,
};
