import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import _ from 'lodash';

// gear
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import type { TelectronicSuppliesRequirementRecordDto } from 'js/api/dtoTypes';
import type { TelectronicSuppliesRequirementRecordDto_addition } from 'js/api/api_engineering';

type Tquery = {
  contractId: string | undefined;
};

// ==================================================================
export default function RequirementRecord({
  className,
  requirementRecords,
}: {
  className?: string;
  requirementRecords: TelectronicSuppliesRequirementRecordDto_addition[];
}) {
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  // ------------------------------------------------------------------

  const control_table = useMemo(() => {
    const requirementRecords_ordered = _.sortBy(requirementRecords, 'number').reverse();

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

    const tbodyRowArr: Ttable['tbody']['rowArr'] = requirementRecords_ordered.map((item, index) => {
      const {
        //
        id,
        operationDate,
        agentEmployee,
        requirementRecordDetails = [],
        quantity,
        doorType,
        storageManagementPersonnelEmployee,
        number: idNumber,
        addition: { doorTypeArr },
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
            ...configList.requestEmployee,
            children: agentEmployee?.chName,
          },
          {
            ...configList.doorModelName,
            children: doorTypeArr?.join('、'),
          },
          {
            ...configList.qty,
            children: quantity,
          },
          {
            ...configList.materialHandler,
            children: storageManagementPersonnelEmployee?.chName || '---',
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
  }, [requirementRecords]);

  // ------------------------------------------------------------------
  return <Table01 {...control_table} className={classNames(className)} />;
}

// ==================================================================

const keysArr = [
  //
  'idNumber',
  'date', // 領料日期
  'requestEmployee', // 領料人員
  'doorModelName',
  'qty',
  'materialHandler', // 備料人員
  'btn',
];

const configList: { [key: string]: Tconfig_table } = {
  idNumber: {
    label: '需求單號',
    // flex: '150px',
    width: 150,
  },
  date: {
    label: '新增日期',
    // flex: '20%',
    width: 150,
  },
  requestEmployee: {
    label: '新增人員',
    // flex: '20%',
    width: 150,
  },
  doorModelName: {
    label: '門型',
    flex: 'auto',
    justifyContent: 'flex-start',
  },
  qty: {
    label: '樘數',
    // flex: '20%',
    width: 80,
  },
  materialHandler: {
    label: '備料人員',
    // flex: '20%',
    width: 150,
  },
  btn: {
    width: 100,
  },
};
