// 東元的馬達 才會用到"馬達控制箱" 要依照他的馬力數和電供
// 如果有"防颱滑動支撐中柱" 就要寫其他有幾隻
// 如果有"遙控器(1:2)" 就要備註 什麼廠牌有幾個
// 如果有"彈射門"的話 就會有彈射門控制箱 並依照馬達的馬力

// https://github.com/San-Jeou/sanjeou-erp-fe/issues/248
// https://github.com/San-Jeou/sanjeou-erp-fe/assets/65767828/3ab5b70e-bdda-42e4-af82-bb2ff6e2be63

// 送電備品列表
// 一個row就是一個工作表，列出其中的指定送電備品

// 送電備品總料單
// 列出所有的送電備品
// 資料為electronicSupplies.electronicSuppliesContents
// 表格格式為 動態 的

// 送電備品料單領取歷程
// 資料為electronicSupplies.pickupRecords
// 表格格式為 動態 的

// 送電備品需求歷程
// 資料為electronicSupplies.requirementRecords
// 表格格式為 靜態 的，列出設計圖上的送電備品項目

import { useState, useEffect, useMemo } from 'react';
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
import Profile, { TdoorQtySubTotalList } from 'components/page/worksDepartment/electronicSupplies/profile';

// gear
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  //
  useGetContract_id,
  useGetContract_id_finalProductItem,
} from 'js/api/api_quotation';
import {
  //
  apiPostElectronicSupplies,
  useGetEngineeringContact,
  useElectronicSupplies_id,
} from 'js/api/api_engineering';

// css
import scss from './electronicSupplies.module.scss';

import { useCalcDoorModal } from 'components/page/worksDepartment/electronicSupplies/hook/useCalcDoorModal';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
  listName: 'itemList' | 'supplyList' | 'pickupRecord' | 'requirementRecord' | undefined;
};

// type TdoorQtySubTotalList = {
//   [doorModelName: string]: number;
// };

// ------------------------------------------------------------------

// MARK: START
export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId, listName = 'itemList' } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data: contract, update } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'engineeringContact',
      'worksheet.latestRecord.contractProductItems.accessories',
    ],
  });

  const { engineeringContact, worksheet, electronicSuppliesId, engineeringContactId } = contract ?? {};

  const {
    data: data_electronicSupplies,
    // update: update_electronicSupplies,
    isFetching: isFetching_electronicSupplies,
  } = useElectronicSupplies_id(electronicSuppliesId);

  // const { data: data_finalProductItem, update: update_finalProductItem } =
  //   useGetContract_id_finalProductItem(contractId);

  const {
    //
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

  // region REQUEST

  // 棄用
  // const reqCreateRequirementRecordFromIWorksheet = async () => {
  //   await apiPostElectronicSupplies({ contractId }).then(update);
  // };

  // 預計用來更新送電備品列表，待api製作出來
  const reqUpdateElectronicSupplies = async () => {
    myAlert.notify.info({ message: '功能製作中' });
  };

  // ------------------------------------------------------------------

  // MARK: PROPS

  const { doorModalQtyList, doorQtyTotal } = useCalcDoorModal(worksheet ?? []);

  const panelList = usePanelList({
    // reqCreateRequirementRecordFromIWorksheet,
    reqUpdateElectronicSupplies,
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
    // update_finalProductItem();
  }, []);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isFetching_electronicSupplies}>
      <PageHeader panelList={panelList} contractNumber={contract?.contractNumber ?? '---'} />
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
  // reqCreateRequirementRecordFromIWorksheet,
  reqUpdateElectronicSupplies,
  electronicSuppliesId,
  isAllowAddRequirement,
}: {
  // reqCreateRequirementRecordFromIWorksheet: () => void;
  reqUpdateElectronicSupplies: () => void;
  electronicSuppliesId: string | null | undefined;
  isAllowAddRequirement: boolean;
}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { listName, contractId } = query;

  // ------------------------------------------------------------------------
  //
  const panelList_itemList: TpanelList = [
    // {
    //   type: 'myButton',
    //   label: '更新送電備品列表',
    //   onClick: reqUpdateElectronicSupplies,
    // },
  ];
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
  const panelList_requirementRecord: TpanelList = [
    // {
    //   type: 'addButton',
    //   label: '自動產生需求單',
    //   onClick: reqCreateRequirementRecordFromIWorksheet,
    // },
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

  // if (!electronicSuppliesId) {
  //   panelArr.unshift({
  //     type: 'redButton',
  //     label: '產生送電備品列表',
  //     onClick: reqUpdateElectronicSupplies,
  //   });
  // }

  return panelArr;
};

// ============================================================================
