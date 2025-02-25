import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './poMapping.module.scss';
import { useState } from "react";
import { setting } from '../wareHouseList/index';
import CellWithBar from "components/global/gear/cell/cellWithBar";

export default function PoMapping() {
    //#region ===========【頁面參數】
    const [pagename, setPagename] = useState<string>("工單對應")
    const [statusarea, setStatusarea] = useState<boolean>(false)
    const [excelopen, setExcelopen] = useState<boolean>(true)
    const [printopen, setPrintopen] = useState<boolean>(false)
    const [reviewopen, setReviewopen] = useState<boolean>(false)
    const [transopen, setTransopen] = useState<boolean>(false)

    //#endregion
    //#region ===========【變數宣告】
    //資料列宣告
    const [data, setData] = useState<any[]>([]);


    //錯誤訊息處理
    const [error, setError] = useState<string | null>(null);


    //#endregion

    //#region ===========【API】

    //以ID取單據
    const Get = async (id: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                purchaseorderuuid: id as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/NewGetPurchaseOrderDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();

            setData(responsedata);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };
    //#endregion


    return (
        <SubLayer isLoading_subLayer={false} className='overflow-hidden'>
            <PageHeader02 tag={`工單對應`} panelList={undefined} />
            <div className={scss.thead1}>
                <span>名稱</span>
                <span>地址</span>
                <span>統編</span>
                <span></span>
            </div>
            {data && (
                data.map((_item, index) => (
                    <CellWithBar
                        key={index}
                        className={scss.panelHeader1}
                        onClick={() => {
                            alert(_item.id);
                        }}
                    >
                        <div className={scss.row01}>
                            <span>{_item.customer_number}</span>
                            <span>{_item.name}</span>
                            <span>{_item.county}{_item.district}{_item.address}</span>
                        </div>
                    </CellWithBar>
                ))
            )}

        </SubLayer >

    );
}