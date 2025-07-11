import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, useMemo } from 'react';
import { AppContext } from 'pages/_app';
import scss from './noTrayList.module.scss';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setting } from '../wareHouseList/index';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_fc_check from 'public/image/icon/fc_check.svg?url';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg?url';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg?url';
import icon_edit from 'public/image/icon/fc_edit.svg?url';
import icon_delete from 'public/image/icon/fc_delete.svg?url';
import icon_clear from 'public/image/icon/fc_clear.svg?url';
import icon_add2 from 'public/image/icon/fc_add2.svg?url';
import icon_add from 'public/image/icon/fc_add2.svg?url';
import icon_search2 from 'public/image/icon/search.svg?url';
import Thead01 from '../ui/table/thead01';
import { Modal, Pagination } from 'antd';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { useRouter } from 'next/router';
import { update } from 'lodash';


export default function noTrayList() {
    //#region ===========【路由參數】
    const router = useRouter();
    const {
        item,
    } = router.query;

    const parsedItem = item ? JSON.parse(item as string) : null;
    //#endregion

    //#region ===========【登入者】
    const { userInfo } = useContext(AppContext);
    //#endregion

    //#region ===========【變數宣告】
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]); // 物料data
    const [error, setError] = useState<string | null>(null);

    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [productdata, setProductdata] = useState<any[]>([]);
    const [subproductdata, setSubProductdata] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]); // 物料data
    const [searchdata2, setSearchdata2] = useState<any[]>([]);

    const [whid, setWhid] = useState<string>('');

    const [isEditing, setIsEditing] = useState(false);

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");

    const productidRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const quantityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));


    const [productbar, setProductbar] = useState(false);
    //#endregion

    //#region ===========【頁面進入】
    useEffect(() => {
        getProduct();


    }, [])

    useEffect(() => {
        setWhid(parsedItem?.id);
        Get(parsedItem?.id);
    }, [item]);

    //#endregion

    //#region ===========【API】
    // 取得倉庫內容
    const Get = async (id: any) => {
        try {
            setIsLoading(true);
            const conditionModel = {
                whid: id
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetInventoryById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setSearchdata(data);
            // setFilteredData(data);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //撈取物料
    const getProduct = async () => {
        try {
            // alert(checkfirstin);
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

            setData2(data);
            // setDatarestore(data);
            setSearchdata2(data);
            setFilteredData2(data);
            console.log(data);

            let subProductArray = [];
            try {
                subProductArray = data[0].subproduct ? JSON.parse(data[0].subproduct) : [];
            } catch (error) {
                console.error("解析 subproduct 時發生錯誤:", error);
                subProductArray = [];
            }

            // 存入狀態
            setSubProductdata(subProductArray);

            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error: any) {
            setError("getProduct:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 新增庫存
    const AddInventory = async (item: any) => {
        try {

            const conditionModel = {
                username: userInfo?.employee?.chName.toString(),
                productid: item.productid,
                whid: whid,
                wpid: '',
                quantity: '0'
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // 發送數據到 API
            const response = await fetch(`${setting.apipath}/WareHouse/AddInventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
                myAlert.err({ title: 'AddInventory', content: `API Status: ${response.status}` })

            }
            // 解析 API 響應
            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                Get(whid);
            } else {
                // 失敗，顯示錯誤提示
                myAlert.warning({ title: '失敗', content: result.message });
            }

            // 更新狀態或執行其他操作
            console.log(result);
        } catch (error: any) {
            // 顯示錯誤信息
            myAlert.err({ title: 'FunctionError', content: error.message },)
        }

    }

    //移除庫存
    const DeleteInventoryById = async (item: any) => {
        try {
            const conditionModel = {
                id: item.id,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/DeleteInventoryById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // 解析 API 響應
            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                Get(whid);
            } else {
                // 失敗，顯示錯誤提示
                myAlert.warning({ title: '失敗', content: result.message });
            }

            // 更新狀態或執行其他操作
            console.log(result);
        } catch (error: any) {
            // 顯示錯誤信息
            myAlert.err({ title: 'FunctionError', content: error.message },)
        }

    }

    // 更新庫存
    const UpdateInventory = async (item: any) => {
        try {
            const conditionModel = {
                id: item.id,
                quantity: item.quantity,
                update_by: userInfo?.employee?.chName.toString(),
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            // 發送數據到 API
            const response = await fetch(`${setting.apipath}/WareHouse/UpdateInventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
                myAlert.err({ title: 'UpdateInventory', content: `API Status: ${response.status}` })

            }
            // 解析 API 響應
            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                Get(whid);
                setEditlist(!editlist);
            } else {
                // 失敗，顯示錯誤提示
                myAlert.warning({ title: '失敗', content: result.message });
            }

            // 更新狀態或執行其他操作
            console.log(result);
        } catch (error: any) {
            // 顯示錯誤信息
            myAlert.err({ title: 'FunctionError', content: error.message },)
        }

    }
    //#endregion

    //頁面功能
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };
    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);

    // 組件編輯
    const handleEdit = async (index: any, item: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '庫存維護中，請先結束編輯狀態' })
            return;
        }
        handleRowClick(item.id);
        setOriginaleditlistdata(data);
        setEditlist(!editlist);
        setEditlistindex(index);
    };

    // 組件取消編輯
    const handleCancel = async (index: any) => {
        setEditlist(!editlist);
        setData(originaleditlistdata);
        setSelectedItemId('');
    };

    // 更新組件清單
    const handleUpdate = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定更新嗎?',
            props: {
                onOk: () => {
                    UpdateInventory(item);
                }
            }
        });
    };

    const handleDelete = async (index: any, item: any) => {
        myAlert.confirm({
            title: '確定刪除嗎?',
            props: {
                onOk: () => {
                    DeleteInventoryById(item);
                }
            }
        });

    }

    const handleAdd = async (item: any) => {
        AddInventory(item);
        // const emptyDetail = {
        //     id: "",
        //     productid: item.productid,
        //     name: item.name,
        //     spec: item.spec,
        //     unit: item.unit,
        //     whid: whid,
        //     wpid: '',
        //     quantity: 0,
        //     create_at: new Date(),
        //     create_by: userInfo?.employee?.id,
        //     update_at: new Date(),
        //     update_by: userInfo?.employee?.id,
        // };

        // // 將空資料新增進陣列
        // setData((prevData) => [...prevData, emptyDetail]);
    }

    // 從明細移除
    const handleRemove = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定移除?',
            props: {
                onOk: () => {
                    const updatedData = data.filter((_, i) => i !== index);
                    setData(updatedData);
                }
            }
        });
    };



    //查詢
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const isSelectingRef = useRef(false);

    // 監聽條件變更
    useEffect(() => {
        if (isSelectingRef.current) return;

        const tempData = searchdata2.filter(item => {
            return (!keyword2 || item.productid.toString().toLowerCase().includes(keyword2.trim().toLowerCase())) &&
                (!keyword3 || item.name.toString().includes(keyword3.trim())) &&
                (!keyword4 || (item.spec && item.spec.toString().includes(keyword4.trim())));
        });

        setFilteredData2(tempData);
    }, [keyword2, keyword3, keyword4, searchdata2]); // 確保 `searchdata2` 變更時也會重新計算













    //#region ===========【分頁處理】
    // 頁數相關狀態
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100); // 每頁顯示的項目數
    const [filteredData2, setFilteredData2] = useState<any[]>([]);

    // 計算當前頁顯示的資料
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData2.slice(startIndex, endIndex);
    }, [itemsPerPage, currentPage, filteredData2]);

    // 分頁切換處理函數
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };
    //#endregion

    const handleClear = () => {
        setKeyword1('');
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');

    }



    return (

        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={`倉庫編號`} panelList={undefined}
                customeLeft={[
                    <>
                        <span style={{ fontSize: '18px', padding: '0px 10px' }}>
                            <button
                                className={scss.shortsquarebtn}
                                onClick={() => {
                                    setProductbar(!productbar);
                                }}
                            >
                                <span style={{ fontWeight: 'bolder', padding: '0px 5px' }}>
                                    <img src={icon_add.src} alt="add" />
                                </span>
                                加入物料
                            </button>
                        </span>
                    </>
                ]}
                customeRight={[
                    <>
                        <button
                            className={scss.shortsquarebtn}
                            onClick={() => {
                                myAlert.confirm({
                                    title: `確定要返回嗎?`,
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
                ]} />
            <div style={{ display: `${productbar ? '' : 'none'}` }}>
                <div style={{ textAlign: 'right' }}>
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
                <Thead01 type={'ProductList'} />
                <div className={scss.body_content1} style={{ height: '300px', border: '1px solid #c1c1c1' }}>
                    <span>
                        {currentItems && currentItems.map((_item: any, index: number) => {

                            return (
                                <CellWithBar key={index} className={scss.panelHeader2}>
                                    <div
                                        key={index}
                                        className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                        onClick={() => {
                                            // editProduct(_item) 
                                            handleAdd(_item);
                                        }}
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
                            );
                        })
                        }
                    </span>
                </div>

                <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
                    {/* 分頁控制 */}
                    <Pagination
                        current={currentPage} // 當前頁碼
                        total={filteredData2.length} // 總數據量
                        pageSize={itemsPerPage} // 每頁顯示的數量
                        onChange={handlePageChange} // 處理頁面切換
                        showSizeChanger // 顯示頁數選擇器
                        pageSizeOptions={['5', '10', '20', '50', '100']} // 可選的每頁顯示數量
                        onShowSizeChange={(current, size) => setItemsPerPage(size)} // 更新每頁顯示數量
                    />
                </div>
            </div>
            <div style={{ overflow: 'auto', padding: '0px 0px' }}>
                <div className={scss.thead1}>
                    <span>
                    </span>
                    <span>序</span>
                    <span>料號</span>
                    <span>名稱</span>
                    <span>規格</span>
                    <span>數量</span>
                    <span>單位</span>
                    <span>批號</span>
                    <span></span>
                </div>
                <div>
                    {/* {error && <p>Error: {error}</p>} */}
                    {data && (
                        data.map((_item: any, index: number) => (
                            <CellWithBar key={index} className={scss.panelHeader}>
                                <div
                                    key={index}
                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                // onClick={() => getTrayByWareHouse(_item, traycalled, traycalledname, traytransfer, url, whnamecalled,)}
                                >
                                    <span>
                                        <button onClick={() => {
                                            handleDelete(index, _item);
                                        }}
                                            style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                            <img src={icon_delete.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                        <button onClick={() => { handleEdit(index, _item) }}
                                            style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                            <img src={icon_edit.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                        <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                            <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                        <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                            <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                    </span>
                                    <span>{index + 1}</span>
                                    <span>
                                        {_item.productid}
                                    </span>
                                    <span>{_item.name}</span>
                                    <span>{_item.spec}</span>
                                    <span>
                                        <input
                                            ref={quantityRefs.current[index]}
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                width: '100%'
                                            }}
                                            readOnly={!(editlist && editlistindex === index)}
                                            type={editlist && editlistindex === index ? "text" : "text"}
                                            value={editlist && editlistindex === index ? _item.quantity : _item.quantity}
                                            onChange={(e) => {
                                                const newData = [...data];
                                                const neQuantity = e.target.value;
                                                newData[index] = {
                                                    ...newData[index],
                                                    quantity: editlist ? neQuantity : neQuantity
                                                };
                                                setData(newData);
                                            }}
                                        />
                                    </span>
                                    <span>{_item.unit}</span>
                                    <span>{_item.batchnumber}</span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </CellWithBar>
                        ))
                    )}
                </div>
            </div>





        </SubLayer>

    );
}
