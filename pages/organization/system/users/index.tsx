import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import Input from 'components/global/myCom/Input/Input';
import { useEffect, useState } from 'react';
import SearchButton from 'components/global/myCom/button/searchButton';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg';
import { useRouter } from 'next/router';
import { Table, Modal, Switch } from 'antd';
import CancelButton from 'components/global/myCom/button/cancelButton';
import ClearButton from 'components/global/myCom/button/clearButton';
import CustomSelect from 'components/page/organization/system/usres/CustomSelect';
import vector from 'public/image/icon/Vector.svg';
import { IconLink } from 'public/image/icon/svgComponent/svgIcons';
import yellowLink from 'public/image/icon/link_yellow.svg';

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
  emp_name?: string; // 後端沒提供 user real name 就先空白
  last_login_time?: string;
  is_enable: boolean;
}

type Option = {
  label: string;
  value: string;
};

export default function Users() {
  const initialForm = {
    account: '',
    email: '',
    lastLoginTime: '',
    isEnable: false,
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
      dataIndex: 'account',
      key: 'account',
      align: 'left',
      width: '27.57%',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: '27.57%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: '16.36%',
    },
    {
      title: '最後登入時間',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      align: 'center',
      render: (text) => text || '', // 避免空值
      width: '13.79%',
    },
    {
      title: '狀態',
      dataIndex: 'is_enable',
      key: 'is_enable',
      align: 'center',
      width: '7.35%',
      render: (_, { is_enable }) => {
        const text = is_enable ? '啟用' : '停用';
        const style = {
          啟用: {
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
      width: '7.35%',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            onClick={() => {
              setCurrentUserId(record.key);
              setEditForm({
                account: record.account,
                email: record.email,
                lastLoginTime: record.last_login_time ?? '',
                isEnable: record.is_enable,
              });
              setIsModalOpen(true);
            }}
            style={{ cursor: 'pointer' }}
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
        name: '', // 後端沒提供 user real name 就先空白
        is_enable: user.is_active,
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
  const [selectedCode, setSelectedCode] = useState<Option | null>(null);

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

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />
      <div className="border-[1px] border-[#616161] rounded-lg py-8">
        <div className="px-6  pb-6 flex justify-between">
          <div className="flex gap-4 h-[40px]">
            <Input
              label="搜尋欄"
              value={searchInput}
              onChange={setSearchInput}
              placeholder="請輸入帳號"
              width="176px"
            />
            <SearchButton
              onClick={async () => {
                try {
                  const rawList = await getUserList(searchInput);
                  const formattedList: DetailItem[] = rawList.map((user) => ({
                    key: user.user_id,
                    account: user.user_name,
                    email: user.user_email,
                    name: '',
                    is_enable: user.is_active,
                  }));
                  setUserList(formattedList);
                } catch (err) {
                  console.error('搜尋失敗', err);
                }
              }}
            />
          </div>
        </div>
        <div className="px-6">
          <Table
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
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <Input
          label={<div className="text-[14px] font-normal">帳號：</div>}
          value={editForm.account}
          onChange={() => {}}
          readOnly
          placeholder="請輸入部門代號"
          labelWidth="w-[25%]"
          marginLeft="36px"
          className="mt-3"
        />

        <Input
          label={<div className="text-[14px] font-normal">EMAIL：</div>}
          value={editForm.email}
          onChange={setInput}
          placeholder="請輸入部門名稱"
          labelWidth="w-[25%]"
          marginLeft="36px"
          className="mt-3"
        />

        <Input
          label={<div className="text-[14px] font-normal">最後登入時間：</div>}
          value={editForm.lastLoginTime}
          onChange={setInput}
          placeholder="- -"
          labelWidth="w-[35.5%]"
          marginLeft="1px"
          className="mt-3"
        />

        <div className="flex items-center mt-3">
          <span className="w-[23%] text-[14px] font-normal whitespace-nowrap">請選擇員工編號：</span>
          <div className="flex-1 ml-3.5 ">
            <CustomSelect options={selectOptions} value={selectedCode} onChange={setSelectedCode} />
          </div>
        </div>

        <div className="flex mt-3 gap-[68px]">
          <p>啟用：</p>
          <Switch
            checked={editForm.isEnable}
            onChange={(checked) => setEditForm((prev) => ({ ...prev, isEnable: checked }))}
          />
        </div>

        <div className="flex items-center mt-3 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
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
          <div className="flex gap-4 mt-3">
            <ClearButton
              label="刪除"
              onClick={() => {
                if (currentUserId) {
                  DeleteUser(currentUserId);
                }
              }}
            />
            <button className="border border-[#F79009] rounded-md text-[#F79009] bg-[#F5F5F5] px-4 gap-2 flex items-center">
              <Image src={yellowLink} alt="reset" />
              <p>解除綁定</p>
            </button>
            <button className="border border-[#6BA8E5] rounded-md text-[#6BA8E5] bg-[#F5F5F5] px-4 gap-2 flex items-center">
              <Image src={vector} alt="reset" />
              <p>重置密碼</p>
            </button>
          </div>
        )}
        <div className="mr-6 text-[#909090] mt-3">
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
        <div className="flex justify-end h-[40px] gap-4 mt-3 ">
          <CancelButton label="取消" onClick={() => setIsModalOpen(false)} />
          <button
            className={`${scss.blueButtonNew} gap-2`}
            onClick={async () => {
              if (!currentUserId || !selectedCode) {
                alert('請選擇要綁定的員工');

                return;
              }

              try {
                await bindUserToEmployee(currentUserId, selectedCode.value);
                alert('綁定成功');
                setIsModalOpen(false);
                setSelectedCode(null);
              } catch (err) {
                console.error('綁定失敗', err);
                alert('綁定失敗');
              }
            }}
          >
            <IconLink />
            <p>綁定帳號</p>
          </button>
        </div>
      </Modal>
    </>
  );
}
