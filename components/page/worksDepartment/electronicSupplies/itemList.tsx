import { useMemo } from 'react';
import classNames from 'classnames';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import { Checkbox } from 'components/global/gear/dataEntry';

import scss from './itemList.module.scss';

// type
import { TworksheetDto, TquotationProductItemDto } from 'js/api/dtoTypes';
// =============================================================

type Titem = TquotationProductItemDto & {
  qty: number;
  //以下幾項都要從accessories裡面過濾
  obstacleSensor: boolean;
  infrared: boolean;
  remoteControl: boolean;
  bounceDoor: boolean;
  smartSwitch: boolean;
  antiTyphoonColumn: boolean;
  antiTyphoonBaseLock: number;
  ul: boolean;
  wheel: boolean;
};

type TproductItemList = {
  [key: string]: Titem;
};

interface configItem {
  label?: string;
  style: React.CSSProperties;
  style_thead?: React.CSSProperties;
  style_tbody?: React.CSSProperties;
  render: (v: Titem) => React.ReactNode;
}

type Tkeys = keyof Pick<
  Titem,
  | 'itemName'
  | 'itemNumber'
  | 'floor'
  | 'locationArea'
  | 'qty'
  | 'doorModelName'
  | 'motorVendor'
  | 'motorVoltage'
  | 'horsepower'
  //
  | 'obstacleSensor'
  | 'infrared'
  | 'remoteControl'
  | 'bounceDoor'
  | 'smartSwitch'
  | 'antiTyphoonColumn'
  | 'antiTyphoonBaseLock'
  | 'ul'
  | 'wheel'
>;

type Tconfig = {
  [key in Tkeys]: configItem;
};

// =============================================================

// MARK:START

export default function ItemList({ className, worksheetArr }: { className?: string; worksheetArr: TworksheetDto[] }) {
  const productItemArr: Titem[] = useMemo(() => {
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

      const { accessories } = contractProductItems[0];

      const checkList = {
        obstacleSensor: false,
        infrared: false,
        remoteControl: false,
        bounceDoor: false,
        smartSwitch: false,
        antiTyphoonColumn: false,
        // antiTyphoonBaseLock: false,
        ul: false,
        wheel: false,
      };
      let antiTyphoonBaseLock = 0;

      accessories.forEach((acce) => {
        const name = acce.name;

        if (/^防颱.*中柱$/.test(name)) {
          checkList.antiTyphoonColumn = true;
        } else if (name.includes('防颱底座鎖固')) {
          antiTyphoonBaseLock++;
        } else {
          Object.entries(acceCheckLookup).forEach(([key, property]) => {
            if (name.includes(key)) {
              checkList[property] = true;
            }
          });
        }
      });

      list[id] = {
        ...contractProductItems[0],
        qty,
        antiTyphoonBaseLock,
        ...checkList,
      };
    });

    return Object.values(list);
    //
  }, [worksheetArr]);

  // region RENDER

  return (
    <div className={classNames(scss.table, className)}>
      <Row thead={true}>
        {keyArr.map((key) => {
          const configItem = config[key];

          return (
            <Cell key={key} style={configItem.style} className={classNames(scss.cell, scss.plus)}>
              {configItem.label}
            </Cell>
          );
        })}
      </Row>

      {productItemArr.map((item, index) => {
        return (
          <Row key={index}>
            {keyArr.map((key) => {
              const configItem = config[key];

              const { style, render } = configItem;

              return (
                <Cell key={key} style={style} className={classNames(scss.cell, scss.plus)}>
                  {render(item)}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
}

// MARK: END

// ==================================================================

const config: Tconfig = {
  itemName: {
    label: '名稱',
    style: {
      width: 150,
      justifyContent: 'flex-start',
    },
    render: ({ itemName }) => itemName,
  },
  itemNumber: {
    label: '編號',
    style: {
      width: 180,
      justifyContent: 'flex-start',
    },
    render: ({ itemNumber }) => itemNumber,
  },
  floor: {
    label: '樓層',
    style: {
      width: 150,
      justifyContent: 'flex-start',
    },
    render: ({ floor }) => floor,
  },
  locationArea: {
    label: '區域',
    style: {
      width: 150,
      justifyContent: 'flex-start',
    },
    render: ({ locationArea }) => locationArea,
  },
  qty: {
    label: '樘數',
    style: {
      width: 60,
      justifyContent: 'center',
    },
    render: ({ qty }) => qty,
  },
  doorModelName: {
    label: '門型',
    style: {
      width: 120,
      justifyContent: 'flex-start',
    },
    render: ({ doorModelName }) => doorModelName,
  },
  motorVendor: {
    label: '馬達',
    style: {
      width: 60,
      justifyContent: 'center',
    },
    render: ({ motorVendor }) => motorVendor,
  },
  motorVoltage: {
    label: '電壓',
    style: {
      width: 60,
      justifyContent: 'center',
    },
    render: ({ motorVoltage }) => motorVoltage,
  },
  horsepower: {
    label: '馬力數',
    style: {
      width: 90,
      justifyContent: 'center',
    },
    render: ({ horsepower }) => horsepower,
  },
  obstacleSensor: {
    label: '障感器',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ obstacleSensor }) => {
      return <Checkbox checked={obstacleSensor} disabled={true} />;
    },
  },
  infrared: {
    label: '紅外線',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ infrared }) => {
      return <Checkbox checked={infrared} disabled={true} />;
    },
  },
  remoteControl: {
    label: '遙控器',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ remoteControl }) => {
      return <Checkbox checked={remoteControl} disabled={true} />;
    },
  },
  bounceDoor: {
    label: '彈射門',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ bounceDoor }) => {
      return <Checkbox checked={bounceDoor} disabled={true} />;
    },
  },
  smartSwitch: {
    label: '智慧開關',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    render: ({ smartSwitch }) => {
      return <Checkbox checked={smartSwitch} disabled={true} />;
    },
  },
  antiTyphoonColumn: {
    label: '防颱中柱',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    render: ({ antiTyphoonColumn }) => {
      return <Checkbox checked={antiTyphoonColumn} disabled={true} />;
    },
  },
  antiTyphoonBaseLock: {
    label: '防颱底座鎖固',
    style: {
      width: 120,
      justifyContent: 'center',
    },
    render: ({ antiTyphoonBaseLock }) => antiTyphoonBaseLock,
  },
  ul: {
    label: 'UL熔金體',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    render: ({ ul }) => {
      return <Checkbox checked={ul} disabled={true} />;
    },
  },
  wheel: {
    label: '檔輪',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ wheel }) => {
      return <Checkbox checked={wheel} disabled={true} />;
    },
  },
};

const keyArr: Tkeys[] = [
  'itemName',
  'itemNumber',
  'floor',
  'locationArea',
  'qty',
  'doorModelName',
  'motorVendor',
  'motorVoltage',
  'horsepower',
  'antiTyphoonBaseLock',
  'obstacleSensor',
  'infrared',
  'remoteControl',
  'bounceDoor',
  'smartSwitch',
  'antiTyphoonColumn',
  'ul',
  'wheel',
];
// =======================================================================

const acceCheckLookup = {
  障感器: 'obstacleSensor',
  障礙感知器: 'obstacleSensor',
  紅外線: 'infrared',
  遙控器: 'remoteControl',
  彈射門: 'bounceDoor',
  智慧型開關: 'smartSwitch',
  // 防颱底座鎖固: 'antiTyphoonBaseLock',
  UL熔金體: 'ul',
  檔輪: 'wheel',
} as const;
