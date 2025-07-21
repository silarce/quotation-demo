import { useState } from 'react';

import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

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
    <div className="w-full">
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
          style={{
            width: '1344px',
          }}
          // scroll={{
          //   x: '1330px',
          // }}
          onRow={(record) => {
            return {
              onClick: () => {
                setData(record);
              },
            };
          }}
        />
      </div>
    </div>
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
  },
  {
    title: '客戶名稱',
    dataIndex: 'customerName',
    width: 250,
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
  },
];

// ===========================================================================
const fakeData: TfakeData[] = [
  {
    id: '1',
    quotationNumber: 'Q12345',
    contractNumber: 'C67890',
    projectName: 'Project Alpha',
    customerName: 'Customer A',
    pirce: 1000,
    tax: 50,
    currency: 'USD',
    attachment: 'file1.pdf',
  },
  {
    id: '2',
    quotationNumber: 'Q54321',
    contractNumber: 'C09876',
    projectName: 'Project Beta',
    customerName: 'Customer B',
    pirce: 2000,
    tax: 100,
    currency: 'EUR',
    attachment: 'file2.pdf',
  },
  {
    id: '3',
    quotationNumber: 'Q11223',
    contractNumber: 'C44556',
    projectName: 'Project Gamma',
    customerName: 'Customer C',
    pirce: 1500,
    tax: 75,
    currency: 'GBP',
    attachment: 'file3.pdf',
  },
  {
    id: '4',
    quotationNumber: 'Q33445',
    contractNumber: 'C66778',
    projectName: 'Project Delta',
    customerName: 'Customer D',
    pirce: 2500,
    tax: 125,
    currency: 'JPY',
    attachment: 'file4.pdf',
  },
  {
    id: '5',
    quotationNumber: 'Q55667',
    contractNumber: 'C88990',
    projectName: 'Project Epsilon',
    customerName: 'Customer E',
    pirce: 3000,
    tax: 150,
    currency: 'AUD',
    attachment: 'file5.pdf',
  },
  {
    id: '6',
    quotationNumber: 'Q77889',
    contractNumber: 'C00112',
    projectName: 'Project Zeta',
    customerName: 'Customer F',
    pirce: 1800,
    tax: 90,
    currency: 'CAD',
    attachment: 'file6.pdf',
  },
  {
    id: '7',
    quotationNumber: 'Q99001',
    contractNumber: 'C22334',
    projectName: 'Project Eta',
    customerName: 'Customer G',
    pirce: 2200,
    tax: 110,
    currency: 'CHF',
    attachment: 'file7.pdf',
  },
  {
    id: '8',
    quotationNumber: 'Q11222',
    contractNumber: 'C44567',
    projectName: 'Project Theta',
    customerName: 'Customer H',
    pirce: 2700,
    tax: 135,
    currency: 'NZD',
    attachment: 'file8.pdf',
  },
  {
    id: '9',
    quotationNumber: 'Q33456',
    contractNumber: 'C78901',
    projectName: 'Project Iota',
    customerName: 'Customer I',
    pirce: 3200,
    tax: 160,
    currency: 'SEK',
    attachment: 'file9.pdf',
  },
  {
    id: '10',
    quotationNumber: 'Q55678',
    contractNumber: 'C12345',
    projectName: 'Project Kappa',
    customerName: 'Customer J',
    pirce: 4000,
    tax: 200,
    currency: 'NOK',
    attachment: 'file10.pdf',
  },
];
