import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// composition
import CertifiedDocument from 'components/composition/certifiedDocument';

// api
import { useGetContract_id, useGetContract_id_finalProductItem } from 'js/api/api_quotation';

// ======================================================================

type Tquery = {
  contractId: string | undefined;
  editCertifiedDocument?: 'true' | undefined;
};

// ======================================================================

export default function CertifiedDocument_page() {
  const router = useRouter();
  const { contractId, editCertifiedDocument } = router.query as Tquery;

  // -------------------------------------------------------------------

  const [compositionPanelList, setCompositionDynPanelList] = useState<TpanelList | undefined>();

  // -------------------------------------------------------------------

  const {
    data: contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'content.customer',
      'engineeringContact',
    ],
  });

  // -------------------------------------------------------------------

  useEffect(() => {
    update_contract();
  }, []);

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  return (
    <SubLayer isLoading_subLayer={isFetching_contract}>
      <PageHeader
        showReturnBtn={!editCertifiedDocument}
        panelList={compositionPanelList}
        contractNumber={contract?.engineeringContact?.contractNumber ?? ''}
        contactThatSkipContract={contactThatSkipContract}
      />

      <div>
        <CertifiedDocument
          onPanelListChange={setCompositionDynPanelList}
          showDocType={['保固書', '出廠證明']}
          allowdAddDocType={['保固書', '出廠證明']}
        />
      </div>
    </SubLayer>
  );
}
