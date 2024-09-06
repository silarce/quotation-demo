import { useState, useMemo, useEffect } from 'react';

// type
import type { TemplateIngredients, InputSelItemDict, Locale_tamplateDoc } from './modelType';
import type { TrawData_primitive, TinputSelProps_key, TemplateProps, TstateList } from './types';

import {
  createNode,
  createInput,
  createSelect,
  createTextareaProps,
  createDatePickerProps,
  rawToState,
  stateToBody,
} from 'components/basicDataEditorTemplate/library';

// ===========================================================================

type TinputSelDict = {
  [key: string]: TinputSelProps_key;
};

// ===========================================================================

// MARK:useInputSel

const useTemplateProps_basic = ({
  rowData_primitive,
  templateIngredients_section: sections,
  basic: inputSelItemDict,
  locale,
  disabled,
}: {
  rowData_primitive: TrawData_primitive | undefined | null;
  templateIngredients_section: TemplateIngredients['sections'];
  basic: InputSelItemDict;
  locale: Locale_tamplateDoc | undefined;
  disabled: boolean;
}) => {
  // ----------------------------------------------------------------

  const defaultState = useDefaultState({ rowData_primitive, inputSelItemDict });
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

      const theCaption = caption === undefined ? undefined : locale?.basic?.[key]?.caption ?? caption ?? key;

      const node = span && createNode({ value, span });
      const inputProps = input && createInput({ value, input, key, setState: setStateList });
      const selectProps =
        select && createSelect({ value, select, key, setState: setStateList, locale_tamplateDoc: locale });
      const textareaProps = textarea && createTextareaProps({ value, textarea, key, setState: setStateList });
      const datePickerProps = datePicker && createDatePickerProps({ value, datePicker, key, setState: setStateList });

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

      inputSelDict[key] = inputSelProps;
    });

    return inputSelDict;
  }, [inputSelItemDict, stateList, locale, disabled]);

  // ________________________________________________________________
  // ________________________________________________________________

  // MARK:templateProps
  const templateProps_sections: TemplateProps['sections'] = useMemo(() => {
    const sectionDict: {
      [
        blockCode: string // a, b, c, ...
      ]: TinputSelProps_key[];
    } = {};

    Object.entries(sections ?? {}).forEach(([key, indexArr]) => {
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

    const templateProps_sections: TemplateProps['sections'] = sectionDict;

    return templateProps_sections;
  }, [sections, locale, inputSelDict]);

  // ----------------------------------------------------------------

  // region FUNCTION

  const getBody = () => {
    return stateToBody({
      inputSelItemDict,
      stateList: stateList,
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
    templateProps_sections: templateProps_sections,
    stateList_basic: stateList,
    getBody_basic: getBody,
  };
};

// MARK: END

// ===========================================================================
// ===========================================================================
// ===========================================================================
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

    Object.entries(inputSelItemDict).forEach(([key, itemSetting]) => {
      const rawValue = rowData_primitive?.[key] || null;

      const value = rawToState({
        rawValue,
        valueType: itemSetting.valueType,
        key,
      });

      defaultState[key] = value;
    });

    return defaultState;
  }, [rowData_primitive, inputSelItemDict]);
};

// ===========================================================================

export { useTemplateProps_basic };
