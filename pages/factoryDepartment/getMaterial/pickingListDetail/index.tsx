import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './pickingListDetail.module.scss';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import router, { useRouter } from 'next/router';
import Thead01 from 'pages/factoryDepartment/ui/table/thead01';
import Tbody01 from 'pages/factoryDepartment/ui/table/tbody01';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { WrappedTextarea, inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { useEffect, useState } from 'react';
import { setting } from '../../wareHouseList';

export default function PickingListDetail() {
    const router = useRouter();
    const {
        plid,
        materialnumber,
        quantity
    } = router.query;

    //loading
    const [isLoading, setIsLoading] = useState(false);

    // data
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);


    //錯誤訊息 其實可以不用管了
    const [error, setError] = useState<string | null>(null);



    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };

    const materialnumberStr = getQueryParam(materialnumber);
    const quantityStr = getQueryParam(quantity);

    //取符合物料名稱，物料數量所在的托盤位置
    const [materialnumberin, setMaterialNumberIn] = useState<string | undefined>(materialnumberStr ? materialnumberStr : "");
    const [quantityin, setQuantityIn] = useState<string | undefined>(quantityStr ? quantityStr : 0);



    const status = router.query.status as TquotationStatus;

    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const keywordWhpname = valueArr[0] as string;
        const keywordMaterialnumber = valueArr[1] as string;
        const keywordSpec = valueArr[2] as string;
    };


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

    const searchGroup = {
        searchTargetList,
        doSearch,
    };


    const panelList: TpanelList = [
        // { searchGroup },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/getMaterial/pickingList`,
                    query: {
                        // type: 'WareHouse',
                    }
                });
            },
        },
    ];

    // 取pickinglistDetail
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

    // 取pickinglistDetail
    const getWareHouseAndWhpositionDetail = async () => {
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

    //取得物料的托盤位置
    const getWareHouseAndTray = async () => {
        try {
            const conditionModel: {
                materialnumber: string | undefined;
            } = {
                materialnumber: materialnumberin as string | undefined,
            };
        } catch (error) {

        }

    }


    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '領料單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div className={scss.childmain}>
                        <div>
                            {/* <input type="texts" style={{border:'1px solid gray'}}/> */}
                            <InputSel
                                {...inputSelProps}
                                caption="領料單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: plid ? plid : '',
                                    },
                                }}
                            />
                        </div>
                        <br />
                        <div className={scss.maincontent}>
                            <Thead01 type={'PickingDetailList2'} />
                            <Tbody01 type={'PickingDetailList2'} data={data1} error={undefined} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>
                    </div>
                </div>
                <div className={scss.middle}>
                    {/* <MyButton_v2 px='px22' py='py4' theme='danger' className={scss.addBtn} label="領料" onClick={() => { gotoPick() }} />
                    <MyButton_v2 disabled={true} px='px22' py='py4' theme='transparent' className={scss.addBtn} label="已領料" onClick={() => { alert("領料托盤") }} /> */}
                    <div className={scss.childmain}>
                        <Thead01 type={'GetMatWarehouseList'} />
                        <Tbody01 type={'GetMatWarehouseList'} data={data2} error={undefined} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                    {/* <Thead01 type={'PickingDetailList'} />
                    <Tbody01 type={'PickingDetailList'} data={data1} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} /> */}
                </div>
                <div className={scss.right}>

                </div>
            </div>
        </SubLayer >
    )
}