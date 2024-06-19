import { useState, MouseEvent, createContext, useEffect, Key } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './whPositionList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';
import { TquotationStatus } from 'js/api/dtoTypes';
import { quotationStatusLookup } from 'config/lookupTable';
import PageHeader02, { Toption } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { setting } from '../wareHouseList/index'; // 從 wareHouseList 模組中導入設定'


type Tquery = {
    wareHouseId: string | undefined;
};


export default function WHPositionList() {
    const router = useRouter();
    const { type, whid, trayname, whname, traycalled, traycalledname, traytransfer, url } = router.query;


    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // 将 error 的类型更改为 Error | null
    const [traycalledin, setTrayCalled] = useState<boolean>(traycalled === 'true');


    const status = router.query.status as TquotationStatus;
    // const traycode =router.query.whid as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    //search keyword
    const [DataByKeWord, setDataByKeWord] = useState<any[]>([]);



    const doSearch = (valueArr: (string | Toption | null)[]) => {
        const serachbar = valueArr[0] as string;
    };

    const searchTargetList = [
        {
            placeholder: '請輸入名稱、料號或規格',
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
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                // alert(traycalledin);
                if (traycalledin === true) {
                    myAlert.warning({ title: '請先收回托盤' });
                } else {

                    router.push({
                        pathname: `/factoryDepartment/trayList`,
                        query: {
                            type: 'WareHouse',
                            whid: whid,
                            whname: whname,
                            traycalled: traycalled,
                            traycalledname: traycalledname,
                            traytransfer: traytransfer
                        }
                    });
                }
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
            // 傳給api的參數JSON
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

            //erpAPI
            const response = await fetch(`${setting.apipath}GetWHPosition?${queryParams}`);
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
            const response = await fetch(`${setting.apipath}SearchWHPositionByID?${queryParams}`);
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
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫名稱：' + whname + '｜托盤名稱：' + trayname} panelList={panelList} />
            <div>
                <Thead01 type={'WHPosition'} />
                <Tbody01 type={'WHPosition'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={url} />
            </div>
        </SubLayer>
    )

}