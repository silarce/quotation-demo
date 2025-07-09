import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { Toption, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import scss from './bonusPayout.module.scss';
import { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setting } from '../../factoryDepartment/wareHouseList/index';
import { useRouter } from 'next/router';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
//grid
// import Thead01 from "../../factoryDepartment/ui/table/thead01";
//icon
import icon_search from 'public/image/icon/fc_search.svg';
import icon_clear from 'public/image/icon/fc_clear.svg';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import icon_fc_add from 'public/image/icon/fc_add.svg';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import icon_cancel from 'public/image/icon/fc_cancel.svg';
import icon_fc_check from 'public/image/icon/fc_check.svg';
import icon_cancel2 from 'public/image/icon/fc_cancel2.svg';
import { AppContext } from 'pages/_app';
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
import { Modal, Radio, Space } from 'antd';
// import { SelectBar, useYearMonth_options, useYearMonth_selectBar_query } from "js/utils/helpers/hook/useYearMonth";
import { SelectBar_date, useYearMonth_options } from 'js/utils/helpers/hook/useYearMonth';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';

export default function BonusPayout() {
  const { thisYear, thisMonth } = useYearMonth_options();

  //#region =============【路由參數】===============================================================================
  const router = useRouter();
  const { year = thisYear.toString(), month = thisMonth.toString(), bonustype, viewtype } = router.query;
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
  const [bonustypedata, setBonusTypeData] = useState<any[]>([]);

  //普通變數
  const [currentemp, setCurrentEmp] = useState<string>('');
  const [serial_id, setSerial_id] = useState<string>('');
  const [serial_uuid, setSerial_uuid] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [currenindex, setCurrentIndex] = useState<number>(0);
  const [bonustypein, setBonusType] = useState<string>((bonustype as string) || '選擇獎金種類');

  //手key輸入

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
      GetSalaryBonusCategory();
      GetReviewFlow();
      GetBonusLedgerByDate(bonustypein);
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
    GetBonusLedgerByDate(bonustypein);
  }, [year, bonustype, bonustypein]);

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
  const doSearch = (valueArr: (string | Toption | null)[]) => {};

  // 搜尋功能
  const searchGroup = {};

  //新增按鈕
  const panelList: TpanelList = [];
  // const selectPropsArr = useYearMonth_selectBar_query({
  //     year: year as string,
  //     month: month as string,
  //     yearOptionArr,
  //     monthOptionArr,
  // });

  //#endregion

  //#region =============【  API  】===============================================================================
  const GetSalaryBonusCategory = async () => {
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
      const response = await fetch(`${setting.apipath}/Salary/GetSalaryBonusCategory?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();

      // 過濾掉重複的獎金種類
      const uniqueCategories = Array.from(new Set(responsedata));

      console.log(uniqueCategories); // 檢查過濾後的資料
      setBonusTypeData(uniqueCategories); // 更新過濾後的獎金種類資料
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GetBonusLedgerByDate = async (bonusType: any) => {
    try {
      setIsLoading(true);

      const conditionModel = {
        date: `${year}-${month}`,
        type: bonusType,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'ReviewService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/Salary/GetBonusLedgerByDate?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();
      console.log('原始資料:', responsedata);

      // setStatus(responsedata[0].status);
      // 統一結構
      let normalizedData = normalizeData(responsedata, 'Get');

      normalizedData = normalizedData.sort((a: any, b: any) => {
        const aIdNumber = a.employee.id_number ? a.employee.id_number || '' : '';
        const bIdNumber = b.employee.id_number ? b.employee.id_number || '' : '';

        return aIdNumber.localeCompare(bIdNumber);
      });

      console.log(normalizedData);
      setSerial_id(normalizedData[0]?.serial_id);
      setSerial_uuid(normalizedData[0]?.serial_uuid);
      setStatus(`${normalizedData[0]?.status || ''}`);
      // console.log(item);
      setData(normalizedData);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GenerateBonus = async () => {
    if (bonustypein === '') {
      myAlert.warning({ title: '請選擇獎金種類' });

      return;
    }

    if (bonustypein === '年終獎金') {
      try {
        setIsLoading(true);

        const conditionModel = {
          // date: year + '-' + month,
          // type: '編輯中'
          // bonus_category: bonustypein
        };

        const inputModel = {
          TypeName: 'ERP',
          ServiceName: 'SalaryService',
          FunctionName: 'no',
          FilterConditions: JSON.stringify(conditionModel),
        };

        const response = await fetch(`${setting.apipath}/Salary/GenerateYearEndBonus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputModel),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responsedata = await response.json();
        handleData(responsedata);
        console.log(responsedata);
        console.log(responsedata.length);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);

        const conditionModel = {
          // date: year + '-' + month,
          // type: '編輯中'
          bonus_category: bonustypein,
        };

        const inputModel = {
          TypeName: 'ERP',
          ServiceName: 'SalaryService',
          FunctionName: 'no',
          FilterConditions: JSON.stringify(conditionModel),
        };

        const response = await fetch(`${setting.apipath}/Salary/GenerateBonus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputModel),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responsedata = await response.json();
        // const renamedData = responsedata.map((item: any) => {
        //     const employeeData = item.employee ? JSON.parse(item.employee)[0] : {}; // 解析並取第一筆資料;
        //     return {
        //         id: item.id,
        //         id_number: employeeData?.id_number || '',
        //         department: item.department || '',
        //         start_date: employeeData?.start_date || '',
        //         annual_leave_days: item.annual_leave_days || '0',
        //         comp_time: item.comp_time || '0',
        //         ch_name: employeeData?.ch_name || '',
        //     };
        // });

        // console.log(renamedData); // 檢查重命名後的資料結構
        // 統一結構
        handleData(responsedata);
        console.log(responsedata);
        console.log(responsedata.length);
        // SettleBonusLedger(handleData(responsedata));
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const SettleBonusLedger = async (resdata: any) => {
    if (bonustypein === '') {
      myAlert.warning({ title: '請選擇獎金種類' });

      return;
    }

    try {
      setIsLoading(true);

      const conditionModel = {
        date: year + '-' + month,
        // type: '編輯中'
        data: resdata,
        bonus_name: bonustypein,
        serial_id: year.toString() + month.toString(),
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'SalaryService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/Salary/SettleBonusLedger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responsedata = await response.json();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const UpdateBonusLedgerById = async (item: any) => {
    try {
      setIsLoading(true);

      const conditionModel = {
        id: item.id,
        bonus: item.bonus,
        note: item.note,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'SalaryService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(JSON.stringify(conditionModel));

      const response = await fetch(`${setting.apipath}/Salary/UpdateBonusLedgerById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // const responsedata = await response.json();
      myAlert.success({ title: '更新成功' });
      // GetSalaryBonus();
      setEditlist(false);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        employee_id: '[]',
      };

      const inputModel = {
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
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // GetSalaryBonus();
      // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //#region 審核
  const [review_flow, setReview_flow] = useState<string>('');
  const [reviewbar, setReviewbar] = useState<boolean>(false);
  const [reviewdata, setReviewdata] = useState<any[]>([]);
  const [reviewflowdata, setReviewflowdata] = useState<any[]>([]);
  const [reviewflowdata2, setReviewflowdata2] = useState<any[]>([]);
  const [documenttitle, setDocumenttitle] = useState<string>('');
  const [reviewhistroydata, setReviewhistorydata] = useState<any[]>([]);

  //取全部的自訂流程
  const GetReviewFlow = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        user_id: userInfo?.employee?.id.toString(),
      };

      const inputModel = {
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
    } finally {
      setIsLoading(false);
    }
  };

  //取單據的審核流程
  const GetReviewById = async (document_uuid: any) => {
    try {
      setReviewflowdata([]);
      setReviewflowdata2([]);
      // setIsLoading(true);

      const conditionModel = {
        document_uuid: document_uuid,
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
  };

  const sentToReview = async (type: any) => {
    try {
      if (review_flow === '') {
        setReviewbar(true);
      } else {
        // return;
        const review_query = {
          year: year,
          bonustype: bonustypein,
        };

        const conditionModel = {
          document_id: serial_id,
          document_uuid: serial_uuid,
          document_type: '獎金',
          review_id: review_flow,
          query: review_query,
          user_id: userInfo?.employee?.id.toString(),
          document_title: documenttitle,
        };

        const inputModel = {
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
          body: JSON.stringify(inputModel),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responsedata = await response.json();
        setReviewflowdata([]);
        GetReviewById(serial_uuid);
        setStatus('審核中');
        // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
        setReviewbar(false);
        await new Promise((resolve) => setTimeout(resolve, 500));

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
  };

  const handleChoseflow = () => {
    setReviewbar(true);
    setDocumenttitle(`【薪資單】【${year}年${month}月份_薪資單】_${userInfo?.employee?.chName.toString()}`);
  };

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

            const inputModel = {
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
              body: JSON.stringify(inputModel),
            });

            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }

            setReviewflowdata([]);
            setStatus('編輯中');
            setReview_flow('');
            setValue(null);
            GetReviewHistory(serial_uuid);
            // GetPayrollByDate("編輯中' or status = '審核中' or status = '已核准");
          } catch (error: any) {
            console.log(error.message);
          } finally {
            setIsLoading(false);
          }
        },
      },
    });
  };

  const GetReviewHistory = async (id: any) => {
    try {
      // setIsLoading(true);
      // alert(purchaserequisitionidin);
      const conditionModel = {
        document_uuid: id,
      };

      const inputModel = {
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
    } finally {
      // setIsLoading(false);
    }
  };
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
      myAlert.warning({ title: '獎金維護中，請先結束編輯狀態' });

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
          UpdateBonusLedgerById(item);
        },
      },
    });
  };

  const handleAddData = (item: any) => {
    if (!selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }

    // 判斷資料是否已存在
    const isExist = bonuspeople.some((person) => person.id === item.id);

    if (isExist) {
      console.log('資料已存在:', item);

      return; // 如果已存在，停止後續操作
    }

    // 如果資料不存在，新增資料
    setbonuspeopledata([
      ...bonuspeople,
      {
        id: item.id,
        id_number: item.id_number,
        start_date: '',
        ch_name: item.ch_name,
      },
    ]);

    console.log('新增後的資料:', bonuspeople);
  };

  const handleRemove = (targetItem: any) => {
    // 使用 id 來篩選出需要保留的項目
    const updatedData = bonuspeople.filter((item) => item.id !== targetItem.id);
    console.log('Updated Data:', updatedData); // 確認篩選後的資料
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
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          employee: updatedEmployee, // 更新 employee
          update_at: new Date().toISOString(), // 更新時間戳
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
        },
      },
    });
  };

  const handleeditalledit = () => {
    seteditall(true);
    setOriginalData(data);
  };

  //儲存
  const handleeditallsave = (item: any) => {
    seteditall(false);
    console.log(data);
    // UpdatePayroll();
  };

  //確認結算
  const handleeditconfirm = () => {
    setDocumenttitle(
      `【${bonustypein}】【${parseFloat(year.toString()) - 1911}年】_${userInfo?.employee?.chName.toString()}`
    );
    sentToReview('送審');
  };

  //#endregion

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const [selectedItems, setSelectedItems] = useState<any[]>([]); // 存儲已選中的項目

  const uniqueDepartments = useMemo(() => {
    // 取得 department 欄位的唯一值
    const departments = employeedata.map((item) => item.department);

    return [...new Set(departments)];
  }, [employeedata]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchText, setSearchText] = useState('');

  // const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const isSelectingRef = useRef(false);
  // 監聽條件變更
  useEffect(() => {
    // filterData();
    if (isSelectingRef.current) {
      return;
    }

    let filteredData = employeedata.filter(
      (item) => !selectedItems.some((selected) => selected.id_number === item.id_number)
    );

    if (searchText) {
      filteredData = filteredData.filter((item) => item.ch_name.toString().includes(searchText.trim()));
    }

    setFilteredData(filteredData);
    console.log(filteredData.length);
  }, [searchText, selectedItems]);

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

    console.log('新增後的資料:', data);
  };

  const normalizeData = (data: any[], type: any) => {
    return data.map((item) => {
      // 檢查 employee 欄位是否為字串，如果是字串則解析
      const employeeData =
        typeof item.employee === 'string'
          ? JSON.parse(item.employee)[0] // 假設只有一個員工資料
          : item.employee;

      return {
        bonus: item.bonus,
        bonus_name: item.bonus_name || item.item_name || '無名稱',
        create_at: item.create_at,
        create_by: item.create_by,
        date: item.date,
        employee: {
          id: employeeData?.id || '',
          id_number: employeeData?.id_number || '未知',
          ch_name: employeeData?.ch_name || '未知',
          start_date: employeeData?.start_date || '',
          name: employeeData?.department_name || '',
        },
        employee_id: item.employee_id,
        id: item.id,
        note: item.note,
        serial_id: item.serial_id,
        serial_uuid: item.serial_uuid,
        status: item.status,
        update_at: item.update_at,
        update_by: item.update_by,
        seniority: type === 'Get' ? item.seniority : employeeData?.seniority || '',
        // seniority: calculateSeniority(employeeData?.start_date) || 0
      };
    });
  };

  const handleData = (apiResponse: any[]) => {
    const normalizedData = normalizeData(apiResponse, 'Generate');
    setData(normalizedData);
    console.log(normalizedData);
    SettleBonusLedger(normalizedData);
  };

  const calculateSeniority = (startDate: string | null): string => {
    // 確保 startDate 不為 null
    if (!startDate) {
      return '未提供日期'; // 或其他適合的回傳值
    }

    const start = new Date(startDate); // 將 start_date 字串轉換為 Date

    if (isNaN(start.getTime())) {
      return '無效日期格式'; // 若無效日期，返回提示
    }

    const now = new Date(); // 當前日期

    // 獲取時間戳（毫秒）
    const diffInMs = now.getTime() - start.getTime();

    // 轉換為年月日
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // 一年的毫秒數（考慮閏年）
    const years = Math.floor(diffInYears); // 年數
    const months = Math.floor((diffInYears - years) * 12); // 剩餘的月數

    if (years >= 1) {
      // 超過一年
      return `${years}.${Math.round((months / 12) * 10)}年`;
    } else if (months >= 1) {
      // 少於一年，但超過一個月
      return `${months}.${Math.round(((diffInYears - years - months / 12) * 30) / 3)}月`;
    } else {
      // 少於一個月，直接計算天數並轉換為月數
      const days = diffInMs / (1000 * 60 * 60 * 24); // 總天數
      const fractionalMonths = days / 30; // 將天數轉換為月數

      return `${fractionalMonths.toFixed(1)}月`;
    }
  };

  // 測試
  // const startDate = "2023-11-27T02:26:34.221Z";
  // console.log(calculateSeniority(startDate)); // 結果: 0.1年（假設今天為 2024-12-02）

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      {/* <PageHeader02 tag={'BOM維護'} panelList={panelList} /> */}
      <PageHeader02
        tag={'獎金發放作業'}
        panelList={undefined}
        customeRight={[
          <span
            key="0"
            style={{ display: `${viewtype === 'review' || status === '審核中' || status === '已核准' ? 'none' : ''}` }}
          >
            <span style={{ display: `${data.length <= 0 && bonustypein !== '選擇獎金種類' ? '' : 'none'}` }}>
              <button
                className={scss.longsquarebtn}
                onClick={() => {
                  // GenerateSalary();
                  // alert(`${parseInt((year as string))-1911}-${bonustype}`)
                  GenerateBonus();
                }}
                title="獎金結算"
              >
                獎金結算
              </button>
            </span>
            <span style={{ display: `${status === '審核中' ? 'none' : ''}` }}>
              <span style={{ display: `${data.length > 0 && editall === false ? '' : 'none'}`, padding: '0px 10px' }}>
                {/* <button className={scss.longsquarebtn}
                                        onClick={() => {
                                            handleeditalledit();
                                        }}
                                        title="編輯">
                                        編輯
                                    </button> */}
              </span>
              <span style={{ display: `${data.length > 0 && editall === true ? '' : 'none'}`, padding: '0px 10px' }}>
                <button
                  className={scss.longsquarebtn}
                  onClick={() => {
                    handleeditallcancel();
                  }}
                  title="取消"
                >
                  取消
                </button>
              </span>
              <span style={{ display: `${data.length > 0 && editall === true ? '' : 'none'}`, paddingLeft: '10px' }}>
                <button
                  className={scss.longredsquarebtn}
                  onClick={() => {
                    // handleeditallsave();
                  }}
                  title="儲存"
                >
                  儲存
                </button>
              </span>

              <span style={{ display: `${data.length > 0 && editall === false ? '' : 'none'}`, paddingLeft: '10px' }}>
                <button
                  className={scss.longredsquarebtn}
                  onClick={() => {
                    // SettlePayroll();

                    handleeditconfirm();
                  }}
                  title="確認結算"
                >
                  確認結算
                </button>
              </span>
            </span>
            <span style={{ display: `${status === '審核中' ? '' : 'none'}` }}>
              <span style={{ display: `${data.length > 0 && editall === false ? '' : 'none'}`, paddingLeft: '10px' }}>
                <button
                  className={scss.longredsquarebtn}
                  onClick={() => {
                    // SettlePayroll();

                    handleGetReviewBack();
                  }}
                  title=""
                >
                  抽單
                </button>
              </span>
            </span>
          </span>,
        ]}
        customeLeft={[
          // <span
          //     style={{
          //         display: `${data.length === 0 ? '' : 'none'}`,
          //         padding: '10px 20px',
          //         fontSize:'18px',
          //         color:'#ea1833'
          //     }}>尚未產生本月薪資帳簿!!</span>
          <div key="0" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ paddingLeft: '50px' }}>
              <div style={{ position: 'relative', width: '250px' }}>
                <select
                  value={bonustypein} // 綁定到狀態
                  disabled={viewtype === 'review'}
                  onChange={(e) => {
                    const selectedBonusType = e.target.value;
                    console.log('選擇的獎金種類:', selectedBonusType);
                    setBonusType(selectedBonusType);
                    // 這裡是處理你需要的邏輯
                  }}
                  style={{
                    width: '100%',
                    border: '1px solid #c1c1c1',
                    backgroundColor: '#F5F5F5',
                    padding: '7px 20px',
                    color: '#14256a',
                    fontSize: '16px',
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">選擇獎金種類</option>
                  {bonustypedata.map((bonusType: string, index: number) => (
                    <option key={index} value={bonusType}>
                      {bonusType}
                    </option>
                  ))}
                </select>

                {/* 自訂 "V" 形箭頭 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '15px', // 調整箭頭與右側的距離
                    transform: 'translateY(-50%)',
                    fontSize: '15px', // 調整箭頭大小
                    color: '#14256a', // 調整箭頭顏色
                    pointerEvents: 'none', // 防止影響選單點擊
                    // fontWeight:'bolder'
                    // fontWeight:'bold'
                  }}
                >
                  ⌵ {/* 使用 Unicode 模仿原生 "V" */}
                </div>
              </div>
            </span>
            <span style={{ padding: '0px 0px', fontSize: '18px', color: '#14256a' }}>
              <SelectBar_date key="selectBar" className="ml-10" haveMonth={false} disabled={viewtype === 'review'} />
            </span>
            {/* {parseInt(year as string) - 1911}
                        {bonustype} */}
            <span style={{ padding: '0px 10px', fontSize: '16px', color: '#14256a' }}>
              {status}
              <br />
              發放人數：{data.length}
            </span>
            <span style={{ padding: '0px 10px', fontSize: '18px', color: '#14256a' }}>{/* {bonustypein} */}</span>
          </div>,
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
              {data &&
                data.map((_item, index) => (
                  <CellWithBar key={index} className={scss.panelHeader1}>
                    <div className={`${scss.row01} ${_item.id === selectedItemId ? scss.selectedRow : ''}`}>
                      <span>
                        {/* <button onClick={() => { handleRemove(index, _item) }} style={{ display: `${(index === editlistindex && editlist === true) ? 'none' : ''}` }}>
                                                        <img src={icon_delete.src} alt="cancel" style={{ width: '30px', height: '20px' }} />
                                                    </button> */}
                        <button
                          onClick={() => {
                            handleEdit(index, _item);
                          }}
                          style={{ display: `${status === '審核中' || status === '已核准' ? 'none' : ''}` }}
                        >
                          <img
                            src={icon_edit.src}
                            alt="cancel"
                            style={{
                              display: `${index === editlistindex && editlist === true ? 'none' : ''}`,
                              width: '30px',
                              height: '20px',
                            }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            handleUpdate(index, _item);
                          }}
                          style={{ display: `${index === editlistindex && editlist === true ? '' : 'none'}` }}
                        >
                          <img src={icon_fc_check.src} alt="add" style={{ width: '30px', height: '20px' }} />
                        </button>
                        <button
                          onClick={() => {
                            handleCancel(index);
                          }}
                          style={{ display: `${index === editlistindex && editlist === true ? '' : 'none'}` }}
                        >
                          <img src={icon_cancel2.src} alt="add" style={{ width: '30px', height: '20px' }} />
                        </button>
                      </span>
                      <span>{_item.employee.id_number}</span>
                      <span>{_item.employee.name}</span>
                      <span>{_item.employee.ch_name}</span>
                      <span>{getTaiwanDateStr(_item.employee.start_date)}</span>
                      <span>{_item.seniority}</span>
                      <span>
                        <input
                          ref={bonusRefs.current[index]}
                          style={{
                            backgroundColor: 'transparent',
                            borderBottom: editlist && editlistindex === index ? '1px solid gray' : 'none',
                            width: '100px',
                          }}
                          readOnly={!(editlist && editlistindex === index)}
                          type={editlist && editlistindex === index ? 'number' : 'text'}
                          value={
                            editlist && editlistindex === index ? _item.bonus : Number(_item.bonus).toLocaleString()
                          }
                          onChange={(e) => {
                            const newData = [...data];
                            const newBonus = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              bonus: editall ? newBonus : parseFloat(newBonus.replace(/,/g, '')),
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
                            width: '100%',
                          }}
                          readOnly={!(editlist && editlistindex === index)}
                          type={editlist && editlistindex === index ? 'text' : 'text'}
                          value={editlist && editlistindex === index ? _item.note : _item.note}
                          onChange={(e) => {
                            const newData = [...data];
                            const newNote = e.target.value;
                            newData[index] = {
                              ...newData[index],
                              note: editall ? newNote : newNote,
                            };
                            setData(newData);
                          }}
                        />
                      </span>
                    </div>
                  </CellWithBar>
                ))}
            </span>
          </div>
          <div></div>
        </div>
        <div></div>
        <Modal
          open={peoplebar}
          onCancel={() => {
            setpeoplebar(false); // 關閉 Modal
            // seteditbtn(false);   // 將 editbtn 設為 false
            setbonuspeopledata([]);
          }}
          width="1002px"
          closable={false} // 移除右上角的叉叉
          style={{ top: 150 }}
          bodyStyle={{ padding: 0, height: '520px', overflow: 'hidden' }} // 限制 Modal 高度並防止溢出
          title={
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* 部門選擇下拉選單 */}
                {/* <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    style={{ padding: "5px", fontSize: "16px" }}
                                >
                                    <option value="">全部部門</option>
                                    {uniqueDepartments.map((dept, index) => (
                                        <option key={index} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select> */}

                {/* 搜索輸入框 */}
                <div style={{ display: 'inline-flex', alignItems: 'center', borderBottom: '1px solid #c1c1c1' }}>
                  <input
                    type="text"
                    placeholder="搜尋關鍵字"
                    value={searchText}
                    style={{ padding: '4px 5px', width: '350px', fontSize: '16px', border: 'none', outline: 'none' }}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <span style={{ padding: '4px 12px' }}>
                    <img src={icon_search2.src} alt="search" style={{ height: '20px', width: '20px' }} />
                  </span>
                </div>
              </div>
            </div>
          }
          footer={
            <div style={{ justifyContent: 'center', gap: '10px', padding: '10px 44px' }}>
              <span
                style={{
                  display: `${viewtype === 'review' || status === '審核中' || status === '已核准' ? 'none' : ''}`,
                }}
              >
                <span style={{ display: `${editlist && editlistindex === currenindex ? '' : 'none'}` }}>
                  <button
                    className={scss.minitabbtn}
                    onClick={() => {
                      seteditbtn(!editbtn);
                      setOriginalLeavedata(bonuspeople);
                    }}
                    style={{
                      display: `${editbtn === false ? '' : 'none'}`,
                      margin: '0px 20px',
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
                      },
                    },
                  });
                }}
                style={{
                  display: `${editbtn === true ? '' : 'none'}`,
                  margin: '0px 20px',
                }}
              >
                取消
              </button>
              <button
                className={scss.minitabbtn}
                onClick={() => {
                  setpeoplebar(false);
                  seteditbtn(false);
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
            <span></span>
            <span>員工編號</span>
            <span>姓名</span>
            <span></span>
          </div>

          {/* Body Content */}
          <div style={{}}>
            <div
              className={scss.body_content1}
              style={{ overflowY: 'auto', borderBottom: '5px solid #e0e0e0' }} // 第一部分
            >
              <span style={{ overflowY: 'auto', height: '200px' }}>
                {bonuspeople &&
                  bonuspeople.map((item, index) => (
                    <CellWithBar key={index} className={scss.panelHeader2}>
                      <div key={index} className={`${scss.row01}`}>
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
                        <span>{item.ch_name}</span>
                        <span>
                          {editbtn && (
                            <button
                              onClick={() => {
                                handleRemove(item);
                              }}
                              style={{
                                height: '20px',
                              }}
                            >
                              <img src={icon_cir_remove.src} alt="remove" style={{ width: '30px', height: '30px' }} />
                            </button>
                          )}
                        </span>
                      </div>
                    </CellWithBar>
                  ))}
              </span>
              <span style={{ borderTop: '5px solid #ccc', overflowY: 'auto', height: '500px' }}>
                {filteredData.map((item, index) => (
                  <CellWithBar key={index} className={scss.panelHeader3}>
                    <div className={`${scss.row01}`}>
                      <span>
                        <button
                          onClick={() => {
                            handleAddData(item);
                          }}
                          style={{ display: `${editbtn ? '' : 'none'}` }}
                        >
                          <img src={icon_cir_add.src} alt="add" style={{ height: '30px', width: '30px' }} />
                        </button>
                      </span>
                      <span>{item.id_number}</span>
                      <span>{item.ch_name}</span>
                      <span></span>
                    </div>
                  </CellWithBar>
                ))}
              </span>
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
          onCrossClick={() => {
            setReviewbar(false);
          }}
        >
          <div style={{ padding: '0px 5px' }}>
            <span style={{ fontSize: '18px' }}>送審主旨</span>
            <input
              placeholder="主旨"
              style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
              value={documenttitle}
              onChange={(e) => {
                setDocumenttitle(e.target.value);
              }}
            />
            <Radio.Group onChange={onChange} value={value} style={{ paddingTop: '5px' }}>
              <Space direction="vertical">
                {reviewdata.map((_item: any) => (
                  <Radio
                    key={_item.id}
                    value={_item.id}
                    onClick={() => {
                      setReview(_item);
                    }}
                    style={{ fontSize: '18px', width: '1000px', borderBottom: '1px solid #ccc', padding: '5px' }}
                  >
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
  );
}
