import style from './thead01.module.scss';

interface TheadProps {
  type: string;
}

const Thead01 = ({ type }: TheadProps): JSX.Element | null => {
  if (type === "WareHouse") {
    return (
      <div className={style.thead}>
        <span>倉庫名稱</span>
        <span>倉庫位置</span>
        <span>托盤數量</span>
        {/* <span>建立時間</span> */}
        {/* <span>建立人員</span> */}
        <span>IP位址</span>
        <span>修改人員</span>
        <span>修改時間</span>
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
        {/* <span>物料單位</span> */}
        {/* <span>倉庫名稱</span> */}
        {/* <span>儲位子編號</span> */}
        <span>{/* 按鈕格 留白 */}</span>
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
        <span>入庫單號</span>
        <span>入庫日期</span>
        <span>入庫人員</span>
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
        <span>採購日期</span>
        <span>採購單號</span>
        <span>總金額</span>
        <span>狀態</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 採購單明細
  else if (type === "PurchaseOrderDetail") {
    return (
      <div className={style.thead11}>
        <span>次序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>已進</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單
  else if (type === "ProdReceipt") {
    return (
      <div className={style.thead12}>
        <span>進貨日期</span>
        <span>採購單號</span>
        <span>進貨單號</span>
        <span>狀態</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單明細
  else if (type === "ProdReceiptDetail") {
    return (
      <div className={style.thead14}>
        <span>次序</span>
        <span>料號</span>
        <span>品名</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 採購單明細2
  else if (type === "PurchaseOrderDetail2") {
    return (
      <div className={style.thead13}>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>已進數量</span>
        <span>數量</span>
        <span>單位</span>
        <span>單價</span>
        <span>金額</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 進貨單
  else if (type === "PurchaseRequisition") {
    return (
      <div className={style.thead15}>
        <span>請購日期</span>
        <span>請購單號</span>
        <span>狀態</span>
        <span></span>
      </div>
    )
  }
  //#endregion
  //#region 請購單明細
  else if (type === "PurchaseRequisitionDetail") {
    return (
      <div className={style.thead16}>
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
        <span></span>
      </div>
    )
  }
  //#endregion
    //#region 採購單明細2
    else if (type === "PurchaseRequisitionDetail2") {
      return (
        <div className={style.thead21}>
          <span>序</span>
          <span>料號</span>
          <span>品名</span>
          <span>已進數量</span>
          <span>數量</span>
          <span>單位</span>
          <span>單價</span>
          <span>金額</span>
          <span>廠商</span>
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
        <span>單價</span>
        <span>總價</span>
        <span>單位</span>
        <span>出貨日</span>
        <span>備註</span>
        <span>得標</span>
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
  //#region 詢價單明細
  else if (type === "QuotereqDetail") {
    return (
      <div className={style.thead18}>
        <span>序</span>
        <span>料號</span>
        <span>品名</span>
        <span>數量</span>
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
        <span>序</span>
        <span>名稱</span>
        <span>規格</span>
        <span>數量</span>
        <span>單位</span>
        <span>備註(用途說明)</span>
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
