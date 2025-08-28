import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';

import { TgetOldContractData, useApiGetOldContractData } from 'js/api/api_netCore/api_accountsReceivable';

interface Tprops {
  onConfirm?: (oldContract: TgetOldContractData[] | null) => void;
  onCancel?: () => void;
  limit?: number;
}

export default function Selector_oldContract({ onConfirm, onCancel, limit = 1 }: Tprops) {
  const [state_filter, setState_filter] = useState('');
  const [page, setPage] = useState(1);

  const { data, meta } = useApiGetOldContractData({
    params: {
      filter: state_filter,
      page,
    },
  });

  const [selected, setSelected] = useState<TgetOldContractData[]>([]);

  const handle_select = (record: TgetOldContractData) => {
    const isExist = selected?.some((item) => item === record);

    if (isExist) {
      setSelected(selected.filter((item) => item !== record));
    } else {
      if (limit === 1) {
        setSelected([record]);
      } else {
        setSelected([...selected, record]);
      }
    }
  };

  const handle_confirm = () => {
    const v = selected.length > 0 ? selected : null;

    onConfirm && onConfirm(v);
  };

  const handle_cancel = () => {
    onCancel && onCancel();
  };

  return (
    <Container_confirm
      title="舊案場資料"
      topRight={
        <>
          <form
            className="flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setState_filter(e.currentTarget.filter.value);
              setPage(1);
            }}
          >
            <DataEntry_fong
              childrenWrapperProps={{
                className: 'w-96',
              }}
            >
              <Input name="filter" placeholder="合約編號 / 案場名稱 / 客戶編號 / 客戶名稱" />
            </DataEntry_fong>
            <Btn theme="query">搜尋</Btn>
          </form>
        </>
      }
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn theme="save" onClick={handle_confirm}>
            確定
          </Btn>
        </>
      }
    >
      <Table_antd
        dataSource={data || []}
        columns={columns}
        rowKey={'index'}
        rowHoverable={false}
        onRow={(record) => {
          return {
            onClick: () => {
              handle_select(record);
            },
            className: classNames('cursor-pointer', selected?.some((item) => item === record) && 'bg-blue05'),
          };
        }}
        pagination={{
          current: meta?.page,
          pageSize: meta?.pageSize,
          total: meta?.itemCount,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </Container_confirm>
  );
}

// ==============================================================================

const columns: TableProps<TgetOldContractData>['columns'] = [
  {
    title: '合約編號',
    dataIndex: 'contractNumber',
    width: 120,
  },
  {
    title: '案場名稱',
    dataIndex: 'projectName',
    // width: 200,
  },
  {
    title: '客戶編號',
    dataIndex: 'customerNumber',
    width: 120,
  },
  {
    title: '客戶名稱',
    dataIndex: 'customerName',
    // width: 200,
  },
];

const selector_oldContract = (props?: Tprops) => {
  return modal_empty({
    width: 1200,
    content: <Selector_oldContract {...props} />,
  });
};

export { selector_oldContract };
