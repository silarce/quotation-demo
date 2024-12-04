import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './yearEndBonusMaintenance.module.scss';
import { createRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import { setting } from '../../factoryDepartment/wareHouseList/index';
import { useRouter } from "next/router";
import { content } from "html2canvas/dist/types/css/property-descriptors/content";
import CellWithBar from "components/global/gear/cell/cellWithBar";
import { getTaiwanDateStr } from "js/utils/helpers/date/convertDate";
//grid
// import Thead01 from "../../factoryDepartment/ui/table/thead01";
//icon
import icon_search from 'public/image/icon/fc_search.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import InputSel from "components/global/gear/inputAndSel_v2/inputSel";
import { inputSelProps } from "components/page/worksDepartment/ui/wrapper_inpuSel_01";
import icon_fc_add from 'public/image/icon/fc_add.svg';
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import { AppContext } from "pages/_app";
import icon_cancel3 from 'public/image/icon/fc_cancel3.svg';
import icon_edit from 'public/image/icon/fc_edit.svg';
import icon_delete from 'public/image/icon/fc_delete.svg';
import icon_add from 'public/image/icon/fc_add2.svg';
import icon_eye from 'public/image/icon/eyeOpen.svg';
import icon_eye_gray from 'public/image/icon/eyeProhibit.svg';
import icon_cir_add from 'public/image/icon/addCircle.svg';
import icon_cir_remove from 'public/image/icon/removeCircle.svg';
import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';
import icon_search2 from 'public/image/icon/search.svg';

//時間
import moment from "moment";
import { Modal, Radio, Space } from "antd";
import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";
import DragableModal from "components/global/gear/dragableModal/dragableModal";



export default function YearEndBonusMaintenance() {
    const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
        year = thisYear.toString(),
        month = thisMonth.toString(),
        viewtype
    } = router.query;
    //#endregion

    //#region =============【變數宣告】===============================================================================
    // Loading
    const [isLoading, setIsLoading] = useState(false);

    //登入者資料
    const { userInfo } = useContext(AppContext);

    // 資料列
    const [data, setData] = useState<any[]>([]);
    const [bonuspeople, setbonuspeopledata] = useState<any[]>([]);
    const [originalleavedata, setOriginalLeavedata] = useState<any[]>([]);
    const [originaldata, setOriginalData] = useState<any[]>([]);
    const [employeedata, setEmployeedata] = useState<any[]>([]);

    //普通變數
    const [currentemp, setCurrentEmp] = useState<string>("");
    const [serial_id, setSerial_id] = useState<string>("");
    const [serial_uuid, setSerial_uuid] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [currenindex, setCurrentIndex] = useState<number>(0);

    //手key輸入
    const overtime_hoursRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const attendance_daysRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const public_holidaysRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const overtime_payRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const advance_paymentRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const income_taxRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const labor_insurance_feeRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const health_insurance_feeRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const late_deductionRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const leave_day_payRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const supplementRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const allowanceRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const perfect_attendance_bonusRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const income_tax_peopleRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const health_insurance_peopleRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const annual_leave_daysRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const comp_timeRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const late_minuteRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const late_timeRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const salaryRefs = useRef(data.map(() => createRef<HTMLInputElement>()));

    const categoryRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const item_nameRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const seniorityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const bonusRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const monthRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    const noteRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    // popout
    const [peoplebar, setpeoplebar] = useState<boolean>(false);
    const [editbtn, seteditbtn] = useState<boolean>(false);
    const [addbar, setaddbar] = useState<boolean>(false);
    const [editall, seteditall] = useState<boolean>(false);

    //#endregion



    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
            GetYearEndBonusPreset();
            GetReviewFlow();
            // GetEmployee();
            hasFetchedData.current = true;
        }
    }, []);

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


    // useEffect(() => {
    //     setData([]);
    //     // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
    // }, [year, month]);


    //#endregion

    //#region =============【上功能列】===============================================================================
    //搜尋功能
    const searchTargetList = [
        {
            placeholder: '料號',
        },
        {
            placeholder: '名稱',
        },
        {
            placeholder: '規格',
        },
    ];
    //搜尋功能
    const doSearch = (valueArr: (string | Toption | null)[]) => {

    };

    // 搜尋功能
    const searchGroup = {
    };

    //新增按鈕
    const panelList: TpanelList = [
    ];
    const selectPropsArr = useYearMonth_selectBar_query({
        year: year as string,
        month: month as string,
        yearOptionArr,
        monthOptionArr,
    });

    //#endregion


    //#region =============【  API  】===============================================================================

    const GetYearEndBonusPreset = async () => {
        try {
            setIsLoading(true);

            const conditionModel = {
                // 在這裡可以填入查詢條件
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/Salary/GetYearEndBonusPreset?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let responsedata = await response.json();


            console.log(responsedata); // 檢查排序後的資料

            let normalizedData = normalizeData(responsedata, "Get");

            setData(normalizedData);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const UpdateYearEndBonusPresetById = async (item: any) => {
        try {
            setIsLoading(true);

            // 將 item.employee 處理為僅包含 id 的陣列
            // const employeeIds = JSON.parse(item.employee).map((emp: any) => emp.id);
            console.log(item.employee);
            console.log(item.employee.id_number);



            const conditionModel = {
                id: item.id,
                bonus: item.bonus,
                note: item.note,
                employee_id: item.employee?.id
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/Salary/UpdateYearEndBonusPresetById`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responsedata = await response.json();
            myAlert.success({ title: '更新成功' })
            GetYearEndBonusPreset();
            setEditlist(false);
            setAllChecked(false);


        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }




    }
    //借用審核的取員工資料
    const GetEmployee = async (type: any, seniority_seniority_senior: any) => {
        try {
            setIsLoading(true);
            // console.log(type);
            // console.log(seniority_seniority_senior);
            // return;

            const conditionModel = {
                // 在這裡可以填入查詢條件
                seniority: type === 'SeniorityBased' ? seniority_seniority_senior : 0,
                seniority_senior: type === 'SeniorityBased' ? seniority_seniority_senior + 1 : 1000
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/Salary/GetEmployeeWithSeniority?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let responsedata = await response.json();

            // 根據 `employee[0].id_number` 進行排序
            responsedata = responsedata.sort((a: any, b: any) => {
                const aId = a.id_number ? a.id_number || '' : '';
                return aId.localeCompare(aId);
            });

            console.log(responsedata); // 檢查排序後的資料
            setEmployeedata(responsedata);
            setFilteredData(responsedata);


        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    // const SettlePayroll = async () => {
    //     myAlert.confirm({
    //         title: '確定要結算薪資嗎?',
    //         props: {
    //             onOk: async () => {


    //                 try {
    //                     const conditionModel = {
    //                         date: moment().format('YYYY-MM-DD HH:mm:ss'),
    //                         data: data
    //                     };


    //                     var inputModel = {
    //                         TypeName: 'ERP',
    //                         ServiceName: 'SalaryService',
    //                         FunctionName: 'no',
    //                         FilterConditions: JSON.stringify(conditionModel),
    //                     };

    //                     const response = await fetch(`${setting.apipath}/Salary/SettlePayroll`, {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify(inputModel)
    //                     });


    //                     if (!response.ok) {
    //                         throw new Error('Failed to fetch data');
    //                     }

    //                     const responsedata = await response.json();


    //                 } catch (error: any) {
    //                     console.log(error.message);
    //                 }
    //                 finally {
    //                 }
    //             }
    //         }
    //     });
    // };



    const AddSalaryBonus = async () => {

        try {
            setIsLoading(true);
            const conditionModel = {
                category: '',
                item_name: '',
                seniority: 0,
                bonus: 0,
                month: '',
                note: '',
                employee_id: '[]'
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };


            const response = await fetch(`${setting.apipath}/Salary/AddSalaryBonus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            GetYearEndBonusPreset();
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }


    const test = async () => {

        try {
            setIsLoading(true);
            const conditionModel = {
                employee_id: '290d3b53-5a2b-4a2d-bd72-88aea7074aac',
                // start_date: '2024-08-16T08:42:22.255Z'
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(inputModel));

            const response = await fetch(`${setting.apipath}/Salary/AddNewEmpSalary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }

    }



    //#region 審核
    const [review_flow, setReview_flow] = useState<string>("");
    const [reviewbar, setReviewbar] = useState<boolean>(false);
    const [reviewdata, setReviewdata] = useState<any[]>([]);
    const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
    const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
    const [documenttitle, setDocumenttitle] = useState<string>("");
    const [reviewhistroydata, setReviewhistorydata] = useState<any[]>([]);

    //取全部的自訂流程
    const GetReviewFlow = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                user_id: userInfo?.employee?.id.toString()
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewFlow?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const text = await response.text();
            if (!text) {
                // console.log('No data returned');
                setReviewdata([]);
                return;
            }

            const data = JSON.parse(text);
            setReviewdata(data);


        } catch (error: any) {
            console.log(error);
            // setError(error.message);
        }
        finally {
            setIsLoading(false);
        }

    }

    //取單據的審核流程
    const GetReviewById = async (document_uuid: any) => {
        try {
            setReviewflowdata([]);
            setReviewflowdata2([]);
            // setIsLoading(true);

            const conditionModel = {
                document_uuid: document_uuid
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewById?${queryParams}`);

            // 檢查響應狀態
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // 檢查響應內容是否為空
            const text = await response.text();
            if (text.trim() === '') {
                // console.log('No data returned');
                return;
            }

            // 解析 JSON
            const data = JSON.parse(text);

            console.log(data);

            // 檢查資料是否存在且有效
            if (data && data.length > 0) {
                setReviewflowdata(data);
            } else {
                console.log('No valid data');
            }

        } catch (error: any) {
            console.error(error.message);
        } finally {
            // setIsLoading(false);
        }
    };

    const [value, setValue] = useState<number | null>(null);
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const setReview = async (item: any) => {
        setReview_flow(item.id);
        setReviewflowdata2(item.stages);
    }

    const sentToReview = async (type: any) => {

        try {
            if (review_flow === "") {
                setReviewbar(true);
            }
            else {
                // return;
                const review_query = {
                    year: year,
                    month: month,
                };

                const conditionModel = {
                    document_id: serial_id,
                    document_uuid: serial_uuid,
                    document_type: "薪資帳簿",
                    review_id: review_flow,
                    query: review_query,
                    user_id: userInfo?.employee?.id.toString(),
                    document_title: documenttitle
                };

                var inputModel = {
                    TypeName: 'ERP',
                    ServiceName: 'ReviewService',
                    FunctionName: 'no',
                    FilterConditions: JSON.stringify(conditionModel),
                };

                console.log(JSON.stringify(conditionModel));

                const response = await fetch(`${setting.apipath}/Review/AddReview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputModel)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const responsedata = await response.json();
                setReviewflowdata([]);
                GetReviewById(serial_uuid);
                setStatus("審核中");
                // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
                setReviewbar(false);
                await new Promise(resolve => setTimeout(resolve, 500));

                // //改變單據狀態
                // const conditionModel2 = {
                //     type: type,
                //     purchaserequisitionuuid: serial_uuid,
                //     username: userInfo?.employee?.id.toString()
                // };


                // var inputModel = {
                //     TypeName: 'ERP',
                //     ServiceName: 'WareHouseService',
                //     FunctionName: 'no',
                //     FilterConditions: JSON.stringify(conditionModel2),
                // };

                // const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

                // const response2 = await fetch(`${setting.apipath}/WareHouse/sentPRToReview?${queryParams}`);
                // if (!response2.ok) {
                //     throw new Error('Failed to fetch data');
                // }
                // const data2 = await response2.json();
                // // getPurchaseRequisition();
                // // getPurchaseRequisitionDetail(purchaserequisitionuuidin);

                // // setStatusin("審核中");





            }

        } catch (error: any) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }

    }

    const handleChoseflow = () => {
        setReviewbar(true);
        setDocumenttitle(`【薪資單】【${year}年${month}月份_薪資單】_${userInfo?.employee?.chName.toString()}`)
    }

    const handleGetReviewBack = () => {
        myAlert.confirm({
            title: '確定要抽單嗎?',
            props: {
                onOk: async () => {
                    try {
                        setIsLoading(true);
                        const conditionModel = {
                            document_uuid: serial_uuid,
                        };

                        var inputModel = {
                            TypeName: 'ERP',
                            ServiceName: 'WareHouseService',
                            FunctionName: 'no',
                            FilterConditions: JSON.stringify(conditionModel),
                        };


                        const response = await fetch(`${setting.apipath}/Review/GetReviewBack`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(inputModel)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch data');
                        }

                        setReviewflowdata([]);
                        setStatus("編輯中");
                        setReview_flow("");
                        setValue(null);
                        GetReviewHistory(serial_uuid);
                        // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");

                    } catch (error: any) {
                        console.log(error.message);
                    }
                    finally {
                        setIsLoading(false);
                    }
                }
            }
        });
    }

    const GetReviewHistory = async (id: any) => {
        try {
            // setIsLoading(true);
            // alert(purchaserequisitionidin);
            const conditionModel = {
                document_uuid: id
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'ReviewService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

            const response = await fetch(`${setting.apipath}/Review/GetReviewHistory?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const text = await response.text();
            if (!text) {
                // console.log('No data returned');
                setReviewhistorydata([]);
                return;
            }

            const data = JSON.parse(text);
            setReviewhistorydata(data);
            console.log(reviewhistroydata);


        } catch (error: any) {
            console.log(error);
        }
        finally {
            // setIsLoading(false);
        }
    }
    //#endregion











    //#endregion

    //#region =============【方法入口】===============================================================================




    //#endregion

    //#region =============【方法邏輯】===============================================================================

    // 組件清單編輯
    const [editlist, setEditlist] = useState<boolean>(false);
    const [editlistindex, setEditlistindex] = useState<number>(0);
    const [originaleditlistdata, setOriginaleditlistdata] = useState<any[]>([]);
    const quantityRefs = useRef(data.map(() => createRef<HTMLInputElement>()));
    // 組件編輯
    const handleEdit = async (index: any, item: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '獎金維護中，請先結束編輯狀態' })
            return;
        }
        handleRowClick(item.id);
        setOriginaleditlistdata(data);
        setEditlist(!editlist);
        setEditlistindex(index);
    };
    // 組件取消編輯
    const handleCancel = async (index: any) => {
        setEditlist(!editlist);
        setData(originaleditlistdata);
        setSelectedItemId('');
    };

    // 從組件清單移除
    // const handleRemove = (index: number, item: any) => {
    //     myAlert.confirm({
    //         title: '確定要將人員移除嗎?',
    //         props: {
    //             onOk: () => {
    //                 const updatedData = data.filter((_, i) => i !== index);
    //                 setbonuspeopledata(updatedData);
    //                 // RemoveBomDetail(item.id);
    //             }
    //         }
    //     });
    // };

    // 更新組件清單
    const handleUpdate = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定更新嗎?',
            props: {
                onOk: () => {
                    UpdateYearEndBonusPresetById(item);
                }
            }
        });
    };




    const handleRemove = (targetItem: any) => {
        // 使用 id 來篩選出需要保留的項目
        const updatedData = bonuspeople.filter((item) => item.id !== targetItem.id);
        console.log("Updated Data:", updatedData); // 確認篩選後的資料
        setSelectedItems(selectedItems.filter((selected) => selected.id_number !== targetItem.id_number));
        setbonuspeopledata(updatedData);
    };





    //#region 收
    // const handleRemove = (index: number) => {
    //     // 移除指定索引的項目
    //     const updatedLeavedata = [...leavedata];
    //     const removedItem = updatedLeavedata.splice(index, 1)[0]; // 移除項目並保留移除的資料

    //     // 更新 leavedata
    //     setLeavedata(updatedLeavedata);

    //     // 將 updatedLeavedata 轉換成所需格式的物件
    //     const leaveDetailObj = updatedLeavedata.reduce((acc, item) => {
    //         if (item.leaveType && item.leaveDays) {
    //             acc[item.leaveType] = item.leaveDays;
    //         }
    //         return acc;
    //     }, {} as Record<string, string>);

    //     // 更新 data 中對應的 employee_id 的 leave_detail
    //     const updatedData = data.map((emp) => {
    //         if (emp.employee_id === currentemp) {
    //             return {
    //                 ...emp,
    //                 leave_detail: leaveDetailObj // 更新 leave_detail 為轉換後的物件
    //             };
    //         }
    //         return emp;
    //     });

    //     // 更新全域變數 data
    //     setData(updatedData);
    //     console.log(updatedData);
    // };
    //#endregion

    const updateLeaveDetail = (id: any) => {
        // 將 bonuspeople 轉換為字串格式，與 data 的結構一致
        const updatedEmployee = JSON.stringify(bonuspeople);

        // 在 data 中找到對應 id 並更新 employee
        const updatedData = data.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    employee: updatedEmployee, // 更新 employee
                    update_at: new Date().toISOString() // 更新時間戳
                };
            }
            return item;
        });

        // 設定更新後的資料
        setData(updatedData);
        console.log('Updated data:', updatedData);
        // UpdateSalaryBonusById();
    };


    const handleeditallcancel = () => {
        myAlert.confirm({
            title: '確定要取消嗎?',
            content: '未儲存的資料將不會保留',
            props: {
                onOk: async () => {
                    seteditall(false);
                    setData(originaldata);
                }
            }
        })
    };

    //#endregion





    const [selectedItems, setSelectedItems] = useState<any[]>([]); // 存儲已選中的項目

    const uniqueDepartments = useMemo(() => {
        // 取得 department 欄位的唯一值
        const departments = employeedata.map(item => item.department);
        return [...new Set(departments)];
    }, [employeedata]);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [searchText, setSearchText] = useState("");

    // const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const isSelectingRef = useRef(false);
    // 監聽條件變更
    useEffect(() => {
        if (isSelectingRef.current) return;

        // 過濾掉已選擇的項目
        let filteredData = employeedata.filter(
            (item) => !selectedItems.some((selected) => selected.id_number === item.id_number)
        );

        // 根據搜尋條件過濾
        if (searchText) {
            filteredData = filteredData.filter((item) =>
                item.ch_name.toString().includes(searchText.trim())
            );
        }

        // 根據選擇的部門過濾
        if (selectedDepartment) {
            filteredData = filteredData.filter(
                (item) => item.department_name === selectedDepartment
            );
        }

        setFilteredData(filteredData);
        console.log(filteredData.length);
    }, [searchText, selectedDepartment, selectedItems]);


    const handleAdd = () => {
        // setData([
        //     ...data,
        //     {
        //         id: '', // 預設為空字串
        //         category: '', // 預設為空字串
        //         item_name: '', // 預設為空字串
        //         seniority: 0, // 預設為 0
        //         bonus: 0, // 預設為 0
        //         month: '1,2,3,4,5,6,7,8,9,10,11,12', // 預設為空字串
        //         note: '', // 預設為空字串
        //         create_at: '', // 預設為空字串
        //         update_at: '', // 預設為空字串
        //         create_by: null, // 預設為 null
        //         update_by: null, // 預設為 null
        //         employee: '[]', // 預設為空陣列
        //         actual_salary: 0, // 預設為 0
        //         earning_total: 0, // 預設為 0
        //         deduction_total: 0, // 預設為 0
        //         subtotal: 0, // 預設為 0
        //         net_pay: 0, // 預設為 0
        //     },
        // ]);

        AddSalaryBonus();



        console.log("新增後的資料:", data);
    };



    // 用來儲存選中的資料
    // const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [allChecked, setAllChecked] = useState(false);

    // 全選功能
    const handleSelectAll = () => {
        setAllChecked(!allChecked);

        if (!allChecked) {
            // 過濾掉重複的資料，將所有資料加到 bonuspeopledata
            const newItems = filteredData.filter(
                (item) => !bonuspeople.some((person) => person.id === item.id)
            );
            setbonuspeopledata([...bonuspeople, ...newItems]);
        } else {
            // 取消全選，清除 filteredData 的資料
            const filteredIds = new Set(filteredData.map((item) => item.id));
            const remainingItems = bonuspeople.filter((item) => !filteredIds.has(item.id));
            setbonuspeopledata(remainingItems);
        }
    };

    // 單選功能
    const handleCheckboxChange = (item: any, isChecked: boolean) => {
        console.log(item);
        // return;
        if (isChecked) {
            // 加入選中的資料，排除重複
            if (!bonuspeople.some((person) => person.id === item.id)) {
                setbonuspeopledata([
                    ...bonuspeople,
                    {
                        id: item.id,
                        id_number: item.id_number,
                        department_name: item.department_name,
                        start_date: '',
                        ch_name: item.ch_name,
                        seniority: item.seniority
                    },
                ]);
            }
        } else {
            // 移除取消選中的資料
            setbonuspeopledata(bonuspeople.filter((person) => person.id !== item.id));
        }
    };

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 點擊處理函數
    const handleRowClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const normalizeData = (data: any[], type: any) => {
        return data.map((item) => {
            // 檢查 employee 欄位是否為字串，如果是字串則解析
            const employeeData = typeof item.employee === "string"
                ? JSON.parse(item.employee)[0] // 假設只有一個員工資料
                : item.employee;

            return {
                bonus: item.bonus,
                bonus_name: item.bonus_name || item.item_name || "無名稱",
                create_at: item.create_at,
                create_by: item.create_by,
                date: item.date,
                employee: {
                    id: employeeData?.id || "",
                    id_number: employeeData?.id_number || "未知",
                    ch_name: employeeData?.ch_name || "未知",
                    start_date: employeeData?.start_date || "",
                    name: employeeData?.department_name || "",
                    seniority: employeeData?.seniority || ""
                },
                employee_id: item.employee_id,
                id: item.id,
                note: item.note,
                serial_id: item.serial_id,
                serial_uuid: item.serial_uuid,
                status: item.status,
                update_at: item.update_at,
                update_by: item.update_by,
                seniority: type === "Get" ? item.seniority : employeeData?.seniority || "",
                // seniority: calculateSeniority(employeeData?.start_date) || 0

            };
        });
    };


    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'年終獎金維護'} panelList={undefined}
                customeRight={
                    [
                        <span>
                            <span style={{ display: `${data.length <= 0 ? '' : 'none'}` }}>
                                {/* <button className={scss.longsquarebtn}
                                    onClick={() => {
                                        GenerateSalary();
                                    }}
                                    title="產生薪資">
                                    產生薪資
                                </button> */}
                            </span>
                            <span style={{ display: `${status === "審核中" ? 'none' : ''}` }}>
                                <span style={{ display: `${(data.length > 0 && editall === false) ? '' : 'none'}`, padding: '0px 10px' }}>
                                    {/* <button className={scss.longsquarebtn}
                                        onClick={() => {
                                            handleeditalledit();
                                        }}
                                        title="編輯">
                                        編輯
                                    </button> */}
                                </span>
                                <span style={{ display: `${(data.length > 0 && editall === true) ? '' : 'none'}`, padding: '0px 10px' }}>
                                    <button className={scss.longsquarebtn} onClick={() => {
                                        handleeditallcancel();
                                    }}
                                        title="取消">
                                        取消
                                    </button>
                                </span>
                                <span style={{ display: `${(data.length > 0 && editall === true) ? '' : 'none'}`, paddingLeft: '10px' }}>
                                    <button className={scss.longredsquarebtn}
                                        onClick={() => {
                                            // handleeditallsave();
                                        }}
                                        title="儲存">
                                        儲存
                                    </button>
                                </span>

                                <span style={{ display: `${(data.length > 0 && editall === false) ? '' : 'none'}`, paddingLeft: '10px' }}>
                                    {/* <button className={scss.longredsquarebtn}
                                        onClick={() => {
                                            // SettlePayroll();

                                            handleeditconfirm()
                                        }}
                                        title="確認結算">
                                        確認結算
                                    </button> */}
                                </span>
                            </span>
                            <span style={{ display: `${status === "審核中" ? '' : 'none'}` }}>
                                <span style={{ display: `${(data.length > 0 && editall === false) ? '' : 'none'}`, paddingLeft: '10px' }}>
                                    <button className={scss.longredsquarebtn}
                                        onClick={() => {
                                            // SettlePayroll();

                                            handleGetReviewBack();
                                        }}
                                        title="">
                                        抽單
                                    </button>
                                </span>
                            </span>
                        </span>
                    ]}
                customeLeft={[
                    // <span
                    //     style={{
                    //         display: `${data.length === 0 ? '' : 'none'}`,
                    //         padding: '10px 20px',
                    //         fontSize:'18px',
                    //         color:'#ea1833'
                    //     }}>尚未產生本月薪資帳簿!!</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ padding: '0px 10px' }}>
                            {/* <SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} /> */}
                        </span>
                        <span style={{ padding: '0px 10px', fontSize: '18px', color: '#14256a' }}>
                            {/* {serial_id}<br />
                            {serial_uuid} */}
                            {status}
                            {/* <button onClick={() => { test() }}>測試</button> */}
                        </span>
                    </div>

                ]}
            />
            <div className={scss.body} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.content}>

                    <div className={scss.body_content1} style={{ maxHeight: `${windowSize.height - 198}px` }}>
                        <div className={scss.thead1}>
                            <span>
                                {/* <button onClick={() => { handleAdd() }}>
                                    <img src={icon_cir_add.src} alt="add" style={{ height: '25px', width: '25px' }} />
                                </button> */}
                            </span>
                            <span>員工編號</span>
                            <span>部門</span>
                            <span>姓名</span>
                            <span>到職日</span>
                            <span>年資</span>
                            <span>獎金</span>
                            <span>備註</span>
                            <span></span>
                        </div>
                        <span>
                            {data && (
                                data.map((_item: any, index: number) => {
                                    return (
                                        <CellWithBar key={index} className={scss.panelHeader1}>
                                            <div
                                                className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}
                                            >
                                                <span>
                                                    {/* <button onClick={() => { handleRemove(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                                        <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                                                    <button onClick={() => { handleEdit(index, _item) }}>
                                                        <img src={icon_edit.src} alt="cancel" style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`, width: '30px', height: '20px' }} />
                                                    </button>
                                                    <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                        <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                    </button>
                                                    <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                        <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                    </button>
                                                </span>
                                                <span>
                                                    {_item.employee?.id_number}
                                                </span>
                                                <span>
                                                    {_item.employee?.name}
                                                </span>
                                                <span>
                                                    {_item.employee?.ch_name}
                                                </span>
                                                <span>
                                                    {getTaiwanDateStr(_item.employee?.start_date)}
                                                </span>
                                                <span>{_item.employee?.seniority}</span>
                                                <span>
                                                    <input
                                                        ref={bonusRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                            width: '100%'
                                                        }}
                                                        readOnly={!(editlist && editlistindex === index)}
                                                        type={editlist && editlistindex === index ? "number" : "text"}
                                                        value={editlist && editlistindex === index ? _item.bonus : Number(_item.bonus).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newBonus = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                bonus: editlist ? newBonus : parseFloat(newBonus.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={noteRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                            width: '100%'
                                                        }}
                                                        readOnly={!(editlist && editlistindex === index)}
                                                        type={editlist && editlistindex === index ? "text" : "text"}
                                                        value={editlist && editlistindex === index ? _item.note : _item.note}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newNote = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                note: editlist ? newNote : newNote
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span></span>
                                            </div>
                                        </CellWithBar>
                                    );
                                })
                            )}
                        </span>
                    </div>
                    <div></div>
                </div>
                <div>

                </div>
                <Modal
                    visible={peoplebar}
                    onCancel={() => {
                        setpeoplebar(false); // 關閉 Modal
                        // seteditbtn(false);   // 將 editbtn 設為 false
                        setbonuspeopledata([]);
                        setAllChecked(false);
                        setSelectedDepartment("全部部門");

                    }}
                    width="1002px"
                    closable={false} // 移除右上角的叉叉
                    style={{ top: 150 }}
                    bodyStyle={{ padding: 0, height: '520px', overflow: 'hidden' }} // 限制 Modal 高度並防止溢出
                    title={
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                {/* 全部清除按鈕，固定在左邊 */}
                                {bonuspeople.length}
                                <button
                                    onClick={() => {
                                        myAlert.confirm({
                                            title: '確定全部清除嗎?',
                                            content: null,
                                            props: {
                                                onOk: async () => {
                                                    setbonuspeopledata([]); // 清空 bonuspeople
                                                    setAllChecked(false); // 取消全選
                                                }
                                            }
                                        });
                                    }}
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: "14px",
                                        backgroundColor: "#ea1833",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        visibility: `${editbtn === true ? 'visible' : 'hidden'}`, // 隱藏但保留空間
                                    }}
                                >
                                    全部清除
                                </button>

                                {/* 搜尋框和下拉選單，固定在左邊和右邊 */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                    {/* 新增下拉選單（移到左邊） */}
                                    <select
                                        style={{
                                            padding: "6px 12px",
                                            fontSize: "16px",
                                            borderBottom: "1px solid #c1c1c1",
                                            cursor: "pointer",
                                            color: "#14256a",
                                            outline: "none",
                                        }}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        value={selectedDepartment}
                                    >
                                        <option value="">全部部門</option>
                                        {Array.from(new Set(employeedata.map(item => item.department_name)))
                                            .filter(Boolean) // 避免空值
                                            .map((dept, index) => (
                                                <option key={index} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                    </select>

                                    {/* 搜尋框 */}
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            borderBottom: "1px solid #c1c1c1",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="搜尋關鍵字"
                                            value={searchText}
                                            style={{
                                                padding: "4px 5px",
                                                width: "350px",
                                                fontSize: "16px",
                                                border: "none",
                                                outline: "none",
                                            }}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                        <span style={{ padding: "4px 12px" }}>
                                            <img
                                                src={icon_search2.src}
                                                alt="search"
                                                style={{ height: "20px", width: "20px" }}
                                            />
                                        </span>
                                    </div>
                                </div>

                            </div>

                        </>

                    }

                    footer={
                        <div style={{ justifyContent: 'center', gap: '10px', padding: '10px 44px' }}>
                            <span style={{ display: `${(viewtype === "review" || status === "審核中" || status === "已核准") ? 'none' : ''}` }}>
                                <span style={{ display: `${editlist && editlistindex === currenindex ? '' : 'none'}` }}>
                                    <button
                                        className={scss.minitabbtn}
                                        onClick={() => {
                                            seteditbtn(!editbtn);
                                            setOriginalLeavedata(bonuspeople);
                                        }}
                                        style={{
                                            display: `${editbtn === false ? '' : 'none'}`,
                                            margin: '0px 20px'
                                        }}
                                    >
                                        編輯
                                    </button>
                                </span>
                            </span>
                            <button
                                className={scss.minitabbtn}
                                onClick={() => {
                                    myAlert.confirm({
                                        title: '確定要取消編輯嗎?',
                                        content: null,
                                        props: {
                                            onOk: async () => {
                                                seteditbtn(false);
                                                setbonuspeopledata(originalleavedata);
                                                // setpeoplebar(false);
                                            }
                                        }
                                    })


                                }}
                                style={{
                                    display: `${editbtn === true ? '' : 'none'}`,
                                    margin: '0px 20px'
                                }}
                            >
                                取消
                            </button>
                            <button
                                className={scss.minitabbtn}
                                onClick={() => {
                                    setpeoplebar(false)
                                    seteditbtn(false)
                                }}
                                style={{ display: `${editbtn === false ? '' : 'none'}` }}
                            >
                                關閉
                            </button>
                            <button
                                className={scss.minitabredbtn}
                                onClick={() => {
                                    console.log(bonuspeople);
                                    updateLeaveDetail(currentemp);
                                    // setLeavedaybar(false);
                                    seteditbtn(false);
                                }}
                                style={{ display: `${editbtn === true ? '' : 'none'}` }}
                            >
                                確定
                            </button>
                        </div>
                    }
                >
                    {/* Header */}
                    <div className={scss.thead2}>
                        <span>

                        </span>
                        <span>員工編號</span>
                        <span>部門</span>
                        <span>姓名</span>
                        <span>年資</span>
                        <span></span>
                    </div>

                    {/* Body Content */}
                    <div style={{}}>
                        <div
                            className={scss.body_content1}
                            style={{ overflowY: 'auto', borderBottom: '5px solid #e0e0e0' }} // 第一部分
                        >
                            <span style={{ overflowY: 'auto', height: '200px' }}>
                                {bonuspeople && bonuspeople.map((item, index) => (
                                    <CellWithBar key={index} className={scss.panelHeader2}>
                                        <div
                                            key={index}
                                            className={`${scss.row01}`}
                                        >
                                            <span>
                                                {/* {editbtn && (
                                                    <button onClick={() => { handleRemove(item) }}
                                                        style={{
                                                            height: '20px'
                                                        }}>
                                                        <img src={icon_cir_remove.src} alt="remove"
                                                            style={{ width: '30px', height: '30px' }} />
                                                    </button>
                                                )} */}
                                            </span>
                                            <span>{item.id_number}</span>
                                            <span>{item.department_name}</span>
                                            <span>{item.ch_name}</span>
                                            <span>{item.seniority}</span>
                                            <span>
                                                {editbtn && (
                                                    <button onClick={() => { handleRemove(item) }}
                                                        style={{
                                                            height: '20px'
                                                        }}>
                                                        <img src={icon_cir_remove.src} alt="remove"
                                                            style={{ width: '30px', height: '30px' }} />
                                                    </button>
                                                )}
                                            </span>
                                            <span>

                                            </span>
                                        </div>
                                    </CellWithBar>
                                ))}
                            </span>
                            <label style={{ display: "flex", alignItems: "center", padding: ' 10px 30px', fontSize: '16px', borderTop: '5px solid #ccc' }}>
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={handleSelectAll}
                                    disabled={!editbtn} // 當 editbtn 為 false 時禁用
                                    style={{
                                        transform: "scale(1.5)", // 放大 1.5 倍，可根據需求調整
                                        margin: "0 10px", // 調整外邊距，讓顯示更美觀

                                    }}
                                />
                                <span style={{ paddingLeft: '20px' }}>
                                    全選
                                </span>

                            </label>
                            <div style={{ overflowY: 'auto', height: '220px', borderTop: '1px solid #ccc' }}>
                                {/* 全選功能的 Checkbox */}

                                {filteredData.map((item, index) => {
                                    const isChecked = bonuspeople.some((person) => person.id === item.id);

                                    return (
                                        <CellWithBar key={index} className={scss.panelHeader3}>
                                            <div
                                                className={`${scss.row01}`}
                                                onClick={() => editbtn && handleCheckboxChange(item, !isChecked)} // 點擊整個列勾選/取消
                                                style={{ cursor: editbtn ? "pointer" : "default" }} // 當 `editbtn` 為 false 時，禁用點擊效果
                                            >
                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                                                        disabled={!editbtn} // 當 `editbtn` 為 false 時禁用
                                                        onClick={(e) => e.stopPropagation()} // 防止點擊 checkbox 時觸發整行的 onClick
                                                        style={{
                                                            transform: "scale(1.5)", // 放大 1.5 倍，可根據需求調整
                                                            margin: "0 10px", // 調整外邊距，讓顯示更美觀
                                                        }}
                                                    />
                                                </span>
                                                <span>{item.id_number}</span>
                                                <span>{item.department_name}</span>
                                                <span>{item.ch_name}</span>
                                                <span>{item.seniority}</span>
                                            </div>
                                        </CellWithBar>
                                    );
                                })}

                            </div>

                        </div>
                        {/* <hr style={{ border: 'solid 2px gray' }} /> */}
                        {/* <div
                            className={scss.body_content1}
                            style={{ overflowY: 'auto', height: '500px', borderTop: '5px solid #ccc' }} // 第二部分
                        >
                           
                        </div> */}

                    </div>
                </Modal>


                <DragableModal
                    handleText="選擇審核流程"
                    style={{ zIndex: '1001', width: '1000px' }}
                    show={reviewbar}
                    onCrossClick={() => { setReviewbar(false) }}>
                    <div style={{ padding: '0px 5px' }}>
                        <span style={{ fontSize: '18px' }}>送審主旨</span>
                        <input placeholder="主旨"
                            style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
                            value={documenttitle}
                            onChange={(e) => { setDocumenttitle(e.target.value) }}
                        />
                        <Radio.Group onChange={onChange} value={value} style={{ paddingTop: '5px' }}>
                            <Space direction="vertical">
                                {reviewdata.map((_item: any) => (
                                    <Radio key={_item.id} value={_item.id} onClick={() => { setReview(_item) }} style={{ fontSize: '18px', width: '1000px', borderBottom: '1px solid #ccc', padding: '5px' }} >
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                            {_item.name}：
                                            {_item.stages.map((_stage: any, index: number) => (
                                                <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                                                    {_stage.review_type}：{_stage.stage_user_name}
                                                    {index < _item.stages.length - 1 && (
                                                        <img src={icon_arrow_right.src} alt="arrow" style={{ height: '20px', width: '20px' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>
                </DragableModal>




            </div>
        </SubLayer>

    )
}


