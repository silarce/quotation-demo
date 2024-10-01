import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _, { update } from 'lodash';

import scss from './productList.module.scss';
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
import icon_autoadd from 'public/image/icon/fc_add.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_print from 'public/image/icon/fc_printer.svg';
import { Modal } from 'antd';
import icon_export from 'public/image/icon/fc_export.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';


type Tquery = {
    wareHouseId: string | undefined;
};

export default function ProductList() {

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
        note
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
    const [productnamein, setProductnamein] = useState<string>("");
    const [productidin, setProductidin] = useState<string>("");
    const [productspecin, setProductspecin] = useState<string>("");
    const [productquantityin, setProductquantityin] = useState<string>("");
    const [update_atin, setUpdate_atin] = useState<string>("");
    const [unitin, setUnitin] = useState<string>("");
    const [materialin, setMaterialin] = useState<string>("");
    const [surfacein, setSurfacein] = useState<string>("");

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
    const [originalproductnamein, setOriginalproductnamein] = useState(productnamein);
    const [originalproductidin, setOriginalproductidin] = useState(productidin);
    const [originalproductspecin, setOriginalproductspecin] = useState(productspecin);
    const [originalunitin, setOriginalunitin] = useState(unitin);
    const [originalmaterialin, setOriginalmaterialin] = useState(materialin);
    const [originalsurfacein, setOriginalsurfacein] = useState(surfacein);

    //新增物料
    const [addproductid, setAddProductid] = useState<string>("");
    const [addproductname, setAddProductname] = useState<string>("");
    const [addproductspec, setAddProductspec] = useState<string>("");
    const [addproductunit, setAddProductunit] = useState<string>("");
    const [addproductmaterial, setAddProductmaterial] = useState<string>("");
    const [addproductsurface, setAddProductsurface] = useState<string>("");


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
    //取進貨單主檔
    const getProduct = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/GetProduct?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // if (data.length === 0) {
            //     myAlert.warning({
            //         title: "查詢結果",
            //         content: "目前沒有單據資訊可以顯示"
            //     });
            //     return;
            // }

            setData(data);
            setDatarestore(data);
            setSearchdata(data);
            setFilteredData(data);
            console.log(data);

            setProductidin(data[0].productid);
            setProductnamein(data[0].name);
            setProductspecin(data[0].spec);
            setProductquantityin(data[0].count);
            setCreate_atin(data[0].create_at);
            setUpdate_atin(data[0].create_at);
            setCreate_byin(data[0].create_by);
            setUnitin(data[0].unit);
            setMaterialin(data[0].material);
            setSurfacein(data[0].surface);

            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                // setProductnamein(data[0].name);
            }
        } catch (error: any) {
            setError("getProduct:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getProduct();
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
            getProduct();

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
            getProduct();
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

    // editModal
    const [addmodalopen, setAddmodalopen] = useState<boolean>(false);
    const AddModalClose = async () => {
        setAddmodalopen(false);
    }


    // 主檔編輯
    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalproductnamein(productnamein);
        setOriginalproductidin(productidin);
        setOriginalproductspecin(productspecin);
        setOriginalunitin(unitin);
        setOriginalmaterialin(materialin);
        setOriginalsurfacein(surfacein);
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
                    setProductnamein(originalproductnamein);
                    setProductidin(originalproductidin);
                    setProductspecin(originalproductspecin);
                    setMaterialin(originalmaterialin);
                    setUnitin(originalunitin);
                    setSurfacein(originalsurfacein);
                    setEditmain(false);
                }
            }
        });
    };

    const handleSave = async () => {
        if ((productidin === "" || productidin === undefined) ||
            (productnamein === "" || productnamein === undefined)) {
            myAlert.warning({ title: '物料編號或物料名稱不可為空' })
            return;
        }
        // 顯示確認對話框
        myAlert.confirm({
            title: '確定要更新物料嗎?',
            content: null,
            props: {
                onOk: async () => {
                    try {
                        // 建立要傳送的數據
                        const data = {
                            productid: productidin,
                            productname: productnamein,
                            productspec: productspecin,
                            productunit: unitin,
                            productmaterial: materialin,
                            productsurface: surfacein
                        }
                        console.log(data);

                        // 打印數據到控制台以供調試
                        console.log(data);
                        // return;

                        const conditionModel: {
                            data: any,
                            username: any
                        } = {
                            data: data,
                            username: userInfo?.username
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };




                        // 發送數據到 API
                        const response = await fetch(`${setting.apipath}/WareHouse/UpdateProduct`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel),
                        });

                        if (!response.ok) {
                            myAlert.err({ title: 'Product_handleSave', content: `API Status: ${response.status}` })

                        }
                        // 解析 API 響應
                        const result = await response.json();

                        // 顯示成功提示
                        myAlert.success({ title: '更新成功' })
                        setEditmain(false);
                        getProduct();

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

        // 過濾資料
        // let filteredData = data.filter(item => {
        //     const createAt = moment(item.create_at);
        //     const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
        //         ? true
        //         : createAt.isBetween(startDate, endDate, 'days', '[]');
        //     return isDateInRange;
        // });

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
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(keyword3.trim())
            );
        }

        if (keyword4) {
            filteredData = filteredData.filter(item =>
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


    const editProduct = (item: any) => {
        handleRowClick(item.productid);
        console.log(item);
        setProductnamein(item.name);
        setProductidin(item.productid);
        setProductspecin(item.spec);
        setProductquantityin(item.count);
        setCreate_atin(item.create_at);
        setUpdate_atin(item.update_at);
        setCreate_byin(item.create_by);
        setUnitin(item.unit);
        setMaterialin(item.material);
        setSurfacein(item.surface);
        // alert(item.productid);
        setAddProductid(item.productid);
        setAddProductname(item.name);
        setAddProductspec(item.spec);
        setAddProductunit(item.unit);
        setAddProductmaterial(item.material);
        setAddProductsurface(item.surface);
    }



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



    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("編輯");
    const [tabshow, setTabshow] = useState<string>("編輯");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        return tabnow === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName);
        setTabshow(tabName);
        setEditmain(false);
        setProductnamein(originalproductnamein);
        setProductidin(originalproductidin);
        setProductspecin(originalproductspecin);
        setMaterialin(originalmaterialin);
        setUnitin(originalunitin);
        setSurfacein(originalsurfacein);
    };


    //新增物料
    const handleAddProduct = () => {
        if ((addproductid === "" || addproductid === undefined) ||
            (addproductname === "" || addproductname === undefined)) {
            myAlert.warning({ title: '物料編號或物料名稱不可為空' })
            return;
        }
        if (isDuplicate) {
            myAlert.warning({ title: '物料編號已經存在' })
            return;
        }
        // 顯示確認對話框
        myAlert.confirm({
            title: '確定要新增物料嗎?',
            content: null,
            props: {
                onOk: async () => {
                    try {
                        // 建立要傳送的數據
                        const data = {
                            productid: addproductid,
                            productname: addproductname,
                            productspec: addproductspec,
                            productunit: addproductunit,
                            productmaterial: addproductmaterial,
                            productsurface: addproductsurface
                        }
                        console.log(data);

                        // 打印數據到控制台以供調試
                        console.log(data);
                        // return;

                        const conditionModel: {
                            data: any,
                            username: any
                        } = {
                            data: data,
                            username: userInfo?.username
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };




                        // 發送數據到 API
                        const response = await fetch(`${setting.apipath}/WareHouse/AddProduct`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel),
                        });

                        if (!response.ok) {
                            myAlert.err({ title: 'Product_handleAddProduct', content: `API Status: ${response.status}` })

                        }
                        // 解析 API 響應
                        const result = await response.json();

                        // 顯示成功提示
                        myAlert.success({ title: '新增成功' })
                        // setEditmain(false);
                        getProduct();
                        setKeyword2('');
                        setKeyword3('');
                        setKeyword4('');

                        // 更新狀態或執行其他操作
                        console.log(result);
                    } catch (error: any) {
                        // 顯示錯誤信息
                        myAlert.err({ title: 'FunctionError', content: error.message },)
                    }
                }
            }
        });

    }

    const handleAddProductClear = () => {
        myAlert.confirm({
            title: '確定要清除嗎?',
            content: null,
            props: {
                onOk: async () => {
                    setAddProductid('');
                    setAddProductname('');
                    setAddProductspec('');
                    setAddProductunit('');
                    setAddProductmaterial('');
                    setAddProductsurface('');
                }
            }
        });
    }

    const handleClear = () => {
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');

    }

    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        const exists = filteredData.some(item => item.productid === addproductid);
        setIsDuplicate(exists);
    }, [addproductid, filteredData]);


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'物料維護'} panelList={panelList} />
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
                        {/* <hr /> */}
                        <div>
                            {/* <Thead01 type={'ProductList'} />
                            <Tbody01 type={'ProductList'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div
                            style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
                            <div className={scss.head_head1}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div className={scss.head_foot2}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='請輸入料號'
                                        value={keyword2}
                                        style={{ padding: '4px 5px', width: '200px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                        onChange={(e) => setKeyword2(e.target.value)}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='請輸入名稱'
                                        value={keyword3}
                                        style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                        onChange={(e) => setKeyword3(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='請輸入規格'
                                        value={keyword4}
                                        style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                        onChange={(e) => setKeyword4(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <button style={{ display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                                        <img src={icon_clear.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    </button>
                                </div>
                                <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                                    <p style={{ color: '#14256a', fontSize: '16px' }}>符合總數：<span style={{ color: 'gray' }}>{filteredData.length}</span></p>
                                </div>
                                <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                                    <p style={{ color: '#14256a', fontSize: '16px' }}>物料總數：<span style={{ color: 'gray' }}>{searchdata.length}</span></p>
                                    {/* <InputSel
                                        {...inputSelProps}
                                        caption="物料數量"
                                        className='align-bottom'
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: `${searchdata.length}`
                                            },
                                        }}
                                    /> */}
                                </div>
                            </div>
                            <Thead01 type={'ProductList'} />
                        </div>
                        <div className={scss.body_content1} style={{ height: '300px', border: '1px solid #c1c1c1' }}>
                            <span>
                                {filteredData && (
                                    filteredData.slice(0, 100).map((_item: any, index: number) => (
                                        <CellWithBar key={index} className={scss.panelHeader21}>
                                            <div
                                                key={index}
                                                className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                                onClick={() => { editProduct(_item) }}
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
                                                <span>
                                                    {/* <button onClick={() => { editProduct(_item) }}>
                                                        <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                                                </span>
                                            </div>
                                        </CellWithBar>
                                    ))
                                )}
                            </span>
                        </div>

                        <div className={scss.body_foot1}>
                            <div>
                                <span>
                                    <button
                                        className={scss.minitabbtn}
                                        onClick={() => tabChosed('編輯')}
                                        style={getButtonStyle('編輯')}
                                    >
                                        編輯
                                    </button>
                                </span>
                                <span>
                                    <button
                                        className={scss.minitabbtn}
                                        onClick={() => tabChosed('新增')}
                                        style={getButtonStyle('新增')}
                                    >
                                        新增
                                    </button>
                                </span>
                            </div>
                            <div>

                            </div>
                            <div></div>
                        </div>
                        <div >

                            <div style={{ display: `${tabshow === "編輯" ? '' : 'none'}` }}>
                                <br />
                                <span style={{ padding: '0px 20px' }}>
                                    <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.minibtn} onClick={handleEdit}>
                                        編輯
                                    </button>

                                    <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.miniredbtn} onClick={handleSave}>
                                        儲存
                                    </button>
                                    &nbsp;
                                    <button style={{ display: `${editmain ? '' : 'none'}` }} className={scss.minibtn} onClick={handleCancel}>
                                        取消
                                    </button>
                                </span>
                                <div className={scss.foot_head1} style={{ borderTop: '1px solid #c1c1c1' }}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="料號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: productidin || ' ',
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

                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.foot_head2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="名稱"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: productnamein || ' ',
                                                    onChange: (e) => { setProductnamein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="規格"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: productspecin || ' ',
                                                    onChange: (e) => { setProductspecin(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="單位"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: unitin || ' ',
                                                    onChange: (e) => { setUnitin(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="材質"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: materialin || ' ',
                                                    onChange: (e) => { setMaterialin(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="表面"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: surfacein || ' ',
                                                    onChange: (e) => { setSurfacein(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ borderLeft: '1px solid #c1c1c1', padding: '0px 10px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="庫存數量"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: productquantityin || 0,
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="更新時間"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: getTaiwanDateStr(update_atin) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="更新人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: create_byin || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="建立時間"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="建立人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: create_byin || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <br />
                            </div>
                            <div style={{ display: `${tabshow === "新增" ? '' : 'none'}` }}>
                                <br />
                                <span style={{ padding: '0px 20px' }}>
                                    {/* <span >
                                            <button style={{ display: `${editmain ? 'none' : ''}` }} className={scss.minibtn} onClick={handleEdit}>
                                                編輯
                                            </button>
                                            </span> */}
                                    <button className={scss.miniredbtn} onClick={() => { handleAddProduct() }}>
                                        新增
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className={scss.minibtn} onClick={() => { handleAddProductClear() }} style={{ display: `${(addproductid != '' || addproductname != '' || addproductspec != '' || addproductunit != '' || addproductmaterial != '' || addproductsurface != '') ? '' : 'none'}` }}>
                                        清除
                                    </button>
                                </span>
                                <div className={scss.foot_head1} style={{ borderTop: '1px solid #c1c1c1' }}>
                                    <div >
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="物料編號"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductid || ' ',
                                                    onChange: (e) => { setAddProductid(e.target.value) }
                                                },
                                            }}
                                        /> */}
                                        <InputSel
                                            {...inputSelProps}
                                            caption="料號"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductid,
                                                    onChange: (e) => setAddProductid(e.target.value),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        {isDuplicate && <p style={{ fontSize: '16px', color: 'red' }}>物料編號已存在！</p>}
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.foot_head2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="名稱"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductname || '',
                                                    onChange: (e) => { setAddProductname(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="規格"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductspec || '',
                                                    onChange: (e) => { setAddProductspec(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="單位"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductunit || '',
                                                    onChange: (e) => { setAddProductunit(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="材質"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductmaterial || '',
                                                    onChange: (e) => { setAddProductmaterial(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="表面"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductsurface || '',
                                                    onChange: (e) => { setAddProductsurface(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ borderLeft: '1px solid #c1c1c1', padding: '0px 10px' }}>
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="庫存數量"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: productquantityin || ' ',
                                                },
                                            }}
                                        /> */}

                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                visible={addmodalopen}
                footer={null}
                onCancel={AddModalClose}
                width="1000px"
                maskClosable={false}
                title={
                    <div className={scss.modal_head_head1}>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>新增物料：</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}></span>
                        </div>
                    </div>
                }
                style={{ top: 250 }}
            >

                <div className={scss.modal_head_content1}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料編號</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料編號'
                            value={addproductid || ''}
                            style={{ padding: '0px 10px', width: 'auto', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductid(e.target.value)}
                        />
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div className={scss.modal_head_content2}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料名稱</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料名稱'
                            value={addproductname || ''}
                            style={{ padding: '0px 10px', width: '500px', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductname(e.target.value)}
                        />
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div className={scss.modal_head_content3}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料規格</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料規格'
                            value={addproductspec || ''}
                            style={{ padding: '0px 10px', width: '500px', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductspec(e.target.value)}
                        />
                    </div>
                    <div></div>
                </div>
                <div className={scss.modal_head_content4}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料單位</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料單位'
                            value={addproductunit || ''}
                            style={{ padding: '0px 10px', width: '200px', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductunit(e.target.value)}
                        />
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div className={scss.modal_head_content5}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料材質</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料單位'
                            value={addproductmaterial || ''}
                            style={{ padding: '0px 10px', width: '200px', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductmaterial(e.target.value)}
                        />
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div className={scss.modal_head_content6}>
                    <div>
                        <span style={{ color: '#14256a', fontSize: '18px' }}>物料表面</span>
                        <input
                            type="text"
                            placeholder='　請輸入物料表面'
                            value={addproductsurface || ''}
                            style={{ padding: '0px 10px', width: '200px', fontSize: '18px', borderBottom: '1px solid #14256a' }}
                            onChange={(e) => setAddProductsurface(e.target.value)}
                        />
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </Modal >
        </SubLayer >

    )

}