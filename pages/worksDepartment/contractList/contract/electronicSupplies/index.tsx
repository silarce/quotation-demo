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

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Trow, Tcell, Ttable, Tconfig_table } from 'components/global/gear/table/table01';

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

  const control_table: Ttable = useMemo(() => {
    // Trow, Tcell, Ttable

    const thead: Ttable['thead'] = {
      cellArr: keysArr.map((key) => {
        return {
          ...configList[key],
          children: configList[key].label,
        };
      }),
    };

    const tbodyRowArr: Ttable['tbody']['rowArr'] = Object.values(itemList ?? {}).map((item, pIndex) => {
      const { productItem, qty } = item;
      const { itemName, itemNumber, doorModelName, motorVendor, motorVoltage, horsepower } = productItem;

      return {
        cellArr: [
          {
            ...configList.itemName,
            children: itemName,
          },
          {
            ...configList.itemNumber,
            children: itemNumber,
          },
          {
            ...configList.qty,
            children: qty,
          },
          {
            ...configList.doorModelName,
            children: doorModelName,
          },
          {
            ...configList.motorVendor,
            children: motorVendor,
          },
          {
            ...configList.motorVoltage,
            children: motorVoltage,
          },
          {
            ...configList.horsepower,
            children: horsepower,
          },
          {
            ...configList.obstacleSensor,
            children: <CheckBox_readonly />,
          },
          {
            ...configList.infrared,
            children: <CheckBox_readonly value={true} />,
          },
          {
            ...configList.remoteControl,
            children: <CheckBox_readonly value={true} />,
          },
          {
            ...configList.bounceDoor,
            children: <CheckBox_readonly />,
          },
        ],
      };
    });

    const tbody: Ttable['tbody'] = {
      // rowArr: tbodyRowArr,
      rowArr: [...tbodyRowArr, ...tbodyRowArr, ...tbodyRowArr],
    };

    return { thead, tbody };
  }, [worksheet]);

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
          {activeTab === 'itemList' && (
            <Table01
              {...control_table}
              // style={{ width: '100%' }}
              className={classNames(scss.table, 'w-[100%]')}
            />
          )}

          {activeTab === 'supplyList' && <SupplyList />}
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// =============================================================
// =============================================================
// =============================================================

const CheckBox_readonly = ({ value }: { value?: boolean }) => {
  return (
    <div>
      <InputSel
        showBaseline="invisible"
        disabled={true}
        checkBoxProps={{
          propsArr: [
            {
              props: {
                className: classNames(scss.checkBox, scss.plus),
              },
              key: 'notNeed',
              value: value,
            },
          ],
        }}
      />
    </div>
  );
};

// =============================================================
// =============================================================
// =============================================================

const keysArr = [
  'itemName', // 名稱
  'itemNumber', // 編號
  'qty', // 樘數
  'doorModelName', // 門型
  'motorVendor', // 馬達
  'motorVoltage', // 電壓
  'horsepower', // 馬力數
  'obstacleSensor', // 障感器
  'infrared', // 紅外線
  'remoteControl', // 遙控器(1:2)
  'bounceDoor', // 彈射門
];

const configList: { [key: string]: Tconfig_table } = {
  itemName: {
    label: '名稱',
    width: 200,
    justifyContent: 'center',
  },
  itemNumber: {
    label: '編號',
    width: 200,
    justifyContent: 'center',
  },
  qty: {
    label: '樘數',
    width: 200,
    justifyContent: 'center',
  },
  doorModelName: {
    label: '門型',
    width: 200,
    justifyContent: 'center',
  },
  motorVendor: {
    label: '馬達',
    width: 200,
    justifyContent: 'center',
  },
  motorVoltage: {
    label: '電壓',
    width: 200,
    justifyContent: 'center',
  },
  horsepower: {
    label: '馬力數',
    width: 200,
    justifyContent: 'center',
  },
  obstacleSensor: {
    label: '障感器',
    width: 200,
    justifyContent: 'center',
  },
  infrared: {
    label: '紅外線',
    width: 200,
    justifyContent: 'center',
  },
  remoteControl: {
    label: '遙控器(1:2)',
    width: 200,
    justifyContent: 'center',
  },
  bounceDoor: {
    label: '彈射門',
    width: 200,
    justifyContent: 'center',
  },
};

// =======================================================================
