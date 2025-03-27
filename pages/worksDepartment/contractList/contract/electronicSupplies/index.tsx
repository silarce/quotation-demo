// https://github.com/San-Jeou/sanjeou-erp-fe/assets/65767828/3ab5b70e-bdda-42e4-af82-bb2ff6e2be63

import { useState, useEffect, useReducer, useMemo } from 'react';
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

type Taction =
  | {
      type: 'add0';
      payload: TpanelList[number];
    }
  | {
      type: 'clear';
    };

// ------------------------------------------------------------------

// MARK: START
export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId, listName = 'itemList' } = router.query as Tquery;

  // ------------------------------------------------------------------

  const {
    data: {
      //
      engineeringContact,
      worksheet,
      electronicSuppliesId,
      contractNumber,
    } = {},
    update,
    isFetching: isFetching_contract,
    contactThatSkipContract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact', 'worksheet.latestRecord.contractProductItems.accessories'],
  });

  const {
    data: {
      //
      hasFinishPickUp,
      electronicSuppliesContents = [],
      pickupRecords = [],
      requirementRecords = [],
    } = {},
    isFetching: isFetching_electronicSupplies,
  } = useElectronicSupplies_id(electronicSuppliesId);

  const { projectName = '', projectNumber = '' } = engineeringContact ?? {};

  const isAllowAddRequirement = useMemo(() => {
    return (worksheet ?? []).some((item) => {
      return item.isAlreadyToElectronicSupplies === false && item.isAbandoned === false;
    });
  }, [worksheet]);

  // ------------------------------------------------------------------

  // MARK: PROPS

  const { doorModalQtyList, doorQtyTotal } = useCalcDoorModal(worksheet ?? []);

  const { panelArr, dispatchPanelList_itemList } = usePanelList({
    electronicSuppliesId,
    isAllowAddRequirement,
  });

  const tabArr = useTabArr();

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
        panelList={panelArr}
        contractNumber={contractNumber ?? '---'}
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
          {listName === 'itemList' && (
            <ItemList
              className={scss.table}
              worksheetArr={worksheet}
              projectName={projectName}
              onWorksheetArrChange={({ openPdf }) => {
                dispatchPanelList_itemList({
                  type: 'add0',
                  payload: {
                    type: 'myButton',
                    label: '下載PDF',
                    onClick: openPdf,
                  },
                });
              }}
              onUnmount={() => {
                dispatchPanelList_itemList({ type: 'clear' });
              }}
            />
          )}
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

const reducer_itemList = (state: TpanelList, action: Taction) => {
  const copy = [...state];
  const { type } = action;

  switch (type) {
    case 'add0':
      // copy.push(action.payload);
      copy[0] = action.payload;

      return copy;
    case 'clear':
      return [];

    default:
      return state;
  }
};

const usePanelList = ({
  electronicSuppliesId,
  isAllowAddRequirement,
}: {
  electronicSuppliesId: string | null | undefined;
  isAllowAddRequirement: boolean;
}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { listName = 'itemList', contractId } = query;

  // const [panelList_itemList, setPanelList_itemList] = useState<TpanelList>([]);
  const [panelList_itemList, dispatchPanelList_itemList] = useReducer(reducer_itemList, []);

  const panelList_supplyList: TpanelList = [];

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

  return {
    panelArr,
    dispatchPanelList_itemList,
  };
};

const useTabArr = () => {
  const router = useRouter();
  const { listName = 'itemList' } = router.query as Tquery;

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

  return tabArr;
};

// ============================================================================
