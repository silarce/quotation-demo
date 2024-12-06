import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _, { filter } from 'lodash';

import scss from './PRequisitionList.module.scss';
import Thead01 from '../ui/table/thead01';
import Tbody01 from '../ui/table/tbody01';
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { setting } from '../wareHouseList/index';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { AppContext } from 'pages/_app';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg';
import { Button, DatePicker, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_search from 'public/image/icon/fc_search.svg';
import icon_collapse_right from 'public/image/icon/fc_collapse_right.svg';
import icon_collapse_left from 'public/image/icon/fc_collapse_left.svg';
import icon_detail from 'public/image/icon/fc_detail.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';
import icon_close from 'public/image/icon/fc_close.svg';
import MyDatePicker from 'components/global/gear/inputAndSel_v2/cog/myDatePicker';
import icon_disable from 'public/image/icon/fc_disable.svg';
import icon_print from 'public/image/icon/fc_printer.svg';
import { color } from 'html2canvas/dist/types/css/types/color';
import { orange } from '@mui/material/colors';
import icon_remove from 'public/image/icon/fc_remove.svg';
import icon_fc_arrow_up from 'public/image/icon/fc_arrow_up.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_open_gray from 'public/image/icon/fc_task_open_gray.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_task_approved from 'public/image/icon/fc_approved.svg';
import icon_task_rejected from 'public/image/icon/fc_rejected.svg';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_sent_review from 'public/image/icon/fc_sent_review.svg';
import icon_sent_review_gray from 'public/image/icon/fc_sent_review_gray.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_flow from 'public/image/icon/fc_flow.svg';
import icon_review from 'public/image/icon/review.svg';
import icon_flow_gray from 'public/image/icon/fc_flow_gray.svg';
import icon_sent_review_stop from 'public/image/icon/fc_sent_review_stop.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import icon_fc_quotereq from 'public/image/icon/fc_quotereq.svg';
import icon_export from 'public/image/icon/fc_export.svg';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';

export default function PurchaseRequisitionList() {
    //登入者資料
    const { userInfo } = useContext(AppContext);

    //路由參數
    const router = useRouter();
    const {
        viewtype, // 判斷審核的,
        reviewflow
    } = router.query;

    //變數宣告
    //載入動畫
    const [isLoading, setIsLoading] = useState(false);


    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data1restore, setData1Restore] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchdata, setSearchdata] = useState<any[]>([]);


    
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


    //頁面進入
    useEffect(() => {
        getPurchaseRequisition();
    }, []);


    //api
    const getPurchaseRequisition = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: "詢價中",
                username: userInfo?.employee?.id.toString()
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetPurchaseRequisition?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setData1Restore(data);
            setSearchdata(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
            // console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




    //方法


    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };


    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={'請購單列表'} />
            <div>
                <Thead01 type={'PRequisition'} />
                <div>
                    {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                    {data && (
                        data.map((_item: any, index: number) => (
                            <CellWithBar key={index} className={scss.panelHeader15}>
                                <div
                                    key={index}
                                    className={`${scss.row01} 
                                    ${_item.purchaserequisitionid === selectedItemId ? scss.selectedRow : ''}`}
                                // onClick={() => { GetPurchaseRequisition(_item) }}
                                >
                                    <span>{index + 1}</span>
                                    <span>{_item.purchaserequisitionid}</span>
                                    <span>{getTaiwanDateStr(_item.create_at)}</span>
                                    {/* <span>{_item.totalprice.toLocaleString()}</span> */}
                                    <span style={{ color: _item.status === "已結案" ? '#14256a' : _item.status === "詢價中" ? '#28a745' : '#ea1833' }}>
                                        {_item.status}
                                    </span>
                                    <span>{_item.note}</span>
                                    {/* <span>{_item.create_by}</span> */}
                                    {/* <span ><IconDetail onClick={() => { GetPurchaseRequisition(_item) }} /></span> */}
                                </div>
                            </CellWithBar>
                        ))
                    )}
                </div>

            </div>
        </SubLayer >


    )

}