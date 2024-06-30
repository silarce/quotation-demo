import { useState, useEffect, MouseEvent as ReactMouseEvent, createContext, Key } from 'react';
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



    const searchTargetList = [
        {
            placeholder: '請輸入料號、名稱或規格',
        },
    ];

    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const keyword = arr[0] as string;
            if (keyword === '' || keyword === undefined) {
                fetchData1(whid, trayname);
            } else {
                searchData(keyword);
            }
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

    const searchData = async (keyword: string) => {
        try {
            setIsLoading(true);
            const conditionModel: { keyword: string | undefined; } = {
                keyword: keyword as string | undefined,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}SearchWHPositionByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData1(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


   

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${setting.apipath}GetTray?Input=${whid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
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
            const response = await fetch(`${setting.apipath}GetWHPosition?${queryParams}`);
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
            const response = await fetch(`${setting.apipath}GetTrayLayOut?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
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

    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫編號：' + whname} panelList={panelList} />
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
                                                                            style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                            onMouseEnter={() => setHoverInfo(`${childDataItem.whpname}\n${childDataItem.spec}\n${childDataItem.quantity}`)}
                                                                            onMouseLeave={() => setHoverInfo(null)}>
                                                                            {childDataItem.length}-{childDataItem.width}<br />
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
