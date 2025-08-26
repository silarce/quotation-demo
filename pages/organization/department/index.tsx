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
    const res = await getDepartment(searchInput, pageIndex, pageSize);
    const rawData = res.data;

    const formattedData: DetailItem[] = rawData.map((item: any) => ({
      key: item.depId,
      depCode: item.depCode ? item.depCode.substring(0, 5) : '', // 只取前 5 個字
      depChName: item.depChName,
      depEnName: item.depEnName || '未命名英文名稱',
      description: item.description,
      isInvalid: item.isInvalid,
    }));

    setDepartment(formattedData);
    setTotal(res.totalCount); //後端回傳總數
    setCurrentPage(pageIndex);
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
    try {
      if (!formState.depCode || !formState.depChName || !formState.depEnName) {
        message.error('部門代號、部門名稱、部門英文名稱為必填');

        return;
      }

      if (editId) {
        await handleSaveDepartment();

        return;
      }

      await createDepartment(formState); // 如果失敗這裡會進 catch
      message.success('新增成功');
      resetForm();
      setIsModalOpen(false); //只在成功時關閉
      fetchDepartment();
    } catch (err: any) {
      // 不會再看到 AxiosError，而是 Error("新增失敗") 或後端回的訊息
      message.error(err.message);
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

      await updateDepartment(editId!, payload);

      await fetchDepartment(); // 更新表格資料
      setIsModalOpen(false); // 關閉 Modal
      resetForm(); // 清空欄位
      setEditId(null); // 清除編輯狀態
    } catch (err) {
      console.error('儲存失敗:', err);
    }
  };

  //刪除部門
  const handleBatchDelete = async () => {
    const validIds = checkedDepartments.filter((id) => department.some((dep) => dep.key === id));

    if (validIds.length === 0) {
      message.warning('選取的部門已不存在或已被刪除');

      return;
    }

    try {
      await Promise.all(validIds.map((depId) => deleteDepartment(depId)));
      message.success('刪除成功');
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
          onDelete={() => setIsDeleteModalOpen(true)}
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
