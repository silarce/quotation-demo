import { useState, MouseEvent, createContext, useEffect, Key } from 'react';
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





type Tquery = {
    wareHouseId: string | undefined;
};


// interface ListType {
//     type: string;
// }
export const setting = {
    apipath: 'https://localhost:44383/WareHouse/', // 確保這裡包含正確的 API 路徑
};


// export default function WareHouseList({type}:ListType) {
export default function WareHouseList() {

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // 将 error 的类型更改为 Error | null

    const router = useRouter();
    const { type } = router.query;
    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;

    // wareHouseList/index.js
   

    const searchTargetList = [
        {
            placeholder: '請輸入倉庫名稱',
        },
    ];


    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const keyword = arr[0] as string;
            // console.log("thisthishtishtis:" + keyword + "asdfasdfasdf");
            if (keyword === '' || keyword === undefined) {
                fetchData();
            } else {
                searchData(keyword);
            }
        }
    };


    const panelList: TpanelList = [
        { searchGroup },
        // status === 'Contracting' ? attatchBtn : null,
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



    useEffect(() => {
        fetchData();
    }, []);



    //call api
    const fetchData = async () => {
        try {
            // const response = await fetch('YOUR_C#_API_ENDPOINT');
            //erpAPI
            // const response = await fetch('https://localhost:44383/WareHouse/GetWareHouse');
            const response = await fetch(`${setting.apipath}GetWareHouse`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log("vvvvv" + data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const searchData = async (keyword: string) => {
        try {
            // 傳給api的參數JSON
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

            //erpAPI
            // const response = await fetch(`https://localhost:44383/WareHouse/SearchWareHouseByID?${queryParams}`);
            const response = await fetch(`${setting.apipath}SearchWareHouseByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log("GetWHPosition:" + data);
        } catch (error: any) {
            setError(error.message);
        }
    };


    return (

        <SubLayer isLoading_subLayer={false}>
            {/* <> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫'} panelList={panelList} />
            <div>
                {/* {apipath}<br/> */}
                <Thead01 type={'WareHouse'} />
                <Tbody01 type={'WareHouse'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} />
            </div>
            {/* </> */}
        </SubLayer>
    )

}