import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './editWHPosition.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { ButtonBase } from '@mui/material';
import MyButton from 'components/global/gear/button/myButton';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { setting } from '../wareHouseList/index';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';
import icon_search from 'public/image/icon/fc_search.svg?url';

type Tquery = {
  wareHouseId: string | undefined;
};

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
  productname?: string;
  productspec?: string;
  productid?: string;
}

export default function EditWHPosition() {
  //#region ===========【頁面參數】

  //#endregion

  //#region ===========【路由參數】
  const router = useRouter();
  const { whid, trayname, whname, id, traycalled, traycalledname, traytransfer, whnamecalled } = router.query;
  //#endregion

  //#region ===========【登入者】
  const { userInfo } = useGlobal_userInfo();
  //#endregion

  //#region ===========【變數宣告】
  const [productdata, setProductdata] = useState<any[]>([]);
  const [data, setData] = useState<WHPositionModel>([]);
  const [data1, setData1] = useState<WHPositionModel>([]);
  const [data11, setData11] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [canedit, setCanEdit] = useState<boolean | undefined>(false);
  const [data12, setData12] = useState<any[]>([]);

  //托盤呼叫收回判定
  const [whnamecalledin, setWhnameCalledin] = useState<string | undefined>(whnamecalled?.toString() ?? '');
  const [traycalledin, setTrayCalledin] = useState<boolean>(traycalled === 'true');
  const [traycallednamein, setTrayCalledNamein] = useState<string | undefined>(traycalledname?.toString() ?? '');
  const [sametrayornotin, setTrayorNotin] = useState<boolean>(
    whnamecalled === data1.whname && traycalledname === data1.trayname ? true : false
  );
  const [traytransferin, setTrayTransferin] = useState<boolean>(traytransfer !== trayname);

  const [mouseX, setMouseX] = useState('0px');
  const [mouseY, setMouseY] = useState('0px');

  const status = router.query.status as TquotationStatus;
  // const traycode =router.query.whid as TquotationStatus;
  const { wareHouseId } = router.query as Tquery;
  // const [disabled, setDisabled] = useState(!!wareHouseId);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [editstatus, setEditstatus] = useState<string>('');
  const [searchbar, setSearchbar] = useState(false);

  const [searchProductId, setSearchProductId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchSpec, setSearchSpec] = useState('');

  const [length, setLength] = useState<number | null>(1);
  const [width, setWidth] = useState<number | null>(1);
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

  //#endregion

  //#region ===========【上方功能列】
  //還沒編輯前功能紐
  const panelList_unedit: TpanelList = canedit
    ? [
        {
          type: 'myButton',
          label: '編輯',
          onClick: () => {
            setDisabled(false);
            setEditstatus('編輯');
          },
        },
        {
          type: 'myButton',
          label: '返回',
          onClick: () => {
            router.push({
              pathname: `/factoryDepartment/trayList`,
              query: {
                type: 'WareHouse',
                whid: whid,
                trayname: trayname,
                whname: whname,
                traycalled: traycalledin,
                traycalledname: traycallednamein,
                traytransfer: traytransferin,
                whnamecalled: whnamecalledin,
                firsin: 0,
              },
            });
          },
        },
      ]
    : [
        //先開放編輯功能
        {
          type: 'myButton',
          label: '修改',
          onClick: () => {
            setDisabled(false);
            setEditstatus('修改');
          },
        },
        {
          type: 'myButton',
          label: '返回',
          onClick: () => {
            router.push({
              pathname: `/factoryDepartment/trayList`,
              query: {
                type: 'WareHouse',
                whid: whid,
                trayname: trayname,
                whname: whname,
                traycalled: traycalledin,
                traycalledname: traycallednamein,
                traytransfer: traytransferin,
                whnamecalled: whnamecalledin,
                firsin: 0,
              },
            });
          },
        },
      ];

  //點選編輯後功能紐
  const panelList_edit: TpanelList = [
    {
      type: 'redButton',
      label: '儲存',
      onClick: () => {
        if (editstatus === '編輯') {
          myAlert.confirm({
            title: '確定修改?',
            props: {
              onOk: () => {
                setDisabled(true);
                handleSave();
              },
            },
          });
        } else {
          myAlert.confirm({
            title: '確定修改?',
            props: {
              onOk: () => {
                setDisabled(true);
                handleSave();
              },
            },
          });
        }
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
        handleRestore();
      },
    },
  ];
  const panelList = disabled ? panelList_unedit : panelList_edit;
  //#endregion

  //#region ===========【頁面進入】

  useEffect(() => {
    getProduct();
  }, []);

  // useEffect(() => {

  // }, [item]);

  useEffect(() => {
    const fetchDataAndLayout = async () => {
      await fetchData();
      await GetLayOut();

      const handleMouseMove = (event: MouseEvent) => {
        setMouseX(`${event.pageX}px`);
        setMouseY(`${event.pageY}px`);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    };

    fetchDataAndLayout();
  }, [router.query, disabled]);

  //#endregion

  //#region ===========【API】
  //撈取物料
  const getProduct = async () => {
    try {
      setIsLoading(true);
      const conditionModel = {
        // keyword: "search" as string | undefined,
      };

      const inputModel = {
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
      setProductdata(data);

      console.log(userInfo);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //撈取儲位資料 api
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();
      const response = await fetch(`${setting.apipath}/WareHouse/EditWHPositionByID?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();
      const dataModel: WHPositionModel = {
        id: responseData.id,
        whpname: responseData.whpname,
        whid: responseData.whid,
        volume: responseData.volume,
        spec: responseData.spec,
        trayid: responseData.trayid,
        length: responseData.length,
        width: responseData.width,
        childlength: responseData.childlength,
        childwidth: responseData.childwidth,
        materialnumber: responseData.materialnumber,
        batchnumber: responseData.batchnumber,
        unit: responseData.unit,
        quantity: responseData.quantity,
        whname: responseData.whname,
        trayname: responseData.trayname,
        canedit: responseData.canedit,
        productname: responseData.productname,
        productspec: responseData.productspec,
        productid: responseData.productid,
      };

      setData1(dataModel);
      setData(dataModel); //備分恢復原本的model
      console.log(dataModel.canedit);
      setCanEdit(dataModel.canedit);
      console.log(canedit);

      // console.log("EditWHPositionByID:" + data1.id);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //更新儲位資料 api
  const updateData = async (updatedData: WHPositionModel) => {
    if (editstatus === '編輯') {
      try {
        setIsLoading(true);

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
          throw new Error('Failed to fetch data');
        }

        if (!response.ok) {
          throw new Error('Failed to update data');
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
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);

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
          throw new Error('Failed to fetch data');
        }

        if (!response.ok) {
          throw new Error('Failed to update data');
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
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  //取托盤樣式
  const GetLayOut = async () => {
    try {
      setIsLoading(true);
      const conditionModel: { whid: string | undefined; trayname: string | undefined; id: string | undefined } = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
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
      console.log(responseData);

      setData11(responseData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //呼叫托盤API
  const CallTrayAPI = async () => {
    try {
      setIsLoading(true);

      // 根據 whname 設置 deviceName
      // 寫死
      const deviceName =
        whname === '101'
          ? 'Device1'
          : whname === '102'
          ? 'Device1'
          : whname === '103'
          ? 'Device1'
          : whname === '104'
          ? 'Device1'
          : '';
      const traynumber = trayname;
      const traycommand = '100';

      const url =
        setting.env === 'prod'
          ? whname === '101'
            ? `https://${setting.warehouse1}/`
            : whname === '102'
            ? `https://${setting.warehouse2}/`
            : whname === '103'
            ? `https://${setting.warehouse3}/`
            : whname === '104'
            ? `https://${setting.warehouse4}/`
            : ''
          : 'https://localhost:44383/WareHouse/';

      // execcommand 的固定參數
      const regaddress = '253';
      const cmdvalue = '1';

      // alert(whname + " : " + trayname);

      // 設定呼叫的倉庫(setWhname)、托盤(setTrayCalled)，托盤狀態(setTrayCalledName)
      setWhnameCalledin(data1.whname);
      setTrayCalledin(true);
      setTrayCalledNamein(data1.trayname);

      // alert(url);
      // return;

      // 呼叫 traycommand API
      const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 traycommand API 的回應
      if (!response.ok) {
        throw new Error('Failed to call traycommand API');
      }

      console.log(response);
      // 等待一秒
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 呼叫 execcommand API
      const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 execcommand API 的回應
      if (!response2.ok) {
        throw new Error('Failed to call execcommand API');
      }

      console.log(response2);

      // 如果成功，設置 traycalled 和 traycalledname 狀態
      setTrayCalledin(true);
      setTrayCalledNamein(data1.trayname);
    } catch (error: any) {
      // myAlert.warning(error.message);
      console.error;
    } finally {
      setIsLoading(false);
    }
  };

  //收回托盤API
  const CallTrayBackAPI = async () => {
    try {
      setIsLoading(true);

      // 根據 whname 設置 deviceName
      const deviceName =
        whnamecalledin === '101'
          ? 'Device1'
          : whnamecalledin === '102'
          ? 'Device1'
          : whnamecalledin === '103'
          ? 'Device1'
          : whnamecalledin === '104'
          ? 'Device1'
          : '';
      const traynumber = traycallednamein;
      const traycommand = '200';
      const url =
        setting.env === 'prod'
          ? whnamecalledin === '101'
            ? `https://${setting.warehouse1}/`
            : whnamecalledin === '102'
            ? `https://${setting.warehouse2}/`
            : whnamecalledin === '103'
            ? `https://${setting.warehouse3}/`
            : whnamecalledin === '104'
            ? `https://${setting.warehouse4}/`
            : ''
          : 'https://localhost:44383/WareHouse/';

      // execcommand 的參數
      const regaddress = '253';
      const cmdvalue = '1';

      setWhnameCalledin('');
      setTrayCalledin(false);
      setTrayCalledNamein('');

      // 呼叫 traycommand API
      const response = await fetch(`${url}Modbus/traycommand/${deviceName}/${traynumber}?traycommand=${traycommand}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 traycommand API 的回應
      if (!response.ok) {
        throw new Error('Failed to call traycommand API');
      }

      // 等待一秒
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 呼叫 execcommand API
      const response2 = await fetch(`${url}Modbus/execcommand/${deviceName}/${regaddress}/${cmdvalue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 檢查 execcommand API 的回應
      if (!response2.ok) {
        throw new Error('Failed to call execcommand API');
      }

      // 如果成功，設置 traycalled 和 traycalledname 狀態
      setTrayCalledin(false);
      setTrayCalledNamein('');
    } catch (error: any) {
      // 處理錯誤，顯示警告
      // myAlert.warning(error.message);
      console.error(error); // 這裡需要傳遞錯誤對象
    } finally {
      setIsLoading(false);
    }
  };

  //#endregion

  //#region ===========【托盤功能區】
  //呼叫
  const CallTray = async () => {
    try {
      if (traycalledin === true) {
        myAlert.warning({ title: '請先收回托盤' });
      } else {
        myAlert.confirm({
          title: `呼叫: ${trayname}`,
          content: '!!請勿靠近設備!!',
          props: {
            onOk: () => {
              CallTrayAPI();
            },
          },
        });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  //收回
  const CallTrayBack = async () => {
    if (traycalledin != true) {
      myAlert.warning({ title: '目前無托盤可收回' });
    } else {
      myAlert.confirm({
        title: `收回: ${trayname}`,
        content: '!!請勿靠近設備!!',
        props: {
          onOk: () => {
            CallTrayBackAPI();
          },
        },
      });
    }
  };

  //#endregion

  //#region
  //修改儲位連動model
  const handleChange = (key: keyof WHPositionModel, value: string | number) => {
    setData1((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // 更新儲位
  const handleSave = () => {
    updateData(data1);
  };

  const handleRestore = () => {
    console.log(data);
    setData1(data);
    setEditstatus('');
  };

  async function handlechangewhposition(id: any, whid: any, trayname: any, whname: any) {
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
  }

  //#endregion

  // 重新編碼
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

  useEffect(() => {
    if (isSelectingRef.current) {
      return;
    }

    const filteredData = productdata.filter((item) => {
      const matchesKeyword5 = searchProductId ? item.productid?.includes(searchProductId) : true;
      const matchesKeyword6 = searchName ? item.name?.includes(searchName) : true;
      const matchesKeyword7 = searchSpec ? item.spec?.includes(searchSpec) : true;

      return matchesKeyword5 && matchesKeyword6 && matchesKeyword7;
    });

    setFilteredData(filteredData);
  }, [searchProductId, searchName, searchSpec, productdata]);

  const handleSelect = (item: DataItem) => {
    if (data1.quantity !== 0) {
      myAlert.warning({ title: '尚有庫存，無法更改' });

      return;
    }

    isSelectingRef.current = true;

    // 修改 data1
    data1.productid = item.productid;
    data1.productname = item.name;
    data1.productspec = item.spec || '';
    data1.unit = item.unit;

    // 透過 setState 來強制 re-render
    setSearchProductId(item.productid); // 讓 useEffect 偵測到變更
    setSearchName(item.name);
    setSearchSpec(item.spec || '');

    setShowSuggestions(false);
  };

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 500, y: 100 });
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

  return (
    <SubLayer isLoading_subLayer={false}>
      {/* <> */}
      <PageHeader02
        tag={quotationStatusLookup[status] ?? '倉庫名稱：' + whname + '｜托盤名稱：' + trayname}
        panelList={panelList}
        customeLeft={[
          <>
            <span style={{ fontSize: '18px', padding: '0px 10px' }}>
              <button
                className={scss.shortsquarebtn}
                style={{
                  display: `${editstatus === '編輯' || (editstatus === '修改' && data1.quantity === 0) ? '' : 'none'}`,
                }}
                onClick={() => {
                  // setPrbar(!prbar);
                  setSearchbar(true);
                }}
              >
                <span style={{ fontWeight: 'bolder', padding: '0px 5px' }}>☰</span>
                物料查詢
              </button>
            </span>
          </>,
        ]}
      />
      <div className={scss.main}>
        <div className={scss.left}>
          <div className={scss.top}>
            <InputSel
              {...inputSelProps}
              caption="物料編碼"
              disabled={disabled}
              // disabled={true}
              inputProps={{
                props: {
                  value: data1.productid,
                  onChange: (e) => handleChange('productid', e.target.value),
                  // onChange: handleProductidChange,
                },
              }}
            />

            {/* <IconDetail onClick={() => { alert("OK") }}>asdf</IconDetail> */}
            <InputSel
              {...inputSelProps}
              caption="物料名稱"
              disabled={disabled}
              // disabled={true}
              inputProps={{
                props: {
                  value: data1.productname,
                  onChange: (e) => handleChange('productname', e.target.value),
                  // onChange: handleNameChange,
                },
              }}
            />

            <InputSel
              {...inputSelProps}
              caption="物料規格"
              disabled={disabled}
              // disabled={true}
              inputProps={{
                props: {
                  value: data1.productspec,
                  onChange: (e) => handleChange('productspec', e.target.value),
                  // onChange: handleSpecChange,
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="批號"
              disabled={disabled}
              // disabled={true}
              inputProps={{
                props: {
                  value: data1.batchnumber,
                  onChange: (e) => handleChange('batchnumber', e.target.value),
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="數量"
              disabled={disabled}
              inputProps={{
                props: {
                  value: data1.quantity === 0 ? 0 : data1.quantity, // 讓 0 顯示為空
                  onChange: (e) => {
                    const inputValue = e.target.value.trim(); // 去除首尾空格
                    const parsedValue = parseInt(inputValue, 10);

                    handleChange('quantity', isNaN(parsedValue) ? 0 : parsedValue);
                  },
                },
              }}
            />

            <InputSel
              {...inputSelProps}
              caption="單位"
              disabled={disabled}
              // disabled={true}
              inputProps={{
                props: {
                  value: data1?.unit ? data1.unit : ' ',
                  onChange: (e) => handleChange('unit', e.target.value),
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="托盤編碼"
              // disabled={disabled}
              disabled={true}
              inputProps={{
                props: {
                  value: data1?.trayname ? data1.trayname : ' ',
                  // onChange: (e) => handleChange('trayname', e.target.value),
                },
              }}
            />
            <div className={scss.top} style={{ display: traycalledin === true ? 'none' : '' }}>
              <MyButton_v2
                theme="danger"
                className={scss.addBtn}
                label="呼叫托盤"
                onClick={() => {
                  CallTray();
                }}
              />
            </div>
            <div className={scss.top} style={{ display: traycalledin === true ? '' : 'none' }}>
              <MyButton_v2
                theme="danger"
                className={scss.addBtn}
                label={`收回托盤 (${whnamecalledin} : ${traycallednamein})`}
                onClick={() => {
                  CallTrayBack();
                }}
              />
            </div>
            {/* <div className={scss.top} style={{ display: traycalled === true && traytransfer === false ? '' : 'none' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label="收回托盤" onClick={() => { CallTrayBack(); }} />
                        </div> */}
            {/* <div className={scss.top} style={{ display: traycalled === true && traytransfer === true ? '' : 'none' }}>
                            <MyButton_v2 theme='danger' className={scss.addBtn} label="交換托盤" onClick={() => { CallTrayChange(); }} />
                        </div> */}
            {/* </div> */}
          </div>
        </div>
        <div className={scss.right}>
          <div className={scss.content}>
            {data11.map((Data, index) => (
              <table key={index} className={scss.traytable} style={{ border: 'solid 1px black' }}>
                <tbody>
                  <tr className={scss.tr}>
                    {Data.widthdata.map((item: any, index: number) => (
                      <td
                        key={index}
                        className={scss.td}
                        style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}
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
                                          handlechangewhposition(
                                            childDataItem.id,
                                            childDataItem.whid,
                                            childDataItem.trayname,
                                            childDataItem.whname
                                          );
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
                                            `${childDataItem.productid}\n${childDataItem.productname}\n${childDataItem.productspec}\n${childDataItem.quantity}`
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
      </div>

      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          // borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          width: '1000px',
          maxHeight: '500px', // 擴大整個容器的高度
          overflow: 'hidden', // 隱藏整個容器的滾動條
          fontSize: '16px',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: 'default',
          display: `${searchbar ? '' : 'none'}`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f5f5f5', // 標題列的背景色
            cursor: 'move', // 讓用戶知道可以拖動
          }}
        >
          <div style={{ fontWeight: 'bold' }}>查詢結果</div> {/* 標題文字 */}
          <button
            onClick={() => {
              setSearchbar(false);
              setSearchProductId('');
              setSearchName('');
              setSearchSpec('');
            }}
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
        {/* 搜尋輸入框 */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '8px',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#fff',
          }}
        >
          <input
            type="text"
            placeholder="輸入料號"
            value={searchProductId}
            onChange={(e) => setSearchProductId(e.target.value)}
            style={{
              flex: 1,
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="text"
            placeholder="輸入名稱"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{
              flex: 1,
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="text"
            placeholder="輸入規格"
            value={searchSpec}
            onChange={(e) => setSearchSpec(e.target.value)}
            style={{
              flex: 1,
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div
          style={{
            maxHeight: '350px', // 限制table區域的最大高度
            overflowY: 'auto', // 允許垂直滾動
          }}
        >
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
                  <td style={{ padding: '8px', width: '150px' }}>{item.productid}</td>
                  <td style={{ padding: '8px', width: '250px' }}>{item.name}</td>
                  <td style={{ padding: '8px', width: '350px' }}>{item.spec}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ textAlign: 'center', padding: '8px', color: '#888' }}>沒有匹配的結果</td>
              </tr>
            )}
          </table>
        </div>
      </div>
    </SubLayer>
  );
}
