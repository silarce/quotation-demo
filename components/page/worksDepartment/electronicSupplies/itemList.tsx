import { useMemo } from 'react';

import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { TquotationProductItemDto } from 'js/api/dtoTypes';

import scss from './itemList.module.scss';
import scss_p from './_public.module.scss';

// =============================================================
type TproductItemList = {
  [key: string]: {
    productItem: TquotationProductItemDto;
    qty: number;
  };
};

// =============================================================

export default function ItemList({ itemList }: { itemList: TproductItemList | undefined }) {
  //
  const control_table: Ttable = useMemo(() => {
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
  }, [itemList]);

  return <Table01 {...control_table} className={classNames(scss_p.table)} />;
}

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================

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
