import { useState, useMemo, useEffect } from 'react';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
// type
import type {
  TemplateModelProps,
  TemplateIngredients,
  InputSelItemDict,
  InputSelItem,
  Ttables,
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
} from './types';

// ==============================================================================

type Tstate_table = {
  [key: string]: {
    [key: string]: Tstate;
  }[];
};

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
  tables,
  locale,
  disabled,
}: {
  rawData_table: TrawData_tableDict | null;
  templateIngredients: TemplateIngredients;
  tables: Ttables | undefined | null;
  locale: Locale | undefined;
  disabled?: boolean;
}) => {
  const [state_table, setState_table] = useState<Tstate_table>();

  // --------------------------------------------------------------------

  const defaultState_table = useDefaultState({
    rawData_table,
    tables,
  });

  console.log(defaultState_table);

  // --------------------------------------------------------------------

  useEffect(() => {
    setState_table(defaultState_table);
  }, [disabled]);

  // --------------------------------------------------------------------

  return {};
};
// =============================================================================='

const useDefaultState = ({
  //
  rawData_table,
  tables,
}: {
  rawData_table: TrawData_tableDict | null;
  tables: Ttables | undefined | null;
}) => {
  return useMemo(() => {
    if (!rawData_table || !tables) {
      return undefined;
    }

    const defaultState_table: Tstate_table = {};

    Object.entries(tables).forEach(([tableKey, tableSetting]) => {
      const { targetProperty, inputSelItemDict } = tableSetting;

      defaultState_table[targetProperty] = [];
      // const defaultRowArr = defaultState[targetProperty];
      const rawRowArr = rawData_table?.[targetProperty] ?? [];

      defaultState_table[targetProperty] = rawRowArr.map((raw) => {
        const defaultStateList: TstateList = {};

        Object.entries(inputSelItemDict).forEach(([key, itemSetting]) => {
          const rawValue = raw?.[key] || null;
          let value: Tstate = null;

          const { valueType } = itemSetting;

          if (valueType === 'dateString') {
            value = rawValue ? moment(rawValue as string) : null;

            if (value && !value.isValid()) {
              myAlert.err({ title: '建立預設狀態錯誤', content: `${key}不是有效的時間字串` });
            }
          } else if (valueType === 'boolean') {
            value = !!rawValue;
          } else {
            value = String(rawValue ?? '');
          }

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
