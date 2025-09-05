import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

//icon
import IconUserClock from 'public/image/icon/fong/userClock.svg';
import IconWrench from 'public/image/icon/fong/wrench.svg';

//components
import CancelButton from 'components/global/myCom/button/cancelButton';
import { DataEntry_fong, Input, Select, DatePicker, Radio } from 'components/global/gear/dataEntry';
// import { Radio } from 'antd';
import Btn from 'components/global/gear/button/btn_fong';
import Badge from 'components/global/gear/badge';
import { modal_empty } from 'components/global/gear/modal/fongModal';

interface ReportItem {
  key: string;
  empId: string;
  empName: string;
  department: string;
  checkedTime: string;
  shift: string;
  workTime: string;
  offTime: string;
  status: string;
}

interface ExceptionItem {
  key: string;
  employeeId: string;
  department: string;
  name: string;
}

const statusMap: Record<string, { theme: 'success' | 'warning' | 'primary' | 'secondary' | 'danger'; label: string }> =
  {
    正常: { theme: 'success', label: '正常' },
    下班打卡異常: { theme: 'warning', label: '下班打卡異常' },
    上班打卡異常: { theme: 'warning', label: '上班打卡異常' },
    早退: { theme: 'danger', label: '早退' },
  };

export default function BusinessTrip() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<ReportItem> = [
    { title: '員工編號', dataIndex: 'empId', key: 'empId', align: 'right', width: 100 },
    { title: '姓名', dataIndex: 'empName', key: 'empName', align: 'right', width: 100 },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'right', width: 100 },
    { title: '打卡日期', dataIndex: 'checkedTime', key: 'checkedTime', align: 'center', width: 150 },
    { title: '當日班別', dataIndex: 'shift', key: 'shift', align: 'right', width: 200 },
    { title: '實際上班時間', dataIndex: 'workTime', key: 'workTime', align: 'center', width: 150 },
    { title: '實際下班時間', dataIndex: 'offTime', key: 'offTime', align: 'center', width: 150 },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 125,
      render: (status: string) => {
        const { theme, label } = statusMap[status] || { theme: 'error', label: status };

        return <Badge theme={theme}>{label}</Badge>;
      },
    },
    { title: '', dataIndex: '', key: '', align: 'center', width: 433 },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 80,
      render: (_: any, record: ReportItem) => {
        const shouldShowWrench = record.status === '下班打卡異常' || record.status === '上班打卡異常';

        return (
          <div className="flex justify-center gap-4">
            {shouldShowWrench && (
              <IconWrench
                style={{ width: '20px', height: '20px', color: '#14256A', cursor: 'pointer' }}
                onClick={() => handleAbnormal(record)}
              />
            )}
          </div>
        );
      },
    },
  ];

  const data: ReportItem[] = [
    {
      key: '1',
      empId: 'E001',
      empName: '周柔睿',
      department: '人資部',
      checkedTime: '2025/08/01',
      shift: '早班 (08:00 - 17:00)',
      workTime: '07:55',
      offTime: '17:11',
      status: '正常',
    },
    {
      key: '2',
      empId: 'E002',
      empName: '林宥廷',
      department: '廠務部',
      checkedTime: '2025/08/01',
      shift: '早班 (08:00 - 17:00)',
      workTime: '- -',
      offTime: '17:27',
      status: '下班打卡異常',
    },
    {
      key: '3',
      empId: 'E002',
      empName: '林宥廷',
      department: '廠務部',
      checkedTime: '2025/08/01',
      shift: '早班 (08:00 - 17:00)',
      workTime: '08:28',
      offTime: '17:34',
      status: '上班打卡異常',
    },
    {
      key: '4',
      empId: 'E003',
      empName: '陳俊傑',
      department: '會計部',
      checkedTime: '2025/08/01',
      shift: '早班 (08:00 - 17:00)',
      workTime: '07:54',
      offTime: '16:59',
      status: '早退',
    },
  ];

  //MARK:Modal
  const handleAbnormal = (record: ReportItem) => {
    return modal_empty({
      width: 368,
      content: <AbnormalDispose date={record.checkedTime} exceptionType={record.status} />,
    });
  };

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <DataEntry_fong className="w-[171px]">
              <Input placeholder="請輸入員工編號 / 姓名"></Input>
            </DataEntry_fong>
            <DataEntry_fong className="w-[118px]">
              <Select placeholder="選擇部門"></Select>
            </DataEntry_fong>
            <DataEntry_fong className="w-[118px]">
              <DatePicker placeholder="選擇日期"></DatePicker>
            </DataEntry_fong>
            <DataEntry_fong className="w-[118px]">
              <Select placeholder="選擇狀態"></Select>
            </DataEntry_fong>
            <Btn theme="query">搜尋資料</Btn>
          </div>
          <Btn
            icon={() => <IconUserClock style={{ width: 20, height: 20, fill: '#14256a' }} />}
            onClick={() => setIsModalOpen(true)}
            themeColor="blue_I"
          >
            日出勤匯總
          </Btn>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
      <Modal
        title=""
        width={422}
        closable={false}
        centered
        open={isModalOpen}
        footer={null}
        className={scss.customModal}
        maskClosable={true}
        onCancel={() => setIsModalOpen(false)}
      >
        <p className="font-bold text-[16px] mb-3">日出勤匯總</p>
        <div className="flex flex-col gap-6">
          <DataEntry_fong className="" caption="開始日期" isMust>
            <DatePicker placeholder=""></DatePicker>
          </DataEntry_fong>
          <DataEntry_fong className="" caption="結束日期" isMust>
            <DatePicker placeholder=""></DatePicker>
          </DataEntry_fong>
        </div>
        <div className="flex h-[40px] gap-4 justify-end mt-10">
          <Btn onClick={() => setIsModalOpen(false)}>取消</Btn>
          <Btn onClick={() => setIsModalOpen(false)} theme="send">
            送出
          </Btn>
        </div>
      </Modal>
    </>
  );
}

const AbnormalDispose = ({ date, exceptionType }: { date: string; exceptionType: string }) => {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleClose = () => {
    Modal.destroyAll(); // 關閉當前的 modal
  };

  const columns2: ColumnsType<ExceptionItem> = [
    {
      title: '',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'left',
      render: (_: any, record: ExceptionItem) => (
        <Radio checked={selectedRowKey === record.key} onChange={() => setSelectedRowKey(record.key)} />
      ),
    },
    { title: '打卡日期', dataIndex: 'department', key: 'department', align: 'right' },
    { title: '打卡時間', dataIndex: 'name', key: 'name', align: 'center' },
  ];

  const data2: ExceptionItem[] = [
    {
      key: '1',
      employeeId: 'E001',
      department: '2025/08/11',
      name: '18:07',
    },
    {
      key: '2',
      employeeId: 'D204',
      department: '2025/08/11',
      name: '19:24',
    },
  ];

  return (
    <>
      <span className="font-bold text-[16px]">補正處理</span>
      <div className="flex flex-col mt-6 gap-6">
        <DataEntry_fong caption="異常日期" disabled>
          <Input value={date}></Input>
        </DataEntry_fong>
        <DataEntry_fong caption="異常類型" disabled>
          <Input value={exceptionType}></Input>
        </DataEntry_fong>
        <DataEntry_fong
          caption={<div className="font-bold">選擇下班打卡</div>}
          isMust
          childrenWrapperProps={{ style: { border: 'none', padding: '0px' } }}
        >
          <Table columns={columns2} dataSource={data2} pagination={false} className={scss.customTable} />
        </DataEntry_fong>
      </div>
      <div className="flex items-center justify-end mt-10 gap-3">
        <Btn onClick={handleClose}>返回</Btn>
        <Btn onClick={handleClose} theme="save">
          儲存
        </Btn>
      </div>
    </>
  );
};
