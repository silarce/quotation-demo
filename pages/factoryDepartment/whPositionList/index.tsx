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
import { setting } from '../wareHouseList/index';


type Tquery = {
    wareHouseId: string | undefined;
};


export default function WHPositionList() {
    //#region 路由參數
    //路由參數
    const router = useRouter();
    const { type, whid, trayname, whname, traycalled, traycalledname, traytransfer, url, whnamecalled } = router.query;
    //#endregion

    const status = router.query.status as TquotationStatus;
    //#region 參數宣告
    //頁面回傳資料
    const [data, setData] = useState<any[]>([]);
    //錯誤訊息設定(可以拿掉)
    const [error, setError] = useState<string | null>(null);
    //是否有托盤已呼叫
    const [traycalledin, setTrayCalled] = useState<boolean>(traycalled === 'true');
    //set loading
    const [isLoading, setIsLoading] = useState(false);
    //search keyword
    const [DataByKeWord, setDataByKeWord] = useState<any[]>([]);

    //查詢功能內容
    const searchTargetList = [
        {
            placeholder: '請輸入名稱、料號或規格',
        },

    ];

    //查詢功能作動
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

    //上排右邊按紐區域
    const panelList: TpanelList = [
        { searchGroup },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                // if (traycalledin === true) {
                //     myAlert.warning({ title: '請先收回托盤' });
                // } else {

                router.push({
                    pathname: `/factoryDepartment/trayList`,
                    query: {
                        type: 'WareHouse',
                        whid: whid,
                        whname: whname,
                        traycalled: traycalled,
                        traycalledname: traycalledname,
                        traytransfer: traytransfer,
                        whnamecalled: whnamecalled
                    }
                });
                // }
            },
        },
    ];
    //#endregion


    //#region 監聽事件
    useEffect(() => {
        fetchData();
    }, []);
    //#endregion


    //#region call api
    //取資料api
    const fetchData = async () => {
        try {
            setIsLoading(true);

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
            const data = await response.json();
            setData(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    };

    //查詢api
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
                myAlert.err({ content: "Failed to fetch data" });
            }
            const data = await response.json();
            setData(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '倉庫名稱：' + whname + '｜托盤名稱：' + trayname} panelList={panelList} />
            <div>
                <Thead01 type={'WHPosition'} />
                <Tbody01 type={'WHPosition'} data={data} error={error} traycalled={traycalled} traycalledname={traycalledname} traytransfer={traytransfer} url={url} whnamecalled={whnamecalled} />
            </div>
        </SubLayer>
    )

}