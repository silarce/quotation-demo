import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './addProdReceipt.module.scss';
import { useContext, useEffect, useRef, useState } from "react";
import { setting } from '../wareHouseList/index';
import { useRouter } from "next/router";
import { content } from "html2canvas/dist/types/css/property-descriptors/content";
import CellWithBar from "components/global/gear/cell/cellWithBar";
import { getTaiwanDateStr } from "js/utils/helpers/date/convertDate";
//grid
import Thead01 from "../ui/table/thead01";
//icon
import icon_search from 'public/image/icon/fc_search.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import InputSel from "components/global/gear/inputAndSel_v2/inputSel";
import { inputSelProps } from "components/page/worksDepartment/ui/wrapper_inpuSel_01";
import icon_fc_add from 'public/image/icon/fc_add.svg';
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import { AppContext } from "pages/_app";
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_save_gray from 'public/image/icon/fc_save_gray.svg';
import icon_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_add from 'public/image/icon/fc_add2.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';

//日期
import moment, { Moment } from "moment";
import { Checkbox, Collapse } from "antd";
import { Panel } from "components/global/myAntd/collapse";
import DragableModal from "components/global/gear/dragableModal/dragableModal";
import Tbody01 from "../ui/table/tbody01";


export default function AddProdReceipt() {

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
    } = router.query;
    //#endregion

    //#region =============【變數宣告】===============================================================================
    // Loading
    const [isLoading, setIsLoading] = useState(false);

    // 登入者資料
    const { userInfo } = useContext(AppContext);

    // 資料列
    const [data, setData] = useState<any[]>([]); // 物料data
    const [bomdata, setBomdata] = useState<any[]>([]); // 物料data
    const [searchdata, setSearchdata] = useState<any[]>([]); // 物料查詢
    const [searchbardata, setSearchBarData] = useState<any[]>([]); // 手key物料查詢
    const [data2, setData2] = useState<any[]>([]); // 進貨明細清單data
    const [data3, setData3] = useState<any[]>([]); // 進貨清單data
    const [data4, setData4] = useState<any[]>([]); // 進貨清單的採購data


    // 搜尋
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



    // 普通變數
    const [prodreceiptid, setProdreceiptid] = useState<string>("");
    const [prodreceiptuuid, setProdreceiptuuid] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [supplieridin, setSupplieridin] = useState<string>("");
    const [supplierfaxin, setSupplierfaxin] = useState<string>("");
    const [suppliercontactin, setSuppliercontactin] = useState<string>("");
    //紀錄進貨單回壓採購單
    const [receiptid, setReceiptidin] = useState<string>("");
    const [purchaseorderid, setPurchaseorderid] = useState<string>("");
    const [pocreate_by, setPocreate_by] = useState<string>("");
    const [pocreate_at, setPocreate_at] = useState<string>("");

    // 手key輸入
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");
    const [handinputproductid, setHandinputproductid] = useState<string>("");
    const [handinputproductuuid, setHandinputproductuuid] = useState<string>("");
    const [handinputmaterial, setHandinputmaterial] = useState<string>("");
    const [handinputsurface, setHandinputsurface] = useState<string>("");


    // 編輯狀態
    const [editmain, setEditmain] = useState<boolean>(false);

    // 展開狀態
    const [poopen, setPoopen] = useState<boolean>(false);// 採購清單展開
    // 進貨單查詢
    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }

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


    //#endregion

    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            //取進貨單
            getProdReceipt();
            //取得已核准的採購單
            GetPurchaseOrderForAddProdReceipt();
            setCreate_atin(moment().format('YYYY-MM-DD') || '');
            setCreate_byin(userInfo?.username.toString() || '');
            // setNeed_date(moment().format('YYYY-MM-DD') || '');
            hasFetchedData.current = true;
        }
    }, []);

    //#endregion

    //#region =============【上功能列】===============================================================================
    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '料號',
        },
        {
            placeholder: '名稱',
        },
        {
            placeholder: '規格',
        },
    ];
    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {

    };

    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const arrkeyword2 = arr[0] as string;
            const arrkeyword3 = arr[1] as string;
            const arrkeyword4 = arr[2] as string;
            setKeyword2(arrkeyword2);
            setKeyword3(arrkeyword3);
            setKeyword4(arrkeyword4);
        },
    };
    //新增按鈕
    const panelList: TpanelList = [
        // { searchGroup },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                myAlert.confirm({
                    title: '確定要返回進貨管理嗎?',
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

    //#region =============【  API  】===============================================================================

    const GetPurchaseOrderForAddProdReceipt = async () => {
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
            const response = await fetch(`${setting.apipath}/WareHouse/GetPurchaseOrderForAddProdReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setData(responsedata);

            console.log(responsedata);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const AddProdReceipt = async () => {
        if (editmain === true) {
            try {
                setIsLoading(true);
                const conditionModel = {
                    purchaseorderid: purchaseorderid,
                    prodreceiptuuid: prodreceiptuuid,
                    create_at: create_atin,
                    // need_date: moment(need_date).format('YYYY-MM-DD'),
                    create_by: create_byin,
                    note: note,
                    suppliername: suppliernamein,
                    supplierphone: supplierphonein,
                    suppliertaxid: suppliertaxidin,
                    supplieraddress: supplieraddressin,
                    supplierid: supplieridin,
                    supplierfax: supplierfaxin,
                    suppliercontact: suppliercontactin,
                    // shippingaddress: shippingaddressin,
                    data2: data2
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/UpdateAddProdReceipt`, {
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

                getProdReceipt();
                getProdReceiptDetail(prodreceiptuuid);
                setEditmain(false);
                GetPurchaseOrderForAddProdReceipt();

            } catch (error: any) {
                // setError(error.message);
                console.error(error.message)
            }
            finally {
                setIsLoading(false);
            }
        } else {
            console.log(data2);
            console.log(purchaseorderid);
            // return;
            try {
                // setIsLoading(true);
                const conditionModel = {
                    create_at: create_atin,
                    create_by: create_byin,
                    note: note,
                    data2: data2,
                    username: userInfo?.username,
                    purchaseorderid: purchaseorderid
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/WareHouse/AddProdReceipt`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputModel)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const responsedata = await response.json();

                console.log(responsedata);

                myAlert.info(
                    {
                        title: '單據新增成功',
                        content: `進貨單據號碼為:${responsedata.prodreceiptid}`
                    })

                setData2([]);
                setProdreceiptid(responsedata.prodreceiptid);
                setProdreceiptuuid(responsedata.id);
                setStatus("未送出");
                getProdReceipt();
                getProdReceiptDetail(responsedata.id);
                GetPurchaseOrderForAddProdReceipt();
                // getPurchaseOrder();
                // getProduct();
                // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

            } catch (error: any) {
                // setError(error.message);
                console.log(error.message);
            }
            finally {
                // setIsLoading(false);
            }
        }
    }

    const getProdReceipt = async () => {
        try {
            // alert(checkfirstin);
            // setIsLoading(true);
            const conditionModel = {
                type: '未送出',
                username: userInfo?.username
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

            const responsedata = await response.json();
            console.log(responsedata);

            setData3(responsedata);
            setSearchdata(responsedata);
            // console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //取對應的進貨明細
    const getProdReceiptDetail = async (prodreceiptuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel = {
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
            const responsedata = await response.json();
            setData2(responsedata);

            // 第一步：去重 responsedata 中的 purchaseorderid
            const uniquePurchaseorderIds = responsedata
                .filter((item: any, index: any, self: any[]) =>
                    index === self.findIndex((t) => t.purchaseorderid === item.purchaseorderid)
                )
                .map((item: any) => item.purchaseorderid); // 只留下去重後的 purchaseorderid
            console.log(uniquePurchaseorderIds);
            // 第二步：過濾 data 中與去重的 purchaseorderid 相匹配的項目
            const filteredData = data.filter(item =>
                uniquePurchaseorderIds.includes(item.purchaseOrder.purchaseorderid.toString().trim())
            );


            // Step 3: 將篩選後的結果傳給 data4
            setData4(filteredData);

            console.log(filteredData);

            // Step 4: 更新 checkedItems 狀態，讓篩選出的項目對應 checkbox 被勾選
            const updatedCheckedItems = filteredData.reduce((acc: any, currentItem: any) => {
                const purchaseOrderId = currentItem.purchaseOrder.purchaseorderid.toString().trim();
                return {
                    ...acc,
                    [purchaseOrderId]: true // 將對應的 purchaseOrder.purchaseorderid 設置為 true 表示已勾選
                };
            }, {});

            // Step 5: 使用 setCheckedItems 更新勾選狀態
            setCheckedItems(prevCheckedItems => ({
                ...prevCheckedItems,
                ...updatedCheckedItems // 合併新勾選的項目
            }));

            console.log("Checked Items:", updatedCheckedItems);


            // console.log(data);
            // let totalprice = 0;
            // data.forEach((element: { totalprice: any; }) => {
            //     totalprice += element.totalprice;
            // });
            // setTotalPrice(totalprice.toLocaleString());
            // const taxPrice = Math.round(totalprice * 0.05);
            // setTaxPrice(taxPrice.toLocaleString());
            // const totalPayPrice = totalprice + taxPrice;
            // setTotalPayPrice(totalPayPrice.toLocaleString());

            // 進貨進度
            // let totalentry = data.length; // 總數量
            // let completeentry = 0; // 完成數量

            // data.forEach((element: any) => {
            //     // 將 alreadyinquantity 和 quantity 轉換為整數
            //     const alreadyInQuantity = parseInt(element.alreadyinquantity, 10);
            //     const quantity = parseInt(element.quantity, 10);

            //     if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity >= quantity) {
            //         completeentry += 1;
            //     }
            // });
            // setTotalentry(totalentry);
            // setCompleteentry(completeentry);



        } catch (error: any) {
            console.error("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //#endregion

    //#region =============【方法入口】===============================================================================


    //#region 點擊focus
    //畫面上被點擊的選項背景顏色改變
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };
    //#endregion

    //新增單據
    const handlePreAdd = () => {
        setCreate_byin(userInfo?.username as string);
        setSuppliernamein("");
        setSupplierphonein("");
        setSuppliertaxidin("");
        setPurchaseorderid('');
        // setInvoicein("");
        setSupplieraddressin("");
        // setShippingaddressin("台中市霧峰區峰北路666號");
        setProdreceiptid("儲存後產生");
        setStatus("未儲存");
        setNote("");
        setData2([]);
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        // setNeed_date(moment().format('YYYY-MM-DD') || '');
        setPoopen(!poopen);
        setCheckedItems({});
    }

    const handleAdd = () => {
        if (editmain === true) {
            myAlert.confirm({
                title: '確定要修改單據嗎?',
                content: <>
                    <h1>請檢查資料是否填寫完整</h1>
                </>,
                props: {
                    onOk: async () => {
                        AddProdReceipt();
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
                        AddProdReceipt();

                    }
                }
            })
        }
    }

    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalSuppliernamein(suppliernamein);
        setOriginalSupplierphonein(supplierphonein);
        setOriginalSuppliertaxidin(suppliertaxidin);
        setOriginalInvoicein(invoicein);
        setOriginalSupplieraddressin(supplieraddressin);
        setOriginalcreate_atin(create_atin);
        setOriginalnote(note);
        setOriginaldata2(data2);
        setEditmain(true);
        setPoopen(!poopen);
        setOriginalCheckedItems(checkedItems);
    };

    const handlecancelAddPR = () => {
        // 取消所有 checkbox 的勾選
        setCheckedItems({}); // 將所有勾選狀態重置為 false

        if (editmain === true) {
            setEditmain(false);
            setSuppliernamein(originalSuppliernamein);
            setSupplierphonein(originalSupplierphonein);
            setSuppliertaxidin(originalSuppliertaxidin);
            setInvoicein(originalInvoicein);
            setSupplieraddressin(originalSupplieraddressin);
            setCreate_atin(originalcreate_atin);
            setNote(originalnote);
            setPoopen(!poopen);
            setData2(originaldata2);
            setCheckedItems(OriginalcheckedItems);
        } else {
            setSuppliernamein("");
            setSupplierphonein("");
            setSuppliertaxidin("");
            setInvoicein("");
            setSupplieraddressin("");
            setEditmain(false);
            setProdreceiptid("");
            setStatus("");
            setNote("");
            setPoopen(!poopen);
            setData2([]);
            setCheckedItems({});
        }
    };


    // 手key加入
    const handleAddByHandKey = () => {

    }

    const handleChangeChose = (item: any) => {

        console.log(item);
        handleRowClick(item.prodreceiptid);
        setData2([]);
        setProdreceiptid(item.prodreceiptid);
        setProdreceiptuuid(item.prodreceiptuuid);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setPurchaseorderid(item.purchaseorderid);

        // setNeed_date(item.need_date);
        setSuppliernamein(item.suppliername);
        setSupplierphonein(item.supplierphone);
        setSuppliertaxidin(item.suppliertaxid);
        setSupplieraddressin(item.supplieraddress);
        setSuppliercontactin(item.suppliercontact);
        setSupplierfaxin(item.supplierfax);
        // setShippingaddressin(item.shippingaddress);
        // setNeed_date(item.need_date);
        setCreate_byin(item.create_by);
        // getPurchaseOrderDetail(item.purchaseorderuuid);
        getProdReceiptDetail(item.prodreceiptuuid);
        setCheckedItems({}); // 將所有勾選狀態重置為 false
    }

    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
    const [OriginalcheckedItems, setOriginalCheckedItems] = useState<{ [key: string]: boolean }>({});

    const handleToggleProdreceiptdetail = async (item: any, isChecked: boolean) => {
        // console.log(item);
        setSuppliercontactin(item.purchaseOrder.suppliercontact);
        setSupplierfaxin(item.purchaseOrder.supplierfax);

        // 確保 purchaseorderid 是字串並進行初始化
        const currentPurchaseOrderStr = purchaseorderid?.toString() || '';

        // 將現有的 purchaseorderid 拆分成陣列
        let purchaseOrderArray = currentPurchaseOrderStr
            ? currentPurchaseOrderStr.split(',').map((po: any) => po.trim()).filter((po: any) => po)
            : [];

        const newPurchaseOrderId = item.purchaseOrder.purchaseorderid?.toString().trim();

        if (isChecked && newPurchaseOrderId) {
            // 如果是勾選狀態且該 id 不存在於陣列中，則新增
            if (!purchaseOrderArray.includes(newPurchaseOrderId)) {
                purchaseOrderArray.push(newPurchaseOrderId);
            }
        } else if (!isChecked && newPurchaseOrderId) {
            // 如果是取消勾選狀態且該 id 存在於陣列中，則移除
            purchaseOrderArray = purchaseOrderArray.filter(po => po !== newPurchaseOrderId);
        }

        // 將陣列轉回字串，並存入 state 中
        setPurchaseorderid(purchaseOrderArray.join(','));


        const currentPocreate_atStr = pocreate_at?.toString() || '';

        // 將現有的 purchaseorderid 拆分成陣列
        let pocreate_atArray = currentPocreate_atStr
            ? currentPocreate_atStr.split(',').map((po: any) => po.trim()).filter((po: any) => po)
            : [];

        const newPocreate_at = item.purchaseOrder.create_at?.toString().trim();

        if (isChecked && newPocreate_at) {
            // 如果是勾選狀態且該 id 不存在於陣列中，則新增
            if (!pocreate_atArray.includes(newPocreate_at)) {
                pocreate_atArray.push(newPocreate_at);
            }
        } else if (!isChecked && newPocreate_at) {
            // 如果是取消勾選狀態且該 id 存在於陣列中，則移除
            pocreate_atArray = pocreate_atArray.filter(po => po !== newPocreate_at);
        }
        setPocreate_at(pocreate_atArray.join(','));




        if (suppliernamein === '' || suppliernamein === null || suppliernamein === undefined || suppliernamein === item.purchaseOrder.suppliername) {
            setSuppliernamein(item.purchaseOrder.suppliername);
            setSupplieraddressin(item.purchaseOrder.supplieraddress);
            setSupplierphonein(item.purchaseOrder.supplierphone);
            setSuppliertaxidin(item.purchaseOrder.suppliertaxid);
            if (status === "未儲存") {
                if (isChecked) {
                    // 如果勾選 checkbox，將新的 item 加入 data2
                    setData2(prevData2 => {
                        const newDetails = item.details.filter((detail: any) =>
                            !prevData2.some(existingDetail => existingDetail.id === detail.id)
                        );
                        return [...prevData2, ...newDetails];
                    });
                } else {
                    // 如果取消勾選 checkbox，根據 id 從 data2 中移除對應的項目
                    setData2(prevData2 => {
                        const updatedData2 = prevData2.filter((existingDetail: any) =>
                            !item.details.some((detail: any) => detail.id === existingDetail.id)
                        );
                        if (updatedData2.length === 0) {
                            setSuppliernamein(''); // 只有當更新後的 data2 為空時，才設為 ''
                        }
                        return updatedData2;
                    });
                }
            } else {
                if (isChecked) {
                    // 如果勾選 checkbox，將新的 item 加入 data2
                    setData2(prevData2 => {
                        const newDetails = item.details.filter((detail: any) =>
                            !prevData2.some(existingDetail => existingDetail.purchaseorderid === detail.purchaseorderid)
                        );
                        return [...prevData2, ...newDetails];
                    });
                } else {
                    // 如果取消勾選 checkbox，根據 id 從 data2 中移除對應的項目
                    setData2(prevData2 => {
                        const updatedData2 = prevData2.filter((existingDetail: any) =>
                            !item.details.some((detail: any) =>
                                detail.purchaseorderid === existingDetail.purchaseorderid &&
                                detail.name === existingDetail.name &&
                                detail.spec === existingDetail.spec
                            )
                        );
                        if (updatedData2.length === 0) {
                            setSuppliernamein(''); // 只有當更新後的 data2 為空時，才設為 ''
                            setSupplieraddressin('');
                            setSupplierphonein('');
                            setSuppliertaxidin('');
                        }
                        return updatedData2;
                    });
                }
            }


            // 更新勾選狀態
            setCheckedItems(prevCheckedItems => ({
                ...prevCheckedItems,
                [item.purchaseOrder.purchaseorderid]: isChecked
            }));





        } else {
            // 非同一廠商，取消 checkbox 的選中狀態
            setCheckedItems(prevCheckedItems => ({
                ...prevCheckedItems,
                [item.purchaseOrder.purchaseorderid]: false
            }));
            myAlert.warning({ title: '非同一間廠商' });
        }
    };

    // useEffect(() => {
    //     console.log(data2.length); // 使用 console.log 來查看長度
    //     if (data2.length === 0) {
    //         alert("true");
    //         setSuppliernamein('');
    //         setSupplieraddressin('');
    //         setSupplierphonein('');
    //         setSuppliertaxidin('');
    //     }
    // }, [data2]);

    const handleDelete = async () => {
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
                            id: prodreceiptuuid
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                        const response = await fetch(`${setting.apipath}/WareHouse/DeleteProdReceipt?${queryParams}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const responseData = await response.text();

                        myAlert.success({ title: '刪除成功' });

                        getProdReceipt();
                        setData2([]);
                        setCheckedItems({});
                        setProdreceiptid('');
                        setSuppliernamein('');
                        setSupplieraddressin('');
                        setSupplierphonein('');
                        setSuppliertaxidin('');
                        setSuppliercontactin('');
                        setSupplierfaxin('');
                        setStatus('');
                        setNote('');
                        setPurchaseorderid('')
                        setPocreate_at('');//目前沒用
                        setPocreate_by('');//目前沒用



                    } catch (error: any) {
                        console.error(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }

                }
            }
        })



    }

    const handlesent = async () => {
        // console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                prodreceiptid: prodreceiptid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/SentProdReceipt`, {
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

            getProdReceipt();
            setData2([]);
            setCheckedItems({});
            setProdreceiptid('');
            setSuppliernamein('');
            setSupplieraddressin('');
            setSupplierphonein('');
            setSuppliertaxidin('');
            setSuppliercontactin('');
            setSupplierfaxin('');
            setStatus('');
            setNote('');
            setPurchaseorderid('')
            setPocreate_at('');//目前沒用
            setPocreate_by('');//目前沒用
            GetPurchaseOrderForAddProdReceipt();

        } catch (error: any) {
            // setError(error.message);
            console.error(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //#endregion

    //#region =============【方法邏輯】===============================================================================

    const onChange = (item: any) => {
        // alert(item.purchaseorderid);
    };


    //#region Tab頁籤切換
    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("單據明細");
    const [tabshow, setTabshow] = useState<string>("單據明細");
    const [tabnow2, setTabnow2] = useState<string>("單據明細");
    const [tabshow2, setTabshow2] = useState<string>("單據明細");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        // return tabnow === tabName ? { color: '#14256a', borderColor: '#c1c1c1', backgroundColor: 'white', borderBottom: '0px' } : {};
        return tabnow === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName);
        setTabshow(tabName);
    };

    // 2
    const getButtonStyle2 = (tabName: string) => {
        // return tabnow === tabName ? { color: '#14256a', borderColor: '#c1c1c1', backgroundColor: 'white', borderBottom: '0px' } : {};
        return tabnow2 === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed2 = (tabName: string) => {
        setTabnow2(tabName);
        setTabshow2(tabName);
    };

    //#endregion



    //#region 進貨單查詢
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
            setSearchdata(data3);
            return;
        }

        // 過濾資料
        let filteredData = data3.filter(item => {
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
    //#endregion



    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'新增進貨單'} panelList={panelList}
                customeLeft={[

                ]} />
            <div className={scss.body}>
                <div className={scss.content}>
                    <div className={scss.head_head1}>
                        <div>
                            <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                查詢
                            </button>
                            &nbsp;
                            {/* <button className={scss.squarebtn} onClick={() => { setPoopen(!poopen) }} title="查尋單據">
                                <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                採購
                            </button> */}
                        </div>
                        <div>
                            <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlePreAdd() }} title="新增單據">
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
                            <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.squarebtn} onClick={() => { handleDelete() }} title="單據刪除">
                                <img src={icon_delete.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                刪除
                            </button>
                        </div>
                        <div>
                            <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.squarebtn} onClick={() => { handlesent() }} title="單據申請">
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
                                        caption="進貨單號"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: prodreceiptid || ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    <InputSel
                                        caption="進貨日期"
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
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="進貨人員"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: create_byin || '',
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
                                        disabled={(status === "未儲存" || editmain === true) ? true : true}
                                        inputProps={{
                                            props: {
                                                value: suppliernamein ? suppliernamein : '',
                                                // onChange: (e) => { handleSuppliernameChange(e) }
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="廠商地址"
                                        disabled={(status === "未儲存" || editmain === true) ? true : true}
                                        inputProps={{
                                            props: {
                                                value: supplieraddressin ? supplieraddressin : '',
                                                // onChange: (e) => { handleSupplieraddressChange(e) }
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
                                </div>
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="聯絡電話"
                                        disabled={(status === "未儲存" || editmain === true) ? true : true}
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
                                        disabled={(status === "未儲存" || editmain === true) ? true : true}
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
                                </div>
                                <div>
                                    {purchaseorderid}
                                    <br />
                                    {suppliercontactin}
                                    <br />
                                    {supplierfaxin}
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
                                <button
                                    className={scss.detailminitabbtn}
                                    onClick={() => tabChosed('採購單據')}
                                    style={getButtonStyle('採購單據')}
                                >
                                    採購單據
                                </button>

                            </span>
                            <span>
                            </span>
                        </div>
                        <div></div>
                    </div>
                    <div className={scss.tabbody}>
                        <div>
                            <div style={{ display: `${tabshow === "單據明細" ? '' : 'none'}` }}>
                                <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                    {/* <Thead01 type={'AddPRe_ReqList2'} />
                                    {data4 && (
                                        data4.map((_item: any, index: number) => (
                                            <CellWithBar key={index} className={scss.panelHeader15}>
                                                <div className={scss.row01}>
                                                    <span>
                                                        <button onClick={() => { handledele(_item) }}>
                                                            <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                        </button>
                                                    </span>
                                                    <span>{index + 1}</span>
                                                    <span>{_item.purchaseOrder.purchaseorderid}</span>
                                                    <span>{_item.purchaseOrder.suppliername}</span>
                                                    <span>{_item.purchaseOrder.totalprice}</span>
                                                    <span>{_item.purchaseOrder.note}</span>
                                                </div>
                                            </CellWithBar>
                                        ))
                                    )} */}
                                    <Thead01 type={'AddPRe_ReqList'} />
                                    {data2 && (
                                        data2.map((_item: any, index: number) => (
                                            <CellWithBar key={index} className={scss.panelHeader14}>
                                                <div className={scss.row01}>
                                                    <span>
                                                        {/* <button onClick={() => { alert(_item) }}>
                                                            <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                        </button> */}
                                                    </span>
                                                    <span>{index + 1}</span>
                                                    <span>{_item.purchaseorderid}</span>
                                                    <span>{_item.productid}</span>
                                                    <span>{_item.name}</span>
                                                    <span>{_item.spec}</span>
                                                    <span>{_item.quantity?.toLocaleString()}</span>
                                                    <span>{_item.unit}</span>
                                                    <span>{_item.unitprice?.toLocaleString()}</span>
                                                    <span>{_item.totalprice?.toLocaleString()}</span>
                                                    <span className="truncate" title={_item.note}>{_item.note}</span>
                                                </div>
                                            </CellWithBar>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div style={{ display: `${tabshow === "採購單據" ? '' : 'none'}` }}>
                                <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                    {/* <span> */}
                                    <div>
                                        <Thead01 type={'PurchaseOrderForAddProdReceipt'} />
                                        {data && (
                                            data.map((_item: any, index: number) => (
                                                <CellWithBar key={index} className={scss.panelHeader21}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}> {/* 新增一個容器包住箭頭和其他內容 */}
                                                        <span style={{ paddingLeft: '20px' }}>
                                                            <input
                                                                type="checkbox"
                                                                // checked={checkedItems[_item.purchaseOrder.purchaseorderid] || false} // 使用狀態來控制 checkbox 是否勾選
                                                                checked={
                                                                    checkedItems[_item.purchaseOrder.purchaseorderid] ||
                                                                    data2.some(detail => detail.purchaseorderid === _item.purchaseOrder.purchaseorderid)
                                                                }
                                                                onChange={(e) => handleToggleProdreceiptdetail(_item, e.target.checked)}
                                                                disabled={!(status === "未儲存" || (status === "未送出" && editmain === true))} // 當不是這兩個條件時禁用 checkbox
                                                                style={{
                                                                    transform: 'scale(1.5)', // 調整比例，1.5 表示比原來大 50%
                                                                    margin: '10px', // 增加 margin 讓 checkbox 有更大的空間
                                                                }}
                                                            />
                                                            {/* <button onClick={() => { handleToggleProdreceiptdetail(_item, e.target.checked) }}>
                                                                <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                            </button> */}




                                                        </span>
                                                        <Collapse defaultActiveKey={[]} onChange={() => onChange(_item)} className={scss.customCollapse} >
                                                            <Panel
                                                                style={{ backgroundColor: 'transparent', border: '0' }}
                                                                key="1"
                                                                showArrow={false}
                                                                header={(
                                                                    <div
                                                                        key={index}
                                                                        className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                                                    >
                                                                        <span>{index + 1}</span>
                                                                        <span>{_item.purchaseOrder.purchaseorderid}</span>
                                                                        <span>{_item.purchaseOrder.suppliername}</span>
                                                                        <span>{getTaiwanDateStr(_item.purchaseOrder.create_at)}</span>
                                                                        <span>{_item.purchaseOrder.totalprice?.toLocaleString()}</span>
                                                                        <span>{_item.purchaseOrder.create_by}</span>
                                                                        <span>{_item.purchaseOrder.status}</span>
                                                                        <span>{_item.purchaseOrder.note}</span>
                                                                        <span></span>
                                                                    </div>
                                                                )}
                                                            >
                                                                <div>
                                                                    <table className={scss.detailTable}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: '50px' }}>序</th>
                                                                                <th style={{ width: '100px' }}>料號</th>
                                                                                <th style={{ width: '300px' }}>名稱</th>
                                                                                <th style={{ width: '400px' }}>規格</th>
                                                                                <th>已進</th>
                                                                                <th>數量</th>
                                                                                <th>單價</th>
                                                                                <th>金額</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {_item.details.map((detail: any, detailIndex: number) => (
                                                                                <tr key={detailIndex}>
                                                                                    <td style={{ width: '50px' }}>{detailIndex + 1}</td>
                                                                                    <td style={{ width: '100px' }}>{detail.productid}</td>
                                                                                    <td style={{ width: '300px' }}>{detail.name}</td>
                                                                                    <td style={{ width: '400px' }}>{detail.spec}</td>
                                                                                    <td style={{color:'#ea1833'}}>{detail.alreadyinquantity}</td>
                                                                                    <td>{detail.quantity?.toLocaleString()}</td>
                                                                                    <td>{detail.unitprice?.toLocaleString()}</td>
                                                                                    <td>{detail.totalprice?.toLocaleString()}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </Panel>
                                                        </Collapse>
                                                    </div>
                                                </CellWithBar>
                                            ))
                                        )}
                                    </div>
                                    {/* </span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={scss.head_tab}>
                        <div>
                            <span>
                                <button
                                    className={scss.detailminitabbtn}
                                    onClick={() => tabChosed2('單據明細')}
                                    style={getButtonStyle2('單據明細')}
                                >
                                    單據明細
                                </button>
                            </span>
                            <span></span>
                        </div>
                        <div>{data2.length.toString()}</div>
                    </div> */}
                    {/* <div className={scss.tabbody}>
                        <div>

                        </div>
                    </div> */}
                    <div className={scss.body_foot1}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>


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
                            {searchdata && (
                                searchdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader12}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.prodreceiptid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { handleChangeChose(_item) }}>
                                            <span>{index + 1}</span>
                                            <span>{_item.prodreceiptid}</span>
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


            </div>
        </SubLayer >

    )
}


