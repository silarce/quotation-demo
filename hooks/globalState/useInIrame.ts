import { useEffect, useState } from 'react';

// 做這個功能時會用到這個hook
// https://github.com/San-Jeou/sanjeou-erp-fe/issues/1659
const useInFfame = () => {
  const [inIframe, setInFrame] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isInIframe = window.self !== window.top;
      setInFrame(isInIframe);
    }
  }, []);

  return { inIframe };
};

export { useInFfame };
