import { useState, useMemo } from 'react';
import _ from 'lodash';

import { useInputSel } from './useTemplateProps_primitive';

import { templateLookup } from 'components/basicDataEditorTemplate/templateLookup';

// type
import type {
  //
  TemplateModelProps,
  InputSelItemDict,
  InputSelItem,
  // TinputSelProps,
  Option,
  Locale,
} from './modelType';

import type { TrawData, TrawData_primitive, rawDataItem, rawData_table } from './types';
// ==============================================================================

const useTemplate = ({
  rawData,
  templateModelProps,
  isNew,
}: {
  rawData: TrawData | undefined;
  templateModelProps: TemplateModelProps;
  isNew?: boolean;
}) => {
  // --------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);

  // --------------------------------------------------------------------

  const { inputSelItemDict, locale, tables } = templateModelProps;

  // --------------------------------------------------------------------

  const { rowData_primitive, rawData_table } = useMemo(() => {
    const rawData_copy = _.cloneDeep(rawData);

    let rawData_table: rawData_table | null = null;

    if (tables) {
      rawData_table = {};
      const targetPropertyArr = tables && Object.values(tables).map((item) => item.targetProperty);

      targetPropertyArr.forEach((key) => {
        rawData_table![key] = (rawData_copy?.[key] || []) as rawDataItem[];
        rawData_copy && delete rawData_copy[key];
      });
    }

    const rowData_primitive = rawData_copy as TrawData_primitive;

    return { rowData_primitive: rowData_primitive, rawData_table };
  }, [rawData]);

  // --------------------------------------------------------------------

  const Template = useMemo(() => {
    const templateName = Object.keys(templateModelProps.template)[0] as keyof typeof templateLookup | undefined;

    const template = (templateName ? templateLookup[templateName] : null) || null;

    return template;
  }, [templateModelProps.template]);

  const { templateProps, stateList, getBody } = useInputSel({
    rowData_primitive,
    templateModelProps,
    inputSelItemDict,
    locale,
    disabled,
  });

  // --------------------------------------------------------------------

  const switchDisabled = (bool?: boolean) => {
    setDisabled((prev) => {
      if (bool) {
        return bool;
      }

      return !prev;
    });
  };

  // --------------------------------------------------------------------

  return {
    //
    Template,
    templateProps,
    disabled,
    switchDisabled,
    stateList,
    getBody,
  };
};

// ==============================================================================

export { useTemplate };
