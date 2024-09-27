import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './bomList.module.scss';
import { useEffect, useRef, useState } from "react";
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

export default function BomList() {

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
    } = router.query;
    //#endregion

    //#region =============【變數宣告】===============================================================================
    // 資料列
    const [data, setData] = useState<any[]>([]); // 物料data
    const [searchdata, setSearchdata] = useState<any[]>([]); // 物料查詢

    // 物料查詢變數
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");


    //#endregion

    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            //取得所有物料
            getProduct();

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

    const getProduct = async () => {
        try {
            // setIsLoading(true);
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

            console.log(responsedata);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };




    //#endregion

    //#region =============【方法入口】===============================================================================
    // 選擇物料
    const HandleChoseProduct = (item: any) => {
        // alert(item.name);
        handleRowClick(item.id);
    }

    // 清除查詢條件
    const handleClear = () => {
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');

    }

    // 點擊處理
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    //#endregion

    //#region =============【方法邏輯】===============================================================================

    // 物料查詢
    const [filteredData, setFilteredData] = useState<any[]>([]);
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

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={'BOM維護'} panelList={panelList} />
            <div className={scss.body}>
                <div className={scss.content}>
                    <div
                        style={{ position: 'sticky', top: 0, left: 0, width: '100%', backgroundColor: 'white', zIndex: 1000, padding: '0px 20px' }}>
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
                                            className={`${scss.row01} ${_item.productid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { HandleChoseProduct(_item) }}
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
                    <div></div>
                </div>
            </div>
        </SubLayer>

    )
}


