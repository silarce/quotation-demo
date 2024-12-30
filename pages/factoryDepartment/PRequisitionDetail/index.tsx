import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './PRequisitionDetail.module.scss';
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
import { Modal, Radio, Space } from 'antd';
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
import icon_review from 'public/image/icon/review.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_print from 'public/image/icon/fc_printer.svg';
import icon_export from 'public/image/icon/fc_export.svg';
import { useGlobal_review } from 'hooks/globalState/useGlobal_review';

//引用審核global做更新
type Tquery = {
    wareHouseId: string | undefined;
};

export default function PRequisitionDetail() {
    //#region ===========【頁面參數】
    const [pagename, setPagename] = useState<string>("請購")
    const [statusarea, setStatusarea] = useState<boolean>(true)
    const [excelopen, setExcelopen] = useState<boolean>(false)
    const [printopen, setPrintopen] = useState<boolean>(true)
    //#endregion
    //#region ===========【路由參數】
    const router = useRouter();
    const {
        firstin,
        item,
        viewtype
    } = router.query;

    const parsedItem = item ? JSON.parse(item as string) : null;
    //#endregion

    //#region ===========【登入者】
    const { userInfo } = useContext(AppContext);
    const { erpFeature } = useContext(AppContext);
    //#endregion

    //#region ===========【變數宣告】

    const { update_2 } = useGlobal_review();

    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [data3, setData3] = useState<any[]>([]);

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

    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    // const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>('');
    // const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>('');
    const [idin, setidin] = useState<string>("");
    const [uuidin, setuuidin] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [need_datein, setNeed_datein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState('請選擇類別');

    //編輯時保留原始資料
    const [originalcreate_at, setOriginalcreate_at] = useState<string>("");
    const [originalneed_date, setOriginalneed_date] = useState<string>("");
    const [originalnote, setOriginalnote] = useState<string>("");
    const [originaldata2, setOriginaldata2] = useState<any[]>([]);

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    // 預設截止日期為今天，起始日期為今天往前推30天
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    // 使用 Moment 類型作為狀態
    const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);

    //手key
    const [currentindex, setCurrentIndex] = useState<number>(0);
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");
    const [handinputproductid, setHandinputproductid] = useState<string>("");
    const [handinputproductuuid, setHandinputproductuuid] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [isEditing, setIsEditing] = useState(false);

    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);


    // 計算總價
    const [totalprice1, setTotalPrice1] = useState<string>("");
    const [taxprice1, setTaxPrice1] = useState<string>("");
    const [totalpayprice1, setTotalPayPrice1] = useState<string>("");

    //#endregion

    //#region ===========【上方功能列】
    //搜尋
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        // const keywordWhpname = valueArr[0] as string;
        // const keywordMaterialnumber = valueArr[1] as string;
        // const keywordSpec = valueArr[2] as string;
        // searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };

    //按鈕
    const panelList: TpanelList = [

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
    //local開發時會多次觸發，上線後不影響，但開發時覺得很煩，所以加了這個
    const hasFetchedData = useRef(false);

    useEffect(() => {
        console.log(userInfo);
        if (!hasFetchedData.current) {
            getProduct();
            GetReviewFlow();//審核
            hasFetchedData.current = true;
        }
    }, []);

    useEffect(() => {
        setuuidin(parsedItem?.purchaserequisitionuuid);
        setidin(parsedItem?.purchaserequisitionid)
        GetDetailById(parsedItem?.purchaserequisitionuuid);
        GetReviewById(parsedItem?.purchaserequisitionuuid);
        GetReviewHistory(parsedItem?.purchaserequisitionuuid);
        setCreate_byin(parsedItem?.create_by);
        setCreate_atin(parsedItem?.create_at);
        setNeed_datein(parsedItem?.need_date);
        setStatusin(parsedItem?.status);
        setNotein(parsedItem?.note);

    }, [item]);
    //#endregion

    //#region ===========【API】

    //以ID取單據
    const GetDetailById = async (id: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                purchaserequisitionuuid: id as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPurchaseRequisitionDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();
            // setData1(data);

            console.log(responsedata);
            // alert(responsedata.length);
            setData2(responsedata);
            // return responsedata


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //更新單據
    const Update = async () => {
        try {
            const conditionModel = {
                purchaserequisitionid: idin,
                purchaserequisitionuuid: uuidin,
                create_at: create_atin,
                need_date: need_datein,
                note: notein,
                data2: data2
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewUpdatePurchaserequisitionDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                GetDetailById(uuidin);
            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }

    };

    //作廢單據
    const NewDeletePurchaseRequisition = async () => {
        try {
            const conditionModel = {
                id: uuidin as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/NewDeletePurchaseRequisition?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                router.push({
                    pathname: `/factoryDepartment/PRequisitionList`,
                });
            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }





        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //取物料
    const getProduct = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
            };


            var inputModel = {
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

            console.log(erpFeature);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //複製單據(同新增單據)
    const Add = async () => {
        if (data2.length === 0) {
            myAlert.warning({ title: `${pagename}項目不可為空` })
            return;
        }
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                // create_at: create_atin,
                create_at: moment().format('YYYY-MM-DD') || '',
                need_date: moment().format('YYYY-MM-DD') || '',
                // need_date: moment(need_datein).format('YYYY-MM-DD'),
                create_by: userInfo?.employee?.id.toString(),
                note: notein,
                data2: data2
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewAddPurchaseRequisition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: "複製成功", content: result.id });
                setidin(result.id);
                setuuidin(result.uuid);
                setStatusin("編輯中");
                router.push({
                    pathname: `/factoryDepartment/PRequisitionList`,
                    query: {
                    },
                });
            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //取得IP
    const Print = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {

            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`http://127.0.0.1:5050/api/print/GetIP?${queryParams}`);
            if (!response.ok) {
                myAlert.warning({ title: '請檢查列印程式是否開啟' })
            }
            const data = await response.text();
            console.log(data);
            sentToPrint(data);

        } catch (error: any) {
            setError(error.message);
            myAlert.warning({ title: '請檢查列印程式是否開啟', content: error.message });
        }
        finally {
            setIsLoading(false);
        }
    };

    //列印單據
    const sentToPrint = async (ip: any) => {
        myAlert.confirm({
            title: '確定要列印單據嗎?',
            content: <>
            </>,
            props: {
                onOk: async () => {
                    try {
                        const conditionModel = {
                            id: idin,
                            type: "purchaserequisition",
                            clientip: ip,
                            data: []
                        };

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        console.log(JSON.stringify(inputModel));

                        const response = await fetch(`${setting.apipath}/WareHouse/Print`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const data = await response.text();
                        console.log(data);

                        await new Promise(resolve => setTimeout(resolve, 500));






                        const response2 = await fetch("http://127.0.0.1:5050/api/print/print3", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: data
                        });

                        if (!response2.ok) {
                            throw new Error(`Failed to fetch print4 data: ${response2.statusText}`);
                        }

                        const data2 = await response2.text();
                        console.log("Received from print4:", data2);



                    } catch (error: any) {
                        // setError(error.message);
                        console.log(error.message);
                    }
                    finally {
                        // setIsLoading(false);
                    }
                }
            }
        });


    };

    //匯出單據
    const Excel = async (id: any, type2: any, quoid: any) => {
        try {

            setIsLoading(true);
            const conditionModel = {
                id: id,
                type: 'purchaserequisition',
                type2: type2,
                quoterequuid: quoid
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/download-excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // 將響應轉換為 Blob
            const blob = await response.blob();

            // 創建一個 URL 來下載 Blob
            const url = window.URL.createObjectURL(blob);

            // 創建一個下載鏈接
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `三久建材_採購單_${id}.xls`); // 設置文件名

            // 將鏈接添加到 DOM 並觸發點擊下載
            document.body.appendChild(link);
            link.click();

            // 清除鏈接和 URL 物件
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsLoading(false);
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
            // setIsLoading(true);

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
                // console.log('No data returned');
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

    const [value, setValue] = useState<number | null>(null);
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const setReview = async (item: any) => {
        setReview_flow(item.id);
        setReviewflowdata2(item.stages);
    }

    const sentToReview = async (type: any) => {

        try {
            // if (review_flow === "") {
            //     setReviewbar(true);
            //     handleChoseflow();
            // }
            // else {
            const review_query = {
                item: JSON.stringify(parsedItem)
            };

            const conditionModel = {
                document_id: idin,
                document_uuid: uuidin,
                document_type: pagename + "單",
                review_id: review_flow,
                query: review_query,
                user_id: userInfo?.employee?.id.toString(),
                document_title: documenttitle
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/Review/AddReview`, {
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
            setReviewflowdata([]);
            GetReviewById(uuidin);
            update_2();



            await new Promise(resolve => setTimeout(resolve, 500));

            //改變單據狀態
            const conditionModel2 = {
                type: type,
                purchaserequisitionuuid: uuidin,
                username: userInfo?.employee?.id.toString()
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel2),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response2 = await fetch(`${setting.apipath}/WareHouse/sentPRToReview?${queryParams}`);
            if (!response2.ok) {
                throw new Error('Failed to fetch data');
            }
            const data2 = await response2.json();

            GetDetailById(uuidin);
            GetReviewById(uuidin)
            setStatusin("審核中");
            setReviewbar(false);






            // }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    }

    const handleChoseflow = () => {
        setReviewbar(true);
        setDocumenttitle(`【${pagename}】【${idin}】_${userInfo?.employee?.chName.toString()}`)
    }

    const handleGetReviewBack = () => {
        myAlert.confirm({
            title: '確定要抽單嗎?',
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            document_uuid: uuidin,
                        };

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };


                        const response = await fetch(`${setting.apipath}/Review/GetReviewBack`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }

                        setReviewflowdata([]);
                        setStatusin("編輯中");
                        setReview_flow("");
                        setValue(null);
                        GetReviewHistory(uuidin);
                        update_2();

                    } catch (error: any) {
                        console.log(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }
                }
            }
        });
    }

    const GetReviewHistory = async (id: any) => {
        try {
            // setIsLoading(true);
            // alert(purchaserequisitionidin);
            const conditionModel = {
                document_uuid: id
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewHistory?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const text = await response.text();
            if (!text) {
                // console.log('No data returned');
                setReviewhistorydata([]);
                return;
            }

            const data = JSON.parse(text);
            setReviewhistorydata(data);
            console.log(reviewhistroydata);


        } catch (error: any) {
            console.log(error);
        }
        finally {
            // setIsLoading(false);
        }
    }
    //#endregion

    //#region ===========【單據功能區】
    //編輯
    const handleEdit = () => {
        setOriginalcreate_at(create_atin);
        setOriginalneed_date(need_datein);
        setOriginalnote(notein);
        setOriginaldata2([...data2]); // 確保保存的是當前資料的副本
        setIsEditing(true) // 進入編輯模式
    };

    //取消編輯
    const handleCancel = () => {
        setCreate_atin(originalcreate_at);
        setNeed_datein(originalneed_date);
        setNotein(originalnote);
        setData2([...originaldata2]);  // 確保還原為原始資料
        setIsEditing(false);  // 結束編輯模式
    };

    //作廢單據
    const handleDelete = () => {
        myAlert.confirm({
            title: '確定刪除嗎?',
            props: {
                onOk: () => {
                    NewDeletePurchaseRequisition();
                }
            }
        })
    }

    //複製單據
    const handleCopy = () => {
        myAlert.confirm({
            title: '確定複製嗎?',
            props: {
                onOk: () => {
                    Add();
                }
            }
        })

    }

    //列印單據
    const handlePrint = () => {
        Print();
    }

    //匯出單據
    const handleExport = () => {
        Excel(idin, "", "")
    }

    //#endregion

    //#region ===========【明細功能區】
    // 新增明細
    const handleAddDetail = () => {

        const emptyDetail = {
            purchaserequisitiondetailuuid: "",
            productuuid: "",
            productid: "",
            quantity: 0,
            totalprice: 0,
            note: "",
            purchaserequisitionid: "",
            unitprice: 0,
            purchaserequisitionuuid: "",
            name: "",
            spec: "",
            unit: "",
            suppliername: null,
            deliverydate: null,
            status: null,
            quotereqdetailuuid: null,
            suppliertaxid: null,
            supplieraddress: null,
            supplierphone: null,
            suppliercontact: null,
            supplierfax: null
        };

        // 將空資料新增進陣列
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
                }
            }
        });
        // RemovePurchaseRequisitionDetail(item.purchaserequisitiondetailuuid);
    };

    //更新明細資料
    const handleStringChange = (index: number, key: string, value: string) => {
        const updatedData2 = [...data2];  // 使用淺拷貝
        updatedData2[index] = { ...updatedData2[index], [key]: value };  // 確保更改的只是副本
        setData2(updatedData2);  // 更新data2

        if (key === 'productid' || key === 'name' || key === 'spec') {
            const filters = {
                productid: updatedData2[index].productid?.trim().toLowerCase() || "",
                name: updatedData2[index].name?.trim().toLowerCase() || "",
                spec: updatedData2[index].spec?.trim().toLowerCase() || ""
            };

            if (Object.values(filters).some(filter => filter !== "")) {
                const filtered = data.filter(item =>
                    (!filters.productid || item.productid?.toLowerCase().includes(filters.productid)) &&
                    (!filters.name || item.name?.toLowerCase().includes(filters.name)) &&
                    (!filters.spec || item.spec?.toLowerCase().includes(filters.spec))
                );

                setFilteredData(filtered);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
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
            const price = typeof element.totalprice === 'string'
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
        const taxPrice = Math.round((roundedTotalPrice * 0.05) * 100) / 100;
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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const isSelectingRef = useRef(false);

    useEffect(() => {

        if (isSelectingRef.current) return;

        let filtered = searchbardata;
        if (handinputproductid !== "" || handinputname !== "" || handinputspec != "") {
            if (handinputproductuuid) {
                let filtered = searchbardata;
                filtered = searchbardata.filter(item =>
                    item.id.includes(handinputproductuuid)
                );
            }
            if (handinputproductid) {
                filtered = filtered.filter(item =>
                    item.productid.includes(handinputproductid)
                );
            }

            if (handinputname) {
                filtered = filtered.filter(item =>
                    item.name.includes(handinputname)
                );
            }

            if (handinputspec) {
                filtered = filtered.filter(item =>
                    item.spec && item.spec.includes(handinputspec)
                );
            }

            setFilteredData(filtered);
            // const shouldShowSuggestions = filtered.length > 0 && (materialnumber || productname || productspec) && canedit === true;
            setShowSuggestions(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));

            console.log(showSuggestions);
            console.log(filtered);
        }
        else {
            setHandinputproductuuid('');
            setFilteredData([]);
            setShowSuggestions(false);
        }
    }, [handinputproductid, handinputname, handinputspec]);

    //點選物料
    const handleSelect = (selectedItem: any) => {
        const updatedData2 = [...data2];
        const index = currentindex; // 假設 currentIndex 保存了目前正在編輯的行
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
    };

    //點選物料後控制，使用ESC關閉等狀態監控
    const dropdownRef = useRef<HTMLUListElement | null>(null);
    useEffect(() => {
        // 按下 ESC 鍵關閉下拉選單
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 27) { // ESC 鍵的 keyCode 是 27
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


    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            <PageHeader02 tag={pagename + "單" + "：" + statusin} panelList={panelList}
                customeRight={[
                    <>
                        {viewtype !== "review" && (
                            <>
                                {statusin === "已核准" && (
                                    <>
                                        <button
                                            className={scss.shortredsquarebtn}
                                            style={{ display: `${statusin === '已核准' ? '' : 'none'}` }}
                                            title="單據結案"
                                            onClick={() => { alert("結案") }}>
                                            結案
                                        </button>

                                    </>
                                )}
                                <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        handleCopy();
                                    }}
                                    title="複製單據"
                                >
                                    複製
                                </button>
                                {/* 編輯按鈕 */}
                                {statusin === "編輯中" && !isEditing && (

                                    <>
                                        <button
                                            className={scss.shortredsquarebtn}
                                            onClick={() => {
                                                handleDelete();
                                            }}
                                            title="刪除單據"
                                        >
                                            刪除
                                        </button>
                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                setReviewbar(true);
                                                setDocumenttitle(`【${pagename}】【${idin}】_${userInfo?.employee?.chName.toString()}`)
                                            }}
                                            title="審核流程"
                                        >
                                            審核流程
                                        </button>

                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                handleEdit()
                                            }}
                                        >
                                            編輯
                                        </button>
                                    </>
                                )}

                                {statusin === "審核中" && (
                                    <>
                                        <button
                                            className={scss.shortredsquarebtn}
                                            style={{ display: `${statusin === '審核中' ? '' : 'none'}` }}
                                            title="單據抽回"
                                            onClick={() => { handleGetReviewBack() }}>
                                            抽單
                                        </button>

                                    </>
                                )}
                                {!isEditing && (
                                    <>
                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                myAlert.confirm({
                                                    title: `確定要返回${pagename}單列表嗎?`,
                                                    content: <>
                                                        <h1>未儲存的資料將不會保留</h1>
                                                    </>,
                                                    props: {
                                                        onOk: () => {
                                                            router.back();
                                                        }
                                                    }
                                                })
                                            }}
                                        >
                                            返回
                                        </button >
                                    </>
                                )}
                                {/* 儲存按鈕 */}
                                {statusin === "編輯中" && isEditing && (
                                    <>
                                        <button
                                            className={scss.shortredsquarebtn}
                                            onClick={() => {
                                                setIsEditing(false); // 儲存後結束編輯模式
                                                Update()

                                                // NewAddPurchaseRequisition(); // 實際儲存邏輯
                                            }}
                                        >
                                            儲存
                                        </button>
                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                myAlert.confirm({
                                                    title: '確定要取消嗎?',
                                                    content: <>
                                                        <h1>未儲存的資料將不會保留</h1>
                                                    </>,
                                                    props: {
                                                        onOk: () => {
                                                            handleCancel()
                                                        }
                                                    }
                                                })
                                            }}
                                        >
                                            取消
                                        </button>

                                    </>

                                )}
                            </>
                        )}
                    </>


                ]
                }
                customeLeft={
                    [
                        <>
                            {/* <span style={{ fontSize: '18px', paddingLeft: '10px' }}>
                                {statusin}
                            </span> */}
                            {viewtype !== "review" && (
                                <>
                                    {printopen && (
                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                handlePrint();
                                            }}
                                            title="列印單據"
                                            style={{ margin: '0px 10px' }}
                                        >
                                            <span style={{ paddingRight: '5px' }}>
                                                <img src={icon_print.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                            </span>
                                            列印
                                        </button>
                                    )}
                                    {excelopen && (

                                        <button
                                            className={scss.shortsquarebtn}
                                            onClick={() => {
                                                handleExport();
                                            }}
                                            title="匯出單據"
                                            style={{ margin: '0px 10px' }}
                                        >
                                            <span style={{ paddingRight: '5px' }}>
                                                <img src={icon_export.src} alt="Excel" style={{ height: '20px', width: '20px' }} />
                                            </span>
                                            Excel
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    ]} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        {/* <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                            </div>
                            <div>
                                <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlePreAddPR() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button
                                    className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleAddPR() }}
                                    title="儲存新增"
                                    disabled={status !== '未儲存'}
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
                                    onClick={() => { handlecancelAddPR() }}
                                    title="取消新增"
                                    disabled={status !== '未儲存'}
                                >
                                    <img src={status === '未儲存' ? icon_cancel.src : icon_cancel_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handleDeletePR(purchaserequisitionuuid) }} title="單據刪除">
                                    <img src={icon_delete.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    刪除
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handlesaveAddPRDetail() }} title="單據申請">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    送出
                                </button>
                            </div>
                        </div> */}
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
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
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="請購日期"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') || '',
                                                },
                                            }}

                                        /> */}
                                        <InputSel
                                            caption="建立日期"
                                            className="global_tip_must"
                                            disabled={!isEditing}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: create_atin ? moment(create_atin) : null,
                                                    onChange: (e) => { setCreate_atin(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />
                                        {/* <InputSel
                                            caption="請購類別"
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
                                        {/* <button onClick={() => { alert("OK") }}>
                                            ...
                                        </button> */}
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="排版用"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            className='invisible'
                                            inputProps={{
                                                props: {
                                                    value: ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="排版用"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            className='invisible'
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
                                        /> */}
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            disabled={!isEditing}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: need_datein ? moment(need_datein) : null,
                                                    onChange: (e) => { setNeed_datein(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />

                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註說明"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: notein,
                                                    onChange: (e) => { setNotein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                    <div></div>
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
                                        {/* <InputSel
                                        {...inputSelProps}
                                        caption="合計"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: status || ' ',
                                                },
                                                }}
                                                /> */}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{ paddingBottom: '18px' }}
                        >
                            <span
                                style={{
                                    height: '50px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'center', // 水平置中
                                    alignItems: 'center',     // 垂直置中
                                    fontSize: '18px'
                                }}
                            >
                                請購項目
                            </span>
                        </div>
                        <div className={scss.head_content1}>

                            <InputSel
                                {...inputSelProps}
                                caption="品項數量"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        type: "number",
                                        // style: { color: 'red' },
                                        value: data2.length,
                                    },
                                }}
                            />
                        </div>
                        <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px' }}>

                            <div className={scss.body_content1} style={{ overflowX: 'auto', position: 'relative' }}>
                                {/* <Thead01 type={'AddPR_ReqList'} /> */}
                                <div className={scss.thead20}>
                                    <span>

                                    </span>
                                    <span>序</span>
                                    <span>料號</span>
                                    <span>品名</span>
                                    <span>規格</span>
                                    <span>已轉</span>
                                    <span>數量</span>
                                    <span>單位</span>
                                    <span>單價</span>
                                    <span>總價</span>
                                    <span>備註(用途說明)</span>
                                    <span></span>
                                    <span></span>
                                </div>
                                {data2 && (
                                    data2.map((_item, index) => {
                                        const Totalprice = parseFloat(_item.quantity) * parseFloat(_item.unitprice);
                                        _item.totalprice = Totalprice
                                        return (
                                            <CellWithBar key={index} className={scss.panelHeader20}>
                                                <div className={scss.row01}>
                                                    <span>
                                                        <button style={{ display: (statusin === "編輯中" && isEditing) ? '' : 'none' }} onClick={() => { handleRemoveDetail(index, _item) }}>
                                                            {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                            <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                        </button>
                                                    </span>
                                                    <span>{index + 1}</span>
                                                    <span>
                                                        <input
                                                            ref={productidRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                            // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            style={{ backgroundColor: 'transparent', borderBottom: (isEditing ? "1px solid black" : ""), width: '95%' }}
                                                            type="text"
                                                            value={_item.productid !== undefined ? _item.productid : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "productid", e.target.value);
                                                                setCurrentIndex(index);
                                                                // setHandinputproductid(e.target.value);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={nameRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                            // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            style={{ backgroundColor: 'transparent', borderBottom: (isEditing ? "1px solid black" : ""), width: '95%' }}
                                                            type="text"
                                                            value={_item.name !== undefined ? _item.name : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "name", e.target.value);
                                                                setCurrentIndex(index);
                                                                // setHandinputname(e.target.value);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={specRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            style={{ backgroundColor: 'transparent', borderBottom: (isEditing ? "1px solid black" : ""), width: '95%' }}
                                                            type="text"
                                                            value={_item.spec !== undefined ? _item.spec : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "spec", e.target.value);
                                                                setCurrentIndex(index);
                                                                // setHandinputspec(e.target.value);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={po_quantityRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderBottom: isEditing ? "1px solid black" : "",
                                                                width: '95%',
                                                            }}
                                                            type={isEditing ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isEditing ? _item.po_quantity : Number(_item.po_quantity).toLocaleString()}
                                                            readOnly={true}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "po_quantity", e.target.value); {/* 處理變更 */ }
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={quantityRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderBottom: isEditing ? "1px solid black" : "",
                                                                width: '95%',
                                                            }}
                                                            type={isEditing ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isEditing ? _item.quantity : Number(_item.quantity).toLocaleString()}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "quantity", e.target.value); {/* 處理變更 */ }
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={unitRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            style={{ backgroundColor: 'transparent', borderBottom: (isEditing ? "1px solid black" : ""), width: '95%' }}
                                                            type="text"
                                                            value={_item.unit !== undefined ? _item.unit : ''}
                                                            // readOnly
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "unit", e.target.value);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={unitpriceRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderBottom: isEditing ? "1px solid black" : "",
                                                                width: '95%',
                                                            }}
                                                            type={isEditing ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isEditing ? _item.unitprice : Number(_item.unitprice).toLocaleString()}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                // handleStringChange(index, "unitprice", e.target.value); {/* 處理變更 */ }
                                                                const newData = [...data2];
                                                                const newUnitprice = e.target.value;
                                                                newData[index] = {
                                                                    ...newData[index],
                                                                    unitprice: isEditing ? newUnitprice : parseFloat(newUnitprice.replace(/,/g, ''))

                                                                };
                                                                setData2(newData);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={totalpriceRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                // borderBottom: isEditing ? "1px solid black" : "",
                                                                width: '95%',
                                                            }}
                                                            type={isEditing ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isEditing ? _item.totalprice : Number(_item.totalprice).toLocaleString()}
                                                            // readOnly={!isEditing}
                                                            readOnly
                                                            onChange={(e) => {
                                                                handleStringChange(index, "totalprice", e.target.value); {/* 處理變更 */ }
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={noteRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                            // style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            style={{ backgroundColor: 'transparent', borderBottom: (isEditing ? "1px solid black" : ""), width: '95%' }}
                                                            type="text"
                                                            value={_item.note !== undefined ? _item.note : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "note", e.target.value);
                                                            }}
                                                        />
                                                    </span>


                                                </div>
                                            </CellWithBar>
                                        );

                                    })
                                )}
                            </div>
                            {statusin === "編輯中" && isEditing && (
                                <span style={{ paddingLeft: '22px', position: 'relative' }}>
                                    <button onClick={() => { handleAddDetail() }} style={{ fontSize: '18px' }}>
                                        <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                                        新增品項
                                    </button>
                                </span>
                            )}
                        </div>
                        <div className={scss.body_foot1}>
                            <div>
                                {filteredData.length > 0 && (
                                    <ul ref={dropdownRef}
                                        style={{
                                            border: '1px solid #c1c1c1',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            marginTop: '0px',
                                            position: 'sticky',  /* 設置為sticky */
                                            bottom: '0',  /* 固定在底部 */
                                            left: '20px',
                                            width: '1000px',
                                            backgroundColor: 'white',
                                            zIndex: 1004,
                                            display: `${showSuggestions ? '' : 'none'}`  /* 根據showSuggestions控制顯示 */
                                        }}>
                                        {filteredData.map(item => (
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
                                                    alignItems: 'center' // 垂直置中
                                                }}
                                            >
                                                <span style={{ flex: '1 1 20%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                    {item.productid}
                                                </span>
                                                <span style={{ flex: '1 1 47%' }}> {/* 40% 的寬度，根據需要調整 */}
                                                    {item.name}
                                                </span>
                                                <span style={{ flex: '1 1 30%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                    {item.spec}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>

                            </div>
                            <div>
                            </div>
                        </div>
                        <div
                            style={{
                                paddingTop: '18px',
                                paddingBottom: '18px'
                            }}
                        >
                            <span
                                style={{
                                    height: '50px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'center', // 水平置中
                                    alignItems: 'center',     // 垂直置中
                                    fontSize: '18px'
                                }}
                            >
                                審核流程
                            </span>
                        </div>
                        {/* <div className={scss.body_foot2}> */}
                        <div>
                            {reviewflowdata.length === 0 && reviewflowdata2.length === 0 ? (
                                <div style={{ textAlign: 'center', fontSize: '20px', color: '#888' }}>
                                    尚未送審
                                </div>
                            ) : (
                                reviewflowdata.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-evenly', // 水平均分
                                            alignItems: 'center', // 垂直置中
                                            gap: '10px',
                                        }}
                                    >
                                        {item.stages.map((stage: any, stageIndex: any) => (
                                            <div
                                                key={stageIndex}
                                                style={{
                                                    flex: 1, // 平均分配空間
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'left', // 子項目置中
                                                    textAlign: 'center', // 文字置中
                                                    margin: '0 10px',
                                                }}
                                            >
                                                <span style={{ fontSize: '20px', color: '#14256a', fontWeight: '400', textAlign: 'left' }}>
                                                    {stage.review_title}
                                                </span>
                                                <div
                                                    style={{
                                                        fontSize: '18px',
                                                        display: 'flex', // 使名字和圖示並排
                                                        alignItems: 'center', // 讓它們垂直對齊
                                                        textAlign: 'left', // 讓文字靠左對齊
                                                    }}
                                                >
                                                    <span>{stage.review_person}</span>
                                                    {stage.review_time !== "0001-01-01T00:00:00" && (
                                                        <span style={{ paddingLeft: '5px' }}>
                                                            <img
                                                                src={icon_review.src}
                                                                alt="review_status"
                                                                style={{
                                                                    width: '25px',
                                                                    height: '25px',
                                                                }}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                            {reviewflowdata2.length > 0 ? (
                                reviewflowdata2.map((item, index) => (
                                    <div key={index} style={{
                                        flex: 1, // 平均分配空間
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left', // 子項目置中
                                        textAlign: 'center', // 文字置中
                                        margin: '0 10px',
                                    }}>
                                        <span style={{ fontSize: '20px', color: '#14256a', fontWeight: '500', textAlign: 'left' }}>
                                            {item.stage_user_title}
                                        </span>
                                        <div style={{
                                            fontSize: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            textAlign: 'left',
                                        }}>
                                            <span>{item.stage_user_name}</span>
                                            {/* 如果有需要顯示圖示，在此處添加 */}
                                        </div>
                                    </div>
                                ))
                            ) : (

                                <></>
                            )}
                        </div>
                        {/* </div> */}
                        <div
                            style={{
                                paddingTop: '18px',
                                paddingBottom: '18px'
                            }}
                        >
                            <span
                                style={{
                                    height: '50px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'center', // 水平置中
                                    alignItems: 'center',     // 垂直置中
                                    fontSize: '18px'
                                }}
                            >
                                審核紀錄
                            </span>
                        </div>
                        {reviewhistroydata.length === 0 ? (
                            <div style={{ textAlign: 'center', fontSize: '20px', color: '#888' }}>
                                尚無紀錄
                            </div>
                        ) : (
                            <>
                                <div className={scss.head_content1}>

                                    <InputSel
                                        {...inputSelProps}
                                        caption="審核次數"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                type: "number",
                                                // style: { color: 'red' },
                                                value: reviewhistroydata.length,
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px' }}>
                                    <div className={scss.body_content1} >
                                        <div style={{ overflowX: 'auto' }}>
                                            <Thead01 type={'ReviewHistory2'} />
                                            {reviewhistroydata && (
                                                reviewhistroydata.map((_item: any, index: number) => (
                                                    <CellWithBar key={index} className={scss.panelHeader18} >
                                                        <div className={scss.row01}>
                                                            <span>{index + 1}</span>
                                                            <span>{getTaiwanDateStr(_item.create_at)}</span>
                                                            <span>{_item.document_status}</span>
                                                            <span>{_item.current_stage}</span>
                                                            <span>{_item.review_person}</span>
                                                            <span>{_item.review_memo}</span>
                                                        </div>
                                                    </CellWithBar>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 審核 */}
                {/* <DragableModal
                    handleText="審核流程"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={reviewbar}
                    onCrossClick={() => { setReviewbar(false) }}
                >
                    <div style={{ padding: '0px 5px' }}>
                        <span style={{ fontSize: '18px' }}>送審主旨</span>
                        <input placeholder="主旨"
                            style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
                            value={documenttitle}
                            onChange={(e) => { setDocumenttitle(e.target.value) }}
                        />
                        <Radio.Group onChange={onChange} value={value} style={{ paddingTop: '5px' }}>
                            <Space direction="vertical">
                                {reviewdata.map((_item: any) => (
                                    <Radio key={_item.id} value={_item.id} onClick={() => { setReview(_item) }} style={{ fontSize: '18px', width: '1000px', borderBottom: '1px solid #ccc', padding: '5px' }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                            <span style={{ width: '150px' }}>
                                                {_item.name}
                                            </span>
                                            <span>
                                                {_item.stages.map((_stage: any, index: number) => (
                                                    <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                                                        {_stage.review_type}：{_stage.stage_user_name}
                                                        {index < _item.stages.length - 1 && (
                                                            <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                        )}
                                                    </div>
                                                ))}
                                            </span>
                                        </div>
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>
                    <button>
                        送審
                    </button>
                </DragableModal> */}

                <Modal
                    visible={reviewbar}
                    onCancel={() => {
                        setReviewbar(false)
                    }}
                    width="1010px"
                    closable={false}  // 移除右上角的叉叉
                    style={{ top: 150, }}
                    bodyStyle={{ padding: 0, height: '300px', overflowY: 'auto' }}
                    title={
                        <>
                            <span style={{ fontSize: '18px' }}>送審主旨</span>
                            <input placeholder="主旨"
                                style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
                                value={documenttitle}
                                onChange={(e) => { setDocumenttitle(e.target.value) }}
                            />
                        </>
                    }
                    footer={
                        <button className={scss.shortredsquarebtn}
                            onClick={() => {
                                if (data2.length === 0) {
                                    myAlert.warning({ title: '尚未加入請購項目' })
                                    return;
                                } else if (review_flow === '') {
                                    myAlert.warning({ title: '請選擇審核流程' })
                                    return;
                                }
                                else {
                                    sentToReview("審核");
                                    setReviewbar(false);
                                    setStatusin("審核中");
                                }
                            }}>
                            送審
                        </button>
                    }
                >
                    <div style={{ padding: '0px 5px' }} >
                        <div style={{ maxHeight: '520px', overflow: 'auto' }}>  {/* 新增一個 div 包裹 Radio 群組 */}
                            <Radio.Group onChange={onChange} value={value} style={{ paddingTop: '5px' }}>
                                <Space direction="vertical">
                                    {reviewdata.map((_item: any) => (
                                        <Radio key={_item.id} value={_item.id} onClick={() => { setReview(_item) }} style={{ fontSize: '18px', width: '1000px', borderBottom: '1px solid #ccc', padding: '5px' }} >
                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                                <span style={{ width: '150px' }}>
                                                    {_item.name}
                                                </span>
                                                <span style={{ width: '100%' }}>
                                                    {_item.stages.map((_stage: any, index: number) => (
                                                        <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                                                            {_stage.review_type}：{_stage.stage_user_name}
                                                            {index < _item.stages.length - 1 && (
                                                                <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </span>
                                            </div>
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </div>
                    </div>
                </Modal>
            </div>
        </SubLayer >

    )

}