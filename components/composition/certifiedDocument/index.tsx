// 證明文件

import { useEffect } from 'react';
import { useRouter } from 'next/router';

// conmponent
import CertifiedDocumentList from './certifiedDocumentList';

export default function CertifiedDocument() {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    return () => {
      const query_copy = { ...query };
      delete query_copy.documentType;
      router.push({
        query: query_copy,
      });
    };
  }, []);

  return (
    <div className="ml-20">
      <CertifiedDocumentList />
    </div>
  );
}
