import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './quotereqList.module.scss';
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
import icon_export from 'public/image/icon/fc_export.svg';
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
    const [qodata, setQodata] = useState<any[]>([]);
    const [customerdata, setCustomerdata] = useState<any[]>([]);
    const [shippingdata, setShippingdata] = useState<any[]>([]);
    const [data1restore, setData1Restore] = useState<any[]>([]);

    const [qodatadetaildata, setQodatadetaildata] = useState<any[]>([]);
    const [searchProcutdata, setSearchProductdata] = useState<any[]>([]);


    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


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
    // const [purchaseorderid, setPurchaseorderid] = useState<string>("");
    // const [purchaseorderuuid, setPurchaseorderuuid] = useState<string>("");
    const [quotereqid, setQuotereqid] = useState<string>("");
    const [quoterequuid, setQuoterequuid] = useState<string>("");

    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [purchaseorderdetailuuidin, setPurchaseorderdetailuuidin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [shippingaddressin, setShippingaddressin] = useState<string>("");
    const [supplieridin, setSupplieridin] = useState<string>("");

    const [suppliername2in, setSuppliername2in] = useState<string>("");
    const [suppliertaxid2in, setSuppliertaxid2in] = useState<string>("");
    const [supplieraddress2in, setSupplieraddress2in] = useState<string>("");
    const [supplierphone2in, setSupplierphone2in] = useState<string>("");

    const [suppliername3in, setSuppliername3in] = useState<string>("");
    const [suppliertaxid3in, setSuppliertaxid3in] = useState<string>("");
    const [supplieraddress3in, setSupplieraddress3in] = useState<string>("");
    const [supplierphone3in, setSupplierphone3in] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");
    const [keyword5, setKeyword5] = useState<string>("");
    const [keyword6, setKeyword6] = useState<string>("");
    const [keyword7, setKeyword7] = useState<string>("");
    const [keyword8, setKeyword8] = useState<string>("");

    // 預設截止日期為今天，起始日期為今天往前推30天
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    // 使用 Moment 類型作為狀態
    const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);
    const [keywordstartdate2, setKeywordstartdate2] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate2, setKeywordenddate2] = useState<Moment | null>(defaultEndDate);


    // 詢價Modal
    const [quotereqname, setQuotereqname] = useState<string>("");
    const [quotereqspec, setQuotereqspec] = useState<string>("");
    const [quotereqquantity, setQuotereqquantity] = useState<string>("");

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
    const [handinputsuppliername, setHandinputsuppliername] = useState<string>("");


    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);
    const [editmain, setEditmain] = useState<boolean>(false);

    // 保存原始值
    const [originalInvoicein, setOriginalInvoicein] = useState(invoicein);
    const [originalSuppliernamein, setOriginalSuppliernamein] = useState(suppliernamein);
    const [originalSuppliertaxidin, setOriginalSuppliertaxidin] = useState(suppliertaxidin);
    const [originalSupplieraddressin, setOriginalSupplieraddressin] = useState(supplieraddressin);
    const [originalSupplierphonein, setOriginalSupplierphonein] = useState(supplierphonein);

    const [originalSupplier2namein, setOriginalSupplier2namein] = useState(suppliername2in);
    const [originalSupplier2phonein, setOriginalSupplier2phonein] = useState(supplierphone2in);
    const [originalSupplier2taxidin, setOriginalSupplier2taxidin] = useState(suppliertaxid2in);
    const [originalSupplier2addressin, setOriginalSupplier2addressin] = useState(supplieraddress2in);

    const [originalSupplier3namein, setOriginalSupplier3namein] = useState(suppliername3in);
    const [originalSupplier3phonein, setOriginalSupplier3phonein] = useState(supplierphone3in);
    const [originalSupplier3taxidin, setOriginalSupplier3taxidin] = useState(suppliertaxid3in);
    const [originalSupplier3addressin, setOriginalSupplier3addressin] = useState(supplieraddress3in);

    const [originalcreate_atin, setOriginalcreate_atin] = useState<string>("");

    const [originalnote, setOriginalnote] = useState<string>("");

    const [originaldata, setOriginalData] = useState<any[]>([]);

    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);


    //#region 上方功能列

    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '物料號碼',
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
        // {
        //     type: 'myButton',
        //     label: '返回',
        //     onClick: () => {
        //         myAlert.confirm({
        //             title: '確定要返回採購管理嗎?',
        //             content: <>
        //                 <h1>未儲存的資料將不會保留</h1>
        //             </>,
        //             props: {
        //                 onOk: () => {
        //                     router.back();
        //                 }
        //             }
        //         });
        //     },
        // },
    ];
    //#endregion

    const getQuotereq = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/GetQuotereq?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();


            setQodata(data);
            // setData1Restore(data);
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
            getQuotereq();
            getProduct();
            getCustomers();
            GetAllQuotereqDetail();
            hasFetchedData.current = true;
        }
    }, []);

    const getQuotereqDetail = async (quoterequuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                quoterequuid: quoterequuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetQuotereqDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData1(data);

            console.log(data);

            setData2(data);


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
            // setData(data);
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
    }, []);

    //取所有物料，for查詢代入用
    const getProductById = async (productuuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
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

    //詢價單申請
    const AddQuotereq = async () => {
        if (editmain === true) {
            try {
                setIsLoading(true);
                const conditionModel = {
                    quoterequuid: quoterequuid,
                    create_at: create_atin,
                    need_date: moment(need_date).format('YYYY-MM-DD'),
                    create_by: create_byin,
                    note: note,
                    suppliername: suppliernamein,
                    supplierphone: supplierphonein,
                    suppliertaxid: suppliertaxidin,
                    supplieraddress: supplieraddressin,
                    shippingaddress: shippingaddressin,
                    suppliername2: suppliername2in,
                    supplierphone2: supplierphone2in,
                    suppliertaxid2: suppliertaxid2in,
                    supplieraddress2: supplieraddress2in,
                    suppliername3: suppliername3in,
                    supplierphone3: supplierphone3in,
                    suppliertaxid3: suppliertaxid3in,
                    supplieraddress3: supplieraddress3in,
                    data2: data2

                };



                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/UpdateAddQuotereq`, {
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

                getQuotereq();
                getQuotereqDetail(quoterequuid);
                setEditmain(false);


                setStatus("未結案");
                console.log(data);

                // getProduct();

                // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

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
                    shippingaddress: shippingaddressin,
                    suppliername2: suppliername2in,
                    supplierphone2: supplierphone2in,
                    suppliertaxid2: suppliertaxid2in,
                    supplieraddress2: supplieraddress2in,
                    suppliername3: suppliername3in,
                    supplierphone3: supplierphone3in,
                    suppliertaxid3: suppliertaxid3in,
                    supplieraddress3: supplieraddress3in,

                };



                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/AddQuotereq`, {
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
                        content: `詢價單據號碼為:${data[0].quotereqid}`
                    })

                setData2([]);
                setQuotereqid(data[0].quotereqid);
                setQuoterequuid(data[0].id);
                setStatus("未結案");
                getQuotereq();



                setStatus("未結案");
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

    const RemoveQuotereqDetail = async (id: any) => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/RemoveQuotereqDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            getQuotereqDetail(quoterequuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //請購單申請
    const CloseQuotereq = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                quotereqid: quotereqid,
                quoterequuid: quoterequuid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/CloseQuotereq`, {
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

            getQuotereq();
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
        if (editmain === true) {
            myAlert.confirm({
                title: '確定要儲存異動的資料嗎?',
                content: null,
                props: {
                    onOk: async () => {
                        AddQuotereq();

                    }
                }
            })
        } else {
            if (suppliernamein === '' || supplieraddressin === '') {
                myAlert.warning({ title: '請確認欄位是否填寫完整' })
                return;
            }
            myAlert.confirm({
                title: '確定要新增單據嗎?',
                content: <>
                    <h1>請檢查資料是否填寫完整</h1>
                </>,
                props: {
                    onOk: async () => {
                        AddQuotereq();

                    }
                }
            })
        }
    }


    // 手key加入
    const handleAddByHandKey = async () => {
        if (handinputname === '' || handinputspec === '' || handinputquantity === '' || handinputunit === '' || handinputquantity === '') {
            myAlert.warning({ title: '未輸入名稱、規格或數量' });
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
                suppliername: handinputsuppliername
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
                    quotereqid: quotereqid,
                    quoterequuid: quoterequuid,
                    supplierid: supplieridin,
                    suppliername: suppliernamein,
                    supplieraddress: supplieraddressin,
                    suppliertaxid: suppliertaxidin,
                    supplierphone: supplierphonein,
                    data: newEntry
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                const response = await fetch(`${setting.apipath}/WareHouse/AddQuotereqDetail`, {
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

                getQuotereqDetail(quoterequuid);
                getQuotereqDetailhistory(handinputproductid);




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
                    RemoveQuotereqDetail(item.detail_id);
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

    const GetAllQuotereqDetail = async () => {
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
            console.log(JSON.stringify(inputModel));

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetAllQuotereqDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();


            // setQodata(data);
            // setData1Restore(data);
            // setSearchdata(data);
            setQodatadetaildata(data);
            setSearchProductdata(data);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }



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
        // setFilteredData(searchbardata);
    };


    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputunit('');
        setHandinputnote('');
        setHandinputquantity('');
        setShowSuggestions(false);
        setHandinputunitprice('');
        setHandinputtotalprice('');
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
        setQuotereqid("儲存後產生");
        setStatus("未儲存");
        setNote("");

        setSuppliername2in("");
        setSupplierphone2in("");
        setSuppliertaxid2in("");
        setSupplieraddress2in("");

        setSuppliername3in("");
        setSupplierphone3in("");
        setSuppliertaxid3in("");
        setSupplieraddress3in("");
        setData2([]);
    }

    const handlecancelAddPR = () => {

        if (editmain === true) {
            setEditmain(false);
            setInvoicein(originalInvoicein);

            setSuppliernamein(originalSuppliernamein);
            setSupplierphonein(originalSupplierphonein);
            setSuppliertaxidin(originalSuppliertaxidin);
            setSupplieraddressin(originalSupplieraddressin);

            setSuppliername2in(originalSupplier2namein);
            setSupplierphone2in(originalSupplier2phonein);
            setSuppliertaxid2in(originalSupplier2taxidin);
            setSupplieraddress2in(originalSupplier2addressin);

            setSuppliername3in(originalSupplier3namein);
            setSupplierphone3in(originalSupplier3phonein);
            setSuppliertaxid3in(originalSupplier3taxidin);
            setSupplieraddress3in(originalSupplier3addressin);

            setCreate_atin(originalcreate_atin);
            setNote(originalnote);

            setData2(originaldata);

        }
        else {

            setSuppliernamein("");
            setSupplierphonein("");
            setSuppliertaxidin("");
            setInvoicein("");
            setSupplieraddressin("");
            setShippingaddressin("");
            setEditmain(false);
            setQuotereqid("");
            setStatus("");
            setData2([]);
            setNote("");
            setNeed_date(moment().toString());
        }
    }

    const handlesaveAddPRDetail = () => {

        let needDateObj = new Date(need_date);
        let createAtinObj = new Date(create_atin);

        if (data2.length === 0) {
            myAlert.warning({ title: "尚未加入任何詢價項目" });
            return;
        }
        else {

            const hasZeroQuantity = data2.some(item => item.quantity === 0 || item.quantity === '');

            if (hasZeroQuantity) {
                myAlert.warning({ title: "詢價項目中有數量為0的項目，請檢查並修正。" });
            } else {
                myAlert.confirm({
                    title: '確定要送出詢價單嗎?',
                    content: <>
                        <h1>請檢查品名、數量是否正確</h1>
                    </>,
                    props: {
                        onOk: async () => {
                            CloseQuotereq();
                            setQuotereqid("");
                            setQuoterequuid("");
                            setCreate_atin(moment().format('YYYY-MM-DD') || '');
                            setNeed_date(moment().format('YYYY-MM-DD') || '');
                            setStatus("");
                            setNote("")
                            setData2([]);

                            // await router.push({
                            //     pathname: `/factoryDepartment/purchaseOrderList`,
                            //     query: {
                            //         purchaseorderid: purchaseorderid
                            //     },
                            // });
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
        const suppliername = keyword4.trim();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionId &&
            !status &&
            !suppliername) {
            setSearchdata(qodata);
            return;
        }

        console.log(searchdata.length);


        // 過濾資料
        let filteredData = qodata.filter(item => {
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
                item?.quotereqid?.toString().includes(requisitionId)
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
    }, [keywordstartdate, keywordenddate, keyword3, keyword2, keyword4]);



    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');
        // setSearchdata(qodata);
    }



    const filterData2 = () => {
        const startDate = keywordstartdate2;
        const endDate = keywordenddate2;
        const requisitionproductId = keyword5.trim();
        const name = keyword6.trim();
        const spec = keyword7.trim();
        const suppliername = keyword8.trim();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionproductId &&
            !name &&
            !spec &&
            !suppliername) {
            setSearchProductdata(qodatadetaildata);
            return;
        }




        // 過濾資料
        let filteredData = qodatadetaildata.filter(item => {
            const createAt = moment(item.detail_create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        console.log(filteredData);

        // 模糊查詢料號
        if (requisitionproductId) {
            filteredData = filteredData.filter(item =>
                item?.detail_productid?.toString().includes(requisitionproductId)
            );
        }

        // 模糊查詢名稱
        if (name) {
            filteredData = filteredData.filter(item =>
                item.detail_name.toString().includes(name)
            );
        }
        if (spec) {
            filteredData = filteredData.filter(item =>
                item.detail_spec.toString().includes(spec)
            );
        }

        if (suppliername) {
            filteredData = filteredData.filter(item =>
                item.detail_suppliername.toString().includes(suppliername)
            );
        }

        setSearchProductdata(filteredData);
    };

    // 監聽條件變更
    useEffect(() => {
        filterData2();
    }, [keywordstartdate2, keywordenddate2, keyword5, keyword6, keyword7, keyword8]);

    const clearFilterData2 = (e: any) => {
        e.preventDefault();
        setKeywordstartdate2(null)
        setKeywordenddate2(null);
        setKeyword5('');
        setKeyword6('');
        setKeyword7('');
        setKeyword8('');
        setSearchProductdata(qodatadetaildata);
        // setSearchdata(qodata);
        // setSearchdata(qodata);
    }




    const handlechangepo = (item: any) => {
        console.log(item);
        // handleRowClick(item.id);
        setData2([]);
        setQuotereqid(item.quotereqid);
        setQuoterequuid(item.id);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setNeed_date(item.need_date);
        setSuppliernamein(item.suppliername);
        setSupplierphonein(item.supplierphone);
        setSuppliertaxidin(item.suppliertaxid);
        setSupplieraddressin(item.supplieraddress);
        setShippingaddressin(item.shippingaddress);
        setSuppliername2in(item.suppliername2);
        setSupplierphone2in(item.supplierphone2);
        setSuppliertaxid2in(item.suppliertaxid2);
        setSupplieraddress2in(item.supplieraddress2);
        setSuppliername3in(item.suppliername3);
        setSupplierphone3in(item.supplierphone3);
        setSuppliertaxid3in(item.suppliertaxid3);
        setSupplieraddress3in(item.supplieraddress3);
        switch (tabnow) {
            case "廠商1":
                setHandinputsuppliername(item.suppliername);
                break;
            case "廠商2":
                setHandinputsuppliername(item.suppliername2);
                break;
            case "廠商3":
                setHandinputsuppliername(item.suppliername3);
                break;
            default:
                break;
        }


        getQuotereqDetail(item.id);
        setSearchmodalopen(false);

    }

    const handlechangepo2 = (item: any) => {
        console.log(item);
        handleRowClick(item.id);
        setData2([]);
        setQuotereqid(item.quotereqid);
        setQuoterequuid(item.id);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setNeed_date(item.need_date);
        setSuppliernamein(item.suppliername);
        setSupplierphonein(item.supplierphone);
        setSuppliertaxidin(item.suppliertaxid);
        setSupplieraddressin(item.supplieraddress);
        setShippingaddressin(item.shippingaddress);
        setSuppliername2in(item.suppliername2);
        setSupplierphone2in(item.supplierphone2);
        setSuppliertaxid2in(item.suppliertaxid2);
        setSupplieraddress2in(item.supplieraddress2);
        setSuppliername3in(item.suppliername3);
        setSupplierphone3in(item.supplierphone3);
        setSuppliertaxid3in(item.suppliertaxid3);
        setSupplieraddress3in(item.supplieraddress3);
        setCreate_byin(item.create_by);
        switch (tabnow) {
            case "廠商1":
                setHandinputsuppliername(item.suppliername);
                break;
            case "廠商2":
                setHandinputsuppliername(item.suppliername2);
                break;
            case "廠商3":
                setHandinputsuppliername(item.suppliername3);
                break;
            default:
                break;
        }


        getQuotereqDetail(item.id);
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
        let supnameFilter: string | undefined;
        let supaddressFilter: string | undefined;

        switch (tabnow) {
            case "廠商1":
                supnameFilter = suppliernamein?.trim();
                supaddressFilter = supplieraddressin?.trim();
                break;
            case "廠商2":
                supnameFilter = suppliername2in?.trim();
                supaddressFilter = supplieraddress2in?.trim();
                break;
            case "廠商3":
                supnameFilter = suppliername3in?.trim();
                supaddressFilter = supplieraddress3in?.trim();
                break;
            default:
                // 可以設置為預設值或處理其他情況
                supnameFilter = undefined;
                supaddressFilter = undefined;
                break;
        }


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


    }, [suppliernamein, supplieraddressin, shippingaddressin, suppliername2in, supplieraddress2in, suppliername3in, supplieraddress3in]);





    const handleSelectCustomer = (item: any) => {
        customersisSelectingRef.current = true;


        switch (tabnow) {
            case "廠商1":
                setSupplieridin(item?.customer_number);
                setSuppliernamein(item?.name);
                setSupplieraddressin(
                    (item.county ? item.county : '') +
                    (item.district ? item.district : '') +
                    (item.address ? item.address : '')
                );
                setSupplierphonein(item.phone ? item.phone : '');
                setSuppliertaxidin(item.tax_id ? item.tax_id : '');
                break;
            case "廠商2":
                // setSupplierid2in(item?.customer_number);
                setSuppliername2in(item?.name);
                setSupplieraddress2in(
                    (item.county ? item.county : '') +
                    (item.district ? item.district : '') +
                    (item.address ? item.address : '')
                );
                setSupplierphone2in(item.phone ? item.phone : '');
                setSuppliertaxid2in(item.tax_id ? item.tax_id : '');
                break;
            case "廠商3":

                setSuppliername3in(item?.name);
                setSupplieraddress3in(
                    (item.county ? item.county : '') +
                    (item.district ? item.district : '') +
                    (item.address ? item.address : '')
                );
                setSupplierphone3in(item.phone ? item.phone : '');
                setSuppliertaxid3in(item.tax_id ? item.tax_id : '');
                break;
            default:
                break;
        }

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
    const [quotereqcanedit, setQuotereqcanedit] = useState<boolean>();
    const prQuotereqModalOpen = async (type: any, item: any) => {

        // return;
        setQuotereqcanedit(Boolean(type));
        setQuotereqname(type === true ? handinputname : item.detail_name);
        setQuotereqspec(type === true ? handinputspec : item.detail_spec);
        getQuotereqDetailhistory(type === true ? item : item.detail_productid);
        setTimeout(() => setPrquotereqmodalopen(true), 500);
    }

    //關閉詢價單modal
    const prQuotereqModalClose = async () => {
        setPrquotereqmodalopen(false);
        // setQuotereqcanedit(false)
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
        setHandinputquantity(item.detail_quantity);
        setHandinputtotalprice((parseFloat(handinputunitprice || '0') * parseFloat(handinputquantity || '0')).toString());
        // UpdatePurchaseOrderDetail(item);
    };

    const DeleteQuotereq = async (id: any) => {

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

                        const response = await fetch(`${setting.apipath}/WareHouse/DeleteQuotereq?${queryParams}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const responseData = await response.text();

                        myAlert.success({ title: '刪除成功' });

                        getQuotereq();

                        setQuotereqid('');
                        setCreate_atin('');
                        setSuppliernamein('');
                        setSupplieraddressin('');
                        setSupplierphonein('');
                        setSuppliertaxidin('');
                        setSuppliername2in('');
                        setSupplieraddress2in('');
                        setSupplierphone2in('');
                        setSuppliertaxid2in('');
                        setSuppliername3in('');
                        setSupplieraddress3in('');
                        setSupplierphone3in('');
                        setSuppliertaxid3in('');
                        setNote('');
                        setCreate_byin('');
                        setStatus('');
                        setData2([]);
                        setKeyword3('');



                    } catch (error: any) {
                        setError(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }

                }
            }
        })
    };

    const Excel = async (id: any) => {
        try {
            setIsLoading(true);
            const conditionModel = {
                id: id,
                type: 'quotereq'
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
            link.setAttribute('download', `三久建材_詢比價表_${id}.xls`); // 設置文件名

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


    //#region Tab頁籤切換
    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("廠商1");
    const [tabshow, setTabshow] = useState<string>("廠商1");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        return tabnow === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName); // 設置當前 tab 值
        setTabshow(tabName);
        switch (tabName) {
            case "廠商1":
                setHandinputsuppliername(suppliernamein);
                break;
            case "廠商2":
                setHandinputsuppliername(suppliername2in);
                break;
            case "廠商3":
                setHandinputsuppliername(suppliername3in);
                break;
            default:
                break;
        }

        setSelectedItemId('');
    };

    //#endregion


    const handleSuppliernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        switch (tabnow) {
            case "廠商1":
                setSuppliernamein(e.target.value);
                break;
            case "廠商2":
                setSuppliername2in(e.target.value);
                break;
            case "廠商3":
                setSuppliername3in(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleSupplieraddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        switch (tabnow) {
            case "廠商1":
                setSupplieraddressin(e.target.value);
                break;
            case "廠商2":
                setSupplieraddress2in(e.target.value);
                break;
            case "廠商3":
                setSupplieraddress3in(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleSupplierphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        switch (tabnow) {
            case "廠商1":
                setSupplierphonein(e.target.value);
                break;
            case "廠商2":
                setSupplierphone2in(e.target.value);
                break;
            case "廠商3":
                setSupplierphone3in(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleSuppliertaxidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customersisSelectingRef.current = false;
        switch (tabnow) {
            case "廠商1":
                setSuppliertaxidin(e.target.value);
                break;
            case "廠商2":
                setSuppliertaxid2in(e.target.value);
                break;
            case "廠商3":
                setSuppliertaxid3in(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleSuppliernow = async () => {

        switch (tabnow) {
            case "廠商1":
                setHandinputsuppliername(suppliernamein)
                break;
            case "廠商2":
                setSuppliertaxid2in(suppliername2in);
                break;
            case "廠商3":
                setSuppliertaxid3in(suppliername3in);
                break;
            default:
                break;
        }


    }

    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalInvoicein(invoicein);

        setOriginalSuppliernamein(suppliernamein);
        setOriginalSupplierphonein(supplierphonein);
        setOriginalSuppliertaxidin(suppliertaxidin);
        setOriginalSupplieraddressin(supplieraddressin);

        setOriginalSupplier2namein(suppliername2in);
        setOriginalSupplier2phonein(supplierphone2in);
        setOriginalSupplier2taxidin(suppliertaxid2in);
        setOriginalSupplier2addressin(supplieraddress2in);

        setOriginalSupplier3namein(suppliername3in);
        setOriginalSupplier3phonein(supplierphone3in);
        setOriginalSupplier3taxidin(suppliertaxid3in);
        setOriginalSupplier3addressin(supplieraddress3in);

        setOriginalcreate_atin(create_atin);
        setOriginalnote(note);

        setOriginalData(data2);

        setEditmain(true);
    };

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            <PageHeader02 tag='詢價單' panelList={panelList} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    單據
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { setProductSearchmodalopen(!productSearchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    價格
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { Excel(quotereqid) }} title="Excel">
                                    <img src={icon_export.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    詢價
                                </button>
                            </div>
                            <div>
                                <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlePreAddPO() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button
                                    style={{ display: `${status === "未結案" && !editmain ? '' : 'none'}` }}
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
                                <button style={{ display: `${status === "未結案" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { DeleteQuotereq(quoterequuid) }} title="單據刪除">
                                    <img src={icon_delete.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    刪除
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未結案" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handlesaveAddPRDetail() }} title="單據送出">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="詢價單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: quotereqid || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            caption="詢價日期"
                                            className="global_tip_must"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') ? moment(create_atin) : null,
                                                    onChange: (e) => { setCreate_atin((e?.toString() || '') || '') }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="詢價人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? create_byin : create_byin) || ' ',
                                                },
                                            }}
                                        />

                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_foot1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: note || ' ',
                                                    onChange: (e) => { setNote(e.target.value) }
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_tab}>
                                    <div>
                                        <span>
                                            <button
                                                className={scss.minitabbtn}
                                                onClick={() => tabChosed('廠商1')}
                                                style={getButtonStyle('廠商1')}
                                            >
                                                廠商1
                                            </button>
                                        </span>
                                        <span>
                                            <button
                                                className={scss.minitabbtn}
                                                onClick={() => tabChosed('廠商2')}
                                                style={getButtonStyle('廠商2')}
                                            >
                                                廠商2
                                            </button>
                                        </span>
                                        <span>
                                            <button
                                                className={scss.minitabbtn}
                                                onClick={() => tabChosed('廠商3')}
                                                style={getButtonStyle('廠商3')}
                                            >
                                                廠商3
                                            </button>
                                        </span>
                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.tabbody}>
                                    <div>
                                        <div style={{ display: `${tabshow === "廠商1" ? '' : 'none'}` }}>
                                            <div>
                                                <div className={scss.head_content2} style={{ padding: '0px 10px' }}>
                                                    <div >
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="廠商名稱"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliernamein ? suppliernamein : ' ',
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
                                                                    value: supplieraddressin ? supplieraddressin : ' ',
                                                                    onChange: (e) => { handleSupplieraddressChange(e) }
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
                                                                    value: supplierphonein ? supplierphonein : ' ',
                                                                    onChange: (e) => { handleSupplierphoneChange(e) }
                                                                },
                                                            }}
                                                        />
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="統一編號"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliertaxidin ? suppliertaxidin : ' ',
                                                                    onChange: (e) => { handleSuppliertaxidChange(e) }
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: `${tabshow === "廠商2" ? '' : 'none'}` }}>
                                            <div>
                                                <div className={scss.head_content2} style={{ padding: '0px 10px' }}>
                                                    <div >
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="廠商名稱"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliername2in ? suppliername2in : ' ',
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
                                                                    value: supplieraddress2in ? supplieraddress2in : ' ',
                                                                    onChange: (e) => { handleSupplieraddressChange(e) }
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
                                                                    value: supplierphone2in ? supplierphone2in : ' ',
                                                                    onChange: (e) => { handleSupplierphoneChange(e) }
                                                                },
                                                            }}
                                                        />
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="統一編號"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliertaxid2in ? suppliertaxid2in : ' ',
                                                                    onChange: (e) => { handleSuppliertaxidChange(e) }
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: `${tabshow === "廠商3" ? '' : 'none'}` }}>
                                            <div>
                                                <div className={scss.head_content2} style={{ padding: '0px 10px' }}>
                                                    <div >
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="廠商名稱"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliername3in ? suppliername3in : ' ',
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
                                                                    value: supplieraddress3in ? supplieraddress3in : ' ',
                                                                    onChange: (e) => { handleSupplieraddressChange(e) }
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
                                                                    value: supplierphone3in ? supplierphone3in : ' ',
                                                                    onChange: (e) => { handleSupplierphoneChange(e) }
                                                                },
                                                            }}
                                                        />
                                                        <InputSel
                                                            {...inputSelProps}
                                                            caption="統一編號"
                                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                                            inputProps={{
                                                                props: {
                                                                    value: suppliertaxid3in ? suppliertaxid3in : ' ',
                                                                    onChange: (e) => { handleSuppliertaxidChange(e) }
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                        caption="詢價數量"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: data2.length > 0 ? data2.length : ' ',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={scss.head_foot2}>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>
                                    廠商1：
                                    {suppliernamein}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>
                                    廠商2：
                                    {suppliername2in}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>
                                    廠商3：
                                    {suppliername3in}
                                </span>
                            </div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                            <Thead01 type={'AddQOList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>
                                            {/* <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                            <button style={{ display: (editstatus === false && status === '未結案') ? '' : 'none' }} onClick={() => { handleRemove(index, _item) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                {/* <img src={icon_cancel3.src} alt="cancel" style={{ width: '20px', height: '20px' }} /> */}
                                            </button>
                                            {/* <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span> */}
                                            {/* <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                        </span>
                                        <span>{index + 1}</span>
                                        <span>{_item.detail_productid}</span>
                                        <span>
                                            <input
                                                ref={nameRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.detail_name !== undefined ? _item.detail_name : ''}
                                                readOnly
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                                value={_item.detail_spec !== undefined ? _item.detail_spec : ''}
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
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain === true ? "1px solid black" : ""), width: '100%' }}
                                                type="text"
                                                // maxLength={5}
                                                value={_item.detail_quantity !== undefined ? _item.detail_quantity.toLocaleString() : 0}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                // readOnly
                                                // onChange={(e) => {
                                                //     handleNumberChange(index, "quantity", e.target.value);
                                                // }}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newQuantity = e.target.value;
                                                    console.log(newData);
                                                    newData[index] = {
                                                        ...newData[index],
                                                        detail_quantity: newQuantity,
                                                        detail_totalprice: ((parseFloat(newQuantity || '0') * newData[index].detail_unitprice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()

                                                    };
                                                    setData2(newData);
                                                    // handleChange(index, "quantity", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={unitRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                type="text"
                                                value={_item.detail_unit !== undefined ? _item.detail_unit : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "unit", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <button
                                                onClick={() => {
                                                    setQuotereqcanedit(false);
                                                    prQuotereqModalOpen(false, _item)
                                                }}
                                            >
                                                <img src={icon_fc_quotereq.src} alt="checkquotereqhistory" style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        </span>
                                        <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain === true ? "1px solid black" : ""), width: '100%' }}
                                                type="text"
                                                value={_item.detail_unitprice !== undefined ? _item.detail_unitprice.toLocaleString() : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                // readOnly
                                                // onChange={(e) => {
                                                //     handleStringChange(index, "unitprice", e.target.value);
                                                // }}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newUnitPrice = e.target.value;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        detail_unitprice: newUnitPrice,
                                                        detail_totalprice: ((parseFloat(newUnitPrice || '0') * newData[index].detail_quantity || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            {/* {_item.detail_totalprice.toLocaleString()} */}
                                            <span>
                                                {/* {typeof _item.detail_totalprice === 'number' ? _item.detail_totalprice.toLocaleString() : Number(_item.detail_totalprice).toLocaleString()} */}
                                                <span>{_item.detail_totalprice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </span>
                                        </span>
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.detail_suppliername !== undefined ? _item.detail_suppliername : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "suppliername", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: (editmain === true ? "1px solid black" : ""), width: '100%' }}
                                                type="text"
                                                value={_item.detail_note !== undefined ? _item.detail_note : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                // onChange={(e) => {
                                                //     handleStringChange(index, "note", e.target.value);
                                                // }}
                                                onChange={(e) => {
                                                    const newData = [...data2];
                                                    const newNote = e.target.value;
                                                    newData[index] = {
                                                        ...newData[index],
                                                        detail_note: newNote
                                                    };
                                                    setData2(newData);
                                                }}
                                            />
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))}


                            <div className={scss.addbar} style={{ display: `${(quotereqid != '' && status === '未結案') ? '' : 'none'}`, borderBottom: '1px solid #c1c1c1' }}>
                                {/* <div className={scss.addbar} style={{ borderBottom: '1px solid #c1c1c1' }}> */}
                                <div>

                                    <button onClick={() => { handleAddByHandKey() }}>
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
                                        style={{ backgroundColor: 'transparent', width: '50px' }}
                                        type="text"
                                        placeholder='數量'
                                        // maxLength={5}
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
                                <div>
                                    <button
                                        onClick={() => {
                                            prQuotereqModalOpen(true, handinputproductid)
                                        }}
                                    >
                                        <img src={icon_fc_quotereq.src} alt="checkquotereqhistory" style={{ width: '20px', height: '20px' }} />
                                    </button>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='單價'
                                        value={handinputunitprice}
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
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='金額'
                                        value={handinputtotalprice}
                                        onChange={(e) => {
                                            setHandinputtotalprice(e.target.value.toString())
                                        }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='廠商'
                                        value={handinputsuppliername}
                                    // onChange={(e) => handleSuppliernow()}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='備註'
                                        value={handinputnote}
                                        onChange={(e) => setHandinputnote(e.target.value)}
                                    />
                                </div>
                                <div>
                                    {/* &nbsp;&nbsp;&nbsp;
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote || handinputunitprice ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button> */}
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
                    </div>
                </div>







                <DragableModal
                    handleText="品項查詢"
                    style={{ zIndex: '1000', width: '1810px' }}
                    show={productSearchmodalopen}
                    onCrossClick={productSearchModalClose}
                >
                    <div className={scss.modal_head_head2}>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {searchProcutdata.length} 筆</span>
                        </div>
                    </div>
                    <div className={scss.modal_head_content2}>
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
                                    <InputSel
                                        caption="起始日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        datePickerProps={{
                                            props: {
                                                value: keywordstartdate2 || null,
                                                onChange: (e: Moment | null) => { setKeywordstartdate2(e) }
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
                                                value: keywordenddate2 || null,
                                                onChange: (e: Moment | null) => { setKeywordenddate2(e) }
                                            }
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="物料編號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword5 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword5(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="品項名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword6 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword6(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="品項規格"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword7 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword7(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div >
                                    <InputSel
                                        {...inputSelProps}
                                        caption="廠商名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword8 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword8(e.target.value) }
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
                                        <button className={scss.minibtn} onClick={(e) => { clearFilterData2(e) }}>清除條件</button>
                                    </span>
                                </div>
                            </form>
                        </div>
                        <div style={{
                            maxHeight: '465.81px',
                            overflowY: 'auto',
                            border: '1px solid #c1c1c1',
                        }}>
                            <Thead01 type={'Quotereq4'} />
                            {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {searchProcutdata && (
                                searchProcutdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader16}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.detail_id === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { handlechangepo(_item) }}>
                                            <span>{index + 1}</span>
                                            <span>{_item.detail_productid}</span>
                                            <span>{_item.detail_name}</span>
                                            <span>{_item.detail_spec}</span>
                                            <span>{getTaiwanDateStr(_item.detail_create_at)}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_quantity}</span>
                                            <span>{_item.detail_unit}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_unitprice.toLocaleString()}</span>
                                            <span style={{ textAlign: 'right' }}>{_item.detail_totalprice.toLocaleString()}</span>
                                            <span>{_item.detail_suppliername}</span>                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>

                    </div>
                </DragableModal>

                <DragableModal
                    handleText="查找單據"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={searchmodalopen}
                    onCrossClick={SearchModalClose}
                >
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
                                <br />
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
                                        <option value="已結案">已結案</option>
                                        <option value="未結案">未結案</option>
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
                                        caption="詢價單號"
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
                        }}>
                            <Thead01 type={'Quotereq3'} />
                            {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {searchdata && (
                                searchdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader15}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                            onDoubleClick={() => { handlechangepo(_item) }}
                                            onClick={() => { handlechangepo2(_item) }}>
                                            <span>{index + 1}</span>
                                            <span>{_item.quotereqid}</span>
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
                        {/* <span style={{ fontSize: '16px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '16px' }}>{handinputquantity}</span> */}
                    </div>
                    <hr />
                    <div>
                        <Thead01 type={'Quotereq'} />
                        {prquotereqdata && (
                            prquotereqdata.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader17}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.detail_suppliername}</span>
                                        <span>{getTaiwanDateStr(_item.detail_create_at)}</span>
                                        {/* <span>
                                            {new Date(_item.detail_create_at).toLocaleString('zh-TW', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false, // 24小時制
                                            })}
                                        </span> */}
                                        <span style={{ textAlign: 'right' }}>{_item.detail_quantity}</span>
                                        <span>{_item.detail_unit}</span>
                                        <span style={{ textAlign: 'right' }}>{_item.detail_unitprice.toLocaleString()}</span>
                                        <span style={{ textAlign: 'right' }}>{_item.detail_totalprice.toLocaleString()}</span>
                                        <span>{_item.detail_note}</span>
                                        <span></span>
                                        {/* <span></span> */}
                                        <span>
                                            <input
                                                className={scss.quotereqdetail_checkbox}
                                                type='checkbox'
                                                checked={selectedsupplier === _item.detail_id}
                                                onChange={() => {
                                                    if (quotereqcanedit === false) return; // 如果 quotereqcanedit 為 false，則不執行後續操作
                                                    handleCheckboxChange(_item);
                                                }}
                                            />
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                </DragableModal>

            </div>
        </SubLayer >

    )

}