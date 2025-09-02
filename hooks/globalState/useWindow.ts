import { useEffect, useState } from 'react';

// 做這個功能時會用到這個hook
// https://github.com/San-Jeou/sanjeou-erp-fe/issues/1659
const useWindow = () => {
  const [isInIframe, setIsInFrame] = useState(false);

  useEffect(() => {
    const isInIframe = window.self !== window.top;
    setIsInFrame(isInIframe);
  }, []);

  return { isInIframe };
};

export { useWindow };
