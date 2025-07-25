import React from 'react';
import { Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useState, useMemo } from 'react';

//scss
import tableScss from 'components/global/myCom/myTable/table.module.scss';

// icons
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';

//Modal
import DeleteModal from 'components/global/myCom/myModal/deleteModal';

type Role = {
  role_id: string;
  role_name: string;
  role_code: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

type Props = {
  data: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role_id: string) => void;
};

const RoleTable: React.FC<Props> = ({ data = [], onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    return data.filter(
      (role) =>
        role.role_name.toLowerCase().includes(searchText.toLowerCase()) ||
        role.role_code.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const columns: ColumnsType<Role> = [
    {
      title: <span className="">角色名單</span>,
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'left',
      width: '7%',
    },
    {
      title: '角色代碼',
      dataIndex: 'role_code',
      key: 'role_code',
      align: 'center',
      width: '10%',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      width: '74%',
      render: (_, record) => <div className="">{record.description}</div>,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '80px',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            onClick={() => onEdit(record)}
            style={{ cursor: 'pointer' }}
            width={20}
            height={20}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            onClick={() => {
              setRoleToDelete(record);
              setIsDeleteModalOpen(true);
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
    <>
      <div className="flex justify-end ">
        <Input.Search
          className={tableScss.customSearchInput}
          placeholder="搜尋角色名稱或角色代碼"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
      </div>

      <Table
        className={tableScss.customTable}
        columns={columns}
        dataSource={filteredRoles}
        rowKey="role_id"
        pagination={false}
        bordered
        style={{ minWidth: '50%' }}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={() => {
          if (roleToDelete) {
            onDelete(roleToDelete.role_id);
            setRoleToDelete(null);
          }

          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default RoleTable;
