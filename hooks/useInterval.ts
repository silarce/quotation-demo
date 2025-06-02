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
    stop = false,
  }: {
    interval?: number;
    immediate?: boolean;
    onError?: (e: Error) => void;
    stop?: boolean;
  } = {}
) => {
  // 為了使fuc更新時不會因為範疇不同導致執行舊的fuc
  const ref_fuc = useRef(fuc);
  ref_fuc.current = fuc;

  const ref_stop = useRef(stop);
  ref_stop.current = stop;

  const run = () => {
    if (ref_stop.current) {
      return;
    }

    ref_fuc.current();
  };

  useEffect(() => {
    if (immediate) {
      try {
        run();
      } catch (e) {
        onError(e as Error);
      }
    }
  }, [stop, immediate]);

  useEffect(() => {
    const intervalToken = setInterval(() => {
      try {
        run();
      } catch (e) {
        onError(e as Error);
        clearInterval(intervalToken);
      }
    }, interval);

    return () => {
      clearInterval(intervalToken);
    };
  }, [interval, stop]);
};

export { useInterval };
