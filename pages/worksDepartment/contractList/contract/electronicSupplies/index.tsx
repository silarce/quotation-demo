import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Popover } from 'antd';

// component
import SupplyList from 'components/page/worksDepartment/electronicSupplies/supplyList';
import ItemList from 'components/page/worksDepartment/electronicSupplies/itemList';
// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';

// api
import { useGetContract_id } from 'js/api/api_quotation';
import { useGetEngineeringContact, useGetElectronicSupplies } from 'js/api/api_engineering';

import { Icon_info } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './electronicSupplies.module.scss';

// utils
import { workSheetReducer, TquotationProductItemDto } from 'js/utils/worksheet/reducer';

// ------------------------------------------------------------------

type Tquery = {
  contractId: string;
};

type TproductItemList = {
  [key: string]: {
    productItem: TquotationProductItemDto;
    qty: number;
  };
};

type TtabName = 'itemList' | 'supplyList' | 'receiveHistory' | 'demandHistory';

// ------------------------------------------------------------------

export default function ElectronicSupplies() {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  // ------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<TtabName>('itemList');

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
  // ------------------------------------------------------------------

  const {
    // itemTokenList, itemIdArrList,
    itemList,
    doorQtySubTotal,
    doorQtyTotal,
  } = useMemo(() => {
    if (!worksheet?.contractProductItems) {
      return {};
    }

    const itemList: TproductItemList = {};
    const doorQtySubTotal: { [key: string]: number } = {};
    let doorQtyTotal = 0;

    const { itemTokenList, itemIdArrList } = workSheetReducer({ worksheet });

    Object.keys(itemIdArrList).forEach((idKey, index) => {
      const list = itemTokenList[idKey];

      for (const [key, value] of Object.entries(list)) {
        if (key === 'originalItem') {
          continue;
        }

        const qty = itemIdArrList[idKey][key].length;

        const doorType = value.doorModelName;

        if (!doorQtySubTotal[doorType]) {
          doorQtySubTotal[doorType] = qty;
        } else {
          doorQtySubTotal[doorType] += qty;
        }

        doorQtyTotal += qty;

        itemList[key] = {
          productItem: value,
          qty,
        };
      }
    });

    return {
      itemTokenList,
      itemIdArrList,
      itemList,
      doorQtySubTotal,
      doorQtyTotal,
    };
  }, [worksheet]);

  // ------------------------------------------------------------------

  useEffect(() => {
    update();
  }, []);

  // ------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'addButton',
      label: '建立料單',
      onClick: () =>
        router.push({
          pathname: `${router.pathname}/edit`,
          query: { ...router.query },
        }),
    },
  ];

  // ------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '送電備品列表',
      isActive: activeTab === 'itemList',
      onClick: () => setActiveTab('itemList'),
    },
    {
      label: '送電備品總料單',
      isActive: activeTab === 'supplyList',
      onClick: () => setActiveTab('supplyList'),
    },
    {
      label: '送電備品料單領取歷程',
      isActive: activeTab === 'receiveHistory',
      onClick: () => setActiveTab('receiveHistory'),
    },
    {
      label: '送電備品料單需求歷程',
      isActive: activeTab === 'demandHistory',
      onClick: () => setActiveTab('demandHistory'),
    },
  ];

  // ------------------------------------------------------------------

  const Info = () => {
    const Content = (
      <ul>
        {Object.keys(doorQtySubTotal ?? {}).map((key, index) => {
          return (
            <li key={index} className="flex gap-3">
              <span>{key}</span>
              <span>{doorQtySubTotal![key]}樘</span>
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

  // ------------------------------------------------------------------

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
            suffix={<Info />}
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
          {activeTab === 'itemList' && <ItemList itemList={itemList} />}
          {activeTab === 'supplyList' && <SupplyList />}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// =============================================================
// =============================================================
// =============================================================
