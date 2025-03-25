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
  obstacleSensor: boolean;
  infrared: boolean;
  remoteControl: boolean;
  bounceDoor: boolean;
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

type Tconfig = {
  [key in keyof Titem]?: configItem;
};

type Tkey = keyof typeof config;

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
      let obstacleSensor = false;
      let infrared = false;
      let remoteControl = false;
      let bounceDoor = false;

      accessories.forEach((acce) => {
        const name = acce.name;
        name.includes('障感器') && (obstacleSensor = true);
        name.includes('紅外線') && (infrared = true);
        name.includes('遙控器') && (remoteControl = true);
        name.includes('彈射門') && (bounceDoor = true);
      });
      list[id] = {
        ...contractProductItems[0],
        qty,
        obstacleSensor,
        infrared,
        remoteControl,
        bounceDoor,
      };
    });

    return Object.values(list);
    //
  }, [worksheetArr]);

  // region RENDER

  return (
    <div className={className}>
      <Row thead={true} fullWidth={true}>
        {keyArr.map((key) => {
          const configItem = config[key];

          if (!configItem) {
            console.error('key', key);
            console.error('config', config);

            throw new Error('config[key] is undefined');
          }

          return (
            <Cell key={key} style={configItem.style} className={classNames(scss.cell, scss.plus)}>
              {configItem.label}
            </Cell>
          );
        })}
      </Row>

      {productItemArr.map((item, index) => {
        return (
          <Row key={index} fullWidth={true}>
            {keyArr.map((key) => {
              const configItem = config[key];

              if (!configItem) {
                console.error('key', key);
                console.error('config', config);

                throw new Error('config[key] is undefined');
              }

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
      width: 200,
      justifyContent: 'flex-start',
    },
    render: ({ itemName }) => itemName,
  },
  itemNumber: {
    label: '編號',
    style: {
      width: 200,
      justifyContent: 'flex-start',
    },
    render: ({ itemNumber }) => itemNumber,
  },
  floor: {
    label: '樓層',
    style: {
      flex: 'auto',
      justifyContent: 'flex-start',
    },
    render: ({ floor }) => floor,
  },
  locationArea: {
    label: '區域',
    style: {
      flex: 'auto',
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
      return <Checkbox checked={obstacleSensor} />;
    },
  },
  infrared: {
    label: '紅外線',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ infrared }) => {
      return <Checkbox checked={infrared} />;
    },
  },
  remoteControl: {
    label: '遙控器',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ remoteControl }) => {
      return <Checkbox checked={remoteControl} />;
    },
  },
  bounceDoor: {
    label: '彈射門',
    style: {
      width: 80,
      justifyContent: 'center',
    },
    render: ({ bounceDoor }) => {
      return <Checkbox checked={bounceDoor} />;
    },
  },
};

const keyArr: Tkey[] = [
  'itemName',
  'itemNumber',
  'floor',
  'locationArea',
  'qty',
  'doorModelName',
  'motorVendor',
  'motorVoltage',
  'horsepower',
  'obstacleSensor',
  'infrared',
  'remoteControl',
  'bounceDoor',
];
// =======================================================================
