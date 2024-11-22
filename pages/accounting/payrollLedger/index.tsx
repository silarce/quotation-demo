import SubLayer from "components/Layer/SubLayer/SubLayer";
import PageHeader02, { Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import scss from './payrollLedger.module.scss';
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
import icon_export from 'public/image/icon/fc_export.svg';


import moment from "moment";
import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";
import { Tparams } from "js/api/dtoTypes";
import { Modal } from "antd";

// type Tquery = {
//     year?: string;
//     month?: string;
//     keyword?: string | undefined;
//     invoiceStatus?: string | undefined;
//   };

export default function PayrollLedger() {

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
    const [data, setData] = useState<any[]>([]); // 物料data
    const [bomdata, setBomdata] = useState<any[]>([]); // 物料data
    const [searchdata, setSearchdata] = useState<any[]>([]); // 物料查詢
    const [searchbardata, setSearchBarData] = useState<any[]>([]); // 手key物料查詢
    const [leavedata, setLeavedata] = useState<any[]>([]);

    // 查詢變數-物料

    //普通變數
    const [selectedOption, setSelectedOption] = useState(moment().format('YYYY-MM')); // 預設為當前年月份
    // const [year, setYear] = useState(moment().format('YYYY-MM')); // 預設為當前年月份
    // const [month, setMonth] = useState(moment().format('MM')); // 預設為當前年月份
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

    // popout
    const [leavedaybar, setLeavedaybar] = useState<boolean>(false);
    const [editbtn, seteditbtn] = useState<boolean>(false);
    const [addbar, setaddbar] = useState<boolean>(false);
    // const [editall, seteditall] = useState<boolean>(false);

    //#endregion

    //#region =============【頁面進入】===============================================================================
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            // setYear(moment().format('YYYY'));
            // setMonth(moment().format('MM'));
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

        //router year傳進來是 ~2024 month 是 1~12
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
        try {
            setIsLoading(true);
            const conditionModel = {
                date: year + '-' + month,
                type: '已核准'
            };

            var inputModel = {
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
            // 重新命名欄位生成新的資料結構
            const renamedData = responsedata.map((item: any) => {
                const employeeData = item.employee ? JSON.parse(item.employee)[0] : {}; // 解析並取第一筆資料

                console.log(item);

                return {
                    id: item.id,
                    id_number: employeeData?.id_number || '',
                    department: item.department || '',
                    start_date: employeeData?.start_date || '',
                    annual_leave_days: item.annual_leave_days || '0',
                    comp_time: item.comp_time || '0',
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
                    income_tax_people: item.income_tax_people || '0',
                    labor_insurance_fee: item.labor_insurance_fee || '0',
                    health_insurance_fee: item.health_insurance_fee || '0',
                    health_insurance_people: item.health_insurance_people || '0',
                    late_deduction: item.late_deduction || '0',
                    deduction_total: item.deduction_total || '0',
                    net_pay: item.net_pay || '0',
                    note: item.note || '',
                    late_time: item.late_time || '0',
                    late_minute: item.late_minute || '0',
                    leave_day: item.leave_day || '0',
                    leave_detail: item.leave_detail || '{}',
                    leave_day_pay: item.leave_day_pay || '0',
                };
            });

            console.log(renamedData); // 檢查重命名後的資料結構

            setData(renamedData);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const Excel = async () => {
        try {

            setIsLoading(true);
            const conditionModel = {
                type2: 'payrollLedger',
                date: year + '-' + month,
                type: '已核准'
            };

            const inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/Salary/download-excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputModel)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // 將響應轉換為 Blob
            const blob = await response.blob();

            // 創建一個 URL 來下載 Blob
            const url = window.URL.createObjectURL(blob);

            // 創建一個下載鏈接
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `三久建材_${year}年${month}月份_薪資表.xls`); // 設置文件名

            // 將鏈接添加到 DOM 並觸發點擊下載
            document.body.appendChild(link);
            link.click();

            // 清除鏈接和 URL 物件
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    //#endregion

    //#region =============【方法入口】===============================================================================




    //#endregion

    //#region =============【方法邏輯】===============================================================================

    useEffect(() => {
        // alert(year + "-" + month);
        GetPayrollByDate();
    }, [year, month]);


    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'薪資帳簿'} panelList={undefined}
                customeRight={
                    [
                        <div>
                            {/* <img src={icon_search.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                            {/* <button style={{ display: `${keyword2 != '' || keyword3 != '' || keyword4 != '' ? '' : 'none'}` }} onClick={() => { handleClear() }} title='清除條件'>
                                    <img src={icon_clear.src} alt="search" style={{ height: '20px', width: '20px' }} />
                                </button> */}
                            {/* <input
                                type="text"
                                placeholder='請輸入料號'
                                value={keyword2}
                                style={{ padding: '4px 5px', width: '350px', fontSize: '16px', borderBottom: '1px solid #c1c1c1', borderRight: '1px solid #f0eded' }}
                                onChange={(e) => setKeyword2(e.target.value)}
                            /> */}
                            {/* <span style={{ padding: '0px 10px' }}>
                                <button className={scss.longsquarebtn} onClick={() => { GenerateSalary(); }} title="核准">
                                    產生薪資
                                </button>
                            </span>
                            <span style={{ padding: '0px 10px' }}>
                                <button className={scss.longsquarebtn} onClick={() => { SettlePayroll(); }} title="核准">
                                    確認結算
                                </button>
                            </span> */}
                        </div>
                    ]}
                customeLeft={[
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ padding: '0px 10px' }}>
                            <SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />
                        </span>
                        <span style={{ padding: '0px 10px' }}>
                            <button
                                className={scss.longsquarebtn}
                                style={{
                                    marginTop: '-5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => { Excel() }}
                                title="核准"
                            >
                                <img src={icon_export.src} alt="search" style={{ height: '20px', width: '20px', marginRight: '8px' }} />
                                匯出Excel
                            </button>
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
                            <span>年資日</span>
                            <span>補修日數</span>
                            <span>假別</span>
                            <span>請假日數</span>
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
                            <span>扶養人數</span>
                            <span>勞保費</span>
                            <span>健保費</span>
                            <span>眷屬人屬</span>
                            <span>遲到次數</span>
                            <span>遲到分數</span>
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
                                                    <input
                                                        ref={annual_leave_daysRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type="number"
                                                        value={_item.annual_leave_days}
                                                    />
                                                    日
                                                </span>
                                                <span>
                                                    <input
                                                        ref={comp_timeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type="number"
                                                        value={_item.comp_time}
                                                    />
                                                    日
                                                </span>
                                                <span>
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
                                                    {Number(_item.salary).toLocaleString()}
                                                </span>
                                                <span>
                                                    <input
                                                        ref={overtime_hoursRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type="number"
                                                        value={_item.overtime_hours}
                                                    />
                                                    時
                                                </span>
                                                <span>
                                                    <input
                                                        ref={attendance_daysRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type="number"
                                                        value={_item.attendance_days}
                                                    />
                                                    日
                                                </span>
                                                <span>
                                                    <input
                                                        ref={public_holidaysRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type="number"
                                                        value={_item.public_holidays}
                                                    />
                                                    日
                                                </span>
                                                <span>{Number(_item.actual_salary).toLocaleString()}</span>
                                                <span>
                                                    {Number(_item.supplement).toLocaleString()}
                                                </span>
                                                <span>
                                                    {Number(_item.allowance).toLocaleString()}
                                                </span>
                                                <span>
                                                    <input
                                                        ref={perfect_attendance_bonusRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '100px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.perfect_attendance_bonus).toLocaleString()}
                                                    />
                                                </span>
                                                <span>{taxTotal.toLocaleString()}</span>
                                                <span>
                                                    {Number(_item.overtime_pay).toLocaleString()}
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
                                                            width: '100px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.leave_day_pay).toLocaleString()}
                                                    />
                                                </span>
                                                <span>
                                                    {Number(_item.advance_payment).toLocaleString()}
                                                </span>
                                                <span>
                                                    {Number(_item.income_tax).toLocaleString()}
                                                </span>
                                                <span>
                                                    <input
                                                        ref={income_tax_peopleRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.income_tax_people).toLocaleString()}
                                                    />
                                                    人
                                                </span>
                                                <span>
                                                    <input
                                                        ref={labor_insurance_feeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '100px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.labor_insurance_fee).toLocaleString()}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={health_insurance_feeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '100px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.health_insurance_fee).toLocaleString()}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={health_insurance_peopleRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.health_insurance_people).toLocaleString()}
                                                    />
                                                    人
                                                </span>
                                                <span>
                                                    <input
                                                        ref={late_timeRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.late_time).toLocaleString()}
                                                    />
                                                    次
                                                </span>
                                                <span>
                                                    <input
                                                        ref={late_minuteRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '50px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.late_minute).toLocaleString()}
                                                    />
                                                    分
                                                </span>
                                                <span>
                                                    <input
                                                        ref={late_deductionRefs.current[index]}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            width: '100px'
                                                        }}
                                                        readOnly={true}
                                                        type={"number"}
                                                        value={Number(_item.late_deduction).toLocaleString()}
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
                            <span style={{ display: `${(viewtype === "review" || status === "審核中" || status === "已核准") ? 'none' : ''}` }}>
                                {/* <button
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
                                </button> */}
                            </span>
                            {/* <button
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
                            </button> */}
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
                            {/* <button
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
                            </button> */}
                        </div>
                    }
                >
                    <div className={scss.thead2}>
                        <span>
                            {/* <button onClick={() => { handleAddData() }} style={{ display: `${editbtn ? '' : 'none'}` }}>
                                <img src={icon_cir_add.src} alt="add" style={{ height: '30px', width: '30px' }} />
                            </button> */}
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
                                        {/* {editbtn && (
                                            <button onClick={() => { }}
                                                style={{
                                                    height: '70px'
                                                }}>
                                                <img src={icon_cir_remove.src} alt="remove"
                                                    style={{ width: '30px', height: '30px' }} />
                                            </button>
                                        )} */}
                                    </span>
                                    <span>
                                        <select
                                            value={item.leaveType}
                                            // onChange={(e) => handleLeaveTypeChange(index, e.target.value)}
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
                                            // onChange={(e) => handleLeaveDaysChange(index, e.target.value)}
                                            readOnly={true}  // 當 editbtn 為 false 時禁用輸入
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


