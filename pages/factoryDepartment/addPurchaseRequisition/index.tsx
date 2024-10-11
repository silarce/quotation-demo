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
import icon_search from 'public/image/icon/fc_search.svg';
import { Modal } from 'antd';
import icon_close from 'public/image/icon/fc_close.svg';
import icon_remove from 'public/image/icon/fc_remove.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_save_gray from 'public/image/icon/fc_save_gray.svg';
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function AddPurchaseRequisition() {

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
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [prdata, setPrdata] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);

    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [need_date, setNeed_date] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [purchaserequisitionid, setPurchaserequisitionid] = useState<string>("");
    const [purchaserequisitionuuid, setPurchaserequisitionuuid] = useState<string>("");

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

    //手key
    const [handinputname, setHandinputname] = useState<string>("");
    const [handinputspec, setHandinputspec] = useState<string>("");
    const [handinputquantity, setHandinputquantity] = useState<string>("");
    const [handinputunit, setHandinputunit] = useState<string>("");
    const [handinputnote, setHandinputnote] = useState<string>("");
    const [handinputproductid, setHandinputproductid] = useState<string>("");
    const [handinputproductuuid, setHandinputproductuuid] = useState<string>("");

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
            const response = await fetch(`${setting.apipath}/WareHouse/SearchProductById?${queryParams}`);
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
                        }
                    }
                });
            },
        },
    ];
    //#endregion

    const getPurchaseRequisition = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: "未送出",
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


            setSearchdata(data);
            setPrdata(data);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            getPurchaseRequisition();
            getProduct();
            hasFetchedData.current = true;
        }
    }, []);

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
            // setData1(data);

            setData2(data);
            console.log(data2);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            // setIsLoading(false);
        }
    };




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

            const response = await fetch(`${setting.apipath}/WareHouse/GetProduct?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setModalData(data);
            setSearchBarData(data);

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
            const response = await fetch(`${setting.apipath}/WareHouse/GetProductById?${queryParams}`);
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

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                create_at: create_atin,
                need_date: moment(need_date).format('YYYY-MM-DD'),
                create_by: create_byin,
                note: note,
            };



            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/WareHouse/AddPurchaseRequisition`, {
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
                    content: `請購單據號碼為:${data[0].purchaserequisitionid}`
                })

            setData2([]);
            setPurchaserequisitionid(data[0].purchaserequisitionid);
            setPurchaserequisitionuuid(data[0].id);
            setStatus("未送出");
            getPurchaseRequisition();

            // getProduct();

            // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const RemovePurchaseRequisitionDetail = async (id: any) => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {
                id: id
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/RemovePurchaseRequisitionDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            console.log(purchaserequisitionuuid);

            getPurchaseRequisitionDetail(purchaserequisitionuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    //請購單申請
    const ClosePurchaseRequisition = async () => {

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel: {
                purchaserequisitionid: any,
                purchaserequisitionuuid: any
            } = {
                purchaserequisitionid: purchaserequisitionid,
                purchaserequisitionuuid: purchaserequisitionuuid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/WareHouse/ClosePurchaseRequisition`, {
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
        AddPurchaseRequisition();
    }


    // 手key加入
    const handleAddByHandKey = async () => {
        if (handinputname === '' || handinputspec === '' || handinputquantity === '' || handinputunit === '') {
            myAlert.warning({ title: '未輸入名稱、規格或數量' });
        } else {
            const newEntry = {
                id: handinputproductuuid,
                productid: handinputproductid,
                productuuid: handinputproductuuid,
                name: handinputname,
                spec: handinputspec,
                quantity: handinputquantity,
                unit: handinputunit,
                note: handinputnote
            };

            setHandinputproductuuid('');
            setHandinputproductid('');
            setHandinputname('');
            setHandinputspec('');
            setHandinputquantity('');
            setHandinputunit('');
            setHandinputnote('');

            try {
                setIsLoading(true);
                const conditionModel: {
                    purchaserequisitionid: any,
                    purchaserequisitionuuid: any,
                    data: any,
                } = {
                    purchaserequisitionid: purchaserequisitionid,
                    purchaserequisitionuuid: purchaserequisitionuuid,
                    data: newEntry
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                const response = await fetch(`${setting.apipath}/WareHouse/AddPurchaseRequisitionDetail`, {
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

                setData2(prevData2 => [...prevData2, data]);

                getPurchaseRequisitionDetail(purchaserequisitionuuid);


            } catch (error: any) {
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
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
    const handleRemove = (index: number, item: any) => {
        const updatedData = data2.filter((_, i) => i !== index);
        setData2(updatedData);
        RemovePurchaseRequisitionDetail(item.purchaserequisitiondetailuuid);
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
        setModalData(data);
        setProductSearchmodalopen(!productSearchmodalopen);
    }

    //關閉詢價單modal
    const productSearchModalClose = async () => {
        setModalData([]);
        setKeyword1("");
        setKeyword2("");
        setKeyword3("");
        await new Promise(resolve => setTimeout(resolve, 50));
        setProductSearchmodalopen(false);
    }




    interface DataItem {
        id: string;
        productid: string;
        spec: string | null; // spec 可能為 null
        name: string;
        unit: string;
    }


    // const [handinputname, setHandinputname] = useState("");
    // const [handinputspec, setHandinputspec] = useState("");
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const isSelectingRef = useRef(false);
    // const data: DataItem[] = [
    //     // 你的資料項目
    // ];

    useEffect(() => {
        if (isSelectingRef.current) return;

        let filtered = searchbardata;
        if (handinputproductid !== "" || handinputname !== "" || handinputspec != "") {
            if (handinputproductuuid) {
                let filtered = searchbardata;
                filtered = searchbardata.filter(item =>
                    item.id.includes(handinputproductuuid)
                );
            }
            if (handinputproductid) {
                filtered = filtered.filter(item =>
                    item.productid.includes(handinputproductid)
                );
            }

            if (handinputname) {
                filtered = filtered.filter(item =>
                    item.name.includes(handinputname)
                );
            }

            if (handinputspec) {
                filtered = filtered.filter(item =>
                    item.spec && item.spec.includes(handinputspec)
                );
            }

            setFilteredData(filtered);
            // const shouldShowSuggestions = filtered.length > 0 && (materialnumber || productname || productspec) && canedit === true;
            setShowSuggestions(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));

        }
        else {
            setHandinputproductuuid('');
            setFilteredData([]);
            setShowSuggestions(false);
        }


    }, [handinputproductid, handinputname, handinputspec]);

    const handleProductidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputproductid(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setFilteredData(data);
        isSelectingRef.current = false;
        setHandinputname(e.target.value);
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputspec(e.target.value);
    };

    const handleSelect = (item: DataItem) => {
        isSelectingRef.current = true;
        setHandinputproductuuid(item.id);
        setHandinputproductid(item.productid);
        setHandinputname(item.name);
        setHandinputspec(item.spec || "");
        setHandinputunit(item.unit);
        setShowSuggestions(false);
    };





    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });



    const handleMouseUp = () => {
        setDragging(false);
    };


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, offset, position]);

    const handleMouseMove = (event: any) => {
        if (dragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };

    const handleMouseDown = (event: any) => {
        setDragging(true);
        // 記錄下滑鼠的偏差
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };



    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputunit('');
        setHandinputnote('');
        setHandinputquantity('');
        setShowSuggestions(false);
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
    }, []);


    const handlePreAddPR = () => {
        setPurchaserequisitionid("儲存後產生");
        setStatus("未儲存");
        setNote("");
        setCreate_byin(userInfo?.username as string);
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
        setData2([]);
    }

    const handlecancelAddPR = () => {
        setPurchaserequisitionid("");
        setStatus("");
        setData2([]);
        setNote("");
        setNeed_date(moment().toString());
    }

    const handlesaveAddPRDetail = () => {

        let needDateObj = new Date(need_date);
        let createAtinObj = new Date(create_atin);

        if (data2.length === 0) {
            myAlert.warning({ title: "尚未加入任何請購項目" });
            return;
        }
        else {

            const hasZeroQuantity = data2.some(item => item.quantity === 0 || item.quantity === '');

            if (hasZeroQuantity) {
                myAlert.warning({ title: "請購項目中有數量為0的項目，請檢查並修正。" });
            } else {
                myAlert.confirm({
                    title: '確定要送出請購單嗎?',
                    content: <>
                        <h1>請檢查品名、數量是否正確</h1>
                    </>,
                    props: {
                        onOk: async () => {
                            ClosePurchaseRequisition();
                            setPurchaserequisitionid("");
                            setPurchaserequisitionuuid("");
                            setCreate_atin(moment().format('YYYY-MM-DD') || '');
                            setNeed_date(moment().format('YYYY-MM-DD') || '');
                            setStatus("");
                            setNote("")
                            setData2([]);

                            await router.push({
                                pathname: `/factoryDepartment/purchaseRequisitionList`,
                                query: {
                                    purchaserequisitionid: purchaserequisitionid
                                },
                            });
                        }
                    }
                });
            }
        }
    }

    const dropdownRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        // 按下 ESC 鍵關閉下拉選單
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 27) { // ESC 鍵的 keyCode 是 27
                setFilteredData([]);
                if (dropdownRef.current) {
                    dropdownRef.current.style.display = 'none';
                }
            }
        };

        // 為整個 document 添加事件監聽器
        document.addEventListener('keydown', handleKeyDown);

        // 清理事件監聽器
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }

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
            setSearchdata(prdata);
            return;
        }

        // 過濾資料
        let filteredData = prdata.filter(item => {
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

    const handlechangepr = (item: any) => {
        handleRowClick(item.purchaserequisitionid);
        setData2([]);
        setPurchaserequisitionid(item.purchaserequisitionid);
        setPurchaserequisitionuuid(item.purchaserequisitionuuid);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setNeed_date(item.need_date);
        setCreate_byin(item.create_by);
        getPurchaseRequisitionDetail(item.purchaserequisitionuuid);
    }

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleDeletePR = async (id: any) => {

        myAlert.confirm({
            title: '確定要刪除這筆單據嗎?',
            content: <>
                <h1>刪除後將無法復原</h1>
            </>,
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            id: id
                        };


                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };

                        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                        const response = await fetch(`${setting.apipath}/WareHouse/DeletePurchaseRequisition?${queryParams}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }
                        const responseData = await response.text();

                        myAlert.success({ title: '刪除成功' });

                        setPurchaserequisitionid('');
                        setCreate_atin('');
                        setNeed_date('');
                        setNote('');
                        setCreate_byin('');
                        setStatus('');
                        setData2([]);
                        getPurchaseRequisition();
                        // setKeyword3('');



                    } catch (error: any) {
                        setError(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }

                }
            }
        })
    };


    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='新增請購單' panelList={panelList} />
            {/* <div className={scss.main}> */}
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                            </div>
                            <div>
                                {/* <button className={scss.squarebtn} onClick={() => { handleAddPR() }} title="新增單據">
                                    <img src={icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button> */}
                                <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlePreAddPR() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button
                                    className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleAddPR() }}
                                    title="儲存新增"
                                    disabled={status !== '未儲存'}
                                >
                                    <img
                                        src={status === '未儲存' ? icon_save.src : icon_save_gray.src}
                                        alt="search"
                                        style={{ height: '20px', width: '20px' }}
                                    />
                                    儲存
                                </button>
                                &nbsp;
                                <button
                                    className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handlecancelAddPR() }}
                                    title="取消新增"
                                    disabled={status !== '未儲存'}
                                >
                                    <img src={status === '未儲存' ? icon_cancel.src : icon_cancel_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handleDeletePR(purchaserequisitionuuid) }} title="單據刪除">
                                    <img src={icon_delete.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    刪除
                                </button>
                            </div>
                            <div>
                                <button style={{ display: `${status === "未送出" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { handlesaveAddPRDetail() }} title="單據申請">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    送出
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
                                                    value: purchaserequisitionid || ' ',
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
                                                    value: getTaiwanDateStr(create_atin || '') || '',
                                                },
                                            }}
                                        />

                                    </div>
                                    <div>
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            // disabled={status === "未儲存" ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                            // wrapperStyle={{ width: '500px', margin: 'auto' }}
                                            datePickerProps={{
                                                props: {
                                                    value: getTaiwanDateStr(need_date || '') ? moment(need_date) : null,
                                                    onChange: (e) => { setNeed_date((e?.toString() || '') || '') }
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
                                                    value: create_byin,
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="備註"
                                            disabled={status === "未儲存" ? false : true}
                                            inputProps={{
                                                props: {
                                                    value: note || ' ',
                                                    onChange: (e) => { setNote(e.target.value) }
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
                                </div>
                                <div className={scss.head_foot1}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
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
                                                value: status || ' ',
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="品項數量"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: data2.length || ' ',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={scss.head_foot2}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                            <Thead01 type={'AddPR_ReqList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>
                                            {/* <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index, _item) }}>
                                                {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                <img src={icon_cancel3.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            {/* <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span> */}
                                            {/* <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                        </span>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>
                                            <input
                                                ref={nameRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.name !== undefined ? _item.name : ''}
                                                readOnly
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
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.spec !== undefined ? _item.spec : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "spec", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={quantityRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                maxLength={5}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleNumberChange(index, "quantity", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={unitRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.unit !== undefined ? _item.unit : ''}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "unit", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                style={{ backgroundColor: 'transparent', width: '95%' }}
                                                type="text"
                                                value={_item.note !== undefined ? _item.note : ''}
                                                // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                readOnly
                                                onChange={(e) => {
                                                    handleStringChange(index, "note", e.target.value);
                                                }}
                                            />
                                        </span>


                                    </div>
                                </CellWithBar>
                            ))}


                            <div className={scss.addbar} style={{ display: `${(purchaserequisitionid != '' && status === '未送出') ? '' : 'none'}`, borderBottom: '1px solid #c1c1c1' }}>
                                <div>
                                    <button onClick={() => { handleAddByHandKey() }} style={{ paddingLeft: '15px' }}>
                                        <img src={icon_fc_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入料號"
                                        value={handinputproductid}
                                        onChange={handleProductidChange}
                                        style={{ width: '100%' }}
                                    />
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
                                        onChange={handleNameChange}
                                        style={{ width: '100%' }}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="請輸入品項規格"
                                        value={handinputspec}
                                        onChange={handleSpecChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        style={{ backgroundColor: 'transparent', width: '50px' }}
                                        type="text"
                                        placeholder='數量'
                                        value={handinputquantity}
                                        onChange={(e) => {
                                            const quantity = e.target.value;
                                            // 若為無效數字或空字串，將 quantity 設為 0

                                            setHandinputquantity(quantity);
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
                                    &nbsp;&nbsp;
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className={scss.body_foot1}>
                            <div>
                                {/* (1).可自行輸入請購項目。<br />
                            (2).如不知請購品項料號，可以利用查詢代入。<br /> */}
                                {filteredData.length > 0 && (
                                    <ul ref={dropdownRef}
                                        style={{
                                            border: '1px solid #c1c1c1',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            marginTop: '0px',
                                            left: '20px',
                                            position: 'absolute',
                                            width: '1000px',
                                            backgroundColor: 'white',
                                            zIndex: 1004,
                                            display: `${showSuggestions ? '' : 'none'}`
                                        }}>
                                        {filteredData.map(item => (
                                            <li
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                style={{
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    border: '1px solid #c1c1c1',
                                                    display: 'flex', // 使用 flexbox
                                                    justifyContent: 'space-between', // 在項目之間創建間距
                                                    alignItems: 'center' // 垂直置中
                                                }}
                                            >
                                                <span style={{ flex: '1 1 20%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                    {item.productid}
                                                </span>
                                                <span style={{ flex: '1 1 47%' }}> {/* 40% 的寬度，根據需要調整 */}
                                                    {item.name}
                                                </span>
                                                <span style={{ flex: '1 1 30%' }}> {/* 30% 的寬度，根據需要調整 */}
                                                    {item.spec}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>

                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>







                <DragableModal
                    handleText="品項查詢"
                    style={{ zIndex: '1000', width: '900px' }}
                    show={productSearchmodalopen}
                    onCrossClick={productSearchModalClose}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', width: '920px' }}>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>類別：</span>
                        <span style={{ fontSize: '16px' }}>
                            <select value={selectedOption}
                                style={{ borderBottom: '1px solid #c1c1c1' }}
                                onChange={(e) => { setSelectedOption(e.target.value) }}>
                                <option value="物料">物料</option>
                            </select>
                        </span>

                        <span style={{ fontSize: '16px', color: '#14256a' }}>查詢：</span>
                        <span style={{ fontSize: '16px' }}>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder='　料號'
                                    value={keyword1}
                                    style={{ borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                    onChange={(e) => setKeyword1(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder='　名稱'
                                    value={keyword2}
                                    style={{ borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                    onChange={(e) => setKeyword2(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder='　規格'
                                    value={keyword3}
                                    style={{ borderBottom: '1px solid #c1c1c1' }}
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
                        <Thead01 type={'AddPR_GetProduct'} />
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {modaldata && (
                                modaldata.map((_item: any, index: number) => (
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
                    {/* </Modal> */}
                </DragableModal>

                <DragableModal
                    handleText="查找單據"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={searchmodalopen}
                    onCrossClick={SearchModalClose}
                >
                    {/* <Modal
                        visible={searchmodalopen}
                        footer={null}
                        onCancel={SearchModalClose}
                        width="1000px"
                        maskClosable={false}
                        // title='單據查找'
                        // title={
                        // <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%',paddingRight:'20px' }}>
                        //     <span>查詢條件</span>
                        //     <span >筆數：共 {data.length} 筆</span>
                        // </div>

                        // }
                        // centered
                        style={{ top: 200 }}
                    > */}

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
                                    <select
                                        value={keyword3 || ''}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setKeyword3(e.target.value);
                                            e.target.blur(); // 讓 select 失去焦點
                                        }}
                                        disabled={false}
                                        style={{
                                            fontSize: '18px',
                                            borderBottom: '1px solid #14256a',
                                            color: '#14256a'
                                        }}
                                    >
                                        <option value="">全部</option>
                                        <option value="未送出">未送出</option>
                                        <option value="已結案">已結案</option>
                                    </select>

                                </div>
                                <br />
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
                                    {/* <span>
                                        <button className={scss.minibtn} type="submit">查找</button>
                                    </span> */}
                                </div>
                            </form>
                        </div>
                        <div style={{
                            maxHeight: '465.81px',
                            overflowY: 'auto',
                            border: '1px solid #c1c1c1',
                            // boxShadow: 'inset 0px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.5)',
                            // padding: '10px',
                            // backgroundColor: '#f0f0f0' // 根據需要調整背景顏色
                        }}>
                            <Thead01 type={'PurchaseRequisition'} />
                            {/* <Tbody01 type={'PurchaseRequisition'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {searchdata && (
                                searchdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader15}>
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.purchaserequisitionid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => { handlechangepr(_item) }}>
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
                    {/* </Modal > */}
                </DragableModal>



            </div>
        </SubLayer >

    )

}