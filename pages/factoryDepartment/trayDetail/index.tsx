
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './trayDetail.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef, useState } from 'react';
import { TquotationStatus } from 'js/api/dtoTypes';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { Modal, PageHeader } from 'antd';
import { ButtonBase } from '@mui/material';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { AppContext } from 'pages/_app';
//路由
import { useRouter } from 'next/router';
//參數(從warehouseList取得
import { setting } from '../wareHouseList/index';
//custom component
import MyButton from 'components/global/gear/button/myButton';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
//icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_tray_out from 'public/image/icon/fc_tray_out.svg';
import icon_tray_out_gray from 'public/image/icon/fc_tray_out_gray.svg';
//
import { isWednesday } from 'date-fns';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { callTray, updateTrayStatus, getTrayStatus } from "../../../js/service/callTrayService";




export default function TrayDetail() {
    //#region ===========【頁面參數】
    const [pagename, setPagename] = useState<string>('')
    //#endregion

    //#region ===========【路由參數】
    const router = useRouter();
    const { item } = router.query;

    const parsedItem = item ? JSON.parse(item as string) : null;
    //#endregion

    //#region ===========【登入者】
    const { userInfo } = useContext(AppContext);
    const { erpFeature } = useContext(AppContext);
    //#endregion

    //#region ===========【變數宣告】
    //載入狀態
    const [isLoading, setIsLoading] = useState(false)

    //錯誤處理
    const [error, setError] = useState<string | null>(null);

    //編輯狀態
    const [isEditing, setIsEditing] = useState(false);

    //物料查詢視窗
    const [searchbar, setSearchbar] = useState(false);


    // 資料列宣告
    // const [dataState, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const [data11, setData11] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);//物料查詢
    const [searchbardata, setSearchBarData] = useState<any[]>([]);//物料查詢
    const [modaldata, setModalData] = useState<any[]>([]);//物料查詢

    // 變數宣告
    //路由接進來的參數
    const [whname, setWhname] = useState<string>('');
    const [trayname, setTrayname] = useState<string>('');
    const [whid, setWhid] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');

    //編輯區塊
    const [whpid, setwhpid] = useState<string>('');
    const [productid, setProductid] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [spec, setSpec] = useState<string>('');
    const [prodbatch, setProdbatch] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [unit, setUnit] = useState<string>('');

    //儲存原始資料
    const [originalproductid, setOriginalProductid] = useState<string>('');
    const [originalname, setOriginalName] = useState<string>('');
    const [originalspec, setOriginalSpec] = useState<string>('');
    const [originalprodbatch, setOriginalProdbatch] = useState<string>('');
    const [originalquantity, setOriginalQuantity] = useState<string>('');
    const [originalunit, setOriginalUnit] = useState<string>('');


    //滑鼠定位
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);



    //托盤呼叫
    const [called, setCalled] = useState(false);
    const [ip, setIP] = useState<string>('');
    const [calledTray, setCalledTray] = useState<string>('');
    const [calledWarehouse, setCalledWarehouse] = useState<string>('');



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

    //#region ===========【監控畫面大小】
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouseX(`${event.pageX}px`);
            setMouseY(`${event.pageY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);

        // 清理事件監聽器
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // 只需在元件掛載時添加監聽器
    //#endregion

    //#region ===========【頁面進入】
    // Local 開發時會多次觸發，上線後不影響，但開發時覺得很煩，所以加了這個
    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getProduct();

            hasFetchedData.current = true;
        }
    }, []);

    useEffect(() => {
        setId(parsedItem?.id);
        setWhname(parsedItem?.whname);
        setTrayname(parsedItem?.trayname);
        setWhid(parsedItem?.whid);
        setType(parsedItem?.type);
        setPagename(`倉庫名稱：${whname}｜托盤名稱：${trayname}`)
        GetWhp(parsedItem?.id, parsedItem?.trayname, parsedItem?.whid);
        GetLayOut(parsedItem?.id, parsedItem?.trayname, parsedItem?.whid);
        GetTrayStatus(parsedItem?.whid);

    }, [item]);
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
            const responseData = await response.json();
            setData(responseData)
            setModalData(responseData)
            setSearchBarData(responseData)
            setFilteredData2(responseData);

            console.log(erpFeature);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //取儲格資料
    const GetWhp = async (id: any, trayname: any, whid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                whid: whid,
                trayname: trayname,
                id: id
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/EditWHPositionByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            // 不想用modal了

            // 回傳處理
            setData1(responseData);

            setwhpid(recodeWhpid(responseData?.length, responseData?.width, responseData?.childlength, responseData?.childwidth));
            setProductid(responseData?.productid);
            setName(responseData?.productname);
            setSpec(responseData?.productspec);
            setProdbatch(responseData?.batchid);
            setQuantity(responseData?.quantity);
            setUnit(responseData?.unit);


        } catch (error: any) {
            myAlert.err({ title: error.message });
            // setError(error.message);k
        } finally {
            // setIsLoading(false);
        }
    };

    //取托盤樣式
    const GetLayOut = async (id: any, trayname: any, whid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                whid: whid,
                trayname: trayname,
                id: id
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOutById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();

            setData11(responseData);


        } catch (error: any) {
            myAlert.err({ title: error.message });
        } finally {
            // setIsLoading(false);
        }
    };

    //更新儲格與庫存資料
    const updateData = async (updatedData: any) => {
        try {
            // setIsLoading(true);

            const conditionModel = {
                username: userInfo?.employee?.chName.toString(),
                data: updatedData,
                productid: productid,
                name: name,
                spec: spec,
                prodbatch: prodbatch,
                quantity: quantity,
                unit: unit

            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(inputModel);

            const response = await fetch(`${setting.apipath}/WareHouse/UpdateWHPositionAndInventoryByID`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch or update data');
            }

            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: "更新成功" });
                GetWhp(id, trayname, whid);
                GetLayOut(id, trayname, whid);
                setIsEditing(false);

            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }



        } catch (error: any) {
            myAlert.err({ title: error.message });
        } finally {
            // setIsLoading(false);
        }
    };

    //取得托盤呼叫狀態
    const GetTrayStatus = async (whid: string) => {
        try {
            setIsLoading(true);

            const trayStatus = await getTrayStatus(setting.apipath, whid);

            // 更新狀態
            setCalled(trayStatus.called);
            setIP(trayStatus.ip);
            setCalledTray(trayStatus.trayname); // trayname 可正常取值
            setCalledWarehouse(trayStatus.whname);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    //更新托盤呼叫狀態
    const UpdateTrayStatus = async () => {
        try {
            setIsLoading(true);

            const conditionModel = {
                whid: whid,
                called: !called,
                trayname: trayname,
                called_by: userInfo?.employee?.id,
            };

            const result = await updateTrayStatus(setting.apipath, conditionModel);

            if (result.success) {
                // 成功，更新狀態
                setCalled(!called);
            } else {
                // 失敗，顯示錯誤提示
                setCalled(false);
                myAlert.warning({ title: "失敗", content: result.message });
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 呼叫托盤
    const CallTray = async () => {
        try {
            setIsLoading(true);

            // 設定基礎參數
            const baseURL = setting.env === "prod" ? ip : "https://localhost:44383/WareHouse/";
            const deviceName = "Device1";
            const trayNumber = trayname;
            const trayCommand = "100";
            const regAddress = "253";
            const cmdValue = "1";

            // 使用 callTray 服務
            await callTray(baseURL, deviceName, trayNumber, trayCommand, regAddress, cmdValue);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 退回托盤
    const CallTrayBack = async () => {
        try {
            setIsLoading(true);

            // 設定基礎參數
            const baseURL = setting.env === "prod" ? ip : "https://localhost:44383/WareHouse/";
            const deviceName = "Device1";
            const trayNumber = trayname;
            const trayCommand = "200";
            const regAddress = "253";
            const cmdValue = "1";

            // 使用 callTray 服務
            await callTray(baseURL, deviceName, trayNumber, trayCommand, regAddress, cmdValue);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };



    //#endregion

    //#region ===========【功能區】
    const handleSave = () => {
        updateData(data1);
    }

    //編輯
    const handleEdit = () => {
        setIsEditing(true);
        setOriginalProductid(productid);
        setOriginalName(name);
        setOriginalSpec(spec);
        setOriginalProdbatch(prodbatch);
        setOriginalQuantity(quantity);
        setOriginalUnit(unit);
    }

    //取消編輯
    const handleCancel = () => {
        setIsEditing(false);  // 結束編輯模式
        setProductid(originalproductid);
        setName(originalname);
        setSpec(originalspec);
        setProdbatch(originalprodbatch);
        setQuantity(originalquantity);
        setUnit(originalunit);
    };

    //呼叫托盤
    const handleCall = async () => {
        await GetTrayStatus(whid);
        if (called === true) {
            myAlert.warning({ title: '請先收回托盤' });
            return;
        } else {
            myAlert.confirm({
                title: `呼叫: ${trayname}`,
                content: '請勿靠近設備!!',
                props: {
                    onOk: async () => {
                        // await CallTrayAPI();
                        await CallTray();
                        UpdateTrayStatus();
                    }
                }
            });

        }
    }

    //退回托盤
    const handleBack = async () => {
        await GetTrayStatus(whid);
        if (called === false) {
            myAlert.warning({ title: '托盤已退回' });
            return;
        } else {
            myAlert.confirm({
                title: `退回: ${calledTray}`,
                content: '請勿靠近設備!!',
                props: {
                    onOk: async () => {
                        await CallTrayBack();
                        UpdateTrayStatus();
                    }
                }
            });

        }
    }

    //切換儲格
    const handlechangewhposition = (id: any, whid: any, trayname: any, whname: any) => {
        if (isEditing) {
            setIsEditing(false);
        }

        setId(id);
        setWhid(whid);
        setTrayname(trayname);
        setWhname(whname);
        GetWhp(id, trayname, whid);
        GetLayOut(id, trayname, whid);
    }



    //#endregion

    //#region ===========【邏輯】
    //儲格重新編碼
    const recodeWhpid = (length: any, width: any, childlength: any, childwidth: any) => {
        const convertToAlpha = (num: number): string => {
            return String.fromCharCode(65 + num - 1);
        };

        const convertToNumber = (num: number, pad: number): string => {
            return num.toString().padStart(pad, '0');
        };

        const alphaIncrement = (alpha: string): string => {
            if (alpha === 'Z') {
                return 'A';
            } else {
                return String.fromCharCode(alpha.charCodeAt(0) + 1);
            }
        };

        const numberIncrement = (num: number, max: number, pad: number): string => {
            if (num >= max) {
                return convertToNumber(1, pad);
            } else {
                return convertToNumber(num + 1, pad);
            }
        };

        let newlength = '';
        let newwidth = '';
        let newchildlength = '';
        let newchildwidth = '';

        // 處理 length 的增量
        if (length === '1') {
            newlength = 'A';
        } else {
            newlength = convertToAlpha(parseInt(length, 10));
        }

        // 處理 width 的增量
        if (width === '1') {
            newwidth = '001';
        } else {
            newwidth = convertToNumber(parseInt(width, 10), 3);
        }

        // 處理 childlength 的增量
        if (childlength === '1') {
            newchildlength = 'A';
        } else {
            newchildlength = convertToAlpha(parseInt(childlength, 10));
        }

        // 處理 childwidth 的增量
        if (childwidth === '1') {
            newchildwidth = '1';
        } else {
            newchildwidth = numberIncrement(parseInt(childwidth), 100, 1);
        }

        // 增量操作
        if (childlength !== '1' && newchildwidth === '001') {
            newchildlength = alphaIncrement(newchildlength);
        }

        if (width !== '1' && newchildlength === 'A' && newchildwidth === '1') {
            newwidth = numberIncrement(parseInt(width), 100, 3);
        }

        if (length !== '1' && newwidth === '001' && newchildlength === 'A' && newchildwidth === '1') {
            newlength = alphaIncrement(newlength);
        }

        return newlength + newwidth + newchildlength + (parseInt(newchildwidth) - 2).toString();
    };
    //#endregion

    //#region ===========【物料篩選】
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [customerbar, setCustomerbar] = useState(false);
    const [countyOptions, setCountyOptions] = useState<string[]>([]);
    const [filteredData2, setFilteredData2] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        productid: '',
        name: '',
        spec: ''
    });

    // 根據篩選條件更新資料
    useEffect(() => {
        const filtered = searchbardata.filter(item =>
            (filters.productid === '' || item?.productid?.toLowerCase().includes(filters.productid.toLowerCase())) &&
            (filters.name === '' || item?.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.spec === '' || item?.spec?.toLowerCase().includes(filters.spec.toLowerCase()))
        );
        setFilteredData2(filtered);
    }, [filters]);



    // useEffect(() => {
    //     setFilteredData2(
    //         searchbardata.filter(
    //             (item) =>
    //                 (!productid || (item?.productid && item.productid.toLowerCase().includes(productid.toLowerCase()))) &&
    //                 (!name || (item?.name && item.name.toLowerCase().includes(name.toLowerCase()))) &&
    //                 (!spec || (item?.spec && item.spec.toLowerCase().includes(spec.toLowerCase())))
    //         )
    //     );
    // }, [productid, name, spec]); // 當 supplieridin 或 suppliernamein 變化時觸發

    //#endregion

    //#region ===========【渲染畫面】
    return (

        <SubLayer isLoading_subLayer={false} className='overflow-hidden'>
            <PageHeader02 tag={`倉庫編號：${whname}｜托盤編號：${trayname}`} panelList={undefined}
                customeLeft={[

                    <>
                        {/* 托盤呼叫狀態:{called?.toString()} */}
                    </>
                ]}
                customeRight={[
                    <>
                        {isEditing ? (
                            // 當 isEditing 為 true 時，顯示 "儲存" 和 "取消" 按鈕
                            <>
                                <button
                                    className={scss.shortredsquarebtn}
                                    onClick={() => {
                                        myAlert.confirm({
                                            title: '確定修改?',
                                            props: {
                                                onOk: () => {
                                                    // setDisabled(true);
                                                    handleSave();
                                                }
                                            }
                                        });
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
                                                    handleCancel();
                                                }
                                            }
                                        })
                                    }}
                                >
                                    取消
                                </button>
                            </>
                        ) : (
                            // 當 isEditing 為 false 時，顯示 "編輯" 和 "返回" 按鈕
                            <>
                                <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        handleEdit();
                                    }}
                                >
                                    編輯
                                </button>
                                <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        myAlert.confirm({
                                            title: `確定要返回嗎?`,
                                            props: {
                                                onOk: () => {
                                                    router.back();
                                                },
                                            },
                                        });
                                    }}
                                >
                                    返回
                                </button>
                            </>
                        )}

                    </>
                ]} />

            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_body}>

                            <div className={scss.head_content0}>
                                <div>
                                    <button
                                        style={{
                                            visibility: isEditing ? 'visible' : 'hidden', // 保留空間但隱藏按鈕
                                            width: '39px',
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #c1c1c1',
                                            borderRadius: '3px',
                                            cursor: isEditing ? 'pointer' : 'default', // 非編輯模式禁用滑鼠效果
                                            transition: 'all 0.3s ease',
                                            fontWeight: 'bolder'
                                        }}
                                        onMouseOver={(e) => {
                                            if (isEditing) {
                                                e.currentTarget.style.backgroundColor = '#e0e0e0';
                                                e.currentTarget.style.borderColor = '#a1a1a1';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (isEditing) {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                e.currentTarget.style.borderColor = '#c1c1c1';
                                            }
                                        }}
                                        onClick={() => {
                                            if (isEditing) {
                                                // setCustomerbar(true);
                                                setSearchbar(true);
                                            }
                                        }}
                                    >
                                        <img src={icon_search.src} alt="search" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`料號`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                value: productid || ' ',
                                                onChange: ((e) => {
                                                    setProductid(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`名稱`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                value: name || ' ',
                                                onChange: ((e) => {
                                                    setName(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`規格`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                value: spec || ' ',
                                                onChange: ((e) => {
                                                    setSpec(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`數量`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                type: 'text',
                                                value: isEditing ? quantity : Number(quantity).toLocaleString(), // 編輯時顯示純數字，非編輯時格式化顯示
                                                onChange: (e) => {
                                                    const newValue = e.target.value;
                                                    // 檢查是否為有效數值（避免非數值更新）
                                                    if (!isNaN(Number(newValue)) && newValue.trim() !== "") {
                                                        setQuantity(Number(newValue).toString()); // 更新為數字類型
                                                    }
                                                },
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`單位`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: unit || ' ',
                                                onChange: ((e) => {
                                                    setUnit(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`批號`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: prodbatch || ' ',
                                                onChange: ((e) => {
                                                    setProdbatch(e.target.value);
                                                })
                                            },
                                        }}
                                    />

                                    <InputSel
                                        {...inputSelProps}
                                        caption={`儲格編號`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                value: whpid || ' ',
                                                onChange: ((e) => {
                                                    setwhpid(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (!called) {
                                                handleCall();
                                            } else {
                                                handleBack();
                                            }
                                        }}
                                        style={{
                                            width: '100%',  // 調整按鈕大小，與圖片更匹配
                                            height: '50px', // 調整按鈕大小，與圖片更匹配
                                            // border: '1px solid #ccc',
                                            border: `${called ? '1px solid rgb(0, 105, 23, 0.267)' : '1px solid #ea1833'}`,
                                            display: `${!isEditing ? 'flex' : 'none'}`,  // 根據 isEditing 顯示或隱藏按鈕
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            transition: 'background-color 0.3s',  // 添加過渡效果
                                            fontSize: '16px',
                                            color: `${called ? '#86bd07' : '#ea1833'}`
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLButtonElement).style.backgroundColor = `${called ? 'rgb(0, 105, 23, 0.267)' : '#ea18341d'}`;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                                        }}
                                    >

                                        {`${called ? `退回托盤(${calledTray})` : `呼叫托盤(${trayname})`}`}

                                    </button>

                                </div>
                                <div style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', padding: '20px 20px' }}>
                                    {data11.map((Data) => (
                                        <table className={scss.traytable} style={{ border: 'solid 1px black' }}>
                                            <tbody>
                                                <tr className={scss.tr}>
                                                    {Data.widthdata.map((item: any) => (
                                                        <td className={scss.td} style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}>
                                                            {item.childtraylayoutmodel && item.childtraylayoutmodel.map((childitem: any) => (
                                                                <table className={scss.childtraytable} key={item.childlengthid}>
                                                                    <tbody>
                                                                        <tr className={scss.childtraytabletr}>
                                                                            {childitem.childwidthdata.map((childDataItem: any) => (
                                                                                <td className={scss.childtraytabletd} key={childDataItem.id} style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}>
                                                                                    <button className={scss.childtraytabletdButton}
                                                                                        onClick={() => {
                                                                                            handlechangewhposition(childDataItem.id, childDataItem.whid, childDataItem.trayname, childDataItem.whname)
                                                                                            // setChildWHPosition(recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth));
                                                                                            // setChildWHPositionVisible('');
                                                                                            // setChildParentLength(childDataItem.length);
                                                                                            // setChildParentWidth(childDataItem.width);
                                                                                            // setLastChildParentLength(childparentlength);
                                                                                            // setLastChildParentWidth(childparentwidth);
                                                                                            // setCurrentlength(childDataItem.length);
                                                                                            // setCurrentwidth(childDataItem.width);
                                                                                            // setCurrentchildlength(childDataItem.childlength);
                                                                                            // setCurrentchildwidth(childDataItem.childwidth);
                                                                                            // getLaychildOutBywhpositin(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth, childitem.childwidthdata.length);
                                                                                        }
                                                                                        }
                                                                                        style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                                        onMouseEnter={() => setHoverInfo(`${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`)}
                                                                                        onMouseLeave={() => setHoverInfo(null)}>
                                                                                        {`${recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth)}\n`}<br />
                                                                                        {/* <span style={{fontSize:'10px'}}>{`${childDataItem.productid}\n`}</span><br /> */}
                                                                                    </button>
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            ))}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    ))}
                                    {hoverInfo && (
                                        <div
                                            style={{
                                                backgroundColor: '#dfdcdc',
                                                position: 'fixed',
                                                top: mouseY,
                                                left: mouseX,
                                                transform: 'translate(10%, 60%)',
                                                padding: '5px',
                                                borderRadius: '5px',
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                                zIndex: '999',
                                                whiteSpace: 'pre-line', // 控制換行的 CSS 屬性
                                                fontSize: '16px'
                                            }}
                                        >
                                            {hoverInfo}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                visible={searchbar}
                onCancel={() => setSearchbar(false)}
                width="1010px"
                closable={false} // 移除右上角的叉叉
                style={{ top: 150 }}
                bodyStyle={{ padding: 0, height: '500px', overflowY: 'auto' }}
                title={
                    <>

                        {/* 篩選區域 */}
                        <div style={{ display: 'flex', gap: '10px', padding: '10px', alignItems: 'center', fontSize: '16px' }}>
                            {/* 料號篩選 */}
                            <input
                                type="text"
                                placeholder="輸入料號"
                                value={filters.productid}
                                onChange={(e) => setFilters({ ...filters, productid: e.target.value })}
                                style={{ padding: '5px', borderBottom: '1px solid #ccc', flex: '1' }}
                            />

                            {/* 名稱篩選 */}
                            <input
                                type="text"
                                placeholder="輸入名稱"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                style={{ padding: '5px', borderBottom: '1px solid #ccc', flex: '1' }}
                            />

                            {/* 規格篩選 */}
                            <input
                                type="text"
                                placeholder="輸入規格"
                                value={filters.spec}
                                onChange={(e) => setFilters({ ...filters, spec: e.target.value })}
                                style={{ padding: '5px', borderBottom: '1px solid #ccc', flex: '1' }}
                            />
                        </div>
                    </>
                }
                footer={null}
            >


                {/* 資料列表 */}
                <div style={{ padding: '0px 35px' }}>


                    <div className={scss.thead21}>
                        <span>料號</span>
                        <span>名稱</span>
                        <span>規格</span>
                        <span></span>
                    </div>
                    {filteredData2 && (
                        filteredData2.map((_item: any, index: number) => (
                            <CellWithBar key={index} className={scss.panelHeader21}
                                onClick={() => {
                                    setProductid(_item.productid);
                                    setName(_item.name);
                                    setSpec(_item.spec);
                                    setQuantity("0");
                                    setSearchbar(false);

                                }}>
                                <div className={scss.row01}>
                                    <span>{_item.productid}</span>
                                    <span>{_item.name}</span>
                                    <span>{_item.spec}</span>
                                </div>
                            </CellWithBar>
                        ))
                    )}
                </div>
            </Modal>

        </SubLayer >

    );
    //#endregion
}
