import { useState, useEffect, MouseEvent as ReactMouseEvent, createContext, Key, useRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import scss from './trayList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { quotationStatusLookup } from 'config/lookupTable';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../wareHouseList/index';
import { WhatsAppOutlined } from '@ant-design/icons';
import EditWHPosition from '../editWHPosition';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function TrayList() {
    const router = useRouter();
    const { firstin, type, whid, trayname, whname, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    const [data, setData] = useState<any[]>([]);
    const [datafilter, setDatafilter] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data11, setData11] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');
    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [checkfirstin, setCheckFirstIn] = useState<number>(firstin ? parseInt(firstin as string, 10) : 0);

    const [datatrans, setDataTrans] = useState<any[]>([]);

    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");


    const searchTargetList = [
        {
            placeholder: '請輸入料號',
        },
        {
            placeholder: '請輸入名稱',
        },
        {
            placeholder: '請輸入規格',
        },
    ];

    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const arrkeyword2 = arr[0] as string;
            const arrkeyword3 = arr[1] as string;
            const arrkeyword4 = arr[2] as string;
            setKeyword2(arrkeyword2);
            setKeyword3(arrkeyword3);
            setKeyword4(arrkeyword4);

        }
    };

    const panelList: TpanelList = [
        { searchGroup },
        {
            type: 'addButton',
            label: '新增托盤',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addTray`,
                    query: {
                        type: 'Tray',
                        whid: whid,
                        whname: whname,
                    },
                });
            },
        },
        {
            type: 'myButton',
            label: `${!!wareHouseId ? '取消' : '返回'}`,
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/wareHouseList`,
                    query: {
                        type: 'WareHouse',
                        whname: whname,
                        traycalled: traycalled,
                        traycalledname: traycalledname,
                        traytransfer: traytransfer,
                        whnamecalled: whnamecalled
                    }
                });
            },
        },
    ];

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const isSelectingRef = useRef(false);
    useEffect(() => {
        if (isSelectingRef.current) return;
        let filteredData = datafilter;

        if (keyword2) {
            filteredData = filteredData.filter(item =>
                item.productid && item.productid.toString().includes(keyword2.trim())
            );
        }

        if (keyword3) {
            filteredData = filteredData.filter(item =>
                item.name && item.name.toString().includes(keyword3.trim())
            );
        }

        if (keyword4) {
            filteredData = filteredData.filter(item =>
                item.spec && item.spec.toString().includes(keyword4.trim())
            );
        }


        // setFilteredData(filteredData);
        const distinctData = Array.from(
            new Map(filteredData.map((item: any) => [item.trayname, item])).values()
        );

        setData(distinctData);

    }, [keyword2, keyword3, keyword4]);



    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${setting.apipath}/WareHouse/GetTray?Input=${whid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData(data);
            const distinctData = Array.from(
                new Map(data.map((item: any) => [item.trayname, item])).values()
            );

            setData(distinctData);
            setDatafilter(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 50));
            if (data.length > 0 && checkfirstin > 0) {
                const firstItem = data[0];
                const { whid, trayname } = firstItem;
                fetchData1(whid, trayname);
                GetLayOut(whid, trayname);
            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData1 = async (whid: any, trayname: any) => {
        try {
            setIsLoading(true);
            console.log(whid);

            const conditionModel: { whid: string | undefined; trayname: string | undefined } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'asdf',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetWHPosition?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data1 = await response.json();
            setData1(data1);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const GetLayOut = async (whid: any, trayname: any) => {
        try {
            setIsLoading(true);
            const conditionModel: { whid: string | undefined; trayname: string | undefined; } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOut?${queryParams}`);
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

    useEffect(() => {
        const fetchDataAndLayout = async () => {
            await fetchData1(whid, trayname);
            await GetLayOut(whid, trayname);
            const handleMouseMove = (event: MouseEvent) => {
                setMouseX(`${event.pageX}px`);
                setMouseY(`${event.pageY}px`);
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        };

        fetchDataAndLayout();
    }, [whid, trayname]);

    async function handlechangewhposition(id: any, whid: any, trayname: any, whname: any) {
        router.push({
            pathname: `/factoryDepartment/editWHPosition`,
            query: {
                type: 'WHPosition',
                whid: whid,
                trayname: trayname,
                whname: whname,
                id: id,
                traycalled: traycalled,
                traycalledname: traycalledname,
                traytransfer: traytransfer,
                whnamecalled: whnamecalled
            },
        });
    }

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

    //#region 轉換編碼
    const getDataTrans = async () => {
        try {
            const conditionModel = {
                type: "select",
                data2: datatrans
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetDataTrans?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log('Fetched data:', data);
            setDataTrans(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(data);


        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (datatrans.length > 0) {
            const updatedDataTrans = datatrans.map(item => {
                const whpname = recodeWhpid(item.length, item.width, item.childlength, item.childwidth);
                return { ...item, whpname };
            });
            // console.log('Updated data:', updatedDataTrans);
            setDataTrans(updatedDataTrans); // 更新狀態
        }
    }, [datatrans]);

    const DataTrans = async () => {
        // console.log('Updated data:', updatedDataTrans);
        console.log(datatrans);
        // return;
        try {
            setIsLoading(true);

            const conditionModel = {
                type: "Update",
                data2: datatrans
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/DataTrans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dataTrans');
            }

            const responseData = await response.json();
        } catch (error: any) {
            setError(error.message);
            console.error('Transfer failed:', error);
        } finally {
            setIsLoading(false);
        }
    };
    //#endregion 轉換編碼

    const [leftcount3, setLeftCount3] = useState<number>(0);
    const [rightcount3, setRightCount3] = useState<number>(0);

    const isLeftHidden = leftcount3 === 3;
    const isRightHidden = leftcount3 !== 3;
    const isFinalHidden = rightcount3 !== 9;
    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫編號：' + whname} panelList={panelList}
                customeLeft={
                    [
                        <>


                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ padding: '0px 10px' }}>
                                    {/* <button className={scss.longsquarebtn}
                                        onClick={() => {
                                            // SettlePayroll();

                                            alert("入庫");
                                        }}
                                        title="">
                                        入庫
                                    </button> */}
                                </span>
                                <span style={{ padding: '0px 10px', fontSize: '18px', color: '#14256a' }}>
                                {/* <button className={scss.longsquarebtn}
                                        onClick={() => {
                                            // SettlePayroll();

                                            alert("出庫");
                                        }}
                                        title="">
                                        出庫
                                    </button> */}
                                </span>
                            </div>



                            {/* <div>
                                {!isLeftHidden && (
                                    <div>
                                        <button onClick={() => setLeftCount3(leftcount3 + 1)}>
                                            <span style={{ width: '10px' }}>&nbsp;</span>
                                        </button>
                                    </div>
                                )}

                                {!isRightHidden && (
                                    <div>
                                        <button onClick={() => setRightCount3(rightcount3 + 1)}>
                                            <span style={{ width: '10px' }}>&nbsp;</span>
                                        </button>
                                    </div>
                                )}

                                {!isFinalHidden && (
                                    <div>
                                        <button onClick={getDataTrans}>取得</button>
                                        <button onClick={DataTrans}>轉換</button>
                                        <button onClick={()=>{
                                           setLeftCount3(0);
                                           setRightCount3(0);
                                        }}>關閉</button>
                                    </div>
                                )}
                            </div> */}

                        </>
                    ]}
            />
            <div className={scss.main}>
                <div className={scss.left}>

                    <div>
                        <Thead01 type={'Tray'} />
                        <Tbody01 type={'Tray'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <Thead01 type={'WHPosition'} />
                        <Tbody01 type={'WHPosition'} data={data1} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                    </div>
                </div>
            </div>
            <div className={scss.main1}>
                <div style={{ textAlign: 'center' }}>
                    <div className={scss.content1}>
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
                                                                            style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 139 / item.childtraylayoutmodel.length : '146px' }}
                                                                            onMouseEnter={() => setHoverInfo(`${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`)}
                                                                            onMouseLeave={() => setHoverInfo(null)}>
                                                                            {/* {childDataItem.length}-{childDataItem.width}-{childDataItem.childlength}-{childDataItem.childwidth}<br /> */}
                                                                            {`${recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth)}\n`}<br />
                                                                            <span style={{ fontSize: '10px' }}>{`${childDataItem.productid}\n`}</span><br />
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
                                    fontSize: '16px',
                                    textAlign: 'left'
                                }}
                            >
                                {hoverInfo}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SubLayer>
    );
}
