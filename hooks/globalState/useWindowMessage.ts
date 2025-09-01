import { useEffect, useState, useRef } from 'react';

// ============================================================================

type Tchannel = string;

interface Tmessage {
  channel: Tchannel;
  content: any;
}

// ============================================================================

const channel_handshake = 'handshake';
const content_handshake = 'ready';

// ============================================================================

// MARK:useMessageReceiver

/**
 * 可帶入泛型M為message的型別
 */
function useMessageReceiver<M>({
  origin_, // origin為保留字，以origin_替代
  channel,
  from,
}: {
  origin_?: string;
  channel: Tchannel;
  from?: Window | null | undefined; // 基本上應該都會是undefied吧
}) {
  const [theOrigin, setTheOrigin] = useState<string>('*');

  const [message, setMessage] = useState<M>();

  const getFrom = () => {
    if (from === undefined) {
      return window.parent;
    } else {
      return from;
    }
  };

  useEffect(() => {
    if (origin_) {
      setTheOrigin(origin_);
    } else if (typeof window !== 'undefined') {
      setTheOrigin(window.location.origin);
    } else {
      setTheOrigin('*');
    }
  }, [origin_]);

  useEffect(() => {
    const from = getFrom();

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== theOrigin) {
        return;
      }

      if (from && event.source !== from) {
        return;
      }

      const data = event.data as Tmessage;

      if (data.channel === channel) {
        setMessage(data.content);
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, [theOrigin, from, channel]);

  useEffect(() => {
    const from = getFrom();

    from?.postMessage(
      {
        channel: channel_handshake,
        content: content_handshake,
      } as Tmessage,
      theOrigin
    );
  }, []);

  const clear = () => setMessage(undefined);

  return { message, clear };
}

// MARK:useMessageSender

function useMessageSender<C>(props: {
  origin_?: string; // origin為保留字，以origin_替代
  channel?: Tchannel;
}) {
  const [theOrigin, setTheOrigin] = useState<string>('*');

  const ref_targetWindow = useRef<Window | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isTargetExist, setIsTargetExist] = useState(false);

  const sendMessage = (content: C, channel?: Tchannel) => {
    ref_targetWindow.current?.postMessage(
      {
        content,
        channel: channel ?? props.channel,
      } as Tmessage,
      theOrigin
    );
  };

  const setTarget = (target: Window | null | undefined) => {
    ref_targetWindow.current = target ?? null;

    if (target) {
      setIsTargetExist(true);

      // setTarget預期會被放在ref函式中
      // 例如 ref={(ele) => { setTarget(ele?.contentWindow); }}
      // 因為react的特性。每一次渲染這個函式都會被呼叫一次
      // 所以要做判斷避免isReady被重設
      if (target !== ref_targetWindow.current) {
        setIsReady(false);
      }
    } else {
      setIsTargetExist(false);
    }
  };

  useEffect(() => {
    if (props.origin_) {
      setTheOrigin(props.origin_);
    } else if (typeof window !== 'undefined') {
      setTheOrigin(window.location.origin);
    } else {
      setTheOrigin('*');
    }
  }, [props.origin_]);

  useEffect(() => {
    console.log('isTargetExist', isTargetExist);

    const target = ref_targetWindow.current;

    if (target === window) {
      alert('不能傳送訊息給自己');
      console.error('target不可以是自己，請不要做 setTarget(window) 這樣的操作');

      return;
    }

    if (!target) {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.source === window) {
        return;
      }

      const data = event.data as Tmessage;

      if (event.origin !== theOrigin) {
        return;
      }

      if (event.source !== target) {
        return;
      }

      if (data.channel === channel_handshake && data.content === content_handshake) {
        setIsReady(true);
        window.removeEventListener('message', onMessage);
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, [isTargetExist, theOrigin]);

  return { sendMessage, isReady, setTarget };
}

// ============================================================================

export { useMessageReceiver, useMessageSender };
