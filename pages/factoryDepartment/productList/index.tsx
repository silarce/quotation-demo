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
import icon_add from 'public/image/icon/fc_add2.svg';
import icon_search2 from 'public/image/icon/search.svg';

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
    const [producttypedata, setProducttypedata] = useState<any[]>([]);
    const [classificationdata, setClassificationdata] = useState<any[]>([]);
    const [componentdata, setComponentdata] = useState<any[]>([]);
    const [materialdata, setMaterialdata] = useState<any[]>([]);
    const [surfacedata, setSurfacedata] = useState<any[]>([]);

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
    const [oldproductid, setOldProductid] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");

    // 物料編碼搜尋
    const [keywordclassification, setKeywordclassification] = useState<string>("");
    const [keywordcomponent, setKeywordcomponent] = useState<string>("");
    const [keywordmaterial, setKeywordmaterial] = useState<string>("");
    const [keywordsurface, setKeywordsurface] = useState<string>("");

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
    const [originaloldproductid, setOriginaloldproductid] = useState(surfacein);

    //新增物料
    const [addproductid, setAddProductid] = useState<string>("SJ");
    const [addproductname, setAddProductname] = useState<string>("");
    const [addproductspec, setAddProductspec] = useState<string>("");
    const [addproductunit, setAddProductunit] = useState<string>("");
    const [addproductmaterial, setAddProductmaterial] = useState<string>("");
    const [addproductsurface, setAddProductsurface] = useState<string>("");
    const [addoldproductid, setAddOldProductid] = useState<string>("");


    const [handinputclassificationcodename, setHandinputclassificationcodename] = useState<string>("");
    const [handinputclassificationname, setHandinputclassificationname] = useState<string>("");
    const [handinputcomponentcodename, setHandinputcomponentcodename] = useState<string>("");
    const [handinputcomponentname, setHandinputcomponentname] = useState<string>("");
    const [handinputmaterialcodename, setHandinputmaterialcodename] = useState<string>("");
    const [handinputmaterialname, setHandinputmaterialname] = useState<string>("");
    const [handinputsurfacecodename, setHandinputsurfacecodename] = useState<string>("");
    const [handinputsurfacename, setHandinputsurfacename] = useState<string>("");

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
        getProductidType();
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


    const getProductidType = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/GetProductidType?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setProducttypedata(responsedata);
            // 過濾出 type 為 classification 的資料，並設置到 classificationdata
            const classificationData = responsedata.filter((item: any) => item.type === 'classification');
            setClassificationdata(classificationData);
            setFilteredClassificationData(classificationData);

            const componentData = responsedata.filter((item: any) => item.type === 'component');
            setComponentdata(componentData);
            setFilteredComponentData(componentData);

            const materialData = responsedata.filter((item: any) => item.type === 'material');
            setMaterialdata(materialData);
            setFilteredMaterialData(materialData);

            // 過濾出 type 為 classification 的資料，並設置到 classificationdata
            const surfaceData = responsedata.filter((item: any) => item.type === 'surface');
            setSurfacedata(surfaceData);
            setFilteredSurfaceData(surfaceData);


            console.log(responsedata);

        } catch (error: any) {
            // setError("getProduct:" + error.message);
            console.log(error.message);
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
        setOriginaloldproductid(oldproductid);
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
                    setOldProductid(originaloldproductid);
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
                            productsurface: surfacein,
                            oldproductid: oldproductid
                        }
                        // console.log(data);

                        // 打印數據到控制台以供調試
                        // console.log(data);
                        // return;

                        const conditionModel = {
                            data: data,
                            username: userInfo?.employee?.chName.toString()
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
        setOldProductid(item.oldcode);
        setAddProductid(item.productid);
        setAddProductname(item.name);
        setAddProductspec(item.spec);
        setAddProductunit(item.unit);
        setAddProductmaterial(item.material);
        setAddProductsurface(item.surface);
        setAddOldProductid(item.oldcode);
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
        setOldProductid(originaloldproductid);
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
        if (addproductid.length < 14) {
            myAlert.warning({ title: '料號不符合編碼原則，請重新編碼' })
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
                            productsurface: addproductsurface,
                            oldproductid: addoldproductid
                        }
                        // console.log(data);

                        // 打印數據到控制台以供調試
                        // console.log(data);
                        // return;

                        const conditionModel = {
                            data: data,
                            username: userInfo?.employee?.chName.toString()
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


                        setType1SelectedOption('');
                        setType1SelectedValue('');
                        setType2SelectedOption('');
                        setType2SelectedValue('');
                        setType4SelectedOption('');
                        setType4SelectedValue('');
                        setType5SelectedOption('');
                        setType5SelectedValue('');

                        setAddProductid('');
                        setAddProductname('');
                        setAddProductspec('');
                        setAddProductunit('');
                        setAddProductmaterial('');
                        setAddProductsurface('');
                        setAddOldProductid('');

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
                    setAddProductid('SJ');
                    setAddProductname('');
                    setAddProductspec('');
                    setAddProductunit('');
                    setAddProductmaterial('');
                    setAddProductsurface('');
                    setAddOldProductid('');

                    setType1SelectedOption('');
                    setType1SelectedValue('');
                    setType2SelectedOption('');
                    setType2SelectedValue('');
                    setType3InputedValue('');
                    setType4SelectedOption('');
                    setType4SelectedValue('');
                    setType5SelectedOption('');
                    setType5SelectedValue('');
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


    // 物料
    const [type1selectedOption, setType1SelectedOption] = useState('成品');
    const [type1selectedvalue, setType1SelectedValue] = useState('');
    const [type2selectedOption, setType2SelectedOption] = useState('門型');
    const [type2selectedvalue, setType2SelectedValue] = useState('');
    const [type3inputedvalue, setType3InputedValue] = useState('');
    const [type4selectedOption, setType4SelectedOption] = useState('材質');
    const [type4selectedvalue, setType4SelectedValue] = useState('');
    const [type5selectedOption, setType5SelectedOption] = useState('表面');
    const [type5selectedvalue, setType5SelectedValue] = useState('');
    const handelSetProductid = async (type: any, e: any) => {

        switch (type) {
            case 'type1':
                e.target.blur(); // 讓 select 失去焦點
                setType1SelectedOption(e.target.value);
                setType1SelectedValue(e.target.value);
                // setAddProductid(addproductid + e.target.value);
                // setAddProductid(addproductid + type1selectedvalue + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
                break;
            case 'type2':
                e.target.blur(); // 讓 select 失去焦點
                setType2SelectedOption(e.target.value);
                setType2SelectedValue(e.target.value);
                // setAddProductid(addproductid + type1selectedvalue  + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
                break;
            case 'type3':
                setType3InputedValue(e.target.value);
                // setAddProductid(addproductid + type1selectedvalue  + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
                break;
            case 'type4':
                e.target.blur(); // 讓 select 失去焦點
                setType4SelectedOption(e.target.value);
                setType4SelectedValue(e.target.value);
                // setAddProductid(addproductid + type1selectedvalue  + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
                break;
            case 'type5':
                e.target.blur(); // 讓 select 失去焦點
                setType5SelectedOption(e.target.value);
                setType5SelectedValue(e.target.value);
                // setAddProductid(addproductid + type1selectedvalue  + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
                break;
            default:
                // 如果需要處理其他類型，可以在這裡加上
                break;
        }
    }
    useEffect(() => {
        // 更新 addproductid，基於最新的 state
        setAddProductid("SJ" + type1selectedvalue + type2selectedvalue + type3inputedvalue + type4selectedvalue + type5selectedvalue);
    }, [type1selectedvalue, type2selectedvalue, type3inputedvalue, type4selectedvalue, type5selectedvalue]);


    const exampledata = [
        { company: 'SJ', category: 'S', subCategory: 'BT', serial: '00001', material: '01', surface: '2B', productid: '', name: '50*50*3t 不銹鋼#304底座角鐵' },
        { company: 'SJ', category: 'M', subCategory: 'MO', serial: 'A0041', material: '00', surface: '00', productid: '', name: '大同馬達' },
    ];


    const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 取得使用者輸入，去掉前面的 "SJ" 部分，只保留後面的部分
        const inputValue = e.target.value;

        // 確保 "SJ" 之前的部分不會被刪除，並且只更新 "SJ" 之後的部分
        const newValue = inputValue.slice(2);  // 只取使用者修改的部分，去掉 "SJ"
        setAddProductid("SJ" + newValue);      // 始終將 "SJ" 作為開頭
        if (addproductid === "SJ") {

            setType1SelectedOption('');
            setType1SelectedValue('');
            setType2SelectedOption('');
            setType2SelectedValue('');
            setType3InputedValue('');
            setType4SelectedOption('');
            setType4SelectedValue('');
            setType5SelectedOption('');
            setType5SelectedValue('');
        }
    };



    const [filteredclassificationData, setFilteredClassificationData] = useState<any[]>([]);

    // 監聽條件變更
    useEffect(() => {
        let filteredData = classificationdata;

        if (keywordclassification) {
            const keyword = keywordclassification.trim();

            // 過濾 name 和 code_name 欄位
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(keyword) ||
                item.code_name.toString().includes(keyword)
            );
        }

        setFilteredClassificationData(filteredData);
    }, [keywordclassification, classificationdata]);


    const [filteredcomponentData, setFilteredComponentData] = useState<any[]>([]);

    // 監聽條件變更
    useEffect(() => {
        let filteredData = componentdata;

        if (keywordcomponent) {
            const keyword = keywordcomponent.trim();

            // 過濾 name 和 code_name 欄位
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(keyword) ||
                item.code_name.toString().includes(keyword)
            );
        }

        setFilteredComponentData(filteredData);
    }, [keywordcomponent, componentdata]);

    const [filteredmaterialData, setFilteredMaterialData] = useState<any[]>([]);

    // 監聽條件變更
    useEffect(() => {
        let filteredData = materialdata;

        if (keywordmaterial) {
            const keyword = keywordmaterial.trim();

            // 過濾 name 和 code_name 欄位
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(keyword) ||
                item.code_name.toString().includes(keyword)
            );
        }

        setFilteredMaterialData(filteredData);
    }, [keywordmaterial, materialdata]);


    const [filteredsurfaceData, setFilteredSurfaceData] = useState<any[]>([]);

    // 監聽條件變更
    useEffect(() => {
        let filteredData = surfacedata;

        if (keywordsurface) {
            const keyword = keywordsurface.trim();

            // 過濾 name 和 code_name 欄位
            filteredData = filteredData.filter(item =>
                item.name.toString().includes(keyword) ||
                item.code_name.toString().includes(keyword)
            );
        }

        setFilteredSurfaceData(filteredData);
    }, [keywordsurface, surfacedata]);



    const handleAddByHandKey = async (type: any) => {
        try {
            // 建立要傳送的數據
            let data = {};

            switch (type) {
                case 'classification':
                    data = {
                        code_name: handinputclassificationcodename,
                        name: handinputclassificationname,
                    };
                    break;
                case 'component':
                    data = {
                        code_name: handinputcomponentcodename,
                        name: handinputcomponentname,
                    };
                    break;
                case 'material':
                    data = {
                        code_name: handinputmaterialcodename,
                        name: handinputmaterialname,
                    };
                    break;
                case 'surface':
                    data = {
                        code_name: handinputsurfacecodename,
                        name: handinputsurfacename,
                    };
                    break;
                default:
                    console.error("Invalid type provided");
                    break;
            }

            console.log(data);
            // return;

            const conditionModel = {
                data: data,
                type: type,
                username: userInfo?.username
            };

            console.log(conditionModel);

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };




            // 發送數據到 API
            const response = await fetch(`${setting.apipath}/WareHouse/AddProductidType`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
                myAlert.err({ title: 'AddProductidType', content: `API Status: ${response.status}` })

            }
            // 解析 API 響應
            const result = await response.json();

            // 顯示成功提示
            myAlert.success({ title: '新增成功' })

            getProductidType();

            switch (type) {
                case 'classification':
                    setHandinputclassificationcodename('');
                    setHandinputclassificationname('');
                    break;
                case 'component':
                    setHandinputcomponentcodename('');
                    setHandinputcomponentname('');
                    break;
                case 'material':
                    setHandinputmaterialcodename('');
                    setHandinputmaterialname('');
                    break;
                case 'surface':
                    setHandinputsurfacecodename('');
                    setHandinputsurfacename('');
                    break;
                default:
                    break;
            }



            // 更新狀態或執行其他操作
            console.log(result);
        } catch (error: any) {
            // 顯示錯誤信息
            myAlert.err({ title: 'FunctionError', content: error.message },)
        }
    }

    const handleDeleteById = async (type: any, id: any) => {

        myAlert.confirm({
            title: '確定移除編碼嗎?',
            content: <>
            </>,
            props: {
                onOk: async () => {



                    try {
                        const conditionModel = {
                            id: id,
                            type: type,
                            username: userInfo?.username
                        };

                        // console.log(conditionModel);

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                        const response = await fetch(`${setting.apipath}/WareHouse/DeleteProductidType?${queryParams}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const result = await response.json();
                        // 根據 API 回應處理結果
                        if (result.success) {
                            // 成功，顯示提示
                            myAlert.success({ title: '成功', content: result.message });
                            // setEdithandkey(!edithandkey);
                            getProductidType();
                        } else {
                            // 失敗，顯示錯誤提示
                            myAlert.warning({ title: '失敗', content: "移除失敗" });
                        }


                    } catch (error: any) {
                        // 顯示錯誤信息
                        myAlert.err({ title: 'FunctionError', content: error.message },)
                    }
                }
            }
        });
    }

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'物料維護'} panelList={panelList}
                customeRight={[
                    <div>
                        {/* <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                        <button style={{ paddingRight: '10px', display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                            <img src={icon_clear.src} alt="clear" style={{ height: '20px', width: '20px' }} />
                        </button>
                        <input
                            type="text"
                            placeholder='請輸入料號'
                            value={keyword2}
                            style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                            onChange={(e) => setKeyword2(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder='請輸入名稱'
                            value={keyword3}
                            style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                            onChange={(e) => setKeyword3(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder='請輸入規格'
                            value={keyword4}
                            style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                            onChange={(e) => setKeyword4(e.target.value)}
                        />
                        <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
                            <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                        </span>
                    </div>

                ]}
                customeLeft={[
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                            <p style={{ color: '#14256a', fontSize: '16px' }}>
                                符合總數：<span style={{ color: 'gray' }}>{filteredData.length}</span>
                            </p>
                        </div>
                        <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                            <p style={{ color: '#14256a', fontSize: '16px' }}>
                                物料總數：<span style={{ color: 'gray' }}>{searchdata.length}</span>
                            </p>
                        </div>
                    </div>


                ]} />
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
                    <div className={scss.content} style={{ overflowY: 'hidden' }}>
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
                                    {/* <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                                </div>
                                <div>
                                    {/* <input
                                        type="text"
                                        placeholder='請輸入料號'
                                        value={keyword2}
                                        style={{ padding: '4px 5px', width: '200px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                        onChange={(e) => setKeyword2(e.target.value)}
                                    /> */}
                                </div>
                                <div>
                                    {/* <input
                                        type="text"
                                        placeholder='請輸入名稱'
                                        value={keyword3}
                                        style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                        onChange={(e) => setKeyword3(e.target.value)}
                                    /> */}
                                </div>
                                <div>
                                    {/* <input
                                        type="text"
                                        placeholder='請輸入規格'
                                        value={keyword4}
                                        style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                        onChange={(e) => setKeyword4(e.target.value)}
                                    /> */}
                                </div>
                                <div>
                                    {/* <button style={{ display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                                        <img src={icon_clear.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    </button> */}
                                </div>
                                <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                                    {/* <p style={{ color: '#14256a', fontSize: '16px' }}>符合總數：<span style={{ color: 'gray' }}>{filteredData.length}</span></p> */}
                                </div>
                                <div style={{ padding: '4px 5px', textAlign: 'right' }}>
                                    {/* <p style={{ color: '#14256a', fontSize: '16px' }}>物料總數：<span style={{ color: 'gray' }}>{searchdata.length}</span></p> */}
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
                                <span>
                                    <button
                                        className={scss.minitabbtn}
                                        onClick={() => tabChosed('編碼')}
                                        style={getButtonStyle('編碼')}
                                    >
                                        編碼維護
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
                                                    value: productidin || '',
                                                }
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
                                                    value: '',
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
                                                    value: productnamein || '',
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
                                                    value: productspecin || '',
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
                                                    value: unitin || '',
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
                                                    value: materialin || '',
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
                                                    value: surfacein || '',
                                                    onChange: (e) => { setSurfacein(e.target.value) }
                                                },
                                            }}
                                        />
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
                                        <InputSel
                                            {...inputSelProps}
                                            caption="舊料號"
                                            disabled={!editmain}
                                            inputProps={{
                                                props: {
                                                    value: oldproductid || '',
                                                    onChange: (e) => { setOldProductid(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ borderLeft: '1px solid #c1c1c1', backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
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
                                    <div>
                                        <select
                                            value={type1selectedOption}
                                            style={{ borderBottom: '1px solid #c1c1c1', fontSize: '16px' }}
                                            onChange={(e) => { handelSetProductid("type1", e) }}>
                                            <option value=''>選擇類別</option>
                                            {producttypedata
                                                .filter(item => item.type === 'classification') // 過濾 type === 'classification'
                                                .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                .map(item => (
                                                    <option key={item.id} value={item.code_name}>
                                                        {`(${item.code_name}) ${item.name}`}  {/* 動態生成選項，顯示格式如 (P)成品 */}
                                                    </option>
                                                ))}
                                        </select>
                                        <select
                                            value={type2selectedOption}
                                            style={{ borderBottom: '1px solid #c1c1c1', fontSize: '16px' }}
                                            onChange={(e) => { handelSetProductid("type2", e) }}>
                                            <option value=''>選擇細分</option>
                                            {producttypedata
                                                .filter(item => item.type === 'component') // 過濾出 type 為 'component' 的資料
                                                .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                .map(item => (
                                                    <option key={item.id} value={item.code_name}>
                                                        ({item.code_name}) {item.name}
                                                    </option>
                                                ))
                                            }
                                        </select>

                                        <input maxLength={5} style={{ color: "#14256a", fontSize: '15px', width: '120px', borderBottom: '1px solid #c1c1c1', margin: '0px 0px' }} placeholder='輸入序號'
                                            value={type3inputedvalue} onChange={(e) => { handelSetProductid("type3", e) }} />
                                        <select value={type4selectedOption}
                                            style={{ borderBottom: '1px solid #c1c1c1', fontSize: '16px' }}
                                            onChange={(e) => { handelSetProductid("type4", e) }}>
                                            <option value=''>選擇材質</option>
                                            {producttypedata
                                                .filter(item => item.type === 'material') // 過濾出類型為 'material' 的資料
                                                .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                .map(item => (
                                                    <option key={item.id} value={item.code_name}>
                                                        ({item.code_name}) {item.name}
                                                    </option>
                                                ))}
                                        </select>


                                        <select value={type5selectedOption}
                                            style={{ borderBottom: '1px solid #c1c1c1', fontSize: '16px' }}
                                            onChange={(e) => { handelSetProductid("type5", e) }}>
                                            <option value=''>選擇表面</option>
                                            {producttypedata
                                                .filter(item => item.type === 'surface') // 過濾 type 為 'surface' 的資料
                                                .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                .map(item => (
                                                    <option key={item.id} value={item.code_name}>
                                                        ({item.code_name}){item.name}
                                                    </option>
                                                ))}
                                        </select>

                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.foot_head1_1}>
                                    <div >
                                        <InputSel
                                            {...inputSelProps}
                                            caption="料號"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addproductid,
                                                    onChange: (e) => handleProductidChange(e),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        {isDuplicate && <p style={{ fontSize: '16px', color: 'red' }}>料號已存在！</p>}
                                        {addproductid.length < 14 && <p style={{ fontSize: '16px', color: 'red' }}>料號不符編碼原則！</p>}
                                    </div>
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
                                        <InputSel
                                            {...inputSelProps}
                                            caption="舊料號"
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: addoldproductid || '',
                                                    onChange: (e) => { setAddOldProductid(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ borderLeft: '1px solid #c1c1c1', padding: '0px 10px' }}>
                                        <span style={{ color: "#14256a", fontSize: '16px', fontWeight: 'bolder' }}>※編碼範例</span>
                                        <table style={{ width: '100%', textAlign: 'left' }}>
                                            <thead>
                                                <tr>
                                                    <th>公司別</th>
                                                    <th>類別</th>
                                                    <th>細分類</th>
                                                    <th>序號</th>
                                                    <th>材質</th>
                                                    <th>表面</th>
                                                    <th>料號</th>
                                                    <th>名稱</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exampledata.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.company}</td>
                                                        <td>{item.category}</td>
                                                        <td>{item.subCategory}</td>
                                                        <td>{item.serial}</td>
                                                        <td>{item.material}</td>
                                                        <td>{item.surface}</td>
                                                        <td>{item.company}{item.category}{item.subCategory}{item.serial}{item.material}{item.surface}</td>
                                                        <td>{item.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div></div>
                                </div>
                                <br />
                            </div>
                            <div style={{ display: `${tabshow === "編碼" ? '' : 'none'}` }}>
                                <div className={scss.foot_head3} style={{ borderTop: '1px solid #c1c1c1' }}>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="text"
                                            placeholder='搜尋類別'
                                            value={keywordclassification}
                                            style={{ padding: '4px 5px', width: '85%', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                            onChange={(e) => setKeywordclassification(e.target.value)}
                                        />
                                        <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
                                            <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        </span>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="text"
                                            placeholder='搜尋細分'
                                            value={keywordcomponent}
                                            style={{ padding: '4px 5px', width: '85%', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                            onChange={(e) => setKeywordcomponent(e.target.value)}
                                        />
                                        <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
                                            <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        </span>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="text"
                                            placeholder='搜尋材質'
                                            value={keywordmaterial}
                                            style={{ padding: '4px 5px', width: '85%', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                            onChange={(e) => setKeywordmaterial(e.target.value)}
                                        />
                                        <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
                                            <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        </span>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="text"
                                            placeholder='搜尋表面'
                                            value={keywordsurface}
                                            style={{ padding: '4px 5px', width: '85%', fontSize: '16px', borderBottom: '1px solid #c1c1c1' }}
                                            onChange={(e) => setKeywordsurface(e.target.value)}
                                        />
                                        <span style={{ borderBottom: '1px solid #c1c1c1', padding: '6px 12px' }}>
                                            <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        </span>
                                    </div>
                                </div>
                                <div className={scss.foot_head3}>
                                    <div>
                                        <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #c1c1c1', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, border: '1px solid #c1c1c1', color: '#14256a' }}>
                                                    <tr>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>

                                                        </th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>編碼</th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>類別</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ border: '1px solid #c1c1c1' }}>
                                                    {filteredclassificationData
                                                        // .filter(item => item.type === 'classification') // 過濾出 type === 'classification' 的項目
                                                        .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                        .map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                                <td style={{ padding: '8px' }}>
                                                                    <button onClick={() => { handleDeleteById("classification", item.id) }}>
                                                                        <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                                    </button>
                                                                    {/* <button onClick={() => { alert(item.id) }}>
                                                                        <img src={icon_edit.src} alt="cancel"
                                                                            style={{
                                                                                // display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`,
                                                                                width: '30px', height: '20px'
                                                                            }}
                                                                        />
                                                                    </button> */}
                                                                </td>
                                                                <td style={{ padding: '8px' }}>{item.code_name}</td>
                                                                <td style={{ padding: '8px' }}>{item.name}</td> {/* 顯示 classification */}
                                                            </tr>

                                                        ))}
                                                </tbody>
                                            </table>

                                        </div>



                                    </div>
                                    <div>
                                        <div style={{ height: '240px', overflowY: 'auto', border: '1px solid #c1c1c1', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, border: '1px solid #c1c1c1', color: '#14256a' }}>
                                                    <tr>
                                                        <th></th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>編碼</th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>細分</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ border: '1px solid #c1c1c1' }}>
                                                    {filteredcomponentData
                                                        // .filter(item => item.type === 'component') // 過濾出 type === 'component' 的項目
                                                        .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                        .map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                                <td style={{ padding: '8px' }}>
                                                                    <button onClick={() => { handleDeleteById("component", item.id) }}>
                                                                        <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                                    </button>
                                                                    {/* <button onClick={() => { alert(item.id) }}>
                                                                        <img src={icon_edit.src} alt="cancel"
                                                                            style={{
                                                                                // display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`,
                                                                                width: '30px', height: '20px'
                                                                            }}
                                                                        />
                                                                    </button> */}
                                                                </td>
                                                                <td style={{ padding: '8px' }}>{item.code_name}</td>
                                                                <td style={{ padding: '8px' }}>{item.name}</td> {/* 顯示 component 的名稱 */}
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                    <div>
                                        <div style={{ height: '240px', overflowY: 'auto', border: '1px solid #c1c1c1', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, border: '1px solid #c1c1c1', color: '#14256a' }}>
                                                    <tr>
                                                        <th></th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>編碼</th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>材質</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ border: '1px solid #c1c1c1' }}>
                                                    {filteredmaterialData
                                                        // .filter(item => item.type === 'material') // 過濾出 type === 'material' 的項目
                                                        .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                        .map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                                <td style={{ padding: '8px' }}>
                                                                    <button onClick={() => { handleDeleteById("material", item.id) }}>
                                                                        <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                                    </button>
                                                                    {/* <button onClick={() => { alert(item.id) }}>
                                                                        <img src={icon_edit.src} alt="cancel"
                                                                            style={{
                                                                                // display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`,
                                                                                width: '30px', height: '20px'
                                                                            }}
                                                                        />
                                                                    </button> */}
                                                                </td>
                                                                <td style={{ padding: '8px' }}>{item.code_name}</td>
                                                                <td style={{ padding: '8px' }}>{item.name}</td> {/* 顯示 material 的名稱 */}
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                    <div>
                                        <div style={{ height: '240px', overflowY: 'auto', border: '1px solid #c1c1c1', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, border: '1px solid #c1c1c1', color: '#14256a' }}>
                                                    <tr>
                                                        <th></th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>編碼</th>
                                                        <th style={{ padding: '8px', borderBottom: '1px solid #c1c1c1' }}>表面</th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ border: '1px solid #c1c1c1' }}>
                                                    {filteredsurfaceData
                                                        // .filter(item => item.type === 'surface') // 過濾出 type === 'surface' 的項目
                                                        .sort((a, b) => a.code_name.localeCompare(b.code_name)) // 依照 code_name 排序
                                                        .map((item, index) => (
                                                            <tr key={index} style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                                <td style={{ padding: '8px' }}>
                                                                    <button onClick={() => { handleDeleteById("surface", item.id) }}>
                                                                        <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                                    </button>
                                                                    {/* <button onClick={() => { alert(item.id) }}>
                                                                        <img src={icon_edit.src} alt="cancel"
                                                                            style={{
                                                                                // display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`,
                                                                                width: '30px', height: '20px'
                                                                            }}
                                                                        />
                                                                    </button> */}
                                                                </td>
                                                                <td style={{ padding: '8px' }}>{item.code_name}</td>
                                                                <td style={{ padding: '8px' }}>{item.name}</td> {/* 顯示 surface 的名稱 */}
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                </div>
                                <div className={scss.foot_head3}>
                                    <div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                        <td style={{ padding: '8px' }}>
                                                            <button onClick={() => { handleAddByHandKey("classification") }}
                                                            >
                                                                <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入編碼"
                                                                value={handinputclassificationcodename}
                                                                onChange={(e) => setHandinputclassificationcodename(e.target.value)}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入類別"
                                                                value={handinputclassificationname}
                                                                onChange={(e) => setHandinputclassificationname(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    // display: `${edithandkey ? '' : 'none'}`
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                        <td style={{ padding: '8px' }}>
                                                            <button onClick={() => { handleAddByHandKey("component") }}
                                                            >
                                                                <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入編碼"
                                                                value={handinputcomponentcodename}
                                                                onChange={(e) => setHandinputcomponentcodename(e.target.value)}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入細分"
                                                                value={handinputcomponentname}
                                                                onChange={(e) => setHandinputcomponentname(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    // display: `${edithandkey ? '' : 'none'}`
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                        <td style={{ padding: '8px' }}>
                                                            <button onClick={() => { handleAddByHandKey("material") }}
                                                            >
                                                                <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入編碼"
                                                                value={handinputmaterialcodename}
                                                                onChange={(e) => setHandinputmaterialcodename(e.target.value)}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入材質"
                                                                value={handinputmaterialname}
                                                                onChange={(e) => setHandinputmaterialname(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    // display: `${edithandkey ? '' : 'none'}`
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto', width: '100%' }}>
                                            <table style={{ width: '100%', textAlign: 'left', fontSize: '16px', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr style={{ borderBottom: '1px solid #c1c1c1' }}>
                                                        <td style={{ padding: '8px' }}>
                                                            <button onClick={() => { handleAddByHandKey("surface") }}
                                                            >
                                                                <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入編碼"
                                                                value={handinputsurfacecodename}
                                                                onChange={(e) => setHandinputsurfacecodename(e.target.value)}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="請輸入表面"
                                                                value={handinputsurfacename}
                                                                onChange={(e) => setHandinputsurfacename(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    // display: `${edithandkey ? '' : 'none'}`
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
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