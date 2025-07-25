import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './editTray.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TquotationStatus } from 'js/api/dtoTypes';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

import { ButtonBase } from '@mui/material';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { AppContext } from 'pages/_app';
//路由
import { useRouter } from 'next/router';
//參數(從warehouseList取得
import { setting } from '../wareHouseList/index';
//custom component
import MyButton from 'components/global/gear/button/myButton';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
//icon
import icon_search from 'public/image/icon/fc_search.svg?url';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

export interface WHPositionModel {
  id?: string;
  whpname?: string;
  whid?: string;
  volume?: number;
  spec?: string;
  trayid?: string;
  length?: number;
  width?: number;
  childlength?: number;
  childwidth?: number;
  materialnumber?: string;
  batchnumber?: string;
  unit?: string;
  quantity?: number;
  whname?: string;
  trayname?: string;
  canedit?: boolean;
}

export default function EditTray() {
  //region ===========【頁面參數】
  const [pagename, setPagename] = useState<string>('');
  //#endregion

  //#region ===========【路由參數】
  const router = useRouter();
  const { item } = router.query;

  const parsedItem = item ? JSON.parse(item as string) : null;
  //#endregion

  //#region ===========【登入者】
  const { userInfo } = useContext(AppContext);
  const { erpFeature } = useContext(AppContext);
  //#endregion

  //#region ===========【變數宣告】
  //載入狀態
  const [isLoading, setIsLoading] = useState(false);

  //錯誤處理
  const [error, setError] = useState<string | null>(null);

  //編輯狀態
  const [isEditing, setIsEditing] = useState(false);

  //物料查詢視窗
  const [searchbar, setSearchbar] = useState(false);

  // 資料列宣告
  // const [dataState, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [data11, setData11] = useState<any[]>([]);
  const [data12, setData12] = useState<any[]>([]);

  const [data11child, setData11child] = useState<any[]>([]);
  const [traychildlayout, setTrayChildLayOut] = useState<any[]>([]);

  // 變數宣告
  //路由接進來的參數
  const [whname, setWhname] = useState<string>('');
  const [trayname, setTrayname] = useState<string | null>();
  const [whid, setWhid] = useState('');
  const [type, setType] = useState('');
  const [id, setId] = useState('');

  //編輯區塊
  const [length, setLength] = useState<number | null>(0);
  const [width, setWidth] = useState<number | null>(0);
  const [childlength, setChildLength] = useState<number | null>(1);
  const [childwidth, setChildWidth] = useState<number | null>(1);
  const [childparentlength, setChildParentLength] = useState<number | null>(0);
  const [childparentwidth, setChildParentWidth] = useState<number | null>(0);
  const [childwhposition, setChildWHPosition] = useState<string | null>(null);
  const [childwhpositionVisible, setChildWHPositionVisible] = useState<string>('none');
  const [lastchildparentlength, setLastChildParentLength] = useState<number | null>(0);
  const [lastchildparentwidth, setLastChildParentWidth] = useState<number | null>(0);
  const [currentlength, setCurrentlength] = useState<string>('');
  const [currentwidth, setCurrentwidth] = useState<string>('');
  const [currentchildlength, setCurrentchildlength] = useState<string>('');
  const [currentchildwidth, setCurrentchildwidth] = useState<string>('');

  //儲格區塊
  const [traylayout, setTrayLayOut] = useState<any[]>([]);

  //滑鼠定位
  const [mouseX, setMouseX] = useState('0px');
  const [mouseY, setMouseY] = useState('0px');
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  // 使用 useMemo 優化計算
  const checkQuantity = (data: any) => {
    return data.every((item: any) => {
      if (item.widthdata) {
        // 遞迴檢查內層
        return checkQuantity(item.widthdata);
      }

      return item.quantity === 0;
    });
  };

  const isEditable = useMemo(() => {
    return checkQuantity(data11);
  }, [data11]);

  //#endregion

  //#region ===========【監控畫面大小】
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

  //#region ===========【監控畫面大小】
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX(`${event.pageX}px`);
      setMouseY(`${event.pageY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 清理事件監聽器
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // 只需在元件掛載時添加監聽器
  //#endregion

  //#region ===========【頁面進入】
  // Local 開發時會多次觸發，上線後不影響，但開發時覺得很煩，所以加了這個
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
    }
  }, []);

  useEffect(() => {
    // setId(parsedItem?.id);
    setId(parsedItem?.id);
    setWhname(parsedItem?.whname);
    setTrayname(parsedItem?.trayname);
    setWhid(parsedItem?.whid);
    setType(parsedItem?.type);
    setPagename(`倉庫名稱：${whname}｜托盤名稱：${trayname}`);
    // setWidth(parsedItem?.width as number);
    // setLength(parsedItem?.length as number);
    console.log(parsedItem);
    // GetWhp(parsedItem?.id, parsedItem?.trayname, parsedItem?.whid);
    GetLayOut(parsedItem?.id, parsedItem?.trayname, parsedItem?.whid);
  }, [item]);
  //#endregion

  //#region ===========【API】

  //取托盤樣式
  const GetLayOut = async (id: any, trayname: any, whid: any) => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        whid: whid,
        trayname: trayname,
        id: id,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/GetTrayLayOutById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      // 防止 responseData 是空陣列
      if (!responseData || responseData.length === 0) {
        // throw new Error('API 回傳空資料');
      }

      console.log(responseData);

      // 檢查 responseData[0].widthdata 是否存在，避免長度計算錯誤
      const widthdataLength = responseData[0]?.widthdata?.length || 0;
      const length = responseData.length || 0;

      console.log(`Width Data Length: ${widthdataLength}`);
      console.log(`Response Data Length: ${length}`);

      setData11(responseData);
      setWidth(widthdataLength);
      setLength(length);
    } catch (error: any) {
      myAlert.err({ title: error.message });
    } finally {
      // setIsLoading(false);
    }
  };

  //更新儲格與庫存資料
  const updateData = async (updatedData: any) => {
    try {
      // setIsLoading(true);

      const conditionModel = {
        username: userInfo?.employee?.chName.toString(),
        data: updatedData,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      console.log(inputModel);

      const response = await fetch(`${setting.apipath}/WareHouse/UpdateWHPositionAndInventoryByID`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch or update data');
      }

      router.replace({
        pathname: `/factoryDepartment/editWHPosition`,
        query: {
          type: 'WHPosition',
          whid: whid,
          trayname: trayname,
          whname: whname,
          id: id,
        },
      });
    } catch (error: any) {
      myAlert.err({ title: error.message });
    } finally {
      // setIsLoading(false);
    }
  };

  const AddChildLayOut = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
        traylayout: traychildlayout,
        // traylayout: traylayout
      };
      // console.log("checkmodel: ", conditionModel.traylayout);

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      setData11child(responseData);
      // setData11(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const TotalLayOut = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
        ischild: true as boolean | undefined,
        traylayout: traylayout,
        traychildlayout: traychildlayout,
      };
      // console.log("checkmodel: ", conditionModel.traylayout);

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      // console.log("checkinput: ", inputModel);

      const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();
      // console.log("checkresponse: ", responseData);

      // setData11child(responseData);
      setData11(responseData);
      // setPreTrayLayout(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AddLayOut = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
        traylayout: traylayout,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/SetTray`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      setData11(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AddLayOut();
    AddChildLayOut();
    TotalLayOut();
  }, [traylayout, traychildlayout]);

  const UpdateTray = async () => {
    try {
      setIsLoading(true);

      const allChildWidthData: any[] = [];

      // 遍歷資料結構
      data11.forEach((item) => {
        item.widthdata.forEach((widthItem: any) => {
          widthItem.childtraylayoutmodel.forEach((childTray: any) => {
            childTray.childwidthdata.forEach((childWidth: any) => {
              allChildWidthData.push(childWidth);
            });
          });
        });
      });

      const conditionModel = {
        trayModel: {
          trayname: trayname as string | undefined,
          whid: whid as string | undefined,
          traycode: trayname as string | undefined,
          length: length as number | undefined,
          width: width as number | undefined,
          whname: whname as string | undefined,
          create_by: userInfo?.employee?.chName.toString(),
          id: id as string | undefined,
        },
        traylayout: allChildWidthData,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/UpdateTray`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputModel),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      if (response.ok) {
        myAlert.success({ title: '修改成功' });
        router.back();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const DeleteTrayById = async () => {
    try {
      const conditionModel = {
        id: id,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'DeleteTrayById',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/DeleteTrayById?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (result.success) {
        // 成功，顯示提示
        myAlert.success({ title: result.message });
        router.back();
      } else {
        // 失敗，顯示錯誤提示
        console.log(result.message);
        myAlert.warning({ title: '失敗', content: result.message });
      }
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  //#endregion

  //#region ===========【功能區】

  //儲格重新編碼
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

  //切換儲格
  const handlechangewhposition = (id: any, whid: any, trayname: any, whname: any) => {
    setId(id);
    setWhid(whid);
    setTrayname(trayname);
    setWhname(whname);
    GetLayOut(id, trayname, whid);
  };

  const handleUpdate = () => {
    UpdateTray();
  };

  const handleDelete = () => {
    DeleteTrayById();
  };

  //#endregion

  //#region ===========【儲格編輯】
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'length' | 'width') => {
    if (type === 'length') {
      if (e.key === 'ArrowUp') {
        setLength((prev) => {
          const newLength = prev !== null ? prev + 1 : 1;
          updateTrayLayout(newLength, width !== null ? width : 0);

          return newLength;
        });
      } else if (e.key === 'ArrowDown') {
        setLength((prev) => {
          const newLength = prev !== null && prev > 0 ? prev - 1 : 0;
          updateTrayLayout(newLength, width !== null ? width : 0);

          return newLength;
        });
      }
    } else if (type === 'width') {
      if (e.key === 'ArrowUp') {
        setWidth((prev) => {
          const newWidth = prev !== null ? prev + 1 : 1;
          updateTrayLayout(length !== null ? length : 0, newWidth);

          return newWidth;
        });
      } else if (e.key === 'ArrowDown') {
        setWidth((prev) => {
          const newWidth = prev !== null && prev > 0 ? prev - 1 : 0;
          updateTrayLayout(length !== null ? length : 0, newWidth);

          return newWidth;
        });
      }
    }
  };

  const handleChildKeyDown2 = (e: any, type: any) => {
    // alert(e.target.value);

    if (type === 'width') {
      //左右
      const value = e.target.value;

      if (Number(value) < (childwidth || 1)) {
        handleRemoveMax(value);
      } else if (Number(value) > (childwidth || 1)) {
        handleAdd(value);
      }

      setChildWidth(value);
    } else {
      //上下
      const value = e.target.value;
      console.log(value);
      console.log(childlength);

      // alert(value);
      if (Number(value) < (childlength || 1)) {
        handleRemoveAndAddNew(value);
      } else if (Number(value) > (childlength || 1)) {
        handleAdd2(value);
      }

      setChildLength(value);
    }
  };

  const updateTrayLayout = (currentLength: number, currentWidth: number) => {
    const newLayout: WHPositionModel[] = [];

    for (let l = 0; l < currentLength; l++) {
      for (let w = 0; w < currentWidth; w++) {
        const dataModel: WHPositionModel = {
          id: '',
          whpname: '',
          whid: whid?.toString(),
          volume: 0,
          spec: '',
          trayid: '',
          length: l + 1,
          width: w + 1,
          childlength: 1,
          childwidth: 1,
          materialnumber: '',
          batchnumber: '',
          unit: '',
          quantity: 0,
          whname: whname?.toString(),
          trayname: trayname?.toString(),
          canedit: true,
        };
        newLayout.push(dataModel);
      }
    }

    setTrayLayOut(newLayout);
  };

  // const updateTrayLayout = (currentLength: number, currentWidth: number) => {
  //     const newLayout: WHPositionModel[] = [...data11]; // 保留現有儲存格
  //     const existingLengths = data11.map((item) => item.length);
  //     const existingWidths = data11.map((item) => item.width);

  //     for (let l = 0; l < currentLength; l++) {
  //         for (let w = 0; w < currentWidth; w++) {
  //             // 確認該儲存格是否已存在
  //             const exists = data11.some((item) => item.length === l + 1 && item.width === w + 1);

  //             if (!exists) {
  //                 const dataModel: WHPositionModel = {
  //                     id: "",
  //                     whpname: "",
  //                     whid: whid?.toString(),
  //                     volume: 0,
  //                     spec: "",
  //                     trayid: "",
  //                     length: l + 1,
  //                     width: w + 1,
  //                     childlength: 1,
  //                     childwidth: 1,
  //                     materialnumber: '',
  //                     batchnumber: '',
  //                     unit: '',
  //                     quantity: 0,
  //                     whname: whname?.toString(),
  //                     trayname: trayname?.toString(),
  //                     canedit: true
  //                 };
  //                 newLayout.push(dataModel); // 新增不存在的儲存格
  //             }
  //         }
  //     }
  //     setTrayLayOut(newLayout); // 更新資料
  // };

  //取得子儲格的layout
  const getLaychildOutBywhpositin = async (
    length: any,
    width: any,
    childlength: any,
    childwidth: any,
    maxchildlength: any
  ) => {
    // alert(`${length}_${width}`);
    // const typedData11 = data11 as { widthdata: any[] }[];
    const typedData11 = data11 as any[];

    const resultArray: any[] = [];

    typedData11.forEach((item) => {
      const matchingItems = item.widthdata.filter((x: any) => x.length === length && x.width === width);

      matchingItems.forEach((widthdata: any) => {
        resultArray.push({
          widthdata: widthdata,
          // length: matchedItem.length,
          // width: matchedItem.width,
          // childlength: matchedItem.childlength,
          // childwidth: matchedItem.childwidth
        });
      });
    });
    // setChildWidth(resultArray[0].childtraylayoutmodel.childwidth);
    console.log(resultArray);
    // setChildWidth(parseInt(resultArray[0].widthdata.childtraylayoutmodel[0].childwidthdata.length));
    // setChildLength(parseInt(resultArray[0].widthdata.childtraylayoutmodel.length));
    setChildWidth(maxchildlength);
    setChildLength(parseInt(resultArray[0].widthdata.childtraylayoutmodel.length));
    console.log(resultArray[0].widthdata.length);

    // 將結果存入 state
    setData12(resultArray);
    console.log(data11);
    console.log(data12);
  };

  const handleRemoveMax = (value: any) => {
    // alert(value);
    const newchildwidth = parseInt(value) + 1; // 新的 childlength
    setData12((prevData12) => {
      const updatedData = [...prevData12];

      // 確保 childtraylayoutmodel 存在
      if (updatedData[0].widthdata.childtraylayoutmodel && updatedData[0].widthdata.childtraylayoutmodel.length > 0) {
        // 取得第一個 childtraylayoutmodel
        const firstChildTrayLayout = updatedData[0].widthdata.childtraylayoutmodel[parseInt(currentchildlength) - 1];

        // 確保 childwidthdata 存在並且有資料
        if (firstChildTrayLayout.childwidthdata && firstChildTrayLayout.childwidthdata.length > 0) {
          // 找到 childwidth 值最大的那筆資料
          // const maxChildWidthItem = firstChildTrayLayout.childwidthdata.reduce((prev: any, current: any) =>
          //     prev.childwidth > current.childwidth ? prev : current
          // );

          // 過濾掉 childwidth 值最大的那筆資料
          firstChildTrayLayout.childwidthdata = firstChildTrayLayout.childwidthdata.filter(
            (item: any) => item.childwidth !== newchildwidth
          );
        }
      }

      return updatedData; // 返回更新後的資料
    });

    console.log(data12); // 輸出更新後的 data12
  };

  const handleAdd = (value: any) => {
    console.log(currentchildlength);
    console.log(data12);
    console.log(data11);

    const newchildwidth = parseInt(value); // 新的 childwidth

    // 確保 data12 中有資料
    if (!data12 || data12.length === 0) {
      console.error('data12 is empty or undefined');

      return;
    }

    // 取得 data12 的第一筆資料
    const firstItem = data12[0];

    // 建立新資料模型
    const newDataItem = {
      id: '',
      whpname: '',
      whid: firstItem?.widthdata?.whid || '',
      volume: 0,
      spec: '',
      trayid: null,
      length: firstItem?.widthdata?.length || 0, // 使用相同的 length
      width: firstItem?.widthdata?.width || 0, // 使用相同的 width
      childlength: parseInt((currentchildlength ?? 0).toString()),
      childwidth: newchildwidth, // 使用新的 childwidth
      materialnumber: '',
      batchnumber: '',
      unit: '',
      quantity: 0,
      whname: firstItem?.widthdata?.whname || '',
      trayname: firstItem?.widthdata?.trayname || '',
      color: '#FFFFFF', // 預設顏色
      productname: null,
      productspec: null,
      productid: null,
    };

    // 更新 data12 的 state
    setData12((prevData12) => {
      // 確保 prevData12 存在
      if (!prevData12 || prevData12.length === 0) {
        return prevData12;
      }

      const updatedData = [...prevData12];

      // 確保 widthdata 存在
      const widthdata = updatedData[0]?.widthdata;

      if (!widthdata) {
        console.error('widthdata is missing in the first item');

        return updatedData;
      }

      // 確保 childtraylayoutmodel 存在
      if (!widthdata.childtraylayoutmodel) {
        widthdata.childtraylayoutmodel = [];
      }

      // 取出 childtraylayoutmodel 中對應 childlength 的資料
      const childIndex = parseInt(currentchildlength) - 1;
      const firstChildTrayLayout = widthdata.childtraylayoutmodel[childIndex];

      // 如果 childIndex 超出範圍，初始化一個新的 childtraylayout
      if (!firstChildTrayLayout) {
        widthdata.childtraylayoutmodel[childIndex] = { childwidthdata: [] };
      }

      // 確保 childwidthdata 存在
      const childTray = widthdata.childtraylayoutmodel[childIndex];

      if (!childTray.childwidthdata) {
        childTray.childwidthdata = [];
      }

      // 檢查是否已存在相同的 childwidthdata
      const exists = childTray.childwidthdata.some(
        (item: any) => item.childwidth === newDataItem.childwidth && item.length === newDataItem.length // 可以根據需要檢查其他字段
      );

      // 如果不存在，則添加新的 childwidthdata
      if (!exists) {
        childTray.childwidthdata.push(newDataItem);
      }

      return updatedData; // 返回更新後的資料
    });

    console.log(newDataItem);
    console.log(data12); // 輸出更新後的 data12
    console.log(data11);
  };

  const handleRemoveAndAddNew = (value: any) => {
    // alert(value);
    const newchildlength = parseInt(value) + 1; // 新的 childlength

    // 取得 data12 的第一筆資料
    const firstItem = data12[0];

    // 新資料模型
    const newDataItem = {
      childlengthid: newchildlength, // 使用新的 childlength 作為 childlengthid
      childwidthdata: [
        {
          id: null,
          whpname: '',
          whid: firstItem.widthdata.whid,
          volume: 0,
          spec: '',
          trayid: null,
          length: firstItem.widthdata.length, // 使用相同的 length
          width: firstItem.widthdata.width, // 使用相同的 width
          childlength: newchildlength, // 新的 childlength
          childwidth: 1, // 預設值，或根據其他邏輯設置
          materialnumber: '',
          batchnumber: '',
          unit: '',
          quantity: 0,
          whname: firstItem.widthdata.whname,
          trayname: firstItem.widthdata.trayname,
          color: '#FFFFFF', // 預設顏色
          productname: null,
          productspec: null,
          productid: null,
        },
      ],
    };

    setData12((prevData12) => {
      // 複製前一個狀態
      const updatedData = [...prevData12];

      // 確保 widthdata 和 childtraylayoutmodel 存在
      if (!updatedData[0].widthdata) {
        updatedData[0].widthdata = {};
      }

      if (!updatedData[0].widthdata.childtraylayoutmodel) {
        updatedData[0].widthdata.childtraylayoutmodel = [];
      }

      // 移除與 `newchildlength` 相符的項目
      updatedData[0].widthdata.childtraylayoutmodel = updatedData[0].widthdata.childtraylayoutmodel.filter(
        (item: any) => item.childlengthid !== newchildlength
      );
      // const maxChildlengthId = Math.max(
      //     ...updatedData[0].widthdata.childtraylayoutmodel.map((item: any) => item.childlengthid)
      // );

      // // 移除與最大 childlengthid 相符的項目
      // updatedData[0].widthdata.childtraylayoutmodel = updatedData[0].widthdata.childtraylayoutmodel.filter(
      //     (item: any) => item.childlengthid == maxChildlengthId
      // );

      return updatedData; // 返回更新後的資料
    });

    console.log(data12); // 輸出更新後的 data12
  };

  const handleAdd2 = (value: any) => {
    const newchildlength = parseInt(value); // 新的 childlength
    console.log(value);

    // 取得 data12 的第一筆資料
    const firstItem = data12[0];

    // 建立新資料模型
    const newDataItem = {
      childlengthid: newchildlength, // 使用新的 childlength 作為 childlengthid
      childwidthdata: [
        {
          id: '',
          whpname: '',
          whid: firstItem.widthdata.whid,
          volume: 0,
          spec: '',
          trayid: null,
          length: firstItem.widthdata.length, // 使用相同的 length
          width: firstItem.widthdata.width, // 使用相同的 width
          childlength: newchildlength, // 新的 childlength
          childwidth: 1, // 預設值，或根據其他邏輯設置
          materialnumber: '',
          batchnumber: '',
          unit: firstItem.unit,
          quantity: 0,
          whname: firstItem.widthdata.whname,
          trayname: firstItem.widthdata.trayname,
          color: '#FFFFFF', // 預設顏色
          productname: null,
          productspec: null,
          productid: null,
        },
      ],
    };

    console.log(newDataItem);

    // 將新的資料加入到 data12 的索引 0 的 childtraylayoutmodel
    setData12((prevData12) => {
      // 複製前一個狀態
      const updatedData = [...prevData12];

      // 確保 widthdata 存在
      if (!updatedData[0].widthdata) {
        updatedData[0].widthdata = {};
      }

      // 確保 childtraylayoutmodel 存在，並初始化為空陣列如果不存在
      if (!updatedData[0].widthdata.childtraylayoutmodel) {
        updatedData[0].widthdata.childtraylayoutmodel = [];
      }

      // 檢查是否已存在相同的 childlengthid
      const exists = updatedData[0].widthdata.childtraylayoutmodel.some(
        (item: any) => item.childlengthid === newDataItem.childlengthid
      );

      // 如果不存在，則添加新的 childtraylayoutmodel
      if (!exists) {
        updatedData[0].widthdata.childtraylayoutmodel.push(newDataItem);
      }

      return updatedData; // 返回更新後的資料
    });

    console.log(newDataItem);
    console.log(data12); // 輸出更新後的 data12
    console.log(data11);
  };

  //#endregion

  //#region ===========【渲染畫面】
  return (
    <SubLayer isLoading_subLayer={false} className="overflow-hidden">
      <PageHeader02
        tag={`修改｜倉庫編號：${whname}｜托盤編號：${trayname}`}
        panelList={undefined}
        customeRight={[
          <>
            {/* <button
                            className={scss.shortredsquarebtn}
                            onClick={() => {
                                myAlert.confirm({
                                    title: `確定要還原嗎?`,
                                    props: {
                                        onOk: () => {
                                           router.reload();
                                        }
                                    }
                                })
                            }}
                        >
                            還原
                        </button > */}
            <button
              className={scss.shortredsquarebtn}
              onClick={() => {
                myAlert.confirm({
                  title: `確定要刪除嗎?`,
                  props: {
                    onOk: () => {
                      handleDelete();
                    },
                  },
                });
              }}
            >
              刪除
            </button>
            <button
              className={scss.shortredsquarebtn}
              onClick={() => {
                myAlert.confirm({
                  title: `確定要更新嗎?`,
                  props: {
                    onOk: () => {
                      handleUpdate();
                    },
                  },
                });
              }}
            >
              更新
            </button>
            <button
              className={scss.shortsquarebtn}
              onClick={() => {
                myAlert.confirm({
                  title: `確定要返回嗎?`,
                  props: {
                    onOk: () => {
                      router.back();
                    },
                  },
                });
              }}
            >
              返回
            </button>
          </>,
        ]}
      />
      <div className={scss.container} style={{ height: `${windowSize.height - 198}px` }}>
        <div className={scss.right}>
          <div className={scss.content}>
            <div className={scss.head_body}>
              <div className={scss.head_content0}>
                <div>
                  <span style={{ color: '#14256a', fontSize: '20px', fontWeight: 'bolder' }}>主儲格</span>
                  <InputSel
                    {...inputSelProps}
                    caption="托盤名稱"
                    captionStyle={{ fontSize: '18px' }}
                    disabled={false}
                    inputProps={{
                      props: {
                        value: trayname?.toString(),
                        onChange: (e) => {
                          setTrayname(e.target.value);
                        },
                      },
                    }}
                  />
                  <InputSel
                    {...inputSelProps}
                    caption="寬↔"
                    disabled={!isEditable}
                    inputProps={{
                      props: {
                        value: width ?? 0,
                        // onChange: (e) => handleWidthLengthChange(e, "width"),
                        onKeyDown: (e) => handleKeyDown(e, 'width'),
                      },
                    }}
                  />
                  <InputSel
                    {...inputSelProps}
                    caption="長↕"
                    disabled={!isEditable}
                    inputProps={{
                      props: {
                        value: length ?? 0,
                        // onChange: (e) => handleWidthLengthChange(e, "length"),
                        onKeyDown: (e) => handleKeyDown(e, 'length'),
                      },
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#ea1833' }}>{`${'※提醒事項'}`}</span>
                  <br />
                  <span style={{ fontSize: '14px', color: '#ea1833' }}>{`${'1.名稱修改會影響倉儲呼叫托盤'}`}</span>
                  <br />
                  <span
                    style={{ fontSize: '14px', color: '#ea1833' }}
                  >{`${'2.托盤上庫存需清空才可調整主儲格樣式'}`}</span>
                  <br />
                  <span style={{ fontSize: '14px', color: '#ea1833' }}>{`${'3.點擊儲格格位可調整子儲格樣式'}`}</span>
                  <br />
                </div>
                <div style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', padding: '20px 20px' }}>
                  {data11.map((Data, index) => (
                    <table key={index} className={scss.traytable} style={{ border: 'solid 1px black' }}>
                      <tbody>
                        <tr className={scss.tr}>
                          {Data.widthdata.map((item: any, index: number) => (
                            <td
                              key={index}
                              className={scss.td}
                              style={{
                                backgroundColor: item.color,
                                color: item.color === '#ea1833' ? '#FFFFFF' : 'black',
                              }}
                            >
                              {item.childtraylayoutmodel &&
                                item.childtraylayoutmodel.map((childitem: any) => (
                                  <table className={scss.childtraytable} key={item.childlengthid}>
                                    <tbody>
                                      <tr className={scss.childtraytabletr}>
                                        {childitem.childwidthdata.map((childDataItem: any) => (
                                          <td
                                            className={scss.childtraytabletd}
                                            key={childDataItem.id}
                                            style={{
                                              backgroundColor: childDataItem.color,
                                              height:
                                                item.childtraylayoutmodel.length > 1
                                                  ? 85 / item.childtraylayoutmodel.length
                                                  : '89px',
                                            }}
                                          >
                                            <button
                                              className={scss.childtraytabletdButton}
                                              onClick={() => {
                                                // handlechangewhposition(childDataItem.id, childDataItem.whid, childDataItem.trayname, childDataItem.whname)
                                                setChildWHPosition(
                                                  recodeWhpid(
                                                    childDataItem.length,
                                                    childDataItem.width,
                                                    childDataItem.childlength,
                                                    childDataItem.childwidth
                                                  )
                                                );
                                                setChildWHPositionVisible('');
                                                setChildParentLength(childDataItem.length);
                                                setChildParentWidth(childDataItem.width);
                                                setLastChildParentLength(childparentlength);
                                                setLastChildParentWidth(childparentwidth);
                                                setCurrentlength(childDataItem.length);
                                                setCurrentwidth(childDataItem.width);
                                                setCurrentchildlength(childDataItem.childlength);
                                                setCurrentchildwidth(childDataItem.childwidth);
                                                getLaychildOutBywhpositin(
                                                  childDataItem.length,
                                                  childDataItem.width,
                                                  childDataItem.childlength,
                                                  childDataItem.childwidth,
                                                  childitem.childwidthdata.length
                                                );
                                              }}
                                              style={{
                                                backgroundColor: childDataItem.color,
                                                height:
                                                  item.childtraylayoutmodel.length > 1
                                                    ? 85 / item.childtraylayoutmodel.length
                                                    : '89px',
                                              }}
                                              onMouseEnter={() =>
                                                setHoverInfo(
                                                  `${childDataItem?.productid ?? ''}\n${
                                                    childDataItem?.productname ?? ''
                                                  }\n${childDataItem?.productspec ?? ''}\n${
                                                    childDataItem?.quantity ?? ''
                                                  }`
                                                )
                                              }
                                              onMouseLeave={() => setHoverInfo(null)}
                                            >
                                              {`${recodeWhpid(
                                                childDataItem.length,
                                                childDataItem.width,
                                                childDataItem.childlength,
                                                childDataItem.childwidth
                                              )}\n`}
                                              <br />
                                              {/* <span style={{fontSize:'10px'}}>{`${childDataItem.productid}\n`}</span><br /> */}
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
                        zIndex: '999',
                        whiteSpace: 'pre-line', // 控制換行的 CSS 屬性
                        fontSize: '16px',
                      }}
                    >
                      {hoverInfo}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={scss.head_content0}
                style={{ display: `${childwhposition === null ? 'none' : ''}`, padding: '39px 0px' }}
              >
                <div>
                  <span style={{ color: '#14256a', fontSize: '20px', fontWeight: 'bolder' }}>
                    子儲格 ({currentlength}-{currentwidth})
                  </span>
                  <InputSel
                    {...inputSelProps}
                    caption="儲位編號"
                    disabled={true}
                    inputProps={{
                      props: {
                        value: childwhposition ?? ' ',
                      },
                    }}
                  />

                  <InputSel
                    {...inputSelProps}
                    caption="寬↔"
                    disabled={false}
                    inputProps={{
                      props: {
                        type: 'number',
                        value: childwidth ?? 1,
                        min: 1, // 設定最小值為1
                        onChange: (e) => {
                          // const value = Math.max(1, Number(e.target.value)); // 確保值不小於1
                          handleChildKeyDown2(e, 'width'); // 傳入正確的數值
                        },
                      },
                    }}
                  />
                  <InputSel
                    {...inputSelProps}
                    caption="長↕"
                    disabled={false}
                    inputProps={{
                      props: {
                        type: 'number',
                        value: childlength ?? 1,
                        min: 1, // 設定最小值為1
                        onChange: (e) => {
                          // const value = Math.max(1, Number(e.target.value)); // 確保值不小於1
                          handleChildKeyDown2(e, 'length'); // 傳入正確的數值
                        },
                      },
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#ea1833' }}>{`${'※提醒事項'}`}</span>
                  <br />
                  <span
                    style={{ fontSize: '14px', color: '#ea1833' }}
                  >{`${'1.儲格庫存請先領出再調整儲格樣式，待調整完成再入回儲格'}`}</span>
                  <br />
                </div>
                <div style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', padding: '20px 20px' }}>
                  {data12.map((dataItem, index) => (
                    <table key={index} className={scss.traytable} style={{ border: 'solid 1px black' }}>
                      <tbody>
                        <tr className={scss.tr}>
                          <td className={scss.td} style={{ backgroundColor: dataItem.widthdata.color || 'white' }}>
                            {dataItem.widthdata.childtraylayoutmodel.map((childLayout: any, layoutIndex: any) => (
                              <div key={layoutIndex}>
                                <table className={scss.childtraytable}>
                                  <tbody>
                                    <tr className={scss.childtraytabletr}>
                                      {childLayout.childwidthdata.map((childDataItem: any, childIndex: any) => (
                                        <td
                                          className={scss.childtraytabletd}
                                          key={childDataItem.id || childIndex} // 使用 id 或索引作為 key
                                          style={{ backgroundColor: childDataItem.color || '#FFFFFF', height: '80px' }}
                                        >
                                          <button style={{ height: '80px' }} className={scss.childtraytabletdButton}>
                                            {recodeWhpid(
                                              childDataItem.length,
                                              childDataItem.width,
                                              childDataItem.childlength,
                                              childDataItem.childwidth
                                            )}
                                          </button>
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubLayer>
  );
  //#endregion
}
