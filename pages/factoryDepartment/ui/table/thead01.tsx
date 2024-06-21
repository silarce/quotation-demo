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
        <span>物料編碼</span>
        <span>批號</span>
        <span>物料名稱</span>
        <span>規格</span>
        <span>數量</span>
        <span>物料單位</span>
        <span>倉庫名稱</span>
        <span>儲位編號</span>
        {/* <span>儲位子編號</span> */}
        <span>{/* 按鈕格 留白 */}</span>
      </div>
    );
  } else if (type === "Tray") {
    return (
      <div className={style.thead2}>
        <span>托盤名稱</span>
        {/* <span>倉庫代號</span> */}
        <span>托盤代號</span>
        <span>托盤格數</span>
        <span>倉庫名稱</span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
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
  }
  else {
    return null;
  }
}

export default Thead01;
