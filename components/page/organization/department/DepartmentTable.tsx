import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { DetailItem } from './type';
import scss from 'components/global/myCom/myTable/table.module.scss';

interface Props {
  data: DetailItem[];
  onEdit: (record: DetailItem) => void;
  onDelete: (id: string) => void;
}

const DepartmentTable = ({ data, onEdit, onDelete }: Props) => {
  const columns: ColumnsType<DetailItem> = [
    {
      title: '部門代號',
      dataIndex: 'dep_code',
      key: 'dep_code',
    },
    {
      title: '部門名稱',
      dataIndex: 'dep_ch_name',
      key: 'dep_ch_name',
    },
    {
      title: '部門英文名稱',
      dataIndex: 'dep_en_name',
      key: 'dep_en_name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '狀態',
      dataIndex: 'is_invalid',
      key: 'is_invalid',
      align: 'center',
      render: (_, { is_invalid }) => {
        const status = is_invalid ? '停用' : '啟動';
        const styles: Record<string, React.CSSProperties> = {
          啟動: {
            backgroundColor: '#D1FAE5',
            color: '#10B981',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'inline-block',
            fontWeight: 'bold',
          },
          停用: {
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'inline-block',
            fontWeight: 'bold',
          },
        };

        return <span style={styles[status]}>{status}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            onClick={() => onEdit(record)}
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            onClick={() => onDelete(record.key)}
            style={{ cursor: 'pointer' }}
            width={16}
            height={16}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      className={scss.customTable}
      columns={columns}
      dataSource={data}
      rowKey="key"
      bordered
      style={{ minWidth: '50%' }}
    />
  );
};

export default DepartmentTable;
