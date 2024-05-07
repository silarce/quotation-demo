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
  id?: string | undefined;
  documentType?: string;
  editCertifiedDocument?: 'true';
  certifiedDocumentId?: string;
  showCertificate?: 'true' | undefined;
};

// ======================================================================

export default function CertifiedDocument({
  onPanelListChange,
  showDocType,
}: {
  onPanelListChange?: (panelList: TpanelList | undefined) => void;
  showDocType?: TdocType[];
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: contractId, documentType, editCertifiedDocument, certifiedDocumentId } = query;
  const isListShow = !editCertifiedDocument && !certifiedDocumentId;

  // ---------------------------------------------------------------------------

  const { data: data_contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      // 'certificatedDoc',
      'content.settleProducts',
      'engineeringContact',
    ],
  });

  // ---------------------------------------------------------------------------

  const [dynyPanelList, setDynaPanelList] = useState<TpanelList | undefined>();

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
      // {
      //   type: 'myButton',
      //   label: '開立證明書(test)',
      //   onClick: () => {
      //     router.push({
      //       query: {
      //         certifiedDocumentId: 'fooo',
      //         showCertificate: 'true',
      //       },
      //     });
      //   },
      // },
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
    update_contract();
  }, [contractId]);

  // ---------------------------------------------------------------------------
  return (
    <div className="ml-10 mr-10 pb-10">
      {/*  */}
      {isListShow && <CertifiedDocumentList showDocType={showDocType} contractId={data_contract?.id} />}
      {editCertifiedDocument && (
        <Edit
          //
          className="mt-10"
          onPanelChange={setDynaPanelList}
          contract={data_contract}
        />
      )}
      {!editCertifiedDocument && certifiedDocumentId && <Certificate onPanelChange={setDynaPanelList} />}
    </div>
  );
}
