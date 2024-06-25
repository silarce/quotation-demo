import { useState, MouseEvent, createContext, useEffect, Key, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './pickingList.module.scss';
import Thead01 from '../../ui/table/thead01';
import Tbody01 from '../../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';





type Tquery = {
    wareHouseId: string | undefined;
};



export default function PickingList() {
    const router = useRouter();
    const { type, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    const { userInfo } = useContext(AppContext);

    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);


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

    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const keywordWhpname = valueArr[0] as string;
        const keywordMaterialnumber = valueArr[1] as string;
        const keywordSpec = valueArr[2] as string;

        // alert(keywordWhpname + "-" + keywordMaterialnumber + "-" + keywordSpec);


        // alert(keywordWhpname==='');

        // if (keywordWhpname === '' || keywordWhpname === undefined &&
        //     keywordMaterialnumber === '' || keywordMaterialnumber === undefined &&
        //     keywordSpec === '' || keywordSpec === undefined) {
        //     fetchData();
        // } else {
        searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
        // }
    };




    const searchGroup = {
        searchTargetList,
        doSearch,
    };


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
        // status === 'Contracting' ? attatchBtn : null,
        // {
        //     type: 'addButton',
        //     label: '新增倉庫',
        //     onClick: () => {
        //         router.push({
        //             pathname: `/factoryDepartment/addWareHouse`,
        //             query: {
        //                 status,
        //             },
        //         });
        //     },
        // },
    ];



    useEffect(() => {
        fetchData();
    }, []);



    //call api
    const fetchData = async () => {
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
            let data = await response.json();
            setData(data);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const fetchData1 = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                plnumber: string | undefined;
            } = {
                plnumber: "2024062500002" as string | undefined,
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
        fetchData1();
    }, []);

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

    function gotoPick() {
        router.push({
            pathname: `/factoryDepartment/getMaterial/pickingListDetail`,
            query: {
                type: 'Tray',
            },
        });
    }


    return (


        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '領料單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    {/* <div className={scss.top}> */}
                    <div>
                        <Thead01 type={'PickingList'} />
                        <Tbody01 type={'PickingList'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                        {/* </div> */}
                    </div>
                </div>
                <div className={scss.right}>
                    <br />
                    <MyButton_v2 px='px22' py='py4' theme='danger' className={scss.addBtn} label="領料" onClick={() => { gotoPick() }} />
                    <MyButton_v2 disabled={true} px='px22' py='py4' theme='transparent' className={scss.addBtn} label="已領料" onClick={() => { alert("領料托盤") }} />
                    <div className={scss.childmain}>
                        <div>
                            {/* <input type="texts" style={{border:'1px solid gray'}}/> */}
                            <InputSel
                                {...inputSelProps}
                                caption="領料單號:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024062500002",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料日期:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "113-06-25 ",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="領料人員:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "賴彥廷3",
                                    },
                                }}
                            />

                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="工單單號:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024062500002",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="派工日期:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "2024/06/25",
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="主件項目:"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: "無",
                                    },
                                }}
                            />

                        </div>
                    </div>
                    <Thead01 type={'PickingDetailList'} />
                    <Tbody01 type={'PickingDetailList'} data={data1} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                </div>
            </div>
        </SubLayer>

    )

}