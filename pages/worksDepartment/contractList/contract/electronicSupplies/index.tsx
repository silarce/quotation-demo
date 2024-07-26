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
import _ from 'lodash';
import moment, { Moment } from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Popover } from 'antd';

// component
import SupplyList from 'components/page/worksDepartment/electronicSupplies/supplyList';
import ItemList from 'components/page/worksDepartment/electronicSupplies/itemList';
import PickupRecord from 'components/page/worksDepartment/electronicSupplies/pickupRecord';
import RequirementRecord from 'components/page/worksDepartment/electronicSupplies/requirementRecord';
// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

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

import { Icon_info } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './electronicSupplies.module.scss';

// utils
// import { workSheetReducer, TquotationProductItemDto } from 'js/utils/worksheet/reducer';

import {
  TemployeeDto,
  //
  TworksheetDto,
  TquotationProductItemDto,
} from 'js/api/dtoTypes';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
  listName: 'itemList' | 'supplyList' | 'pickupRecord' | 'requirementRecord' | undefined;
};

type TdoorQtySubTotalList = {
  [doorModelName: string]: number;
};

// type Tstate_electronicItem = {
//   itemName: string;
//   subItemName?: string | null;
//   category: string;

//   // 已領數量
//   pickUpQuantity?: number | null;
//   // 未領數量
//   stayQuantity?: number | null;
//   // 總需求數量
//   quantity?: number | null;

//   // 領取數量
//   pickupRecord?: number | null;
//   // 需求數量
//   requirementQty?: number | null;
// };

type Tstate_electronicItem = {
  id?: string;
  category: string;
  itemName: string;
  quantity: number | null;
  unit: string | null;
  code: string | null;
  // code: string | null;
  subItemName?: null | '捲門/水閘門';
};
// itemName為'控制箱/盤'時，subItemName為'捲門/水閘門'，其他為null或undefined

type Tstate_info = {
  date: Moment | null;
  indexNumber: string;
  picker: TemployeeDto | undefined;
  preparer: TemployeeDto | undefined;
  doorModelName: string | undefined;
  // doorQty: `${number}` | ''; // 目前api不收
};

export type { Tstate_electronicItem, Tstate_info };

// ------------------------------------------------------------------

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
    update: update_electronicSupplies,
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
    electronicSuppliesContents = [],
    pickupRecords = [],
    requirementRecords = [],
  } = data_electronicSupplies ?? {};

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------

  // MARK: PROPS

  const { doorModalQtyList, doorQtyTotal } = useCalcDoorModal(worksheet ?? []);

  // const panelList_receiveHistory: TpanelList = [
  //   {
  //     type: 'addButton',
  //     label: '新增',
  //     onClick: () =>
  //       router.push({
  //         pathname: `${router.pathname}/editReceivedHistory`,
  //         query: { ...router.query },
  //       }),
  //   },
  // ];
  // const panelList_demandHistory: TpanelList = [
  //   {
  //     type: 'addButton',
  //     label: '新增',
  //     onClick: () =>
  //       router.push({
  //         pathname: `${router.pathname}/editDemandHistory`,
  //         query: { ...router.query },
  //       }),
  //   },
  // ];

  // const panelList =
  //   listName === 'receiveHistory'
  //     ? panelList_receiveHistory
  //     : listName === 'demandHistory'
  //     ? panelList_demandHistory
  //     : [];

  const panelList = usePanelList();

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
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={contract?.contractNumber ?? '---'} />
      <div className={scss.container}>
        <div className={scss.info}>
          <InputSel
            caption="工程編號"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: projectNumber,
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="工程名稱"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: projectName,
                readOnly: true,
              },
            }}
          />

          <InputSel
            caption="門型數量"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: doorQtyTotal,
                readOnly: true,
              },
            }}
            suffix={<Info doorModalQtyList={doorModalQtyList} />}
          />
          <InputSel
            caption="領料狀態"
            showBaseline="invisible"
            captionStyle={{ width: '80px' }}
            wrapperStyle={{ gap: '25px' }}
            inputProps={{
              props: {
                value: '領料尚未完成',
                readOnly: true,
                className: classNames(scss.supplyStatus, false && scss.isDone),
              },
            }}
          />
        </div>

        <Wrapper_tab
          tabArr={tabArr}
          className={classNames('mt-10', 'w-full')}
          // stickyTop={{
          //   top: '50px',
          // }}
        >
          {listName === 'itemList' && <ItemList worksheetArr={worksheet ?? []} />}
          {listName === 'supplyList' && <SupplyList electronicSuppliesContents={electronicSuppliesContents} />}
          {listName === 'pickupRecord' && <PickupRecord pickupRecords={pickupRecords} />}
          {listName === 'requirementRecord' && <RequirementRecord requirementRecords={requirementRecords} />}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}
// ===========================================================

// region COMPONENT

const Info = ({ doorModalQtyList }: { doorModalQtyList: TdoorQtySubTotalList }) => {
  const Content = (
    <ul>
      {Object.entries(doorModalQtyList).map(([key, qty]) => {
        return (
          <li key={key} className="flex gap-3">
            <span>{key}</span>
            <span>{qty}樘</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Popover content={Content} trigger={'hover'} placement="right">
      <div>
        <Icon_info />
      </div>
    </Popover>
  );
};

// =======================================================================

// region HOOK

const useCalcDoorModal = (worksheetArr: TworksheetDto[]) => {
  const obj: {
    doorModalQtyList: TdoorQtySubTotalList;
    doorQtyTotal: number;
  } = useMemo(() => {
    const list: TdoorQtySubTotalList = {};
    let total = 0;

    worksheetArr.forEach((worksheet) => {
      const { latestRecord, isAbandoned, isAlreadyToElectronicSupplies } = worksheet;

      if (isAbandoned || !isAlreadyToElectronicSupplies) {
        return;
      }

      const { contractProductItems } = latestRecord;

      if (!contractProductItems?.[0]) {
        return;
      }

      const qty = contractProductItems.length;
      const doorModelName = contractProductItems[0].doorModelName;

      if (!list[doorModelName]) {
        list[doorModelName] = 0;
      }

      list[doorModelName] += qty;
      total += qty;
    }); // forEach

    return {
      doorModalQtyList: list,
      doorQtyTotal: total,
    };
    //
  }, [worksheetArr]);

  return obj;
};

const usePanelList = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { listName, contractId } = query;

  // ------------------------------------------------------------------------
  //
  const panelList_itemList: TpanelList = [];
  //
  const panelList_supplyList: TpanelList = [];
  //
  const panelList_pickupRecord: TpanelList = [];
  //
  const panelList_requirementRecord: TpanelList = [
    {
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
    },
  ];

  //
  //

  const list = {
    itemList: panelList_itemList,
    supplyList: panelList_supplyList,
    pickupRecord: panelList_pickupRecord,
    requirementRecord: panelList_requirementRecord,
  };

  return listName ? list[listName] : [];
};

// ============================================================================

const createEmployeeStateInfo = (): Tstate_info => ({
  date: moment(),
  indexNumber: '',
  picker: undefined,
  preparer: undefined,
  doorModelName: undefined,
  // doorQty: '',
});

export { createEmployeeStateInfo };
