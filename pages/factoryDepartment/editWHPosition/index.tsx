
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './editWHPosition.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { PageHeader } from 'antd';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { ButtonBase } from '@mui/material';
import MyButton from 'components/global/gear/button/myButton';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { setting } from '../wareHouseList/index';






type Tquery = {
    wareHouseId: string | undefined;
};

export interface WHPositionModel {
    id?: string;
    whpname?: string;
    whid?: string;
    volume?: number;
    spec?: string;
    trayid?: string;
    length?: number;
    width?: number;
    childlength?: number;
    childwidth?: number;
    materialnumber?: string;
    batchnumber?: string;
    unit?: string;
    quantity?: number;
    whname?: string;
    trayname?: string;
    canedit?: boolean;
}



export default function EditWHPosition() {
    // 路由傳進來的
    const router = useRouter();
    const { type, whid, trayname, whname, id, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    //備分原本model
    const [data, setData] = useState<WHPositionModel>([]);
    const [data1, setData1] = useState<WHPositionModel>([]);
    const [data11, setData11] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
    const [canedit, setCanEdit] = useState<boolean | undefined>(false);
    // const [traycalledin, setTrayCalled] = useState<boolean | undefined>(false);
    // const [traycallednamein, setTrayCalledName] = useState<string | undefined>("");
    // const [traytransferin, setTrayTransfer] = useState<boolean | undefined>(false);

    //托盤呼叫收回判定
    const [whnamecalledin, setWhnameCalledin] = useState<string | undefined>(whnamecalled?.toString() ?? "");
    const [traycalledin, setTrayCalledin] = useState<boolean>(traycalled === 'true');
    const [traycallednamein, setTrayCalledNamein] = useState<string | undefined>(traycalledname?.toString() ?? "");
    const [sametrayornotin, setTrayorNotin] = useState<boolean>(whnamecalled === data1.whname && traycalledname === data1.trayname ? true : false);
    const [traytransferin, setTrayTransferin] = useState<boolean>(traytransfer !== trayname ?? false);

    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');


    const status = router.query.status as TquotationStatus;
    // const traycode =router.query.whid as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    // const [disabled, setDisabled] = useState(!!wareHouseId);
    const [disabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    //#region 右側功能按鈕區塊
    // const panelList: TpanelList = [
    //還沒編輯前功能紐
    const panelList_unedit: TpanelList = canedit ? [
        {
            type: 'redButton',
            label: '編輯',
            onClick: () => {
                setDisabled(false);
            },
        },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/whPositionList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        trayname: trayname,
                        whname: whname,
                        traycalled: traycalled,
                        traycalledname: traycalledname,
                        traytransfer: traytransfer,
                        whnamecalled: whnamecalledin
                    }
                });
            },
        },
    ] : [

        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/whPositionList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        trayname: trayname,
                        whname: whname,
                        traycalled: traycalledin,
                        traycalledname: traycallednamein,
                        traytransfer: traytransferin,
                        whnamecalled: whnamecalledin
                    }
                });
            },
        },
    ];


    //點選編輯後功能紐
    const panelList_edit: TpanelList = [
        {
            type: 'myButton',
            label: '儲存',
            onClick: () => {
                if (data1.materialnumber === '' || data1.materialnumber === undefined || data1.materialnumber === null &&
                    data1.whpname === '' || data1.whpname === undefined || data1.whpname === null &&
                    data1.batchnumber === '' || data1.batchnumber === undefined || data1.batchnumber === null &&
                    data1.spec === '' || data1.spec === undefined || data1.spec === null &&
                    data1.quantity === 0 || data1.quantity === undefined || data1.quantity === null
                ) {
                    myAlert.warning({ title: '請確實填寫儲位資訊' });
                } else {
                    myAlert.confirm({
                        title: '確定修改?',
                        content: <>
                            <h1>修改後無法再編輯</h1>
                        </>,
                        props: {
                            onOk: () => {
                                setDisabled(true);
                                handleSave();
                            }
                        }
                    });
                }
            },
        },
        {
            type: 'myButton',
            label: '取消',
            onClick: () => {
                setDisabled(true);
                handleRestore();
            },
        },
    ];




    const panelList = disabled ? panelList_unedit : panelList_edit;
    //#endregion

    //#region 與api 溝通區塊
    useEffect(() => {
        const fetchDataAndLayout = async () => {
            await fetchData();
            await GetLayOut();

            // if (!disabled) { // 只有在未編輯狀態下處理滑鼠移動事件
            const handleMouseMove = (event: MouseEvent) => {
                setMouseX(`${event.pageX}px`);
                setMouseY(`${event.pageY}px`);
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
            // }
        };

        fetchDataAndLayout();
    }, [router.query, disabled]);

    //撈取儲位資料 api
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}EditWHPositionByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            const dataModel: WHPositionModel = {
                id: responseData.id,
                whpname: responseData.whpname,
                whid: responseData.whid,
                volume: responseData.volume,
                spec: responseData.spec,
                trayid: responseData.trayid,
                length: responseData.length,
                width: responseData.width,
                childlength: responseData.childlength,
                childwidth: responseData.childwidth,
                materialnumber: responseData.materialnumber,
                batchnumber: responseData.batchnumber,
                unit: responseData.unit,
                quantity: responseData.quantity,
                whname: responseData.whname,
                trayname: responseData.trayname,
                canedit: responseData.canedit
            };

            setData1(dataModel);
            setData(dataModel);//備分恢復原本的model
            console.log(dataModel.canedit);
            setCanEdit(dataModel.canedit);
            console.log(canedit);

            // console.log("EditWHPositionByID:" + data1.id);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    //更新儲位資料 api
    const updateData = async (updatedData: WHPositionModel) => {
        try {
            setIsLoading(true);
            const check = JSON.stringify(updatedData);
            console.log(check);

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(updatedData),
            };

            console.log(inputModel);

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}UpdateWHPositionByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            if (!response.ok) {
                throw new Error('Failed to update data');
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
        } catch (error) {
            console.error('Error updating data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetLayOut = async () => {
        try {
            setIsLoading(true);
            const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetTrayLayOutById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            console.log(responseData);

            setData11(responseData);


        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    //#region 呼叫托盤


    const CallTrayAPI = async () => {
        try {
            setIsLoading(true);

            // 根據 whname 設置 deviceName
            // 寫死
            const deviceName =
                (whname === "101") ? "Device1" :
                    (whname === "102") ? "Device2" :
                        (whname === "103") ? "Device3" : "";
            const traynumber = trayname;
            const traycommand = "100";

            const url = (setting.env === "prod") ? (
                (whname === "101") ? "http://192.168.1.8/sjwms/" :
                    (whname === "102") ? "http://192.168.1.9/sjwms/" :
                        (whname === "103") ? "http://192.168.1.10/sjwms/" : ""
            ) : "https://localhost:44383/";


            // execcommand 的固定參數
            const regaddress = '253';
            const cmdvalue = '1';


            // alert(whname + " : " + trayname);

            // 設定呼叫的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setWhnameCalledin(data1.whname);
            setTrayCalledin(true);
            setTrayCalledNamein(data1.trayname);

            // return;

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand?deviceName=${deviceName}&traynumber=${traynumber}&traycommand=${traycommand}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }
            console.log(response);

            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand?deviceName=${deviceName}&regaddress=${regaddress}&cmdvalue=${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 execcommand API 的回應
            if (!response2.ok) {
                throw new Error('Failed to call execcommand API');
            }
            console.log(response2);

            // 如果成功，設置 traycalled 和 traycalledname 狀態
            setTrayCalledin(true);
            setTrayCalledNamein(data1.trayname);

        } catch (error: any) {
            myAlert.warning(error.message);
            console.error;
        } finally {
            setIsLoading(false);
        }
    };

    const CallTrayBackAPI = async () => {
        try {
            setIsLoading(true);



            // 根據 whname 設置 deviceName
            const deviceName =
                (whnamecalledin === "101") ? "Device1" :
                    (whnamecalledin === "102") ? "Device2" :
                        (whnamecalledin === "103") ? "Device3" : "";
            const traynumber = traycallednamein;
            const traycommand = "200";
            const url = (setting.env === "prod") ? (
                (whnamecalledin === "101") ? "http://192.168.1.8/sjwms/" :
                    (whnamecalledin === "102") ? "http://192.168.1.9/sjwms/" :
                        (whnamecalledin === "103") ? "http://192.168.1.10/sjwms/" : ""
            ) : "https://localhost:44383/";




            // execcommand 的參數
            const regaddress = '253';
            const cmdvalue = '1';


            // alert(whnamecalledin + " : " + traycalledname);


            // 收回清空設定的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setWhnameCalledin('');
            setTrayCalledin(false);
            setTrayCalledNamein('');
            // return;

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand?deviceName=${deviceName}&traynumber=${traynumber}&traycommand=${traycommand}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }

            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand?deviceName=${deviceName}&regaddress=${regaddress}&cmdvalue=${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 execcommand API 的回應
            if (!response2.ok) {
                throw new Error('Failed to call execcommand API');
            }

            // 如果成功，設置 traycalled 和 traycalledname 狀態
            setTrayCalledin(false);
            setTrayCalledNamein('');


        } catch (error: any) {
            // 處理錯誤，顯示警告
            myAlert.warning(error.message);
            console.error;
        } finally {
            setIsLoading(false);
        }
    };


    const CallTray = async () => {
        try {
            if (traycalledin === true) {
                myAlert.warning({ title: '請先收回托盤' });
            } else {
                myAlert.confirm({
                    title: `呼叫: ${trayname}`,
                    content: '!!請勿靠近設備!!',
                    props: {
                        onOk: () => {
                            CallTrayAPI();

                        }
                    }
                });

            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const CallTrayBack = async () => {
        if (traycalledin != true) {
            myAlert.warning({ title: '目前無托盤可收回' });
        } else {
            myAlert.confirm({
                title: `收回: ${trayname}`,
                content: '!!請勿靠近設備!!',
                props: {
                    onOk: () => {
                        CallTrayBackAPI();
                    }
                }
            });
        }
    }

    // 領料才需要
    const CallTrayChange = async () => {
        alert("交換托盤");
        // setTrayCalledName(trayname);
    }


    //#endregion
    //#endregion

    //#region model 作動區塊
    //修改儲位連動model
    const handleChange = (key: keyof WHPositionModel, value: string | number) => {
        setData1(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    // 更新儲位
    const handleSave = () => {
        updateData(data1);
    };

    const handleRestore = () => {
        setData1(data);
    }

    async function handlechangewhposition(id: any, whid: any, trayname: any, whname: any) {

        // setCanEdit(false);
        // panelList=panelList_unedit
        router.replace({
            pathname: `/factoryDepartment/editWHPosition`,
            query: {
                type: 'WHPosition',
                whid: whid,
                trayname: trayname,
                whname: whname,
                id: id,
            },
        });

    }

    //#endregion

    return (
        <SubLayer isLoading_subLayer={false}>
            {/* <> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫名稱：' + whname + "｜托盤名稱：" + trayname} panelList={panelList} />
            {/* 左側區塊 */}

            {/* <div style={{ display: !disabled ? 'block' : 'none', position: 'absolute', top: '0', left: '1%', transform: 'translateX(0%)', zIndex: '999' }}>編輯中....</div> */}
            {/* {hoverInfo && <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translateX(0%)', zIndex: '999' }}>{hoverInfo}</div>} */}

            {/* 所在倉庫:{data1.whname}<br />
            托盤名稱:{trayname}<br />
            是否有托盤呼叫中:{traycalledin === true ? 'true' : 'false'}<br />
            倉庫名稱:{whnamecalledin}<br />
            呼叫中的托盤名稱:{traycallednamein}<br /> */}
            
            <div className={scss.main}>
                <div className={scss.left}>
                    <div className={scss.top}>
                        {/* <div> */}
                        <InputSel
                            {...inputSelProps}
                            caption="物料編碼"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.materialnumber,
                                    onChange: (e) => handleChange('materialnumber', e.target.value),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="物料名稱"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.whpname,
                                    onChange: (e) => handleChange('whpname', e.target.value),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="批號"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.batchnumber,
                                    onChange: (e) => handleChange('batchnumber', e.target.value),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="物料規格"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.spec,
                                    onChange: (e) => handleChange('spec', e.target.value),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="數量"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.quantity,
                                    onChange: (e) => handleChange('quantity', parseInt(e.target.value)),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="單位"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1?.unit ? data1.unit : ' ',
                                    onChange: (e) => handleChange('unit', e.target.value),
                                },
                            }}
                        />
                        <InputSel
                            {...inputSelProps}
                            caption="托盤編碼"
                            // disabled={disabled}
                            disabled={true}
                            inputProps={{
                                props: {
                                    value: data1?.trayname ? data1.trayname : ' ',
                                    // onChange: (e) => handleChange('trayname', e.target.value),
                                },
                            }}
                        />
                        <div className={scss.top} style={{ display: traycalledin === true ? 'none' : '' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label="呼叫托盤" onClick={() => { CallTray(); }} />
                        </div>
                        <div className={scss.top} style={{ display: traycalledin === true ? '' : 'none' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label={`收回托盤 (${whnamecalledin} : ${traycallednamein})`} onClick={() => { CallTrayBack(); }} />
                        </div>
                        {/* <div className={scss.top} style={{ display: traycalled === true && traytransfer === false ? '' : 'none' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label="收回托盤" onClick={() => { CallTrayBack(); }} />
                        </div> */}
                        {/* <div className={scss.top} style={{ display: traycalled === true && traytransfer === true ? '' : 'none' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label="交換托盤" onClick={() => { CallTrayChange(); }} />
                        </div> */}
                        {/* </div> */}
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
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
                                                                            onClick={() => handlechangewhposition(childDataItem.id, childDataItem.whid, childDataItem.trayname, childDataItem.whname)}
                                                                            style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                            onMouseEnter={() => setHoverInfo(`${childDataItem.whpname}\n${childDataItem.spec}\n${childDataItem.quantity}`)}
                                                                            onMouseLeave={() => setHoverInfo(null)}>
                                                                            {childDataItem.width}<br />
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
                </div >
            </div >
        </SubLayer >
    )
}