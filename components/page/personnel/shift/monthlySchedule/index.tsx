import { useState, useMemo, useRef } from 'react';
import { Table, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

//scss
import scss from 'components/global/myCom/myTable/table.module.scss';

import MySelect from 'components/global/myCom/select/mySelect';
import AddButton from 'components/global/myCom/button/AddButton';
import CancelButton from 'components/global/myCom/button/cancelButton';

interface ScheduleItem {
  key: string;
  empId: string;
  department: string;
  name: string;
  schedule: string[];
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function MonthlySchedule() {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(7); // 7 = 七月
  const [addEmployee, setAddEmployeeModal] = useState(false);

  const data: ScheduleItem[] = [
    {
      key: '1',
      empId: 'E001',
      department: '資訊部',
      name: '張小明',
      schedule: Array.from({ length: dayjs(`${year}-${month}`).daysInMonth() }, (_, i) => {
        return ['早', '中', '晚', '休'][i % 4];
      }),
    },
    {
      key: '2',
      empId: 'E002',
      department: '製造部',
      name: '李曉華',
      schedule: Array.from({ length: dayjs(`${year}-${month}`).daysInMonth() }, (_, i) => {
        return ['早', '中', '晚', '休'][i % 4];
      }),
    },
  ];

  const columns: ColumnsType<ScheduleItem> = useMemo(() => {
    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const baseColumns: ColumnsType<ScheduleItem> = [
      {
        title: '員工工號',
        dataIndex: 'empId',
        key: 'empId',
        fixed: 'left',
        width: 100,
      },
      {
        title: '部門',
        dataIndex: 'department',
        key: 'department',
        fixed: 'left',
        width: 100,
      },
      {
        title: '員工姓名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
      },
    ];

    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
      const date = dayjs(`${year}-${month}-${i + 1}`);

      return {
        title: (
          <div className="text-center flex flex-col text-[14px]" style={{ lineHeight: '16px' }}>
            <div className="">{i + 1}</div>
            <div className="">{`${weekDays[date.day()]}`}</div>
          </div>
        ),
        dataIndex: ['schedule', i],
        key: `day_${i + 1}`,
        align: 'center' as const,
        width: 50,
      };
    });

    return [...baseColumns, ...dayColumns];
  }, [year, month]);

  return (
    <div className="border border-gray-500 rounded-md px-6 py-6">
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex w-[20%] gap-2">
          {/* 模擬月份與年份下拉選單，實作時改綁定你 MySelect 的 onChange */}
          <MySelect className="w-full" onChange={(val) => setYear(Number(val))} placeholder="選擇部門" />
          <MySelect className="w-full" onChange={(val) => setMonth(Number(val))} placeholder="選擇月份" />
        </div>
        <div className="flex h-[40px] gap-4">
          <AddButton label="產生報表" className="w-[150px]" onClick={() => console.log('產生報表')} />
          <AddButton label="新增員工" className="w-[150px]" onClick={() => setAddEmployeeModal(true)} />
        </div>
      </div>
      <Modal
        open={addEmployee}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        footer={null}
      >
        <p className="text-[16px] font-bold">新增員工</p>
        <div>
          <MySelect label="部門：" className="whitespace-nowrap mt-3" marginLeft="64px" placeholder="請選擇部門" />
          <MySelect label="員工姓名：" className="whitespace-nowrap mt-3" marginLeft="36px" placeholder="請選擇姓名" />
          <MySelect label="選擇班別：" className="whitespace-nowrap mt-3" marginLeft="36px" placeholder="請選擇類型" />
        </div>
        <div className="flex h-[40px] gap-4 justify-end mt-3">
          <CancelButton label="取消" onClick={() => setAddEmployeeModal(false)} />
          <CancelButton label="新增人員" onClick={() => setAddEmployeeModal(false)} />
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
