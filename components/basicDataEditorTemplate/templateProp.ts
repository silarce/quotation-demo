import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

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

export type { TinputSelProps_key, TemplateProps };
