import {
  //  useState,
  useEffect,
  useCallback,
} from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  Popover,
  // Progress
} from 'antd';

const useGlobalErrorCatcher = () => {
  const erroEventHandler = useCallback((event: ErrorEvent) => {
    // const errorJson = JSON.stringify(event.error, Object.getOwnPropertyNames(event.error));

    // event幾乎都是不可枚舉property，所以要手動把需要的東西取出來
    const obj = {
      colno: event.colno,
      lineno: event.lineno,
      filename: event.filename,
      // currentTarget: event.currentTarget, // 全都是不可枚舉property，無法取得
      // target: event.target, // 全都是不可枚舉property，無法取得
      error: {
        message: event.error.message,
        stack: event.error.stack,
      },
    };

    myAlert.notify.error({
      // duration: 11,
      message: '發生非預期錯誤',
      description: (
        <ErrorTip
          onClick={() => {
            const objJson = JSON.stringify(obj);
            navigator.clipboard.writeText(objJson);
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    window.removeEventListener('error', erroEventHandler);
    window.addEventListener('error', erroEventHandler);
  }, []);
};

const ErrorTip = ({ onClick }: { onClick: () => void }) => {
  // const [percent, setPercent] = useState(0);

  // useEffect(() => {
  //   percent < 100 && setTimeout(() => setPercent(percent + 1), 100);
  // }, [percent]);

  return (
    <Popover content={'已複製'} trigger={['click', 'hover']} mouseEnterDelay={999999} mouseLeaveDelay={0}>
      <span className="text-antdBlue-primary cursor-pointer" onClick={onClick}>
        點擊複製錯誤訊息
      </span>
      {/* <Progress percent={percent} type="line" showInfo={false} strokeColor="#1890ff" /> */}
    </Popover>
  );
};

export { useGlobalErrorCatcher };
