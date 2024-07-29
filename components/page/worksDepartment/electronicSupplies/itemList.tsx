import { useMemo } from 'react';

import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import scss from './itemList.module.scss';

// type
import { TworksheetDto, TquotationProductItemDto } from 'js/api/dtoTypes';
// =============================================================
type TproductItemList = {
  [key: string]: {
    productItem: TquotationProductItemDto;
    qty: number;
  };
};

// =============================================================

// MARK:START

export default function ItemList({
  //
  className,
  worksheetArr,
}: {
  className?: string;
  worksheetArr: TworksheetDto[];
}) {
  //

  const productItemList: TproductItemList = useMemo(() => {
    const list: TproductItemList = {};

    worksheetArr.forEach((worksheet) => {
      const { latestRecord, isAbandoned, isAlreadyToElectronicSupplies } = worksheet;

      if (isAbandoned || !isAlreadyToElectronicSupplies) {
        return;
      }

      const { id, contractProductItems } = latestRecord;

      if (!contractProductItems?.[0]) {
        return;
      }

      const qty = contractProductItems.length;

      list[id] = {
        productItem: contractProductItems[0],
        qty,
      };
    }); // forEach

    return list;
    //
  }, [worksheetArr]);

  const control_table: Ttable = useMemo(() => {
    const thead: Ttable['thead'] = {
      cellArr: keysArr.map((key) => {
        return {
          ...configList[key],
          children: configList[key].label,
        };
      }),
    };

    const tbodyRowArr: Ttable['tbody']['rowArr'] = Object.values(productItemList ?? {}).map((item, pIndex) => {
      const { productItem, qty } = item;
      const {
        //
        accessories,
        itemName,
        itemNumber,
        doorModelName,
        motorVendor,
        motorVoltage,
        horsepower,
      } = productItem;

      const electronicSupplies = {
        obstacleSensor: false, // 障感器
        infrared: false, // 紅外線
        remoteControl: false, // 遙控器
        bounceDoor: false, // 彈射門
      };

      accessories.forEach((acce) => {
        const name = acce.name;
        name.includes('障感器') && (electronicSupplies.obstacleSensor = true);
        name.includes('紅外線') && (electronicSupplies.infrared = true);
        name.includes('遙控器') && (electronicSupplies.remoteControl = true);
        name.includes('彈射門') && (electronicSupplies.bounceDoor = true);
      });

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
            children: <CheckBox_readonly value={electronicSupplies.obstacleSensor} />,
          },
          {
            ...configList.infrared,
            children: <CheckBox_readonly value={electronicSupplies.infrared} />,
          },
          {
            ...configList.remoteControl,
            children: <CheckBox_readonly value={electronicSupplies.remoteControl} />,
          },
          {
            ...configList.bounceDoor,
            children: <CheckBox_readonly value={electronicSupplies.bounceDoor} />,
          },
        ],
      };
    });

    const tbody: Ttable['tbody'] = {
      rowArr: tbodyRowArr,
    };

    return { thead, tbody };
  }, [productItemList]);

  // region RENDER

  return <Table01 {...control_table} className={classNames(className)} />;
}

// MARK: END

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
    label: '遙控器',
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
