import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './prodEntryList.module.scss';
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
import { parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import { Modal } from 'antd';
import icon_fc_inbox from 'public/image/icon/fc_inbox.svg';
import icon_fc_tray from 'public/image/icon/fc_tray.svg';
import EditWHPosition from '../editWHPosition';
import { color } from 'html2canvas/dist/types/css/types/color';
import icon_print from 'public/image/icon/fc_printer.svg';
import icon_wh from 'public/image/icon/fc_wh.svg';
import icon_sidebar from 'public/image/icon/fc_sidebar.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_tray_in from 'public/image/icon/fc_tray_in.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg';


type Tquery = {
    wareHouseId: string | undefined;
};

export default function ProdEntryList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        prodentryuuid,
        prodentryid,
        prodreceiptuuid,
        prodreceiptid,
        prodreceiptcreate_at,
        prodreceiptcreate_by,
        create_at,
        create_by,
        inspected,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice,
        status,
        note,
        batchid
    } = router.query;


    // 路由參數排除
    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };


    //登入者資料
    const { userInfo } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [datarestore, setDatarestore] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data3, setData3] = useState<any[]>([]);
    const [data11, setData11] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);

    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(true);
    const [addprodentrybtn, setAddprodentrybtn] = useState<boolean>(true);


    const [inspectedin, setInspectedin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [prodreceiptcreate_atin, setProdreceiptcreate_atin] = useState<string>("");
    const [prodreceiptcreate_byin, setProdreceiptcreate_byin] = useState<string>("");
    const [prodreceiptuuidin, setProdreceiptuuidin] = useState<string>("");
    const [prodreceiptidin, setProdreceiptidin] = useState<string>("");
    const [prodentryuuidin, setProdentryuuidin] = useState<string>("");
    const [prodentryidin, setProdentryidin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [batchidin, setBatchidin] = useState<string>("");

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

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // 保存原始值
    const [originalSuppliernamein, setOriginalSuppliernamein] = useState(suppliernamein);
    const [originalSupplierphonein, setOriginalSupplierphonein] = useState(supplierphonein);
    const [originalSuppliertaxidin, setOriginalSuppliertaxidin] = useState(suppliertaxidin);
    const [originalInvoicein, setOriginalInvoicein] = useState(invoicein);
    const [originalSupplieraddressin, setOriginalSupplieraddressin] = useState(supplieraddressin);

    //modal
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

    //入庫總數
    const [totalentryprogress, setTotalentryprogress] = useState<string>("");
    //入庫進度
    const [entryprogress, setEntryprogress] = useState<string>("");





    //#region  儲位入庫modal
    const [whpositionqmodalopen, setWhpositionqmodalopen] = useState<boolean>(false);
    // const [whpositionqmodalopen, setwhpositionqmodalopen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);

    const [modalcheckfirstin, setModalcheckfirstin] = useState<number>(0);


    useEffect(() => {
        if (firstin !== undefined) {
            setCheckFirstIn(parseInt(firstin as string) || 0);
        }
    }, [firstin]);

    //#region 上方功能列



    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '採購單號',
        },
        {
            placeholder: '採購日期',
        },
        {
            placeholder: '採購人員',
        },
    ];

    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const keywordWhpname = valueArr[0] as string;
        const keywordMaterialnumber = valueArr[1] as string;
        const keywordSpec = valueArr[2] as string;
        searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };

    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        doSearch,
    };

    const searchData = async (keyword1: string, keyword2: string, keyword3: string) => {
        try {
            if (keyword1 === "" && keyword2 === "" && keyword3 === "") {
                setData(datarestore);
                return;
            }
            // keywordSpec
            const conditionModel: { keyword1: string | undefined, keyword2: string | undefined, keyword3: string | undefined } = {
                keyword1: getTaiwanDateStr(keyword1) as string | undefined,
                keyword2: keyword2 as string | undefined,
                keyword3: keyword3 as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}/WareHouse/SearchProdEntryById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            setData(data);


        } catch (error: any) {
            setError(error.message);
        }
    };


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
    //取入庫單主檔
    const getProdEntry = async () => {
        try {
            // alert(checkfirstin);
            setIsLoading(true);
            const conditionModel: {
                // keyword: string | undefined;
            } = {
                // keyword: "search" as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetProdEntry?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setDatarestore(data);
            setSearchdata(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                getProdEntryDetail(data[0].id);
                //     // GetProdReceiptDetailByPurchaseOrderId(data[0].prodreceiptuuid);
                setCreate_atin(data[0].create_at);
                setProdreceiptuuidin(data[0].prodreceiptuuid);
                setProdreceiptidin(data[0].prodreceiptid);
                setProdentryuuidin(data[0].id);
                setProdentryidin(data[0].prodentryid);
                setCreate_byin(data[0].create_by);
                setProdreceiptcreate_atin(data[0].prodreceiptcreate_at);
                setProdreceiptcreate_byin(data[0].prodreceiptcreate_by);
                setSuppliernamein(data[0].suppliername);
                setSuppliertaxidin(data[0].suppliertaxid);
                setSupplieraddressin(data[0].supplieraddress);
                setStatusin(data[0].status);
                setSupplierphonein(data[0].supplierphone);
                setInvoicein(data[0].invoice);
                setNotein(data[0].note);
                setBatchidin(data[0].batchid);
            }
        } catch (error: any) {
            setError("getProdEntry:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getProdEntry();
            hasFetchedData.current = true;
        }
    }, []);

    //取對應的進貨明細
    const getProdEntryDetail = async (prodentryuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodentryuuid: string | undefined
            } = {
                prodentryuuid: prodentryuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetProdEntryDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData1(data);
            // setData2(data);

            console.log(data);
            let totalprice = 0;
            data.forEach((element: { totalprice: any; }) => {
                totalprice += element.totalprice;
            });
            setTotalPrice(totalprice.toLocaleString());
            const taxPrice = Math.round(totalprice * 0.05);
            setTaxPrice(taxPrice.toLocaleString());
            const totalPayPrice = totalprice + taxPrice;
            setTotalPayPrice(totalPayPrice.toLocaleString());

            // 入庫進度
            let totalentry = data.length;
            let alreadyentry = 0;

            data.forEach((element: { entry_qty: any, quantity: any }) => {
                if (element.entry_qty === element.quantity) {
                    alreadyentry += 1;
                }
            });
            setTotalentryprogress(totalentry);
            setEntryprogress(`${alreadyentry}`);


        } catch (error: any) {
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        if (prodentryuuid) {
            if (prodentryuuidin != prodentryuuid) {
                setData2([]);
            }
            // getProdReceiptDetail(prodreceiptuuid);
            // if (prodreceiptdetailuuid) {
            //     GetProdReceiptDetailByPurchaseOrderId(purchaseorderuuid, purchaseorderdetailuuid);
            // }
            getProdEntryDetail(prodentryuuid);
            // GetProdReceiptDetailByPurchaseOrderId(prodreceiptuuid);
            setProdreceiptidin(prodreceiptid as string);
            setProdreceiptuuidin(prodreceiptuuid as string);
            setProdentryuuidin(prodentryuuid as string);
            setProdentryidin(prodentryid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setProdreceiptcreate_atin(prodreceiptcreate_at as string);
            setProdreceiptcreate_byin(prodreceiptcreate_by as string);
            setSuppliernamein(suppliername as string);
            setSuppliertaxidin(suppliertaxid as string);
            setInspectedin(inspected as string);
            setSupplieraddressin(supplieraddress as string);
            setStatusin(status as string);
            setSupplierphonein(supplierphone as string);
            setInvoicein(invoice as string);
            setData3([]);
            setData11([]);
            setNowwhname("");
            setNowtrayname("");
            setNowwhposition("");
            setNotein(note as string);
            setBatchidin(batchid as string);
        }
    }, [prodentryuuid]);

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
                    (nowwhname === "102") ? "Device2" :
                        (nowwhname === "103") ? "Device3" : "";
            const traynumber = nowtrayname;
            const traycommand = "100";

            const url = (setting.env === "prod") ? (
                (nowwhname === "101") ? "https://192.168.1.8/sjwms/" :
                    (nowwhname === "102") ? "https://192.168.1.9/sjwms/" :
                        (nowwhname === "103") ? "https://192.168.1.10/sjwms/" : ""
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
                    (whnamecalled === "102") ? "Device2" :
                        (whnamecalled === "103") ? "Device3" : "";
            const traynumber = traynamecalled;
            const traycommand = "200";
            const url = (setting.env === "prod") ? (
                (whnamecalled === "101") ? "https://192.168.1.8/sjwms/" :
                    (whnamecalled === "102") ? "https://192.168.1.9/sjwms/" :
                        (whnamecalled === "103") ? "https://192.168.1.10/sjwms/" : ""
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


    //取已對應進貨單的已入庫單
    const GetProdEntryDetailByProdReceiptId = async (prodreceiptuuid: any, prodreceiptdetailuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodreceiptuuid: string | undefined,
                prodreceiptdetailuuid: string | undefined
            } = {
                prodreceiptuuid: prodreceiptuuid as string | undefined,
                prodreceiptdetailuuid: prodreceiptdetailuuid as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetProdEntryDetailByProdReceiptId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData2(prevData2 => {
                // 创建一个 Set 来存储现有 ID
                const existingIds = new Set(prevData2.map(item => item.id));

                // 过滤掉重复项
                const newItems = data.filter((item: { id: string; }) => !existingIds.has(item.id));

                // 将非重复的新项添加到 prevData2 中
                const updatedData = [...prevData2, ...newItems];

                // 调用 handleAddProdEntry 更新按钮状态
                handleAddProdEntry(updatedData);

                return updatedData;
            });

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 進貨單入庫
    const TransferProdReceiptToProdEntry = async () => {
        // alert("in");
        try {
            // return;
            setIsLoading(true);


            const conditionModel: {
                prodentryuuid: string | undefined,
                data: any,
                username: string | undefined
            } = {
                prodentryuuid: checkfirstin === 0 ? prodentryuuidin : prodentryuuid as string | undefined,
                data: data2,
                username: userInfo?.username as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/TransferProdReceiptToProdEntry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data11111');
            }

            const responseData = await response.json();
            myAlert.info(
                {
                    title: '單據新增成功',
                    content: `進貨單號為:${responseData}`
                })

            setData2([]);
            getProdEntry();

            getProdEntryDetail(checkfirstin === 0 ? prodentryuuidin : prodentryuuid);

            // GetProdEntryDetailByProdReceiptId(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


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
            setNowentryqty((parseInt(nowentryqty) + 1).toString());
            getProdEntryDetail(prodentryuuidin);
            setWhpquantity((parseInt(whpquantity) + inboxquantity).toString());
            setInboxquantity(0);

        } catch (error: any) {
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };



    // //結案
    // const ClosePO = async () => {
    //     try {
    //         setIsLoading(true);
    //         const conditionModel: {
    //             purchaseorderuuid: string | undefined
    //         } = {
    //             purchaseorderuuid: checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid as string | undefined,
    //         };


    //         var inputModel = {
    //             TypeName: 'ERP',
    //             ServiceName: 'WareHouseService',
    //             FunctionName: 'no',
    //             FilterConditions: JSON.stringify(conditionModel),
    //         };

    //         const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
    //         const response = await fetch(`${setting.apipath}/WareHouse/ClosePO?${queryParams}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         const data = await response.json();
    //         getProdEntry();

    //         getProdReceiptDetail(checkfirstin === 0 ? prodentryuuidin : prodentryuuid);

    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // };




    //#endregion
    // 轉為進貨單，開始驗收
    function handleReceipt() {
        myAlert.confirm({
            title: '確定要轉為進貨單嗎?',
            content: <>
                <h1>請確認數量、金額是否正確</h1>
            </>,
            props: {
                onOk: () => {
                    // TransferPurchaseOrderToProductReceipt();
                    // console.log("XXXXXXXXXXXXXXXXXXX");
                    // console.log(data2);
                }
            }
        });
    }

    // function handleClosePO() {
    //     myAlert.confirm({
    //         title: '確定結案?',
    //         content: <>
    //             <h1>轉為結案後將無法更改</h1>
    //         </>,
    //         props: {
    //             onOk: () => {
    //                 ClosePO();
    //             }
    //         }
    //     });
    // }

    // 編輯狀態控制
    // 一次只提供編輯一列
    const handleEditStatus = (index: number) => {
        setEditRowId(index);
        setEditStatus(true);
        setData2Restore(data2);
    };

    const handleSaveEdit = (index: number) => {
        setEditStatus(false);
        console.log(data2);
    };


    const handleRemove = (index: number) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
        handleAddProdEntry(updatedData); // 在删除后检查并更新按钮状态
    };


    // const [data2, setData2] = useState([
    //     { id: 1, quantity: 10 },
    //     { id: 2, quantity: 15 },
    //     { id: 3, quantity: 20 }
    // ]);
    const handleChange = (index: number, value: string | number) => {
        setData2(prevState => {
            const updatedData = [...prevState];
            updatedData[index] = {
                ...updatedData[index],
                quantity: value // 更新 quantity 屬性的值
            };
            return updatedData;
        });
    };

    const handleRestore = () => {
        setData2(data2restore);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        searchData(keyword1, keyword2, keyword3);
        // alert(keyword1);
        // alert(keyword2);
        // alert(keyword3);
        // 在這裡可以添加搜索的邏輯，使用keyword1來進行搜索
    };


    function handleTransfer() {
        if (editstatus === true) {
            myAlert.warning({ title: "請先結束編輯狀態" });
        }
        else {
            myAlert.confirm({
                title: '確定要轉為入庫單嗎?',
                content: <>
                    <h1>請確認數量是否正確</h1>
                </>,
                props: {
                    onOk: () => {
                        TransferProdReceiptToProdEntry();
                    }
                }
            });
        }
    }

    const handleAddProdEntry = (data: any) => {
        let shouldDisable = false; // 默认情况下，新增入庫按钮是启用的

        for (let i = 0; i < data.length; i++) {
            const alreadyInQuantity = parseFloat(data[i].alreadyinquantity); // 将 alreadyinquantity 转换为数字类型
            const quantity = parseFloat(data[i].quantity); // 将 quantity 转换为数字类型

            // 如果有任何一项 alreadyinquantity 等于 quantity，则应禁用新增入庫按钮
            if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity === quantity) {
                shouldDisable = true;
                break; // 找到符合条件的项就可以退出循环了
            }

            // 如果有任何一项 alreadyinquantity 大于 quantity，则应禁用新增入庫按钮
            if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity > quantity) {
                shouldDisable = true;
                break; // 找到符合条件的项就可以退出循环了
            }
        }

        // 在这里输出 addprodentrybtn 的状态，看看是否正确
        console.log("shouldDisable:", shouldDisable);

        setAddprodentrybtn(!shouldDisable); // 根据 shouldDisable 的值来设置 addprodentrybtn 的状态
    };

    // useEffect(() => {
    //     console.log(addprodentrybtn);
    // }, [addprodentrybtn]);

    //關閉詢價單modal
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // 檢查輸入是否為數字
        if (!isNaN(Number(value)) && value !== "") {
            let numericValue = Number(value);

            // 獲取最大允許值
            const maxValue = parseInt(nowquantity) - parseInt(nowentryqty);

            // 比較輸入值和最大值
            if (numericValue > maxValue) {
                numericValue = maxValue;
            } else if (numericValue < 0) {
                numericValue = 0; // 確保最小值為0
            }

            // 更新狀態
            setInboxquantity(numericValue);
        } else {
            // 處理非數字輸入
            setInboxquantity(0); // 或者保留先前的狀態，具體看你的需求
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


    // 入庫單查詢
    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }


    // 主檔編輯
    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalSuppliernamein(suppliernamein);
        setOriginalSupplierphonein(supplierphonein);
        setOriginalSuppliertaxidin(suppliertaxidin);
        setOriginalInvoicein(invoicein);
        setOriginalSupplieraddressin(supplieraddressin);
        setEditmain(true);
    };

    const handleCancel = () => {
        // 取消編輯時恢復原始值
        myAlert.confirm({
            title: '確定要取消編輯嗎?',
            content: <>
                <h1>未儲存的資料將不會保存</h1>
            </>,
            props: {
                onOk: () => {
                    setSuppliernamein(originalSuppliernamein);
                    setSupplierphonein(originalSupplierphonein);
                    setSuppliertaxidin(originalSuppliertaxidin);
                    setInvoicein(originalInvoicein);
                    setSupplieraddressin(originalSupplieraddressin);
                    setEditmain(false);
                }
            }
        });
    };

    const handleSave = async () => {
        // 顯示確認對話框
        myAlert.confirm({
            title: '確定要儲存異動的資料嗎?',
            content: null,
            props: {
                onOk: async () => {
                    try {
                        // 建立要傳送的數據
                        const data = {
                            suppliername: suppliernamein,
                            supplieraddress: supplieraddressin,
                            supplierphone: supplierphonein,
                            suppliertaxid: suppliertaxidin,
                            invoice: invoicein
                        };

                        // 打印數據到控制台以供調試
                        console.log(data);
                        // return;

                        const conditionModel: {
                            prodentryuuid: any,
                            data: any,
                            note: any
                        } = {
                            prodentryuuid: prodentryuuidin,
                            data: data,
                            note: notein
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };




                        // 發送數據到 API
                        const response = await fetch(`${setting.apipath}/WareHouse/UpdatePEntrySupplier`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel),
                        });

                        if (!response.ok) {
                            myAlert.err({ title: 'PO_handleSave', content: `API Status: ${response.status}` })

                        }
                        // 解析 API 響應
                        const result = await response.json();

                        // 顯示成功提示
                        myAlert.success({ title: '更新成功' })
                        setEditmain(false);
                        getProdEntry();

                        // 更新狀態或執行其他操作
                        console.log(result);
                    } catch (error: any) {
                        // 顯示錯誤信息
                        myAlert.err({ title: 'FunctionError', content: error.message },)
                    }
                }
            }
        });
    };

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const filterData = () => {
        const startDate = keywordstartdate;
        const endDate = keywordenddate;
        const requisitionId = keyword2.trim();
        const status = keyword3.trim();
        const suppliername = keyword4.trim();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionId &&
            !status &&
            !suppliername) {
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

        // 模糊查詢請購單號
        if (requisitionId) {
            filteredData = filteredData.filter(item =>
                item.prodentryid.toString().includes(requisitionId)
            );
        }

        // 模糊查詢單據狀態
        if (status) {
            filteredData = filteredData.filter(item =>
                item.status.toString().includes(status)
            );
        }
        if (suppliername) {
            filteredData = filteredData.filter(item =>
                item.suppliername.toString().includes(suppliername)
            );
        }

        setSearchdata(filteredData);
    };

    // 監聽條件變更
    useEffect(() => {
        filterData();
    }, [keywordstartdate, keywordenddate, keyword2, keyword3, keyword4]);

    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');
        // setSearchdata(data);
    }

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


    const closeDoc = async (type: any) => {
        try {
            const conditionModel = {
                prodentryuuid: prodentryuuidin,
                type: type,
                username: userInfo?.username,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/sentPEToReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            getProdEntry();
            getProdEntryDetail(prodentryuuidin);
            setStatusin("已結案");

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    }

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'入庫單'} panelList={panelList} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                {/* <button className={scss.squarebtn} onClick={() => { setLeftbaropen(!leftbaropen) }}>
                                    <img src={icon_sidebar.src} alt="sidebar" style={{ height: '30px', width: '30px' }} title="側欄" />
                                </button>
                                &nbsp; */}
                                {/* <button className={scss.minibtn} onClick={() => { router.push({ pathname: `/factoryDepartment/wareHouseList`, query: {}, }); }}>
                                    儲位管理
                                </button> */}

                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查詢單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                &nbsp;
                                {/* <button className={scss.squarebtn} onClick={() => { router.push({ pathname: `/factoryDepartment/wareHouseList` }); }} title="儲位管理">
                                    <img src={icon_wh.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    儲位
                                </button>
                                &nbsp; */}
                                <button className={scss.squarebtn} onClick={() => { alert("comming soon") }} title="列印">
                                    <img src={icon_print.src} alt="print" style={{ height: '20px', width: '20px' }} />
                                    列印
                                </button>


                            </div>
                            <div>
                                <span style={{ display: `${statusin === "入庫中" ? '' : 'none'}` }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.squarebtn} onClick={handleEdit}>
                                        <img src={icon_edit.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        編輯
                                    </button>
                                </span>
                                <span style={{ display: `${statusin === "已結案" ? '' : 'none'}` }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.disablesquarebtn} >
                                        <img src={icon_edit_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        編輯
                                    </button>
                                </span>
                                <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.squarebtn} onClick={handleSave}>
                                    <img src={icon_save.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    儲存
                                </button>
                                &nbsp;
                                <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.squarebtn} onClick={handleCancel}>
                                    <img src={icon_cancel.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>
                            </div>
                            <div></div>
                            <div>
                                <button style={{ display: `${parseInt(entryprogress) === parseInt(totalentryprogress) && statusin != '已結案' ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { closeDoc("結案") }} title="單據結案">
                                    <img src={icon_task_open.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button>
                                <button style={{ display: `${parseInt(entryprogress) != parseInt(totalentryprogress) ? '' : 'none'}` }} className={scss.disablesquarebtn} title="單據未結">
                                    <img src={icon_task_open_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    未結
                                </button>
                                &nbsp;
                                <button style={{ display: `${statusin === '已結案' ? '' : 'none'}` }} className={scss.disablesquarebtn} title="單據已結">
                                    <img src={icon_task_close.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    已結
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div>

                                        <InputSel
                                            {...inputSelProps}
                                            caption="入庫單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? prodentryidin : prodentryid) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="進貨單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? prodreceiptidin : prodreceiptid) || ' ',
                                                },
                                            }}
                                        />


                                    </div>
                                    <div>


                                        <InputSel
                                            {...inputSelProps}
                                            caption="入庫日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="進貨日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(prodreceiptcreate_atin)?.toString() : prodreceiptcreate_at) || ' ',
                                                },
                                            }}
                                        />

                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="入庫人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? create_byin : create_by) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="進貨人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? prodreceiptcreate_byin : prodreceiptcreate_by) || ' ',
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
                                            caption="廠商名稱"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: suppliernamein ? suppliernamein : ' ',
                                                    onChange: (e) => { setSuppliernamein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商地址"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: supplieraddressin ? supplieraddressin : ' ',
                                                    onChange: (e) => { setSupplieraddressin(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>

                                        <InputSel
                                            {...inputSelProps}
                                            caption="聯絡電話"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: supplierphonein ? supplierphonein : ' ',
                                                    onChange: (e) => { setSupplierphonein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="統一編號"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: suppliertaxidin ? suppliertaxidin : ' ',
                                                    onChange: (e) => { setSuppliertaxidin(e.target.value) }
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
                                            caption="發票號碼"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: invoicein ? invoicein : ' ',
                                                    onChange: (e) => { setInvoicein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={scss.head_content3}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: notein ? notein : ' ',
                                                    onChange: (e) => { setNotein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.head_foot1}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div style={{ textAlign: "right" }}>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: statusin || ' ',
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="入庫進度"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: `${entryprogress}/${totalentryprogress}`,
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
                                </div>
                            </div>
                        </div>

                        <div className={scss.head_foot2}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1}>
                            <Thead01 type={'ProdEntryDetail'} />
                            {/* <Tbody01 type={'ProdReceiptDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {data1 && (
                                data1.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader14}>
                                        <div className={scss.row01}>
                                            <span>
                                                <button onClick={() => { handleinbox(_item) }}>
                                                    <img src={icon_tray_in.src} alt="tray" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            {/* <span>{_item.spec}</span> */}
                                            <span>{_item.spec}</span>
                                            <span style={{ color: '#ea1833' }}>{_item.entry_qty}</span>
                                            <span>{_item.quantity}</span>
                                            <span>{_item.unit}</span>
                                            <span>{_item.total_quantity}</span>
                                            <span className="truncate" title={_item.note}>{_item.note}</span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                        <br />
                        <div className={scss.body_foot1}>
                            <div>
                                (1).如沒有對應的儲格可以存放，請前往儲位管理維護儲位資訊<br />
                            </div>
                            <div></div>
                            <div>
                                {/* <table className={scss.count_table}>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>小計</td>
                                        <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalprice ? totalprice : '0'}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>營業稅</td>
                                        <td style={{ color: 'black' }}>&nbsp;&nbsp;{taxprice ? taxprice : '0'}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>應付金額</td>
                                        <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalpayprice ? totalpayprice : '0'}</td>
                                    </tr>
                                </table> */}
                            </div>
                        </div>
                        <div className={scss.foot_head1}>
                            <div>
                                {/* <span className={scss.mytitle} style={{ display: (checkfirstin === 0 ? inspectedin : inspected) === "true" ? "none" : "" }}>
                                <MyButton_v2 px='px22' py='py4' theme={undefined} label="驗收入庫" onClick={handleReceipt} />&nbsp;&nbsp;
                                <MyButton_v2 px='px22' py='py4' theme='danger' label="退貨單" onClick={handleReceipt} />
                            </span> */}
                                {/* <span style={{ display: `${(data2.length > 0 && addprodentrybtn) ? '' : 'none'}` }}>
                                    <button className={scss.redbtn} onClick={() => { handleTransfer() }}>新增入庫</button>
                                </span>
                                <span style={{ display: `${(data2.length > 0 && addprodentrybtn) ? 'none' : ''}` }}>
                                    <button className={scss.disabledbtn}>新增入庫</button>
                                </span> */}
                            </div>
                            <div></div>
                            <div>

                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {/* <span>
                                    <button className={scss.redbtn} onClick={() => { alert("新增付款單") }}>新增付款</button>
                                </span> */}
                                {/* <span style={{ display: `${data2.length > 0 && statusin === '已核准' ? '' : 'none'}` }}> */}

                            </div>
                        </div>

                        <div className={scss.foot_content1}>

                            {/* <Thead01 type={'ProdReceiptDetail2'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader13}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>{_item.name}</span>
                                        <span style={{ color: 'red' }}>
                                            {_item.alreadyinquantity}
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                type="text"
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    let newQuantity = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                    if (newQuantity > _item.maxquantity) {
                                                        newQuantity = _item.maxquantity;
                                                    }
                                                    newData[index] = {
                                                        ...newData[index],
                                                        quantity: newQuantity,
                                                        totalprice: newQuantity * newData[index].unitprice
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                        <span>{_item.unit}</span>
                                        <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', width: '80px' }}
                                                type="text"
                                                value={_item.unitprice.toLocaleString()}
                                                readOnly
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newUnitPrice = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        unitprice: newUnitPrice,
                                                        totalprice: newUnitPrice * newData[index].quantity
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            {_item.totalprice.toLocaleString()}
                                        </span>
                                        <span>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))} */}
                        </div>
                    </div>
                </div>

            </div>
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
                                                min: 0, // 設置最小值為0
                                                step: 1, // 設置步進值，默認為1
                                                max: parseInt(nowquantity) - parseInt(nowentryqty), // 設置最大值
                                                style: { color: 'red' },
                                                value: inboxquantity ? inboxquantity : 0,
                                                onChange: handleInputChange
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
            <DragableModal
                handleText="查找單據"
                style={{ zIndex: '1001', width: '1000px' }}
                show={searchmodalopen}
                onCrossClick={SearchModalClose}
            >
                {/* <Modal
                visible={searchmodalopen}
                footer={null}
                onCancel={SearchModalClose}
                width="1000px"
                maskClosable={false}
                title={
                    // <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%',paddingRight:'20px' }}>
                    //     <span>查詢條件</span>
                    //     <span >筆數：共 {data.length} 筆</span>
                    // </div>
                    <div className={scss.modal_head_head1}>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {searchdata.length} 筆</span>
                        </div>
                    </div>
                }
                // centered
                style={{ top: 200 }}
            > */}
                <div className={scss.modal_head_head1}>
                    <div>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {searchdata.length} 筆</span>
                    </div>
                </div>
                <div className={scss.modal_head_content1}>
                    <div style={{ border: '1px solid #c1c1c1', borderRight: '0px', paddingRight: '50px', paddingLeft: '50px' }}>
                        <form className={scss.modal_search_bar} style={{ alignItems: 'center', width: '100%' }}>
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
                            </div>
                            <div>
                                <select
                                    value={keyword3 || ''}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setKeyword3(e.target.value);
                                        e.target.blur(); // 讓 select 失去焦點
                                    }}
                                    disabled={false} // 根據需求設置是否禁用
                                    style={{
                                        // padding: '8px', // 調整樣式
                                        fontSize: '18px',
                                        borderBottom: '1px solid #14256a',
                                        color: '#14256a'
                                    }}
                                >
                                    <option value="">全部</option> {/* 預設選項 */}
                                    <option value="入庫中">入庫中</option>
                                    <option value="已結案">已結案</option>
                                </select>

                            </div>
                            <br />
                            <div>
                                <InputSel
                                    caption="起始日期"
                                    disabled={false}
                                    captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                    datePickerProps={{
                                        props: {
                                            value: keywordstartdate || null,
                                            onChange: (e: Moment | null) => { setKeywordstartdate(e) }
                                        }
                                    }}
                                />

                            </div>
                            <br />
                            <div>
                                <InputSel
                                    caption="截止日期"
                                    disabled={false}
                                    captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                    datePickerProps={{
                                        props: {
                                            value: keywordenddate || null,
                                            onChange: (e: Moment | null) => { setKeywordenddate(e) }
                                        }
                                    }}
                                />

                            </div>
                            <br />
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="進貨單號"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: keyword2 || ' ',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword2(e.target.value) }
                                        },
                                    }}
                                />
                            </div>
                            <br />
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="廠商名稱"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: keyword4 || ' ',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword4(e.target.value) }
                                        },
                                    }}
                                />
                            </div>
                            <br />
                            <div >
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
                            </div>
                            <br />
                            <div >
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
                            </div>
                            <br />
                            <div >
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
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                                <span>
                                    <button className={scss.minibtn} onClick={(e) => { clearFilterData(e) }}>清除條件</button>
                                </span>
                                {/* <span>
                                        <button className={scss.minibtn} type="submit">查找</button>
                                    </span> */}
                            </div>
                        </form>
                    </div>
                    <div style={{
                        maxHeight: '465.81px',
                        overflowY: 'auto',
                        border: '1px solid #c1c1c1',
                        // boxShadow: 'inset 0px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.5)',
                        // padding: '10px',
                        // backgroundColor: '#f0f0f0' // 根據需要調整背景顏色
                    }}>
                        <Thead01 type={'ProdEntry'} />
                        <Tbody01 type={'ProdEntry'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>

                </div>
                {/* </Modal > */}
            </DragableModal>
        </SubLayer >

    )

}