import { useState, useMemo, useEffect } from 'react';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  createNode,
  createInput,
  createSelect,
  createTextareaProps,
  createDatePickerProps,
  rawToState,
} from 'components/basicDataEditorTemplate/library';

// type
import type {
  TemplateModelProps,
  TemplateIngredients,
  InputSelItemDict,
  InputSelItem,
  Ttables_inputSelProps,
  Option,
  Locale,
} from './modelType';
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';

import type {
  Tstate,
  TrawData_table,
  rawDataItem,
  TinputSelProps_key,
  TemplateProps,
  TrawData_tableDict,
  TstateList,
  Ttemplate_table,
  TcellDict,
  Tstate_table,
} from './types';

// ==============================================================================

// 範例
// const tableState: Tstate_table = {
//   table1: [
//     { column1: 'value1', column2: 'value2' },
//     { column1: 'value3', column2: 'value4' },
//   ],
//   table2: [
//     { columnA: 'valueA', columnB: 'valueB' },
//     { columnA: 'valueC', columnB: 'valueD' },
//   ],
// };

// ==============================================================================

const useTemplateProps_table = ({
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

      const { inputSelItemDict, columns } = tableProps;

      const rowArr = target_state_table.map((stateList, rowIndex) => {
        const cellDict: TcellDict = {};

        Object.entries(inputSelItemDict).forEach(([key, item]) => {
          const kit = {
            setState_table,
            name: targetTableKey,
            rowIndex: rowIndex,
          };

          const value = stateList[key];

          const {
            valueType,
            // key,
            caption,
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

          // const caption = (locale?.items?.[key]?.caption ?? key) as string;
          const theCaption = caption === undefined ? undefined : locale?.items?.[key]?.caption ?? caption ?? key;

          const node = span && createNode({ value, span });

          const inputProps =
            input &&
            createInput({
              value,
              input,
              key,
              setStateKit_table: kit,
            });
          const selectProps = select && createSelect({ value, select, key, locale, setStateKit_table: kit });
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
            caption: theCaption,
            node,
            inputProps,
            selectProps,
            textareaProps,
            datePickerProps,
          };

          cellDict[key] = inputSelProps;
        });

        return cellDict;
      });

      const columns_locale = _.cloneDeep(columns);

      Object.entries(columns_locale).forEach(([key, colSetting]) => {
        const path = `tables.${targetTableKey}.${key}.columnLabel`;
        const label = _.get(locale, path) ?? key;
        colSetting.label = label;
      });

      // const columns: Ttables_inputSelProps[string]['columns'][string][] = Object.entries(tableProps.columns).map(
      //   ([key, colSetting]) => {
      //     const path = `tables.${targetTableKey}.${key}.columnLabel`;
      //     // const label = locale?.items?.[path]?.caption ?? key;
      //     const label = _.get(locale, path) ?? key;
      //     colSetting.label = label;

      //     return colSetting;
      //   }
      // );

      templateProps_tables[templateTableKey] = {
        rowArr,
        keyArr,
        columns: columns_locale,
      };
      //
    });
    //

    return templateProps_tables;
  }, [disabled, state_table, tables_inputSelProps, templateIngredients.tables]);

  // --------------------------------------------------------------------

  useEffect(() => {
    setState_table(defaultState_table);
  }, [disabled]);

  // --------------------------------------------------------------------

  return {
    templateProps_tables,
    state_table,
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
        const defaultStateList: TstateList = {};

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

export { useTemplateProps_table };
