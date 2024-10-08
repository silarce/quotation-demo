import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './bomList.module.scss';
import { createRef, useContext, useEffect, useRef, useState } from "react";
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


export default function BomList() {

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


    // 查詢變數-物料
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");

    //普通變數
    const [productid, setProductid] = useState<string>("");
    const [productname, setProductname] = useState<string>("");
    const [productspec, setProductspec] = useState<string>("");
    const [productmaterial, setProductmaterial] = useState<string>("");
    const [productsurface, setProductsurface] = useState<string>("");
    const [parent_product, setParent_product] = useState<string>("");

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


    //#endregion

    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            //取得所有物料
            GetProduct();

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
        { searchGroup },
    ];


    //#endregion

    //#region =============【  API  】===============================================================================

    const GetProduct = async () => {
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
            const responsedata = await response.json();

            setData(responsedata);
            setSearchdata(responsedata);
            setFilteredData(responsedata);
            setSearchBarData(responsedata);

            console.log(responsedata);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const GetBom = async (parentid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                parent_product: parentid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetBom?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setBomdata(responsedata);
            console.log(responsedata);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };
    const RemoveBomDetail = async (id: any) => {
        try {
            // setIsLoading(true);
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

            const response = await fetch(`${setting.apipath}/WareHouse/RemoveBomDetail?${queryParams}`);
            if (!response.ok) {
                myAlert.err({ title: 'BOM_handleRemove', content: `API Status: ${response.status}` });
                return;
            }

            // 解析 API 響應
            const result = await response.json(); // 解析為 JSON 格式

            // 根據 API 回應處理結果
            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: '成功', content: result.message });
                // setEdithandkey(!edithandkey);
                GetBom(parent_product); // 更新狀態或刷新數據
            } else {
                // 失敗，顯示錯誤提示
                myAlert.warning({ title: '失敗', content: "移除失敗" });
            }




            GetBom(parent_product);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    }
    const UpdateBomDetail = async (item: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                data:item,
                username:userInfo?.username,
                id: item.id
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };
            
            const response = await fetch(`${setting.apipath}/WareHouse/UpdateBomDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });
            
            
            
            if (!response.ok) {
                myAlert.err({ title: 'BOM_handleUpdate', content: `API Status: ${response.status}` });
                return;
            }

            // 解析 API 響應
            const result = await response.json(); // 解析為 JSON 格式

            // 根據 API 回應處理結果
            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: '成功', content: result.message });
                // setEdithandkey(!edithandkey);
                GetBom(parent_product); // 更新狀態或刷新數據
            } else {
                // 失敗，顯示錯誤提示
                myAlert.warning({ title: '失敗', content: "更新失敗" });
            }




            GetBom(parent_product);

            setEditlist(false);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    }

    //#endregion

    //#region =============【方法入口】===============================================================================
    //#region  點擊物料
    const handleChoseProduct = (item: any) => {
        if (edithandkey) {
            console.log(item);
            setHandinputproductuuid(item.id);
            setHandinputproductid(item.productid);
            setHandinputname(item.name);
            setHandinputspec(item.spec);
            setHandinputmaterial(item.material);
            setHandinputsurface(item.surface);
            setHandinputunit(item.unit);
            // GetBom(item.id);
        } else {
            // alert(item.name);
            handleRowClick(item.id);
            setProductid(item.productid);
            setProductname(item.name);
            setProductspec(item.spec);
            setProductmaterial(item.material);
            setProductsurface(item.surface);
            setParent_product(item.id);
            GetBom(item.id);
        }

    }

    //#region 點擊物料focus
    //畫面上被點擊的選項背景顏色改變
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    //#endregion

    // 清除查詢條件
    const handleClear = () => {
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');

    }

    //#endregion

    //#region 手key

    // 手key編輯狀態
    const [edithandkey, setEdithandkey] = useState<boolean>(false);
    const handleEditByHandKey = async () => {
        setEdithandkey(!edithandkey);
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputmaterial('');
        setHandinputsurface('');
        setHandinputunit('');
        setHandinputnote('');
        setHandinputquantity('');
    };

    //手key加入
    const handleAddByHandKey = async () => {
        if (handinputproductid === '' || handinputname === '') {
            myAlert.warning({ title: '料號與名稱不可為空' });
            return;
        } else if (handinputquantity === '' || handinputquantity === undefined) {
            myAlert.warning({ title: '請確認數量是否正確' });
            return;
        }

        try {
            const data = {
                parent_product: parent_product,
                productid: handinputproductid,
                quantity: handinputquantity,
                unit: handinputunit,
                spec: handinputspec,
                create_by: userInfo?.username,
            };

            const conditionModel = {
                data: data
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // 發送數據到 API
            const response = await fetch(`${setting.apipath}/WareHouse/AddBomDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
                myAlert.err({ title: 'BOM_handleAdd', content: `API Status: ${response.status}` });
                return;
            }

            // 解析 API 響應
            const result = await response.json(); // 解析為 JSON 格式

            // 根據 API 回應處理結果
            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: '成功', content: result.message });
                // setEdithandkey(!edithandkey);
                GetBom(parent_product); // 更新狀態或刷新數據
            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }

            setEdithandkey(false);
            console.log(result);
        } catch (error: any) {
            // 顯示錯誤信息
            myAlert.err({ title: 'FunctionError', content: error.message });
        }
    };


    //手key清除
    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputmaterial('');
        setHandinputsurface('');
        setHandinputunit('');
        setHandinputnote('');
        setHandinputquantity('');
        // setShowSuggestions(false);
    }

    interface DataItem {
        id: string | null;
        productid: string | null;
        spec: string | null;
        name: string | null;
        unit: string | null;
    }


    const [filteredData2, setFilteredData2] = useState<any[]>([]);
    const [showSuggestions2, setShowSuggestions2] = useState(false);
    const isSelectingRef2 = useRef(false);


    useEffect(() => {
        if (isSelectingRef2.current) return;

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

            setFilteredData2(filtered);
            setShowSuggestions2(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));

        }
        else {
            setHandinputproductuuid('');
            setFilteredData2([]);
            setShowSuggestions2(false);
        }


    }, [handinputproductid, handinputname, handinputspec]);

    const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputproductid(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputname(e.target.value);
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputspec(e.target.value);
    };

    const handleSelect = (item: DataItem) => {
        isSelectingRef.current = true;
        setHandinputproductuuid(item.id || "");
        setHandinputproductid(item.productid || "");
        setHandinputname(item.name || "");
        setHandinputspec(item.spec || "");
        setHandinputunit(item.unit || "");
        setShowSuggestions2(false);
    };



    // 手Key物料查詢
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


    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
    const quantityRefs = useRef(bomdata.map(() => createRef<HTMLInputElement>()));
    // 組件編輯
    const handleEdit = async (index: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '組件編輯中，請先結束編輯狀態' })
            return;
        }
        setOriginaleditlistdata(bomdata);
        setEditlist(!editlist);
        setEditlistindex(index);
    };
    // 組件取消編輯
    const handleCancel = async (index: any) => {
        setEditlist(!editlist);
        setBomdata(originaleditlistdata);
    };

    // 從組件清單移除
    const handleRemove = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定要將組件移除嗎?',
            props: {
                onOk: () => {
                    const updatedData = bomdata.filter((_, i) => i !== index);
                    setBomdata(updatedData);
                    RemoveBomDetail(item.id);
                }
            }
        });
    };
    // 更新組件清單
    const handleUpdate = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定更新嗎?',
            props: {
                onOk: () => {
                    UpdateBomDetail(item);
                }
            }
        });
    };



    //#endregion

    //#region 編輯Bomdetail
    // const [editbomdetail, setEditbomdetail] = useState<boolean>(false);
    //#endregion


    //#endregion

    //#region =============【方法邏輯】===============================================================================

    //#region 物料查詢
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const isSelectingRef = useRef(false);
    useEffect(() => {
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
    //#endregion

    //#region 頁籤切換判斷
    const [tabnow, setTabnow] = useState<string>("編輯");
    const [tabshow, setTabshow] = useState<string>("編輯");

    // 根據當前選中的 tab 設置按鈕的樣式
    const getButtonStyle = (tabName: string) => {
        return tabnow === tabName ? { color: '#14256a', backgroundColor: '#FFEEEE', borderBottom: '2px solid #ea1833' } : {};
    };

    const tabChosed = (tabName: string) => {
        setTabnow(tabName);
        setTabshow(tabName);
        // setEditmain(false);
        // setProductnamein(originalproductnamein);
        // setProductidin(originalproductidin);
        // setProductspecin(originalproductspecin);
        // setMaterialin(originalmaterialin);
        // setUnitin(originalunitin);
        // setSurfacein(originalsurfacein);
    };
    //#endregion


    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'BOM維護'} panelList={undefined} />
            <div className={scss.body}>
                <div className={scss.content}>
                    <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
                        <div className={scss.head_head1}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.head_content1}>
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
                                            className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { handleChoseProduct(_item) }}
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
                                            <span></span>
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
                                {/* <button
                                    className={scss.minitabbtn}
                                    onClick={() => tabChosed('新增')}
                                    style={getButtonStyle('新增')}
                                >
                                    樹狀
                                </button> */}
                            </span>
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div>
                            <span style={{ color: "#14256a", fontSize: '20px', fontWeight: 'bolder' }}>品項</span>
                        </div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div>
                            {/* {parent_product} */}
                            <InputSel
                                {...inputSelProps}
                                caption="料號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: productid
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="名稱"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: productname
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="規格"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: productspec
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="材質"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: productmaterial
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="表面"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: productsurface
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className={scss.foot_head1}>
                        <div>
                            <span style={{ color: "#14256a", fontSize: '20px', fontWeight: 'bolder' }}>組件</span>
                        </div>
                        <div>
                            {/* {(edithandkey).toString()} */}
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                    <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
                    </div>
                    <div>
                        <div className={scss.body_content1} style={{ border: '1px solid #c1c1c1', overflowX: 'auto' }}>
                            <Thead01 type={'BomList'} />
                            {bomdata && (
                                bomdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader11}>
                                        <div className={scss.row01}>
                                            <span>
                                                <button onClick={() => { handleRemove(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                                    <img src={icon_cancel3.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                                <button onClick={() => { handleEdit(index) }}>
                                                    <img src={icon_edit.src} alt="cancel" style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`, width: '30px', height: '20px' }} />
                                                </button>
                                                <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                    <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                                <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                    <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                            <span>{index + 1}</span>
                                            <span>{_item.product_id}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span>{_item.material}</span>
                                            <span>{_item.surface}</span>
                                            <span>
                                                <input
                                                    ref={quantityRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', borderBottom: ((index === editlistindex && editlist === true) ? "1px solid black" : ""), width: '100%' }}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                                                    type="text"
                                                    value={_item.quantity !== undefined ? _item.quantity.toLocaleString() : 0}
                                                    readOnly={!(index === editlistindex && editlist === true)}
                                                    onChange={(e) => {
                                                        const newData = [...bomdata];
                                                        const newQuantity = e.target.value;
                                                        newData[index] = {
                                                            ...newData[index],
                                                            quantity: newQuantity,
                                                            totalprice: ((parseFloat(newQuantity || '0') * newData[index].unitprice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toString()

                                                        };
                                                        setBomdata(newData);
                                                        // handleChange(index, "quantity", e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>{_item.unit}</span>
                                            <span>{getTaiwanDateStr(_item.update_at)}</span>
                                            <span>{_item.update_by}</span>
                                            <span></span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}

                            <div className={scss.addbar}>
                                <div>
                                    <button onClick={() => { handleEditByHandKey() }} style={{ display: `${edithandkey ? 'none' : ''}` }}>
                                        <img src={icon_fc_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    <button onClick={() => { handleEditByHandKey() }} style={{ display: `${edithandkey ? '' : 'none'}` }}>
                                        <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    &nbsp;
                                    <button onClick={() => { handleAddByHandKey() }} style={{ display: `${edithandkey ? '' : 'none'}` }}>
                                        <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                                <div></div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入料號"
                                        value={handinputproductid}
                                        onChange={handleProductidChange}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入品項名稱"
                                        value={handinputname}
                                        onChange={handleNameChange}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入品項規格"
                                        value={handinputspec}
                                        onChange={handleSpecChange}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />
                                </div>
                                <div>
                                    <input
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                        type="text"
                                        placeholder='材質'
                                        value={handinputmaterial}
                                        onChange={(e) => {
                                            setHandinputmaterial(e.target.value);
                                        }}

                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='表面'
                                        value={handinputsurface}
                                        onChange={(e) => setHandinputsurface(e.target.value)}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='數量'
                                        value={handinputquantity}
                                        onChange={(e) => setHandinputquantity(e.target.value)}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='單位'
                                        value={handinputunit}
                                        onChange={(e) => setHandinputunit(e.target.value)}
                                        style={{ width: '100%', display: `${edithandkey ? '' : 'none'}` }}
                                    />
                                </div>
                                <div>
                                    {/* &nbsp;&nbsp;
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button> */}
                                </div>
                            </div>

                        </div>
                        <div className={scss.body_foot1}>
                            <div>
                                {/* {filteredData2.length > 0 && (
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
                                            display: `${showSuggestions2 ? '' : 'none'}`
                                        }}>
                                        {filteredData2.map(item => (
                                            <li
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                style={{
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    border: '1px solid #c1c1c1',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <span style={{ flex: '1 1 20%' }}>
                                                    {item.productid}
                                                </span>
                                                <span style={{ flex: '1 1 47%' }}>
                                                    {item.name}
                                                </span>
                                                <span style={{ flex: '1 1 30%' }}>
                                                    {item.spec}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )} */}
                            </div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </SubLayer>

    )
}


