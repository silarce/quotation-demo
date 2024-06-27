import { useState, MouseEvent, createContext, useEffect, Key, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './stockInList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import { parseJSON } from 'date-fns';





type Tquery = {
    wareHouseId: string | undefined;
};



export default function StockInList() {
    const router = useRouter();
    const {
        type,
        plid,
        create_at,
        create_by,
        lotid,
        picked,
        main_item,
        note
    } = router.query;


    const { userInfo } = useContext(AppContext);

    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);



    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);


    //#region 上方功能列

    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '領料單號',
        },
        {
            placeholder: '領料日期',
        },
        {
            placeholder: '領料人員',
        },
    ];

    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const keywordWhpname = valueArr[0] as string;
        const keywordMaterialnumber = valueArr[1] as string;
        const keywordSpec = valueArr[2] as string;
        searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };

    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        doSearch,
    };


    //新增按鈕
    const panelList: TpanelList = [
        { searchGroup },
        {
            type: 'addButton',
            label: '新增領料單',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addTray`,
                    query: {
                        type: 'Tray',
                    },
                });
            },
        },
    ];

    //#endregion




    //#region call api
    //取領料單清單
    const getPickingList = async () => {
        try {
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
            //erpAPI
            const response = await fetch(`${setting.apipath}GetPickingList?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);

            setData(data);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPickingList();
    }, []);

    //取對應的清單明細
    const getPickingListDetail = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                plid: string | undefined;
            } = {
                plid: plid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            //erpAPI
            const response = await fetch(`${setting.apipath}GetPickingListDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            console.log(data);
            setData1(data);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPickingListDetail();
    }, [plid]);


    const searchData = async (keywordWhpname: string, keywordMaterialnumber: string, keywordSpec: string) => {
        try {
            // keywordSpec
            const conditionModel: { keywordWhpname: string | undefined, keywordMaterialnumber: string | undefined, keywordSpec: string | undefined } = {
                keywordWhpname: keywordWhpname as string | undefined,
                keywordMaterialnumber: keywordMaterialnumber as string | undefined,
                keywordSpec: keywordSpec as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}SearchMaterialById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            setData(data);
            data = _.uniqBy(data, (item: any) => item.whname + item.trayname); // 去重
            setData1(data);


        } catch (error: any) {
            setError(error.message);
        }
    };


    //#endregion
    function gotoPick() {
        router.push({
            pathname: `/factoryDepartment/getMaterial/pickingListDetail`,
            query: {
                //傳入領料單單號
                plid: plid
            },
        });
    }


    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '入庫單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div>
                        <Thead01 type={'PickingList'} />
                        <Tbody01 type={'PickingList'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
                <div className={scss.right}>
                    <br />
                    <span style={{ display: picked === "false" ? "" : "none" }}>
                        <MyButton_v2 px='px22' py='py4' theme='danger' label="領料" onClick={() => { gotoPick() }} />
                    </span>
                    <span style={{ display: picked === "true" ? "" : "none" }}>
                        <MyButton_v2 disabled={true} px='px22' py='py4' theme={undefined} label="已領" onClick={() => { alert("領料托盤") }} />
                    </span>
                    <div className={scss.childmain}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="領料單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: plid ? plid : ' ',
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料日期"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: create_at ? create_at : ' ',
                                    },
                                }}
                            />


                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="工單單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: lotid ? lotid : ' ',
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料人員"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: create_by ? create_by : ' ',
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className={scss.main1}>
                        <InputSel {...inputSelProps}
                            caption="主件項目"
                            disabled={true}
                            textareaProps={{
                                props: {
                                    value: main_item ? main_item : ' ',

                                },
                            }}
                        />
                        <InputSel {...inputSelProps}
                            caption="備註"
                            disabled={true}
                            textareaProps={{
                                props: {
                                    value: note ? note : ' ',

                                },
                            }}
                        />
                    </div>
                    <br />
                    <div className={scss.maincontent}>
                        <Thead01 type={'PickingDetailList'} />
                        <Tbody01 type={'PickingDetailList'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
            </div>
        </SubLayer>

    )

}