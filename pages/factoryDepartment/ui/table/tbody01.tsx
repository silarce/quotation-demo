import { Key, MouseEvent, useEffect, useState } from 'react';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import iconPlace from 'public/image/icon/place.svg';
import { IconAddCircle, IconChain, IconCross01, IconDetail, IconSearch, IconTearing, Icon_info } from 'public/image/icon/svgComponent/svgIcons';
import scss from './tbody01.module.scss';
import scss2 from './tbody02.module.scss';
import router from 'next/router';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { Transfer, Button, Modal } from 'antd';
import { IconButton } from '@mui/material';
import IconContext from '@ant-design/icons/lib/components/Context';
import { IconMap } from 'antd/lib/result';
import icon_arrowdown from 'public/image/icon/arrow_down_tray.svg';
import icon_arrowup from 'public/image/icon/arrow_up_tray.svg';
import icon_arrowchange from 'public/image/icon/arrow_change_tray.svg';
import { inspect } from 'util';
import Thead01 from './thead01';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_exclam from 'public/image/icon/fc_exclam.svg';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import icon_fc_arrow_down_red from 'public/image/icon/fc_arrow_down_red.svg';
import { setting } from '../../wareHouseList/index';
import moment from 'moment';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import PurchaseOrderList from 'pages/factoryDepartment/purchaseOrderList';
import { first } from 'lodash';

type TBodyItemContent = {};

interface TbodyProps {
  data: any[];
  error: any;
  type: string; // Add type here
  traycalled: any;
  traycalledname: any;
  traytransfer: any;
  url: any;
  whnamecalled: any;
}


export interface PickingListModel {
  id?: string;
  create_at?: string;
  create_by?: string;
  description?: string;
  note?: string;
  plnumber?: string;
  picked?: string;
}

export default function Tbody01({ data, error, type, traycalled, traycalledname, traytransfer, url, whnamecalled }: TbodyProps) {



  async function getTrayByWareHouse(whid: any, whname: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any) {
    router.push({
      pathname: `/factoryDepartment/trayList`,
      query: {
        type: 'Tray',
        whid: whid,
        whname: whname,
        url: url,
        traycalled: traycalled,
        traycalledname: traycalledname,
        traytransfer: traytransfer,
        whnamecalled: whnamecalled,
        firstin: 1
      },
    });

  }

  async function getWHPositionByWareHouseAndTray(whid: any, trayname: any, whname: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any, trayid: any) {
    console.log(whid);
    console.log(trayname);


    router.replace({
      // pathname: `/factoryDepartment/whPositionList`,
      pathname: `/factoryDepartment/trayList`,
      query: {
        type: 'WHPosition',
        whid: whid,
        trayname: trayname,
        whname: whname,
        traycalled: traycalled,
        traycalledname: traycalledname,
        traytransfer: traytransfer,
        url: url,
        whnamecalled: whnamecalled,
        firstin: 0,
        trayid: trayid
      },
    });

  }

  async function editWHPositionById(id: any, whid: any, trayname: any, whname: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any) {
    router.replace({
      pathname: `/factoryDepartment/editWHPosition`,
      query: {
        type: 'WHPosition',
        whid: whid,
        trayname: trayname,
        whname: whname,
        id: id,
        traycalled: traycalled,
        traycalledname: traycalledname,
        traytransfer: traytransfer,
        whnamecalled: whnamecalled
      },
    });
  }

  async function GetPickingListDetailById(plid: any, create_at: any, create_by: any, lotid: any, picked: any, item: any) {

    // console.log(item);
    router.replace({
      pathname: `/factoryDepartment/getMaterial/pickingList`,
      query: {
        type: 'ss',
        plid: plid,
        create_at: getTaiwanDateStr(create_at),
        create_by: create_by,
        lotid: lotid,
        picked: picked,
        main_item: item.main_item,
        note: item.note
      },
    });
  }

  //依據領料單物料取得符合料號與數量的托盤
  async function GetTrayByMaterialNumber(item: any) {

    // console.log(item);
    router.replace({
      pathname: `/factoryDepartment/getMaterial/pickingListDetail`,
      query: {
        type: 'ss',
      },
    });
  }

  //#region 採購單

  async function GetPurchaseOrder(item: any) {
    router.replace({
      pathname: `/factoryDepartment/purchaseOrderList`,
      query: {
        purchaseorderuuid: item.purchaseorderuuid,
        purchaseorderid: item.purchaseorderid,
        create_at: getTaiwanDateStr(item.create_at),
        create_by: item.create_by,
        receipted: item.receipted,
        suppliername: item.suppliername,
        suppliertaxid: item.suppliertaxid,
        supplieraddress: item.supplieraddress,
        supplierphone: item.supplierphone,
        invoice: item.invoice,
        firstin: 1
      }
    })
  }

  async function AddPurchaseOrderDetail(item: any) {
    // alert("in");
    router.push({
      pathname: `/factoryDepartment/purchaseOrderList`,
      query: {
        purchaseorderuuid: item.purchaseorderuuid,
        purchaseorderid: item.purchaseorderid,
        create_at: getTaiwanDateStr(item.create_at),
        create_by: item.create_by,
        receipted: item.receipted,
        suppliername: item.suppliername,
        suppliertaxid: item.suppliertaxid,
        supplieraddress: item.supplieraddress,
        supplierphone: item.supplierphone,
        invoice: item.invoice,
        firstin: 1,
        purchaseorderdetailuuid: item.id
      }
    })
  }


  //#endregion

  async function GetProdReceipt(item: any) {
    router.replace({
      pathname: `/factoryDepartment/prodReceiptList`,
      query: {
        prodreceiptuuid: item.prodreceiptuuid,
        prodreceiptid: item.prodreceiptid,
        purchaseorderuuid: item.purchaseorderuuid,
        purchaseorderid: item.purchaseorderid,
        purchaseordercreate_at: getTaiwanDateStr(item.purchaseordercreate_at),
        purchaseordercreate_by: item.purchaseordercreate_by,
        create_at: getTaiwanDateStr(item.create_at),
        create_by: item.create_by,
        inspected: item.inspected,
        suppliername: item.suppliername,
        suppliertaxid: item.suppliertaxid,
        supplieraddress: item.supplieraddress,
        supplierphone: item.supplierphone,
        invoice: item.invoice,
        firstin: 1
      }
    })
  }
  //#region 請購單
  //請購單
  async function GetPurchaseRequisition(item: any) {

    // setRefreshpurchaserequisitiondetail(item);

    router.replace({
      pathname: `/factoryDepartment/purchaseRequisitionList`,
      query: {
        purchaserequisitionuuid: item.purchaserequisitionuuid,
        purchaserequisitionid: item.purchaserequisitionid,
        create_at: getTaiwanDateStr(item.create_at),
        create_by: item.create_by,
        approved: item.approved,
        firstin: 1
      }
    })
  }

  

  //#endregion



  //#region 日期格式處理 收
  // 日期格式處理
  function convertToYearMonthDay(datetimetype: string, isoDateString: string | number | Date) {
    if (datetimetype === "Date") {
      // onlyDate
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;

    } else {
      // datetime
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

  }
  //#endregion



  if (type === "WareHouse") {

    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader}>
              <div className={scss.row01}>
                <span>{_item.whname}</span>
                <span>{_item.position}</span>
                <span style={{ color: '#14256a', fontWeight: 'bolder' }}>{_item.traycodetotal}</span>
                {/* <span>{convertToYearMonthDay('Datea', _item.created_at)}</span> */}
                {/* <span>{_item.create_by}</span> */}
                <span>{_item.url}</span>
                <span>{_item.update_by}</span>
                {/* <span>{convertToYearMonthDay('Datea', _item.update_at)}</span> */}
                <span>{getTaiwanDateStr(_item.update_at)}</span>
                <span ><IconDetail onClick={() => getTrayByWareHouse(_item.id, _item.whname, traycalled, traycalledname, traytransfer, url, whnamecalled)} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "WHPosition") {
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader3}  >
              <div className={scss.row01} >
                {/* <span>{_item.materialnumber}</span> */}
                <span>{_item.length}-{_item.width}</span>
                <span>{_item.materialnumber}</span>
                {/* <span>{_item.batchnumber}</span> */}
                <span>{_item.whpname}</span>
                <span>{_item.spec}</span>
                <span>{_item.quantity}</span>
                {/* <span>{_item.unit}</span> */}
                {/* <span>{_item.whname}</span> */}
                {/* <span>{_item.whpchildid}</span> */}
                <span ><IconDetail onClick={() => editWHPositionById(_item.id, _item.whid, _item.trayname, _item.whname, traycalled, traycalledname, traytransfer, url, whnamecalled)} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "Tray") {
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader2}>
              <div className={scss.row01}>
                <span>{_item.whname}</span>
                <span>{_item.trayname}</span>
                <span>{_item.length}</span>
                <span>{_item.width}</span>
                <span>{getTaiwanDateStr(_item.update_at)}</span>
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                {/* <span style={{ fontSize: '4vmin' }}>{_item.length}X{_item.width}</span> */}
                <span ><IconDetail onClick={() => getWHPositionByWareHouseAndTray(_item.whid, _item.trayname, _item.whname, traycalled, traycalledname, traytransfer, url, whnamecalled, _item.trayid)} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "materialList") {
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader4}>
              <div className={scss.row01}>
                <span>{_item.whpname}</span>
                <span>{_item.materialnumber}</span>
                <span>{_item.spec}</span>
                <span>{_item.quantity}</span>
                <span>{_item.whname}</span>
                <span>{_item.trayname}</span>
                {/* <span ><IconDetail onClick={() => getWHPositionByWareHouseAndTray(_item.whid, _item.trayname, _item.whname, traycalled, traycalledname, traytransfer, url, whnamecalled)} /></span> */}
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "GetMatWarehouseList") {
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader5}>
              <div className={scss.row01}>
                <span>{_item.whname}</span>
                <span>{_item.trayname}</span>
                {/* <span ><IconDetail onClick={() => {alert("ok")}}/></span> */}
                <span >
                  {/* {icon_arrowdown} */}
                  <span>
                    <button onClick={() => { alert("ok") }}>
                      <img src={icon_arrowdown.src} alt="Arrow Down" style={{ width: '30px', height: '30px' }} />
                    </button>
                  </span>
                  &nbsp;
                  <span>
                    <button onClick={() => { alert("ok") }}>
                      <img src={icon_arrowup.src} alt="Arrow Down" style={{ width: '30px', height: '30px' }} />
                    </button>
                  </span>
                  &nbsp;
                  <span>
                    <img src={icon_arrowchange.src} alt="Arrow Down" style={{ width: '30px', height: '20px' }} />
                  </span>
                </span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "PickingList") {
    // 領料單
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader6}>
              <div className={scss.row01}>
                <span>{_item.plid}</span>
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                <span>{_item.create_by}</span>
                <span>
                  <span style={{ color: '#14256a', display: `${_item.picked === true ? "" : "none"}` }}>已領</span>
                  <span style={{ color: '#ea1833', display: `${_item.picked === false ? "" : "none"}` }}>未領</span>
                </span>
                <span ><IconDetail onClick={() => { GetPickingListDetailById(_item.plid, _item.create_at, _item.create_by, _item.lotid, _item.picked, _item) }} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "PickingDetailList") {
    // 領料單.領料單明細
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader7}>
              <div className={scss.row01}>
                <span>{index + 1}</span>
                <span>{_item.productname}</span>
                <span>{_item.quantity}</span>
                <span>{_item.unit}</span>
                <span>{_item.note}</span>
                <span></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "PickingDetailList2") {
    // 領料明細單.開始領料
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader8}>
              <div className={scss.row01}>
                <span>{index + 1}</span>
                <span>{_item.productname}</span>
                <span>{_item.quantity}</span>
                <span>{_item.unit}</span>
                <span>{_item.note}</span>
                <span ><IconDetail onClick={() => { GetTrayByMaterialNumber(_item) }} /></span>
                {/* <span><IconDetail/></span> */}
                {/* <span ><IconDetail onClick={() => { alert("右測顯示領料明細") }} /></span> */}
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  } else if (type === "ProdEntry") {
    // 領料明細單.開始領料
    return (
      <div>
        {error && <p>Error: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader9}>
              <div className={scss.row01}>
                {/* <span>{index + 1}</span> */}
                <span>{_item.prodentryid}</span>
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                <span>{_item.create_by}</span>
                <span ><IconDetail onClick={() => { GetTrayByMaterialNumber(_item) }} /></span>
                {/* <span><IconDetail/></span> */}
                {/* <span ><IconDetail onClick={() => { alert("右測顯示領料明細") }} /></span> */}
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#region 採購單
  else if (type === "PurchaseOrder") {
    return (
      <div>
        {error && <p>Error1: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader10}>
              <div className={scss.row01}>
                {/* <span>{index + 1}</span> */}
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                <span>{_item.purchaseorderid}</span>
                <span>{_item.totalprice.toLocaleString()}</span>
                <span style={{ color: '#ea1833', display: `${_item.receipted === false ? "" : "none"}` }}>未結</span>
                <span style={{ color: '#14256a', display: `${_item.receipted === true ? "" : "none"}` }}>已結</span>
                <span ><IconDetail onClick={() => { GetPurchaseOrder(_item) }} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#endregion

  //#region 採購單明細
  else if (type === "PurchaseOrderDetail") {
    return (
      <div>
        {error && <p>Error2: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader11}>
              <div className={scss.row01}>
                <span>{index + 1}</span>
                <span>{_item.productid}</span>
                <span>{_item.name}</span>
                <span>{_item.spec}</span>
                <span>{_item.quantity}</span>
                <span>{_item.unit}</span>
                <span>{_item.unitprice.toLocaleString()}</span>
                <span>{_item.totalprice.toLocaleString()}</span>
                <span>
                  <button onClick={() => { AddPurchaseOrderDetail(_item) }}>
                    <img src={icon_fc_arrow_down.src} alt="add" style={{ width: '20px', height: '20px' }} />
                  </button>
                </span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#endregion

  //#region 進貨單
  else if (type === "ProdReceipt") {
    return (
      <div>
        {error && <p>Error1: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader12}>
              <div className={scss.row01}>
                {/* <span>{index + 1}</span> */}
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                <span>{_item.purchaseorderid}</span>
                <span>{_item.prodreceiptid}</span>
                {/* <span>{_item.totalprice.toLocaleString()}</span> */}
                <span style={{ color: '#ea1833', display: `${_item.inspected === false ? "" : "none"}` }}>未驗</span>
                <span style={{ color: '#14256a', display: `${_item.inspected === true ? "" : "none"}` }}>已驗</span>
                <span ><IconDetail onClick={() => { GetProdReceipt(_item) }} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#endregion

  //#region 進貨單明細
  else if (type === "ProdReceiptDetail") {
    return (
      <div>
        {error && <p>Error2: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader14}>
              <div className={scss.row01}>
                <span>{index + 1}</span>
                <span>{_item.productid}</span>
                <span>{_item.name}</span>
                <span>{_item.spec}</span>
                <span>{_item.quantity}</span>
                <span>{_item.unit}</span>
                <span>{_item.unitprice.toLocaleString()}</span>
                <span>{_item.totalprice.toLocaleString()}</span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#endregion

  //#region 請購單
  else if (type === "PurchaseRequisition") {
    return (
      <div>
        {error && <p>Error1: {error}</p>}
        {data && (
          data.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader15}>
              <div className={scss.row01}>
                {/* <span>{index + 1}</span> */}
                <span>{getTaiwanDateStr(_item.create_at)}</span>
                <span>{_item.purchaserequisitionid}</span>
                {/* <span>{_item.totalprice.toLocaleString()}</span> */}
                <span style={{ color: '#ea1833', display: `${_item.approved === false ? "" : "none"}` }}>未結</span>
                <span style={{ color: '#14256a', display: `${_item.approved === true ? "" : "none"}` }}>已結</span>
                <span ><IconDetail onClick={() => { GetPurchaseRequisition(_item) }} /></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }
  //#endregion
  //#region 請購單明細
  // else if (type === "PurchaseRequisitionDetail") {
  //   return (
  //     <div>
  //       {error && <p>Error2: {error}</p>}
  //       {data && (
  //         data.map((_item: any, index: number) => (
  //           <CellWithBar key={index} className={scss.panelHeader16}>
  //             <div className={scss.row01}>
  //               <span>{index + 1}</span>
  //               <span>{_item.productid}</span>
  //               <span>{_item.name}</span>
  //               <span>{_item.spec}</span>
  //               <span>{_item.quantity}</span>
  //               <span>{_item.unit}</span>
  //               <span><IconDetail onClick={() => prQuotereqModalOpen(_item)} /></span>
  //               <span>{_item.unitprice.toLocaleString()}</span>
  //               <span>{_item.totalprice.toLocaleString()}</span>
  //               <span>{_item.suppliername}</span>
  //             </div>
  //           </CellWithBar>
  //         ))
  //       )}
  //       {/* 詢價單modal */}
        
  //     </div>

  //   );
  // }
  //#endregion

  //#region 詢價單明細
  // else if (type === "Quotereq") {
  //   return (
  //     <div>
  //       {error && <p>Error1: {error}</p>}
  //       {data && (
  //         data.map((_item: any, index: number) => (
  //           <CellWithBar key={index} className={scss.panelHeader17}>
  //             <div className={scss.row01}>
  //               <span>{index + 1}</span>
  //               <span>{_item.suppliername}</span>
  //               <span>{_item.unitprice}</span>
  //               <span>{_item.totalprice}</span>
  //               <span>{_item.unit}</span>
  //               <span>{getTaiwanDateStr(_item.deliverydate)}</span>
  //               <span>{_item.note}</span>
  //               <span>
  //                 <input
  //                   className={scss.quotereqdetail_checkbox}
  //                   type='checkbox'
  //                   checked={selectedsupplier === _item.id}
  //                   onChange={() => handleCheckboxChange(_item)}
  //                 />
  //               </span>
  //               {/* <span><input type='checkbox'/></span> */}
  //             </div>
  //           </CellWithBar>
  //         ))
  //       )}
  //     </div>
  //   );
  // }
  //#endregion

  return null; // Add default return in case type is not matched


}
