import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './addPurchaseOrderList.module.scss';
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
import { Collapse, Modal } from 'antd';
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
import { Panel } from 'components/global/myAntd/collapse';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddPurchaseOrderList() {
    const [pagename, setPagename] = useState<string>("新增採購單")

    //#region ===========【路由參數】
    const router = useRouter();
    const {
    } = router.query;
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
    const [data3, setData3] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [prdata, setPrdata] = useState<any[]>([]);
    const [customerdata, setCustomerdata] = useState<any[]>([]);
    const [prbardata, setPrbarData] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const totalpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const po_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const remaining_quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));

    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    // const [purchaserequisitionid, setPurchaserequisitionid] = useState<string>("");
    // const [purchaserequisitionuuid, setPurchaserequisitionuuid] = useState<string>("");
    const [idin, setidin] = useState<string>("");
    const [uuidin, setuuidin] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
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

    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    // const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);


    // 計算總價
    const [totalprice1, setTotalPrice1] = useState<string>("");
    const [taxprice1, setTaxPrice1] = useState<string>("");
    const [totalpayprice1, setTotalPayPrice1] = useState<string>("");
    //#endregion

    //#region ===========【上方功能列】

    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
    };

    const searchData = async (keyword1: string, keyword2: string, keyword3: string) => {
        try {
            setIsLoading(true);
            // keywordSpec
            const conditionModel: { keyword1: string | undefined, keyword2: string | undefined, keyword3: string | undefined } = {
                keyword1: keyword1 as string | undefined,
                keyword2: keyword2 as string | undefined,
                keyword3: keyword3 as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}/WareHouse/SearchProductById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            setData(data);
            data = _.uniqBy(data, (item: any) => item.whname + item.trayname); // 去重
            setData1(data);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //新增按鈕
    const panelList: TpanelList = [
        {

            type: 'myButton',
            label: '返回',
            onClick: () => {
                myAlert.confirm({
                    title: `確定要返回採購單列表嗎?`,
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
    const hasFetchedData = useRef(false);

    useEffect(() => {
        console.log(userInfo);
        if (!hasFetchedData.current) {
            // getPurchaseRequisition();
            getCustomers();
            getProduct();
            setCreate_atin(moment().format('YYYY-MM-DD') || '');
            setCreate_byin(userInfo?.employee?.chName.toString() || '');
            setNeed_datein(moment().format('YYYY-MM-DD') || '');
            setShippingaddressin("台中市霧峰區峰北路666號");
            getPRequisition();
            hasFetchedData.current = true;
        }
    }, []);

    // useEffect(() => {
    //     setCreate_atin(moment().format('YYYY-MM-DD') || '');
    //     setCreate_byin(userInfo?.employee?.chName.toString() || '');
    //     setNeed_date(moment().format('YYYY-MM-DD') || '');
    // }, []);
    //#endregion

    //#region ===========【API】

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

    //新增單據
    const Add = async () => {
        if (data2.length === 0) {
            myAlert.warning({ title: "採購項目不可為空" })
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
                suppliername: suppliernamein,
                supplierphone: supplierphonein,
                suppliertaxid: suppliertaxidin,
                supplieraddress: supplieraddressin,
                supplierid: supplieridin,
                shippingaddress: shippingaddressin,
                suppliercontact: suppliercontactin,
                supplierfax: supplierfaxin,
                supplieruuid: supplieruuidin,
                data2: data2
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/NewAddPurchaseOrder`, {
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
                setStatusin("編輯中");
                router.push({
                    pathname: `/factoryDepartment/POrderList`,
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

    //取請購(轉採購用)
    const getPRequisition = async () => {
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

            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPRequisitionForAddPOrder?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setData3(responsedata);
            setPrbarData(responsedata);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //#endregion

    //#region ===========【單據功能區】
    const handleAdd = () => {
        Add();
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
        // 更新 data2 的值
        const updatedData2 = [...data2];
        updatedData2[index][key] = value;
        setData2(updatedData2);

        if (key === 'productid' || key === 'name' || key === 'spec') {

            // 更新建議選單的過濾邏輯
            const filters = {
                productid: updatedData2[index].productid?.trim().toLowerCase() || "",
                name: updatedData2[index].name?.trim().toLowerCase() || "",
                spec: updatedData2[index].spec?.trim().toLowerCase() || ""
            };

            if (Object.values(filters).some(filter => filter !== "")) {
                // 過濾符合條件的數據
                const filtered = data.filter(item =>
                    (!filters.productid || item.productid?.toLowerCase().includes(filters.productid)) &&
                    (!filters.name || item.name?.toLowerCase().includes(filters.name)) &&
                    (!filters.spec || item.spec?.toLowerCase().includes(filters.spec))
                );

                setFilteredData(filtered);
                setShowSuggestions(true);
            } else {
                // 若所有條件都為空，隱藏建議選單
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

            console.log(showSuggestions);
            console.log(filtered);
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


    //#region  ===========【請購帶入功能區】
    const [prbar, setPrbar] = useState(false);



    //#endregion


    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            <PageHeader02 tag={pagename} panelList={panelList}
                customeRight={[
                    <>
                        <button
                            className={scss.shortsquarebtn}
                            style={{
                                display: `${status === "未送出" ? '' : 'none'}`
                            }}
                        >
                            編輯
                        </button>
                        <button
                            className={scss.shortredsquarebtn}
                            style={{
                                display: `${status === "" ? '' : 'none'}`
                            }}
                            onClick={() => {
                                // console.log(data2);
                                handleAdd();

                            }}
                        >
                            儲存
                        </button>
                    </>
                ]
                }
                customeLeft={
                    [
                        <>
                            <span style={{ fontSize: '18px', paddingLeft: '10px' }}>
                                {status}
                            </span>
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
                                請購項目
                            </button>
                        </>
                    ]} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
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
                                                    value: idin || ' ',
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
                                            disabled={status === "未送出" ? true : false}
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
                                            caption="採購類別"
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
                                            caption="申請部門"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: userInfo?.employee?.jobs[0].department.name
                                                },
                                            }}
                                        />
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            // disabled={status === "未儲存" ? false : true}
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
                                    <div></div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="廠商名稱"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            // disabled={!isEditing}
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
                                            // disabled={!isEditing}
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
                                            // disabled={!isEditing}
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
                                            // disabled={!isEditing}
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
                                            // disabled={!isEditing}
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
                                            // disabled={!isEditing}
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
                                                // display: `${isEditing ? '' : 'none'}`,
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
                                        請購項目
                                    </span>
                                </div>
                                <div className={scss.head_content1}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="請購數量"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                type: "number",
                                                value: data3.length,
                                            },
                                        }}
                                    />
                                                                        <InputSel
                                        {...inputSelProps}
                                        caption="請購數量"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                type: "number",
                                                value: data3.length,
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px' }}>

                                    <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                        <div className={scss.thead22}>
                                            <span>

                                            </span>
                                            <span>序</span>
                                            <span>請購單號</span>
                                            <span>料號</span>
                                            <span>品名</span>
                                            <span>規格</span>
                                            <span>數量</span>
                                            <span>已採購</span>
                                            <span>剩餘</span>
                                            <span>單位</span>
                                            <span>單價</span>
                                            <span>總價</span>
                                            <span>備註(用途說明)</span>
                                            <span></span>
                                        </div>
                                        {data3 && (
                                            data3.map((_item, index) => {
                                                const Totalprice = parseFloat(_item.quantity) * parseFloat(_item.unitprice);
                                                _item.totalprice = Totalprice;

                                                // 檢查是否已存在於 data2 中
                                                const isChecked = data2.some(item => item.id === _item.id);
                                                const handleCheckboxChange = (checked: any) => {
                                                    console.log(data3);
                                                    console.log(data2);
                                                    if (checked) {
                                                        // 複製 _item 並將剩餘數量取代原本的數量
                                                        const updatedItem = { ..._item, quantity: _item.remaining_quantity };
                                                
                                                        // 加入到 data2
                                                        setData2(prevData2 => [...prevData2, updatedItem]);
                                                    } else {
                                                        // 從 data2 中移除
                                                        setData2(prevData2 => prevData2.filter(item => item.id !== _item.id));
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
                                                            <span>{_item.purchaserequisitionid}</span>
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
                                                                        color:'#ea1833'
                                                                    }}
                                                                    type={'text'}
                                                                    value={_item.po_quantity}
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

                                            })
                                        )}
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
                                採購項目
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
                                                        <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemoveDetail(index, _item) }}>
                                                            {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                            <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                        </button>
                                                    </span>
                                                    <span>{index + 1}</span>
                                                    <span>
                                                        <input
                                                            ref={productidRefs.current[index]}
                                                            // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            value={_item.productid !== undefined ? _item.productid : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            value={_item.name !== undefined ? _item.name : ''}
                                                            // readOnly
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            value={_item.spec !== undefined ? _item.spec : ''}
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            // readOnly
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
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            // maxLength={5}
                                                            value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            // readOnly
                                                            onChange={(e) => {
                                                                // handleNumberChange(index, "quantity", e.target.value);
                                                                handleStringChange(index, "quantity", e.target.value);
                                                            }}
                                                        />
                                                    </span>
                                                    <span>
                                                        <input
                                                            ref={unitRefs.current[index]}
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            value={_item.unit !== undefined ? _item.unit : ''}
                                                            // readOnly
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
                                                                borderBottom: "1px solid black",
                                                                width: '95%',
                                                            }}
                                                            type={'number'}
                                                            value={_item.unitprice !== undefined ? _item.unitprice : ''}
                                                            onChange={(e) => {
                                                                handleStringChange(index, "unitprice", e.target.value);
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
                                                            type={'text'}
                                                            // value={Number(_item.quantity)}
                                                            // value={_item.quantity !== undefined ? _item.quantity : 0}
                                                            value={_item.totalprice.toLocaleString()}
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
                                                            style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                            type="text"
                                                            value={_item.note !== undefined ? _item.note : ''}
                                                            // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                            // readOnly
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
                            <span style={{ paddingLeft: '22px', position: 'relative' }}>
                                <button onClick={() => { handleAddDetail() }} style={{ fontSize: '18px' }} >
                                    <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                                    新增品項
                                </button>
                            </span>

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
                                            // position: 'relative',
                                            position: 'sticky',
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


                    </div>
                </div>

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
            </div>
        </SubLayer >

    )

}