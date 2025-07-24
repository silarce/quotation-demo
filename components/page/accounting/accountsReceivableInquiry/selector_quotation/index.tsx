import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps, metaToPageProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';

import { Container_confirm } from 'components/global/container/modal';

import Icon_query from 'public/image/icon/fong/query.svg';

import { useApiGetQuotationList, TquotationListViewModel_Dto } from 'js/api/api_netCore/api_accountsReceivable';

import { useDebounce } from 'hooks/useDebounce';

import scss from './index.module.scss';

// ==========================================================================

interface Tprops {
  onConfirm?: (customer: TquotationListViewModel_Dto[]) => void;
  onCancel?: () => void;
  limit?: number;
}

// ==========================================================================
export default function Selector_quotation({ onConfirm, onCancel, limit = 1 }: Tprops) {
  const [page, setPage] = useState(1);

  const [contractNumber, setContractNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [projectName, setProjectName] = useState('');

  const { debouncedState: params_search } = useDebounce(
    useMemo(() => {
      return {
        contractNumber,
        customerName,
        quotationNumber,
        projectName,
      };
    }, [contractNumber, customerName, quotationNumber, projectName]),
    200
  );

  const params = useMemo(() => {
    return {
      page,
      ...params_search,
    };
  }, [page, params_search]);

  const { data: raw, meta } = useApiGetQuotationList(params);

  const [selected, setSelected] = useState<TquotationListViewModel_Dto[]>([]);

  // ------------------------------------------------------------------
  const onRowClick = (record: TquotationListViewModel_Dto) => {
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
    // onConfirm && onConfirm();
  };

  const handle_cancel = () => {
    onCancel && onCancel();
  };

  // ------------------------------------------------------------------

  const pagination = meta && metaToPageProps(meta);

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // MARK: RENDER
  return (
    <Container_confirm
      title="查詢資料"
      footerLeft={
        <div>
          <div>合約總金額</div>
          <div className=" mt-[21.5px] ml-3">$??????</div>
        </div>
      }
      footerRight={
        <>
          <Btn>取消</Btn>
          <Btn theme="save">儲存</Btn>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-fong">
        <DataEntry_fong caption="合約編號">
          <div className={scss.container}>
            <Input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} />
            <Icon_query />
          </div>
        </DataEntry_fong>
        <DataEntry_fong caption="客戶名稱">
          <div className={scss.container}>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Icon_query />
          </div>
        </DataEntry_fong>
        <DataEntry_fong caption="報價編號">
          <div className={scss.container}>
            <Input value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} />
            <Icon_query />
          </div>
        </DataEntry_fong>
        <DataEntry_fong caption="案場名稱">
          <div className={scss.container}>
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <Icon_query />
          </div>
        </DataEntry_fong>
      </div>
      <div className="mt-5">
        <Table_antd
          columns={columns}
          dataSource={raw}
          rowHoverable={false}
          pagination={{
            ...pagination,
            onChange(page) {
              setPage(page);
            },
          }}
          style={{
            width: '1360px',
          }}
          scroll={{
            y: 400,
          }}
          rowClassName={(record) =>
            classNames(' cursor-pointer', selected?.some((item) => item.id === record.id) && 'bg-blue05')
          }
          onRow={(record) => ({
            onClick: () => {
              onRowClick(record);
            },
          })}
        />
      </div>
    </Container_confirm>
  );
}

// ===========================================================================
interface TfakeData {
  id: string;
  quotationNumber: string;
  contractNumber: string;
  projectName: string;
  customerName: string;
  pirce: number;
  tax: number;
  currency: string;
  attachment: string;
}

// ===========================================================================

const columns: TableProps<TquotationListViewModel_Dto>['columns'] = [
  {
    title: '報價編號',
    dataIndex: 'quotationNumber',
    width: 150,
  },
  {
    title: '合約編號',
    dataIndex: 'contractNumber',
    width: 150,
  },
  {
    title: '案場名稱',
    dataIndex: 'projectName',
    width: 250,
    className: 'whitespace-pre-wrap',
  },
  {
    title: '客戶名稱',
    dataIndex: 'customerName',
    width: 250,
    className: 'whitespace-pre-wrap',
  },
  {
    title: '合約金額',
    dataIndex: 'total',
    width: 150,
    align: 'right',
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '稅金',
    dataIndex: 'salesTax',
    width: 150,
    align: 'right',
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '幣別',
    dataIndex: 'currency',
    width: 110,
  },
  {
    title: '追加減',
    dataIndex: 'attachment',
    width: 150,
    className: 'whitespace-pre-wrap ',
  },
];
