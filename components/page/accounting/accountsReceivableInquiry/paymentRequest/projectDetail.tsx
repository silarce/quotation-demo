import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import DataEntry, { Input_money } from 'components/global/gear/dataEntry';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

// =============================================================================

type TsalesOrderItemArr = Tres_apiGetARPaymentData['salesOrder']['salesOrderItems'];

type TsalesOrderItem = TsalesOrderItemArr[number];

type Tstate = Omit<
  TsalesOrderItem,
  '' // 待api新增本期完成與本期金額的property
> & {
  completedInThisPeriod: `${number}` | ''; // 待api新增本期完成的property
  amountInThisPeriod: number | null; // 待api新增本期完成的property
};

// =============================================================================

// MARK: START

const ProjectDetail = ({
  allowEdit = false,
  data,
  className,
}: {
  allowEdit?: boolean;
  data: TsalesOrderItemArr | undefined;
  className?: string;
}) => {
  const { stateArr, setCompletedInThisPeriod, reset } = useSalesOrderItemArr(data);

  const columns_projectDetail: TableProps<Tstate>['columns'] = [
    {
      title: '項目',
      dataIndex: 'itemNumber',
      width: 80,
    },
    {
      title: '尺寸 noProperty',
      dataIndex: 'size',
      width: 200,
      render: () => 'no property',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: '合約單價',
      dataIndex: 'unitPrice',
      width: 150,
    },
    {
      title: '前期已完成 noProperty',
      dataIndex: 'completedInLastPeriod',
      width: 150,

      render: () => 'no property',
    },
    {
      title: '本期完成 noProperty',
      dataIndex: 'completedInThisPeriod',
      width: 150,
      render: (v, record, index) => {
        return (
          <DataEntry showBorder={allowEdit} fontSize={14}>
            <Input_money
              readOnly={!allowEdit}
              value={v}
              onChange={(e) => {
                setCompletedInThisPeriod(index, e.target.value as `${number}` | '');
              }}
            />
          </DataEntry>
        );
      },
    },
    {
      title: '本期金額 noProperty',
      dataIndex: 'amountInThisPeriod',
      width: 150,
      align: 'right',
      render: (v) => toLocalString(v),
    },
    {
      title: '合計 noProperty',
      dataIndex: 'totalAmount',
      width: 100,
    },
    {},
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-8">工程項目明細</div>
      <Table_antd className={className} columns={columns_projectDetail} dataSource={stateArr} />
    </div>
  );
};

// MARK: END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const useDefaultState = (rawData: TsalesOrderItemArr | undefined | null): Tstate[] => {
  return useMemo(() => {
    return (rawData ?? []).map((item) => ({
      ...item,
      completedInThisPeriod: '',
      amountInThisPeriod: null,
    }));
  }, [rawData]);
};

const useSalesOrderItemArr = (rawData: TsalesOrderItemArr | undefined | null) => {
  const defaultState = useDefaultState(rawData);

  const [stateArr, setStateArr] = useState<Tstate[]>(defaultState);

  const setCompletedInThisPeriod = (index: number, value: `${number}` | '') => {
    const copy = { ...stateArr[index] };
    const unitPrice = copy.unitPrice || 0;

    copy.completedInThisPeriod = value;
    copy.amountInThisPeriod = new Decimal(value || 0).mul(unitPrice).toDecimalPlaces(0).toNumber();

    setStateArr((prev) => {
      const newState = [...prev];
      newState[index] = copy;

      return newState;
    });
  };

  const reset = () => {
    setStateArr(defaultState);
  };

  useEffect(() => {
    setStateArr(defaultState);
  }, [defaultState]);

  return {
    stateArr,
    setCompletedInThisPeriod,
    reset,
  };
};

// ============================================================================

const toLocalString = (value: number | null) => {
  if (value === null) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// ====================================================================
// ====================================================================

export default ProjectDetail;
