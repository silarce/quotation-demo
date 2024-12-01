import { memo } from 'react';
import _ from 'lodash';

import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

const InputSel_prod = (props: TinputSelProps) => {
  return <InputSel showBaseline="auto" fontSize="16" {...props} />;
};

const InputSel_prod_memo_select = memo(InputSel_prod, (prev, next) => {
  const { value: _oldValue, options: oldOptions } = prev?.selectProps?.props ?? {};
  const { value: _newValue, options: newOptions } = next?.selectProps?.props ?? {};

  const oldValue = (_oldValue as { value: string } | null)?.value;
  const newValue = (_newValue as { value: string } | null)?.value;

  return oldValue === newValue && _.isEqual(oldOptions, newOptions) && prev.disabled === next.disabled;
});

export { InputSel_prod, InputSel_prod_memo_select };
