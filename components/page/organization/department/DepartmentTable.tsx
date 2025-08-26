import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { DetailItem } from './type';
import scss from 'components/global/myCom/myTable/table.module.scss';
import Icon_list from 'public/image/icon/fong/procurement2.svg';
import { modal_delete } from 'components/global/gear/modal/fongModal';

interface Props {
  data: DetailItem[];
  onEdit: (record: DetailItem) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void; //新增
  total: number; //用來告訴 Table 總共有幾筆
  checkedDepartments: string[];
  onCheck: (depId: string) => void;
  onSelectAll: () => void;
}

const DepartmentTable = ({
  data,
  onEdit,
  onDelete,
  onPageChange,
  total,
  checkedDepartments,
  onCheck,
  onSelectAll,
}: Props) => {
  const columns: ColumnsType<DetailItem> = [
    {
      title: (
        <div className="flex gap-5 justify-center cursor-pointer">
          <label className={scss.checkboxWrapperTable}>
            <input
              type="checkbox"
              checked={checkedDepartments.length > 0 && checkedDepartments.length === data.length}
              onChange={onSelectAll}
              ref={(input) => {
                if (input) {
                  input.indeterminate = checkedDepartments.length > 0 && checkedDepartments.length < data.length;
                }
              }}
            />
            <span className={scss.customCheckmarkTable}></span>
          </label>
        </div>
      ),
      dataIndex: 'check_box',
      key: 'check_box',
      align: 'left',
      width: '5%',
      render: (_, record) => (
        <label className={scss.checkboxWrapperTable}>
          <input
            type="checkbox"
            checked={checkedDepartments.includes(record.key)}
            onChange={() => onCheck(record.key)}
          />
          <span className={scss.customCheckmarkTable}></span>
        </label>
      ),
    },
    {
      title: '部門代號',
      dataIndex: 'depCode',
      key: 'depCode',
      width: '6%',
    },
    {
      title: '部門名稱',
      dataIndex: 'depChName',
      key: 'depChName',
      width: '6%',
    },
    {
      title: '部門英文名稱',
      dataIndex: 'depEnName',
      key: 'depEnName',
      width: '10%',
    },
    {
      title: '部門描述',
      dataIndex: 'description',
      key: 'description',
      width: '57%',
    },
    {
      title: '狀態',
      dataIndex: 'isInvalid',
      key: 'isInvalid',
      align: 'center',
      width: '5%',
      render: (_, { isInvalid }) => {
        const status = isInvalid ? '啟動' : '停用';
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
      width: '5%',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Icon_list onClick={() => onEdit(record)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
          <Image
            src={deleteIcon}
            alt="delete"
            onClick={() => {
              modal_delete({
                onConfirm: () => onDelete(record.key),
              });
            }}
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
      rowKey="depId"
      pagination={{
        total, // 後端回傳的總筆數
        pageSize: 10, // 每頁 10 筆
        onChange: onPageChange, //觸發父層 fetch
      }}
    />
  );
};

export default DepartmentTable;
