import { useEffect, useState, useRef } from 'react';

type Tchannel = 'parent' | 'useWindow' | 'handshake' | 'iframe';

interface Tmessage {
  channel: Tchannel;
  content: any;
}

// MARK:useMessageReceiver

function useMessageReceiver<C>({
  origin_, // origin為保留字，以origin_替代
  channel,
  from,
}: {
  origin_?: string;
  channel: Tchannel;
  from: Window | null | undefined;
}) {
  const [theOrigin, setTheOrigin] = useState<string>('*');

  const [message, setMessage] = useState<C>();

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
    from?.postMessage(
      {
        channel: 'handshake',
        content: 'ready',
      } as Tmessage,
      theOrigin
    );
  }, []);

  const clear = () => setMessage(undefined);

  return { message, clear };
}

// MARK:useMessageSender

const useMessageSender = (props: {
  origin_?: string; // origin為保留字，以origin_替代
  channel?: Tchannel;
}) => {
  const [theOrigin, setTheOrigin] = useState<string>('*');

  const ref_target = useRef<Window | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isTargetExist, setIsTargetExist] = useState(false);

  const sendMessage = (content: any, channel?: Tchannel) => {
    ref_target.current?.postMessage(
      {
        content,
        channel: channel ?? props.channel,
      } as Tmessage,
      theOrigin
    );
  };

  const setTarget = (target: Window | null) => {
    ref_target.current = target;
    setIsReady(false);

    if (target) {
      setIsTargetExist(true);
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
    const target = ref_target.current;

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

      if (data.channel === 'handshake' && data.content === 'ready') {
        setIsReady(true);
        window.removeEventListener('message', onMessage);
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, [isTargetExist, theOrigin]);

  return { sendMessage, isReady, setTarget };
};

// ============================================================================
// ============================================================================

export { useMessageReceiver, useMessageSender };
