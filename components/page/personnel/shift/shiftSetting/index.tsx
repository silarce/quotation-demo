import { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Switch, Table, Tag, message } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import circle from 'public/image/icon/fong/circle.svg?url';
import cross from 'public/image/icon/fong/x.svg?url';
import Btn from 'components/global/gear/button/btn_fong';

//button
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

//API
import {
  createShiftAssignment,
  deleteShiftAssignment,
  getShiftDataSource,
  getShiftAssignments,
  updateShiftAssignment,
  ShiftItem as ApiShiftItem,
  AddShiftDto,
  UpdateShiftDto,
} from './api_shiftSetting';
import { Container_confirm } from 'components/global/container/modal';
import { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';
import { modal_delete } from 'components/global/gear/modal/fongModal';

interface ShiftItem {
  key: string;
  name: string; // 班別名稱
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  breakHour: string;
  breakMinute: string;
  preSegment: string; // 前段時數
  postSegment: string; // 後段時數
  needPunch: boolean; // 是否打卡
  description: string; // 班別說明
  enabled: boolean; // 啟用狀態
}

export default function ShiftSetting() {
  const [data, setData] = useState<ShiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoursOptions, setHoursOptions] = useState<{ label: string; value: string }[]>([]);
  const [minutesOptions, setMinutesOptions] = useState<{ label: string; value: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shiftForm, setShiftForm] = useState({
    shiftName: '',
    shiftDesc: '',
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: '',
    restHour: '',
    restMinute: '',
    sectionHour1: '',
    sectionMinute1: '',
    sectionHour2: '',
    sectionMinute2: '',
    isCardRequired: false,
    isEnable: false,
  });

  const updateShiftForm = (field: string, value: any) => {
    setShiftForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const columns: ColumnsType<ShiftItem> = [
    { title: '班別名稱', dataIndex: 'name', key: 'name', align: 'right', width: '6%' },
    { title: '上班時', dataIndex: 'startHour', key: 'startHour', align: 'center', width: '5%' },
    { title: '上班分', dataIndex: 'startMinute', key: 'startMinute', align: 'center', width: '5%' },
    { title: '下班時', dataIndex: 'endHour', key: 'endHour', align: 'center', width: '5%' },
    { title: '下班分', dataIndex: 'endMinute', key: 'endMinute', align: 'center', width: '5%' },
    { title: '休息時', dataIndex: 'breakHour', key: 'breakHour', align: 'center', width: '5%' },
    { title: '休息分', dataIndex: 'breakMinute', key: 'breakMinute', align: 'center', width: '5%' },
    { title: '前段時數', dataIndex: 'preSegment', key: 'preSegment', align: 'center', width: '6%' },
    { title: '後段時數', dataIndex: 'postSegment', key: 'postSegment', align: 'center', width: '6%' },
    {
      title: '是否打卡',
      dataIndex: 'needPunch',
      key: 'needPunch',
      align: 'center',
      width: '6%',
      render: (needPunch: boolean) =>
        needPunch ? (
          <span className="flex justify-center">
            <Image src={circle} alt="" className="text-center" />
          </span>
        ) : (
          <span className="flex justify-center">
            <Image src={cross} alt="" className="text-center" />
          </span>
        ),
    },
    { title: '班別說明', dataIndex: 'description', key: 'description', width: '26%' },
    {
      title: '啟用狀態',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      width: '6%',
      render: (_, { enabled }) => {
        const statusText = enabled ? '啟用' : '停用';

        const styles: Record<string, React.CSSProperties> = {
          啟用: {
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

        return <span style={styles[statusText]}>{statusText}</span>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '5%',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
            onClick={() => {
              // 把這筆班別資料塞到 shiftForm
              setShiftForm({
                shiftName: record.name,
                shiftDesc: record.description,
                startHour: record.startHour,
                startMinute: record.startMinute,
                endHour: record.endHour,
                endMinute: record.endMinute,
                restHour: record.breakHour,
                restMinute: record.breakMinute,
                sectionHour1: record.preSegment,
                sectionMinute1: '00', // 如果 API 沒有分，預設 00
                sectionHour2: record.postSegment,
                sectionMinute2: '00',
                isCardRequired: record.needPunch,
                isEnable: record.enabled,
              });

              // 打開 Modal
              setEditingId(record.key); //記錄要修改的 shiftId
              setIsOpen(true);
            }}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
            onClick={() => {
              modal_delete({
                onConfirm: async () => {
                  try {
                    await deleteShiftAssignment(record.key); // record.key = shiftId
                    message.success('刪除成功');

                    // 重新撈清單
                    fetchData();
                  } catch {
                    message.error('刪除失敗');
                  }
                },
              });
            }}
          />
        </div>
      ),
    },
  ];

  const handleSaveShift = async (payload: AddShiftDto) => {
    try {
      await createShiftAssignment(payload);

      message.success('新增班別成功');

      // 重新撈取班別列表
      const res = await getShiftAssignments({
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
      });

      const mapped: ShiftItem[] = res.data.map((item: ApiShiftItem) => ({
        key: item.shiftId,
        name: item.shiftName,
        startHour: String(item.startHour).padStart(2, '0'),
        startMinute: String(item.startMinute).padStart(2, '0'),
        endHour: String(item.endHour).padStart(2, '0'),
        endMinute: String(item.endMinute).padStart(2, '0'),
        breakHour: String(item.restHour).padStart(2, '0'),
        breakMinute: String(item.restMinute).padStart(2, '0'),
        preSegment: String(item.sectionHours1).padStart(2, '0'),
        postSegment: String(item.sectionHours2).padStart(2, '0'),
        needPunch: item.isCardRequired,
        description: item.shiftDesc || '',
        enabled: item.isEnable,
      }));

      setData(mapped);
    } catch (err) {
      message.error('新增失敗');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await getShiftAssignments({
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
      });

      const mapped: ShiftItem[] = res.data.map((item: ApiShiftItem) => ({
        key: item.shiftId,
        name: item.shiftName,
        startHour: String(item.startHour).padStart(2, '0'),
        startMinute: String(item.startMinute).padStart(2, '0'),
        endHour: String(item.endHour).padStart(2, '0'),
        endMinute: String(item.endMinute).padStart(2, '0'),
        breakHour: String(item.restHour).padStart(2, '0'),
        breakMinute: String(item.restMinute).padStart(2, '0'),
        preSegment: String(item.sectionHours1).padStart(2, '0'),
        postSegment: String(item.sectionHours2).padStart(2, '0'),
        needPunch: item.isCardRequired,
        description: item.shiftDesc || '',
        enabled: item.isEnable,
      }));
      setData(mapped);
    } catch (err) {
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await getShiftDataSource();

        if (!res) {
          return;
        }

        res.data.forEach((item: any) => {
          if (item.paramCode === 'HOURS') {
            setHoursOptions(item.items.map((x: any) => ({ label: x.label, value: x.value })));
          }

          if (item.paramCode === 'MINUTES') {
            setMinutesOptions(item.items.map((x: any) => ({ label: x.label, value: x.value })));
          }
        });
      } catch (err) {
        console.error('載入下拉選單失敗', err);
      }
    };

    fetchOptions();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
        <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
          <div className="flex items-center justify-between mb-6">
            <p className="font-bold text-[16px]">班別清單</p>
            {/* <AddButton label="新增班別" onClick={() => console.log('Add')} className="h-[40px]" /> */}
            <Btn theme="add" onClick={() => setIsOpen(true)}>
              新增班別
            </Btn>
            <Modal closable={false} open={isOpen} onCancel={() => setIsOpen(false)} footer={null} centered width={668}>
              <ShiftForm
                shiftForm={shiftForm}
                updateShiftForm={updateShiftForm}
                hoursOptions={hoursOptions}
                minutesOptions={minutesOptions}
                data={data}
                editingId={editingId}
                onSave={() => {
                  if (editingId) {
                    // 編輯模式 → 呼叫 update
                    const updatePayload: UpdateShiftDto = {
                      shiftId: editingId,
                      shiftName: shiftForm.shiftName,
                      shiftDesc: shiftForm.shiftDesc,
                      startHour: Number(shiftForm.startHour),
                      startMinute: Number(shiftForm.startMinute),
                      endHour: Number(shiftForm.endHour),
                      endMinute: Number(shiftForm.endMinute),
                      restHour: Number(shiftForm.restHour),
                      restMinute: Number(shiftForm.restMinute),
                      sectionHours1: Number(shiftForm.sectionHour1),
                      sectionMinute1: Number(shiftForm.sectionMinute1),
                      sectionHours2: Number(shiftForm.sectionHour2),
                      sectionMinute2: Number(shiftForm.sectionMinute2),
                      isCardRequired: shiftForm.isCardRequired,
                      isEnable: shiftForm.isEnable,
                    };
                    updateShiftAssignment(updatePayload).then(() => {
                      message.success('修改成功');
                      fetchData();
                      setIsOpen(false);
                      setEditingId(null); // 清掉編輯狀態
                    });
                  } else {
                    // 新增模式 → 呼叫 create
                    handleSaveShift({
                      ...shiftForm,
                      startHour: Number(shiftForm.startHour),
                      startMinute: Number(shiftForm.startMinute),
                      endHour: Number(shiftForm.endHour),
                      endMinute: Number(shiftForm.endMinute),
                      restHour: Number(shiftForm.restHour),
                      restMinute: Number(shiftForm.restMinute),
                      sectionHours1: Number(shiftForm.sectionHour1),
                      sectionMinute1: Number(shiftForm.sectionMinute1),
                      sectionHours2: Number(shiftForm.sectionHour2),
                      sectionMinute2: Number(shiftForm.sectionMinute2),
                    });
                    setIsOpen(false);
                  }
                }}
                onCancel={() => setIsOpen(false)}
              />
            </Modal>
          </div>
          <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
        </div>
      </LocalizationProvider>
    </>
  );
}

function ShiftForm({
  shiftForm,
  updateShiftForm,
  hoursOptions,
  minutesOptions,
  onSave,
  onCancel,
  data,
  editingId,
}: {
  shiftForm: any;
  updateShiftForm: (field: string, value: any) => void;
  hoursOptions: { label: string; value: string }[];
  minutesOptions: { label: string; value: string }[];
  onSave: () => void;
  onCancel: () => void;
  data: ShiftItem[];
  editingId: string | null;
}) {
  return (
    <div>
      <Container_confirm
        title="新增班別"
        footerRight={
          <>
            <Btn onClick={onCancel}>取消</Btn>
            <Btn
              theme="save"
              onClick={() => {
                if (!validateShiftForm(shiftForm, data, editingId)) {
                  return;
                }

                onSave();
              }}
            >
              儲存
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <DataEntry_fong caption="班別名稱" isMust>
            <Input value={shiftForm.shiftName} onChange={(e) => updateShiftForm('shiftName', e.target.value)} />
          </DataEntry_fong>

          <DataEntry_fong caption="班別說明">
            <Input value={shiftForm.shiftDesc} onChange={(e) => updateShiftForm('shiftDesc', e.target.value)} />
          </DataEntry_fong>

          <div className="grid grid-cols-4 gap-4">
            <DataEntry_fong caption="上班時" isMust>
              <Select
                options={hoursOptions}
                value={shiftForm.startHour}
                onChange={(val) => updateShiftForm('startHour', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="上班分" isMust>
              <Select
                options={minutesOptions}
                value={shiftForm.startMinute}
                onChange={(val) => updateShiftForm('startMinute', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="下班時" isMust>
              <Select
                options={hoursOptions}
                value={shiftForm.endHour}
                onChange={(val) => updateShiftForm('endHour', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="下班分" isMust>
              <Select
                options={minutesOptions}
                value={shiftForm.endMinute}
                onChange={(val) => updateShiftForm('endMinute', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="前段時" isMust>
              <Select
                options={hoursOptions}
                value={shiftForm.sectionHour1}
                onChange={(val) => updateShiftForm('sectionHour1', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="前段分" isMust>
              <Select
                options={minutesOptions}
                value={shiftForm.sectionMinute1}
                onChange={(val) => updateShiftForm('sectionMinute1', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="後段時" isMust>
              <Select
                options={hoursOptions}
                value={shiftForm.sectionHour2}
                onChange={(val) => updateShiftForm('sectionHour2', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="後段分" isMust>
              <Select
                options={minutesOptions}
                value={shiftForm.sectionMinute2}
                onChange={(val) => updateShiftForm('sectionMinute2', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="休息時" isMust>
              <Select
                options={hoursOptions}
                value={shiftForm.restHour}
                onChange={(val) => updateShiftForm('restHour', val)}
              />
            </DataEntry_fong>

            <DataEntry_fong caption="休息分" isMust>
              <Select
                options={minutesOptions}
                value={shiftForm.restMinute}
                onChange={(val) => updateShiftForm('restMinute', val)}
              />
            </DataEntry_fong>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-5">
          <DataEntry_fong caption="打卡" isMust childrenWrapperProps={{ className: '!border-none !p-0' }}>
            <Switch
              className="w-[40px] bg-[#BFBFBF]"
              checked={shiftForm.isCardRequired}
              onChange={(checked) => updateShiftForm('isCardRequired', checked)}
            />
          </DataEntry_fong>

          <DataEntry_fong caption="啟用狀態" isMust childrenWrapperProps={{ className: '!border-none !p-0' }}>
            <Switch
              className="w-[40px] bg-[#BFBFBF]"
              checked={shiftForm.isEnable}
              onChange={(checked) => updateShiftForm('isEnable', checked)}
            />
          </DataEntry_fong>
        </div>
      </Container_confirm>
    </div>
  );
}

// 必填規則清單
const shiftFormRules = [
  { field: 'shiftName', label: '班別名稱', isMust: true },
  { field: 'shiftDesc', label: '班別說明', isMust: false }, // 不是必填
  { field: 'startHour', label: '上班時', isMust: true },
  { field: 'startMinute', label: '上班分', isMust: true },
  { field: 'endHour', label: '下班時', isMust: true },
  { field: 'endMinute', label: '下班分', isMust: true },
  { field: 'sectionHour1', label: '前段時', isMust: true },
  { field: 'sectionMinute1', label: '前段分', isMust: true },
  { field: 'sectionHour2', label: '後段時', isMust: true },
  { field: 'sectionMinute2', label: '後段分', isMust: true },
  { field: 'restHour', label: '休息時', isMust: true },
  { field: 'restMinute', label: '休息分', isMust: true },
  { field: 'isCardRequired', label: '打卡', isMust: true },
  { field: 'isEnable', label: '啟用狀態', isMust: true },
];

function validateShiftForm(shiftForm: any, data: ShiftItem[], editingId?: string | null) {
  // 必填欄位檢查
  for (const rule of shiftFormRules) {
    if (rule.isMust && (shiftForm[rule.field] === undefined || shiftForm[rule.field] === '')) {
      message.error(`請填寫 ${rule.label}`);

      return false;
    }
  }

  // 班別名稱重複檢查（忽略正在編輯的那一筆）
  const duplicate = data.some((item) => item.name === shiftForm.shiftName && item.key !== editingId);

  if (duplicate) {
    message.error('班別名稱重複，請重新輸入');

    return false;
  }

  return true;
}
