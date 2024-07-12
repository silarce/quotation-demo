import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

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
        create_at,
        create_by,
        approved,
        quoterequuid
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
    const [quoterequuidin, setquoterequuidin] = useState<string>(quoterequuid as string)

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);




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
                            router.push({
                                pathname: `/factoryDepartment/purchaseRequisitionList`,
                                query: {
                                    purchaserequisitionuuid: checkfirstin === 0 ? purchaserequisitionuuidin : purchaserequisitionuuid,
                                },
                            });
                        }
                    }
                });
            },
        },
    ];
    //#endregion




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
            setPurchaserequisitionidin(data[0].purchaserequisitionid);
            setQuotereqname(data[0].name);
            setQuotereqspec(data[0].spec);
            setQuotereqquantity(data[0].quantity);
            getQuotereqDetail(data[0].quoterequuid);
            setQuoterequnit(data[0].unit);
            setquoterequuidin(data[0].quoterequuid)
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
        setQuoterequnit(item.unit);
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
        try {
            // alert("cc");
            if (prquotereqadddata.suppliername === "" || prquotereqadddata.suppliername === undefined || prquotereqadddata.suppliername === null ||
                prquotereqadddata.unitprice === "" || prquotereqadddata.unitprice === undefined || prquotereqadddata.unitprice === null ||
                prquotereqadddata.totalprice === "" || prquotereqadddata.totalprice === undefined || prquotereqadddata.totalprice === null ||
                prquotereqadddata.deliverydate < moment() || prquotereqadddata.deliverydate === null || prquotereqadddata.deliverydate === undefined
            ) {
                myAlert.err({
                    title: "請檢查輸入是否正確!!!",
                    content: "請檢查欄位是否正確或交貨日期是否小於今天日期"
                })
                return;
            }
            // setIsLoading(true);
            const conditionModel: {
                quoterequuid: any,
                data: any,
            } = {
                quoterequuid: quoterequuidin,
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
            myAlert.success({title:'詢價明細新增成功'});
            const responseData = await response.json();
            // 加入詢價單明細後重新取詢價單明細
            alert(prquotereqadddata.quoterequuid);
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
            <PageHeader02 tag={quotationStatusLookup[status] ?? `請購單：${purchaserequisitionidin}｜詢價明細`} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div>
                        {/* <span style={{ fontSize: '18px', color: '#14256a' }}>請購單號：</span><span style={{ fontSize: '18px' }}>{purchaserequisitionidin}</span>&nbsp;&nbsp;&nbsp;&nbsp; */}
                        <Thead01 type={'QuotereqDetail'} />
                        {/* <Tbody01 type={'PurchaseRequisitionDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                        {data1 && (
                            data1.map((_item: any, index: number) => (
                                <CellWithBar key={index} className={scss.panelHeader18}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>{_item.name}</span>
                                        <span>{_item.alreadyquotereq}</span>
                                        <span><IconDetail onClick={() => prQuotereqModalOpen(_item)} /></span>
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.tite_main}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                            <span style={{ fontSize: '18px', color: '#14256a' }}>品名：</span><span style={{ fontSize: '18px' }}>{quotereqname}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ fontSize: '18px', color: '#14256a' }}>規格：</span><span style={{ fontSize: '18px' }}>{quotereqspec}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ fontSize: '18px', color: '#14256a' }}>數量：</span><span style={{ fontSize: '18px' }}>{quotereqquantity}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ fontSize: '18px', color: '#14256a' }}>單位：</span><span style={{ fontSize: '18px' }}>{quoterequnit}</span>
                            {/* <span style={{ fontSize: '18px', color: '#14256a' }}>歷史單價：</span><span style={{ fontSize: '18px' }}>{quotereqquantity}</span> */}
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className={scss.head_main}>
                        <div style={{ marginRight: '20px' }}>
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
                        <div style={{ marginRight: '20px' }}>
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
                        <div style={{ marginRight: '20px' }}>
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
                        <div style={{ marginRight: '20px' }}>
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
                                        onChange: (e) => handlequotereqChange('totalprice', e.target.value.trim())
                                    },
                                }}
                            />
                        </div>
                        <div style={{ marginRight: '20px' }}>

                        </div>
                        <div></div>
                        <div style={{ textAlign: 'right' }}>
                            <button className={scss.greenbutton} onClick={() => { addQuotereqDetail() }} >
                                <img src={icon_fc_arrow_down.src} alt="Arrow Down" style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>
                        <br />
                    </div>
                    <div className={scss.content_main_content}>
                        <Thead01 type={'Quotereq'} />
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
                                    </div>
                                </CellWithBar>
                            ))
                        )}
                    </div>
                    <br />
                    <div className={scss.foot_main}>
                        <div>
                        </div>
                        <div>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className={scss.content_main_content}>
                        <span className={scss.mytitle} style={{ display: (checkfirstin === 0 ? approvedin : approved) === "true" ? "none" : "" }}>

                            {/* <button onClick={() => { setData2(data2restore) }}>
                                <img src={icon_autoadd.src} alt="add" style={{ width: '40px', height: '40px' }} />
                            </button> */}
                            {/* <MyButton_v2 px='px22' py='py4' theme={undefined} label="進貨/批次進貨" onClick={() => { handleReceipt() }} /> */}
                        </span>

                    </div>
                </div>
            </div>

        </SubLayer >

    )

}