import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import scss from './prodReceiptList.module.scss';
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


type Tquery = {
    wareHouseId: string | undefined;
};

export default function ProdReceiptList() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        prodreceiptuuid,
        prodreceiptid,
        purchaseorderuuid,
        purchaseorderid,
        purchaseordercreate_at,
        purchaseordercreate_by,
        create_at,
        create_by,
        inspected,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice
    } = router.query;


    // 路由參數排除
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



    const [inspectedin, setInspectedin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [purchaseordercreate_atin, setPurchaseordercreate_atin] = useState<string>("");
    const [purchaseordercreate_byin, setPurchaseordercreate_byin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    const [prodreceiptuuidin, setProdreceiptuuidin] = useState<string>("");
    const [prodreceiptidin, setProdreceiptidin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
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
            label: '新增採購單',
            onClick: () => {
                router.push({
                    pathname: `/factoryDepartment/addPurchaseOrder`,
                    query: {
                        type: 'Tray',
                    },
                });
            },
        },
    ];
    //#endregion

    //#region call api
    //取進貨單主檔
    const getProdReceipt = async () => {
        try {
            // alert(checkfirstin);
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

            const response = await fetch(`${setting.apipath}GetProdReceipt?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            if (data.length > 0 && checkfirstin === 0) {
                console.log(data[0].receipted);
                getProdReceiptDetail(data[0].prodreceiptuuid);
                // GetProdReceiptDetailByPurchaseOrderId(data[0].prodreceiptuuid);
                setCreate_atin(data[0].create_at);
                setPurchaseorderuuidin(data[0].purchaseorderuuid);
                setPurchaseorderidin(data[0].purchaseorderid);
                setProdreceiptuuidin(data[0].prodreceiptuuid);
                setProdreceiptidin(data[0].prodreceiptid);
                setCreate_byin(data[0].create_by);
                setPurchaseordercreate_atin(data[0].purchaseordercreate_at);
                setPurchaseordercreate_byin(data[0].purchaseordercreate_by);
                setSuppliernamein(data[0].suppliername);
                setSuppliertaxidin(data[0].suppliertaxid);
                setInspectedin(data[0].inspected.toString());
                setSupplieraddressin(data[0].supplieraddress);
            }
        } catch (error: any) {
            setError("getProdReceipt:" + error.message);
            // myAlert.err({
            //     title:'getProdReceipt',
            //     content:error.message
            // })
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProdReceipt();
    }, []);

    //取對應的採購明細
    const getProdReceiptDetail = async (prodreceiptuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodreceiptuuid: string | undefined
            } = {
                prodreceiptuuid: prodreceiptuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetProdReceiptDetailById?${queryParams}`);
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
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // 確保 getPurchaseOrderDetail 的 useEffect 中的依賴項設置正確
    useEffect(() => {
        if (prodreceiptuuid) {
            getProdReceiptDetail(prodreceiptuuid);
            // GetProdReceiptDetailByPurchaseOrderId(prodreceiptuuid);
            setPurchaseorderidin(purchaseorderid as string);
            setPurchaseorderuuidin(purchaseorderuuid as string);
            setProdreceiptuuidin(prodreceiptuuid as string);
            setProdreceiptidin(prodreceiptid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setPurchaseordercreate_atin(purchaseordercreate_at as string);
            setPurchaseordercreate_byin(purchaseordercreate_by as string);
            setSuppliernamein(suppliername as string);
            setSuppliertaxidin(suppliertaxid as string);
            setInspectedin(inspected as string);
            setSupplieraddressin(supplieraddress as string);
        }
    }, [prodreceiptuuid]);

    //取已對應採購單的已進貨明細
    const GetProdReceiptDetailByPurchaseOrderId = async (prodreceiptuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodreceiptuuid: string | undefined
            } = {
                prodreceiptuuid: prodreceiptuuid as string | undefined,
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
                purchaseorderuuid: string | undefined,
                data: any
            } = {
                purchaseorderuuid: checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid as string | undefined,
                data: data2
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
            getProdReceipt();

            getProdReceiptDetail(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

            GetProdReceiptDetailByPurchaseOrderId(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

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
                purchaseorderuuid: string | undefined
            } = {
                purchaseorderuuid: checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid as string | undefined,
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
            getProdReceipt();

            getProdReceiptDetail(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

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
                    // TransferPurchaseOrderToProductReceipt();
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


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            <PageHeader02 tag={quotationStatusLookup[status] ?? '進貨單'} panelList={panelList} />
            <div className={scss.main}>
                <div className={scss.left}>
                    <div>
                        <Thead01 type={'ProdReceipt'} />
                        <Tbody01 type={'ProdReceipt'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.tite_main}>
                        <div>
                            {/* <span style={{ fontSize: '25px', fontWeight: 'bolder', color: '#14256a'}}>
                                採購單
                            </span> */}
                            <span style={{ display: (checkfirstin === 0 ? inspectedin : inspected) === "false" ? "" : "none" }}>
                                <MyButton_v2 px='px22' py='py4' theme='danger' label="未驗收" onClick={() => { handleClosePO() }} />
                            </span>
                            <span style={{ display: (checkfirstin === 0 ? inspectedin : inspected) === "true" ? "" : "none" }}>
                                <MyButton_v2 disabled={true} px='px22' py='py4' theme={undefined} label="已驗收" />
                            </span>
                        </div>
                        <div style={{ textAlign: 'right', height: '35.77px' }}>

                        </div>
                    </div>
                    <div className={scss.head_main}>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="採購日期"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? getTaiwanDateStr(purchaseordercreate_atin)?.toString() : purchaseordercreate_at,
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="進貨日期"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? getTaiwanDateStr(create_atin)?.toString() : create_at,
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="採購單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? purchaseorderidin : purchaseorderid,
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="進貨單號"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? prodreceiptidin : prodreceiptid,
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <InputSel
                                {...inputSelProps}
                                caption="採購人員"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: checkfirstin === 0 ? purchaseordercreate_byin : purchaseordercreate_by,
                                    },
                                }}
                            />
                            <InputSel
                                {...inputSelProps}
                                caption="進貨人員"
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
                    <div className={scss.content_main}>
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
                    </div>

                    <br />
                    <div className={scss.content_main_content}>
                        <Thead01 type={'ProdReceiptDetail'} />
                        <Tbody01 type={'ProdReceiptDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                    </div>
                    <br />
                    <div className={scss.foot_main}>
                        <div>
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
                        <span className={scss.mytitle} style={{ display: (checkfirstin === 0 ? inspectedin : inspected) === "true" ? "none" : "" }}>
                            <MyButton_v2 px='px22' py='py4' theme={undefined} label="驗收入庫" onClick={handleReceipt} />&nbsp;&nbsp;
                            <MyButton_v2 px='px22' py='py4' theme='danger' label="退貨單" onClick={handleReceipt} />
                            {/* <button className={scss.greenbutton}>退貨單</button> */}
                        </span>
                        <Thead01 type={'PurchaseOrderDetail2'} />
                        {data2.map((_item, index) => (
                            <CellWithBar key={index} className={scss.panelHeader11}>
                                <div className={scss.row01}>
                                    <span>{index + 1}</span>
                                    <span>{_item.productid}</span>
                                    <span>{_item.name}</span>
                                    <span style={{ color: 'red' }}>
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