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
import icon_search from 'public/image/icon/search.svg';
import icon_fc_arrow_down from 'public/image/icon/fc_arrow_down.svg';
import icon_fc_arrow_down_gray from 'public/image/icon/fc_arrow_down_gray.svg';


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
        invoice,
        status
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
    const { wareHouseId } = router.query as Tquery;
    const [isLoading, setIsLoading] = useState(false);
    const [leftbaropen, setLeftbaropen] = useState<boolean>(true);
    const [addprodentrybtn, setAddprodentrybtn] = useState<boolean>(true);


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
    const [supplierphonein, setSupplierphonein] = useState<string>("");
    const [statusin, setStatusin] = useState<string>("");
    const [invoicein, setInvoicein] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    //入庫總數
    const [totalentry, setTotalentry] = useState<string>("");
    //入庫進度
    const [completeentry, setCompleteentry] = useState<number>(0);

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
        // { searchGroup },
        // {
        //     type: 'addButton',
        //     label: '新增採購單',
        //     onClick: () => {
        //         router.push({
        //             pathname: `/factoryDepartment/addPurchaseOrder`,
        //             query: {
        //                 type: 'Tray',
        //             },
        //         });
        //     },
        // },
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
                setStatusin(data[0].status);
                setSupplierphonein(data[0].supplierphone);
                setInvoicein(data[0].invoice);
            }
        } catch (error: any) {
            setError("getProdReceipt:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProdReceipt();
    }, []);

    //取對應的進貨明細
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

            // 進貨進度
            let totalentry = data.length; // 總數量
            let completeentry = 0; // 完成數量

            data.forEach((element: any) => {
                // 將 alreadyinquantity 和 quantity 轉換為整數
                const alreadyInQuantity = parseInt(element.alreadyinquantity, 10);
                const quantity = parseInt(element.quantity, 10);

                if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity >= quantity) {
                    completeentry += 1;
                }
            });
            setTotalentry(totalentry);
            setCompleteentry(completeentry);



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
            if (prodreceiptuuidin != prodreceiptuuid) {
                setData2([]);
            }
            // getProdReceiptDetail(prodreceiptuuid);
            // if (prodreceiptdetailuuid) {
            //     GetProdReceiptDetailByPurchaseOrderId(purchaseorderuuid, purchaseorderdetailuuid);
            // }
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
            setStatusin(status as string);
            setSupplierphonein(supplierphone as string);
            setInvoicein(invoice as string);
        }
    }, [prodreceiptuuid]);

    //取已對應進貨單的已入庫單
    const GetProdEntryDetailByProdReceiptId = async (prodreceiptuuid: any, prodreceiptdetailuuid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                prodreceiptuuid: string | undefined,
                prodreceiptdetailuuid: string | undefined
            } = {
                prodreceiptuuid: prodreceiptuuid as string | undefined,
                prodreceiptdetailuuid: prodreceiptdetailuuid as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetProdEntryDetailByProdReceiptId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData2(prevData2 => {
                // 创建一个 Set 来存储现有 ID
                const existingIds = new Set(prevData2.map(item => item.id));

                // 过滤掉重复项
                const newItems = data.filter((item: { id: string; }) => !existingIds.has(item.id));

                // 将非重复的新项添加到 prevData2 中
                const updatedData = [...prevData2, ...newItems];

                // 调用 handleAddProdEntry 更新按钮状态
                handleAddProdEntry(updatedData);

                return updatedData;
            });

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 進貨單入庫
    const TransferProdReceiptToProdEntry = async () => {
        alert("in");
        try {
            // return;
            setIsLoading(true);


            const conditionModel: {
                prodreceiptuuid: string | undefined,
                data: any,
                username: string | undefined
            } = {
                prodreceiptuuid: checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid as string | undefined,
                data: data2,
                username: userInfo?.username as string | undefined
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}TransferProdReceiptToProdEntry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data11111');
            }

            const responseData = await response.json();
            myAlert.info(
                {
                    title: '單據新增成功',
                    content: `進貨單號為:${responseData}`
                })

            setData2([]);
            getProdReceipt();

            getProdReceiptDetail(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

            // GetProdEntryDetailByProdReceiptId(checkfirstin === 0 ? prodreceiptuuidin : prodreceiptuuid);

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
        handleAddProdEntry(updatedData); // 在删除后检查并更新按钮状态
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // searchData(keyword1, keyword2)
        // alert(keyword1);
        // alert(keyword2);
        // alert(keyword3);
        // 在這裡可以添加搜索的邏輯，使用keyword1來進行搜索
    };


    function handleTransfer() {
        if (editstatus === true) {
            myAlert.warning({ title: "請先結束編輯狀態" });
        }
        else {
            myAlert.confirm({
                title: '確定要轉為入庫單嗎?',
                content: <>
                    <h1>請確認數量是否正確</h1>
                </>,
                props: {
                    onOk: () => {
                        TransferProdReceiptToProdEntry();
                    }
                }
            });
        }
    }

    const handleAddProdEntry = (data: any) => {
        let shouldDisable = false; // 默认情况下，新增入庫按钮是启用的

        for (let i = 0; i < data.length; i++) {
            const alreadyInQuantity = parseFloat(data[i].alreadyinquantity); // 将 alreadyinquantity 转换为数字类型
            const quantity = parseFloat(data[i].quantity); // 将 quantity 转换为数字类型

            // 如果有任何一项 alreadyinquantity 等于 quantity，则应禁用新增入庫按钮
            if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity === quantity) {
                shouldDisable = true;
                break; // 找到符合条件的项就可以退出循环了
            }

            // 如果有任何一项 alreadyinquantity 大于 quantity，则应禁用新增入庫按钮
            if (!isNaN(alreadyInQuantity) && !isNaN(quantity) && alreadyInQuantity > quantity) {
                shouldDisable = true;
                break; // 找到符合条件的项就可以退出循环了
            }
        }

        // 在这里输出 addprodentrybtn 的状态，看看是否正确
        console.log("shouldDisable:", shouldDisable);

        setAddprodentrybtn(!shouldDisable); // 根据 shouldDisable 的值来设置 addprodentrybtn 的状态
    };

    // useEffect(() => {
    //     console.log(addprodentrybtn);
    // }, [addprodentrybtn]);





    return (
        <SubLayer isLoading_subLayer={false}>
            <PageHeader02 tag={'進貨單'} panelList={panelList} />
            <div className={scss.container}>
                <div className={scss.left} style={{ display: `${leftbaropen === true ? '' : 'none'}` }}>
                    <div className={scss.content}>
                        <hr />
                        <div>
                            <Thead01 type={'ProdReceipt'} />
                            <Tbody01 type={'ProdReceipt'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <button className={scss.minibtn} onClick={() => { setLeftbaropen(!leftbaropen) }}>
                                    進貨查詢
                                </button>
                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className={scss.head_content1}>
                            <div>
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
                                    caption="採購人員"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: checkfirstin === 0 ? purchaseordercreate_byin : purchaseordercreate_by,
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="單據狀態"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: statusin,
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
                            </div>
                        </div>

                        <div className={scss.head_content2}>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="廠商名稱"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: suppliernamein ? suppliernamein : ' ',
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
                                />                                <InputSel
                                    {...inputSelProps}
                                    caption="聯絡電話"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: supplierphonein ? supplierphonein : ' ',
                                        },
                                    }}
                                />
                            </div>
                            <div>
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
                            </div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="發票號碼"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: invoicein ? invoicein : ' ',
                                        },
                                    }}
                                />
                            </div>
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
                            <div style={{ textAlign: "right" }}>
                                <span >
                                    <button className={scss.redbtn} onClick={() => { alert("結案") }}>結案</button>
                                </span>
                            </div>
                        </div>
                        <div className={scss.head_foot2}>
                            <div>

                            </div>
                            <div></div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="入庫進度"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: `${completeentry}/${totalentry}`
                                        },
                                    }}
                                />
                            </div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1}>
                            <Thead01 type={'ProdReceiptDetail'} />
                            {/* <Tbody01 type={'ProdReceiptDetail'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {data1 && (
                                data1.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader14}>
                                        <div className={scss.row01}>
                                            <span>{index + 1}</span>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span style={{ color: '#ea1833' }}>{_item.alreadyinquantity}</span>
                                            <span>{_item.quantity}</span>
                                            <span>{_item.unit}</span>
                                            <span>{_item.unitprice.toLocaleString()}</span>
                                            <span>{_item.totalprice.toLocaleString()}</span>
                                            <span>
                                                <button onClick={() => { GetProdEntryDetailByProdReceiptId(_item.prodreceiptuuid, _item.id) }}>
                                                    <img src={icon_fc_arrow_down.src} alt="add" style={{ width: '20px', height: '20px' }} />
                                                </button>
                                                {/* <button style={{ display: `${(statusin === "採購中") ? '' : 'none'}` }} onClick={() => { alert("OK") }}>
                                                    <img src={icon_fc_arrow_down.src} alt="add" style={{ width: '20px', height: '20px' }} />
                                                </button> */}
                                                {/* <button style={{ display: `${statusin === "已結案" ? '' : 'none'}` }}>
                                                    <img src={icon_fc_arrow_down_gray.src} alt="addtoList" style={{ color: 'red', width: '20px', height: '20px' }} />
                                                </button> */}
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                        <br />
                        <div className={scss.body_foot1}>
                            <div>
                                (1).轉入庫單進行入庫<br />
                                (2).轉付款申請單請附款項。
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
                        <div className={scss.foot_head1}>
                            <div>
                                {/* <span className={scss.mytitle} style={{ display: (checkfirstin === 0 ? inspectedin : inspected) === "true" ? "none" : "" }}>
                                <MyButton_v2 px='px22' py='py4' theme={undefined} label="驗收入庫" onClick={handleReceipt} />&nbsp;&nbsp;
                                <MyButton_v2 px='px22' py='py4' theme='danger' label="退貨單" onClick={handleReceipt} />
                            </span> */}
                                <span style={{ display: `${(data2.length > 0 && addprodentrybtn) ? '' : 'none'}` }}>
                                    <button className={scss.redbtn} onClick={() => { handleTransfer() }}>新增入庫</button>
                                </span>
                                <span style={{ display: `${(data2.length > 0 && addprodentrybtn) ? 'none' : ''}` }}>
                                    <button className={scss.disabledbtn}>新增入庫</button>
                                </span>
                            </div>
                            <div></div>
                            <div>

                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span>
                                    <button className={scss.redbtn} onClick={() => { alert("新增付款單") }}>新增付款</button>
                                </span>
                                {/* <span style={{ display: `${data2.length > 0 && statusin === '已核准' ? '' : 'none'}` }}> */}

                            </div>
                        </div>

                        <div className={scss.foot_content1}>

                            <Thead01 type={'ProdReceiptDetail2'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader13}>
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
                                                    let newQuantity = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                    // 如果新數量超過最大數量，設置為最大數量
                                                    if (newQuantity > _item.maxquantity) {
                                                        newQuantity = _item.maxquantity;
                                                    }
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
                                                style={{ backgroundColor: 'transparent', width: '80px' }}
                                                type="text"
                                                value={_item.unitprice.toLocaleString()}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
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
            </div>
        </SubLayer >

    )

}