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
// ______________________________________________________
// ______________________________________________________

type rawDataItem = string | number | boolean | null;

type TrawData = {
  [key: string]: rawDataItem | rawDataItem[];
};

type TrawData_primitive = {
  [key: string]: rawDataItem;
};

type rawData_table = {
  [key: string]: rawDataItem[];
};

// ______________________________________________________
// ______________________________________________________

type TinputSelDict = {
  [key: string]: TinputSelProps_key;
};

// ______________________________________________________
// ______________________________________________________

type Tstate = string | boolean | Moment | null | undefined;
type TstateList = {
  [key: string]: Tstate;
};

type TtableStateList = {
  [key: string]: TstateList;
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
  const { inputSelItemDict, locale, tables } = templateModelProps;

  // ----------------------------------------------------------------

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

  // 已將原始值與陣列值分開，接著要對陣列值建立state

  // ----------------------------------------------------------------

  const defaultState = useDefaultState({ rowData_primitive, inputSelItemDict });

  // ----------------------------------------------------------------
  const [disabled, setDisabled] = useState(!id);
  const [stateList, setStateList] = useState<TstateList>(defaultState);

  // ----------------------------------------------------------------

  // MARK:inputSelDict
  const inputSelDict = useMemo(() => {
    const inputSelDict: TinputSelDict = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      // if (key !== item.key) {
      //   myAlert.err({ title: 'useInputSel錯誤', content: `key與item.key不同` });
      // }

      const value = stateList[key];

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
      const inputProps = input && createInput({ value, input, key, setState: setStateList });
      const selectProps = select && createSelect({ value, select, key, setState: setStateList, locale });
      const textareaProps = textarea && createTextareaProps({ value, textarea, key, setState: setStateList });
      const datePickerProps = datePicker && createDatePickerProps({ value, datePicker, key, setState: setStateList });

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
  }, [inputSelItemDict, stateList, locale, disabled]);

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
      sections = {},
      tables = {},
      ...rest
    } = teamplateProps_pre;

    const titleArr_locale = (locale?.titles ?? {}) as NonNullable<Locale['titles']>;
    Object.entries(titles).forEach(([key, title]) => {
      titles[key] = titleArr_locale[key] || title;
    });

    // ________________________________________________________________
    // ________________________________________________________________

    const sectionDict: {
      [
        blockCode: string // a, b, c, ...
      ]: TinputSelProps_key[];
    } = {};

    Object.entries(sections).forEach(([key, indexArr]) => {
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

    // ________________________________________________________________
    // ________________________________________________________________

    // ________________________________________________________________
    // ________________________________________________________________

    const templateProps: TemplateProps = {
      ...rest,
      titles,
      sections: {
        ...sectionDict,
      },
      // tables: {},
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
      stateList: stateList,
    });
  };

  const switchDisabled = (bool?: boolean) => {
    setDisabled((prev) => {
      if (bool) {
        return bool;
      }

      return !prev;
    });
  };

  // ----------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setStateList(defaultState);
  }, [defaultState]);

  useEffect(() => {
    disabled && setStateList(defaultState);
  }, [disabled]);

  // ----------------------------------------------------------------
  return {
    Template,
    templateProps,
    disabled,
    switchDisabled,
    //
    stateList,
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

const stateToBody = ({
  inputSelItemDict,
  stateList,
}: {
  inputSelItemDict: InputSelItemDict;
  stateList: TstateList;
}) => {
  const body = Object.entries(inputSelItemDict).reduce((body, [key, item]) => {
    const stateValue = stateList[key];
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
  }, {} as TrawData_primitive);

  return body;
};

// ===========================================================================

// MARK:useDefaultState
const useDefaultState = ({
  rowData_primitive,
  inputSelItemDict,
}: {
  rowData_primitive: TrawData_primitive | undefined | null;
  inputSelItemDict: InputSelItemDict;
}) => {
  return useMemo(() => {
    const defaultState: TstateList = {};

    Object.entries(inputSelItemDict).forEach(([key, item]) => {
      const rawValue = rowData_primitive?.[key] || null;

      let value: Tstate = null;

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
  }, [rowData_primitive, inputSelItemDict]);
};

// ===========================================================================

// region CREATE

const createNode = ({ value, span }: { value: Tstate; span: NonNullable<InputSelItem['span']> }) => {
  const cookedValue = value as string | number | boolean;

  return <span style={span.style}>{cookedValue}</span>;
};

const createInput = ({
  value,
  input,
  key,
  setState,
}: {
  value: Tstate;
  input: NonNullable<InputSelItem['input']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<TstateList>>;
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
  value: Tstate;
  select: NonNullable<InputSelItem['select']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<TstateList>>;
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

        const theRest = copy as { [key: string]: Tstate };

        setState((prev) => {
          return {
            ...prev,
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
  value: Tstate;
  textarea: NonNullable<InputSelItem['textarea']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<TstateList>>;
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
  value: Tstate;
  datePicker: NonNullable<InputSelItem['datePicker']>;
  key: string;
  setState: React.Dispatch<React.SetStateAction<TstateList>>;
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
