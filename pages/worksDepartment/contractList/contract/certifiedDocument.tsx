import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
// import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// composition
import CertifiedDocument from 'components/composition/certifiedDocument';

// api
import { useGetContract_id } from 'js/api/api_quotation';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

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

  const returnPanel = usePanel_returnWorksDepartmentContractList();

  let panelList: TpanelList = [...(compositionPanelList ?? [])];
  panelList = [...panelList];

  if (!editCertifiedDocument) {
    panelList = [...panelList, ...returnPanel];
  }

  // -------------------------------------------------------------------

  useEffect(() => {
    update_contract();
  }, []);

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  return (
    <SubLayer isLoading_subLayer={isFetching_contract}>
      {/* <PageHeader
        showReturnBtn={!editCertifiedDocument}
        panelList={compositionPanelList}
        contractNumber={contract?.engineeringContact?.contractNumber ?? ''}
        contactThatSkipContract={contactThatSkipContract}
      /> */}

      <div>
        <PageHeader02 panelList={panelList} tag={`合約編號 ${contract?.engineeringContact?.contractNumber ?? ''}`} />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

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
