import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './purchaseRequisitionList.module.scss';
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
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_autoadd from 'public/image/icon/fc_autoadd.svg';
import { Button, Modal } from 'antd';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';


type Tquery = {
    wareHouseId: string | undefined;
};

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
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };



    //登入者資料
    const { userInfo } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);



    const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>("");
    const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [approvedin, setApprovedin] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);




    // const [open, setOpen] = useState(false);


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



    //新增按鈕
    const panelList: TpanelList = [
        { searchGroup },
        {
            type: 'addButton',
            label: '新增請購單',
            onClick: () => {
                // setOpen(true);
                router.push({
                    pathname: `/factoryDepartment/purchaseRequisitionList/addPurchaseRequisition`,
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
            // console.log(userInfo);
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

            const response = await fetch(`${setting.apipath}GetPurchaseRequisition?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                console.log(data[0]);
                getPurchaseRequisitionDetail(data[0].purchaserequisitionuuid);
                // GetProdReceiptDetailByPurchaseOrderId(data[0].purchaseorderuuid);
                setCreate_atin(data[0].create_at);
                setPurchaserequisitionuuidin(data[0].purchaserequisitionuuid);
                setPurchaserequisitionidin(data[0].purchaserequisitionid);
                setCreate_byin(data[0].create_by);
                // setSuppliernamein(data[0].suppliername);
                // setSuppliertaxidin(data[0].suppliertaxid);
                setApprovedin(data[0].approved.toString());
                // setSupplieraddressin(data[0].supplieraddress);
            }
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPurchaseRequisition();
    }, []);

    //取對應的請購明細
    const getPurchaseRequisitionDetail = async (purchaserequisitionuuid: any) => {
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
            const response = await fetch(`${setting.apipath}GetPurchaseRequisitionDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData1(data);
            // setData2(data);

            console.log(data);
            let totalprice = 0;
            data.forEach((element: { totalprice: any; }) => {
                totalprice += element.totalprice;
            });
            setTotalPrice(totalprice.toLocaleString());
            const taxPrice = Math.round(totalprice * 0.05);
            setTaxPrice(taxPrice.toLocaleString());
            const totalPayPrice = totalprice + taxPrice;
            setTotalPayPrice(totalPayPrice.toLocaleString());
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        if (purchaserequisitionuuid) {
            getPurchaseRequisitionDetail(purchaserequisitionuuid);
            // GetProdReceiptDetailByPurchaseOrderId(purchaserequisitionuuid);
            setPurchaserequisitionidin(purchaserequisitionid as string);
            setPurchaserequisitionuuidin(purchaserequisitionuuid as string);
            // setCreate_atin((create_at != null ? create_at : "") as string);
            // alert(create_at)
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            // setSuppliernamein(suppliername as string);
            // setSuppliertaxidin(suppliertaxid as string);
            setApprovedin(approved as string);
            // setSupplieraddressin(supplieraddress as string);
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
            const response = await fetch(`${setting.apipath}GetProdReceiptDetailByPurchaseOrderId?${queryParams}`);
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


    const TransferPurchaseOrderToProductReceipt = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                purchaserequisitionuuid: string | undefined,
                data: any,
                username: string | undefined
            } = {
                purchaserequisitionuuid: checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid as string | undefined,
                data: data2,
                username: userInfo?.username
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}TransferPurchaseOrderToProductReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            getPurchaseRequisition();

            getPurchaseRequisitionDetail(checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid);

            GetProdReceiptDetailByPurchaseOrderId(checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //結案
    const ClosePO = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                purchaserequisitionuuid: string | undefined
            } = {
                purchaserequisitionuuid: checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}ClosePO?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            getPurchaseRequisition();

            getPurchaseRequisitionDetail(checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




    //#endregion
    // 轉為進貨單，開始驗收
    function handleReceipt() {
        myAlert.confirm({
            title: '確定要轉為進貨單嗎?',
            content: <>
                <h1>請確認數量、金額是否正確</h1>
            </>,
            props: {
                onOk: () => {
                    TransferPurchaseOrderToProductReceipt();
                    // console.log("XXXXXXXXXXXXXXXXXXX");
                    // console.log(data2);
                }
            }
        });
    }

    function handleClosePO() {
        myAlert.confirm({
            title: '確定結案?',
            content: <>
                <h1>轉為結案後將無法更改</h1>
            </>,
            props: {
                onOk: () => {
                    ClosePO();
                }
            }
        });
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
        // setData2(prevState => {
        //     // 複製 prevState 以避免直接修改原始狀態
        //     const updatedData = [...prevState];
        //     // 移除指定索引的項目
        //     updatedData.splice(index, 1);
        //     return updatedData;
        // });
    };


    // const [data2, setData2] = useState([
    //     { id: 1, quantity: 10 },
    //     { id: 2, quantity: 15 },
    //     { id: 3, quantity: 20 }
    // ]);
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

    //#region  詢價單modal
    const [prquotereqmodalopen, setPrquotereqmodalopen] = useState<boolean>(false);

    const [test, setTest] = useState<string>("");

    //帶入詢價單畫面的資料(欲詢價物料)
    const [quotereqname, setQuotereqname] = useState<string>("");
    const [quotereqspec, setQuotereqspec] = useState<string>("");
    const [quotereqquantity, setQuotereqquantity] = useState<string>("");
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


    //打開詢價單modal
    const prQuotereqModalOpen = async (item: any) => {

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
        getQuotereqDetail(item.quoterequuid);
        setPrquotereqmodalopen(true);
    }

    //關閉詢價單modal
    const prQuotereqModalClose = async () => {
        setPrquotereqmodalopen(false);
    }

    //取得對應詢價單主檔的詢價單明細檔
    const getQuotereqDetail = async (quoterequuid: any) => {
        try {
            // setIsLoading(true);
            const conditionModel: {
                quoterequuid: string | undefined
            } = {
                quoterequuid: quoterequuid as string | undefined,
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetQuotereqDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();


            // let awardedItem = data.find((item: any) => item.awarded);
            // if (awardedItem) {
            //   alert(awardedItem.id)
            //   setSelectedsupplier(awardedItem.id);
            //   alert(selectedsupplier);
            // }

            setPrquotereqdata(data);
            console.log(prquotereqdata);



        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //寫入詢價單明細
    const addQuotereqDetail = async () => {
        try {
            // alert("cc");
            if (prquotereqadddata.suppliername === "" || prquotereqadddata.suppliername === undefined || prquotereqadddata.suppliername === null ||
                prquotereqadddata.unitprice === "" || prquotereqadddata.unitprice === undefined || prquotereqadddata.unitprice === null ||
                prquotereqadddata.totalprice === "" || prquotereqadddata.totalprice === undefined || prquotereqadddata.totalprice === null ||
                prquotereqadddata.deliverydate < moment() || prquotereqadddata.deliverydate === null || prquotereqadddata.deliverydate === undefined
            ) {
                myAlert.err({ title: "請檢查欄位!!!", content: "請檢查欄位是否正確或交貨日期是否小於今天日期" })
                return;
            }
            // setIsLoading(true);
            const conditionModel: {
                data: any,
            } = {
                data: prquotereqadddata
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}AddQuotereqDetail`, {
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
            // 加入詢價單明細後從取詢價單明細
            getQuotereqDetail(prquotereqadddata.quoterequuid);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    const handlequotereqChange = (key: any, value: any) => {
        setPrquotereqadddata(prevState => ({
            ...prevState,
            [key]: value
        }));
    };


    const handleCheckboxChange = (item: any) => {

        // 更新選中的供應商
        setLastselectedsupplier(selectedsupplier);
        setSelectedsupplier(item.id);
        setTest("1");


        // // 導航到新的路徑
        // router.push({
        //     pathname: `/factoryDepartment/purchaseRequisitionList`,
        //     query: {
        //         purchaserequisitionuuid: item.purchaserequisitionuuid,
        //         purchaserequisitionid: item.purchaserequisitionid,
        //         create_at: getTaiwanDateStr(item.create_at),
        //         create_by: item.create_by,
        //         approved: item.approved,
        //         firstin: 1
        //     }
        // });
    };


    const updateQuotereqDetail = async (quotereqdetailid: string, lastquotereqdetailid: string) => {
        try {
            const conditionModel: {

                lastquotereqdetailid: any,
                quotereqdetailid: any,
            } = {
                lastquotereqdetailid: lastquotereqdetailid,
                quotereqdetailid: quotereqdetailid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}UpdateQuotereqDetailById`, {
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
            // console.log("Transfer response:", responseData);
            // getQuotereqDetail(prquotereqadddata.quoterequuid);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }

    };
    useEffect(() => {
        if (selectedsupplier) {
            updateQuotereqDetail(selectedsupplier, lastselectedsupplier);
        }
    }, [selectedsupplier]);


    useEffect(() => {
        if (prquotereqdata && prquotereqdata.length > 0) {
            const awardedItem = prquotereqdata.find((item: any) => item.awarded);
            if (awardedItem) {
                setSelectedsupplier(awardedItem.id);
                setLastselectedsupplier(awardedItem.id);
            }
        }
    }, [prquotereqdata]);

    // useEffect(() => {
    //     getPurchaseRequisitionDetail(getPurchaseRequisitionDetail(purchaserequisitionuuidin));
    // }, [test]);
    // //#endregion




    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '請購單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div>
                        <Thead01 type={'PurchaseRequisition'} />
                        <Tbody01 type={'PurchaseRequisition'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.tite_main}>
                        <div>
                            <span style={{ display: (checkfirstin === 0 ? approvedin : approved) === "false" ? "" : "none" }}>
                                <MyButton_v2 px='px22' py='py4' theme='danger' label="結案" onClick={() => { handleClosePO() }} />
                                {/* <button className={scss.greenbutton} onClick={() => { handleClosePO() }} >未結案</button> */}
                            </span>
                            <span style={{ display: (checkfirstin === 0 ? approvedin : approved) === "true" ? "" : "none" }}>
                                <MyButton_v2 disabled={true} px='px22' py='py4' theme={undefined} label="已結案" onClick={() => { alert("領料托盤") }} />
                            </span>
                        </div>
                        <div style={{ textAlign: 'right', height: '35.77px' }}>

                        </div>
                    </div>
                    <div className={scss.head_main}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="請購日期"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at,
                                    },
                                }}
                            />
                        </div>
                        <div>
                            {/* {purchaseorderid} */}
                            <InputSel
                                {...inputSelProps}
                                caption="請購單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? purchaserequisitionidin : purchaserequisitionid,
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
                                        value: checkfirstin === 0 ? create_byin : create_by,
                                    },
                                }}
                            />
                        </div>
                    </div>
                    {/* <hr /> */}
                    {/* <div className={scss.content_main}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="廠商名稱"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? suppliernamein : suppliername,
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="統一編號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? suppliertaxidin : suppliertaxid,
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="廠商地址"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? supplieraddressin : supplieraddress,
                                    },
                                }}
                            />
                        </div>
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
                                caption="排版用"
                                disabled={true}
                                className='invisible'
                                inputProps={{
                                    props: {
                                        value: ' ',
                                    },
                                }}
                            />
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
                    </div> */}

                    <br />
                    <div className={scss.content_main_content}>
                        <Thead01 type={'PurchaseRequisitionDetail'} />
                        {/* <Tbody01 type={'PurchaseRequisitionDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                        {data1 && (
                            data1.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader16}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>{_item.name}</span>
                                        <span>{_item.spec}</span>
                                        <span>{_item.quantity}</span>
                                        <span>{_item.unit}</span>
                                        <span><IconDetail onClick={() => prQuotereqModalOpen(_item)} /></span>
                                        <span>{_item.unitprice.toLocaleString()}</span>
                                        <span>{_item.totalprice.toLocaleString()}</span>
                                        <span>{_item.suppliername}</span>
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                    <Modal
                        visible={prquotereqmodalopen}
                        footer={null}
                        onCancel={prQuotereqModalClose}
                        // width={'fit-content'}
                        width="1000px"
                        // maskClosable={false}
                    >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                            <span style={{ fontSize: '16px', color: '#14256a' }}>品名：</span><span style={{ fontSize: '16px' }}>{quotereqname}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ fontSize: '16px', color: '#14256a' }}>規格：</span><span style={{ fontSize: '16px' }}>{quotereqspec}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ fontSize: '16px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '16px' }}>{quotereqquantity}</span>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="廠商"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: prquotereqadddata.suppliername,
                                            onChange: (e) => handlequotereqChange('suppliername', e.target.value.trim())
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="單價"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: prquotereqadddata.unitprice,
                                            onChange: (e) => handlequotereqChange('unitprice', e.target.value.trim())
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="單位"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: prquotereqadddata.unit,
                                            onChange: (e) => handlequotereqChange('unit', e.target.value.trim())
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="總價"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: prquotereqadddata.totalprice,
                                            onChange: (e) => handlequotereqChange('totalprice', e.target.value.trim())
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    caption="出貨日期"
                                    //
                                    captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                    // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                    datePickerProps={{
                                        props: {
                                            value: prquotereqadddata.deliverydate,
                                            onChange: (e) => handlequotereqChange('deliverydate', e)
                                        },
                                    }}
                                />

                            </div>
                            <div style={{ flex: '1 1 20%' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="備註"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: prquotereqadddata.note,
                                            onChange: (e) => handlequotereqChange('note', e.target.value.trim())
                                        },
                                    }}
                                />
                            </div>
                            <button className={scss.greenbutton} onClick={() => { addQuotereqDetail() }} >
                                <img src={icon_fc_arrow_down.src} alt="Arrow Down" style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        <div>
                            <Thead01 type={'Quotereq'} />
                            {/* <Tbody01 type={'Quotereq'} data={prquotereqdata} error={undefined} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {prquotereqdata && (
                                prquotereqdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader17}>
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.suppliername}</span>
                                            <span>{_item.unitprice}</span>
                                            <span>{_item.totalprice}</span>
                                            <span>{_item.unit}</span>
                                            <span>{getTaiwanDateStr(_item.deliverydate)}</span>
                                            <span>{_item.note}</span>
                                            <span>
                                                <input
                                                    className={scss.quotereqdetail_checkbox}
                                                    type='checkbox'
                                                    checked={selectedsupplier === _item.id}
                                                    onChange={() => handleCheckboxChange(_item)}
                                                />
                                            </span>
                                            {/* <span><input type='checkbox'/></span> */}
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </Modal>
                    <br />
                    <div className={scss.foot_main}>
                        <div>
                            {/* <button className={scss.greenbutton} onClick={() => { alert('詢價') }} >詢價單</button> */}
                        </div>
                        <div>
                        </div>
                        <div>

                            <table className={scss.count_table}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>小計</td>
                                    <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalprice ? totalprice : '0'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>營業稅</td>
                                    <td style={{ color: 'black' }}>&nbsp;&nbsp;{taxprice ? taxprice : '0'}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>應付金額</td>
                                    <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalpayprice ? totalpayprice : '0'}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={scss.content_main_content}>
                        <span className={scss.mytitle} style={{ display: (checkfirstin === 0 ? approvedin : approved) === "true" ? "none" : "" }}>

                            {/* <button onClick={() => { setData2(data2restore) }}>
                                <img src={icon_autoadd.src} alt="add" style={{ width: '40px', height: '40px' }} />
                            </button> */}
                            {/* <MyButton_v2 px='px22' py='py4' theme={undefined} label="進貨/批次進貨" onClick={() => { handleReceipt() }} /> */}
                        </span>
                        <Thead01 type={'PurchaseOrderDetail2'} />
                        {data2.map((_item, index) => (
                            <CellWithBar key={index} className={scss.panelHeader13}>
                                <div className={scss.row01}>
                                    <span>{index + 1}</span>
                                    <span>{_item.productid}</span>
                                    <span>{_item.name}</span>
                                    <span style={{ color: '#ea1833' }}>
                                        {_item.alreadyinquantity}
                                    </span>
                                    <span>
                                        <input
                                            ref={quantityRefs.current[index]}
                                            style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                            type="text"
                                            value={_item.quantity !== undefined ? _item.quantity : 0}
                                            readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                            style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                            type="text"
                                            value={_item.unitprice.toLocaleString()}
                                            readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                        <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                            <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                        </button>
                                        <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                            <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
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
                </div>
            </div>

        </SubLayer >

    )

}