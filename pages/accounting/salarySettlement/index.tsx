import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './salarySettlement.module.scss';
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

//時間
import moment from "moment";
import { Modal } from "antd";
import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";



export default function SalarySettlement() {
    const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
        year = thisYear.toString(),
        month = thisMonth.toString(),
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
    const [currentemp, setCurrentEmp] = useState<string>(""); // 物料data

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
            GetPayrollByDate();

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

    const GetPayrollByDate = async () => {
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
            const response = await fetch(`${setting.apipath}/Salary/GetPayrollByDate?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responsedata = await response.json();
            console.log(responsedata);

            // 重命名欄位並解析 `employee` JSON 字串
            const renamedData = responsedata.map((item: any) => {
                const employeeData = item.employee ? JSON.parse(item.employee)[0] : {}; // 解析並取第一筆資料

                return {
                    id: item.id,
                    id_number: employeeData?.id_number || '',
                    department: item.department || '',
                    start_date: employeeData?.start_date || '',
                    ch_name: employeeData?.ch_name || '',
                    salary: item.salary || '0',
                    actual_salary: item.salary || '0',
                    supplement: item.supplement || '0',
                    allowance: item.allowance || '0',
                    employee_id: item.employee_id || '',
                    overtime_hours: item.overtime_hours || '0',
                    attendance_days: item.attendance_days || '0',
                    public_holidays: item.public_holidays || '0',
                    perfect_attendance_bonus: item.perfect_attendance_bonus || '0',
                    subtotal: item.subtotal || '0',
                    overtime_pay: item.overtime_pay || '0',
                    earning_total: item.earning_total || '0',
                    advance_payment: item.advance_payment || '0',
                    income_tax: item.income_tax || '0',
                    labor_insurance_fee: item.labor_insurance_fee || '0',
                    health_insurance_fee: item.health_insurance_fee || '0',
                    late_deduction: item.late_deduction || '0',
                    deduction_total: item.deduction_total || '0',
                    net_pay: item.net_pay || '0',
                    note: item.note || '',
                    late_time: item.late_time || '0',
                    late_minute: item.late_minute || '0',
                    comp_time: item.comp_time || '0',
                    leave_day: item.leave_day || '0',
                    leave_detail: item.leave_detail || '{}',
                    leave_day_pay: item.leave_day_pay || '0',
                };
            });

            console.log(renamedData); // 檢查重命名後的資料結構
            setData(renamedData);

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
            GetPayrollByDate();

        } catch (error: any) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const UpdatePayroll = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
                data: data
            };

            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            console.log(JSON.stringify(conditionModel));

            const response = await fetch(`${setting.apipath}/Salary/UpdatePayroll`, {
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
            GetPayrollByDate();


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


    //#endregion

    //#region =============【方法入口】===============================================================================




    //#endregion

    //#region =============【方法邏輯】===============================================================================
    // 處理新增假別資料
    const handleAddData = () => {
        // 新增一筆假別資料，並預設假別為空
        setLeavedata([...leavedata, { leaveType: '', leaveDays: '' }]);
    };

    // 處理假別變更
    const handleLeaveTypeChange = (index: any, value: any) => {
        const newLeavedata = [...leavedata];
        newLeavedata[index].leaveType = value; // 更新該筆資料的假別
        setLeavedata(newLeavedata);
    };

    // 處理日數變更
    const handleLeaveDaysChange = (index: any, value: any) => {
        const newLeavedata = [...leavedata];
        newLeavedata[index].leaveDays = value; // 更新該筆資料的日數
        setLeavedata(newLeavedata);
    };

    const handleRemove = (index: any) => {
        // 移除指定索引的項目
        const updatedData = [...leavedata];
        updatedData.splice(index, 1);
        setLeavedata(updatedData);
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

    const handleeditallsave = () => {
        seteditall(false);
        console.log(data);
        UpdatePayroll();
    }

    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'結算薪資作業'} panelList={undefined}
                customeRight={
                    [
                        <div>
                            <span style={{ display: `${data.length <= 0 ? '' : 'none'}` }}>
                                <button className={scss.longsquarebtn}
                                    onClick={() => {
                                        GenerateSalary();
                                    }}
                                    title="產生薪資">
                                    產生薪資
                                </button>
                            </span>
                            <span style={{ display: `${(data.length > 0 && editall === false) ? '' : 'none'}`, padding: '0px 10px' }}>
                                <button className={scss.longsquarebtn}
                                    onClick={() => {
                                        handleeditalledit();
                                    }}
                                    title="編輯">
                                    編輯
                                </button>
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
                                        handleeditallsave();
                                    }}
                                    title="儲存">
                                    儲存
                                </button>
                            </span>
                            <span style={{ display: `${(data.length > 0 && editall === false) ? '' : 'none'}`, paddingLeft: '10px' }}>
                                <button className={scss.longredsquarebtn}
                                    onClick={() => {
                                        // SettlePayroll();
                                    }}
                                    title="確認結算">
                                    確認結算
                                </button>
                            </span>
                        </div>
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
                            <SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />
                        </span>
                        <span style={{ padding: '0px 10px' }}>
                        </span>
                    </div>
                ]}
            />
            <div className={scss.body} style={{ height: `${windowSize.height - 198}px` }}>
                <div className={scss.content}>

                    <div className={scss.body_content1}>
                        <div className={scss.thead1}>
                            <span>員工編號</span>
                            <span>部門</span>
                            <span>姓名</span>
                            <span>到職日</span>
                            <span>假別</span>
                            <span>請假日數
                            </span>
                            <span>本薪(30天)</span>
                            <span>加班時數</span>
                            <span>出勤日數</span>
                            <span>公休日數</span>
                            <span>本薪</span>
                            <span>職務加給</span>
                            <span>工作津貼</span>
                            <span>全勤獎金</span>
                            <span>應稅合計</span>
                            <span>加班費</span>
                            <span style={{ borderRight: '1px solid #ddd' }}>本月應領</span>
                            <span>請假扣款</span>
                            <span>借支</span>
                            <span>所得稅</span>
                            <span>勞保費</span>
                            <span>健保費</span>
                            <span>遲到扣款</span>
                            <span>本月應扣</span>
                            <span>本月實領</span>
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
                                                <span>{_item.id_number}</span>
                                                <span>{_item.department}</span>
                                                <span>{_item.ch_name}</span>
                                                <span>{getTaiwanDateStr(_item.start_date)}</span>
                                                <span>
                                                    {/* <button onClick={() => {
                                                        setCurrentEmp(_item.employee_id);
                                                        setLeavedaybar(true);

                                                        // 確認 leave_detail 已是物件格式
                                                        const leaveDetail = data[index].leave_detail || {};

                                                        // 將 leaveDetail 轉換成陣列格式
                                                        const newLeaveData = Object.entries(leaveDetail).map(([leaveType, leaveDays]) => ({
                                                            leaveType,
                                                            leaveDays,
                                                        }));

                                                        // 更新 leavedata state
                                                        setLeavedata(newLeaveData);
                                                    }}>
                                                        <img src={icon_eye.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                                    </button> */}


                                                    {/* <button onClick={() => {
                                                        setCurrentEmp(_item.employee_id);
                                                        setLeavedaybar(true);
                                                        console.log(_item.leave_detail)
                                                        // 確認 leave_detail 存在並解析成物件
                                                        const leaveDetail = data[index].leave_detail ? JSON.parse(data[index].leave_detail) : {};

                                                        // 將 leaveDetail 轉換成陣列格式
                                                        const newLeaveData = Object.entries(leaveDetail).map(([leaveType, leaveDays]) => ({
                                                            leaveType,
                                                            leaveDays,
                                                        }));

                                                        // 更新 leavedata state
                                                        setLeavedata(newLeaveData);
                                                    }}>
                                                        <img src={icon_eye.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                                    </button> */}
                                                    <button onClick={() => {
                                                        setCurrentEmp(_item.id);
                                                        setLeavedaybar(true);

                                                        // 判斷 leave_detail 是字串還是物件
                                                        let leaveDetail = data[index].leave_detail;

                                                        // 若是 JSON 字串格式，解析為物件
                                                        if (typeof leaveDetail === "string") {
                                                            try {
                                                                leaveDetail = JSON.parse(leaveDetail);
                                                            } catch (error) {
                                                                console.error("JSON 解析錯誤:", error);
                                                                leaveDetail = {}; // 若解析失敗，則使用空物件作為預設
                                                            }
                                                        }

                                                        // 將 leaveDetail 轉換成陣列格式
                                                        const newLeaveData = Object.entries(leaveDetail).map(([leaveType, leaveDays]) => ({
                                                            leaveType,
                                                            leaveDays,
                                                        }));

                                                        // 更新 leavedata state
                                                        setLeavedata(newLeaveData);
                                                    }}>
                                                        <img src={icon_eye.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                                    </button>

                                                </span>
                                                <span>
                                                    {_item.leave_day || 0}
                                                </span>
                                                <span>
                                                    {editall === true ? _item.salary : Number(_item.salary).toLocaleString()}
                                                </span>
                                                <span>
                                                    <input
                                                        ref={overtime_hoursRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '50px'
                                                        }}
                                                        readOnly={!editall}
                                                        type="number"
                                                        value={_item.overtime_hours}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newOvertime_hours = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                overtime_hours: newOvertime_hours.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                    時
                                                </span>
                                                <span>
                                                    <input
                                                        ref={attendance_daysRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '50px'
                                                        }}
                                                        readOnly={!editall}
                                                        type="number"
                                                        value={_item.attendance_days}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newAttendance_days = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                attendance_days: newAttendance_days.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                    日
                                                </span>
                                                <span>
                                                    <input
                                                        ref={public_holidaysRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '50px'
                                                        }}
                                                        readOnly={!editall}
                                                        type="number"
                                                        value={_item.public_holidays}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newPublic_holidays = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                public_holidays: newPublic_holidays.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                    日
                                                </span>
                                                <span>{editall === true ? _item.actual_salary : Number(_item.actual_salary).toLocaleString()}</span>
                                                <span>
                                                    <input
                                                        ref={supplementRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.supplement : Number(_item.supplement).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newSupplement = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                supplement: editall ? newSupplement : parseFloat(newSupplement.replace(/,/g, ''))
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
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.allowance : Number(_item.allowance).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newAllowance = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                allowance: editall ? newAllowance : parseFloat(newAllowance.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={perfect_attendance_bonusRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.perfect_attendance_bonus : Number(_item.perfect_attendance_bonus).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newPerfect_attendance_bonus = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                perfect_attendance_bonus: editall ? newPerfect_attendance_bonus : parseFloat(newPerfect_attendance_bonus.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>{taxTotal.toLocaleString()}</span>
                                                <span>
                                                    <input
                                                        ref={overtime_payRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.overtime_pay : Number(_item.overtime_pay).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newOvertime_pay = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                overtime_pay: editall ? newOvertime_pay : parseFloat(newOvertime_pay.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span style={{ borderRight: '1px solid #ddd' }}>
                                                    {_item.earning_total.toLocaleString() || 0}
                                                    {/* {_item.earning_total || 0} */}
                                                </span>
                                                <span>
                                                    <input
                                                        ref={leave_day_payRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.leave_day_pay : Number(_item.leave_day_pay).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newLeave_day_pay = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                leave_day_pay: editall ? newLeave_day_pay : parseFloat(newLeave_day_pay.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    {/* advance_payment */}
                                                    <input
                                                        ref={advance_paymentRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.advance_payment : Number(_item.advance_payment).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newAdvance_payment = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                advance_payment: editall ? newAdvance_payment : parseFloat(newAdvance_payment.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={income_taxRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.income_tax : Number(_item.income_tax).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newIncome_tax = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                income_tax: editall ? newIncome_tax : parseFloat(newIncome_tax.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={labor_insurance_feeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.labor_insurance_fee : Number(_item.labor_insurance_fee).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newLabor_insurance_fee = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                labor_insurance_fee: editall ? newLabor_insurance_fee : parseFloat(newLabor_insurance_fee.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={health_insurance_feeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.health_insurance_fee : Number(_item.health_insurance_fee).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newHealth_insurance_fee = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                health_insurance_fee: editall ? newHealth_insurance_fee : parseFloat(newHealth_insurance_fee.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={late_deductionRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            borderBottom: editall ? '1px solid gray' : 'none',
                                                            width: '100px'
                                                        }}
                                                        readOnly={!editall}
                                                        type={editall ? "number" : "text"}
                                                        value={editall ? _item.late_deduction : Number(_item.late_deduction).toLocaleString()}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newLate_deduction = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                late_deduction: editall ? newLate_deduction : parseFloat(newLate_deduction.replace(/,/g, ''))
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    {_item.deduction_total.toLocaleString()}
                                                </span>
                                                <span>
                                                    {_item.net_pay.toLocaleString()}
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
                            <button onClick={() => { handleAddData() }} style={{ display: `${editbtn ? '' : 'none'}` }}>
                                <img src={icon_cir_add.src} alt="add" style={{ height: '30px', width: '30px' }} />
                            </button>
                        </span>
                        <span>假別</span>
                        <span>日數</span>
                        <span></span>
                    </div>
                    <div className={scss.body_content1} style={{ overflowY: 'auto'}}>
                        {leavedata && leavedata.map((item, index) => (
                            <CellWithBar key={index} className={scss.panelHeader2}>
                                <div className={scss.row01}>
                                    <span>
                                        {editbtn && (
                                            <button onClick={() => { handleRemove(index) }}
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
                                            onChange={(e) => handleLeaveTypeChange(index, e.target.value)}
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
                                            onChange={(e) => handleLeaveDaysChange(index, e.target.value)}
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




            </div>
        </SubLayer>

    )
}


