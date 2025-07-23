import { useState } from 'react';
import classNames from 'classnames';

import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';

import { Container_confirm } from 'components/global/container/modal';

import Icon_query from 'public/image/icon/fong/query.svg';

import scss from './index.module.scss';

export default function Selector_searchSomething({
  onConfirm,
  onCancel,
}: {
  onConfirm?: (data: TfakeData) => void;
  onCancel?: () => void;
}) {
  const [contractNumber, setContractNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [projectName, setProjectName] = useState('');

  const [data, setData] = useState<TfakeData>();

  return (
    <Container_confirm
      title="查詢資料"
      footerLeft={
        <div>
          <div>合約總金額</div>
          <div className=" mt-[21.5px] ml-3">$99999</div>
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
          dataSource={fakeData}
          rowHoverable={false}
          style={{
            width: '1360px',
          }}
          scroll={{
            // x: '1330px',
            y: 450,
          }}
          rowClassName={(record) => {
            return classNames(scss.row, record.id === data?.id && scss.active);
          }}
          onRow={(record) => ({
            onClick: () => {
              setData(record);
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

const columns: TableProps<TfakeData>['columns'] = [
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
    dataIndex: 'pirce',
    width: 150,
  },
  {
    title: '稅金',
    dataIndex: 'tax',
    width: 150,
  },
  {
    title: '幣別',
    dataIndex: 'currency',
    width: 80,
  },
  {
    title: '追加減',
    dataIndex: 'attachment',
    width: 150,
    className: 'whitespace-pre-wrap ',
  },
];

// ===========================================================================
const createFakeData = (count: number): TfakeData[] => {
  const data: TfakeData[] = [];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK'];

  for (let i = 1; i <= count; i++) {
    const price = Math.floor(Math.random() * 5000) + 1000;
    data.push({
      id: `${i}`,
      quotationNumber: `Q${String(10000 + i).padStart(5, '0')}`,
      contractNumber: `C${String(50000 + i).padStart(5, '0')}`,
      projectName: `專案 ${String.fromCharCode(65 + ((i - 1) % 26))}-${Math.floor((i - 1) / 26) + 1}`, // 專案 A-1, B-1...
      customerName: `客戶 ${String.fromCharCode(65 + ((i - 1) % 26))}`, // 客戶 A, B...
      pirce: price,
      tax: Math.round(price * 0.05),
      currency: currencies[(i - 1) % currencies.length],
      attachment: `追加50000\n追減30000\n變更10000`,
    });
  }

  return data;
};

// 使用函式建立 20 筆假資料
const fakeData: TfakeData[] = createFakeData(20);
