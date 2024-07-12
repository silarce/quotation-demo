import { useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import { ReviewForm } from 'components/page/domestic/quotation/quotation/contractReviewForm/contractReviewForm';

// api
// import { useGetEngineeringContact } from 'js/api/api_engineering';
import { useGetContract_id } from 'js/api/api_quotation';

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
  const { data: contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'content.verifyForm',
      // 'subContracts.content.products.rootProdductId',
      'engineeringContact',
    ],
  });

  const {
    //
    engineeringContact,
    contractNumber,
    content,
  } = contract ?? {};

  const {
    //
    verifyForm,
    projectName,
    total,
  } = content ?? {};

  // ------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    update_contract();
  }, [contractId]);

  // ------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader
        //  panelList={panelList}
        contractNumber={engineeringContact?.contractNumber ?? ''}
      />

      <div className="w-[1000px]">
        <ReviewForm
          forbidden={true}
          close={() => {}}
          contractIdNumber={contractNumber ?? ''}
          contractName={projectName ?? ''}
          contractPrice={total ?? 0}
          lastestContentId={undefined}
          verifyForm={verifyForm}
          onConfirm={() => {}}
        />
      </div>
    </SubLayer>
  );
}
// endregion START
// MARK: END
