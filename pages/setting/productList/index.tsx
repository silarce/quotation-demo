// 產品列表
// 產品列表
// 產品列表


// component
import FilterPanel from "components/page/setting/productList/filterPanel/filterPanel"

// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// scss
import scss from "./productList.module.scss"










// ==============================================================================
export default function ProductList() {


  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "請輸入搜尋內容",
      onClick: () => { }
    },
    {
      type: "addButton",
      label: "新增備註",
      onClick: () => { }
    },
  ]

  // ---------------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <PageHeader02
        tag="產品列表"
        panelList={panelList}
      />


      <div className={scss.mainContainer}>

        <div>
          <FilterPanel />

        </div>

        <div>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
        </div>
      </div>


    </div>
  )
}

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================














