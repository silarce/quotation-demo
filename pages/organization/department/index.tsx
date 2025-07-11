import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

//components
import Input from 'components/global/myCom/Input/Input';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';
import LeaveModal from 'components/global/myCom/myModal/leaveModal';
import DeleteModal from 'components/global/myCom/myModal/deleteModal';
import DepartmentModal from 'components/page/organization/department/DepartmentModal';

//Table
import DepartmentTable from 'components/page/organization/department/DepartmentTable';

import { useCallback, useEffect, useState } from 'react';

//api
import { getDepartment, createDepartment, updateDepartment } from 'components/page/organization/department/api';

//type
import { DetailItem, formState } from 'components/page/organization/department/type';

export default function Departmentdata() {
  // 搜尋輸入欄位狀態
  const [searchInput, setSearchInput] = useState('');

  // 頁面標題
  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'departmentData',
      },
    ],
  };

  // ========================= 彈窗控制區 =========================
  const [isModalOpen, setIsModalOpen] = useState(false); // 新增/編輯部門 Modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); // 離開確認 Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 刪除確認 Modal

  // ========================= 資料處理區 =========================

  // 部門資料
  const [department, setDepartment] = useState<DetailItem[]>([]);

  // 取得部門資料，支援模糊查詢
  const fetchDepartment = async (searchInput = '') => {
    const res = await getDepartment(searchInput);
    const rawData = res.data;

    const formattedData: DetailItem[] = rawData.map((item: any) => ({
      key: item.dep_id, // 用來當 table 的 rowKey
      dep_code: item.dep_code,
      dep_ch_name: item.dep_ch_name,
      dep_en_name: item.dep_en_name,
      description: item.description,
      is_invalid: item.is_invalid,
    }));

    setDepartment(formattedData);
  };

  // 初始載入全部資料
  useEffect(() => {
    fetchDepartment(); // 預設不帶參數
  }, []);

  // ========================= 表單狀態 =========================

  // 表單初始狀態
  const initialFormState = {
    dep_code: '',
    dep_ch_name: '',
    dep_en_name: '',
    description: '',
  };

  // 表單狀態
  const [formState, setFormState] = useState(initialFormState);

  // 處理表單欄位變更
  const handleFormChange = useCallback(
    (key: keyof formState) => (value: string) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ========================= 新增與編輯 =========================

  // 點擊儲存按鈕時的邏輯（依 editId 決定新增或編輯）
  const handleSaveSubmit = async () => {
    try {
      if (editId) {
        // 編輯模式
        await handleSaveDepartment();

        return;
      }

      const payload = {
        ...formState,
      };

      await createDepartment(payload);
      resetForm();
      setIsModalOpen(false);
      fetchDepartment();
    } catch (error) {
      console.error('新增失敗:', error);
    }
  };

  // 清空表單欄位
  const resetForm = () => {
    setFormState(initialFormState);
  };

  //=================================================

  // 編輯中的部門 ID，若為 null 則為新增模式
  const [editId, setEditId] = useState<string | null>(null);

  // 編輯部門（點擊編輯圖示）
  const handleEditDepartment = (record: DetailItem) => {
    const { key, dep_code, dep_ch_name, dep_en_name, description } = record;

    setFormState({ dep_code, dep_ch_name, dep_en_name, description });
    setEditId(key); // 設定目前編輯的 ID
    setIsModalOpen(true); // 打開 Modal
  };

  // 執行編輯部門（送出 PUT）
  const handleSaveDepartment = async () => {
    try {
      const payload = {
        ...formState,
        dep_id: editId ?? '',
        is_invalid: false, // 若之後有啟用/停用控制，可改從 state 拿
      };

      await updateDepartment(editId!, payload);

      await fetchDepartment(); // 更新表格資料
      setIsModalOpen(false); // 關閉 Modal
      resetForm(); // 清空欄位
      setEditId(null); // 清除編輯狀態
    } catch (err) {
      console.error('儲存失敗:', err);
    }
  };

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />

      <div className="border border-[#616161] rounded-md px-6 py-8 ">
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <Input
              label="搜索欄"
              value={searchInput}
              onChange={setSearchInput}
              labelWidth="w-[27%]"
              placeholder="請輸入代號/部門"
            />
            <SearchButton onClick={() => fetchDepartment(searchInput)} className="h-[40px]" />
          </div>
          <div>
            <AddButton onClick={() => setIsModalOpen(true)} label="新增部門" className="h-[40px]" />
          </div>
        </div>
        <DepartmentModal
          visible={isModalOpen}
          isEditMode={!!editId}
          formState={formState}
          onFormChange={handleFormChange}
          onSave={handleSaveSubmit}
          onCancel={() => setIsLeaveModalOpen(true)}
        />
        <LeaveModal
          isOpen={isLeaveModalOpen}
          onConfirm={() => {
            setIsLeaveModalOpen(false);
            setIsModalOpen(false);
            resetForm();
          }}
          onCancel={() => setIsLeaveModalOpen(false)}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => console.log('刪除')}
        />
        <DepartmentTable data={department} onEdit={handleEditDepartment} onDelete={() => setIsDeleteModalOpen(true)} />
      </div>
    </>
  );
}
