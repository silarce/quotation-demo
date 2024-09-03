import { useState, useMemo } from 'react';
import _ from 'lodash';

import { useTemplateProps_primitive } from './useTemplateProps_primitive';
import { useTemplateProps_table } from './useTemplateProps_table';

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

import type { TrawData, TrawData_primitive, rawDataItem, TrawData_table, TrawData_tableDict } from './types';
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

  // 將原始值資料與table用的陣列資料分離
  const { rowData_primitive, rawData_table } = useMemo(() => {
    const rawData_copy = _.cloneDeep(rawData);

    let rawData_tableDict: TrawData_tableDict | null = null;

    if (tables) {
      rawData_tableDict = {};

      Object.values(tables).forEach(({ targetProperty, inputSelItemDict }) => {
        rawData_tableDict![targetProperty] = (rawData_copy?.[targetProperty] || []) as TrawData_table;
        rawData_copy && delete rawData_copy[targetProperty];
      });
    }

    const rowData_primitive = rawData_copy as TrawData_primitive;

    return { rowData_primitive: rowData_primitive, rawData_table: rawData_tableDict };
  }, [rawData, templateModelProps]);

  // --------------------------------------------------------------------

  // 取得模板
  const { Template, templateIngredients } = useMemo(() => {
    const templateName = Object.keys(templateModelProps.template)[0] as keyof typeof templateLookup | undefined;

    const Template = (templateName ? templateLookup[templateName] : null) || null;

    const templateIngredients = templateModelProps.template[Object.keys(templateModelProps.template)[0]];

    return { Template, templateIngredients };
  }, [templateModelProps.template]);

  // --------------------------------------------------------------------
  // 原始值模板參數與狀態
  const { templateProps, stateList, getBody } = useTemplateProps_primitive({
    rowData_primitive,
    templateIngredients,
    inputSelItemDict,
    locale,
    disabled,
  });

  const {} = useTemplateProps_table({
    rawData_table,
    templateIngredients,
    tables,
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
    Template,
    templateProps,
    disabled,
    switchDisabled,
  };
};

// ==============================================================================

export { useTemplate };
