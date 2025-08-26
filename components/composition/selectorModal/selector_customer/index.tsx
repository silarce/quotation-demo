import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps, metaToPageProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';

import { TgetCustomerList_Dto, useApiGetCustomerList } from 'js/api/api_netCore/api_salesOrder';

// ===========================================================================

interface Tprops {
  onConfirm?: (customer: TgetCustomerList_Dto[]) => void;
  onCancel?: () => void;
  limit?: number;
}

// ===========================================================================

function Selector_customer({ onConfirm, onCancel, limit = 1 }: Tprops) {
  const [page, setPage] = useState(1);

  const [state_filter, setState_filter] = useState('');

  const params = useMemo(() => {
    return {
      page,
      pageSize: 10,
      filter: state_filter,
    };
  }, [page, state_filter]);

  const { data, meta, update } = useApiGetCustomerList({ params });
  const [selected, setSelected] = useState<TgetCustomerList_Dto[]>([]);

  // --------------------------------------------------------------------------
  const onRowClick = (record: TgetCustomerList_Dto) => {
    if (limit === 1) {
      setSelected([record]);
    }

    const isExist = selected?.some((item) => item.id === record.id);

    if (isExist) {
      setSelected(selected.filter((item) => item.id !== record.id));
    } else if (selected.length < limit) {
      setSelected([...selected, record]);
    }
  };

  const handle_confirm = () => {
    onConfirm && onConfirm(selected);
  };

  const handle_cancel = () => {
    onCancel && onCancel();
  };

  // --------------------------------------------------------------------------

  const pagenation = meta && metaToPageProps(meta);

  useEffect(() => {
    update();
  }, [params]);

  return (
    <Container_confirm
      topRight={
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setState_filter(e.currentTarget.filter.value);
          }}
        >
          <DataEntry_fong>
            <Input name="filter" />
          </DataEntry_fong>
          <Btn theme="query">搜尋</Btn>
        </form>
      }
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn theme="save" onClick={handle_confirm}>
            儲存
          </Btn>
        </>
      }
    >
      <Table_antd
        columns={columns}
        dataSource={data}
        rowHoverable={false}
        onRow={(record) => ({
          className: classNames(' cursor-pointer', selected?.some((item) => item.id === record.id) && 'bg-blue05'),
          onClick: () => {
            onRowClick(record);
          },
        })}
        // scroll={{
        //   y: 600,
        // }}
        pagination={{
          ...pagenation,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </Container_confirm>
  );
}

// ===========================================================================

const selector_customer = (props?: Tprops) => {
  return modal_empty({
    width: 1200,
    content: <Selector_customer {...props} />,
  });
};

// ===========================================================================

const columns: TableProps<TgetCustomerList_Dto>['columns'] = [
  {
    title: '客戶編號',
    dataIndex: 'customerNumber',
    width: 100,
  },
  {
    title: '客戶名稱',
    dataIndex: 'name',
  },
  {
    title: '統一編號',
    dataIndex: 'taxId',
    width: 100,
  },
  {
    title: '電話',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '傳真',
    dataIndex: 'fax',
    width: 150,
  },
];

export default Selector_customer;
export { selector_customer };
