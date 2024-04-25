// 證明文件
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';

// conmponent
import CertifiedDocumentList from './certifiedDocumentList';
import Edit from './edit';

type Tquery = {
  certifyType?: string;
  editCertifiedDocument?: 'true';
  certifiedDocumentId?: string;
};

export default function CertifiedDocument({
  onPanelListChange,
}: {
  onPanelListChange: (panelList: TpanelList | undefined) => void;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { certifyType, editCertifiedDocument, certifiedDocumentId } = query;
  const isListShow = !editCertifiedDocument;

  // ---------------------------------------------------------------------------

  const [dynyPanelList, setDynPanelList] = useState<TpanelList | undefined>();

  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      const query_copy = { ...query };
      delete query_copy.certifyType;
      router.push({
        query: query_copy,
      });
    };
  }, []);

  const panelList: TpanelList = useMemo(() => {
    const panelList_list: TpanelList = [
      {
        type: 'myButton',
        label: '新增',
        onClick: () => {
          router.replace({
            query: {
              ...query,
              editCertifiedDocument: 'true',
            },
          });
        },
      },
    ];

    const defaultPanelList = panelList_list;

    return dynyPanelList || defaultPanelList;
  }, [dynyPanelList]);

  useEffect(() => {
    onPanelListChange(panelList);

    return () => {
      onPanelListChange(undefined);
    };
  }, [panelList]);

  return (
    <div className="ml-10">
      {/*  */}
      {isListShow && <CertifiedDocumentList />}
      {editCertifiedDocument && <Edit className="mt-10" onPanelChange={setDynPanelList} />}
    </div>
  );
}
