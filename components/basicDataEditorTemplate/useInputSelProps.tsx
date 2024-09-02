import { useState, useMemo, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import _ from 'lodash';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TinputSelProps_key, TemplateProps } from './templateProp';

// ===========================================================================

type Tquery = {
  id?: string;
};

type rawDataItem = string | number | boolean | null;

type TrawData = {
  [key: string]: rawDataItem;
};

type Tvalue = string | boolean | Moment | null | undefined;

type Tstate = {
  [key: string]: Tvalue;
};

type TinputSelDict = {
  [key: string]: TinputSelProps_key;
};

// ===========================================================================

// MARK:useInputSel

const useInputSel = ({
  rawData,
  templateModelProps,
}: {
  rawData: TrawData | undefined;
  templateModelProps: TemplateModelProps;
}) => {
  const router = useRouter();
  const { id } = router.query as Tquery;

  // ----------------------------------------------------------------
  const { inputSelItemDict, locale } = templateModelProps;

  // ----------------------------------------------------------------

  const defaultState = useDefaultState({ rawData: rawData, inputSelItemDict });

  // ----------------------------------------------------------------
  const [disabled, setDisabled] = useState(!id);
  const [state, setState] = useState<Tstate>(defaultState);

  // ----------------------------------------------------------------

  // MARK:inputSelDict
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

      const caption = (locale?.items?.[key]?.caption ?? key) as string;

      const node = span && createNode({ value, span });
      const inputProps = input && createInput({ value, input, key, setState });
      const selectProps = select && createSelect({ value, select, key, setState, locale });
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
  }, [inputSelItemDict, state, locale, disabled]);

  // ________________________________________________________________
  // ________________________________________________________________

  // MARK:Template
  const Template = useMemo(() => {
    const templateName = Object.keys(templateModelProps.template)[0] as keyof typeof templateLookup | undefined;

    const template = (templateName ? templateLookup[templateName] : null) || null;

    return template;
  }, [templateModelProps.template]);

  // ________________________________________________________________
  // ________________________________________________________________

  // MARK:templateProps
  const templateProps: TemplateProps = useMemo(() => {
    const teamplateProps_pre = Object.values(templateModelProps.template)[0];

    const {
      //
      titles = {},
      layout = {},
      ...rest
    } = teamplateProps_pre;

    const sectionDict: {
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
      sectionDict[key] = filteredArr;
    });

    const titleArr_locale = (locale?.titles ?? {}) as NonNullable<Locale['titles']>;
    Object.entries(titles).forEach(([key, title]) => {
      titles[key] = titleArr_locale[key] || title;
    });

    const templateProps: TemplateProps = {
      ...rest,
      layout: {
        ...sectionDict,
      },
      titles,
    };

    return templateProps;
  }, [templateModelProps.template, locale, inputSelDict]);

  // 這個做法失敗，每一次輸入都會blur
  // const Template = useCallback(() => {
  //   if (!Template_ori) {
  //     return null;
  //   }

  //   return <Template_ori {...templateProps} />;
  // }, [Template_ori, templateProps]);

  // ----------------------------------------------------------------

  // region FUNCTION

  const getBody = () => {
    return stateToBody({
      inputSelItemDict,
      state,
    });
  };

  const switchDisabled = (bool?: boolean) => {
    setDisabled((state) => {
      if (bool) {
        return bool;
      }

      return !state;
    });
  };

  // ----------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  useEffect(() => {
    disabled && setState(defaultState);
  }, [disabled]);

  // ----------------------------------------------------------------
  return {
    Template,
    templateProps,
    disabled,
    switchDisabled,
    //
    state,
    getBody,
    //
    inputSelDict,
  };
};

// MARK: END

// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

const stateToBody = ({ inputSelItemDict, state }: { inputSelItemDict: InputSelItemDict; state: Tstate }) => {
  const body = Object.entries(inputSelItemDict).reduce((body, [key, item]) => {
    const stateValue = state[key];
    const { valueType, nullable } = item;

    if (nullable && (stateValue === null || stateValue === '' || stateValue === undefined)) {
      body[key] = null;

      return body;
    }

    let value: rawDataItem = null;

    valueType === 'string' && (value = String(stateValue ?? ''));
    valueType === 'number' && (value = Number(stateValue || 0));
    valueType === 'boolean' && (value = !!stateValue);
    valueType === 'dateString' && stateValue instanceof moment && (value = (stateValue as Moment).toISOString());

    body[key] = value;

    return body;
  }, {} as TrawData);

  return body;
};

// ===========================================================================

// MARK:useDefaultState
const useDefaultState = ({
  rawData,
  inputSelItemDict,
}: {
  rawData: TrawData | undefined | null;
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

// ===========================================================================

// region CREATE

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
  locale,
}: {
  value: Tvalue;
  select: NonNullable<InputSelItem['select']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
  locale: TemplateModelProps['locale'];
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

        const theRest = copy as { [key: string]: Tvalue };

        setState((state) => {
          return {
            ...state,
            ...theRest,
            [key]: value || '',
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

// endregion CREATE

// ===========================================================================

export { useInputSel };
