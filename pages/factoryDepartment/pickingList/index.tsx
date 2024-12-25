import { useState, MouseEvent, createContext, useEffect, Key, useContext, useRef, createRef } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import _ from 'lodash';
import scss from './pickingList.module.scss';
import Thead01 from '../ui/table/thead01';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
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
import icon_cancel_gray from 'public/image/icon/fc_cancel_gray.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import icon_fc_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search from 'public/image/icon/fc_search.svg';
import { Modal } from 'antd';
import icon_close from 'public/image/icon/fc_close.svg';
import icon_add2 from 'public/image/icon/fc_add2.svg';
import icon_add2_gray from 'public/image/icon/fc_add2_gray.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import icon_task_open from 'public/image/icon/fc_task_open.svg';
import icon_task_close from 'public/image/icon/fc_task_close.svg';
import icon_tray from 'public/image/icon/fc_tray.svg';
import icon_tray_out from 'public/image/icon/fc_tray_out.svg';
import icon_tray_out_gray from 'public/image/icon/fc_tray_out_gray.svg';
import { title } from 'process';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import icon_print from 'public/image/icon/fc_printer.svg';
import icon_edit_gray from 'public/image/icon/fc_edit_gray.svg';
import icon_add from 'public/image/icon/fc_add2.svg';

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
    const [data3, setData3] = useState<any[]>([]);
    const [data11, setData11] = useState<any[]>([]);
    const [data2restore, setData2Restore] = useState<any[]>([]);
    const [modaldata, setModalData] = useState<any[]>([]);
    const [searchbardata, setSearchBarData] = useState<any[]>([]);
    const [searchdata, setSearchdata] = useState<any[]>([]);
    const [employeedata, setEmployeedata] = useState<any[]>([]);



    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mouseX, setMouseX] = useState('0px');
    const [mouseY, setMouseY] = useState('0px');



    const quantityRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const specRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const unitRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const nameRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const picking_byRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));
    const picking_qtyRefs = useRef(data2.map(() => createRef<HTMLInputElement>()));


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
    const [editmain, setEditmain] = useState<boolean>(false);

    const [leftbaropen, setLeftbaropen] = useState<boolean>(false);

    //#region  儲位入庫modal
    const [whpositionqmodalopen, setWhpositionqmodalopen] = useState<boolean>(false);
    // const [whpositionqmodalopen, setwhpositionqmodalopen] = useState<boolean>(false);

    // const [checkfirstin, setCheckFirstIn] = useState<number>(purchaseorderuuidStr ? parseInt(firstin as string) : 0);
    const [checkfirstin, setCheckFirstIn] = useState<number>(parseInt(firstin as string) || 0);

    const [modalcheckfirstin, setModalcheckfirstin] = useState<number>(0);




    //modal
    const [whpnumber, setWhpnumber] = useState<string>("");
    const [whpproductid, setWhpproductid] = useState<string>("");
    const [whpname, setWhpname] = useState<string>("");
    const [whpspec, setWhpspec] = useState<string>("");
    const [whpquantity, setWhpquantity] = useState<string>("");

    const [maxinboxquantity, setMaxinboxquantity] = useState<number>(0);
    const [inboxquantity, setInboxquantity] = useState<number>(0);

    const [traycalled, setTraycalled] = useState<boolean>(false);
    const [whnamecalled, setWhnamecalled] = useState<string>("");
    const [traynamecalled, setTraynamecalled] = useState<string>("");
    const [whpnamecalled, setWhpnamecalled] = useState<string>("");


    const [selectedOption, setSelectedOption] = useState(''); // 預設選項
    const [selectWhnamedata, setSelectwhnamedata] = useState<any[]>([]);
    const [selecttraynamedata, setSelecttraynamedata] = useState<any[]>([]);

    const [nowname, setNowname] = useState<string>("");
    const [nowproductid, setNowproductid] = useState<string>("");
    const [nowspec, setNowspec] = useState<string>("");
    const [nowquantity, setNowquantity] = useState<string>("");
    const [nowwhname, setNowwhname] = useState<string>("");
    const [nowtrayname, setNowtrayname] = useState<string>("");
    const [nowwhposition, setNowwhposition] = useState<string>("");
    const [nowpickingqty, setNowpickingqty] = useState<string>("");
    const [nowwhpositionuuid, setNowwhpositionuuid] = useState<string>("");
    const [nowpickinglistdetailuuid, setNowpickinglistdetailuuid] = useState<string>("");


    const [originalnote, setOriginalnote] = useState<string>("");
    const [originaldata, setOriginalData] = useState<any[]>([]);
    const [originalcreate_atin, setOriginalcreate_atin] = useState<string>("");

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
            setIsLoading(true);
            const conditionModel = {
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
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const getPickingList = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetPickingList?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // if (data.length === 0) {
            //     myAlert.warning({
            //         title: '尚無單據'
            //     })
            //     return;
            // }

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

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    const getEmployeeList = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/GetEmployeeList?${queryParams}`);
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
        setCreate_byin(userInfo?.employee?.chName.toString() || '');
        setNeed_date(moment().format('YYYY-MM-DD') || '');
    }, []);



    const getPickingListDetailById = async (pickinglistuuid: any) => {
        try {
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

            const response = await fetch(`${setting.apipath}/WareHouse/GetPickingListDetailById?${queryParams}`);
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
            const conditionModel = {
                note: note,
                username: userInfo?.employee?.id.toString()
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const response = await fetch(`${setting.apipath}/WareHouse/AddPickingList`, {
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
            getPickingList();
            // getProduct();

            // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const UpdatePickingList = async () => {

        console.log(data2);
        // return;
        try {
            setIsLoading(true);
            const conditionModel = {
                note: note,
                username: userInfo?.employee?.id.toString()
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const response = await fetch(`${setting.apipath}/WareHouse/UpdatePickingList`, {
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
            getPickingList();
            // getProduct();

            // getProductById(checkfirstin === 0 ? purchaseorderuuidin : purchaseorderuuid);

        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleSavePickingList = async (type: any) => {
        if (type === "未儲存") {
            AddPickingList();
        } else {
            UpdatePickingList
        }
    }

    //#endregion

    //#region 按鈕作動區
    // 手key加入
    const handleAddByHandKey = async () => {
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

            setHandinputproductuuid('');
            setHandinputproductid('');
            setHandinputname('');
            setHandinputspec('');
            setHandinputquantity('');
            setHandinputunit('');
            setHandinputnote('');
            setHandinputpickingby('');

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

                const response = await fetch(`${setting.apipath}/WareHouse/AddPickingListDetail`, {
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
        handleRowClick(item.pickinglistid);
        setData2([]);
        setPickinglistid(item.pickinglistid);
        setPickinglistuuid(item.id);
        setStatus(item.status);
        setNote(item.note);
        setCreate_atin(item.create_at);
        setCreate_byin(item.create_by);
        getPickingListDetailById(item.id);
    }

    const handleClearHandKey = () => {
        setHandinputproductuuid('');
        setHandinputproductid('');
        setHandinputname('');
        setHandinputspec('');
        setHandinputunit('');
        setHandinputpickingby('');
        setHandinputquantity('');
        setHandinputnote('');
        setShowSuggestions(false);

    }

    const handlepreAddPickingList = () => {
        setPickinglistid("儲存後產生")
        setCreate_atin(moment().format('YYYY-MM-DD') || '');
        setStatus("未儲存");
        setNote("")
        setData2([]);
        setCreate_byin(userInfo?.employee?.chName as string);
    }


    const handlecancelAddPickingList = () => {
        if (editmain === true) {
            setEditmain(false);
            setCreate_atin(originalcreate_atin);
            setNote(originalnote);
            setData2(originaldata);

        } else {
            setStatus('');
            setNote('');
            setPickinglistid('');
        }
    }


    //#region modal
    const whpositionqModalClose = async () => {
        setWhpositionqmodalopen(false);
    }

    function handleinbox(item: any) {
        setWhpnumber('');
        setWhpproductid('');
        setWhpname('');
        setWhpspec('');
        setWhpquantity('');
        setInboxquantity(0);
        setData3([]);
        setData11([]);
        console.log(item);
        getWhpositionDetailByProductId(item.productid);
        setWhpositionqmodalopen(!whpositionqmodalopen);
        // setMaxinboxquantity(item.quantity);
        setNowproductid(item.productid);
        setNowname(item.name);
        setNowspec(item.spec);
        setNowquantity(item.quantity);
        setNowpickingqty(item.picking_qty);
        setNowpickinglistdetailuuid(item.id);
        console.log(item.id);

        // setNowWhp
    }


    function handleGetLayOut(item: any) {
        handleRowClick(item.id);
        console.log(item);
        setNowwhname(item.whname);
        setNowtrayname(item.trayname);
        setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
        GetLayOut(item.whid, item.trayname, item.id)
        if (recodeWhpid(item.length, item.width, item.childlength, item.childwidth) != nowwhposition) {
            setInboxquantity(0);
        }
        setNowwhpositionuuid(item.id);
        setWhpnumber(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));
        setWhpname(item.name);
        setWhpproductid(item.productid);
        setWhpspec(item.spec);
        setWhpquantity(item.quantity);
        setNowwhname(item.whname);
        setNowtrayname(item.trayname);
        setNowwhposition(recodeWhpid(item.length, item.width, item.childlength, item.childwidth));

    }


    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };


    const getWhpositionDetailByProductId = async (productid: any) => {
        try {
            setIsLoading(true);
            const conditionModel: {
                productid: string | undefined
                type: string | undefined
            } = {
                productid: productid as string | undefined,
                type: "picking"
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetWhpositionDetailByProductId?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            if (data.length === 0) {
                myAlert.warning({
                    title: "查詢結果",
                    content: "目前沒有可領取的儲位資訊"
                });
                return;
            }

            console.log(data3);
            setData3(data);

            GetLayOut(data[0].whid, data[0].trayname, data[0].id);


            console.log(data);
            if (modalcheckfirstin === 0) {
                setWhpnumber(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
                setWhpname(data[0].name);
                setWhpproductid(data[0].productid);
                setWhpspec(data[0].spec);
                setWhpquantity(data[0].quantity);
                setNowwhname(data[0].whname);
                setNowtrayname(data[0].trayname);
                setNowwhposition(recodeWhpid(data[0].length, data[0].width, data[0].childlength, data[0].childwidth));
            }
            console.log(data);



            const distinctWhnames = data
                .map((item: { whname: any; }) => item.whname)  // 提取所有 whname
                .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);  // 去重

            setSelectwhnamedata(distinctWhnames);

            const distincttraynames = data
                .map((item: { trayname: any; }) => item.trayname)  // 提取所有 trayname
                .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);  // 去重


            setSelecttraynamedata(distincttraynames);



        } catch (error: any) {
            myAlert.err({
                title: "prodEntry(getWhpositionDetailByProductId)",
                content: error.message
            })
        }
        finally {
            setIsLoading(false);
        }
    };

    const GetLayOut = async (whid: any, trayname: any, id: any) => {
        try {

            setIsLoading(true);
            const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
                whid: whid as string | undefined,
                trayname: trayname as string | undefined,
                id: id as string | undefined
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'test',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(inputModel);

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOutById?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();

            console.log(responseData);

            setData11(responseData);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const recodeWhpid = (length: any, width: any, childlength: any, childwidth: any) => {
        const convertToAlpha = (num: number): string => {
            return String.fromCharCode(65 + num - 1);
        };

        const convertToNumber = (num: number, pad: number): string => {
            return num.toString().padStart(pad, '0');
        };

        const alphaIncrement = (alpha: string): string => {
            if (alpha === 'Z') {
                return 'A';
            } else {
                return String.fromCharCode(alpha.charCodeAt(0) + 1);
            }
        };

        const numberIncrement = (num: number, max: number, pad: number): string => {
            if (num >= max) {
                return convertToNumber(1, pad);
            } else {
                return convertToNumber(num + 1, pad);
            }
        };

        let newlength = '';
        let newwidth = '';
        let newchildlength = '';
        let newchildwidth = '';

        // 處理 length 的增量
        if (length === '1') {
            newlength = 'A';
        } else {
            newlength = convertToAlpha(parseInt(length, 10));
        }

        // 處理 width 的增量
        if (width === '1') {
            newwidth = '001';
        } else {
            newwidth = convertToNumber(parseInt(width, 10), 3);
        }

        // 處理 childlength 的增量
        if (childlength === '1') {
            newchildlength = 'A';
        } else {
            newchildlength = convertToAlpha(parseInt(childlength, 10));
        }

        // 處理 childwidth 的增量
        if (childwidth === '1') {
            newchildwidth = '1';
        } else {
            newchildwidth = numberIncrement(parseInt(childwidth), 100, 1);
        }

        // 增量操作
        if (childlength !== '1' && newchildwidth === '001') {
            newchildlength = alphaIncrement(newchildlength);
        }

        if (width !== '1' && newchildlength === 'A' && newchildwidth === '1') {
            newwidth = numberIncrement(parseInt(width), 100, 3);
        }

        if (length !== '1' && newwidth === '001' && newchildlength === 'A' && newchildwidth === '1') {
            newlength = alphaIncrement(newlength);
        }

        return newlength + newwidth + newchildlength + (parseInt(newchildwidth) - 2).toString();
    };


    const CallTray = async () => {
        try {
            if (traycalled === true) {
                myAlert.warning({ title: '請先收回托盤' });
            } else {
                myAlert.confirm({
                    title: `呼叫: ${nowwhname}-${nowtrayname}`,
                    content: '!!請勿靠近設備!!',
                    props: {
                        onOk: () => {
                            CallTrayAPI();
                            // alert("呼叫托盤");
                        }
                    }
                });

            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const CallTrayBack = async () => {
        if (traycalled != true) {
            myAlert.warning({ title: '目前無托盤可收回' });
        } else {
            myAlert.confirm({
                title: `收回: ${nowwhname}-${nowtrayname}`,
                content: '!!請勿靠近設備!!',
                props: {
                    onOk: () => {
                        CallTrayBackAPI();
                    }
                }
            });
        }
    }


    const CallTrayAPI = async () => {
        try {
            setIsLoading(true);

            // 根據 whname 設置 deviceName
            // 寫死
            const deviceName =
                (nowwhname === "101") ? "Device1" :
                    (nowwhname === "102") ? "Device1" :
                        (nowwhname === "103") ? "Device1" :
                            (nowwhname === "104") ? "Device1" : "";
            const traynumber = nowtrayname;
            const traycommand = "100";

            const url = (setting.env === "prod") ? (
                (nowwhname === "101") ? `https://${setting.warehouse1}/` :
                    (nowwhname === "102") ? `https://${setting.warehouse2}/` :
                        (nowwhname === "103") ? `https://${setting.warehouse3}/` :
                            (nowwhname === "104") ? `https://${setting.warehouse4}/` : ""
            ) : "https://localhost:44383/WareHouse/";


            // execcommand 的固定參數
            const regaddress = '253';
            const cmdvalue = '1';


            // alert(whname + " : " + trayname);

            // 設定呼叫的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setTraycalled(true);
            setWhnamecalled(nowwhname);
            setTraynamecalled(nowtrayname);
            setWhpnamecalled(nowwhposition);

            // alert(url);
            // return;

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }
            console.log(response);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 execcommand API 的回應
            if (!response2.ok) {
                throw new Error('Failed to call execcommand API');
            }
            console.log(response2);

            // 如果成功，設置 traycalled 和 traycalledname 狀態
            setTraycalled(true);
            setWhnamecalled(nowwhname);
            setTraynamecalled(nowtrayname);
            setWhpnamecalled(nowwhposition);

        } catch (error: any) {
            myAlert.warning(error.message);
            console.error;
        } finally {
            setIsLoading(false);
        }
    };

    const CallTrayBackAPI = async () => {
        try {
            setIsLoading(true);

            // 根據 whname 設置 deviceName
            const deviceName =
                (whnamecalled === "101") ? "Device1" :
                    (whnamecalled === "102") ? "Device1" :
                        (whnamecalled === "103") ? "Device1" :
                            (whnamecalled === "104") ? "Device1" : "";
            const traynumber = traynamecalled;
            const traycommand = "200";
            const url = (setting.env === "prod") ? (
                (whnamecalled === "101") ? `https://${setting.warehouse1}/` :
                    (whnamecalled === "102") ? `https://${setting.warehouse2}/` :
                        (whnamecalled === "103") ? `https://${setting.warehouse3}/` :
                            (whnamecalled === "104") ? `https://${setting.warehouse4}/` : ""
            ) : "https://localhost:44383/WareHouse/";

            // execcommand 的參數
            const regaddress = '253';
            const cmdvalue = '1';

            // 收回清空設定的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
            setWhnamecalled('');
            setTraycalled(false);
            setTraynamecalled('');
            setWhpnamecalled('');
            // alert(url);

            // 呼叫 traycommand API
            const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 traycommand API 的回應
            if (!response.ok) {
                throw new Error('Failed to call traycommand API');
            }

            // 等待一秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 呼叫 execcommand API
            const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // 檢查 execcommand API 的回應
            if (!response2.ok) {
                throw new Error('Failed to call execcommand API');
            }

            // 如果成功，設置 traycalled 和 traycalledname 狀態
            setTraycalled(false);
            setWhnamecalled('');
            setTraynamecalled('');
            setWhpnamecalled('')

        } catch (error: any) {
            // 處理錯誤，顯示警告
            myAlert.warning(error.message);
            console.error(error); // 這裡需要傳遞錯誤對象
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // 檢查輸入是否為數字
        if (!isNaN(Number(value)) && value !== "") {
            let numericValue = Number(value);

            // 獲取最大允許值
            const maxValue = parseInt(nowquantity) - parseInt(nowpickingqty);

            // 比較輸入值和最大值
            if (numericValue > maxValue) {
                numericValue = maxValue;
            } else if (numericValue < 0) {
                numericValue = 0; // 確保最小值為0
            }

            // 更新狀態
            setInboxquantity(numericValue);
        } else {
            // 處理非數字輸入
            setInboxquantity(0); // 或者保留先前的狀態，具體看你的需求
        }
    };

    function handleminusquantity() {
        if (inboxquantity > parseInt(whpquantity)) {
            myAlert.warning({ title: "領取數量大於庫存數" });
            return;
        }
        myAlert.confirm({
            title: `確定要從此儲格領取嗎?: ${nowwhname}-${nowtrayname}-${whpnamecalled}`,
            props: {
                onOk: () => {
                    // addWHPositionQuantity();
                    minusWHPositionQuantity();
                }
            }
        });
    }


    useEffect(() => {
        // 明確指定參數類型為 Window 的 MouseEvent
        const handleMouseMove = (event: globalThis.MouseEvent) => {
            setMouseX(`${event.pageX}px`);
            setMouseY(`${event.pageY}px`);
        };

        // 當組件加載時添加事件監聽器
        window.addEventListener('mousemove', handleMouseMove);

        // 返回一個清理函數，在組件卸載時移除事件監聽器
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // 空依賴數組，確保只在組件加載和卸載時運行




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
    }, []); // 空依賴陣列確保只在掛載和卸載時運行


    const minusWHPositionQuantity = async () => {

        try {
            setIsLoading(true);
            const conditionModel = {
                whpositionuuid: nowwhpositionuuid,
                quantity: inboxquantity.toString() as string | undefined,
                pickinglistdetailuuid: nowpickinglistdetailuuid
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/WareHouse/MinusPickingListDetail?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            getWhpositionDetailByProductId(nowproductid);
            setNowpickingqty((parseInt(nowpickingqty) + 1).toString());
            getPickingListDetailById(pickinglistuuid);
            setWhpquantity((parseInt(whpquantity) - inboxquantity).toString());
            setInboxquantity(0);

        } catch (error: any) {
            setError("getProdReceiptDetail:" + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    //送出審核
    const sentPickinglsitToReview = async (type: any) => {
        try {
            setIsLoading(true);
            const conditionModel = {
                type: type,
                pickinglistuuid: pickinglistuuid,
                username: userInfo?.employee?.id.toString()
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/WareHouse/sentPickingListToReview?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // setData(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            getPickingList();
            getPickingListDetailById(pickinglistuuid);
            await new Promise(resolve => setTimeout(resolve, 500));



            let status = '';
            switch (type) {
                case '製單':
                    status = '領料中';
                    break;
                case '結案':
                    status = '已結案';
                    break;
                default:
                    status = '未知狀態'; // 或者你可以選擇其他合適的默認值
                    break;
            }

            setStatus(status);
        } catch (error: any) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    //#endregion


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

    const Print = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {

            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'WareHouseService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`http://127.0.0.1:5050/api/print/GetIP?${queryParams}`);
            if (!response.ok) {
                myAlert.warning({ title: '請檢查列印程式是否開啟' })
            }
            const data = await response.text();
            console.log(data);
            sentToPrint(data);

        } catch (error: any) {
            setError(error.message);
            myAlert.warning({ title: '請檢查列印程式是否開啟', content: error.message });
        }
        finally {
            setIsLoading(false);
        }
    };


    const sentToPrint = async (ip: any) => {
        myAlert.confirm({
            title: '確定要列印此單據嗎?',
            content: <>
                <h1>請確認單據是否詢價完成</h1>
            </>,
            props: {
                onOk: async () => {
                    if (data2.length === 0) {
                        myAlert.warning({ title: '目前沒有可以列印的明細' })
                    } else {


                        try {
                            const conditionModel = {
                                id: pickinglistid,
                                type: "pickinglist",
                                clientip: ip,
                                data: []
                            };

                            var inputModel = {
                                TypeName: 'ERP',
                                ServiceName: 'WareHouseService',
                                FunctionName: 'no',
                                FilterConditions: JSON.stringify(conditionModel),
                            };

                            console.log(JSON.stringify(inputModel));

                            const response = await fetch(`${setting.apipath}/WareHouse/Print`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(inputModel)
                            });

                            if (!response.ok) {
                                throw new Error('Failed to fetch data');
                            }
                            const data = await response.text();
                            console.log(data);

                            await new Promise(resolve => setTimeout(resolve, 500));






                            const response2 = await fetch("http://127.0.0.1:5050/api/print/print3", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: data
                            });

                            if (!response2.ok) {
                                throw new Error(`Failed to fetch print4 data: ${response2.statusText}`);
                            }

                            const data2 = await response2.text();
                            console.log("Received from print4:", data2);



                        } catch (error: any) {
                            // setError(error.message);
                            console.log(error.message);
                        }
                        finally {
                            // setIsLoading(false);
                        }

                    }
                }
            }
        });


    };


    const handleEdit = () => {
        // 進入編輯模式時保存原始值
        setOriginalcreate_atin(create_atin);
        setOriginalnote(note);
        setOriginalData(data2);
        setEditmain(true);
    };

    return (
        <SubLayer isLoading_subLayer={isLoading} className='overflow-hidden'>
            {/* <SubLayer isLoading_subLayer={isLoading}> */}
            <PageHeader02 tag='領料管理' panelList={panelList} />
            {/* <div className={scss.main}> */}
            <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
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

                                <button className={scss.squarebtn} onClick={() => { setSearchmodalopen(!searchmodalopen) }} title="查詢單據">
                                    <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    查詢
                                </button>
                                &nbsp;
                                <button className={scss.squarebtn} onClick={() => { Print() }} title="列印">
                                    <img src={icon_print.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    列印
                                </button>
                            </div>
                            <div>
                                <button className={status === '未儲存' ? scss.disablesquarebtn : scss.squarebtn} onClick={() => { handlepreAddPickingList() }} title="新增單據">
                                    <img src={status === '未儲存' ? icon_add2_gray.src : icon_add2.src} alt="add" style={{ height: '20px', width: '20px' }} />
                                    新增
                                </button>
                                &nbsp;
                                <button
                                    style={{ display: `${status === "領料中" && !editmain ? '' : 'none'}` }}
                                    className={scss.squarebtn}
                                    onClick={handleEdit}>
                                    <img src={icon_edit.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    編輯
                                </button>
                                <button
                                    style={{ display: `${(status === "未儲存" || status === "" || editmain || status === "已結案") ? '' : 'none'}` }}
                                    className={scss.disablesquarebtn} >
                                    <img src={icon_edit_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    編輯
                                </button>
                                &nbsp;
                                <button
                                    className={(status === '未儲存' || status === '領料中') ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handleSavePickingList(status === "未儲存" ? '未儲存' : '領料中') }}
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
                                    className={(status === '未儲存' || editmain === true) ? scss.squarebtn : scss.disablesquarebtn}
                                    onClick={() => { handlecancelAddPickingList() }}
                                    title="取消新增"
                                    disabled={status !== '未儲存' && editmain !== true}
                                >
                                    <img src={(status === '未儲存' || editmain === true) ? icon_cancel.src : icon_cancel_gray.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                    取消
                                </button>
                            </div>
                            <div></div>
                            <div>
                                <button style={{ display: `${status === "領料中" ? '' : 'none'}` }} className={scss.redsquarebtn} onClick={() => { sentPickinglsitToReview("結案") }} title="單據結案">
                                    <img src={icon_task_open.src} alt="close" style={{ height: '20px', width: '20px' }} />
                                    結案
                                </button>
                                &nbsp;
                                <button style={{ display: `${status === "領料中" || status === '' || status === '未儲存' ? 'none' : ''}` }} className={scss.disablesquarebtn} title="單據已結">
                                    <img src={icon_task_close.src} alt="closed" style={{ height: '20px', width: '20px' }} />
                                    已結
                                </button>
                            </div>
                        </div>
                        <div className={scss.head_body}>
                            <div>
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
                                            caption="領料日期"
                                            className="global_tip_must"
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
                                            captionStyle={{ fontSize: '18px', fontWeight: 'normal', marginRight: '28px' }}
                                            datePickerProps={{
                                                props: {
                                                    value: getTaiwanDateStr(create_atin || '') ? moment(create_atin) : null,
                                                    onChange: (e) => { setCreate_atin((e?.toString() || '') || '') }
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
                                            disabled={(status === "未儲存" || editmain === true) ? false : true}
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
                                        caption="總比數"
                                        disabled={true}
                                        inputProps={{
                                            props: {
                                                style: { color: 'red' },
                                                value: data2.length || 0,
                                            },
                                        }}
                                    />


                                </div>
                            </div>
                        </div>

                        <div className={scss.head_foot2}>
                            <div>
                                {/* <button className={scss.minibtn} onClick={() => { getProduct(); setProductSearchmodalopen(!productSearchmodalopen); }}>
                                    品項查詢
                                </button> */}
                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={scss.body_content1} style={{ overflowX: 'auto' }}>
                            <Thead01 type={'AddPR_PickingList'} />
                            {data2.map((_item, index) => (
                                <CellWithBar key={index} className={scss.panelHeader20}>
                                    <div className={scss.row01}>
                                        <span>
                                            {/* <button onClick={() => { handleinbox(_item) }}>
                                                <img src={icon_tray_pick.src} alt="tray" style={{ width: '30px', height: '20px' }} />
                                            </button> */}
                                            <button
                                                onClick={() => { handleinbox(_item) }}
                                            // disabled={parseFloat(_item.quantity) === parseFloat(_item.picking_qty)}
                                            >
                                                <img
                                                    src={parseFloat(_item.quantity) === parseFloat(_item.picking_qty) ? icon_tray_out_gray.src : icon_tray_out.src}
                                                    alt="tray"
                                                    style={{ width: '30px', height: '20px' }}
                                                />
                                            </button>

                                        </span>
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
                                                ref={picking_qtyRefs.current[index]}
                                                style={{ backgroundColor: 'transparent', borderBottom: (index + 1 === editrowid && editstatus === true ? "1px solid black" : ""), width: '95%' }}
                                                // style={{ backgroundColor: 'transparent', borderBottom: "1px solid black", width: '95%' }}
                                                type="text"
                                                maxLength={5}
                                                value={_item.picking_qty !== undefined ? _item.picking_qty : 0}
                                                readOnly={!(index + 1 === editrowid && editstatus === true)}
                                                onChange={(e) => {
                                                    handleNumberChange(index, "picking_qty", e.target.value);
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
                                                ref={picking_byRefs.current[index]}
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
                                            {/* &nbsp;&nbsp;&nbsp;
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleEditStatus(index + 1) }}>
                                                <img src={icon_edit.src} alt="edit" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (editstatus === false) ? '' : 'none' }} onClick={() => { handleRemove(index) }}>
                                                <img src={icon_delete.src} alt="remove" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { handleSaveEdit(index) }}>
                                                <img src={icon_save.src} alt="save" style={{ width: '30px', height: '20px' }} />
                                            </button>
                                            <button style={{ display: (index + 1 === editrowid && editstatus === true) ? '' : 'none' }} onClick={() => { setData2(data2); setEditStatus(false) }}>
                                                <img src={icon_cancel.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                            </button> */}

                                        </span>

                                    </div>
                                </CellWithBar>
                            ))}


                            <div className={scss.addbar} style={{ borderBottom: '1px solid #c1c1c1', display: `${(pickinglistid != '' && status === '領料中') ? '' : 'none'}` }}>
                                <div>
                                    <button onClick={() => { handleAddByHandKey() }}>
                                        <img src={icon_add.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                    </button>
                                </div>
                                <span></span>
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
                                <div></div>
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
                                        value={handinputpickingby}
                                        onChange={handlePickingByChange}
                                        placeholder="姓名"
                                        style={{ width: '100%' }}
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
                                    <button onClick={() => handleClearHandKey()} style={{ display: handinputproductid || handinputname || handinputspec || handinputquantity || handinputunit || handinputnote || handinputpickingby ? '' : 'none' }}>
                                        <img src={icon_clear.src} alt="clear" style={{ width: '30px', height: '20px' }} />
                                    </button>

                                </div>
                            </div>

                        </div>
                        <div>
                            {filteredData.length > 0 && (
                                <ul ref={dropdownRef}
                                    style={{
                                        border: '1px solid #c1c1c1',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '0px',
                                        left: '20px',
                                        position: 'absolute',
                                        width: '900px',
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
                            {employeefilteredData.length > 0 && (
                                <ul style={{
                                    border: '1px solid #ccc',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    marginTop: '0px',
                                    right: '240px',
                                    position: 'absolute',
                                    width: '150px',
                                    backgroundColor: 'white',
                                    zIndex: 1004, // 確保下拉清單在最上層,
                                    display: `${showempSuggestions ? '' : 'none'}`,
                                    fontSize: '16px'
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
                        {/* <div className={scss.body_foot1}>
                            <div>
                                (1).請確實填寫品名、規格與數量。<br />
                                (2).如不知領取品項料號，可以利用查詢代入。<br />
                                
                            </div>
                            <div>

                            </div>
                            <div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <Modal
                    visible={whpositionqmodalopen}
                    footer={null}
                    onCancel={whpositionqModalClose}
                    // width="2000px"
                    width="100%"

                    maskClosable={false}
                    style={{ top: 70 }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px', marginBottom: '16px', width: '1500px' }}>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="料號"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowproductid ? nowproductid : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="名稱"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowname ? nowname : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="規格"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowspec ? nowspec : ' '
                                    },
                                }}
                            />
                        </span>
                        <span style={{ fontSize: '16px', color: '#14256a' }}>
                            <InputSel
                                {...inputSelProps}
                                caption="數量"
                                className='align-bottom'
                                disabled={true}
                                inputProps={{
                                    props: {
                                        value: nowquantity ? nowquantity : ' '
                                    },
                                }}
                            />
                        </span>
                    </div>
                    <div className={scss.modal_container}>
                        <div className={scss.modal_left}>
                            <div className={scss.modal_content}>
                                <div>
                                    {/* <span style={{ fontSize: '18px', }}>倉庫：</span>
                                <select
                                    value={selectedOption}
                                    style={{ fontSize: '18px', borderBottom: '1px solid #c1c1c1' }}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    {selectWhnamedata.map((whname, index) => (
                                        <option key={index} value={whname}>
                                            {whname}
                                        </option>
                                    ))}
                                </select>
                                &nbsp;
                                <span style={{ fontSize: '18px', }}>托盤：</span>
                                <select
                                    value={selectedOption}
                                    style={{ fontSize: '18px', borderBottom: '1px solid #c1c1c1' }}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    {selecttraynamedata.map((trayname, index) => (
                                        <option key={index} value={trayname}>
                                            {trayname}
                                        </option>
                                    ))}
                                </select> */}
                                    <Thead01 type={'ProdEntryWhpositionList'} />
                                    {data3 && (
                                        data3.map((_item: any, index: number) => (
                                            <CellWithBar key={index} className={scss.panelHeader26}>
                                                <div
                                                    key={index}
                                                    className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                                    onClick={() => handleGetLayOut(_item)}
                                                >
                                                    <span>{index + 1}</span>
                                                    <span>{_item.whname}</span>
                                                    <span>{_item.trayname}</span>
                                                    <span>{`${recodeWhpid(_item.length, _item.width, _item.childlength, _item.childwidth)}`}</span>
                                                    <span style={{ color: `${_item.productid != nowproductid ? 'red' : 'black'}` }}>{_item.productid}</span>
                                                    <span style={{ color: `${_item.quantity === 0 ? 'red' : 'black'}` }}>{_item.quantity}</span>
                                                    <span>
                                                        {/* <button onClick={() => {  }}>
                                                        <img src={icon_fc_inbox.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                                                    </span>
                                                </div>
                                            </CellWithBar>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={scss.modal_right}>
                            <div className={scss.modal_right_head}>
                                <InputSel
                                    {...inputSelProps}
                                    caption="倉庫編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowwhname ? nowwhname : ' '
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="托盤編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowtrayname ? nowtrayname : ' '
                                        },
                                    }}
                                />
                                <InputSel
                                    {...inputSelProps}
                                    caption="儲格編號"
                                    className='align-bottom'
                                    disabled={true}
                                    inputProps={{
                                        props: {
                                            value: nowwhposition ? nowwhposition : ' '
                                        },
                                    }}
                                />
                            </div>
                            <div className={scss.modal_right_content}>
                                {data11.map((Data) => (
                                    <table className={scss.traytable} style={{ border: 'solid 1px black' }}>
                                        <tbody>
                                            <tr className={scss.tr}>
                                                {Data.widthdata.map((item: any) => (
                                                    <td className={scss.td} style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}>
                                                        {item.childtraylayoutmodel && item.childtraylayoutmodel.map((childitem: any) => (
                                                            <table className={scss.childtraytable} key={item.childlengthid}>
                                                                <tbody>
                                                                    <tr className={scss.childtraytabletr}>
                                                                        {childitem.childwidthdata.map((childDataItem: any) => (
                                                                            <td className={scss.childtraytabletd} key={childDataItem.id} style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}>
                                                                                <button className={scss.childtraytabletdButton}
                                                                                    style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                                    onMouseEnter={() => setHoverInfo(`${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`)}
                                                                                    onMouseLeave={() => setHoverInfo(null)}
                                                                                >
                                                                                    {`${recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth)}\n`}<br />
                                                                                </button>
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        ))}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                ))}
                                {hoverInfo && (
                                    <div
                                        style={{
                                            backgroundColor: '#dfdcdc',
                                            position: 'fixed',
                                            top: mouseY,
                                            left: mouseX,
                                            transform: 'translate(10%, 60%)',
                                            padding: '5px',
                                            borderRadius: '5px',
                                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                            zIndex: '1002',
                                            whiteSpace: 'pre-line', // 控制換行的 CSS 屬性
                                            fontSize: '16px'
                                        }}
                                    >
                                        {hoverInfo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={scss.modal_container2}>
                        <div className={scss.modal_bottom}>
                            <div className={scss.modal_content}>
                                <div className={scss.traymodal_head_head1}>
                                    <div>
                                        <span style={{ display: `${traycalled === true || data3.length === 0 ? 'none' : ''}` }}>
                                            <button className={scss.redbtn} onClick={CallTray}>呼叫托盤</button>
                                        </span>
                                        <span style={{ display: `${traycalled === true || data3.length === 0 ? '' : 'none'}` }}>
                                            <button className={scss.disabledbtn}>呼叫托盤</button>
                                        </span>
                                        &nbsp;
                                        <span style={{ display: `${traycalled === true ? '' : 'none'}` }}>
                                            <button className={scss.greenbutton} onClick={() => { CallTrayBack() }}>收回托盤</button>
                                        </span>
                                        <span style={{ display: `${traycalled === true ? 'none' : ''}` }} >
                                            <button className={scss.disabledbtn} >收回托盤</button>
                                        </span>
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="目前呼叫"
                                            className='align-bottom'
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: `${whnamecalled != "" ? `倉庫：${whnamecalled} 托盤：${traynamecalled} 儲位：${whpnamecalled}` : ' '}`
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="領料進度"
                                            className='align-bottom'
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: `${nowpickingqty} / ${nowquantity}`
                                                },
                                            }}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ display: `${(inboxquantity != 0 && nowpickingqty < nowquantity && traycalled === true) ? '' : 'none'}` }}>
                                            <button className={scss.redbtn} onClick={() => { handleminusquantity() }}>確認領料</button>
                                        </span>
                                        <span style={{ display: `${(inboxquantity === 0 || nowpickingqty === nowquantity || traycalled === false) ? '' : 'none'}` }}>
                                            <button className={scss.disabledbtn}>確認領料</button>
                                        </span>
                                    </div>
                                </div>
                                <div className={scss.traymodal_head_content1}>
                                    <div>
                                        <InputSel
                                            {...inputSelProps}
                                            caption="儲格編號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: whpnumber ? whpnumber : ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="物料編號"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: whpproductid ? whpproductid : ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="物料名稱"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: whpname ? whpname : ' ',
                                                },
                                            }}
                                        />
                                        <InputSel
                                            {...inputSelProps}
                                            caption="物料規格"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: whpspec ? whpspec : ' ',
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
                                            caption="儲位數量"
                                            disabled={true}
                                            inputProps={{
                                                props: {
                                                    value: whpquantity.toString() ? whpquantity.toString() : ' ',
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
                                            caption="領用數量"
                                            disabled={(traycalled === true && nowpickingqty < nowquantity) ? false : true}
                                            inputProps={{
                                                props: {
                                                    type: "number",
                                                    // min: 0, // 設置最小值為0
                                                    // step: 1, // 設置步進值，默認為1
                                                    max: parseInt(nowquantity) - parseInt(nowpickingqty), // 設置最大值
                                                    style: { color: 'red' },
                                                    value: inboxquantity ? inboxquantity : '',
                                                    // onChange: handleInputChange
                                                    onChange: (e) => setInboxquantity(parseInt(e.target.value))
                                                },
                                            }}
                                        />
                                        <span style={{ color: '#ea1833' }}>
                                            ※請利用鍵盤上下鍵調整數量&nbsp;※不可超過領料單該品項的數量
                                        </span>
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
                                        流程順序：選取儲位{'>'}呼叫托盤{'>'}輸入要領用的數量{'>'}確認領取{'>'}收回托盤<br />
                                    </div>
                                </div>
                                <div className={scss.modal_head_content2}>
                                    <div></div>
                                    <div style={{ textAlign: 'right' }}>

                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

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
                                        disabled={false} // 根據需求設置是否禁用
                                        style={{
                                            // padding: '8px', // 調整樣式
                                            fontSize: '18px',
                                            borderBottom: '1px solid #14256a',
                                            color: '#14256a'
                                        }}
                                    >
                                        <option value="">全部</option> {/* 預設選項 */}
                                        <option value="領料中">領料中</option>
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
                                    {/* <InputSel
                                        {...inputSelProps}
                                        caption="廠商名稱"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: keyword4 || ' ',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setKeyword4(e.target.value) }
                                            },
                                        }}
                                    /> */}
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
                                        <div
                                            key={index}
                                            className={`${scss.row01} ${_item.pickinglistid === selectedItemId ? scss.selectedRow : ''}`}
                                            onClick={() => handlechangepickinglist(_item)}
                                        >
                                            <span>{_item.pickinglistid}</span>
                                            <span>{getTaiwanDateStr(_item.create_at)}</span>
                                            <span>{_item.create_by}</span>
                                            <span style={{ color: _item.status === "已結案" ? '#14256a' : _item.status === "領料中" ? '#28a745' : '#ea1833' }}>
                                                {_item.status}
                                            </span>
                                            <span >
                                                {/* <IconDetail onClick={() => { handlechangepickinglist(_item) }} /> */}
                                            </span>
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