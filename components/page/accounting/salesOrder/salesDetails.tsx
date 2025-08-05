import { useState, useEffect, useReducer } from 'react';
import Decimal from 'decimal.js';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { TdataEntrycontainerProps, DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

const SalesDetails = ({ className }: { className?: string }) => {
  const [state, dispatch] = useReducer(reducer, undefined);

  const columns = createColumns({
    state,
    dispatch,
  });

  return (
    <div className={className}>
      <div className="text-xl font-semibold mb-6">銷貨明細</div>
      <Table_antd
        dataSource={fakeData}
        columns={columns}
        scroll={{
          y: 400,
        }}
      />
    </div>
  );
};

// ===========================================================================

interface Tstate {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  qty: `${number}` | '';
  price: `${number}` | '';
  totalPrice: number;
}

type Taction =
  | {
      type: 'set';
      payload: Tstate;
    }
  | {
      type: 'price';
      payload: {
        price: `${number}` | '';
      };
    }
  | {
      type: 'qty';
      payload: {
        qty: `${number}` | '';
      };
    }
  | {
      type: 'clear';
      payload?: undefined;
    };

const reducer = (state: Tstate | undefined, action: Taction): Tstate | undefined => {
  if (action.type === 'set') {
    return action.payload;
  }

  if (!state) {
    return state;
  }

  switch (action.type) {
    case 'price': {
      const price = action.payload.price;
      const qty = state.qty || 0;
      const totalPrice = new Decimal(price || 0).mul(qty).toNumber();

      return { ...state, price, totalPrice };
    }

    case 'qty': {
      const qty = action.payload.qty;
      const price = state.price || 0;
      const totalPrice = new Decimal(price).mul(qty || 0).toNumber();

      return { ...state, qty, totalPrice };
    }

    case 'clear': {
      return undefined;
    }

    default:
      return state;
  }
};

// ===========================================================================

const MyDataEntry = ({ fontSize = 14, ...props }: TdataEntrycontainerProps) => {
  return <DataEntry fontSize={fontSize} {...props} />;
};

// ===========================================================================

const createColumns = ({ state, dispatch }: { state: Tstate | undefined; dispatch: React.Dispatch<Taction> }) => {
  const columns: TableProps<TfakeData>['columns'] = [
    {
      dataIndex: 'serialNumber',
      title: '序號',
      align: 'center',
      width: 80,
      render: (v) => <MyDataEntry showBorder={false}>{v}</MyDataEntry>,
    },
    {
      dataIndex: 'idNumber',
      title: '產品代號',
      width: 120,
      render: (v) => <MyDataEntry showBorder={false}>{v}</MyDataEntry>,
    },
    {
      dataIndex: 'name',
      title: '產品名稱',
      width: 150,
      render: (v) => <MyDataEntry showBorder={false}>{v}</MyDataEntry>,
    },
    {
      dataIndex: 'qty',
      title: '數量',
      align: 'right',
      width: 150,
      render: (text, record) => {
        if (state?.id !== record.id) {
          return <MyDataEntry showBorder={false}>{text}</MyDataEntry>;
        }

        return (
          <MyDataEntry showBorder={true}>
            <Input
              type="number"
              className="text-right "
              value={state.qty}
              onChange={(e) => {
                const value = e.currentTarget.value as `${number}` | '';
                dispatch({ type: 'qty', payload: { qty: value } });
              }}
            />
          </MyDataEntry>
        );
      },
    },
    {
      dataIndex: 'price',
      title: '單價',
      align: 'right',
      width: 150,
      render: (text, record) => {
        if (record.id !== state?.id) {
          return <MyDataEntry showBorder={false}>{'$' + text.toLocaleString()}</MyDataEntry>;
        }

        return (
          <MyDataEntry showBorder={true}>
            <Input
              type="number"
              className="text-right"
              value={state.price}
              onChange={(e) => {
                const value = e.currentTarget.value as `${number}` | '';
                dispatch({ type: 'price', payload: { price: value } });
              }}
            />
          </MyDataEntry>
        );
      },
    },
    {
      dataIndex: 'totalPrice',
      title: '金額',
      align: 'right',
      width: 150,

      render: (v, record) => {
        const value = record.id !== state?.id ? v : state.totalPrice;

        return <MyDataEntry showBorder={false}>{'$' + value.toLocaleString()}</MyDataEntry>;
      },
    },
    {},
    {
      key: 'panel',
      title: '操作',
      align: 'center',
      width: 100,
      render: (_, record) => {
        let node: React.ReactNode = null;

        if (state?.id === record.id) {
          node = (
            <div className="flex gap-[16px] justify-center">
              <Icon_cancel
                className="w-[16px] h-[16px] text-red01 cursor-pointer"
                onClick={() => {
                  dispatch({ type: 'clear' });
                }}
              />
              <Icon_check className="w-[16px] h-[16px] blue01 cursor-pointer" />
            </div>
          );
        } else {
          node = (
            <div className="flex gap-[16px] justify-center">
              <Icon_note
                className="w-[16px] h-[16px] text-blue01 cursor-pointer"
                onClick={() => {
                  if (record.id === state?.id) {
                    dispatch({ type: 'clear' });
                  } else {
                    dispatch({
                      type: 'set',
                      payload: {
                        ...record,
                        price: `${record.price}`,
                        qty: `${record.qty}`,
                        totalPrice: record.totalPrice,
                      },
                    });
                  }
                }}
              />
              <Icon_trash className="w-[16px] h-[16px] text-red01 cursor-pointer" />
            </div>
          );
        }

        return node;
      },
    },
  ];

  return columns;
};

// ===========================================================================

interface TfakeData {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
}

const fakeData: TfakeData[] = Array.from({ length: 50 }, (_, index) => ({
  id: `id-${index}`,
  serialNumber: `${index + 1}`,
  idNumber: `ID-${index + 1}`,
  name: `商品 ${index + 1}`,
  qty: Math.floor(Math.random() * 100) + 1,
  price: 9999,
  totalPrice: 9899999,
}));

export default SalesDetails;
