import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _, { filter } from 'lodash';

import scss from './completedPOQuery.module.scss';
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
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg';
import { Button, Collapse, DatePicker, Modal, Pagination, Radio, RadioChangeEvent, Space } from 'antd';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_collapse_right from 'public/image/icon/fc_collapse_right.svg';
import icon_collapse_left from 'public/image/icon/fc_collapse_left.svg';
import icon_detail from 'public/image/icon/fc_detail.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_close from 'public/image/icon/fc_close.svg';
import MyDatePicker from 'components/global/gear/inputAndSel_v2/cog/myDatePicker';
import icon_disable from 'public/image/icon/fc_disable.svg';
import icon_print from 'public/image/icon/fc_printer.svg';
import { color } from 'html2canvas/dist/types/css/types/color';
import { orange } from '@mui/material/colors';
import icon_remove from 'public/image/icon/fc_remove.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_fc_arrow_up from 'public/image/icon/fc_arrow_up.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_task_approved from 'public/image/icon/fc_approved.svg';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg';
import icon_sent_review from 'public/image/icon/fc_sent_review.svg';
import icon_sent_review_gray from 'public/image/icon/fc_sent_review_gray.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_flow from 'public/image/icon/fc_flow.svg';
import icon_review from 'public/image/icon/review.svg';
import icon_flow_gray from 'public/image/icon/fc_flow_gray.svg';
import icon_sent_review_stop from 'public/image/icon/fc_sent_review_stop.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import icon_fc_quotereq from 'public/image/icon/fc_quotereq.svg';
import icon_export from 'public/image/icon/fc_export.svg';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_arrow_right2 from 'public/image/icon/longArrow.svg';
import icon_search2 from 'public/image/icon/search.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import { Panel } from 'components/global/myAntd/collapse';
import icon_tray_in from 'public/image/icon/fc_tray_in.svg';

export default function completedPOQuery() {
    const [pagename, setPagename] = useState<string>("已交貨查詢")
    const [autoRefreshOpen, setAutoRefreshOpen] = useState<boolean>(false)
    const [autoRefresh, setAutoRefresh] = useState<number>(1)//分鐘
    //#region ===========【路由參數】
    const router = useRouter();
    const {
    } = router.query;
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
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");
    const [keyword5, setKeyword5] = useState<string>("");
    // 預設截止日期為今天，起始日期為今天往前推30天
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    // 使用 Moment 類型作為狀態
    const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);


    const [batchidin, setBatchidin] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState(true);
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


    //#region ===========【瀏覽器高寬】
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // 初始化時抓取瀏覽器的寬度和高度
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // 監聽視窗大小變化
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // 清除事件監聽器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    //#endregion


    //#region ===========【頁面進入】
    useEffect(() => {
        Get();
    }, []);

    //#endregion

    //#endregion ===========【自動更新】
    useEffect(() => {
        if (autoRefreshOpen === true) {

            // 定義一個 interval，每隔 5 分鐘執行一次 Get 函式
            const intervalId = setInterval(() => {
                Get();
            }, autoRefresh * 60 * 1000); // 5 分鐘 = 5 * 60 * 1000 毫秒

            // 清除 interval，避免記憶體洩漏
            return () => clearInterval(intervalId);
        }
    }, []); // 確保只在組件掛載時設定一次
    //#endregion

    //#region ===========【API】

    //取單據
    const Get = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: "未交貨查詢",
                username: userInfo?.employee?.id.toString()
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetUnReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setData1Restore(data);
            setSearchdata(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
            // console.log(error.message);
        }
        finally {
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


            var inputModel = {
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
            return responsedata

            console.log()

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //#endregion

    //#region ===========【審核】
    const [review_flow, setReview_flow] = useState<string>("");
    const [reviewbar, setReviewbar] = useState<boolean>(false);
    const [reviewdata, setReviewdata] = useState<any[]>([]);
    const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
    const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
    const [documenttitle, setDocumenttitle] = useState<string>("");
    const [reviewhistroydata, setReviewhistorydata] = useState<any[]>([]);

    //取全部的自訂流程
    const GetReviewFlow = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                user_id: userInfo?.employee?.id.toString()
            };

            var inputModel = {
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
        }
        finally {
            setIsLoading(false);
        }

    }

    //取單據的審核流程
    const GetReviewById = async (document_uuid: any) => {
        try {
            setReviewflowdata([]);
            setReviewflowdata2([]);

            const conditionModel = {
                document_uuid: document_uuid
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
        const supplierid = keyword5.trim().toLowerCase(); // 將條件轉為小寫
        const supplier = keyword1.trim().toLowerCase();
        const productid = keyword2.trim().toLowerCase();
        const name = keyword3.trim().toLowerCase();
        const spec = keyword4.trim().toLowerCase();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !supplierid &&
            !supplier &&
            !productid &&
            !name &&
            !spec) {
            setSearchdata(data);
            return;
        }

        // 過濾資料
        let filteredData = data.filter(item => {
            const createAt = moment(item.create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        // 模糊查詢價格類別(廠商編號)
        if (supplierid) {
            filteredData = filteredData.filter(item =>
                item.supplierid?.toString().toLowerCase().includes(supplierid) // 忽略大小寫
            );
        }

        // 模糊查詢單據狀態
        if (supplier) {
            filteredData = filteredData.filter(item =>
                item.suppliername?.toString().toLowerCase().includes(supplier) // 忽略大小寫
            );
        }

        if (productid) {
            filteredData = filteredData.filter(item =>
                item.productid?.toString().toLowerCase().includes(productid) // 忽略大小寫
            );
        }

        if (name) {
            filteredData = filteredData.filter(item =>
                item.name?.toString().toLowerCase().includes(name) // 忽略大小寫
            );
        }

        if (spec) {
            filteredData = filteredData.filter(item =>
                item.spec?.toString().toLowerCase().includes(spec) // 忽略大小寫
            );
        }

        setSearchdata(filteredData);
    };


    // 監聽條件變更
    useEffect(() => {
        filterData();
        setCurrentPage(1);
    }, [keywordenddate, keywordstartdate, keyword1, keyword2, keyword3, keyword4, keyword5, data]);
    //#endregion

    //#region ===========【分頁處理】
    // 頁數相關狀態
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100); // 每頁顯示的項目數

    // 計算當前頁顯示的資料
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchdata.slice(startIndex, endIndex);
    }, [itemsPerPage, currentPage, searchdata]);

    // 分頁切換處理函數
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };
    //#endregion

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={pagename}
                customeLeft={[
                    <>
                        {/* {windowSize.width} */}
                    </>
                ]}
                customeRight={[

                ]}

                panelList={panelList} />

            <div
                style={{
                    display: `${isCollapsed ? '' : 'none'}`,
                    padding: '20px',
                    border: '1px solid #ccc',
                    // backgroundColor: '#f9f9f9',
                    zIndex: '1000'
                }}>

                <div className={scss.search_content1}>
                    {/* 每個項目 */}
                    <div>
                        {/* 種類下拉選單 */}
                        {/* <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            價格種類
                        </label>
                        <select
                            value={keyword5 || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setKeyword5(e.target.value);
                                e.target.blur(); // 讓 select 失去焦點
                            }}
                            disabled={false} // 根據需求設置是否禁用
                            style={{
                                fontSize: '18px',
                                borderBottom: '1px solid #14256a',
                                width: '100%',
                                marginTop: '-1px', // 調整負值以微調向上位置
                            }}
                        >
                            <option value="">全部</option>
                            <option value="詢價">詢價</option>
                            <option value="進價">進價</option>
                        </select> */}
                        {/* 廠商編號 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            廠商編號
                        </label>
                        <InputSel
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            inputProps={{
                                props: {
                                    placeholder: '請輸入廠商編號',
                                    style: { width: "300px", paddingLeft: '5px' },
                                    value: keyword5,
                                    onChange: (e) => {
                                        setKeyword5(e.target.value)
                                    }
                                },
                            }}
                        />
                    </div>
                    <div>
                        {/* 廠商名稱 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            廠商名稱
                        </label>
                        <InputSel
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            inputProps={{
                                props: {
                                    placeholder: '請輸入廠商名稱',
                                    style: { width: "300px", paddingLeft: '5px' },
                                    value: keyword1,
                                    onChange: (e) => {
                                        setKeyword1(e.target.value)
                                    }
                                },
                            }}
                        />
                    </div>
                    <div>

                        {/* 隱藏保留位置 */}
                        {/* <label
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginRight: "10px",
                            display: 'block',
                            visibility: 'hidden', // 隱藏但保留位置
                        }}
                    >
                        保留位置
                    </label>
                    <input
                        type="text"
                        placeholder="保留位置"
                        style={{
                            width: '100%',
                            // padding: "8px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            visibility: 'hidden', // 隱藏但保留位置
                        }}
                        value={"保留位置"}
                    /> */}

                    </div>
                </div>
                <div className={scss.search_content2}>
                    <div>
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            起始日期
                        </label>
                        {/* 起始日期 */}
                        <InputSel
                            // caption="起始日期"
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px', paddingLeft: '5px' }}
                            datePickerProps={{
                                props: {
                                    style: { paddingRight: '5px' },
                                    value: keywordstartdate || null,
                                    onChange: (e: Moment | null) => {
                                        setKeywordstartdate(e);
                                    },
                                },
                            }}
                        />
                    </div>
                    <div>
                        {/* 截止日期 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            截止日期
                        </label>
                        <InputSel
                            // caption="截止日期"
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            datePickerProps={{
                                props: {
                                    style: { paddingRight: '5px' },
                                    value: keywordenddate || null,
                                    onChange: (e: Moment | null) => {
                                        setKeywordenddate(e);
                                    },
                                },
                            }}
                        />
                    </div>
                    <div></div>
                </div>
                <div className={scss.search_content3}>
                    <div>
                        {/* 料號 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            料號
                        </label>
                        <InputSel
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            inputProps={{
                                props: {
                                    placeholder: '請輸入料號',
                                    style: { width: "300px", paddingLeft: '5px' },
                                    value: keyword2,
                                    onChange: (e) => {
                                        setKeyword2(e.target.value)
                                    }
                                },
                            }}
                        />
                    </div>
                    <div>
                        {/* 品名 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            品名
                        </label>
                        <InputSel
                            // caption="單號"
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            inputProps={{
                                props: {
                                    placeholder: '請輸入品名',
                                    style: { width: "300px", paddingLeft: '5px' },
                                    value: keyword3,
                                    onChange: (e) => {
                                        setKeyword3(e.target.value)
                                    }
                                },
                            }}
                        />
                    </div>
                    <div>
                        {/* 規格 */}
                        <label
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "10px",
                                display: 'block',
                            }}
                        >
                            規格
                        </label>
                        <InputSel
                            // caption="單號"
                            disabled={false}
                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                            inputProps={{
                                props: {
                                    placeholder: '請輸入規格',
                                    style: { width: "300px", paddingLeft: '5px' },
                                    value: keyword4,
                                    onChange: (e) => {
                                        setKeyword4(e.target.value)
                                    }
                                },
                            }}
                        />
                    </div>
                </div>

            </div>
            <div
                style={{
                    border: '1px solid rgb(168, 168, 168)',
                    height: `${isCollapsed ? '443px' : '660px'}`
                }}>
                <div className={scss.body_content1} style={{ overflowX: 'auto', maxHeight: `${isCollapsed ? '443px' : '660px'}` }} >
                    {/* <Thead01 type={'PEntry'} /> */}
                    <div className={scss.head15}>
                        <span>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                style={{ paddingTop: '10px' }}
                            >
                                {isCollapsed ?
                                    <svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >

                                        <path d="M0 0h48v48H0z" fill="none" />
                                        <g id="Shopicon">
                                            <g>
                                                <polygon points="6.586,30.585 9.414,33.413 24,18.827 38.586,33.413 41.414,30.585 24,13.171 		" />
                                            </g>
                                        </g>
                                    </svg>
                                    :
                                    <svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >

                                        <path d="M0 0h48v48H0z" fill="none" />
                                        <g id="Shopicon">
                                            <g>
                                                <polygon points="24,29.171 9.414,14.585 6.586,17.413 24,34.827 41.414,17.413 38.586,14.585 		" />
                                            </g>
                                        </g>
                                    </svg>
                                }
                            </button>
                        </span>
                        <span>序</span>
                        <span>單號</span>
                        <span>建立日期</span>
                        <span>需用日期</span>
                        <span>料號</span>
                        <span>品名</span>
                        <span>規格</span>
                        <span>數量</span>
                        <span>已交貨</span>
                        <span>未交數</span>
                        <span>單位</span>
                        <span>單價</span>
                        <span>總價</span>
                        <span>廠商</span>
                        <span></span>
                    </div>
                    {/* {searchdata && (searchdata.map((_item: any, index: number) => ( */}
                    {currentItems && currentItems.map((_item, index) => {
                        return (
                            <CellWithBar key={index} className={scss.panelHeader15}
                                onClick={() => {
                                    // 深拷貝 _item 物件，避免直接修改原始資料
                                    let updatedItem = { ..._item };

                                    if (updatedItem.detail_type === "詢價") {
                                        // 如果是詢價，改變欄位名稱
                                        updatedItem = {
                                            ...updatedItem,
                                            id: updatedItem.uuid,            // uuid 改為原本的 id
                                            quotereqid: updatedItem.id,      // id 改為原本的 quotereqid
                                        };
                                    } else if (updatedItem.detail_type === "進價") {
                                        // 如果是進價，改變欄位名稱
                                        updatedItem = {
                                            ...updatedItem,
                                            prodreceiptuuid: updatedItem.uuid, // uuid 改為原本的 prodreceiptuuid
                                            prodreceiptid: updatedItem.id,    // id 改為原本的 prodreceiptid
                                        };
                                    }

                                    myAlert.confirm({
                                        title: '確定導向此單據嗎?',
                                        content: updatedItem.detail_main_id,
                                        props: {
                                            onOk: () => {
                                                router.push({
                                                    pathname:
                                                        // `${updatedItem.detail_type === "詢價" ? '/factoryDepartment/QReqDetail' : '/factoryDepartment/PReceiptDetail'}`,
                                                        `/factoryDepartment/POrderDetail`,
                                                    query: {
                                                        item: JSON.stringify(updatedItem),
                                                    },
                                                });
                                            }
                                        }
                                    })
                                }}

                            >
                                <>
                                    <div
                                        key={index}
                                        className={`${scss.row01} 
                                                ${_item.prodentryuuid === selectedItemId ? scss.selectedRow : ''}`}
                                    >
                                        <span style={{ color: '#14256a' }}>

                                        </span>
                                        <span>{index + 1}</span>
                                        <span>{_item.purchaseorderid}</span>
                                        <span>{getTaiwanDateStr(_item.create_at)}</span>
                                        <span>{getTaiwanDateStr(_item.need_date)}</span>
                                        <span>
                                            {_item.productid}
                                        </span>
                                        <span>
                                            {_item.name}
                                        </span>
                                        <span>{_item.spec}</span>
                                        <span>{Number(_item.quantity).toLocaleString()}</span>
                                        <span style={{ color: '#14256a' }}>{Number(_item.alreadyinquantity).toLocaleString()}</span>
                                        <span style={{ color: '#ea1833' }}>{(Number(_item.quantity) - Number(_item.alreadyinquantity)).toLocaleString()}</span>
                                        <span>{_item.unit}</span>
                                        <span>{Number(_item.unitprice).toLocaleString()}</span>
                                        <span>{Number(_item.totalprice).toLocaleString()}</span>
                                        <span>
                                            {_item.suppliername}
                                        </span>
                                    </div>
                                </>
                            </CellWithBar>
                        );
                    })}

                </div>
            </div>
            <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
                {/* 分頁控制 */}
                <Pagination
                    current={currentPage} // 當前頁碼
                    total={searchdata.length} // 總數據量
                    pageSize={itemsPerPage} // 每頁顯示的數量
                    onChange={handlePageChange} // 處理頁面切換
                    showSizeChanger // 顯示頁數選擇器
                    pageSizeOptions={['5', '10', '20', '50', '100']} // 可選的每頁顯示數量
                    onShowSizeChange={(current, size) => setItemsPerPage(size)} // 更新每頁顯示數量
                />
            </div>
        </SubLayer >


    )

}

