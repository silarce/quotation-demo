
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './editWHPosition.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef, useState } from 'react';
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
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import { AppContext } from 'pages/_app';






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
    productname?: string;
    productspec?: string;
    productid?: string;
}



export default function EditWHPosition() {
    // 路由傳進來的
    const router = useRouter();
    const { type, whid, trayname, whname, id, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    const { userInfo } = useContext(AppContext);
    //備分原本model
    const [productdata, setProductdata] = useState<any[]>([]);
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
    const [traytransferin, setTrayTransferin] = useState<boolean>(traytransfer !== trayname);


    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');


    const status = router.query.status as TquotationStatus;
    // const traycode =router.query.whid as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    // const [disabled, setDisabled] = useState(!!wareHouseId);
    const [disabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const [editstatus, setEditstatus] = useState<string>("");

    //#region 右側功能按鈕區塊
    // const panelList: TpanelList = [
    //還沒編輯前功能紐
    const panelList_unedit: TpanelList = canedit ? [
        {
            type: 'myButton',
            label: '編輯',
            onClick: () => {
                setDisabled(false);
                setEditstatus("編輯");
            },
        },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/trayList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        trayname: trayname,
                        whname: whname,
                        traycalled: traycalledin,
                        traycalledname: traycallednamein,
                        traytransfer: traytransferin,
                        whnamecalled: whnamecalledin,
                        firsin: 0
                    }
                });
            },
        },
    ] : [
        //先開放編輯功能
        {
            type: 'myButton',
            label: '修改',
            onClick: () => {
                setDisabled(false);
                setEditstatus("修改");
            },
        },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    // pathname: `/factoryDepartment/whPositionList`,
                    pathname: `/factoryDepartment/trayList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        trayname: trayname,
                        whname: whname,
                        traycalled: traycalledin,
                        traycalledname: traycallednamein,
                        traytransfer: traytransferin,
                        whnamecalled: whnamecalledin,
                        firsin: 0
                    }
                });
            },
        },
    ];


    //點選編輯後功能紐
    const panelList_edit: TpanelList = [
        {
            type: 'redButton',
            label: '儲存',
            onClick: () => {
                if (editstatus === "編輯") {


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
                } else {
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

    const getProduct = async () => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel: {
                // keyword: string | undefined;
            } = {
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
            setProductdata(data);


            console.log(userInfo);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getProduct();
    }, []);


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
            const response = await fetch(`${setting.apipath}/WareHouse/EditWHPositionByID?${queryParams}`);
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
                canedit: responseData.canedit,
                productname: responseData.productname,
                productspec: responseData.productspec,
                productid: responseData.productid
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
        if (editstatus === "編輯") {
            try {
                setIsLoading(true);

                const conditionModel: {
                    data: any,
                    username: string | undefined,
                } = {
                    username: userInfo?.username as string | undefined,
                    data: updatedData
                };

                const inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'test',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(inputModel);

                const response = await fetch(`${setting.apipath}/WareHouse/UpdateWHPositionByID`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputModel)
                });

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
        } else {
            try {
                setIsLoading(true);

                const conditionModel: {
                    data: any,
                    username: string | undefined,
                } = {
                    username: userInfo?.username as string | undefined,
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
            const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOutById?${queryParams}`);
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
                (whname === "101") ? `https://${setting.warehouse1}/` :
                    (whname === "102") ? `https://${setting.warehouse2}/` :
                        (whname === "103") ? `https://${setting.warehouse3}/` : ""
            ) : "https://localhost:44383/WareHouse/";


            // execcommand 的固定參數
            const regaddress = '253';
            const cmdvalue = '1';


            // alert(whname + " : " + trayname);

            // 設定呼叫的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setWhnameCalledin(data1.whname);
            setTrayCalledin(true);
            setTrayCalledNamein(data1.trayname);

            alert(url);
            // return;

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
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
            // 等待一秒
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
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
                (whnamecalledin === "101") ? `https://${setting.warehouse1}/sjwms/` :
                    (whnamecalledin === "102") ? `https://${setting.warehouse2}/sjwms/` :
                        (whnamecalledin === "103") ? `https://${setting.warehouse3}/sjwms/` : ""
            ) : "https://localhost:44383/WareHouse/";

            // execcommand 的參數
            const regaddress = '253';
            const cmdvalue = '1';

            // 收回清空設定的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setWhnameCalledin('');
            setTrayCalledin(false);
            setTrayCalledNamein('');
            alert(url);

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }

            // 等待一秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
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
            console.error(error); // 這裡需要傳遞錯誤對象
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
        console.log(data);
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
        if (isSelectingRef.current) return;

        let filtered = productdata;
        const { productid, productname, productspec } = data1;

        // 根據條件過濾數據
        if (productid) {
            filtered = productdata.filter(item =>
                item.productid.includes(productid)
            );
        }

        if (productname) {
            filtered = productdata.filter(item =>
                item.name.includes(productname)
            );
        }

        if (productspec) {
            filtered = productdata.filter(item =>
                item.spec && item.spec.includes(productspec)
            );
        }

        // 更新過濾後的數據
        setFilteredData(filtered);

        // 當有過濾條件且有匹配結果時才顯示建議框
        const shouldShowSuggestions = filtered.length > 0 && (productid || productname || productspec) && canedit === true;
        setShowSuggestions(Boolean(shouldShowSuggestions));
    }, [data1.productid, data1.productname, data1.productspec, productdata]);



    const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        handleChange('productid', e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        handleChange('productname', e.target.value);
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        handleChange('productspec', e.target.value);
    };


    const handleSelect = (item: DataItem) => {
        // alert(item.id);
        isSelectingRef.current = true;
        // setHandinputproductuuid(item.id);
        data1.productid = item.productid;
        data1.productname = item.name;
        data1.productspec = item.spec || '';
        data1.unit = item.unit;
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
                                    value: data1.productid,
                                    onChange: handleProductidChange,
                                },
                            }}
                        />
                        {showSuggestions && (
                            <div
                                style={{
                                    position: 'absolute',
                                    zIndex: 1001,
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                    width: '750px',
                                    maxHeight: '300px', // 擴大整個容器的高度
                                    overflow: 'hidden', // 隱藏整個容器的滾動條
                                    fontSize: '16px',
                                    left: `${position.x}px`,
                                    top: `${position.y}px`,
                                    cursor: 'default',
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px',
                                        borderBottom: '1px solid #ccc',
                                        backgroundColor: '#f5f5f5', // 標題列的背景色
                                        cursor: 'move', // 讓用戶知道可以拖動
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold' }}>查詢結果</div> {/* 標題文字 */}
                                    <button
                                        onClick={() => setShowSuggestions(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#555',
                                            outline: 'none',
                                            transition: 'color 0.3s ease',
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.color = '#000')}
                                        onMouseOut={(e) => (e.currentTarget.style.color = '#555')}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div
                                    style={{
                                        maxHeight: '350px', // 限制table區域的最大高度
                                        overflowY: 'auto', // 允許垂直滾動
                                    }}
                                >
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleSelect(item)}
                                                    style={{ padding: '8px', cursor: 'pointer', border: '1px solid gray' }}
                                                    onMouseDown={(e) => e.preventDefault()} // 防止 blur 事件
                                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                                                >
                                                    <td style={{ padding: '8px', width: '150px' }}>
                                                        {item.productid}
                                                    </td>
                                                    <td style={{ padding: '8px', width: '250px' }}>
                                                        {item.name}
                                                    </td>
                                                    <td style={{ padding: '8px', width: '350px' }}>
                                                        {item.spec}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td style={{ textAlign: 'center', padding: '8px', color: '#888' }}>
                                                    沒有匹配的結果
                                                </td>
                                            </tr>
                                        )}
                                    </table>
                                </div>
                            </div>
                        )}


                        {/* <IconDetail onClick={() => { alert("OK") }}>asdf</IconDetail> */}
                        <InputSel
                            {...inputSelProps}
                            caption="物料名稱"
                            disabled={disabled}
                            // disabled={true}
                            inputProps={{
                                props: {
                                    value: data1.productname,
                                    // onChange: (e) => handleChange('whpname', e.target.value),
                                    onChange: handleNameChange,
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
                                    value: data1.productspec,
                                    // onChange: (e) => handleChange('spec', e.target.value),
                                    onChange: handleSpecChange,
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
                </div >
            </div >
        </SubLayer >
    )
}