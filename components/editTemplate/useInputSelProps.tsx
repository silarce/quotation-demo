import { useState, useMemo, useEffect } from 'react';
import moment, { Moment } from 'moment';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { InputSelItemDict, InputSelItem, TinputSelProps } from './modelType';
import i18n from 'hooks/i18n';

import { Toption } from 'js/utils/options/options';

type TrawData = {
  [key: string]: string | number | boolean | null;
};

interface TinputSelProps_key extends TinputSelProps {
  key: string;
}

type TinputSelDict = {
  [key: string]: TinputSelProps;
};

type Tvalue = string | boolean | Moment | null | undefined;
type Tstate = {
  [key: string]: Tvalue;
};

// ===========================================================================

const useInputSel = ({
  //
  rawData,
  inputSelItemDict,
}: {
  rawData: TrawData;
  inputSelItemDict: InputSelItemDict;
}) => {
  const defaultState = useDefaultState({ rawData, inputSelItemDict });

  const [state, setState] = useState<Tstate>(defaultState);
  const language = i18n.language;

  const inputSelDict = useMemo(() => {
    const inputSelDict: TinputSelDict = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      if (key !== item.key) {
        myAlert.err({ title: 'useInputSel錯誤', content: `key與item.key不同` });
      }

      const value = state[key];

      const {
        valueType,
        // key,
        caption: captionI18n,

        span,
        input,
        textarea,
        select,
        datePicker,
        checkBox,
        radio,

        ...rest
      } = item;

      const caption = captionI18n && (captionI18n[language] || captionI18n['zh-TW']);

      const node = span && createNode({ value, span });
      const inputProps = input && createInput({ value, input, key, setState });
      const selectProps = select && createSelect({ value, select, key, setState });
      const textareaProps = textarea && createTextareaProps({ value, textarea, key, setState });
      const datePickerProps = datePicker && createDatePickerProps({ value, datePicker, key, setState });

      const inputSelProps: TinputSelProps_key = {
        // key, // rest裡面有key
        ...rest,
        caption,
        node,
        inputProps,
        selectProps,
        textareaProps,
        datePickerProps,
      };

      inputSelDict[key] = inputSelProps;
    });

    return inputSelDict;
  }, [state]);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    inputSelDict,
  };
};

// ===========================================================================

const createNode = ({ value, span }: { value: Tvalue; span: NonNullable<InputSelItem['span']> }) => {
  const cookedValue = value as string | number | boolean;

  return <span style={span.style}>{cookedValue}</span>;
};

const createInput = ({
  value,
  input,
  key,
  setState,
}: {
  value: Tvalue;
  input: NonNullable<InputSelItem['input']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}): TinputSelProps['inputProps'] => {
  const { props, ...rest } = input;

  return {
    ...rest,
    props: {
      ...props,
      value: (value ?? '') as string,
      onChange: (e) => {
        setState((prev) => ({
          ...prev,
          [key]: e.target.value,
        }));
      },
    },
  };
};

const createSelect = ({
  value,
  select,
  key,
  setState,
}: {
  value: Tvalue;
  select: NonNullable<InputSelItem['select']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}): TinputSelProps['selectProps'] => {
  const options = (select.props?.options || []) as Toption[];

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
        setState((state) => {
          return {
            ...state,
            [key]: option?.value || '',
          };
        });
      },
    },
  };
};

const createTextareaProps = ({
  value,
  textarea,
  key,
  setState,
}: {
  value: Tvalue;
  textarea: NonNullable<InputSelItem['textarea']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}): TinputSelProps['textareaProps'] => {
  const { props, ...rest } = textarea;

  return {
    ...rest,
    props: {
      ...props,
      value: (value ?? '') as string,
      onChange: (e) => {
        setState((prev) => ({
          ...prev,
          [key]: e.target.value,
        }));
      },
    },
  };
};

const createDatePickerProps = ({
  value,
  datePicker,
  key,
  setState,
}: {
  value: Tvalue;
  datePicker: NonNullable<InputSelItem['datePicker']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}): TinputSelProps['datePickerProps'] => {
  const { props, ...rest } = datePicker;

  return {
    ...rest,
    props: {
      ...props,
      value: value as Moment | null,
      onChange: (date_m) => {
        setState((prev) => ({
          ...prev,
          [key]: date_m,
        }));
      },
    },
  };
};

// ===========================================================================

const useDefaultState = ({ rawData, inputSelItemDict }: { rawData: TrawData; inputSelItemDict: InputSelItemDict }) => {
  return useMemo(() => {
    const defaultState: Tstate = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      const rawValue = rawData[key] || null;
      let value: Tvalue = null;

      const { valueType } = item;

      if (valueType === 'dateString') {
        value = rawValue ? moment(rawValue as string) : null;

        if (value && !value.isValid()) {
          myAlert.err({ title: '建立預設狀態錯誤', content: `${key}不是有效的時間字串` });
        }
      } else if (valueType === 'boolean') {
        value = !!rawValue;
      }

      defaultState[key] = String(value ?? '');
    });

    return defaultState;
  }, [rawData, inputSelItemDict]);
};

export { useInputSel };
export type { TinputSelProps_key, TinputSelDict, Tstate };
