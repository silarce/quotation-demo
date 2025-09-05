import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import Input from 'components/global/myCom/Input/Input';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Table, Modal, Switch } from 'antd';
import Btn from 'components/global/gear/button/btn_fong';
import listIcon from 'public/image/icon/fong/procurement.svg?url';
import IconReset from 'public/image/icon/fong/reload.svg';
import IconLink from 'public/image/icon/fong/link_yellow.svg';
import { DataEntry_fong, Input as AntdInput, Select } from 'components/global/gear/dataEntry';

//api
import {
  getUserList,
  deleteUser,
  getBindableEmployeeList,
  bindUserToEmployee,
} from 'components/page/organization/system/usres/users_api';
//scss
import scss from './users.module.scss';
import tableScss from 'components/global/myCom/myTable/table.module.scss';

interface DetailItem {
  key: string;
  account: string;
  email: string;
  name: string;
  last_login_time?: string;
  is_enable: boolean;
  emp_id?: string;
  emp_code?: string;
  emp_ch_name?: string;
  com_ch_name?: string;
  dep_id?: string;
  is_binding: boolean;
  isChanged: boolean;
}

export default function Users() {
  const initialForm = {
    account: '',
    email: '',
    lastLoginTime: '',
    isEnable: false,
    isBinding: false,
  };

  const [searchInput, setSearchInput] = useState('');

  //紀錄角色ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [editForm, setEditForm] = useState(initialForm);
  const router = useRouter();

  //儲存資料
  const [userList, setUserList] = useState<DetailItem[]>([]);

  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'basicInformation',
      },
    ],
  };

  const columns: ColumnsType<DetailItem> = [
    {
      title: '帳號',
      dataIndex: 'emp_code',
      key: 'emp_code',
      align: 'right',
      width: 200,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      align: 'right',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'emp_ch_name',
      key: 'emp_ch_name',
      align: 'left',
      width: 100,
    },
    {
      title: '最後登入時間',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      align: 'center',
      render: (text) => text || '', // 避免空值
      width: 150,
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 638,
    },
    {
      title: '綁定狀態',
      dataIndex: 'is_binding',
      key: 'is_binding',
      align: 'center',
      width: 100,
      render: (_, { is_binding }) => {
        const text = is_binding ? '已綁定' : '未綁定';
        const style = {
          已綁定: {
            backgroundColor: '#D1FAE5',
            color: '#10B981',
          },
          未綁定: {
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
          },
        }[text];

        return (
          <span
            style={{
              ...style,
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: '啟用狀態',
      dataIndex: 'is_enable',
      key: 'is_enable',
      align: 'center',
      width: 100,
      render: (_, { is_enable }) => {
        const text = is_enable ? '已啟用' : '停用';
        const style = {
          已啟用: {
            backgroundColor: '#D1FAE5',
            color: '#10B981',
          },
          停用: {
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
          },
        }[text];

        return (
          <span
            style={{
              ...style,
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={listIcon}
            alt="edit"
            onClick={() => {
              setCurrentUserId(record.key);
              setEditForm({
                account: record.emp_code ?? '',
                email: record.email ?? '',
                lastLoginTime: record.last_login_time ?? '',
                isEnable: record.is_enable,
                isBinding: record.is_binding,
              });

              if (record.is_binding && record.emp_id) {
                setSelectedCode(record.emp_id); // 存 emp_id
              } else {
                setSelectedCode(null);
              }

              setIsModalOpen(true);
            }}
            style={{ cursor: 'pointer', width: '20px' }}
            width={16}
            height={16}
          />
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      const rawList = await getUserList(searchInput);

      const formattedList: DetailItem[] = rawList.map((user) => ({
        key: user.user_id,
        account: user.user_name,
        email: user.user_email,
        name: '',
        is_enable: user.is_active,
        emp_ch_name: user.emp_ch_name,
        emp_id: user.emp_id,
        emp_code: user.emp_code,
        com_ch_name: user.com_ch_name,
        dep_id: user.dep_id,
        is_binding: user.is_binding,
        isChanged: user.isChanged,
      }));

      setUserList(formattedList);
    } catch (err) {
      console.error('取得使用者資料失敗', err);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const res = await getBindableEmployeeList(); // 替換為實際 API
      const empList = res.data ?? [];

      const formattedOptions: Option[] = empList.map((emp: any) => ({
        label: `${emp.com_ch_name} ${emp.dep_ch_name ?? '無部門'} ${emp.emp_ch_name}`, // 顯示 代號+姓名
        value: emp.emp_id, // 實際綁定用 emp_id
      }));

      setSelectOptions(formattedOptions);
    } catch (err) {
      console.error('取得員工清單失敗:', err);
    }
  };

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  //Select
  type Option = {
    label: string;
    value: string;
  };
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  console.log('selectedCode :', selectedCode);
  console.log('currentUserId :', currentUserId);

  const DeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      // setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error('刪除過程中發生錯誤:', err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchEmployeeOptions();
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 當 options 載入後，把 emp_id 對應成 label
  useEffect(() => {
    if (selectedCode && selectOptions.length > 0) {
      const matched = selectOptions.find((opt) => opt.value === selectedCode);

      if (!matched) {
        // 如果 options 裡沒有這個 emp_id，直接清掉
        setSelectedCode('找不到對應的emp_id');
      }
      // 如果 matched 存在，不用再 set，Antd 自然會顯示 matched.label
    }
  }, [selectOptions, selectedCode]);

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />
      <div className="border-[1px] border-[#616161] rounded-lg py-8">
        <div className="px-6  pb-6 flex justify-between">
          <div className="flex gap-4 h-[40px]">
            <Input
              label=""
              value={searchInput}
              onChange={setSearchInput}
              placeholder="請輸入帳號 / Mail"
              width="136px"
              marginLeft="0px"
              className="flex-1"
            />
            <Btn
              theme="query"
              className="flex-1"
              onClick={async () => {
                try {
                  const rawList = await getUserList(searchInput);
                  const formattedList: DetailItem[] = rawList.map((user) => ({
                    key: user.user_id,
                    account: user.user_name,
                    email: user.user_email,
                    name: '',
                    is_enable: user.is_active,
                    emp_ch_name: user.emp_ch_name,
                    emp_id: user.emp_id,
                    emp_code: user.emp_code,
                    com_ch_name: user.com_ch_name,
                    dep_id: user.dep_id,
                    is_binding: user.is_binding,
                    isChanged: user.isChanged,
                  }));
                  setUserList(formattedList);
                } catch (err) {
                  console.error('搜尋失敗', err);
                }
              }}
            >
              搜索資料
            </Btn>
          </div>
        </div>
        <div className="px-6">
          <Table
            pagination={{
              showSizeChanger: false,
            }}
            className={tableScss.customTable}
            columns={columns}
            dataSource={userList}
            rowKey="key"
            bordered
            style={{ minWidth: '50%' }}
          />
        </div>
      </div>
      <Modal
        title={<div className="text-[16px] font-bold">帳號資訊</div>}
        open={isModalOpen}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
      >
        <div className="flex flex-col gap-5 mt-6">
          <DataEntry_fong caption="帳號" disabled>
            <AntdInput value={editForm.account}></AntdInput>
          </DataEntry_fong>

          <DataEntry_fong caption="EMAIL" disabled>
            <AntdInput value={editForm.email}></AntdInput>
          </DataEntry_fong>
          <DataEntry_fong caption="最後登入時間" disabled>
            <AntdInput value={editForm.lastLoginTime}></AntdInput>
          </DataEntry_fong>
          <DataEntry_fong caption="員工編號" disabled={editForm.isBinding}>
            <Select
              options={selectOptions}
              value={selectedCode ?? undefined} // 傳 emp_id
              onChange={(val) => setSelectedCode(val)} // val 就是 emp_id
            />
          </DataEntry_fong>

          <div className="flex flex-col gap-[10px]">
            <p>啟用：</p>
            <Switch
              className="w-[34px]"
              checked={editForm.isEnable}
              onChange={(checked) => setEditForm((prev) => ({ ...prev, isEnable: checked }))}
            />
          </div>
        </div>

        <div className="flex items-center mt-5 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
          <p className="text-[14px] font-normal">進階操作</p>
          <svg
            className={`ml-1 w-4 h-4 text-gray-600 transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {showAdvanced && (
          <div className="flex gap-4 mt-3 h-[40px]">
            <Btn
              theme="trash"
              onClick={() => {
                if (currentUserId) {
                  DeleteUser(currentUserId);
                }
              }}
            >
              刪除
            </Btn>
            {!editForm.isBinding && (
              <Btn icon={IconLink} themeColor="yellow_I">
                解除綁定
              </Btn>
            )}
            <Btn icon={IconReset} themeColor="blue_I">
              重置密碼
            </Btn>
          </div>
        )}
        <div className="flex justify-end h-[40px] gap-4 mt-10 ">
          <Btn theme="basic" onClick={() => setIsModalOpen(false)}>
            取消
          </Btn>
          {!editForm.isBinding ? (
            <Btn
              icon={IconLink}
              themeColor="blue_I"
              onClick={async () => {
                if (!currentUserId || !selectedCode) {
                  alert('請選擇要綁定的員工');

                  return;
                }

                try {
                  await bindUserToEmployee(currentUserId, selectedCode);
                  alert('綁定成功');
                  setIsModalOpen(false);
                  setSelectedCode(null);
                } catch (err) {
                  console.error('綁定失敗', err);
                  alert('綁定失敗');
                }
              }}
            >
              綁定帳號
            </Btn>
          ) : (
            <Btn theme="save">儲存</Btn>
          )}
        </div>
        <div className="flex justify-end mt-10">
          <div className=" text-[#909090]">
            <div className="flex gap-4 ">
              <p>建立者:王大名</p>
              <p>建立日期:2024/04/30</p>
            </div>
            <div className="flex gap-4 mt-[8px]">
              <p>更新者:黃鐘可</p>
              <p>更新日期:2024/04/30</p>
            </div>
            <div className="flex gap-4 mt-[8px]">
              <p>刪除者:王小明</p>
              <p>刪除日期:2024/04/30</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
