import { useEffect, useMemo, useState } from 'react';

// 如果需要更多功能，可以考慮直接用 https://www.npmjs.com/package/use-debounce

/**
useMyDebounce用於防抖應用，接收一個值value和一個延遲時間
送入的value更新後，會在延遲時間後才更新回傳的debounceState
以debounceState代替value作為其他hook的依賴，可以達到防抖效果
 */
function useDebounce<T>(value: T, delay: number) {
  const [state, setState] = useState(value);
  const [isBouncing, setIsBouncing] = useState(false);

  const debouncedState = useMemo(() => {
    setIsBouncing(false);

    return state;
  }, [state]);

  useEffect(() => {
    setIsBouncing(true);
    const timeoutToken = setTimeout(() => {
      setState(value);
    }, delay);

    return () => {
      clearTimeout(timeoutToken);
    };
  }, [value, delay]);

  return { debouncedState, isBouncing };
}

export { useDebounce };

// 使用範例，一開始debouncedState會是0
// state更新為5後，debouncedState會在1000ms後更新為5
// 然後用以debouncedState代替state作為其他hook的依賴，

// const useFoo = () => {
//   const [state, setState] = useState(0);
//   const { debouncedState, isBouncing } = useDebounce(state, 1000);

//   const bar = useMemo(() => {
//     // ...一系列消耗效能的運算
//   }, [debouncedState]);

//   useEffect(() => {
//     if (isBouncing) {
//       // do something
//     }
//   }, [isBouncing]);
// };
