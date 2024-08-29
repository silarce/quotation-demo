import { useState, useMemo, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { TemplateModelProps, InputSelItemDict, InputSelItem, TinputSelProps } from './modelType';
import { useTranslation } from 'react-i18next';

import { Toption } from 'js/utils/options/options';

import { templateLookup, TtemplateProps } from 'components/editTemplate/templateLookup';

import { axi, AxiosError } from 'js/api/_axiosCreator';
import { TapiError } from 'js/api/dtoTypes';

// ===========================================================================

type Tquery = {
  id?: string;
};

type rawDataItem = string | number | boolean | null;

type TrawData = {
  [key: string]: rawDataItem;
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
  // rawData,
  rawData_fromParent,
  templateModelProps,
}: {
  rawData_fromParent?: TrawData;
  templateModelProps: TemplateModelProps;
}) => {
  const {
    i18n: { language },
  } = useTranslation();

  const router = useRouter();
  const { id } = router.query as Tquery;

  // ----------------------------------------------------------------
  const { inputSelItemDict, apiGet, apiPost, apiPatch } = templateModelProps;

  // ----------------------------------------------------------------
  const [rawData, setRawData] = useState<TrawData | null>();

  const defaultState = useDefaultState({ rawData: rawData || rawData_fromParent, inputSelItemDict });

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

  // MARK:Template
  const Template = useMemo(() => {
    const templateName = Object.keys(templateModelProps.template)[0] as keyof typeof templateLookup | undefined;

    const template = (templateName ? templateLookup[templateName] : null) || null;

    return template;
  }, [templateModelProps.template]);

  // ________________________________________________________________
  // ________________________________________________________________

  // MARK:templateProps
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

  // region API

  const reqGet = useCallback(async () => {
    if (!apiGet) {
      return null;
    }

    return axi
      .get<TrawData>(apiGet)
      .then(({ data }) => data)
      .catch((err: AxiosError<TapiError>) => {
        myAlert.err({ title: '取得資料失敗', content: err.response?.data.message ?? err.message });

        return Promise.reject(err);
      });
  }, [apiGet]);

  // _____________________________________________________________________
  // _____________________________________________________________________

  const reqPost = useCallback(async () => {
    if (!apiPost) {
      return null;
    }

    const body = stateToBody({
      inputSelItemDict,
      state,
    });

    return axi
      .post(apiPost, body)
      .then(async ({ data }) => {
        await update();

        return data;
      })
      .catch((err: AxiosError<TapiError>) => {
        myAlert.err({ title: '新增資料失敗', content: err.response?.data.message ?? err.message });
      });
  }, [apiPost, inputSelItemDict, state]);

  // _____________________________________________________________________
  // _____________________________________________________________________

  const reqPatch = useCallback(async () => {
    if (!apiPatch) {
      return null;
    }

    const body = stateToBody({
      inputSelItemDict,
      state,
    });

    return axi
      .patch(apiPatch, body)
      .then(async ({ data }) => {
        await update();

        return data;
      })
      .catch((err: AxiosError<TapiError>) => {
        myAlert.err({ title: '更新資料失敗', content: err.response?.data.message ?? err.message });
      });
  }, [apiPatch, inputSelItemDict, state]);

  // ----------------------------------------------------------------

  // region FUNCTION

  const update = async () => {
    await reqGet().then((res) => {
      setRawData(res);
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

  useEffect(() => {
    if (rawData_fromParent) {
      return;
    }

    update();
  }, [apiGet, rawData_fromParent]);

  // ----------------------------------------------------------------
  return {
    Template,
    templateProps,
    disabled,
    switchDisabled,
    //
    reqPost: id ? null : reqPost,
    reqPatch: id ? reqPatch : null,
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

// endregion CREATE

// ===========================================================================

export { useInputSel };
export type { TinputSelProps_key, TinputSelDict, Tstate };
