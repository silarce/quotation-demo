import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './salaryMaintenance.module.scss';
import { createRef, useContext, useEffect, useRef, useState } from "react";
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

//時間
import moment from "moment";
import { Modal, Radio, Space } from "antd";
import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";
import DragableModal from "components/global/gear/dragableModal/dragableModal";



export default function salaryMaintenance() {
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
    const [leavedata, setLeavedata] = useState<any[]>([]);
    const [originalleavedata, setOriginalLeavedata] = useState<any[]>([]);
    const [originaldata, setOriginalData] = useState<any[]>([]);

    //普通變數
    const [currentemp, setCurrentEmp] = useState<string>("");
    const [serial_id, setSerial_id] = useState<string>("");
    const [serial_uuid, setSerial_uuid] = useState<string>("");
    const [status, setStatus] = useState<string>("");


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

    // popout
    const [leavedaybar, setLeavedaybar] = useState<boolean>(false);
    const [editbtn, seteditbtn] = useState<boolean>(false);
    const [addbar, setaddbar] = useState<boolean>(false);
    const [editall, seteditall] = useState<boolean>(false);

    //#endregion



    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
            GetSalary();
            GetReviewFlow();
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


    useEffect(() => {
        setData([]);
        // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
    }, [year, month]);


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

    const GetSalary = async () => {
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
            const response = await fetch(`${setting.apipath}/Salary/GetSalary?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let responsedata = await response.json();

            // 根據 `employee[0].id_number` 進行排序
            responsedata = responsedata.sort((a: any, b: any) => {
                const aIdNumber = a.employee ? a.employee[0]?.id_number || '' : '';
                const bIdNumber = b.employee ? b.employee[0]?.id_number || '' : '';
                return aIdNumber.localeCompare(bIdNumber);
            });

            console.log(responsedata); // 檢查排序後的資料
            setData(responsedata);

        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const GenerateSalary = async () => {
        try {
            setIsLoading(true);

            const conditionModel = {
                date: year + '-' + month,
                type: '編輯中'
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
            const response = await fetch(`${setting.apipath}/Salary/GenerateSalary?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");

        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const UpdateSalary = async (item: any) => {
        try {
            setIsLoading(true);
            const conditionModel = {
                id: item.id,
                salary: item.salary,
                allowance: item.allowance,
                supplement: item.supplement,
                employee_id: item.employee_id,
                note: item.note
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/Salary/UpdateSalaryById`, {
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
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
            // GetSalary();
            setEditlist(false);


        } catch (error: any) {
            console.log(error.message);
        }
        finally {
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
    const handleEdit = async (index: any) => {
        if (editlist === true) {
            myAlert.warning({ title: '薪資維護中，請先結束編輯狀態' })
            return;
        }
        setOriginaleditlistdata(data);
        setEditlist(!editlist);
        setEditlistindex(index);
    };
    // 組件取消編輯
    const handleCancel = async (index: any) => {
        setEditlist(!editlist);
        setData(originaleditlistdata);
    };

    // 從組件清單移除
    const handleRemove = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定要將組件移除嗎?',
            props: {
                onOk: () => {
                    const updatedData = data.filter((_, i) => i !== index);
                    setData(updatedData);
                    // RemoveBomDetail(item.id);
                }
            }
        });
    };
    // 更新組件清單
    const handleUpdate = (index: number, item: any) => {
        myAlert.confirm({
            title: '確定更新嗎?',
            props: {
                onOk: () => {
                    UpdateSalary(item);
                }
            }
        });
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
        // 計算 leaveDays 的總和
        const totalLeaveDays = leavedata.reduce((sum, item) => {
            const days = parseFloat(item.leaveDays); // 確保 leaveDays 是數字格式
            return sum + (isNaN(days) ? 0 : days); // 若 days 不是數字，則累加 0
        }, 0);

        // 根據 employee_id 更新對應的 leave_detail 和 leave_day
        const updatedData = data.map(employee => {
            if (employee.id === id) {
                const updatedLeaveDetail = leavedata.reduce((acc, item) => {
                    if (item.leaveType && item.leaveDays) {
                        acc[item.leaveType] = item.leaveDays;
                    }
                    return acc;
                }, {} as Record<string, string>);

                return {
                    ...employee,
                    leave_detail: updatedLeaveDetail,
                    leave_day: totalLeaveDays  // 更新 leave_day 為統計後的總和
                };
            }
            return employee;
        });

        // 設定更新後的 data
        setData(updatedData);
        console.log('Updated data:', updatedData);
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

    const handleeditalledit = () => {
        seteditall(true);
        setOriginalData(data);
    }

    //儲存
    const handleeditallsave = (item: any) => {
        seteditall(false);
        console.log(data);
        // UpdatePayroll();

    }

    //確認結算
    const handleeditconfirm = () => {
        setDocumenttitle(`【薪資單】【${parseFloat(year.toString()) - 1911}年${month}月份_薪資單】_${userInfo?.employee?.chName.toString()}`)
        sentToReview("送審");
    }

    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'固定薪資維護'} panelList={undefined}
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
                        </span>
                    </div>

                ]}
            />
            <div className={scss.body} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.content}>

                    <div className={scss.body_content1}>
                        <div className={scss.thead1}>
                            <span></span>
                            <span>員工編號</span>
                            <span>部門</span>
                            <span>姓名</span>
                            <span>到職日</span>
                            <span>本薪(30天)</span>
                            <span>職務加給</span>
                            <span>工作津貼</span>

                        </div>
                        <span>
                            {data && (
                                data.map((_item: any, index: number) => {
                                    // 計算總薪資
                                    const taxTotal = parseFloat(_item.salary || 0) + parseFloat(_item.supplement || 0) + parseFloat(_item.allowance || 0) + parseFloat(_item.perfect_attendance_bonus || 0) - parseFloat(_item.leave_day_pay || 0);
                                    const earning_total = taxTotal + parseFloat(_item.overtime_pay || 0)
                                    const deduction_total = parseFloat(_item.advance_payment || 0) + parseFloat(_item.income_tax || 0) + parseFloat(_item.labor_insurance_fee || 0) + parseFloat(_item.health_insurance_fee || 0) + parseFloat(_item.late_deduction || 0) + parseFloat(_item.leave_day_pay || 0);
                                    _item.actual_salary = parseFloat(_item.salary || 0) - parseFloat(_item.leave_day_pay || 0)
                                    _item.earning_total = earning_total;
                                    _item.deduction_total = deduction_total;
                                    _item.subtotal = taxTotal;
                                    const net_pay = parseFloat(_item.earning_total || 0) - parseFloat(_item.deduction_total || 0)
                                    _item.net_pay = net_pay;
                                    return (
                                        <CellWithBar key={index} className={scss.panelHeader1}>
                                            <div className={scss.row01}>
                                                <span>
                                                    {/* <button onClick={() => { handleRemove(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                                        <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                                                    <button onClick={() => { handleEdit(index) }}>
                                                        <img src={icon_edit.src} alt="cancel" style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}`, width: '30px', height: '20px' }} />
                                                    </button>
                                                    <button onClick={() => { handleUpdate(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                        <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                    </button>
                                                    <button onClick={() => { handleCancel(index) }} style={{ display: `${(index === editlistindex && editlist === true) ? '' : 'none'}` }}>
                                                        <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                                                    </button>
                                                </span>
                                                <span>{_item.employee[0].id_number}</span>
                                                <span>{_item.employee[0].name}</span>
                                                <span>{_item.employee[0].ch_name}</span>
                                                <span>{getTaiwanDateStr(_item.employee[0].start_date)}</span>
                                                <span>
                                                    <input
                                                        ref={salaryRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            // borderBottom: editlist ? '1px solid gray' : 'none',
                                                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!(editlist && editlistindex === index)}
                                                        type={editlist && editlistindex === index ? "number" : "text"}
                                                        value={editlist && editlistindex === index ? _item.salary : Number(_item.salary).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newSalary = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                salary: editlist ? newSalary : parseFloat(newSalary.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={supplementRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!(editlist && editlistindex === index)}
                                                        type={editlist && editlistindex === index ? "number" : "text"}
                                                        value={editlist && editlistindex === index ? _item.supplement : Number(_item.supplement).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newSupplement = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                supplement: editlist ? newSupplement : parseFloat(newSupplement.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={allowanceRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editlist}
                                                        type={editlist && editlistindex === index ? "number" : "text"}
                                                        value={editlist && editlistindex === index ? _item.allowance : Number(_item.allowance).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newAllowance = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                allowance: editlist ? newAllowance : parseFloat(newAllowance.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
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
                    visible={leavedaybar}
                    onCancel={() => {
                        setLeavedaybar(false);  // 關閉 Modal
                        seteditbtn(false);      // 將 editbtn 設為 false
                        setLeavedata([]);
                    }}
                    width="502px"
                    closable={false}  // 移除右上角的叉叉
                    style={{ top: 150, }}
                    bodyStyle={{ padding: 0, height: '520px' }}  // 移除內部間距
                    title={null}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px 44px' }}>
                            <span style={{ display: `${(viewtype === "review" || status === "審核中" || status === "已核准") ? 'none' : ''}` }}>
                                <button
                                    className={scss.minitabbtn}
                                    onClick={() => {
                                        seteditbtn(!editbtn);
                                        setOriginalLeavedata(leavedata);
                                    }}
                                    style={{
                                        display: `${editbtn === false ? '' : 'none'}`,
                                        margin: '0px 20px'
                                    }}
                                >
                                    編輯
                                </button>
                            </span>
                            <button
                                className={scss.minitabbtn}
                                onClick={() => {
                                    seteditbtn(false);
                                    setLeavedata(originalleavedata);
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
                                    setLeavedaybar(false)
                                    seteditbtn(false)
                                }}
                                style={{ display: `${editbtn === false ? '' : 'none'}` }}
                            >
                                關閉
                            </button>
                            <button
                                className={scss.minitabredbtn}
                                onClick={() => {
                                    console.log(leavedata);
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
                    <div className={scss.thead2}>
                        <span>
                            <button onClick={() => { }} style={{ display: `${editbtn ? '' : 'none'}` }}>
                                <img src={icon_cir_add.src} alt="add" style={{ height: '30px', width: '30px' }} />
                            </button>
                        </span>
                        <span>假別</span>
                        <span>日數</span>
                        <span></span>
                    </div>
                    <div className={scss.body_content1} style={{ overflowY: 'auto' }}>
                        {leavedata && leavedata.map((item, index) => (
                            <CellWithBar key={index} className={scss.panelHeader2}>
                                <div className={scss.row01}>
                                    <span>
                                        {editbtn && (
                                            <button onClick={() => { }}
                                                style={{
                                                    height: '70px'
                                                }}>
                                                <img src={icon_cir_remove.src} alt="remove"
                                                    style={{ width: '30px', height: '30px' }} />
                                            </button>
                                        )}
                                    </span>
                                    <span>
                                        <select
                                            value={item.leaveType}
                                            onChange={(e) => { }}
                                            disabled={!editbtn}
                                            style={{
                                                width: '100%',
                                                fontSize: '18px',
                                                borderBottom: editbtn ? '1px solid #14256a' : 'none',
                                                backgroundColor: 'transparent',
                                                height: '50px',
                                                appearance: editbtn ? 'auto' as any : 'none' as any,  // 型別轉換
                                                MozAppearance: editbtn ? 'auto' as any : 'none' as any,  // 型別轉換
                                                WebkitAppearance: editbtn ? 'auto' as any : 'none' as any  // 型別轉換
                                            }}
                                        >
                                            <option value="">請選擇假別</option>
                                            <option value="事假">事假</option>
                                            <option value="病假">病假</option>
                                            <option value="喪假">喪假</option>
                                            <option value="公假">公假</option>
                                            <option value="產假">產假</option>
                                            <option value="生理假">生理假</option>
                                            <option value="家庭照顧假">家庭照顧假</option>
                                        </select>
                                    </span>

                                    <span>
                                        <input
                                            type="text"
                                            placeholder="請輸入日數"
                                            value={item.leaveDays}
                                            onChange={(e) => { }}
                                            readOnly={!editbtn}  // 當 editbtn 為 false 時禁用輸入
                                            style={{
                                                fontSize: '18px',
                                                width: '100%',
                                                borderBottom: editbtn ? '1px solid #14256a' : 'none',  // 底線在 editbtn 為 true 時顯示
                                                backgroundColor: 'transparent',
                                                height: '50px'
                                            }}
                                        />
                                    </span>

                                    <span></span>
                                </div>
                            </CellWithBar>
                        ))}
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


