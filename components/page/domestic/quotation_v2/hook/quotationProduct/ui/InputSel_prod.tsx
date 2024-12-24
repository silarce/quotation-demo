// import { memo } from 'react';
// import _ from 'lodash';

import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

const InputSel_prod = (props: TinputSelProps) => {
  if (props.selectProps?.props && !('menuPortalTarget' in props.selectProps.props)) {
    props.selectProps.props.menuPortalTarget = undefined;
  }

  return <InputSel showBaseline="auto" fontSize="16" {...props} />;
};

// const InputSel_prod_memo_select = memo(InputSel_prod, (prev, next) => {
//   const { value: _oldValue, options: oldOptions } = prev?.selectProps?.props ?? {};
//   const { value: _newValue, options: newOptions } = next?.selectProps?.props ?? {};

//   const oldValue = (_oldValue as { value: string } | null)?.value;
//   const newValue = (_newValue as { value: string } | null)?.value;

//   return (
//     oldValue === newValue &&
//     _.isEqual(oldOptions, newOptions) &&
//     prev.disabled === next.disabled &&
//     prev.isFethcing === next.isFethcing // 必須要有isFethcing，否則onChange裡的類會是舊的，執行setter後會覆蓋舊的狀態
//   );
// });

// 生產環境沒有效能問題，不需要使用memo
// 使用memo有一堆問題要考慮，如果可以不用就別自找麻煩了
const InputSel_prod_memo_select = InputSel_prod;

export { InputSel_prod, InputSel_prod_memo_select };
export type { TinputSelProps };
