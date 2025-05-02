import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import Table_main from 'components/page/worksDepartment/electronicSupplies/demandForm/table_main';
import Table_detail from 'components/page/worksDepartment/electronicSupplies/demandForm/table_detail';
// import SupplyTable, {
//   TimperativeHandle,
//   useStateToGroup,
// } from 'components/page/worksDepartment/electronicSupplies/ui/supplyTable';
// import DefaultItemSelector from 'components/page/worksDepartment/electronicSupplies/defaultItemSelector';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
// import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
// import Row, { Cell } from 'components/global/gear/table/row';

// css
import scss from './index.module.scss';

// import { useApiGetProdDoorModels } from 'js/api/api_product';
import { useGetContract_id } from 'js/api/api_quotation';

// import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

import { useDemandForm } from 'components/page/worksDepartment/electronicSupplies/demandForm/useDemandForm';

// ==================================================================
type Tquery = {
  contractId: string | undefined;
  requirementRecordId: string | undefined;
};

// ==================================================================

// MARK: START

export default function EditRequirementRecord() {
  const router = useRouter();
  const { contractId, requirementRecordId } = router.query as Tquery;
  const isNew = !requirementRecordId;

  // ------------------------------------------------------------------
  const [disabled, setDisabled] = useState(!isNew);

  // ------------------------------------------------------------------

  const {
    data: data_contract,
    update: update_contract,
    contactThatSkipContract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  // const { formatOptions } = useGlobal_doorModel();

  // const engineeringContact = data_contract?.engineeringContact;

  // ------------------------------------------------------------------

  const instance_useDemandForm = useDemandForm(undefined);
  const { stateArr, checkedStateArr } = instance_useDemandForm;

  // ------------------------------------------------------------------

  const handle_openDetail = () => {
    myAlert.clear({
      content: <Table_detail />,
    });
  };

  // ------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update_contract();
  }, [contractId]);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isFetching_contract}>
      <PageHeader
        showReturnBtn={disabled}
        panelList={[]}
        contractNumber={data_contract?.contractNumber ?? '---'}
        contactThatSkipContract={contactThatSkipContract}
      />

      <div className={scss.main}>
        <div>
          <Table_main disabled={disabled} instance_useDemandForm={instance_useDemandForm} />
          <div className={scss.info}>
            <span>共 {stateArr.length} 項</span>
            <span>已開{0}</span>
            <span>已選 {checkedStateArr.length} 項</span>
            <SquareBtn sharp="mini" onClick={handle_openDetail}>
              產生明細
            </SquareBtn>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// MARK: END

// ==================================================================
