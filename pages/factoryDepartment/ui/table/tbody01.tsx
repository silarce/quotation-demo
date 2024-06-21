import { Key, MouseEvent, useEffect, useState } from 'react';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import iconPlace from 'public/image/icon/place.svg';
import { IconAddCircle, IconChain, IconCross01, IconDetail, IconSearch, IconTearing, Icon_info } from 'public/image/icon/svgComponent/svgIcons';
import scss from './tbody01.module.scss';
import scss2 from './tbody02.module.scss';
import router from 'next/router';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { Transfer } from 'antd';
import { IconButton } from '@mui/material';
import IconContext from '@ant-design/icons/lib/components/Context';
import { IconMap } from 'antd/lib/result';
import icon_arrowdown from 'public/image/icon/arrow_down_tray.svg';
import icon_arrowup from 'public/image/icon/arrow_up_tray.svg';
import icon_arrowchange from 'public/image/icon/arrow_change_tray.svg';


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
        whnamecalled: whnamecalled
      },
    });

  }

  async function getWHPositionByWareHouseAndTray(whid: any, trayname: any, whname: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any) {
    router.push({
      pathname: `/factoryDepartment/whPositionList`,
      query: {
        type: 'WHPosition',
        whid: whid,
        trayname: trayname,
        whname: whname,
        traycalled: traycalled,
        traycalledname: traycalledname,
        traytransfer: traytransfer,
        url: url,
        whnamecalled: whnamecalled
      },
    });

  }

  async function editWHPositionById(id: any, whid: any, trayname: any, whname: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any) {
    router.push({
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
                <span>{_item.materialnumber}</span>
                <span>{_item.batchnumber}</span>
                <span>{_item.whpname}</span>
                <span>{_item.spec}</span>
                <span>{_item.quantity}</span>
                <span>{_item.unit}</span>
                <span>{_item.whname}</span>
                <span>{_item.length}-{_item.width}</span>
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
                <span>{_item.trayname}</span>
                {/* <span>{_item.whid}</span> */}
                <span>{_item.traycode}</span>
                {/* <span style={{ fontSize: '4vmin' }}>{_item.length}X{_item.width}</span> */}
                <span style={{ color: '#ea1833', fontWeight: 'bolder' }}>{_item.length}X{_item.width}</span>
                <span>{_item.whname}</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span ><IconDetail onClick={() => getWHPositionByWareHouseAndTray(_item.whid, _item.trayname, _item.whname, traycalled, traycalledname, traytransfer, url, whnamecalled)} /></span>
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
                <span ><button onClick={() => { alert("ok") }}>
                  {/* {icon_arrowdown} */}
                  <span>
                    <img src={icon_arrowdown.src} alt="Arrow Down" style={{ width: '30px', height: '30px' }} />
                  </span>
                  &nbsp;
                  <span>
                    <img src={icon_arrowup.src} alt="Arrow Down" style={{ width: '30px', height: '30px' }} />
                  </span>
                  &nbsp;
                  <span>
                    <img src={icon_arrowchange.src} alt="Arrow Down" style={{ width: '30px', height: '20px' }} />
                  </span>
                </button></span>
              </div>
            </CellWithBar>
          ))
        )}
      </div>
    );
  }

  return null; // Add default return in case type is not matched
}
