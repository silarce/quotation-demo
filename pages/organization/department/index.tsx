import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

//components
import LeaveModal from 'components/global/myCom/myModal/leaveModal';
import DeleteModal from 'components/global/myCom/myModal/deleteModal';
import DepartmentModal from 'components/page/organization/department/DepartmentModal';
import Btn from 'components/global/gear/button/btn_fong';

//Table
import DepartmentTable from 'components/page/organization/department/DepartmentTable';

import { useCallback, useEffect, useState } from 'react';

//api
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from 'components/page/organization/department/api';

//type
import { DetailItem, CreateDepFormState } from 'components/page/organization/department/type';
import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import { message } from 'antd';

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
  const [total, setTotal] = useState(0); //存總筆數
  const [currentPage, setCurrentPage] = useState(1);

  // 取得部門資料，支援模糊查詢
  const fetchDepartment = async (searchInput = '', pageIndex = 1, pageSize = 10) => {
    try {
      const res = await getDepartment(searchInput, pageIndex, pageSize);

      // 一定有 data（至少是 []）
      const rawData = res.data ?? [];

      const formattedData: DetailItem[] = rawData.map((item: any) => ({
        key: item.depId,
        depCode: item.depCode ? item.depCode.substring(0, 5) : '', // 只取前 5 個字
        depChName: item.depChName,
        depEnName: item.depEnName || '未命名英文名稱',
        description: item.description,
        isInvalid: item.isInvalid,
      }));

      setDepartment(formattedData);
      setTotal(res.totalCount ?? 0);
      setCurrentPage(pageIndex);
    } catch (error) {
      console.error('取得部門資料失敗:', error);
      setDepartment([]);
      setTotal(0);
    }
  };

  // Table 換頁事件
  const handlePageChange = (page: number, pageSize?: number) => {
    fetchDepartment(searchInput, page, pageSize ?? 10);
  };

  // 初始載入全部資料
  useEffect(() => {
    fetchDepartment(); // 預設不帶參數
  }, []);

  // ========================= 表單狀態 =========================

  // 表單初始狀態
  const initialFormState = {
    depCode: '',
    depChName: '',
    depEnName: '',
    description: '',
    isEnabled: false,
  };

  // 表單狀態
  const [formState, setFormState] = useState(initialFormState);

  // 處理表單欄位變更
  const handleFormChange = useCallback(
    (key: keyof CreateDepFormState) => (value: string | boolean) => {
      setFormState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // ========================= 新增與編輯 =========================

  // 點擊儲存按鈕時的邏輯（依 editId 決定新增或編輯）
  const handleSaveSubmit = async () => {
    // 1. 前端必填驗證
    if (!formState.depCode || !formState.depChName || !formState.depEnName) {
      message.error('部門代號、部門名稱、部門英文名稱為必填');

      return;
    }

    // 2. 編輯模式
    if (editId) {
      const result = await handleSaveDepartment();

      if (result) {
        message.success('更新成功');
        resetForm();
        setIsModalOpen(false);
        fetchDepartment();
      }

      return;
    }

    // 3. 新增模式
    const result = await createDepartment(formState);

    if (!result) {
      // 失敗時不做任何事，錯誤訊息攔截器已經顯示
      return;
    }

    // 成功才會執行這裡
    message.success('新增成功');
    resetForm();
    setIsModalOpen(false);
    fetchDepartment();
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
    const { key, depCode, depChName, depEnName, description } = record;

    setFormState({ depCode, depChName, depEnName, description, isEnabled: !record.isInvalid }); // 將資料帶入表單
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

      const res = await updateDepartment(editId!, payload);

      if (!res) {
        return null; // 攔截器可能已經顯示錯誤，這裡直接回 null
      }

      // 更新成功，執行後續 UI 處理
      await fetchDepartment(); // 更新表格資料
      setIsModalOpen(false); // 關閉 Modal
      resetForm(); // 清空欄位
      setEditId(null); // 清除編輯狀態

      return res; // 成功回傳資料
    } catch (err) {
      console.error('儲存失敗:', err);

      return null; // 發生例外回傳 null
    }
  };

  // 單筆刪除
  const handleDeleteOne = async (depId: string) => {
    try {
      const result = await deleteDepartment(depId);

      if (!result) {
        return;
      }

      message.success('刪除成功');
      await fetchDepartment(searchInput, currentPage);
    } catch (err: any) {
      message.error(err.message || '刪除失敗，請稍後再試');
    }
  };

  //勾選刪除部門
  const handleBatchDelete = async () => {
    if (checkedDepartments.length === 0) {
      message.warning('請先選取部門');

      return;
    }

    try {
      const results = await Promise.all(checkedDepartments.map((depId) => deleteDepartment(depId)));

      const successCount = results.filter((res) => res).length;

      if (successCount > 0) {
        message.success(`成功刪除 ${successCount} 筆部門`);
      } else {
        message.warning('選取的部門已不存在或已被刪除');
      }

      setIsDeleteModalOpen(false);
      setCheckedDepartments([]);
      await fetchDepartment(searchInput, currentPage);
    } catch (err: any) {
      message.error(err.message || '刪除失敗，請稍後再試');
    }
  };

  //勾選
  const [checkedDepartments, setCheckedDepartments] = useState<string[]>([]);

  // 勾選單一部門
  const handleCheck = (depId: string) => {
    setCheckedDepartments(
      (prev) =>
        prev.includes(depId)
          ? prev.filter((id) => id !== depId) // 取消勾選
          : [...prev, depId] // 加入勾選
    );
  };

  // 全選/全不選
  const handleSelectAll = () => {
    if (checkedDepartments.length === department.length) {
      setCheckedDepartments([]); // 全不選
    } else {
      setCheckedDepartments(department.map((d) => d.key)); // 全選
    }
  };

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />

      <div className="border border-[#616161] rounded-md px-6 py-8 ">
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <DataEntry_fong className="w-[137px]">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="請輸入代號/部門"
              ></Input>
            </DataEntry_fong>
            <Btn theme="query" onClick={() => fetchDepartment(searchInput)}>
              搜尋資料
            </Btn>
          </div>
          <div className="flex gap-4">
            {checkedDepartments.length > 0 && (
              <Btn theme="trash" onClick={() => setIsDeleteModalOpen(true)}>
                刪除
              </Btn>
            )}
            <Btn theme="add" onClick={() => setIsModalOpen(true)}>
              新增部門
            </Btn>
          </div>
        </div>
        <DepartmentModal
          visible={isModalOpen}
          isEditMode={!!editId}
          formState={formState}
          onFormChange={handleFormChange}
          onSave={handleSaveSubmit}
          onCancel={() => setIsModalOpen(false)}
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
          onConfirm={() => handleBatchDelete()}
        />
        <DepartmentTable
          data={department}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteOne}
          onPageChange={handlePageChange}
          total={total}
          checkedDepartments={checkedDepartments}
          onCheck={handleCheck}
          onSelectAll={handleSelectAll}
        />
      </div>
    </>
  );
}
