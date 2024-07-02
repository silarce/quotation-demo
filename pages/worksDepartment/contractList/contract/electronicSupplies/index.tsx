// 東元的馬達 才會用到"馬達控制箱" 要依照他的馬力數和電供
// 如果有"防颱滑動支撐中柱" 就要寫其他有幾隻
// 如果有"遙控器(1:2)" 就要備註 什麼廠牌有幾個
// 如果有"彈射門"的話 就會有彈射門控制箱 並依照馬達的馬力

// https://github.com/San-Jeou/sanjeou-erp-fe/issues/248
// https://github.com/San-Jeou/sanjeou-erp-fe/assets/65767828/3ab5b70e-bdda-42e4-af82-bb2ff6e2be63

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Popover } from 'antd';

// component
import SupplyList from 'components/page/worksDepartment/electronicSupplies/supplyList';
import ItemList from 'components/page/worksDepartment/electronicSupplies/itemList';
import ReceivedHistory from 'components/page/worksDepartment/electronicSupplies/receivedHistory';
import DemandHistory from 'components/page/worksDepartment/electronicSupplies/demandHistory';
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

import { TquotationProductItemDto } from 'js/api/dtoTypes';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
  listName: 'itemList' | 'supplyList' | 'receiveHistory' | 'demandHistory' | undefined;
};

type TproductItemList = {
  [key: string]: {
    productItem: TquotationProductItemDto;
    qty: number;
  };
};

type TdoorQtySubTotalList = {
  [doorModelName: string]: {
    doorModelName: string;
    qty: number;
  };
};

// ------------------------------------------------------------------

export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId, listName = 'itemList' } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data: contract, update } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact', 'worksheet.contractProductItems.accessories'],
  });
  // const engineeringContactId = contract?.engineeringContactId ?? '';

  const worksheet = contract?.worksheet;

  const {
    contractNumber = '',
    projectName = '',
    projectContent = '',
    projectNumber = '',
  } = contract?.engineeringContact ?? {};

  const { data: data_finalProductItem, update: update_finalProductItem } =
    useGetContract_id_finalProductItem(contractId);

  // ------------------------------------------------------------------

  const { worksheetItemList, doorQtySubTotalList, doorQtyTotal } = useMemo(() => {
    if (!data_finalProductItem) {
      return {};
    }

    const doorQtySubTotalList: TdoorQtySubTotalList = {};
    let doorQtyTotal = 0;

    // 路徑
    // data_finalProductItem[number].items['number'].latestWorksheetItem
    // 以items['number'].worksheetId分類，
    // items['number'].worksheetId一樣的latestWorksheetItem，除了id外內容都是一樣的
    // const data_finalProductItem_sorted = _.sortBy(data_finalProductItem, 'order');

    const data_finalProductItem_sorted = _.sortBy(data_finalProductItem, 'order');
    const worksheetItemList: TproductItemList = {};

    const itemArr = data_finalProductItem_sorted
      .map((prod) => {
        return prod.items;
      })
      .flat();

    itemArr.forEach((item) => {
      const { latestWorksheetItem, worksheetId } = item;

      if (!worksheetId || !latestWorksheetItem) {
        return;
      }

      if (!worksheetItemList[worksheetId]) {
        worksheetItemList[worksheetId] = {
          productItem: latestWorksheetItem,
          qty: 1,
        };
      } else {
        worksheetItemList[worksheetId].qty += 1;
      }

      const { doorModelName } = latestWorksheetItem;

      if (!doorQtySubTotalList[doorModelName]) {
        doorQtySubTotalList[doorModelName] = {
          doorModelName,
          qty: 1,
        };
      } else {
        doorQtySubTotalList[doorModelName].qty += 1;
      }

      doorQtyTotal += 1;
    });

    return {
      worksheetItemList,
      doorQtySubTotalList,
      doorQtyTotal,
    };
  }, [data_finalProductItem]);

  // ------------------------------------------------------------------

  // MARK: PROPS

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

  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '更新送電備品總料單',
      onClick: async () => {
        await apiPostElectronicSupplies({
          contractId: contractId,
        });
      },
    },
  ];

  // ------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '送電備品列表',
      isActive: listName === 'itemList',
      onClick: () => {
        router.push({
          query: { ...router.query, listName: 'itemList' },
        });
      },
    },
    {
      label: '送電備品總料單',
      isActive: listName === 'supplyList',
      onClick: () => {
        router.push({
          query: { ...router.query, listName: 'supplyList' },
        });
      },
    },
    {
      label: '送電備品料單領取歷程',
      isActive: listName === 'receiveHistory',
      onClick: () => {
        router.push({
          query: { ...router.query, listName: 'receiveHistory' },
        });
      },
    },
    {
      label: '送電備品料單需求歷程',
      isActive: listName === 'demandHistory',
      onClick: () => {
        router.push({
          query: { ...router.query, listName: 'demandHistory' },
        });
      },
    },
  ];

  // ------------------------------------------------------------------
  // MARK: useEffect

  useEffect(() => {
    update();
    update_finalProductItem();
  }, []);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={contract?.contractNumber ?? '---'} />
      <div className={scss.contain1er}>
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
          {/* // !因為worksheet資料結構改變，這段程式碼不能用了，先註解 */}
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
            suffix={<Info doorQtySubTotal={doorQtySubTotalList} />}
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
          {listName === 'itemList' && <ItemList itemList={worksheetItemList} />}
          {listName === 'supplyList' && <SupplyList />}
          {listName === 'receiveHistory' && <ReceivedHistory />}
          {listName === 'demandHistory' && <DemandHistory />}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}
// ===========================================================

const Info = ({ doorQtySubTotal }: { doorQtySubTotal: TdoorQtySubTotalList | undefined }) => {
  const Content = (
    <ul>
      {Object.keys(doorQtySubTotal ?? {}).map((key, index) => {
        return (
          <li key={index} className="flex gap-3">
            <span>{key}</span>
            <span>{doorQtySubTotal![key].qty}樘</span>
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
