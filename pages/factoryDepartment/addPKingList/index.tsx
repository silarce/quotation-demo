import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';

import scss from './addPKingList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import { nextDay, parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_fc_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import { Collapse, Modal, Pagination } from 'antd';
import icon_close from 'public/image/icon/fc_close.svg';
import icon_remove from 'public/image/icon/fc_remove.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_save_gray from 'public/image/icon/fc_save_gray.svg';
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_add from 'public/image/icon/fc_add2.svg';
import { Panel } from 'components/global/myAntd/collapse';

type Tquery = {
  wareHouseId: string | undefined;
};

export default function AddPKingList() {
  const [pagename, setPagename] = useState<string>('領料');
  const [statusarea, setStatusarea] = useState<boolean>(false);

  //#region ===========【路由參數】
  const router = useRouter();
  const {} = router.query;
  //#endregion

  //#region ===========【登入者】
  const { userInfo } = useContext(AppContext);
  const { erpFeature } = useContext(AppContext);
  //#endregion

  //#region ===========【變數宣告】
  //資料列宣告
  const [data, setData] = useState<any[]>([]);
  const [data1, setData1] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data3, setData3] = useState<any[]>([]);
  const [data2restore, setData2Restore] = useState<any[]>([]);
  const [modaldata, setModalData] = useState<any[]>([]);
  const [searchbardata, setSearchBarData] = useState<any[]>([]);
  const [searchdata, setSearchdata] = useState<any[]>([]);
  const [prdata, setPrdata] = useState<any[]>([]);
  const [customerdata, setCustomerdata] = useState<any[]>([]);
  const [prbardata, setPrbarData] = useState<any[]>([]);
  const [data4, setData4] = useState<any[]>([]);
  const [employeedata, setEmployeedata] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const totalpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const po_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const remaining_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
  const picking_byRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));

  const [isLoading, setIsLoading] = useState(false);

  const [searchproduct, setSearchProduct] = useState<string>('');

  // const [purchaserequisitionid, setPurchaserequisitionid] = useState<string>("");
  // const [purchaserequisitionuuid, setPurchaserequisitionuuid] = useState<string>("");
  const [idin, setidin] = useState<string>('');
  const [uuidin, setuuidin] = useState<string>('');

  const [create_atin, setCreate_atin] = useState<string>('');
  const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>('');
  const [create_byin, setCreate_byin] = useState<string>('');
  const [notein, setNotein] = useState<string>('');
  const [need_datein, setNeed_datein] = useState<string>('');
  const [statusin, setStatusin] = useState<string>('');
  const [suppliernamein, setSuppliernamein] = useState<string>('');
  const [supplierphonein, setSupplierphonein] = useState<string>('');
  const [suppliertaxidin, setSuppliertaxidin] = useState<string>('');
  const [supplieraddressin, setSupplieraddressin] = useState<string>('');
  const [supplierfaxin, setSupplierfaxin] = useState<string>('');
  const [supplieridin, setSupplieridin] = useState<string>('');
  const [supplieruuidin, setSupplieruuidin] = useState<string>('');
  const [suppliercontactin, setSuppliercontactin] = useState<string>('');
  const [shippingaddressin, setShippingaddressin] = useState<string>('');
  const [invoicein, setInvoicein] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState('請選擇類別');

  //搜尋
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');
  const [keyword5, setKeyword5] = useState<string>('');
  const [keyword6, setKeyword6] = useState<string>('');
  const [keyword7, setKeyword7] = useState<string>('');
  // 預設截止日期為今天，起始日期為今天往前推30天
  const defaultEndDate = dayjs();
  const defaultStartDate = dayjs().subtract(30, 'days');

  // 使用 Moment 類型作為狀態
  const [keywordstartdate, setKeywordstartdate] = useState<Dayjs | null>(defaultStartDate);
  const [keywordenddate, setKeywordenddate] = useState<Dayjs | null>(defaultEndDate);

  //手key
  const [currentindex, setCurrentIndex] = useState<number>(0);
  const [handinputname, setHandinputname] = useState<string>('');
  const [handinputspec, setHandinputspec] = useState<string>('');
  const [handinputquantity, setHandinputquantity] = useState<string>('');
  const [handinputunit, setHandinputunit] = useState<string>('');
  const [handinputnote, setHandinputnote] = useState<string>('');
  const [handinputproductid, setHandinputproductid] = useState<string>('');
  const [handinputproductuuid, setHandinputproductuuid] = useState<string>('');

  const [editstatus, setEditStatus] = useState<boolean>(false);
  const [editrowid, setEditRowId] = useState<number>(0);

  const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

  // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
  // const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);

  // 計算總價
  const [totalprice1, setTotalPrice1] = useState<string>('');
  const [taxprice1, setTaxPrice1] = useState<string>('');
  const [totalpayprice1, setTotalPayPrice1] = useState<string>('');
  //#endregion

  //#region ===========【上方功能列】

  //搜尋功能
  const doSearch = (valueArr: (string | Toption | null)[]) => {};

  const searchData = async (keyword1: string, keyword2: string, keyword3: string) => {
    try {
      setIsLoading(true);
      // keywordSpec
      const conditionModel: {
        keyword1: string | undefined;
        keyword2: string | undefined;
        keyword3: string | undefined;
      } = {
        keyword1: keyword1 as string | undefined,
        keyword2: keyword2 as string | undefined,
        keyword3: keyword3 as string | undefined,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      //erpAPI
      const response = await fetch(`${setting.apipath}/WareHouse/SearchProductById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      let data = await response.json();
      setData(data);
      data = _.uniqBy(data, (item: any) => item.whname + item.trayname); // 去重
      setData1(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //新增按鈕
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
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
      },
    },
  ];
  //#endregion

  //#region ===========【監控畫面大小】
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
  }, []);
  //#endregion

  //#region ===========【頁面進入】
  const hasFetchedData = useRef(false);

  useEffect(() => {
    console.log(userInfo);

    if (!hasFetchedData.current) {
      // getPurchaseRequisition();
      getCustomers();
      getProduct();
      setCreate_atin(dayjs().format('YYYY-MM-DD') || '');
      setCreate_byin(userInfo?.employee?.chName.toString() || '');
      setNeed_datein(dayjs().format('YYYY-MM-DD') || '');
      setShippingaddressin('台中市霧峰區峰北路666號');
      getEmployee();
      // getPRequisition();
      hasFetchedData.current = true;
    }
  }, []);

  // useEffect(() => {
  //     setCreate_atin(moment().format('YYYY-MM-DD') || '');
  //     setCreate_byin(userInfo?.employee?.chName.toString() || '');
  //     setNeed_date(moment().format('YYYY-MM-DD') || '');
  // }, []);
  //#endregion

  //#region ===========【API】

  //取物料
  const getProduct = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {};

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/GetProduct?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setData(data);
      setModalData(data);
      setSearchBarData(data);
      setData4(data);
      setPrbarData(data);

      console.log(erpFeature);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //新增單據
  const Add = async () => {
    if (data2.length === 0) {
      myAlert.warning({ title: `${pagename}項目不可為空` });

      return;
    }

    // return;
    try {
      setIsLoading(true);
      const conditionModel = {
        create_at: create_atin,
        need_date: dayjs(need_datein).format('YYYY-MM-DD'),
        create_by: userInfo?.employee?.id.toString(),
        note: notein,
        data2: data2,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/NewAddPickingList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (result.success) {
        // 成功，顯示提示
        myAlert.success({ title: result.message });
        setidin(result.id);
        setuuidin(result.uuid);
        setStatusin('編輯中');
        router.push({
          pathname: `/factoryDepartment/PKingList`,
          query: {},
        });
      } else {
        // 失敗，顯示錯誤提示
        console.log(result.message);
        myAlert.warning({ title: '失敗', content: result.message });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //取廠商
  const getCustomers = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {};

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/GetCustomers?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      // 提取唯一的縣市選項
      const uniqueCounties = Array.from(new Set(responseData.map((item: any) => item.county))) as string[];
      setCountyOptions(uniqueCounties);

      // 設置客戶資料
      setCustomerdata(responseData);

      // 設置篩選後的資料
      setFilteredData2(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployee = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {};

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/GetEmployeeList?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      console.log(data);
      setEmployeedata(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //取請購(轉採購用)
  const getPRequisition = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {};

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/NewGetPRequisitionForAddPOrder?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();

      setData4(responsedata);
      setPrbarData(responsedata);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //#endregion

  //#region ===========【單據功能區】
  const handleAdd = () => {
    Add();
  };
  //#endregion

  //#region ===========【明細功能區】

  // 新增明細
  const handleAddDetail = () => {
    const emptyDetail = {
      id: '', // 使用 _item 的 id 作為唯一識別符
      name: '', // 保留名稱
      note: '', // 保留備註
      picking_by: '', // 領料人員
      picking_qty: 0, // 領料數量
      pickinglistid: idin,
      pickinglistuuid: uuidin,
      productid: '', // 使用 _item 的 productid
      productuuid: '', // 使用 _item 的 productuuid
      quantity: 0, // 設置數量為 0
      remaining_quantity: 0, // 設置剩餘數量為
      spec: '', // 保留規格
      unit: '', // 保留單位
    };

    // 將空資料新增到 data2
    setData2((prevData) => [...prevData, emptyDetail]);
  };

  // 從明細移除
  const handleRemoveDetail = (index: number, item: any) => {
    myAlert.confirm({
      title: '確定移除?',
      props: {
        onOk: () => {
          const updatedData = data2.filter((_, i) => i !== index);
          setData2(updatedData);
        },
      },
    });
  };

  //更新明細資料
  const handleStringChange = (index: number, key: string, value: string) => {
    const updatedData2 = [...data2]; // 使用淺拷貝
    updatedData2[index] = { ...updatedData2[index], [key]: value }; // 確保更改的只是副本
    setData2(updatedData2); // 更新data2

    if (key === 'productid' || key === 'name' || key === 'spec') {
      const filters = {
        productid: updatedData2[index].productid?.trim().toLowerCase() || '',
        name: updatedData2[index].name?.trim().toLowerCase() || '',
        spec: updatedData2[index].spec?.trim().toLowerCase() || '',
      };

      if (Object.values(filters).some((filter) => filter !== '')) {
        const filtered = data.filter(
          (item) =>
            (!filters.productid || item.productid?.toLowerCase().includes(filters.productid)) &&
            (!filters.name || item.name?.toLowerCase().includes(filters.name)) &&
            (!filters.spec || item.spec?.toLowerCase().includes(filters.spec))
        );

        setFilteredData(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else if (key === 'picking_by') {
      const filters = {
        picking_by: updatedData2[index].picking_by?.toLowerCase().trim() || '',
      };

      if (Object.values(filters).some((filter) => filter !== '')) {
        const filtered = employeedata.filter(
          (item) => !filters.picking_by || item.ch_name?.toLowerCase().includes(filters.picking_by)
        );

        setFilteredData4(filtered);
        setShowSuggestions2(true);
      } else {
        setShowSuggestions2(false);
      }
    }
  };

  //focus選中的明細
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  // 明細異動處理
  useEffect(() => {
    console.log(data1);

    // 每次 data2 更新時，重新計算總價和稅金
    let totalprice = 0;
    data2.forEach((element) => {
      // 檢查 totalprice 是不是數字，如果是字串就移除逗號
      const price =
        typeof element.totalprice === 'string'
          ? parseFloat(element.totalprice.replace(/,/g, ''))
          : parseFloat(element.totalprice) || 0; // 如果是數字，直接轉換
      console.log(price); // 顯示正確的數字格式
      totalprice += price; // 將其加總
    });

    console.log(totalprice); // 應顯示正確的加總結果

    // 四捨五入總價到小數點第二位
    const roundedTotalPrice = Math.round(totalprice * 100) / 100;
    setTotalPrice1(roundedTotalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    // 計算稅金，四捨五入到小數點第二位
    const taxPrice = Math.round(roundedTotalPrice * 0.05 * 100) / 100;
    setTaxPrice1(taxPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    // 計算應付總價（總價 + 稅金），四捨五入到小數點第二位
    const totalPayPrice = Math.round((roundedTotalPrice + taxPrice) * 100) / 100;
    setTotalPayPrice1(totalPayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [data2]);

  //#endregion

  //#region ===========【物料篩選】
  interface DataItem {
    id: string;
    productid: string;
    spec: string | null; // spec 可能為 null
    name: string;
    unit: string;
  }

  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (isSelectingRef.current) {
      return;
    }

    let filtered = searchbardata;

    if (handinputproductid !== '' || handinputname !== '' || handinputspec != '') {
      if (handinputproductuuid) {
        let filtered = searchbardata;
        filtered = searchbardata.filter((item) => item.id.includes(handinputproductuuid));
      }

      if (handinputproductid) {
        filtered = filtered.filter((item) => item.productid.includes(handinputproductid));
      }

      if (handinputname) {
        filtered = filtered.filter((item) => item.name.includes(handinputname));
      }

      if (handinputspec) {
        filtered = filtered.filter((item) => item.spec && item.spec.includes(handinputspec));
      }

      setFilteredData(filtered);
      setShowSuggestions(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));

      console.log(showSuggestions);
      console.log(filtered);
    } else {
      setHandinputproductuuid('');
      setFilteredData([]);
      setShowSuggestions(false);
    }
  }, [handinputproductid, handinputname, handinputspec]);

  //點選物料
  const handleSelect = (selectedItem: any) => {
    const updatedData2 = [...data2];
    const index = currentindex; // 假設 currentIndex 保存了目前正在編輯的行

    if (showSuggestions === true) {
      updatedData2[index] = {
        ...updatedData2[index],
        productuuid: selectedItem.id,
        productid: selectedItem.productid,
        name: selectedItem.name,
        spec: selectedItem.spec,
        unit: selectedItem.unit,
      };
      setData2(updatedData2);

      // 清除建議選單
      setFilteredData([]);
      setShowSuggestions(false);
    } else {
      updatedData2[index] = {
        ...updatedData2[index],
        picking_by: selectedItem.ch_name,
      };
      setData2(updatedData2);
      // 清除建議選單
      setFilteredData4([]);
      setShowSuggestions2(false);
    }
  };

  //點選物料後控制，使用ESC關閉等狀態監控
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    // 按下 ESC 鍵關閉下拉選單
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        // ESC 鍵的 keyCode 是 27
        setFilteredData([]);

        if (dropdownRef.current) {
          dropdownRef.current.style.display = 'none';
        }
      }
    };

    // 為整個 document 添加事件監聽器
    document.addEventListener('keydown', handleKeyDown);

    // 清理事件監聽器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  //#endregion

  //#region ===========【廠商篩選】
  const [customerbar, setCustomerbar] = useState(false);
  const [countyOptions, setCountyOptions] = useState<string[]>([]);
  const [filteredData2, setFilteredData2] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    county: '',
    name: '',
    contact: '',
  });

  // 根據篩選條件更新資料
  useEffect(() => {
    const filtered = customerdata.filter(
      (item) =>
        (filters.county === '' || item.county === filters.county) &&
        (filters.name === '' || item.name.includes(filters.name)) &&
        (filters.contact === '' || item.contact.includes(filters.contact))
    );
    setFilteredData2(filtered);
  }, [filters]);

  //#endregion

  //#region  ===========【員工篩選】
  const [filteredData4, setFilteredData4] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //#endregion

  //#region  ===========【請購帶入功能區】
  const [prbar, setPrbar] = useState(false);

  //#endregion

  //#region ===========【請購單篩選】

  const [filteredData3, setFilteredData3] = useState(data4); // 儲存篩選後的資料

  // 當 keyword5, keyword6, keyword7 變化時進行篩選
  useEffect(() => {
    const filteredData = data4.filter((item) => {
      const matchesKeyword5 = keyword5 ? item.productid?.toLowerCase().includes(keyword5.toLowerCase()) : true;
      const matchesKeyword6 = keyword6 ? item.name?.toLowerCase().includes(keyword6.toLowerCase()) : true;
      const matchesKeyword7 = keyword7 ? item.spec?.toLowerCase().includes(keyword7.toLowerCase()) : true;

      return matchesKeyword5 && matchesKeyword6 && matchesKeyword7;
    });

    setFilteredData3(filteredData);
  }, [keyword5, keyword6, keyword7, data4]); // 監聽依賴項目

  //#endregion

  //#region ===========【分頁處理】
  // 頁數相關狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // 每頁顯示的項目數

  // 計算當前頁顯示的資料
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredData3.slice(startIndex, endIndex);
  }, [itemsPerPage, currentPage, filteredData3]);

  // 分頁切換處理函數
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  //#endregion

  //#region ===========【儲格Modal】

  const [data11, setData11] = useState<any[]>([]);
  //儲格變數
  const [whpositionqmodalopen, setWhpositionqmodalopen] = useState<boolean>(false);

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
  const [nowpickingqty, setNowpickingqty] = useState<string>('');
  const [nowwhpositionuuid, setNowwhpositionuuid] = useState<string>('');
  const [nowpickinglistdetailuuid, setNowpickinglistdetailuuid] = useState<string>('');

  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState('0px');
  const [mouseY, setMouseY] = useState('0px');

  const [modalcheckfirstin, setModalcheckfirstin] = useState<number>(0);

  const GetLayOut = async (whid: any, trayname: any, id: any) => {
    try {
      setIsLoading(true);
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

  const CallTray = async () => {
    try {
      if (traycalled === true) {
        myAlert.warning({ title: '請先收回托盤' });
      } else {
        myAlert.confirm({
          title: `呼叫: ${nowwhname}-${nowtrayname}`,
          content: '!!請勿靠近設備!!',
          props: {
            onOk: () => {
              CallTrayAPI();
              // alert("呼叫托盤");
            },
          },
        });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const CallTrayBack = async () => {
    if (traycalled != true) {
      myAlert.warning({ title: '目前無托盤可收回' });
    } else {
      myAlert.confirm({
        title: `收回: ${nowwhname}-${nowtrayname}`,
        content: '!!請勿靠近設備!!',
        props: {
          onOk: () => {
            CallTrayBackAPI();
          },
        },
      });
    }
  };

  const CallTrayAPI = async () => {
    try {
      setIsLoading(true);

      // 根據 whname 設置 deviceName
      // 寫死
      const deviceName =
        nowwhname === '101'
          ? 'Device1'
          : nowwhname === '102'
          ? 'Device1'
          : nowwhname === '103'
          ? 'Device1'
          : nowwhname === '104'
          ? 'Device1'
          : '';
      const traynumber = nowtrayname;
      const traycommand = '100';

      const url =
        setting.env === 'prod'
          ? nowwhname === '101'
            ? `https://${setting.warehouse1}/`
            : nowwhname === '102'
            ? `https://${setting.warehouse2}/`
            : nowwhname === '103'
            ? `https://${setting.warehouse3}/`
            : nowwhname === '104'
            ? `https://${setting.warehouse4}/`
            : ''
          : 'https://localhost:44383/WareHouse/';

      // execcommand 的固定參數
      const regaddress = '253';
      const cmdvalue = '1';

      // alert(whname + " : " + trayname);

      // 設定呼叫的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
      setTraycalled(true);
      setWhnamecalled(nowwhname);
      setTraynamecalled(nowtrayname);
      setWhpnamecalled(nowwhposition);

      // alert(url);
      // return;

      // 呼叫 traycommand API
      const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 traycommand API 的回應
      if (!response.ok) {
        throw new Error('Failed to call traycommand API');
      }

      console.log(response);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 呼叫 execcommand API
      const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 execcommand API 的回應
      if (!response2.ok) {
        throw new Error('Failed to call execcommand API');
      }

      console.log(response2);

      // 如果成功，設置 traycalled 和 traycalledname 狀態
      setTraycalled(true);
      setWhnamecalled(nowwhname);
      setTraynamecalled(nowtrayname);
      setWhpnamecalled(nowwhposition);
    } catch (error: any) {
      myAlert.warning(error.message);
      console.error;
    } finally {
      setIsLoading(false);
    }
  };

  const CallTrayBackAPI = async () => {
    try {
      setIsLoading(true);

      // 根據 whname 設置 deviceName
      const deviceName =
        whnamecalled === '101'
          ? 'Device1'
          : whnamecalled === '102'
          ? 'Device1'
          : whnamecalled === '103'
          ? 'Device1'
          : whnamecalled === '104'
          ? 'Device1'
          : '';
      const traynumber = traynamecalled;
      const traycommand = '200';
      const url =
        setting.env === 'prod'
          ? whnamecalled === '101'
            ? `https://${setting.warehouse1}/`
            : whnamecalled === '102'
            ? `https://${setting.warehouse2}/`
            : whnamecalled === '103'
            ? `https://${setting.warehouse3}/`
            : whnamecalled === '104'
            ? `https://${setting.warehouse4}/`
            : ''
          : 'https://localhost:44383/WareHouse/';

      // execcommand 的參數
      const regaddress = '253';
      const cmdvalue = '1';

      // 收回清空設定的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
      setWhnamecalled('');
      setTraycalled(false);
      setTraynamecalled('');
      setWhpnamecalled('');
      // alert(url);

      // 呼叫 traycommand API
      const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 traycommand API 的回應
      if (!response.ok) {
        throw new Error('Failed to call traycommand API');
      }

      // 等待一秒
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 呼叫 execcommand API
      const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 execcommand API 的回應
      if (!response2.ok) {
        throw new Error('Failed to call execcommand API');
      }

      // 如果成功，設置 traycalled 和 traycalledname 狀態
      setTraycalled(false);
      setWhnamecalled('');
      setTraynamecalled('');
      setWhpnamecalled('');
    } catch (error: any) {
      // 處理錯誤，顯示警告
      myAlert.warning(error.message);
      console.error(error); // 這裡需要傳遞錯誤對象
    } finally {
      setIsLoading(false);
    }
  };

  const minusWHPositionQuantity = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        whpositionuuid: nowwhpositionuuid,
        quantity: inboxquantity.toString() as string | undefined,
        pickinglistdetailuuid: nowpickinglistdetailuuid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/MinusPickingListDetail?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      getWhpositionDetailByProductId(nowproductid);
      setNowpickingqty((parseInt(nowpickingqty) + 1).toString());
      // GetDetailById(uuidin);
      setWhpquantity((parseInt(whpquantity) - inboxquantity).toString());
      setInboxquantity(0);
    } catch (error: any) {
      setError('getProdReceiptDetail:' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getWhpositionDetailByProductId = async (productid: any) => {
    try {
      setIsLoading(true);
      const conditionModel: {
        productid: string | undefined;
        type: string | undefined;
      } = {
        productid: productid as string | undefined,
        type: 'picking',
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
          content: '目前沒有可領取的儲位資訊',
        });

        return;
      }

      console.log(data3);
      setData3(data);

      GetLayOut(data[0].whid, data[0].trayname, data[0].id);

      console.log(data);

      if (modalcheckfirstin === 0) {
        setWhpnumber(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
        setWhpname(data[0].name);
        setWhpproductid(data[0].productid);
        setWhpspec(data[0].spec);
        setWhpquantity(data[0].quantity);
        setNowwhname(data[0].whname);
        setNowtrayname(data[0].trayname);
        setNowwhposition(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
      }

      console.log(data);

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

  function handleminusquantity() {
    if (inboxquantity > parseInt(whpquantity)) {
      myAlert.warning({ title: '領取數量大於庫存數' });

      return;
    }

    myAlert.confirm({
      title: `確定要從此儲格領取嗎?: ${nowwhname}-${nowtrayname}-${whpnamecalled}`,
      props: {
        onOk: () => {
          // addWHPositionQuantity();
          minusWHPositionQuantity();
        },
      },
    });
  }

  // 關閉儲格Modal
  const whpositionqModalClose = async () => {
    setWhpositionqmodalopen(false);
  };

  function handleinbox(item: any) {
    setWhpnumber('');
    setWhpproductid('');
    setWhpname('');
    setWhpspec('');
    setWhpquantity('');
    setInboxquantity(0);
    setData3([]);
    setData11([]);
    getWhpositionDetailByProductId(item.productid);
    setWhpositionqmodalopen(!whpositionqmodalopen);
    // setMaxinboxquantity(item.quantity);
    setNowproductid(item.productid);
    setNowname(item.name);
    setNowspec(item.spec);
    setNowquantity(item.quantity);
    setNowpickingqty(item.picking_qty);
    setNowpickinglistdetailuuid(item.id);
    // setNowWhp
  }

  function handleGetLayOut(item: any) {
    handleRowClick(item.id);
    console.log(item);
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
    setNowwhname(item.whname);
    setNowtrayname(item.trayname);
    setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
  }

  //#endregion

  return (
    <SubLayer isLoading_subLayer={isLoading} className="overflow-hidden">
      <PageHeader02
        tag={'新增' + pagename + '單'}
        panelList={panelList}
        customeRight={[
          <>
            <button
              className={scss.shortsquarebtn}
              style={{
                display: `${status === '未送出' ? '' : 'none'}`,
              }}
            >
              編輯
            </button>
            <button
              className={scss.shortredsquarebtn}
              style={{
                display: `${status === '' ? '' : 'none'}`,
              }}
              onClick={() => {
                // console.log(data2);
                handleAdd();
              }}
            >
              儲存
            </button>
          </>,
        ]}
        customeLeft={[
          <>
            <span style={{ fontSize: '18px', paddingLeft: '10px' }}>{status}</span>
            <button
              className={scss.shortsquarebtn}
              style={{}}
              onClick={() => {
                setPrbar(!prbar);
              }}
            >
              <span style={{ fontWeight: 'bolder', padding: '0px 5px' }}>☰</span>
              物料查詢
            </button>
          </>,
        ]}
      />
      <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
        <div className={scss.right}>
          <div className={scss.content}>
            <div className={scss.head_body}>
              <div>
                <div className={scss.head_content0}>
                  <div>
                    <InputSel
                      {...inputSelProps}
                      caption={`${pagename}單號`}
                      captionStyle={{ fontSize: '18px' }}
                      wrapperStyle={{ paddingBottom: '10px' }}
                      disabled={true}
                      inputProps={{
                        props: {
                          value: idin || ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="建立人員"
                      captionStyle={{ fontSize: '18px' }}
                      wrapperStyle={{ paddingBottom: '10px' }}
                      disabled={true}
                      inputProps={{
                        props: {
                          value: create_byin,
                        },
                      }}
                    />
                    <InputSel
                      caption="建立日期"
                      className="global_tip_must"
                      disabled={status === '未送出' ? true : false}
                      captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                      wrapperStyle={{ marginBottom: '10px' }}
                      datePickerProps={{
                        props: {
                          value: create_atin ? dayjs(create_atin) : null,
                          onChange: (e) => {
                            setCreate_atin(e ? dayjs(e).format('YYYY-MM-DDTHH:mm:ssZ') : '');
                          },
                        },
                      }}
                    />
                    {/* <InputSel
                                            caption="採購類別"
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={false}
                                            selectProps={{
                                                props: {
                                                    menuPortalTarget: undefined,
                                                    styles: {
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 1003,
                                                        }),
                                                    },
                                                    options: [
                                                        { value: '文具', label: '文具' },
                                                        { value: '生產', label: '生產' },
                                                        { value: '總務', label: '總務' },
                                                    ],
                                                    onChange: (option: any) => setSelectedValue(option?.value),
                                                    value: selectedValue
                                                        ? {
                                                            value: selectedValue,
                                                            label: selectedValue,
                                                        }
                                                        : null,
                                                },
                                            }}
                                        /> */}
                  </div>
                  <div>
                    <InputSel
                      {...inputSelProps}
                      caption="排版用"
                      captionStyle={{ fontSize: '18px' }}
                      wrapperStyle={{ paddingBottom: '10px' }}
                      disabled={true}
                      className="invisible"
                      inputProps={{
                        props: {
                          value: ' ',
                        },
                      }}
                    />
                    {/* <InputSel
                                            {...inputSelProps}
                                            caption="申請部門"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: userInfo?.employee?.jobs[0].department.name
                                                },
                                            }}
                                        />
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            // disabled={status === "未儲存" ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: need_datein ? moment(need_datein) : null,
                                                    onChange: (e) => { setNeed_datein(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        /> */}
                  </div>
                  <div></div>
                </div>
                <div className={scss.head_content2}>
                  <div>
                    {/* <InputSel
                                            {...inputSelProps}
                                            caption="廠商名稱"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: suppliernamein,
                                                    onChange: (e) => { setSuppliernamein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商地址"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: supplieraddressin,
                                                    onChange: (e) => { setSupplieraddressin(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="收貨地址"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: shippingaddressin,
                                                    onChange: (e) => { setShippingaddressin(e.target.value) }
                                                },
                                            }}
                                        /> */}
                    <InputSel
                      {...inputSelProps}
                      caption="備註說明"
                      captionStyle={{ fontSize: '18px' }}
                      wrapperStyle={{ marginBottom: '10px' }}
                      // disabled={!isEditing}
                      inputProps={{
                        props: {
                          value: notein,
                          onChange: (e) => {
                            setNotein(e.target.value);
                          },
                        },
                      }}
                    />
                  </div>
                  <div>
                    {/* <InputSel
                                            {...inputSelProps}
                                            caption="廠商電話"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: supplierphonein,
                                                    onChange: (e) => { setSupplierphonein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商統編"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: suppliertaxidin,
                                                    onChange: (e) => { setSuppliertaxidin(e.target.value) }
                                                },
                                            }}
                                        /> */}
                  </div>
                  <div>
                    {/* <button
                                            style={{
                                                // display: `${isEditing ? '' : 'none'}`,
                                                width: '39px',
                                                backgroundColor: '#f5f5f5',
                                                border: '1px solid #c1c1c1',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontWeight: 'bolder'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = '#e0e0e0';
                                                e.currentTarget.style.borderColor = '#a1a1a1';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                e.currentTarget.style.borderColor = '#c1c1c1';
                                            }}
                                            onClick={() => {
                                                setCustomerbar(true);
                                            }}
                                        >
                                            ⋯
                                        </button> */}
                  </div>
                </div>
              </div>
              <div>
                {statusarea && (
                  <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                    <InputSel
                      {...inputSelProps}
                      caption="小計"
                      disabled={true}
                      inputProps={{
                        props: {
                          style: { textAlign: 'right' },
                          value: totalprice1 || ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="營業稅"
                      disabled={true}
                      inputProps={{
                        props: {
                          style: { textAlign: 'right' },
                          value: taxprice1 || ' ',
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      caption="應付金額"
                      disabled={true}
                      inputProps={{
                        props: {
                          style: { textAlign: 'right' },
                          value: totalpayprice1 || ' ',
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {prbar && (
              <>
                <div style={{ paddingBottom: '18px' }}>
                  <span
                    style={{
                      height: '50px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      justifyContent: 'center', // 水平置中
                      alignItems: 'center', // 垂直置中
                      fontSize: '18px',
                    }}
                  >
                    物料查詢
                  </span>
                </div>

                <div>
                  <div className={scss.head_content1}>
                    <InputSel
                      {...inputSelProps}
                      caption="物料總數"
                      disabled={true}
                      inputProps={{
                        props: {
                          type: 'number',
                          value: data4.length,
                        },
                      }}
                    />
                    {/* 搜尋欄位：依單號 */}
                    <InputSel
                      {...inputSelProps}
                      inputProps={{
                        props: {
                          style: { borderRight: '1px solid rgb(168, 168, 168)' },
                          type: 'text',
                          value: keyword5,
                          placeholder: '輸入料號',
                          onChange: (e) => setKeyword5(e.target.value),
                        },
                      }}
                    />
                    {/* 搜尋欄位：依品項規格 */}
                    <InputSel
                      {...inputSelProps}
                      inputProps={{
                        props: {
                          style: { borderRight: '1px solid rgb(168, 168, 168)' },
                          type: 'text',
                          value: keyword6,
                          placeholder: '輸入品名',
                          onChange: (e) => setKeyword6(e.target.value),
                        },
                      }}
                    />
                    <InputSel
                      {...inputSelProps}
                      inputProps={{
                        props: {
                          type: 'text',
                          value: keyword7,
                          placeholder: '輸入規格',
                          onChange: (e) => setKeyword7(e.target.value),
                        },
                      }}
                    />
                  </div>

                  <div
                    style={{
                      border: '1px solid rgb(168, 168, 168)',
                      marginLeft: '20px',
                      marginRight: '20px',
                      height: '350px',
                    }}
                  >
                    <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                      <div className={scss.thead22}>
                        <span></span>
                        <span>序</span>
                        <span>料號</span>
                        <span>品名</span>
                        <span>規格</span>
                        <span>數量</span>
                        <span>單位</span>
                        <span>備註(用途說明)</span>
                        <span></span>
                      </div>
                      {currentItems &&
                        currentItems.map((_item, index) => {
                          // 檢查是否已存在於 data2 中
                          const isChecked = data2.some((item) => item.id === _item.id);

                          const handleCheckboxChange = (checked: boolean, _item: any) => {
                            if (checked) {
                              // 建立一個空資料結構，並將相應的資料從 _item 中提取過來
                              const emptyDetail = {
                                id: _item.id, // 使用 _item 的 id 作為唯一識別符
                                name: _item.name, // 保留名稱
                                note: '', // 保留備註
                                picking_by: '', // 領料人員
                                picking_qty: 0, // 領料數量
                                pickinglistid: idin,
                                pickinglistuuid: uuidin,
                                productid: _item.productid, // 使用 _item 的 productid
                                productuuid: _item.id, // 使用 _item 的 productuuid
                                quantity: 0, // 設置數量為 0
                                remaining_quantity: 0, // 設置剩餘數量為
                                spec: _item.spec, // 保留規格
                                unit: _item.unit, // 保留單位
                              };

                              // 將空資料新增到 data2
                              setData2((prevData) => [...prevData, emptyDetail]);
                            } else {
                              // 取消勾選時，從 data2 中移除該項目
                              setData2((prevData2) => prevData2.filter((item) => item.id !== _item.id));
                            }
                          };

                          return (
                            <CellWithBar key={index} className={scss.panelHeader22}>
                              <div className={scss.row01}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => handleCheckboxChange(e.target.checked, _item)}
                                  style={{
                                    transform: 'scale(1.5)',
                                    margin: '5px',
                                    cursor: 'pointer',
                                  }}
                                />
                                <span>{(currentPage - 1) * itemsPerPage + index + 1}</span>
                                <span>
                                  <input
                                    ref={productidRefs.current[index]}
                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                    type="text"
                                    value={_item.productid !== undefined ? _item.productid : ''}
                                    readOnly
                                  />
                                </span>
                                <span>
                                  <input
                                    ref={nameRefs.current[index]}
                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                    type="text"
                                    value={_item.name !== undefined ? _item.name : ''}
                                    readOnly
                                  />
                                </span>
                                <span>
                                  <input
                                    ref={specRefs.current[index]}
                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                    type="text"
                                    value={_item.spec !== undefined ? _item.spec : ''}
                                    readOnly
                                  />
                                </span>
                                <span>
                                  <input
                                    ref={quantityRefs.current[index]}
                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                    type={'text'}
                                    value={_item.count}
                                    readOnly
                                  />
                                </span>
                                <span>
                                  <input
                                    ref={unitRefs.current[index]}
                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                    type="text"
                                    value={_item.unit !== undefined ? _item.unit : ''}
                                    readOnly
                                  />
                                </span>
                              </div>
                            </CellWithBar>
                          );
                        })}
                    </div>
                  </div>
                  <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
                    {/* 分頁控制 */}
                    <Pagination
                      current={currentPage} // 當前頁碼
                      total={filteredData3.length} // 總數據量
                      pageSize={itemsPerPage} // 每頁顯示的數量，這會根據 itemsPerPage 動態更新
                      onChange={handlePageChange} // 處理頁面切換
                      onShowSizeChange={(current, size) => setItemsPerPage(size)} // 更新每頁顯示項目數量
                    />
                  </div>
                </div>
              </>
            )}
            <div
              style={{
                paddingTop: `${prbar ? '18px' : '0px'}`,
                paddingBottom: '18px',
              }}
            >
              <span
                style={{
                  height: '50px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center', // 水平置中
                  alignItems: 'center', // 垂直置中
                  fontSize: '18px',
                }}
              >
                {pagename}項目
              </span>
            </div>
            <div className={scss.head_content1}>
              <InputSel
                {...inputSelProps}
                caption="品項數量"
                disabled={true}
                inputProps={{
                  props: {
                    type: 'number',
                    // style: { color: 'red' },
                    value: data2.length,
                  },
                }}
              />
            </div>
            <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px' }}>
              <div className={scss.body_content2} style={{ overflowX: 'auto' }}>
                {/* <Thead01 type={'AddPR_ReqList'} /> */}
                <div className={scss.thead20}>
                  <span></span>
                  <span>序</span>
                  <span>料號</span>
                  <span>品名</span>
                  <span>規格</span>
                  <span>已領</span>
                  <span>剩餘</span>
                  <span>數量</span>
                  <span>單位</span>
                  <span>領料人員</span>
                  <span>備註(用途說明)</span>
                  <span></span>
                  <span></span>
                </div>
                {data2 &&
                  data2.map((_item, index) => {
                    const Totalprice = parseFloat(_item.quantity) * parseFloat(_item.unitprice);
                    _item.totalprice = Totalprice;

                    return (
                      <CellWithBar key={index} className={scss.panelHeader20}>
                        <div className={scss.row01}>
                          <span>
                            <button
                              onClick={() => {
                                handleRemoveDetail(index, _item);
                              }}
                            >
                              {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                              <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                            </button>
                          </span>
                          <span>{index + 1}</span>
                          <span>
                            <input
                              ref={productidRefs.current[index]}
                              // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              value={_item.productid !== undefined ? _item.productid : ''}
                              // readOnly
                              // readOnly={!(index + 1 === editrowid && editstatus === true)}
                              onChange={(e) => {
                                handleStringChange(index, 'productid', e.target.value);
                                setCurrentIndex(index);
                                // setHandinputproductid(e.target.value);
                              }}
                            />
                          </span>
                          <span>
                            <input
                              ref={nameRefs.current[index]}
                              // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              value={_item.name !== undefined ? _item.name : ''}
                              // readOnly
                              // readOnly={!(index + 1 === editrowid && editstatus === true)}
                              onChange={(e) => {
                                handleStringChange(index, 'name', e.target.value);
                                setCurrentIndex(index);
                                // setHandinputname(e.target.value);
                              }}
                            />
                          </span>
                          <span>
                            <input
                              ref={specRefs.current[index]}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              value={_item.spec !== undefined ? _item.spec : ''}
                              // readOnly={!(index + 1 === editrowid && editstatus === true)}
                              // readOnly
                              onChange={(e) => {
                                handleStringChange(index, 'spec', e.target.value);
                                setCurrentIndex(index);
                                // setHandinputspec(e.target.value);
                              }}
                            />
                          </span>
                          <span>{_item.picking_qty}</span>
                          <span>{_item.remaining_quantity}</span>
                          <span>
                            <input
                              ref={quantityRefs.current[index]}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              // maxLength={5}
                              value={_item.quantity !== undefined ? _item.quantity : 0}
                              // readOnly={!(index + 1 === editrowid && editstatus === true)}
                              // readOnly
                              onChange={(e) => {
                                // handleNumberChange(index, "quantity", e.target.value);
                                handleStringChange(index, 'quantity', e.target.value);
                              }}
                            />
                          </span>
                          <span>
                            <input
                              ref={unitRefs.current[index]}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              value={_item.unit !== undefined ? _item.unit : ''}
                              // readOnly
                              onChange={(e) => {
                                handleStringChange(index, 'unit', e.target.value);
                              }}
                            />
                          </span>
                          <span>
                            <input
                              ref={picking_byRefs.current[index]}
                              style={{
                                backgroundColor: 'transparent',
                                borderBottom: '1px solid black',
                                width: '95%',
                              }}
                              type={'text'}
                              // value={Number(_item.quantity)}
                              // value={_item.quantity !== undefined ? _item.quantity : 0}
                              value={_item.picking_by}
                              // readOnly={!isEditing}
                              onChange={(e) => {
                                handleStringChange(index, 'picking_by', e.target.value);
                                setCurrentIndex(index);
                              }}
                            />
                          </span>
                          <span>
                            <input
                              ref={noteRefs.current[index]}
                              // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                              style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              type="text"
                              value={_item.note !== undefined ? _item.note : ''}
                              // readOnly={!(index + 1 === editrowid && editstatus === true)}
                              // readOnly
                              onChange={(e) => {
                                handleStringChange(index, 'note', e.target.value);
                              }}
                            />
                          </span>
                        </div>
                      </CellWithBar>
                    );
                  })}
              </div>
              <span style={{ paddingLeft: '22px', position: 'relative' }}>
                <button
                  onClick={() => {
                    handleAddDetail();
                  }}
                  style={{ fontSize: '18px' }}
                >
                  <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                  新增品項
                </button>
              </span>
            </div>
            <div className={scss.body_foot1}>
              <div>
                {filteredData.length > 0 && (
                  <ul
                    ref={dropdownRef}
                    style={{
                      border: '1px solid #c1c1c1',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginTop: '0px',
                      left: '20px',
                      // position: 'relative',
                      position: 'sticky',
                      width: '1000px',
                      backgroundColor: 'white',
                      zIndex: 1004,
                      display: `${showSuggestions ? '' : 'none'}`,
                    }}
                  >
                    {filteredData.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '8px',
                          border: '1px solid #c1c1c1',
                          display: 'flex', // 使用 flexbox
                          justifyContent: 'space-between', // 在項目之間創建間距
                          alignItems: 'center', // 垂直置中
                        }}
                      >
                        <span style={{ flex: '1 1 20%' }}>
                          {' '}
                          {/* 30% 的寬度，根據需要調整 */}
                          {item.productid}
                        </span>
                        <span style={{ flex: '1 1 47%' }}>
                          {' '}
                          {/* 40% 的寬度，根據需要調整 */}
                          {item.name}
                        </span>
                        <span style={{ flex: '1 1 30%' }}>
                          {' '}
                          {/* 30% 的寬度，根據需要調整 */}
                          {item.spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div></div>
              <div>
                {filteredData4.length > 0 && (
                  <ul
                    ref={dropdownRef}
                    style={{
                      border: '1px solid #c1c1c1',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginTop: '0px',
                      position: 'sticky' /* 設置為sticky */,
                      bottom: '0' /* 固定在底部 */,
                      left: '20px',
                      width: '500px',
                      backgroundColor: 'white',
                      zIndex: 1004,
                      display: `${showSuggestions2 ? '' : 'none'}` /* 根據showSuggestions控制顯示 */,
                    }}
                  >
                    {filteredData4.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '8px',
                          border: '1px solid #c1c1c1',
                          display: 'flex', // 使用 flexbox
                          justifyContent: 'space-between', // 在項目之間創建間距
                          alignItems: 'center', // 垂直置中
                        }}
                      >
                        <span style={{ flex: '1 1 20%' }}>
                          {' '}
                          {/* 30% 的寬度，根據需要調整 */}
                          {item.department}
                        </span>
                        <span style={{ flex: '1 1 47%' }}>
                          {' '}
                          {/* 40% 的寬度，根據需要調整 */}
                          {item.title}
                        </span>
                        <span style={{ flex: '1 1 30%' }}>
                          {' '}
                          {/* 30% 的寬度，根據需要調整 */}
                          {item.ch_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={customerbar}
          onCancel={() => setCustomerbar(false)}
          width="1010px"
          closable={false} // 移除右上角的叉叉
          style={{ top: 150 }}
          bodyStyle={{ padding: 0, height: '500px', overflowY: 'auto' }}
          title={
            <>
              {/* 篩選區域 */}
              <div style={{ display: 'flex', gap: '10px', padding: '10px', alignItems: 'center', fontSize: '16px' }}>
                {/* 縣市篩選 */}
                <select
                  value={filters.county}
                  onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                  style={{ padding: '5px', borderBottom: '1px solid #ccc' }}
                >
                  <option value="">全部縣市</option>
                  {countyOptions.map((county, index) => (
                    <option key={index} value={county}>
                      {county}
                    </option>
                  ))}
                </select>

                {/* 公司名稱篩選 */}
                <input
                  type="text"
                  placeholder="輸入公司名稱"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  style={{ padding: '5px', borderBottom: '1px solid #ccc', flex: '1' }}
                />

                {/* 聯絡人篩選 */}
                <input
                  type="text"
                  placeholder="輸入聯絡人名稱"
                  value={filters.contact}
                  onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                  style={{ padding: '5px', borderBottom: '1px solid #ccc', flex: '1' }}
                />
              </div>
            </>
          }
          footer={null}
        >
          {/* 資料列表 */}
          <div className={scss.thead21}>
            <span>名稱</span>
            <span>地址</span>
            <span>統編</span>
            <span></span>
          </div>
          {filteredData2 &&
            filteredData2.map((_item: any, index: number) => (
              <CellWithBar
                key={index}
                className={scss.panelHeader21}
                onClick={() => {
                  setSuppliernamein(_item.name);
                  setSupplieraddressin(_item.county + _item.district + _item.address);
                  setSupplierphonein(_item.phone);
                  setSuppliertaxidin(_item.tax_id);
                  setSupplieridin(_item.customer_number);
                  setSupplierfaxin(_item.fax);
                  setSuppliercontactin(_item.contact);
                  setSupplieruuidin(_item.id);
                  setCustomerbar(false);
                }}
              >
                <div className={scss.row01}>
                  <span>{_item.name}</span>
                  <span>
                    {_item.county}
                    {_item.district}
                    {_item.address}
                  </span>
                  <span>{_item.contact}</span>
                  <span>{_item.review_person}</span>
                  <span>{_item.review_memo}</span>
                </div>
              </CellWithBar>
            ))}
        </Modal>
      </div>
    </SubLayer>
  );
}
