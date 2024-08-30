import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

interface TinputSelProps_key extends TinputSelProps {
  key: string;
}

interface TemplateProps {
  [optionsForTemplate: string]: any; // 未來給特定模板的property
  // style?: React.CSSProperties;
  style?: { [cssProperty: string]: string };
  titleArr?: string[];
  layout: {
    [sectionName: string]: TinputSelProps_key[]; // keyArr
  };
}

export type { TinputSelProps_key, TemplateProps };
