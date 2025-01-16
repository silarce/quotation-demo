import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _, { reverse, update } from 'lodash';
import scss from './reviewList.module.scss';
import Thead01 from '../../factoryDepartment/ui/table/thead01';
import Tbody01 from '../../factoryDepartment/ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../../factoryDepartment/wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import { parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
// 圖示
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_add.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_print from 'public/image/icon/fc_printer.svg';
import icon_export from 'public/image/icon/fc_export.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import icon_task_approved from 'public/image/icon/fc_approved.svg';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg';
import { Modal } from 'antd';

import Quotation from 'pages/domestic/quotationList/quotation';
import PurchaseRequisitionList from 'pages/factoryDepartment/purchaseRequisitionList';
import PurchaseOrderList from 'pages/factoryDepartment/purchaseOrderList';
import ProdReceiptList from 'pages/factoryDepartment/prodReceiptList';
import SalarySettlement from 'pages/accounting/salarySettlement';
import BonusPayout from 'pages/accounting/bonusPayout';
import Worksheet from 'pages/worksDepartment/contractList/contract/workSheet';
import PRequisitionDetail from 'pages/factoryDepartment/PRequisitionDetail';
import TransferOrder from 'pages/worksDepartment/contractList/contract/listOfDeliveryOrders/edit';
import CertifiedDocument from 'components/composition/certifiedDocument/edit';

// global state
import { useGlobal_review } from 'hooks/globalState/useGlobal_review';
import POrderDetail from 'pages/factoryDepartment/POrderDetail';
import PReceiptDetail from 'pages/factoryDepartment/PReceiptDetail';

export default function ReviewList() {
  // 全域狀態
  const { update: global_updateReivew } = useGlobal_review();

  // 路由參數
  const router = useRouter();
  const { firstin } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [leftbaropen, setLeftbaropen] = useState<boolean>(true);

  // 登入者資料
  const { userInfo, erpFeature } = useContext(AppContext);
  // 資料列宣告
  const [data, setData] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data3, setData3] = useState<any[]>([]);
  const [data4, setData4] = useState<any[]>([]);
  const [data5, setData5] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchdata, setSearchdata] = useState<any[]>([]);
  const [searchdata3, setSearchdata3] = useState<any[]>([]);
  const [searchdata4, setSearchdata4] = useState<any[]>([]);
  const [searchdata5, setSearchdata5] = useState<any[]>([]);

  // 變數宣告
  const [reviewtype, setReviewtype] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [currentreview_id, setCurrentreview_id] = useState<string>('');
  const [review_memo, setReview_memo] = useState<string>('');
  const [document_status, setDocument_status] = useState<string>('');

  // 搜尋bar
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]); // 用來存放唯一的 document_type 選項

  // 預設截止日期為今天，起始日期為今天往前推30天
  const defaultEndDate = moment();
  const defaultStartDate = moment().subtract(30, 'days');

  // 使用 Moment 類型作為狀態
  const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
  const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);

  // 編輯功能
  const [editstatus, setEditStatus] = useState<boolean>(false);
  const [editrowid, setEditRowId] = useState<number>(0);
  const [editmain, setEditmain] = useState<boolean>(false);

  const [itemQuery, setItemQuery] = useState<any>({});

  //判斷是否第一次進入頁面
  const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);
  useEffect(() => {
    if (firstin !== undefined) {
      setCheckFirstIn(parseInt(firstin as string) || 0);
    }
  }, [firstin]);

  //#region =============【上功能列】===============================================================================
  //搜尋功能
  const searchTargetList = [
    {
      placeholder: '單號',
    },
    {
      placeholder: '主旨',
    },
  ];

  //搜尋功能
  const doSearch = (valueArr: (string | Toption | null)[]) => {};

  // 搜尋功能
  const searchGroup = {
    searchTargetList,
    doSearch: (arr: any) => {
      const arrkeyword2 = arr[0] as string;
      const arrkeyword3 = arr[1] as string;
      const arrkeyword4 = arr[2] as string;
      setKeyword2(arrkeyword2);
      setKeyword3(arrkeyword3);
      setKeyword4(arrkeyword4);
    },
  };
  //新增按鈕
  const panelList: TpanelList = [{ searchGroup }];

  //#endregion

  //#region call api
  //取審核主檔
  const GetReview = async () => {
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

      console.log(JSON.stringify(inputModel));

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReview?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      global_updateReivew(data || null);

      setData(data);
      setSearchdata(data);
      console.log(data);

      // 檢查 data 是否有內容
      if (data.length > 0) {
        // setCurrentreview_id(data[0].id);
        // setReviewtype(data[0].document_type)
        // GetReviewStatus(data[0]); // 只有當 data 有內容時才執行
      } else {
        console.log('沒有撈到資料');
      }
    } catch (error: any) {
      // setError("GetReview:" + error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 取審核中主檔
  const GetReviewing = async () => {
    try {
      // setIsLoading(true);
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

      const response = await fetch(`${setting.apipath}/Review/GetReviewing?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setData3(data);
      setSearchdata3(data);
      // 檢查 data 是否有內容
      // if (data3.length > 0) {

      //     setCurrentreview_id(data3[0].id);
      //     GetReviewStatus(data3[0]); // 只有當 data 有內容時才執行
      // } else {
      //     // console.log('沒有撈到資料');
      // }
    } catch (error: any) {
      // setError("GetReview:" + error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  // 取審核完成主檔
  const GetReviewed = async () => {
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

      const response = await fetch(`${setting.apipath}/Review/GetReviewed?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setData4(data);
      setSearchdata4(data);
      // 檢查 data 是否有內容
      // if (data4.length > 0) {
      //     // console.log(data4[0]);
      //     setCurrentreview_id(data4[0].id);
      //     GetReviewStatus(data4[0]); // 只有當 data 有內容時才執行
      // } else {
      //     // console.log('沒有撈到資料');
      // }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GetReviewRejected = async () => {
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

      console.log(JSON.stringify(inputModel));

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewRejected?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();

      setData5(responsedata);
      setSearchdata5(responsedata);
      console.log(responsedata);

      // 檢查 data 是否有內容
      if (data.length > 0) {
        // setCurrentreview_id(data[0].id);
        // setReviewtype(data[0].document_type)
        // GetReviewStatus(data[0]); // 只有當 data 有內容時才執行
      } else {
        console.log('沒有撈到資料');
      }
    } catch (error: any) {
      // setError("GetReview:" + error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      GetReview();
      GetReviewing();
      GetReviewed();
      GetReviewRejected();
      hasFetchedData.current = true;
    }
  }, []);

  // 取流程狀態
  const GetReviewStatus = async (item: any, type: any) => {
    setDocument_status(item.document_status);

    handleRowClick(item.id);
    setCurrentreview_id(item.id);

    try {
      // setIsLoading(true);
      const conditionModel = {
        document_id: item.document_id,
        document_uuid: item.document_uuid,
        type: type,
        id: item.id,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetReviewStatus?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setData2(data);
      // 設定 itemQuery
      setReviewtype(item.document_type);
      setItemQuery(item);
    } catch (error: any) {
      // setError("GetReviewStatus:" + error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  // const GetDocument = async (item: any) => {
  //     console.log(item);
  //     if ( reviewtype === "請購單") {
  //         // 將 JSON 字串解析為 JavaScript 對象
  //         const parsedQuery = JSON.parse(item.query);

  //         console.log(parsedQuery); // 檢查解析後的資料

  //         // 使用 shallow 模式更新 query 而不進行頁面跳轉
  //         router.replace({
  //             query: {
  //                 purchaserequisitionuuid: parsedQuery.purchaserequisitionuuid,
  //                 purchaserequisitionid: parsedQuery.purchaserequisitionid,
  //                 create_at: getTaiwanDateStr(parsedQuery.create_at),
  //                 create_by: parsedQuery.create_by,
  //                 status: '審核中',
  //                 need_date: parsedQuery.need_date,
  //                 note: parsedQuery.note,
  //                 firstin: 1,
  //                 viewtype: 'review'
  //             },
  //         }, undefined, { shallow: true });
  //     }
  // }

  const [isPageLoaded, setIsPageLoaded] = useState(false); // 設定頁面加載狀態

  useEffect(() => {
    // 當元件初次渲染完畢後，設定頁面已加載
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (isPageLoaded && itemQuery) {
      if (reviewtype === '請購單') {
        const parsedQuery = JSON.parse(itemQuery.query);

        // const query = {
        //   purchaserequisitionuuid: parsedQuery.purchaserequisitionuuid,
        //   purchaserequisitionid: parsedQuery.purchaserequisitionid,
        //   create_at: parsedQuery.create_at,
        //   create_by: parsedQuery.create_by,
        //   // status: `${document_status === "核准" ? "已核准" : document_status}`,
        //   ...(document_status === '核准'
        //     ? { status: '已核准' }
        //     : document_status === '審核中'
        //     ? { status: '審核中' }
        //     : document_status === '駁回'
        //     ? { status: '已駁回' }
        //     : {}), // 根據不同情況設置 status
        //   need_date: parsedQuery.need_date,
        //   note: parsedQuery.note,
        //   firstin: 1,
        //   viewtype: 'review',
        // };

        const query = {
          item: parsedQuery.item,
          viewtype: 'review',
        };

        router.replace(
          {
            query: query,
          },
          undefined,
          { shallow: true }
        );
      } else if (reviewtype === '採購單') {
        const parsedQuery = JSON.parse(itemQuery.query);
        router.replace(
          {
            // query: {
            //   purchaseorderuuid: parsedQuery.purchaseorderuuid,
            //   purchaseorderid: parsedQuery.purchaseorderid,
            //   suppliername: parsedQuery.suppliername,
            //   suppliertaxid: parsedQuery.suppliertaxid,
            //   supplieraddress: parsedQuery.supplieraddress,
            //   supplierphone: parsedQuery.supplierphone,
            //   invoice: parsedQuery.invoice,
            //   create_at: parsedQuery.create_at,
            //   create_by: parsedQuery.create_by,
            //   ...(document_status === '核准'
            //     ? { status: '已核准' }
            //     : document_status === '審核中'
            //       ? { status: '審核中' }
            //       : document_status === '駁回'
            //         ? { status: '已駁回' }
            //         : {}), // 根據不同情況設置 status
            //   note: parsedQuery.note,
            //   need_date: parsedQuery.need_date,
            //   firstin: 1,
            //   shippingaddress: parsedQuery.shippingaddress,
            //   viewtype: 'review',
            // },
            query: {
              item: parsedQuery.item,
              viewtype: 'review',
            },
          },
          undefined,
          { shallow: true }
        );
      } else if (reviewtype === '進貨單') {
        const parsedQuery = JSON.parse(itemQuery.query);
        router.replace(
          {
            // query: {
            //   prodreceiptuuid: parsedQuery.prodreceiptuuid,
            //   prodreceiptid: parsedQuery.prodreceiptid,
            //   purchaseorderuuid: parsedQuery.purchaseorderuuid,
            //   purchaseorderid: parsedQuery.purchaseorderid,
            //   purchaseordercreate_at: parsedQuery.purchaseordercreate_at,
            //   purchaseordercreate_by: parsedQuery.purchaseordercreate_by,
            //   suppliername: parsedQuery.suppliername,
            //   suppliertaxid: parsedQuery.suppliertaxid,
            //   supplieraddress: parsedQuery.supplieraddress,
            //   supplierphone: parsedQuery.supplierphone,
            //   invoice: parsedQuery.invoice,
            //   create_at: parsedQuery.create_at,
            //   create_by: parsedQuery.create_by,
            //   ...(document_status === '核准'
            //     ? { status: '已核准' }
            //     : document_status === '審核中'
            //       ? { status: '審核中' }
            //       : document_status === '駁回'
            //         ? { status: '已駁回' }
            //         : {}), // 根據不同情況設置 status
            //   note: parsedQuery.note,
            //   firstin: 1,
            //   viewtype: 'review',
            // },
            query: {
              item: parsedQuery.item,
              viewtype: 'review',
            },
          },
          undefined,
          { shallow: true }
        );
      } else if (reviewtype === '薪資單') {
        const parsedQuery = JSON.parse(itemQuery.query);
        router.replace(
          {
            query: {
              year: parsedQuery.year,
              month: parsedQuery.month,
              viewtype: 'review',
            },
          },
          undefined,
          { shallow: true }
        );
      } else if (reviewtype === '獎金') {
        const parsedQuery = JSON.parse(itemQuery.query);
        router.replace(
          {
            query: {
              year: parsedQuery.year,
              bonustype: parsedQuery.bonustype,
              viewtype: 'review',
            },
          },
          undefined,
          { shallow: true }
        );
      } else if (reviewtype === '工作表') {
        const parsedQuery = JSON.parse(itemQuery.query);
        const query = {
          ...parsedQuery,
          //   status,
          viewtype: 'review',
        };

        router.replace({ query }, undefined, { shallow: true });
      } else if (reviewtype === '調貨單') {
        const parsedQuery = JSON.parse(itemQuery.query);
        const query = {
          ...parsedQuery,
          viewtype: 'review',
        };

        router.replace({ query }, undefined, { shallow: true });
      } else if (reviewtype === '證明文件') {
        const parsedQuery = JSON.parse(itemQuery.query);
        const query = {
          ...parsedQuery,
          viewtype: 'review',
        };

        router.replace({ query }, undefined, { shallow: true });
      }
    }
    // }, [itemQuery, reviewtype]);
  }, [isPageLoaded, itemQuery, reviewtype]);

  // useEffect(() => {
  //     if (typeof window !== 'undefined' && reviewtype === "報價單") {
  //         alert("報價單")
  //     }
  // }, [reviewtype]);

  // useEffect(() => {
  //     if (typeof window !== 'undefined') {
  //         // 使用 shallow 模式更新 query 而不進行頁面跳轉
  //         router.push({
  //             query: {
  //                 id: 'a8cb2ede-986b-4c3c-a4e7-0635f65607d3',
  //                 status: 'Budget',
  //             },
  //         }, undefined, { shallow: true });
  //     }
  // }, []);

  const filterData = () => {
    const startDate = keywordstartdate;
    const endDate = keywordenddate;
    const requisitionId = keyword2.trim();
    const name = keyword3.trim();
    // const spec = keyword4.trim();

    // 檢查是否所有條件都為空
    if (
      // (!startDate || !startDate.isValid()) &&
      // (!endDate || !endDate.isValid()) &&
      !requisitionId &&
      !name
      // && !spec
    ) {
      setSearchdata(data);

      return;
    }

    let filteredData = searchdata;

    // 模糊查詢請購單號
    if (requisitionId) {
      filteredData = searchdata.filter((item) => item.productid.toString().includes(requisitionId));
    }

    // 模糊查詢單據狀態
    if (name) {
      filteredData = filteredData.filter((item) => item.name.toString().includes(name));
    }
    // if (spec) {
    //     filteredData = filteredData.filter(item =>
    //         item.spec && item.spec.toString().includes(spec)
    //     );
    // }

    // setSearchdata(filteredData);
    setFilteredData(filteredData);
  };

  // const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const isSelectingRef = useRef(false);
  // 監聽條件變更
  useEffect(() => {
    // alert(keyword2);
    // 初始化 filteredData 根據 tabnow 的值選擇不同的數據
    let filteredData = [];

    if (tabnow === '待審核') {
      filteredData = searchdata;
    } else if (tabnow === '審核中') {
      filteredData = searchdata3;
    } else if (tabnow === '審核完成') {
      filteredData = searchdata4;
    } else {
      filteredData = searchdata5;
    }

    // 如果正在進行選擇，則返回不繼續篩選
    if (isSelectingRef.current) {
      return;
    }

    console.log(filteredData);

    // 當 keyword2 和 keyword3 都為空時，恢復原始資料
    if (!keyword1 && !keyword2 && !keyword3) {
      if (tabnow === '待審核') {
        setData(searchdata); // 恢復 data
      } else if (tabnow === '審核中') {
        setData3(searchdata3); // 恢復 data3
      } else if (tabnow === '審核完成') {
        setData4(searchdata4); // 恢復 data4
      } else {
        setData5(searchdata5);
      }

      // setFilteredData(filteredData); // 更新已篩選資料
      return; // 直接結束函數，不需要進行後續篩選
    }

    // 根據 keyword2 篩選 document_id
    if (keyword1) {
      filteredData = filteredData.filter((item) => item.document_type.toString().includes(keyword1.trim()));
    }

    if (keyword2) {
      filteredData = filteredData.filter((item) => item.document_id.toString().includes(keyword2.trim()));
    }

    // 根據 keyword3 篩選 document_title
    if (keyword3) {
      filteredData = filteredData.filter((item) => item.document_title.toString().includes(keyword3.trim()));
    }

    // 如果需要，解開這個篩選條件，增加對 keyword4 的處理
    // if (keyword4) {
    //     filteredData = filteredData.filter(item =>
    //         item.spec && item.spec.toString().includes(keyword4.trim())
    //     );
    // }

    // 根據 tabnow 更新對應的資料
    if (tabnow === '待審核') {
      setData(filteredData);
    } else if (tabnow === '審核中') {
      setData3(filteredData);
    } else if (tabnow === '審核完成') {
      setData4(filteredData);
    } else {
      setData5(filteredData);
    }

    // console.log(filteredData);

    // 更新篩選結果
    setFilteredData(filteredData);
  }, [keyword1, keyword2, keyword3]); // 加入 tabnow 依賴，確保切換 tab 時更新資料

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setFilteredData(data);
    isSelectingRef.current = false;
    setKeyword3(e.target.value);
  };

  const clearFilterData = (e: any) => {
    e.preventDefault();
    setKeywordstartdate(null);
    setKeywordenddate(null);
    setKeyword2('');
    setKeyword3('');
    setKeyword4('');
    // setSearchdata(data);
  };

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 點擊處理函數
  const handleRowClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    // 定義事件處理器
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // 在元件掛載時設置事件監聽器
    window.addEventListener('resize', handleResize);

    // 在元件卸載時移除事件監聽器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依賴陣列確保只在掛載和卸載時運行

  //#region Tab頁籤切換
  //頁籤切換判斷
  const [tabnow, setTabnow] = useState<string>('待審核');
  const [tabshow, setTabshow] = useState<string>('待審核');

  // 根據當前選中的 tab 設置按鈕的樣式
  const getButtonStyle = (tabName: string) => {
    return tabnow === tabName
      ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' }
      : {};
  };

  const tabChosed = (tabName: string) => {
    let newReviewId = '';
    let newDocumentStatus = '';

    if (tabName === '待審核') {
      newDocumentStatus = '審核中';

      if (data.length !== 0) {
        newReviewId = data[0].id;
      }
    } else if (tabName === '審核中') {
      newDocumentStatus = '審核中';

      if (data3.length !== 0) {
        newReviewId = data3[0].id;
      }
    } else if (tabName === '審核完成') {
      newDocumentStatus = '核准';

      if (data4.length !== 0) {
        newReviewId = data4[0].id;
      }
    } else if (tabName === '駁回') {
      newDocumentStatus = '駁回';

      if (data5.length !== 0) {
        newReviewId = data5[0].id;
      }
    }

    setCurrentreview_id(newReviewId);
    setDocument_status(newDocumentStatus);
    setTabnow(tabName);
    setTabshow(tabName);
    setReviewtype('');
    setSelectedItemId('');
    setData2([]);

    // if (tabName === "待審核") {
    //     if (data.length > 0) {
    //         GetReviewStatus(data[0], "一般");
    //     }
    // } else if (tabName === "審核中") {
    //     if (data3.length > 0) {
    //         GetReviewStatus(data3[0], "一般");
    //     }
    // } else if (tabName === "審核完成") {
    //     if (data4.length > 0) {
    //         GetReviewStatus(data4[0], "一般");
    //     }
    // } else if (tabName === "駁回") {
    //     if (data5.length > 0) {
    //         GetReviewStatus(data5[0], "駁回");
    //     }
    // }
  };
  //#endregion

  const handleClear = () => {
    setKeyword2('');
    setKeyword3('');
    setKeyword4('');
  };

  const handleReviewConfirm = async () => {
    setReview_memo('');
    setReviewtype('');
    setData2([]);

    try {
      setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
        review_memo: review_memo,
        review_id: currentreview_id,
      };
      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(JSON.stringify(conditionModel));

      const response = await fetch(`${setting.apipath}/Review/ReviewConfirm`, {
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

      GetReview();
      GetReviewing();
      GetReviewed();
      GetReviewRejected();
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewRejected = async () => {
    setReview_memo('');
    setReviewtype('');
    setData2([]);

    try {
      setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
        review_memo: review_memo,
        review_id: currentreview_id,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(JSON.stringify(conditionModel));

      const response = await fetch(`${setting.apipath}/Review/ReviewRejected`, {
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

      GetReview();
      GetReviewing();
      GetReviewed();
      GetReviewRejected();
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const UpdateReviewReadedById = async (item: any) => {
    console.log(item);

    try {
      // setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
        id: item.id,
      };
      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(JSON.stringify(conditionModel));

      const response = await fetch(`${setting.apipath}/Review/UpdateReviewReadedById`, {
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

      GetReview();
      GetReviewing();
      GetReviewed();
      GetReviewRejected();
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const theKey = useMemo(() => {
    return Math.random();
  }, [router.query]);

  useEffect(() => {
    let dataSource: { document_type: string }[] = [];

    switch (tabshow) {
      case '待審核':
        dataSource = data;
        break;
      case '審核中':
        dataSource = data3;
        break;
      case '審核完成':
        dataSource = data4;
        break;
      case '駁回':
        dataSource = data5;
        break;
      default:
        dataSource = [];
        break;
    }

    // 使用 Set 過濾掉重複的 document_type
    const uniqueOptions = Array.from(new Set(dataSource.map((item) => item.document_type)));
    setOptions(uniqueOptions);
  }, [tabshow]); // 當 tabshow 改變時更新選項

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      <PageHeader02
        tag={'審核清單'}
        panelList={panelList}
        customeRight={[
          <div
            key="1"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // 調整間距，或使用 space-around、space-evenly
              gap: '20px', // 元素之間的間距
              flexWrap: 'wrap', // 如果空間不足，讓元素換行
            }}
          >
            {/* 第一個選項 */}
            <div>
              <select
                value={keyword1 || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setKeyword1(e.target.value);
                  e.target.blur(); // 讓 select 失去焦點
                }}
                style={{
                  fontSize: '18px',
                  borderBottom: '1px solid #14256a',
                  color: '#14256a',
                  width: '200px',
                }}
              >
                <option value="">全部</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>,
        ]}
      />

      <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
        <div className={scss.right}>
          <div className={scss.content}>
            <div>
              <div className={scss.head_content1}>
                <div>
                  <span>
                    <button
                      className={scss.minitabbtn}
                      onClick={() => tabChosed('待審核')}
                      style={getButtonStyle('待審核')}
                    >
                      待審核 &nbsp;
                      {data.length > 0 && (
                        <span
                          style={{
                            position: 'sticky',
                            display: 'inline-block',
                            backgroundColor: '#ea1833',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {data.length}
                        </span>
                      )}
                    </button>
                  </span>
                  <span>
                    <button
                      className={scss.minitabbtn}
                      onClick={() => tabChosed('審核中')}
                      style={getButtonStyle('審核中')}
                    >
                      審核中 &nbsp;
                      {data3.length > 0 && (
                        <span
                          style={{
                            position: 'sticky',
                            display: 'inline-block',
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {data3.length}
                        </span>
                      )}
                    </button>
                  </span>
                  <span>
                    <button
                      className={scss.minitabbtn}
                      onClick={() => tabChosed('審核完成')}
                      style={getButtonStyle('審核完成')}
                    >
                      審核完成 &nbsp;
                      {data4.filter((item) => item.readed === false).length > 0 && (
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {data4.filter((item) => item.readed === false).length}
                        </span>
                      )}
                    </button>
                  </span>
                  <span>
                    <button
                      className={scss.minitabbtn}
                      onClick={() => tabChosed('駁回')}
                      style={getButtonStyle('駁回')}
                    >
                      駁回 &nbsp;
                      {data5.filter((item) => item.readed === false).length > 0 && (
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#ea1833',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            fontSize: '0.9rem',
                          }}
                        >
                          {data5.filter((item) => item.readed === false).length}
                        </span>
                      )}
                    </button>
                  </span>
                </div>
                <div></div>
                <div></div>
              </div>
              <div className={scss.tabbody}>
                <div>
                  <div style={{ display: `${tabshow === '待審核' ? '' : 'none'}` }}>
                    <div style={{ border: '1px solid #c1c1c1' }}>
                      <div className={scss.body_content1} style={{ height: '500px' }}>
                        <div>
                          <Thead01 type={'ReviewList'} />
                          <span>
                            {data &&
                              data.length > 0 &&
                              data.slice(0, 100).map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader21}>
                                  <div
                                    key={index}
                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                    onClick={() => {
                                      GetReviewStatus(_item, '一般');
                                    }}
                                  >
                                    <span>{index + 1}</span>
                                    <span>{getTaiwanDateStr(_item.create_at)}</span>
                                    <span>【{_item.document_type}】</span>
                                    <span>{_item.document_id}</span>
                                    <span>{_item.document_title}</span>
                                    <span>{_item.create_by}</span>
                                  </div>
                                </CellWithBar>
                              ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: `${tabshow === '審核中' ? '' : 'none'}` }}>
                    <div style={{ border: '1px solid #c1c1c1' }}>
                      <div className={scss.body_content1} style={{ height: '500px' }}>
                        <div>
                          <Thead01 type={'ReviewList'} />
                          <span>
                            {data3 &&
                              data3.length > 0 &&
                              data3.slice(0, 100).map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader21}>
                                  <div
                                    key={index}
                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                    onClick={() => {
                                      GetReviewStatus(_item, '一般');
                                    }}
                                  >
                                    <span>{index + 1}</span>
                                    <span>{getTaiwanDateStr(_item.create_at)}</span>
                                    <span>【{_item.document_type}】</span>
                                    <span>{_item.document_id}</span>
                                    <span>{_item.document_title}</span>
                                    <span>{_item.create_by}</span>
                                  </div>
                                </CellWithBar>
                              ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: `${tabshow === '審核完成' ? '' : 'none'}` }}>
                    <div style={{ border: '1px solid #c1c1c1' }}>
                      <div className={scss.body_content1} style={{ height: '500px' }}>
                        <div>
                          <Thead01 type={'ReviewList'} />
                          <span>
                            {data4 &&
                              data4.length > 0 &&
                              data4.slice(0, 100).map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader21}>
                                  <div
                                    key={index}
                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                    onClick={() => {
                                      UpdateReviewReadedById(_item);
                                      GetReviewStatus(_item, '一般');
                                    }}
                                    style={{
                                      backgroundColor: `${_item.readed === false ? 'rgba(210, 233, 255, 0.2)' : ''}`,
                                    }}
                                  >
                                    <span>{index + 1}</span>
                                    <span>{getTaiwanDateStr(_item.create_at)}</span>
                                    <span>【{_item.document_type}】</span>
                                    <span>{_item.document_id}</span>
                                    <span>{_item.document_title}</span>
                                    <span>{_item.create_by}</span>
                                  </div>
                                </CellWithBar>
                              ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: `${tabshow === '駁回' ? '' : 'none'}` }}>
                    <div style={{ border: '1px solid #c1c1c1' }}>
                      <div className={scss.body_content1} style={{ height: '500px' }}>
                        <div>
                          <Thead01 type={'ReviewList'} />
                          <span>
                            {data5 &&
                              data5.length > 0 &&
                              data5.slice(0, 100).map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader21}>
                                  <div
                                    key={index}
                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                    onClick={() => {
                                      UpdateReviewReadedById(_item);
                                      GetReviewStatus(_item, '駁回');
                                    }}
                                    style={{
                                      backgroundColor: `${_item.readed === false ? 'rgba(210, 233, 255, 0.2)' : ''}`,
                                    }}
                                  >
                                    <span>{index + 1}</span>
                                    <span>{getTaiwanDateStr(_item.create_at)}</span>
                                    <span>【{_item.document_type}】</span>
                                    <span>{_item.document_id}</span>
                                    <span>{_item.document_title}</span>
                                    <span>{_item.create_by}</span>
                                  </div>
                                </CellWithBar>
                              ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{}}>
                  <Thead01 type={'ReviewStatusList'} />
                  <span>
                    {data2 &&
                      data2.slice(0, 100).map((_item: any, index: number) => {
                        // 根據 index 設定 prestageReviewDisplay 和 reviewStatusDisplay
                        const prestageReviewDisplay =
                          index === 0
                            ? _item.create_at // 第一筆資料顯示 item.create_at
                            : data2[index - 1].review_time || ''; // 其他資料顯示上一筆的 review_time

                        // 設定 reviewStatusDisplay 根據當前和前一筆的 review_status
                        const reviewStatusDisplay =
                          _item.review_status === '核准'
                            ? '核准' // 當前項目狀態為"核准"，顯示"核准"
                            : index === 0
                            ? _item.review_order === 1
                              ? '提出'
                              : _item.review_status // 第一筆資料顯示"提出"或其他 review_status
                            : data2[index - 1].review_status === '核准'
                            ? '簽核中'
                            : _item.review_status; // 根據前一筆的 review_status

                        return (
                          <CellWithBar key={index} className={scss.panelHeader22}>
                            <div
                              key={index}
                              className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                            >
                              <span style={{ textAlign: 'center', backgroundColor: '#5b5a5ad6', color: 'white' }}>
                                {_item.review_type}
                              </span>
                              <span>{_item.review_person}</span>
                              <span style={{ textAlign: 'center', backgroundColor: '#1061c4', color: 'white' }}>
                                {reviewStatusDisplay}
                              </span>
                              <span>{prestageReviewDisplay}</span>
                              <span>{_item.review_time}</span>
                              <span>{_item.review_memo}</span>
                            </div>
                          </CellWithBar>
                        );
                      })}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: tabnow === '待審核' ? '' : 'none',
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'white',
                zIndex: 1002,
                padding: '5px 20px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                className={scss.body_foot1}
                style={{
                  pointerEvents: tabshow === '審核中' || tabshow === '審核完成' || data.length === 0 ? 'none' : 'auto',
                }}
              >
                <div>
                  <button
                    className={scss.longsquarebtn}
                    onClick={() => {
                      handleReviewConfirm();
                    }}
                    title="核准"
                    style={{
                      color: `${
                        tabshow === '審核中' || tabshow === '審核完成' || data.length === 0 ? '#5b5a5ad6' : '#14256a'
                      }`,
                    }}
                  >
                    {/* <img src={icon_task_approved.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                    核准
                  </button>
                </div>
                <div>
                  <button
                    className={scss.longsquarebtn}
                    onClick={() => {
                      handleReviewRejected();
                    }}
                    title="駁回"
                    style={{
                      color: `${
                        tabshow === '審核中' || tabshow === '審核完成' || data.length === 0 ? '#5b5a5ad6' : '#14256a'
                      }`,
                    }}
                  >
                    {/* <img src={icon_task_rejected.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                    駁回
                  </button>
                </div>
                <div>
                  <input
                    placeholder="意見"
                    value={review_memo}
                    style={{
                      padding: '10px',
                      fontSize: '18px',
                      border: '1px solid gray',
                      height: '100%',
                      width: '100%',
                    }}
                    onChange={(e) => setReview_memo(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'white',
                zIndex: 1000,
                padding: '30px 20px',
              }}
            >
              <div className={scss.body_foot2}>
                <div>
                  {/* 當頁面加載完成後顯示內容 */}
                  {isPageLoaded ? (
                    <div>
                      {/* {reviewtype === '請購單' && <PurchaseRequisitionList key={theKey} />} */}
                      {reviewtype === '請購單' && <PRequisitionDetail key={theKey} />}
                      {/* {reviewtype === '採購單' && <PurchaseOrderList key={theKey} />} */}
                      {reviewtype === '採購單' && <POrderDetail key={theKey} />}
                      {/* {reviewtype === '進貨單' && <ProdReceiptList key={theKey} />} */}
                      {reviewtype === '進貨單' && <PReceiptDetail key={theKey} />}
                      {reviewtype === '報價單' && <Quotation key={theKey} />}
                      {reviewtype === '薪資單' && <SalarySettlement key={theKey} />}
                      {reviewtype === '獎金' && <BonusPayout key={theKey} />}
                      {reviewtype === '工作表' && (
                        <Worksheet key={theKey} userInfo={userInfo!} userErpFeature={erpFeature} isAdmin={false} />
                      )}
                      {reviewtype === '調貨單' && <TransferOrder key={theKey} userInfo={userInfo!} isReadonly={true} />}
                      {reviewtype === '證明文件' && <CertifiedDocument key={theKey} />}
                    </div>
                  ) : (
                    <p>頁面加載中...</p> // 可以顯示一個載入中的提示
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}
