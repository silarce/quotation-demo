import { useState, useMemo, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { TemplateModelProps, InputSelItemDict, InputSelItem, TinputSelProps } from './modelType';
import { useTranslation } from 'react-i18next';

import { Toption } from 'js/utils/options/options';

import { templateLookup, TtemplateProps } from 'components/editTemplate/templateLookup';

// ===========================================================================
type TrawData = {
  [key: string]: string | number | boolean | null;
};

interface TinputSelProps_key extends TinputSelProps {
  key: string;
}

type TinputSelDict = {
  [key: string]: TinputSelProps_key;
};

type Tvalue = string | boolean | Moment | null | undefined;
type Tstate = {
  [key: string]: Tvalue;
};

// ===========================================================================

// MARK:useInputSel

const useInputSel = ({
  rawData,
  templateModelProps,
}: {
  rawData?: TrawData;
  templateModelProps: TemplateModelProps;
}) => {
  const {
    i18n: { language },
  } = useTranslation();

  const { inputSelItemDict } = templateModelProps;

  // ----------------------------------------------------------------
  const defaultState = useDefaultState({ rawData, inputSelItemDict });

  // ----------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [state, setState] = useState<Tstate>(defaultState);

  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  const inputSelDict = useMemo(() => {
    const inputSelDict: TinputSelDict = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      // if (key !== item.key) {
      //   myAlert.err({ title: 'useInputSel錯誤', content: `key與item.key不同` });
      // }

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
        // checkBox,
        // radio,
        // InputSelBar

        ...rest
      } = item;

      const caption = captionI18n && (captionI18n[language] || captionI18n['zh-TW']);

      const node = span && createNode({ value, span });
      const inputProps = input && createInput({ value, input, key, setState });
      const selectProps = select && createSelect({ value, select, key, setState });
      const textareaProps = textarea && createTextareaProps({ value, textarea, key, setState });
      const datePickerProps = datePicker && createDatePickerProps({ value, datePicker, key, setState });

      const inputSelProps: TinputSelProps_key = {
        key,
        showBaseline: 'auto',
        captionColor: 'main',
        fontColor: 'text',

        ...rest,

        disabled,
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
  }, [state, disabled, language]);

  // ________________________________________________________________
  // ________________________________________________________________
  const Template = useMemo(() => {
    const templateName = Object.keys(templateModelProps.template)[0] as keyof typeof templateLookup | undefined;

    const template = (templateName ? templateLookup[templateName] : null) || null;

    return template;
  }, [templateModelProps.template]);

  const templateProps: TtemplateProps = useMemo(() => {
    const teamplateProps_pre = Object.values(templateModelProps.template)[0];

    const { layout, ...rest } = teamplateProps_pre;

    const blockDict: {
      [
        blockCode: string // a, b, c, ...
      ]: TinputSelProps_key[];
    } = {};

    Object.entries(layout).forEach(([key, indexArr]) => {
      const arr = indexArr.map((index) => {
        if (!inputSelDict[index]) {
          console.log(`key與inputSelItemDict不搭配，inputSelDict沒有${index}`);

          return null;
        }

        return inputSelDict[index];
      });

      const filteredArr = arr.filter((item) => !!item) as TinputSelProps_key[];
      blockDict[key] = filteredArr;
    });

    return {
      ...rest,
      ...blockDict,
    };
  }, [templateModelProps.template, inputSelDict]);

  // 這個做法失敗，每一次輸入都會blur
  // const Template = useCallback(() => {
  //   if (!Template_ori) {
  //     return null;
  //   }

  //   return <Template_ori {...templateProps} />;
  // }, [Template_ori, templateProps]);

  // ----------------------------------------------------------------

  const switchDisabled = (bool?: boolean) => {
    setDisabled((state) => {
      if (bool) {
        return bool;
      }

      return !state;
    });
  };

  // ----------------------------------------------------------------

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  useEffect(() => {
    disabled && setState(defaultState);
  }, [disabled]);

  return {
    Template,
    templateProps,
    disabled,
    switchDisabled,

    inputSelDict,
  };
};

// MARK: END

// ===========================================================================
// ===========================================================================
// ===========================================================================
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

const useDefaultState = ({
  rawData,
  inputSelItemDict,
}: {
  rawData: TrawData | undefined;
  inputSelItemDict: InputSelItemDict;
}) => {
  return useMemo(() => {
    const defaultState: Tstate = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      const rawValue = rawData?.[key] || null;

      let value: Tvalue = null;

      const { valueType } = item;

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

      defaultState[key] = value;
    });

    return defaultState;
  }, [rawData, inputSelItemDict]);
};

export { useInputSel };
export type { TinputSelProps_key, TinputSelDict, Tstate };
