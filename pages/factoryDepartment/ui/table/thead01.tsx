import style from './thead01.module.scss';

interface TheadProps {
  type: string;
}

const Thead01 = ({ type }: TheadProps): JSX.Element | null => {
  if (type === "WareHouse") {
    return (
      <div className={style.thead}>
        <span></span>
        <span>倉庫名稱</span>
        <span>倉庫類型</span>
        <span>倉庫內容</span>
        <span>托盤數量</span>
        <span>倉庫位置</span>
        <span>修改人員</span>
        <span>修改時間</span>
        <span>IP位址</span>
        <span>{/* 按鈕格 留白 */}</span>
      </div>
    );
  } else if (type === "WHPosition") {
    return (
      <div className={style.thead3}>
        <span>儲位編碼</span>
        <span>物料編碼</span>
        {/* <span>批號</span> */}
        <span>物料名稱</span>
        <span>規格</span>
        <span>數量</span>
        <span></span>
      </div>
    );
  } else if (type === "Tray") {
    return (
      <div className={style.thead2}>
        <span>設備編號</span>
        {/* <span>倉庫代號</span> */}
        <span>托盤編碼</span>
        <span>列數</span>
        <span>行數</span>
        <span>修改時間</span>
        <span>建立時間</span>
        <span>{/* 按鈕格 留白 */}</span>
      </div>
    )
  } else if (type === "materialList") {
    return (
      <div className={style.thead4}>
        <span>物料名稱</span>
        <span>物料編號</span>
        <span>規格</span>
        <span>數量</span>
        <span>倉庫</span>
        <span>托盤</span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  } else if (type === "GetMatWarehouseList") {
    return (
      <div className={style.thead5}>
        <span>倉庫</span>
        <span>托盤</span>
        <span> </span>
        <span> </span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  } else if (type === "PickingList") {
    return (
      <div className={style.thead6}>
        <span>領料單號</span>
        <span>領料日期</span>
        <span>領料人員</span>
        <span>狀態</span>
        <span></span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  } else if (type === "PickingDetailList") {
    return (
      <div className={style.thead7}>
        <span>序號</span>
        <span>品名/規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>備註</span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  } else if (type === "PickingDetailList2") {
    return (
      <div className={style.thead8}>
        <span>次序</span>
        <span>品名/規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>備註</span>
        <span></span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  }
  //#region 入庫單
  else if (type === "ProdEntry") {
    return (
      <div className={style.thead9}>
        <span>序</span>
        <span>入庫單號</span>
        <span>入庫日期</span>
        <span>狀態</span>
        <span>廠商名稱</span>
        <span></span>
        {/* <span>按鈕格 留白</span> */}
      </div>
    )
  }
  //#endregion
  //#region 採購單
  else if (type === "PurchaseOrder") {
    return (
      <div className={style.thead10}>
        <span>序</span>
        <span>採購單號</span>
        <span>採購日期</span>
        {/* <span>總金額</span> */}
        <span>狀態</span>
        <span>廠商名稱</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 採購單明細
  else if (type === "PurchaseOrderDetail") {
    return (
      <div className={style.thead11}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>已進</span>
        <span>數量</span>
        <span>單位</span>
        <span></span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單
  else if (type === "ProdReceipt") {
    return (
      <div className={style.thead12}>
        <span>序</span>
        <span>進貨單號</span>
        <span>進貨日期</span>
        {/* <span>採購單號</span> */}
        {/* <span>入庫狀態</span>
        <span>付款狀態</span> */}
        <span>狀態</span>
        <span>廠商名稱</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單明細
  else if (type === "ProdReceiptDetail") {
    return (
      <div className={style.thead14}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>已入</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 採購單明細2
  else if (type === "PurchaseOrderDetail2") {
    return (
      <div className={style.thead13}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>已進數量</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 請購單
  else if (type === "PurchaseRequisition") {
    return (
      <div className={style.thead15}>
        <span>序</span>
        <span>請購單號</span>
        <span>請購日期</span>
        <span>狀態</span>
        <span>備註</span>
        {/* <span>請購人員</span> */}
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 請購單明細
  else if (type === "PurchaseRequisitionDetail") {
    return (
      <div className={style.thead16}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>詢價</span>
        <span>單價</span>
        <span>金額</span>
        <span>廠商</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 採購單明細2
  else if (type === "PurchaseRequisitionDetail2") {
    return (
      <div className={style.thead21}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        {/* <span>已進數量</span> */}
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>廠商</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 詢價單明細
  else if (type === "Quotereq") {
    return (
      <div className={style.thead17}>
        <span>序</span>
        <span>供應商</span>
        <span>詢價日期</span>
        <span>數量</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>單位</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>單價</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>總價</span>
        <span>備註</span>
        <span>選擇</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 詢價單明細
  else if (type === "QuotereqDetail") {
    return (
      <div className={style.thead18}>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>已詢數</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 物料明細
  else if (type === "AddPR_GetProduct") {
    return (
      <div className={style.thead19}>
        <span>料號</span>
        <span>名稱</span>
        <span>規格</span>
        <span>庫存</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增請購單明細
  else if (type === "AddPR_ReqList") {
    return (
      <div className={style.thead20}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>備註(用途說明)</span>
        <span></span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 物料明細
  else if (type === "qoDetail_SupplierList") {
    return (
      <div className={style.thead22}>
        <span>名稱</span>
        <span>地址</span>
        <span>電話</span>
        <span>統編</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 詢價單明細
  // else if (type === "Quotereq2") {
  //   return (
  //     <div className={style.thead23}>
  //       <span>序</span>
  //       <span>供應商</span>
  //       <span>單價</span>
  //       <span>總價</span>
  //       <span>單位</span>
  //       <span>出貨日</span>
  //       <span>備註</span>
  //       <span>得標</span>
  //       <span></span>
  //     </div>
  //   )
  // }
  else if (type === "Quotereq2") {
    return (
      <div className={style.thead23}>
        <span>序</span>
        <span>供應商</span>
        <span>詢價日期</span>
        <span>數量</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>單位</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>單價</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>總價</span>
        <span>類別</span>
        <span>單號</span>
        <span></span>
        <span>選擇</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單明細2
  else if (type === "ProdReceiptDetail2") {
    return (
      <div className={style.thead24}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>已入</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 入庫單明細
  else if (type === "ProdEntryDetail") {
    return (
      <div className={style.thead25}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>已入</span>
        <span>數量</span>
        <span>單位</span>
        <span>庫存</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 入庫單明細
  else if (type === "ProdEntryWhpositionList") {
    return (
      <div className={style.thead26}>
        <span>序</span>
        <span>倉庫</span>
        <span>托盤</span>
        <span>儲格</span>
        <span>品名</span>
        <span>數量</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 物料明細
  else if (type === "ProductList") {
    return (
      <div className={style.thead27}>
        <span>序</span>
        <span>料號</span>
        <span>名稱</span>
        <span>規格</span>
        <span>材質</span>
        <span>表面</span>
        <span>庫存</span>
        <span>單位</span>
        <span>更新日期</span>
        <span>建立日期</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增領料單明細
  else if (type === "AddPR_PickingList") {
    return (
      <div className={style.thead28}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>已領</span>
        <span>數量</span>
        <span>單位</span>
        <span>領料人員</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核明細
  else if (type === "ReviewList") {
    return (
      <div className={style.thead29}>
        <span>序</span>
        <span>送審日期</span>
        <span>類別</span>
        <span>單號</span>
        <span>主旨</span>
        <span>人員</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核明細
  else if (type === "ReviewStatusList") {
    return (
      <div className={style.thead30}>
        <span>流程</span>
        <span>人員</span>
        <span>狀態</span>
        <span>接收時間</span>
        <span>完成時間</span>
        <span>意見</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核明細
  else if (type === "FlowList") {
    return (
      <div className={style.thead31}>
        <span></span>
        <span>序</span>
        <span>名稱</span>
        <span>審核流程</span>
        {/* <span>單號</span>
        <span>人員</span> */}
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核明細
  else if (type === "FlowDetailList") {
    return (
      <div className={style.thead32}>
        <span></span>
        <span>關卡</span>
        <span>流程</span>
        <span>職稱</span>
        <span>姓名</span>
        {/* <span>單號</span>
          <span>人員</span> */}
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增採購單明細
  else if (type === "AddPO_ReqList") {
    return (
      <div className={style.thead33}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 詢價單
  else if (type === "Quotereq3") {
    return (
      <div className={style.thead34}>
        <span>序</span>
        <span>詢價單號</span>
        <span>詢價日期</span>
        {/* <span>總金額</span> */}
        <span>狀態</span>
        <span>廠商名稱</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  // //#region 新增採購單明細
  else if (type === "AddQOList") {
    return (
      <div className={style.thead37}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>廠商1</span>
        <span>單價1</span>
        <span>成交否1</span>
        <span>廠商2</span>
        <span>單價2</span>
        <span>成交否2</span>
        <span>廠商3</span>
        <span>單價3</span>
        <span>成交否3</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  // //#endregion
  //#region 詢價單明細
  else if (type === "Quotereq4") {
    return (
      <div className={style.thead35}>
        <span>序</span>
        <span>物料編號</span>
        <span>品項名稱</span>
        <span>品項規格</span>
        <span>詢價日期</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>數量</span>
        <span>單位</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>單價</span>
        <span style={{ textAlign: 'right', margin: 'auto 0' }}>總價</span>
        <span>類別</span>
        <span>廠商名稱</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核紀錄
  else if (type === "ReviewHistory") {
    return (
      <div className={style.thead36}>
        <span>序</span>
        <span>審核日期</span>
        <span>審核狀態</span>
        <span>審核關卡</span>
        <span>審核人員</span>
        <span>審核意見</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨紀錄
  else if (type === "ProdReceiptHistory") {
    return (
      <div className={style.thead40}>
        <span>序</span>
        <span>進貨單號</span>
        <span>進貨日期</span>
        <span>單據狀態</span>
        <span>單據備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 物料明細
  else if (type === "BomList") {
    return (
      <div className={style.thead38}>
        <span></span>
        <span>序</span>
        <span>料號</span>
        <span>名稱</span>
        <span>規格</span>
        <span>材質</span>
        <span>表面</span>
        <span>數量</span>
        <span>單位</span>
        <span>更新日期</span>
        <span>建立人員</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增進貨單用的採購單清單
  else if (type === "PurchaseOrderForAddProdReceipt") {
    return (
      <div className={style.thead39}>
        <span></span>
        <span>序</span>
        <span>採購單號</span>
        <span>廠商名稱</span>
        <span>採購日期</span>
        <span>總金額</span>
        <span>採購人員</span>
        <span>狀態</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增進貨單明細
  else if (type === "AddPRe_ReqList") {
    return (
      <div className={style.thead41}>
        <span></span>
        <span>序</span>
        <span>單號</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 新增進貨單明細
  else if (type === "AddPRe_ReqList2") {
    return (
      <div className={style.thead42}>
        <span></span>
        <span>序</span>
        <span>單號</span>
        <span>廠商</span>
        <span>金額</span>
        <span>備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 審核紀錄
  else if (type === "ProdEntryHistory") {
    return (
      <div className={style.thead43}>
        <span>序</span>
        <span>入庫單號</span>
        <span>入庫日期</span>
        <span>單據狀態</span>
        <span>單據備註</span>
        <span></span>
      </div>
    )
  }
  //#endregion


  //#region 新請購單
  else if (type === "PRequisition") {
    return (
      <div className={style.newthead1}>
        <span>序</span>
        <span>請購單號</span>
        <span>狀態</span>
        <span>請購日期</span>
        <span>需用日期</span>
        <span>申請人員</span>
        <span>備註</span>
        <span></span>
        {/* <span>請購人員</span> */}
        <span></span>
      </div>
    )
  }
  //#endregion




  else {
    return null;
  }
}

export default Thead01;