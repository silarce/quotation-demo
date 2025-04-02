import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './wareHouseList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { AppContext } from 'pages/_app';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

//icon
import icon_search from 'public/image/icon/fc_search.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import InputSel from "components/global/gear/inputAndSel_v2/inputSel";
import { inputSelProps } from "components/page/worksDepartment/ui/wrapper_inpuSel_01";
import icon_fc_add from 'public/image/icon/fc_add.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_add from 'public/image/icon/fc_add2.svg';
import icon_eye from 'public/image/icon/eyeOpen.svg';
import icon_eye_gray from 'public/image/icon/eyeProhibit.svg';
import icon_cir_add from 'public/image/icon/addCircle.svg';
import icon_cir_remove from 'public/image/icon/removeCircle.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search2 from 'public/image/icon/search.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';




type Tquery = {
    wareHouseId: string | undefined;
};


export const setting = {
    // apipath:'https://new-erp-api.prod.san-jeou.com.tw',
    // apipath: 'https://new-erp-api.beta.san-jeou.com.tw',


    // apipath:`${process.env.NEXT_PUBLIC_API_NETCORE_URL}`,
    apipath: 'https://localhost:44383',
    // env: 'prod',
    env: 'local',
    warehouse1: '192.168.1.226',
    warehouse2: '192.168.1.227',
    warehouse3: '192.168.1.228',
    warehouse4: '192.168.1.229',
};


export default function WareHouseList() {

    const router = useRouter();
    const { type, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    const [data, setData] = useState<any[]>([]);
    const [typedata, setTypeData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useContext(AppContext);

    const urlRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
    const whnameRefs = useRef(data.map(() => createRef<HTMLInputElement>()));


    const searchTargetList = [
        {
            placeholder: '請輸入倉庫名稱',
        },
    ];


    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const keyword = arr[0] as string;
            if (keyword === '' || keyword === undefined) {
                GetWareHouse();
            } else {
                SearchWareHouseByID(keyword);
            }
        }
    };


    const panelList: TpanelList = [
        // { searchGroup },
        {
            type: 'addButton',
            label: '新增倉庫',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addWareHouse`,
                    query: {
                        status,
                    },
                });
            },
        },
    ];


    //頁面進入
    useEffect(() => {
        // setting.apipath = process.env.NEXT_PUBLIC_API_NETCORE_URL || '';
        // setting.apipath = "https://localhost:44383";
        GetWareHouse();
        GetWareHouseType();
        // console.log(`${process.env.NEXT_PUBLIC_API_NETCORE_URL}`);
    }, []);



    //call api
    const GetWareHouse = async () => {
        try {
            setIsLoading(true);
            // const response = await fetch('YOUR_C#_API_ENDPOINT');
            //erpAPI
            console.log(setting.apipath);
            const response = await fetch(`${setting.apipath}/WareHouse/GetWareHouse`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const SearchWareHouseByID = async (keyword: string) => {
        try {
            // 傳給api的參數JSON
            const conditionModel = {
                keyword: keyword as string | undefined,

            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}/WareHouse/SearchWareHouseByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const UpdateWareHouse = async (item: any) => {
        try {
            setIsLoading(true);

            const conditionModel = {
                id: item.id,
                note: item.note,
                employee_id: userInfo?.employee?.id,
                type: item.type,
                whname: item.whname
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/WareHouse/UpdateWareHouse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                myAlert.err({ title: 'UpdateWareHouse', content: `API Status: ${response.status}` });
                return;
            }

            // 解析 API 響應
            const result = await response.json(); // 解析為 JSON 格式

            // 根據 API 回應處理結果
            if (result.success) {
                // 成功，顯示提示
                // myAlert.success({ title: '成功', content: result.message });
                myAlert.success({ title: result.message });
                setEditlist(false);
                GetWareHouse();
                GetWareHouseType();

            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }



        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }




    }

    const getTrayByWareHouse = (item: any, traycalled: any, traycalledname: any, traytransfer: any, url: any, whnamecalled: any) => {
        handleRowClick(item.id)
        switch (item.type) {
            case '立體倉庫':
            router.push({
                pathname: `/factoryDepartment/trayList`,
                query: {
                type: 'Tray',
                whid: item.id,
                whname1: item.whname,
                url: url,
                traycalled: traycalled,
                traycalledname: traycalledname,
                traytransfer: traytransfer,
                whnamecalled: whnamecalled,
                firstin: 1
                },
            });
            break;
            case '一般倉庫':
            router.push({
                pathname: `/factoryDepartment/noTrayList`,
                query:{
                    item: JSON.stringify(item),
                }
            });
            // router.push({
            //     pathname: `/factoryDepartment/trayList`,
            //     query: {
            //     type: 'Tray',
            //     whid: item.id,
            //     whname1: item.whname,
            //     url: url,
            //     traycalled: traycalled,
            //     traycalledname: traycalledname,
            //     traytransfer: traytransfer,
            //     whnamecalled: whnamecalled,
            //     firstin: 1
            //     },
            // });
            break;
            default:
            break;
        }

    }

    const GetWareHouseType = async () => {
        try {
            // setIsLoading(true);
            const conditionModel = {
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'GetWareHouseType',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(inputModel);

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetWareHouseType?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTypeData(data);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const DeleteWareHouseById = async (item: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                id: item.id,
                employee_id: userInfo?.employee?.id
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'DeleteWareHouseById',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(inputModel);

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/DeleteWareHouseById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            if (result?.success) {
                myAlert.success({ title: result.message })
                GetWareHouse();
                GetWareHouseType();
            } else {
                myAlert.err({ title: '刪除失敗' })
            }

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };


    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
    const quantityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    // 組件編輯
    const handleEdit = async (index: any, item: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '倉庫維護中，請先結束編輯狀態' })
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
                    UpdateWareHouse(item);

                }
            }
        });
    };

    const handleDelete = async (index: any, item: any) => {
        myAlert.confirm({
            title: '確定刪除嗎?',
            props: {
                onOk: () => {
                    DeleteWareHouseById(item);
                }
            }
        });

    }

    return (

        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫'} panelList={panelList}
                customeLeft={[

                ]} />
            <div>
                <Thead01 type={'WareHouse'} />
                {/* <Tbody01 type={'WareHouse'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} /> */}
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
                                    <span>
                                        <input
                                            ref={whnameRefs.current[index]}
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                width: '100%'
                                            }}
                                            readOnly={!(editlist && editlistindex === index)}
                                            type={editlist && editlistindex === index ? "text" : "text"}
                                            value={editlist && editlistindex === index ? _item.whname : _item.whname}
                                            onChange={(e) => {
                                                const newData = [...data];
                                                const newWhname = e.target.value;
                                                newData[index] = {
                                                    ...newData[index],
                                                    whname: editlist ? newWhname : newWhname
                                                };
                                                setData(newData);
                                            }}
                                        />
                                    </span>
                                    <span style={{ textAlign: 'left' }}>
                                        <select
                                            ref={(el) => (selectRefs.current[index] = el)} // 正確對應到 HTMLSelectElement
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                width: '100%',
                                                border: '0px',
                                                outline: 'none'
                                            }}
                                            disabled={!(editlist && editlistindex === index)} // 非編輯模式下禁用
                                            value={editlist && editlistindex === index ? _item.type : _item.type} // 設定選中值
                                            onChange={(e) => {
                                                const newData = [...data];
                                                const newType = e.target.value; // 取得選中的值
                                                newData[index] = {
                                                    ...newData[index],
                                                    type: newType, // 更新 type 值
                                                };
                                                setData(newData); // 更新狀態
                                            }}
                                        >
                                            {/* 從 typedata 動態渲染選項 */}
                                            {typedata.map((type: any) => (
                                                <option key={type.id} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </span>
                                    <span>
                                        <input
                                            ref={noteRefs.current[index]}
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                width: '100%'
                                            }}
                                            readOnly={!(editlist && editlistindex === index)}
                                            type={editlist && editlistindex === index ? "text" : "text"}
                                            value={editlist && editlistindex === index ? _item.note : _item.note}
                                            onChange={(e) => {
                                                const newData = [...data];
                                                const newNote = e.target.value;
                                                newData[index] = {
                                                    ...newData[index],
                                                    note: editlist ? newNote : newNote
                                                };
                                                setData(newData);
                                            }}
                                        />
                                    </span>
                                    <span style={{ color: '#14256a', fontWeight: 'bolder' }}>{_item.traycodetotal}</span>
                                    {/* <span>{convertToYearMonthDay('Datea', _item.created_at)}</span> */}
                                    {/* <span>{_item.create_by}</span> */}
                                    <span>{_item.position}</span>
                                    <span>{_item.update_by}</span>
                                    {/* <span>{convertToYearMonthDay('Datea', _item.update_at)}</span> */}
                                    <span>{getTaiwanDateStr(_item.update_at)}</span>
                                    <span>
                                        <input
                                            ref={urlRefs.current[index]}
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                width: '100%'
                                            }}
                                            readOnly={!(editlist && editlistindex === index)}
                                            type={editlist && editlistindex === index ? "text" : "text"}
                                            value={editlist && editlistindex === index ? _item.url : _item.url}
                                            onChange={(e) => {
                                                const newData = [...data];
                                                const newUrl = e.target.value;
                                                newData[index] = {
                                                    ...newData[index],
                                                    url: editlist ? newUrl : newUrl
                                                };
                                                setData(newData);
                                            }}
                                        />
                                    </span>
                                    <span ><IconDetail onClick={() => getTrayByWareHouse(_item, traycalled, traycalledname, traytransfer, url, whnamecalled,)} /></span>
                                    <span></span>
                                </div>
                            </CellWithBar>
                        ))
                    )}
                </div>



            </div>
        </SubLayer>
    )

}