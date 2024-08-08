import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';
import scss from './pickingList.module.scss';
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
import icon_save_gray from 'public/image/icon/fc_save_gray.svg';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_fc_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import { Modal } from 'antd';
import icon_close from 'public/image/icon/fc_close.svg';
import icon_fc_add2 from 'public/image/icon/fc_add2.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';


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
    const [employeedata, setEmployeedata] = useState<any[]>([]);



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
    const [pickinglistid, setPickinglistid] = useState<string>("");
    const [pickinglistuuid, setPickinglistuuid] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    //搜尋
    const [keyword1, setKeyword1] = useState<string>("");
    const [keyword2, setKeyword2] = useState<string>("");
    const [keyword3, setKeyword3] = useState<string>("");
    const [keyword4, setKeyword4] = useState<string>("");
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
    const [handinputpickingby, setHandinputpickingby] = useState<string>("");


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
        // {
        //     type: 'myButton',
        //     label: '返回',
        //     onClick: () => {
        //         myAlert.confirm({
        //             title: '確定要返回請購管理嗎?',
        //             content: <>
        //                 <h1>未儲存的資料將不會保留</h1>
        //             </>,
        //             props: {
        //                 onOk: () => {
        //                     router.back();
        //                     // router.push({
        //                     //     pathname: `/factoryDepartment/purchaseRequisitionList`,
        //                     //     query: {
        //                     //     },
        //                     // });
        //                 }
        //             }
        //         });
        //     },
        // },
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

            const response = await fetch(`${setting.apipath}GetProduct?${queryParams}`);
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

    const getPickingList = async () => {
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

            const response = await fetch(`${setting.apipath}GetPickingList?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData1(data);
            // setDatarestore(data);
            setSearchdata(data);


            console.log(data);
            setPickinglistid(data[0].pickinglistid);
            setPickinglistuuid(data[0].id);
            setCreate_atin(data[0].create_at);
            setNote(data[0].note);
            setStatus(data[0].status);
            setCreate_byin(data[0].create_by);

            getPickingListDetailById(data[0].id);


            console.log(userInfo);

            console.log(erpFeature);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    const getEmployeeList = async () => {
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

            const response = await fetch(`${setting.apipath}GetEmployeeList?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            console.log(data);
            setEmployeedata(data);


        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            getProduct();
            getPickingList();
            getEmployeeList();
            hasFetchedData.current = true;
        }
    }, []);

    useEffect(() => {
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setCreate_byin(userInfo?.username.toString() || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
    }, []);



    const getPickingListDetailById = async (pickinglistuuid: any) => {
        try {
            //  console.log(userInfo);
            setIsLoading(true);
            const conditionModel = {
                pickinglistuuid: pickinglistuuid
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}GetPickingListDetailById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            setData2(data);

            console.log(data2);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };



    //新增領料單主檔
    const AddPickingList = async () => {

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel: {
                note: any,
                username: any
            } = {
                note: note,
                username: userInfo?.username
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const response = await fetch(`${setting.apipath}AddPickingList`, {
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
                    content: `領料單據號碼為:${data.pickinglistid}`
                })

            setPickinglistid(data.pickinglistid);
            setPickinglistuuid(data.id);
            setStatus(data.status);
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
                        onOk: () => {
                            AddPurchaseRequisition();
                        }
                    }
                });
            }
        }
    }


    // 手key加入
    const handleAddByHandKey = async () => {
        console.log(pickinglistuuid);

        // console.log(handinputquantity);

        if (handinputname === '' || handinputspec === '' || handinputquantity === '') {
            myAlert.warning({ title: '請確認品名、規格或數量是否遺漏' });
        }
        else if (handinputpickingby === '') {
            myAlert.warning({ title: '請輸入領料人員' });
        }
        else {
            const newPicking = {
                id: handinputproductuuid,
                productid: handinputproductid,
                name: handinputname,
                spec: handinputspec,
                quantity: handinputquantity,
                unit: handinputunit,
                note: handinputnote,
                username: handinputpickingby,
                productuuid: handinputproductuuid,
                picking_by: handinputpickingby
            };

            // console.log(newPicking);
            // console.log()

            // setData2(prevData2 => [...prevData2, newPicking]);

            setHandinputproductuuid('');
            setHandinputproductid('');
            setHandinputname('');
            setHandinputspec('');
            setHandinputquantity('');
            setHandinputunit('');
            setHandinputnote('');

            console.log(data2);



            try {
                setIsLoading(true);

                const conditionModel = {
                    data: newPicking,
                    pickinglistid: pickinglistid,
                    pickinglistuuid: pickinglistuuid
                };

                const inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'WareHouseService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                const response = await fetch(`${setting.apipath}AddPickingListDetail`, {
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


            } catch (error: any) {
                setError(error.message);
            } finally {
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
        alert(index);
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

        if (handinputproductuuid) {
            filtered = searchbardata.filter(item =>
                item.id.includes(handinputproductuuid)
            );
        }
        if (handinputproductid) {
            filtered = searchbardata.filter(item =>
                item.productid.includes(handinputproductid)
            );
        }

        if (handinputname) {
            filtered = searchbardata.filter(item =>
                item.name.includes(handinputname)
            );
        }

        if (handinputspec) {
            filtered = searchbardata.filter(item =>
                item.spec && item.spec.includes(handinputspec)
            );
        }

        setFilteredData(filtered);
        // const shouldShowSuggestions = filtered.length > 0 && (materialnumber || productname || productspec) && canedit === true;
        setShowSuggestions(Boolean(filtered.length > 0 && (handinputproductid || handinputname || handinputspec)));
    }, [handinputproductuuid, handinputproductid, handinputname, handinputspec]);

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





    const [employeefilteredData, setEmployeeFilteredData] = useState<any[]>([]);
    const [showempSuggestions, setShowEmpSuggestions] = useState(false);
    useEffect(() => {
        if (isSelectingRef.current) return;

        let filtered = employeedata;

        if (handinputpickingby) {
            filtered = employeedata.filter(item =>
                item.ch_name.includes(handinputpickingby)
            );
        }

        setEmployeeFilteredData(filtered);
        setShowEmpSuggestions(Boolean(filtered.length > 0 && (handinputpickingby)))
    }, [handinputpickingby]);

    const handlePickingByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSelectingRef.current = false;
        setHandinputpickingby(e.target.value)
    };

    const handlePickingbyclick = (ch_name: any) => {
        isSelectingRef.current = true;
        setHandinputpickingby(ch_name);
        setShowEmpSuggestions(true);
    }







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

    const [searchmodalopen, setSearchmodalopen] = useState<boolean>(false);
    const SearchModalClose = async () => {
        setSearchmodalopen(false);
    }

    const filterData = () => {
        const startDate = keywordstartdate;
        const endDate = keywordenddate;
        const requisitionId = keyword2.trim();
        const status = keyword3.trim();
        const suppliername = keyword4.trim();

        // 檢查是否所有條件都為空
        if ((!startDate || !startDate.isValid()) &&
            (!endDate || !endDate.isValid()) &&
            !requisitionId &&
            !status &&
            !suppliername) {
            setSearchdata(data1);
            return;
        }

        // 過濾資料
        let filteredData = data1.filter(item => {
            const createAt = moment(item.create_at);
            const isDateInRange = (!startDate || !startDate.isValid() || !endDate || !endDate.isValid())
                ? true
                : createAt.isBetween(startDate, endDate, 'days', '[]');
            return isDateInRange;
        });

        // 模糊查詢請購單號
        if (requisitionId) {
            filteredData = filteredData.filter(item =>
                item.pickinglistid.toString().includes(requisitionId)
            );
        }

        // 模糊查詢單據狀態
        if (status) {
            filteredData = filteredData.filter(item =>
                item.status.toString().includes(status)
            );
        }
        if (suppliername) {
            filteredData = filteredData.filter(item =>
                item.suppliername.toString().includes(suppliername)
            );
        }

        setSearchdata(filteredData);
    };

    // 監聽條件變更
    useEffect(() => {
        filterData();
    }, [keywordstartdate, keywordenddate, keyword2, keyword3, keyword4]);

    const clearFilterData = (e: any) => {
        e.preventDefault();
        setKeywordstartdate(null)
        setKeywordenddate(null);
        setKeyword2('');
        setKeyword3('');
        setKeyword4('');
    }

    const handlechangepickinglist = (item: any) => {
        setPickinglistid(item.pickinglistid);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        getPickingListDetailById(item.id);
        setData2([]);
    }

    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputunit('');
        setHandinputpickingby('');
        setHandinputquantity('');
        setShowSuggestions(false);
    }

    const handlepreAddPickingList = () => {
        setPickinglistid("儲存後建立")
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        // console.log(data[0].pickinglistid.toString()); 
        // return;
        // setPickinglistid(data[0].pickinglistid.toString());
        setStatus("未儲存");
    }

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='領料管理' panelList={panelList} />
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
                                <button className={scss.squarebtn} onClick={() => { handlepreAddPickingList() }} title="新增單據">
                                    <img src={icon_fc_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查詢單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                &nbsp;
                            </div>
                            <div>
                                <button className={status === '未儲存' ? scss.squarebtn : scss.disablesquarebtn} onClick={() => { AddPickingList() }} title="查詢單據">
                                    <img src={status === '未儲存' ?icon_save.src:icon_save_gray.src} alt="search" style={{ height: '20px', width: '20px'}} />
                                    儲存
                                </button>
                            </div>
                            <div></div>
                            <div>
                                <button style={{ display: `${status === "領料中" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { alert("close") }} title="單據結案">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button>
                                &nbsp;
                                <button style={{ display: `${status === "領料中" ? 'none' : ''}` }} className={scss.disablesquarebtn} onClick={() => { alert("close") }} title="單據已結">
                                    <img src={icon_task_close.src} alt="closed" style={{ height: '20px', width: '20px' }} />
                                    已結
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_content1}>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="領料單號"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            // value: getTaiwanDateStr(create_atin || '') || '',
                                            style: { color: `${pickinglistid ? '#404040' : '#c1c1c1'}` },
                                            value: pickinglistid || ' '
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="製單人員"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: create_byin,
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="領料日期"
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: getTaiwanDateStr(create_atin || '') || '',
                                        },
                                    }}
                                />
                            </div>
                            <div></div>
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

                            </div>
                        </div>
                        <div className={scss.head_content2}>
                            <div>
                                <InputSel
                                    {...inputSelProps}
                                    caption="備註"
                                    disabled={(status === '領料中' || status === '已結案') ? true : false}
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
                                {/* <span>
                                    <button className={scss.redbtn} onClick={() => { handleAddPR() }}>結案</button>
                                </span> */}
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
                            <Thead01 type={'AddPR_PickingList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>{index + 1}</span>
                                        <span>{_item.productid}</span>
                                        <span>
                                            <input
                                                ref={nameRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                value={_item.name !== undefined ? _item.name : ''}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                maxLength={5}
                                                value={_item.quantity !== undefined ? _item.quantity : 0}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
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
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                value={_item.note !== undefined ? _item.note : ''}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "note", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            <input
                                                ref={noteRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                value={_item.picking_by !== undefined ? _item.picking_by : ''}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleStringChange(index, "picking_by", e.target.value);
                                                }}
                                            />
                                        </span>
                                        <span>
                                            &nbsp;&nbsp;&nbsp;
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                                {/* <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} /> */}
                                            </button>
                                            {/* <span style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }}>　</span> */}
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { handleSaveEdit(index) }}>
                                                <img src={icon_save.src} alt="save" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                        </span>

                                    </div>
                                </CellWithBar>
                            ))}


                            <div className={scss.addbar} style={{ borderBottom: '1px solid #c1c1c1', display: `${(pickinglistid != '' && status === '領料中') ? '' : 'none'}` }}>
                                <div></div>
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
                                        maxLength={4}
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
                                    <input
                                        type="text"
                                        value={handinputpickingby}
                                        onChange={handlePickingByChange}
                                        placeholder="姓名"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button onClick={() => { handleAddByHandKey() }}>
                                        <img src={icon_fc_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                    &nbsp;&nbsp;
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote || handinputpickingby ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button>

                                </div>
                            </div>

                        </div>
                        <div>
                            {employeefilteredData.length > 0 && (
                                <ul style={{
                                    border: '1px solid #ccc',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    marginTop: '0px',
                                    right: '55px',
                                    position: 'absolute',
                                    width: '150px',
                                    backgroundColor: 'white',
                                    zIndex: 1004, // 確保下拉清單在最上層,
                                    display: `${showempSuggestions ? '' : 'none'}`
                                }}>
                                    {employeefilteredData.map(emp => (
                                        <li
                                            key={emp.id}
                                            onClick={() => {
                                                handlePickingbyclick(emp.ch_name);
                                                setEmployeeFilteredData([]);
                                            }}
                                            style={{ cursor: 'pointer', padding: '8px' }}
                                        >
                                            {emp.ch_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={scss.body_foot1}>
                            <div>
                                (1).請確實填領取品名、規格與數量。<br />
                                (2).如不知請購品項料號，可以利用查詢代入。<br />
                                {showSuggestions && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            zIndex: 1001,
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                            width: '750px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            fontSize: '16px',
                                            left: `${position.x}px`,
                                            top: `${position.y}px`,
                                            cursor: 'default',
                                        }}
                                        onMouseDown={handleMouseDown}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px', borderBottom: '1px solid #ccc' }}>
                                            <button
                                                onClick={() => setShowSuggestions(false)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    color: '#555',
                                                    outline: 'none',
                                                    transition: 'color 0.3s ease',

                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.color = '#000')}
                                                onMouseOut={(e) => (e.currentTarget.style.color = '#555')}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        onClick={() => handleSelect(item)}
                                                        style={{ padding: '8px', cursor: 'pointer', border: '1px solid gray' }}
                                                        onMouseDown={(e) => e.preventDefault()} // 防止 blur 事件
                                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                                                    >
                                                        <td style={{ padding: '8px', width: '150px' }}>
                                                            {item.productid}
                                                        </td>
                                                        <td style={{ padding: '8px', width: '250px' }}>
                                                            {item.name}
                                                        </td>
                                                        <td style={{ padding: '8px', width: '350px' }}>
                                                            {item.spec}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td style={{ textAlign: 'center', padding: '8px', color: '#888' }}>
                                                        沒有匹配的結果
                                                    </td>
                                                </tr>
                                            )}
                                        </table>
                                    </div>
                                )}
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
                    // title={
                    //     <div className={scss.modal_head_head1}>
                    //         <div>
                    //             <span style={{ fontSize: '16px', color: '#14256a' }}>查找條件：</span>
                    //         </div>
                    //         <div>
                    //             <span style={{ fontSize: '16px', color: '#14256a' }}>筆數：共 {data.length} 筆</span>
                    //         </div>
                    //     </div>
                    // }
                    style={{ top: 200 }}
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
                                        caption="領料單號"
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
                                        caption="廠商名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword4 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword4(e.target.value) }
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
                        }}>
                            <Thead01 type={'PickingList'} />
                            {/* <Tbody01 type={'PickingList'} data={searchdata} error={error} traycalled={undefined} traycalledname={undefined} traytransfer={undefined} url={undefined} whnamecalled={undefined} /> */}
                            {searchdata && (
                                searchdata.map((_item: any, index: number) => (
                                    <CellWithBar key={index} className={scss.panelHeader6}>
                                        <div className={scss.row01}>
                                            <span>{_item.pickinglistid}</span>
                                            <span>{getTaiwanDateStr(_item.create_at)}</span>
                                            <span>{_item.create_by}</span>
                                            <span style={{ color: _item.status === "已結案" ? '#14256a' : _item.status === "領料中" ? '#28a745' : '#ea1833' }}>
                                                {_item.status}
                                            </span>
                                            <span ><IconDetail onClick={() => { handlechangepickinglist(_item) }} /></span>
                                        </div>
                                    </CellWithBar>
                                ))
                            )}
                        </div>

                    </div>
                </Modal >
            </div>
        </SubLayer >

    )

}