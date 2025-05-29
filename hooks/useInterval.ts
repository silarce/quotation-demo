import { useEffect, useRef } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

const useInterval = (
  fuc: () => void,
  {
    interval = 1000,
    immediate = false,
    onError = (e: Error) => {
      console.error(e);
      myAlert.notify.error({ message: 'useInterval回調函式發生錯誤', description: e.message });
    },
  } = {}
) => {
  // 為了使fuc更新時不會因為範疇不同導致執行舊的fuc
  const ref_fuc = useRef(fuc);
  ref_fuc.current = fuc;

  useEffect(() => {
    if (immediate) {
      try {
        ref_fuc.current();
      } catch (e) {
        onError(e as Error);
      }
    }

    const intervalToken = setInterval(() => {
      try {
        ref_fuc.current();
      } catch (e) {
        onError(e as Error);
        clearInterval(intervalToken);
      }
    }, interval);

    return () => {
      clearInterval(intervalToken);
    };
  }, [interval]);
};

export { useInterval };
