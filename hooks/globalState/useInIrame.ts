import { useEffect, useState } from 'react';

interface Tmessage {
  from: string | 'parent' | 'useWindow';
  content: any;
}

// 做這個功能時會用到這個hook
// https://github.com/San-Jeou/sanjeou-erp-fe/issues/1659
const useWindow = () => {
  const [isInIframe, setIsInFrame] = useState(false);
  const [message, setMessage] = useState<any>();

  // ----------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------

  useEffect(() => {
    const isInIframe = window.self !== window.top;
    setIsInFrame(isInIframe);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.from === 'parent') {
        setMessage(event.data.content);
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    window.parent?.postMessage(
      {
        from: 'useWindow',
        content: 'ready',
      } as Tmessage,
      window.location.origin
    );
  }, []);

  useEffect(() => {
    console.log('message', message);
  }, [message]);

  return { isInIframe, message };
};

// ============================================================================
const sendMessage_iframe = (ele: HTMLIFrameElement, content: any) => {
  ele.contentWindow?.postMessage(
    {
      from: 'parent',
      content,
    } as Tmessage,
    window.location.origin
  );
};

const createOnHandShake = (func: () => void) => {
  const onMessage = (event: MessageEvent) => {
    const data = event.data as any;

    if (data.from === 'useWindow' && data.content === 'ready') {
      func();
    }
  };

  return onMessage;
};

export { useWindow, sendMessage_iframe, createOnHandShake };
