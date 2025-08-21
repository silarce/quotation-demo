import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { TdataEntrycontainerProps, DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

import {
  Tinstance_salesOrderItemArr,
  Tstate,
  Taction_salsesOrderItem,
} from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';

// ============================================================================

const SalesOrderItemList = ({
  instance_salesOrderItemArr,
  className,
}: {
  instance_salesOrderItemArr: Tinstance_salesOrderItemArr;
  className?: string;
}) => {
  const { state, dispatch, reset } = instance_salesOrderItemArr;

  const columns = createColoumns(dispatch);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold ">銷貨明細</div>
        <Btn theme="add">新增</Btn>
      </div>
      <Table_antd
        dataSource={state}
        columns={columns}
        scroll={{
          y: 400,
        }}
      />
    </div>
  );
};

// ===========================================================================

const createColoumns = (dispatch: React.ActionDispatch<[action: Taction_salsesOrderItem]>) => {
  const columns: TableProps<Tstate>['columns'] = [
    {
      key: 'salesOrderNumber',
      title: '序號',

      width: 120,
      render: (_, { raw: { salesOrderNumber } }) => <MyDataEntry showBorder={false}>{salesOrderNumber}</MyDataEntry>,
    },
    {
      key: 'productNumber',
      title: '產品代號',
      width: 120,
      render: (_, { raw: { productNumber } }) => <MyDataEntry showBorder={false}>{productNumber}</MyDataEntry>,
    },
    {
      key: 'productName',
      title: '產品名稱',
      width: 150,
      render: (_, { raw: { productName } }) => <MyDataEntry showBorder={false}>{productName}</MyDataEntry>,
    },
    {
      dataIndex: 'quantity',
      title: '數量',
      width: 80,
      render: (value, _, index) => {
        return (
          <MyDataEntry showBorder={true}>
            <Input
              type="number"
              value={value}
              onChange={(e) => {
                const value = e.currentTarget.value as `${number}` | '';
                dispatch({ type: 'quantity', payload: { index, quantity: value } });
              }}
            />
          </MyDataEntry>
        );
      },
    },
    {
      dataIndex: 'unitPrice',
      title: '單價',
      align: 'right',
      width: 150,
      render: (value, _, index) => {
        return (
          <MyDataEntry showBorder={true}>
            <Input
              type="number"
              className="text-right"
              value={value}
              onChange={(e) => {
                const value = e.currentTarget.value as `${number}` | '';
                dispatch({ type: 'unitPrice', payload: { index, unitPrice: value } });
              }}
            />
          </MyDataEntry>
        );
      },
    },
    {
      dataIndex: 'amount',
      title: '金額',
      align: 'right',
      width: 150,

      render: (value) => {
        return <MyDataEntry showBorder={false}>{'$' + value.toLocaleString()}</MyDataEntry>;
      },
    },
    {},
    {
      key: 'panel',
      title: '操作',
      align: 'center',
      width: 100,
      render: (_, __, index) => {
        return (
          <div className="flex gap-[16px] justify-center">
            <Icon_trash
              className="w-[16px] h-[16px] text-red01 cursor-pointer"
              onClick={() => {
                myAlert.confirm({
                  title: '確定刪除?',
                  props: {
                    onOk() {
                      dispatch({ type: 'delete', payload: { index } });
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

// ===========================================================================

const MyDataEntry = ({ fontSize = 14, ...props }: TdataEntrycontainerProps) => {
  return <DataEntry fontSize={fontSize} {...props} />;
};

// ===========================================================================

export default SalesOrderItemList;
