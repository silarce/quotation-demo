import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './prodReceiptList.module.scss';
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
import icon_print from 'public/image/icon/fc_printer.svg';
import { Modal, Radio, Space } from 'antd';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_flow from 'public/image/icon/fc_flow.svg';
import icon_review from 'public/image/icon/review.svg';
import icon_flow_gray from 'public/image/icon/fc_flow_gray.svg';
import icon_sent_review_stop from 'public/image/icon/fc_sent_review_stop.svg';
import icon_sent_review from 'public/image/icon/fc_sent_review.svg';
import icon_sent_review_gray from 'public/image/icon/fc_sent_review_gray.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
type Tquery = {
    wareHouseId: string | undefined;
};

export default function ProdReceiptList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        prodreceiptuuid,
        prodreceiptid,
        purchaseorderuuid,
        purchaseorderid,
        purchaseordercreate_at,
        purchaseordercreate_by,
        create_at,
        create_by,
        inspected,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice,
        status,
        entrystatus,
        paystatus,
        note,
        viewtype
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
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchdata, setSearchdata] = useState<any[]>([]);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(true);
    const [addprodentrybtn, setAddprodentrybtn] = useState<boolean>(true);


    const [inspectedin, setInspectedin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [purchaseordercreate_atin, setPurchaseordercreate_atin] = useState<string>("");
    const [purchaseordercreate_byin, setPurchaseordercreate_byin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    const [prodreceiptuuidin, setProdreceiptuuidin] = useState<string>("");
    const [prodreceiptidin, setProdreceiptidin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [entrystatusin, setEntrystatusin] = useState<string>("");
    const [paystatusin, setPaystatusin] = useState<string>("");
    const [notein, setNotein] = useState<string>("");

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


    //入庫總數
    const [totalentry, setTotalentry] = useState<string>("");
    //入庫進度
    const [completeentry, setCompleteentry] = useState<number>(0);

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
            const response = await fetch(`${setting.apipath}/WareHouse/SearchProdReceiptById?${queryParams}`);
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
        // {
        //     type: 'addButton',
        //     label: '新增進貨單',
        //     onClick: () => {
        //         // setOpen(true);
        //         router.push({
        //             pathname: `/factoryDepartment/addProdReceipt`,
        //             query: {
        //                 type: 'addProdreceipt',
        //             },
        //         });
        //     },
        // },
    ];
    //#endregion

    //#region call api
    //取進貨單主檔
    const getProdReceipt = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/GetProdReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            // if (data.length === 0) {
            //     myAlert.warning({
            //         title: '尚無單據'
            //     })
            //     return;
            // }

            setData(data);
            setDatarestore(data);
            setSearchdata(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                getProdReceiptDetail(data[0].prodreceiptuuid);
                // GetProdReceiptDetailByPurchaseOrderId(data[0].prodreceiptuuid);
                setCreate_atin(data[0].create_at);
                setPurchaseorderuuidin(data[0].purchaseorderuuid);
                setPurchaseorderidin(data[0].purchaseorderid);
                setProdreceiptuuidin(data[0].prodreceiptuuid);
                setProdreceiptidin(data[0].prodreceiptid);
                setCreate_byin(data[0].create_by);
                setPurchaseordercreate_atin(data[0].purchaseordercreate_at);
                setPurchaseordercreate_byin(data[0].purchaseordercreate_by);
                setSuppliernamein(data[0].suppliername);
                setSuppliertaxidin(data[0].suppliertaxid);
                setInspectedin(data[0].inspected.toString());
                setSupplieraddressin(data[0].supplieraddress);
                setStatusin(data[0].status);
                setSupplierphonein(data[0].supplierphone);
                setInvoicein(data[0].invoice);
                setEntrystatusin(data[0].entry_status);
                setPaystatusin(data[0].pay_status);
                setNotein(data[0].note);
                GetReviewById(data[0].prodreceiptuuid);//審核
                GetReviewHistory(data[0].prodreceiptid)
            }
        } catch (error: any) {
            setError("getProdReceipt:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getProdReceipt();
            GetReviewFlow();//審核
            hasFetchedData.current = true;
        }
    }, []);



    //取對應的進貨明細
    const getProdReceiptDetail = async (prodreceiptuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodreceiptuuid: string | undefined
            } = {
                prodreceiptuuid: prodreceiptuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetProdReceiptDetailById?${queryParams}`);
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
            let totalentry = data.length; // 總數量
            let completeentry = 0; // 完成數量

            data.forEach((element: any) => {
                // 將 alreadyinquantity 和 quantity 轉換為整數
                const alreadyInQuantity = parseInt(element.alreadyinquantity, 10);
                const quantity = parseInt(element.quantity, 10);

                if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity >= quantity) {
                    completeentry += 1;
                }
            });
            setTotalentry(totalentry);
            setCompleteentry(completeentry);



        } catch (error: any) {
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        if (prodreceiptuuid) {
            if (prodreceiptuuidin != prodreceiptuuid) {
                setData2([]);
            }
            // getProdReceiptDetail(prodreceiptuuid);
            // if (prodreceiptdetailuuid) {
            //     GetProdReceiptDetailByPurchaseOrderId(purchaseorderuuid, purchaseorderdetailuuid);
            // }
            getProdReceiptDetail(prodreceiptuuid);
            // GetProdReceiptDetailByPurchaseOrderId(prodreceiptuuid);
            setPurchaseorderidin(purchaseorderid as string);
            setPurchaseorderuuidin(purchaseorderuuid as string);
            setProdreceiptuuidin(prodreceiptuuid as string);
            setProdreceiptidin(prodreceiptid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setPurchaseordercreate_atin(purchaseordercreate_at as string);
            setPurchaseordercreate_byin(purchaseordercreate_by as string);
            setSuppliernamein(suppliername as string);
            setSuppliertaxidin(suppliertaxid as string);
            setInspectedin(inspected as string);
            setSupplieraddressin(supplieraddress as string);
            setStatusin(status as string);
            setSupplierphonein(supplierphone as string);
            setInvoicein(invoice as string);
            setEntrystatusin(entrystatus as string);
            setPaystatusin(paystatus as string);
            setNotein(note as string);
            // GetReviewById(prodreceiptuuid);//審核
            // GetReviewHistory(prodreceiptid as string);
        }
    }, [prodreceiptuuid]);

    //取已對應進貨單的已入庫單
    const GetProdEntryDetailByProdReceiptId = async (prodreceiptuuid: any, prodreceiptdetailuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel= {
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
        try {
            // return;
            setIsLoading(true);


            const conditionModel: {
                prodreceiptuuid: string | undefined,
                data: any,
                username: string | undefined
            } = {
                prodreceiptuuid: checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid as string | undefined,
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
            getProdReceipt();

            getProdReceiptDetail(prodreceiptuuidin);
            await new Promise(resolve => setTimeout(resolve, 500));
            setEntrystatusin("入庫中");
            // GetProdEntryDetailByProdReceiptId(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




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

    const sentPREToReview = async (type: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                type: string | undefined,
                prodreceiptuuid: string | undefined,
                username: string | undefined
            } = {
                type: type,
                prodreceiptuuid: prodreceiptuuidin as string | undefined,
                username: userInfo?.username as string | undefined
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/sentPREToReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            getProdReceipt();
            getProdReceiptDetail(prodreceiptuuidin);
            await new Promise(resolve => setTimeout(resolve, 500));
            // setStatusin(type);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    // 進貨單查詢
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
                            prodreceiptuuid: any,
                            data: any,
                            note: any
                        } = {
                            prodreceiptuuid: prodreceiptuuidin,
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
                        const response = await fetch(`${setting.apipath}/WareHouse/UpdatePReceiptSupplier`, {
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
                        getProdReceipt();

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
                item.prodreceiptid.toString().includes(requisitionId)
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


    const sentToPrint = async (ip: any) => {
        myAlert.confirm({
            title: '確定要列印此單據嗎?',
            content: <>
                <h1>請確認單據是否詢價完成</h1>
            </>,
            props: {
                onOk: async () => {
                    try {
                        const conditionModel = {
                            id: prodreceiptidin,
                            type: "prodreceipt",
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


    const closeDoc = async (type: any) => {
        try {
            const conditionModel = {
                prodreceiptuuid: prodreceiptuuidin,
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
            const response = await fetch(`${setting.apipath}/WareHouse/sentPReceToReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            getProdReceipt();
            getProdReceiptDetail(prodreceiptuuidin);
            setStatusin("已結案");

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    }

    //#region 審核
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
                username: userInfo?.username
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
            setIsLoading(true);

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
            setIsLoading(false);
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
            if (review_flow === "") {
                setReviewbar(true);
            }
            else {
                const review_query = {
                    prodreceiptuuid: prodreceiptuuidin,
                    prodreceiptid: prodreceiptidin,
                    purchaseorderuuid: purchaseorderuuidin,
                    purchaseorderid: purchaseorderidin,
                    purchaseordercreate_at: purchaseordercreate_atin,
                    purchaseordercreate_by: purchaseordercreate_byin,
                    suppliername: suppliernamein,
                    suppliertaxid: suppliertaxidin,
                    supplieraddress: supplieraddressin,
                    supplierphone: supplierphonein,
                    invoice: invoicein,
                    create_at: create_atin,
                    create_by: create_byin,
                    status: '進貨中',
                    note: notein,
                    firstin: 1,
                };

                const conditionModel = {
                    document_id: prodreceiptidin,
                    document_uuid: prodreceiptuuidin,
                    document_type: "進貨單",
                    review_id: review_flow,
                    query: review_query,
                    username: userInfo?.username,
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
                GetReviewById(prodreceiptuuidin);


                await new Promise(resolve => setTimeout(resolve, 500));

                //改變單據狀態
                const conditionModel2 = {
                    type: type,
                    prodreceiptuuid: prodreceiptuuidin as string | undefined,
                    username: userInfo?.username as string | undefined
                };




                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel2),
                };

                const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                const response2 = await fetch(`${setting.apipath}/WareHouse/sentPReceToReview?${queryParams}`);
                if (!response2.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data2 = await response2.json();
                getProdReceipt();
                getProdReceiptDetail(prodreceiptuuidin);
                setStatusin("審核中");





            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    }

    const handleChoseflow = () => {
        setReviewbar(true);
        setDocumenttitle(`【進貨單】【${prodreceiptidin}】_${userInfo?.username}`)
    }

    const handleGetReviewBack = () => {
        myAlert.confirm({
            title: '確定要抽單嗎?',
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            document_uuid: prodreceiptuuidin,
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
                        GetReviewHistory(prodreceiptidin);


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
                id: id
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

    //#region Tab頁籤切換
    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("單據明細");
    const [tabshow, setTabshow] = useState<string>("單據明細");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        // return tabnow === tabName ? { color: '#14256a', borderColor: '#c1c1c1', backgroundColor: 'white', borderBottom: '0px' } : {};
        return tabnow === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName);
        setTabshow(tabName);
    };

    //#endregion


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'進貨單'} panelList={panelList} />
            <div className={scss.container}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1} style={{ display: viewtype === 'review' ? 'none' : '' }}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查詢單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                {/* &nbsp;
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查詢單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    採購
                                </button> */}
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { Print() }} title="列印">
                                    <img src={icon_print.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    列印
                                </button>
                                {/* <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查找">
                                    <img src={icon_search.src} alt="search" style={{ height: '30px', width: '30px' }} />
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { alert("comming soon") }} title="列印">
                                    <img src={icon_print.src} alt="search" style={{ height: '30px', width: '30px' }} />
                                </button> */}


                            </div>
                            <div>
                                <span style={{ display: `${statusin === "進貨中" ? '' : 'none'}` }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.squarebtn} onClick={handleEdit}>
                                        <img src={icon_edit.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        編輯
                                    </button>
                                </span>
                                <span style={{ display: `${statusin === "已核准" ? '' : 'none'}` }}>
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
                                {/*   <button
                                    className={scss.squarebtn}
                                    onClick={() => { handleChoseflow() }}
                                    title="單據送審"
                                    style={{
                                        display: `${(statusin !== '審核中' && statusin !== '已核准' && statusin !== '已結案') ? '' : 'none'}`
                                    }}
                                >
                                    <img src={icon_flow.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    流程
                                </button>
                                <button
                                    className={scss.disablesquarebtn}
                                    title="審核流程"
                                    style={{
                                        display: `${(statusin === '審核中' || statusin === '已核准' || statusin === '已結案') ? '' : 'none'}`
                                    }}
                                >
                                    <img src={icon_flow_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    流程
                                </button>
                                &nbsp;
                                <button
                                    className={scss.squarebtn}
                                    style={{
                                        display: `${(statusin !== '審核中' && statusin !== '已核准' && statusin !== '已結案') ? '' : 'none'}`
                                    }}
                                    onClick={() => { sentToReview("審核") }}
                                    title="單據送審"
                                >
                                    <img src={icon_sent_review.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    送審
                                </button>
                                <button
                                    className={scss.disablesquarebtn}
                                    style={{
                                        display: `${(statusin === '審核中' || statusin === '已核准' || statusin === '已結案') ? '' : 'none'}`
                                    }}
                                    title="單據送審"
                                >
                                    <img src={icon_sent_review_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    送審
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} style={{ display: `${statusin === '審核中' ? '' : 'none'}` }} title="單據送審" onClick={() => { handleGetReviewBack() }}>
                                    <img src={icon_sent_review_stop.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    抽單
                                </button>

                                <button style={{ display: `${completeentry === parseInt(totalentry) && statusin === '已核准' ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { closeDoc("結案") }} title="單據結案">
                                    <img src={icon_task_open.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button> */}
                                <button style={{ display: `${completeentry != parseInt(totalentry) && statusin === '已核准' ? '' : 'none'}` }} className={scss.disablesquarebtn} title="單據未結">
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
                                            caption="進貨單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? prodreceiptidin : prodreceiptid) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? purchaseorderidin : purchaseorderid) || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="進貨日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(purchaseordercreate_atin)?.toString() : purchaseordercreate_at) || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="進貨人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? create_byin : create_by) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? purchaseordercreate_byin : purchaseordercreate_by) || ' ',
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
                                                value: totalentry ? `${completeentry}/${totalentry}` : ' ',
                                            },
                                        }}
                                    />

                                </div>
                            </div>
                        </div>
                        <div className={scss.head_tab}>
                            <div>
                                <span>
                                    <button
                                        className={scss.detailminitabbtn}
                                        onClick={() => tabChosed('單據明細')}
                                        style={getButtonStyle('單據明細')}
                                    >
                                        單據明細
                                    </button>
                                </span>
                                <span>
                                    {/* <button
                                        className={scss.detailminitabbtn}
                                        onClick={() => tabChosed('審核明細')}
                                        style={getButtonStyle('審核明細')}
                                    >
                                        審核明細
                                    </button> */}
                                </span>
                            </div>
                            <div></div>
                        </div>
                        <div className={scss.tabbody}>
                            <div>
                                <div style={{ display: `${tabshow === "單據明細" ? '' : 'none'}` }}>
                                    <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                        <div>
                                            <Thead01 type={'ProdReceiptDetail'} />
                                            {/* <Tbody01 type={'ProdReceiptDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                                            {data1 && (
                                                data1.map((_item: any, index: number) => (
                                                    <CellWithBar key={index} className={scss.panelHeader14}>
                                                        <div className={scss.row01}>
                                                            <span>
                                                                <button
                                                                    onClick={() => { GetProdEntryDetailByProdReceiptId(_item.prodreceiptuuid, _item.id) }}
                                                                    style={{ display: `${(completeentry < parseInt(totalentry)) ? '' : 'none'}` }}>
                                                                    <img src={icon_fc_arrow_down.src} alt="add" style={{ width: '20px', height: '20px' }} />
                                                                </button>

                                                                <button
                                                                    style={{ display: `${(completeentry === parseInt(totalentry)) && statusin === "進貨中" || statusin === "已結案" ? '' : 'none'}` }}>
                                                                    <img src={icon_fc_arrow_down_gray.src} alt="addtoList" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                                </button>

                                                            </span>
                                                            <span>{index + 1}</span>
                                                            <span>{_item.productid}</span>
                                                            <span>{_item.name}</span>
                                                            <span>{_item.spec}</span>
                                                            <span style={{ color: '#ea1833' }}>{_item.alreadyinquantity}</span>
                                                            <span>{_item.quantity.toLocaleString()}</span>
                                                            <span>{_item.unit}</span>
                                                            <span>{_item.unitprice.toLocaleString()}</span>
                                                            <span>{_item.totalprice.toLocaleString()}</span>
                                                            <span className="truncate" title={_item.note}>{_item.note}</span>
                                                        </div>
                                                    </CellWithBar>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: `${tabshow === "審核明細" ? '' : 'none'}` }}>
                                    <div className={scss.body_content1} >
                                        <div style={{ overflowX: 'auto' }}>
                                            <Thead01 type={'ReviewHistory'} />
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
                            </div>
                        </div>
                        <br />
                        <div className={scss.body_foot1}>
                            <div>
                                (1).轉入庫單進行入庫<br />
                            </div>
                            <div></div>
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
                        <div className={scss.body_foot2}>
                            <div>
                                {reviewflowdata.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                                        {item.stages.map((stage: any, stageIndex: any) => (
                                            <div key={stageIndex} style={{ flex: 1, flexDirection: 'column', textAlign: 'left', marginRight: '10px' }}>
                                                <span style={{ fontSize: '18px', color: '#14256a' }}>{stage.review_title}</span>
                                                <br />
                                                <span style={{ fontSize: '16px' }}>{stage.review_person}</span>
                                                <span style={{ padding: '0px 5px', display: `${stage.review_time === "0001-01-01T00:00:00" ? 'none' : ''}` }}>
                                                    <img src={icon_review.src} alt="review_status" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                                    {reviewflowdata2.map((item, index) => (
                                        <div key={index} style={{ textAlign: 'left', flex: 1 }}>
                                            <span style={{ fontSize: '18px', color: '#14256a' }}>{item.stage_user_title}</span>
                                            <br />
                                            <span style={{ fontSize: '16px' }}>{item.stage_user_name}</span>
                                            {/* <span style={{ padding: '0px 5px' }}>
                                                <img src={icon_review.src} alt="review_status" style={{ color: 'red', width: '20px', height: '20px' }} />
                                            </span> */}
                                        </div>
                                    ))}
                                </div>
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
                                <span style={{ display: `${(completeentry >= parseInt(totalentry, 10) === true) || data2.length > 0 ? 'none' : ''}` }}>
                                    <button className={scss.disabledbtn}>新增入庫</button>
                                </span> */}

                                <button style={{ display: `${data2.length > 0 ? '' : 'none'}` }} className={scss.squarebtn} onClick={() => { handleTransfer() }} title="新增入庫">
                                    <img src={icon_fc_add2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                <button style={{ display: `${data2.length === 0 ? '' : 'none'}` }} className={scss.disablesquarebtn} title="新增入庫">
                                    <img src={icon_add2_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>

                                {/* <span style={{ display: `${(completeentry >= parseInt(totalentry, 10) === true) ? '' : 'none'}` }}>
                                    <button className={scss.disabledbtn}>轉入庫中</button>
                                </span> */}
                                {/* <span style={{ display: `${(completeentry >= parseInt(totalentry, 10) === true) && entrystatusin === "已入庫" ? '' : 'none'}` }}>
                                    <button className={scss.disabledbtn}>入庫完畢</button>
                                </span> */}
                            </div>
                            <div></div>
                            <div>
                            </div>
                            <div style={{ textAlign: 'right' }}>

                                {/* <span style={{ display: `${(data2.length > 0 ? '' : 'none')}` }}>
                                    <button className={scss.redbtn} onClick={() => { alert("comming soon") }}>新增付款</button>
                                </span>
                                <span style={{ display: `${(data2.length > 0 ? 'none' : '')}` }}>
                                    <button className={scss.disabledbtn}>新增付款</button>
                                </span> */}

                            </div>
                        </div>

                        <div className={scss.foot_content1}>

                            <Thead01 type={'ProdReceiptDetail2'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader13}>
                                    <div className={scss.row01}>
                                        <span>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                        </span>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>{_item.name}</span>
                                        <span style={{ color: 'red' }}>
                                            {_item.alreadyinquantity}
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                                                type="text"
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    let newQuantity = e.target.value;
                                                    // 如果新數量超過最大數量，設置為最大數量
                                                    if (newQuantity > _item.maxquantity) {
                                                        newQuantity = _item.maxquantity;
                                                    }
                                                    newData[index] = {
                                                        ...newData[index],
                                                        quantity: newQuantity,
                                                        totalprice: ((parseFloat(newQuantity || '0') * newData[index].unitprice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                        <span>{_item.unit}</span>
                                        <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                                                type="text"
                                                value={_item.unitprice.toLocaleString()}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                // readOnly
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
                                            <input
                                                ref={noteRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '250px' }}
                                                type="text"
                                                value={_item.note}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newNote = e.target.value;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        note: newNote
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>


                                    </div>
                                </CellWithBar>
                            ))}
                        </div>
                    </div>
                </div>
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
                        <div className={scss.modal_head_head1}>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {searchdata.length} 筆</span>
                            </div>
                        </div>
                    }
                    style={{ top: 250 }}
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
                                        disabled={false}
                                        style={{
                                            fontSize: '18px',
                                            borderBottom: '1px solid #14256a',
                                            color: '#14256a'
                                        }}
                                    >
                                        <option value="">全部</option>
                                        <option value="進貨中">進貨中</option>
                                        <option value="審核中">審核中</option>
                                        <option value="已核准">已核准</option>
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
                            border: '1px solid gray',
                        }}>
                            <Thead01 type={'ProdReceipt'} />
                            <Tbody01 type={'ProdReceipt'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>

                    </div>
                    {/* </Modal > */}
                </DragableModal>

                {/* 審核 */}
                <DragableModal
                    handleText="選擇審核流程"
                    style={{ zIndex: '1001', width: '820px' }}
                    show={reviewbar}
                    onCrossClick={() => { setReviewbar(false) }}>
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
                                    <Radio key={_item.id} value={_item.id} onClick={() => { setReview(_item) }} style={{ fontSize: '18px', width: '800px', borderBottom: '1px solid #ccc', padding: '5px' }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                            {_item.name}：
                                            {_item.stages.map((_stage: any, index: number) => (
                                                <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                                                    {_stage.review_type}：{_stage.stage_user_name}
                                                    {index < _item.stages.length - 1 && (
                                                        <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>



                </DragableModal>
            </div>
        </SubLayer >

    )

}