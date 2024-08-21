import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _, { size } from 'lodash';

import scss from './quotereqDetailList.module.scss';
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
import icon_search from 'public/image/icon/search.svg';
import icon_close from 'public/image/icon/fc_close.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function QuotereqDetailList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaserequisitionuuid,
        purchaserequisitionid,
        purchaserequisitiondetailuuid,
        create_at,
        create_by,
        approved,
        quoterequuid,
        need_date,
        note
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
    const [suplrdata, setSuplrdata] = useState<any[]>([]);
    const [suplrcitydata, setSuplrcitydata] = useState<any[]>([]);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitpriceRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const status = router.query.status as TquotationStatus;
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");

    const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>("");
    const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [approvedin, setApprovedin] = useState<string>("");
    const [quoterequuidin, setquoterequuidin] = useState<string>(quoterequuid as string);
    const [purchaserequisitiondetailuuidin, setPurchaserequisitiondetailuuidin] = useState<string>("");
    const [notein, setNotein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");


    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);

    const [selectedOption, setSelectedOption] = useState('物料'); // 預設選項


    // const [open, setOpen] = useState(false);


    //#region 上方功能列


    //新增按鈕
    const panelList: TpanelList = [
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                myAlert.confirm({
                    title: '確定要返回請購單嗎?',
                    content: <>
                        <h1>未儲存的資料將不會保留</h1>
                    </>,
                    props: {
                        onOk: () => {
                            router.back();
                            // router.push({
                            //     pathname: `/factoryDepartment/purchaseRequisitionList`,
                            //     query: {
                            //         purchaserequisitionuuid: purchaserequisitionuuidin,
                            //         purchaserequisitionid: purchaserequisitionidin,
                            //         create_at: getTaiwanDateStr(create_atin),
                            //         create_by: create_byin,
                            //         // approved: approvedin,
                            //         status: statusin,
                            //         note: notein,
                            //         firstin: 1
                            //     },
                            // });
                        }
                    }
                });
            },
        },
    ];
    //#endregion
    const searchData = async (keyword1: string, keyword2: string, keyword3: string) => {
        try {
            setIsLoading(true);
            // keywordSpec
            const conditionModel: { keyword1: string | undefined, keyword2: string | undefined, keyword3: string | undefined } = {
                keyword1: keyword1 as string | undefined,
                keyword2: keyword2 as string | undefined,
                keyword3: keyword3 as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            //erpAPI
            const response = await fetch(`${setting.apipath}SearchSupplierById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            let data = await response.json();
            setSuplrdata(data);
            // const filteredData = data.filter((item: any) => item.city);
            // const uniqueCityData = _.uniqBy(filteredData, (item: any) => item.city);
            // const sortedUniqueCityData = uniqueCityData.sort((a: any, b: any) => a.city.localeCompare(b.city));
            // setSuplrcitydata(sortedUniqueCityData);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




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

            console.log(data);

            await new Promise(resolve => setTimeout(resolve, 500));
            if (checkfirstin === 0) {
                setPurchaserequisitionidin(data[0].purchaserequisitionid);
                setPurchaserequisitionuuidin(purchaserequisitionuuid);
                setQuotereqname(data[0].name);
                setQuotereqspec(data[0].spec);
                setQuotereqquantity(data[0].quantity);
                getQuotereqDetail(data[0].quoterequuid);
                setQuoterequnit(data[0].unit);
                setquoterequuidin(data[0].quoterequuid)
                setPurchaserequisitiondetailuuidin(data[0].purchaserequisitiondetailuuid);
                prquotereqadddata.unit = data[0].unit;
            }

            // alert(data[0].quoterequuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPurchaseRequisitionDetail(purchaserequisitionuuid);
        setStatusin(status as string);
        setNotein(note as string);
    }, [purchaserequisitionuuid]);

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



    //#region  詢價單modal
    const [prquotereqmodalopen, setPrquotereqmodalopen] = useState<boolean>(false);

    //帶入詢價單畫面的資料(欲詢價物料)
    const [quotereqname, setQuotereqname] = useState<string>("");
    const [quotereqspec, setQuotereqspec] = useState<string>("");
    const [quotereqquantity, setQuotereqquantity] = useState<string>("");
    const [quoterequnit, setQuoterequnit] = useState<string>("");
    //對應詢價單主檔的詢價單明細
    const [prquotereqdata, setPrquotereqdata] = useState<any[]>([]);
    //確定廠商後更新請購單明細
    const [refreshpurchaserequisitiondetail, setRefreshpurchaserequisitiondetail] = useState<any>();

    //加入詢價廠商
    const [prquotereqadddata, setPrquotereqadddata] = useState({

        quoterequuid: "",
        quotereqid: "",
        unitprice: "",
        totalprice: "",
        suppliername: "",
        supplieraddress: "",
        supplierphone: "",
        suppliertaxid: "",
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
        prquotereqadddata.supplieraddress = "";
        prquotereqadddata.supplierphone = "";
        prquotereqadddata.suppliertaxid = "";
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
        setQuoterequnit(item.unit);
        getQuotereqDetail(item.quoterequuid);
        setPrquotereqmodalopen(true);
    }

    //關閉詢價單modal
    const prQuotereqModalClose = async () => {
        setSuplrdata([]);
        setKeyword1('');
        setKeyword2('');
        setKeyword3('');
        await new Promise(resolve => setTimeout(resolve, 50));
        setPrquotereqmodalopen(false);
    }

    //取得對應詢價單主檔的詢價單明細檔
    const getQuotereqDetail = async (quoterequuid: any) => {

        // alert("in");
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

            setPrquotereqdata(data);
            console.log(prquotereqdata);



        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    //寫入詢價單明細
    const addQuotereqDetail = async () => {

        let deliverydate = prquotereqadddata.deliverydate.startOf('day');
        let needdate = moment(need_date).startOf('day');

        // return;
        try {
            if (prquotereqadddata.suppliername === "" || prquotereqadddata.suppliername === undefined || prquotereqadddata.suppliername === null ||
                prquotereqadddata.unitprice === "" || prquotereqadddata.unitprice === undefined || prquotereqadddata.unitprice === null ||
                prquotereqadddata.totalprice === "" || prquotereqadddata.totalprice === undefined || prquotereqadddata.totalprice === null ||
                deliverydate > needdate || prquotereqadddata.deliverydate === null || prquotereqadddata.deliverydate === undefined

            ) {
                myAlert.err({
                    title: "請檢查輸入是否正確!!!",
                    content: "交貨日期不可小於今日也不可超過需用日"
                })
                return;
            }
            // setIsLoading(true);
            const conditionModel: {
                quoterequuid: any,
                purchaserequisitionid: any,
                data: any,
            } = {
                quoterequuid: quoterequuidin,
                purchaserequisitionid: purchaserequisitionidin,
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
            myAlert.success({ title: '詢價明細新增成功' });
            const responseData = await response.json();
            // 加入詢價單明細後重新取詢價單明細
            // alert(prquotereqadddata.quoterequuid);
            // alert(quoterequuid)
            getPurchaseRequisitionDetail(purchaserequisitionuuidin);
            getQuotereqDetail(quoterequuidin);

        } catch (error: any) {
            // setError(error.message);
            console.log(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };

    const handleAutoSetSupplier = (item: any) => {
        handleRowClick(item.supplierid);

        handlequotereqChange('suppliername', item.name.trim())
        handlequotereqChange('supplieraddress', item.address.trim())
        handlequotereqChange('supplierphone', item.phone.trim())
        handlequotereqChange('suppliertaxid', item.taxid.trim())
        handlequotereqChange('unitprice', '')
        handlequotereqChange('totalprice', '')
        handlequotereqChange('note', '')
        myAlert.success({ title: '廠商資訊帶入成功' });

    }

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
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        searchData(keyword1, keyword2, keyword3)
        // alert(keyword1);
        // alert(keyword2);
        // alert(keyword3);
        // 在這裡可以添加搜索的邏輯，使用keyword1來進行搜索
    };

    // 更新得標廠商
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

    // 取得帶入供應商名單
    const getQuotereqSupplier = async () => {
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
            const response = await fetch(`${setting.apipath}GetQuotereqSupplier?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setSuplrdata(data);

            const filteredData = data.filter((item: any) => item.city);
            const uniqueCityData = _.uniqBy(filteredData, (item: any) => item.city);
            const sortedUniqueCityData = uniqueCityData.sort((a: any, b: any) => a.city.localeCompare(b.city));
            setSuplrcitydata(sortedUniqueCityData);

            await new Promise(resolve => setTimeout(resolve, 500));


            // alert(data[0].quoterequuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }



    function handlechangeQuotereqDetail(item: any): void {
        handleRowClick(item.quoterequuid);
        setCheckFirstIn(1);
        setSelectedsupplier("");
        setPurchaserequisitionidin(item.purchaserequisitionid);
        setPurchaserequisitionuuidin(item.purchaserequisitionuuid);
        setQuotereqname(item.name);
        setQuotereqspec(item.spec);
        setQuotereqquantity(item.quantity);
        setQuoterequnit(item.unit);
        setquoterequuidin(item.quoterequuid)
        setPurchaserequisitiondetailuuidin(item.purchaserequisitiondetailuuid);
        getQuotereqDetail(item.quoterequuid);
        prquotereqadddata.unit = item.unit;
    }

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={`請購單：${purchaserequisitionidin}｜詢價明細`} panelList={panelList} />
            <div className={scss.container}>
                <div className={scss.left} style={{ display: `${leftbaropen === false ? '' : 'none'}` }}>
                    <div className={scss.content}>
                        <div>
                            <Thead01 type={'QuotereqDetail'} />
                            {data1 && (
                                data1.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader18}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.quoterequuid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => handlechangeQuotereqDetail(_item)}
                                        >
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.alreadyquotereq}</span>
                                            <span>
                                                {/* <IconDetail onClick={() => handlechangeQuotereqDetail(_item)} /> */}
                                            </span>
                                            {/* <span><IconDetail onClick={() => {alert(_item.quoterequuid)}} /></span> */}
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a' }}>品名：</span><span style={{ fontSize: '18px', color: '#8c8989' }}>{quotereqname}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a' }}>規格：</span><span style={{ fontSize: '18px', color: '#8c8989' }}>{quotereqspec}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a' }}>需用日：</span><span style={{ fontSize: '18px', color: '#8c8989' }}>{getTaiwanDateStr(moment(need_date).toString())}</span>
                            </div>
                        </div>
                        <div className={scss.head_head2} >
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '18px', color: '#8c8989' }}>{quotereqquantity}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a' }}>單位：</span><span style={{ fontSize: '18px', color: '#8c8989' }}>{quoterequnit}</span>
                            </div>
                        </div>
                        <div className={scss.head_content1}>
                            <div>
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
                            <div>
                                <button>
                                    <IconDetail onClick={() => { setPrquotereqmodalopen(!prquotereqmodalopen); getQuotereqSupplier(); }} />

                                </button>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className={scss.head_content2}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="電話"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: prquotereqadddata.supplierphone,
                                        onChange: (e) => handlequotereqChange('supplierphone', e.target.value.trim())
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="統一編號"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: prquotereqadddata.suppliertaxid,
                                        onChange: (e) => handlequotereqChange('suppliertaxid', e.target.value.trim())
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                caption="出貨日期"
                                captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                datePickerProps={{
                                    props: {
                                        value: prquotereqadddata.deliverydate,
                                        onChange: (e) => handlequotereqChange('deliverydate', e)
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className={scss.head_content3}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="地址"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: prquotereqadddata.supplieraddress,
                                        onChange: (e) => handlequotereqChange('supplieraddress', e.target.value.trim())
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
                        </div>
                    </div>
                    <div className={scss.head_content4}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="單價"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: prquotereqadddata.unitprice,
                                        onChange: (e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) { // 只允許數字
                                                const quantity = quotereqquantity;
                                                handlequotereqChange('unitprice', value.trim())
                                                handlequotereqChange('totalprice', (parseInt(value) * parseInt(quantity)).toString())
                                            }
                                        }
                                    },
                                }}
                            />
                        </div>
                        <div>
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
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="總價"
                                disabled={false}
                                inputProps={{
                                    props: {
                                        value: prquotereqadddata.totalprice,
                                        onChange: (e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) { // 只允許數字
                                                handlequotereqChange('totalprice', value.trim())
                                            }
                                        }
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className={scss.head_content5}>
                        <div>
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
                    </div>
                    <div className={scss.head_foot1}>
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
                        <div style={{ textAlign: 'right' }}>
                            <button className={scss.greenbutton} onClick={() => { addQuotereqDetail(); }} >
                                <img src={icon_fc_arrow_down.src} alt="Arrow Down" style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>
                    </div>
                    <div className={scss.head_foot2}>
                        <div>
                            {/* <button className={scss.minibtn} onClick={() => { setLeftbaropen(!leftbaropen) }}>
                                詢價明細
                            </button> */}
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
                        </div>
                        <div style={{ textAlign: 'right' }}>

                        </div>
                    </div>
                    <div className={scss.body_content1}>
                        <Thead01 type={'Quotereq2'} />
                        {prquotereqdata && (
                            prquotereqdata.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader23}>
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
                                    </div>
                                </CellWithBar>
                            ))
                        )}

                    </div>
                    <div className={scss.body_foot1}>
                        <div>
                            流程順序：查詢廠商{'>'}帶入廠商資訊{'>'}輸入詢價資訊
                            (1).廠商資料可查詢供應商資料或由歷史詢價帶入<br />
                            (2).品項詢價完成後可勾選得標廠商。
                        </div>
                        <div></div>
                        <div>
                            <table className={scss.count_table}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {/* <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>營業稅</td>
                                    <td style={{ color: 'black' }}>&nbsp;&nbsp;{taxprice ? taxprice : '0'}</td>
                                </tr> */}
                                {/* <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>應付金額</td>
                                    <td style={{ color: 'black' }}>&nbsp;&nbsp;{totalpayprice ? totalpayprice : '0'}</td>
                                </tr> */}
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <Modal
                visible={prquotereqmodalopen}
                footer={null}
                onCancel={prQuotereqModalClose}
                width="1000px"
                maskClosable={false}
                style={{ top: 250 }}
            >

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                    <span style={{ fontSize: '16px', color: '#14256a' }}>查詢：</span>
                    <span style={{ fontSize: '16px' }}>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder='　名稱'
                                value={keyword1}
                                style={{ borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                onChange={(e) => setKeyword1(e.target.value)}
                            />
                            <select value={keyword2}
                                style={{ outline: 'none', width: '216px', color: '#14256a', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                onChange={(e) => setKeyword2(e.target.value)} placeholder="縣市">
                                <option value="">全部縣市</option>
                                {suplrcitydata.map((_item, index) => (
                                    <option key={index} value={_item.city}>{_item.city}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder='　地址、電話或統編'
                                value={keyword3}
                                style={{ borderBottom: '1px solid #c1c1c1', width: '400px' }}
                                onChange={(e) => setKeyword3(e.target.value)}
                            />
                            <button type="submit">
                                <img src={icon_search.src} alt="edit" style={{ width: '20px', height: '20px' }} />
                            </button>
                        </form>
                    </span>
                </div>
                <hr />
                <div>
                    <Thead01 type={'qoDetail_SupplierList'} />
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {suplrdata && (
                            suplrdata.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader21}>
                                    <div
                                        key={index}
                                        className={`${scss.row01} ${_item.supplierid === selectedItemId ? scss.selectedRow : ''}`}
                                        onClick={() => handleAutoSetSupplier(_item)}
                                    >
                                        <span>{_item.name}</span>
                                        <span>{_item.address}</span>
                                        <span>{_item.phone}</span>
                                        <span>{_item.taxid}</span>
                                        <span>
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                </div>
            </Modal>





        </SubLayer >

    )

}