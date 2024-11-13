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
import moment from "moment";
import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";
import { Tparams } from "js/api/dtoTypes";

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
        keyword
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


    // 查詢變數-物料

    //普通變數
    const [selectedOption, setSelectedOption] = useState(moment().format('YYYY-MM')); // 預設為當前年月份
    // const [year, setYear] = useState(moment().format('YYYY-MM')); // 預設為當前年月份
    // const [month, setMonth] = useState(moment().format('MM')); // 預設為當前年月份


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
                type:'已核准'
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
                // 解析 `employee` 欄位為物件陣列
                const employeeData = JSON.parse(item.employee);
                // 確認 `employeeData` 是否有資料
                const firstEmployee = employeeData.length > 0 ? employeeData[0] : {};

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
                type:'已核准'
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
                            <button className={scss.longsquarebtn} style={{ marginTop: '-5px' }} onClick={() => { Excel() }} title="核准">
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
                            <span>到職日</span>
                            <span>姓名</span>
                            <span>本薪(30天)</span>
                            <span>職務加給</span>
                            <span>工作津貼</span>
                            <span>加班時數</span>
                            <span>出勤日數</span>
                            <span>公休日數</span>
                            <span>全勤獎金</span>
                            <span>應稅合計</span>
                            <span>加班費</span>
                            <span>本月應領</span>
                            <span>借支</span>
                            <span>所得稅</span>
                            <span>勞保費</span>
                            <span>健保費</span>
                            <span style={{ borderRight: '1px solid #clclcl' }}>遲到扣款</span>
                            <span>本月應扣</span>
                            <span>本月實領</span>
                            <span></span>
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
                                        <CellWithBar key={index} className={scss.panelHeader11}>
                                            <div className={scss.row01}>
                                                <span>{_item.id_number}</span>
                                                <span>{_item.department}</span>
                                                <span>{getTaiwanDateStr(_item.start_date)}</span>
                                                <span>{_item.ch_name}</span>
                                                <span>{_item.salary}</span>
                                                <span>{_item.supplement}</span>
                                                <span>{_item.allowance}</span>
                                                <span>
                                                    <input
                                                        ref={overtime_hoursRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '50px' }}
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
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '50px' }}
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
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '50px' }}
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
                                                <span>{_item.perfect_attendance_bonus}</span>
                                                <span>{taxTotal}</span>
                                                <span>
                                                    <input
                                                        ref={overtime_payRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.overtime_pay}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newOvertime_pay = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                overtime_pay: newOvertime_pay.toString()
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    {_item.earning_total || 0}
                                                    {/* {_item.earning_total || 0} */}
                                                </span>
                                                <span>
                                                    {/* advance_payment */}
                                                    <input
                                                        ref={advance_paymentRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.advance_payment}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newAdvance_payment = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                advance_payment: newAdvance_payment.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={income_taxRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.income_tax}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newIncome_tax = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                income_tax: newIncome_tax.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={labor_insurance_feeRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.labor_insurance_fee}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newLabor_insurance_fee = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                labor_insurance_fee: newLabor_insurance_fee.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={health_insurance_feeRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.health_insurance_fee}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newHealth_insurance_fee = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                health_insurance_fee: newHealth_insurance_fee.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    <input
                                                        ref={late_deductionRefs.current[index]}
                                                        style={{ backgroundColor: 'transparent', borderBottom: '1px solid gray', width: '100px' }}
                                                        type="number"
                                                        value={_item.late_deduction}
                                                        onChange={(e) => {
                                                            const newData = [...data];
                                                            const newLate_deduction = e.target.value;
                                                            newData[index] = {
                                                                ...newData[index],
                                                                late_deduction: newLate_deduction.toString(),
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                </span>
                                                <span>
                                                    {_item.deduction_total}
                                                </span>
                                                <span>
                                                    {_item.net_pay}
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
            </div>
        </SubLayer>

    )
}


