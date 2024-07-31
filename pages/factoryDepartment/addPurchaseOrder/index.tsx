import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './addPurchaseOrder.module.scss';
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
import icon_search from 'public/image/icon/fc_search.svg';
import { Modal } from 'antd';
import icon_close from 'public/image/icon/fc_close.svg';


type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddPurchaseOrder() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaseorderuuid,
        create_at,
        create_by,
        purchaseorderdetailuuid
    } = router.query;

    const getQueryParam = (param: any) => {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param;
    };


    //登入者資料
    const { userInfo } = useContext(AppContext);
    const { erpFeature } = useContext(AppContext);
    //資料列宣告
    const [data, setData] = useState<any[]>([]);
    const [data1, setData1] = useState<any[]>([]);
    const [data2, setData2] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));

    const status = router.query.status as TquotationStatus;
    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [need_date, setNeed_date] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");

    //手key
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");

    const [editstatus, setEditStatus] = useState<boolean>(false);
    const [editrowid, setEditRowId] = useState<number>(0);

    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

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
                            router.back();
                            // router.push({
                            //     pathname: `/factoryDepartment/purchaseRequisitionList`,
                            //     query: {
                            //     },
                            // });
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
            //  console.log(userInfo);
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

            const response = await fetch(`${setting.apipath}GetPurchaseOrder?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);


            console.log(userInfo);

            console.log(erpFeature);
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


    useEffect(() => {
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setCreate_byin(userInfo?.username.toString() || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
    }, []);

    //取所有物料，for查詢代入用
    const getProductById = async (productuuid: any) => {
        try {
            // alert(purchaseorderuuid)
            // setIsLoading(true);
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

            console.log(data);
            // setData2(prevData2 => [...prevData2, ...data]);
            setData2(prevData2 => {
                // 取得當前的productid列表
                const existingProductIds = prevData2.map(item => item.productid);

                // 檢查並提示哪些productid已經存在
                const duplicateProductIds = data.filter((item: { productid: any; }) => existingProductIds.includes(item.productid));
                if (duplicateProductIds.length > 0) {
                    myAlert.info({ title: `${duplicateProductIds.map((item: { productid: any; }) => item.productid).join(', ')}已加入` });
                }

                // 過濾掉已經存在的productid
                const newData = data.filter((item: { productid: any; }) => !existingProductIds.includes(item.productid));

                // 返回合併的結果
                return [...prevData2, ...newData];
            });



        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
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
            setPurchaseorderuuidin(purchaseorderuuid as string);
            setCreate_atin(create_at as string);
            setCreate_byin(create_by as string);
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
                need_date: moment(need_date).format('YYYY-MM-DD'),
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


            const response = await fetch(`${setting.apipath}AddPurchaseRequisition`, {
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
            myAlert.info(
                {
                    title: '單據新增成功',
                    content: `請購單據號碼為:${data}`
                })

            setData2([]);

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
        if (data2.length === 0) {
            myAlert.warning({ title: "尚未加入任何請購項目" });
        }
        else {
            // 檢查是否有任何一筆的 quantity 為 0
            const hasZeroQuantity = data2.some(item => item.quantity === 0);

            if (hasZeroQuantity) {
                myAlert.warning({ title: "請購項目中有數量為0的項目，請檢查並修正。" });
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
    }


    // 手key加入
    const handleAddByHandKey = () => {
        if (handinputname === '' && handinputspec === '' && handinputquantity === '' && handinputunit === '' && handinputnote === '') {
            myAlert.warning({ title: '未輸入名稱、規格或數量' });
        } else {
            const newEntry = {
                name: handinputname,
                spec: handinputspec,
                quantity: handinputquantity,
                unit: handinputunit,
                note: handinputnote
            };

            setData2(prevData2 => [...prevData2, newEntry]);

            setHandinputname('');
            setHandinputspec('');
            setHandinputquantity('');
            setHandinputunit('');
            setHandinputnote('');
        }
    };

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
        // // console.log(data2);
    };

    // 從口袋清單移除
    const handleRemove = (index: number) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
    };

    // 改變數字口袋清單值
    const handleNumberChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = parseFloat(value.replace(/,/g, '')) || 0;
        newData[index] = {
            ...newData[index],
            [target]: newValue,
        };
        setData2(newData);
    };
    // 改變文字口袋清單值
    const handleStringChange = (index: any, target: any, value: any) => {
        const newData = [...data2];
        const newValue = value;
        newData[index] = {
            ...newData[index],
            [target]: newValue,
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





    //#region modal
    const [productSearchmodalopen, setProductSearchmodalopen] = useState<boolean>(false);

    const [test, setTest] = useState<string>("");

    //帶入請購查詢畫面的資料
    // const [quotereqname, setQuotereqname] = useState<string>("");
    // const [quotereqspec, setQuotereqspec] = useState<string>("");
    // const [quotereqquantity, setQuotereqquantity] = useState<string>("");
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





    //打開查詢modal
    const productSearchModalOpen = async () => {
        setProductSearchmodalopen(true);
    }

    //關閉詢價單modal
    const productSearchModalClose = async () => {
        setData([]);
        setKeyword1("");
        setKeyword2("");
        setKeyword3("");
        await new Promise(resolve => setTimeout(resolve, 50));
        setProductSearchmodalopen(false);
    }




    interface DataItem {
        name: string;
    }

    // const [handinputname, setHandinputname] = useState("");

    // const [handinputname, setHandinputname] = useState("");
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setHandinputname(inputValue);
        console.log(data);
        if (inputValue) {
            const filtered = data.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredData(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredData([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (name: string) => {
        setHandinputname(name);
        setShowSuggestions(false);
    };


    // 採購單查詢
    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }


    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag={quotationStatusLookup[status] ?? '新增採購單'} panelList={panelList} />
            {/* <div className={scss.main}> */}
            <div className={scss.container}>
                <div className={scss.left} style={{ display: `${leftbaropen === true ? '' : 'none'}` }}>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={scss.searchbar}>
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
                                        <img src={icon_search.src} alt="edit" style={{ width: '30px', height: '30px' }} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={scss.content}>
                        <div>
                            <Thead01 type={'AddPR_GetProduct'} />
                            {/* <Tbody01 type={'AddPR_GetProduct'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {/* {data && (
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
                            )} */}
                        </div>
                    </div>
                </div>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen); }}>
                                    <img src={icon_search.src} alt="search" style={{ height: '30px', width: '30px' }} />
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
                                    caption="採購日期"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: getTaiwanDateStr(create_atin || '') || '',
                                        },
                                    }}
                                />
                                <InputSel
                                    caption="需用日期"
                                    disabled={false}
                                    captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                    // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                    datePickerProps={{
                                        props: {
                                            value: getTaiwanDateStr(need_date || '') ? moment(need_date) : null,
                                            onChange: (e) => { setNeed_date((e?.toString() || '') || '') }
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="採購部門"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: userInfo?.username,
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="申請人"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: create_byin,
                                        },
                                    }}
                                />
                            </div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.head_content2}>
                            <div>
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
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.head_content3}>
                            <div style={{ marginRight: '20px' }}>

                            </div>
                            <div></div>
                        </div>
                        <div className={scss.head_foot1}>
                            <div>
                            </div>
                            <div></div>
                            <div></div>
                            <div style={{ textAlign: 'right' }}>
                                {/* <button className={scss.redbtn} onClick={() => { handleAddPR() }}>送出申請</button> */}
                                <button className={scss.minibtn} onClick={() => { handleAddPR() }}>
                                    送出申請
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_foot2}>
                            <div>
                                {/* <button className={scss.minibtn} onClick={() => { getProduct(); setProductSearchmodalopen(!productSearchmodalopen); }}>
                                    品項查詢
                                </button> */}
                            </div>
                            <div style={{ marginTop: '5px' }}></div>
                            <div></div>
                            <div>
                                <span style={{ fontSize: '18px', color: '#14256a', verticalAlign: 'bottom', }}>
                                    總比數：
                                    {data2.length}
                                </span>
                            </div>
                        </div>
                        <div className={scss.body_content1}>
                            <Thead01 type={'AddPR_ReqList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>
                                            <input
                                                ref={nameRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                value={_item.name !== undefined ? _item.name : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "name", e.target.value);
                                                }}
                                            />
                                        </span>
                                        {/* <span>{_item.spec}</span> */}
                                        <span>
                                            <input
                                                ref={specRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                type="text"
                                                value={_item.spec !== undefined ? _item.spec : ''}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "spec", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                maxLength={5}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleNumberChange(index, "quantity", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={unitRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                type="text"
                                                value={_item.unit !== undefined ? _item.unit : ''}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "unit", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                value={_item.note !== undefined ? _item.note : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "note", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {/* <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            {/* <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span> */}
                                            {/* <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                        </span>

                                    </div>
                                </CellWithBar>
                            ))}
                            {showSuggestions && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    zIndex: 1002,
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    width: '200px', // 可以根據需要調整寬度
                                    marginLeft: '10px', // 調整與輸入框的間距
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSelect(item.name)}
                                                style={{ padding: '8px', cursor: 'pointer' }}
                                                onMouseDown={(e) => e.preventDefault()} // 防止 blur 事件
                                            >
                                                {item.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '8px' }}>沒有匹配的結果</div>
                                    )}
                                </div>
                            )}

                            <div className={scss.addbar} style={{ borderBottom: '1px solid #c1c1c1' }}>
                                <div>

                                </div>
                                <div>
                                    {/* <input
                                        type="text"
                                        placeholder='請輸入品項名稱'
                                        value={handinputname}
                                        onChange={(e) => setHandinputname(e.target.value)}
                                    /> */}
                                    <input
                                        type="text"
                                        placeholder="請輸入品項名稱"
                                        value={handinputname}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='請輸入品項規格'
                                        value={handinputspec}
                                        onChange={(e) => setHandinputspec(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        style={{ backgroundColor: 'transparent', width: '50px' }}
                                        type="text"
                                        placeholder='數量'
                                        maxLength={5}
                                        value={handinputquantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) { // 只允許數字
                                                setHandinputquantity(value);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='單位'
                                        value={handinputunit}
                                        onChange={(e) => setHandinputunit(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='備註'
                                        value={handinputnote}
                                        onChange={(e) => setHandinputnote(e.target.value)}
                                    />
                                </div>
                                <div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button onClick={() => { handleAddByHandKey() }}>
                                        <img src={icon_fc_add.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={scss.body_foot1}>
                            <div>
                                (1).可自行輸入請購項目。<br />
                                (2).如不知請購品項料號，可以利用查詢代入。<br />
                            </div>
                            <div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    visible={searchmodalopen}
                    footer={null}
                    onCancel={SearchModalClose}
                    width="1000px"
                    maskClosable={false}
                    title={
                        <div className={scss.modal_head_head1}>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {data.length} 筆</span>
                            </div>
                        </div>
                    }
                    style={{ top: 250 }}
                >

                    <div className={scss.modal_head_content1}>
                        <div style={{ border: '1px solid #c1c1c1', borderRight: '0px', paddingRight: '50px', paddingLeft: '50px' }}>
                            <form className={scss.modal_search_bar} onSubmit={handleSubmit} style={{ alignItems: 'center', width: '100%' }}>
                                {/* <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="起始日期"
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
                                <br />
                                <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                    <InputSel
                                        caption="截止日期"
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
                                </div> */}
                                <br />
                                <div>
                                    <InputSel
                                        caption="採購日期"
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
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="採購單號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword2 ? keyword2 : ' ',
                                                onChange: (e) => { setKeyword2(e.target.value) }
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
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
                                            },
                                        }}
                                    />
                                </div>
                                <br />
                                <div>
                                    <InputSel
                                        {...inputSelProps}
                                        caption="廠商名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword3 ? keyword3 : ' ',
                                                onChange: (e) => { setKeyword3(e.target.value) }
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '5px' }}>
                                    <span>
                                        <button className={scss.minibtn} type="submit">清除條件</button>
                                    </span>
                                    <span>
                                        <button className={scss.minibtn} type="submit">查找</button>
                                    </span>
                                </div>

                            </form>
                        </div>
                        <div style={{
                            maxHeight: '500px',
                            overflowY: 'auto',
                            border: '1px solid gray',
                        }}>
                            <Thead01 type={'POHistory'} />
                            <Tbody01 type={'POHistory'} data={data} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} />
                        </div>

                    </div>
                </Modal >

            </div>
        </SubLayer >

    )

}