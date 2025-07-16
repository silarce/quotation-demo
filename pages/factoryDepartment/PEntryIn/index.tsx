import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import scss from './PEntryIn.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setting } from '../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg?url';
import icon_save from 'public/image/icon/fc_save.svg?url';
import icon_cancel from 'public/image/icon/fc_cancel.svg?url';
import icon_delete from 'public/image/icon/fc_delete.svg?url';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg?url';
import { Modal } from 'antd';
import { Collapse } from 'components/global/myAntd/collapse';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg?url';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_search from 'public/image/icon/fc_search.svg?url';
import icon_collapse_right from 'public/image/icon/fc_collapse_right.svg?url';
import icon_collapse_left from 'public/image/icon/fc_collapse_left.svg?url';
import icon_detail from 'public/image/icon/fc_detail.svg?url';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg?url';
import icon_close from 'public/image/icon/fc_close.svg?url';
import MyDatePicker from 'components/global/gear/inputAndSel_v2/cog/myDatePicker';
import icon_disable from 'public/image/icon/fc_disable.svg?url';
import icon_print from 'public/image/icon/fc_printer.svg?url';
import { color } from 'html2canvas/dist/types/css/types/color';
import { orange } from '@mui/material/colors';
import icon_remove from 'public/image/icon/fc_remove.svg?url';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_fc_arrow_up from 'public/image/icon/fc_arrow_up.svg?url';
import icon_task_open from 'public/image/icon/fc_task_open.svg?url';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg?url';
import icon_task_close from 'public/image/icon/fc_task_close.svg?url';
import icon_task_approved from 'public/image/icon/fc_approved.svg?url';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg?url';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_sent_review from 'public/image/icon/fc_sent_review.svg?url';
import icon_sent_review_gray from 'public/image/icon/fc_sent_review_gray.svg?url';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg?url';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg?url';
import icon_flow from 'public/image/icon/fc_flow.svg?url';
import icon_review from 'public/image/icon/review.svg?url';
import icon_flow_gray from 'public/image/icon/fc_flow_gray.svg?url';
import icon_sent_review_stop from 'public/image/icon/fc_sent_review_stop.svg?url';
import icon_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_fc_quotereq from 'public/image/icon/fc_quotereq.svg?url';
import icon_export from 'public/image/icon/fc_export.svg?url';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg?url';
import icon_arrow_right2 from 'public/image/icon/longArrow.svg?url';
import icon_search2 from 'public/image/icon/search.svg?url';
import icon_clear from 'public/image/icon/fc_clear.svg?url';

import icon_tray_in from 'public/image/icon/fc_tray_in.svg?url';
import { callTray, updateTrayStatus, getTrayStatus } from '../../../js/api/callTrayService';

export default function PEntryIn() {
  const [pagename, setPagename] = useState<string>('待入品項');

  //#region ===========【路由參數】
  const router = useRouter();
  const {} = router.query;
  //#endregion

  //#region ===========【登入者】
  const { userInfo } = useContext(AppContext);
  const { erpFeature } = useContext(AppContext);
  //#endregion

  //#region ===========【變數宣告】
  //載入動畫
  const [isLoading, setIsLoading] = useState(false);

  //資料列宣告
  const [data, setData] = useState<any[]>([]);
  const [data1, setData1] = useState<any[]>([]);
  const [data1restore, setData1Restore] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data2restore, setData2Restore] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchdata, setSearchdata] = useState<any[]>([]);

  const [data3, setData3] = useState<any[]>([]);

  //搜尋
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');
  const [keyword5, setKeyword5] = useState<string>('');
  // 預設截止日期為今天，起始日期為今天往前推30天
  const defaultEndDate = dayjs();
  const defaultStartDate = dayjs().subtract(30, 'days');

  // 使用 Moment 類型作為狀態
  const [keywordstartdate, setKeywordstartdate] = useState<Dayjs | null>(defaultStartDate);
  const [keywordenddate, setKeywordenddate] = useState<Dayjs | null>(defaultEndDate);

  const [batchidin, setBatchidin] = useState<string>('');

  //#endregion

  //#region ===========【上方功能列】
  const panelList: TpanelList = [
    // {
    //     type: 'addButton',
    //     label: `新增${pagename}單`,
    //     onClick: () => {
    //         router.push({
    //             pathname: `/factoryDepartment/addProdReceiptList`,
    //             query: {
    //             },
    //         });
    //     },
    // },
  ];
  //#endregion

  //#region ===========【頁面進入】
  useEffect(() => {
    Get();
  }, []);

  //#endregion

  //#region ===========【API】

  //取單據
  const Get = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        type: '入庫中的清單',
        username: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/NewGetProdEntryIn?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setData(data);
      setData1Restore(data);
      setSearchdata(data);
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: any) {
      // console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //以ID取單據
  const GetDetailById = async (id: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        prodentryuuid: id as string | undefined,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/NewGetProdEntryDetailById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();
      // setData1(data);
      console.log(responsedata);

      return responsedata;

      console.log();
    } catch (error: any) {
      setError(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region ===========【審核】
  const [review_flow, setReview_flow] = useState<string>('');
  const [reviewbar, setReviewbar] = useState<boolean>(false);
  const [reviewdata, setReviewdata] = useState<any[]>([]);
  const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
  const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
  const [documenttitle, setDocumenttitle] = useState<string>('');
  const [reviewhistroydata, setReviewhistorydata] = useState<any[]>([]);

  //取全部的自訂流程
  const GetReviewFlow = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewFlow?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const text = await response.text();

      if (!text) {
        // console.log('No data returned');
        setReviewdata([]);

        return;
      }

      const data = JSON.parse(text);
      setReviewdata(data);
    } catch (error: any) {
      console.log(error);
      // setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //取單據的審核流程
  const GetReviewById = async (document_uuid: any) => {
    try {
      setReviewflowdata([]);
      setReviewflowdata2([]);

      const conditionModel = {
        document_uuid: document_uuid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewById?${queryParams}`);

      // 檢查響應狀態
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // 檢查響應內容是否為空
      const text = await response.text();

      if (text.trim() === '') {
        return;
      }

      // 解析 JSON
      const data = JSON.parse(text);

      console.log(data);

      // 檢查資料是否存在且有效
      if (data && data.length > 0) {
        setReviewflowdata(data);
      } else {
        console.log('No valid data');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region  ===========【單據功能區】
  const [details, setDetails] = useState<Record<number, any[]>>({});

  const handlePanelClick = async (id: number) => {
    const detailData = await GetDetailById(id);
    console.log(detailData);
    setDetails((prevDetails) => ({
      ...prevDetails,
      [id]: detailData,
    }));
  };

  //#endregion

  //#region ===========【明細功能區】
  //focus選中的明細
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };
  //#endregion

  //#region ===========【單據篩選】
  const filterData = () => {
    const startDate = keywordstartdate;
    const endDate = keywordenddate;
    const id = keyword2.trim();
    const productid = keyword3.trim();
    const name = keyword4.trim();
    const spec = keyword5.trim();

    // 檢查是否所有條件都為空
    if (
      (!startDate || !startDate.isValid()) &&
      (!endDate || !endDate.isValid()) &&
      !id &&
      !productid &&
      !name &&
      !spec
    ) {
      setSearchdata(data);

      return;
    }

    // 過濾資料
    // let filteredData = data.filter(item => {
    //     const createAt = moment(item.create_at);
    //     const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
    //         ? true
    //         : createAt.isBetween(startDate, endDate, 'days', '[]');
    //     return isDateInRange;
    // });

    let filteredData = data;

    // 模糊查詢請購單號
    if (id) {
      filteredData = filteredData.filter((item) => item.detail_prodentryid.toString().includes(id));
    }

    // 模糊查詢單據狀態
    if (productid) {
      filteredData = filteredData.filter((item) => item.detail_productid.toString().includes(productid));
    }

    if (name) {
      filteredData = filteredData.filter((item) => item.detail_name.toString().includes(name));
    }

    if (spec) {
      filteredData = filteredData.filter((item) => item.detail_spec.toString().includes(spec));
    }

    setSearchdata(filteredData);
  };

  // 監聽條件變更
  useEffect(() => {
    filterData();
  }, [keyword2, keyword3, keyword4, keyword5]);
  //#endregion

  //#region ===========【儲格Modal】

  //#region ===【儲格變數】
  const [data11, setData11] = useState<any[]>([]);
  const [whpositionqmodalopen, setWhpositionqmodalopen] = useState<boolean>(false);
  const [normaldata, setNormalData] = useState<any[]>([]);

  const [whpnumber, setWhpnumber] = useState<string>('');
  const [whpproductid, setWhpproductid] = useState<string>('');
  const [whpname, setWhpname] = useState<string>('');
  const [whpspec, setWhpspec] = useState<string>('');
  const [whpquantity, setWhpquantity] = useState<string>('');

  const [maxinboxquantity, setMaxinboxquantity] = useState<number>(0);
  const [inboxquantity, setInboxquantity] = useState<number>(0);

  const [traycalled, setTraycalled] = useState<boolean>(false);
  const [whnamecalled, setWhnamecalled] = useState<string>('');
  const [traynamecalled, setTraynamecalled] = useState<string>('');
  const [whpnamecalled, setWhpnamecalled] = useState<string>('');

  const [selectedOption, setSelectedOption] = useState(''); // 預設選項
  const [selectWhnamedata, setSelectwhnamedata] = useState<any[]>([]);
  const [selecttraynamedata, setSelecttraynamedata] = useState<any[]>([]);

  const [nowname, setNowname] = useState<string>('');
  const [nowproductid, setNowproductid] = useState<string>('');
  const [nowspec, setNowspec] = useState<string>('');
  const [nowquantity, setNowquantity] = useState<string>('');
  const [nowwhname, setNowwhname] = useState<string>('');
  const [nowtrayname, setNowtrayname] = useState<string>('');
  const [nowwhposition, setNowwhposition] = useState<string>('');
  const [nowentryqty, setNowentryqty] = useState<string>('');
  const [nowwhpositionuuid, setNowwhpositionuuid] = useState<string>('');
  const [nowprodentrydetailuuid, setNowprodentrydetailuuid] = useState<string>('');
  const [nowbatchidin, setNowbatchidin] = useState<string>('');
  const [modalcheckfirstin, setModalcheckfirstin] = useState<number>(0);
  const [inventoryid, setInventoryid] = useState<string>('');
  //倉庫類型
  const [warehouse_type, setWarehouse_type] = useState<string>('');
  //滑鼠hover
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState('0px');
  const [mouseY, setMouseY] = useState('0px');

  //托盤呼叫
  const [called, setCalled] = useState(false);
  const [ip, setIP] = useState<string>('');
  const [calledTray, setCalledTray] = useState<string>('');
  const [whid, setWhid] = useState('');
  const [calledWarehouse, setCalledWarehouse] = useState<string>('');

  //#endregion

  //#region ===【儲格頁面進入】
  //滑鼠hover
  useEffect(() => {
    // 明確指定參數類型為 Window 的 MouseEvent
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      setMouseX(`${event.pageX}px`);
      setMouseY(`${event.pageY}px`);
    };

    // 當組件加載時添加事件監聽器
    window.addEventListener('mousemove', handleMouseMove);

    // 返回一個清理函數，在組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // 空依賴數組，確保只在組件加載和卸載時運行

  //#endregion

  //#region ===【儲格API】
  const GetLayOut = async (whid: any, trayname: any, id: any) => {
    try {
      // setIsLoading(true);
      const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(inputModel);

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOutById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      console.log(responseData);

      setData11(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 入庫加庫存
  const AddWHPositionQuantity = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        whpositionuuid: nowwhpositionuuid,
        prodentrydetailuuid: nowprodentrydetailuuid,
        quantity: inboxquantity.toString() as string | undefined,
        batchid: nowbatchidin,
        type: whpproductid != nowproductid ? 'false' : 'true',
        productid: nowproductid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/AddWHPositionQuantity?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      getWhpositionDetailByProductId(nowproductid);
      setNowentryqty((parseInt(nowentryqty) + inboxquantity).toString());
      //   GetDetailById(uuidin);
      Get();
      setWhpquantity((parseInt(whpquantity) + inboxquantity).toString());
      setInboxquantity(0);
    } catch (error: any) {
      setError('getProdReceiptDetail:' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AddNormalInventory = async (id: any, type: any) => {
    try {
      setIsLoading(true);
      const conditionModel = {
        inventoryid: id,
        quantity: inboxquantity,
        type: type,
        productid: nowproductid,
        update_by: userInfo?.employee?.chName.toString(),
        prodentrydetailuuid: nowprodentrydetailuuid,
        batchid: batchidin,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/AddNormalInventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      handleRowClick(id);
      getWhpositionDetailByProductId(nowproductid);
      setNowentryqty((parseInt(nowentryqty) + inboxquantity).toString());
      // GetDetailById(uuidin);
      setWhpquantity((parseInt(whpquantity) + inboxquantity).toString());
      setInboxquantity(0);
      GetNormalInventory(whid);
    } catch (error: any) {
      setError('getProdReceiptDetail:' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //取得儲格物料資訊
  const getWhpositionDetailByProductId = async (productid: any) => {
    try {
      // setIsLoading(true);
      const conditionModel: {
        productid: string | undefined;
        type: string | undefined;
      } = {
        productid: productid as string | undefined,
        type: 'entry',
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/GetWhpositionDetailByProductId?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data.length === 0) {
        myAlert.warning({
          title: '查詢結果',
          content: '目前沒有可存放的儲位資訊',
        });

        return;
      }

      setData3(data);

      // handleRowClick(data[0].id);
      GetTrayStatus(data[0].whid);
      GetLayOut(data[0].whid, data[0].trayname, data[0].id);
      // if (modalcheckfirstin === 0) {
      //     setWhid(data[0].whid);
      //     setWhpnumber(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
      //     setWhpname(data[0].name);
      //     setWhpproductid(data[0].productid);
      //     setWhpspec(data[0].spec);
      //     setWhpquantity(data[0].quantity);
      //     setNowwhname(data[0].whname);
      //     setNowtrayname(data[0].trayname);
      //     setNowwhposition(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
      // }

      const distinctWhnames = data
        .map((item: { whname: any }) => item.whname) // 提取所有 whname
        .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index); // 去重

      setSelectwhnamedata(distinctWhnames);

      const distincttraynames = data
        .map((item: { trayname: any }) => item.trayname) // 提取所有 trayname
        .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index); // 去重

      setSelecttraynamedata(distincttraynames);
    } catch (error: any) {
      myAlert.err({
        title: 'prodEntry(getWhpositionDetailByProductId)',
        content: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 取得一般倉庫資訊
  const GetNormalInventory = async (whid: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        // productid: productid as string | undefined,
        // type: "entry",
        whid: whid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/GetNormalInventory?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data.length === 0) {
        myAlert.warning({
          title: '查詢結果',
          content: '目前沒有可存放的儲位資訊',
        });

        return;
      }

      setNormalData(data);
    } catch (error: any) {
      myAlert.err({
        title: 'prodEntry(getWhpositionDetailByProductId)',
        content: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //取得托盤呼叫狀態
  const GetTrayStatus = async (whid: string) => {
    try {
      // setIsLoading(true);

      const trayStatus = await getTrayStatus(setting.apipath, whid);

      // 更新狀態
      setCalled(trayStatus.called);
      setIP(trayStatus.ip);
      setCalledTray(trayStatus.trayname); // trayname 可正常取值
      setCalledWarehouse(trayStatus.whname);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //更新托盤呼叫狀態
  const UpdateTrayStatus = async () => {
    try {
      setIsLoading(true);

      const conditionModel = {
        whid: whid,
        called: !called,
        trayname: nowtrayname,
        called_by: userInfo?.employee?.id,
      };

      const result = await updateTrayStatus(setting.apipath, conditionModel);

      if (result.success) {
        // 成功，更新狀態
        setCalled(!called);
      } else {
        // 失敗，顯示錯誤提示
        setCalled(false);
        myAlert.warning({ title: '失敗', content: result.message });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 呼叫托盤
  const CallTray = async () => {
    try {
      setIsLoading(true);

      // 設定基礎參數
      const baseURL = setting.env === 'prod' ? `https://${ip}/` : 'https://localhost:44383/WareHouse/';
      const deviceName = 'Device1';
      const trayNumber = nowtrayname;
      const trayCommand = '100';
      const regAddress = '253';
      const cmdValue = '1';

      // 使用 callTray 服務
      await callTray(baseURL, deviceName, trayNumber, trayCommand, regAddress, cmdValue);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 退回托盤
  const CallTrayBack = async () => {
    try {
      setIsLoading(true);

      // 設定基礎參數
      const baseURL = setting.env === 'prod' ? `https://${ip}/` : 'https://localhost:44383/WareHouse/';
      const deviceName = 'Device1';
      const trayNumber = nowtrayname;
      const trayCommand = '200';
      const regAddress = '253';
      const cmdValue = '1';

      // 使用 callTray 服務
      await callTray(baseURL, deviceName, trayNumber, trayCommand, regAddress, cmdValue);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //#endregion

  //#region ===【儲格功能區】

  // 關閉Modal
  const handleModalClose = async () => {
    setWhpositionqmodalopen(false);
    setSelectedItemId(null);
    setWarehouse_type('');
  };

  // 入庫加庫存
  // 入庫加庫存
  const handleaddquantity = () => {
    if (warehouse_type === '立體倉庫') {
      myAlert.confirm({
        title: `確定要入到此儲格嗎?: ${nowwhname}-${nowtrayname}-${nowwhposition}`,
        props: {
          onOk: () => {
            AddWHPositionQuantity();
          },
        },
      });
    } else {
      myAlert.confirm({
        title: `確定要入到此倉庫嗎?: ${nowwhname}`,
        props: {
          onOk: () => {
            const type = nowproductid === whpproductid ? true : false;
            AddNormalInventory(inventoryid, type);
          },
        },
      });
    }
  };

  const handleinbox = (item: any) => {
    setWhpnumber('');
    setWhpproductid('');
    setWhpname('');
    setWhpspec('');
    setWhpquantity('');
    setData3([]);
    setData11([]);
    getWhpositionDetailByProductId(item.detail_productid);
    setWhpositionqmodalopen(!whpositionqmodalopen);
    setNowproductid(item.detail_productid);
    setNowname(item.detail_name);
    setNowspec(item.detail_spec);
    setNowquantity(item.detail_quantity);
    setNowentryqty(item.detail_entry_qty);
    setNowprodentrydetailuuid(item.detail_id);
    setNowbatchidin(item.batchid);
  };

  const handleGetLayOut = (item: any) => {
    setWarehouse_type(item?.type);

    if (item.type === '立體倉庫') {
      handleRowClick(item.inventoryid);
      GetTrayStatus(item.whid); //取得托盤呼叫狀態
      setWhid(item.whid);
      setNowwhname(item.whname);
      setNowtrayname(item.trayname);
      setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
      GetLayOut(item.whid, item.trayname, item.id);

      if (recodeWhpid(item.length, item.width, item.childlength, item.childwidth) != nowwhposition) {
        setInboxquantity(0);
      }

      setNowwhpositionuuid(item.id);
      setWhpnumber(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
      setWhpname(item.name);
      setWhpproductid(item.productid);
      setWhpspec(item.spec);
      setWhpquantity(item.quantity);
      setWhid(item.whid);
      setNowwhname(item.whname);
      setNowtrayname(item.trayname);
      setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
    } else {
      // alert(item.inventoryid);
      handleRowClick(item.inventoryid);
      // GetNormalInventory(item.productid);
      // alert("目前還沒有一般儲存功能");
      // alert(item.inventoryid);
      // getWhpositionDetailByProductId(nowproductid);
      // setNowentryqty((parseInt(nowentryqty) + inboxquantity).toString());
      // GetDetailById(uuidin);
      setTraynamecalled('');
      setWhpnumber('');
      setWhpproductid(item.productid);
      setWhpspec(item.spec);
      setWhpquantity(item.quantity);
      setInboxquantity(0);
      GetNormalInventory(item.whid);
      setWhid(item.whid);
      setNowwhname(item.whname);
      setNowwhposition('');
      setInventoryid(item.inventoryid);
      setNowtrayname('');
    }
  };

  //呼叫托盤
  const handleCall = async () => {
    await GetTrayStatus(whid);

    if (called === true) {
      myAlert.warning({ title: '請先收回托盤' });

      return;
    } else {
      myAlert.confirm({
        title: `呼叫: ${nowtrayname}`,
        content: '請勿靠近設備!!',
        props: {
          onOk: async () => {
            await CallTray();
            UpdateTrayStatus();
          },
        },
      });
    }
  };

  //退回托盤
  const handleBack = async () => {
    await GetTrayStatus(whid);

    if (called === false) {
      myAlert.warning({ title: '托盤已退回' });

      return;
    } else {
      myAlert.confirm({
        title: `退回: ${calledTray}`,
        content: '請勿靠近設備!!',
        props: {
          onOk: async () => {
            await CallTrayBack();
            UpdateTrayStatus();
          },
        },
      });
    }
  };

  //#endregion

  //#region ===【邏輯】
  //儲格編碼轉換
  const recodeWhpid = (length: any, width: any, childlength: any, childwidth: any) => {
    const convertToAlpha = (num: number): string => {
      return String.fromCharCode(65 + num - 1);
    };

    const convertToNumber = (num: number, pad: number): string => {
      return num.toString().padStart(pad, '0');
    };

    const alphaIncrement = (alpha: string): string => {
      if (alpha === 'Z') {
        return 'A';
      } else {
        return String.fromCharCode(alpha.charCodeAt(0) + 1);
      }
    };

    const numberIncrement = (num: number, max: number, pad: number): string => {
      if (num >= max) {
        return convertToNumber(1, pad);
      } else {
        return convertToNumber(num + 1, pad);
      }
    };

    let newlength = '';
    let newwidth = '';
    let newchildlength = '';
    let newchildwidth = '';

    // 處理 length 的增量
    if (length === '1') {
      newlength = 'A';
    } else {
      newlength = convertToAlpha(parseInt(length, 10));
    }

    // 處理 width 的增量
    if (width === '1') {
      newwidth = '001';
    } else {
      newwidth = convertToNumber(parseInt(width, 10), 3);
    }

    // 處理 childlength 的增量
    if (childlength === '1') {
      newchildlength = 'A';
    } else {
      newchildlength = convertToAlpha(parseInt(childlength, 10));
    }

    // 處理 childwidth 的增量
    if (childwidth === '1') {
      newchildwidth = '1';
    } else {
      newchildwidth = numberIncrement(parseInt(childwidth), 100, 1);
    }

    // 增量操作
    if (childlength !== '1' && newchildwidth === '001') {
      newchildlength = alphaIncrement(newchildlength);
    }

    if (width !== '1' && newchildlength === 'A' && newchildwidth === '1') {
      newwidth = numberIncrement(parseInt(width), 100, 3);
    }

    if (length !== '1' && newwidth === '001' && newchildlength === 'A' && newchildwidth === '1') {
      newlength = alphaIncrement(newlength);
    }

    return newlength + newwidth + newchildlength + (parseInt(newchildwidth) - 2).toString();
  };
  //#endregion

  //#endregion

  return (
    <SubLayer isLoading_subLayer={false}>
      <PageHeader02
        tag={pagename + '列表'}
        customeLeft={[
          <div
            key="0"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // 調整間距，或使用 space-around、space-evenly
              // gap: '5px', // 元素之間的間距
              flexWrap: 'wrap', // 如果空間不足，讓元素換行
              paddingLeft: '10px',
            }}
          >
            {/* 第四個選項 */}
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入單號',
                    style: { width: '250px', paddingLeft: '5px' },
                    value: keyword2,
                    onChange: (e) => {
                      setKeyword2(e.target.value);
                    },
                  },
                }}
              />
            </div>
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入料號',
                    style: { width: '300px', paddingLeft: '5px' },
                    value: keyword3,
                    onChange: (e) => {
                      setKeyword3(e.target.value);
                    },
                  },
                }}
              />
            </div>
            <div style={{ borderRight: '1px solid rgb(168, 168, 168)' }}>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入品名',
                    style: { width: '300px', paddingLeft: '5px' },
                    value: keyword4,
                    onChange: (e) => {
                      setKeyword4(e.target.value);
                    },
                  },
                }}
              />
            </div>
            <div>
              <InputSel
                // caption="單號"
                disabled={false}
                captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                inputProps={{
                  props: {
                    placeholder: '請輸入規格',
                    style: { width: '300px', paddingLeft: '5px' },
                    value: keyword5,
                    onChange: (e) => {
                      setKeyword5(e.target.value);
                    },
                  },
                }}
              />
            </div>
          </div>,
        ]}
        customeRight={[
          <span key="0" style={{ fontSize: '18px', padding: '0px 10px' }}>
            <button
              className={scss.shortsquarebtn}
              onClick={() => {
                myAlert.confirm({
                  title: `確定要返回嗎?`,
                  content: (
                    <>
                      <h1>未儲存的資料將不會保留</h1>
                    </>
                  ),
                  props: {
                    onOk: () => {
                      router.back();
                    },
                  },
                });
              }}
            >
              返回
            </button>
          </span>,
        ]}
        panelList={panelList}
      />

      <div>
        <Thead01 type={'PEntry'} />
        {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
        {searchdata &&
          searchdata.map((_item: any, index: number) => (
            <CellWithBar key={index} className={scss.panelHeader15}>
              <div
                key={index}
                className={`${scss.row01} ${_item.prodentryuuid === selectedItemId ? scss.selectedRow : ''}`}
              >
                <span>
                  <button
                    onClick={() => handleinbox(_item)}
                    style={{
                      width: '30px', // 調整按鈕大小，與圖片更匹配
                      height: '30px', // 調整按鈕大小，與圖片更匹配
                      border: '1px solid #ccc',
                      // backgroundColor: '#f0f0f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      // transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#e0e0e0';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#f0f0f0';
                    }}
                  >
                    <img
                      src={icon_tray_in.src}
                      alt="tray"
                      style={{
                        width: '20px', // 根據按鈕大小調整圖片尺寸
                        height: '20px', // 根據按鈕大小調整圖片尺寸
                        objectFit: 'contain', // 確保圖片不會被拉伸
                        // backgroundColor:'white'
                      }}
                    />
                  </button>
                </span>
                <span>{index + 1}</span>
                <span style={{ fontSize: '18px' }}>{_item.detail_prodentryid}</span>
                <span>{_item.detail_productid}</span>
                <span>{_item.detail_name}</span>
                <span>{_item.detail_spec}</span>
                <span>{_item.detail_quantity}</span>
                <span>{_item.detail_entry_qty}</span>
                <span>
                  <IconDetail
                    onClick={() => {
                      router.push({
                        pathname: `/factoryDepartment/PEntryDetail`,
                        query: {
                          item: JSON.stringify(_item),
                        },
                      });
                    }}
                  />
                </span>
              </div>
            </CellWithBar>
          ))}

        <Modal
          open={whpositionqmodalopen}
          footer={null}
          onCancel={handleModalClose}
          // width="2000px"
          width="100%"
          maskClosable={false}
          style={{ top: 70 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px', marginBottom: '16px', width: '1500px' }}>
            <span style={{ fontSize: '16px', color: '#14256a' }}>
              <InputSel
                {...inputSelProps}
                caption="料號"
                className="align-bottom"
                disabled={true}
                inputProps={{
                  props: {
                    value: nowproductid ? nowproductid : ' ',
                  },
                }}
              />
            </span>
            <span style={{ fontSize: '16px' }}>
              <InputSel
                {...inputSelProps}
                caption="名稱"
                className="align-bottom"
                disabled={true}
                inputProps={{
                  props: {
                    value: nowname ? nowname : ' ',
                  },
                }}
              />
            </span>
            <span style={{ fontSize: '16px', color: '#14256a' }}>
              <InputSel
                {...inputSelProps}
                caption="規格"
                className="align-bottom"
                disabled={true}
                inputProps={{
                  props: {
                    value: nowspec ? nowspec : ' ',
                  },
                }}
              />
            </span>
            <span style={{ fontSize: '16px', color: '#14256a' }}>
              <InputSel
                {...inputSelProps}
                caption="數量"
                className="align-bottom"
                disabled={true}
                inputProps={{
                  props: {
                    value: nowquantity ? nowquantity : ' ',
                  },
                }}
              />
            </span>
          </div>
          <div className={scss.modal_container}>
            <div className={scss.modal_left}>
              <div className={scss.modal_content}>
                <div>
                  {/* <span style={{ fontSize: '18px', }}>倉庫：</span>
                                <select
                                    value={selectedOption}
                                    style={{ fontSize: '18px', borderBottom: '1px solid #c1c1c1' }}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    {selectWhnamedata.map((whname, index) => (
                                        <option key={index} value={whname}>
                                            {whname}
                                        </option>
                                    ))}
                                </select>
                                &nbsp;
                                <span style={{ fontSize: '18px', }}>托盤：</span>
                                <select
                                    value={selectedOption}
                                    style={{ fontSize: '18px', borderBottom: '1px solid #c1c1c1' }}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    {selecttraynamedata.map((trayname, index) => (
                                        <option key={index} value={trayname}>
                                            {trayname}
                                        </option>
                                    ))}
                                </select> */}
                  <Thead01 type={'ProdEntryWhpositionList'} />
                  {data3 &&
                    data3.map((_item: any, index: number) => (
                      <CellWithBar key={index} className={scss.panelHeader26}>
                        <div
                          key={index}
                          className={`${scss.row01} ${_item.inventoryid === selectedItemId ? scss.selectedRow : ''}`}
                          onClick={() => handleGetLayOut(_item)}
                        >
                          <span>{index + 1}</span>
                          <span>{_item.whname}</span>
                          <span>{_item.trayname}</span>
                          <span>
                            {_item.type === '一般倉庫'
                              ? ''
                              : `${recodeWhpid(_item.length, _item.width, _item.childlength, _item.childwidth)}`}
                          </span>
                          <span style={{ color: `${_item.productid != nowproductid ? 'red' : 'black'}` }}>
                            {_item.productid}
                          </span>
                          <span style={{ color: `${_item.quantity === 0 ? 'red' : 'black'}` }}>{_item.quantity}</span>
                          <span>
                            {/* <button onClick={() => {  }}>
                                                        <img src={icon_fc_inbox.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                          </span>
                        </div>
                      </CellWithBar>
                    ))}
                </div>
              </div>
            </div>
            <div className={scss.modal_right}>
              {warehouse_type ? (
                warehouse_type === '立體倉庫' ? (
                  <>
                    <div className={scss.modal_right_head}>
                      <InputSel
                        {...inputSelProps}
                        caption="倉庫編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowwhname ? warehouse_type + ' ' + nowwhname : ' ',
                          },
                        }}
                      />
                      <InputSel
                        {...inputSelProps}
                        caption="托盤編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowtrayname ? nowtrayname : ' ',
                          },
                        }}
                      />
                      <InputSel
                        {...inputSelProps}
                        caption="儲格編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowwhposition ? nowwhposition : ' ',
                          },
                        }}
                      />
                    </div>
                    <div className={scss.modal_right_content}>
                      {data11.map((Data, index) => (
                        <table key={index} className={scss.traytable} style={{ border: 'solid 1px black' }}>
                          <tbody>
                            <tr className={scss.tr}>
                              {Data.widthdata.map((item: any, index: number) => (
                                <td
                                  key={index}
                                  className={scss.td}
                                  style={{
                                    backgroundColor: item.color,
                                    color: item.color === '#ea1833' ? '#FFFFFF' : 'black',
                                  }}
                                >
                                  {item.childtraylayoutmodel &&
                                    item.childtraylayoutmodel.map((childitem: any) => (
                                      <table className={scss.childtraytable} key={item.childlengthid}>
                                        <tbody>
                                          <tr className={scss.childtraytabletr}>
                                            {childitem.childwidthdata.map((childDataItem: any) => (
                                              <td
                                                className={scss.childtraytabletd}
                                                key={childDataItem.id}
                                                style={{
                                                  backgroundColor: childDataItem.color,
                                                  height:
                                                    item.childtraylayoutmodel.length > 1
                                                      ? 85 / item.childtraylayoutmodel.length
                                                      : '89px',
                                                }}
                                              >
                                                <button
                                                  className={scss.childtraytabletdButton}
                                                  style={{
                                                    backgroundColor: childDataItem.color,
                                                    height:
                                                      item.childtraylayoutmodel.length > 1
                                                        ? 85 / item.childtraylayoutmodel.length
                                                        : '89px',
                                                  }}
                                                  onMouseEnter={() =>
                                                    setHoverInfo(
                                                      `${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`
                                                    )
                                                  }
                                                  onMouseLeave={() => setHoverInfo(null)}
                                                >
                                                  {`${recodeWhpid(
                                                    childDataItem.length,
                                                    childDataItem.width,
                                                    childDataItem.childlength,
                                                    childDataItem.childwidth
                                                  )}\n`}
                                                  <br />
                                                </button>
                                              </td>
                                            ))}
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      ))}
                      {hoverInfo && (
                        <div
                          style={{
                            backgroundColor: '#dfdcdc',
                            position: 'fixed',
                            top: mouseY,
                            left: mouseX,
                            transform: 'translate(10%, 60%)',
                            padding: '5px',
                            borderRadius: '5px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            zIndex: '1002',
                            whiteSpace: 'pre-line', // 控制換行的 CSS 屬性
                            fontSize: '16px',
                          }}
                        >
                          {hoverInfo}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={scss.modal_right_head}>
                      <InputSel
                        {...inputSelProps}
                        caption="倉庫編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowwhname ? warehouse_type + ' ' + nowwhname : ' ',
                          },
                        }}
                      />
                      <InputSel
                        {...inputSelProps}
                        caption="托盤編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowtrayname ? nowtrayname : ' ',
                          },
                        }}
                      />
                      <InputSel
                        {...inputSelProps}
                        caption="儲格編號"
                        className="align-bottom"
                        disabled={true}
                        inputProps={{
                          props: {
                            value: nowwhposition ? nowwhposition : ' ',
                          },
                        }}
                      />
                    </div>
                    <div className={scss.modal_right_content2}>
                      <div className={scss.body_content1}>
                        <div className={scss.thead30}>
                          <span>序</span>
                          <span>料號</span>
                          <span>品名</span>
                          <span>規格</span>
                          <span>數量</span>
                          <span></span>
                        </div>

                        {normaldata &&
                          normaldata.map((_item: any, index: number) => (
                            <CellWithBar key={index} className={scss.panelHeader30}>
                              <div
                                key={index}
                                className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                // style={{backgroundColor:'red'}}
                                style={{ backgroundColor: `${_item.inventoryid === inventoryid ? '#ea1833' : ''}` }}
                              >
                                <span>{index + 1}</span>
                                <span>{_item.productid}</span>
                                <span>{_item.name}</span>
                                <span>{_item.spec}</span>
                                <span>{_item.quantity}</span>
                                <span></span>
                                <span>
                                  {/* <button onClick={() => {  }}>
                                                        <img src={icon_fc_inbox.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                        </button> */}
                                </span>
                              </div>
                            </CellWithBar>
                          ))}
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className={scss.modal_container2}>
            <div className={scss.modal_bottom}>
              <div className={scss.modal_content}>
                <div className={scss.traymodal_head_head1}>
                  <div>
                    <button
                      className={
                        called
                          ? data3.length === 0 || warehouse_type === '一般倉庫' || warehouse_type === ''
                            ? scss.disabledbtn
                            : scss.greenbutton
                          : data3.length === 0 || warehouse_type === '一般倉庫' || warehouse_type === ''
                          ? scss.disabledbtn
                          : scss.redbtn
                      }
                      onClick={() => {
                        if (warehouse_type !== '一般倉庫') {
                          // 只在不是一般倉庫的情況下觸發操作
                          if (called) {
                            if (data3.length !== 0) {
                              handleBack();
                            }
                          } else {
                            if (data3.length !== 0) {
                              handleCall();
                            }
                          }
                        }
                      }}
                      disabled={warehouse_type === '一般倉庫' || warehouse_type === '' ? true : false}
                      // style={{ display: `${warehouse_type === '一般倉庫' ? 'none' : ''}` }}
                    >
                      {called
                        ? data3.length === 0 || warehouse_type === '一般倉庫'
                          ? `收回托盤收回托盤(${calledTray})`
                          : `收回托盤(${calledTray})`
                        : data3.length === 0 || warehouse_type === '一般倉庫'
                        ? `呼叫托盤(${nowtrayname})`
                        : `呼叫托盤(${nowtrayname})`}
                    </button>
                  </div>
                  <div style={{ paddingTop: '5px' }}>
                    {/* <InputSel
                                            {...inputSelProps}
                                            caption="目前呼叫"
                                            className='align-bottom'
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: `${whnamecalled != "" ? `倉庫：${whnamecalled} 托盤：${traynamecalled} 儲位：${whpnamecalled}` : ' '}`
                                                },
                                            }}
                                        /> */}
                  </div>
                  <div style={{ paddingTop: '5px' }}>
                    <InputSel
                      {...inputSelProps}
                      caption="入庫進度"
                      className="align-bottom"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: `${nowentryqty} / ${nowquantity}`,
                        },
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {/* <span style={{ display: `${(inboxquantity != 0 && nowentryqty < nowquantity && called === true) ? '' : 'none'}` }}> */}
                    <span style={{ display: `${inboxquantity != 0 && nowentryqty < nowquantity ? '' : 'none'}` }}>
                      <button
                        className={scss.redbtn}
                        onClick={() => {
                          handleaddquantity();
                        }}
                      >
                        確認入庫
                      </button>
                    </span>
                    {/* <span style={{ display: `${(inboxquantity === 0 || nowentryqty === nowquantity || called === false) ? '' : 'none'}` }}> */}
                    <span style={{ display: `${inboxquantity === 0 || nowentryqty === nowquantity ? '' : 'none'}` }}>
                      <button className={scss.disabledbtn}>確認入庫</button>
                    </span>
                  </div>
                </div>
                <div className={scss.traymodal_head_content1}>
                  <div>
                    <InputSel
                      {...inputSelProps}
                      caption="儲格編號"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: whpnumber ? whpnumber : ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="物料編號"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: whpproductid ? whpproductid : ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="物料名稱"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: whpname ? whpname : ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="物料規格"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: whpspec ? whpspec : ' ',
                        },
                      }}
                    />
                  </div>
                  <div>
                    <InputSel
                      {...inputSelProps}
                      caption="排版用"
                      disabled={true}
                      className="invisible"
                      inputProps={{
                        props: {
                          value: ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="儲位數量"
                      disabled={true}
                      inputProps={{
                        props: {
                          value: whpquantity.toString() ? whpquantity.toString() : ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="排版用"
                      disabled={true}
                      className="invisible"
                      inputProps={{
                        props: {
                          value: ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="入庫數量"
                      // disabled={(called === true && nowentryqty < nowquantity) ? false : true}
                      disabled={nowentryqty < nowquantity ? false : true}
                      inputProps={{
                        props: {
                          type: 'number',
                          // min: 0, // 設置最小值為0
                          // step: 1, // 設置步進值，默認為1
                          max: parseInt(nowquantity) - parseInt(nowentryqty), // 設置最大值
                          style: { color: 'red' },
                          value: inboxquantity ? inboxquantity : '',
                          // onChange: handleInputChange
                          onChange: (e) => setInboxquantity(parseInt(e.target.value)),
                        },
                      }}
                    />
                    <span style={{ color: '#ea1833' }}>※不可超過入庫單該品項的數量</span>
                  </div>
                  <div>
                    <InputSel
                      {...inputSelProps}
                      caption="排版用"
                      disabled={true}
                      className="invisible"
                      inputProps={{
                        props: {
                          value: ' ',
                        },
                      }}
                    />
                    流程順序：選取儲位{'>'}呼叫托盤{'>'}輸入要放置儲位的數量{'>'}確認入庫
                    <br />
                    (1).入庫前請確認入庫數量是否正確
                    <br />
                    (2).入庫後不可更動，需另外申請庫存調整。
                  </div>
                </div>
                <div className={scss.modal_head_content2}>
                  <div></div>
                  <div style={{ textAlign: 'right' }}></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </SubLayer>
  );
}
