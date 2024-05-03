// 證明文件
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';

// conmponent
import CertifiedDocumentList from './certifiedDocumentList';
import Edit from './edit';
import Certificate from './certificate';

// type
import { TdocType, TquotationContractDto } from 'js/api/dtoTypes';

// api
import { useGetContract_id } from 'js/api/api_quotation';

// ======================================================================

type Tquery = {
  documentType?: string;
  editCertifiedDocument?: 'true';
  certifiedDocumentId?: string;
  certificateId?: string;
  contractId?: string | undefined;
};

// ======================================================================

export default function CertifiedDocument({
  onPanelListChange,
  showDocType,
  contractFromParent,
}: {
  onPanelListChange?: (panelList: TpanelList | undefined) => void;
  showDocType?: TdocType[];
  contractFromParent?: TquotationContractDto;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, documentType, editCertifiedDocument, certifiedDocumentId, certificateId } = query;
  const isListShow = !editCertifiedDocument && !certificateId;

  // ---------------------------------------------------------------------------

  const { data: data_contract = contractFromParent, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      // 'certificatedDoc',
      'content.settleProducts',
    ],
  });

  // ---------------------------------------------------------------------------

  const [dynyPanelList, setDynPanelList] = useState<TpanelList | undefined>();

  // ---------------------------------------------------------------------------
  const panelList: TpanelList = useMemo(() => {
    const panelList_list: TpanelList = [
      {
        type: 'myButton',
        label: '新增',
        onClick: () => {
          const query_copy = { ...query };
          // delete query_copy.documentType;

          // router.push({ query });

          router.push({
            query: {
              ...query_copy,
              editCertifiedDocument: 'true',
            },
          });
        },
      },
    ];

    const defaultPanelList = panelList_list;

    return dynyPanelList || defaultPanelList;
  }, [dynyPanelList, query]);

  // ---------------------------------------------------------------------------

  useEffect(() => {
    onPanelListChange?.(panelList);

    return () => {
      onPanelListChange?.(undefined);
    };
  }, [panelList]);

  //
  useEffect(() => {
    return () => {
      const query_copy = { ...query };
      delete query_copy.documentType;
      delete query_copy.editCertifiedDocument;
      delete query_copy.certifiedDocumentId;

      router.replace({
        query: query_copy,
      });
    };
  }, []);

  useEffect(() => {
    if (!contractFromParent) {
      update_contract();
    }
  }, [contractId, contractFromParent]);

  // ---------------------------------------------------------------------------
  return (
    <div className="ml-10 mr-10 pb-10">
      {/*  */}
      {isListShow && <CertifiedDocumentList showDocType={showDocType} />}
      {editCertifiedDocument && (
        <Edit
          //
          className="mt-10"
          onPanelChange={setDynPanelList}
          contract={data_contract}
        />
      )}
      {certificateId && <Certificate onPanelChange={setDynPanelList} />}
    </div>
  );
}
