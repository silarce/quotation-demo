import { useEffect, useCallback } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { Popover } from 'antd';

const useGlobalErrorCatcher = () => {
  const erroEventHandler = useCallback((event: ErrorEvent) => {
    const obj = {
      colno: event.colno,
      lineno: event.lineno,
      filename: event.filename,
      error: {
        message: event.error.message,
        stack: event.error.stack,
      },
    };

    myAlert.notify.error({
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
  return (
    <Popover content={'已複製'} trigger={['click', 'hover']} mouseEnterDelay={999999} mouseLeaveDelay={0}>
      <span className="text-antdBlue-primary cursor-pointer" onClick={onClick}>
        點擊複製錯誤訊息
      </span>
    </Popover>
  );
};

export { useGlobalErrorCatcher };
