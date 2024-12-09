import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';

import scss from './PRequisitionDetail.module.scss';
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
import icon_add from 'public/image/icon/fc_add2.svg';

type Tquery = {
    wareHouseId: string | undefined;
};

export default function PRequisitionDetail() {

    //路由參數
    const router = useRouter();
    const {
        firstin,
        purchaseorderuuid,
        create_at,
        create_by,
        purchaserequisitionuuid,
        purchaserequisitionid
    } = router.query;


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
    const productidRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


    const [isLoading, setIsLoading] = useState(false);

    const [searchproduct, setSearchProduct] = useState<string>("");

    const [create_atin, setCreate_atin] = useState<string>("");
    const [purchaseorderuuidin, setPurchaseorderuuidin] = useState<string>("");
    const [create_byin, setCreate_byin] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [need_date, setNeed_date] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [purchaserequisitionidin, setPurchaserequisitionidin] = useState<string>(purchaserequisitionid as string);
    const [purchaserequisitionuuidin, setPurchaserequisitionuuidin] = useState<string>(purchaserequisitionuuid as string);
    const [selectedValue, setSelectedValue] = useState('請選擇類別');

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
    const [currentindex, setCurrentIndex] = useState<number>(0);
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
        console.log(userInfo);
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
            const conditionModel = {
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
        setCreate_byin(userInfo?.employee?.chName.toString() || '');
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
    // useEffect(() => {
    //     if (purchaseorderuuid) {
    //         if (purchaseorderuuidin != purchaseorderuuid) {
    //             setData2([]);
    //         }
    //         getProductById(purchaseorderuuid);
    //         if (purchaseorderdetailuuid) {
    //         }
    //         setPurchaseorderuuidin(purchaseorderuuid as string);
    //         setCreate_atin(create_at as string);
    //         setCreate_byin(create_by as string);
    //     }
    // }, [purchaseorderuuid, purchaseorderdetailuuid]);

    //請購單申請
    const NewAddPurchaseRequisition = async () => {

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                create_at: create_atin,
                need_date: moment(need_date).format('YYYY-MM-DD'),
                create_by: userInfo?.employee?.id.toString(),
                note: note,
                data2: data2
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));
            console.log(JSON.stringify(inputModel));

            const response = await fetch(`${setting.apipath}/WareHouse/NewAddPurchaseRequisition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();

            if (result.success) {
                // 成功，顯示提示
                myAlert.success({ title: result.message });
                setPurchaserequisitionidin(result.purchaserequisitionid);
                setPurchaserequisitionuuidin(result.purchaserequisitionuuid);
                setStatus("編輯中");
            } else {
                // 失敗，顯示錯誤提示
                console.log(result.message);
                myAlert.warning({ title: '失敗', content: result.message });
            }

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const RemovePurchaseRequisitionDetail = async (id: any) => {
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
        // AddPurchaseRequisition();
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
        myAlert.confirm({
            title: '確定移除?',
            props: {
                onOk: () => {
                    const updatedData = data2.filter((_, i) => i !== index);
                    setData2(updatedData);
                }
            }
        });
        // RemovePurchaseRequisitionDetail(item.purchaserequisitiondetailuuid);
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
    // const handleStringChange = (index: any, target: any, value: any) => {
    //     const newData = [...data2];
    //     const newValue = value;
    //     newData[index] = {
    //         ...newData[index],
    //         [target]: newValue,
    //     };
    //     setData2(newData);
    // };


    const handleStringChange = (index: number, key: string, value: string) => {
        // 更新 data2 的值
        const updatedData2 = [...data2];
        updatedData2[index][key] = value;
        setData2(updatedData2);

        if (key === 'productid' || key === 'name' || key === 'spec') {

            // 更新建議選單的過濾邏輯
            const filters = {
                productid: updatedData2[index].productid?.trim().toLowerCase() || "",
                name: updatedData2[index].name?.trim().toLowerCase() || "",
                spec: updatedData2[index].spec?.trim().toLowerCase() || ""
            };

            if (Object.values(filters).some(filter => filter !== "")) {
                // 過濾符合條件的數據
                const filtered = data.filter(item =>
                    (!filters.productid || item.productid?.toLowerCase().includes(filters.productid)) &&
                    (!filters.name || item.name?.toLowerCase().includes(filters.name)) &&
                    (!filters.spec || item.spec?.toLowerCase().includes(filters.spec))
                );

                setFilteredData(filtered);
                setShowSuggestions(true);
            } else {
                // 若所有條件都為空，隱藏建議選單
                setShowSuggestions(false);
            }
        }
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
        console.log("OK");
        console.log(searchbardata);
        console.log(handinputproductid);
        console.log(handinputname);
        console.log(handinputspec);

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

            console.log(showSuggestions);
            console.log(filtered);
        }
        else {
            setHandinputproductuuid('');
            setFilteredData([]);
            setShowSuggestions(false);
        }

        // }, [data2]);
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

    // const handleSelect = (item: DataItem) => {
    //     console.log(item);
    //     console.log(data2);
    //     isSelectingRef.current = true;
    //     // setHandinputproductuuid(item.id);
    //     // setHandinputproductid(item.productid);
    //     // setHandinputname(item.name);
    //     // setHandinputspec(item.spec || "");
    //     // setHandinputunit(item.unit);
    //     // handleStringChange(currentindex, "productuuid", item.id);
    //     handleStringChange(currentindex, "productid", item.productid);
    //     handleStringChange(currentindex, "name", item.name);
    //     handleStringChange(currentindex, "spec", item.spec);
    //     handleStringChange(currentindex, "unit", item.unit);


    //     setShowSuggestions(false);
    // };

    // const handleSelect = (item: DataItem) => {
    //     console.log(item);
    //     console.log(data2);
    //     isSelectingRef.current = true;

    //     // 合併多個變更
    //     const newData = [...data2];
    //     newData[currentindex] = {
    //         ...newData[currentindex],
    //         productid: item.productid,
    //         name: item.name,
    //         spec: item.spec || "",
    //         unit: item.unit,
    //     };

    //     setData2(newData); // 一次更新所有變更
    //     setShowSuggestions(false); // 隱藏建議

    //     setSearchBarData(data);
    // };

    const handleSelect = (selectedItem: any) => {
        const updatedData2 = [...data2];
        const index = currentindex; // 假設 currentIndex 保存了目前正在編輯的行
        updatedData2[index] = {
            ...updatedData2[index],
            productuuid: selectedItem.id,
            productid: selectedItem.productid,
            name: selectedItem.name,
            spec: selectedItem.spec,
            unit: selectedItem.unit,
        };
        setData2(updatedData2);

        // 清除建議選單
        setFilteredData([]);
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

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleAddDetail = () => {

        const emptyDetail = {
            purchaserequisitiondetailuuid: "",
            productuuid: "",
            productid: "",
            quantity: 0,
            totalprice: 0,
            note: "",
            purchaserequisitionid: "",
            unitprice: 0,
            purchaserequisitionuuid: "",
            name: "",
            spec: "",
            unit: "",
            suppliername: null,
            deliverydate: null,
            status: null,
            quotereqdetailuuid: null,
            suppliertaxid: null,
            supplieraddress: null,
            supplierphone: null,
            suppliercontact: null,
            supplierfax: null
        };

        // 將空資料新增進陣列
        setData2((prevData) => [...prevData, emptyDetail]);

    };

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='新增請購單' panelList={panelList}
                customeRight={[
                    <>
                        <button
                            className={scss.shortsquarebtn}
                            style={{
                                display: `${status === "未送出" ? '' : 'none'}`
                            }}
                        >
                            編輯
                        </button>
                        <button
                            className={scss.shortredsquarebtn}
                            style={{
                                display: `${status === "" ? '' : 'none'}`
                            }}
                            onClick={() => {
                                NewAddPurchaseRequisition();
                            }}
                        >
                            儲存
                        </button>
                    </>
                ]
                }
                customeLeft={
                    [
                        <>
                            <span style={{ fontSize: '18px', paddingLeft: '10px' }}>
                                {status}
                            </span>
                        </>
                    ]} />
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.right}>
                    <div className={scss.content}>
                        {/* <div className={scss.head_head1}>
                            <div>
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查尋單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                            </div>
                            <div>
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
                        </div> */}
                        <div className={scss.head_body}>
                            <div>
                                <div className={scss.head_content1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="請購單號"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: purchaserequisitionid || ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="申請人員"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: create_byin,
                                                },
                                            }}
                                        />
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="請購日期"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') || '',
                                                },
                                            }}

                                        /> */}
                                        <InputSel
                                            caption="請購日期"
                                            className="global_tip_must"
                                            disabled={status === "未送出" ? true : false}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: create_atin ? moment(create_atin) : null,
                                                    onChange: (e) => { setCreate_atin(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />
                                        {/* <InputSel
                                            caption="請購類別"
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={false}
                                            selectProps={{
                                                props: {
                                                    menuPortalTarget: undefined,
                                                    styles: {
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 1003,
                                                        }),
                                                    },
                                                    options: [
                                                        { value: '文具', label: '文具' },
                                                        { value: '生產', label: '生產' },
                                                        { value: '總務', label: '總務' },
                                                    ],
                                                    onChange: (option: any) => setSelectedValue(option?.value),
                                                    value: selectedValue
                                                        ? {
                                                            value: selectedValue,
                                                            label: selectedValue,
                                                        }
                                                        : null,
                                                },
                                            }}
                                        /> */}
                                        {/* <button onClick={() => { alert("OK") }}>
                                            ...
                                        </button> */}
                                    </div>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="排版用"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
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
                                            caption="申請部門"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ paddingBottom: '10px' }}
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: userInfo?.employee?.jobs[0].department.name
                                                },
                                            }}
                                        />
                                        <InputSel
                                            caption="需用日期"
                                            className="global_tip_must"
                                            // disabled={status === "未儲存" ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: need_date ? moment(need_date) : null,
                                                    onChange: (e) => { setNeed_date(e ? moment(e).format('YYYY-MM-DDTHH:mm:ssZ') : '') }
                                                },
                                            }}
                                        />

                                    </div>
                                    <div></div>
                                </div>
                                <div className={scss.head_content2}>
                                    <div>
                                        {/* <InputSel
                                            {...inputSelProps}
                                            caption="備註說明"
                                            captionStyle={{ fontSize: '18px' }}
                                            wrapperStyle={{ marginBottom: '10px' }}
                                            disabled={false}
                                            inputProps={{
                                                props: {
                                                    value: note,
                                                    onChange: (e) => { setNote(e.target.value) }
                                                },
                                            }}
                                        /> */}
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <div>
                                {/* <div style={{ backgroundColor: '#f5f5f5', padding: '10px 24px' }}>
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
                                </div> */}
                            </div>
                        </div>
                        <div
                            style={{ paddingBottom: '18px' }}
                        >
                            <span
                                style={{
                                    height: '50px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'center', // 水平置中
                                    alignItems: 'center',     // 垂直置中
                                    fontSize: '18px'
                                }}
                            >
                                請購項目
                            </span>
                            {/* {handinputproductid}/{handinputname}/{handinputspec}<br/>
                            數量{searchbardata.length}
                            數量{filteredData.length} */}
                        </div>
                        <div className={scss.head_content1}>

                            <InputSel
                                {...inputSelProps}
                                caption="品項數量"
                                disabled={true}
                                inputProps={{
                                    props: {
                                        type: "number",
                                        // style: { color: 'red' },
                                        value: data2.length,
                                    },
                                }}
                            />
                        </div>
                        <div style={{ border: '1px solid rgb(168, 168, 168)', marginLeft: '20px', marginRight: '20px' }}>

                            <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                                {/* <Thead01 type={'AddPR_ReqList'} /> */}
                                <div className={scss.thead20}>
                                    <span>

                                    </span>
                                    <span>序</span>
                                    <span>料號</span>
                                    <span>品名</span>
                                    <span>規格</span>
                                    <span>數量</span>
                                    <span>單位</span>
                                    <span>備註(用途說明)</span>
                                    <span></span>
                                    <span></span>
                                </div>
                                {data2.map((_item, index) => (
                                    <CellWithBar key={index} className={scss.panelHeader20}>
                                        <div className={scss.row01}>
                                            <span>
                                                <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index, _item) }}>
                                                    {/* <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} /> */}
                                                    <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                </button>
                                            </span>
                                            <span>{index + 1}</span>
                                            <span>
                                                <input
                                                    ref={productidRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    value={_item.productid !== undefined ? _item.productid : ''}
                                                    // readOnly
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    onChange={(e) => {
                                                        handleStringChange(index, "productid", e.target.value);
                                                        setCurrentIndex(index);
                                                        // setHandinputproductid(e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={nameRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    value={_item.name !== undefined ? _item.name : ''}
                                                    // readOnly
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    onChange={(e) => {
                                                        handleStringChange(index, "name", e.target.value);
                                                        setCurrentIndex(index);
                                                        // setHandinputname(e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={specRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    value={_item.spec !== undefined ? _item.spec : ''}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    // readOnly
                                                    onChange={(e) => {
                                                        handleStringChange(index, "spec", e.target.value);
                                                        setCurrentIndex(index);
                                                        // setHandinputspec(e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={quantityRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    // maxLength={5}
                                                    value={_item.quantity !== undefined ? _item.quantity : 0}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    // readOnly
                                                    onChange={(e) => {
                                                        // handleNumberChange(index, "quantity", e.target.value);
                                                        handleStringChange(index, "quantity", e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={unitRefs.current[index]}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    value={_item.unit !== undefined ? _item.unit : ''}
                                                    // readOnly
                                                    onChange={(e) => {
                                                        handleStringChange(index, "unit", e.target.value);
                                                    }}
                                                />
                                            </span>
                                            <span>
                                                <input
                                                    ref={noteRefs.current[index]}
                                                    // style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                    style={{ backgroundColor: 'transparent', width: '95%', borderBottom: '1px solid black' }}
                                                    type="text"
                                                    value={_item.note !== undefined ? _item.note : ''}
                                                    // readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                    // readOnly
                                                    onChange={(e) => {
                                                        handleStringChange(index, "note", e.target.value);
                                                    }}
                                                />
                                            </span>


                                        </div>
                                    </CellWithBar>

                                ))}

                            </div>
                            <span style={{ paddingLeft: '22px', position: 'relative' }}>
                                <button onClick={() => { handleAddDetail() }} style={{ fontSize: '18px' }} >
                                    <img src={icon_add.src} alt="add" style={{ width: '25px', height: '25px' }} />
                                    新增品項
                                </button>
                            </span>

                        </div>
                        <div className={scss.body_foot1}>
                            <div>
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



            </div>
        </SubLayer >

    )

}