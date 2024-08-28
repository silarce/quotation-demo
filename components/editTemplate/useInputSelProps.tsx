import { useState, useMemo, useEffect } from 'react';
import { Moment } from 'moment';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { InputSelItemDict, InputSelItem, TinputSelProps } from './modelType';
import i18n from 'hooks/i18n';

type Tdict = {
  [key: string]: TinputSelProps;
};

type Tvalue = string | number | boolean | Moment | null;
type Tstate = {
  [key: string]: Tvalue;
};

// ===========================================================================

const useInputSel = ({ inputSelItemDict }: { inputSelItemDict: InputSelItemDict }) => {
  const [state, setState] = useState<Tstate>({});
  const language = i18n.language;

  const dict = {};

  Object.entries(inputSelItemDict).forEach(([key, item]) => {
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

    const inputSelProps: TinputSelProps = {
      ...rest,
      caption,
      node,
    };
  });
};

// ===========================================================================

const createNode = ({ value, span }: { value: Tvalue; span: NonNullable<InputSelItem['span']> }) => {
  const cookedValue = value as string | number | boolean;

  return <span style={span.style}>{cookedValue}</span>;
};

const checkValueValid = (value: Tvalue, item: InputSelItem) => {
  let valueType: 'string' | 'number' | 'boolean' | 'Moment' | 'null';

  const { span, input, textarea, select, datePicker, checkBox, radio } = item;

  if (span) {
  }
};
