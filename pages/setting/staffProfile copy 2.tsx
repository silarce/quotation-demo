// 人員資料
// 人員資料

// components
import PageHeader from "components/PageTitle/pageHeader"

// antd
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./staffProfile.module.scss"


export default function StaffProfile() {

  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        <ButtonBar01 />
      </PageHeader>

      <div className={style.mainContainer}>
        <Table className={style.antdTable}
          columns={columns} dataSource={data}
          pagination={false}
        />
      </div>

    </div>
  )
}
// ===========================================================
// 搜尋 新增員工資料
const ButtonBar01 = () => {

  return (
    <div className={style.headerBar}>
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入使用者代號" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon" />
      </div>

      <button className={style.addButton}
        onClick={() => { }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span>新增員工資料</span>
      </button>

    </div>
  )

}

// =================================================



interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];



const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];