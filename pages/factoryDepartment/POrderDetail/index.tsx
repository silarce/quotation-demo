import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './POrderDetail.module.scss';
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

type Tquery = {
    wareHouseId: string | undefined;
};

export default function POrderDetail() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        need_date,
        create_at,
        create_by,
        purchaserequisitionuuid,
        purchaserequisitionid,
        item
    } = router.query;

    const parsedItem = item ? JSON.parse(item as string) : null;


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

    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const totalpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [need_datein, setNeed_datein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>('');
    const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>('');
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [shippingaddressin, setShippingaddressin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
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



    //#region 上方功能列

    //搜尋功能


    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        // const keywordWhpname = valueArr[0] as string;
        // const keywordMaterialnumber = valueArr[1] as string;
        // const keywordSpec = valueArr[2] as string;
        // searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };







    //新增按鈕
    const panelList: TpanelList = [

    ];
    //#endregion


    //頁面進入
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
        NewGetPurchaseOrderDetailById(parsedItem?.purchaseorderuuid);
        GetReviewById(parsedItem?.purchaseorderuuid);
        GetReviewHistory(parsedItem?.purchaseorderuuid);
        setPurchaseorderuuidin(parsedItem?.purchaseorderuuid);
        setPurchaseorderidin(parsedItem?.purchaseorderid);
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

    }, [item]);



    // newapi

    //取請購明細
    const NewGetPurchaseOrderDetailById = async (id: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                purchaseorderuuid: id as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPurchaseOrderDetailById?${queryParams}`);
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

    //更新請購單和請購單明細
    const NewUpdatePurchaserequisitionDetail = async () => {
        try {
            const conditionModel = {
                purchaserequisitionid: purchaserequisitionidin,
                purchaserequisitionuuid: purchaserequisitionuuidin,
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
                NewGetPurchaseOrderDetailById(purchaseorderuuidin);
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
                id: purchaserequisitionuuidin as string | undefined,
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
                purchaseorderuuid: purchaseorderuuidin,
                purchaseorderid: purchaseorderidin,
                create_at: create_atin,
                create_by: create_byin,
                status: '採購中',
                need_date: need_datein,
                note: notein,
                firstin: 1,
            };

            const conditionModel = {
                document_id: purchaseorderidin,
                document_uuid: purchaseorderuuidin,
                document_type: "採購單",
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
            GetReviewById(purchaseorderuuidin);


            await new Promise(resolve => setTimeout(resolve, 500));

            //改變單據狀態
            const conditionModel2 = {
                type: type,
                purchaseorderuuid: purchaseorderuuidin,
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

            NewGetPurchaseOrderDetailById(purchaseorderuuidin);
            GetReviewById(purchaseorderuuidin)
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
        setDocumenttitle(`【請購單】【${purchaserequisitionidin}】_${userInfo?.employee?.chName.toString()}`)
    }

    const handleGetReviewBack = () => {
        myAlert.confirm({
            title: '確定要抽單嗎?',
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            document_uuid: purchaserequisitionuuidin,
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
                        setStatusin("詢價中");
                        setReview_flow("");
                        setValue(null);
                        GetReviewHistory(purchaserequisitionuuidin);

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






    //#region api呼叫區
    //取物料清單
    const getProduct = async () => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {
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

    // 確保在進入編輯模式時，原始資料被正確保存
    const enterEditMode = () => {
        setOriginaldata2([...data2]); // 確保保存的是當前資料的副本
        setIsEditing(true); // 進入編輯模式
    };

    const cancelEditMode = () => {
        setData2([...originaldata2]); // 確保還原為原始資料
        setIsEditing(false); // 退出編輯模式
    };





    // 還原口袋清單
    const handleRestore = () => {
        setData2(data2restore);
    }
    //#endregion


    useEffect(() => {
        console.log(originaldata2);
        console.log(data2);
    }, [isEditing]);


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
        console.log("OK");
        console.log(searchbardata);
        console.log(handinputproductid);
        console.log(handinputname);
        console.log(handinputspec);

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

        // }, [data2]);
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

    // const handleSelect = (item: DataItem) => {
    //     console.log(item);
    //     console.log(data2);
    //     isSelectingRef.current = true;
    //     // setHandinputproductuuid(item.id);
    //     // setHandinputproductid(item.productid);
    //     // setHandinputname(item.name);
    //     // setHandinputspec(item.spec || "");
    //     // setHandinputunit(item.unit);
    //     // handleStringChange(currentindex, "productuuid", item.id);
    //     handleStringChange(currentindex, "productid", item.productid);
    //     handleStringChange(currentindex, "name", item.name);
    //     handleStringChange(currentindex, "spec", item.spec);
    //     handleStringChange(currentindex, "unit", item.unit);


    //     setShowSuggestions(false);
    // };

    // const handleSelect = (item: DataItem) => {
    //     console.log(item);
    //     console.log(data2);
    //     isSelectingRef.current = true;

    //     // 合併多個變更
    //     const newData = [...data2];
    //     newData[currentindex] = {
    //         ...newData[currentindex],
    //         productid: item.productid,
    //         name: item.name,
    //         spec: item.spec || "",
    //         unit: item.unit,
    //     };

    //     setData2(newData); // 一次更新所有變更
    //     setShowSuggestions(false); // 隱藏建議

    //     setSearchBarData(data);
    // };

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


    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });



    const handleMouseUp = () => {
        setDragging(false);
    };


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, offset, position]);

    const handleMouseMove = (event: any) => {
        if (dragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };

    const handleMouseDown = (event: any) => {
        setDragging(true);
        // 記錄下滑鼠的偏差
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
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
    }, []);

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
            setSearchdata(prdata);
            return;
        }

        // 過濾資料
        let filteredData = prdata.filter(item => {
            const createAt = moment(item.create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        // 模糊查詢請購單號
        if (requisitionId) {
            filteredData = filteredData.filter(item =>
                item.purchaserequisitionid.toString().includes(requisitionId)
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

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

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


    const handleEdit = () => {
        setOriginalcreate_at(create_atin);
        setOriginalneed_date(need_datein);
        setOriginalnote(notein);
        setOriginaldata2([...data2]); // 確保保存的是當前資料的副本
        setIsEditing(true) // 進入編輯模式
    };

    const handleCancel = () => {
        setCreate_atin(originalcreate_at);
        setNeed_datein(originalneed_date);
        setNotein(originalnote);
        setData2([...originaldata2]);  // 確保還原為原始資料
        setIsEditing(false);  // 結束編輯模式
    };

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





    // 資料異動處理

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




    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='採購單' panelList={panelList}
                customeRight={[
                    <>
                        {/* 編輯按鈕 */}
                        {statusin === "採購中" && !isEditing && (

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
                                        setDocumenttitle(`【請購單】【${purchaserequisitionidin}】_${userInfo?.employee?.chName.toString()}`)
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
                                            title: '確定要返回採購單列表嗎?',
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
                        {statusin === "採購中" && isEditing && (
                            <>
                                <button
                                    className={scss.shortredsquarebtn}
                                    onClick={() => {
                                        setIsEditing(false); // 儲存後結束編輯模式
                                        NewUpdatePurchaserequisitionDetail()

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
                            <span style={{ fontSize: '18px', paddingLeft: '10px' }}>
                                {statusin}
                            </span>
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
                                            caption="採購單號"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: purchaseorderidin || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="申請人員"
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
                                            caption="採購日期"
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
                                        <InputSel
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
                                        />
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

                                    </div>
                                    <div></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="小計"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                // style: { color: 'red' },
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

                            <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                {/* <Thead01 type={'AddPR_ReqList'} /> */}
                                <div className={scss.thead20}>
                                    <span>

                                    </span>
                                    <span>序</span>
                                    <span>料號</span>
                                    <span>品名</span>
                                    <span>規格</span>
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
                                                        <button style={{ display: (statusin === "採購中" && isEditing) ? '' : 'none' }} onClick={() => { handleRemove(index, _item) }}>
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
                            {statusin === "採購中" && isEditing && (
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
                        <div className={scss.body_foot2}>
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
                                審核紀錄
                            </span>
                        </div>
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
                            onClick={() => { sentToReview("審核") }}>
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