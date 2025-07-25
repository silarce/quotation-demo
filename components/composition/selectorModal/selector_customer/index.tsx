import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps, metaToPageProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { modal_empty } from 'components/global/gear/modal/fongModal';

import { useCustomers, TcustomerDto } from 'js/api/api_customer';

// ===========================================================================

interface Tprops {
  onConfirm?: (customer: TcustomerDto[]) => void;
  onCancel?: () => void;
  limit?: number;
}

// ===========================================================================

function Selector_customer({ onConfirm, onCancel, limit = 1 }: Tprops) {
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    return {
      page,
    };
  }, [page]);

  const { data, meta, update } = useCustomers(params);

  const [selected, setSelected] = useState<TcustomerDto[]>([]);

  // --------------------------------------------------------------------------
  const onRowClick = (record: TcustomerDto) => {
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
    width: 710,
    content: <Selector_customer {...props} />,
  });
};

// ===========================================================================

const columns: TableProps<TcustomerDto>['columns'] = [
  {
    title: '客戶編號',
    dataIndex: 'customerNumber',
    width: 250,
    align: 'right',
  },
  {
    title: '客戶名稱',
    dataIndex: 'name',
    width: 250,
    align: 'right',
  },
  {
    title: '統一編號',
    dataIndex: 'taxId',
    width: 152,
    align: 'right',
  },
];

export default Selector_customer;
export { selector_customer };
