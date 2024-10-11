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
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
//日期
import moment from "moment";
import { Collapse } from "antd";
import { Panel } from "components/global/myAntd/collapse";


export default function AddProdReceipt() {

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
    } = router.query;
    //#endregion

    //#region =============【變數宣告】===============================================================================
    // Loading
    const [isLoading, setIsLoading] = useState(false);

    //登入者資料
    const { userInfo } = useContext(AppContext);

    // 資料列
    const [data, setData] = useState<any[]>([]); // 物料data
    const [bomdata, setBomdata] = useState<any[]>([]); // 物料data
    const [searchdata, setSearchdata] = useState<any[]>([]); // 物料查詢
    const [searchbardata, setSearchBarData] = useState<any[]>([]); // 手key物料查詢
    const [data2, setData2] = useState<any[]>([]); // 進貨明細清單data


    // 查詢變數-物料
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");

    //普通變數
    const [prodreceiptid, setProdreceiptid] = useState<string>("");
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

    //手key輸入
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");
    const [handinputproductid, setHandinputproductid] = useState<string>("");
    const [handinputproductuuid, setHandinputproductuuid] = useState<string>("");
    const [handinputmaterial, setHandinputmaterial] = useState<string>("");
    const [handinputsurface, setHandinputsurface] = useState<string>("");


    //編輯狀態
    const [editmain, setEditmain] = useState<boolean>(false);

    //展開狀態
    const [poopen, setPoopen] = useState<boolean>(false);// 採購清單展開

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

        } else {
            try {
                // setIsLoading(true);
                const conditionModel = {
                    create_at: create_atin,
                    create_by: create_byin,
                    note: note
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
                const data = await response.json();
                myAlert.info(
                    {
                        title: '單據新增成功',
                        content: `進貨單據號碼為:${data[0].prodreceiptid}`
                    })

                setData2([]);
                // setPurchaseorderid(data[0].purchaseorderid);
                // setPurchaseorderuuid(data[0].id);
                setStatus("未送出");
                // getPurchaseOrder();
                
                console.log(data);

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
        // setSuppliernamein("");
        // setSupplierphonein("");
        // setSuppliertaxidin("");
        // setInvoicein("");
        // setSupplieraddressin("");
        // setShippingaddressin("台中市霧峰區峰北路666號");
        setProdreceiptid("儲存後產生");
        setStatus("未儲存");
        setNote("");
        // setData2([]);
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        // setNeed_date(moment().format('YYYY-MM-DD') || '');
        setPoopen(!poopen);
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
                        // AddProdReceipt();
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
        // setOriginaldata2(data2);
        setEditmain(true);
        setPoopen(!poopen);
    };

    const handlecancelAddPR = () => {
        if (editmain === true) {
            setEditmain(false);
            setSuppliernamein(originalSuppliernamein);
            setSupplierphonein(originalSupplierphonein);
            setSuppliertaxidin(originalSuppliertaxidin);
            setInvoicein(originalInvoicein);
            setSupplieraddressin(originalSupplieraddressin);
            // setShippingaddressin(originalShippingaddressin);
            setCreate_atin(originalcreate_atin);
            // setNeed_date(originalneed_date);
            setNote(originalnote);
            // setData2(originaldata2);
            setPoopen(!poopen);
        } else {
            setSuppliernamein("");
            setSupplierphonein("");
            setSuppliertaxidin("");
            setInvoicein("");
            setSupplieraddressin("");
            // setShippingaddressin("");
            setEditmain(false);
            setProdreceiptid("");
            setStatus("");
            // setData2([]);
            setNote("");
            // setNeed_date(moment().toString());
            setPoopen(!poopen);
        }
    }

    // 手key加入
    const handleAddByHandKey = () => {

    }

    //#endregion

    //#region =============【方法邏輯】===============================================================================

    const onChange = (item: any) => {
        // alert(item.purchaseorderid);
    };


    //#region Tab頁籤切換
    //頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("採購單據");
    const [tabshow, setTabshow] = useState<string>("採購單據");
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
                            <button className={scss.squarebtn} onClick={() => { }} title="查尋單據">
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
                        <div></div>
                        <div></div>
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
                                    {/* <InputSel
                                        {...inputSelProps}
                                        caption="廠商名稱"
                                        disabled={(status === "未儲存" || editmain === true) ? false : true}
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
                                        disabled={(status === "未儲存" || editmain === true) ? false : true}
                                        inputProps={{
                                            props: {
                                                value: supplieraddressin ? supplieraddressin : '',
                                                // onChange: (e) => { handleSupplieraddressChange(e) }
                                            },
                                        }}
                                    /> */}
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
                                    {/* <InputSel
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
                                    /> */}
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
                                            // value: data2.length || ' ',
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
                            <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                {/* <span> */}
                                <div>
                                    <Thead01 type={'PurchaseOrderForAddProdReceipt'} />
                                    {data && (
                                        data.map((_item: any, index: number) => (
                                            <CellWithBar key={index} className={scss.panelHeader21}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}> {/* 新增一個容器包住箭頭和其他內容 */}
                                                    <span style={{ paddingLeft: '20px' }}>
                                                        {/* 添加阻止展開的事件 */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // 阻止 Collapse 展開

                                                                if (status === '未送出') {
                                                                    // 當 poopen 為 true 時才執行動作
                                                                    alert(_item.purchaseOrder.purchaseorderid);
                                                                }

                                                                // setPoopen(!poopen); // 切換 poopen 的值
                                                            }}
                                                            disabled={status != '未送出'} // 當 poopen 為 false 時，按鈕禁用
                                                        >
                                                            <img
                                                                src={status === '未送出' ? icon_fc_arrow_down.src : icon_fc_arrow_down_gray.src} // 根據 poopen 狀態顯示不同的圖片
                                                                alt="search"
                                                                style={{ height: '20px', width: '20px' }}
                                                            />
                                                        </button>
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
                                                                    <span>{_item.purchaseOrder.totalprice.toLocaleString()}</span>
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
                                                                            <th>規格</th>
                                                                            {/* <th>已進</th> */}
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
                                                                                <td>{detail.spec}</td>
                                                                                {/* <td>{detail.alreadyinquantity}</td> */}
                                                                                <td>{detail.quantity.toLocaleString()}</td>
                                                                                <td>{detail.unitprice.toLocaleString()}</td>
                                                                                <td>{detail.totalprice.toLocaleString()}</td>
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
                    <div className={scss.head_tab}>
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
                        <div></div>
                    </div>
                    <div className={scss.tabbody}>
                        <div>
                            <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                <Thead01 type={'AddPRe_ReqList'} />
                                {data2 && (
                                    data2.map((_item: any, index: number) => (
                                        <CellWithBar key={index} className={scss.panelHeader14}>
                                            <div className={scss.row01}>
                                                <span></span>
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
            </div>
        </SubLayer >

    )
}


