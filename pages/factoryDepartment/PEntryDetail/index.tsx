import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './PEntryDetail.module.scss';
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
import { Modal, Pagination, Radio, Space } from 'antd';
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
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import { title } from 'process';
import icon_tray_in from 'public/image/icon/fc_tray_in.svg';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function PEntryDetail() {
    //#region ===========【頁面參數】
    const [pagename, setPagename] = useState<string>("入庫")
    const [statusarea, setStatusarea] = useState<boolean>(true)
    const [excelopen, setExcelopen] = useState<boolean>(false)
    const [printopen, setPrintopen] = useState<boolean>(false)
    const [reviewopen, setReviewopen] = useState<boolean>(false)
    const [transtitle, setTranTitle] = useState<string>("")
    const [transopen, setTransopen] = useState<boolean>(false)
    //#endregion
    //#region ===========【路由參數】
    const router = useRouter();
    const {
        firstin,
        item
    } = router.query;

    const parsedItem = item ? JSON.parse(item as string) : null;
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
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [data3, setData3] = useState<any[]>([]);
    const [customerdata, setCustomerdata] = useState<any[]>([]);
    const [prbardata, setPrbarData] = useState<any[]>([]);
    const [data4, setData4] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const totalpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const wantinquantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const po_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const remaining_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));

    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    // const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    // const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    // const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>('');
    // const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>('');
    const [idin, setidin] = useState<string>("");
    const [uuidin, setuuidin] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [need_datein, setNeed_datein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [supplierfaxin, setSupplierfaxin] = useState<string>("");
    const [supplieridin, setSupplieridin] = useState<string>("");
    const [supplieruuidin, setSupplieruuidin] = useState<string>("");
    const [suppliercontactin, setSuppliercontactin] = useState<string>("");
    const [shippingaddressin, setShippingaddressin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState('請選擇類別');
    const [purchaseorderid, setPurchaseorderid] = useState<string>("");
    const [batchidin, setBatchidin] = useState<string>("");

    //編輯時保留原始資料
    const [originalsuppliername, setOriginalsuppliername] = useState<string>("");
    const [originalsupplierphone, setOriginalsupplierphone] = useState<string>("");
    const [originalsuppliertaxid, setOriginalsuppliertaxid] = useState<string>("");
    const [originalsupplieraddress, setOriginalsupplieraddress] = useState<string>("");
    const [originalshippingaddress, setOriginalshippingaddress] = useState<string>("");
    const [originalinvoice, setOriginalInvoice] = useState<string>("");
    const [originalcreate_at, setOriginalcreate_at] = useState<string>("");
    const [originalneed_date, setOriginalneed_date] = useState<string>("");
    const [originalnote, setOriginalnote] = useState<string>("");
    const [originaldata2, setOriginaldata2] = useState<any[]>([]);

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");
    const [keyword5, setKeyword5] = useState<string>("");
    const [keyword6, setKeyword6] = useState<string>("");
    const [keyword7, setKeyword7] = useState<string>("");
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
    const [isTrans, setIsTrans] = useState(false);
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
            getCustomers();
            GetReviewFlow();//審核
            getPorder();
            hasFetchedData.current = true;
        }
    }, []);

    useEffect(() => {
        console.log(parsedItem);
        setuuidin(parsedItem?.prodentryuuid);
        setidin(parsedItem?.prodentryid)
        GetDetailById(parsedItem?.prodentryuuid);
        GetReviewById(parsedItem?.prodentryuuid);
        GetReviewHistory(parsedItem?.prodentryuuid);
        setCreate_byin(parsedItem?.create_by);
        setCreate_atin(parsedItem?.create_at);
        setNeed_datein(parsedItem?.need_date);
        setStatusin(parsedItem?.status);
        setNotein(parsedItem?.note);
        setSuppliernamein(parsedItem?.suppliername);
        setSupplieraddressin(parsedItem?.supplieraddress);
        setSupplierphonein(parsedItem?.supplierphone);
        setSuppliertaxidin(parsedItem?.suppliertaxid);
        setShippingaddressin(parsedItem?.shippingaddress);
        setInvoicein(parsedItem?.invoice);
        setBatchidin(parsedItem?.batchid);

    }, [item]);
    //#endregion

    //#region ===========【API】

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

            const data = {
                suppliername: suppliernamein,
                supplierphone: supplierphonein,
                suppliertaxid: suppliertaxidin,
                supplieraddress: supplieraddressin,
                supplierid: supplieridin,
                shippingaddress: shippingaddressin,
                suppliercontact: suppliercontactin,
                supplierfax: supplierfaxin,
                supplieruuid: supplieruuidin,
            };

            const conditionModel = {
                prodreceiptid: idin,
                prodreceiptuuid: uuidin,
                data: data,
                create_at: create_atin,
                need_date: need_datein,
                note: notein,
                batchid: batchidin,
                data2: data2
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewUpdateProdReceiptDetail`, {
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
                getPorder();
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
    const Delete = async () => {
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
            const response = await fetch(`${setting.apipath}/WareHouse/NewDeletePEntry?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                router.push({
                    pathname: `/factoryDepartment/PEntryList`,
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
                            type: "purchaseorder",
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
                type: 'purchaseorder',
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

    //複製單據(同新增單據)
    const Add = async () => {
        if (data2.length === 0) {
            myAlert.warning({ title: "進貨項目不可為空" })
            return;
        }
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                create_at: create_atin,
                need_date: moment(need_datein).format('YYYY-MM-DD'),
                create_by: userInfo?.employee?.id.toString(),
                note: notein,
                data2: data2,
                username: userInfo?.employee?.id.toString(),
                purchaseorderid: purchaseorderid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewAddProdReceipt`, {
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
                setidin(result.id);
                setuuidin(result.uuid);
                setStatusin("進貨中");
                router.push({
                    pathname: `/factoryDepartment/PReceiptList`,
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

    //取請購(轉採購用)
    const getPorder = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPOrderForAddPReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setData4(responsedata);
            setPrbarData(responsedata);
            console.log(responsedata);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //轉換單據
    const Trans = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                prodreceiptuuid: uuidin,
                username: userInfo?.employee?.id.toString(),
                note: notein,
                data2: data2
                // create_at: moment().format('YYYY-MM-DD') || '',
                // need_date: need_datein,
                // create_by: userInfo?.employee?.id.toString(),
                // suppliername: suppliernamein,
                // supplierphone: supplierphonein,
                // suppliertaxid: suppliertaxidin,
                // supplieraddress: supplieraddressin,
                // supplierid: supplieridin,
                // shippingaddress: shippingaddressin,
                // suppliercontact: suppliercontactin,
                // supplierfax: supplierfaxin,
                // supplieruuid: supplieruuidin,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewTransferPReceiptToPEntry`, {
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
                myAlert.success({ title: result.message, content: result.id });
                // setidin(result.id);
                // setuuidin(result.uuid);

                // router.push({
                //     pathname: `/factoryDepartment/POrderList`,
                //     query: {
                //     },
                // });
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

    //轉換紀錄
    const GetTransById = async (id: any) => {
        try {
            const conditionModel = {
                purchaseorderid: id
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPReceiptById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();
            setData3(responsedata);

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
                purchaseorderuuid: uuidin,
                purchaseorderid: idin,
                create_at: create_atin,
                create_by: create_byin,
                status: '進貨中',
                need_date: need_datein,
                note: notein,
                firstin: 1,
            };

            const conditionModel = {
                document_id: idin,
                document_uuid: uuidin,
                document_type: pagename,
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


            await new Promise(resolve => setTimeout(resolve, 500));

            //改變單據狀態
            const conditionModel2 = {
                type: type,
                purchaseorderuuid: uuidin,
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
        setDocumenttitle(`【請購單】【${idin}】_${userInfo?.employee?.chName.toString()}`)
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
                        setStatusin("進貨中");
                        setReview_flow("");
                        setValue(null);
                        GetReviewHistory(uuidin);

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
        setOriginalsuppliername(suppliernamein);
        setOriginalsupplieraddress(supplieraddressin);
        setOriginalsupplierphone(supplierphonein);
        setOriginalsuppliertaxid(suppliertaxidin);
        setOriginalshippingaddress(shippingaddressin);
        setIsEditing(true) // 進入編輯模式
    };

    //取消編輯
    const handleCancel = () => {
        setCreate_atin(originalcreate_at);
        setNeed_datein(originalneed_date);
        setNotein(originalnote);
        setData2([...originaldata2]);  // 確保還原為原始資料
        setSuppliernamein(originalsuppliername);
        setSupplieraddressin(originalsupplieraddress);
        setSupplierphonein(originalsupplierphone);
        setSuppliertaxidin(originalsuppliertaxid);
        setShippingaddressin(originalshippingaddress);
        setIsEditing(false);  // 結束編輯模式

        setIsTrans(false);  //結束進貨模式
        setPrbar(false);
    };

    //作廢單據
    const handleDelete = () => {
        myAlert.confirm({
            title: '確定刪除嗎?',
            props: {
                onOk: () => {
                    Delete();
                }
            }
        })
    }

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

    //編輯進貨
    const handleEditTrans = () => {
        setOriginalcreate_at(create_atin);
        setOriginalneed_date(need_datein);
        setOriginalnote(notein);
        setOriginaldata2([...data2]); // 確保保存的是當前資料的副本
        setOriginalsuppliername(suppliernamein);
        setOriginalsupplieraddress(supplieraddressin);
        setOriginalsupplierphone(supplierphonein);
        setOriginalsuppliertaxid(suppliertaxidin);
        setOriginalshippingaddress(shippingaddressin);
        setIsTrans(true);
    }

    //新增進貨
    const handleAddTrans = async () => {
        await Trans(); // 確保 Trans 完成
        setIsTrans(false);
        GetDetailById(uuidin);
        // GetTransById(idin);//轉換紀錄
    };


    //列印單據
    const handlePrint = () => {
        Print();
    }

    //匯出單據
    const handleExport = () => {
        Excel(idin, "po", "")
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
            setShowSuggestions(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));

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

    //#region ===========【廠商篩選】
    const [customerbar, setCustomerbar] = useState(false);
    const [countyOptions, setCountyOptions] = useState<string[]>([]);
    const [filteredData2, setFilteredData2] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        county: '',
        name: '',
        contact: ''
    });

    // 根據篩選條件更新資料
    useEffect(() => {
        const filtered = customerdata.filter(item =>
            (filters.county === '' || item.county === filters.county) &&
            (filters.name === '' || item.name.includes(filters.name)) &&
            (filters.contact === '' || item.contact.includes(filters.contact))
        );
        setFilteredData2(filtered);
    }, [filters]);

    //#endregion

    //#region  ===========【採購帶入功能區】
    const [prbar, setPrbar] = useState(false);



    //#endregion

    //#region ===========【採購單篩選】

    const [filteredData3, setFilteredData3] = useState(data4); // 儲存篩選後的資料

    // 當 keyword5, keyword6, keyword7 變化時進行篩選
    useEffect(() => {
        const filteredData = data4.filter((item) => {
            const matchesKeyword4 = keyword4 ? item.suppliername?.includes(keyword4) : true;
            const matchesKeyword5 = keyword5 ? item.purchaseorderid?.includes(keyword5) : true;
            const matchesKeyword6 = keyword6 ? item.name?.includes(keyword6) : true;
            const matchesKeyword7 = keyword7 ? item.spec?.includes(keyword7) : true;

            return matchesKeyword4 && matchesKeyword5 && matchesKeyword6 && matchesKeyword7;
        });

        setFilteredData3(filteredData);
        setCurrentPage(1); // 當篩選條件改變時，重置當前頁數
    }, [keyword4, keyword5, keyword6, keyword7, data4]); // 監聽依賴項目

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

    const [whpnumber, setWhpnumber] = useState<string>("");
    const [whpproductid, setWhpproductid] = useState<string>("");
    const [whpname, setWhpname] = useState<string>("");
    const [whpspec, setWhpspec] = useState<string>("");
    const [whpquantity, setWhpquantity] = useState<string>("");

    const [maxinboxquantity, setMaxinboxquantity] = useState<number>(0);
    const [inboxquantity, setInboxquantity] = useState<number>(0);

    const [traycalled, setTraycalled] = useState<boolean>(false);
    const [whnamecalled, setWhnamecalled] = useState<string>("");
    const [traynamecalled, setTraynamecalled] = useState<string>("");
    const [whpnamecalled, setWhpnamecalled] = useState<string>("");


    const [selectedOption, setSelectedOption] = useState(''); // 預設選項
    const [selectWhnamedata, setSelectwhnamedata] = useState<any[]>([]);
    const [selecttraynamedata, setSelecttraynamedata] = useState<any[]>([]);

    const [nowname, setNowname] = useState<string>("");
    const [nowproductid, setNowproductid] = useState<string>("");
    const [nowspec, setNowspec] = useState<string>("");
    const [nowquantity, setNowquantity] = useState<string>("");
    const [nowwhname, setNowwhname] = useState<string>("");
    const [nowtrayname, setNowtrayname] = useState<string>("");
    const [nowwhposition, setNowwhposition] = useState<string>("");
    const [nowentryqty, setNowentryqty] = useState<string>("");
    const [nowwhpositionuuid, setNowwhpositionuuid] = useState<string>("");
    const [nowprodentrydetailuuid, setNowprodentrydetailuuid] = useState<string>("");

    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');

    const [modalcheckfirstin, setModalcheckfirstin] = useState<number>(0);

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


    const whpositionqModalClose = async () => {
        setWhpositionqmodalopen(false);
    }


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

    function handleinbox(item: any) {
        setWhpnumber('');
        setWhpproductid('');
        setWhpname('');
        setWhpspec('');
        setWhpquantity('');
        setData3([]);
        setData11([]);
        getWhpositionDetailByProductId(item.productid);
        setWhpositionqmodalopen(!whpositionqmodalopen);
        // setMaxinboxquantity(item.quantity);
        setNowproductid(item.productid);
        setNowname(item.name);
        setNowspec(item.spec);
        setNowquantity(item.quantity);
        setNowentryqty(item.entry_qty);
        setNowprodentrydetailuuid(item.id);
        // setNowWhp
    }

    function handleGetLayOut(item: any) {
        handleRowClick(item.id);
        console.log(item);
        setNowwhname(item.whname);
        setNowtrayname(item.trayname);
        setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
        GetLayOut(item.whid, item.trayname, item.id)
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

    const getWhpositionDetailByProductId = async (productid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                productid: string | undefined
                type: string | undefined
            } = {
                productid: productid as string | undefined,
                type: "entry"
            };


            var inputModel = {
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
                    title: "查詢結果",
                    content: "目前沒有可存放的儲位資訊"
                });
                return;
            }

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
                .map((item: { whname: any; }) => item.whname)  // 提取所有 whname
                .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);  // 去重

            setSelectwhnamedata(distinctWhnames);

            const distincttraynames = data
                .map((item: { trayname: any; }) => item.trayname)  // 提取所有 trayname
                .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);  // 去重


            setSelecttraynamedata(distincttraynames);



        } catch (error: any) {
            myAlert.err({
                title: "prodEntry(getWhpositionDetailByProductId)",
                content: error.message
            })
        }
        finally {
            setIsLoading(false);
        }
    };


    const GetLayOut = async (whid: any, trayname: any, id: any) => {
        try {

            setIsLoading(true);
            const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined
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
                        }
                    }
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
                    }
                }
            });
        }
    }


    const CallTrayAPI = async () => {
        try {
            setIsLoading(true);

            // 根據 whname 設置 deviceName
            // 寫死
            const deviceName =
                (nowwhname === "101") ? "Device1" :
                    (nowwhname === "102") ? "Device1" :
                        (nowwhname === "103") ? "Device1" :
                            (nowwhname === "104") ? "Device1" : "";
            const traynumber = nowtrayname;
            const traycommand = "100";

            const url = (setting.env === "prod") ? (
                (nowwhname === "101") ? `https://${setting.warehouse1}/` :
                    (nowwhname === "102") ? `https://${setting.warehouse2}/` :
                        (nowwhname === "103") ? `https://${setting.warehouse3}/` :
                            (nowwhname === "104") ? `https://${setting.warehouse4}/` : ""
            ) : "https://localhost:44383/WareHouse/";


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
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }
            console.log(response);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                (whnamecalled === "101") ? "Device1" :
                    (whnamecalled === "102") ? "Device1" :
                        (whnamecalled === "103") ? "Device1" :
                            (whnamecalled === "104") ? "Device1" : "";
            const traynumber = traynamecalled;
            const traycommand = "200";
            const url = (setting.env === "prod") ? (
                (whnamecalled === "101") ? `https://${setting.warehouse1}/` :
                    (whnamecalled === "102") ? `https://${setting.warehouse2}/` :
                        (whnamecalled === "103") ? `https://${setting.warehouse3}/` :
                            (whnamecalled === "104") ? `https://${setting.warehouse4}/` : ""
            ) : "https://localhost:44383/WareHouse/";

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
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }

            // 等待一秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
            setWhpnamecalled('')

        } catch (error: any) {
            // 處理錯誤，顯示警告
            myAlert.warning(error.message);
            console.error(error); // 這裡需要傳遞錯誤對象
        } finally {
            setIsLoading(false);
        }
    };

    function handleaddquantity() {
        myAlert.confirm({
            title: `確定要入到此儲格嗎?: ${nowwhname}-${nowtrayname}-${whpnamecalled}`,
            props: {
                onOk: () => {
                    addWHPositionQuantity();
                }
            }
        });
    }

    const addWHPositionQuantity = async () => {

        try {
            setIsLoading(true);
            const conditionModel: {
                whpositionuuid: string | undefined,
                prodentrydetailuuid: string | undefined,
                quantity: string | undefined,
                batchid: string | undefined,
                type: string | undefined,
                productid: string | undefined
            } = {
                whpositionuuid: nowwhpositionuuid,
                prodentrydetailuuid: nowprodentrydetailuuid,
                quantity: inboxquantity.toString() as string | undefined,
                batchid: batchidin,
                type: whpproductid != nowproductid ? 'false' : 'true',
                productid: nowproductid
            };


            var inputModel = {
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
            GetDetailById(uuidin);
            setWhpquantity((parseInt(whpquantity) + inboxquantity).toString());
            setInboxquantity(0);

        } catch (error: any) {
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            <PageHeader02 tag={pagename + "單" + "：" + statusin} panelList={panelList}
                customeRight={[
                    <>
                        {/* <button
                            className={scss.shortsquarebtn}
                            onClick={() => {
                                handleCopy();
                            }}
                            title="複製單據"
                        >
                            複製
                        </button> */}
                        {statusin === "進貨中" && isTrans && (
                            <>
                                <button
                                    className={scss.shortredsquarebtn}
                                    onClick={() => {
                                        myAlert.confirm({
                                            title: '確定新增嗎?',
                                            content: <>
                                                <h1>請確認入庫數量</h1>
                                            </>,
                                            props: {
                                                onOk: () => {
                                                    handleAddTrans()
                                                }
                                            }
                                        })
                                    }}
                                >
                                    新增入庫
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
                        {/* 編輯按鈕 */}
                        {statusin === "入庫中" && !isEditing && !isTrans && (

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
                                {/* <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        handleEditTrans();
                                    }}
                                    title="入庫"
                                >
                                    入庫
                                </button> */}
                                {/* <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        setReviewbar(true);
                                        setDocumenttitle(`【請購單】【${idin}】_${userInfo?.employee?.chName.toString()}`)
                                    }}
                                    title="審核流程"
                                >
                                    審核流程
                                </button> */}

                                {/* <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        handleEdit()
                                    }}
                                >
                                    編輯
                                </button> */}
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
                        {(!isEditing && !isTrans) && (
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
                        {statusin === "進貨中" && isEditing && (
                            <>
                                <button
                                    className={scss.shortredsquarebtn}
                                    onClick={() => {
                                        console.log(data2);
                                        // return;
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


                ]
                }
                customeLeft={
                    [
                        <>
                            {/* 編輯按鈕 */}
                            {/* {statusin === "進貨中" && !isEditing && ( */}

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
                                {statusin === "進貨中" && isEditing && (

                                    <span style={{ fontSize: '18px', padding: '0px 10px' }}>

                                        <button
                                            className={scss.shortsquarebtn}
                                            style={{
                                            }}
                                            onClick={() => {
                                                setPrbar(!prbar);
                                            }}
                                        >
                                            <span style={{ fontWeight: 'bolder', padding: '0px 5px' }}>
                                                ☰
                                            </span>
                                            採購項目
                                        </button>
                                    </span>
                                )}
                            </>
                            {/* )} */}
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
                                        {/* <InputSel
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
                                        /> */}

                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="發票號碼"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: invoicein,
                                                    onChange: (e) => { setInvoicein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商名稱"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: supplieraddressin,
                                                    onChange: (e) => { setSupplieraddressin(e.target.value) }
                                                },
                                            }}
                                        />
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="收貨地址"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: notein,
                                                    onChange: (e) => { setNotein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商電話"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
                                            inputProps={{
                                                props: {
                                                    value: suppliertaxidin,
                                                    onChange: (e) => { setSuppliertaxidin(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            style={{
                                                display: `${isEditing ? '' : 'none'}`,
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
                                        </button>


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
                                        採購項目
                                    </span>
                                </div>
                                <div>


                                    <div className={scss.head_content1}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購數量"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    type: "number",
                                                    value: data4.length,
                                                },
                                            }}
                                        />
                                        {/* 搜尋欄位：依廠商 (下拉選單，distinct) */}
                                        <select
                                            id="vendorSelect"
                                            value={keyword4}
                                            onChange={(e) => setKeyword4(e.target.value)}
                                            style={{
                                                borderRight: "1px solid rgb(168, 168, 168)",
                                                padding: "5px",
                                                fontSize: "18px",
                                            }}
                                        >
                                            <option value="">請選擇廠商</option>
                                            {Array.from(
                                                new Set(data4.map((vendor) => vendor.suppliername))
                                            ).map((suppliername, index) => (
                                                <option key={index} value={suppliername}>
                                                    {suppliername}
                                                </option>
                                            ))}
                                        </select>

                                        {/* 搜尋欄位：依單號 */}
                                        <InputSel
                                            {...inputSelProps}
                                            inputProps={{
                                                props: {
                                                    style: {
                                                        borderRight: '1px solid rgb(168, 168, 168)'
                                                    },
                                                    type: "text",
                                                    value: keyword5,
                                                    placeholder: "輸入單號",
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
                                                    type: "text",
                                                    value: keyword6,
                                                    placeholder: "輸入品名",
                                                    onChange: (e) => setKeyword6(e.target.value),
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            inputProps={{
                                                props: {
                                                    type: "text",
                                                    value: keyword7,
                                                    placeholder: "輸入規格",
                                                    onChange: (e) => setKeyword7(e.target.value),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px', height: '350px' }}>

                                        <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                            <div className={scss.thead22}>
                                                <span></span>
                                                <span>序</span>
                                                <span>採購單號</span>
                                                <span>廠商</span>
                                                <span>料號</span>
                                                <span>品名</span>
                                                <span>規格</span>
                                                <span>數量</span>
                                                <span>已進貨</span>
                                                <span>剩餘數量</span>
                                                <span>單位</span>
                                                <span>單價</span>
                                                <span>總價</span>
                                                <span>備註(用途說明)</span>
                                                <span></span>
                                            </div>
                                            {currentItems && currentItems.map((_item, index) => {
                                                const Totalprice = parseFloat(_item.quantity) * parseFloat(_item.unitprice);
                                                _item.totalprice = Totalprice;

                                                // 檢查是否已存在於 data2 中
                                                const isChecked = data2.some(item => item.id === _item.id);
                                                const handleCheckboxChange = (checked: any) => {

                                                    if (checked) {
                                                        // 如果 data2 非空且供應商名稱不同，顯示錯誤並中止
                                                        if (data2.length > 0 && suppliernamein !== _item.suppliername) {
                                                            myAlert.warning({ title: "不同供應商品項" });
                                                            return;
                                                        }

                                                        // 複製 _item 並將剩餘數量取代原本的數量
                                                        const updatedItem = { ..._item, quantity: _item.remaining_quantity };

                                                        // 加入到 data2
                                                        setData2(prevData2 => [...prevData2, updatedItem]);

                                                        // 加入到 purchaseorderid
                                                        setPurchaseorderid(prevIds => {
                                                            const ids = prevIds ? prevIds.split(",") : [];
                                                            if (!ids.includes(_item.purchaseorderid)) {
                                                                ids.push(_item.purchaseorderid);
                                                            }
                                                            return ids.join(",");
                                                        });

                                                        // 設定供應商相關資訊
                                                        setSuppliernamein(_item.suppliername);
                                                        setSupplieraddressin(_item.supplieraddress);
                                                        setSuppliertaxidin(_item.suppliertaxid);
                                                        setSupplierphonein(_item.supplierphone);
                                                        setShippingaddressin(_item.shippingaddress);
                                                    } else {
                                                        // 從 data2 中移除
                                                        setData2(prevData2 => prevData2.filter(item => item.id !== _item.id));

                                                        // 從 purchaseorderid 中移除
                                                        setPurchaseorderid(prevIds => {
                                                            const ids = prevIds ? prevIds.split(",") : [];
                                                            const updatedIds = ids.filter(id => id !== _item.purchaseorderid);
                                                            return updatedIds.join(",");
                                                        });

                                                        // 如果移除後 data2 為空，清除供應商相關資訊
                                                        if (data2.length === 1) { // 因為移除前會有一筆資料
                                                            setSuppliernamein('');
                                                            setSupplieraddressin('');
                                                            setSuppliertaxidin('');
                                                            setSupplierphonein('');
                                                            setShippingaddressin('');
                                                        }
                                                    }
                                                };


                                                return (
                                                    <CellWithBar key={index} className={scss.panelHeader22}>
                                                        <div className={scss.row01}>
                                                            <span>
                                                                {/* <button style={{ display: (statusin === "編輯中" && isEditing) ? '' : 'none' }} onClick={() => { handleRemoveDetail(index, _item) }}>
                                                            <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                        </button> */}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                                                                    style={{
                                                                        transform: 'scale(1.5)',
                                                                        margin: '5px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                />

                                                            </span>
                                                            <span>{index + 1}</span>
                                                            <span>{_item.purchaseorderid}</span>
                                                            <span>{_item.suppliername}</span>
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
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        width: '95%',
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.quantity}
                                                                    readOnly
                                                                />
                                                            </span>
                                                            <span>
                                                                <input
                                                                    ref={po_quantityRefs.current[index]}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        width: '95%',
                                                                        color: '#ea1833'
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.receipt_quantity}
                                                                    readOnly
                                                                />
                                                            </span>

                                                            <span>
                                                                <input
                                                                    ref={remaining_quantityRefs.current[index]}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        width: '95%',
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.remaining_quantity}
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
                                                            <span>
                                                                <input
                                                                    ref={unitpriceRefs.current[index]}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        width: '95%',
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.unitprice}
                                                                    readOnly
                                                                />
                                                            </span>
                                                            <span>
                                                                <input
                                                                    ref={totalpriceRefs.current[index]}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        width: '95%',
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.totalprice}
                                                                    readOnly

                                                                />
                                                            </span>
                                                            <span>
                                                                <input
                                                                    ref={noteRefs.current[index]}
                                                                    style={{ backgroundColor: 'transparent', width: '95%' }}
                                                                    type="text"
                                                                    value={_item.note !== undefined ? _item.note : ''}
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
                                            pageSize={itemsPerPage} // 每頁顯示的數量
                                            onChange={handlePageChange} // 處理頁面切換
                                            showSizeChanger // 顯示頁數選擇器
                                            pageSizeOptions={['5', '10', '20', '50', '100']} // 可選的每頁顯示數量
                                            onShowSizeChange={(current, size) => setItemsPerPage(size)} // 更新每頁顯示數量
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div
                            style={{
                                paddingTop: `${prbar ? '18px' : '0px'}`,
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
                                    <span>數量</span>
                                    <span>已入庫</span>
                                    <span>剩餘</span>
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
                                        if (_item.wantinquantity === 0) {
                                            const RemainingQuantity = parseFloat(_item.quantity) - parseFloat(_item.entry_qty);
                                            _item.wantinquantity = RemainingQuantity > 0 ? RemainingQuantity : 0;
                                        }
                                        return (
                                            <CellWithBar key={index} className={scss.panelHeader20}>
                                                <div className={scss.row01}>
                                                    <span>
                                                        {/* <button style={{ display: (statusin === "進貨中" && isEditing) ? '' : 'none' }} onClick={() => { handleRemoveDetail(index, _item) }}>
                                                            <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                        </button> */}
                                                    <button
                                                        onClick={() => handleinbox(_item)}
                                                        style={{
                                                            width: '30px',  // 調整按鈕大小，與圖片更匹配
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
                                                                width: '20px',  // 根據按鈕大小調整圖片尺寸
                                                                height: '20px', // 根據按鈕大小調整圖片尺寸
                                                                objectFit: 'contain',  // 確保圖片不會被拉伸
                                                                // backgroundColor:'white'
                                                            }}
                                                        />
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
                                                            ref={quantityRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderBottom: isEditing ? "1px solid black" : "",
                                                                width: '95%',
                                                            }}
                                                            type={isEditing ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isEditing ? _item.quantity : Number(_item.quantity ?? 0).toLocaleString()}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "quantity", e.target.value); {/* 處理變更 */ }
                                                            }}
                                                        />
                                                    </span>
                                                    <span>{_item.entry_qty ?? 0}</span>
                                                    <span>
                                                        <input
                                                            ref={wantinquantityRefs.current[index]}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                borderBottom: isTrans ? "1px solid black" : "",
                                                                width: '95%',
                                                                color: `${isTrans ? '#ea1833' : '#14256a'}`
                                                            }}
                                                            type={isTrans ? 'number' : 'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={isTrans ? _item.wantinquantity : Number(_item.wantinquantity ?? 0).toLocaleString()}
                                                            readOnly={!isTrans}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "wantinquantity", e.target.value); {/* 處理變更 */ }
                                                                setCurrentIndex(index);
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
                            {statusin === "進貨中" && isEditing && (
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
                        {reviewopen && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* 審核 */}
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
                                    myAlert.warning({ title: '尚未加入採購項目' })
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

                <Modal
                    visible={customerbar}
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
                                        <option key={index} value={county}>{county}</option>
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
                    {filteredData2 && (
                        filteredData2.map((_item: any, index: number) => (
                            <CellWithBar key={index} className={scss.panelHeader21}
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
                                }}>
                                <div className={scss.row01}>
                                    <span>{_item.name}</span>
                                    <span>{_item.county}{_item.district}{_item.address}</span>
                                    <span>{_item.contact}</span>
                                    <span>{_item.review_person}</span>
                                    <span>{_item.review_memo}</span>
                                </div>
                            </CellWithBar>
                        ))
                    )}
                </Modal>

                <Modal
                    visible={whpositionqmodalopen}
                    footer={null}
                    onCancel={whpositionqModalClose}
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
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowproductid ? nowproductid : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="名稱"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowname ? nowname : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="規格"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowspec ? nowspec : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="數量"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowquantity ? nowquantity : ' '
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
                                    {data3 && (
                                        data3.map((_item: any, index: number) => (
                                            <CellWithBar key={index} className={scss.panelHeader26}>
                                                <div
                                                    key={index}
                                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                                    onClick={() => handleGetLayOut(_item)}
                                                >
                                                    <span>{index + 1}</span>
                                                    <span>{_item.whname}</span>
                                                    <span>{_item.trayname}</span>
                                                    <span>{`${recodeWhpid(_item.length, _item.width, _item.childlength, _item.childwidth)}`}</span>
                                                    <span style={{ color: `${_item.productid != nowproductid ? 'red' : 'black'}` }}>{_item.productid}</span>
                                                    <span style={{ color: `${_item.quantity === 0 ? 'red' : 'black'}` }}>{_item.quantity}</span>
                                                    <span>
                                                        {/* <button onClick={() => {  }}>
                                                        <img src={icon_fc_inbox.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                                                    </span>
                                                </div>
                                            </CellWithBar>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={scss.modal_right}>
                            <div className={scss.modal_right_head}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="倉庫編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowwhname ? nowwhname : ' '
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="托盤編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowtrayname ? nowtrayname : ' '
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="儲格編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowwhposition ? nowwhposition : ' '
                                        },
                                    }}
                                />
                            </div>
                            <div className={scss.modal_right_content}>
                                {data11.map((Data) => (
                                    <table className={scss.traytable} style={{ border: 'solid 1px black' }}>
                                        <tbody>
                                            <tr className={scss.tr}>
                                                {Data.widthdata.map((item: any) => (
                                                    <td className={scss.td} style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}>
                                                        {item.childtraylayoutmodel && item.childtraylayoutmodel.map((childitem: any) => (
                                                            <table className={scss.childtraytable} key={item.childlengthid}>
                                                                <tbody>
                                                                    <tr className={scss.childtraytabletr}>
                                                                        {childitem.childwidthdata.map((childDataItem: any) => (
                                                                            <td className={scss.childtraytabletd} key={childDataItem.id} style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}>
                                                                                <button className={scss.childtraytabletdButton}
                                                                                    style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                                    onMouseEnter={() => setHoverInfo(`${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`)}
                                                                                    onMouseLeave={() => setHoverInfo(null)}
                                                                                >
                                                                                    {`${recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth)}\n`}<br />
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
                                            fontSize: '16px'
                                        }}
                                    >
                                        {hoverInfo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={scss.modal_container2}>
                        <div className={scss.modal_bottom}>
                            <div className={scss.modal_content}>
                                <div className={scss.traymodal_head_head1}>
                                    <div>
                                        <span style={{ display: `${traycalled === true || data3.length === 0 ? 'none' : ''}` }}>
                                            <button className={scss.redbtn} onClick={CallTray}>呼叫托盤</button>
                                        </span>
                                        <span style={{ display: `${traycalled === true || data3.length === 0 ? '' : 'none'}` }}>
                                            <button className={scss.disabledbtn}>呼叫托盤</button>
                                        </span>
                                        &nbsp;
                                        <span style={{ display: `${traycalled === true ? '' : 'none'}` }}>
                                            <button className={scss.greenbutton} onClick={() => { CallTrayBack() }}>收回托盤</button>
                                        </span>
                                        <span style={{ display: `${traycalled === true ? 'none' : ''}` }} >
                                            <button className={scss.disabledbtn} >收回托盤</button>
                                        </span>
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="目前呼叫"
                                            className='align-bottom'
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: `${whnamecalled != "" ? `倉庫：${whnamecalled} 托盤：${traynamecalled} 儲位：${whpnamecalled}` : ' '}`
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="入庫進度"
                                            className='align-bottom'
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: `${nowentryqty} / ${nowquantity}`
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ display: `${(inboxquantity != 0 && nowentryqty < nowquantity && traycalled === true) ? '' : 'none'}` }}>
                                            <button className={scss.redbtn} onClick={() => { handleaddquantity() }}>確認入庫</button>
                                        </span>
                                        <span style={{ display: `${(inboxquantity === 0 || nowentryqty === nowquantity || traycalled === false) ? '' : 'none'}` }}>
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
                                            className='invisible'
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
                                            className='invisible'
                                            inputProps={{
                                                props: {
                                                    value: ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="入庫數量"
                                            disabled={(traycalled === true && nowentryqty < nowquantity) ? false : true}
                                            inputProps={{
                                                props: {
                                                    type: "number",
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
                                        <span style={{ color: '#ea1833' }}>
                                            ※不可超過入庫單該品項的數量
                                        </span>
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="排版用"
                                            disabled={true}
                                            className='invisible'
                                            inputProps={{
                                                props: {
                                                    value: ' ',
                                                },
                                            }}
                                        />
                                        流程順序：選取儲位{'>'}呼叫托盤{'>'}輸入要放置儲位的數量{'>'}確認入庫<br />
                                        (1).入庫前請確認入庫數量是否正確<br />
                                        (2).入庫後不可更動，需另外申請庫存調整。
                                    </div>
                                </div>
                                <div className={scss.modal_head_content2}>
                                    <div></div>
                                    <div style={{ textAlign: 'right' }}>

                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>


            </div>
        </SubLayer >

    )

}