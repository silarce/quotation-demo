import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _, { filter } from 'lodash';

import scss from './purchaseRequisitionList.module.scss';
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


export default function PurchaseRequisitionList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaserequisitionuuid,
        purchaserequisitionid,
        create_at,
        create_by,
        approved,
        status,
        need_date,
        note,
        viewtype, // 判斷審核的,
        reviewflow
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };
    const create_chance = getQueryParam(create_at);


    //登入者資料
    const { userInfo } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data1restore, setData1Restore] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchdata, setSearchdata] = useState<any[]>([]);




    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);


    const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>("");
    const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [approvedin, setApprovedin] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [need_datein, setNeed_datein] = useState<string>("");
    const [notein, setNotein] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    // 預設截止日期為今天，起始日期為今天往前推30天
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    // 使用 Moment 類型作為狀態
    const [keywordstartdate, setKeywordstartdate] = useState<Moment | null>(defaultStartDate);
    const [keywordenddate, setKeywordenddate] = useState<Moment | null>(defaultEndDate);

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    //請購單價格計算
    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    //轉採購單項目的價格計算
    const [totalprice1, setTotalPrice1] = useState<string>("");
    const [taxprice1, setTaxPrice1] = useState<string>("");
    const [totalpayprice1, setTotalPayPrice1] = useState<string>("");

    //詢價總數
    const [totalreqprogress, setTotalreqprogress] = useState<string>("");
    //詢價進度
    const [quotereqprogress, setQuotereqprogress] = useState<string>("");
    //轉採購數
    const [transpoprogress, setTranspoprogress] = useState<number>(0);

    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);
    useEffect(() => {
        if (firstin !== undefined) {
            setCheckFirstIn(parseInt(firstin as string) || 0);
        }
    }, [firstin]);


    //#region 上方功能列

    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '請購單號',
        }
    ];



    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        // doSearch,
    };

    const searchData = async (keyword1: string, keyword2: string, keyword3: string) => {
        try {
            if (keyword1 === "" && keyword2 === "" && keyword3 === "") {
                setData(data1restore);
                return;
            }
            // keywordSpec
            const conditionModel: { keyword1: string | undefined, keyword2: string | undefined, keyword3: string | undefined } = {
                keyword1: getTaiwanDateStr(keyword1) as string | undefined,
                keyword2: keyword2 as string | undefined,
                keyword3: keyword3 as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}/WareHouse/SearchPurchaseRequisitionByDateAndId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            setData(data);


        } catch (error: any) {
            setError(error.message);
        }
    };



    //新增按鈕
    const panelList: TpanelList = [
        {
            type: 'addButton',
            label: '新增請購單',
            onClick: () => {
                // setOpen(true);
                router.push({
                    pathname: `/factoryDepartment/addPurchaseRequisition`,
                    query: {
                        type: 'AddPurchaseRequisition',
                    },
                });
            },
        },
    ];
    //#endregion

    //#region call api
    //請購單主檔
    const getPurchaseRequisition = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: "詢價中",
                username: userInfo?.username
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
            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                getPurchaseRequisitionDetail(data[0].purchaserequisitionuuid);
                setCreate_atin(data[0].create_at);
                setPurchaserequisitionuuidin(data[0].purchaserequisitionuuid);
                setPurchaserequisitionidin(data[0].purchaserequisitionid);
                setCreate_byin(data[0].create_by);
                setApprovedin(data[0].approved);
                setStatusin(data[0].status);
                setNeed_datein(data[0].need_date);
                setNotein(data[0].note);
                GetReviewById(data[0].purchaserequisitionuuid);//審核

            }
        } catch (error: any) {
            // console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // const GetReviewFlow = async () => {
    //     try {
    //         setIsLoading(true);
    //         const conditionModel = {
    //             username: userInfo?.username
    //         };


    //         var inputModel = {
    //             TypeName: 'ERP',
    //             ServiceName: 'ReviewService',
    //             FunctionName: 'no',
    //             FilterConditions: JSON.stringify(conditionModel),
    //         };



    //         const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

    //         const response = await fetch(`${setting.apipath}/Review/GetReviewFlow?${queryParams}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         const data = await response.json();

    //         setReviewdata(data);

    //         console.log(data);
    //         console.log(JSON.stringify(data));

    //         // getProduct();

    //         // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }

    // }

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getPurchaseRequisition();
            GetReviewFlow();//審核
            hasFetchedData.current = true;
        }
    }, []);


    //取對應的請購明細
    const getPurchaseRequisitionDetail = async (purchaserequisitionuuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel: {
                purchaserequisitionuuid: string | undefined
            } = {
                purchaserequisitionuuid: purchaserequisitionuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetPurchaseRequisitionDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData1(data);

            let totalprice = 0;
            data.forEach((element: { totalprice: any; }) => {
                totalprice += element.totalprice;
            });
            setTotalPrice(totalprice.toLocaleString());
            const taxPrice = Math.round(totalprice * 0.05);
            setTaxPrice(taxPrice.toLocaleString());
            const totalPayPrice = totalprice + taxPrice;
            setTotalPayPrice(totalPayPrice.toLocaleString());

            // 詢價進度
            let totalquotereq = data.length;
            let alreadyquotereq = 0;
            data.forEach((element: { suppliername: any; }) => {
                if (element.suppliername != "" && element.suppliername != null && element.suppliername != undefined) {
                    alreadyquotereq += 1;
                }
            });
            setTotalreqprogress(totalquotereq);
            setQuotereqprogress(`${alreadyquotereq}`);

            //轉採購進度
            let transpoprogress = 0;
            data.forEach((element: { status: any; }) => {
                if (element.status != "" && element.status != null && element.status != undefined) {
                    transpoprogress += 1;
                }
            });
            setTranspoprogress(transpoprogress);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        // alert(purchaserequisitionuuid);
        // alert(purchaserequisitionid);
        if (purchaserequisitionuuid) {
            getPurchaseRequisitionDetail(purchaserequisitionuuid);
            setPurchaserequisitionidin(purchaserequisitionid as string);
            setPurchaserequisitionuuidin(purchaserequisitionuuid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setApprovedin(approved as string);
            setStatusin(status as string);
            setData2([]);
            setNeed_datein(need_date as string);
            setNotein(note as string);
            GetReviewById(purchaserequisitionuuid);
        }
    }, [purchaserequisitionuuid]);

    //取已對應採購單的已進貨明細
    const GetProdReceiptDetailByPurchaseOrderId = async (purchaserequisitionuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                purchaserequisitionuuid: string | undefined
            } = {
                purchaserequisitionuuid: purchaserequisitionuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetProdReceiptDetailByPurchaseOrderId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData2(data);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const TransferPurchaseRequisitionToPurchaseOrder = async () => {
        try {

            console.log(data2);
            setIsLoading(true);
            const conditionModel = {
                purchaserequisitionuuid: checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid as string | undefined,
                purchaserequisitionid: checkfirstin === 0 ? purchaserequisitionidin : purchaserequisitionid as string | undefined,
                totalprice1: totalprice1,
                taxprice1: taxprice1,
                totalpayprice1: totalpayprice1,
                username: userInfo?.username,
                needdate: need_datein,
                data: data2,
                note: notein
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/TransferPurchaseRequisitionToPurchaseOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });


            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            // const data = await response.json();
            const data = await response.json();
            myAlert.info(
                {
                    title: '單據新增成功',
                    content: `採購單號為:${data}`
                })
            getPurchaseRequisition();
            getPurchaseRequisitionDetail(purchaserequisitionuuidin);

            setData2([]);



            // GetProdReceiptDetailByPurchaseOrderId(checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //送出審核
    // const sentToReview = async (type: any) => {

    //     // alert("送出審核");


    //     if (review_flow === "") {
    //         setReviewbar(true);
    //     }
    //     else {
    //         alert("yo");
    //         const review_query = {
    //             purchaserequisitionuuid: purchaserequisitionuuidin,
    //             purchaserequisitionid: purchaserequisitionidin,
    //             create_at: create_atin,
    //             create_by: create_byin,
    //             status: '詢價中',
    //             need_date: need_datein,
    //             note: notein,
    //             firstin: 1,
    //         };

    //         console.log(JSON.stringify(review_query));

    //         // return;
    //         const conditionModel = {
    //             document_id: purchaserequisitionid,
    //             document_uuid: purchaserequisitionuuid,
    //             document_type: "請購單",
    //             review_id: review_flow,
    //             query: review_query,
    //             username: userInfo?.username
    //         };

    //         var inputModel = {
    //             TypeName: 'ERP',
    //             ServiceName: 'ReviewService',
    //             FunctionName: 'no',
    //             FilterConditions: JSON.stringify(conditionModel),
    //         };


    //         const response = await fetch(`${setting.apipath}/Review/AddReview`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(inputModel)
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         const data = await response.json();
    //         await new Promise(resolve => setTimeout(resolve, 500));






    //     }




    //     return;



    //     try {
    //         setIsLoading(true);
    //         const conditionModel: {
    //             type: string | undefined,
    //             purchaserequisitionuuid: string | undefined,
    //             username: string | undefined
    //         } = {
    //             type: type,
    //             purchaserequisitionuuid: purchaserequisitionuuidin as string | undefined,
    //             username: userInfo?.username as string | undefined
    //         };


    //         var inputModel = {
    //             TypeName: 'ERP',
    //             ServiceName: 'WareHouseService',
    //             FunctionName: 'no',
    //             FilterConditions: JSON.stringify(conditionModel),
    //         };

    //         const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

    //         const response = await fetch(`${setting.apipath}/WareHouse/sentPRToReview?${queryParams}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         const data = await response.json();
    //         // setData(data);
    //         await new Promise(resolve => setTimeout(resolve, 500));
    //         getPurchaseRequisition();
    //         getPurchaseRequisitionDetail(purchaserequisitionuuidin);
    //         await new Promise(resolve => setTimeout(resolve, 500));



    //         let status = '';
    //         switch (type) {
    //             case '請購':
    //                 status = '詢價中';
    //                 break;
    //             case '詢價':
    //                 status = '審核中';
    //                 break;
    //             case '核准':
    //                 status = '已核准';
    //                 break;
    //             case '駁回':
    //                 status = '已駁回';
    //                 break;
    //             case '結案':
    //                 status = '已結案';
    //                 break;
    //             default:
    //                 status = '未知狀態'; // 或者你可以選擇其他合適的默認值
    //                 break;
    //         }

    //         setStatusin(status);
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // }



    //#endregion
    // 轉為採購單
    function handlePO() {
        if (data2.length === 0) {
            myAlert.warning({ title: "尚未加入任何採購項目" });
        } else {
            myAlert.confirm({
                title: '確定要新增採購單嗎?',
                content: <>
                    <h1>請確認數量、金額是否正確或是否為同一間廠商</h1>
                </>,
                props: {
                    onOk: () => {
                        TransferPurchaseRequisitionToPurchaseOrder();
                    }
                }
            });
        }
    }



    // 編輯狀態控制
    // 一次只提供編輯一列
    const handleEditStatus = (index: number) => {
        setEditRowId(index);
        setEditStatus(true);
        setData2Restore(data2);
    };

    const handleSaveEdit = (index: number) => {
        setEditStatus(false);
        console.log(data2);
    };


    const handleRemove = (index: number) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
    };


    const handleChange = (index: number, value: string | number) => {
        setData2(prevState => {
            const updatedData = [...prevState];
            updatedData[index] = {
                ...updatedData[index],
                quantity: value // 更新 quantity 屬性的值
            };
            return updatedData;
        });
    };

    const handleRestore = () => {
        setData2(data2restore);
    }

    const goQuotereqDetailList = (item: any) => {
        console.log(item);
        router.push({
            pathname: `/factoryDepartment/quotereqDetailList`,
            query: {
                purchaserequisitionuuid: checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid,
                quoterequuid: item.quoterequuid,
                need_date: need_datein,
                purchaserequisitionid: item.purchaserequisitionid,
                create_at: getTaiwanDateStr(item.create_at),
                create_by: item.create_by,
                approved: item.approved,
                status: item.status,
                note: item.note,
            },
        });
    }

    const handleAddToList = (item: any) => {
        console.log(item);

        // 檢查 suppliername 是否存在
        if (item.suppliername === null || item.suppliername === undefined || item.suppliername === '') {
            myAlert.warning({ title: '尚未詢價', content: '請確認是否詢價完畢，並確認供應商' });
        } else {
            // 檢查是否有不同供應商
            if (data2.length > 0 && data2[0].suppliername !== item.suppliername) {
                myAlert.warning({ title: '不同供應商', content: '不同供應商不能放在同一個清單中採購' });
            } else {
                // 檢查是否已經存在於列表中
                if (!data2.find(existingItem => existingItem.purchaserequisitiondetailuuid === item.purchaserequisitiondetailuuid)) {
                    // 將 item 加入到 data2 中
                    setData2(prevData2 => [...prevData2, item]);
                }
            }
        }
    };


    useEffect(() => {
        // 每次 data2 更新時，重新計算總價和稅金
        let totalprice = 0;
        data2.forEach((element) => {
            totalprice += element.totalprice;
        });
        setTotalPrice1(totalprice.toLocaleString());
        const taxPrice = Math.round(totalprice * 0.05);
        setTaxPrice1(taxPrice.toLocaleString());
        const totalPayPrice = totalprice + taxPrice;
        setTotalPayPrice1(totalPayPrice.toLocaleString());
    }, [data2]);




    //#region  詢價單modal
    const [prquotereqmodalopen, setPrquotereqmodalopen] = useState<boolean>(false);


    const [test, setTest] = useState<string>("");

    //帶入詢價單畫面的資料(欲詢價物料)
    const [quotereqname, setQuotereqname] = useState<string>("");
    const [quotereqspec, setQuotereqspec] = useState<string>("");
    const [quotereqquantity, setQuotereqquantity] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState('物料'); // 預設選項
    //對應詢價單主檔的詢價單明細
    const [prquotereqdata, setPrquotereqdata] = useState<any[]>([]);
    //確定廠商後更新請購單明細
    const [refreshpurchaserequisitiondetail, setRefreshpurchaserequisitiondetail] = useState<any>();

    //加入詢價廠商
    const [prquotereqadddata, setPrquotereqadddata] = useState({
        // id: "",id 自增長不用寫入
        quoterequuid: "",
        quotereqid: "",
        unitprice: "",
        totalprice: "",
        suppliername: "",
        deliverydate: moment(),
        unit: "",
        note: "",
        awarded: false
    });

    //得標廠商id，update回quotereqdetail
    const [lastselectedsupplier, setLastselectedsupplier] = useState<string>("");
    const [selectedsupplier, setSelectedsupplier] = useState<string>("");
    const [purchaserequisitiondetailuuid, setPurchaserequisitiondetailuuid] = useState<string>("");

    //打開詢價單modal
    const prQuotereqModalOpen = async (item: any) => {
        console.log(item);
        setSelectedsupplier(item.quotereqdetailuuid);

        setPurchaserequisitiondetailuuid(item.purchaserequisitiondetailuuid);
        // return;
        //清空
        prquotereqadddata.quoterequuid = "";
        prquotereqadddata.quotereqid = "";
        prquotereqadddata.unitprice = "";
        prquotereqadddata.totalprice = "";
        prquotereqadddata.suppliername = "";
        prquotereqadddata.deliverydate = moment();
        prquotereqadddata.unit = "";
        prquotereqadddata.note = "";
        prquotereqadddata.awarded = false;
        //預設詢價單主檔編號
        prquotereqadddata.quoterequuid = item.quoterequuid;
        prquotereqadddata.quotereqid = item.quotereqid;


        setQuotereqname(item.name);
        setQuotereqspec(item.spec);
        setQuotereqquantity(item.quantity);
        // getQuotereqDetail(item.quoterequuid);
        getQuotereqDetail(item.productid);
        setPrquotereqmodalopen(true);
        // setProductSearchmodalopen(true)
        // setPrquotereqmodalopen(true);
    }

    //關閉詢價單modal
    const prQuotereqModalClose = async () => {
        setPrquotereqmodalopen(false);
        setPrquotereqdata([]);
    }

    //取得對應詢價單主檔的詢價單明細檔
    const getQuotereqDetail = async (productid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel = {
                productid: productid as string | undefined,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetQuotereqDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            setPrquotereqdata(data);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };



    // 請購單查詢
    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }




    const UpdatePurchaserequisitionDetail = async (item: any) => {
        try {
            console.log(item);
            // console.log(item.id);
            // console.log(quotereqquantity);
            // console.log((parseInt(item.unitprice) * parseInt(quotereqquantity)).toString());

            // return;

            const conditionModel = {
                purchaserequisitiondetailuuid: purchaserequisitiondetailuuid,
                unitprice: item.detail_unitprice,
                totalprice: (parseInt(item.detail_unitprice) * parseInt(quotereqquantity)),
                suppliername: item.detail_suppliername,
                quotereqdetailuuid: item.detail_id,
                suppliertaxid: item.main_suppliertaxid,
                supplieraddress: item.main_supplieraddress,
                supplierphone: item.main_supplierphone
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/UpdatePurchaserequisitionDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();

            getPurchaseRequisitionDetail(purchaserequisitionuuidin);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }

    };
    // useEffect(() => {
    //     if (selectedsupplier) {
    //         // updateQuotereqDetail(selectedsupplier, lastselectedsupplier);
    //         UpdatePurchaserequisitionDetail(purchaserequisitiondetailuuid);
    //     }
    // }, [selectedsupplier]);


    // useEffect(() => {
    //     if (prquotereqdata && prquotereqdata.length > 0) {
    //         const quotereqdetailuuid = data1.find((item: any) => item.quotereqdetailuuid);
    //         if (quotereqdetailuuid) {
    //             setSelectedsupplier(quotereqdetailuuid.quotereqdetailuuid);
    //             setLastselectedsupplier(quotereqdetailuuid.quotereqdetailuuid);
    //             console.log(quotereqdetailuuid);
    //         }
    //     }
    // }, [prquotereqdata]);


    const handleSubmit = (e: any) => {

        e.preventDefault();
        searchData(keyword1, keyword2, keyword3);

    };

    //#endregion

    const filterData = () => {
        const startDate = keywordstartdate;
        const endDate = keywordenddate;
        const requisitionId = keyword2.trim();
        const status = keyword3.trim();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionId &&
            !status) {
            setSearchdata(data);
            return;
        }

        // 過濾資料
        let filteredData = data.filter(item => {
            const createAt = moment(item.create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        // 模糊查詢請購單號
        if (requisitionId) {
            filteredData = filteredData.filter(item =>
                item.purchaserequisitionid.toString().includes(requisitionId)
            );
        }

        // 模糊查詢單據狀態
        if (status) {
            filteredData = filteredData.filter(item =>
                item.status.toString().includes(status)
            );
        }

        setSearchdata(filteredData);
    };

    // 監聽條件變更
    useEffect(() => {
        filterData();
    }, [keywordstartdate, keywordenddate, keyword2, keyword3]);



    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        // setSearchdata(data);
    }


    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        // 定義事件處理器
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        // 在元件掛載時設置事件監聽器
        window.addEventListener('resize', handleResize);

        // 在元件卸載時移除事件監聽器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 空依賴陣列確保只在掛載和卸載時運行


    const Print = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("http://127.0.0.1:5050/api/print/GetIP");

            if (!response.ok) {
                myAlert.warning({ title: '請檢查列印程式是否開啟' });
                return;
            }

            const data = await response.text();
            console.log(data);
            sentToPrint(data);

        } catch (error: any) {
            const errorMessage = error.message || '未知錯誤';
            myAlert.warning({ title: '請檢查列印程式是否開啟', content: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };



    const sentToPrint = async (ip: any) => {
        myAlert.confirm({
            title: '確定要列印此單據嗎?',
            content: <>
                <h1>請確認單據是否詢價完成</h1>
            </>,
            props: {
                onOk: async () => {
                    try {
                        const conditionModel = {
                            id: purchaserequisitionidin,
                            type: "purchaserequisition",
                            clientip: ip,
                            data: []
                        };

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        console.log(JSON.stringify(inputModel));

                        const response = await fetch(`${setting.apipath}/WareHouse/Print`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const data = await response.text();
                        console.log(data);

                        await new Promise(resolve => setTimeout(resolve, 500));

                        const jsonData = JSON.stringify({
                            data: data,
                            type: "purchaserequisition"
                        });


                        const response2 = await fetch("http://127.0.0.1:5050/api/print/print3", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: data
                        });

                        if (!response2.ok) {
                            throw new Error(`Failed to fetch print4 data: ${response2.statusText}`);
                        }

                        const data2 = await response2.text();
                        console.log("Received from print4:", data2);



                    } catch (error: any) {
                        console.log(error.message);
                    }
                    finally {
                        // setIsLoading(false);
                    }
                }
            }
        });


    };

    const closeDoc = async (type: any) => {
        try {
            const conditionModel = {
                purchaserequisitionuuid: purchaserequisitionuuidin,
                type: type,
                username: userInfo?.username,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/sentPRToReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            getPurchaseRequisition();
            getPurchaseRequisitionDetail(purchaserequisitionidin);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    }


    //#region 審核
    const [review_flow, setReview_flow] = useState<string>("");
    const [reviewbar, setReviewbar] = useState<boolean>(false);
    const [reviewdata, setReviewdata] = useState<any[]>([]);
    const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
    const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
    const [documenttitle, setDocumenttitle] = useState<string>("");

    //取全部的自訂流程
    const GetReviewFlow = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                username: userInfo?.username
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewFlow?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const text = await response.text();
            if (!text) {
                // console.log('No data returned');
                setReviewdata([]);
                return;
            }

            const data = JSON.parse(text);
            setReviewdata(data);


        } catch (error: any) {
            console.log(error);
            // setError(error.message);
        }
        finally {
            setIsLoading(false);
        }

    }

    //取單據的審核流程
    const GetReviewById = async (document_uuid: any) => {
        try {
            setReviewflowdata([]);
            setReviewflowdata2([]);
            setIsLoading(true);

            const conditionModel = {
                document_uuid: document_uuid
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewById?${queryParams}`);

            // 檢查響應狀態
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // 檢查響應內容是否為空
            const text = await response.text();
            if (text.trim() === '') {
                // console.log('No data returned');
                return;
            }

            // 解析 JSON
            const data = JSON.parse(text);

            console.log(data);

            // 檢查資料是否存在且有效
            if (data && data.length > 0) {
                setReviewflowdata(data);
            } else {
                console.log('No valid data');
            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const [value, setValue] = useState<number | null>(null);
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const setReview = async (item: any) => {
        setReview_flow(item.id);
        setReviewflowdata2(item.stages);
    }

    const sentToReview = async (type: any) => {

        try {
            if (review_flow === "") {
                setReviewbar(true);
            }
            else {
                const review_query = {
                    purchaserequisitionuuid: purchaserequisitionuuidin,
                    purchaserequisitionid: purchaserequisitionidin,
                    create_at: create_atin,
                    create_by: create_byin,
                    status: '詢價中',
                    need_date: need_datein,
                    note: notein,
                    firstin: 1,
                };

                const conditionModel = {
                    document_id: purchaserequisitionidin,
                    document_uuid: purchaserequisitionuuidin,
                    document_type: "請購單",
                    review_id: review_flow,
                    query: review_query,
                    username: userInfo?.username,
                    document_title: documenttitle
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'ReviewService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/Review/AddReview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputModel)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setReviewflowdata([]);
                GetReviewById(purchaserequisitionuuidin);


                await new Promise(resolve => setTimeout(resolve, 500));

                //改變單據狀態
                const conditionModel2 = {
                    type: type,
                    purchaserequisitionuuid: purchaserequisitionuuidin as string | undefined,
                    username: userInfo?.username as string | undefined
                };


                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel2),
                };

                const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                const response2 = await fetch(`${setting.apipath}/WareHouse/sentPRToReview?${queryParams}`);
                if (!response2.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data2 = await response2.json();
                getPurchaseRequisition();
                getPurchaseRequisitionDetail(purchaserequisitionuuidin);

                setStatusin("審核中");





            }

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

    }

    const handleChoseflow = () => {
        setReviewbar(true);
        setDocumenttitle(`【請購單】【${purchaserequisitionidin}】_${userInfo?.username}`)
    }

    const handleGetReviewBack = () => {
        myAlert.confirm({
            title: '確定要抽單嗎?',
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            document_uuid: purchaserequisitionuuidin,
                        };

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };


                        const response = await fetch(`${setting.apipath}/Review/GetReviewBack`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }

                        setReviewflowdata([]);
                        setStatusin("詢價中");
                        setReview_flow("");
                        setValue(null);

                    } catch (error: any) {
                        console.log(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }
                }
            }
        });
    }
    //#endregion

    const handleGoToAddPR = () => {
        router.push({
            pathname: `/factoryDepartment/addPurchaseRequisition`,
            query: {
                type: 'AddPurchaseRequisition',
            },
        });
    }

    const handleCheckboxChange = (item: any) => {
        console.log(item);
        // return;
        // 更新選中的供應商
        setLastselectedsupplier(selectedsupplier);
        setSelectedsupplier(item.detail_id);
        UpdatePurchaserequisitionDetail(item);
    };

    const GoToQuotereq = async () => {
        router.push({
            pathname: `/factoryDepartment/quotereqList`,
            query: {

            },
        });
    }


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={'請購單'} panelList={viewtype === "review" ? undefined : panelList} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.left} style={{ display: `${leftbaropen === false ? 'none' : 'none'}` }}>
                    <div className={scss.content}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#fff',
                            zIndex: 1000
                        }}>
                            <form className={scss.modal_search_bar} onSubmit={handleSubmit} style={{ alignItems: 'center', width: '100%' }}>
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="請購日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                        datePickerProps={{
                                            props: {
                                                value: getTaiwanDateStr(keyword1 || '') ? moment(keyword1) : null,
                                                onChange: (e) => { setKeyword1((e?.toString() || '') || '') }
                                            }
                                        }}
                                    />
                                </div>
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="請購單號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword2 ? keyword2 : ' ',
                                                onChange: (e) => { setKeyword2(e.target.value) }
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ textAlign: 'right', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '5px' }}>
                                    <button className={scss.minibtn} type="submit">搜尋</button>
                                </div>
                                <div>
                                    <Thead01 type={'PurchaseRequisition'} />
                                </div>
                            </form>

                        </div>
                        {/* <hr /> */}
                        <div>
                            {/* <Thead01 type={'PurchaseRequisition'} /> */}
                            <Tbody01 type={'PurchaseRequisition'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>
                    </div>
                </div>

                <div className={scss.right}>

                    <div className={scss.content}>
                        <div className={scss.head_head1} style={{ display: viewtype === 'review' ? 'none' : '' }}>
                            <div>
                                {/* <button className={scss.minibtn} onClick={() => { setLeftbaropen(!leftbaropen) }}>
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                </button> */}
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { Print() }} title="列印">
                                    <img src={icon_print.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    列印
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { GoToQuotereq() }} title="詢價管理">
                                    <img src={icon_fc_quotereq.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    詢價
                                </button>
                            </div>
                            <div>
                                {/* <button style={{ display: `${statusin === '審核中' ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { sentToReview("核准") }} title="單據核准">
                                    <img src={icon_task_approved.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    核准
                                </button>
                                &nbsp;
                                <button style={{ display: `${statusin === '審核中' ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { sentToReview("駁回") }} title="單據核准">
                                    <img src={icon_task_rejected.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    駁回
                                </button> */}
                                {/* <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handleGoToAddPR() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button> */}
                            </div>
                            <div></div>
                            <div>
                                <button
                                    className={scss.squarebtn}
                                    onClick={() => { handleChoseflow() }}
                                    title="單據送審"
                                    style={{
                                        display: `${(parseInt(quotereqprogress) === parseInt(totalreqprogress) && statusin !== '審核中' && statusin !== '已核准' && statusin !== '已結案') ? '' : 'none'}`
                                    }}
                                >
                                    <img src={icon_flow.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    流程
                                </button>
                                <button
                                    className={scss.disablesquarebtn}
                                    title="審核流程"
                                    style={{
                                        display: `${(parseInt(quotereqprogress) < parseInt(totalreqprogress) || statusin === '審核中' || statusin === '已核准' || statusin === '已結案') ? '' : 'none'}`
                                    }}
                                >
                                    <img src={icon_flow_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    流程
                                </button>
                                &nbsp;
                                <button
                                    className={scss.squarebtn}
                                    style={{
                                        display: `${(parseInt(quotereqprogress) === parseInt(totalreqprogress) && statusin !== '審核中' && statusin !== '已核准' && statusin !== '已結案') ? '' : 'none'}`
                                    }}
                                    onClick={() => { sentToReview("審核") }}
                                    title="單據送審"
                                >
                                    <img src={icon_sent_review.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    送審
                                </button>
                                <button
                                    className={scss.disablesquarebtn}
                                    style={{
                                        display: `${(parseInt(quotereqprogress) < parseInt(totalreqprogress) || statusin === '審核中' || statusin === '已核准' || statusin === '已結案') ? '' : 'none'}`
                                    }}
                                    title="單據送審"
                                >
                                    <img src={icon_sent_review_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    送審
                                </button>

                                &nbsp;
                                <button className={scss.squarebtn} style={{ display: `${statusin === '審核中' ? '' : 'none'}` }} title="單據送審" onClick={() => { handleGetReviewBack() }}>
                                    <img src={icon_sent_review_stop.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    抽單
                                </button>

                                <button style={{ display: `${parseInt(transpoprogress.toString()) === parseInt(totalreqprogress) && statusin === '已核准' ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { closeDoc("結案") }} title="單據結案">
                                    <img src={icon_task_open.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button>
                                <button style={{ display: `${parseInt(transpoprogress.toString()) != parseInt(totalreqprogress) && statusin === '已核准' ? '' : 'none'}` }} className={scss.disablesquarebtn} title="單據未結">
                                    <img src={icon_task_open_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    未結
                                </button>
                                <button style={{ display: `${statusin === '已結案' ? '' : 'none'}` }} className={scss.disablesquarebtn} title="單據已結">
                                    <img src={icon_task_close.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    已結
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="請購單號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? purchaserequisitionidin : purchaserequisitionid) || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="需用日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(need_datein as string || '') || '' : getTaiwanDateStr(need_date as string || '') || '') || ' ',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="請購日期"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at) || ' ',
                                                    // value: checkfirstin
                                                },
                                            }}
                                        />

                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="請購人員"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: (checkfirstin === 0 ? create_byin : create_by) || ' ',
                                                },
                                            }}
                                        />
                                        {/* {review_flow}
                                        {statusin} */}
                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: checkfirstin === 0 ? (notein || ' ') : (note || ' '),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.head_content3}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className={scss.head_foot1}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div style={{ textAlign: 'right' }}>

                                        {/* <span style={{ display: `${parseInt(quotereqprogress, 10) === parseInt(totalreqprogress, 10) && statusin === '詢價中' ? '' : 'none'}` }}>
                                    <MyButton_v2 px='px22' py='py4' theme='danger' label="送出審核" onClick={() => { sentPRToReview("詢價") }} />
                                </span>
                                <span style={{ display: `${parseInt(quotereqprogress, 10) === parseInt(totalreqprogress, 10) ? 'none' : ''}` }}>
                                    <button className={scss.disabledbtn} onClick={() => { myAlert.warning({ title: '詢價尚未完成' }) }}>送出審核</button>
                                </span>
                                <span style={{ display: `${statusin === '審核中' ? '' : 'none'}` }}>
                                    <button className={scss.redbtn} onClick={() => { sentPRToReview("核准") }}>核准</button>
                                </span>
                                &nbsp;
                                <span style={{ display: `${statusin === '審核中' ? '' : 'none'}` }}>
                                    <button className={scss.greenbutton} onClick={() => { sentPRToReview("駁回") }}>駁回</button>
                                </span>
                                <span style={{ display: `${parseInt(transpoprogress.toString()) === parseInt(totalreqprogress) && statusin === '已核准' ? '' : 'none'}` }}>
                                    <button className={scss.redbtn} onClick={() => { sentPRToReview("結案") }}>結案</button>
                                </span>
                                <span style={{ display: `${statusin === '已結案' ? '' : 'none'}` }}>
                                    <button className={scss.disabledbtn}>已結案</button>
                                </span> */}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: statusin || ' ',
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="詢價進度"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: `${quotereqprogress}/${totalreqprogress}`,
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="已轉採購"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: `${transpoprogress}/${totalreqprogress}`,
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={scss.head_foot2}>
                            <div>
                                {/* <button style={{ display: `${statusin === '已結案' ? 'none' : ''}` }} className={scss.minibtn} onClick={() => { goQuotereqDetailList('all') }}>
                                    詢價紀錄
                                </button>
                                <button style={{ display: `${statusin === '已結案' ? '' : 'none'}` }} className={scss.minidisabledbtn} >
                                    詢價紀錄
                                </button> */}
                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1}>
                            <Thead01 type={'PurchaseRequisitionDetail'} />
                            {data1 && (
                                data1.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader16} >
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span>{_item.quantity}</span>
                                            <span>{_item.unit}</span>
                                            {/* <span><IconDetail onClick={() => goQuotereqDetailList(_item)} /></span> */}
                                            <span>
                                                {/* <IconDetail onClick={() => prQuotereqModalOpen(_item)} /> */}
                                                {/* icon_fc_quotereq */}
                                                <button
                                                    onClick={() => {
                                                        if (viewtype !== 'review') {
                                                            prQuotereqModalOpen(_item);
                                                        }
                                                    }}
                                                    disabled={_item.reviewtype === 'review'} // 如果 reviewtype 是 'review'，禁用按鈕
                                                >
                                                    <img src={icon_fc_quotereq.src} alt="checkquotereqhistory" style={{ width: '20px', height: '20px' }} />
                                                </button>

                                            </span>
                                            <span>{_item.unitprice.toLocaleString()}</span>
                                            <span>{_item.totalprice.toLocaleString()}</span>
                                            <span>{_item.suppliername}</span>
                                            <span>
                                                <button onClick={() => { handleAddToList(_item) }} style={{ display: `${(_item.suppliername != null && _item.suppliername != "") && _item.status != "已轉採購" && statusin == "已核准" ? '' : 'none'}` }}>
                                                    <img src={icon_fc_arrow_down.src} alt="addtoList" style={{ width: '20px', height: '20px' }} />
                                                </button>
                                                <button style={{ display: `${(_item.suppliername != null && _item.suppliername != "") && _item.status != "已轉採購" && statusin == "已核准" ? 'none' : ''}` }}>
                                                    <img src={icon_fc_arrow_down_gray.src} alt="addtoList" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                </button>
                                            </span>
                                            <span className="truncate" title={_item.note}>{_item.note}</span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>

                        <div className={scss.body_foot1}>
                            <div>
                                流程順序：詢價{'>'}審核{'>'}加入清單{'>'}轉採購單<br />
                                (1).詢價請至詢價管理操作，詢價完畢後請送出審核<br />
                                (2).待審核完畢後請依廠商分類，將項目加入下方清單轉為採購單。
                            </div>
                            <div></div>
                            <div>
                                <table className={scss.count_table}>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>小計</td>
                                        <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalprice ? totalprice : '0'}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className={scss.body_foot2}>
                            <div>
                                {reviewflowdata.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                                        {item.stages.map((stage: any, stageIndex: any) => (
                                            <div key={stageIndex} style={{ flex: 1, flexDirection: 'column', textAlign: 'left', marginRight: '10px' }}>
                                                <span style={{ fontSize: '18px', color: '#14256a' }}>{stage.review_title}</span>
                                                <br />
                                                <span style={{ fontSize: '16px' }}>{stage.review_person}</span>
                                                <span style={{ padding: '0px 5px', display: `${stage.review_time === "0001-01-01T00:00:00" ? 'none' : ''}` }}>
                                                    <img src={icon_review.src} alt="review_status" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                                    {reviewflowdata2.map((item, index) => (
                                        <div key={index} style={{ textAlign: 'left', flex: 1 }}>
                                            <span style={{ fontSize: '18px', color: '#14256a' }}>{item.stage_user_title}</span>
                                            <br />
                                            <span style={{ fontSize: '16px' }}>{item.stage_user_name}</span>
                                            {/* <span style={{ padding: '0px 5px' }}>
                                                <img src={icon_review.src} alt="review_status" style={{ color: 'red', width: '20px', height: '20px' }} />
                                            </span> */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <br />
                        <div style={{ display: viewtype === "review" ? 'none' : '' }}>
                            <div className={scss.foot_head1}>
                                <div>
                                    <button style={{ display: `${data2.length > 0 && statusin === '已核准' ? '' : 'none'}` }} className={scss.squarebtn} onClick={() => { handlePO() }} title="新增單據">
                                        <img src={icon_fc_add2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        新增
                                    </button>
                                    <button style={{ display: `${data2.length > 0 && statusin === '已核准' ? 'none' : ''}` }} className={scss.disablesquarebtn} title="新增單據">
                                        <img src={icon_add2_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                        新增
                                    </button>
                                </div>
                                <div></div>
                                <div></div>
                                <div style={{ textAlign: 'right' }}>

                                    {/* <span style={{ display: `${data2.length > 0 && statusin === '已核准' ? '' : 'none'}` }}>
                                    <button className={scss.redbtn} onClick={() => { handlePO() }}>新增採購</button>
                                </span>
                                <span style={{ display: `${data2.length > 0 && statusin === '已核准' ? 'none' : ''}` }}>
                                    <button className={scss.disabledbtn}>新增採購</button>
                                </span> */}
                                </div>
                            </div>
                            <div className={scss.foot_content1}>
                                <Thead01 type={'PurchaseRequisitionDetail2'} />
                                {data2.map((_item, index) => (
                                    <CellWithBar key={index} className={scss.panelHeader21}>
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            {/* <span style={{ color: '#ea1833' }}>
                                            {_item.alreadyinquantity}
                                        </span> */}
                                            <span>
                                                <input
                                                    ref={quantityRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                    style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                                                    type="text"
                                                    value={_item.quantity !== undefined ? _item.quantity : 0}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    onChange={(e) => {
                                                        const newData = [...data2];
                                                        const newQuantity = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                        newData[index] = {
                                                            ...newData[index],
                                                            quantity: newQuantity,
                                                            totalprice: newQuantity * newData[index].unitprice
                                                        };
                                                        setData2(newData);
                                                    }}
                                                />
                                            </span>
                                            <span>{_item.unit}</span>
                                            <span>
                                                <input
                                                    ref={unitpriceRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                    style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '80px' }}
                                                    type="text"
                                                    value={_item.unitprice.toLocaleString()}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    onChange={(e) => {
                                                        const newData = [...data2];
                                                        const newUnitPrice = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                        newData[index] = {
                                                            ...newData[index],
                                                            unitprice: newUnitPrice,
                                                            totalprice: newUnitPrice * newData[index].quantity
                                                        };
                                                        setData2(newData);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                {_item.totalprice.toLocaleString()}
                                            </span>
                                            <span>
                                                {_item.suppliername}
                                            </span>
                                            <span>
                                                <input
                                                    ref={noteRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                    style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '250px' }}
                                                    type="text"
                                                    value={_item.note}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    onChange={(e) => {
                                                        const newData = [...data2];
                                                        const newNote = e.target.value;
                                                        newData[index] = {
                                                            ...newData[index],
                                                            note: newNote
                                                        };
                                                        setData2(newData);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                {/* <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                                <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                    {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                    <img src={icon_cancel.src} alt="cancel" style={{ width: '20px', height: '20px' }} />
                                                </button>
                                                {/* <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { handleSaveEdit(_item.prodreceiptuuid) }}>
                                            <img src={icon_save.src} alt="save" style={{ width: '30px', height: '20px' }} />
                                        </button> */}
                                                <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                    <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))}
                            </div>
                            <br />
                            <div className={scss.foot_foot1}>
                                <div></div>
                                <div></div>
                                <div>
                                    <table className={scss.count_table}>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>小計</td>
                                            <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalprice1 ? totalprice1 : '0'}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>營業稅</td>
                                            <td style={{ color: 'black' }}>&nbsp;&nbsp;{taxprice1 ? taxprice1 : '0'}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>應付金額</td>
                                            <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalpayprice1 ? totalpayprice1 : '0'}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* 隱藏的modal */}
                {/* 詢價單檢視 */}
                {/* <Modal
                    visible={prquotereqmodalopen}
                    footer={null}
                    onCancel={prQuotereqModalClose}
                    width="1000px"
                    maskClosable={false}
                    // centered
                    style={{ top: 250 }}
                > */}
                <DragableModal
                    handleText="詢價紀錄"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={prquotereqmodalopen}
                    onCrossClick={prQuotereqModalClose}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '920px', padding: '10px 15px' }}>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>品名：</span><span style={{ fontSize: '16px' }}>{quotereqname}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: '16px', color: '#14256a' }}>規格：</span><span style={{ fontSize: '16px' }}>{quotereqspec}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: '16px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '16px' }}>{quotereqquantity}</span>
                    </div>
                    <hr />
                    {selectedsupplier}
                    <div>
                        <Thead01 type={'Quotereq'} />
                        {prquotereqdata && (
                            prquotereqdata.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader17}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.detail_suppliername}</span>
                                        <span>{getTaiwanDateStr(_item.detail_create_at)}</span>
                                        <span style={{ textAlign: 'right' }}>{_item.detail_quantity}</span>
                                        <span>{_item.detail_unit}</span>
                                        <span style={{ textAlign: 'right' }}>{_item.detail_unitprice.toLocaleString()}</span>
                                        <span style={{ textAlign: 'right' }}>{_item.detail_totalprice.toLocaleString()}</span>
                                        <span>{_item.main_quotereqid}</span>
                                        <span></span>
                                        {/* <span></span> */}
                                        <span>
                                            <input
                                                disabled={['已核准', '審核中', '已結案'].includes(statusin)}
                                                className={scss.quotereqdetail_checkbox}
                                                type='checkbox'
                                                checked={selectedsupplier === _item.detail_id}
                                                onChange={() => handleCheckboxChange(_item)}
                                            />

                                        </span>
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                </DragableModal>
                {/* </Modal> */}

                <DragableModal
                    handleText="查找單據"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={searchmodalopen}
                    onCrossClick={SearchModalClose}
                >

                    <div className={scss.modal_head_head1}>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {searchdata.length} 筆</span>
                        </div>
                    </div>
                    <div className={scss.modal_head_content1}>
                        <div style={{ border: '1px solid #c1c1c1', borderRight: '0px', paddingRight: '50px', paddingLeft: '50px' }}>
                            <form className={scss.modal_search_bar} style={{ alignItems: 'center', width: '100%' }}>
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="排版用"
                                        disabled={true}
                                        className='invisible'
                                        inputProps={{
                                            props: {
                                                value: ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    <InputSel
                                        caption="起始日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        datePickerProps={{
                                            props: {
                                                value: keywordstartdate || null,
                                                onChange: (e: Moment | null) => { setKeywordstartdate(e) }
                                            }
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        caption="截止日期"
                                        disabled={false}
                                        captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                        datePickerProps={{
                                            props: {
                                                value: keywordenddate || null,
                                                onChange: (e: Moment | null) => { setKeywordenddate(e) }
                                            }
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="請購單號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword2 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword2(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="單據狀態"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />

                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="排版用"
                                        disabled={true}
                                        className='invisible'
                                        inputProps={{
                                            props: {
                                                value: ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div >
                                    <InputSel
                                        {...inputSelProps}
                                        caption="排版用"
                                        disabled={true}
                                        className='invisible'
                                        inputProps={{
                                            props: {
                                                value: ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div >
                                    <InputSel
                                        {...inputSelProps}
                                        caption="排版用"
                                        disabled={true}
                                        className='invisible'
                                        inputProps={{
                                            props: {
                                                value: ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div >
                                    <InputSel
                                        {...inputSelProps}
                                        caption="排版用"
                                        disabled={true}
                                        className='invisible'
                                        inputProps={{
                                            props: {
                                                value: ' ',
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                                    <span>
                                        <button className={scss.minibtn} onClick={(e) => { clearFilterData(e) }}>清除條件</button>
                                    </span>
                                </div>
                            </form>
                        </div>
                        <div style={{
                            maxHeight: '465.81px',
                            overflowY: 'auto',
                            border: '1px solid #c1c1c1',
                        }}>
                            <Thead01 type={'PurchaseRequisition'} />
                            <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>

                    </div>
                    {/* </Modal > */}
                </DragableModal>




                {/* 審核 */}
                <DragableModal
                    handleText="選擇審核流程"
                    style={{ zIndex: '1001', width: '820px' }}
                    show={reviewbar}
                    onCrossClick={() => { setReviewbar(false) }}>
                    <div style={{ padding: '0px 5px' }}>
                        <span style={{ fontSize: '18px' }}>送審主旨</span>
                        <input placeholder="主旨"
                            style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
                            value={documenttitle}
                            onChange={(e) => { setDocumenttitle(e.target.value) }}
                        />
                        <Radio.Group onChange={onChange} value={value} style={{ paddingTop: '5px' }}>
                            <Space direction="vertical">
                                {reviewdata.map((_item: any) => (
                                    <Radio key={_item.id} value={_item.id} onClick={() => { setReview(_item) }} style={{ fontSize: '18px', width: '800px', borderBottom: '1px solid #ccc', padding: '5px' }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                            {_item.name}：
                                            {_item.stages.map((_stage: any, index: number) => (
                                                <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                                                    {_stage.review_type}：{_stage.stage_user_name}
                                                    {index < _item.stages.length - 1 && (
                                                        <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>



                </DragableModal>



            </div >
        </SubLayer >


    )

}