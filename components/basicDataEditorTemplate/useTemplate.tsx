import { useState, useMemo } from 'react';
import _ from 'lodash';

import { useTemplateProps_basic } from './useTemplateProps_basic';
import { useTemplateProps_table } from './useTemplateProps_tables';

import { templateLookup } from 'components/basicDataEditorTemplate/templateLookup';

// type
import type { TemplateModelProps } from './modelType';

import type { TrawData, TrawData_primitive, TrawDataItem, TrawData_table, TrawData_tableDict } from './types';

// i18n
import { useI18nEditTemplate } from 'hooks/globalState/useI18n_editTemplate';
// ==============================================================================

// w =========================================================================
// w =========================================================================
// w =========================================================================
// 如果後端給了欄位之外的值，包括重要的id或其他不相關的任何東西(型別any)
// 目前的方案是
// 通通送進state裡，但是當作沒有這些值，最後再原封不動的輸出回來
// w =========================================================================
// w =========================================================================
// w =========================================================================

const useTemplate = ({
  rawData,
  rawData_additionalTable,
  templateModelProps: templateModelProps_ori,
  isNew,
}: {
  rawData: TrawData | undefined;
  rawData_additionalTable: TrawData_tableDict;
  templateModelProps: TemplateModelProps;
  isNew?: boolean;
}) => {
  // --------------------------------------------------------------------
  const templateModelProps = useMemo(() => _.cloneDeep(templateModelProps_ori), [templateModelProps_ori]);

  const locale = useI18nEditTemplate((state) => state.getTemplateDoc(templateModelProps.localeDocSrc));

  // --------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);

  // --------------------------------------------------------------------

  // 將原始值資料與table用的陣列資料分離
  const { rowData_primitive, rawData_table } = useMemo(() => {
    const rawData_copy = _.cloneDeep(rawData);

    let rawData_tableDict: TrawData_tableDict | null = null;

    if (templateModelProps.tables) {
      rawData_tableDict = {};

      // 依據templateModelProps.tables將要作為陣列的值抽出
      Object.entries(templateModelProps.tables).forEach(([key, { inputSelItemDict }]) => {
        rawData_tableDict![key] = (rawData_copy?.[key] || []) as TrawData_table;
        rawData_copy && delete rawData_copy[key];
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
  const { templateProps_primitive, stateList_basic, getBody_basic } = useTemplateProps_basic({
    rowData_primitive,
    templateIngredients,
    basic: templateModelProps.basic,
    locale,
    disabled,
  });

  const { templateProps_tables, state_table, getBody_table } = useTemplateProps_table({
    rawData_table,
    templateIngredients,
    tables_inputSelProps: templateModelProps.tables,
    locale,
    disabled,
  });

  const { templateProps_tables: templateProps_additionalTables } = useTemplateProps_table({
    rawData_table: rawData_additionalTable,
    templateIngredients,
    tables_inputSelProps: templateModelProps.additionalTables,
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

  const templateProps = {
    ...templateProps_primitive,
    // tables: templateProps_tables,
    tables: { ...templateProps_tables, ...templateProps_additionalTables },
  };

  return {
    Template,
    templateProps,
    disabled,
    switchDisabled,
  };
};

// ==============================================================================

export { useTemplate };
