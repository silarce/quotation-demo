const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Modal, message } from 'antd';
import axios from 'axios';
import DeleteModal from 'components/global/myCom/myModal/deleteModal';
//icon
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { IconSave } from 'public/image/icon/svgComponent/svgIcons';

//scss
import scss from './table.module.scss';

//api
import { getRoleList } from '../api_role';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

interface User {
  role_id: string;
  user_id: string;
  emp_code: string;
  user_name: string;
  dep_ch_name: string;
  user_roles: string[];
}

interface Props {
  data: User[];
  onReload: () => void;
  checkedUserIds: string[];
  setCheckedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const EmployeeTable: React.FC<Props> = ({ data, onReload, checkedUserIds, setCheckedUserIds }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [checkedRoles, setCheckedRoles] = useState<string[]>([]);

  //Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  //紀錄刪除角色的ID
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const handleCheckUser = (user_id: string) => {
    setCheckedUserIds((prev) => (prev.includes(user_id) ? prev.filter((id) => id !== user_id) : [...prev, user_id]));
  };

  //=====================================================================
  const handleCheck = (role: string) => {
    setCheckedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  //全選and反選
  const handleSelectAll1 = () => {
    const allIds = data.map((item) => item.user_id);
    const isAllSelected = allIds.every((id) => checkedUserIds.includes(id));
    setCheckedUserIds(isAllSelected ? [] : allIds);
  };

  const columns: ColumnsType<User> = [
    {
      title: (
        <div className="flex gap-5 justify-center cursor-pointer">
          <label className={scss.checkboxWrapperTable}>
            <input type="checkbox" onChange={() => handleSelectAll1()} />
            <span className={scss.customCheckmarkTable}></span>
          </label>
        </div>
      ),
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'left',
      width: '5%',
      render: (_, record) => (
        <label key={_} className={scss.checkboxWrapperTable}>
          <input
            type="checkbox"
            checked={checkedUserIds.includes(record.user_id)}
            onChange={() => handleCheckUser(record.user_id)}
          />
          <span className={scss.customCheckmarkTable}></span>
        </label>
      ),
    },
    {
      title: '員工編號',
      dataIndex: 'emp_code',
      key: 'emp_code',
      align: 'left',
      width: '120px',
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'left',
      width: '120px',
    },
    {
      title: '部門',
      dataIndex: 'dep_ch_name',
      key: 'dep_ch_name',
      align: 'left',
      width: '150px',
      // render: (_, record) => <div className="">{record.description}</div>,
    },
    {
      title: '擁有角色',
      dataIndex: 'user_roles',
      key: 'user_roles',
      align: 'left',
      width: '538px',
      render: (roles: string[]) => roles?.join(', '),
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
            onClick={() => {
              setSelectedEmployee(record);

              // 將角色名稱轉換為角色 ID
              const matchedRoleIds = roles
                .filter((role) => record.user_roles.includes(role.role_name))
                .map((role) => role.role_id);

              setCheckedRoles(matchedRoleIds); // 正確設定為角色 ID
              setIsModalVisible(true);
            }}
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            // onClick={() => handleDeleteUserRoles(record.user_id)}
            onClick={() => {
              setUserIdToDelete(record.user_id);
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

  const [roles, setRoles] = useState<{ role_id: string; role_name: string }[]>([]);

  const fetchRoleList = async () => {
    const roleList = await getRoleList();

    if (Array.isArray(roleList)) {
      setRoles(roleList); // 儲存整個 role 陣列
    }
  };

  //儲存使用者角色
  const saveUserRoles = async (user_id: string, role_ids: string[]) => {
    const res = await axios.post(`${BASE_URL}/sys/role/update_user_roles`, {
      user_id,
      role_ids,
      headers: { Authorization: `Bearer ${token}` },
    });

    return res;
  };

  //刪除使用者擁有角色
  const handleDeleteUserRoles = async (user_id: string) => {
    try {
      await axios.delete(`${BASE_URL}/sys/role/role_user`, {
        params: { user_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('角色已刪除');
      // 重新刷新列表資料
      onReload();
    } catch (error) {
      console.error(error);
      message.error('刪除失敗，請稍後再試');
    }
  };

  useEffect(() => {
    fetchRoleList();
  }, []);

  return (
    <>
      <Table
        className={scss.customTable}
        columns={columns}
        dataSource={data}
        rowKey="role_id"
        bordered
        style={{ minWidth: '50%' }}
      />

      <Modal
        title="編輯員工"
        closable={false}
        open={isModalVisible}
        width={532}
        className={scss.customModal}
        centered
        okButtonProps={{ className: 'blueButtonNew' }}
        okText={
          <div className="flex items-center justify-center gap-2 ">
            <IconSave />
            <span>儲存 </span>
          </div>
        }
        cancelButtonProps={{ className: 'cancelbutton' }}
        cancelText={<span className="flex items-center gap-2">取消 </span>}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedEmployee(null);
        }}
        onOk={async () => {
          if (!selectedEmployee) {
            return;
          }

          const validRoleIds = checkedRoles.filter((id) => !!id); // 過濾掉 null 或 undefined

          try {
            await saveUserRoles(selectedEmployee.user_id, validRoleIds);
            setIsModalVisible(false);
            setSelectedEmployee(null);
          } catch (error) {
            Modal.error({
              title: '儲存失敗',
              content: '無法更新使用者角色，請稍後再試。',
            });
          }

          onReload();
        }}
      >
        {selectedEmployee && (
          <div className="flex flex-col gap-4 mt-1">
            <div>
              <strong>員工編號：</strong> {selectedEmployee.emp_code}
            </div>
            <div>
              <strong>員工姓名：</strong> {selectedEmployee.user_name}
            </div>
            <div>
              <strong>部門：</strong> <span className="ml-[27px]">{selectedEmployee.dep_ch_name}</span>
            </div>
            <div className="flex mb-3">
              <strong>角色：</strong>
              <div className={`${scss.checkboxGrid}`}>
                {roles.map((role) => (
                  <label key={role.role_id} className={scss.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={checkedRoles.includes(role.role_id)}
                      onChange={() => handleCheck(role.role_id)}
                    />
                    <span className={scss.customCheckmark}></span>
                    <span>{role.role_name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={() => {
          if (userIdToDelete) {
            handleDeleteUserRoles(userIdToDelete); // 使用儲存的 user_id
            setUserIdToDelete(null); // 清空
          }

          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default EmployeeTable;
