
// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// css
import style from "./side.module.scss"


export default function Side() {


  return (
    <div className={style.container}>




      <Collapse className={style.collapse}
        defaultActiveKey={['1']} ghost
        onChange={() => { }}>
        <Panel header="基本資料建立" key="1">
          <ul>
            <li>公司資料</li>
            <li>公司職等職稱</li>
            <li>人員資料</li>
            <li>人事權限管理</li>
          </ul>
        </Panel>
      </Collapse>
      <p>客戶列表</p>
      <p>產品列表</p>



    </div>
  )
}


// ==============================================


const settingList = [
  {
    label: "基本資料建立",
    list: [
      {
        label: "公司資料",
        path: "/setting/theCompanyInfo",
      },
      {
        label: "公司職等職稱",
        path: "/setting/grade",
      },
      {
        label: "人員資料",
        path: "/setting/staffProfile",
      },
      {
        label: "人事權限管理",
        path: "setting/hrManage",
      },
    ]
  },
  {
    label: "客戶列表",
    path: "/setting/clientList",
  },
  {
    label: "產品列表",
    path: "/setting/productList"
  },
]









