import moment, { Moment } from 'moment';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import type { InputSelItem, Option, Locale } from './modelType';
import type {
  //
  Tstate,
  rawDataItem,
  TstateList,
  Tstate_table,
} from './types';
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';

// ==============================================================================

const rawToState = ({
  rawValue,
  valueType,
  key,
}: {
  rawValue: rawDataItem | null;
  valueType: InputSelItem['valueType'];
  key: string;
}) => {
  let value: Tstate = null;

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

  return value;
};

// ==============================================================================

const createNode = ({ value, span }: { value: Tstate; span: NonNullable<InputSelItem['span']> }) => {
  const cookedValue = value as string | number | boolean;

  return <span style={span.style}>{cookedValue}</span>;
};

const createInput = ({
  value,
  input,
  key,
  setState,
  setStateKit_table,
}: {
  value: Tstate;
  input: NonNullable<InputSelItem['input']>;
  key: string;
  setState?: React.Dispatch<React.SetStateAction<TstateList>>;
  setStateKit_table?: {
    setState_table: React.Dispatch<React.SetStateAction<Tstate_table | undefined>>;
    name: string;
    rowIndex: number;
  };
}): TinputSelProps['inputProps'] => {
  const { props, ...rest } = input;

  return {
    ...rest,
    props: {
      ...props,
      value: (value ?? '') as string,
      onChange: (e) => {
        setState &&
          setState((prev) => ({
            ...prev,
            [key]: e.target.value,
          }));

        // _____________________________________________
        if (setStateKit_table) {
          const { setState_table: setState, rowIndex, name } = setStateKit_table;

          setState((prev) => {
            const copy = _.cloneDeep(prev) as Tstate_table;
            copy[name][rowIndex][key] = e.target.value;

            return copy;
          });
        }
      },
    },
  };
};

const createSelect = ({
  value,
  select,
  key,
  locale,
  setState,
  setStateKit_table: setState_table,
}: {
  value: Tstate;
  select: NonNullable<InputSelItem['select']>;
  key: string;
  locale: Locale | undefined;
  setState?: React.Dispatch<React.SetStateAction<TstateList>>;
  setStateKit_table?: {
    setState_table: React.Dispatch<React.SetStateAction<Tstate_table | undefined>>;
    name: string;
    rowIndex: number;
  };
}): TinputSelProps['selectProps'] => {
  const options = (select.props?.options || []) as Toption[];

  const optionDict_locale = locale?.items?.[key].options;

  options?.forEach((option) => {
    const localeLabel = optionDict_locale?.[option.value];
    option.label = localeLabel || option.label || option.value;
  });

  const { props, ...rest } = select;

  const value_option = value
    ? options.find((option) => option.value === value) || {
        value: value as string,
        label: value as string,
      }
    : null;

  return {
    ...rest,
    props: {
      ...props,
      options,
      value: value_option,
      onChange: (option) => {
        const { value, label, ...rest } = option ?? {};

        const copy = _.cloneDeep(rest) as Option;
        Object.entries(copy).forEach(([key, value]) => {
          if (typeof value === 'number') {
            copy[key] = value.toString();
          }
        });

        const theRest = copy as { [key: string]: Tstate };

        setState &&
          setState((prev) => {
            return {
              ...prev,
              ...theRest,
              [key]: value || '',
            };
          });

        // _____________________________________________
        if (setState_table) {
          const { setState_table: setState, name, rowIndex } = setState_table;

          setState((prev) => {
            const copy = _.cloneDeep(prev) as Tstate_table;
            copy[name][rowIndex][key] = value || '';

            return copy;
          });
        }
      },
      //
    },
  };
};

const createTextareaProps = ({
  value,
  textarea,
  key,
  setState,
  setStateKit_table,
}: {
  value: Tstate;
  textarea: NonNullable<InputSelItem['textarea']>;
  key: string;
  setState?: React.Dispatch<React.SetStateAction<TstateList>>;
  setStateKit_table?: {
    setState_table: React.Dispatch<React.SetStateAction<Tstate_table | undefined>>;
    name: string;
    rowIndex: number;
  };
}): TinputSelProps['textareaProps'] => {
  const { props, ...rest } = textarea;

  return {
    ...rest,
    props: {
      ...props,
      value: (value ?? '') as string,
      onChange: (e) => {
        setState &&
          setState((prev) => ({
            ...prev,
            [key]: e.target.value,
          }));

        // _____________________________________________
        if (setStateKit_table) {
          const { setState_table: setState, rowIndex, name } = setStateKit_table;

          setState((prev) => {
            const copy = _.cloneDeep(prev) as Tstate_table;
            copy[name][rowIndex][key] = e.target.value;

            return copy;
          });
        }
      },
    },
  };
};

const createDatePickerProps = ({
  value,
  datePicker,
  key,
  setState,
  setStateKit_table,
}: {
  value: Tstate;
  datePicker: NonNullable<InputSelItem['datePicker']>;
  key: string;
  setState?: React.Dispatch<React.SetStateAction<TstateList>>;
  setStateKit_table?: {
    setState_table: React.Dispatch<React.SetStateAction<Tstate_table | undefined>>;
    name: string;
    rowIndex: number;
  };
}): TinputSelProps['datePickerProps'] => {
  const { props, ...rest } = datePicker;

  return {
    ...rest,
    props: {
      ...props,
      value: value as Moment | null,
      onChange: (date_m) => {
        setState &&
          setState((prev) => ({
            ...prev,
            [key]: date_m,
          }));

        // _____________________________________________
        if (setStateKit_table) {
          const { setState_table: setState, rowIndex, name } = setStateKit_table;

          setState((prev) => {
            const copy = _.cloneDeep(prev) as Tstate_table;
            copy[name][rowIndex][key] = date_m;

            return copy;
          });
        }
      },
    },
  };
};

// ==============================================================================

export {
  createNode,
  createInput,
  createSelect,
  createTextareaProps,
  createDatePickerProps,
  //
  rawToState,
};
