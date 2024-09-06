import { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';

import {
  createNode,
  createInput,
  createSelect,
  createTextareaProps,
  createDatePickerProps,
  rawToState,
  stateToBody,
  parseLocale,
} from 'components/basicDataEditorTemplate/library';

// type
import type { TemplateIngredients, Ttables_inputSelProps, Locale, Locale_tamplateDoc } from './modelType';

import type {
  TrawData_primitive,
  TinputSelProps_key,
  TrawData_tableDict,
  TstateList,
  Ttemplate_table,
  TcellDict,
  Tstate_table,
} from './types';

// ==============================================================================

const useTemplateProps_tables = ({
  rawData_table,
  templateIngredients,
  tables_inputSelProps,
  locale,
  disabled,
}: {
  rawData_table: TrawData_tableDict | null;
  templateIngredients: TemplateIngredients;
  tables_inputSelProps: Ttables_inputSelProps | undefined | null;
  locale: Locale | undefined;
  disabled?: boolean;
}) => {
  // 這裡面有多個table，以key:value型式儲存
  // table就是{[key: string]: Tstate;}[];
  const [state_table, setState_table] = useState<Tstate_table>();

  // --------------------------------------------------------------------

  const defaultState_table = useDefaultState({
    rawData_table,
    tables: tables_inputSelProps,
  });

  // --------------------------------------------------------------------

  const templateProps_tables = useMemo(() => {
    if (!state_table) {
      return null;
    }

    const templateProps_tables: Ttemplate_table = {};

    Object.entries(templateIngredients.tables ?? {}).forEach(([templateTableKey, setting]) => {
      const {
        targetTableKey,
        // columns,
        keyArr,
      } = setting;

      const target_state_table = state_table[targetTableKey];

      const tableProps = tables_inputSelProps?.[targetTableKey];

      if (!target_state_table || !tableProps) {
        return;
      }

      const row = target_state_table.map((stateList, rowIndex) => {
        const cellDict: TcellDict = {};

        Object.entries(tableProps.inputSelItemDict).forEach(([key, item]) => {
          const kit = {
            setState_table,
            name: targetTableKey,
            rowIndex: rowIndex,
          };

          const value = stateList[key];

          const {
            valueType,
            // key,
            captionSrc: caption,
            span,
            input,
            textarea,
            select,
            datePicker,
            // checkBox,
            // radio,
            // InputSelBar

            ...rest
          } = item;

          const cpation_locale = parseLocale(key, caption, locale) ?? undefined;

          const node = span && createNode({ value, span });

          const inputProps =
            input &&
            createInput({
              value,
              input,
              key,
              setStateKit_table: kit,
            });
          const selectProps =
            select && createSelect({ value, select, key, locale_tamplateDoc: locale, setStateKit_table: kit });
          const textareaProps = textarea && createTextareaProps({ value, textarea, key, setStateKit_table: kit });
          const datePickerProps =
            datePicker && createDatePickerProps({ value, datePicker, key, setStateKit_table: kit });

          const inputSelProps: TinputSelProps_key = {
            key,
            showBaseline: 'auto',
            captionColor: 'main',
            fontColor: 'text',

            ...rest,

            disabled,
            caption: cpation_locale,
            node,
            inputProps,
            selectProps,
            textareaProps,
            datePickerProps,
          };

          cellDict[key] = inputSelProps;
        });

        return {
          cellDict,
          getData: () => ({
            propertyName: targetTableKey,
            index: rowIndex,
            state: stateList,
            body: stateToBody({ stateList, inputSelItemDict: tableProps.inputSelItemDict }),
          }),
        };
      });

      const columns: Ttemplate_table[string]['columns'] = {};
      const columns_locale = _.cloneDeep(tableProps.columns);
      Object.entries(columns_locale).forEach(([key, colSetting]) => {
        let label = colSetting.labelSrc;

        label = parseLocale(key, colSetting.labelSrc, locale);

        columns[key] = {
          label: label,
          width: colSetting.width,
          flex: colSetting.flex,
        };
      });

      const tableTitle_locale = (() => {
        let title = tableProps.titleSrc;

        if (title !== null) {
          title = parseLocale(targetTableKey, title, locale) ?? title;
        }

        return title;
      })();

      templateProps_tables[templateTableKey] = {
        title: tableTitle_locale,
        rowArr: row,
        keyArr,
        columns,
      };
      //
    });
    //

    return templateProps_tables;
  }, [disabled, locale, state_table, tables_inputSelProps, templateIngredients.tables]);

  // --------------------------------------------------------------------

  const getBody = () => {
    if (!state_table || !tables_inputSelProps) {
      return;
    }

    const list: {
      [key: string]: TrawData_primitive[];
    } = {};

    Object.entries(state_table).forEach(([key, table]) => {
      const bodyList = table.map((stateList) =>
        stateToBody({ stateList, inputSelItemDict: tables_inputSelProps[key].inputSelItemDict })
      );

      list[key] = bodyList;
    });

    return list;
  };

  // --------------------------------------------------------------------

  useEffect(() => {
    setState_table(defaultState_table);
  }, [disabled]);

  // --------------------------------------------------------------------

  return {
    templateProps_tables,
    state_table,
    getBody_table: getBody,
  };
};
// =============================================================================='

// MARK:useDefaultState

const useDefaultState = ({
  //
  rawData_table,
  tables,
}: {
  rawData_table: TrawData_tableDict | null;
  tables: Ttables_inputSelProps | undefined | null;
}) => {
  return useMemo(() => {
    if (!rawData_table || !tables) {
      return undefined;
    }

    const defaultState_table: Tstate_table = {};

    Object.entries(tables).forEach(([key, tableSetting]) => {
      const {
        // targetProperty,
        inputSelItemDict,
      } = tableSetting;

      defaultState_table[key] = [];

      const rawRowArr = rawData_table?.[key] ?? [];

      defaultState_table[key] = rawRowArr.map((raw) => {
        // 要注意
        // 無法保證後端會給什麼東西，現在預期是TrawData_primitive
        // 實際上可能會再放物件、陣列之類的東西
        const defaultStateList: TstateList = raw as TstateList;

        Object.entries(inputSelItemDict).forEach(([key, itemSetting]) => {
          const rawValue = raw?.[key] || null;

          const value = rawToState({
            rawValue,
            valueType: itemSetting.valueType,
            key,
          });

          defaultStateList[key] = value;
        });

        return defaultStateList;
      });
    });

    // --------------------------------------------------------------------
    return defaultState_table;
  }, [rawData_table, tables]);
};

export { useTemplateProps_tables as useTemplateProps_table };
