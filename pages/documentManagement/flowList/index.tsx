import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
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
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import icon_save_gray from 'public/image/icon/fc_save_gray.svg';
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';

export default function FlowList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
    } = router.query;


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



    const [flowname, setFlowname] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");

    // 預設截止日期為今天，起始日期為今天往前推30天
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    // 使用 Moment 類型作為狀態
    const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);

    const [editstatus, setEditStatus] = useState<boolean>(true);
    // const [editrowid, setEditRowId] = useState<number>(0);
    // const [editmain, setEditmain] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");

    const [itemQuery, setItemQuery] = useState<any>({});



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
                username: userInfo?.username
            };

            var inputModel = {
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
            const conditionModel = {
            };

            var inputModel = {
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
            setCreate_atin(moment().format('YYYY-MM-DD') || '');
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
            !spec) {
            setSearchdata(data);
            return;
        }

        let filteredData = searchdata;
        // 模糊查詢請購單號
        if (requisitionId) {
            filteredData = searchdata.filter(item =>
                item.productid.toString().includes(requisitionId)
            );
        }

        // 模糊查詢單據狀態
        if (name) {
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(name)
            );
        }
        if (spec) {
            filteredData = filteredData.filter(item =>
                item.spec && item.spec.toString().includes(spec)
            );
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
        if (isSelectingRef.current) return;
        let filteredData = searchdata;

        if (keyword2) {
            filteredData = filteredData.filter(item =>
                item.productid.toString().includes(keyword2.trim())
            );
        }

        if (keyword3) {
            filteredData = searchdata.filter(item =>
                item.name.toString().includes(keyword3.trim())
            );
        }

        if (keyword4) {
            filteredData = searchdata.filter(item =>
                item.spec && item.spec.toString().includes(keyword4.trim())
            );
        }


        setFilteredData(filteredData);
    }, [keyword2, keyword3, keyword4]);







    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');
        // setSearchdata(data);
    }

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
        if (newUserName === "" && newUserTitle === "") {
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
        setNewUserName("");
        setNewUserTitle("");
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
        if (draggedIndex === null) return;

        const newItems = [...items];
        const draggedItem = newItems[draggedIndex];

        // 移除被拖動的元素
        newItems.splice(draggedIndex, 1);
        // 將被拖動的元素插入到新位置
        newItems.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setItems(newItems);
        setData2(newItems);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = () => {
        setDraggedIndex(null);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newItems = [...items];
        newItems[index].review_type = event.target.value;
        setItems(newItems);
        setData2(newItems);

    };



    const handleAddflow = () => {
        setStatus("未儲存");

        // 檢查是否已有資料，如果有，將新的資料追加至現有資料中
        setItems(prevData2 => [
            ...prevData2,
            {
                stage_order: prevData2.length + 1, // 新增的資料順序號
                review_type: '提出',
                stage_user_uuid: userInfo?.id,
                stage_user_name: userInfo?.username,
                stage_user_title: '經辦',
            }
        ]);
    };
    const handleCanceladdflow = () => {
        setStatus("");
        setItems([]);
    }




    // const [employeedata, setEmployeedata] = useState<any[]>([]);
    const [employeefilteredData, setEmployeeFilteredData] = useState<any[]>([]);
    const [showempSuggestions, setShowEmpSuggestions] = useState(false);

    // const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        if (isSelectingRef.current) return;

        const nameFilter = newUserName?.trim().toLowerCase();
        const titleFilter = newUserTitle?.trim().toLowerCase();

        if (nameFilter !== "" || titleFilter !== "") {
            const filtered = employeedata.filter(item => {
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
        setShowEmpSuggestions(false);  // 隱藏建議列表
    };

    const handleClearNewUserName = () => {
        setNewUserName("");
        setNewUserTitle("");
    }

    const handleSaveFlow = async () => {
        if(flowname===""||flowname===undefined){
            myAlert.warning({title:'流程名稱不可為空'});
            return;
        }

        try {
            setIsLoading(true);
            const conditionModel = {
                username: userInfo?.username,
                name: flowname,
                stage_counter: data2.length,
                data2: data2
            };



            var inputModel = {
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
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            setData2([]);
            setFlowname("");



        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }



    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'簽核清單'} panelList={panelList} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.left} style={{ display: `${leftbaropen === true ? 'none' : 'none'}` }}>
                    <div className={scss.content}>

                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div></div>
                            <div>
                                <button
                                    className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn}
                                    onClick={status !== '未儲存' ? () => handleAddflow() : undefined}
                                    title="新增單據"
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
                                    title="儲存新增"
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
                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="自訂數量"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    style: { color: 'red' },
                                                    value: `${data.length}`,
                                                },
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={scss.body_content1}>

                            <Thead01 type={'FlowList'} />
                            <span>
                                {data && (
                                    data.slice(0, 100).map((_item: any, index: number) => (
                                        <CellWithBar key={index} className={scss.panelHeader21}>
                                            <div
                                                key={index}
                                                className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                                onClick={() => { alert("取得流程順序") }}
                                            >
                                                <span>{index + 1}</span>
                                                <span>{_item.name}</span>
                                                <span>
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        {_item.stages.map((_stage: any, stageIndex: number) => (
                                                            <div key={_stage.stage_order} style={{ display: 'inline-block', width: '139px' }}>
                                                                {/* 如果是第一筆則不顯示箭頭 */}
                                                                {stageIndex !== 0 && (
                                                                    <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                                )}
                                                                <span style={{ padding: '0px 0px', backgroundColor: '#1061c4', color: 'white' }}>
                                                                    {_stage.review_type}
                                                                </span>
                                                                <span>
                                                                    {_stage.stage_user_name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </span>
                                            </div>
                                        </CellWithBar>
                                    ))
                                )}
                            </span>

                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.foot_head1}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.foot_head2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="建立日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') || '',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="名稱"
                                            disabled={status != "" ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: flowname || ' ',
                                                    onChange: (e) => { setFlowname(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
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
                                </div>
                            </div>
                        </div>


                        <div className={scss.foot_content1}>
                            <Thead01 type={'FlowDetailList'} />
                            <span>
                                {items && items.slice(0, 100).map((_item, index) => (
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
                                            <span>{index + 1}</span>
                                            <span>
                                                <select
                                                    value={_item.review_type}
                                                    onChange={(e) => handleSelectChange(e, index)} // 新增事件處理函數
                                                    style={{ fontSize: '18px', backgroundColor: 'transparent' }}
                                                >
                                                    <option value="提出">提出</option>
                                                    <option value="審查">審查</option>
                                                    <option value="核准">核准</option>
                                                </select>
                                            </span>
                                            <span>{_item.stage_user_title}</span>
                                            <span>{_item.stage_user_name}</span>
                                            {/* <span>{_item.stage_user_title}</span> */}
                                            <span>
                                                {/* <button onClick={() => handleRemoveFromData2(index)}>移除</button> */}
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} onClick={() => handleRemoveFromData2(index)} />
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))}
                            </span>
                            <div style={{ display: `${status !== "" ? '' : 'none'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc' }}>
                                    <div style={{ width: '70px', padding: '0px 15px' }}>
                                    </div>
                                    <div style={{ width: '105px', padding: '0px 15px' }}>
                                        <select
                                            value={newReviewType}
                                            onChange={(e) => setNewReviewType(e.target.value)}
                                            style={{ fontSize: '18px', backgroundColor: 'transparent' }}
                                        >
                                            <option value="提出">提出</option>
                                            <option value="審查">審查</option>
                                            <option value="核准">核准</option>
                                        </select>
                                    </div>
                                    <div style={{ width: '145px', padding: '0px 15px' }}>
                                        <input
                                            type="text"
                                            placeholder="職稱"
                                            style={{ width: '100%', fontSize: '18px' }}
                                            value={newUserTitle}
                                            onChange={handleNewUserTitleChange}
                                        />
                                    </div>
                                    <div style={{ width: '150px', padding: '0px 15px' }}>
                                        <input
                                            type="text"
                                            placeholder="姓名"
                                            style={{ width: '100%', fontSize: '18px' }}
                                            value={newUserName}
                                            onChange={handleNewUserNameChange}
                                        />
                                    </div>
                                    <div style={{ width: '150px', padding: '0px 10px' }}>
                                        <button>
                                            <img src={icon_fc_add.src} alt="add" style={{ width: '30px', height: '20px' }} onClick={handleAddToData2} />
                                        </button>
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        <button onClick={() => { handleClearNewUserName() }} style={{ display: `${newUserName || newUserTitle ? '' : 'none'}` }}>
                                            <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {employeefilteredData.length > 0 && (
                                        <ul style={{
                                            border: '1px solid #ccc',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            marginTop: '0px',
                                            left: '220px',
                                            position: 'absolute',
                                            width: '400px',
                                            backgroundColor: 'white',
                                            zIndex: 1004, // 確保下拉清單在最上層,
                                            display: `${showempSuggestions ? '' : 'none'}`
                                        }}>
                                            {employeefilteredData.map(emp => (
                                                <li
                                                    key={emp.id}
                                                    onClick={() => handleNewUserNameclick(emp)}
                                                    style={{
                                                        fontSize: '18px',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        border: '1px solid #c1c1c1',
                                                        display: 'flex', // 使用 flexbox
                                                        justifyContent: 'space-between', // 在項目之間創建間距
                                                        alignItems: 'center'// 垂直置中
                                                    }}
                                                >

                                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                        <span style={{ width: '155px' }}>
                                                            {emp.title}
                                                        </span>
                                                        <span style={{ width: '100px' }}>
                                                            {emp.ch_name}
                                                        </span>
                                                        <span style={{ width: '120px' }}>
                                                            {emp.department}
                                                        </span>
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
            </div>


        </SubLayer >

    )

}