import classNames from 'classnames';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { TdataEntrycontainerProps, Input, InputSelect } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { modal_delete } from 'components/global/gear/modal/fongModal';

import Icon_trash from 'public/image/icon/fong/trash.svg';

import {
  Tinstance_salesOrderItemArr,
  Tstate,
  checkIsAllowCustom,
} from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';

import { useApiGetProductProfileList } from 'js/api/api_netCore/api_salesOrder';

// ============================================================================

type Tinstance_useApiGetProductProfileList = ReturnType<typeof useApiGetProductProfileList>;
type Toptions_productProfile = Tinstance_useApiGetProductProfileList['options'];

// ============================================================================

const SalesOrderItemList = ({
  instance_salesOrderItemArr,
  className,
}: {
  instance_salesOrderItemArr: Tinstance_salesOrderItemArr;
  className?: string;
}) => {
  const { options } = useApiGetProductProfileList();

  const { state, dispatch, reset } = instance_salesOrderItemArr;

  const columns = createColoumns(instance_salesOrderItemArr, options);

  const handle_add = () => {
    dispatch({ type: 'add' });
  };

  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold ">銷貨明細</div>
        <Btn theme="add" onClick={handle_add}>
          新增
        </Btn>
      </div>
      <Table_antd
        dataSource={state}
        columns={columns}
        scroll={{
          y: 400,
        }}
        pagination={false}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

// ===========================================================================

const createColoumns = (instance_salesOrderItemArr: Tinstance_salesOrderItemArr, options: Toptions_productProfile) => {
  const { dispatch, setProduct_custom, setUnitPrice, setProduct } = instance_salesOrderItemArr;

  const columns: TableProps<Tstate>['columns'] = [
    {
      dataIndex: 'productName',
      title: '產品名稱',
      width: 200,
      render: (v, _, index) => (
        <MyDataEntry showBorder={true}>
          {
            <InputSelect
              options={options}
              value={v}
              inputProps={{
                onChange: (e) => {
                  const value = e.currentTarget.value;
                  setProduct_custom(index, value);
                },
              }}
              selectProps={{
                menuPortalTarget: document.body,
                onChange: (option) => {
                  if (!option) {
                    dispatch({
                      type: 'productName',
                      payload: { index: index, productName: '' },
                    });

                    return;
                  }

                  const { label, raw } = option;

                  setProduct(index, {
                    productId: raw.id,
                    productName: label,
                    productNumber: raw.productNumber,
                    price: raw.price,
                  });
                },
              }}
            />
          }
        </MyDataEntry>
      ),
    },
    {
      dataIndex: 'productNumber',
      title: '產品代號',
      width: 150,
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
      render: (value, record, index) => {
        const isAllowCustom = checkIsAllowCustom(record.productNumber);

        return (
          <MyDataEntry showBorder={isAllowCustom}>
            <Input
              type="number"
              className="text-right"
              readOnly={!isAllowCustom}
              value={value}
              onChange={(e) => {
                const value = e.currentTarget.value as `${number}` | '';
                setUnitPrice(index, value);
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
                modal_delete({
                  title: '確認刪除嗎？',
                  content: null,
                  onConfirm: () => {
                    dispatch({ type: 'delete', payload: { index } });
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
