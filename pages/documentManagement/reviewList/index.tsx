import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
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
import Quotation from 'pages/domestic/quotationList/quotation';
import PurchaseRequisitionList from 'pages/factoryDepartment/purchaseRequisitionList';
import { Modal } from 'antd';



export default function ReviewList() {

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
    const [data2, setData2] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchdata, setSearchdata] = useState<any[]>([]);




    const [reviewtype, setReviewtype] = useState<string>("");
    const [memo, setMemo] = useState<string>("");


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

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);
    const [editmain, setEditmain] = useState<boolean>(false);





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
    //取審核主檔
    const GetReview = async () => {
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

            
            const response = await fetch(`${setting.apipath}/Review/GetReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();


            setData(data);
            console.log(data);


            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                // setProductnamein(data[0].name);
            }
        } catch (error: any) {
            setError("GetReview:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            GetReview();
            hasFetchedData.current = true;
        }
    }, []);




    const GetReviewStatus = async (item: any) => {

        setReviewtype(item.document_type);
        

        try {
            setIsLoading(true);
            const conditionModel = {
                document_id: item.document_id,
                document_uuid: item.document_uuid
            };


            var inputModel = {
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
            console.log(data2);

            await new Promise(resolve => setTimeout(resolve, 500));
            if (data2.length > 0 && checkfirstin === 0) {
                // setProductnamein(data[0].name);
            }
        } catch (error: any) {
            setError("GetReviewStatus:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };






    useEffect(() => {
        if (typeof window !== 'undefined' && reviewtype === "請購單") {
            // 使用 shallow 模式更新 query 而不進行頁面跳轉
            console.log(reviewtype);
            router.push({
                query: {
                    purchaserequisitionuuid: '9fab25d6-b750-4508-8b11-9e8c1564be70',
                    purchaserequisitionid: '20240800131',
                    create_at: '113-08-21',
                    create_by: 'Lai-1',
                    status: '詢價中',
                    need_date: '113-08-21',
                    note: 'AAFFFDDD',
                    firstin: 1,
                    viewtype: 'review',
                    reviewflow:'72dd7daa-a18f-4033-b1d7-f172b5712f9d'
                },
            }, undefined, { shallow: true });
        }
    }, [reviewtype]);


    useEffect(() => {
        if (typeof window !== 'undefined' && reviewtype === "報價單") {
            alert("報價單")
        }
    }, [reviewtype]);






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


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setFilteredData(data);
        isSelectingRef.current = false;
        setKeyword3(e.target.value);

    };




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




    //#region Tab頁籤切換
    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("待審核");
    const [tabshow, setTabshow] = useState<string>("待審核");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        return tabnow === tabName ? { color: '#14256a', borderColor: '#c1c1c1', backgroundColor: 'white', borderBottom: '0px' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName);
        setTabshow(tabName);
        setEditmain(false);
    };
    //#endregion

    const handleClear = () => {
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');

    }


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'簽核清單'} panelList={panelList} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.left} style={{ display: `${leftbaropen === true ? 'none' : 'none'}` }}>
                    <div className={scss.content}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#fff',
                            zIndex: 1000,
                        }}>
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
                            <div className={scss.head_head1}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div className={scss.head_content1}>
                                <div>
                                    <span>
                                        <button
                                            className={scss.minitabbtn}
                                            onClick={() => tabChosed('待審核')}
                                            style={getButtonStyle('待審核')}
                                        >
                                            {/* <img src={icon_edit.src} alt="edit" style={{ height: '20px', width: '20px' }} title="編輯物料" /> */}
                                            待審核
                                        </button>
                                    </span>
                                    <span>
                                        <button
                                            className={scss.minitabbtn}
                                            onClick={() => tabChosed('審核中')}
                                            style={getButtonStyle('審核中')}
                                        >
                                            {/* <img src={icon_autoadd.src} alt="add" style={{ height: '20px', width: '20px' }} title="新增物料" /> */}
                                            審核中
                                        </button>
                                    </span>
                                    <span>
                                        <button
                                            className={scss.minitabbtn}
                                            onClick={() => tabChosed('審核完成')}
                                            style={getButtonStyle('審核完成')}
                                        >
                                            {/* <img src={icon_autoadd.src} alt="add" style={{ height: '20px', width: '20px' }} title="新增物料" /> */}
                                            審核完成
                                        </button>
                                    </span>
                                </div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div className={scss.tabbody}>
                                <div>
                                    <div style={{ display: `${tabshow === "待審核" ? '' : 'none'}` }}>
                                        <div style={{ border: '1px solid #c1c1c1' }}>
                                            {/* <div className={scss.head_foot2}>
                                                <div>
                                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder='請輸入單據類別'
                                                        value={keyword2}
                                                        style={{ padding: '0px 5px', width: '100px', fontSize: '18px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                                        onChange={(e) => setKeyword2(e.target.value)}
                                                    />

                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder='請輸入單號'
                                                        value={keyword3}
                                                        style={{ padding: '0px 5px', width: '350px', fontSize: '18px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                                        onChange={(e) => setKeyword3(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder='請輸入人員'
                                                        value={keyword4}
                                                        style={{ padding: '0px 5px', width: '350px', fontSize: '18px', borderBottom: '1px solid #c1c1c1' }}
                                                        onChange={(e) => setKeyword4(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <button style={{ display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                                                        <img src={icon_clear.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                                    </button>
                                                </div>
                                            </div> */}
                                            <div className={scss.body_content1} style={{ height: '300px' }}>
                                                <div>
                                                    <Thead01 type={'ReviewList'} />
                                                    <span>
                                                        {data && (
                                                            data.slice(0, 100).map((_item: any, index: number) => (
                                                                <CellWithBar key={index} className={scss.panelHeader21}>
                                                                    <div
                                                                        key={index}
                                                                        className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                                                        onClick={() => { GetReviewStatus(_item) }}
                                                                    >
                                                                        <span>{index + 1}</span>
                                                                        <span>{_item.document_type}</span>
                                                                        <span>{_item.document_id}</span>
                                                                        <span>{_item.create_by}</span>

                                                                    </div>
                                                                </CellWithBar>
                                                            ))
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #c1c1c1' }}>
                                    <Thead01 type={'ReviewStatusList'} />
                                    <span>
                                        {data2 && (
                                            data2.slice(0, 100).map((_item: any, index: number) => {
                                                // 判斷當前是否為第一筆，如果不是，則檢查上一筆的 review_time
                                                let prestageReviewDisplay = _item.prestage_review;

                                                if (index > 0 && !data2[index - 1].review_time) {
                                                    prestageReviewDisplay = ""; // 如果上一筆的 review_time 為空，將當前的 prestage_review 設定為空
                                                }

                                                return (
                                                    <CellWithBar key={index} className={scss.panelHeader22}>
                                                        <div
                                                            key={index}
                                                            className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                                        // onClick={() => { alert(_item.document_id) }}
                                                        >
                                                            <span style={{ textAlign: 'center', backgroundColor: '#5b5a5ad6', color: 'white' }}>{_item.review_type}</span>
                                                            <span>{_item.review_person}</span>
                                                            <span style={{ textAlign: 'center', backgroundColor: '#1061c4', color: 'white' }}>
                                                                {_item.review_order === 1 ? "提出" : "簽核中"}
                                                            </span>
                                                            <span>{prestageReviewDisplay}</span>
                                                            <span>{_item.review_time}</span>
                                                            <span>{_item.review_memo}</span>
                                                        </div>
                                                    </CellWithBar>
                                                );
                                            })
                                        )}

                                    </span>
                                </div>
                            </div>

                        </div>
                        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1002, padding: '5px 20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <div className={scss.body_foot1}>
                                <div>
                                    <button className={scss.longsquarebtn} onClick={() => { alert("噢 耶斯") }} title="單據核准">
                                        {/* <img src={icon_task_approved.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                                        核准
                                    </button>
                                </div>
                                <div>
                                    <button className={scss.longsquarebtn} onClick={() => { alert("噢~噢~") }} title="單據核准">
                                        {/* <img src={icon_task_rejected.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                                        駁回
                                    </button>
                                </div>
                                <div>
                                    {/* <InputSel
                                        {...inputSelProps}
                                        caption="意見"
                                        disabled={false}
                                        inputProps={{
                                            props: {                                                
                                                value: memo || ' ',
                                                onChange: (e) => { setMemo(e.target.value) }
                                            },
                                        }}
                                    /> */}
                                    {/* <span style={{fontSize:'18px',color:'#14256a'}}>意見</span> */}
                                    <input placeholder="意見" style={{ padding:'10px',fontSize:'18px',border: '1px solid gray', height: '100%', width: '100%' }} />

                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
                            <div className={scss.body_foot2}>
                                <div>
                                    {reviewtype === "請購單" && <PurchaseRequisitionList />}
                                    {reviewtype === "採購單" && <PurchaseRequisitionList />}
                                    {reviewtype === "進貨單" && <PurchaseRequisitionList />}
                                    {reviewtype === "報價單" && <Quotation />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </SubLayer >

    )

}