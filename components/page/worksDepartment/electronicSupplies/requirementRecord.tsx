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
// import scss from './receivedHistory.module.scss';
import scss_p from './_public.module.scss';

import type { TelectronicSuppliesRequirementRecordDto } from 'js/api/dtoTypes';

type Tquery = {
  contractId: string | undefined;
};

// ==================================================================
export default function RequirementRecord({
  requirementRecords,
}: {
  requirementRecords: TelectronicSuppliesRequirementRecordDto[];
}) {
  const router = useRouter();
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

    const tbodyRowArr: Ttable['tbody']['rowArr'] = requirementRecords.map((item, index) => {
      const { id, operationDate, agentEmployee, requirementRecordDetails = [] } = item;

      const qty = requirementRecordDetails?.reduce((qty, item) => {
        return new Decimal(qty).add(item.quantity || 0).toNumber();
      }, 0);

      return {
        cellArr: [
          {
            ...configList.indexNumber,
            children: index + 1,
          },
          {
            ...configList.date,
            children: getTaiwanDateStr(operationDate),
          },
          {
            ...configList.requestEmployee,
            children: '未串接',
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
                  pathname: router.pathname + '/editRequirement',
                  query: {
                    requirementRecordId: id,
                    contractId,
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
  }, []);

  // ------------------------------------------------------------------
  return <Table01 {...control_table} className={classNames(scss_p.table)} />;
}

// ==================================================================

const keysArr = [
  //
  'indexNumber',
  'date', // 領料日期
  'requestEmployee', // 領料人員
  'doorModelName',
  'qty',
  'materialHandler', // 備料人員
  'btn',
];

const configList: { [key: string]: Tconfig_table } = {
  indexNumber: {
    label: '流水號',
    flex: '80px',
  },
  date: {
    label: '新增日期',
    flex: '20%',
  },
  requestEmployee: {
    label: '新增人員',
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
