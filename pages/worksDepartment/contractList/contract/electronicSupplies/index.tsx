// https://github.com/San-Jeou/sanjeou-erp-fe/assets/65767828/3ab5b70e-bdda-42e4-af82-bb2ff6e2be63

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// component
import SupplyList from 'components/page/worksDepartment/electronicSupplies/supplyList';
import ItemList from 'components/page/worksDepartment/electronicSupplies/itemList';
import PickupRecord from 'components/page/worksDepartment/electronicSupplies/pickupRecord';
import RequirementRecord from 'components/page/worksDepartment/electronicSupplies/requirementRecord';
import Profile from 'components/page/worksDepartment/electronicSupplies/profile';

// gear
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import { useElectronicSupplies_id } from 'js/api/api_engineering';

// css
import scss from './electronicSupplies.module.scss';

import { useCalcDoorModal } from 'components/page/worksDepartment/electronicSupplies/hook/useCalcDoorModal';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
  listName: 'itemList' | 'supplyList' | 'pickupRecord' | 'requirementRecord' | undefined;
};

// ------------------------------------------------------------------

// MARK: START
export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId, listName = 'itemList' } = router.query as Tquery;

  // ------------------------------------------------------------------

  const {
    data: contract,
    update,
    isFetching: isFetching_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'engineeringContact',
      'worksheet.latestRecord.contractProductItems.accessories',
    ],
  });

  const { engineeringContact, worksheet, electronicSuppliesId } = contract ?? {};

  const {
    data: data_electronicSupplies,
    // update: update_electronicSupplies,
    isFetching: isFetching_electronicSupplies,
  } = useElectronicSupplies_id(electronicSuppliesId);

  const {
    // contractNumber = '',
    projectName = '',
    // projectContent = '',
    projectNumber = '',
  } = engineeringContact ?? {};

  const {
    hasFinishPickUp,
    electronicSuppliesContents = [],
    pickupRecords = [],
    requirementRecords = [],
  } = data_electronicSupplies ?? {};

  const isAllowAddRequirement = useMemo(() => {
    return (worksheet ?? []).some((item) => {
      return item.isAlreadyToElectronicSupplies === false && item.isAbandoned === false;
    });
  }, [worksheet]);

  // ------------------------------------------------------------------

  // MARK: PROPS

  const { doorModalQtyList, doorQtyTotal } = useCalcDoorModal(worksheet ?? []);

  const panelList = usePanelList({
    electronicSuppliesId,
    isAllowAddRequirement,
  });

  // ------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '送電備品列表',
      isActive: listName === 'itemList',
      onClick: () => {
        router.replace({
          query: { ...router.query, listName: 'itemList' },
        });
      },
    },
    {
      label: '送電備品總料單',
      isActive: listName === 'supplyList',
      onClick: () => {
        router.replace({
          query: { ...router.query, listName: 'supplyList' },
        });
      },
    },
    {
      label: '送電備品料單領取歷程',
      isActive: listName === 'pickupRecord',
      onClick: () => {
        router.replace({
          query: { ...router.query, listName: 'pickupRecord' },
        });
      },
    },
    {
      label: '送電備品料單需求歷程',
      isActive: listName === 'requirementRecord',
      onClick: () => {
        router.replace({
          query: { ...router.query, listName: 'requirementRecord' },
        });
      },
    },
  ];

  // ------------------------------------------------------------------
  // MARK: useEffect

  useEffect(() => {
    update();
  }, []);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isFetching_electronicSupplies || isFetching_contract}>
      <PageHeader
        panelList={panelList}
        contractNumber={contract?.contractNumber ?? '---'}
        contactThatSkipContract={contactThatSkipContract}
      />
      <div className={scss.container}>
        <Profile
          projectNumber={projectNumber}
          projectName={projectName}
          doorQtyTotal={doorQtyTotal}
          doorModalQtyList={doorModalQtyList}
          hasFinishPickUp={hasFinishPickUp}
        />

        <Wrapper_tab tabArr={tabArr} className={classNames('mt-10', 'w-full')}>
          {listName === 'itemList' && <ItemList className={scss.table} worksheetArr={worksheet ?? []} />}
          {listName === 'supplyList' && <SupplyList electronicSuppliesContents={electronicSuppliesContents} />}
          {listName === 'pickupRecord' && <PickupRecord className={scss.table} pickupRecords={pickupRecords} />}
          {listName === 'requirementRecord' && (
            <RequirementRecord className={scss.table} requirementRecords={requirementRecords} />
          )}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// =======================================================================

// region HOOK

const usePanelList = ({
  electronicSuppliesId,
  isAllowAddRequirement,
}: {
  electronicSuppliesId: string | null | undefined;
  isAllowAddRequirement: boolean;
}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { listName, contractId } = query;

  // ------------------------------------------------------------------------
  //
  const panelList_itemList: TpanelList = [];
  //
  const panelList_supplyList: TpanelList = [];
  //
  const panelList_pickupRecord: TpanelList = [
    electronicSuppliesId
      ? {
          type: 'addButton',
          label: '新增領取單',
          onClick: () =>
            router.push({
              pathname: `${router.pathname}/editPickup`,
              query: {
                ...query,
                contractId: contractId, // 確保要有contractId
              },
            }),
        }
      : null,
  ];
  //
  const panelList_requirementRecord: TpanelList = [
    isAllowAddRequirement
      ? {
          type: 'addButton',
          label: '新增需求單',
          onClick: () =>
            router.push({
              pathname: `${router.pathname}/editRequirement`,
              // query,
              query: {
                ...query,
                contractId: contractId, // 確保要有contractId
              },
            }),
        }
      : null,
  ];

  //
  //

  const list = {
    itemList: panelList_itemList,
    supplyList: panelList_supplyList,
    pickupRecord: panelList_pickupRecord,
    requirementRecord: panelList_requirementRecord,
  };

  const panelArr = listName ? list[listName] : [];

  return panelArr;
};

// ============================================================================
