import { useState, MouseEvent, createContext, useEffect, Key } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './wareHouseList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { quotationStatusLookup } from 'config/lookupTable';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TquotationStatus } from 'js/api/dtoTypes';



type Tquery = {
    wareHouseId: string | undefined;
};


// export default function WareHouseList({type}:ListType) {
export default function TrayList() {

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // 将 error 的类型更改为 Error | null

    const router = useRouter();
    const { type, whid, whname } = router.query;
    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);

    const searchTargetList = [
        {
            placeholder: '請輸入托盤名稱',
            // defaultValue: router.query.clientName as string,
        },

    ];

    const searchGroup = {
        searchTargetList,
        doSearch: (arr: any) => {
            const keyword = arr[0] as string;
            if (keyword === '' || keyword === undefined) {
                fetchData();
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
                        whname: whname
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
                        whname: whname
                    }
                });
                //   if (!!outsourcingId) {
                //     setDisabled(true);
                //   } else {
                //     router.push('./');
                //   }
            },
        },
    ];



    useEffect(() => {
        fetchData();
    }, []);



    //call api
    const fetchData = async () => {
        try {
            setIsLoading(true);
            // const response = await fetch('YOUR_C#_API_ENDPOINT');
            //erpAPI
            const response = await fetch(`https://localhost:44383/WareHouse/GetTray?Input=${whid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log("vvvvv" + data);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    };

    const searchData = async (keyword: string) => {
        try {
            setIsLoading(true);
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
            const response = await fetch(`https://localhost:44383/WareHouse/SearchTrayByID?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log("GetWHPosition:" + data);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };





    return (

        <SubLayer isLoading_subLayer={isLoading}>
            {/* <> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫編號：' + whname} panelList={panelList} />
            <div>
                <Thead01 type={'Tray'} />
                <Tbody01 type={'Tray'} data={data} error={error} />
            </div>
            {/* </> */}
        </SubLayer>
        // <div>


        //     <Thead01 type={'Tray'} />
        //     <Tbody01 type={'Tray'} data={data} error={error} />
        // </div>
    )


}