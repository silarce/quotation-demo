import { useState, MouseEvent, createContext, useEffect, Key, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './purchaseOrderList.module.scss';
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



export default function purchaseOrderList() {
    const router = useRouter();
    const {
        purchaseorderid,
        create_at,
        create_by,
        receipted,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice
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
            placeholder: '採購單號',
        },
        {
            placeholder: '採購日期',
        },
        {
            placeholder: '採購人員',
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
            label: '新增採購單',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addPurchaseOrder`,
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
    const getPurchaseOrder = async () => {
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
            const response = await fetch(`${setting.apipath}GetPurchaseOrder?${queryParams}`);
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
        getPurchaseOrder();
    }, []);

    //取對應的採購明細
    const getPickingListDetail = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                // plid: string | undefined;
            } = {
                // plid: plid as string | undefined,
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
    }, [purchaseorderid]);


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
    function gotoReceipt() {
        // router.push({
        //     pathname: `/factoryDepartment/getMaterial/pickingListDetail`,
        //     query: {
        //         //傳入領料單單號
        //         plid: plid
        //     },
        // });
    }


    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '採購單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div>
                        <Thead01 type={'PurchaseOrder'} />
                        <Tbody01 type={'PurchaseOrder'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.tite_main}>
                        <div>
                            {/* <span style={{ fontSize: '25px', fontWeight: 'bolder', color: '#14256a'}}>
                                採購單
                            </span> */}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: receipted === "false" ? "" : "none" }}>
                                <MyButton_v2 px='px22' py='py4' theme='danger' label="進貨" onClick={() => { gotoReceipt() }} />
                            </span>
                            <span style={{ display: receipted === "true" ? "" : "none" }}>
                                <MyButton_v2 disabled={true} px='px22' py='py4' theme={undefined} label="已進貨" onClick={() => { alert("領料托盤") }} />
                            </span>
                        </div>
                    </div>
                    <div className={scss.head_main}>
                        <div>

                            <InputSel
                                {...inputSelProps}
                                caption="採購單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: purchaseorderid ? purchaseorderid : ' ',
                                    },
                                }}
                            />


                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="採購日期"
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
                                caption="採購人員"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: create_by ? create_by : ' ',
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className={scss.content_main}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="廠商名稱"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: suppliername ? suppliername : ' ',
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="統一編號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: suppliertaxid ? suppliertaxid : ' ',
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="廠商地址"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: supplieraddress ? supplieraddress : ' ',
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="聯絡電話"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: supplierphone ? supplierphone : ' ',
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="發票號碼"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: invoice ? invoice : ' ',
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <br />
                    <div className={scss.content_main_content}>
                        <Thead01 type={'PickingDetailList'} />
                        <Tbody01 type={'PickingDetailList'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
            </div>
        </SubLayer>

    )

}