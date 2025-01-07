import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
// import _ from 'lodash';
// import moment, { Moment } from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
import { Popover } from 'antd';

// component
import SupplyList from 'components/page/worksDepartment/electronicSupplies/supplyList';
import ItemList from 'components/page/worksDepartment/electronicSupplies/itemList';
import PickupRecord from 'components/page/worksDepartment/electronicSupplies/pickupRecord';
import RequirementRecord from 'components/page/worksDepartment/electronicSupplies/requirementRecord';
import Profile, { TdoorQtySubTotalList } from 'components/page/worksDepartment/electronicSupplies/profile';

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

import {
  Tstate_electronicItem,
  Tstate_info,
  createEmptyStateInfo,
} from 'components/page/worksDepartment/electronicSupplies/defaultState_detail';

import { useCalcDoorModal } from 'components/page/worksDepartment/electronicSupplies/hook/useCalcDoorModal';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
  listName: 'supplyList' | 'pickupRecord' | undefined;
};

export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId, listName = 'supplyList' } = router.query as Tquery;

  // =========================================================================
  const { data: contract, update } = useGetContract_id(contractId, {
    customPopulate: [
      //
      'engineeringContact',
      'worksheet.latestRecord.contractProductItems.accessories',
    ],
  });

  const { engineeringContact, worksheet, electronicSuppliesId, engineeringContactId, contractNumber } = contract ?? {};

  const { data: data_electronicSupplies } = useElectronicSupplies_id(electronicSuppliesId);

  const {
    projectName = '',

    projectNumber = '',
  } = engineeringContact ?? {};

  const { hasFinishPickUp, electronicSuppliesContents = [], pickupRecords = [] } = data_electronicSupplies ?? {};

  // -----------------------------------------------------------------
  const { doorModalQtyList, doorQtyTotal } = useCalcDoorModal(worksheet ?? []);

  const tabArr: Ttab[] = [
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
  ];

  // -----------------------------------------------------------------

  const panelList: TpanelList = [
    {
      label: '返回',
      type: 'myButton',
      onClick: () => router.back(),
    },
  ];

  // -----------------------------------------------------------------

  useEffect(() => {
    update();
    // update_finalProductItem();
  }, []);

  // -----------------------------------------------------------------

  // MARK:RENDER

  return (
    <SubLayer>
      <PageHeader02 tag={`送電備品-${contractNumber}`} panelList={panelList} />

      <div className={scss.container}>
        <Profile
          projectNumber={projectNumber}
          projectName={projectName}
          doorQtyTotal={doorQtyTotal}
          doorModalQtyList={doorModalQtyList}
          hasFinishPickUp={hasFinishPickUp}
        />

        <Wrapper_tab tabArr={tabArr} className={classNames('mt-10', 'w-full')}>
          {listName === 'supplyList' && <SupplyList electronicSuppliesContents={electronicSuppliesContents} />}
          {listName === 'pickupRecord' && <PickupRecord className={scss.table} pickupRecords={pickupRecords} />}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}
