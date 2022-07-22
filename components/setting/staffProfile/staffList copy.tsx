

import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// icon
import iconDelete from "public/image/icon/delete01.svg"

// css
import style from "./staffList.module.scss"

export default function StaffList() {

  return (
    <Table className={style.antdTable}
      columns={columns} dataSource={data}
      pagination={false}
    />
  )
}


// ================================================




const columns: ColumnsType<DataType> = [
  {
    title: '使用者代號',
    dataIndex: 'staffId',
    width:150,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width:150,
  },
  {
    title: '電話',
    dataIndex: 'phone',
    width:170,
  },
  {
    title: '部門編號/部門名稱/職稱/職等',
    dataIndex: 'info01',
    width:300,
    render: (_, { info01 }) => (
      <>
        {info01.map((item, index) => {
          return (
            <span className={style.infoSpan}
              key={index}
            >
              {item}
            </span>
          )
        })}
      </>
    )
  },
  {
    title: '',
    dataIndex: 'info02',
    render: (_, { info02 }) => (
      <>
        {info02.map((item, index) => {
          return (
            <span className={style.infoSpan}
              key={index}
            >
              {item}
            </span>
          )
        })}
      </>
    )
  },
  {
    title: '',
    key: 'action',
    width:55,
    render: (_) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={style.iconDelete}
        src={iconDelete.src} alt="" />
    ),
  },
];

interface DataType {
  key: string;
  staffId: string;
  name: string;
  phone: number | string;
  info01: string[]; //等到接api看看資料長什麼樣子再改吧
  info02: string[]; //等到接api看看資料長什麼樣子再改吧
}


const data: DataType[] = [
  {
    key: '1',
    staffId: "A001",
    name: '王小明',
    phone: "0987654321",
    info01: ["A", "管理部", "資深經理", "Level 7"],
    info02: []
  },
  {
    key: '2',
    staffId: "A002",
    name: '王中明',
    phone: "0987654321",
    info01: ["A", "管理部", "資淺經理", "Level 5"],
    info02: ["B", "營業部", "資深業務經理", "Level 7"]
  },
  {
    key: '3',
    staffId: "A003",
    name: '王大明',
    phone: "0412345678",
    info01: ["A", "管理部", "資深經理", "Level 7"],
    info02: []
  },
  {
    key: '4',
    staffId: "A004",
    name: '王小明明明',
    phone: "0987654321",
    info01: ["A", "管理部", "資深經理", "Level 7"],
    info02: ["B", "營業部", "資淺業務經理", "Level 5"]
  },
];



