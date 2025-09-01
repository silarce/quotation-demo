import { useState, useEffect } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useMessageReceiver } from 'hooks/globalState/useWindowMessage';

declare global {
  interface Window {
    forApprove?: {
      editState: () => void;
    };
  }
}

export default function ApproveTest() {
  const { message } = useMessageReceiver<string>({ channel: 'approve' });

  const [state, setState] = useState('');

  const editState = () => {
    const newState = prompt('輸入要傳送的狀態文字', state);
    setState(newState ?? '');
  };

  const testMyAlert = () => {
    myAlert.info({
      title: '測試Model',
    });
  };

  useEffect(() => {
    window.forApprove = {
      editState,
    };

    return () => {
      delete window.forApprove;
    };
  }, []);

  return (
    <div>
      <div>嵌入Iframe測試</div>
      <br />
      <div>MESSAGE:</div>
      <div>{message}</div>
      <br />
      <div>state:</div>
      <div>{state}</div>
      <br />
      <button onClick={testMyAlert}>測試Model</button>
    </div>
  );
}
