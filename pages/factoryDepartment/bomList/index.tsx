import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import scss from './bomList.module.scss';
import { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setting } from '../wareHouseList/index';
import { useRouter } from 'next/router';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
//grid
import Thead01 from '../ui/table/thead01';
//icon
import icon_search from 'public/image/icon/fc_search.svg?url';
import icon_clear from 'public/image/icon/fc_clear.svg?url';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import icon_fc_add from 'public/image/icon/fc_add.svg?url';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import icon_cancel from 'public/image/icon/fc_cancel.svg?url';
import icon_fc_check from 'public/image/icon/fc_check.svg?url';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg?url';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg?url';
import icon_edit from 'public/image/icon/fc_edit.svg?url';
import icon_delete from 'public/image/icon/fc_delete.svg?url';
import icon_add from 'public/image/icon/fc_add2.svg?url';
import { Pagination } from 'antd';
import icon_search2 from 'public/image/icon/search.svg?url';

export default function BomList() {
  //#region =============【路由參數】===============================================================================
  const router = useRouter();
  const {} = router.query;
  //#endregion

  //#region =============【變數宣告】===============================================================================
  // Loading
  const [isLoading, setIsLoading] = useState(false);

  //登入者資料
  const { userInfo } = useGlobal_userInfo();

  // 資料列
  const [data, setData] = useState<any[]>([]); // 物料data
  const [bomdata, setBomdata] = useState<any[]>([]); // 物料data
  const [searchdata, setSearchdata] = useState<any[]>([]); // 物料查詢
  const [searchbardata, setSearchBarData] = useState<any[]>([]); // 手key物料查詢

  // 查詢變數-物料
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');

  //普通變數
  const [productid, setProductid] = useState<string>('');
  const [productname, setProductname] = useState<string>('');
  const [productspec, setProductspec] = useState<string>('');
  const [productmaterial, setProductmaterial] = useState<string>('');
  const [productsurface, setProductsurface] = useState<string>('');
  const [parent_product, setParent_product] = useState<string>('');

  //手key輸入
  const [handinputname, setHandinputname] = useState<string>('');
  const [handinputspec, setHandinputspec] = useState<string>('');
  const [handinputquantity, setHandinputquantity] = useState<string>('');
  const [handinputunit, setHandinputunit] = useState<string>('');
  const [handinputnote, setHandinputnote] = useState<string>('');
  const [handinputproductid, setHandinputproductid] = useState<string>('');
  const [handinputproductuuid, setHandinputproductuuid] = useState<string>('');
  const [handinputmaterial, setHandinputmaterial] = useState<string>('');
  const [handinputsurface, setHandinputsurface] = useState<string>('');

  //工單部分
  const [handinputenable, setHandinputenable] = useState<boolean>(true);
  const [handinputworksheetnumber, setHandinputworksheetnumber] = useState<string>('');
  const [handinputcolumnofspeconqpi, setHandinputcolumnofspeconqpi] = useState<string>('');
  const [handinputspecformula, setHandinputspecformula] = useState<string>('');
  const [handinputspecstr, setHandinputspecstr] = useState<string>('');
  const [handinputspecunit, setHandinputspecunit] = useState<string>('');
  const [handinputfmlquantity, setHandinputfmlquantity] = useState<string>('');

  const [handinputquantityformula, setHandinputquantityformula] = useState<string>('');

  //#endregion

  //#region =============【頁面進入】===============================================================================
  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (!hasFetchedData.current) {
      //取得所有物料
      GetProduct();

      hasFetchedData.current = true;
    }
  }, []);

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
  //#endregion

  //#region =============【上功能列】===============================================================================
  //搜尋功能
  const searchTargetList = [
    {
      placeholder: '料號',
    },
    {
      placeholder: '名稱',
    },
    {
      placeholder: '規格',
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

  //#region =============【  API  】===============================================================================

  const GetProduct = async () => {
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

      const responsedata = await response.json();

      setData(responsedata);
      setSearchdata(responsedata);
      setFilteredData(responsedata);
      setSearchBarData(responsedata);

      console.log(responsedata);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GetBom = async (parentid: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        parent_product: parentid,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/GetBom?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();

      setBomdata(responsedata);
      console.log(responsedata);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const RemoveBomDetail = async (id: any, item: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        id: id,
        data: item,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/WareHouse/RemoveBomDetail?${queryParams}`);

      if (!response.ok) {
        myAlert.err({ title: 'BOM_handleRemove', content: `API Status: ${response.status}` });

        return;
      }

      // 解析 API 響應
      const result = await response.json(); // 解析為 JSON 格式

      // 根據 API 回應處理結果
      if (result.success) {
        // 成功，顯示提示
        myAlert.success({ title: '成功', content: result.message });
        // setEdithandkey(!edithandkey);
        GetBom(parent_product); // 更新狀態或刷新數據
      } else {
        // 失敗，顯示錯誤提示
        myAlert.warning({ title: '失敗', content: '移除失敗' });
      }

      GetBom(parent_product);
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const UpdateBomDetail = async (item: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        data: item,
        username: userInfo?.employee?.id,
        id: item.id,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/UpdateBomDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        myAlert.err({ title: 'BOM_handleUpdate', content: `API Status: ${response.status}` });

        return;
      }

      // 解析 API 響應
      const result = await response.json(); // 解析為 JSON 格式

      // 根據 API 回應處理結果
      if (result.success) {
        // 成功，顯示提示
        myAlert.success({ title: '成功', content: result.message });
        // setEdithandkey(!edithandkey);
        GetBom(parent_product); // 更新狀態或刷新數據
      } else {
        // 失敗，顯示錯誤提示
        myAlert.warning({ title: '失敗', content: '更新失敗' });
      }

      GetBom(parent_product);

      setEditlist(false);
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region =============【方法入口】===============================================================================
  //#region  點擊物料
  const handleChoseProduct = (item: any) => {
    if (edithandkey) {
      console.log(item);
      setHandinputproductuuid(item.id);
      setHandinputproductid(item.productid);
      setHandinputname(item.name);
      setHandinputspec(item.spec);
      setHandinputmaterial(item.material);
      setHandinputsurface(item.surface);
      setHandinputunit(item.unit);
      // GetBom(item.id);
    } else {
      // alert(item.name);
      handleRowClick(item.id);
      setProductid(item.productid);
      setProductname(item.name);
      setProductspec(item.spec);
      setProductmaterial(item.material);
      setProductsurface(item.surface);
      setParent_product(item.id);
      GetBom(item.id);
    }
  };

  //#region 點擊物料focus
  //畫面上被點擊的選項背景顏色改變
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  //#endregion

  // 清除查詢條件
  const handleClear = () => {
    setKeyword2('');
    setKeyword3('');
    setKeyword4('');
  };

  //#endregion

  //#region 手key

  // 手key編輯狀態
  const [edithandkey, setEdithandkey] = useState<boolean>(false);

  const handleEditByHandKey = async () => {
    setEdithandkey(!edithandkey);
    setHandinputproductuuid('');
    setHandinputproductid('');
    setHandinputname('');
    setHandinputspec('');
    setHandinputmaterial('');
    setHandinputsurface('');
    setHandinputunit('');
    setHandinputnote('');
    setHandinputquantity('');
  };

  //手key加入
  const handleAddByHandKey = async () => {
    if (handinputproductid === '' || handinputname === '') {
      myAlert.warning({ title: '料號與名稱不可為空' });

      return;
    } else if (handinputquantity === '' || handinputquantity === undefined) {
      myAlert.warning({ title: '請確認數量是否正確' });

      return;
    }

    try {
      const data = {
        id: handinputproductuuid,
        parent_product: parent_product,
        productid: handinputproductid,
        quantity: handinputquantity,
        unit: handinputunit,
        spec: handinputspec,
        create_by: userInfo?.employee?.id,
        worksheet_number: handinputworksheetnumber,
        columnofspeconqpi: handinputcolumnofspeconqpi,
        spec_formula: handinputspecformula,
        fml_quantity: handinputfmlquantity,
        quantity_formula: handinputquantityformula,
        spec_str: handinputspecstr,
        spec_unit: handinputspecunit,
        enable: handinputenable,
        note: handinputnote,
      };

      const conditionModel = {
        data: data,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      // 發送數據到 API
      const response = await fetch(`${setting.apipath}/WareHouse/AddBomDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        myAlert.err({ title: 'BOM_handleAdd', content: `API Status: ${response.status}` });

        return;
      }

      // 解析 API 響應
      const result = await response.json(); // 解析為 JSON 格式

      // 根據 API 回應處理結果
      if (result.success) {
        // 成功，顯示提示
        myAlert.success({ title: '成功', content: result.message });
        // setEdithandkey(!edithandkey);
        GetBom(parent_product); // 更新狀態或刷新數據
      } else {
        // 失敗，顯示錯誤提示
        console.log(result.message);
        myAlert.warning({ title: '失敗', content: result.message });
      }

      setEdithandkey(false);
      console.log(result);
    } catch (error: any) {
      // 顯示錯誤信息
      myAlert.err({ title: 'FunctionError', content: error.message });
    }
  };

  //手key清除
  const handleClearHandKey = () => {
    setHandinputproductuuid('');
    setHandinputproductid('');
    setHandinputname('');
    setHandinputspec('');
    setHandinputmaterial('');
    setHandinputsurface('');
    setHandinputunit('');
    setHandinputnote('');
    setHandinputquantity('');
    // setShowSuggestions(false);
  };

  interface DataItem {
    id: string | null;
    productid: string | null;
    spec: string | null;
    name: string | null;
    unit: string | null;
  }

  const [filteredData2, setFilteredData2] = useState<any[]>([]);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const isSelectingRef2 = useRef(false);

  useEffect(() => {
    if (isSelectingRef2.current) {
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

      setFilteredData2(filtered);
      setShowSuggestions2(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));
    } else {
      setHandinputproductuuid('');
      setFilteredData2([]);
      setShowSuggestions2(false);
    }
  }, [handinputproductid, handinputname, handinputspec]);

  const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSelectingRef.current = false;
    setHandinputproductid(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSelectingRef.current = false;
    setHandinputname(e.target.value);
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSelectingRef.current = false;
    setHandinputspec(e.target.value);
  };

  const handleSelect = (item: DataItem) => {
    isSelectingRef.current = true;
    setHandinputproductuuid(item.id || '');
    setHandinputproductid(item.productid || '');
    setHandinputname(item.name || '');
    setHandinputspec(item.spec || '');
    setHandinputunit(item.unit || '');
    setShowSuggestions2(false);
  };

  // 手Key物料查詢
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

  // 組件清單編輯
  const [editlist, setEditlist] = useState<boolean>(false);
  const [editlistindex, setEditlistindex] = useState<number>(0);
  const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
  const quantityRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const worksheet_numberRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const spec_formulaRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const columnofspeconqpiRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const fml_quantityRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const quantity_formulaRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const spec_strRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const spec_unitRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
  const enableRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));

  // 組件編輯
  const handleEdit = async (index: any) => {
    if (editlist === true) {
      myAlert.warning({ title: '組件編輯中，請先結束編輯狀態' });

      return;
    }

    setOriginaleditlistdata(bomdata);
    setEditlist(!editlist);
    setEditlistindex(index);
  };

  // 組件取消編輯
  const handleCancel = async (index: any) => {
    setEditlist(!editlist);
    setBomdata(originaleditlistdata);
  };

  // 從組件清單移除
  const handleRemove = (index: number, item: any) => {
    myAlert.confirm({
      title: '確定要將組件移除嗎?',
      props: {
        onOk: () => {
          const updatedData = bomdata.filter((_, i) => i !== index);
          setBomdata(updatedData);
          RemoveBomDetail(item.id, item);
        },
      },
    });
  };

  // 更新組件清單
  const handleUpdate = (index: number, item: any) => {
    myAlert.confirm({
      title: '確定更新嗎?',
      props: {
        onOk: () => {
          UpdateBomDetail(item);
        },
      },
    });
  };

  //#endregion

  //#region 編輯Bomdetail
  // const [editbomdetail, setEditbomdetail] = useState<boolean>(false);
  //#endregion

  //#endregion

  //#region =============【方法邏輯】===============================================================================

  //#region 物料查詢
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const isSelectingRef = useRef(false);
  useEffect(() => {
    if (isSelectingRef.current) {
      return;
    }

    let filteredData = searchdata;

    if (keyword2) {
      filteredData = filteredData.filter((item) => item.productid.toString().includes(keyword2.trim()));
    }

    if (keyword3) {
      filteredData = filteredData.filter((item) => item.name.toString().includes(keyword3.trim()));
    }

    if (keyword4) {
      filteredData = filteredData.filter((item) => item.spec && item.spec.toString().includes(keyword4.trim()));
    }

    setFilteredData(filteredData);
    setCurrentPage(1); // 當篩選條件改變時，重置當前頁數
  }, [keyword2, keyword3, keyword4]);
  //#endregion

  //#region 頁籤切換判斷
  const [tabnow, setTabnow] = useState<string>('編輯');
  const [tabshow, setTabshow] = useState<string>('編輯');

  // 根據當前選中的 tab 設置按鈕的樣式
  const getButtonStyle = (tabName: string) => {
    return tabnow === tabName
      ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' }
      : {};
  };

  const tabChosed = (tabName: string) => {
    setTabnow(tabName);
    setTabshow(tabName);
    // setEditmain(false);
    // setProductnamein(originalproductnamein);
    // setProductidin(originalproductidin);
    // setProductspecin(originalproductspecin);
    // setMaterialin(originalmaterialin);
    // setUnitin(originalunitin);
    // setSurfacein(originalsurfacein);
  };
  //#endregion

  //#endregion

  //#region ===========【分頁處理】
  // 頁數相關狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // 每頁顯示的項目數

  // 計算當前頁顯示的資料
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredData.slice(startIndex, endIndex);
  }, [itemsPerPage, currentPage, filteredData]);

  // 分頁切換處理函數
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  //#endregion

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
      <PageHeader02
        tag={'BOM維護'}
        panelList={undefined}
        customeRight={[
          <div key="0">
            {/* <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
            {/* <button style={{ display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                                    <img src={icon_clear.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                </button> */}
            <input
              type="text"
              placeholder="請輸入料號"
              value={keyword2}
              style={{
                padding: '4px 5px',
                width: '350px',
                fontSize: '16px',
                borderBottom: '1px solid #c1c1c1',
                borderRight: '1px solid #f0eded',
              }}
              onChange={(e) => setKeyword2(e.target.value)}
            />
            <input
              type="text"
              placeholder="請輸入名稱"
              value={keyword3}
              style={{
                padding: '4px 5px',
                width: '350px',
                fontSize: '16px',
                borderBottom: '1px solid #c1c1c1',
                borderRight: '1px solid #f0eded',
              }}
              onChange={(e) => setKeyword3(e.target.value)}
            />
            <input
              type="text"
              placeholder="請輸入規格"
              value={keyword4}
              style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
              onChange={(e) => setKeyword4(e.target.value)}
            />
            <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
              <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
            </span>
          </div>,
        ]}
        customeLeft={[
          <div key="0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                            <p style={{ color: '#14256a', fontSize: '16px' }}>
                                符合總數：<span style={{ color: 'gray' }}>{filteredData.length}</span>
                            </p>
                        </div>
                        <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                            <p style={{ color: '#14256a', fontSize: '16px' }}>
                                物料總數：<span style={{ color: 'gray' }}>{searchdata.length}</span>
                            </p>
                        </div> */}
          </div>,
        ]}
      />

      <div className={scss.body} style={{ height: `${windowSize.height - 198}px` }}>
        <div className={scss.content}>
          <div
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              padding: '0px 20px',
            }}
          >
            <InputSel
              {...inputSelProps}
              caption="物料筆數"
              disabled={true}
              inputProps={{
                props: {
                  type: 'number',
                  value: filteredData.length,
                },
              }}
            />
            {/* <InputSel
                            {...inputSelProps}
                            caption="物料數量"
                            disabled={true}
                            inputProps={{
                                props: {
                                    type: "number",
                                    value: searchdata.length,
                                },
                            }}
                        /> */}
            <Thead01 type={'ProductList'} />
          </div>
          <div className={scss.body_content1} style={{ height: '300px', border: '1px solid #c1c1c1' }}>
            <span>
              {currentItems &&
                currentItems.map((_item: any, index: number) => {
                  return (
                    <CellWithBar key={index} className={scss.panelHeader21}>
                      <div
                        key={index}
                        className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                        onClick={() => {
                          handleChoseProduct(_item);
                        }}
                      >
                        <span>{index + 1}</span>
                        <span>{_item.productid}</span>
                        <span>{_item.name}</span>
                        <span>{_item.spec}</span>
                        <span>{_item.material}</span>
                        <span>{_item.surface}</span>
                        <span>{_item.count}</span>
                        <span>{_item.unit}</span>
                        <span>{getTaiwanDateStr(_item.update_at)}</span>
                        <span>{getTaiwanDateStr(_item.create_at)}</span>
                        <span></span>
                      </div>
                    </CellWithBar>
                  );
                })}
            </span>
          </div>
          <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
            {/* 分頁控制 */}
            <Pagination
              current={currentPage} // 當前頁碼
              total={filteredData.length} // 總數據量
              pageSize={itemsPerPage} // 每頁顯示的數量
              onChange={handlePageChange} // 處理頁面切換
              showSizeChanger // 顯示頁數選擇器
              pageSizeOptions={['5', '10', '20', '50', '100']} // 可選的每頁顯示數量
              onShowSizeChange={(current, size) => setItemsPerPage(size)} // 更新每頁顯示數量
            />
          </div>
          <div className={scss.body_foot1}>
            <div>
              <span>
                <button className={scss.minitabbtn} onClick={() => tabChosed('編輯')} style={getButtonStyle('編輯')}>
                  編輯
                </button>
              </span>
              <span>
                {/* <button
                                    className={scss.minitabbtn}
                                    onClick={() => tabChosed('新增')}
                                    style={getButtonStyle('新增')}
                                >
                                    樹狀
                                </button> */}
              </span>
            </div>
            <div></div>
            <div></div>
          </div>
          {/* <div className={scss.foot_head1}>
                        <div>
                            <span style={{ color: "#14256a", fontSize: '20px', fontWeight: 'bolder' }}>品項</span>
                        </div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div> */}
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
              品項
            </span>
          </div>
          <div className={scss.foot_head1}>
            <div>
              {/* {parent_product} */}
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  color: '#14256a',
                }}
              >
                料號
              </label>
              <InputSel
                {...inputSelProps}
                disabled={true}
                inputProps={{
                  props: {
                    value: productid || ' ',
                  },
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  color: '#14256a',
                }}
              >
                名稱
              </label>
              <InputSel
                {...inputSelProps}
                disabled={true}
                inputProps={{
                  props: {
                    value: productname || ' ',
                  },
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  color: '#14256a',
                }}
              >
                規格
              </label>
              <InputSel
                {...inputSelProps}
                disabled={true}
                inputProps={{
                  props: {
                    value: productspec || ' ',
                  },
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  color: '#14256a',
                }}
              >
                材質
              </label>
              <InputSel
                {...inputSelProps}
                disabled={true}
                inputProps={{
                  props: {
                    value: productmaterial || ' ',
                  },
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  color: '#14256a',
                }}
              >
                表面
              </label>
              <InputSel
                {...inputSelProps}
                disabled={true}
                inputProps={{
                  props: {
                    value: productsurface || ' ',
                  },
                }}
              />
            </div>
          </div>
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
              組件
            </span>
          </div>
          <div
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'white',
              zIndex: 1000,
              padding: '0px 20px',
            }}
          >
            <InputSel
              {...inputSelProps}
              caption="組件數量"
              disabled={true}
              inputProps={{
                props: {
                  type: 'number',
                  value: bomdata.length,
                },
              }}
            />
          </div>
          <div>
            <div className={scss.body_content1} style={{ border: '1px solid #c1c1c1', overflowX: 'auto' }}>
              <Thead01 type={'BomList'} />
              {bomdata &&
                bomdata.map((_item: any, index: number) => (
                  <CellWithBar key={index} className={scss.panelHeader11}>
                    <div className={scss.row01}>
                      <span>
                        <button
                          onClick={() => {
                            handleRemove(index, _item);
                          }}
                          style={{ display: `${index === editlistindex && editlist === true ? 'none' : ''}` }}
                        >
                          <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(index);
                          }}
                        >
                          <img
                            src={icon_edit.src}
                            alt="cancel"
                            style={{
                              display: `${index === editlistindex && editlist === true ? 'none' : ''}`,
                              width: '30px',
                              height: '20px',
                            }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            handleUpdate(index, _item);
                          }}
                          style={{ display: `${index === editlistindex && editlist === true ? '' : 'none'}` }}
                        >
                          <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                        </button>
                        <button
                          onClick={() => {
                            handleCancel(index);
                          }}
                          style={{ display: `${index === editlistindex && editlist === true ? '' : 'none'}` }}
                        >
                          <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                        </button>
                      </span>
                      <span>{index + 1}</span>
                      <span>{_item.product_id}</span>
                      <span>{_item.name}</span>
                      <span>{_item.spec}</span>
                      <span>{_item.material}</span>
                      <span>{_item.surface}</span>
                      <span>
                        <input
                          ref={quantityRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                          type="text"
                          value={_item.quantity !== undefined ? _item.quantity.toLocaleString() : 0}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newQuantity = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              quantity: newQuantity,
                              totalprice: (parseFloat(newQuantity || '0') * newData[index].unitprice || 0)
                                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                .toString(),
                            };
                            setBomdata(newData);
                            // handleChange(index, "quantity", e.target.value);
                          }}
                        />
                      </span>
                      <span>{_item.unit}</span>
                      <span>{getTaiwanDateStr(_item.update_at)}</span>
                      <span>{_item.update_by}</span>
                      <span>
                        {/* 確保 _item.enable 以布林值呈現 */}
                        <input
                          ref={enableRefs.current[index]}
                          type="checkbox"
                          checked={_item.enable === true || _item.enable === 'true'} // 確保只在 true 或 "true" 時勾選
                          disabled={!(index === editlistindex && editlist === true)} // 只有在編輯模式下可修改
                          onChange={(e) => {
                            const newEnableValue = e.target.checked; // checkbox 的 true/false 值
                            setBomdata((prevData) => {
                              const newData = [...prevData];
                              newData[index] = {
                                ...newData[index],
                                enable: newEnableValue, // 確保 enable 是布林值
                              };

                              return newData;
                            });
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            width: '20px', // checkbox 不需要太寬，可調整
                            height: '20px',
                          }}
                        />
                      </span>

                      <span>
                        <input
                          ref={worksheet_numberRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                          type="text"
                          value={_item.worksheet_number !== undefined ? _item.worksheet_number : ''}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newWorksheet_number = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              worksheet_number: newWorksheet_number,
                            };
                            setBomdata(newData);
                            // handleChange(index, "quantity", e.target.value);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={columnofspeconqpiRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                          type="text"
                          value={_item.columnofspeconqpi !== undefined ? _item.columnofspeconqpi : ''}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newColumnofspeconqpi = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              columnofspeconqpi: newColumnofspeconqpi,
                            };
                            setBomdata(newData);
                            // handleChange(index, "quantity", e.target.value);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={spec_formulaRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                          type="text"
                          value={_item.spec_formula !== undefined ? _item.spec_formula : ''}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newSpec_formula = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              spec_formula: newSpec_formula,
                            };
                            setBomdata(newData);
                            // handleChange(index, "quantity", e.target.value);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={spec_strRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          type="text"
                          value={_item.spec_str !== undefined ? _item.spec_str : 1}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newSpec_str = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              spec_str: newSpec_str,
                            };
                            setBomdata(newData);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={spec_unitRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          type="text"
                          value={_item.spec_unit !== undefined ? _item.spec_unit : 1}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newSpec_unit = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              spec_unit: newSpec_unit,
                            };
                            setBomdata(newData);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={fml_quantityRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          type="text"
                          value={_item.fml_quantity !== undefined ? _item.fml_quantity : 1}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newFml_quantity = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              fml_quantity: newFml_quantity,
                            };
                            setBomdata(newData);
                          }}
                        />
                      </span>
                      <span>
                        <input
                          ref={quantity_formulaRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: index === editlistindex && editlist === true ? '1px solid black' : '',
                            width: '100%',
                          }}
                          type="text"
                          value={_item.quantity_formula !== undefined ? _item.quantity_formula : 1}
                          readOnly={!(index === editlistindex && editlist === true)}
                          onChange={(e) => {
                            const newData = [...bomdata];
                            const newQuantity_formula = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              quantity_formula: newQuantity_formula,
                            };
                            setBomdata(newData);
                          }}
                        />
                      </span>

                      <span></span>
                    </div>
                  </CellWithBar>
                ))}

              <div className={scss.addbar}>
                <div>
                  <button
                    onClick={() => {
                      handleEditByHandKey();
                    }}
                    style={{ display: `${edithandkey ? 'none' : ''}` }}
                  >
                    <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                  </button>
                  <button
                    onClick={() => {
                      handleAddByHandKey();
                    }}
                    style={{ display: `${edithandkey ? '' : 'none'}` }}
                  >
                    <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      handleEditByHandKey();
                    }}
                    style={{ display: `${edithandkey ? '' : 'none'}` }}
                  >
                    <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                  </button>
                </div>
                <div></div>
                <div>
                  <input
                    type="text"
                    placeholder="請輸入料號"
                    readOnly
                    value={handinputproductid}
                    onChange={handleProductidChange}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="請輸入品項名稱"
                    readOnly
                    value={handinputname}
                    onChange={handleNameChange}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="請輸入品項規格"
                    readOnly
                    value={handinputspec}
                    onChange={handleSpecChange}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                    type="text"
                    placeholder="材質"
                    readOnly
                    value={handinputmaterial}
                    onChange={(e) => {
                      setHandinputmaterial(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="表面"
                    readOnly
                    value={handinputsurface}
                    onChange={(e) => setHandinputsurface(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="數量"
                    value={handinputquantity}
                    onChange={(e) => setHandinputquantity(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="單位"
                    readOnly
                    value={handinputunit}
                    onChange={(e) => setHandinputunit(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder=" "
                    readOnly
                    value=""
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder=" "
                    readOnly
                    value=""
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={handinputenable} // 控制勾選狀態
                    disabled={!edithandkey} // 只有 edithandkey 為 true 時可編輯
                    onChange={(e) => setHandinputenable(e.target.checked)} // 更新狀態
                    style={{
                      display: `${edithandkey ? '' : 'none'}`,
                      backgroundColor: 'transparent',
                      width: '20px', // ch
                      height: '20px',
                    }} // 保留顯示/隱藏邏輯
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="工作表代號"
                    value={handinputworksheetnumber}
                    onChange={(e) => setHandinputworksheetnumber(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="規格來源"
                    value={handinputcolumnofspeconqpi}
                    onChange={(e) => setHandinputcolumnofspeconqpi(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="規格公式"
                    value={handinputspecformula}
                    onChange={(e) => setHandinputspecformula(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="規格內容"
                    value={handinputspecstr}
                    onChange={(e) => setHandinputspecstr(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="規格單位"
                    value={handinputspecunit}
                    onChange={(e) => setHandinputspecunit(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="數量來源"
                    value={handinputfmlquantity}
                    onChange={(e) => setHandinputfmlquantity(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="數量公式"
                    value={handinputquantityformula}
                    onChange={(e) => setHandinputquantityformula(e.target.value)}
                    style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                  />
                </div>
              </div>
            </div>
            <div className={scss.body_foot1}>
              <div>
                {/* {filteredData2.length > 0 && (
                                    <ul ref={dropdownRef}
                                        style={{
                                            border: '1px solid #c1c1c1',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            marginTop: '0px',
                                            left: '20px',
                                            position: 'absolute',
                                            width: '1000px',
                                            backgroundColor: 'white',
                                            zIndex: 1004,
                                            display: `${showSuggestions2 ? '' : 'none'}`
                                        }}>
                                        {filteredData2.map(item => (
                                            <li
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                style={{
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    border: '1px solid #c1c1c1',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <span style={{ flex: '1 1 20%' }}>
                                                    {item.productid}
                                                </span>
                                                <span style={{ flex: '1 1 47%' }}>
                                                    {item.name}
                                                </span>
                                                <span style={{ flex: '1 1 30%' }}>
                                                    {item.spec}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )} */}
              </div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}
