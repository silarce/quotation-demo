import { useState, useMemo } from 'react';
import { Table, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import IconEdit from 'public/image/icon/fong/procurement.svg';

import { DataEntry_fong, Select } from 'components/global/gear/dataEntry';

//scss
import scss from 'components/global/myCom/myTable/table.module.scss';

import Btn from 'components/global/gear/button/btn_fong';

interface ScheduleItem {
  key: string;
  empId: string;
  department: string;
  name: string;
  shift: string;
  schedule: string[];
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function MonthlySchedule() {
  const router = useRouter();
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [addEmployee, setAddEmployeeModal] = useState(false);

  const data: ScheduleItem[] = [
    {
      key: '1',
      empId: 'E001',
      department: '資訊部',
      name: '張小明',
      shift: '預設(早班)',
      schedule: Array.from({ length: dayjs(`${year}-${month}`).daysInMonth() }, (_, i) => {
        return ['早', '中', '晚', '休'][i % 4];
      }),
    },
    {
      key: '2',
      empId: 'E002',
      department: '製造部',
      name: '李曉華',
      shift: '早',
      schedule: Array.from({ length: dayjs(`${year}-${month}`).daysInMonth() }, (_, i) => {
        return ['早', '中', '晚', '休'][i % 4];
      }),
    },
  ];

  const columns: ColumnsType<ScheduleItem> = useMemo(() => {
    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const baseColumns: ColumnsType<ScheduleItem> = [
      {
        title: '員工編號',
        dataIndex: 'empId',
        key: 'empId',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '部門',
        dataIndex: 'department',
        key: 'department',
        width: 100,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '目前班別',
        dataIndex: 'shift',
        key: 'shift',
        width: 120,
        align: 'center',
        fixed: 'left',
      },
    ];

    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
      const date = dayjs(`${year}-${month}-${i + 1}`);

      return {
        title: (
          <div className="text-center flex text-[14px]" style={{ lineHeight: '16px' }}>
            <div>
              {month}/{i + 1}
            </div>
            <div>({`${weekDays[date.day()]}`})</div>
          </div>
        ),
        dataIndex: ['schedule', i],
        key: `day_${i + 1}`,
        align: 'center' as const,
        width: 50,
        render: (value: string) => <span className={value === '休' ? 'text-red-500' : 'text-black'}>{value}</span>,
      };
    });

    const actionColumn: ColumnsType<ScheduleItem>[number] = {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '5%',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <IconEdit
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={() => {
              router.push(
                `/personnel/shift/monthlySchedule/schedulePage?empId=${record.empId}&name=${record.name}&year=${year}&month=${month}`
              );
            }}
          />
        </div>
      ),
    };

    return [...baseColumns, ...dayColumns, actionColumn];
  }, [year, month]);

  return (
    <div className="border border-gray-500 rounded-md px-6 py-6">
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <DataEntry_fong>
            <Select placeholder="請輸入員工編號 / 姓名"></Select>
          </DataEntry_fong>
          <DataEntry_fong>
            <Select placeholder="選擇部門" onChange={(val) => setYear(Number(val))}></Select>
          </DataEntry_fong>
          <DataEntry_fong>
            <Select placeholder="選擇班別" onChange={(val) => setMonth(Number(val))}></Select>
          </DataEntry_fong>
          <Btn theme="query">搜尋資料</Btn>
        </div>
        <div className="flex h-[40px] gap-4">
          <Btn theme="import">班表匯出</Btn>
          <Btn theme="query" themeColor="blue_I" onClick={() => setAddEmployeeModal(true)}>
            查詢班表
          </Btn>
        </div>
      </div>
      <Modal
        open={addEmployee}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        footer={null}
      >
        <p className="text-[16px] font-bold">查詢班表</p>
        <div className="flex flex-col gap-5 mt-6">
          <DataEntry_fong caption="年" isMust>
            <Select placeholder="請選擇" onChange={(val) => setYear(Number(val))}></Select>
          </DataEntry_fong>
          <DataEntry_fong caption="月" isMust>
            <Select placeholder="請選擇" onChange={(val) => setMonth(Number(val))}></Select>
          </DataEntry_fong>
          <DataEntry_fong caption="部門">
            <Select placeholder="請選擇" onChange={(val) => setMonth(Number(val))}></Select>
          </DataEntry_fong>
          <DataEntry_fong caption="班別">
            <Select placeholder="請選擇" onChange={(val) => setMonth(Number(val))}></Select>
          </DataEntry_fong>
        </div>
        <div className="flex h-[40px] gap-4 justify-end mt-10">
          <Btn onClick={() => setAddEmployeeModal(false)}>返回</Btn>
          <Btn theme="send" onClick={() => setAddEmployeeModal(false)}>
            送出
          </Btn>
        </div>
      </Modal>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
          className={`${scss.customTable}`}
        />
      </div>
    </div>
  );
}
