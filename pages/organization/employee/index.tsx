import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import Input from 'components/global/myCom/Input/Input';
import { useEffect, useState } from 'react';
import SearchButton from 'components/global/myCom/button/searchButton';
import ClearButton from 'components/global/myCom/button/clearButton';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import listIcon from 'public/image/icon/fong/Procurement2.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import MySelect from 'components/global/myCom/select/mySelect';
import Btn from 'components/global/gear/button/btn_fong';

// api
import { getEmployeeList } from 'components/page/organization/employee/api';

// scss
import scss from './employee.module.scss';
import tableScss from 'components/global/myCom/myTable/table.module.scss';
interface EmployeeItem {
  key: string;
  emp_code: string;
  department: string;
  job_title: string;
  emp_ch_name: string;
  nationality: string;
  work_location: string;
  shift: string;
  duty_type: string;
  salary_type: string;
  onboard_date: string;
  seniority: number;
}

export default function EmployeeData() {
  const [input, setInput] = useState('');
  const [checkedEmployees, setCheckedEmployees] = useState<string[]>([]);
  const [employeeList, setEmployeeList] = useState<EmployeeItem[]>([]);
  const router = useRouter();

  const fetchEmployeeList = async () => {
    try {
      const res = await getEmployeeList({ fe_search: input.trim() });

      if (res.length === 0) {
        return;
      }

      const formattedData: EmployeeItem[] = res.map((item: any) => ({
        key: item.emp_id,
        emp_code: item.emp_code,
        department: item.department,
        emp_ch_name: item.emp_ch_name,
      }));

      setEmployeeList(formattedData);
    } catch (err) {
      console.error('取得員工資料失敗', err);
    }
  };

  useEffect(() => {
    fetchEmployeeList(); // 初次載入
  }, []);

  const handleCheck = (emp_code: string) => {
    setCheckedEmployees((prev) =>
      prev.includes(emp_code) ? prev.filter((code) => code !== emp_code) : [...prev, emp_code]
    );
  };

  const handleSelectAll = () => {
    const allCodes = employeeList.map((item) => item.emp_code);
    setCheckedEmployees(checkedEmployees.length === allCodes.length ? [] : allCodes);
  };

  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: '員工資料維護',
      },
    ],
  };

  const columns: ColumnsType<EmployeeItem> = [
    {
      title: '員工編號',
      dataIndex: 'emp_code',
      key: 'emp_code',
      width: '6%',
      align: 'right',
    },
    {
      title: '部門',
      dataIndex: 'department',
      key: 'department',
      width: '5%',
    },
    {
      title: '職稱',
      dataIndex: 'job_title',
      key: 'job_title',
      width: '5%',
    },
    {
      title: '姓名',
      dataIndex: 'emp_ch_name',
      key: 'emp_ch_name',
      width: '5%',
    },
    {
      title: '國籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: '4%',
    },
    {
      title: '工作所在地',
      dataIndex: 'work_location',
      key: 'work_location',
      width: '6%',
    },
    {
      title: '班別',
      dataIndex: 'shift',
      key: 'shift',
      width: '4%',
    },
    {
      title: '勤務',
      dataIndex: 'duty_type',
      key: 'duty_type',
      width: '4%',
    },
    {
      title: '薪資類別',
      dataIndex: 'salary_type',
      key: 'salary_type',
      width: '5%',
    },
    {
      title: '到職日',
      dataIndex: 'onboard_date',
      key: 'onboard_date',
      width: '1%',
      align: 'right',
    },
    {
      title: '年資/年',
      dataIndex: 'seniority',
      key: 'seniority',
      width: '5%',
      align: 'right',
    },
    {
      title: '', // 空白欄位標題留空
      dataIndex: 'spacer',
      key: 'spacer',
      width: '25%', // 可視情況加大空間
      render: () => '',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '8%',
      render: (_, record) => (
        <div className="flex justify-center gap-5">
          <Image
            src={listIcon}
            alt="edit"
            onClick={() => router.push(`/setting/organization/employeeData?emp_id=${record.key}`)}
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            onClick={() => console.log('delete')}
            style={{ cursor: 'pointer' }}
            width={16}
            height={16}
          />
        </div>
      ),
    },
  ];

  const data: EmployeeItem[] = [
    {
      key: '1',
      emp_code: '11457',
      department: '生產部',
      job_title: '技術員',
      emp_ch_name: '林建宏',
      nationality: '本國',
      work_location: '台北',
      shift: '早班',
      duty_type: '內勤',
      salary_type: '薪資資資',
      onboard_date: '2024/02/04',
      seniority: 1,
    },
    {
      key: '2',
      emp_code: '11437',
      department: '品保部',
      job_title: '品管員',
      emp_ch_name: '陳怡君',
      nationality: '外國',
      work_location: '台中',
      shift: '早班',
      duty_type: '外勤',
      salary_type: '直接人工',
      onboard_date: '2023/02/04',
      seniority: 2,
    },
    {
      key: '3',
      emp_code: '11224',
      department: '廠務部',
      job_title: '技術員',
      emp_ch_name: '陳世齊',
      nationality: '本國',
      work_location: '台中',
      shift: '早班',
      duty_type: '內勤',
      salary_type: '間接人工',
      onboard_date: '2022/02/04',
      seniority: 3,
    },
  ];

  return (
    <>
      <PageHeader {...mapPageHeaderTop} />
      <div className="border-[1px] border-[#616161] rounded-lg py-8">
        <div className="px-6  pb-6 flex justify-between">
          <div className="flex gap-4 h-[40px]">
            <Input marginLeft="0px" value={input} onChange={setInput} placeholder="請輸入員工代碼/姓名" width="176px" />
            <MySelect className="w-full" marginLeft="0px" placeholder="選擇部門" />
            <Btn theme="query" onClick={fetchEmployeeList} className="whitespace-nowrap">
              查詢資料
            </Btn>
          </div>
          <div className="flex gap-6 h-[40px]">
            {checkedEmployees.length > 0 && <ClearButton label="全部刪除" onClick={() => console.log('Clear!')} />}
            <Btn theme="add" onClick={() => router.push('/organization/employee/addEmployee')}>
              新增員工
            </Btn>
          </div>
        </div>
        <div className="px-6">
          <Table
            className={tableScss.customTable}
            columns={columns}
            dataSource={data}
            rowKey="key"
            bordered
            style={{ minWidth: '50%' }}
          />
        </div>
      </div>
    </>
  );
}
