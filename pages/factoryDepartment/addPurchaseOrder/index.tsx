import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './addPurchaseOrder.module.scss';
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
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_fc_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import { Modal } from 'antd';
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
import icon_history from 'public/image/icon/fc_history.svg';
import icon_fc_quotereq from 'public/image/icon/fc_quotereq.svg';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_add from 'public/image/icon/fc_add2.svg';
type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddPurchaseOrder() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        // purchaseorderuuid,
        create_at,
        create_by,
        purchaseorderdetailuuid
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };


    //登入者資料
    const { userInfo } = useContext(AppContext);
    const { erpFeature } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [prdata, setPrdata] = useState<any[]>([]);
    const [podata, setPodata] = useState<any[]>([]);
    const [customerdata, setCustomerdata] = useState<any[]>([]);
    const [shippingdata, setShippingdata] = useState<any[]>([]);


    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const totalpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [need_date, setNeed_date] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    // const [purchaserequisitionid, setPurchaserequisitionid] = useState<string>("");
    // const [purchaserequisitionuuid, setPurchaserequisitionuuid] = useState<string>("");
    const [purchaseorderid, setPurchaseorderid] = useState<string>("");
    const [purchaseorderuuid, setPurchaseorderuuid] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [purchaseorderdetailuuidin, setPurchaseorderdetailuuidin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [supplieridin, setSupplieridin] = useState<string>("");
    const [shippingaddressin, setShippingaddressin] = useState<string>("");
    const [suppliercontactin, setSuppliercontactin] = useState<string>("");
    const [supplierfaxin, setSupplierfaxin] = useState<string>("");

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
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");
    const [handinputproductid, setHandinputproductid] = useState<string>("");
    const [handinputproductuuid, setHandinputproductuuid] = useState<string>("");
    const [handinputunitprice, setHandinputunitprice] = useState<string>("");
    const [handinputtotalprice, setHandinputtotalprice] = useState<string>("");

    // 詢價Modal
    const [quotereqname, setQuotereqname] = useState<string>("");
    const [quotereqspec, setQuotereqspec] = useState<string>("");
    const [quotereqquantity, setQuotereqquantity] = useState<string>("");
    const [quoterequuid, setQuoterequuid] = useState<string>("");

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
    const [originalShippingaddressin, setOriginalShippingaddressin] = useState<string>("");
    const [originalcreate_atin, setOriginalcreate_atin] = useState<string>("");
    const [originalneed_date, setOriginalneed_date] = useState<string>("");
    const [originalnote, setOriginalnote] = useState<string>("");
    const [originaldata2, setOriginaldata2] = useState<any[]>([]);


    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);


    //#region 上方功能列

    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '物料號碼',
        },
        {
            placeholder: '物料名稱',
        },
        {
            placeholder: '物料規格',
        },
    ];

    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        // const keywordWhpname = valueArr[0] as string;
        // const keywordMaterialnumber = valueArr[1] as string;
        // const keywordSpec = valueArr[2] as string;
        // searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };

    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        doSearch,
    };



    //新增按鈕
    const panelList: TpanelList = [
        // { searchGroup },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                myAlert.confirm({
                    title: '確定要返回採購管理嗎?',
                    content: <>
                        <h1>未儲存的資料將不會保留</h1>
                    </>,
                    props: {
                        onOk: () => {
                            router.back();
                        }
                    }
                });
            },
        },
    ];
    //#endregion

    const getPurchaseOrder = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: "未送出",
                username: userInfo?.username
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetPurchaseOrder?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();


            setPodata(data);
            // console.log(data);
            setSearchdata(data);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getPurchaseOrder();
            getProduct();
            getCustomers();
            hasFetchedData.current = true;
        }
    }, []);

    const getPurchaseOrderDetail = async (purchaseorderuuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                purchaseorderuuid: purchaseorderuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetPurchaseOrderDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData1(data);

            setData2(data);


            let totalprice = 0;
            data.forEach((element: { totalprice: any; }) => {
                totalprice += element.totalprice;
            });
            setTotalPrice(totalprice.toLocaleString());
            const taxPrice = Math.round(totalprice * 0.05);
            setTaxPrice(taxPrice.toLocaleString());
            const totalPayPrice = totalprice + taxPrice;
            setTotalPayPrice(totalPayPrice.toLocaleString());

            console.log(data2);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };




    //#region api呼叫區
    //取物料清單
    const getProduct = async () => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {};


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

            console.log(userInfo);

            console.log(erpFeature);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const getCustomers = async () => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {};


            var inputModel = {
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

            setCustomerdata(responseData);
            setShippingdata(responseData);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setCreate_byin(userInfo?.username.toString() || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
    }, []);

    //取所有物料，for查詢代入用
    const getProductById = async (productuuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel: {
                productuuid: string | undefined
            } = {
                productuuid: productuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetProductById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData1(data);

            console.log(data);
            // setData2(prevData2 => [...prevData2, ...data]);
            setData2(prevData2 => {
                // 取得當前的productid列表
                const existingProductIds = prevData2.map(item => item.productid);

                // 檢查並提示哪些productid已經存在
                const duplicateProductIds = data.filter((item: { productid: any; }) => existingProductIds.includes(item.productid));
                if (duplicateProductIds.length > 0) {
                    myAlert.info({ title: `${duplicateProductIds.map((item: { productid: any; }) => item.productid).join(', ')}已加入` });
                }

                // 過濾掉已經存在的productid
                const newData = data.filter((item: { productid: any; }) => !existingProductIds.includes(item.productid));

                // 返回合併的結果
                return [...prevData2, ...newData];
            });



        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };
    // useEffect(() => {
    //     if (purchaseorderuuid) {
    //         if (purchaseorderuuidin != purchaseorderuuid) {
    //             setData2([]);
    //         }
    //         getProductById(purchaseorderuuid);
    //         if (purchaseorderdetailuuid) {
    //         }
    //         setPurchaseorderuuidin(purchaseorderuuid as string);
    //         setCreate_atin(create_at as string);
    //         setCreate_byin(create_by as string);
    //     }
    // }, [purchaseorderuuid, purchaseorderdetailuuid]);

    //採購單申請
    const AddPurchaseOrder = async () => {
        if (editmain === true) {
            try {
                setIsLoading(true);
                const conditionModel = {
                    purchaseorderuuid: purchaseorderuuid,
                    create_at: create_atin,
                    need_date: moment(need_date).format('YYYY-MM-DD'),
                    create_by: create_byin,
                    note: note,
                    suppliername: suppliernamein,
                    supplierphone: supplierphonein,
                    suppliertaxid: suppliertaxidin,
                    supplieraddress: supplieraddressin,
                    supplierid: supplieridin,
                    shippingaddress: shippingaddressin,
                    suppliercontact: suppliercontactin,
                    supplierfax: supplierfaxin,
                    data2: data2
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/UpdateAddPurchaseOrder`, {
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
                myAlert.success({ title: '更新成功' })

                getPurchaseOrder();
                getPurchaseOrderDetail(purchaseorderuuid);
                setEditmain(false);

            } catch (error: any) {
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                const conditionModel = {
                    create_at: create_atin,
                    need_date: moment(need_date).format('YYYY-MM-DD'),
                    create_by: create_byin,
                    note: note,
                    suppliername: suppliernamein,
                    supplierphone: supplierphonein,
                    suppliertaxid: suppliertaxidin,
                    supplieraddress: supplieraddressin,
                    supplierid: supplieridin,
                    shippingaddress: shippingaddressin,
                    suppliercontact: suppliercontactin,
                    supplierfax: supplierfaxin
                };



                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/AddPurchaseOrder`, {
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
                myAlert.info(
                    {
                        title: '單據新增成功',
                        content: `採購單據號碼為:${data[0].purchaseorderid}`
                    })

                setData2([]);
                setPurchaseorderid(data[0].purchaseorderid);
                setPurchaseorderuuid(data[0].id);
                setStatus("未送出");
                getPurchaseOrder();
                console.log(data);

                // getProduct();

                // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

            } catch (error: any) {
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    const RemovePurchaseOrderDetail = async (id: any) => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {
                id: id
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/RemovePurchaseOrderDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            getPurchaseOrderDetail(purchaseorderuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //採購單申請
    const ClosePurchaseOrder = async () => {

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                purchaseorderid: purchaseorderid,
                purchaseorderuuid: purchaseorderuuid,
                tax: taxprice,
                totalprice: totalprice
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/ClosePurchaseOrder`, {
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

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //#endregion

    //#region 按鈕作動區

    // 送出按鈕
    function handleAdd() {
        if (suppliernamein === '' || supplieraddressin === '' || shippingaddressin === '') {
            myAlert.warning({ title: '請確認欄位是否填寫完整' })
            return;
        }
        if (editmain === true) {
            myAlert.confirm({
                title: '確定要修改單據嗎?',
                content: <>
                    <h1>請檢查資料是否填寫完整</h1>
                </>,
                props: {
                    onOk: async () => {
                        AddPurchaseOrder();
                    }
                }
            })

        } else {
            myAlert.confirm({
                title: '確定要新增單據嗎?',
                content: <>
                    <h1>請檢查資料是否填寫完整</h1>
                </>,
                props: {
                    onOk: async () => {
                        AddPurchaseOrder();

                    }
                }
            })
        }

    }


    // 手key加入
    const handleAddByHandKey = async () => {
        if (handinputname === '' || handinputspec === '' || handinputquantity === '' || handinputunit === '') {
            myAlert.warning({ title: '請檢查欄位是否遺漏' });
        } else {
            const newEntry = {
                id: handinputproductuuid,
                productid: handinputproductid,
                productuuid: handinputproductuuid,
                name: handinputname,
                spec: handinputspec,
                quantity: handinputquantity,
                unit: handinputunit,
                note: handinputnote,
                unitprice: handinputunitprice,
                totalprice: handinputtotalprice,
            };

            setHandinputproductuuid('');
            setHandinputproductid('');
            setHandinputname('');
            setHandinputspec('');
            setHandinputquantity('');
            setHandinputunit('');
            setHandinputnote('');
            setHandinputunitprice('');
            setHandinputtotalprice('');
            try {
                setIsLoading(true);
                const conditionModel = {
                    purchaseorderid: purchaseorderid,
                    purchaseorderuuid: purchaseorderuuid,
                    data: newEntry,
                    quoterequuid: quoterequuid,
                    suppliername: suppliernamein
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                const response = await fetch(`${setting.apipath}/WareHouse/AddPurchaseOrderDetail`, {
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

                setData2(prevData2 => [...prevData2, data]);

                getPurchaseOrderDetail(purchaseorderuuid);




            } catch (error: any) {
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    // 結案按鈕
    function handleClosePR() {

    }
    //#endregion

    //#region 口袋清單功能區
    // 口袋清單編輯狀態控制，一次只能針對一列做修改
    const handleEditStatus = (index: number) => {
        setEditRowId(index);
        setEditStatus(true);
        setData2Restore(data2);
    };

    const handleSaveEdit = (index: number) => {
        setEditStatus(false);
        // // console.log(data2);
    };

    // 從口袋清單移除
    const handleRemove = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定要移除嗎?',
            content: <>
            </>,
            props: {
                onOk: async () => {
                    const updatedData = data2.filter((_, i) => i !== index);
                    setData2(updatedData);
                    RemovePurchaseOrderDetail(item.id);
                }
            }
        })
    };

    // 改變數字口袋清單值
    const handleNumberChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = parseFloat(value.replace(/,/g, '')) || 0;
        newData[index] = {
            ...newData[index],
            [target]: newValue,
        };
        setData2(newData);
    };
    // 改變文字口袋清單值
    const handleStringChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = value;
        newData[index] = {
            ...newData[index],
            [target]: newValue,
        };
        setData2(newData);
    };

    // 還原口袋清單
    const handleRestore = () => {
        setData2(data2restore);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

    };

    //#endregion





    //#region modal
    const [productSearchmodalopen, setProductSearchmodalopen] = useState<boolean>(false);

    const [test, setTest] = useState<string>("");

    //帶入請購查詢畫面的資料
    // const [quotereqname, setQuotereqname] = useState<string>("");
    // const [quotereqspec, setQuotereqspec] = useState<string>("");
    // const [quotereqquantity, setQuotereqquantity] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState('物料'); // 預設選項

    //對應詢價單主檔的詢價單明細
    const [prquotereqdata, setPrquotereqdata] = useState<any[]>([]);
    //確定廠商後更新請購單明細
    const [refreshpurchaserequisitiondetail, setRefreshpurchaserequisitiondetail] = useState<any>();

    //加入詢價廠商
    const [prquotereqadddata, setPrquotereqadddata] = useState({
        // id: "",id 自增長不用寫入
        quoterequuid: "",
        quotereqid: "",
        unitprice: "",
        totalprice: "",
        suppliername: "",
        deliverydate: moment(),
        unit: "",
        note: "",
        awarded: false
    });

    //得標廠商id，update回quotereqdetail
    const [lastselectedsupplier, setLastselectedsupplier] = useState<string>("");
    const [selectedsupplier, setSelectedsupplier] = useState<string>("");





    //打開查詢modal
    const productSearchModalOpen = async () => {
        setModalData(data);
        setProductSearchmodalopen(!productSearchmodalopen);
    }

    //關閉詢價單modal
    const productSearchModalClose = async () => {
        setModalData([]);
        setKeyword1("");
        setKeyword2("");
        setKeyword3("");
        await new Promise(resolve => setTimeout(resolve, 50));
        setProductSearchmodalopen(false);
    }




    interface DataItem {
        id: string;
        productid: string;
        spec: string | null; // spec 可能為 null
        name: string;
        unit: string;
    }


    // const [handinputname, setHandinputname] = useState("");
    // const [handinputspec, setHandinputspec] = useState("");
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const isSelectingRef = useRef(false);
    // const data: DataItem[] = [
    //     // 你的資料項目
    // ];

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
        }
        else {
            setHandinputproductuuid('');
            setFilteredData([]);
            setShowSuggestions(false);
        }

    }, [handinputproductid, handinputname, handinputspec]);

    const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputproductid(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setFilteredData(data);
        isSelectingRef.current = false;
        setHandinputname(e.target.value);
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputspec(e.target.value);
    };

    const handleSelect = (item: DataItem) => {
        isSelectingRef.current = true;
        setHandinputproductuuid(item.id);
        setHandinputproductid(item.productid);
        setHandinputname(item.name);
        setHandinputspec(item.spec || "");
        setHandinputunit(item.unit);
        setShowSuggestions(false);
    };


    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputunit('');
        setHandinputnote('');
        setHandinputquantity('');
        setHandinputunitprice('');
        setHandinputtotalprice('');
        setShowSuggestions(false);
    }

    const handleClearMainArea = () => {
        setSuppliernamein('');
        setSupplieraddressin('');
        setSupplierphonein('');
        setSuppliertaxidin('');
        setShippingaddressin('');
        setNote('');
        setShowSuggestions(false);
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

    const handlePreAddPO = () => {
        // setOriginalSuppliernamein(suppliernamein);
        // setOriginalSupplierphonein(supplierphonein);
        // setOriginalSuppliertaxidin(suppliertaxidin);
        // setOriginalInvoicein(invoicein);
        // setOriginalSupplieraddressin(supplieraddressin);
        // setOriginalShippingaddressin(shippingaddressin);
        setCreate_byin(userInfo?.username as string);
        setSuppliernamein("");
        setSupplierphonein("");
        setSuppliertaxidin("");
        setInvoicein("");
        setSupplieraddressin("");
        setShippingaddressin("台中市霧峰區峰北路666號");
        setPurchaseorderid("儲存後產生");
        setStatus("未儲存");
        setNote("");
        setData2([]);
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
    }

    const handlecancelAddPR = () => {
        if (editmain === true) {
            setEditmain(false);
            setSuppliernamein(originalSuppliernamein);
            setSupplierphonein(originalSupplierphonein);
            setSuppliertaxidin(originalSuppliertaxidin);
            setInvoicein(originalInvoicein);
            setSupplieraddressin(originalSupplieraddressin);
            setShippingaddressin(originalShippingaddressin);
            setCreate_atin(originalcreate_atin);
            setNeed_date(originalneed_date);
            setNote(originalnote);
            setData2(originaldata2);
        } else {
            setSuppliernamein("");
            setSupplierphonein("");
            setSuppliertaxidin("");
            setInvoicein("");
            setSupplieraddressin("");
            setShippingaddressin("");
            setEditmain(false);
            setPurchaseorderid("");
            setStatus("");
            setData2([]);
            setNote("");
            setNeed_date(moment().toString());
        }
    }

    const handlesaveAddDetail = () => {

        let needDateObj = new Date(need_date);
        let createAtinObj = new Date(create_atin);

        console.log(needDateObj);
        console.log(createAtinObj);


        if (data2.length === 0) {
            myAlert.warning({ title: "尚未加入任何採購項目" });
            return;
        }
        else {

            const hasZeroQuantity = data2.some(item => item.quantity === 0 || item.quantity === '');

            if (hasZeroQuantity) {
                myAlert.warning({ title: "採購項目中有數量為0的項目，請檢查並修正。" });
            } else {
                myAlert.confirm({
                    title: '確定要送出採購單嗎?',
                    content: <>
                        <h1>請檢查品名、數量是否正確</h1>
                    </>,
                    props: {
                        onOk: async () => {
                            ClosePurchaseOrder();
                            setPurchaseorderid("");
                            setPurchaseorderuuid("");
                            setCreate_atin(moment().format('YYYY-MM-DD') || '');
                            setNeed_date(moment().format('YYYY-MM-DD') || '');
                            setStatus("");
                            setNote("")
                            setData2([]);

                            await router.push({
                                pathname: `/factoryDepartment/purchaseOrderList`,
                                query: {
                                    purchaseorderid: purchaseorderid
                                },
                            });
                        }
                    }
                });
            }
        }
    }

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
            if (event.keyCode === 27) { // ESC 鍵的 keyCode 是 27
                setcustomersFilteredData([]);
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

    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }

    const filterData = () => {
        const startDate = keywordstartdate;
        const endDate = keywordenddate;
        const requisitionId = keyword2.trim();
        const status = keyword3.trim();



        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionId &&
            !status) {
            setSearchdata(podata);

            return;
        }

        console.log(searchdata.length);


        // 過濾資料
        let filteredData = podata.filter(item => {
            const createAt = moment(item.create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        console.log(filteredData);

        // 模糊查詢單號
        if (requisitionId) {
            filteredData = filteredData.filter(item =>
                item?.purchaseorderid?.toString().includes(requisitionId)
            );
        }

        // 模糊查詢單據狀態
        if (status) {
            filteredData = filteredData.filter(item =>
                item.status.toString().includes(status)
            );
        }

        setSearchdata(filteredData);
    };

    // 監聽條件變更
    useEffect(() => {
        filterData();
    }, [keywordstartdate, keywordenddate, keyword2, keyword3]);



    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        // setSearchdata(data);
    }

    const handlechangepo = (item: any) => {
        console.log(item);
        setEditmain(false);
        handleRowClick(item.purchaseorderid);
        setData2([]);
        setPurchaseorderid(item.purchaseorderid);
        setPurchaseorderuuid(item.purchaseorderuuid);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setNeed_date(item.need_date);
        setSuppliernamein(item.suppliername);
        setSupplierphonein(item.supplierphone);
        setSuppliertaxidin(item.suppliertaxid);
        setSupplieraddressin(item.supplieraddress);
        setShippingaddressin(item.shippingaddress);
        setNeed_date(item.need_date);
        setCreate_byin(item.create_by);
        // alert(item.need_date);
        getPurchaseOrderDetail(item.purchaseorderuuid);
    }

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };




    //廠商模糊查詢
    const [customersfilteredData, setcustomersFilteredData] = useState<any[]>([]);
    const [customersshowSuggestions, setcustomersShowSuggestions] = useState(false);
    const customersisSelectingRef = useRef(false);


    useEffect(() => {
        if (customersisSelectingRef.current) return;

        const supnameFilter = suppliernamein?.trim();
        const supaddressFilter = supplieraddressin?.trim();


        if (supnameFilter !== "" || supaddressFilter !== "") {
            const filtered = customerdata.filter(item => {
                const matchesName = item.name?.toLowerCase().includes(supnameFilter);
                const matchesAddress = (item.county && item.county?.toLowerCase().includes(supaddressFilter)) ||
                    (item.district && item.district?.toLowerCase().includes(supaddressFilter)) ||
                    (item.address && item.address?.toLowerCase().includes(supaddressFilter))
                return matchesName && matchesAddress;
            });

            setcustomersFilteredData(filtered);
            setcustomersShowSuggestions(filtered.length > 0);
        } else {
            setcustomersFilteredData([]);
            setcustomersShowSuggestions(false);
        }


    }, [suppliernamein, supplieraddressin, shippingaddressin]);

    const handleSuppliernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        setSuppliernamein(e.target.value);
    };

    const handleSupplieraddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        setSupplieraddressin(e.target.value);
    };

    const handleSelectCustomer = (item: any) => {
        customersisSelectingRef.current = true;

        setSuppliernamein(item?.name);
        setSupplieraddressin(
            (item.county ? item.county : '') +
            (item.district ? item.district : '') +
            (item.address ? item.address : '')
        );
        setSupplierphonein(item.phone ? item.phone : '');
        setSuppliertaxidin(item.tax_id ? item.tax_id : '');
        setSupplieridin(item.customer_number);
        setSuppliercontactin(item.contact ? item.contact : '');
        setSupplierfaxin(item.fax ? item.fax : '');


        setcustomersShowSuggestions(false);
    };



    const [shippingfilteredData, setshippingFilteredData] = useState<any[]>([]);
    const [shippingshowSuggestions, setshippingShowSuggestions] = useState(false);
    const shippingisSelectingRef = useRef(false);
    useEffect(() => {
        if (shippingisSelectingRef.current) return;

        const shipaddressFilter = shippingaddressin?.trim();


        if (shipaddressFilter !== "") {
            const filtered = customerdata.filter(item => {
                const matchesName = item.name?.toLowerCase().includes(shipaddressFilter);
                return matchesName;
            });

            setshippingFilteredData(filtered);
            setshippingShowSuggestions(filtered.length > 0);
        } else {
            setshippingFilteredData([]);
            setshippingShowSuggestions(false);
        }


    }, [shippingaddressin]);

    const handleShippingaddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        shippingisSelectingRef.current = false;
        setShippingaddressin(e.target.value);
    };

    // const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     isSelectingRef.current = false;
    //     setHandinputspec(e.target.value);
    // };




    const handleSelectShipping = (item: any) => {
        shippingisSelectingRef.current = true;
        setShippingaddressin(
            (item.county ? item.county : '') +
            (item.district ? item.district : '') +
            (item.address ? item.address : '')
        );

        setshippingShowSuggestions(false);
    };

    // 



    // 取得詢價紀錄
    const getQuotereqDetailPrice = (productname: any) => {
        alert(productname);
    }

    const [prquotereqmodalopen, setPrquotereqmodalopen] = useState<boolean>(false);
    const [quotereqcanedit, setQuotereqcanedit] = useState<boolean>(false);
    // const [quotereqModalwaitasecon, setQuotereqModalwaitasecon] = useState<boolean>(false)
    const prQuotereqModalOpen = async (type: any, item: any) => {
        console.log("===================");
        console.log(type);
        console.log(item);
        console.log("===================");

        setQuotereqcanedit(Boolean(type));
        setQuotereqname(type === true ? handinputname : item.name);
        setQuotereqspec(type === true ? handinputspec : item.spec);
        getQuotereqDetailhistory(type === true ? item : item.productid);
        setTimeout(() => setPrquotereqmodalopen(true), 500);
    }

    const prQuotereqModalClose = async () => {
        setPrquotereqmodalopen(false);
        setQuotereqcanedit(false)
        setPrquotereqdata([]);
    }
    const getQuotereqDetailhistory = async (productid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                productid: productid as string | undefined,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetQuotereqDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            setPrquotereqdata(data);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    const handleCheckboxChange = (item: any) => {
        console.log(item);
        // return;
        // 更新選中的供應商
        setLastselectedsupplier(selectedsupplier);
        setSelectedsupplier(item.detail_id);
        setHandinputunitprice(item.detail_unitprice);
        // setHandinputquantity(item.detail_quantity);
        setHandinputtotalprice((parseFloat(item.detail_unitprice || '0') * parseFloat(handinputquantity || '0')).toString());
        setQuoterequuid(item.main_id);
        // UpdatePurchaseOrderDetail(item);
    };


    // useEffect(() => {
    //     setHandinputtotalprice((parseFloat(handinputunitprice) * parseFloat(handinputquantity)).toString());
    // }, [handinputunitprice]);

    const UpdatePurchaseOrderDetail = async (item: any) => {
        try {
            console.log(item);
            // console.log(item.id);
            // console.log(quotereqquantity);
            // console.log((parseInt(item.unitprice) * parseInt(quotereqquantity)).toString());

            // return;

            const conditionModel = {
                purchaseorderdetailuuid: purchaseorderdetailuuid,
                unitprice: item.detail_unitprice,
                totalprice: (parseFloat(item.detail_unitprice) * parseFloat(handinputquantity)),
                suppliername: item.detail_suppliername,
                quotereqdetailuuid: item.detail_id,
                suppliertaxid: item.main_suppliertaxid,
                supplieraddress: item.main_supplieraddress,
                supplierphone: item.main_supplierphone
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/UpdatePurchaseOrderDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();

            getPurchaseOrderDetail(purchaseorderuuid);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }

    };

    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalSuppliernamein(suppliernamein);
        setOriginalSupplierphonein(supplierphonein);
        setOriginalSuppliertaxidin(suppliertaxidin);
        setOriginalInvoicein(invoicein);
        setOriginalSupplieraddressin(supplieraddressin);
        setOriginalShippingaddressin(shippingaddressin);
        setOriginalcreate_atin(create_atin);
        setOriginalneed_date(need_date);
        setOriginalnote(note);
        setOriginaldata2(data2);
        setEditmain(true);
    };


    const handleDeletePO = async (id: any) => {

        myAlert.confirm({
            title: '確定要刪除這筆單據嗎?',
            content: <>
                <h1>刪除後將無法復原</h1>
            </>,
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            id: id
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                        const response = await fetch(`${setting.apipath}/WareHouse/DeletePurchaseOrder?${queryParams}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const responseData = await response.text();

                        myAlert.success({ title: '刪除成功' });

                        setPurchaseorderid('');
                        setCreate_atin('');
                        setNeed_date('');
                        setNote('');
                        setCreate_byin('');
                        setStatus('');
                        setData2([]);
                        setSuppliernamein('');
                        setSupplieraddressin('');
                        setSupplierphonein('');
                        setSuppliertaxidin('');
                        setShippingaddressin('');
                        getPurchaseOrder();




                    } catch (error: any) {
                        setError(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }

                }
            }
        })
    }
    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='新增採購單' panelList={panelList} />
            {/* <div className={scss.main}> */}
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                &nbsp;
                                {/* <button className={scss.squarebtn} onClick={() => { "歷史單據查詢" }} title="歷史單據">
                                    <img src={icon_history.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    歷史
                                </button> */}
                                {/* {(editmain).toString()} */}
                            </div>
                            <div>
                                <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlePreAddPO() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button
                                    style={{ display: `${status === "未送出" && !editmain ? '' : 'none'}` }}
                                    className={scss.squarebtn}
                                    onClick={handleEdit}>
                                    <img src={icon_edit.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    編輯
                                </button>

                                <button
                                    style={{ display: `${(status === "未儲存" || status === "" || editmain) ? '' : 'none'}` }}
                                    className={scss.disablesquarebtn} >
                                    <img src={icon_edit_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    編輯
                                </button>
                                &nbsp;
                                <button
                                    className={(status === '未儲存' || editmain === true) ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleAdd() }}
                                    title="儲存"
                                    disabled={(status !== '未儲存' && editmain !== true)}
                                >
                                    <img
                                        src={(status === '未儲存' || editmain === true) ? icon_save.src : icon_save_gray.src}
                                        alt="save"
                                        style={{ height: '20px', width: '20px' }}
                                    />
                                    儲存
                                </button>
                                &nbsp;
                                <button
                                    className={(status === '未儲存' || editmain === true) ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handlecancelAddPR() }}
                                    title="取消"
                                    disabled={status !== '未儲存' && editmain !== true}
                                >
                                    <img src={(status === '未儲存' || editmain === true) ? icon_cancel.src : icon_cancel_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handleDeletePO(purchaseorderuuid) }} title="單據刪除">
                                    <img src={icon_delete.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    刪除
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handlesaveAddDetail() }} title="單據申請">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    送出
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: purchaseorderid || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            caption="採購日期"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') ? moment(create_atin) : null,
                                                    onChange: (e) => { setCreate_atin(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingRight: '20px' }}>
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                            // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                            datePickerProps={{
                                                props: {
                                                    value: getTaiwanDateStr(need_date || '') ? moment(need_date) : null,
                                                    onChange: (e) => { setNeed_date(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="採購人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? create_byin : create_by) || '',
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
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: suppliernamein ? suppliernamein : '',
                                                    onChange: (e) => { handleSuppliernameChange(e) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商地址"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: supplieraddressin ? supplieraddressin : '',
                                                    onChange: (e) => { handleSupplieraddressChange(e) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: note || '',
                                                    onChange: (e) => { setNote(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="送貨地址"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    // value: shippingaddressin ? shippingaddressin : ' ',
                                                    value: shippingaddressin ? shippingaddressin : '',
                                                    // onChange: (e) => { setShippingaddressin(e.target.value) }
                                                    onChange: (e) => { handleShippingaddressChange(e) }
                                                },
                                            }}
                                        />

                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="聯絡電話"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: supplierphonein ? supplierphonein : '',
                                                    onChange: (e) => { setSupplierphonein(e.target.value) }
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="統一編號"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: suppliertaxidin ? suppliertaxidin : '',
                                                    onChange: (e) => { setSuppliertaxidin(e.target.value) }
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
                                            caption=""
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    style: { color: '#ea1833' },
                                                    value: `${shippingaddressin === "" ? "※可輸入公司名稱查詢地址" : ' '}`,
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        {quotereqcanedit.toString()}
                                        <br />
                                        {editmain.toString()}
                                        {/* <button onClick={() => handleClearMainArea()} style={{ display: suppliernamein || supplieraddressin || supplierphonein || suppliertaxidin || note || shippingaddressin ? '' : 'none' }}>
                                            <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                        </button> */}
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="發票號碼"
                                            disabled={status === "未儲存" ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: invoicein ? invoicein : ' ',
                                                    onChange: (e) => { setInvoicein(e.target.value) }
                                                },
                                            }}
                                        /> */}
                                    </div>
                                </div>
                                <div className={scss.head_content3}>
                                    <div style={{ marginRight: '20px' }}>
                                        {customersfilteredData.length > 0 && (
                                            <ul ref={dropdownRef}
                                                style={{
                                                    border: '1px solid #c1c1c1',
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    marginTop: '0px',
                                                    left: '20px',
                                                    position: 'absolute',
                                                    width: '1000px',
                                                    backgroundColor: 'white',
                                                    zIndex: 1004,
                                                    display: `${customersshowSuggestions ? '' : 'none'}`
                                                }}>
                                                {customersfilteredData.map(item => (
                                                    <li
                                                        key={item.id}
                                                        onClick={() => handleSelectCustomer(item)}
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
                                                        <span style={{ flex: '1 1 50%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                            {item.name}
                                                        </span>
                                                        <span style={{ flex: '1 1 47%' }}> {/* 40% 的寬度，根據需要調整 */}
                                                            {item.county}{item.district}{item.address}
                                                        </span>
                                                        <span style={{ flex: '1 1 30%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                            {item.phone}
                                                        </span>
                                                        <span style={{ flex: '1 1 30%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                            {item.contact}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {shippingfilteredData.length > 0 && (
                                            <ul ref={dropdownRef}
                                                style={{
                                                    border: '1px solid #c1c1c1',
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    marginTop: '0px',
                                                    left: '20px',
                                                    position: 'absolute',
                                                    width: '1000px',
                                                    backgroundColor: 'white',
                                                    zIndex: 1004,
                                                    display: `${shippingshowSuggestions ? '' : 'none'}`
                                                }}>
                                                {shippingfilteredData.map(item => (
                                                    <li
                                                        key={item.id}
                                                        onClick={() => handleSelectShipping(item)}
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
                                                        <span style={{ flex: '1 1 50%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                            {item.name}
                                                        </span>
                                                        <span style={{ flex: '1 1 47%' }}> {/* 40% 的寬度，根據需要調整 */}
                                                            {item.county}{item.district}{item.address}
                                                        </span>
                                                        <span style={{ flex: '1 1 30%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                            {item.phone}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_foot1}>
                                    <div>

                                    </div>
                                    <div></div>
                                    <div></div>
                                    <div style={{ textAlign: 'right' }}>
                                        {/* <span>
                                    <button className={scss.redbtn} onClick={() => { handleAddPR() }}>新增請購</button>
                                </span> */}
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
                                                value: status || ' ',
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="品項數量"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: data2.length || ' ',
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
                        <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                            <Thead01 type={'AddPO_ReqList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>
                                            {/* <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index, _item) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                {/* <img src={icon_cancel3.src} alt="cancel" style={{ width: '30px', height: '20px' }} /> */}
                                            </button>
                                            {/* <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span> */}
                                            {/* <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                        </span>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>
                                            <input
                                                ref={nameRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.name !== undefined ? _item.name : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "name", e.target.value);
                                                }}
                                            />
                                        </span>
                                        {/* <span>{_item.spec}</span> */}
                                        <span>
                                            <input
                                                ref={specRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.spec !== undefined ? _item.spec : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "spec", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                // maxLength={5}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                readOnly={!editmain ? true : false}
                                                onChange={(e) => {
                                                    // handleNumberChange(index, "quantity", e.target.value)
                                                    const newData = [...data2];
                                                    const newQuantity = e.target.value;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        quantity: newQuantity,
                                                        totalprice: ((parseFloat(newQuantity || '0') * newData[index].unitprice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()

                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={unitRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.unit !== undefined ? _item.unit : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "unit", e.target.value);
                                                }}
                                            />
                                        </span>
                                        {/* <span>
                                            <button
                                                onClick={() => {
                                                    prQuotereqModalOpen(false, _item);
                                                }}
                                            >
                                                <img src={icon_fc_quotereq.src} alt="checkquotereqhistory" style={{ width: '25px', height: '25px' }} />
                                            </button>

                                        </span> */}
                                        {/* <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.unitprice !== undefined ? _item.unitprice.toLocaleString() : ''}
                                                readOnly={!editmain ? true : false}
                                                onChange={(e) => {
                                                    // handleStringChange(index, "unitprice", e.target.value);
                                                    const newData = [...data2];
                                                    const newUnitPrice = e.target.value;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        unitprice: newUnitPrice,
                                                        totalprice: ((parseFloat(newUnitPrice || '0') * newData[index].quantity || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span> */}
                                        {/* <span>
                                            <input
                                                ref={totalpriceRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.totalprice !== undefined ? _item.totalprice.toLocaleString() : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "totalprice", e.target.value);
                                                }}
                                            />
                                        </span> */}
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain ? "1px solid black" : ""), width: '100%' }}
                                                type="text"
                                                value={_item.note !== undefined ? _item.note : ''}
                                                readOnly={!editmain ? true : false}
                                                onChange={(e) => {
                                                    handleStringChange(index, "note", e.target.value);
                                                }}
                                            />
                                        </span>


                                    </div>
                                </CellWithBar>
                            ))}


                            <div className={scss.addbar} style={{ display: `${(purchaseorderid != '' && status === '未送出') ? '' : 'none'}`, borderBottom: '1px solid #c1c1c1' }}>
                                <div>
                                    <button onClick={() => { handleAddByHandKey() }} >
                                        <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                                <div></div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入料號"
                                        value={handinputproductid}
                                        onChange={handleProductidChange}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    {/* <input
                                        type="text"
                                        placeholder='請輸入品項名稱'
                                        value={handinputname}
                                        onChange={(e) => setHandinputname(e.target.value)}
                                    /> */}
                                    <input
                                        type="text"
                                        placeholder="請輸入品項名稱"
                                        value={handinputname}
                                        onChange={handleNameChange}
                                        style={{ width: '100%' }}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入品項規格"
                                        value={handinputspec}
                                        onChange={handleSpecChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        style={{ backgroundColor: 'transparent', width: '100%' }}
                                        type="text"
                                        placeholder='數量'
                                        value={handinputquantity}
                                        onChange={(e) => {
                                            const quantity = e.target.value;
                                            // 若為無效數字或空字串，將 quantity 設為 0
                                            const parsedQuantity = quantity === '' ? 0 : parseFloat(quantity) || 0;
                                            setHandinputquantity(quantity);
                                            // 根據數量和單價計算總金額
                                            const totalPrice = (parsedQuantity * (parseFloat(handinputunitprice) || 0)).toFixed(2);
                                            // const totalPrice=(parsedQuantity * (parseFloat(handinputunitprice) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).toString()
                                            setHandinputtotalprice(totalPrice.toString());
                                        }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='單位'
                                        value={handinputunit}
                                        onChange={(e) => setHandinputunit(e.target.value)}
                                    />
                                </div>
                                {/* <div>
                                    <button
                                        onClick={() => {
                                            prQuotereqModalOpen(true, handinputproductid);
                                        }}
                                    >
                                        <img src={icon_fc_quotereq.src} alt="checkquotereqhistory" style={{ width: '25px', height: '25px' }} />
                                    </button>
                                </div> */}
                                {/* <div>
                                    <input
                                        type="text"
                                        placeholder='單價'
                                        value={handinputunitprice}  // 預設為 0
                                        onChange={(e) => {
                                            const unitprice = e.target.value;
                                            // 若為無效數字或空字串，將 unitprice 設為 0
                                            const parsedUnitPrice = unitprice === '' ? 0 : parseFloat(unitprice) || 0;
                                            setHandinputunitprice(unitprice);
                                            // 根據數量和單價計算總金額
                                            const totalPrice = ((parseFloat(handinputquantity) || 0) * parsedUnitPrice).toFixed(2);

                                            setHandinputtotalprice(totalPrice.toString());
                                        }}
                                    />
                                </div> */}
                                {/* <div>
                                    <input
                                        type="text"
                                        placeholder='金額'
                                        // value={handinputtotalprice}
                                        value={handinputtotalprice}
                                        onChange={(e) => {
                                            setHandinputtotalprice(e.target.value.toString())
                                        }}
                                    />
                                </div> */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder='備註'
                                        value={handinputnote}
                                        onChange={(e) => setHandinputnote(e.target.value)}
                                    />
                                </div>
                                <div>
                                    &nbsp;&nbsp;
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
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
                                            left: '20px',
                                            position: 'absolute',
                                            width: '1000px',
                                            backgroundColor: 'white',
                                            zIndex: 1004,
                                            display: `${showSuggestions ? '' : 'none'}`
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
                            <div></div>
                            <div></div>
                        </div>

                        <div className={scss.body_foot2}>
                            <div></div>
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
                    </div>
                </div>







                <DragableModal
                    handleText="品項查詢"
                    style={{ zIndex: '1000', width: '900px' }}
                    show={productSearchmodalopen}
                    onCrossClick={productSearchModalClose}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>類別：</span>
                        <span style={{ fontSize: '16px' }}>
                            <select value={selectedOption}
                                style={{ borderBottom: '1px solid #c1c1c1' }}
                                onChange={(e) => { setSelectedOption(e.target.value) }}>
                                <option value="物料">物料</option>
                            </select>
                        </span>

                        <span style={{ fontSize: '16px', color: '#14256a' }}>查詢：</span>
                        <span style={{ fontSize: '16px' }}>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder='　料號'
                                    value={keyword1}
                                    style={{ borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                    onChange={(e) => setKeyword1(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder='　名稱'
                                    value={keyword2}
                                    style={{ borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                    onChange={(e) => setKeyword2(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder='　規格'
                                    value={keyword3}
                                    style={{ borderBottom: '1px solid #c1c1c1' }}
                                    onChange={(e) => setKeyword3(e.target.value)}
                                />
                                <button type="submit">
                                    <img src={icon_search.src} alt="edit" style={{ width: '20px', height: '20px' }} />
                                </button>
                            </form>
                        </span>
                    </div>
                    <hr />
                    <div>
                        <Thead01 type={'AddPR_GetProduct'} />
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {modaldata && (
                                modaldata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader19}>
                                        <div className={scss.row01}>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span>{_item.count}</span>
                                            <span>
                                                <button onClick={() => { getProductById(_item.id) }}>
                                                    <img src={icon_fc_add.src} alt="addToList" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </div>
                    {/* </Modal> */}
                </DragableModal>

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
                        // title='單據查找'
                        // title={
                        // <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%',paddingRight:'20px' }}>
                        //     <span>查詢條件</span>
                        //     <span >筆數：共 {data.length} 筆</span>
                        // </div>

                        // }
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
                                        disabled={false}
                                        style={{
                                            fontSize: '18px',
                                            borderBottom: '1px solid #14256a',
                                            color: '#14256a'
                                        }}
                                    >
                                        <option value="">全部</option>
                                        <option value="未送出">未送出</option>
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
                                        caption="採購單號"
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
                            <Thead01 type={'PurchaseOrder'} />
                            {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {searchdata && (
                                searchdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader15}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.purchaseorderid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { handlechangepo(_item) }}>
                                            <span>{index + 1}</span>
                                            <span>{_item.purchaseorderid}</span>
                                            <span>{getTaiwanDateStr(_item.create_at)}</span>
                                            {/* <span>{_item.totalprice.toLocaleString()}</span> */}
                                            <span style={{ color: _item.status === "已結案" ? '#14256a' : _item.status === "詢價中" ? '#28a745' : '#ea1833' }}>
                                                {_item.status}
                                            </span>
                                            <span>{_item.suppliername}</span>
                                            {/* <span>{_item.create_by}</span> */}
                                            {/* <span ><IconDetail onClick={() => { GetPurchaseRequisition(_item) }} /></span> */}
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>

                    </div>
                    {/* </Modal > */}
                </DragableModal>

                <DragableModal
                    handleText="詢價紀錄"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={prquotereqmodalopen}
                    onCrossClick={prQuotereqModalClose}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '920px', padding: '10px 15px' }}>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>品名：</span><span style={{ fontSize: '16px' }}>{quotereqname}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: '16px', color: '#14256a' }}>規格：</span><span style={{ fontSize: '16px' }}>{quotereqspec}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: '16px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '16px' }}>{quotereqquantity}</span>
                    </div>
                    <hr />
                    {/* {selectedsupplier} */}
                    <div>
                        <Thead01 type={'Quotereq2'} />
                        <div style={{ height: '300px', overflowY: 'auto' }}>
                            {prquotereqdata && (
                                prquotereqdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader17}>
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.detail_suppliername}</span>
                                            <span>{getTaiwanDateStr(_item.detail_create_at)}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_quantity}</span>
                                            <span>{_item.detail_unit}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_unitprice.toLocaleString()}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_totalprice.toLocaleString()}</span>
                                            <span>{_item.pricetype}</span>
                                            <span>{_item.main_quotereqid}</span>
                                            <span></span>
                                            {/* <span></span> */}
                                            <span>
                                                <input
                                                    style={{ backgroundColor: 'transparent', width: '100%', height: '20px' }}
                                                    disabled={!editmain && !quotereqcanedit}  // 兩者都為 false 時才設為 disabled
                                                    type='checkbox'
                                                    checked={selectedsupplier === _item.detail_id}
                                                    onChange={() => handleCheckboxChange(_item)}
                                                />


                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </div>
                </DragableModal>


            </div>
        </SubLayer >

    )

}