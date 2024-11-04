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
import moment from "moment";



export default function SalarySettlement() {

    //#region =============【路由參數】===============================================================================
    const router = useRouter();
    const {
    } = router.query;
    //#endregion

    //#region =============【變數宣告】===============================================================================
    // Loading
    const [isLoading, setIsLoading] = useState(false);

    //登入者資料
    const { userInfo } = useContext(AppContext);

    // 資料列
    const [data, setData] = useState<any[]>([]); // 物料data


    // 查詢變數-物料

    //普通變數

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
            //取得所有物料

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


    //#endregion

    //#region =============【  API  】===============================================================================

    const GenerateSalary = async () => {
        try {
            setIsLoading(true);
            const conditionModel = {
            };

            var inputModel = {
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
            const responsedata = await response.json();
            console.log(responsedata);
            // 重新命名欄位生成新的資料結構
            const renamedData = responsedata.map((item: any) => ({
                id_number: item.employee?.[0]?.id_number || '',
                name: item.employee?.[0]?.name || '',
                start_date: item.employee?.[0]?.start_date || '',
                ch_name: item.employee?.[0]?.ch_name || '',
                salary: item.salary,
                supplement: item.supplement,
                allowance: item.allowance,
                employee_id: item.employee?.[0]?.employee_id || '',
                overtime_hours: '',
                attendance_days: '',
                public_holidays: '',
                perfect_attendance_bonus: item.bonus[0].bonus,
                subtotal: '',
                overtime_pay: '',
                earning_total: '',
                advance_payment: '',
                income_tax: '',
                labor_insurance_fee: '',
                health_insurance_fee: '',
                late_deduction: '',
                deduction_total: '',
                net_pay: '',
                note: ''
            }));

            console.log(renamedData); // 檢查重命名後的資料結構

            setData(renamedData);

        } catch (error: any) {
            console.log(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };


    const SettlePayroll = async () => {
        try {

            const conditionModel = {
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                data: data
            };


            var inputModel = {
                TypeName: 'ERP',
                ServiceName: 'SalaryService',
                FunctionName: 'no',
                FilterConditions: JSON.stringify(conditionModel),
            };

            const response = await fetch(`${setting.apipath}/Salary/SettlePayroll`, {
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


        } catch (error: any) {
            console.log(error.message);
        }
        finally {
        }
    };


    //#endregion

    //#region =============【方法入口】===============================================================================




    //#endregion

    //#region =============【方法邏輯】===============================================================================


    //#endregion

    return (
        <SubLayer isLoading_subLayer={isLoading}>
            {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
            <PageHeader02 tag={'結算薪資作業'} panelList={undefined}
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
                            <span style={{ padding: '0px 10px' }}>
                                <button className={scss.longsquarebtn} onClick={() => { GenerateSalary(); }} title="核准">
                                    {/* <img src={icon_task_approved.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                                    產生薪資
                                </button>
                            </span>
                            <span style={{ padding: '0px 10px' }}>
                                <button className={scss.longsquarebtn} onClick={() => { SettlePayroll(); }} title="核准">
                                    {/* <img src={icon_task_approved.src} alt="search" style={{ height: '20px', width: '20px' }} /> */}
                                    確認結算
                                </button>
                            </span>
                        </div>
                    ]}
                customeLeft={[

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
                            <span>遲到扣款</span>
                            <span>本月應扣</span>
                            <span>本月實領</span>
                            <span></span>
                        </div>
                        <span>
                            {data && (
                                data.map((_item: any, index: number) => {
                                    // 計算總薪資
                                    const taxTotal = parseFloat(_item.salary || 0) + parseFloat(_item.supplement || 0) + parseFloat(_item.allowance || 0) + parseFloat(_item.perfect_attendance_bonus || 0);
                                    const earning_total = taxTotal + parseFloat(_item.overtime_pay || 0)
                                    const deduction_total = parseFloat(_item.advance_payment || 0) + parseFloat(_item.income_tax || 0) + parseFloat(_item.labor_insurance_fee || 0) + parseFloat(_item.health_insurance_fee || 0) + parseFloat(_item.late_deduction || 0);
                                    _item.earning_total = earning_total;
                                    _item.deduction_total = deduction_total;
                                    _item.subtotal = taxTotal;
                                    const net_pay = parseFloat(_item.earning_total || 0) - parseFloat(_item.deduction_total || 0)
                                    _item.net_pay = net_pay;
                                    return (
                                        <CellWithBar key={index} className={scss.panelHeader11}>
                                            <div className={scss.row01}>
                                                <span>{_item.id_number}</span>
                                                <span>{_item.name}</span>
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


