import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import scss from './purchaseOrderList.module.scss';
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
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_fc_collapse_right from 'public/image/icon/fc_collapse_right.svg';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import icon_print from 'public/image/icon/fc_printer.svg';
import { Modal } from 'antd';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function PurchaseOrderList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaseorderuuid,
        purchaseorderid,
        create_at,
        create_by,
        receipted,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice,
        purchaseorderdetailuuid,
        note,
        status
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };

    const purchaseorderuuidStr = getQueryParam(purchaseorderuuid);



    //登入者資料
    const { userInfo } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data1restore, setData1Restore] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);
    const [receiptedin, setReceiptedin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [purchaseorderdetailuuidin, setPurchaseorderdetailuuidin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);
    const [editmain, setEditmain] = useState<boolean>(false);

    // 計算金額
    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");
    // 保存原始值
    const [originalSuppliernamein, setOriginalSuppliernamein] = useState(suppliernamein);
    const [originalSupplierphonein, setOriginalSupplierphonein] = useState(supplierphonein);
    const [originalSuppliertaxidin, setOriginalSuppliertaxidin] = useState(suppliertaxidin);
    const [originalInvoicein, setOriginalInvoicein] = useState(invoicein);
    const [originalSupplieraddressin, setOriginalSupplieraddressin] = useState(supplieraddressin);


    //進貨總數
    const [totalreq, setTotalreq] = useState<string>("");
    //進貨進度
    const [completereq, setCompletereq] = useState<number>(0);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);
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
                setData(data1restore);
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
            const response = await fetch(`${setting.apipath}SearchPurchaseOrderById?${queryParams}`);
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
        //             pathname: `/factoryDepartment/purchaseOrderList/addPurchaseOrder`,
        //             query: {
        //                 type: 'AddPurchaseOrder',
        //             },
        //         });
        //     },
        // },
    ];
    //#endregion

    //#region call api
    //取領料單清單
    const getPurchaseOrder = async () => {
        try {
            // console.log(userInfo);
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

            const response = await fetch(`${setting.apipath}GetPurchaseOrder?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setData1Restore(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log(data.length);
            console.log(checkfirstin);
            if (data.length > 0 && checkfirstin === 0) {
                console.log(data[0].receipted);
                getPurchaseOrderDetail(data[0].purchaseorderuuid);
                // GetProdReceiptDetailByPurchaseOrderId(data[0].purchaseorderuuid);
                setCreate_atin(data[0].create_at);
                setPurchaseorderuuidin(data[0].purchaseorderuuid);
                setPurchaseorderidin(data[0].purchaseorderid);
                setCreate_byin(data[0].create_by);
                setSuppliernamein(data[0].suppliername);
                setSuppliertaxidin(data[0].suppliertaxid);
                setReceiptedin(data[0].receipted.toString());
                setSupplieraddressin(data[0].supplieraddress);
                setInvoicein(data[0].invoice);
                setSupplierphonein(data[0].supplierphone);
                setNotein(data[0].note);
                setStatusin(data[0].status);
            }
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPurchaseOrder();
    }, []);

    //取對應的採購明細
    const getPurchaseOrderDetail = async (purchaseorderuuid: any) => {
        try {
            // alert(purchaseorderuuid)
            setIsLoading(true);
            const conditionModel: {
                purchaseorderuuid: string | undefined
            } = {
                purchaseorderuuid: purchaseorderuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetPurchaseOrderDetailById?${queryParams}`);
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

            // 進貨進度
            let totalreq = data.length; // 總數量
            let completereq = 0; // 完成數量

            data.forEach((element: any) => {
                // 將 alreadyinquantity 和 quantity 轉換為整數
                const alreadyInQuantity = parseInt(element.alreadyinquantity, 10);
                const quantity = parseInt(element.quantity, 10);

                if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity >= quantity) {
                    completereq += 1;
                }
            });
            setTotalreq(totalreq);
            setCompletereq(completereq);



        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        if (purchaseorderuuid) {
            if (purchaseorderuuidin != purchaseorderuuid) {
                setData2([]);
            }
            getPurchaseOrderDetail(purchaseorderuuid);
            if (purchaseorderdetailuuid) {
                GetProdReceiptDetailByPurchaseOrderId(purchaseorderuuid, purchaseorderdetailuuid);
            }
            setPurchaseorderidin(purchaseorderid as string);
            setPurchaseorderuuidin(purchaseorderuuid as string);
            // setCreate_atin((create_at != null ? create_at : "") as string);
            // alert(create_at)
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setSuppliernamein(suppliername as string);
            setSuppliertaxidin(suppliertaxid as string);
            setReceiptedin(receipted as string);
            setSupplieraddressin(supplieraddress as string);
            setInvoicein(invoice as string);
            setSupplierphonein(supplierphone as string);
            setNotein(note as string);
            setStatusin(status as string);
        }
    }, [purchaseorderuuid, purchaseorderdetailuuid]);


    //取該筆採購單的進貨單
    const GetProdReceiptDetailByPurchaseOrderId = async (purchaseorderuuid: any, purchaseorderdetailuuid: any) => {
        try {
            // alert("ss" + purchaseorderdetailuuid);
            // alert(purchaseorderuuid);

            setIsLoading(true);
            const conditionModel: {
                purchaseorderuuid: string | undefined,
                purchaseorderdetailuuid: string | undefined
            } = {
                purchaseorderuuid: purchaseorderuuid as string | undefined,
                purchaseorderdetailuuid: purchaseorderdetailuuid as string | undefined
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetProdReceiptDetailByPurchaseOrderId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData2(prevData2 => {
                // 创建一个 Set 来存储现有 ID
                const existingIds = new Set(prevData2.map(item => item.id));

                // 过滤掉重复项
                const newItems = data.filter((item: { id: string }) => !existingIds.has(item.id));

                // 将非重复的新项添加到 prevData2 中
                return [...prevData2, ...newItems];
            });
            // setData2(prevData2 => [...prevData2, ...data]);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    const TransferPurchaseOrderToProductReceipt = async () => {
        try {
            setIsLoading(true);


            const conditionModel: {
                purchaseorderuuid: string | undefined,
                data: any,
                username: string | undefined
            } = {
                purchaseorderuuid: checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid as string | undefined,
                data: data2,
                username: userInfo?.username as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}TransferPurchaseOrderToProductReceipt`, {
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

            // 更新數據和其它操作
            getPurchaseOrder();
            getPurchaseOrderDetail(purchaseorderuuidin);
            // GetProdReceiptDetailByPurchaseOrderId(purchaseorderuuidin, purchaseorderdetailuuidin);

        } catch (error: any) {
            setError(error.message);
            console.error('Transfer failed:', error);
        } finally {
            setIsLoading(false);
        }
    };



    //結案
    const sentPOToReview = async (type: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                type: any,
                purchaseorderuuid: string | undefined,
                username: any
            } = {
                type: type,
                purchaseorderuuid: purchaseorderuuidin,
                username: userInfo?.username,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}ClosePO?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 500));
            getPurchaseOrder();
            getPurchaseOrderDetail(purchaseorderuuidin);
            await new Promise(resolve => setTimeout(resolve, 500));
            setStatusin(setStatus(type));

            // alert(type);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    function setStatus(type: any) {
        let status;
        switch (type) {
            case "請購":
                status = "詢價中";
                break;
            case "詢價":
                status = "審核中";
                break;
            case "核准":
                status = "已核准";
                break;
            case "駁回":
                status = "已駁回";
                break;
            case "結案":
                status = "已結案";
                break;
            default:
                status = "未知狀態";
                break;
        }
        return status;
    }



    //#endregion
    // 轉為進貨單，開始驗收
    function handleTransfer() {
        // TransferPurchaseOrderToProductReceipt();
        if (editstatus === true) {
            myAlert.warning({ title: "請先結束編輯狀態" });
        // } else if (invoicein === "" || invoicein === undefined || invoicein === null) {
        //     myAlert.warning({ title: "發票號碼尚未輸入" });
        } else if (editmain === true) {
            myAlert.warning({ title: "尚未儲存或取消編輯" });
        }
        else {
            myAlert.confirm({
                title: '確定要轉為進貨單嗎?',
                content: <>
                    <h1>請確認數量、金額是否正確</h1>
                </>,
                props: {
                    onOk: () => {
                        TransferPurchaseOrderToProductReceipt();
                    }
                }
            });
        }
    }

    function handleClosePO(type: any) {
        myAlert.confirm({
            title: '確定結案?',
            content: <>
                <h1>轉為結案後將無法更改</h1>
            </>,
            props: {
                onOk: async () => {
                    await sentPOToReview(type);
                }
            }
        });
    }

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

    // 從口袋清單移除
    const handleRemove = (index: number) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
    };

    // 改變口袋清單值
    const handleChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = parseFloat(value.replace(/,/g, '')) || 0;
        newData[index] = {
            ...newData[index],
            [target]: newValue, // 使用計算屬性名稱來設置屬性
        };
        setData2(newData);
    };

    const handleRestore = () => {
        setData2(data2restore);
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
                            purchaseorderuuid: any,
                            data: any,
                        } = {
                            purchaseorderuuid: purchaseorderuuidin,
                            data: data
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };




                        // 發送數據到 API
                        const response = await fetch(`${setting.apipath}UpdatePOSupplier`, {
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
                        getPurchaseOrder();

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

    const handleSubmit = (e: any) => {

        e.preventDefault();
        searchData(keyword1, keyword2, keyword3);

    };


    // 採購單查詢
    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }



    return (
        <SubLayer isLoading_subLayer={false}>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag={'採購單'} panelList={panelList} />
            <div className={scss.container}>
                <div className={scss.left} style={{ display: `${leftbaropen === false ? 'none' : 'none'}` }}>
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
                            <form className={scss.modal_search_bar} onSubmit={handleSubmit} style={{ alignItems: 'center', width: '100%' }}>
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="採購日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                        datePickerProps={{
                                            props: {
                                                value: getTaiwanDateStr(keyword1 || '') ? moment(keyword1) : null,
                                                onChange: (e) => { setKeyword1((e?.toString() || '') || '') }
                                            }
                                        }}
                                    />
                                </div>
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="採購單號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword2 ? keyword2 : ' ',
                                                onChange: (e) => { setKeyword2(e.target.value) }
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ textAlign: 'right', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '5px' }}>
                                    <button className={scss.minibtn} type="submit">搜尋</button>
                                </div>
                                <div>
                                    <Thead01 type={'PurchaseOrder'} />
                                </div>
                            </form>
                        </div>

                        {/* <hr /> */}

                        <div>
                            <Tbody01 type={'PurchaseOrder'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                {/* <button className={scss.squarebtn} onClick={() => { setLeftbaropen(!leftbaropen) }}>
                                    <img src={icon_search.src} alt="search" style={{ height: '30px', width: '30px' }} />
                                </button> */}
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }}>
                                    <img src={icon_search.src} alt="search" style={{ height: '30px', width: '30px' }} />
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { alert("comming soon") }}>
                                    <img src={icon_print.src} alt="search" style={{ height: '30px', width: '30px' }} />
                                </button>
                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className={scss.head_content1}>
                            <div>

                                <InputSel
                                    {...inputSelProps}
                                    caption="採購日期"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at,
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="採購單號"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: checkfirstin === 0 ? purchaseorderidin : purchaseorderid,
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="採購人員"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: checkfirstin === 0 ? create_byin : create_by,
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="單據狀態"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: statusin,
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
                            <div></div>
                        </div>
                        <div className={scss.head_content2}>
                            <div>
                                <span style={{ display: `${statusin === "採購中" ? '' : 'none'}` }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.minibtn} onClick={handleEdit}>
                                        編輯
                                    </button>
                                </span>
                                <span style={{ display: `${statusin === "已結案" ? '' : 'none'}` }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.minidisabledbtn} >
                                        編輯
                                    </button>
                                </span>
                                <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.miniredbtn} onClick={handleSave}>
                                    儲存
                                </button>
                                &nbsp;
                                <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.minibtn} onClick={handleCancel}>
                                    取消
                                </button>
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
                        <div className={scss.head_content4}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.head_foot1}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: `${(parseInt(completereq.toString()) === parseInt(totalreq)) && statusin === "採購中" ? "" : "none"}` }}>
                                    <button className={scss.redbtn} onClick={() => { handleClosePO("結案") }}>結案</button>
                                </span>
                                <span style={{ display: `${((parseInt(completereq.toString()) < parseInt(totalreq)) && statusin === "採購中") ? '' : 'none'}` }} onClick={() => { myAlert.warning({ title: '尚未達到需求數量' }) }}>
                                    <button className={scss.disabledbtn}>結案</button>
                                </span>
                                <span style={{ display: `${statusin === '已結案' ? '' : 'none'}` }}>
                                    <button className={scss.disabledbtn}>已結案</button>
                                </span>
                            </div>
                        </div>
                        <div className={scss.head_foot2}>
                            <div>
                                <button className={scss.minibtn} onClick={() => { alert("comming soon!") }}>
                                    進貨明細
                                </button>
                            </div>
                            <div>

                            </div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="進貨進度"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: `${completereq}/${totalreq}`
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ textAlign: 'right' }}></div>
                        </div>
                        <div className={scss.body_content1}>
                            <Thead01 type={'PurchaseOrderDetail'} />
                            {/* <Tbody01 type={'PurchaseOrderDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {data1 && (
                                data1.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader11}>
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span style={{ color: '#ea1833' }}>{_item.alreadyinquantity}</span>
                                            <span>{_item.quantity}</span>
                                            <span>{_item.unit}</span>
                                            <span>{_item.unitprice.toLocaleString()}</span>
                                            <span>{_item.totalprice.toLocaleString()}</span>
                                            <span>
                                                <button style={{ display: `${(statusin === "採購中") ? '' : 'none'}` }} onClick={() => { GetProdReceiptDetailByPurchaseOrderId(_item.purchaseorderuuid, _item.id) }}>
                                                    <img src={icon_fc_arrow_down.src} alt="add" style={{ width: '20px', height: '20px' }} />
                                                </button>
                                                <button style={{ display: `${statusin === "已結案" ? '' : 'none'}` }}>
                                                    <img src={icon_fc_arrow_down_gray.src} alt="addtoList" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                </button>
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                        <br />
                        <div className={scss.body_foot1}>
                            <div>
                                流程順序：選擇進貨品項帶入下方{">"}修改進貨數量{">"}轉進貨單<br />
                                (1).請確認進貨品項與數量是否正確。<br />
                                (2).發票號碼請向廠商詢問完後點選編輯填入<br />
                                (3).請於出貨單上註明本公司產品編號,及產品名稱,以利請款。<br />
                                (4).請配合定量包裝及標示品名規格, 方便點收。
                            </div>
                            <div>
                            </div>
                            <div>

                                <table className={scss.count_table}>
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
                                </table>
                            </div>
                        </div>
                        <div className={scss.foot_head1}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: data2.length > 0 ? "" : "none" }}>
                                    <button className={scss.redbtn} onClick={handleTransfer} >新增進貨</button>
                                </span>
                                <span style={{ display: data2.length > 0 ? "none" : "" }}>
                                    <button className={scss.disabledbtn}>新增進貨</button>
                                </span>
                            </div>
                        </div>
                        <div className={scss.foot_content1}>
                            <Thead01 type={'PurchaseOrderDetail2'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader13}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>{_item.name}</span>
                                        <span style={{ color: '#ea1833' }}>
                                            {_item.alreadyinquantity}
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                type="text"
                                                maxLength={9}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newQuantity = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        quantity: newQuantity,
                                                        totalprice: newQuantity * newData[index].unitprice
                                                    };
                                                    setData2(newData);
                                                    // handleChange(index, "quantity", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>{_item.unit}</span>
                                        <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                type="text"
                                                maxLength={8}
                                                value={_item.unitprice.toLocaleString()}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                            &nbsp;&nbsp;
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))}
                        </div>
                    </div>
                </div>
                
                <Modal
                    visible={searchmodalopen}
                    footer={null}
                    onCancel={SearchModalClose}
                    width="1000px"
                    maskClosable={false}
                    title={
                        <div className={scss.modal_head_head1}>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>查詢條件：</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {data.length} 筆</span>
                            </div>
                        </div>
                    }
                    style={{ top: 250 }}
                >

                    <div className={scss.modal_head_content1}>
                        <div style={{ border: '1px solid gray', borderRight: '0px' }}>
                            <form className={scss.modal_search_bar} onSubmit={handleSubmit} style={{ alignItems: 'center', width: '100%' }}>
                                {/* <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="起始日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                        datePickerProps={{
                                            props: {
                                                value: getTaiwanDateStr(keyword1 || '') ? moment(keyword1) : null,
                                                onChange: (e) => { setKeyword1((e?.toString() || '') || '') }
                                            }
                                        }}
                                    />
                                </div>
                                <br />
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="截止日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                        datePickerProps={{
                                            props: {
                                                value: getTaiwanDateStr(keyword1 || '') ? moment(keyword1) : null,
                                                onChange: (e) => { setKeyword1((e?.toString() || '') || '') }
                                            }
                                        }}
                                    />
                                </div> */}
                                <br />
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
                                    <InputSel
                                        caption="採購日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                        datePickerProps={{
                                            props: {
                                                value: getTaiwanDateStr(keyword1 || '') ? moment(keyword1) : null,
                                                onChange: (e) => { setKeyword1((e?.toString() || '') || '') }
                                            }
                                        }}
                                    />
                                </div>
                                <br />
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="採購單號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword2 ? keyword2 : ' ',
                                                onChange: (e) => { setKeyword2(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="廠商名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
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
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
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
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
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
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
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
                                <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
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
                                <div style={{ textAlign: 'right', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '5px' }}>
                                    {/* <button className={scss.minibtn} type="submit">搜尋</button> */}
                                    <button className={scss.minibtn} type="submit">搜尋</button>
                                </div>

                            </form>
                        </div>
                        <div style={{
                            maxHeight: '500px',
                            overflowY: 'auto',
                            border: '1px solid gray',
                        }}>
                            <Thead01 type={'PurchaseOrder'} />
                            <Tbody01 type={'PurchaseOrder'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>

                    </div>
                </Modal >
            </div>
        </SubLayer >

    )

}