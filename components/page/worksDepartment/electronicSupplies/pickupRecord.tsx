import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// gear
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './pickupRecord.module.scss';
import scss_p from './_public.module.scss';

import type { TelectronicSuppliesPickupRecordDto } from 'js/api/dtoTypes';

export default function PickupRecord({ pickupRecords }: { pickupRecords: TelectronicSuppliesPickupRecordDto[] }) {
  const router = useRouter();
  // ------------------------------------------------------------------

  const control_table = useMemo(() => {
    //
    const thead: Ttable['thead'] = {
      cellArr: keysArr.map((key) => {
        return {
          ...configList[key],
          children: configList[key].label,
        };
      }),
    };
    //

    const tbodyRowArr: Ttable['tbody']['rowArr'] = pickupRecords.map((item) => {
      const { id, operationDate, takeOffEmployee, action, pickupRecordDetails = [] } = item;

      const qty = pickupRecordDetails?.reduce((qty, item) => {
        return new Decimal(qty).add(item.quantity || 0).toNumber();
      }, 0);

      return {
        cellArr: [
          {
            ...configList.date,
            children: getTaiwanDateStr(operationDate),
          },
          {
            ...configList.ingredientTechnician,
            children: takeOffEmployee?.chName ?? '',
          },
          {
            ...configList.doorModelName,
            children: '未串接',
          },
          {
            ...configList.qty,
            children: qty,
          },
          {
            ...configList.materialHandler,
            children: '未串接',
          },
          {
            width: 100,
            children: (
              <Link
                href={{
                  pathname: router.pathname + '/editPickupRecord',
                  query: {
                    pickupRecordId: id,
                  },
                }}
              >
                <IconDetail />
              </Link>
            ),
          },
        ],
      };
    }); // tbodyRowArr close

    const tbody: Ttable['tbody'] = {
      rowArr: tbodyRowArr,
    };

    return { thead, tbody };
  }, [pickupRecords]);
  // ------------------------------------------------------------------

  return <Table01 {...control_table} className={classNames(scss_p.table)} />;
}

// ==================================================================

const keysArr = [
  //
  'date', // 領料日期
  'ingredientTechnician', // 領料人員
  'doorModelName',
  'qty',
  'materialHandler', // 備料人員
  'btn',
];

const configList: { [key: string]: Tconfig_table } = {
  date: {
    label: '領料日期',
    flex: '20%',
  },
  ingredientTechnician: {
    label: '領料人員',
    flex: '20%',
  },
  doorModelName: {
    label: '門型',
    flex: '20%',
  },
  qty: {
    label: '樘數',
    flex: '20%',
  },
  materialHandler: {
    label: '備料人員',
    flex: '20%',
  },
  btn: {
    width: 100,
  },
};
