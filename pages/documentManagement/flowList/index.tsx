import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import _, { reverse, update } from 'lodash';

import scss from './flowList.module.scss';
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
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
// 圖示
import icon_edit from 'public/image/icon/fc_edit.svg?url';
import icon_save from 'public/image/icon/fc_save.svg?url';
import icon_cancel from 'public/image/icon/fc_cancel.svg?url';
import icon_delete from 'public/image/icon/fc_delete.svg?url';
import icon_autoadd from 'public/image/icon/fc_add.svg?url';
import icon_search from 'public/image/icon/fc_search.svg?url';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg?url';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg?url';
import icon_print from 'public/image/icon/fc_printer.svg?url';
import icon_export from 'public/image/icon/fc_export.svg?url';
import icon_clear from 'public/image/icon/fc_clear.svg?url';
import icon_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_task_approved from 'public/image/icon/fc_approved.svg?url';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg?url';
import { Modal } from 'antd';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg?url';
import icon_fc_add from 'public/image/icon/fc_add.svg?url';
import icon_save_gray from 'public/image/icon/fc_save_gray.svg?url';
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg?url';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg?url';
import icon_add from 'public/image/icon/fc_add2.svg?url';

export default function FlowList() {
  //路由參數
  const router = useRouter();
  const { firstin } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [leftbaropen, setLeftbaropen] = useState<boolean>(true);

  //登入者資料
  const { userInfo } = useContext(AppContext);
  //資料列宣告
  const [data, setData] = useState<any[]>([]);
  // const [data2, setData2] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data3, setData3] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [searchdata, setSearchdata] = useState<any[]>([]);
  const [employeedata, setEmployeedata] = useState<any[]>([]);
  const [employeetitledata, setEmployeetitledata] = useState<any[]>([]);

  const [flowname, setFlowname] = useState<string>('');
  const [create_atin, setCreate_atin] = useState<string>('');

  //搜尋
  const [keyword1, setKeyword1] = useState<string>('');
  const [keyword2, setKeyword2] = useState<string>('');
  const [keyword3, setKeyword3] = useState<string>('');
  const [keyword4, setKeyword4] = useState<string>('');

  // 預設截止日期為今天，起始日期為今天往前推30天
  const defaultEndDate = dayjs();
  const defaultStartDate = dayjs().subtract(30, 'days');

  // 使用 Moment 類型作為狀態
  const [keywordstartdate, setKeywordstartdate] = useState<Dayjs | null>(defaultStartDate);
  const [keywordenddate, setKeywordenddate] = useState<Dayjs | null>(defaultEndDate);

  const [editstatus, setEditStatus] = useState<boolean>(true);
  // const [editrowid, setEditRowId] = useState<number>(0);
  // const [editmain, setEditmain] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  const [itemQuery, setItemQuery] = useState<any>({});

  const stage_user_titleRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));

  const [currentindex, setCurrentIndex] = useState<number>(0);

  // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
  const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);
  useEffect(() => {
    if (firstin !== undefined) {
      setCheckFirstIn(parseInt(firstin as string) || 0);
    }
  }, [firstin]);

  //#region 上方功能列

  //新增按鈕
  const panelList: TpanelList = [
    // { searchGroup },
    // {
    //     type: 'addButton',
    //     label: '新增採購單',
    //     onClick: () => {
    //         router.push({
    //             pathname: `/factoryDepartment/addPurchaseOrder`,
    //             query: {
    //                 type: 'Tray',
    //             },
    //         });
    //     },
    // },
  ];
  //#endregion

  //#region call api
  //取流程主檔
  const GetFlow = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        // username: userInfo?.employee?.chName.toString()
        username: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetFlow?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setData(data);
      console.log(data);

      console.log(userInfo);

      // 檢查 data 是否有內容
      if (data.length > 0) {
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

  const GetEmployeeTitle = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {};

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

      const response = await fetch(`${setting.apipath}/Review/GetEmployeeTitle?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();

      console.log(responsedata);

      // const seenIds = new Set<number>();

      // // 過濾掉 `id` 重複的項目
      // const uniqueData = responsedata.filter((item: any) => {
      //     // 如果 `id` 沒有在 Set 中出現過，則加入 Set 和返回 true
      //     if (!seenIds.has(item.id)) {
      //         seenIds.add(item.id);
      //         return true;
      //     }
      //     // 否則返回 false 以過濾掉重複項目
      //     return false;
      // });

      // // 設置去重後的數據
      // setEmployeedata(uniqueData);
      setEmployeedata(responsedata);
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
      GetFlow();
      GetEmployeeTitle();
      setCreate_atin(dayjs().format('YYYY-MM-DD') || '');
      hasFetchedData.current = true;
    }
  }, []);

  const filterData = () => {
    const startDate = keywordstartdate;
    const endDate = keywordenddate;
    const requisitionId = keyword2.trim();
    const name = keyword3.trim();
    const spec = keyword4.trim();

    // 檢查是否所有條件都為空
    if (
      // (!startDate || !startDate.isValid()) &&
      // (!endDate || !endDate.isValid()) &&
      !requisitionId &&
      !name &&
      !spec
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

    if (spec) {
      filteredData = filteredData.filter((item) => item.spec && item.spec.toString().includes(spec));
    }

    // setSearchdata(filteredData);
    setFilteredData(filteredData);
  };

  // const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const isSelectingRef = useRef(false);
  // const isSelectingRef = useRef<boolean>(false);

  // 監聽條件變更
  useEffect(() => {
    // filterData();
    if (isSelectingRef.current) {
      return;
    }

    let filteredData = searchdata;

    if (keyword2) {
      filteredData = filteredData.filter((item) => item.productid.toString().includes(keyword2.trim()));
    }

    if (keyword3) {
      filteredData = searchdata.filter((item) => item.name.toString().includes(keyword3.trim()));
    }

    if (keyword4) {
      filteredData = searchdata.filter((item) => item.spec && item.spec.toString().includes(keyword4.trim()));
    }

    setFilteredData(filteredData);
  }, [keyword2, keyword3, keyword4]);

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

  const [items, setItems] = useState(data2);
  const [newReviewType, setNewReviewType] = useState('審查');
  const [newUserName, setNewUserName] = useState('');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddToData2 = () => {
    if (newUserName === '' && newUserTitle === '') {
      myAlert.warning({ title: '職稱、姓名不可為空' });

      return;
    }

    console.log(data2);
    const newStage = {
      stage_order: items.length + 1,
      review_type: newReviewType,
      stage_user_uuid: newUserId,
      stage_user_name: newUserName,
      stage_user_title: newUserTitle, // 根據需求這裡可以變更
    };

    const updatedItems = [...items, newStage];
    setItems(updatedItems);
    setData2(updatedItems);
    setNewUserName('');
    setNewUserTitle('');
  };

  const handleAddToData3 = () => {
    // if (newUserName === "" && newUserTitle === "") {
    //     myAlert.warning({ title: '職稱、姓名不可為空' });
    //     return;
    // }
    console.log(data2);
    const newStage = {
      stage_order: items.length + 1,
      review_type: newReviewType,
      stage_user_uuid: newUserId,
      stage_user_name: newUserName,
      stage_user_title: newUserTitle, // 根據需求這裡可以變更
    };

    const updatedItems = [...items, newStage];
    setItems(updatedItems);
    setData2(updatedItems);
    setNewUserName('');
    setNewUserTitle('');
  };

  const handleRemoveFromData2 = (indexToRemove: number) => {
    const updatedItems = items.filter((_, index) => index !== indexToRemove);

    // 更新 stage_order 以保持順序
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      stage_order: index + 1,
    }));

    setItems(reorderedItems);
    setData2(reorderedItems);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();

    if (draggedIndex === null) {
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];

    // 移除被拖動的元素
    newItems.splice(draggedIndex, 1);
    // 將被拖動的元素插入到新位置
    newItems.splice(index, 0, draggedItem);

    // 更新 `stage_order` 的值
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      stage_order: idx + 1, // 根據新順序重新設定 stage_order
    }));

    setDraggedIndex(index);
    setItems(updatedItems);
    setData2(updatedItems);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = () => {
    setDraggedIndex(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, review_type: e.target.value }; // 更新選中的 review_type
      }

      return item;
    });

    setItems(updatedItems);
    setData2(updatedItems);
  };

  const handleAddflow = () => {
    setStatus('未儲存');

    // 檢查是否已有資料，如果有，將新的資料追加至現有資料中
    setItems((prevData2) => [
      ...prevData2,
      {
        stage_order: prevData2.length + 1, // 新增的資料順序號
        review_type: '提出',
        stage_user_uuid: userInfo?.employee?.id,
        stage_user_name: userInfo?.employee?.chName.toString(),
        stage_user_title: '經辦',
      },
    ]);
    console.log(userInfo);
  };

  const handleCanceladdflow = () => {
    setStatus('');
    setItems([]);
    setFlowname('');
  };

  // const [employeedata, setEmployeedata] = useState<any[]>([]);
  const [employeefilteredData, setEmployeeFilteredData] = useState<any[]>([]);
  const [showempSuggestions, setShowEmpSuggestions] = useState(false);

  // const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    if (isSelectingRef.current) {
      return;
    }

    const nameFilter = newUserName?.trim().toLowerCase();
    const titleFilter = newUserTitle?.trim().toLowerCase();

    if (nameFilter !== '' || titleFilter !== '') {
      const filtered = employeedata.filter((item) => {
        const matchesName = item.ch_name?.toLowerCase().includes(nameFilter);
        const matchesTitle = item.title?.toLowerCase().includes(titleFilter);

        return matchesName && matchesTitle;
      });

      setEmployeeFilteredData(filtered);
      setShowEmpSuggestions(filtered.length > 0);
    } else {
      setEmployeeFilteredData([]);
      setShowEmpSuggestions(false);
    }
  }, [newUserName, newUserTitle]);

  const handleNewUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSelectingRef.current = false;
    setNewUserName(e.target.value);
  };

  const handleNewUserTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSelectingRef.current = false;
    setNewUserTitle(e.target.value);
  };

  const handleNewUserNameclick = (emp: any) => {
    isSelectingRef.current = true;
    setNewUserName(emp.ch_name);
    setNewUserTitle(emp.title);
    setNewUserId(emp.id);
    setShowEmpSuggestions(false); // 隱藏建議列表
  };

  const handleClearNewUserName = () => {
    setNewUserName('');
    setNewUserTitle('');
  };

  const handleSaveFlow = async () => {
    if (flowname === '' || flowname === undefined) {
      myAlert.warning({ title: '流程名稱不可為空' });

      return;
    }

    console.log(items);
    console.log(data2);

    // return;
    try {
      setIsLoading(true);
      const conditionModel = {
        // username: userInfo?.employee?.chName.toString(),
        username: userInfo?.employee?.id.toString(),
        name: flowname,
        stage_counter: data2.length,
        data2: data2,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(JSON.stringify(conditionModel));

      const response = await fetch(`${setting.apipath}/Review/AddFlowById`, {
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
        setItems([]);
        setFlowname('');
        GetFlow();
        setStatus('');
      } else {
        // 失敗，顯示錯誤提示
        console.log(result.message);
        myAlert.warning({ title: '失敗', content: result.message });
      }
    } catch (error: any) {
      // setError(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFlow = async (item: any) => {
    myAlert.confirm({
      title: '確定移除?',
      props: {
        onOk: async () => {
          try {
            setIsLoading(true);
            const conditionModel = {
              user_id: userInfo?.employee?.id,
              review_id: item.id,
            };

            const inputModel = {
              TypeName: 'ERP',
              ServiceName: 'WareHouseService',
              FunctionName: 'no',
              FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/Review/RemoveFlowById`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            // const responsedata = await response.json();

            GetFlow();
            // alert("OK");
          } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
          } finally {
            setIsLoading(false);
          }
        },
      },
    });
  };

  const handleStringChange = (index: number, key: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setItems(updatedItems);

    if (key === 'stage_user_title' || key === 'stage_user_name') {
      const filters = {
        stage_user_title: updatedItems[index].stage_user_title?.trim() || '',
        stage_user_name: updatedItems[index].stage_user_name?.trim() || '',
      };

      if (filters.stage_user_title || filters.stage_user_name) {
        const matchedEmployees = employeedata.filter(
          (emp) =>
            (!filters.stage_user_title || (emp.title && emp.title.includes(filters.stage_user_title))) &&
            (!filters.stage_user_name || (emp.ch_name && emp.ch_name.includes(filters.stage_user_name)))
        );

        setEmployeeFilteredData(matchedEmployees);
        setShowEmpSuggestions(true);
      } else {
        setShowEmpSuggestions(false);
      }
    }
  };

  const handleNewUserNameClick = (emp: any) => {
    const updatedItems = [...items];
    updatedItems[currentindex] = {
      ...updatedItems[currentindex],
      stage_user_name: emp.ch_name,
      stage_user_title: emp.title,
      stage_user_uuid: emp.id,
      review_type: currentindex === 0 ? '提出' : currentindex === updatedItems.length - 1 ? '核准' : '審查',
    };

    setItems(updatedItems);
    setData2(updatedItems);

    // 清除建議列表
    setEmployeeFilteredData([]);
    setShowEmpSuggestions(false);
  };

  useEffect(() => {
    const hasInconsistentReviewType = items.some((item, index) => {
      const expectedType = index === 0 ? '提出' : index === items.length - 1 ? '核准' : '審查';

      return item.review_type !== expectedType;
    });

    if (hasInconsistentReviewType) {
      const updatedItems = items.map((item, index) => ({
        ...item,
        review_type: index === 0 ? '提出' : index === items.length - 1 ? '核准' : '審查',
      }));

      setItems(updatedItems);
      setData2(updatedItems);
    }
  }, [items]);

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      <PageHeader02
        tag={'自訂審核'}
        panelList={panelList}
        customeLeft={[<>{/* {status} */}</>]}
        customeRight={[
          <>
            <button
              className={scss.shortsquarebtn}
              onClick={status !== '未儲存' ? () => handleAddflow() : undefined}
              title="新增流程"
              style={{ display: `${status === '' ? '' : 'none'}` }}
            >
              新增
            </button>
            <button
              className={scss.shortredsquarebtn}
              onClick={() => {
                handleSaveFlow();
              }}
              title="儲存流程"
              style={{ display: `${status === '' ? 'none' : ''}` }}
            >
              儲存
            </button>
            <button
              className={scss.shortsquarebtn}
              onClick={() => {
                handleCanceladdflow();
              }}
              title="取消新增"
              style={{ display: `${status === '' ? 'none' : ''}` }}
            >
              取消
            </button>
          </>,
        ]}
      />
      <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
        <div className={scss.right}>
          <div className={scss.content}>
            {/* <div className={scss.head_head1}>
                            <div>
                                <button
                                    className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn}
                                    onClick={status !== '未儲存' ? () => handleAddflow() : undefined}
                                    title="新增流程"
                                    disabled={status === '未儲存'} // 確保在未儲存狀態下按鈕無法互動
                                >
                                    <img
                                        src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src}
                                        alt="add"
                                        style={{ height: '20px', width: '20px' }}
                                    />
                                    新增
                                </button>

                                &nbsp;
                                <button
                                    className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleSaveFlow() }}
                                    title="儲存流程"
                                    disabled={status !== '未儲存'
                                    }
                                >
                                    <img
                                        src={status === '未儲存' ? icon_save.src : icon_save_gray.src}
                                        alt="search"
                                        style={{ height: '20px', width: '20px' }}
                                    />
                                    儲存
                                </button>
                                &nbsp;
                                <button
                                    className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleCanceladdflow() }}
                                    title="取消新增"
                                    disabled={status !== '未儲存'}
                                >
                                    <img src={status === '未儲存' ? icon_cancel.src : icon_cancel_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>

                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div> */}
            <div className={scss.head_body}>
              <div>
                <div className={scss.head_content1} style={{ fontSize: '16px' }}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div>
                <div></div>
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
                流程清單
              </span>
            </div>
            <div className={scss.head_content1}>
              <InputSel
                {...inputSelProps}
                caption="流程數量"
                disabled={true}
                inputProps={{
                  props: {
                    type: 'number',
                    // style: { color: 'red' },
                    value: data.length,
                  },
                }}
              />
            </div>
            <div className={scss.body_content1} style={{ overflowX: 'auto', border: '1px solid rgb(168, 168, 168)' }}>
              <Thead01 type={'FlowList'} />
              <span>
                {data &&
                  data.slice(0, 100).map((_item: any, index: number) => (
                    <CellWithBar key={index} className={scss.panelHeader21}>
                      <div
                        key={index}
                        className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                        onClick={() => {}}
                      >
                        <span>
                          <button onClick={() => handleRemoveFlow(_item)}>
                            <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                          </button>
                        </span>
                        <span>{index + 1}</span>
                        <span>{_item.name}</span>
                        <span>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {_item.stages.map((_stage: any, stageIndex: number) => (
                              <div key={_stage.stage_order} style={{ display: 'inline-block', width: '200px' }}>
                                {/* 如果是第一筆則不顯示箭頭 */}
                                {stageIndex !== 0 && (
                                  <img
                                    src={icon_arrow_right.src}
                                    alt="arrow"
                                    style={{ height: '20px', width: '20px' }}
                                  />
                                )}
                                <span
                                  style={{
                                    padding: '3px 9px',
                                    backgroundColor: '#1061c4',
                                    color: 'white',
                                    borderRadius: '6px',
                                  }}
                                >
                                  {_stage.review_type}
                                </span>
                                <span>{_stage.stage_user_name}</span>
                              </div>
                            ))}
                          </div>
                        </span>
                      </div>
                    </CellWithBar>
                  ))}
              </span>
              {/* <span style={{ paddingLeft: '22px', position: 'relative' }}>
                                <button onClick={() => { handleAddflow() }} style={{ fontSize: '18px' }}>
                                    <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                                    新增流程
                                </button>
                            </span> */}
            </div>

            <div style={{ paddingTop: '18px', paddingBottom: '18px' }}>
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
                新增流程
              </span>
            </div>

            <div style={{ display: `${status != '' ? '' : 'none'}` }}>
              <div className={scss.head_body}>
                <div>
                  <div className={scss.foot_head1}>
                    <div>
                      {/* <span style={{ color: "#14256a", fontSize: '20px', fontWeight: 'bolder' }}>自訂流程</span> */}
                    </div>
                    <div></div>
                    <div></div>
                  </div>
                  <div className={scss.foot_head2} style={{ paddingBottom: '18px' }}>
                    <div>
                      <InputSel
                        {...inputSelProps}
                        caption="流程名稱"
                        className="global_tip_must"
                        captionStyle={{ fontSize: '18px' }}
                        // wrapperStyle={{ paddingBottom: '10px' }}
                        disabled={status != '' ? false : true}
                        inputProps={{
                          props: {
                            value: flowname || ' ',
                            onChange: (e) => {
                              setFlowname(e.target.value);
                            },
                          },
                        }}
                      />
                    </div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div>
                  {/* <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                    <InputSel
                                    {...inputSelProps}
                                    caption="流程狀態"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            style: { color: 'red' },
                                            value: status || ' ',
                                            },
                                            }}
                                            />
                                            <InputSel
                                            {...inputSelProps}
                                            caption="關卡數"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    style: { color: 'red' },
                                                    value: items.length,
                                                    },
                                                    }}
                                                    />
                                                    </div> */}
                </div>
              </div>

              <div className={scss.head_content1}>
                <InputSel
                  {...inputSelProps}
                  caption="關卡數量"
                  disabled={true}
                  inputProps={{
                    props: {
                      type: 'number',
                      // style: { color: 'red' },
                      value: items.length,
                    },
                  }}
                />
              </div>
              <div className={scss.foot_content1} style={{ overflowX: 'auto', border: '1px solid rgb(168, 168, 168)' }}>
                <Thead01 type={'FlowDetailList'} />
                <span>
                  {items &&
                    items.slice(0, 100).map((_item, index) => (
                      <CellWithBar key={index} className={scss.panelHeader22}>
                        <div
                          key={index}
                          className={`${scss.row01}`}
                          draggable="true"
                          onDragStart={(event) => handleDragStart(event, index)}
                          onDragEnter={(event) => handleDragEnter(event, index)}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <span>
                            {/* <button onClick={() => handleRemoveFromData2(index)}>移除</button> */}
                            <img
                              src={icon_delete.src}
                              alt="cancel"
                              style={{ width: '30px', height: '20px' }}
                              onClick={() => handleRemoveFromData2(index)}
                            />
                          </span>
                          <span>{index + 1}</span>
                          <span>
                            <select
                              value={
                                index === 0 // 第一筆
                                  ? '提出'
                                  : index === items.length - 1 // 最後一筆
                                  ? '核准'
                                  : _item.review_type // 預設值或已選中的值
                              }
                              onChange={(e) => handleSelectChange(e, index)}
                              style={{ fontSize: '18px', backgroundColor: 'transparent' }}
                            >
                              <option value="提出">提出</option>
                              <option value="審查">審查</option>
                              <option value="核准">核准</option>
                            </select>
                          </span>
                          <span>
                            {/* {_item.stage_user_title} */}
                            <input
                              style={{
                                backgroundColor: 'transparent',
                                borderBottom: _item.stage_user_title !== '經辦' ? '1px solid black' : '',
                                width: '95%',
                              }}
                              type="text"
                              readOnly={_item.stage_user_title === '經辦'}
                              value={_item.stage_user_title || ''}
                              onChange={(e) => {
                                handleStringChange(index, 'stage_user_title', e.target.value);
                                setCurrentIndex(index);
                              }}
                            />
                          </span>
                          <span>
                            {/* {_item.stage_user_name} */}
                            <input
                              ref={stage_user_titleRefs.current[index]}
                              // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                              style={{
                                backgroundColor: 'transparent',
                                borderBottom: _item.stage_user_title !== '經辦' ? '1px solid black' : '',
                                width: '95%',
                              }}
                              type="text"
                              readOnly={_item.stage_user_title === '經辦' ? true : false}
                              value={_item.stage_user_name !== undefined ? _item.stage_user_name : ''}
                              onChange={(e) => {
                                handleStringChange(index, 'stage_user_name', e.target.value);
                                setCurrentIndex(index);
                              }}
                            />
                          </span>
                          {/* <span>{_item.stage_user_title}</span> */}
                        </div>
                      </CellWithBar>
                    ))}
                </span>
                <span style={{ paddingLeft: '22px', position: 'relative', height: '40px', paddingTop: '5px' }}>
                  <button
                    onClick={() => {
                      handleAddToData3();
                    }}
                    style={{ fontSize: '18px' }}
                  >
                    <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                    新增關卡
                  </button>
                </span>
              </div>
              <div style={{ padding: '0 20px', height: '300px' }}>
                {employeefilteredData.length > 0 && (
                  <ul
                    style={{
                      border: '1px solid #c1c1c1',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginTop: '0px',
                      left: '20px',
                      // position: 'absolute',
                      width: '1000px',
                      backgroundColor: 'white',
                      zIndex: 1004,
                      display: `${showempSuggestions ? '' : 'none'}`,
                    }}
                  >
                    {employeefilteredData.map((emp) => (
                      <li
                        key={emp.id}
                        onClick={() => handleNewUserNameClick(emp)}
                        style={{
                          fontSize: '18px',
                          cursor: 'pointer',
                          padding: '8px',
                          border: '1px solid #c1c1c1',
                          display: 'flex', // 使用 flexbox
                          justifyContent: 'space-between', // 在項目之間創建間距
                          alignItems: 'center', // 垂直置中
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{ width: '155px' }}>{emp.title}</span>
                          <span style={{ width: '100px' }}>{emp.ch_name}</span>
                          <span style={{ width: '120px' }}>{emp.department}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
}
