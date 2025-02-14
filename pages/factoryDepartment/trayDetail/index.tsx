
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './trayDetail.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef, useState } from 'react';
import { TquotationStatus } from 'js/api/dtoTypes';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { PageHeader } from 'antd';
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
import icon_search from 'public/image/icon/fc_search.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import { isWednesday } from 'date-fns';

export default function TrayDetail() {
    //region ===========【頁面參數】
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

    // 資料列宣告
    // const [dataState, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const [data11, setData11] = useState<any[]>([]);



    // 變數宣告
    //路由接進來的參數
    const [whname, setWhname] = useState<string>('');
    const [trayname, setTrayname] = useState<string>();
    const [whid, setWhid] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');

    //編輯區塊
    const [productid, setProductid] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [spec, setSpec] = useState<string>('');
    const [prodbatch, setProdbatch] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [unit, setUnit] = useState<string>('');


    //滑鼠定位
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);



    //狀態
    const [isEditing, setIsEditing] = useState(false);
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

    }, [item]);
    //#endregion


    //#region ===========【API】
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
            //#region 收
            // const dataModel: WHPositionModel = {
            //     id: responseData.id,
            //     whpname: responseData.whpname,
            //     whid: responseData.whid,
            //     volume: responseData.volume,
            //     spec: responseData.spec,
            //     trayid: responseData.trayid,
            //     length: responseData.length,
            //     width: responseData.width,
            //     childlength: responseData.childlength,
            //     childwidth: responseData.childwidth,
            //     materialnumber: responseData.materialnumber,
            //     batchnumber: responseData.batchnumber,
            //     unit: responseData.unit,
            //     quantity: responseData.quantity,
            //     whname: responseData.whname,
            //     trayname: responseData.trayname,
            //     canedit: responseData.canedit,
            //     productname: responseData.productname,
            //     productspec: responseData.productspec,
            //     productid: responseData.productid
            // };
            //#endregion

            // 回傳處理
            setData1(responseData);
            // setData(dataModel);//備分恢復原本的model
            // setCanEdit(dataModel.canedit);//不擋了
            // console.log("EditWHPositionByID:" + data1.id);

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
                data: updatedData
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

            router.replace({
                pathname: `/factoryDepartment/editWHPosition`,
                query: {
                    type: 'WHPosition',
                    whid: whid,
                    trayname: trayname,
                    whname: whname,
                    id: id
                },
            });
        } catch (error: any) {
            myAlert.err({ title: error.message });
        } finally {
            // setIsLoading(false);
        }
    };



    //#endregion


    //#region ===========【功能區】

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

    //切換儲格
    const handlechangewhposition = (id: any, whid: any, trayname: any, whname: any) => {
        // router.replace({
        //     pathname: `/factoryDepartment/editWHPosition`,
        //     query: {
        //         type: 'WHPosition',
        //         whid: whid,
        //         trayname: trayname,
        //         whname: whname,
        //         id: id,
        //     },
        // });

        setId(id);
        setWhid(whid);
        setTrayname(trayname);
        setWhname(whname);
        GetWhp(id, trayname, whid);
        GetLayOut(id, trayname, whid);

    }



    //#endregion






    //#region ===========【渲染畫面】
    return (

        <SubLayer isLoading_subLayer={false} className='overflow-hidden'>
            <PageHeader02 tag={`倉庫名稱：101｜托盤名稱：1001`} panelList={undefined}
                customeRight={[
                    <>
                        {isEditing ? (
                            // 當 isEditing 為 true 時，顯示 "儲存" 和 "取消" 按鈕
                            <>
                                <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        alert("儲存");
                                    }}
                                >
                                    儲存
                                </button>
                                <button
                                    className={scss.shortsquarebtn}
                                    onClick={() => {
                                        setIsEditing(false);
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
                                        setIsEditing(true);
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
            {/* <div>
                <p>ID: {id}</p>
                <p>WH Name: {whname}</p>
                <p>Tray Name: {trayname}</p>
                <p>WH ID: {whid}</p>
                <p>Type: {type}</p>
            </div> */}
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_body}>
                            <div className={scss.head_content0}>
                                <div>
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
                                        caption={`批號`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
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
                                        caption={`數量`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                type: `${!isEditing ? 'number' : 'text'}`,
                                                value: `${!isEditing ? quantity : Number(quantity).toLocaleString()}`,
                                                onChange: ((e) => {
                                                    setQuantity(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption={`單位`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={!isEditing}
                                        inputProps={{
                                            props: {
                                                value: unit || ' ',
                                                onChange: ((e) => {
                                                    setUnit(e.target.value);
                                                })
                                            },
                                        }}
                                    />
                                    {/* <InputSel
                                        {...inputSelProps}
                                        caption={`儲格編號`}
                                        captionStyle={{ fontSize: '18px' }}
                                        wrapperStyle={{ marginBottom: '10px' }}
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: whid || ' ',
                                                onChange: ((e) => {
                                                    setWhid(e.target.value);
                                                })
                                            },
                                        }}
                                    /> */}

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


        </SubLayer >

    );
    //#endregion
}
