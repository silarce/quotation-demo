import SubLayer from 'components/Layer/SubLayer/SubLayer';
import scss from './addTray.module.scss';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { quotationStatusLookup } from 'config/lookupTable';
import { useRouter } from 'next/router';
import { TquotationStatus } from 'js/api/dtoTypes';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { inputSelProps } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';
import { useContext, useEffect, useRef, useState } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { setting } from '../wareHouseList/index';
import { userInfo } from 'os';
import { AppContext } from 'pages/_app';
import { parse } from 'path';

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
}

export interface TrayModel {
  trayname?: string;
  whid?: string;
  traycode?: string;
  length?: number;
  width?: number;
  whname?: string;
}

export default function AddTray() {
  const { userInfo } = useContext(AppContext);
  // 備分原本model
  const [data, setData] = useState<WHPositionModel>([]);
  const [data1, setData1] = useState<WHPositionModel>([]);
  const [data11, setData11] = useState<any[]>([]);
  const [data11child, setData11child] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // 將 error 的類型更改為 string | null
  const [traylayout, setTrayLayOut] = useState<any[]>([]);
  const [traychildlayout, setTrayChildLayOut] = useState<any[]>([]);
  const [totaltraychildlayout, setTotalTrayChildLayOut] = useState<any[]>([]);
  const [trayname, setTrayName] = useState<string | null>(null);
  const [data12, setData12] = useState<any[]>([]);
  const [originaldata11, setOriginalData11] = useState<any[]>([]);

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

  const [preTrayLayout, setPreTrayLayout] = useState<any[]>([]);

  const router = useRouter();
  const { type, whid, whname, id, nextrayname } = router.query;
  const status = router.query.status as TquotationStatus;
  const { wareHouseId } = router.query as Tquery;
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //     setTrayName(nextrayname as string);
  // });

  const AddLayOut = async () => {
    try {
      // setIsLoading(true);
      const conditionModel = {
        whid: whid as string | undefined,
        trayname: trayname as string | undefined,
        id: id as string | undefined,
        traylayout: traylayout,
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

      setData11(responseData);
    } catch (error: any) {
      console.error('Error in AddLayOut: ', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AddChildLayOut = async () => {
    try {
      // setIsLoading(true);
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

      setData11child(responseData);
      // setData11(responseData);
    } catch (error: any) {
      console.error('Error in AddLayOut: ', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const TotalLayOut = async () => {
    try {
      // setIsLoading(true);
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
      console.error('Error in AddLayOut: ', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AddTray = async () => {
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
        },
        traylayout: allChildWidthData,
      };

      const inputModel = {
        TypeName: 'ERP',
        ServiceName: 'WareHouseService',
        FunctionName: 'test',
        FilterConditions: JSON.stringify(conditionModel),
      };

      const response = await fetch(`${setting.apipath}/WareHouse/AddTray`, {
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
        myAlert.success({ title: '新增成功' });
        router.back();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 點選呼叫托盤後功能紐
  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '新增',
      onClick: async () => {
        if (trayname != '' && trayname != null && trayname != undefined && length && width !== 0) {
          await AddTray();
        } else {
          myAlert.warning({
            title: '請確認名稱或儲格',
          });
        }
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

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

  const updateTrayChildLayout = (currentLength: number, currentWidth: number) => {
    const newLayout: WHPositionModel[] = [];
    const lengthValue = childparentlength ?? 0; // 確保 length 不為 null
    const widthValue = childparentwidth ?? 0; // 確保 width 不為 null

    if (lengthValue === lastchildparentlength && widthValue === lastchildparentwidth) {
      for (let l = 0; l < currentLength; l++) {
        if (l + 1 === 1) {
          for (let w = 0; w < currentWidth - 1; w++) {
            const dataModel: WHPositionModel = {
              id: '',
              whpname: '',
              whid: whid?.toString(),
              volume: 0,
              spec: '',
              trayid: '',
              length: lengthValue,
              width: widthValue,
              childlength: l + 1,
              childwidth: l + 1 === 1 ? w + 2 : w + 1,
              materialnumber: '',
              batchnumber: '',
              unit: '',
              quantity: 0,
              whname: whname?.toString(),
              trayname: '',
              canedit: true,
            };
            newLayout.push(dataModel);
          }
        } else {
          for (let w = 0; w < currentWidth; w++) {
            const dataModel: WHPositionModel = {
              id: '',
              whpname: '',
              whid: whid?.toString(),
              volume: 0,
              spec: '',
              trayid: '',
              length: lengthValue,
              width: widthValue,
              childlength: l + 1,
              childwidth: w + 1,
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
      }

      setTrayChildLayOut(newLayout);
    } else {
      for (let l = 0; l < currentLength; l++) {
        if (l + 1 === 1) {
          for (let w = 0; w < currentWidth - 1; w++) {
            const dataModel: WHPositionModel = {
              id: '',
              whpname: '',
              whid: whid?.toString(),
              volume: 0,
              spec: '',
              trayid: '',
              length: lengthValue,
              width: widthValue,
              childlength: l + 1,
              childwidth: l + 1 === 1 ? w + 2 : w + 1,
              materialnumber: '',
              batchnumber: '',
              unit: '',
              quantity: 0,
              whname: whname?.toString(),
              trayname: '',
              canedit: true,
            };
            newLayout.push(dataModel);
          }
        } else {
          for (let w = 0; w < currentWidth; w++) {
            const dataModel: WHPositionModel = {
              id: '',
              whpname: '',
              whid: whid?.toString(),
              volume: 0,
              spec: '',
              trayid: '',
              length: lengthValue,
              width: widthValue,
              childlength: l + 1,
              childwidth: w + 1,
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
      }

      setTrayChildLayOut(newLayout);
    }

    // setTotalTrayChildLayOut([...traylayout, ...traychildlayout]);

    // setPreTrayLayout([...traylayout, ...traychildlayout]);
    // setTrayLayOut(preTrayLayout)
    // console.log(traychildlayout);
    // TotalLayOut();
  };

  const confirmupdateTrayChildLayout = (currentLength: number, currentWidth: number) => {
    const newLayout: WHPositionModel[] = [];
    const lengthValue = childparentlength ?? 0; // 確保 length 不為 null
    const widthValue = childparentwidth ?? 0; // 確保 width 不為 null

    for (let l = 0; l < currentLength; l++) {
      if (l + 1 === 1) {
        for (let w = 0; w < currentWidth - 1; w++) {
          const dataModel: WHPositionModel = {
            id: '',
            whpname: '',
            whid: whid?.toString(),
            volume: 0,
            spec: '',
            trayid: '',
            length: lengthValue,
            width: widthValue,
            childlength: l + 1,
            childwidth: l + 1 === 1 ? w + 2 : w + 1,
            materialnumber: '',
            batchnumber: '',
            unit: '',
            quantity: 0,
            whname: whname?.toString(),
            trayname: '',
            canedit: true,
          };
          newLayout.push(dataModel);
        }
      } else {
        for (let w = 0; w < currentWidth; w++) {
          const dataModel: WHPositionModel = {
            id: '',
            whpname: '',
            whid: whid?.toString(),
            volume: 0,
            spec: '',
            trayid: '',
            length: lengthValue,
            width: widthValue,
            childlength: l + 1,
            childwidth: w + 1,
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
    }

    setTrayChildLayOut(newLayout);
    // setTrayLayOut(newLayout);
    // setTrayLayOut(prevLayout => [...prevLayout, ...newLayout]);
    console.log(traylayout);
  };

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

  const isHandlingRef = useRef(false);

  const handleChildKeyDown2 = (e: any, type: any) => {
    // alert(e.target.value);

    if (type === 'width') {
      const value = e.target.value;

      if (Number(value) < (childwidth || 1)) {
        handleRemoveMax(value);
      } else if (Number(value) > (childwidth || 1)) {
        handleAdd(value);
      }

      setChildWidth(value);
    } else {
      const value = e.target.value;

      // alert(value);
      if (Number(value) < (childlength || 1)) {
        handleRemoveAndAddNew(value);
      } else if (Number(value) > (childlength || 1)) {
        handleAdd2(value);
      }

      setChildLength(value);
    }
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
        if (firstChildTrayLayout?.childwidthdata && firstChildTrayLayout?.childwidthdata.length > 0) {
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

  // 建立新資料模型
  const handleAdd2 = (value: any) => {
    console.log(data12);
    console.log(data11);

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

  // 如果您希望在 data12 更新後執行某些操作，可以使用 useEffect 來監聽 data12 的變化
  useEffect(() => {
    console.log('data11 updated:', data11);
  }, [data11]);

  // 如果您希望在 data12 更新後執行某些操作，可以使用 useEffect 來監聽 data12 的變化
  useEffect(() => {
    console.log('data12 updated:', data12);
  }, [data12]);

  const handlechildKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'length' | 'width') => {
    if (type === 'length') {
      if (e.key === 'ArrowUp') {
        setChildLength((prev) => {
          const newLength = prev !== null ? prev + 1 : 1;
          updateTrayChildLayout(newLength, childwidth !== null ? childwidth : 0);
          AddLayOut(); // 在這裡執行相關的更新函數

          return newLength;
        });
      } else if (e.key === 'ArrowDown') {
        setChildLength((prev) => {
          const newLength = prev !== null && prev > 0 ? prev - 1 : 0;
          updateTrayChildLayout(newLength, childwidth !== null ? childwidth : 0);
          AddLayOut(); // 在這裡執行相關的更新函數

          return newLength;
        });
      }
    } else if (type === 'width') {
      if (e.key === 'ArrowUp') {
        setChildWidth((prev) => {
          const newWidth = prev !== null ? prev + 1 : 1;
          updateTrayChildLayout(childlength !== null ? childlength : 0, newWidth);
          AddLayOut(); // 在這裡執行相關的更新函數

          return newWidth;
        });
      } else if (e.key === 'ArrowDown') {
        setChildWidth((prev) => {
          const newWidth = prev !== null && prev > 0 ? prev - 1 : 0;
          updateTrayChildLayout(childlength !== null ? childlength : 0, newWidth);
          AddLayOut(); // 在這裡執行相關的更新函數

          return newWidth;
        });
      }
    }
  };

  useEffect(() => {
    AddLayOut();
    AddChildLayOut();
    TotalLayOut();
  }, [traylayout, traychildlayout]);

  // useEffect(() => {
  //     // 這段程式碼將在 data11 發生變化時執行
  //     console.log("data11 目前的值：", data11);
  //     // 在這裡可以做任何想要在 data11 變化時執行的處理

  //     // 如果需要在 data11 變化後執行特定函數，可以在這裡呼叫它們
  //     // 例如：layoutChildLengthAndWidth(whid, whname, data11);

  // }, [data11, traychildlayout]);

  const goToAddChildTray = (whid: any, whname: any, length: any, width: any) => {
    router.push({
      pathname: `/factoryDepartment/addChildTray`,
      query: {
        whid: whid,
        whname: whname,
        length: length,
        width: width,
      },
    });
  };

  // const getLaychildOutBywhpositin = async (length: any, width: any, childlength: any, childwidth: any) => {
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

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      <PageHeader02 tag={`新增｜倉庫編號：${whname}`} panelList={panelList} />
      <div className={scss.main}>
        <div className={scss.left}>
          <div className={scss.top}>
            <div className="input-wrapper">
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
                      setTrayName(e.target.value);
                    },
                  },
                }}
              />
              <InputSel
                {...inputSelProps}
                caption="寬↔"
                disabled={false}
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
                disabled={false}
                inputProps={{
                  props: {
                    value: length ?? 0,
                    // onChange: (e) => handleWidthLengthChange(e, "length"),
                    onKeyDown: (e) => handleKeyDown(e, 'length'),
                  },
                }}
              />
              <div style={{ padding: '5px 0px' }}>
                <span style={{ color: 'red' }}>*請用方向鍵上下調整</span>
                <br />
                <span style={{ color: 'red' }}>*點擊主儲格後，可於下方調整子儲格</span>
              </div>
            </div>
          </div>
        </div>
        <div className={scss.right}>
          <div className={scss.content}>
            {data11.map((Data, index) => (
              <table key={index} className={scss.traytable} style={{ border: 'solid 1px black' }}>
                <tbody>
                  <tr className={scss.tr}>
                    {Data.widthdata.map((item: any, index: any) => (
                      <td
                        key={index}
                        className={scss.td}
                        style={{ backgroundColor: item.color, color: item.color === '#ea1833' ? '#FFFFFF' : 'black' }}
                      >
                        {item.childtraylayoutmodel &&
                          item.childtraylayoutmodel.map((childitem: any, index: any) => (
                            <table key={index} className={scss.childtraytable}>
                              <tbody>
                                <tr className={scss.childtraytabletr}>
                                  {childitem.childwidthdata.map((childDataItem: any, index: any) => (
                                    <td
                                      className={scss.childtraytabletd}
                                      key={index}
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
                                        // onClick={() => layoutChildLengthAndWidth(whid, whname, childDataItem.length, childDataItem.width, data11)}
                                        onClick={() => {
                                          // alert(recodeWhpid(childDataItem.length, childDataItem.width, childDataItem.childlength, childDataItem.childwidth));
                                          console.log(data11);
                                          // setChildWidth(childitem.childwidthdata.length);
                                          // setChildWidth();
                                          // alert(childDataItem.length + "-" + childDataItem.width);
                                          // setChildWHPosition(childDataItem.length + "-" + childDataItem.width);
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
                                      >
                                        {recodeWhpid(
                                          childDataItem.length,
                                          childDataItem.width,
                                          childDataItem.childlength,
                                          childDataItem.childwidth
                                        )}
                                        <br />
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
          </div>
        </div>
        {/* {childwhposition && ( */}
        <div className={scss.left} style={{ display: `${childwhposition === null ? 'none' : ''}` }}>
          <div className={scss.top}>
            <div className="input-wrapper">
              <span style={{ color: '#14256a', fontSize: '20px', fontWeight: 'bolder' }}>
                子儲格 ({currentlength}-{currentwidth})
              </span>
              <InputSel
                {...inputSelProps}
                caption="儲位編號"
                disabled={false}
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
                      handleChildKeyDown2(e, 'length');
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={scss.left} style={{ display: `${childwhposition === null ? 'none' : ''}` }}>
          <div className={scss.content}>
            <input type="text" value="" />
            {/* 渲染一個 table 類似於 data11 的顯示方式 */}
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
      {/* <div className={scss.childmain} style={{ display: childwhpositionVisible }}>
                <div className={scss.left}>
                </div>
                <div className={scss.right}>
                    <div className={scss.childmain}>
                        <div className={scss.left}>
                            <div className={scss.top}>
                                <div className="input-wrapper">
                                    <InputSel
                                        {...inputSelProps}
                                        caption="儲位編號"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childwhposition ?? " ",
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="寬"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childwidth ?? 0,
                                                // onChange: (e) => handleWidthLengthChange(e, "width"),
                                                onKeyDown: (e) => handlechildKeyDown(e, "width")
                                            },
                                        }}
                                    />
                                    <InputSel
                                        {...inputSelProps}
                                        caption="長"
                                        disabled={false}
                                        inputProps={{
                                            props: {
                                                value: childlength ?? 0,
                                                // onChange: (e) => handleWidthLengthChange(e, "length"),
                                                onKeyDown: (e) => handlechildKeyDown(e, "length")
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={scss.right}>
                            <div className={scss.content}>
                                {data11child.map((Data) => (
                                    <table style={{ border: 'solid 1px black' }}>
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
                                                                                    onClick={() => {
                                                                                        setChildWHPosition(childDataItem.length + "-" + childDataItem.width + "-" + childDataItem.childlength + "-" + childDataItem.childwidth);
                                                                                        setChildParentLength(childDataItem.length);
                                                                                        setChildParentWidth(childDataItem.width);
                                                                                        // setChildParentLength(childDataItem.length);
                                                                                        // setChildParentWidth(childDataItem.width);
                                                                                    }}
                                                                                    style={{ backgroundColor: childDataItem.color, height: item.childtraylayoutmodel.length > 1 ? 85 / item.childtraylayoutmodel.length : '89px' }}
                                                                                >
                                                                                    {childDataItem.width}<br />
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
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
    </SubLayer>
  );
}
