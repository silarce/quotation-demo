import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './addPurchaseRequisition.module.scss';
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
import { nextDay, parseJSON } from 'date-fns';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import icon_edit from 'public/image/icon/edit.svg';
import icon_save from 'public/image/icon/fc_save.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_fc_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search from 'public/image/icon/search.svg';


type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddPurchaseRequisition() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaseorderuuid,
        purchaseorderid,
        create_at,
        create_by,
        receipted,
        suppliername,
        suppliertaxid,
        supplieraddress,
        supplierphone,
        invoice,
        purchaseorderdetailuuid
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };

    const purchaseorderuuidStr = getQueryParam(purchaseorderuuid);


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

    const [searchproduct, setSearchProduct] = useState<string>("");


    const [receiptedin, setReceiptedin] = useState<string>("");
    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [purchaseorderidin, setPurchaseorderidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [suppliernamein, setSuppliernamein] = useState<string>("");
    const [suppliertaxidin, setSuppliertaxidin] = useState<string>("");
    const [supplieraddressin, setSupplieraddressin] = useState<string>("");
    const [purchaseorderdetailuuidin, setPurchaseorderdetailuuidin] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [need_date, setNeed_date] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [totalprice, setTotalPrice] = useState<string>("");
    const [taxprice, setTaxPrice] = useState<string>("");
    const [totalpayprice, setTotalPayPrice] = useState<string>("");

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);


    //#region 上方功能列

    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '物料號碼',
        },
        {
            placeholder: '物料名稱',
        },
        {
            placeholder: '物料規格',
        },
    ];

    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {
        // const keywordWhpname = valueArr[0] as string;
        // const keywordMaterialnumber = valueArr[1] as string;
        // const keywordSpec = valueArr[2] as string;
        // searchData(keywordWhpname, keywordMaterialnumber, keywordSpec);
    };

    // 搜尋功能
    const searchGroup = {
        searchTargetList,
        doSearch,
    };

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
            const response = await fetch(`${setting.apipath}SearchProductById?${queryParams}`);
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
        finally {
            setIsLoading(false);
        }
    };



    //新增按鈕
    const panelList: TpanelList = [
        // { searchGroup },
        {
            type: 'myButton',
            label: '返回',
            onClick: () => {
                myAlert.confirm({
                    title: '確定要返回請購管理嗎?',
                    content: <>
                        <h1>未儲存的資料將不會保留</h1>
                    </>,
                    props: {
                        onOk: () => {
                            router.push({
                                pathname: `/factoryDepartment/purchaseRequisitionList`,
                                query: {
                                },
                            });
                        }
                    }
                });
            },
        },
    ];
    //#endregion

    //#region api呼叫區
    //取物料清單
    const getProduct = async () => {
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

            const response = await fetch(`${setting.apipath}GetProduct?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            console.log(data);
            setCreate_atin(getTaiwanDateStr(moment().toString()) || '');
            setCreate_byin(userInfo?.username.toString() || '');
            setNeed_date(getTaiwanDateStr(moment().toString()) || '');

            console.log(need_date);
            // await new Promise(resolve => setTimeout(resolve, 500));
            // if (data.length > 0 && checkfirstin === 0) {
            //     console.log(data[0].receipted);
            //     getPurchaseOrderDetail(data[0].purchaseorderuuid);
            //     // GetProdReceiptDetailByPurchaseOrderId(data[0].purchaseorderuuid);
            //     setCreate_atin(data[0].create_at);
            //     setPurchaseorderuuidin(data[0].purchaseorderuuid);
            //     setPurchaseorderidin(data[0].purchaseorderid);
            //     setCreate_byin(data[0].create_by);
            //     setSuppliernamein(data[0].suppliername);
            //     setSuppliertaxidin(data[0].suppliertaxid);
            //     setReceiptedin(data[0].receipted.toString());
            //     setSupplieraddressin(data[0].supplieraddress);
            // }
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getProduct();
    }, []);

    //取對應的採購明細，加入請購單項目
    const getProductById = async (productuuid: any) => {
        try {
            // alert(purchaseorderuuid)
            setIsLoading(true);
            const conditionModel: {
                productuuid: string | undefined
            } = {
                productuuid: productuuid as string | undefined,
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}GetProductById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData1(data);

            setData2(prevData2 => [...prevData2, ...data]);
            // setData2(data);



        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (purchaseorderuuid) {
            if (purchaseorderuuidin != purchaseorderuuid) {
                setData2([]);
            }
            getProductById(purchaseorderuuid);
            if (purchaseorderdetailuuid) {
            }
            setPurchaseorderidin(purchaseorderid as string);
            setPurchaseorderuuidin(purchaseorderuuid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
            setSuppliernamein(suppliername as string);
            setSuppliertaxidin(suppliertaxid as string);
            setReceiptedin(receipted as string);
            setSupplieraddressin(supplieraddress as string);
        }
    }, [purchaseorderuuid, purchaseorderdetailuuid]);

    //請購單申請
    const AddPurchaseRequisition = async () => {
        try {
            setIsLoading(true);
            const conditionModel: {
                create_at: any,
                need_date: any,
                create_by: any,
                note: any
                data: any,
            } = {
                create_at: create_atin,
                need_date: need_date,
                create_by: create_byin,
                note: note,
                data: data2
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}AddPurchaseRequisition?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // getProduct();

            // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };




    //#endregion

    //#region 按鈕作動區

    // 送出按鈕
    function handleAddPR() {
        // TransferPurchaseOrderToProductReceipt();
        if (editstatus === true) {
            myAlert.warning({ title: "請先結束編輯狀態" });
        } else {
            myAlert.confirm({
                title: '確定要送出請購單嗎?',
                content: <>
                    <h1>請檢查品名、數量是否正確</h1>
                </>,
                props: {
                    onOk: () => {
                        AddPurchaseRequisition();
                    }
                }
            });
        }
    }

    // 結案按鈕
    function handleClosePR() {

    }
    //#endregion

    //#region 口袋清單功能區
    // 口袋清單編輯狀態控制，一次只能針對一列做修改
    const handleEditStatus = (index: number) => {
        setEditRowId(index);
        setEditStatus(true);
        setData2Restore(data2);
    };

    const handleSaveEdit = (index: number) => {
        setEditStatus(false);
        console.log(data2);
    };

    // 從口袋清單移除
    const handleRemove = (index: number) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
    };

    // 改變口袋清單值
    const handleChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = parseFloat(value.replace(/,/g, '')) || 0;
        newData[index] = {
            ...newData[index],
            [target]: newValue, // 使用計算屬性名稱來設置屬性
        };
        setData2(newData);
    };

    // 還原口袋清單
    const handleRestore = () => {
        setData2(data2restore);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        searchData(keyword1, keyword2, keyword3)
        // alert(keyword1);
        // alert(keyword2);
        // alert(keyword3);
        // 在這裡可以添加搜索的邏輯，使用keyword1來進行搜索
    };

    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '新增請購單'} panelList={panelList} />
            {/* <div className={scss.main}> */}
            <div className={scss.container}>
                <div className={scss.left}>
                    <div className={scss.content}>
                        <form onSubmit={handleSubmit}>
                            <div className={scss.left_searchbar}>
                                <div style={{ borderBottom: '1px solid gray', textAlign: 'right' }}>
                                    <input
                                        type="text"
                                        placeholder='物料號碼'
                                        value={keyword1}
                                        onChange={(e) => setKeyword1(e.target.value)}
                                    />
                                </div>
                                <div style={{ borderBottom: '1px solid gray', textAlign: 'right' }}>
                                    <input
                                        type="text"
                                        placeholder='物料名稱'
                                        value={keyword2}
                                        onChange={(e) => setKeyword2(e.target.value)}
                                    />
                                </div>
                                <div style={{ borderBottom: '1px solid gray', textAlign: 'right' }}>
                                    <input
                                        type="text"
                                        placeholder='物料規格'
                                        value={keyword3}
                                        onChange={(e) => setKeyword3(e.target.value)}
                                    />
                                    <button type="submit">
                                        <img src={icon_search.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div>
                            <Thead01 type={'AddPR_GetProduct'} />
                            <Tbody01 type={'AddPR_GetProduct'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                            {data && (
                                data.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader19}>
                                        <div className={scss.row01}>
                                            <span>{_item.productid}</span>
                                            <span>{_item.name}</span>
                                            <span>{_item.spec}</span>
                                            <span>{_item.count}</span>
                                            <span>
                                                <button onClick={() => { getProductById(_item.id) }}>
                                                    <img src={icon_fc_add.src} alt="addToList" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.tite_main}>
                            <div>
                                <span >
                                    <MyButton_v2 px='px22' py='py4' theme='danger' label="送出申請" onClick={() => { handleAddPR() }} />
                                </span>
                                <span style={{ display: (checkfirstin === 0 ? receiptedin : receipted) === "true" ? "" : "none" }}>
                                    <MyButton_v2 disabled={true} px='px22' py='py4' theme={undefined} label="已結案" />
                                </span>
                            </div>
                            <div style={{ textAlign: 'right', height: '35.77px' }}>

                            </div>
                        </div>
                        <div className={scss.head_main}>
                            <div style={{ marginRight: '20px' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="請購日期"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: create_atin,
                                        },
                                    }}
                                />


                            </div>
                            <div style={{ marginRight: '20px' }}>
                                {/* {purchaseorderid} */}
                                <InputSel
                                    caption="需用日期"
                                    disabled={false}
                                    captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                    // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                    datePickerProps={{
                                        props: {
                                            value: moment() || '',
                                            onChange: (e) => { setNeed_date(e?.format('YYYY-MM-DD') || '') }
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="經辦人員"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: create_byin,
                                        },
                                    }}
                                />

                            </div>
                        </div>

                        <div className={scss.content_main}>
                            <div style={{ marginRight: '20px' }}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="備註"
                                    disabled={false}
                                    inputProps={{
                                        props: {
                                            value: note,
                                            onChange: (e) => { setNote(e.target.value) }
                                        },
                                    }}
                                />
                            </div>
                            <div>

                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {/* <button className={scss.greenbutton} onClick={() => { alert("OK") }} >
                                <img src={icon_fc_add.src} alt="Arrow Down" style={{ width: '20px', height: '20px' }} />
                            </button> */}
                            </div>
                        </div>
                        <br />
                        <div className={scss.content_main_content}>
                            <Thead01 type={'AddPR_ReqList'} />
                            {/* <Tbody01 type={'AddPR_ReqList'} data={data1} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.name}</span>
                                        <span>{_item.spec}</span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '50px' }}
                                                type="text"
                                                maxLength={5}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleChange(index, "quantity", e.target.value);
                                                }}
                                            />
                                        </span>

                                        {/* <span>
                                            <input
                                                ref={unitpriceRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '80px' }}
                                                type="text"
                                                value={_item.unitprice.toString()}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    //特殊狀況，需計算總額
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
                                        </span> */}
                                        {/* <span> */}
                                        {/* {_item.totalprice.toLocaleString()} */}
                                        {/* </span> */}
                                        <span>
                                            &nbsp;&nbsp;
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                        </span>
                                    </div>
                                </CellWithBar>
                            ))}
                        </div>
                        <br />
                        <div className={scss.foot_main}>
                            <div>
                                {/* (1).採購單請回簽.並確認可交貨日期。<br />
                            (2).請於出貨單上註明本公司產品編號,及產品名稱,以利請款。<br />
                            (3).請配合定量包裝及標示品名規格, 方便點收。 */}
                            </div>
                            <div>
                            </div>
                            <div>

                                {/* <table className={scss.count_table}>
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
                            </table> */}
                            </div>
                        </div>
                        <div className={scss.content_main_content}>

                        </div>
                    </div>
                </div>
            </div>
        </SubLayer >

    )

}