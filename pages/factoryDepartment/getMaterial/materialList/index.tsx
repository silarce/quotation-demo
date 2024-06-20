import { useState, MouseEvent, createContext, useEffect, Key, useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './materialList.module.scss';
import Thead01 from '../../ui/table/thead01';
import Tbody01 from '../../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { TquotationStatus } from 'js/api/dtoTypes';
import { setting } from '../../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';





type Tquery = {
    wareHouseId: string | undefined;
};



export default function MaterialList() {
    const router = useRouter();
    const { type, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;

    const { userInfo } = useContext(AppContext);

    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);

    // wareHouseList/index.js


    const searchTargetList = [
        {
            placeholder: '物料名稱',
        },
        {
            placeholder: '物料編號',
        },
        {
            placeholder: '物料規格',
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
            const conditionModel: { keyword: string | undefined; } = {
                keyword: "search" as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            //erpAPI
            const response = await fetch(`${setting.apipath}GetMaterial?${queryParams}`);
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
        finally {
            setIsLoading(false);
        }
    };

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


    return (


        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '物料查詢'} panelList={panelList} />

            <div className={scss.main}>
                <div className={scss.left}>
                    {/* <div className={scss.top}> */}
                    <div>
                        <Thead01 type={'materialList'} />
                        <Tbody01 type={'materialList'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                        {/* </div> */}
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <Thead01 type={'GetMatWarehouseList'} />
                        <Tbody01 type={'GetMatWarehouseList'} data={data1} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={undefined} whnamecalled={whnamecalled} />
                    </div>
                </div>
            </div>
        </SubLayer>

    )

}