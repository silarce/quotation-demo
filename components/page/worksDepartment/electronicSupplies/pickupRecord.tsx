import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';

// gear
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import type { TelectronicSuppliesPickupRecordDto } from 'js/api/dtoTypes';

// ==================================================================

type Tquery = {
  contractId: string | undefined;
};

// ==================================================================
export default function PickupRecord({
  className,
  pickupRecords,
}: {
  className?: string;
  pickupRecords: TelectronicSuppliesPickupRecordDto[];
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId } = router.query as Tquery;
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
      const {
        //
        id,
        operationDate,
        takeOffEmployee,
        totalQuantity,
        // action,
        // pickupRecordDetails = [],
        doorModel,
        preparationEmployee,
        number: idNumber,
      } = item;

      return {
        cellArr: [
          {
            ...configList.idNumber,
            children: idNumber,
          },
          {
            ...configList.date,
            children: getTaiwanDateStr(operationDate),
          },
          {
            ...configList.ingredientTechnician,
            children: takeOffEmployee?.chName ?? '---',
          },
          {
            ...configList.doorModelName,
            children: doorModel,
          },
          {
            ...configList.qty,
            children: totalQuantity,
          },
          {
            ...configList.materialHandler,
            children: preparationEmployee?.chName ?? '---',
          },
          {
            width: 100,
            children: (
              <Link
                href={{
                  pathname: router.pathname + '/editPickup',
                  query: {
                    ...query,
                    contractId: contractId, // 確保要有contractId
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

  return <Table01 {...control_table} className={classNames(className)} />;
}

// ==================================================================

const keysArr = [
  //
  'idNumber',
  'date', // 領料日期
  'ingredientTechnician', // 領料人員
  'doorModelName',
  'qty',
  'materialHandler', // 備料人員
  'btn',
];

const configList: { [key: string]: Tconfig_table } = {
  idNumber: {
    label: '領料單號',
    width: 150,
  },
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
