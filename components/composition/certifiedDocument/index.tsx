// 證明文件
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';

// conmponent
import CertifiedDocumentList from './certifiedDocumentList';
import Edit from './edit';
import Certificate from './certificate';

type Tquery = {
  documentType?: string;
  editCertifiedDocument?: 'true';
  certifiedDocumentId?: string;
  certificateId?: string;
};

export default function CertifiedDocument({
  onPanelListChange,
}: {
  onPanelListChange: (panelList: TpanelList | undefined) => void;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { documentType, editCertifiedDocument, certifiedDocumentId, certificateId } = query;
  const isListShow = !editCertifiedDocument && !certificateId;

  // ---------------------------------------------------------------------------

  const [dynyPanelList, setDynPanelList] = useState<TpanelList | undefined>();

  // ---------------------------------------------------------------------------

  // 卸載元件時將documentType從query中移除
  useEffect(() => {
    return () => {
      const query_copy = { ...query };
      delete query_copy.documentType;
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
          router.push({
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
    <div className="ml-10 mr-10">
      {/*  */}
      {isListShow && <CertifiedDocumentList />}
      {editCertifiedDocument && <Edit className="mt-10" onPanelChange={setDynPanelList} />}
      {certificateId && <Certificate onPanelChange={setDynPanelList} />}
    </div>
  );
}
