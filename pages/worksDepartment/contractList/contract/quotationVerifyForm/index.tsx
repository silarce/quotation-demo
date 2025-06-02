import { useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import Nav_worksDepartment from 'components/page/worksDepartment/nav_worksDepartment';

// component
import { ReviewForm } from 'components/composition/contractVerifyForm/contractVerifyForm';

// api
// import { useGetEngineeringContact } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

import { usePanel_returnWorksDepartmentContractList } from 'components/page/worksDepartment/hook/usePanel_returnWorksDepartmentContractList';

// ------------------------------------------------------------------------

type Tquery = {
  contractId: string | undefined;
};

// ------------------------------------------------------------------------
// region START

export default function QuotationVerifyForm() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId } = query;

  // ------------------------------------------------------------------------
  const {
    data: contract,
    update: update_contract,
    isFetching,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'content.verifyForm',
      // 'subContracts.content.products.rootProdductId',
      'engineeringContact',
    ],
  });

  const { engineeringContact } = contract ?? {};

  // ------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    update_contract();
  }, [contractId]);

  // ------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer isLoading_subLayer={isFetching}>
      <div>
        <PageHeader02
          panelList={usePanel_returnWorksDepartmentContractList()}
          tag={`合約編號 ${engineeringContact?.contractNumber ?? ''}`}
        />
        <Nav_worksDepartment contactThatSkipContract={contactThatSkipContract} />
      </div>

      <div className="w-[1000px]">
        <ReviewForm
          contractId={contract?.id}
          readOnly={true}
          onCancel={() => {}}
          onConfirm={() => {}}
          // contractNumber={contractNumber ?? ''}
          // projectName={projectName ?? ''}
          // totalPrice={total ?? 0}
          // contentId={undefined}
          // verifyForm={verifyForm}
        />
      </div>
    </SubLayer>
  );
}
// endregion START
// MARK: END
